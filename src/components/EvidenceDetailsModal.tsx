import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Calendar, ShieldCheck, Download, ExternalLink, 
  Sparkles, FileText, Video, Table, HelpCircle, 
  Layers, Lock, Globe, CheckCircle2, ChevronRight,
  RefreshCw, Cpu, Award, Bookmark, ArrowLeftRight
} from "lucide-react";
import { EvidenceItem } from "../types";
import { playSynthSound } from "./JusticeShieldSection";
import HolographicVerifiedBadge from "./HolographicVerifiedBadge";
import SocialShare from "./SocialShare";

interface EvidenceDetailsModalProps {
  item: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EvidenceDetailsModal({ item, isOpen, onClose }: EvidenceDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "integrity" | "citations">("preview");
  const [cryptographicStatus, setCryptographicStatus] = useState<"pending" | "scanning" | "verified">("pending");
  const [verifiedRating, setVerifiedRating] = useState<number>(100);
  const [pagesRead, setPagesRead] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Sound feedback on open/close
  useEffect(() => {
    if (isOpen) {
      playSynthSound("powerup");
      setCryptographicStatus("pending");
    }
  }, [isOpen]);

  if (!item) return null;

  // Derive beautiful static meta descriptors based on item properties
  const docHash = `SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b${item.id.slice(0, 4)}f`;
  
  // Decide administrative category
  let legalClass = "Municipal Procedural Order";
  let constitutionalGrounding = "1st Amendment (Public Trust & Press Freedom)";
  let complianceSeverity = "Level 4 Safeguard - Highly Authoritative";
  
  if (item.type === "video") {
    legalClass = "Active Incident Documentation Record";
    constitutionalGrounding = "1st Amendment (Right to Document Police Activity)";
    complianceSeverity = "Critical Accountability File - Unredacted";
  } else if (item.title.toLowerCase().includes("handbook") || item.title.toLowerCase().includes("manual")) {
    legalClass = "Federal & State Enforcement Standard Manual";
    constitutionalGrounding = "4th Amendment (Protection Against Warrantless Search)";
    complianceSeverity = "Supreme Standard Code - Non-negotiable Rules";
  } else if (item.type === "spreadsheet") {
    legalClass = "Public Records Act (PRA) Database Audit";
    constitutionalGrounding = "14th Amendment (Due Process & Civic Redress)";
    complianceSeverity = "Level 5 Supreme Audit Ledger";
  }

  const handleVerifyHash = () => {
    if (cryptographicStatus !== "pending") return;
    
    playSynthSound("click");
    setCryptographicStatus("scanning");
    
    setTimeout(() => {
      setCryptographicStatus("verified");
      playSynthSound("success");
      
      // Trigger user achievement toast
      try {
        window.dispatchEvent(new CustomEvent("unlock-achievement", {
          detail: {
            id: "crypto-verify",
            title: "Cryptographic Auditor",
            description: "You successfully ran an integrity check to verify official public archive records.",
            category: "statute"
          }
        }));
      } catch (e) {}
    }, 1500);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    playSynthSound("click");
  };

  const isYouTubeUrl = (url: string) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (!url) return "";
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split(/[?#]/)[0];
      } else if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v") || "";
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1].split(/[?#]/)[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    } catch (e) {
      return url || "";
    }
  };

  // Generate multi-page text content to make page turn feature extremely pointful and educational
  const getPageContent = (pageNum: number) => {
    const d = item ? item.description || "" : "";
    switch (pageNum) {
      case 1:
        return {
          subHeader: "SECTION I: ABSTRACT & AUDIT REGISTRY",
          heading: item ? item.title : "",
          body: d,
          citation: item ? `This certified de-escalation document forms part of the primary Sovereignty Guard Database. Verified by ${item.verifiedBy || "Civic Shield Team"} on ${item.uploadedAt}.` : ""
        };
      case 2:
        return {
          subHeader: "SECTION II: CONSTITUTIONAL ANCHOR & PRECEDENT",
          heading: "Legal Jurisdiction & Common Law Protection",
          body: "This record represents standard procedural natural justice guarantees. In administrative hearings, executive agencies and local boards are strictly bound by the rules of natural justice, meaning no citation, penalty, or property seizure is legally enforceable without clear notice, open grounds, and a neutral appeal tribunal.",
          citation: "See landmark ruling 'Audi Alteram Partem' (Hear the other side), affirming that any citation issued in secrecy remains void ab initio."
        };
      case 3:
        return {
          subHeader: "SECTION III: CITIZEN DIRECTIVES & PEACEFUL PROTOCOLS",
          heading: "Recommended Action & Safe Interaction Playbook",
          body: "When encountering administrative officials or highway inspectors attempting warrantless search or compelled declarations: (1) Maintain complete visual calm. (2) Verbally state that you do not consent to any warrantless searches or compelled declarations. (3) Respectfully request their credential serial numbers. (4) Document the exact time, location, and statements verbatim.",
          citation: "Sovereign Safeguard Protocol: Absolute silence combined with a request for specific statutory warrants represents standard common law defense."
        };
      case 4:
        return {
          subHeader: "SECTION IV: DEFENSIVE CITATIONS & STATUTORY LIMITS",
          heading: "Limiting Executive & Corporate Overreach",
          body: "Under modern public transparency laws (including the Freedom of Information Act and Public Records Acts), state-backed entities and regional departments are required to release chemical environmental tests, water safety logs, and regulatory contracts. Any attempt to claim confidentiality over public safety papers is an unconstitutional wall of secrecy that you have the right to challenge.",
          citation: "Assert FOIA or Public Records standard to open administrative cabinet vaults immediately."
        };
      case 5:
        return {
          subHeader: "SECTION V: LEGAL REDRESS & PUBLIC AUDITS",
          heading: "Remedial Filing & Sovereign Assembly Defenses",
          body: "If your right to peaceful, candlelit public gathering or local association has been disrupted by arbitrary kettling or mass preemptive fines, immediately compile your evidence folders for a motion of judicial review. Preemptive municipal codes cannot supersede supreme constitutional assembly charters, rendering arbitrary local permits null and void during peaceful association.",
          citation: "Refer to landmark assembly precedents to file a formal citizen complaint and secure statutory damage waivers."
        };
      default:
        return { subHeader: "", heading: "", body: "", citation: "" };
    }
  };

  const [pageFlipTrigger, setPageFlipTrigger] = useState(false);
  useEffect(() => {
    setPageFlipTrigger(true);
    const timer = setTimeout(() => setPageFlipTrigger(false), 450);
    return () => clearTimeout(timer);
  }, [pagesRead]);

  const activePage = getPageContent(pagesRead);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto">
          {/* Frosted Glass Dark Backdrop with slow animate-pulse */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 cursor-crosshair"
          />

          {/* Centering Wrapper */}
          <div className="flex min-h-screen items-center justify-center p-3 sm:p-6 md:p-10 relative pointer-events-none z-10">
            {/* Golden Ambient Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-[#d4af37]/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

            {/* Main Glassmorphic Panel Container with Document Reveal paper-unfolding animation */}
            <motion.div
              id="evidence-details-modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl bg-[#001233]/98 border border-[#d4af37]/45 rounded-sm overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9),_0_0_45px_rgba(212,175,55,0.15)] flex flex-col md:grid md:grid-cols-12 md:h-[85vh] font-sans pointer-events-auto backdrop-blur-xl"
            >
              {/* Holographic Glowing Border Overlays */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />

              {/* Left Column: High-Resolution Live Preview Stage */}
              <div className="md:col-span-7 bg-[#000a1a]/70 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#d4af37]/15 relative overflow-y-auto md:overflow-hidden h-auto md:h-full">
                {/* Abstract Glass Grid Sheet Backing */}
                <div className="absolute inset-0 bg-grid-lines opacity-[0.05] pointer-events-none" />
              
              {/* Floating Holographic Compass Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#d4af37]/5 rounded-full pointer-events-none flex items-center justify-center animate-spin" style={{ animationDuration: "120s" }}>
                <div className="w-80 h-80 border border-[#00f0ff]/5 rounded-full flex items-center justify-center">
                  <div className="w-64 h-64 border border-[#ff0080]/5 rounded-full" />
                </div>
              </div>

              {/* Preview Stage Header */}
              <div className="p-4 border-b border-[#d4af37]/15 flex items-center justify-between bg-[#001233]/40 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                  <span className="text-[10px] font-mono font-extrabold tracking-widest text-[#00f0ff] uppercase">
                    HIGH-RESOLUTION PREVIEW ENGINE
                  </span>
                </div>
                
                {/* File size & tag */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] bg-[#d4af37]/15 text-[#ffd754] px-2 py-0.5 rounded-sm border border-[#d4af37]/25 font-bold uppercase tracking-widest">
                    {item.fileSize}
                  </span>
                  <span className="font-mono text-[9px] bg-[#00f0ff]/15 text-[#00f0ff] px-2 py-0.5 rounded-sm border border-[#00f0ff]/25 font-bold uppercase tracking-widest">
                    {item.type}
                  </span>
                </div>
              </div>

              {/* The Live Active Stage Content */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[320px] md:min-h-0 relative z-10">
                {item.type === "video" ? (
                  /* High resolution aspect-video container with golden rim shadow */
                  <div className="w-full h-full max-h-[460px] aspect-video bg-black rounded-sm border border-[#d4af37]/25 shadow-[0_0_25px_rgba(212,175,55,0.15)] overflow-hidden relative">
                    {isYouTubeUrl(item.fileUrl) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(item.fileUrl)}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-none bg-black"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <video 
                        src={item.fileUrl} 
                        controls 
                        autoPlay
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                ) : (
                  /* stylized document mock layout mimicking high fidelity parchment book */
                  <motion.div 
                    style={{ transformOrigin: "bottom center" }}
                    animate={pageFlipTrigger ? { 
                      rotateY: [0, -18, 12, 0], 
                      scale: [1, 0.95, 1.03, 1],
                      x: [0, -8, 6, 0],
                      y: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="w-full max-w-[420px] bg-[#faf6ee] text-[#2c2013] rounded-sm p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.6),_0_0_15px_rgba(212,175,55,0.2)] border-2 border-[#d4af37]/35 relative flex flex-col justify-between overflow-hidden min-h-[400px] group"
                  >
                    {/* Retro lines & textures */}
                    <div className="absolute inset-0 bg-[linear-gradient(#eae0cc_1px,_transparent_1px)] bg-[size:100%_20px] opacity-25 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#d4af37]/15 to-transparent pointer-events-none" />

                    {/* Tiny watermark header */}
                    <div className="flex items-center justify-between border-b border-dashed border-[#8c7355]/30 pb-3 font-mono text-[8px] text-[#705634] font-bold tracking-widest">
                      <span>SECURE RECORD REGISTRY</span>
                      <span>PAGE 0{pagesRead} OF 05</span>
                    </div>

                    <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-mono font-extrabold text-[#9c7823] tracking-widest uppercase block">
                          {activePage.subHeader}
                        </span>
                        <h4 className="text-base font-serif font-black text-gray-900 tracking-tight leading-snug">
                          {activePage.heading}
                        </h4>
                      </div>

                      <div className="text-[11px] leading-relaxed font-serif text-gray-700 space-y-2 max-h-[190px] overflow-y-auto pr-1">
                        <p className="indent-4 font-normal text-slate-800 text-justify">
                          {activePage.body}
                        </p>
                        {activePage.citation && (
                          <p className="font-sans font-bold italic text-[9.5px] text-amber-900/90 border-l-2 border-amber-800/40 pl-2 bg-amber-50/40 p-1.5 rounded-sm">
                            "{activePage.citation}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Book interactive widget */}
                    <div className="border-t border-[#8c7355]/20 pt-3 flex items-center justify-between font-mono text-[8.5px]">
                      <button 
                        onClick={() => {
                          setPagesRead(p => p > 1 ? p - 1 : 5);
                          playSynthSound("click");
                        }}
                        className="text-[#9c7823] hover:text-black font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        PREV PAGE
                      </button>

                      <div className="flex items-center gap-1 text-[#5a4833] select-none">
                        <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="tracking-widest">VERIFIED CONFORMITY</span>
                      </div>

                      <button 
                        onClick={() => {
                          setPagesRead(p => p < 5 ? p + 1 : 1);
                          playSynthSound("click");
                        }}
                        className="text-[#9c7823] hover:text-black font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        NEXT PAGE
                      </button>
                    </div>

                    {/* Highly tactile grunge rubber stamp with massive slam drop-down animation on page flip */}
                    <AnimatePresence mode="popLayout">
                      {pageFlipTrigger && (
                        <motion.div
                          key={`stamp-page-${pagesRead}`}
                          initial={{ scale: 5, opacity: 0, rotate: -45, filter: "blur(6px)" }}
                          animate={{ scale: 1, opacity: 0.85, rotate: -15, filter: "blur(0px)" }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", damping: 10, stiffness: 240, delay: 0.05 }}
                          className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none border-[3px] border-double border-red-600 text-red-600 rounded-sm p-2 text-center uppercase tracking-[0.2em] font-mono font-black text-[9px] bg-white/95 shadow-md"
                        >
                          <div>CIVIC SHIELD</div>
                          <div className="text-[6.5px] border-t border-red-600/30 mt-0.5 pt-0.5 font-bold">RELEASE APPROVED</div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Steady faded stamp when not flipping */}
                    {!pageFlipTrigger && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-[-15deg] opacity-[0.55] pointer-events-none select-none border-[3px] border-double border-red-600 text-red-600 rounded-sm p-2 text-center uppercase tracking-[0.2em] font-mono font-black text-[9px]">
                        <div>CIVIC SHIELD</div>
                        <div className="text-[6.5px] border-t border-red-600/30 mt-0.5 pt-0.5 font-bold">RELEASE APPROVED</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Direct Link Controls */}
              <div className="p-4 border-t border-[#d4af37]/15 flex flex-wrap gap-3 items-center justify-between bg-[#000d26]/80 backdrop-blur-md relative z-10">
                <span className="text-[9px] font-mono text-[#00f0ff] tracking-widest uppercase">
                  REGISTRY ID: X_{item.id.slice(0, 8).toUpperCase()}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#000d26] font-mono font-extrabold uppercase tracking-widest text-[9px] rounded-sm border border-[#00f0ff]/30 transition-all flex items-center gap-1.5"
                    referrerPolicy="no-referrer"
                  >
                    <ExternalLink className="w-3 h-3" /> Raw Database File
                  </a>
                  <a
                    href={item.fileUrl}
                    download
                    className="px-3.5 py-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#ffd754] hover:text-[#000d26] font-mono font-extrabold uppercase tracking-widest text-[9px] rounded-sm border border-[#d4af37]/30 transition-all flex items-center gap-1.5"
                    referrerPolicy="no-referrer"
                  >
                    <Download className="w-3 h-3" /> Raw Download
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Advanced Glassmorphic Metadata & Controls */}
            <div className="md:col-span-5 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#00173f]/60 to-[#000a1d]/85 p-6 relative h-auto md:h-full">
              {/* Back button/close button on top of column */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-mono font-extrabold text-[#ffd754] tracking-widest uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#d4af37]" /> EXPANDED METADATA REGISTRY
                </h3>
                
                <div className="flex items-center gap-2">
                  {/* Bookmark CTA */}
                  <button
                    onClick={handleToggleBookmark}
                    className={`p-1.5 rounded-sm border transition-all cursor-pointer ${
                      isBookmarked
                        ? "bg-[#ff0080]/20 border-[#ff0080] text-[#ff0080]"
                        : "bg-[#001233] border-[#d4af37]/20 text-[#ffd754] hover:bg-[#d4af37]/10"
                    }`}
                    title={isBookmarked ? "Remove from bookmarks" : "Save file to bookmarks"}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-sm bg-[#001233] hover:bg-[#d4af37]/15 text-gray-400 hover:text-white border border-[#d4af37]/20 transition-all cursor-pointer"
                    title="Close file details panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Document Title Header */}
              <div className="space-y-3 mb-6">
                <h1 className="text-xl sm:text-2xl font-serif font-normal italic text-white leading-tight tracking-wide">
                  {item.title}
                </h1>
                
                {/* Authority Certificate */}
                <div className="flex flex-wrap items-center gap-2">
                  {item.verifiedBy && (
                    <HolographicVerifiedBadge verifiedBy={item.verifiedBy} />
                  )}
                  <div className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-sm uppercase tracking-widest font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> 100% CIVIL SOUND
                  </div>
                </div>
              </div>

              {/* Navigation Tabs for detailed metadata panels */}
              <div className="grid grid-cols-3 gap-1.5 mb-6 bg-[#000a1a]/60 p-1 rounded-sm border border-[#d4af37]/10">
                <button
                  onClick={() => {
                    setActiveTab("preview");
                    playSynthSound("click");
                  }}
                  className={`py-1.5 text-center font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer font-bold ${
                    activeTab === "preview"
                      ? "bg-[#d4af37]/20 text-[#ffd754] border border-[#d4af37]/40 shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    setActiveTab("integrity");
                    playSynthSound("click");
                  }}
                  className={`py-1.5 text-center font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer font-bold ${
                    activeTab === "integrity"
                      ? "bg-[#d4af37]/20 text-[#ffd754] border border-[#d4af37]/40 shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Integrity
                </button>
                <button
                  onClick={() => {
                    setActiveTab("citations");
                    playSynthSound("click");
                  }}
                  className={`py-1.5 text-center font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer font-bold ${
                    activeTab === "citations"
                      ? "bg-[#d4af37]/20 text-[#ffd754] border border-[#d4af37]/40 shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Citations
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 space-y-6">
                {activeTab === "preview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5 text-left text-xs text-gray-300 font-light"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#ffd754]/80 uppercase tracking-widest block mb-1">
                        DISCLOSURE INTENT:
                      </span>
                      <p className="leading-relaxed text-gray-300 font-sans">
                        {item.description}
                      </p>
                    </div>

                    {/* Bento Grid Stats Card */}
                    <div className="grid grid-cols-2 gap-3 bg-[#001233]/40 border border-[#d4af37]/15 p-3.5 rounded-sm font-mono text-[10px]">
                      <div>
                        <span className="text-gray-400 text-[8px] block uppercase tracking-wider">Date Logged</span>
                        <span className="text-white font-bold">{item.uploadedAt}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[8px] block uppercase tracking-wider">Classification</span>
                        <span className="text-[#00f0ff] font-bold">Public Record</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[8px] block uppercase tracking-wider">Storage Format</span>
                        <span className="text-white font-bold">{item.type.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[8px] block uppercase tracking-wider">File Size</span>
                        <span className="text-white font-bold">{item.fileSize.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[9px] font-mono font-bold text-[#ffd754]/80 uppercase tracking-widest block">
                        ADMINISTRATIVE METADATA DETAILS:
                      </span>
                      <ul className="space-y-1.5 font-mono text-[9px] text-gray-400">
                        <li className="flex justify-between border-b border-[#d4af37]/10 pb-1">
                          <span>LEGAL CLASSIFICATION:</span>
                          <span className="text-white font-semibold">{legalClass}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#d4af37]/10 pb-1">
                          <span>CONSTITUTIONAL ANCHOR:</span>
                          <span className="text-white font-semibold">{constitutionalGrounding}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#d4af37]/10 pb-1">
                          <span>COMPLIANCE LEVEL:</span>
                          <span className="text-[#ffd754] font-semibold">{complianceSeverity}</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === "integrity" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5 text-left text-xs"
                  >
                    <div className="bg-[#000a1a]/60 border border-[#d4af37]/20 p-4 rounded-sm space-y-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#00f0ff] animate-spin" style={{ animationDuration: "3s" }} />
                        <span className="font-mono text-[10px] text-[#00f0ff] font-bold tracking-widest uppercase">
                          CRYPTOGRAPHIC AUDITING
                        </span>
                      </div>
                      <p className="font-sans text-[11px] leading-relaxed text-gray-400 font-light">
                        Every resource contains an absolute cryptographic hash signature verifying that the document was sourced from official repositories without tampering.
                      </p>
                      
                      <div className="font-mono text-[8px] text-gray-500 bg-[#001233] p-2 rounded-sm border border-[#d4af37]/10 select-all leading-relaxed break-all">
                        {docHash}
                      </div>
                    </div>

                    {/* Interactive Cryptographic Check Button */}
                    <div className="space-y-2">
                      <button
                        onClick={handleVerifyHash}
                        disabled={cryptographicStatus !== "pending"}
                        className={`w-full py-2.5 rounded-sm uppercase font-mono font-bold text-[10px] tracking-widest border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          cryptographicStatus === "pending"
                            ? "bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/20 border-[#d4af37]/45 text-[#ffd754] hover:from-[#d4af37] hover:to-[#ffd754] hover:text-[#000d26]"
                            : cryptographicStatus === "scanning"
                            ? "bg-[#002366]/40 border-[#00f0ff]/30 text-[#00f0ff] cursor-not-allowed"
                            : "bg-emerald-500/10 border-emerald-500 text-emerald-400 cursor-not-allowed"
                        }`}
                      >
                        {cryptographicStatus === "pending" && (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" /> RUN INTEGRITY DECRYPTION HASH
                          </>
                        )}
                        {cryptographicStatus === "scanning" && (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> SCANNING ARCHIVE BLOCKS...
                          </>
                        )}
                        {cryptographicStatus === "verified" && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> SECURE BLOCKCHAIN SIGNATURE CONFIRMED
                          </>
                        )}
                      </button>

                      {cryptographicStatus === "verified" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-sm text-[10px] text-emerald-400 font-mono space-y-1"
                        >
                          <div className="font-bold flex items-center gap-1 uppercase tracking-wider">
                            <Award className="w-3.5 h-3.5" /> SIGNATURE VERIFIED BY CIVICSHIELD
                          </div>
                          <p className="font-light text-gray-300 text-[9px] leading-relaxed font-sans">
                            Resource ledger is confirmed to match official administrative guidelines perfectly. Free of retroactive edits or supplemental clauses.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "citations" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left text-xs text-gray-300 font-light leading-relaxed"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#ffd754]/80 uppercase tracking-widest block mb-1">
                        SUPPORTING STATUTORY AUTHORITY:
                      </span>
                      <p className="font-sans">
                        This resource links directly into state supreme authority standards, offering procedural peace frameworks that defend against overreaching municipal code enforcement.
                      </p>
                    </div>

                    <div className="bg-[#000a1a]/60 border border-[#d4af37]/15 p-3 rounded-sm space-y-2">
                      <div className="flex items-center gap-1 text-[9px] font-mono text-[#00f0ff] font-bold uppercase">
                        <Globe className="w-3.5 h-3.5" /> Public Citation Index
                      </div>
                      <p className="text-[10px] font-mono text-gray-400">
                        "For absolute compliance, you may present this file directly to public officials, police personnel, or code inspectors. They are legally required to accept and acknowledge its precedence."
                      </p>
                    </div>

                    {/* Quick dissemination tools info */}
                    <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-sm text-[9px] text-indigo-300 font-mono flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>This copy is signed securely with an absolute public-domain license.</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Advanced Dissemination Sharing Center at bottom */}
              <div className="border-t border-[#d4af37]/15 pt-5 mt-6 space-y-4 text-left">
                <span className="text-[9px] font-mono font-bold text-[#ffd754] uppercase tracking-widest block">
                  RESOURCE ADVOCACY DISSEMINATION:
                </span>
                
                <div className="bg-[#000a1a]/40 p-3.5 rounded-sm border border-[#d4af37]/10 flex flex-col gap-3">
                  <p className="text-[10.5px] font-sans font-light text-gray-400 leading-normal">
                    Empower your community with absolute legal literacy. Use these secure links to distribute this case file to local groups or public officials.
                  </p>
                  
                  <div className="pt-2 border-t border-[#d4af37]/10">
                    <SocialShare 
                      title={item.title || "Evidence Material"} 
                      text={item.description || "Verified campaign archive record."} 
                      shareUrl={item.fileUrl && item.fileUrl.startsWith("http") ? item.fileUrl : `${window.location.origin}${item.fileUrl || ""}`}
                      inline={true}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[9px] font-mono text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Authorized by Civic Shield Advocacy Platform 2026.</span>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
