import React from "react";
import { Trees, Coins, Scale, ShieldAlert, Landmark, Eye, FileText, LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface Pillar {
  title: string;
  description: string;
  iconName: string;
}

interface PillarsSectionProps {
  key?: string;
  pillars: Pillar[];
  isAdmin: boolean;
  onUpdatePillar: (index: number, updated: Pillar) => void;
  accentColor: string;
}

const IconMap: { [key: string]: LucideIcon } = {
  Trees,
  Coins,
  Scale,
  ShieldAlert,
  Landmark,
  Eye,
  FileText
};

export default function PillarsSection({ pillars, isAdmin, onUpdatePillar, accentColor }: PillarsSectionProps) {
  
  const handleTextChange = (index: number, key: keyof Pillar, val: string) => {
    const updated = { ...pillars[index], [key]: val };
    onUpdatePillar(index, updated);
  };

  return (
    <motion.section 
      id="pillars" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001a4d] border-t border-[#d4af37]/25 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-4">
            Campaign Foundations
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-4">
            Civic Responsibility & <span className="text-[#d4af37] font-serif not-italic">Transparency</span>
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Civic Shield actively coordinates independent procedural training, legal checks, and advocacy support to guarantee citizens are equipped to protect their legal and civil rights.
          </p>
        </motion.div>

        {/* Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = IconMap[pillar.iconName] || Scale;
            
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 40px -15px rgba(212, 175, 55, 0.15)" }}
                className="bg-[#001233]/80 rounded-sm border border-[#d4af37]/20 hover:border-[#d4af37]/50 p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300 shadow-2xl relative h-auto group"
              >
                <div className="space-y-5">
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="p-3 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm inline-flex text-[#d4af37] transition-all group-hover:bg-[#d4af37]/20"
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.div>

                  {/* Title / Info - Inline editable! */}
                  <div className="space-y-3">
                    {isAdmin ? (
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handleTextChange(idx, "title", e.target.value)}
                        className="w-full bg-[#001a4d] text-sm font-bold text-white mb-2 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2.5 py-1.5"
                      />
                    ) : (
                      <h3 className="text-lg font-serif font-semibold text-white tracking-wide group-hover:text-[#d4af37] transition-colors">
                        {pillar.title}
                      </h3>
                    )}

                    {isAdmin ? (
                      <textarea
                        value={pillar.description}
                        onChange={(e) => handleTextChange(idx, "description", e.target.value)}
                        rows={3}
                        className="w-full bg-[#001a4d] text-xs text-gray-300 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2.5 py-1.5 font-sans leading-relaxed"
                      />
                    ) : (
                      <p className="text-xs text-gray-300/80 leading-relaxed font-sans font-light">{pillar.description}</p>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 text-[10px] text-[#d4af37]/60 font-mono italic">
                    ✏️ Editable in real-time
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
