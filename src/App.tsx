import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertCircle, Edit3, Save, Plus, ArrowUpRight, Scale, Trees, Coins, 
  Sparkles, ShieldAlert, Landmark, Info, FileDown, ExternalLink, HelpCircle
} from "lucide-react";
import { CivicShieldData, LayoutBlock, BlogPost, EvidenceItem, AnonymousQuestion, NewsletterSub, Statute } from "./types";
import { AnimatePresence, motion } from "motion/react";

import Header from "./components/Header";
import AnonymousChat from "./components/AnonymousChat";
import EvidenceSection from "./components/EvidenceSection";
import PillarsSection from "./components/PillarsSection";
import TimelineSection from "./components/TimelineSection";
import BlogSection from "./components/BlogSection";
import NewsletterSection from "./components/NewsletterSection";
import AdminPanel from "./components/AdminPanel";
import SocialFeedSection from "./components/SocialFeedSection";
import ImpactMetricsSection, { MetricItem } from "./components/ImpactMetricsSection";
import JusticeShieldSection from "./components/JusticeShieldSection";
import IntroGate from "./components/IntroGate";

export default function App() {
  const [data, setData] = useState<CivicShieldData | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      return localStorage.getItem("civic_shield_admin_mode") === "true";
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const isFormallyLoaded = React.useRef(false);

  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (window.location.hash) return false;
      return sessionStorage.getItem("civic_shield_intro_passed") !== "true";
    } catch {
      return true;
    }
  });

  const handleEnterWebsite = (sectionId?: string) => {
    setShowIntro(false);
    try {
      sessionStorage.setItem("civic_shield_intro_passed", "true");
    } catch (e) {}

    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
    }
  };

  // Sync admin mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("civic_shield_admin_mode", isAdminMode ? "true" : "false");
    } catch (e) {
      console.error("Local storage not writable:", e);
    }
  }, [isAdminMode]);

  // Keep client-side backup cache in sync with state changes
  useEffect(() => {
    if (data && isAdminMode) {
      try {
        let backupData = { ...data };
        if (isFormallyLoaded.current) {
          // A user action triggered a state update! Advance the client-side timestamp.
          const newTimestamp = Date.now();
          backupData.lastUpdated = newTimestamp;
          data.lastUpdated = newTimestamp;
        } else {
          isFormallyLoaded.current = true;
        }
        localStorage.setItem("civic_shield_campaign_backup_v2", JSON.stringify(backupData));
      } catch (e) {
        console.error("Local storage backup error:", e);
      }
    }
  }, [data, isAdminMode]);

  // Fetch campaign database on mount
  useEffect(() => {
    fetchCampaignData();
  }, [isAdminMode]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/campaign-data");
      if (!res.ok) throw new Error("Could not retrieve campaign configurations");
      let dbData = await res.json();
      
      // Admin Auto-Sync Layer: If the server database was reset (redeployed/rebooted)
      // but the administrator possesses a newer backup in browser storage, auto-sync and restore it in the background!
      if (isAdminMode) {
        try {
          const rawBackup = localStorage.getItem("civic_shield_campaign_backup_v2");
          if (rawBackup) {
            const parsedBackup = JSON.parse(rawBackup) as CivicShieldData;
            const serverLastUpdated = dbData.lastUpdated || 0;
            const backupLastUpdated = parsedBackup.lastUpdated || 0;
            
            if (backupLastUpdated > serverLastUpdated) {
              console.log("🔄 Auto-Sync: Client backup is newer than Server database. Restoring automatically...");
              const restoreRes = await fetch("/api/import-campaign-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedBackup)
              });
              if (restoreRes.ok) {
                dbData = parsedBackup;
                // Highlight auto-restore with a non-intrusive notification
                setErrorNotice("🔄 Automatic Sync: Restored your latest changes from browser backup after server reboot!");
                setTimeout(() => setErrorNotice(null), 5000);
              }
            } else if (dbData) {
              // Server is newer or equal, cache the latest server state onto client
              localStorage.setItem("civic_shield_campaign_backup_v2", JSON.stringify(dbData));
            }
          } else if (dbData) {
            // First time backup creation
            localStorage.setItem("civic_shield_campaign_backup_v2", JSON.stringify(dbData));
          }
        } catch (backupErr) {
          console.error("Auto-sync resolution error:", backupErr);
        }
      }
      
      // Auto-heal / Migrate configuration blocks with new sections
      const blockList = dbData.blocks || [];
      const hasImpactMetrics = blockList.some((b: any) => b.id === "impact-metrics");
      const hasJusticeShield = blockList.some((b: any) => b.id === "justice-shield");
      
      let blocksUpdated = false;
      const updatedBlocks = [...blockList];
      
      if (!hasImpactMetrics) {
        updatedBlocks.push({
          id: "impact-metrics",
          title: "Impact Metrics Chart",
          visible: true,
          order: 3,
          customData: {
            metrics: [
              { label: "Cases Won & Settled", value: 148 },
              { label: "Citizens Empowered", value: 4850 },
              { label: "Handbooks Distributed", value: 3120 },
              { label: "Procedural Clinics Hosted", value: 35 }
            ]
          }
        });
        blocksUpdated = true;
      }
      
      if (!hasJusticeShield) {
        updatedBlocks.push({
          id: "justice-shield",
          title: "The Justice Shield",
          visible: true,
          order: 4,
          customData: {}
        });
        blocksUpdated = true;
      }
      
      let finalData = dbData;
      if (blocksUpdated) {
        // Enforce proper sorting by order
        const sorted = updatedBlocks.sort((a, b) => a.order - b.order);
        const reindexed = sorted.map((b, i) => ({ ...b, order: i + 1 }));
        
        finalData = {
          ...dbData,
          blocks: reindexed
        };
        
        // Save layout structures back to server immediately
        await fetch("/api/save-blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blocks: reindexed })
        });
      }
      
      setData(finalData);
    } catch (err: any) {
      console.error(err);
      setErrorNotice("Offline or unavailable backend server. Falling back to local preview simulation.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- OPERATIONS ----------------

  // Save layout block state (visibility or order)
  const handleSaveBlocks = async (newBlocks: LayoutBlock[]) => {
    if (!data) return;
    const sorted = [...newBlocks].sort((a, b) => a.order - b.order);
    
    // Optimistic local update
    setData({ ...data, blocks: sorted });

    try {
      const res = await fetch("/api/save-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: sorted })
      });
      if (!res.ok) throw new Error("Failed to write layout configurations to the server");
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Update specific block variables (like title or description text)
  const handleUpdateBlockData = async (blockId: string, customFields: any) => {
    if (!data) return;
    const updatedBlocks = data.blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, customData: { ...b.customData, ...customFields } };
      }
      return b;
    });

    setData({ ...data, blocks: updatedBlocks });

    try {
      const res = await fetch("/api/update-block-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blockId, customData: customFields })
      });
      if (!res.ok) throw new Error("Could not save text changes onto the server");
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Create new Blog entry
  const handleAddBlogPost = async (title: string, content: string, author: string, imageUrl: string) => {
    if (!data) return;
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author, imageUrl })
      });
      if (!res.ok) throw new Error("Could not publish blog post");
      const newPost = await res.json();
      
      // Update local state
      setData({
        ...data,
        posts: [newPost, ...data.posts]
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Update blog comments list
  const handleAddComment = async (postId: string, name: string, commentText: string) => {
    if (!data) return null;
    try {
      const res = await fetch(`/api/blog/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: name, text: commentText })
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const commentObj = await res.json();

      const updatedPosts = data.posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, commentObj] };
        }
        return p;
      });

      setData({ ...data, posts: updatedPosts });
      return commentObj;
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
      return null;
    }
  };

  // Delete Blog post
  const handleDeletePost = async (id: string) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete blog post");
      
      setData({
        ...data,
        posts: data.posts.filter(p => p.id !== id)
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Delete comment on blog post
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/blog/${postId}/comment/${commentId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Could not delete comment");
      
      const updatedPosts = data.posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      });
      
      setData({ ...data, posts: updatedPosts });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Upload Evidence File (Base64)
  const handleUploadFile = async (payload: {
    fileName: string;
    fileType: string;
    fileData: string;
    title: string;
    description: string;
    verifiedBy: string;
  }) => {
    if (!data) return;
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to upload the file. Choose smaller files (<10MB).");
      const newEvidence = await res.json();

      setData({
        ...data,
        evidence: [newEvidence, ...data.evidence]
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Delete Evidence entry
  const handleDeleteEvidence = async (id: string) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/evidence/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not erase evidence list entry");

      setData({
        ...data,
        evidence: data.evidence.filter(ev => ev.id !== id)
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Subscribe subscriber email
  const handleSubscribe = async (email: string) => {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to subscribe to the newsletter");
    }
    
    // Refresh campaign subscribers
    if (result.subscription) {
      setData(prev => prev ? {
        ...prev,
        subscribers: [...prev.subscribers, result.subscription]
      } : null);
    }
    return result;
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/subscribe/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not remove subscriber");
      
      setData({
        ...data,
        subscribers: data.subscribers.filter(sub => sub.id !== id)
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Submit anonymous questions from viewers (and get AI response)
  const handleNewQuestion = async (qText: string) => {
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qText })
      });
      if (!res.ok) throw new Error("Could not post question");
      const newQ = await res.json();

      setData(prev => prev ? {
        ...prev,
        questions: [...prev.questions, newQ]
      } : null);
      return newQ;
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
      return null;
    }
  };

  // Moderator: answer/approve question
  const handleAnswerQuestion = async (id: string, answer: string, repliedBy: string, isPublic: boolean) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/questions/${id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, repliedBy, isPublic })
      });
      if (!res.ok) throw new Error("Failed to save answer");
      const updatedQ = await res.json();

      setData({
        ...data,
        questions: data.questions.map(q => q.id === id ? updatedQ : q)
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Delete Q&A
  const handleDeleteQuestion = async (id: string) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete question");

      setData({
        ...data,
        questions: data.questions.filter(q => q.id !== id)
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Add Campaign Social Broadcast Post
  const handleAddSocialPost = async (platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube", content: string, imageUrl?: string) => {
    if (!data) return;
    try {
      const res = await fetch("/api/social-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, content, imageUrl })
      });
      if (!res.ok) throw new Error("Could not publish social stream broadcast post");
      const newPost = await res.json();
      
      setData({
        ...data,
        socialFeed: [newPost, ...(data.socialFeed || [])]
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Erase Campaign Social Broadcast Post
  const handleDeleteSocialPost = async (id: string) => {
    if (!data) return;
    try {
      const res = await fetch(`/api/social-feed/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete social post");
      
      setData({
        ...data,
        socialFeed: (data.socialFeed || []).filter(post => post.id !== id)
      });
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
    }
  };

  // Broadcast and Log Newsletter to Database
  const handleSendNewsletter = async (subject: string, badge: string, body: string) => {
    if (!data) return;
    try {
      const res = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, badge, body })
      });
      if (!res.ok) throw new Error("Could not broadcast campaign dispatch newsletter");
      const result = await res.json();
      
      setData({
        ...data,
        newsletters: [result.newsletter, ...(data.newsletters || [])]
      });

      return result.message;
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001a4d] flex flex-col items-center justify-center text-[#d4af37] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-sm border-t-2 border-r-2 border-[#d4af37] animate-spin" />
          <Landmark className="absolute inset-0 m-auto w-6 h-6 animate-pulse text-[#d4af37]" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-serif font-bold uppercase tracking-widest">Compiling Civic Shield</h3>
          <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase tracking-widest">Loading campaigning data streams...</p>
        </div>
      </div>
    );
  }

  const sortedBlocks = data ? [...data.blocks].sort((a, b) => a.order - b.order) : [];
  const heroBlock = data?.blocks.find(b => b.id === "hero");
  const pillarsBlock = data?.blocks.find(b => b.id === "pillars");
  const timelineBlock = data?.blocks.find(b => b.id === "timeline");
  const evidenceBlock = data?.blocks.find(b => b.id === "evidence");
  const blogBlock = data?.blocks.find(b => b.id === "blog");
  const newsletterBlock = data?.blocks.find(b => b.id === "newsletter");

  const primaryColor = heroBlock?.customData.primaryColor || "#0B1B3D";
  const accentColor = heroBlock?.customData.accentColor || "#D4AF37";

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro-gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[10000]"
        >
          <IntroGate onEnter={handleEnterWebsite} />
        </motion.div>
      ) : (
        <motion.div
          key="main-website"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen font-sans antialiased text-gray-100 flex flex-col justify-between bg-[#001a4d]"
        >
      
      {/* Header with Admin button */}
      <Header 
        isAdminMode={isAdminMode} 
        setIsAdminMode={setIsAdminMode} 
        primaryColor={primaryColor} 
        accentColor={accentColor} 
      />

      {/* Connection / Error banners */}
      {errorNotice && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-center text-xs text-red-400 font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
          <span>{errorNotice}</span>
          <button onClick={() => setErrorNotice(null)} className="underline hover:text-white font-mono ml-3 cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* ADVISORY WATERMARK / CAMPAIGN BRIEF */}
      <div className="bg-gradient-to-r from-[#001233] via-[#d4af37]/5 to-[#001233] border-b border-[#d4af37]/15 px-4 py-2.5 text-center text-[9px] font-mono text-[#d4af37] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
        <span>Legal Lit Alliance: Erasing fear, empowering citizens, and defending fundamental liberties</span>
      </div>

      <main className="flex-grow">
        
        {/* Floating Admin Mode Control overlay on top */}
        {isAdminMode && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <AdminPanel
              blocks={sortedBlocks}
              subscribers={data?.subscribers || []}
              questions={data?.questions || []}
              socialPosts={data?.socialFeed || []}
              newsletters={data?.newsletters || []}
              notificationLogs={data?.notificationLogs || []}
              onSaveBlocks={handleSaveBlocks}
              onAddBlogPost={handleAddBlogPost}
              onUploadFile={handleUploadFile}
              onAnswerQuestion={handleAnswerQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onAddSocialPost={handleAddSocialPost}
              onDeleteSocialPost={handleDeleteSocialPost}
              onSendNewsletter={handleSendNewsletter}
              onAddSubscriber={handleSubscribe}
              onDeleteSubscriber={handleDeleteSubscriber}
              accentColor={accentColor}
            />
          </div>
        )}

        {/* Dynamic layouter blocks based on user-sorted array order */}
        {sortedBlocks.map((block) => {
          if (!block.visible) return null;

          switch (block.id) {
            case "hero":
              return (
                <section 
                  key={block.id}
                  className="relative py-28 flex flex-col items-center justify-center overflow-hidden border-b border-[#d4af37]/25 text-center select-none bg-[#001233]"
                  style={{ background: `linear-gradient(135deg, #001233 0%, #001a4d 60%, #002366 100%)` }}
                >
                  {/* Glowing background highlights */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
                  
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
                    
                    {/* Big Heading (Editable in-place if Manager Mode is ON) */}
                    <div className="space-y-4">
                      {isAdminMode ? (
                        <div className="space-y-2 border border-dashed border-[#d4af37]/30 p-4 rounded-sm bg-[#001233]/90 max-w-2xl mx-auto">
                          <span className="text-[9px] uppercase font-mono text-[#d4af37] font-bold block mb-1">Edit Banner Title & Subtitle</span>
                          <input
                            type="text"
                            value={block.customData.heroTitle || ""}
                            onChange={(e) => handleUpdateBlockData("hero", { heroTitle: e.target.value })}
                            className="w-full text-center bg-[#001a4d] text-base font-serif font-semibold text-white focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/20 rounded-sm px-2 py-1 uppercase tracking-wider"
                          />
                          <input
                            type="text"
                            value={block.customData.heroSubtitle || ""}
                            onChange={(e) => handleUpdateBlockData("hero", { heroSubtitle: e.target.value })}
                            className="w-full text-center bg-[#001a4d] text-xs text-gray-300 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/20 rounded-sm px-2 py-1 font-sans"
                          />
                        </div>
                      ) : (
                        <>
                          <h1 className="text-4xl sm:text-6xl font-serif font-normal italic tracking-tight text-white leading-tight">
                            {block.customData.heroTitle || "CIVIC SHIELD"}
                          </h1>
                          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-light">
                            {block.customData.heroSubtitle}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Urgent Action Alert / Notice block (Editable in-place) */}
                    {block.customData.heroAlertText && (
                      <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] space-y-1 text-center shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-3 justify-center animate-pulse">
                        <AlertCircle className="w-5 h-5 shrink-0 text-[#d4af37]" />
                        {isAdminMode ? (
                          <div className="flex-1">
                            <span className="text-[8px] uppercase font-mono text-[#d4af37] block mb-1">Edit Banner Notice Bubble</span>
                            <textarea
                              value={block.customData.heroAlertText || ""}
                              onChange={(e) => handleUpdateBlockData("hero", { heroAlertText: e.target.value })}
                              rows={2}
                              className="w-full bg-[#001233]/90 border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs text-[#d4af37] rounded-sm p-1.5 font-sans"
                            />
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm font-bold leading-relaxed tracking-wide font-sans">
                            {block.customData.heroAlertText}
                          </p>
                        )}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <a 
                        href="#evidence"
                        className="px-6 py-3 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold text-xs tracking-wider uppercase rounded-sm shadow-xl transition-all scale-100 hover:scale-105"
                      >
                        Browse Evidence
                      </a>
                      <a 
                        href="#blog"
                        className="px-6 py-3 bg-[#001233]/90 hover:bg-[#001a4d] border border-[#d4af37]/30 hover:border-[#d4af37] text-[#d4af37] hover:text-white font-bold text-xs tracking-wider uppercase rounded-sm transition-all"
                      >
                        Recent Dispatches
                      </a>
                    </div>
                  </div>
                </section>
              );

            case "pillars":
              return (
                <PillarsSection
                  key={block.id}
                  pillars={block.customData.pillars || []}
                  isAdmin={isAdminMode}
                  onUpdatePillar={(index, updated) => {
                    const originalPillars = block.customData.pillars || [];
                    const nextPillars = [...originalPillars];
                    nextPillars[index] = updated;
                    handleUpdateBlockData("pillars", { pillars: nextPillars });
                  }}
                  accentColor={accentColor}
                />
              );

            case "impact-metrics":
              return (
                <ImpactMetricsSection
                  key={block.id}
                  metrics={block.customData.metrics || []}
                  isAdmin={isAdminMode}
                  onUpdateMetrics={(newMetrics) => {
                    handleUpdateBlockData("impact-metrics", { metrics: newMetrics });
                  }}
                  accentColor={accentColor}
                />
              );

            case "justice-shield":
              return (
                <JusticeShieldSection
                  key={block.id}
                  isAdmin={isAdminMode}
                  basicLaws={block.customData.basicLaws}
                  legalMyths={block.customData.legalMyths}
                  libraryStatutes={block.customData.libraryStatutes}
                  onUpdateLaws={(nextLaws) => handleUpdateBlockData("justice-shield", { basicLaws: nextLaws })}
                  onUpdateMyths={(nextMyths) => handleUpdateBlockData("justice-shield", { legalMyths: nextMyths })}
                  onUpdateLibrary={(nextLibrary) => handleUpdateBlockData("justice-shield", { libraryStatutes: nextLibrary })}
                />
              );

            case "evidence":
              return (
                <EvidenceSection
                  key={block.id}
                  evidence={data?.evidence || []}
                  isAdmin={isAdminMode}
                  onDeleteEvidence={handleDeleteEvidence}
                  accentColor={accentColor}
                />
              );

            case "timeline":
              return (
                <TimelineSection
                  key={block.id}
                  events={block.customData.timeline || []}
                  isAdmin={isAdminMode}
                  onUpdateEvent={(index, updated) => {
                    const originalTimeline = block.customData.timeline || [];
                    const nextTimeline = [...originalTimeline];
                    nextTimeline[index] = updated;
                    handleUpdateBlockData("timeline", { timeline: nextTimeline });
                  }}
                  onAddEvent={() => {
                    const originalTimeline = block.customData.timeline || [];
                    const nextTimeline = [...originalTimeline, {
                      date: "New Road target",
                      title: "Click to edit target heading",
                      description: "Click to write explanation for this campaign milestone milestone",
                      completed: false
                    }];
                    handleUpdateBlockData("timeline", { timeline: nextTimeline });
                  }}
                  onDeleteEvent={(index) => {
                    const originalTimeline = block.customData.timeline || [];
                    const nextTimeline = originalTimeline.filter((_, idx) => idx !== index);
                    handleUpdateBlockData("timeline", { timeline: nextTimeline });
                  }}
                  accentColor={accentColor}
                />
              );

            case "social-feed":
              return (
                <SocialFeedSection
                  key={block.id}
                  posts={data?.socialFeed || []}
                  isAdmin={isAdminMode}
                  onAddPost={handleAddSocialPost}
                  onDeletePost={handleDeleteSocialPost}
                />
              );

            case "blog":
              return (
                <BlogSection
                  key={block.id}
                  posts={data?.posts || []}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  isAdmin={isAdminMode}
                  onDeletePost={handleDeletePost}
                />
              );

            case "newsletter":
              return (
                <NewsletterSection
                  key={block.id}
                  onSubscribe={handleSubscribe}
                />
              );

            default:
              return null;
          }
        })}

      </main>

      {/* Footer Block */}
      <footer className="bg-[#001233] border-t border-[#d4af37]/25 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 bg-[#d4af37] rounded-sm flex items-center justify-center rotate-45 shrink-0">
              <div className="-rotate-45 font-serif font-bold text-[#001a4d] text-sm select-none">CS</div>
            </div>
            <div>
              <p className="text-sm font-bold font-serif text-white tracking-wider flex items-center justify-center md:justify-start gap-1">
                CIVIC SHIELD <span className="text-[#d4af37] font-serif not-italic">CAMPAIGN CHRONICLE</span>
              </p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wider">EST. 2026. BRIDGING CITIZEN ADVOCACY, ELIMINATING FEAR, AND SECURING PROCEDURAL RIGHTS.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-gray-400 font-mono">
            <span>SECURE ENCRYPTED SERVERS</span>
            <span className="hidden md:inline">•</span>
            <span>NO COOKIE LOGGERS</span>
            <span className="hidden md:inline">•</span>
            <span>100% LOCAL COMMUNITY FUNDED</span>
          </div>
        </div>
      </footer>

          {/* FLOATING CHAT SYSTEM BOTTOM-RIGHT */}
          <AnonymousChat 
            questions={data?.questions || []} 
            onNewQuestion={handleNewQuestion} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
