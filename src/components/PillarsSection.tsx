import React, { useState } from "react";
import { 
  Scale, 
  ShieldAlert, 
  Landmark, 
  FileText, 
  LucideIcon, 
  Shield, 
  Users, 
  HeartHandshake, 
  Globe2, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSynthSound } from "./JusticeShieldSection";

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
  onOpenBookModal?: (initialIndex?: number) => void;
}

const DEFAULT_PILLARS = [
  {
    title: "Procedural Mastery & De-Escalation",
    subtitle: "Conquering fear through verified protocols",
    description: "Every citizen possesses the lawful right to be treated with dignity. We provide step-by-step procedural playbooks (anchored in Article 21 and the landmark D.K. Basu guidelines) to navigate roadside checks, administrative stops, and official interactions with composure and calm assertiveness.",
    icon: ShieldAlert,
    statute: "Article 21 & D.K. Basu Guidelines (1997)",
    badge: "CORE IMMUNITY"
  },
  {
    title: "Plain-Language Legal Translation",
    subtitle: "Statutes translated into everyday language",
    description: "Dense archaic statutes often disempower ordinary people. Civic Shield translates complex penal codes, Bharatiya Nyaya Sanhita rules, and High Court rulings into clear, plain-language scripts and quick-reference cheat sheets anyone can cite.",
    icon: FileText,
    statute: "Article 19(1)(a) & Article 39A (Free Legal Aid)",
    badge: "ACCESSIBILITY"
  },
  {
    title: "Non-Partisan Constitutional Literacy",
    subtitle: "Equal justice above all divides",
    description: "Constitutional protections belong to all citizens equally. We maintain strict non-partisan objectivity, grounding every educational brief, simulation, and resource strictly in established judicial precedent and constitutional text.",
    icon: Scale,
    statute: "Articles 14 & 15 (Equality Before Law)",
    badge: "INTEGRITY"
  },
  {
    title: "Anti-Coercion & Digital Privacy Defense",
    subtitle: "Clear boundaries on official authority",
    description: "Knowing official boundaries prevents unlawful coercion, illegal phone searches, or arbitrary fines. We teach citizens proper receipt demands, panchnama protocols, and official grievance redressal channels.",
    icon: Lock,
    statute: "K.S. Puttaswamy (2017) & CrPC / BNSS Seizure Rules",
    badge: "DEFENSE"
  }
];

export default function PillarsSection({
  pillars,
  isAdmin,
  onUpdatePillar,
  accentColor,
  onOpenBookModal
}: PillarsSectionProps) {
  const [activeTab, setActiveTab] = useState<"pillars" | "mission" | "charter">("pillars");

  return (
    <section 
      id="pillars" 
      className="py-20 bg-[#001233] border-t border-b border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Background radial glow & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#00266e_0%,#001233_65%,#000814_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* SECTION HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd754] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffd754]" />
            <span>STUDY CENTER • FOUNDATIONAL PILLARS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-white leading-tight">
            Foundations of <span className="text-[#ffd754] font-serif font-bold">Civic Shield</span>
          </h2>
          
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            Transforming dense constitutional law into accessible, de-escalating knowledge for every citizen.
          </p>

          {/* Navigation Tabs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { id: "pillars", label: "4 Core Pillars", icon: Shield },
              { id: "mission", label: "Founding Mission", icon: Users },
              { id: "charter", label: "Citizen Charter & Pledge", icon: HeartHandshake }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSynthSound("click");
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? "bg-gradient-to-r from-[#d4af37] to-[#ffd754] text-[#001a4d] border-[#ffd754] shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-105"
                      : "bg-[#000d20]/80 text-gray-300 border-[#d4af37]/25 hover:border-[#ffd754] hover:text-white hover:bg-[#00173d]"
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isSelected ? "text-[#001a4d]" : "text-[#ffd754]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* TAB 1: 4 CORE PILLARS */}
        {activeTab === "pillars" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {DEFAULT_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-b from-[#001947]/90 to-[#000c22]/90 border border-[#d4af37]/35 rounded-xl p-6 sm:p-7 shadow-xl hover:border-[#ffd754] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd754] shadow-inner">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-black/60 border border-[#d4af37]/40 text-[#ffd754] tracking-wider uppercase">
                        {pillar.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-serif font-bold text-white leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#ffd754] font-serif italic mt-0.5">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-gray-400">
                      Anchor: <strong className="text-gray-200">{pillar.statute}</strong>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 2: FOUNDING MISSION */}
        {activeTab === "mission" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-[#000e26]/90 border border-[#d4af37]/40 rounded-xl p-6 sm:p-10 shadow-2xl space-y-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 text-[#ffd754]">
              <Users className="w-6 h-6 text-[#ffd754]" />
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Our Founding Mission
              </h3>
            </div>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light">
              Civic Shield was founded on a simple truth: <strong>rights that are not understood cannot be exercised.</strong> When citizens encounter authority with fear or ignorance, power imbalances cause unnecessary friction and distress.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-black/40 border border-slate-800 space-y-2">
                <span className="font-mono text-xs font-bold text-[#ffd754] block">1. CLARITY</span>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Removing dense legal jargon so every citizen knows exactly what is lawful and what is not.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-slate-800 space-y-2">
                <span className="font-mono text-xs font-bold text-[#ffd754] block">2. DE-ESCALATION</span>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Teaching calm assertiveness, proper dialogue, and respectful boundary-setting during stops.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-slate-800 space-y-2">
                <span className="font-mono text-xs font-bold text-[#ffd754] block">3. IMPARTIALITY</span>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Remaining 100% non-partisan, anchored purely in constitutional law and judicial rulings.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CITIZEN CHARTER & PLEDGE */}
        {activeTab === "charter" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-[#000e26]/90 border border-[#d4af37]/40 rounded-xl p-6 sm:p-10 shadow-2xl space-y-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 text-[#ffd754]">
              <HeartHandshake className="w-6 h-6 text-[#ffd754]" />
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                The Citizen Charter & Civic Pledge
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              <p>
                As citizens committed to constitutional order, we uphold mutual accountability between the public and administrative authorities:
              </p>
              <ul className="space-y-2.5 list-disc pl-5">
                <li><strong className="text-white">Dignity in Dialogue:</strong> We communicate with law enforcement with composure, civility, and firm adherence to statutory rights.</li>
                <li><strong className="text-white">Empirical Verification:</strong> We cite verified statutes, Supreme Court guidelines, and official rules rather than hearsay.</li>
                <li><strong className="text-white">Democratic Participation:</strong> We educate our peers, share plain-language legal resources, and defend due process for all.</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* CALLOUT TO OPEN THE BOOK OF STRATEGIC GOALS */}
        {onOpenBookModal && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                playSynthSound("success");
                onOpenBookModal(0);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00173d] border border-[#d4af37]/50 text-[#ffd754] hover:bg-[#d4af37] hover:text-[#001a4d] transition-all font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Inspect Strategic Goals Codex (6 Directives)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
