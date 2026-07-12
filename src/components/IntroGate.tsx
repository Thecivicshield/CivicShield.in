import React, { useEffect, useState } from "react";
import { Shield, Scale, Gavel, Landmark, ChevronRight, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntroGateProps {
  onEnter: (sectionId?: string) => void;
}

type IntroStep = "dark" | "blueprint-lines" | "shield-assemble" | "logo-appear" | "doors-open";

export default function IntroGate({ onEnter }: IntroGateProps) {
  const [step, setStep] = useState<IntroStep>("dark");
  const [consoleMsg, setConsoleMsg] = useState("INITIALIZING SECURE PROTOCOL...");
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Map steps to sequential timing
  useEffect(() => {
    const timers: { time: number; step: IntroStep; msg: string }[] = [
      { time: 1000, step: "blueprint-lines", msg: "DRAWING GEOMETRIC COORDINATES & BLUEPRINT NETWORKS..." },
      { time: 3000, step: "shield-assemble", msg: "CONSTRUCTING CONSTITUTIONAL INTEGRITY SHIELD..." },
      { time: 5500, step: "logo-appear", msg: "AUTHORIZING CIVIL DECOY ACCESS KEY..." },
      { time: 7800, step: "doors-open", msg: "DECRYPTION COMPLETE. OPENING CLASSIFIED VAULT DOORS..." },
    ];

    const activeTimers = timers.map((t) =>
      setTimeout(() => {
        setStep(t.step);
        setConsoleMsg(t.msg);
        if (t.step === "doors-open") {
          setIsUnlocked(true);
          // Complete the transition and enter website after doors slide open
          setTimeout(() => {
            onEnter();
          }, 1800);
        }
      }, t.time)
    );

    return () => {
      activeTimers.forEach(clearTimeout);
    };
  }, [onEnter]);

  // Bypass directly to door opening
  const handleBypass = () => {
    if (step === "doors-open") return;
    setStep("doors-open");
    setConsoleMsg("BYPASS ENGAGED. OPENING ARCHIVE COVENANT DOORS...");
    setIsUnlocked(true);
    setTimeout(() => {
      onEnter();
    }, 1800);
  };

  const stepIndex = ["dark", "blueprint-lines", "shield-assemble", "logo-appear", "doors-open"].indexOf(step);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden z-[100000] select-none font-sans">
      
      {/* LEFT ARCHIVE DOOR */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: step === "doors-open" ? "-100%" : "0%" }}
        transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#00020a] to-[#01091f] border-r border-[#d4af37]/30 overflow-hidden"
      >
        {/* Blueprint Grid Pattern */}
        <div className="absolute inset-0 bg-grid-lines opacity-[0.06] pointer-events-none" />
        
        {/* Aesthetic Laser Scanlines */}
        {stepIndex >= 1 && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent shadow-[0_0_8px_#d4af37]"
          />
        )}

        {/* Blueprint Technical Annotations */}
        <div className="absolute top-8 left-8 font-mono text-[8px] text-gray-500 space-y-1">
          <div>VAULT_LOC: SECURE_CORE_01</div>
          <div>JURIS_ID: DE_ESCALATE_AUDIT</div>
          <div>SYS_AUTH: ESTABLISHED</div>
        </div>

        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-[#d4af37]/45 space-y-1">
          <div>LAT: 45.1092° N / LONG: 122.6801° W</div>
          <div>PRECEDENT INDEX: v4.9.2</div>
        </div>

        {/* Left half of the interlocking mechanical central lock */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-50">
          <motion.div
            animate={{ rotate: isUnlocked ? -180 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full border border-[#d4af37]/40 bg-black/95 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <div className="w-16 h-16 rounded-full border border-[#d4af37]/25 border-dashed" />
          </motion.div>
        </div>

        {/* LEFT HALF OF GEOMETRIC SHIELD SVG (Aligned to the right edge to meet seamlessly) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[320px] h-[320px] flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG Shield & Scale */}
            <svg className="w-64 h-64 text-[#d4af37] opacity-80" viewBox="0 0 100 100" fill="none">
              {/* Outer compass ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2 4"
                initial={{ rotate: 0 }}
                animate={{ rotate: stepIndex >= 1 ? -180 : 0 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              {/* Shield Outline */}
              <motion.path
                d="M50 12 L82 24 L82 54 C82 72 68 84 50 88 C32 84 18 72 18 54 L18 24 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: stepIndex >= 2 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {/* Central Scales icon */}
              <motion.path
                d="M38 45 L62 45 M50 35 L50 68 M42 68 L58 68 M42 48 L50 54 L58 48"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: stepIndex >= 2 ? 1 : 0 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* RIGHT ARCHIVE DOOR */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: step === "doors-open" ? "100%" : "0%" }}
        transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#00020a] to-[#01091f] border-l border-[#d4af37]/30 overflow-hidden"
      >
        {/* Blueprint Grid Pattern */}
        <div className="absolute inset-0 bg-grid-lines opacity-[0.06] pointer-events-none" />
        
        {/* Aesthetic Laser Scanlines */}
        {stepIndex >= 1 && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent shadow-[0_0_8px_#d4af37]"
          />
        )}

        {/* Blueprint Technical Annotations */}
        <div className="absolute top-8 right-8 font-mono text-[8px] text-gray-500 text-right space-y-1">
          <div>CORE_LOAD: OPTIMAL</div>
          <div>SECURE_SHIELD: COMPLIANT</div>
          <div>DATABASE: FIREBASE_READY</div>
        </div>

        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-gray-500 text-right space-y-1">
          <div>ENCRYPTION: SHIELD_PROT_V4</div>
          <div>STATUS: CLASSIFIED_LEDGER</div>
        </div>

        {/* Right half of the interlocking mechanical central lock */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 z-50">
          <motion.div
            animate={{ rotate: isUnlocked ? 180 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full border border-[#d4af37]/40 bg-black/95 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <div className="w-16 h-16 rounded-full border border-[#d4af37]/25 border-dashed" />
          </motion.div>
        </div>

        {/* RIGHT HALF OF GEOMETRIC SHIELD SVG (Aligned to the left edge to meet seamlessly) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[320px] h-[320px] flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG Shield & Scale */}
            <svg className="w-64 h-64 text-[#d4af37] opacity-80" viewBox="0 0 100 100" fill="none">
              {/* Outer compass ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2 4"
                initial={{ rotate: 0 }}
                animate={{ rotate: stepIndex >= 1 ? 180 : 0 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              {/* Shield Outline */}
              <motion.path
                d="M50 12 L82 24 L82 54 C82 72 68 84 50 88 C32 84 18 72 18 54 L18 24 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: stepIndex >= 2 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {/* Central Scales icon */}
              <motion.path
                d="M38 45 L62 45 M50 35 L50 68 M42 68 L58 68 M42 48 L50 54 L58 48"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: stepIndex >= 2 ? 1 : 0 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* CENTRAL LOGO & BRAND TEXT (Fades in over the split doors, then fades out as they slide open) */}
      <AnimatePresence>
        {step !== "doors-open" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stepIndex >= 3 ? 1 : 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-x-0 bottom-[18%] md:bottom-[22%] mx-auto z-[200] max-w-lg text-center px-6 flex flex-col items-center pointer-events-none"
          >
            {/* Blueprint Grid Coordinate */}
            <div className="inline-flex items-center gap-1 bg-[#d4af37]/10 border border-[#d4af37]/25 text-[9px] font-mono tracking-[0.2em] text-[#d4af37] px-3 py-1 rounded-sm uppercase mb-4">
              <Cpu className="w-3.5 h-3.5 animate-pulse" /> CLASSIFIED ARCHIVE GATEWAY
            </div>

            {/* Glowing Brand Title */}
            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-[0.2em] uppercase leading-none drop-shadow-[0_0_15px_rgba(212,175,55,0.25)] font-light">
              CIVIC <span className="text-[#d4af37] font-semibold">SHIELD</span>
            </h1>

            {/* Sub-heading */}
            <p className="text-[10px] md:text-xs font-mono text-gray-400 tracking-[0.25em] uppercase mt-3">
              Securing Sovereign Legal Safeguards
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER INTERACTIVE CONSOLE STATUS & BYPASS BUTTON */}
      <div className="absolute bottom-6 inset-x-0 mx-auto max-w-4xl px-8 flex flex-col md:flex-row items-center justify-between gap-4 z-[300]">
        {/* Dynamic loading console message */}
        <div className="flex items-center gap-3.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping" />
          <p className="font-mono text-[9px] md:text-[10px] text-[#d4af37] uppercase tracking-widest font-semibold">
            {consoleMsg}
          </p>
        </div>

        {/* Premium Skip/Bypass button */}
        {step !== "doors-open" && (
          <button
            onClick={handleBypass}
            className="group px-4 py-2 bg-black/80 border border-[#d4af37]/25 hover:border-[#d4af37] text-white hover:text-[#d4af37] rounded-sm font-mono text-[9px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer select-none"
          >
            <span>Bypass Archive Decryption</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

    </div>
  );
}
