import React, { useEffect, useState } from "react";
import { ChevronRight, Sparkles, CheckCircle2, Shield, Scale } from "lucide-react";
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
  const [progress, setProgress] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Progress ticker
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleEnterClick = (sectionId?: string) => {
    if (isOpening) return;
    setSelectedSection(sectionId);
    setIsOpening(true);

    // Give time for the shield split & golden gate doors parting animation to play fully
    setTimeout(() => {
      onEnter(sectionId);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#00081a] overflow-hidden z-[100000] select-none font-sans">
      
      {/* CENTRAL GOLDEN LIGHT BEAM REVEAL WHEN OPENING */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0.1 }}
            animate={{ opacity: [0, 1, 0.8, 0], scaleX: [0.1, 4, 25, 40] }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-[#ffd754] to-transparent z-[100005] pointer-events-none blur-sm"
          />
        )}
      </AnimatePresence>

      {/* LEFT DOOR / WING */}
      <motion.div
        animate={isOpening ? { x: "-100%", opacity: 0.9 } : { x: "0%", opacity: 1 }}
        transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#00081a] via-[#000d26] to-[#00173d] border-r border-[#d4af37]/40 z-30 flex items-center justify-end overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
      >
        {/* Left background ambient glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Left Half of Majestic Golden Shield */}
        <div className="relative w-36 h-72 sm:w-48 sm:h-96 flex items-center justify-end pr-0 mr-[-1px]">
          <svg className="w-72 h-72 sm:w-96 sm:h-96 text-[#ffd754] absolute right-0" viewBox="0 0 100 100" fill="none">
            <defs>
              <clipPath id="leftGateClip">
                <rect x="0" y="0" width="50" height="100" />
              </clipPath>
              <linearGradient id="goldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#ffd754" />
                <stop offset="100%" stopColor="#997a15" />
              </linearGradient>
            </defs>
            
            <g clipPath="url(#leftGateClip)">
              {/* Outer Shield Path Drawing */}
              <motion.path
                d="M50 10 L84 22 L84 54 C84 74 68 88 50 92 C32 88 16 74 16 54 L16 22 Z"
                stroke="url(#goldGradLeft)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(212, 175, 55, 0.12)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />

              {/* Inner Concentric Shield Rim */}
              <motion.path
                d="M50 18 L76 28 L76 52 C76 68 64 78 50 82 C36 78 24 68 24 52 L24 28 Z"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Left Side Scales of Justice */}
              <motion.path
                d="M50 30 L50 72 M34 44 L50 44 M34 44 L28 56 M34 44 L40 56 M24 56 L44 56"
                stroke="#ffd754"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* RIGHT DOOR / WING */}
      <motion.div
        animate={isOpening ? { x: "100%", opacity: 0.9 } : { x: "0%", opacity: 1 }}
        transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#00081a] via-[#000d26] to-[#00173d] border-l border-[#d4af37]/40 z-30 flex items-center justify-start overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
      >
        {/* Right background ambient glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Right Half of Majestic Golden Shield */}
        <div className="relative w-36 h-72 sm:w-48 sm:h-96 flex items-center justify-start pl-0 ml-[-1px]">
          <svg className="w-72 h-72 sm:w-96 sm:h-96 text-[#ffd754] absolute left-0" viewBox="0 0 100 100" fill="none">
            <defs>
              <clipPath id="rightGateClip">
                <rect x="50" y="0" width="50" height="100" />
              </clipPath>
              <linearGradient id="goldGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#997a15" />
                <stop offset="50%" stopColor="#ffd754" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
            
            <g clipPath="url(#rightGateClip)">
              {/* Outer Shield Path Drawing */}
              <motion.path
                d="M50 10 L84 22 L84 54 C84 74 68 88 50 92 C32 88 16 74 16 54 L16 22 Z"
                stroke="url(#goldGradRight)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(212, 175, 55, 0.12)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />

              {/* Inner Concentric Shield Rim */}
              <motion.path
                d="M50 18 L76 28 L76 52 C76 68 64 78 50 82 C36 78 24 68 24 52 L24 28 Z"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Right Side Scales of Justice */}
              <motion.path
                d="M50 30 L50 72 M50 44 L66 44 M66 44 L60 56 M66 44 L72 56 M56 56 L76 56"
                stroke="#ffd754"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* OVERLAY CONTENT (Text, Badges, Metrics, Action Controls) */}
      <motion.div 
        animate={isOpening ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-40 w-full h-full flex flex-col justify-between p-6 sm:p-10 pointer-events-auto"
      >
        {/* TOP BAR: CONSTITUTIONAL BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-[#d4af37]/20 pb-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffd754] animate-ping" />
            <span className="font-mono text-[10px] sm:text-xs text-[#ffd754] uppercase tracking-[0.25em] font-semibold">
              Civic Shield • Sovereign Legal Literacy Alliance
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-gray-300 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Repository Online
            </span>
            <span>Article 21 & 39A Protected</span>
          </div>
        </motion.div>

        {/* CENTER CONTENT: PROMINENT DRAWN SHIELD IN HERO CENTER */}
        <div className="max-w-3xl mx-auto w-full my-auto flex flex-col items-center text-center px-4">
          
          {/* Spatial frame for the large central drawn shield */}
          <div className="h-44 sm:h-56 flex items-center justify-center relative">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#ffd754]/5 blur-3xl absolute pointer-events-none" />
          </div>

          {/* ACTION BUTTON: ENTER CIVIC SHIELD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
          >
            <button
              onClick={() => handleEnterClick()}
              disabled={isOpening}
              className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#ffd754] to-[#d4af37] text-[#001026] font-bold rounded-sm font-serif text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] hover:scale-[1.03] active:scale-[0.98] disabled:opacity-80"
            >
              <span>{isOpening ? "Opening Sovereign Vault..." : "Enter Civic Repository & Archives"}</span>
              <ChevronRight className={`w-4 h-4 text-black transition-transform duration-300 ${isOpening ? "translate-x-1" : ""}`} />
            </button>
          </motion.div>

        </div>

        {/* BOTTOM SECTION: SHIELD TITLE, REFINED METRICS & SYNCHRONIZATION BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-5xl mx-auto flex flex-col gap-4 pt-4 border-t border-[#d4af37]/20"
        >
          {/* Bottom Title, Tagline & Metrics Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-serif text-white tracking-wide">
                  CIVIC <span className="text-[#ffd754] font-semibold italic">SHIELD</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[9px] font-mono text-[#ffd754] uppercase tracking-wider">
                  Constitutional Defense
                </span>
              </div>
              <p className="text-gray-300 text-xs font-sans max-w-md">
                Certified statutory literacy & procedural empowerment for every citizen.
              </p>
            </div>

            {/* Compact Metric Badges */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-sm bg-[#001233]/90 border border-[#d4af37]/30 text-center">
                <div className="text-sm font-serif font-bold text-white leading-tight">
                  {visitorCount.toLocaleString()}<span className="text-[#ffd754]">+</span>
                </div>
                <div className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">
                  Citizens Visited
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-sm bg-[#001233]/90 border border-[#d4af37]/30 text-center">
                <div className="text-sm font-serif font-bold text-[#ffd754] leading-tight">
                  {subscriberCount.toLocaleString()}<span className="text-white">+</span>
                </div>
                <div className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">
                  Advocates
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-sm bg-[#001233]/90 border border-[#d4af37]/30 text-center">
                <div className="text-sm font-serif font-bold text-emerald-400 leading-tight">
                  100% Free
                </div>
                <div className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">
                  Public Aid
                </div>
              </div>
            </div>
          </div>

          {/* Synchronization Bar & Quick Explore */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400 pt-2 border-t border-[#d4af37]/10">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] text-[#ffd754] uppercase tracking-wider whitespace-nowrap">
                Synchronizing Vault:
              </span>
              <div className="w-full sm:w-44 bg-[#001233] h-1.5 rounded-full overflow-hidden border border-[#d4af37]/30">
                <div 
                  className="h-full bg-[#ffd754] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_#ffd754]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono">{progress}%</span>
            </div>

            <button
              onClick={() => handleEnterClick()}
              disabled={isOpening}
              className="text-[10px] text-gray-300 hover:text-[#ffd754] underline cursor-pointer uppercase tracking-widest transition-colors"
            >
              Explore Immediately →
            </button>
          </div>
        </motion.div>

      </motion.div>

    </div>
  );
}
