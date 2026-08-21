import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, FileText, CheckCircle2, ChevronRight, Sparkles, Shield, Bookmark, Scale, Download, Newspaper, X, Eye } from "lucide-react";
import { playSynthSound } from "./JusticeShieldSection";

interface FilingCabinetSectionProps {
  activeTab: "study" | "vault" | "dispatch";
  onSelectTab: (tab: "study" | "vault" | "dispatch") => void;
  children: React.ReactNode;
}

export default function FilingCabinetSection({
  activeTab,
  onSelectTab,
  children
}: FilingCabinetSectionProps) {
  const [goldCardPopup, setGoldCardPopup] = useState<{
    visible: boolean;
    title: string;
    sub: string;
    code: string;
    stamp: string;
  } | null>(null);

  const getTabDetails = (tab: "study" | "vault" | "dispatch") => {
    switch (tab) {
      case "study":
        return {
          title: "DRAWER I: STUDY CENTER",
          code: "FILE-ARCHIVE-001 // SEC-A",
          sub: "Mission Axioms, Foundational Pillars & Constitutional Network",
          stamp: "VERIFIED MANDATES",
          badgeColor: "border-[#d4af37] text-[#ffd754]",
          desc: "Unsealed constitutional records and citizen legal literacy foundations."
        };
      case "vault":
        return {
          title: "DRAWER II: EVIDENCE VAULT",
          code: "FILE-ARCHIVE-002 // SEC-B",
          sub: "Official Handouts, Justice Shield Simulator & Civic Metrics",
          stamp: "CERTIFIED EVIDENCE",
          badgeColor: "border-emerald-500 text-emerald-300",
          desc: "Tested court filing templates, interactive scenario simulators, and impact data."
        };
      case "dispatch":
        return {
          title: "DRAWER III: DISPATCH ROOM",
          code: "FILE-ARCHIVE-003 // SEC-C",
          sub: "Campaign Chronicles, Roadmap & Sovereign Gazette",
          stamp: "PUBLIC RECORD",
          badgeColor: "border-sky-500 text-sky-300",
          desc: "Recent articles, campaign milestones, community broadcasts, and public briefings."
        };
    }
  };

  const handleTabChange = (tab: "study" | "vault" | "dispatch") => {
    try {
      playSynthSound("click");
    } catch (e) {}
    onSelectTab(tab);

    const details = getTabDetails(tab);
    setGoldCardPopup({
      visible: true,
      title: details.title,
      sub: details.sub,
      code: details.code,
      stamp: details.stamp
    });
  };

  // Auto-dismiss the gold card after 4.5 seconds if not clicked
  useEffect(() => {
    if (goldCardPopup?.visible) {
      const timer = setTimeout(() => {
        setGoldCardPopup(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [goldCardPopup]);

  const currentDetails = getTabDetails(activeTab);

  return (
    <div id="cabinet-stage" className="scroll-mt-24">
      <div id="filing-cabinet-container" className="max-w-6xl mx-auto px-3 sm:px-6 my-12 relative z-20">
      
      {/* Central Records Office Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd754] font-mono text-[10px] uppercase tracking-[0.25em] mb-2 font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CIVIC SHIELD CENTRAL RECORD OFFICE</span>
        </div>
        <h3 className="font-serif italic text-2xl sm:text-3xl text-white">
          Filing Cabinet & Evidence Drawers
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 font-light mt-1.5 max-w-xl mx-auto">
          Click any drawer handle to pull open the compartment and inspect unsealed case dossiers.
        </p>
      </div>

      {/* FLOATING GOLD CARD POP-UP MODAL (When drawer is clicked) */}
      <AnimatePresence>
        {goldCardPopup?.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.25 } }}
            onClick={() => setGoldCardPopup(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer select-none"
          >
            <motion.div
              initial={{ rotateX: 20 }}
              animate={{ rotateX: 0 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#ffd978] via-[#e6be53] to-[#b38827] text-[#1a1202] border-4 border-[#fff3b0] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(255,217,120,0.6)] cursor-pointer overflow-hidden transform hover:scale-[1.02] transition-transform"
            >
              {/* Metallic gold shimmer wave */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-[shimmerSweep_3s_infinite_ease-in-out] pointer-events-none" />

              {/* Gold Card Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 rounded bg-[#1a1202] text-[#ffd978] text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                  ★ UNSEALED CASE DOSSIER
                </div>
                <div className="text-[10px] font-mono font-bold text-[#422e08] tracking-widest uppercase">
                  {goldCardPopup.code}
                </div>
              </div>

              {/* Prominent Gold Drawer Title */}
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#1a1202] tracking-tight leading-tight mb-2">
                {goldCardPopup.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#3b2907] font-medium leading-relaxed mb-6 font-sans">
                {goldCardPopup.sub}
              </p>

              {/* Stamp */}
              <div className="flex items-center justify-between pt-4 border-t border-[#8f6a1d]/30 text-[11px] font-mono font-semibold text-[#3b2907]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
                  <span>★ {goldCardPopup.stamp}</span>
                </div>
              </div>

              {/* Animated auto-dismiss progress bar indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#8f6a1d]/30 overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  className="h-full bg-[#1a1202]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D BRASS & STEEL FILING CABINET CHASSIS */}
      <div className="relative bg-gradient-to-b from-[#0a1528] via-[#050c17] to-[#02050a] p-4 sm:p-6 rounded-2xl border-2 border-[#d4af37]/50 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.2)]">
        
        {/* Top Cabinet Bezel with Rivets */}
        <div className="flex items-center justify-between px-2 pb-4 mb-4 border-b border-[#d4af37]/25">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ffd754] animate-pulse" />
            <span className="font-mono text-[10px] text-[#ffd754] uppercase tracking-widest font-bold">
              3-TIER SOVEREIGN CABINET // SYSTEM ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider hidden sm:inline">
              INDEX: 1950-2026 CONSTITUTIONAL REPOSITORY
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]/50 shadow-inner" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]/50 shadow-inner" />
          </div>
        </div>

        {/* 3 Drawer Compartment Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-8">
          
          {/* I. STUDY CENTER DRAWER */}
          <button
            id="cabinet-drawer-study"
            type="button"
            onClick={() => handleTabChange("study")}
            className={`group relative p-4 rounded-xl text-left transition-all cursor-pointer border overflow-hidden ${
              activeTab === "study"
                ? "bg-gradient-to-b from-[#1b2b48] via-[#0f1d33] to-[#091120] border-[#ffd754] shadow-[0_0_25px_rgba(212,175,55,0.4)] ring-2 ring-[#ffd754]/40 translate-y-[-2px]"
                : "bg-[#030914]/80 border-slate-800/80 text-gray-400 hover:border-[#d4af37]/40 hover:text-white hover:bg-[#08152c]"
            }`}
          >
            {/* Drawer Pull Handle (Brass Hardware Visual) */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-16 h-3 rounded-b-md border-b-2 border-x-2 transition-all shadow-md ${
                activeTab === "study" 
                  ? "bg-gradient-to-r from-[#d4af37] via-[#ffd754] to-[#d4af37] border-[#fff3b0]" 
                  : "bg-[#182333] border-slate-700 group-hover:border-[#d4af37]/60"
              }`} />
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${
                activeTab === "study" ? "bg-[#ffd754]/20 border-[#ffd754] text-[#ffd754]" : "bg-black/40 border-slate-800 text-gray-500"
              }`}>
                01
              </span>
            </div>

            {/* Label Card Plaque */}
            <div className="space-y-0.5">
              <h4 className={`font-serif font-bold text-sm sm:text-base leading-tight ${
                activeTab === "study" ? "text-[#ffd754]" : "text-gray-200 group-hover:text-white"
              }`}>
                I. Study Center
              </h4>
              <p className="text-[11px] text-gray-400 font-light truncate">
                Mission Axioms & Network
              </p>
            </div>

            {/* Status indicator bar */}
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className={activeTab === "study" ? "text-[#ffd754] font-bold" : "text-gray-500"}>
                {activeTab === "study" ? "DRAWER PULLED OPEN" : "CLICK TO UNSEAL"}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "study" ? "text-[#ffd754] translate-x-1" : "text-gray-600"}`} />
            </div>
          </button>

          {/* II. EVIDENCE ROOM DRAWER */}
          <button
            id="cabinet-drawer-vault"
            type="button"
            onClick={() => handleTabChange("vault")}
            className={`group relative p-4 rounded-xl text-left transition-all cursor-pointer border overflow-hidden ${
              activeTab === "vault"
                ? "bg-gradient-to-b from-[#1b2b48] via-[#0f1d33] to-[#091120] border-[#ffd754] shadow-[0_0_25px_rgba(212,175,55,0.4)] ring-2 ring-[#ffd754]/40 translate-y-[-2px]"
                : "bg-[#030914]/80 border-slate-800/80 text-gray-400 hover:border-[#d4af37]/40 hover:text-white hover:bg-[#08152c]"
            }`}
          >
            {/* Drawer Pull Handle (Brass Hardware Visual) */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-16 h-3 rounded-b-md border-b-2 border-x-2 transition-all shadow-md ${
                activeTab === "vault" 
                  ? "bg-gradient-to-r from-[#d4af37] via-[#ffd754] to-[#d4af37] border-[#fff3b0]" 
                  : "bg-[#182333] border-slate-700 group-hover:border-[#d4af37]/60"
              }`} />
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${
                activeTab === "vault" ? "bg-[#ffd754]/20 border-[#ffd754] text-[#ffd754]" : "bg-black/40 border-slate-800 text-gray-500"
              }`}>
                02
              </span>
            </div>

            {/* Label Card Plaque */}
            <div className="space-y-0.5">
              <h4 className={`font-serif font-bold text-sm sm:text-base leading-tight ${
                activeTab === "vault" ? "text-[#ffd754]" : "text-gray-200 group-hover:text-white"
              }`}>
                II. Evidence Vault
              </h4>
              <p className="text-[11px] text-gray-400 font-light truncate">
                Handouts, Simulator & Metrics
              </p>
            </div>

            {/* Status indicator bar */}
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className={activeTab === "vault" ? "text-[#ffd754] font-bold" : "text-gray-500"}>
                {activeTab === "vault" ? "DRAWER PULLED OPEN" : "CLICK TO UNSEAL"}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "vault" ? "text-[#ffd754] translate-x-1" : "text-gray-600"}`} />
            </div>
          </button>

          {/* III. DISPATCH ROOM DRAWER */}
          <button
            id="cabinet-drawer-dispatch"
            type="button"
            onClick={() => handleTabChange("dispatch")}
            className={`group relative p-4 rounded-xl text-left transition-all cursor-pointer border overflow-hidden ${
              activeTab === "dispatch"
                ? "bg-gradient-to-b from-[#1b2b48] via-[#0f1d33] to-[#091120] border-[#ffd754] shadow-[0_0_25px_rgba(212,175,55,0.4)] ring-2 ring-[#ffd754]/40 translate-y-[-2px]"
                : "bg-[#030914]/80 border-slate-800/80 text-gray-400 hover:border-[#d4af37]/40 hover:text-white hover:bg-[#08152c]"
            }`}
          >
            {/* Drawer Pull Handle (Brass Hardware Visual) */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-16 h-3 rounded-b-md border-b-2 border-x-2 transition-all shadow-md ${
                activeTab === "dispatch" 
                  ? "bg-gradient-to-r from-[#d4af37] via-[#ffd754] to-[#d4af37] border-[#fff3b0]" 
                  : "bg-[#182333] border-slate-700 group-hover:border-[#d4af37]/60"
              }`} />
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${
                activeTab === "dispatch" ? "bg-[#ffd754]/20 border-[#ffd754] text-[#ffd754]" : "bg-black/40 border-slate-800 text-gray-500"
              }`}>
                03
              </span>
            </div>

            {/* Label Card Plaque */}
            <div className="space-y-0.5">
              <h4 className={`font-serif font-bold text-sm sm:text-base leading-tight ${
                activeTab === "dispatch" ? "text-[#ffd754]" : "text-gray-200 group-hover:text-white"
              }`}>
                III. Dispatch Room
              </h4>
              <p className="text-[11px] text-gray-400 font-light truncate">
                Chronicles, Roadmap & Gazette
              </p>
            </div>

            {/* Status indicator bar */}
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className={activeTab === "dispatch" ? "text-[#ffd754] font-bold" : "text-gray-500"}>
                {activeTab === "dispatch" ? "DRAWER PULLED OPEN" : "CLICK TO UNSEAL"}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "dispatch" ? "text-[#ffd754] translate-x-1" : "text-gray-600"}`} />
            </div>
          </button>
        </div>

        {/* AUTHENTIC MANILA FILE FOLDER POP-UP BANNER STAGE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 45, scale: 0.95, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.96, rotateX: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 180 }}
            className="perspective-[1000px] mb-8"
          >
            {/* Manila Folder Envelope Appearance */}
            <div className="relative bg-gradient-to-br from-[#eddcb4] via-[#e5d0a2] to-[#d4bc87] text-[#2c1f0e] rounded-xl border-2 border-[#b59556] shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.3)] p-4 sm:p-6 overflow-hidden">
              
              {/* Manila Folder Tab Top */}
              <div className="absolute top-0 left-6 sm:left-10 bg-[#d8be8a] px-4 py-1 rounded-b-md border-b-2 border-x-2 border-[#b59556] text-[9.5px] font-mono font-bold uppercase tracking-widest text-[#523b18] shadow-sm">
                {currentDetails.code}
              </div>

              {/* Red/Crimson Unsealed Stamp in Top Right */}
              <div className="absolute top-3 right-4 sm:right-6 border-2 border-red-800/80 text-red-900 px-3 py-1 rounded-sm text-[10px] font-mono font-black uppercase tracking-widest transform rotate-3 bg-red-100/30 select-none shadow-sm">
                ★ {currentDetails.stamp} ★
              </div>

              {/* Folder Interior Content Header */}
              <div className="pt-4 sm:pt-3 space-y-2">
                <div className="flex items-center gap-2 text-[10.5px] font-mono text-[#6e5022] uppercase font-bold tracking-wider">
                  <Folder className="w-4 h-4 text-[#8a6428]" />
                  <span>{currentDetails.title}</span>
                </div>

                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#1f1508] tracking-tight">
                  {currentDetails.sub}
                </h3>

                <p className="text-xs sm:text-sm text-[#473315] font-sans font-normal max-w-3xl leading-relaxed">
                  {currentDetails.desc}
                </p>
              </div>

              {/* File Fastener Decorative Rivets */}
              <div className="mt-4 pt-3 border-t border-[#c4a977] flex items-center justify-between text-[10px] font-mono text-[#6e5022]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8a6428]/40 border border-[#8a6428]" />
                  <span>SECURE CASE RECORD UNSEALED</span>
                </div>
                <span>DOSSIER READY • SCROLL DOWN TO INSPECT</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* DRAWER INTERIOR STAGE: Unfolds child components (Pillars, Evidence, Dispatch, etc.) */}
        <div id="drawer-inner-content" className="space-y-12">
          {children}
        </div>

      </div>
    </div>
    </div>
  );
}
