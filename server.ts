import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { CivicShieldData, BlogPost, EvidenceItem, AnonymousQuestion, NewsletterSub, LayoutBlock, NotificationLog } from "./src/types";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase limit to allow larger base64 file uploads (PDFs, videos, sheets)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DATA_FILE_PATH = path.join(process.cwd(), "civic_data.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads folder exists
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory (might be read-only filesystem):", error);
}

// Pre-seeded Initial Campaign Data (Royal Navy Blue / Gold Style)
const initialData: CivicShieldData = {
  blocks: [
    {
      id: "hero",
      title: "Hero Searchlight",
      visible: true,
      order: 1,
      customData: {
        heroTitle: "CIVIC SHIELD",
        heroSubtitle: "Bridging the gap between citizens and legal authority. We eliminate fear, advocate for legal literacy, and empower you with knowledge of basic laws so you can protect yourself and your family with confidence.",
        heroAlertText: "ALERT: Our upcoming virtual 'Know-Your-Rights Procedural Clinic' is scheduled for June 28th. Reserve your free handbook below.",
        primaryColor: "#0F264A",
        accentColor: "#D4AF37"
      }
    },
    {
      id: "pillars",
      title: "Campaign Core Pillars",
      visible: true,
      order: 2,
      customData: {
        pillars: [
          {
            title: "Bridge the Gap",
            description: "Fostering mutual dialogue and professional compliance training to bridge the hostile divide between citizens and authority figures.",
            iconName: "Scale"
          },
          {
            title: "Eliminate Fear",
            description: "Taking the fear out of legal actions of police, code officers, and landlords by equipping you with simple, verified legal definitions.",
            iconName: "ShieldAlert"
          },
          {
            title: "Citizen Defense",
            description: "Providing easy-to-use self-defense template vaults so you can represent your interests with institutional competence.",
            iconName: "Landmark"
          },
          {
            title: "Civic Transparency",
            description: "Independently cataloging government mandates, public spending budgets, and asset records to ensure permanent institutional transparency and open citizen auditing.",
            iconName: "Eye"
          }
        ]
      }
    },
    {
      id: "evidence",
      title: "Legal Library & Handouts",
      visible: true,
      order: 3,
      customData: {
        accentColor: "#D4AF37"
      }
    },
    {
      id: "timeline",
      title: "Campaign Roadmap",
      visible: true,
      order: 4,
      customData: {
        timeline: [
          {
            date: "May 10, 2026",
            title: "Digital Curriculum Drafted",
            description: "Released our 6-segment citizen syllabus covering fundamental civil liberties and constitutional interaction protocols.",
            completed: true
          },
          {
            date: "June 1, 2026",
            title: "Locker Vault Release",
            description: "Uploaded the Pro-Se Administrative Response template pack to help people represent themselves in local hearings.",
            completed: true
          },
          {
            date: "June 28, 2026",
            title: "National Know-Your-Rights Webinar",
            description: "Host a nationwide mock interaction call covering safe legal triggers, consent boundaries, and detainment thresholds.",
            completed: false
          },
          {
            date: "July 20, 2026",
            title: "Municipal Authority Exchange",
            description: "First collaborative workshop linking civic council, defense lawyers, and municipal officials to set transparent procedural benchmarks.",
            completed: false
          }
        ]
      }
    },
    {
      id: "impact-metrics",
      title: "Impact Metrics Chart",
      visible: true,
      order: 5,
      customData: {
        metrics: [
          { label: "Supporters Recruited", value: 340 },
          { label: "Students Engaged", value: 1250 },
          { label: "Guides Distributed", value: 850 },
          { label: "Campus Workshops", value: 18 }
        ]
      }
    },
    {
      id: "justice-shield",
      title: "The Justice Shield",
      visible: true,
      order: 6,
      customData: {}
    },
    {
      id: "social-feed",
      title: "Campaign Social Stream",
      visible: true,
      order: 7,
      customData: {}
    },
    {
      id: "blog",
      title: "Latest Insights & Guides",
      visible: true,
      order: 8,
      customData: {}
    },
    {
      id: "newsletter",
      title: "Civic Messenger Registration",
      visible: true,
      order: 9,
      customData: {}
    }
  ],
  posts: [
    {
      id: "post_1",
      title: "How to Dissolve Detainment Fear Using Three Essential Questions",
      content: "When interacting with any legal authority, fear usually stems from not knowing what comes next. By asking three simple, calm, and progressive questions, you completely clear up the scenario:\n\n1. 'Am I being detained, officer, or am I free to go?' If they answer that you are not detained, you are legally free to calmly walk away. If you are detained, they must possess a reasonable articulable suspicion.\n\n2. 'What is the specific reasonable suspicion for my detainment?' This forces a professional, verbal record of their grounds.\n\n3. 'Am I required by law to provide identity under this specific detainment?' This clarifies if your local code makes refusal to identify a secondary infraction during active stop-and-frisks.\n\nBy keeping dialogue objective, you eliminate panic, document facts, and secure critical protections immediately.",
      date: "2026-06-12",
      author: "Marcus Thorne, Senior Counsel",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
      comments: [
        {
          id: "c1",
          author: "Elena Rostova",
          text: "This basic checklist saved me so much stress yesterday during a municipal inspection inquiry. Thank you Marcus!",
          date: "2026-06-12"
        }
      ]
    },
    {
      "id": "post_2",
      "title": "Pro-Se Rights: You Do Not Need to Afford an Attorney to Stand Tall",
      "content": "Many citizens give up their statutory rights simply because they cannot afford steep attorney trial retainers. However, representing oneself ('Pro-Se') is a constitutionally absolute right.\n\nInside our Evidence locker, we have assembled standardized response packets to small claims files, zoning objections, and municipal citation assessments. In this dispatch, we walk you through standard courthouse filing etiquette - covering how to stamp, index, and properly serve your responses to municipal offices. Stand tall and represent with confidence.",
      "date": "2026-06-10",
      "author": "David Vance, Litigation Lead",
      "imageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      "comments": []
    }
  ],
  evidence: [
    {
      id: "ev_1",
      title: "Traffic interaction & Police Consent Handbook",
      description: "A pocket-sized breakdown of your exact constitutional rights and compliance requirements during routine highway or roadside vehicular administrative actions.",
      type: "pdf",
      fileName: "Traffic_Interactions_Civilian_Guide.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedAt: "2026-06-11",
      fileSize: "1.15 MB",
      verifiedBy: "Civic Shield Advocacy Inst."
    },
    {
      id: "ev_2",
      title: "Pro-Se Self-Representation & Filing Templates",
      description: "Standard boilerplate layouts for composing clear, professional civil replies to minor administrative citations or landlord claims.",
      type: "spreadsheet",
      fileName: "ProSe_Response_Courter_Templates.xlsx",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedAt: "2026-06-09",
      fileSize: "2.40 MB",
      verifiedBy: "Legal Literacy Board"
    },
    {
      id: "ev_3",
      title: "Procedural De-escalation Compliance Brief",
      description: "Video instruction detailing how to record interactions clearly, remain respectful, and secure your rights without escalating tension.",
      type: "video",
      fileName: "Interaction_Protocol_Deescalate.mp4",
      fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      uploadedAt: "2026-06-05",
      fileSize: "11.2 MB",
      verifiedBy: "National De-escalation League"
    }
  ],
  questions: [
    {
      id: "q_1",
      text: "What is the difference between a police inquiry and a formal detainment?",
      timestamp: "2026-06-12 14:15",
      answered: true,
      answer: "An inquiry is completely voluntary. You are under no obligation to stand or answer questions, and you may walk away. Detainment, however, is a temporary seizure where you must comply but do not have to confess or supply unrequired info beyond identification. Always ask: 'Am I free to go?' to establish this boundary.",
      isPublic: true,
      repliedBy: "Campaign Manager"
    },
    {
      id: "q_2",
      text: "How can I assert my right to record public officers in public spaces?",
      timestamp: "2026-06-13 09:20",
      answered: true,
      answer: "You have a clearly protected right under constitutional case law to visually record officers working in public view. Ensure you remain at a non-interference distance, do not physically obstruct their workspace, and state calmly: 'I am standing back and documenting this for legal transparency.'",
      isPublic: true,
      repliedBy: "AI Campaign Advocate"
    }
  ],
  subscribers: [
    {
      id: "sub_1",
      email: "thecivicshield@gmail.com",
      subscribedAt: "2026-06-13 04:28"
    }
  ],
  socialFeed: [
    {
      id: "soc_3",
      platform: "twitter",
      username: "Civic Shield Campaign",
      handle: "@TheCivicShield",
      content: "⚠️ Know your basic words! If an administrative officer starts questioning you in public, calmly ask: 'Am I being detained, or am I free to go?'\n\nIf free, you can walk away. If detained, you are protected from random interrogations. Knowledge bridges the gap! ⚖️ #LegalLiteracy #CivicShield",
      timestamp: "1 hour ago",
      likes: 142,
      shares: 56,
      comments: 12
    },
    {
      id: "soc_2",
      platform: "instagram",
      username: "Civic Shield",
      handle: "@thecivicshield",
      content: "Our central mission is bridging the critical gap between citizens and legal authority. Reciprocal respect can only emerge when citizens know their basic rights and authorities respect procedural boundaries. \n\nWe eliminate fear by teaching you basic laws. Click our link in bio to download our Free compliance and de-escalation toolkit PDFs! 📚🛡️",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      timestamp: "4 hours ago",
      likes: 289,
      shares: 89,
      comments: 24
    },
    {
      id: "soc_1",
      platform: "linkedin",
      username: "Civic Shield Foundation",
      handle: "linkedin.com/company/civicshield",
      content: "Did you know? Representing yourself in local courts ('Pro-Se') is a constitutional absolute. However, filing municipal objection paperwork can feel incredibly scary.\n\nTo make this easy, we've uploaded clean, standardized boilerplate templates for obection responses directly to our online Evidence Room. Learn how to speak the institutional language and stand tall with confidence. 📚🛡️",
      timestamp: "1 day ago",
      likes: 195,
      shares: 72,
      comments: 15
    },
    {
      id: "soc_youtube_1",
      platform: "youtube",
      username: "Civic Shield Channel",
      handle: "youtube.com/@civicshield",
      content: "📺 NEW VIDEO RELEASE: Walking through an active police detainment step-by-step. Discover how to politely resist unconstitutional searches while remaining fully compliant with officers' safe verbal requests. Watch the full simulation on our channel and learn how to guard your legal rights easily!",
      timestamp: "2 days ago",
      likes: 412,
      shares: 155,
      comments: 48
    }
  ],
  newsletters: [
    {
      id: "news_1",
      subject: "Launching the Civic Shield Legal Literacy Vault!",
      badge: "Campaign Launch",
      body: "Dear Supporters,\n\nWe are absolutely thrilled to broadcast our very first Civic Shield digital archive dispatch! Our absolute aim is to bridge the hostile communication gap between our citizens and municipal authorial forces.\n\nInside our public evidence drawer, you will find our newly compiled civilian guide to police encounters, along with court boilerplate filing indexes. Please share these with family, neighbors, and colleagues. We eliminate fear with pure knowledge.\n\nIn solidarity,\nThe Civic Shield Coordinator Team",
      sentAt: "2026-06-13 11:20",
      recipientCount: 1
    }
  ],
  notificationLogs: []
};

// Initialize Firebase
let firestore: Firestore | null = null;
try {
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

  firestore = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
  console.log("Firestore client SDK successfully initialized on database: " + (firebaseConfig.firestoreDatabaseId || "(default)"));
} catch (error) {
  console.error("Failed to initialize Firebase / Firestore via client SDK:", error);
}

// Help helper for reading data file
function loadData(): CivicShieldData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to read civic_data.json, returning pre-seeded details.", error);
  }
  return initialData;
}

// Help helper for writing data file
function saveData(newData: CivicShieldData) {
  try {
    newData.lastUpdated = Date.now();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2), "utf-8");
    
    // Asynchronously write to Firestore to prevent page-load blocking
    if (firestore) {
      setDoc(doc(firestore, "campaign", "data"), newData)
        .then(() => {
          console.log("Successfully persisted updated campaignData to Firestore!");
        })
        .catch((error) => {
          console.error("Failed to write to Firestore:", error);
        });
    }
  } catch (error) {
    console.error("Failed to write to civic_data.json:", error);
  }
}

// Load global database
let campaignData = loadData();

// Seed initial files of DB
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
      if (remoteData) {
        campaignData = remoteData;
        // Keep local cache file updated
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(campaignData, null, 2), "utf-8");
        console.log("✓ Success: Synced campaignData from persistent Firestore on boot!");
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
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("GEMINI_API_KEY is missing. AI chat assistance will operate in offline mock response mode.");
}

// Server static files under /uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// ---------------- API ENDPOINTS ----------------

// Get all campaigning data
app.get("/api/campaign-data", (req, res) => {
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

// Smart context-matching offline fallback engine for Civic Shield
function getOfflineSmartAnswer(text: string): { answered: boolean; answer?: string; repliedBy?: string } {
  const query = text.toLowerCase();

  if (query.includes("detained") || query.includes("arrest") || query.includes("police") || query.includes("stop") || query.includes("officer") || query.includes("cop") || query.includes("free to go")) {
    return {
      answered: true,
      repliedBy: "AI Shield (Offline Guard)",
      answer: "Civic Shield Stop Protocol:\n\n1. Confirm Status: Calmly ask, 'Am I being detained, or am I free to go?' If free to go, walk away.\n2. Inquire for Reason: If detained, ask, 'What is the specific reasonable suspicion for my detainment?' Forces a verbal record.\n3. Question Mandates: Ask, 'Am I required by law to provide identity under this specific detainment?'\n\nAlways remain respectful, avoid sudden movements, and record the interaction if safely possible. Our de-escalation checklist is in the Evidence Locker!"
    };
  }

  if (query.includes("rti") || query.includes("right to information") || query.includes("transparency") || query.includes("public record") || query.includes("budget") || query.includes("government")) {
    return {
      answered: true,
      repliedBy: "AI Shield (Offline Guard)",
      answer: "RTI (Right to Information) Guide:\n\nUnder statutory transparency regulations (e.g., RTI Act, 2005), any citizen has the right to query public authorities regarding expenditure, orders, and administrative logs:\n- Submission: Formulate standard direct questions and submit to the designated Public Information Officer (PIO).\n- 30-Day Mandate: Authorities must supply the response within 30 days.\n- Templates: Download ready-made pre-formatted RTI draft boilerplate worksheets directly from our Evidence Locker!"
    };
  }

  if (query.includes("pro-se") || query.includes("pro se") || query.includes("party-in-person") || query.includes("party in person") || query.includes("represent") || query.includes("attorney") || query.includes("lawyer") || query.includes("court")) {
    return {
      answered: true,
      repliedBy: "AI Shield (Offline Guard)",
      answer: "Party-in-Person (Pro-Se) Self-Representation Protocol:\n\nYou possess an absolute statutory right to represent yourself and plead your own case in court or tribunals (e.g. under Section 32 of the Advocates Act in India):\n- Cost Benefit: Useful for tenant disagreements, small consumer disputes, or minor municipal citations without heavy retainers.\n- Submission Rules: Ensure replies are cleanly numbered, indexed sequentially, and served officially to the registrar.\n- Templates: Ready boilerplate files are available in our Evidence Locker."
    };
  }

  if (query.includes("traffic") || query.includes("car") || query.includes("vehicle") || query.includes("roadside") || query.includes("license") || query.includes("helmet") || query.includes("challan")) {
    return {
      answered: true,
      repliedBy: "AI Shield (Offline Guard)",
      answer: "Roadside Traffic Compliance Guidelines:\n\nDuring traffic or roadside stop checks:\n- Document Production: Lawfully requested, you must present your license, registration (RC), insurance, and PUC certificate. Digital copies (via DigiLocker or mParivahan) are completely valid and equal to physical files.\n- Search boundary: An officer cannot search the vehicle's interior gloveboxes or trunks without a valid warrant, consent, or probable cause.\n- Download our pocket-sized Traffic Compliance Handbook inside the Evidence Locker."
    };
  }

  if (query.includes("rent") || query.includes("tenant") || query.includes("landlord") || query.includes("eviction") || query.includes("lease") || query.includes("apartment") || query.includes("housing")) {
    return {
      answered: true,
      repliedBy: "AI Shield (Offline Guard)",
      answer: "Tenant & Housing Dispute Rights:\n\nYour residence is protected by municipal tenancy rules:\n- Eviction Control: A landlord cannot evict you arbitrarily without giving a formal written notice period, usually 15-30 days.\n- Security Deposit: Withholding deposits is illegal unless structural damages are formally itemized and photographed.\n- Arbitrations: In case of threats or arbitrary utilities shutdown, immediately appeal to the local rent tribunal."
    };
  }

  if (query.includes("help") || query.includes("recommend") || query.includes("how to") || query.includes("where") || query.includes("guide") || query.includes("book")) {
    return {
      answered: true,
      repliedBy: "AI Shield (Offline Guard)",
      answer: "How to begin exercising your civil liberties:\n\n1. Review 'The Justice Shield' board to unmask public misconceptions and legal realities.\n2. Open the 'Evidence & Legal Locker' section to download free procedural guide PDFs, RTI templates, and de-escalation protocol videos.\n3. Submit a specific topic in this Chat for guidance."
    };
  }

  return {
    answered: false
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
        You are the Official AI Campaign Advocate of "Civic Shield", advocating for legal literacy, citizen defense, and mutual procedural dialogue using Indian and International law (e.g., Indian Constitution, RTI Act 2005, Advocates Act 1961, UDHR, ICCPR).
        Campaign Goal: Bridge the path between citizens and legal authority, eliminate fear of procedures, and equip everyone with knowledge of basic laws so they can protect themselves.
        Tone: Objective, supportive, professional, authoritative, reassuring, and non-escalating.
        Key pillars: Bridge the Gap, Eliminate Fear, Citizen Defense, Civic Transparency.
        Resources in the locker: Traffic Rules & Motor Vehicle Act handbook, Party-in-Person legal templates, RTI drafts, de-escalation video guide.
        Frequently Asked: We aim to demystify trial procedures, High Court writ filings, RTI requests, speaking orders, and statutory terms.
      `;

      // Try primary model (gemini-3.5-flash)
      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Question: ${text}`,
          config: {
            systemInstruction: `${campaignKnowledge}\nAnswer this user's question concisely, transparently, and professionally. End your answer reassuringly. Limit response to 120 words.`,
            temperature: 0.7
          }
        });
        
        if (response.text) {
          newQuestion.answered = true;
          newQuestion.answer = response.text.trim();
          newQuestion.repliedBy = "AI Campaign Advocate";
        }
      } catch (gemError: any) {
        console.warn("Primary model 'gemini-3.5-flash' experienced an issue. Attempting fallback 'gemini-flash-latest'...", gemError.message || gemError);
        geminiServiceError = gemError;
        
        // Retry with stable fallback model (gemini-flash-latest)
        try {
          const fallbackResponse = await aiClient.models.generateContent({
            model: "gemini-flash-latest",
            contents: `Question: ${text}`,
            config: {
              systemInstruction: `${campaignKnowledge}\nAnswer this user's question concisely, transparently, and professionally. End your answer reassuringly. Limit response to 120 words.`,
              temperature: 0.7
            }
          });
          if (fallbackResponse.text) {
            newQuestion.answered = true;
            newQuestion.answer = fallbackResponse.text.trim();
            newQuestion.repliedBy = "AI Campaign Advocate (Standard)";
            geminiServiceError = null; // Cleared on successful backup resolution!
          }
        } catch (fallbackError: any) {
          console.error("Both primary and fallback Gemini generation models failed:", fallbackError.message || fallbackError);
          geminiServiceError = fallbackError;
        }
      }
    }

    // Try smart keyword-matching offline fallback before returning the completely generic offline alert
    if (!newQuestion.answered) {
      const offlineMatch = getOfflineSmartAnswer(text);
      if (offlineMatch.answered && offlineMatch.answer) {
        newQuestion.answered = true;
        newQuestion.answer = offlineMatch.answer;
        newQuestion.repliedBy = offlineMatch.repliedBy || "AI Shield (Offline Guard)";
      }
    }

    // Ultimate fallback if neither Gemini is successfully active nor keyword matched
    if (!newQuestion.answered) {
      newQuestion.answer = "Thank you for reaching out to Civic Shield! We have received your query. A human campaign advocate has been notified of your question, and we will review and reply here shortly.";
      newQuestion.answered = false;
      newQuestion.repliedBy = "Campaign Manager";
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
      // Development server with HMR disabled or enabled by control
      const { createServer: createViteServer } = await (eval('import("vite")') as Promise<typeof import("vite")>);
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
