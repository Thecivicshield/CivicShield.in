import React, { useEffect, useState } from "react";
import { Shield, Scale, ChevronRight, Sparkles, Users, FileText, CheckCircle2, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntroGateProps {
  onEnter: (sectionId?: string) => void;
  visitorCount?: number;
  subscriberCount?: number;
}

export default function IntroGate({ 
  onEnter, 
  visitorCount = 14892, 
  subscriberCount = 1480 
}: IntroGateProps) {
  const [stage, setStage] = useState<"crest" | "reveal" | "ready">("crest");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 1: Crest draw and glow
    const t1 = setTimeout(() => setStage("reveal"), 900);
    // Stage 2: Full branding and statistics synchronized
    const t2 = setTimeout(() => setStage("ready"), 1900);

    // Progress bar ticker (auto-transition at 100%)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 60);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  const handleEnterClick = (sectionId?: string) => {
    onEnter(sectionId);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#00081a] overflow-hidden z-[100000] select-none flex flex-col justify-between p-6 sm:p-10 font-sans">
      
      {/* Background Soft Atmospheric Radiance */}
      <div className="absolute inset-0 bg-radial-at-c from-[#00173d]/60 via-[#000d26]/80 to-[#00081a] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP BAR: CONSTITUTIONAL JURISDICTION BADGE */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto flex items-center justify-between relative z-20 border-b border-[#d4af37]/20 pb-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffd754] animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs text-[#ffd754] uppercase tracking-[0.25em] font-semibold">
            Civic Shield • Public Literacy Alliance
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Repository Online
          </span>
          <span>Article 21 & 39A Protected</span>
        </div>
      </motion.div>

      {/* CENTER: SYNCHRONIZED CREST, TYPOGRAPHY & MEASURABLE SUCCESS STATS */}
      <div className="max-w-4xl mx-auto w-full my-auto flex flex-col items-center text-center relative z-20 px-4">
        
        {/* SYNCHRONIZED GOLDEN SHIELD & SCALES EMBLEM */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#00173d] to-[#000a1a] border-2 border-[#d4af37] p-4 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.35)] relative group">
            {/* Pulsing Aura Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-[#ffd754]/40"
            />

            <svg className="w-14 h-14 sm:w-16 sm:h-16 text-[#ffd754]" viewBox="0 0 100 100" fill="none">
              {/* Shield Outline */}
              <motion.path
                d="M50 12 L82 24 L82 54 C82 72 68 84 50 88 C32 84 18 72 18 54 L18 24 Z"
                stroke="#D4AF37"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(212, 175, 55, 0.08)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
              {/* Central Scales of Justice */}
              <motion.path
                d="M36 44 L64 44 M50 32 L50 68 M40 68 L60 68 M36 44 L44 54 M64 44 L56 54 M30 54 L44 54 M56 54 L70 54"
                stroke="#FFD754"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </motion.div>

        {/* REFINED BRAND TYPOGRAPHY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[10px] font-mono text-[#ffd754] uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Constitutional Defense & Legal Literacy
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white font-normal tracking-wide">
            CIVIC <span className="text-[#ffd754] font-semibold italic">SHIELD</span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Bridging the gap between citizens and legal authority. Eliminating fear through certified statutory literacy and procedural mastery.
          </p>
        </motion.div>

        {/* MEASURABLE SUCCESS TICKER CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl mb-8"
        >
          <div className="p-3 sm:p-4 rounded-sm bg-[#00173d]/80 border border-[#d4af37]/30 shadow-lg text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-white">
              {visitorCount.toLocaleString()}<span className="text-[#ffd754] text-base">+</span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-gray-300 uppercase tracking-wider mt-0.5">
              Citizens Visited
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-sm bg-[#00173d]/80 border border-[#d4af37]/30 shadow-lg text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#ffd754]">
              {subscriberCount.toLocaleString()}<span className="text-white text-base">+</span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-gray-300 uppercase tracking-wider mt-0.5">
              Advocates Joined
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-sm bg-[#00173d]/80 border border-[#d4af37]/30 shadow-lg text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-white">
              100%
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-gray-300 uppercase tracking-wider mt-0.5">
              Free Legal Aid
            </div>
          </div>
        </motion.div>

        {/* PROMINENT ENTER ACTION BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => handleEnterClick()}
            className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#ffd754] to-[#d4af37] text-[#001026] font-semibold rounded-sm font-serif text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Enter Civic Repository & Archives</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </motion.div>

      </div>

      {/* BOTTOM SYNCHRONIZED PROGRESS TIMER & QUICK BYPASS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400 relative z-20 pt-4 border-t border-[#d4af37]/20"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[10px] text-[#ffd754] uppercase tracking-wider whitespace-nowrap">
            Synchronizing Records:
          </span>
          <div className="w-full sm:w-48 bg-[#001233] h-2 rounded-full overflow-hidden border border-[#d4af37]/30 p-0.5">
            <div 
              className="h-full bg-[#ffd754] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_#ffd754]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => handleEnterClick()}
          className="text-[10px] text-gray-400 hover:text-[#ffd754] underline cursor-pointer uppercase tracking-widest"
        >
          Explore Immediately →
        </button>
      </motion.div>

    </div>
  );
}
