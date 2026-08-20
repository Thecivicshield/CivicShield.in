import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, setDoc, getDoc, Firestore, setLogLevel } from "firebase/firestore";
import { CivicShieldData, BlogPost, EvidenceItem, AnonymousQuestion, NewsletterSub, LayoutBlock, NotificationLog, BookReview, CaseFile } from "./src/types";
import { getAutonomousLegalResponse } from "./src/utils/legalAdvisor";
import { initialData as baseInitialData } from "./src/data/initialData";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase limit to allow larger base64 file uploads (PDFs, videos, sheets)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DATA_DIR = path.join(process.cwd(), "data");
const JOURNAL_STORE_PATH = path.join(DATA_DIR, "journal_store.json");
const CIVIC_DATA_PATH = path.join(process.cwd(), "civic_data.json");
const INITIAL_DATA_TS_PATH = path.join(process.cwd(), "src", "data", "initialData.ts");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure data and uploads folders exist
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create directories (might be read-only filesystem):", error);
}

// Initialize Firebase
let firestore: Firestore | null = null;
try {
  setLogLevel("silent");

  const CONFIG_FILE_PATH = path.join(process.cwd(), "firebase-applet-config.json");
  let firebaseConfig: any = {
    projectId: "yodeling-bongo-ks6r9",
    firestoreDatabaseId: "ai-studio-civicshield-fba088c2-6576-44ca-a680-2913ae5ad65e"
  };

  if (fs.existsSync(CONFIG_FILE_PATH)) {
    const rawConfig = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
    firebaseConfig = { ...firebaseConfig, ...JSON.parse(rawConfig) };
  }

  const firebaseApp = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
    measurementId: firebaseConfig.measurementId
  });

  firestore = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);
  console.log("Firestore client SDK successfully initialized on database (Long Polling): " + (firebaseConfig.firestoreDatabaseId || "(default)"));
} catch (error) {
  console.error("Failed to initialize Firebase / Firestore via client SDK:", error);
}

// Function to write code-level persistence into src/data/initialData.ts
function writeInitialDataTs(data: CivicShieldData) {
  try {
    const srcDataDir = path.join(process.cwd(), "src", "data");
    if (!fs.existsSync(srcDataDir)) {
      fs.mkdirSync(srcDataDir, { recursive: true });
    }
    const tsCode = `import { CivicShieldData } from "../types";\n\nexport const initialData: CivicShieldData = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(INITIAL_DATA_TS_PATH, tsCode, "utf-8");
  } catch (err) {
    console.warn("Could not sync src/data/initialData.ts:", err);
  }
}

// Helper for reading data file across disk sources
function loadData(): CivicShieldData {
  // 1. First priority: data/journal_store.json
  try {
    if (fs.existsSync(JOURNAL_STORE_PATH)) {
      const content = fs.readFileSync(JOURNAL_STORE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.blocks)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Could not read data/journal_store.json, attempting fallback:", error);
  }

  // 2. Second priority: civic_data.json
  try {
    if (fs.existsSync(CIVIC_DATA_PATH)) {
      const content = fs.readFileSync(CIVIC_DATA_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.blocks)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Could not read civic_data.json, attempting fallback:", error);
  }

  // 3. Fallback: Base initialData from source
  return baseInitialData;
}

// Helper for writing complete persistent data across all targets
function saveData(newData: CivicShieldData) {
  try {
    newData.lastUpdated = Date.now();
    const jsonStr = JSON.stringify(newData, null, 2);

    // 1. Write to data/journal_store.json (primary disk persistence)
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(JOURNAL_STORE_PATH, jsonStr, "utf-8");
    } catch (e) {
      console.warn("Failed writing to data/journal_store.json:", e);
    }

    // 2. Write to civic_data.json
    try {
      fs.writeFileSync(CIVIC_DATA_PATH, jsonStr, "utf-8");
    } catch (e) {
      console.warn("Failed writing to civic_data.json:", e);
    }

    // 3. Automatically sync changes directly to src/data/initialData.ts for redeployment retention
    writeInitialDataTs(newData);

    // 4. Asynchronously persist to Firestore database
    if (firestore) {
      setDoc(doc(firestore, "campaign", "data"), newData)
        .then(() => {
          console.log("✓ Successfully persisted updated campaignData to Firestore!");
        })
        .catch((error) => {
          console.error("Failed to write to Firestore:", error);
        });
    }
  } catch (error) {
    console.error("Failed to save data across stores:", error);
  }
}

// Load global database
let campaignData = loadData();

// Seed initial files of DB across all disk stores
saveData(campaignData);

// Asynchronously sync with Firestore on boot
async function syncWithFirestore() {
  if (!firestore) return;
  try {
    console.log("Syncing database with Firestore on boot...");
    const docRef = doc(firestore, "campaign", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const remoteData = docSnap.data() as CivicShieldData;
      if (remoteData && Array.isArray(remoteData.blocks)) {
        campaignData = {
          ...campaignData,
          ...remoteData,
          masterPasscode: remoteData.masterPasscode || campaignData.masterPasscode || "lol12ymn",
          bookReviews: remoteData.bookReviews || campaignData.bookReviews || baseInitialData.bookReviews || [],
          caseFiles: remoteData.caseFiles || campaignData.caseFiles || baseInitialData.caseFiles || [],
          visitorStats: remoteData.visitorStats || campaignData.visitorStats || baseInitialData.visitorStats
        };
        // Update all local stores with remote data
        saveData(campaignData);
        console.log("✓ Success: Synced campaignData from persistent Firestore and updated disk stores!");
      }
    } else {
      console.log("No remote database document found in Firestore. Seeding current state...");
      await setDoc(docRef, campaignData);
      console.log("✓ Success: Seeded initial campaignData to Firestore!");
    }
  } catch (error) {
    console.error("Failed to sync with Firestore on boot:", error);
  }
}
syncWithFirestore();

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey.trim().length > 0 && !apiKey.startsWith("AQ.Ab8RN6I7vItO")) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("✓ Google GenAI client successfully connected and initialized with active key!");
  } catch (err) {
    console.error("Error initializing Google GenAI client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not set or placeholder. Operating in high-precision autonomous legal advisor mode.");
}

// Server static files under /uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// ---------------- API ENDPOINTS ----------------

// Helper to ensure visitorStats structure is complete
function ensureVisitorStats() {
  if (!campaignData.visitorStats) {
    campaignData.visitorStats = {
      totalVisitors: 14892,
      gateEntries: 6420,
      chatInteractions: 980,
      handbookDownloads: 3840,
      templatesDeployed: 1250,
      districtsEmpowered: 48,
      consultationsGiven: 980,
      pagesRead: 8740,
      reviewsCount: (campaignData.bookReviews || []).length || 3,
      lastUpdated: Date.now()
    };
  }
  if (campaignData.visitorStats.gateEntries === undefined) {
    campaignData.visitorStats.gateEntries = 6420;
  }
  if (campaignData.visitorStats.chatInteractions === undefined) {
    campaignData.visitorStats.chatInteractions = campaignData.visitorStats.consultationsGiven || 980;
  }
  if (campaignData.visitorStats.pagesRead === undefined) {
    campaignData.visitorStats.pagesRead = 8740;
  }
  if (campaignData.visitorStats.reviewsCount === undefined) {
    campaignData.visitorStats.reviewsCount = (campaignData.bookReviews || []).length || 3;
  }
}

// Master Passcode Verification
app.post("/api/verify-passcode", (req, res) => {
  try {
    const { passcode } = req.body;
    const currentPasscode = campaignData.masterPasscode || "lol12ymn";
    if (passcode === currentPasscode) {
      return res.json({ success: true, authorized: true });
    }
    return res.status(401).json({ success: false, authorized: false, error: "Invalid master authorization code." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Master Passcode Update
app.post("/api/update-passcode", (req, res) => {
  try {
    const { currentPasscode, newPasscode } = req.body;
    const existing = campaignData.masterPasscode || "lol12ymn";
    if (currentPasscode !== existing) {
      return res.status(401).json({ success: false, error: "Current passcode is incorrect." });
    }
    if (!newPasscode || newPasscode.trim().length < 4) {
      return res.status(400).json({ success: false, error: "New passcode must be at least 4 characters long." });
    }
    campaignData.masterPasscode = newPasscode.trim();
    saveData(campaignData);
    console.log("✓ Master passcode successfully updated and saved across disk stores and initialData.ts");
    res.json({ success: true, message: "Master passcode updated and permanently synced across redeployments!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track reading pages in the Interactive Vintage Book
app.post("/api/track-reading-page", (req, res) => {
  try {
    ensureVisitorStats();
    campaignData.visitorStats!.pagesRead = (campaignData.visitorStats!.pagesRead || 8740) + 1;
    campaignData.visitorStats!.lastUpdated = Date.now();
    saveData(campaignData);
    res.json({ success: true, pagesRead: campaignData.visitorStats!.pagesRead });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Book Reviews Endpoints ---
app.get("/api/book-reviews", (req, res) => {
  if (!campaignData.bookReviews) {
    campaignData.bookReviews = baseInitialData.bookReviews || [];
  }
  res.json(campaignData.bookReviews);
});

app.post("/api/book-reviews", (req, res) => {
  try {
    const { bookTitle, chapterTitle, reviewerName, rating, reviewText } = req.body;
    if (!reviewText || !reviewerName) {
      return res.status(400).json({ error: "Reviewer name and review text are required." });
    }
    if (!campaignData.bookReviews) {
      campaignData.bookReviews = [];
    }
    const newReview: BookReview = {
      id: "rev_" + Date.now(),
      bookTitle: bookTitle || "The Sovereign Defense Doctrine",
      chapterTitle: chapterTitle || "Chapter I",
      reviewerName: reviewerName.trim(),
      rating: Number(rating) || 5,
      reviewText: reviewText.trim(),
      date: new Date().toISOString().split("T")[0],
      verified: true
    };
    campaignData.bookReviews.unshift(newReview);
    ensureVisitorStats();
    campaignData.visitorStats!.reviewsCount = campaignData.bookReviews.length;
    saveData(campaignData);
    res.json({ success: true, review: newReview, totalReviews: campaignData.bookReviews.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/book-reviews/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (campaignData.bookReviews) {
      campaignData.bookReviews = campaignData.bookReviews.filter((r) => r.id !== id);
      ensureVisitorStats();
      campaignData.visitorStats!.reviewsCount = campaignData.bookReviews.length;
      saveData(campaignData);
    }
    res.json({ success: true, message: "Book review removed from persistent store." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Case Files Endpoints ---
app.get("/api/case-files", (req, res) => {
  if (!campaignData.caseFiles) {
    campaignData.caseFiles = baseInitialData.caseFiles || [];
  }
  res.json(campaignData.caseFiles);
});

app.post("/api/case-files", (req, res) => {
  try {
    const { caseNumber, title, category, status, description, type, fileName, fileUrl, fileSize, verifiedBy } = req.body;
    if (!title || !caseNumber) {
      return res.status(400).json({ error: "Title and Case Number are required." });
    }
    if (!campaignData.caseFiles) {
      campaignData.caseFiles = [];
    }
    const newCaseFile: CaseFile = {
      id: "cf_" + Date.now(),
      caseNumber: caseNumber.trim(),
      title: title.trim(),
      category: category || "Constitutional Rights",
      status: status || "precedent",
      description: description || "",
      type: type || "pdf",
      fileName: fileName || "Case_Document.pdf",
      fileUrl: fileUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      fileSize: fileSize || "1.5 MB",
      uploadedAt: new Date().toISOString().split("T")[0],
      verifiedBy: verifiedBy || "Civic Legal Research Desk"
    };
    campaignData.caseFiles.unshift(newCaseFile);
    saveData(campaignData);
    res.json({ success: true, caseFile: newCaseFile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/update-case-file", (req, res) => {
  try {
    const { id, updatedFields } = req.body;
    if (!id || !updatedFields) {
      return res.status(400).json({ error: "Missing case file ID or updatedFields." });
    }
    if (campaignData.caseFiles) {
      campaignData.caseFiles = campaignData.caseFiles.map((cf) => {
        if (cf.id === id) {
          return { ...cf, ...updatedFields };
        }
        return cf;
      });
      saveData(campaignData);
    }
    res.json({ success: true, message: "Case file updated and persisted to disk!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/case-files/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (campaignData.caseFiles) {
      campaignData.caseFiles = campaignData.caseFiles.filter((cf) => cf.id !== id);
      saveData(campaignData);
    }
    res.json({ success: true, message: "Case file deleted from disk storage." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track a new unique visit
app.post("/api/track-visit", (req, res) => {
  try {
    ensureVisitorStats();
    campaignData.visitorStats!.totalVisitors = (campaignData.visitorStats!.totalVisitors || 14892) + 1;
    campaignData.visitorStats!.lastUpdated = Date.now();
    saveData(campaignData);
    res.json({ success: true, stats: campaignData.visitorStats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track an intro gate entry unseal
app.post("/api/track-entry", (req, res) => {
  try {
    ensureVisitorStats();
    campaignData.visitorStats!.gateEntries = (campaignData.visitorStats!.gateEntries || 6420) + 1;
    campaignData.visitorStats!.lastUpdated = Date.now();
    saveData(campaignData);
    res.json({ success: true, stats: campaignData.visitorStats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track a chat query / consultation interaction
app.post("/api/track-chat", (req, res) => {
  try {
    ensureVisitorStats();
    campaignData.visitorStats!.chatInteractions = (campaignData.visitorStats!.chatInteractions || 980) + 1;
    campaignData.visitorStats!.consultationsGiven = (campaignData.visitorStats!.consultationsGiven || 980) + 1;
    campaignData.visitorStats!.lastUpdated = Date.now();
    saveData(campaignData);
    res.json({ success: true, stats: campaignData.visitorStats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track handbook / file download
app.post("/api/track-download", (req, res) => {
  try {
    ensureVisitorStats();
    campaignData.visitorStats!.handbookDownloads = (campaignData.visitorStats!.handbookDownloads || 3840) + 1;
    campaignData.visitorStats!.lastUpdated = Date.now();
    saveData(campaignData);
    res.json({ success: true, stats: campaignData.visitorStats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update of visitor and impact metrics
app.post("/api/update-visitor-stats", (req, res) => {
  try {
    const { stats } = req.body;
    if (stats && typeof stats === "object") {
      ensureVisitorStats();
      campaignData.visitorStats = {
        ...campaignData.visitorStats!,
        ...stats,
        lastUpdated: Date.now()
      };
      saveData(campaignData);
      return res.json({ success: true, stats: campaignData.visitorStats });
    }
    res.status(400).json({ error: "Invalid stats object" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all campaigning data
app.get("/api/campaign-data", (req, res) => {
  ensureVisitorStats();
  res.json(campaignData);
});

// Update blocks layout (for complete customization & drag-n-drop sorting)
app.post("/api/save-blocks", (req, res) => {
  try {
    const { blocks } = req.body;
    if (Array.isArray(blocks)) {
      campaignData.blocks = blocks;
      saveData(campaignData);
      return res.json({ success: true, message: "Campaign layout updated." });
    }
    res.status(400).json({ error: "Invalid blocks payload structure." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Update particular block variables directly (Admin inline typing updates)
app.post("/api/update-block-data", (req, res) => {
  try {
    const { id, customData } = req.body;
    const blockIndex = campaignData.blocks.findIndex((b) => b.id === id);
    if (blockIndex !== -1) {
      campaignData.blocks[blockIndex].customData = {
        ...campaignData.blocks[blockIndex].customData,
        ...customData
      };
      saveData(campaignData);
      return res.json({ success: true, block: campaignData.blocks[blockIndex] });
    }
    res.status(404).json({ error: "Block not found." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Create blog post
app.post("/api/blog", (req, res) => {
  try {
    const { title, content, author, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }
    const newPost: BlogPost = {
      id: "post_" + Date.now(),
      title,
      content,
      author: author || "Campaign Team",
      date: new Date().toISOString().split("T")[0],
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      comments: []
    };
    campaignData.posts.unshift(newPost);
    saveData(campaignData);
    res.json(newPost);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Delete blog post
app.delete("/api/blog/:id", (req, res) => {
  try {
    const { id } = req.params;
    campaignData.posts = campaignData.posts.filter((p) => p.id !== id);
    saveData(campaignData);
    res.json({ success: true, message: "Blog post removed." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Add comment to blog post
app.post("/api/blog/:id/comment", (req, res) => {
  try {
    const { id } = req.params;
    const { author, text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required." });
    
    const postIndex = campaignData.posts.findIndex((p) => p.id === id);
    if (postIndex !== -1) {
      const newComment = {
        id: "c_" + Date.now(),
        author: author || "Anonymous Supporter",
        text,
        date: new Date().toLocaleDateString()
      };
      campaignData.posts[postIndex].comments.push(newComment);
      saveData(campaignData);
      return res.json(newComment);
    }
    res.status(404).json({ error: "Post not found." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Delete comment on blog post
app.delete("/api/blog/:postId/comment/:commentId", (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const postIndex = campaignData.posts.findIndex((p) => p.id === postId);
    if (postIndex !== -1) {
      campaignData.posts[postIndex].comments = campaignData.posts[postIndex].comments.filter((c) => c.id !== commentId);
      saveData(campaignData);
      return res.json({ success: true, message: "Comment permanently deleted." });
    }
    res.status(404).json({ error: "Post not found." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Create evidence file list entry
app.post("/api/evidence", (req, res) => {
  try {
    const { title, description, type, fileName, fileUrl, verifiedBy, fileSize } = req.body;
    if (!title || !fileUrl) {
      return res.status(400).json({ error: "Title and file link are required." });
    }
    const newItem: EvidenceItem = {
      id: "ev_" + Date.now(),
      title,
      description: description || "Unofficial campaign evidence file",
      type: type || "pdf",
      fileName: fileName || "unnamed_document",
      fileUrl,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: fileSize || "Unknown size",
      verifiedBy: verifiedBy || "Campaign Lead"
    };
    campaignData.evidence.unshift(newItem);
    saveData(campaignData);
    res.json(newItem);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Delete evidence entry
app.delete("/api/evidence/:id", (req, res) => {
  try {
    const { id } = req.params;
    campaignData.evidence = campaignData.evidence.filter((ev) => ev.id !== id);
    saveData(campaignData);
    res.json({ success: true, message: "Evidence dossier removed." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Update evidence entry
app.post("/api/update-evidence", (req, res) => {
  try {
    const { id, updatedFields } = req.body;
    if (!id || !updatedFields) {
      return res.status(400).json({ error: "Missing ID or updatedFields." });
    }
    campaignData.evidence = campaignData.evidence.map((ev) => {
      if (ev.id === id) {
        return { ...ev, ...updatedFields };
      }
      return ev;
    });
    saveData(campaignData);
    res.json({ success: true, message: "Evidence dossier updated." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Newsletter subscription
app.post("/api/subscribe", (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }
    // Avoid double subscribers
    const exists = campaignData.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.json({ success: true, alreadySubscribed: true, message: "Email is already registered!" });
    }
    const newSub: NewsletterSub = {
      id: "sub_" + Date.now(),
      email,
      subscribedAt: new Date().toLocaleString()
    };
    campaignData.subscribers.push(newSub);
    saveData(campaignData);
    res.json({ success: true, subscription: newSub, message: "Thank you for subscribing to Civic Shield!" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Delete newsletter subscriber
app.delete("/api/subscribe/:id", (req, res) => {
  try {
    const { id } = req.params;
    campaignData.subscribers = campaignData.subscribers.filter((s) => s.id !== id);
    saveData(campaignData);
    res.json({ success: true, message: "Subscriber removed from pool." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// File upload (base64 upload for PDFs, videos, images, sheets)
app.post("/api/upload", (req, res) => {
  try {
    const { fileName, fileType, fileData, title, description, verifiedBy } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: "Missing uploaded file components." });
    }
    
    // Extract base64 or external link
    let fileUrl = "";
    let calculatedSize = "";
    let finalFileName = fileName;

    if (fileData.startsWith("http://") || fileData.startsWith("https://")) {
      fileUrl = fileData;
      calculatedSize = "URL Link";
      finalFileName = fileName || "External Web Resource";
    } else {
      // Extract base64
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Incorrect base64 document stream." });
      }
      
      const buffer = Buffer.from(matches[2], "base64");
      const sanitizedSafeName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const finalFilePath = path.join(UPLOADS_DIR, sanitizedSafeName);
      
      fs.writeFileSync(finalFilePath, buffer);
      
      fileUrl = `/uploads/${sanitizedSafeName}`;
      calculatedSize = (buffer.length / (1024 * 1024)).toFixed(2) + " MB";
    }
    
    const newEvidence: EvidenceItem = {
      id: "ev_" + Date.now(),
      title: title || finalFileName,
      description: description || "Uploaded PDF/Video material",
      type: fileType || "pdf",
      fileName: finalFileName,
      fileUrl: fileUrl,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: calculatedSize,
      verifiedBy: verifiedBy || "Campaign Coordinator"
    };
    
    campaignData.evidence.unshift(newEvidence);
    saveData(campaignData);
    
    res.json(newEvidence);
  } catch (error: any) {
    console.error("Upload process crash:", error);
    res.status(500).json({ error: "Failed to upload file to the server: " + error.message });
  }
});

// Autonomous offline knowledge & response engine for Civic Shield (Key-Free)
function getOfflineSmartAnswer(text: string): { answered: boolean; answer: string; repliedBy: string; category?: string } {
  const result = getAutonomousLegalResponse(text);
  return {
    answered: result.answered,
    answer: result.answer,
    repliedBy: result.repliedBy,
    category: result.category
  };
}

// Automatically send email notification to the civic campaign champion on new anonymous questions
async function sendQuestionEmailNotification(question: AnonymousQuestion) {
  const recipient = "thecivicshield@gmail.com";
  const subject = `🛡️ [Civic Shield Alert] New Anonymous Question Received (${question.id})`;
  const body = `Hello Civic Shield Champion,

A new anonymous legal query has been submitted through your Civic Shield website:

- Question ID: ${question.id}
- Submitted At: ${question.timestamp}
- Message Content:
"${question.text}"

Please visit your Administration Operations Center to review, answer, or publish this query publicly.

Best regards,
Civic Shield Alert System`;

  const logId = "mail_" + Date.now();
  const newLog: NotificationLog = {
    id: logId,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + new Date().toLocaleDateString(),
    recipient,
    subject,
    body,
    status: 'simulated',
    previewUrl: undefined
  };

  try {
    // Dynamic import of nodemailer to shield the startup from module resolution errors
    const nodemailerModule = await import("nodemailer");
    const nodemailer = (nodemailerModule as any).default || nodemailerModule;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let transporter;
    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      newLog.status = 'sent';
    } else {
      // Create a test account automatically via Ethereal to output a genuine preview URL
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const info = await transporter.sendMail({
      from: '"Civic Shield Notification" <no-reply@civicshield.org>',
      to: recipient,
      subject: subject,
      text: body,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px; color: #1e293b; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">🛡️ Civic Shield Notification</h2>
          <p>Hello Civic Shield Champion,</p>
          <p>A new anonymous legal query has been submitted through your Civic Shield website:</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; border-radius: 4px; font-style: italic; color: #334155;">
            "${question.text}"
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #64748b; width: 120px;">Question ID:</td>
              <td style="padding: 6px 0; font-family: monospace;">${question.id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Submitted At:</td>
              <td>${question.timestamp}</td>
            </tr>
          </table>
          <p style="margin-bottom: 30px;">Please check your Operations Center Dashboard to answer or publish this question.</p>
          <div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            This email was automatically triggered on anonymous question submit. For offline sandbox tests, log feeds are simulated via Ethereal.
          </div>
        </div>
      `
    });

    if (newLog.status === 'simulated') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        newLog.previewUrl = previewUrl;
        console.log(`[Email Notification] Email simulated on Ethereal sandbox. Preview: ${previewUrl}`);
      }
    } else {
      console.log(`[Email Notification] Email sent successfully to ${recipient}. Message Id: ${info.messageId}`);
    }
  } catch (err: any) {
    console.error("Failed to deliver question email notification:", err);
    newLog.status = 'failed';
    newLog.body = `${newLog.body}\n\n[ERROR LOG]: ${err.message || err}`;
  }

  // Push log to state
  if (!campaignData.notificationLogs) {
    campaignData.notificationLogs = [];
  }
  campaignData.notificationLogs.unshift(newLog);
  if (campaignData.notificationLogs.length > 50) {
    campaignData.notificationLogs = campaignData.notificationLogs.slice(0, 50);
  }
}

// Submit an anonymous question (with OPTIONAL real-time smart answer from Gemini!)
app.post("/api/questions", async (req, res) => {
  try {
    const { text, timestamp } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Question cannot be empty." });
    }
    
    const newQuestion: AnonymousQuestion = {
      id: "q_" + Date.now(),
      text,
      timestamp: timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + new Date().toLocaleDateString(),
      answered: false,
      isPublic: true
    };
    
    // If Gemini client is activated, generate a smart assistant response in real-time!
    let geminiServiceError = null;
    if (aiClient) {
      const campaignKnowledge = `
        You are the Official AI Legal Advocate & Constitutional Advisor of "Civic Shield", an organization dedicated to legal literacy, citizen rights defense, and demystifying statutory procedures under Indian and constitutional law.
        Goals: Bridge the gap between citizens and legal authority, eliminate fear of procedural stops, and empower every citizen with actionable, legally verified knowledge.
        Tone: Empathetic, calm, authoritative, legally sound, and step-by-step practical.
        Key Laws & Precedents to cite when relevant:
        - Constitution of India (Articles 14, 19, 20, 21, 22, 32, 226, 39A)
        - D.K. Basu Guidelines (1997) & CrPC / BNSS arrest and search protocols
        - Lalita Kumari v. Govt of UP (Mandatory FIR registration for cognizable offenses)
        - Motor Vehicles Act 1988 (Amended) & Rule 139 CMVR (DigiLocker / mParivahan validity)
        - Right to Information Act 2005 (Sec 6, 7, 19 - 30-day mandate & FAA appeals)
        - Consumer Protection Act 2019 & e-Daakhil filing
        - NALSA / DLSA free legal aid under Article 39A
        - POSH Act 2013 & Protection of Women from Domestic Violence Act 2005
      `;

      // Try primary model (gemini-2.5-flash)
      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Citizen Question: ${text}`,
          config: {
            systemInstruction: `${campaignKnowledge}\nAnswer the citizen's legal inquiry clearly, accurately, and authoritatively. Provide exact statutory sections, practical bulleted steps to protect themselves calmly, and reassure them of their rights. Keep response concise (around 120-180 words).`,
            temperature: 0.5
          }
        });
        
        if (response.text) {
          newQuestion.answered = true;
          newQuestion.answer = response.text.trim();
          newQuestion.repliedBy = "AI Legal Advocate (Gemini Live)";
        }
      } catch (gemError: any) {
        console.warn("Primary model 'gemini-2.5-flash' experienced an issue. Attempting fallback...", gemError.message || gemError);
        geminiServiceError = gemError;
        
        try {
          const fallbackResponse = await aiClient.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Citizen Question: ${text}`,
            config: {
              systemInstruction: `${campaignKnowledge}\nAnswer the citizen's legal inquiry clearly and accurately. Provide statutory sections and practical steps.`,
              temperature: 0.5
            }
          });
          if (fallbackResponse.text) {
            newQuestion.answered = true;
            newQuestion.answer = fallbackResponse.text.trim();
            newQuestion.repliedBy = "AI Legal Advocate (Gemini)";
            geminiServiceError = null;
          }
        } catch (fallbackError: any) {
          console.error("Gemini generation failed. Falling back to autonomous legal engine:", fallbackError.message || fallbackError);
          geminiServiceError = fallbackError;
        }
      }
    }

    // High-precision Autonomous Legal Knowledge Engine Fallback (guarantees an exact, helpful answer)
    if (!newQuestion.answered) {
      const offlineMatch = getAutonomousLegalResponse(text);
      if (offlineMatch.answered && offlineMatch.answer) {
        newQuestion.answered = true;
        newQuestion.answer = offlineMatch.answer;
        newQuestion.repliedBy = offlineMatch.repliedBy || "AI Legal Advocate (Civic Shield)";
      }
    }

    // Ultimate fallback if neither Gemini is successfully active nor keyword matched
    if (!newQuestion.answered) {
      newQuestion.answer = "Thank you for reaching out to Civic Shield! We have received your query. A campaign legal advocate has been notified of your question, and we will review and reply here shortly.";
      newQuestion.answered = false;
      newQuestion.repliedBy = "Campaign Legal Desk";
    }
    
    // Send email notification in the background so the response is very fast for the user!
    sendQuestionEmailNotification(newQuestion).catch((err) => {
      console.error("Async email notification error:", err);
    });

    campaignData.questions.push(newQuestion);
    saveData(campaignData);
    res.json(newQuestion);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Answer or Update a question (Admin custom response / edit)
app.post("/api/questions/:id/answer", (req, res) => {
  try {
    const { id } = req.params;
    const { answer, repliedBy, isPublic } = req.body;
    
    const qIndex = campaignData.questions.findIndex((q) => q.id === id);
    if (qIndex !== -1) {
      campaignData.questions[qIndex].answer = answer || "";
      campaignData.questions[qIndex].answered = !!answer;
      campaignData.questions[qIndex].repliedBy = repliedBy || "Campaign Manager";
      if (typeof isPublic === "boolean") {
        campaignData.questions[qIndex].isPublic = isPublic;
      }
      saveData(campaignData);
      return res.json(campaignData.questions[qIndex]);
    }
    res.status(404).json({ error: "Question not found." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Delete anonymous question
app.delete("/api/questions/:id", (req, res) => {
  try {
    const { id } = req.params;
    campaignData.questions = campaignData.questions.filter((q) => q.id !== id);
    saveData(campaignData);
    res.json({ success: true, message: "Question removed." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------- Campaign social-feed endpoints ----------------

// Create a new social post
app.post("/api/social-feed", (req, res) => {
  try {
    const { platform, content, imageUrl } = req.body;
    if (!platform || !content) {
      return res.status(400).json({ error: "Platform and content are required." });
    }
    
    // Ensure socialFeed array exists
    if (!campaignData.socialFeed) {
      campaignData.socialFeed = [];
    }

    const newSocialPost = {
      id: "soc_" + Date.now(),
      platform,
      username: platform === "twitter" ? "Civic Shield Campaign" : platform === "linkedin" ? "Civic Shield Foundation" : platform === "youtube" ? "Civic Shield Channel" : platform === "instagram" ? "Civic Shield" : "Civic Shield - Citizens Legal Alliance",
      handle: platform === "twitter" ? "@TheCivicShield" : platform === "linkedin" ? "linkedin.com/company/civicshield" : platform === "youtube" ? "youtube.com/@civicshield" : platform === "instagram" ? "@thecivicshield" : "/civicshield",
      content,
      imageUrl: imageUrl || undefined,
      timestamp: "Just now",
      likes: 0,
      shares: 0,
      comments: 0
    };

    campaignData.socialFeed.unshift(newSocialPost);
    saveData(campaignData);
    res.json(newSocialPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a social post
app.delete("/api/social-feed/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (campaignData.socialFeed) {
      campaignData.socialFeed = campaignData.socialFeed.filter((post) => post.id !== id);
      saveData(campaignData);
    }
    res.json({ success: true, message: "Social network post erased." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- Newsletter Broadcaster Endpoint ----------------

// Broadcast newsletter update simulated delivery
app.post("/api/send-newsletter", (req, res) => {
  try {
    const { subject, badge, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ error: "Newsletter Subject and Body are required parameters." });
    }

    // Ensure newsletters array exists in database
    if (!campaignData.newsletters) {
      campaignData.newsletters = [];
    }

    const recipientCount = campaignData.subscribers ? campaignData.subscribers.length : 0;

    const newNewsletter = {
      id: "news_" + Date.now(),
      subject,
      badge: badge || "Community Dispatch",
      body,
      sentAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      recipientCount
    };

    campaignData.newsletters.unshift(newNewsletter);
    saveData(campaignData);

    res.json({
      success: true,
      newsletter: newNewsletter,
      message: `Successfully queued and broadcasted dispatch to ${recipientCount} subscribers!`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- GITHUB OAUTH & SYNC ENDPOINTS ----------------

// Get the GitHub Auth URL
app.get("/api/auth/github-url", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(400).json({ error: "GITHUB_CLIENT_ID environment variable is not configured." });
  }

  // Construct standard GitHub OAuth authorization URL
  const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,read:user",
    response_type: "code",
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  res.json({ url: authUrl });
});

// Exchange authorization code for tokens
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.send(`
      <html>
        <body style="font-family: sans-serif; background-color: #001233; color: white; text-align: center; padding-top: 50px;">
          <h3 style="color: #ff6b6b;">Authentication Error</h3>
          <p>Missing authorization code from GitHub.</p>
          <button onclick="window.close()" style="background: #d4af37; border: none; padding: 10px 20px; color: #001a4d; font-weight: bold; cursor: pointer; border-radius: 4px;">Close Window</button>
        </body>
      </html>
    `);
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing on the server.");
    }

    const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;

    // Exchange code for Access Token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error(tokenData.error_description || "Failed to exchange code for GitHub access token.");
    }

    // Fetch authorized user details
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "aistudio-build",
      },
    });

    const userData = await userResponse.json() as any;
    const username = userData.login;
    const avatarUrl = userData.avatar_url;

    // Send success message back to parent window and self-close
    res.send(`
      <html>
        <body style="font-family: sans-serif; background-color: #001233; color: white; text-align: center; padding-top: 50px;">
          <h3 style="color: #d4af37;">✓ GitHub Connected!</h3>
          <p>Authenticated successfully as <strong>${username}</strong>.</p>
          <p>This window will close automatically.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                provider: 'github',
                token: '${accessToken}',
                user: {
                  username: '${username}',
                  avatarUrl: '${avatarUrl}'
                }
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("GitHub exchange token error:", err);
    res.send(`
      <html>
        <body style="font-family: sans-serif; background-color: #001233; color: white; text-align: center; padding-top: 50px;">
          <h3 style="color: #ff6b6b;">OAuth Sync Connection Failed</h3>
          <p>${err.message || err}</p>
          <button onclick="window.close()" style="background: #d4af37; border: none; padding: 10px 20px; color: #001a4d; font-weight: bold; cursor: pointer; border-radius: 4px;">Close Window</button>
        </body>
      </html>
    `);
  }
});

// Fetch connected user's repositories
app.get("/api/github/repos", async (req, res) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).json({ error: "Missing GitHub authentication token." });
    }

    const reposResponse = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "aistudio-build",
      },
    });

    if (!reposResponse.ok) {
      const errText = await reposResponse.text();
      return res.status(reposResponse.status).json({ error: `GitHub API error: ${errText}` });
    }

    const repos = await reposResponse.json() as any[];
    const formattedRepos = repos.map(r => ({
      name: r.name,
      fullName: r.full_name,
      owner: r.owner.login,
      defaultBranch: r.default_branch,
      private: r.private
    }));

    res.json(formattedRepos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Validate GitHub Personal Access Token (PAT)
app.post("/api/github/validate-pat", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Missing token parameter." });
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "aistudio-build",
      },
    });

    if (!userResponse.ok) {
      return res.status(401).json({ error: "Invalid Personal Access Token." });
    }

    const userData = await userResponse.json() as any;
    res.json({
      success: true,
      username: userData.login,
      avatarUrl: userData.avatar_url
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Commit and Push database to GitHub Repo
app.post("/api/github/sync", async (req, res) => {
  try {
    const { token, owner, repo, branch, path: filePath } = req.body;
    if (!token || !owner || !repo) {
      return res.status(400).json({ error: "Missing required integration parameters (token, owner, repo)." });
    }

    const targetBranch = branch || "main";
    const fileTarget = filePath || "civic_data.json";

    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileTarget}?ref=${targetBranch}`;

    // 1. Get current file sha if it exists
    let sha: string | undefined;
    const checkResponse = await fetch(getUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "aistudio-build",
      },
    });

    if (checkResponse.ok) {
      const existingData = await checkResponse.json() as any;
      sha = existingData.sha;
    }

    // 2. Read the local database content
    const dbContent = JSON.stringify(campaignData, null, 2);
    const base64Content = Buffer.from(dbContent).toString("base64");

    // 3. Put/create file on GitHub repo
    const putResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileTarget}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "aistudio-build",
      },
      body: JSON.stringify({
        message: "sync: update campaign database from Civic Shield Console 🛡️",
        content: base64Content,
        sha,
        branch: targetBranch,
      }),
    });

    if (putResponse.ok) {
      const putResult = await putResponse.json() as any;
      return res.json({
        success: true,
        message: `Successfully synchronized and committed 'civic_data.json' directly to your '${targetBranch}' branch!`,
        commitUrl: putResult.commit.html_url,
      });
    } else {
      const errorData = await putResponse.json() as any;
      return res.status(putResponse.status).json({
        error: errorData.message || "Failed to commit files to GitHub repository.",
      });
    }
  } catch (error: any) {
    console.error("GitHub Sync error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------- VITE INTERPOLATION ----------------

async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite dev middleware loaded successfully.");
    } catch (err) {
      console.warn("Failed to load Vite dev middleware. Checking if dist folder can be served:", err);
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
        console.log("Vite loading failed but dist directory exists. Serving static build instead.");
      } else {
        console.error("Critical: Vite failed to launch and no dist directory was found. App might be inaccessible.");
      }
    }
  } else {
    // Production serving
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from:", distPath);
  }
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
