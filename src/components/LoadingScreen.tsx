import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress beautifully
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Rapid increment first, then slow down, then finish
        const increment = Math.max(1, Math.min(15, (100 - prev) * 0.15 + Math.random() * 5));
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[999999] bg-[#000a22] flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.06] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Decorative Blueprint Corner Marks */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[#d4af37]/35" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[#d4af37]/35" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[#d4af37]/35" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[#d4af37]/35" />

      <div className="relative flex flex-col items-center max-w-sm w-full px-6 space-y-8 z-10">
        
        {/* Shield outline drawing using path length animation */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Pulsing Outer Glow */}
          <motion.div
            className="absolute inset-0 bg-[#d4af37]/5 blur-xl rounded-full"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Golden Shield SVG drawing */}
          <svg className="w-full h-full text-[#d4af37]" viewBox="0 0 100 100" fill="none">
            {/* Outline drawing path */}
            <motion.path
              d="M50 12 L82 24 L82 54 C82 72 68 84 50 88 C32 84 18 72 18 54 L18 24 Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            {/* Inner scale icon or detailing inside the shield */}
            <motion.path
              d="M38 42 L62 42 M50 35 L50 68 M42 68 L58 68 M42 45 L50 50 L58 45"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>

          {/* Central Monogram */}
          <span className="absolute text-xs font-serif font-bold text-white uppercase tracking-widest pointer-events-none select-none">
            CIVIC
          </span>
        </div>

        {/* Brand Label */}
        <div className="text-center space-y-1.5">
          <motion.h2 
            className="text-lg font-serif font-normal text-white uppercase tracking-[0.25em] leading-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            CIVIC SHIELD
          </motion.h2>
          <motion.p 
            className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.18em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Securing Sovereign Legal Safeguards
          </motion.p>
        </div>

        {/* Gold progress line container */}
        <div className="w-full space-y-2">
          <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden relative border border-white/[0.02]">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#b38f2e] via-[#d4af37] to-white shadow-[0_0_8px_#d4af37]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-400 tracking-wider">
            <span className="uppercase">SYSTEMS VERIFICATION</span>
            <span className="text-[#d4af37] font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Decorative Technical Status Indicators */}
      <div className="absolute bottom-6 left-6 font-mono text-[7.5px] text-gray-500 space-y-0.5 tracking-wider uppercase">
        <div>CORE_NODE: ONLINE</div>
        <div>STT_LOAD: VERIFIED</div>
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[7.5px] text-[#d4af37]/50 text-right space-y-0.5 tracking-wider uppercase">
        <div>ENCRYPTION_RSA_2048</div>
        <div>SECURE SHIELD ACTIVE</div>
      </div>
    </div>
  );
}
