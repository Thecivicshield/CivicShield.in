import React from "react";
import { motion } from "motion/react";
import { Landmark, Shield, Scale, Gavel, FileText, Compass, Sparkles } from "lucide-react";

interface BlueprintItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  technicalLabel: string;
  description: string;
  pathD: string;
  viewBox: string;
}

const BLUEPRINT_ITEMS: BlueprintItem[] = [
  {
    id: "courthouse",
    name: "The Sovereign Courthouse",
    icon: <Landmark className="w-5 h-5" />,
    technicalLabel: "SECURE_JURISDICTION_SECTOR_7",
    description: "Represents the supreme seat of neutral judicial determination, protecting citizens against arbitrary executive force.",
    viewBox: "0 0 100 100",
    // Detailed courthouse line-art path
    pathD: "M 10,85 L 90,85 M 15,80 L 85,80 M 20,75 L 80,75 M 25,45 L 75,45 M 25,75 L 25,45 M 75,75 L 75,45 M 32,75 L 32,45 M 41,75 L 41,45 M 50,75 L 50,45 M 59,75 L 59,45 M 68,75 L 68,45 M 25,45 L 50,22 L 75,45 Z M 44,80 L 56,80 L 56,65 L 44,65 Z"
  },
  {
    id: "shield",
    name: "The Constitutional Shield",
    icon: <Shield className="w-5 h-5" />,
    technicalLabel: "ARTICLE_21_IMMUNITY_BARRIER",
    description: "Guarantees absolute protection of your life, body, personal devices, and digital correspondence against forced warrantless intrusion.",
    viewBox: "0 0 100 100",
    // Detailed Shield path
    pathD: "M 50,15 L 80,25 L 80,50 C 80,68 67,82 50,86 C 33,82 20,68 20,50 L 20,25 Z M 50,22 L 73,30 L 73,50 C 73,64 63,75 50,78 C 37,75 27,64 27,50 L 27,30 Z"
  },
  {
    id: "scales",
    name: "The Scales of Justice",
    icon: <Scale className="w-5 h-5" />,
    technicalLabel: "AUDI_ALTERAM_PARTEM_EQUILIBRIUM",
    description: "Sustains natural justice, ensuring both sides are heard equally, and no decision is passed without giving a fair chance to present a defense.",
    viewBox: "0 0 100 100",
    // Detailed Scales path
    pathD: "M 50,15 L 50,85 M 30,85 L 70,85 M 20,28 L 80,28 M 20,28 L 10,55 M 20,28 L 30,55 M 10,55 C 10,63 30,63 30,55 Z M 80,28 L 70,55 M 80,28 L 90,55 M 70,55 C 70,63 90,63 90,55 Z M 50,28 A 4,4 0 1,1 50,27.9"
  },
  {
    id: "gavel",
    name: "The Gavel of Precedent",
    icon: <Gavel className="w-5 h-5" />,
    technicalLabel: "STARE_DECISIS_MANDATE_MALLET",
    description: "Strikes down arbitrary local rules, upholding judicial precedents established by higher courts as the binding law of the land.",
    viewBox: "0 0 100 100",
    // Detailed Gavel path
    pathD: "M 20,20 L 50,42 M 16,25 L 46,47 M 15,20 C 13,18 10,18 8,20 C 6,22 6,25 8,27 L 18,37 C 20,39 23,39 25,37 Z M 48,44 L 82,78 C 84,80 87,80 89,78 L 92,75 C 94,73 94,70 92,68 L 58,34 Z M 48,22 L 32,38 M 52,26 L 36,42"
  },
  {
    id: "section",
    name: "The Covenant Symbol (§)",
    icon: <FileText className="w-5 h-5" />,
    technicalLabel: "CIVIC_STATUTE_CODIFICATION_KEY",
    description: "Marks individual codified laws, sections, and rules that provide structural support for your sovereign liberty.",
    viewBox: "0 0 100 100",
    // Typographic Paragraph symbol path
    pathD: "M 50,15 C 40,15 35,22 35,28 C 35,35 42,38 48,40 C 56,42 62,45 62,55 C 62,65 52,70 45,70 C 37,70 33,65 33,60 M 65,40 C 65,40 65,45 65,45 M 50,85 C 60,85 65,78 65,72 C 65,65 58,62 52,60 C 44,58 38,55 38,45 C 38,35 48,30 55,30 C 63,30 67,35 67,40"
  }
];

export default function LawBlueprint() {
  return (
    <section 
      id="law-blueprint"
      className="py-24 bg-gradient-to-b from-[#001233] to-[#001a4d] border-t border-b border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Blueprint background patterns */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.08] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-[#d4af37] leading-none mb-4">
            <Compass className="w-3.5 h-3.5" /> Interactive Constitution
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-4">
            Legal Blueprint <span className="text-[#d4af37] font-serif not-italic">Infrastructure</span>
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed font-light font-sans">
            Laws are not abstract obstacles; they are structural architectural drafts for justice. 
            Scroll to see glowing golden blueprint vectors trace and assemble themselves.
          </p>
        </motion.div>

        {/* Blueprint flow - connected path blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          
          {/* Connecting golden blueprint thread behind cards */}
          <div className="absolute top-[180px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-[#d4af37]/5 via-[#d4af37]/45 to-[#d4af37]/5 hidden lg:block z-0" />

          {BLUEPRINT_ITEMS.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, delay: idx * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-[#000d26]/85 border border-[#d4af37]/15 hover:border-[#d4af37]/65 rounded-sm p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden group min-h-[360px] z-10"
              >
                {/* Micro engineering data headers */}
                <div className="flex items-center justify-between font-mono text-[7.5px] text-[#d4af37]/50 border-b border-white/5 pb-2 mb-4">
                  <div className="flex items-center gap-1">
                    {item.icon}
                    <span>{item.technicalLabel}</span>
                  </div>
                  <span>SCALE_1:1 // OK</span>
                </div>

                {/* Self-drawing Vector blueprint */}
                <div className="w-full h-44 flex items-center justify-center bg-black/35 rounded-sm border border-white/[0.03] relative overflow-hidden group-hover:bg-black/55 transition-colors">
                  {/* Subtle technical compass axis tracers */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_70%)]" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.02] border-dashed" />
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.02] border-dashed" />

                  <svg
                    className="w-32 h-32 text-[#d4af37]"
                    viewBox={item.viewBox}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d={item.pathD}
                      initial={{ pathLength: 0, opacity: 0.2 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 2.2, 
                        delay: idx * 0.2 + 0.3,
                        ease: "easeInOut" 
                      }}
                    />
                  </svg>
                </div>

                {/* Content details */}
                <div className="mt-4 space-y-1.5 text-left">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase group-hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Aesthetic corner brackets */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/10 group-hover:border-[#d4af37]/40 transition-colors" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-[#d4af37]/40 transition-colors" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-[#d4af37]/40 transition-colors" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/10 group-hover:border-[#d4af37]/40 transition-colors" />
              </motion.div>
            );
          })}

        </div>
        
        {/* Subtle engineering watermark */}
        <div className="mt-12 text-center text-[8px] font-mono tracking-widest text-[#d4af37]/25 uppercase select-none">
          CIVIC SHIELD GENERAL BLUEPRINT PROTOCOL // SYSTEM INTEGRATED // v2.0
        </div>

      </div>
    </section>
  );
}
