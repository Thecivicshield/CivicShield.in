import React, { useState } from "react";
import { Trees, Coins, Scale, ShieldAlert, Landmark, Eye, FileText, LucideIcon, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Pillar {
  title: string;
  description: string;
  iconName: string;
}

interface PillarsSectionProps {
  key?: string;
  pillars: Pillar[];
  isAdmin: boolean;
  onUpdatePillar: (index: number, updated: Pillar) => void;
  accentColor: string;
}

const IconMap: { [key: string]: LucideIcon } = {
  Trees,
  Coins,
  Scale,
  ShieldAlert,
  Landmark,
  Eye,
  FileText
};

export default function PillarsSection({ pillars, isAdmin, onUpdatePillar, accentColor }: PillarsSectionProps) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const handleTextChange = (index: number, key: keyof Pillar, val: string) => {
    const updated = { ...pillars[index], [key]: val };
    onUpdatePillar(index, updated);
  };

  const handlePageChange = (newIndex: number) => {
    if (newIndex === activePageIndex || isFlipping) return;
    
    // Sound effects removed by user request

    setFlipDirection(newIndex > activePageIndex ? "next" : "prev");
    setIsFlipping(true);
    
    // Smooth timing for page flip animation
    setTimeout(() => {
      setActivePageIndex(newIndex);
    }, 180);

    setTimeout(() => {
      setIsFlipping(false);
    }, 450);
  };

  const activePillar = pillars[activePageIndex] || pillars[0];
  const ActiveIcon = IconMap[activePillar.iconName] || Scale;

  return (
    <motion.section 
      id="pillars" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001233] border-t border-b border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Decorative Blueprint elements */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#d4af37]/10 pointer-events-none" />
      <div className="absolute top-12 left-12 font-mono text-[7px] text-[#d4af37]/30 tracking-widest hidden lg:block">
        BOOK_ID: STATUTORY_CONSTITUTION_v4
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Interactive Constitutional Archive
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-4">
            The Ledger of <span className="text-[#d4af37] font-serif not-italic font-bold">Sovereign Core Goals</span>
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Flip through the sovereign core goals of our movement. Click a goal index on the Left Page to trigger a mechanical page turn revealing the specific strategic charter.
          </p>
        </div>

        {/* INTERACTIVE BOOK STRUCTURE */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#000a1a] via-[#051126] to-[#000a1a] border-y-4 md:border-4 border-[#d4af37]/60 rounded-md p-4 sm:p-8 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] min-h-[460px] md:min-h-[520px] flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 md:perspective-[1500px]">
            
            {/* Book Spine Center Gutter */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-6 bg-gradient-to-r from-black/40 via-black/80 to-black/40 border-x border-[#d4af37]/10 z-20 shadow-inner" />
            
            {/* Left Page: Table of Contents & Goal Selector */}
            <div className="flex flex-col justify-between pr-0 md:pr-6 z-10">
              <div className="space-y-6">
                <div className="border-b border-[#d4af37]/20 pb-3">
                  <p className="font-mono text-[9px] text-[#d4af37] tracking-[0.25em] uppercase">INDEX OF CORE MISSIONS</p>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">Sovereign Goals Index</h3>
                </div>

                <div className="space-y-3.5">
                  {pillars.map((pillar, idx) => {
                    const ChapterIcon = IconMap[pillar.iconName] || Scale;
                    const isActive = idx === activePageIndex;

                    return (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(idx)}
                        className={`w-full text-left p-3.5 rounded-sm border transition-all duration-300 flex items-center gap-3.5 cursor-pointer ${
                          isActive
                            ? "bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-[0_5px_15px_rgba(212,175,55,0.15)]"
                            : "bg-black/50 border-gray-800 text-gray-300 hover:border-[#d4af37]/30 hover:text-white"
                        }`}
                      >
                        <div className={`p-1.5 rounded-sm ${isActive ? "bg-black/10 text-black" : "bg-[#d4af37]/10 text-[#d4af37]"}`}>
                          <ChapterIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-mono text-[8px] opacity-75">GOAL 0{idx + 1}</p>
                          <p className="text-xs tracking-wide uppercase font-semibold">{pillar.title}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "translate-x-1" : "opacity-40"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Book footer information */}
              <div className="pt-6 border-t border-gray-900 mt-6 flex justify-between items-center font-mono text-[9px] text-gray-500">
                <span>VOL. III (CON-CIVIC)</span>
                <span>LEFT PAGE_01</span>
              </div>
            </div>

            {/* Right Page: Selected Goal Content (with page flip animation) */}
            <div className="relative pl-0 md:pl-6 z-10 flex flex-col justify-between min-h-[280px]">
              
              {/* PAGE FLIPPING CONTAINER */}
              <div className="relative flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePageIndex}
                    initial={{
                      opacity: 0.1,
                      rotateY: flipDirection === "next" ? 85 : -85,
                      transformOrigin: flipDirection === "next" ? "left center" : "right center"
                    }}
                    animate={{
                      opacity: 1,
                      rotateY: 0
                    }}
                    exit={{
                      opacity: 0.1,
                      rotateY: flipDirection === "next" ? -85 : 85,
                      transformOrigin: flipDirection === "next" ? "right center" : "left center"
                    }}
                    transition={{ duration: 0.38, ease: "easeInOut" }}
                    className="space-y-5 h-full flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Goal Title Badge */}
                      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/25 rounded-sm text-[#d4af37]">
                            <ActiveIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-mono text-[8px] text-[#d4af37] tracking-widest">GOAL SECTION 0{activePageIndex + 1}</p>
                            <p className="text-[10px] font-mono text-gray-400">UNSEALED PRESERVER CODE</p>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">CS_GOAL_0{activePageIndex + 1}</span>
                      </div>

                      {/* Content Form Block (Editable if Admin Mode is enabled) */}
                      <div className="space-y-4">
                        {isAdmin ? (
                          <div className="space-y-2">
                            <label className="font-mono text-[9px] text-[#d4af37] block">GOAL TITLE</label>
                            <input
                              type="text"
                              value={activePillar.title}
                              onChange={(e) => handleTextChange(activePageIndex, "title", e.target.value)}
                              className="w-full bg-[#001a4d] text-sm font-bold text-white mb-2 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2.5 py-1.5"
                            />
                          </div>
                        ) : (
                          <h4 className="text-lg font-serif text-[#d4af37] font-semibold tracking-wide">
                            {activePillar.title}
                          </h4>
                        )}

                        {isAdmin ? (
                          <div className="space-y-2">
                            <label className="font-mono text-[9px] text-[#d4af37] block">GOAL CONTENT BODY</label>
                            <textarea
                              value={activePillar.description}
                              onChange={(e) => handleTextChange(activePageIndex, "description", e.target.value)}
                              rows={5}
                              className="w-full bg-[#001a4d] text-xs text-gray-200 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2.5 py-1.5 font-sans leading-relaxed"
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-200 font-sans leading-relaxed font-light whitespace-pre-line">
                            {activePillar.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="text-[9.5px] font-mono text-[#d4af37]/65 italic animate-pulse">
                        ✏️ Real-time updates active. Type above to edit goal records.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Page Number Right page */}
              <div className="pt-6 border-t border-gray-900 flex justify-between items-center font-mono text-[9px] text-gray-500">
                <span>CIVIC_SHIELD_HANDBOOK_ACT</span>
                <span>RIGHT PAGE_02</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.section>
  );
}
