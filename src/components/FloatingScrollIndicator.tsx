import React, { useEffect, useState } from "react";
import { useScroll, motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, BookOpen, Compass, Award } from "lucide-react";

// Map section DOM element IDs to user-friendly legal names
const SECTION_NAMES: Record<string, { title: string; desc: string }> = {
  hero: { title: "Sovereign Sanctuary Portal", desc: "Initiated classified archive access" },
  pillars: { title: "Foundational Pillars", desc: "Discovered the constitutional core safeguards" },
  "impact-metrics": { title: "Campaign Impact Metrics", desc: "Analyzed citizen empowerment stats" },
  "justice-shield": { title: "The Justice Shield Matrix", desc: "Unlocked codifications & statute handbook" },
  evidence: { title: "Vault Evidence Folders", desc: "Revealed administrative compliance reports" },
  timeline: { title: "Active Campaign Roadmap", desc: "Synchronized milestone coordinates" },
  "constitutional-network": { title: "Digital Constitutional Network", desc: "Mapped global sovereign connections" },
  "social-feed": { title: "Legal Dispatches Stream", desc: "Connected to front-line communications" },
  blog: { title: "Classified Intel Archives", desc: "Decrypted detailed citizen handbooks" },
  newsletter: { title: "Covenant Dispatch Subscription", desc: "Integrated with sovereign newsletter" }
};

export default function FloatingScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [unlockedSections, setUnlockedSections] = useState<Set<string>>(new Set(["hero"]));
  const [discoveryNotification, setDiscoveryNotification] = useState<{
    id: string;
    title: string;
    desc: string;
  } | null>(null);

  // Scroll position to fill the glowing shield/sword
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollPercent(Math.min(100, Math.max(0, latest * 100)));
    });
  }, [scrollYProgress]);

  // Track sections crossing the viewport to trigger "✓ Right Discovered"
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -40% 0px", // Trigger when section occupies the middle portion of viewport
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && SECTION_NAMES[sectionId]) {
            setActiveSection(sectionId);
            
            // Check if this is the first time we discover this "right / section"
            setUnlockedSections((prev) => {
              if (!prev.has(sectionId)) {
                const updated = new Set(prev);
                updated.add(sectionId);
                
                // Trigger a beautiful transient notification
                setDiscoveryNotification({
                  id: `${sectionId}-${Date.now()}`,
                  title: SECTION_NAMES[sectionId].title,
                  desc: SECTION_NAMES[sectionId].desc,
                });
                
                return updated;
              }
              return prev;
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all possible sections in DOM
    const targetIds = [
      "hero",
      "pillars",
      "impact-metrics",
      "justice-shield",
      "evidence",
      "timeline",
      "constitutional-network",
      "social-feed",
      "blog",
      "newsletter"
    ];

    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Automatically clear notification after 2 seconds
  useEffect(() => {
    if (discoveryNotification) {
      const t = setTimeout(() => {
        setDiscoveryNotification(null);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [discoveryNotification]);

  return (
    <>
      {/* COMPACT FLOATING SHIELD PROGRESS INDICATOR */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed right-6 bottom-24 z-[400] hidden md:block select-none group font-sans"
        id="sovereign-hud-scroll"
      >
        {/* Tooltip on Hover showing the current active sovereign section */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2 whitespace-nowrap">
          <div className="bg-[#001233]/95 border border-[#d4af37]/45 shadow-[0_0_15px_rgba(212,175,55,0.25)] rounded-sm px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#d4af37] block mb-0.5">Active Jurisdiction</span>
            <span className="text-white text-xs font-serif font-medium">{SECTION_NAMES[activeSection]?.title || "The Civic Shield"}</span>
          </div>
        </div>

        {/* Small Glowing Sword Container */}
        <div className="w-12 h-16 flex items-center justify-center bg-black/90 border border-[#d4af37]/20 rounded-sm p-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md hover:border-[#d4af37]/65 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer">
          <svg viewBox="0 0 100 120" className="w-full h-full text-gray-800" fill="none">
            <defs>
              {/* Dynamic clip path for filling the blade from top to bottom */}
              <clipPath id="sword-fill-clip">
                <rect x="0" y="0" width="100" height={15 + (70 * (scrollPercent / 100))} />
              </clipPath>
              {/* Gold glow filter */}
              <filter id="sword-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. THE SWORD UNLIT SHADOW / UNDERLAY */}
            <g className="opacity-40">
              {/* Blade underlay */}
              <path 
                d="M45 85 L47 25 L50 10 L53 25 L55 85 Z" 
                fill="#1e293b" 
                stroke="#475569" 
                strokeWidth="1.5"
                strokeLinejoin="miter"
              />
              {/* Center fuller/ridge line */}
              <line x1="50" y1="18" x2="50" y2="84" stroke="#475569" strokeWidth="1" />
              {/* Crossguard */}
              <path d="M32 85 L68 85 L50 89 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
              {/* Handle/Grip */}
              <rect x="47" y="89" width="6" height="18" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Pommel */}
              <circle cx="50" cy="110" r="4.5" fill="#334155" stroke="#475569" strokeWidth="1" />
            </g>

            {/* 2. THE GLOWING GOLD SWORD OVERLAY (CLIPPED) */}
            <g clipPath="url(#sword-fill-clip)" filter="url(#sword-glow)">
              {/* Golden glowing blade */}
              <path 
                d="M45 85 L47 25 L50 10 L53 25 L55 85 Z" 
                fill="url(#goldGradient)" 
                stroke="#ffd754" 
                strokeWidth="1.8"
                strokeLinejoin="miter"
                style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.8))" }}
              />
              {/* Glowing center ridge */}
              <line 
                x1="50" 
                y1="15" 
                x2="50" 
                y2="84" 
                stroke="#ffffff" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                opacity="0.9"
              />
              {/* Crossguard glowing gold */}
              <path d="M32 85 L68 85 L50 89 Z" fill="#d4af37" stroke="#ffd754" strokeWidth="1.2" />
              {/* Handle glowing details */}
              <rect x="47" y="89" width="6" height="18" rx="1" fill="#9a3412" stroke="#d4af37" strokeWidth="1" />
              {/* Golden Pommel */}
              <circle cx="50" cy="110" r="4.5" fill="#d4af37" stroke="#ffd754" strokeWidth="1.2" />
            </g>

            {/* Extra glowing energy sparks around the tip if fully completed */}
            {scrollPercent > 98 && (
              <g className="animate-pulse">
                <circle cx="50" cy="8" r="1.5" fill="#ffffff" />
                <circle cx="43" cy="15" r="1" fill="#ffd754" />
                <circle cx="57" cy="15" r="1" fill="#ffd754" />
              </g>
            )}

            {/* Standard SVG Gradients */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b89423" />
                <stop offset="35%" stopColor="#ffd754" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#ffd754" />
                <stop offset="100%" stopColor="#b89423" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* TRANSIENT RIGHT DISCOVERED POPUP (Like unlocking classified legal archives) */}
      <AnimatePresence>
        {discoveryNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: "-50%", transition: { duration: 0.3 } }}
            className="fixed bottom-8 left-1/2 z-[1000] w-full max-w-sm px-4 select-none pointer-events-none"
          >
            <div className="bg-[#001233]/95 border border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] rounded-sm p-4 backdrop-blur-md relative overflow-hidden">
              {/* High tech scanner bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-[shimmerSweep_2s_infinite]" />
              
              {/* Decorative brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4af37]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#d4af37]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#d4af37]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4af37]" />

              <div className="flex items-start gap-3.5">
                {/* Glowing Trophy Badge */}
                <div className="p-2 bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-sm text-[#d4af37] animate-pulse">
                  <Award className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold flex items-center gap-1.5 leading-none mb-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Right Discovered
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                    {discoveryNotification.title}
                  </h4>
                  <p className="font-sans text-[10px] text-gray-300 font-light mt-0.5">
                    {discoveryNotification.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
