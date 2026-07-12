import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle2, Trophy, Landmark, Eye, HelpCircle } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "read" | "myth" | "explore" | "statute";
}

const ACHIEVEMENT_ICONS = {
  read: <Eye className="w-5 h-5 text-[#d4af37]" />,
  myth: <HelpCircle className="w-5 h-5 text-[#d4af37]" />,
  explore: <Trophy className="w-5 h-5 text-[#d4af37]" />,
  statute: <Landmark className="w-5 h-5 text-[#d4af37]" />,
};

export default function AchievementToast() {
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  useEffect(() => {
    const handleUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<Achievement>;
      if (!customEvent.detail || !customEvent.detail.id) return;

      const achievement = customEvent.detail;
      const unlockedList = JSON.parse(localStorage.getItem("civic_shield_unlocked_achievements") || "[]");

      if (unlockedList.includes(achievement.id)) {
        // Already unlocked
        return;
      }

      // Lock/Unlock persistence
      unlockedList.push(achievement.id);
      localStorage.setItem("civic_shield_unlocked_achievements", JSON.stringify(unlockedList));

      // Trigger active toast
      setActiveToast(achievement);

      // Dismiss after 4 seconds
      setTimeout(() => {
        setActiveToast(null);
      }, 4000);
    };

    window.addEventListener("unlock-achievement", handleUnlock);
    return () => window.removeEventListener("unlock-achievement", handleUnlock);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[2000] pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 18, stiffness: 120 }}
            className="pointer-events-auto bg-[#001233]/95 backdrop-blur-md border border-[#d4af37] p-4 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-start gap-3.5 relative overflow-hidden"
          >
            {/* Elegant moving gold sweep overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 bottom-0 w-[30%] bg-gradient-to-r from-transparent via-[#d4af37]/[0.15] to-transparent -skew-x-12 animate-[shimmerSweep_3.5s_infinite_ease-in-out]" />
            </div>

            {/* Glowing gold backlighting */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/10 blur-xl pointer-events-none" />

            <div className="p-2 rounded-sm bg-[#d4af37]/15 border border-[#d4af37]/25 shrink-0">
              {ACHIEVEMENT_ICONS[activeToast.category] || <Award className="w-5 h-5 text-[#d4af37]" />}
            </div>

            <div className="space-y-1 text-left flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded-sm">
                  Rights Discovered
                </span>
                <CheckCircle2 className="w-3 h-3 text-[#d4af37]" />
              </div>
              <h4 className="text-xs font-serif font-bold text-white tracking-wide">
                {activeToast.title}
              </h4>
              <p className="text-[10px] text-gray-300 leading-relaxed font-sans font-light">
                {activeToast.description}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-500 hover:text-white transition-colors text-[9px] font-mono p-0.5 cursor-pointer"
            >
              [X]
            </button>

            {/* Symmetric corner tracers */}
            <div className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-[#d4af37]/30" />
            <div className="absolute top-0.5 right-0.5 w-1 h-1 border-t border-r border-[#d4af37]/30" />
            <div className="absolute bottom-0.5 left-0.5 w-1 h-1 border-b border-l border-[#d4af37]/30" />
            <div className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-[#d4af37]/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility helper to fire achievements safely from client code
export function triggerAchievement(achievement: Achievement) {
  const event = new CustomEvent("unlock-achievement", { detail: achievement });
  window.dispatchEvent(event);
}
