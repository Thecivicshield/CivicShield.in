import React from "react";
import { motion } from "motion/react";
import { BookOpen, Sparkles, Shield, Bookmark, ArrowUpRight } from "lucide-react";
import { playSynthSound } from "./JusticeShieldSection";

interface BookWidgetProps {
  onOpenBook: () => void;
  className?: string;
}

export default function BookWidget({ onOpenBook, className = "" }: BookWidgetProps) {
  const handleClick = () => {
    try {
      playSynthSound("success");
    } catch (e) {}
    onOpenBook();
  };

  return (
    <motion.div 
      id="vintage-book-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`relative inline-block ${className}`}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#d4af37]/80 rounded-2xl"
        title="Click to Open the Vintage Compendium of Strategic Goals"
      >
        {/* Ambient Candlelight Warm Glow behind vintage book */}
        <div className="absolute -inset-2.5 bg-gradient-to-r from-[#d4af37]/25 via-[#996515]/20 to-[#4a2e0a]/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Outer Vintage Book Presentation Plinth */}
        <div className="relative flex items-center gap-4.5 bg-gradient-to-br from-[#1a0f07] via-[#2a170a] to-[#120803] p-4 sm:p-5 rounded-2xl border-2 border-[#d4af37]/60 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.25)] group-hover:border-[#ffd754] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(255,215,84,0.4)] transition-all">
          
          {/* Miniature 3D Vintage Hardcover Leather Book */}
          <div className="relative w-20 h-26 sm:w-22 sm:h-28 shrink-0 perspective-[800px]">
            {/* Book Back Cover & Shadow */}
            <div className="absolute inset-0 bg-[#0d0602] rounded-r-md border border-[#8a6020]/40 transform translate-x-1.5 translate-y-1.5 shadow-2xl" />
            
            {/* Aged Gilded Parchment Edge (Pages Stack with realistic textured ribs) */}
            <div className="absolute top-1.5 right-0 bottom-1.5 w-3.5 bg-gradient-to-b from-[#e2c77d] via-[#f7e6a7] to-[#b88f34] rounded-r-sm shadow-[inset_2px_0_4px_rgba(0,0,0,0.4)] border-y border-r border-[#967020] flex flex-col justify-between py-1">
              <div className="w-full h-[1px] bg-[#614510]/30" />
              <div className="w-full h-[1px] bg-[#614510]/30" />
              <div className="w-full h-[1px] bg-[#614510]/30" />
              <div className="w-full h-[1px] bg-[#614510]/30" />
              <div className="w-full h-[1px] bg-[#614510]/30" />
            </div>

            {/* Vintage Ribbed Book Spine (Left rounded edge with raised leather bands) */}
            <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-[#441a08] via-[#66280c] to-[#361304] rounded-l-md border-y border-l border-[#d4af37]/70 z-20 flex flex-col justify-around py-2 items-center shadow-lg">
              <div className="w-full h-[2px] bg-[#ffd754]/70 shadow-sm" />
              <div className="w-full h-[2px] bg-[#ffd754]/70 shadow-sm" />
              <div className="w-full h-[2px] bg-[#ffd754]/70 shadow-sm" />
              <div className="w-full h-[2px] bg-[#ffd754]/70 shadow-sm" />
            </div>

            {/* Book Front Cover (Distressed Antique Leather bound with Gold Filigree) */}
            <div className="absolute inset-0 left-2.5 bg-gradient-to-br from-[#4a1c06] via-[#331102] to-[#1f0900] rounded-r-md border-y border-r border-[#ffd754]/80 p-2 flex flex-col justify-between items-center shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] z-10 overflow-hidden group-hover:brightness-110 transition-all">
              
              {/* Ornate Gold Filigree Corner Brackets */}
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ffd754]" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ffd754]" />
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ffd754]" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ffd754]" />

              {/* Silk Crimson Ribbon Bookmark hanging out at top & bottom */}
              <div className="absolute top-0 right-3.5 w-2 h-7 bg-gradient-to-b from-[#990000] via-[#c41e3a] to-[#730000] border-x border-[#ff6666]/30 shadow-md z-30 transform -rotate-6">
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-transparent border-b-2 border-[#400000]" />
              </div>

              {/* Hot-Stamped Gold Seal / Emblem */}
              <div className="mt-2.5 w-8 h-8 rounded-full bg-gradient-to-b from-[#ffd754] via-[#d4af37] to-[#805e13] p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#260f03] flex items-center justify-center border border-[#ffd754]/60">
                  <Shield className="w-4 h-4 text-[#ffd754] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

              {/* Antique Gilded Book Typography */}
              <div className="text-center w-full pb-1">
                <span className="font-serif text-[7.5px] sm:text-[8.5px] font-black text-[#ffd754] tracking-wider uppercase block leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  CIVIC SHIELD
                </span>
                <span className="font-serif italic text-[6px] sm:text-[7px] text-[#f2e3be] block leading-tight mt-0.5 tracking-tight">
                  Strategic Goals
                </span>
              </div>
            </div>
          </div>

          {/* Vintage Book Description & Open Action */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 text-[#ffd754] text-[10.5px] font-mono font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd754]" />
              <span>Vintage Compendium</span>
            </div>
            
            <h4 className="font-serif font-bold text-white text-base sm:text-lg group-hover:text-[#ffd754] transition-colors leading-snug">
              Book of Strategic Goals
            </h4>
            
            <p className="text-xs text-[#d9cbb4] font-light mt-1 line-clamp-2 leading-relaxed">
              Explore the 6 ratified constitutional mandates, citizen action blueprints & milestones.
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ffd754]/20 border border-[#ffd754]/60 text-[#ffd754] font-mono text-[10px] font-bold uppercase tracking-wider group-hover:bg-[#ffd754] group-hover:text-[#1a0f07] transition-all shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Compendium</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
              <span className="text-[10.5px] font-mono text-[#c2ad82]">
                6 Mandates • Interactive
              </span>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
