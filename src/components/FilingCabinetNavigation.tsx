import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, FolderOpen, Archive, FileText, Lock } from "lucide-react";

export default function FilingCabinetNavigation() {
  const [cabinetState, setCabinetState] = useState<{
    status: "idle" | "opening" | "retrieving" | "closing";
    label: string;
    targetId: string | null;
  }>({
    status: "idle",
    label: "",
    targetId: null,
  });

  useEffect(() => {
    const handleTriggerCabinet = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string; label: string }>;
      const { targetId, label } = customEvent.detail;

      // Start the sequence
      setCabinetState({
        status: "opening",
        label,
        targetId,
      });

      // Sound effects removed by user request

      // Step 2: Retrieve file folder (300ms later)
      setTimeout(() => {
        setCabinetState(prev => ({ ...prev, status: "retrieving" }));
        
        // Sound effects removed by user request

        // Scroll page programmatically to section
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);

      // Step 3: Closing cabinet (750ms later)
      setTimeout(() => {
        setCabinetState(prev => ({ ...prev, status: "closing" }));
        
        // Sound effects removed by user request
      }, 750);

      // Step 4: Finish (950ms later)
      setTimeout(() => {
        setCabinetState({ status: "idle", label: "", targetId: null });
      }, 980);
    };

    window.addEventListener("trigger-cabinet-nav", handleTriggerCabinet);
    return () => window.removeEventListener("trigger-cabinet-nav", handleTriggerCabinet);
  }, []);

  if (cabinetState.status === "idle") return null;

  return (
    <div className="fixed inset-0 z-[20000] pointer-events-none flex items-center justify-center">
      {/* Dark vignette backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-[3px] pointer-events-auto"
      />

      <div className="relative w-full max-w-lg px-4 flex flex-col items-center justify-center text-center z-10 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          
          {cabinetState.status === "opening" && (
            <motion.div
              key="opening-drawer"
              initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: -45 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gradient-to-b from-[#1c2c4c] to-[#0a1426] border-2 border-[#d4af37]/60 p-6 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full relative overflow-hidden"
              style={{ perspective: 1000 }}
            >
              {/* Gold Label Plate */}
              <div className="border border-[#d4af37]/40 rounded-sm px-4 py-2 bg-black/40 inline-flex items-center gap-2 mb-4">
                <Archive className="w-4 h-4 text-[#d4af37] animate-pulse" />
                <span className="font-mono text-xs text-[#d4af37] tracking-[0.2em] uppercase">CS_ARCHIVE_FILE_CABINET</span>
              </div>

              {/* Slider rails */}
              <div className="absolute top-1/2 left-2 w-1.5 h-16 bg-gray-600 rounded-full opacity-60" />
              <div className="absolute top-1/2 right-2 w-1.5 h-16 bg-gray-600 rounded-full opacity-60" />

              {/* Drawer Face brass pull handle handle */}
              <div className="border-t border-[#d4af37]/20 pt-4 mt-2 flex flex-col items-center">
                <div className="w-24 h-4 rounded-b-md border-b-2 border-x-2 border-[#d4af37]/50 shadow-inner mb-2" />
                <p className="font-mono text-[9px] text-gray-400 tracking-[0.15em] uppercase">SLIDING_DRAWER_OPEN</p>
              </div>
            </motion.div>
          )}

          {cabinetState.status === "retrieving" && (
            <motion.div
              key="retrieving-folder"
              initial={{ scale: 0.7, opacity: 0, y: 80, rotateY: -15 }}
              animate={{ scale: 1.05, opacity: 1, y: -20, rotateY: 0 }}
              exit={{ scale: 1.15, opacity: 0, y: -100 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="bg-[#d4af37] text-[#001233] p-6 rounded-r-md rounded-bl-md shadow-[0_30px_60px_rgba(0,0,0,0.9)] w-full max-w-md relative overflow-hidden border border-white/20"
            >
              {/* Document/Folder Tab */}
              <div className="absolute top-0 left-0 bg-[#b8952b] text-white px-4 py-1 text-[9px] font-mono font-extrabold uppercase tracking-[0.2em] rounded-tr-md">
                UNSEALED FILE
              </div>

              {/* Official Stamp Watermark style */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full border-4 border-black/5 flex items-center justify-center rotate-12 pointer-events-none select-none">
                <span className="font-serif font-black text-xs text-black/5 uppercase tracking-[0.2em]">CIVIC SHIELD</span>
              </div>

              <div className="space-y-4 pt-4">
                <div className="w-12 h-12 bg-[#001233]/10 rounded-full flex items-center justify-center mx-auto text-[#001233]">
                  <FolderOpen className="w-7 h-7" />
                </div>
                
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#001233]/70 font-bold">CASE FILE DECRYPTED</p>
                  <h3 className="text-xl font-serif font-black tracking-wide uppercase mt-1">
                    {cabinetState.label}
                  </h3>
                </div>

                <div className="border-t border-[#001233]/15 pt-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="opacity-80">JURISDICTION:</span>
                    <span className="font-bold">CS_CIVIC_CORE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono mt-1">
                    <span className="opacity-80">ACCESS STATUS:</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      ● GRANTED
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {cabinetState.status === "closing" && (
            <motion.div
              key="closing-cabinet"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="bg-gradient-to-t from-[#101a30] to-[#050c18] border-2 border-gray-800 p-4 rounded-md shadow-lg w-full max-w-sm text-gray-500 font-mono text-[10px] tracking-widest uppercase"
            >
              DRAWER_RETRACT_COMPLETE
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
