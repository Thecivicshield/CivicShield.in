import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertCircle, Edit3, Save, Plus, ArrowUpRight, Scale, Trees, Coins, 
  Sparkles, ShieldAlert, Landmark, Info, FileDown, ExternalLink, HelpCircle, BookOpen
} from "lucide-react";
import { CivicShieldData, LayoutBlock, BlogPost, EvidenceItem, AnonymousQuestion, NewsletterSub, Statute, VisitorMetrics } from "./types";
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
import MeasurableSuccessHub from "./components/MeasurableSuccessHub";
import CyberHUD from "./components/CyberHUD";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import AestheticBackground from "./components/AestheticBackground";
import PremiumButton from "./components/PremiumButton";
import ScrollReveal from "./components/ScrollReveal";
import AchievementToast from "./components/AchievementToast";
import LawBlueprint from "./components/LawBlueprint";
import FloatingScrollIndicator from "./components/FloatingScrollIndicator";
import ConstitutionalNetwork from "./components/ConstitutionalNetwork";
import BookOfGoalsModal from "./components/BookOfGoalsModal";
import BookWidget from "./components/BookWidget";
import VintageBookWidget from "./components/VintageBookWidget";
import FilingCabinetSection from "./components/FilingCabinetSection";
import { playSynthSound } from "./components/JusticeShieldSection";

export default function App() {
  const [data, setData] = useState<CivicShieldData | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookInitialGoalIndex, setBookInitialGoalIndex] = useState(0);
  const [activeFolderTab, setActiveFolderTab] = useState<"study" | "vault" | "dispatch">("study");
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (window.location.hash) return false;
      return sessionStorage.getItem("civic_shield_intro_passed") !== "true";
    } catch {
      return true;
    }
  });

  // Automatically switch tabs if an anchor link or cabinet navigation is triggered
  useEffect(() => {
    const handleTargetSwitch = (target: string) => {
      if (!target) return;
      const lower = target.toLowerCase();
      if (lower.includes("evidence") || lower.includes("metric") || lower.includes("vault") || lower.includes("shield") || lower.includes("ev_")) {
        setActiveFolderTab("vault");
      } else if (lower.includes("pillar") || lower.includes("law") || lower.includes("case") || lower.includes("network") || lower.includes("study") || lower.includes("about") || lower.includes("charter")) {
        setActiveFolderTab("study");
      } else if (lower.includes("blog") || lower.includes("timeline") || lower.includes("news") || lower.includes("social") || lower.includes("dispatch") || lower.includes("road") || lower.includes("gazette")) {
        setActiveFolderTab("dispatch");
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        handleTargetSwitch(hash);
      }
    };

    const handleCabinetNavEvent = (e: Event) => {
      try {
        const detail = (e as CustomEvent)?.detail;
        if (detail?.targetId) {
          handleTargetSwitch(detail.targetId);
        }
      } catch (err) {
        console.warn("Error handling cabinet nav event:", err);
      }
    };

    window.addEventListener("hashchange", handleHashChange, { passive: true });
    window.addEventListener("popstate", handleHashChange, { passive: true });
    window.addEventListener("trigger-cabinet-nav", handleCabinetNavEvent as EventListener);

    // Run once on load
    handleHashChange();

    const handleOpenBookEvent = (e: Event) => {
      try {
        const detail = (e as CustomEvent)?.detail;
        if (detail?.initialIndex !== undefined) {
          setBookInitialGoalIndex(detail.initialIndex);
        }
        setIsBookModalOpen(true);
      } catch (err) {
        console.warn("Error handling open book event:", err);
      }
    };

    window.addEventListener("open-book-of-goals", handleOpenBookEvent as EventListener);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      window.removeEventListener("trigger-cabinet-nav", handleCabinetNavEvent as EventListener);
      window.removeEventListener("open-book-of-goals", handleOpenBookEvent as EventListener);
    };
  }, [data]);

  const handleEnterWebsite = (sectionId?: string) => {
    setShowIntro(false);
    try {
      sessionStorage.setItem("civic_shield_intro_passed", "true");
    } catch (e) {}

    if (sectionId) {
      setTimeout(() => {
        try {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        } catch (e) {
          console.warn("Scroll on intro complete:", e);
        }
      }, 100);
    }
  };

  // Track unique website visit on mount
  useEffect(() => {
    try {
      const hasTracked = sessionStorage.getItem("civic_visit_tracked");
      if (!hasTracked) {
        fetch("/api/track-visit", { method: "POST" })
          .then(res => res.json())
          .then(resData => {
            if (resData?.stats) {
              setData(prev => prev ? { ...prev, visitorStats: resData.stats } : null);
              sessionStorage.setItem("civic_visit_tracked", "true");
            }
          })
          .catch(err => console.warn("Track visit info:", err));
      }
    } catch (e) {}
  }, []);

  const handleUpdateVisitorStats = async (updated: VisitorMetrics) => {
    try {
      const res = await fetch("/api/update-visitor-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: updated })
      });
      const resData = await res.json();
      if (resData?.stats && data) {
        setData({ ...data, visitorStats: resData.stats });
      }
    } catch (err) {
      console.error("Failed to update visitor stats:", err);
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
      
      // Auto-heal / Migrate configuration blocks with new sections (excluding deployment-map)
      const rawBlockList = dbData.blocks || [];
      const blockList = rawBlockList.filter((b: any) => b.id !== "deployment-map");
      const hasImpactMetrics = blockList.some((b: any) => b.id === "impact-metrics");
      const hasJusticeShield = blockList.some((b: any) => b.id === "justice-shield");
      
      let blocksUpdated = rawBlockList.length !== blockList.length;
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
      
      const hasConstitutionalNetwork = blockList.some((b: any) => b.id === "constitutional-network");
      if (!hasConstitutionalNetwork) {
        updatedBlocks.push({
          id: "constitutional-network",
          title: "Constitutional Network Map",
          visible: true,
          order: 5,
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

  // Update Evidence entry
  const handleUpdateEvidence = async (id: string, updatedFields: Partial<EvidenceItem>) => {
    if (!data) return;
    try {
      const res = await fetch("/api/update-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updatedFields })
      });
      if (!res.ok) throw new Error("Could not save updated evidence list entry");

      setData({
        ...data,
        evidence: data.evidence.map(ev => ev.id === id ? { ...ev, ...updatedFields } : ev)
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
    return <LoadingScreen />;
  }

  const sortedBlocks = data ? [...data.blocks].sort((a, b) => a.order - b.order) : [];

  const isBlockInActiveTab = (blockId: string) => {
    if (blockId === "hero") return true;
    if (activeFolderTab === "study") {
      return blockId === "pillars" || blockId === "constitutional-network";
    }
    if (activeFolderTab === "vault") {
      return blockId === "evidence" || blockId === "justice-shield" || blockId === "impact-metrics";
    }
    if (activeFolderTab === "dispatch") {
      return blockId === "blog" || blockId === "timeline" || blockId === "social-feed" || blockId === "newsletter";
    }
    return true;
  };

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
          className="fixed inset-0 z-[10000] overflow-y-auto bg-black"
        >
          <IntroGate 
            onEnter={handleEnterWebsite} 
            visitorCount={data?.visitorStats?.totalVisitors || 14892}
            subscriberCount={(data?.subscribers?.length || 0) + 1480}
          />
        </motion.div>
      ) : (
        <motion.div
          key="main-website"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen font-sans antialiased text-gray-100 flex flex-col justify-between bg-[#001a4d] relative overflow-hidden"
        >
          {/* Custom Premium Hover Cursor */}
          <CustomCursor />

          {/* Immersive Legal Blueprint Background with drifting particles */}
          <AestheticBackground />

          {/* Futuristic Cyber HUD Overlay */}
          <CyberHUD />

          {/* Sovereign Floating Scroll Progress and Discovery Indicator */}
          <FloatingScrollIndicator />
      
      {/* Header with Admin button */}
      <Header 
        isAdminMode={isAdminMode} 
        setIsAdminMode={setIsAdminMode} 
        primaryColor={primaryColor} 
        accentColor={accentColor} 
        onOpenBookOfGoals={() => {
          setBookInitialGoalIndex(0);
          setIsBookModalOpen(true);
        }}
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
              evidence={data?.evidence || []}
              visitorStats={data?.visitorStats}
              onUpdateVisitorStats={handleUpdateVisitorStats}
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
              onDeleteEvidence={handleDeleteEvidence}
              onUpdateEvidence={handleUpdateEvidence}
              accentColor={accentColor}
            />
          </div>
        )}

        {/* 1. HERO SECTION (Always at the top) */}
        {sortedBlocks
          .filter((block) => block.id === "hero" && block.visible)
          .map((block) => {
            const titleText = block.customData.heroTitle || "CIVIC SHIELD";
            const titleChars = Array.from(titleText);
            return (
              <section 
                key={block.id}
                className="relative py-28 flex flex-col items-center justify-center overflow-hidden border-b border-[#d4af37]/25 text-center select-none bg-[#001233]"
                style={{ 
                  background: `radial-gradient(circle at center, #001a4d 0%, #001233 70%, #000a1a 100%)` 
                }}
              >
                {/* Glowing background highlights and gold sweep layer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[#d4af37]/[0.03] blur-[140px] pointer-events-none" />
                
                {/* Gold Light Sweep */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-[45%] bg-gradient-to-r from-transparent via-[#d4af37]/[0.05] to-transparent -skew-x-12 animate-[shimmerSweep_7s_infinite_ease-in-out]" />
                </div>

                <motion.div 
                  style={{ y: scrollY * 0.18 }}
                  className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8"
                >
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
                      <div className="flex flex-col items-center justify-center">
                        {/* Letter-by-letter title reveal */}
                        <h1 className="text-4xl sm:text-6xl font-serif font-normal italic tracking-tight text-white leading-tight flex flex-wrap justify-center gap-x-1.5 max-w-3xl">
                          {titleChars.map((char, charIdx) => (
                            <motion.span
                              key={charIdx}
                              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              transition={{
                                duration: 0.6,
                                delay: charIdx * 0.035,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="inline-block select-text"
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                        </h1>
                        <motion.p 
                          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ 
                            delay: Math.max(0.4, titleChars.length * 0.02), 
                            duration: 0.85,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-light mt-4 select-text"
                        >
                          {block.customData.heroSubtitle}
                        </motion.p>
                      </div>
                    )}
                  </div>

                  {/* Urgent Action Alert / Notice block (Editable in-place) */}
                  {block.customData.heroAlertText && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="max-w-3xl mx-auto p-4 sm:p-5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] space-y-1 text-center shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-3 justify-center"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 text-[#d4af37] animate-pulse" />
                      {isAdminMode ? (
                        <div className="flex-1 text-left">
                          <span className="text-[8px] uppercase font-mono text-[#d4af37] block mb-1">Edit Banner Notice Bubble</span>
                          <textarea
                            value={block.customData.heroAlertText || ""}
                            onChange={(e) => handleUpdateBlockData("hero", { heroAlertText: e.target.value })}
                            rows={2}
                            className="w-full bg-[#001233]/90 border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs text-[#d4af37] rounded-sm p-1.5 font-sans"
                          />
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm font-bold leading-relaxed tracking-wide font-sans select-text">
                          {block.customData.heroAlertText}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Interactive Vintage Handbook Book Widget */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="pt-2 flex justify-center"
                  >
                    <VintageBookWidget accentColor={accentColor} />
                  </motion.div>

                  {/* CTAs with Stagger animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: Math.max(0.6, titleChars.length * 0.025 + 0.25), 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
                  >
                    <PremiumButton 
                      href="#cabinet-stage" 
                      variant="gold"
                      onClick={(e) => {
                        e?.preventDefault?.();
                        setActiveFolderTab("vault");
                        window.dispatchEvent(new CustomEvent("trigger-cabinet-nav", {
                          detail: { targetId: "evidence", label: "Browse Vault & Rights" }
                        }));
                        setTimeout(() => {
                          const el = document.getElementById("cabinet-stage") || document.getElementById("evidence");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                    >
                      Browse Vault & Rights <ArrowUpRight className="w-4 h-4 ml-1 shrink-0" />
                    </PremiumButton>
                    <PremiumButton 
                      href="#cabinet-stage" 
                      variant="outline"
                      onClick={(e) => {
                        e?.preventDefault?.();
                        setActiveFolderTab("dispatch");
                        window.dispatchEvent(new CustomEvent("trigger-cabinet-nav", {
                          detail: { targetId: "blog", label: "Recent Dispatches" }
                        }));
                        setTimeout(() => {
                          const el = document.getElementById("cabinet-stage") || document.getElementById("blog");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                    >
                      Recent Dispatches
                    </PremiumButton>
                  </motion.div>
                </motion.div>
              </section>
            );
          })}

        {/* 2. AUTHENTIC FILING CABINET WITH FILE POP-UP ANIMATION & UNSEALED RECORDS */}
        <FilingCabinetSection 
          activeTab={activeFolderTab} 
          onSelectTab={setActiveFolderTab}
        >
          {/* Render blocks assigned to the currently unsealed drawer */}
          {sortedBlocks
            .filter((block) => block.id !== "hero" && block.visible && isBlockInActiveTab(block.id))
            .map((block, index) => {
              const blockContent = (() => {
                switch (block.id) {
                  case "pillars":
                    return (
                      <PillarsSection
                        key={block.id}
                        pillars={block.customData.pillars || []}
                        isAdmin={isAdminMode}
                        onUpdatePillar={(idx, updated) => {
                          const originalPillars = block.customData.pillars || [];
                          const nextPillars = [...originalPillars];
                          nextPillars[idx] = updated;
                          handleUpdateBlockData("pillars", { pillars: nextPillars });
                        }}
                        onOpenBookModal={(idx) => {
                          if (idx !== undefined) setBookInitialGoalIndex(idx);
                          setIsBookModalOpen(true);
                        }}
                        accentColor={accentColor}
                      />
                    );

                  case "impact-metrics":
                    return (
                      <MeasurableSuccessHub
                        key={block.id}
                        data={data}
                        isAdmin={isAdminMode}
                        onUpdateStats={handleUpdateVisitorStats}
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
                        onUpdateEvent={(idx, updated) => {
                          const originalTimeline = block.customData.timeline || [];
                          const nextTimeline = [...originalTimeline];
                          nextTimeline[idx] = updated;
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
                        onDeleteEvent={(idx) => {
                          const originalTimeline = block.customData.timeline || [];
                          const nextTimeline = originalTimeline.filter((_, i) => i !== idx);
                          handleUpdateBlockData("timeline", { timeline: nextTimeline });
                        }}
                        accentColor={accentColor}
                      />
                    );

                  case "constitutional-network":
                    return (
                      <ConstitutionalNetwork
                        key={block.id}
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
              })();

              if (!blockContent) return null;

              return (
                <ScrollReveal key={block.id} index={index}>
                  {blockContent}
                </ScrollReveal>
              );
            })}
        </FilingCabinetSection>

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
          
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-[10px] text-gray-400 font-mono">
            <button
              onClick={() => {
                try {
                  sessionStorage.removeItem("civic_shield_intro_passed");
                } catch (e) {}
                // Reset window hash and scroll to top for full immersive introduction reload
                window.scrollTo({ top: 0, behavior: "instant" });
                if (window.location.hash) {
                  window.history.pushState("", document.title, window.location.pathname + window.location.search);
                }
                setShowIntro(true);
              }}
              className="text-[#d4af37] hover:text-white transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-widest font-bold"
            >
              <Sparkles className="w-3 h-3 text-[#d4af37]" /> Replay Cinematic Intro
            </button>
            <span className="hidden lg:inline">•</span>
            <span>SECURE ENCRYPTED SERVERS</span>
            <span className="hidden md:inline">•</span>
            <span>NO COOKIE LOGGERS</span>
            <span className="hidden md:inline">•</span>
            <span>100% LOCAL COMMUNITY FUNDED</span>
          </div>
        </div>
      </footer>

          {/* ACHIEVEMENT TOAST SYSTEM */}
          <AchievementToast />

          {/* BOOK OF GOALS 3D TOME POPUP MODAL */}
          <BookOfGoalsModal
            isOpen={isBookModalOpen}
            onClose={() => setIsBookModalOpen(false)}
            initialGoalIndex={bookInitialGoalIndex}
            accentColor={accentColor}
          />

          {/* FLOATING CHAT SYSTEM BOTTOM-RIGHT */}
          <AnonymousChat 
            questions={data?.questions || []} 
            onNewQuestion={handleNewQuestion} 
            evidence={data?.evidence || []}
            onAddEvidence={handleUploadFile}
          />
        </motion.div>
      )}

      {/* GLOBAL SVG DISPLACEMENT FILTERS FOR LIQUID MELTING EFFECT */}
      <svg className="fixed w-0 h-0 pointer-events-none" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="melt-filter-mild">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="melt-filter-medium">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="28" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="melt-filter-heavy">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.12" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="melt-filter-extreme">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.18" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="110" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </AnimatePresence>
  );
}
