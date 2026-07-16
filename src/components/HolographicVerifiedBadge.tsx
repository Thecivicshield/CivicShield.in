import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Sparkles, HelpCircle } from "lucide-react";
import { playSynthSound } from "./JusticeShieldSection";

interface HolographicVerifiedBadgeProps {
  verifiedBy: string;
  compact?: boolean;
}

export default function HolographicVerifiedBadge({ verifiedBy, compact = false }: HolographicVerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const handleTriggerSparkles = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Play a delightful micro-click synth pitch
    playSynthSound("click");

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ["#d4af37", "#f5e6be", "#b59d57", "#aa7c11", "#ffffff"];
    
    // Spawn 8 mini gold spark coordinates
    const newParticles = Array.from({ length: 8 }).map((_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 30;
      return {
        id: Date.now() + idx + Math.random(),
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

  return (
    <div className="relative inline-block select-none z-30">
      {/* Sparkle bursts emitter layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1.8, opacity: 1 }}
              animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}, 0 0 2px white`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleTriggerSparkles}
        whileHover={{ 
          scale: 1.05, 
          y: -1,
          filter: "brightness(1.15)"
        }}
        whileActive={{ scale: 0.95 }}
        className={`holographic-badge-badge cursor-pointer flex items-center justify-center gap-1 border border-[#001233]/15 text-[#001233] ${
          compact 
            ? "px-2 py-0.5 rounded-full text-[8px]" 
            : "px-3 py-1 rounded-sm text-[9px]"
        }`}
      >
        <ShieldCheck className={`${compact ? "w-2.5 h-2.5" : "w-3 h-3"} text-[#001233]`} />
        <span className="font-mono font-extrabold tracking-widest uppercase">
          {compact ? "VERIFIED" : "MODERATOR VERIFIED"}
        </span>
        <Sparkles className={`${compact ? "w-2 h-2" : "w-2.5 h-2.5"} text-[#001233]/90 animate-pulse`} />
      </motion.div>

      {/* Tooltip description of confirmation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#000a1a] border border-[#d4af37]/40 p-2.5 shadow-[0_4px_20px_rgba(212,175,55,0.15)] rounded-sm pointer-events-none z-50 text-left"
          >
            {/* Elegant header */}
            <div className="flex items-center gap-1.5 border-b border-[#d4af37]/20 pb-1 mb-1.5 font-mono text-[8px] font-bold text-[#d4af37] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-[#d4af37]" /> Integrity Check: PASSED
            </div>
            
            <p className="text-[10px] text-gray-300 font-sans leading-relaxed font-light">
              This resource has been thoroughly analyzed and officially signed off by the <span className="text-[#ffd754] font-semibold">{verifiedBy}</span> platform moderator.
            </p>
 
            <div className="mt-1.5 flex items-center gap-1 text-[8px] text-[#ef4444] font-mono uppercase tracking-widest font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-[#ef4444]" /> Tap badge for gold burst
            </div>

            {/* Micro-arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-[#000a1a]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
