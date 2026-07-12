import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, FileCheck, ExternalLink, ShieldAlert, Award } from "lucide-react";
import { EvidenceItem } from "../types";

interface EvidenceFolderViewProps {
  item: EvidenceItem;
  onClose: () => void;
}

export default function EvidenceFolderView({ item, onClose }: EvidenceFolderViewProps) {
  const [stampActive, setStampActive] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");

  // Letter by letter typing of title on open
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedTitle((prev) => prev + (item.title[index] || ""));
      index++;
      if (index >= item.title.length) {
        clearInterval(interval);
        // Trigger stamp after title completes
        setTimeout(() => setStampActive(true), 400);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [item.title]);

  return (
    <div className="fixed inset-0 z-[1100] bg-[#000a1a]/92 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {/* Outer folder envelope animation representing folding out */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.85, rotateY: 30 }}
        transition={{ type: "spring", damping: 22, stiffness: 120 }}
        className="w-full max-w-4xl bg-[#eeddbb] text-[#3d2e1c] rounded-md border-2 border-[#d4af37] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[80vh] font-sans relative"
        style={{ perspective: "1200px" }}
      >
        {/* Retro legal folder blueprint accent lines */}
        <div className="absolute inset-0 bg-grid-lines opacity-[0.03] pointer-events-none" />

        {/* Folder tab at the top */}
        <div className="flex justify-between items-center bg-[#d9c49e] border-b border-[#cbb387] px-6 py-3 relative">
          {/* Manila folder tab style */}
          <div className="absolute top-[-10px] left-8 bg-[#eeddbb] border-t-2 border-l-2 border-r-2 border-[#d4af37] px-6 py-2 rounded-t-md text-[10px] font-mono font-bold uppercase tracking-wider text-[#705634] shadow-sm z-10 select-none">
            CASE_FILE: {item.id.slice(0, 8)}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-800/80 animate-pulse" />
            <span className="text-[10px] font-mono font-semibold tracking-widest text-[#705634] uppercase">
              RESOURCES_AND_STATUTES // SECURE_ARCHIVE
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-amber-950/10 text-amber-950/70 hover:text-amber-950 transition-colors cursor-pointer"
            title="Seal case folder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper sheet container (Slides up like inside the folder) */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-white mx-4 sm:mx-6 my-5 p-6 sm:p-8 rounded-sm shadow-md border border-gray-300 relative flex flex-col justify-between"
        >
          {/* Subtle paper line background */}
          <div className="absolute inset-0 bg-[linear-gradient(#f4ebd3_1px,_transparent_1px)] bg-[size:100%_24px] opacity-15 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Folder heading & Typewritten title */}
            <div className="border-b border-dashed border-gray-300 pb-5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 block mb-1">
                DOCUMENT TITLE (INDEXED):
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-800 min-h-[36px] tracking-wide font-mono">
                {typedTitle}
                <span className="animate-[blink_1s_infinite] font-light">|</span>
              </h2>
            </div>

            {/* Document contents details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 block mb-1">
                    ADMINISTRATIVE DISCLOSURE SUMMARY:
                  </span>
                  <p className="text-sm font-sans font-light leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>

                <div className="bg-[#fcf8f0] border border-amber-800/10 p-4 rounded-sm text-xs space-y-2 text-[#5a4833]">
                  <h4 className="font-bold flex items-center gap-1.5 font-serif uppercase tracking-wider text-[#7c6347]">
                    <ShieldAlert className="w-4 h-4 shrink-0" /> CONSTITUTIONAL SHIELD GUARANTEE
                  </h4>
                  <p className="leading-relaxed">
                    Under standard public trust, this resource remains certified as verified civic literature. 
                    Redistributing this document contributes directly to establishing procedural peace in local wards.
                  </p>
                </div>
              </div>

              {/* Sidebar meta block resembling stamp & credentials */}
              <div className="md:col-span-4 border-l border-dashed border-gray-200 pl-6 space-y-6">
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 block mb-1">
                    VERIFICATION DATE:
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 block mb-1">
                    CERTIFIED BY:
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-mono">
                    <FileCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>{item.verifiedBy}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 block mb-1">
                    METRIC_SIZE:
                  </span>
                  <div className="text-xs text-gray-700 font-mono font-bold">
                    {item.fileSize.toUpperCase()}
                  </div>
                </div>

                {/* Unfolding stamp effect (Thumps/Spring scales onto paper) */}
                <AnimatePresence>
                  {stampActive && (
                    <motion.div
                      initial={{ scale: 3.2, opacity: 0, rotate: -25 }}
                      animate={{ scale: 1, opacity: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 10, stiffness: 220 }}
                      className="border-2 border-[#d4af37] text-[#d4af37] rounded-sm p-2 text-center uppercase tracking-widest font-mono font-bold text-[11px] bg-white/40 shadow-sm relative overflow-hidden select-none"
                    >
                      {/* Stamp border details */}
                      <div className="border border-[#d4af37]/30 p-1 flex flex-col items-center justify-center gap-0.5">
                        <Award className="w-4 h-4" />
                        <span>CIVIC COMPLIANT</span>
                        <span className="text-[7px] text-gray-400 mt-0.5">VERIFIED // PASS</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Iframe preview box if file is integrated */}
          {item.fileUrl && (
            <div className="mt-8 border border-gray-300 rounded-sm overflow-hidden h-[360px] bg-gray-50 shadow-inner relative z-10">
              <iframe
                src={item.fileUrl}
                className="w-full h-full border-none bg-white"
                title={item.title}
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Footer controls */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between relative z-10">
            <span className="text-[10px] text-gray-400 font-mono">
              FORM CODE: CIV_SHIELD_FILE_{item.id.toUpperCase().slice(0, 6)}
            </span>

            <div className="flex gap-3 w-full sm:w-auto">
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial text-center px-4 py-2 bg-[#d4af37] hover:bg-[#b59227] text-white font-mono font-bold uppercase tracking-wider text-xs rounded-sm transition-all flex items-center justify-center gap-1.5"
                referrerPolicy="no-referrer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Direct Download
              </a>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-mono font-bold uppercase tracking-wider text-xs rounded-sm transition-all cursor-pointer"
              >
                Seal Folder
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
