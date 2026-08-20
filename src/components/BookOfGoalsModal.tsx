import React, { useState, useEffect } from "react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Scale, 
  ShieldAlert, 
  Landmark, 
  Eye, 
  FileText, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Download,
  Award,
  Compass,
  Check,
  Copy,
  ShieldCheck,
  Target,
  Zap,
  CheckSquare,
  Square,
  BookOpen,
  LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSynthSound } from "./JusticeShieldSection";

export interface StrategicGoal {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  mandate: string;
  constitutionalBasis: string;
  actionPoints: string[];
  metricTarget: string;
  progressPercent: number;
  iconName: string;
}

export const STRATEGIC_GOALS: StrategicGoal[] = [
  {
    id: "goal-1",
    number: "01",
    category: "DE-ESCALATION & PROCEDURAL REASSURANCE",
    title: "Overcome Fear of Authority Encounters",
    subtitle: "Conquering Procedural Anxiety Through Verified Knowledge",
    description: "Every citizen deserves to walk freely without irrational fear of administrative, police, or roadside stops. We provide verified, step-by-step procedural protocols so citizens can interact with law enforcement with complete composure, dignity, and calm assertiveness.",
    mandate: "Eliminate psychological intimidation during stops by training citizens in non-escalation legal protocols.",
    constitutionalBasis: "Article 21 & Article 22(1), Constitution of India / D.K. Basu Guidelines (1997)",
    actionPoints: [
      "Distribute roadside rights guides across all regional languages.",
      "Conduct virtual mock interaction clinics to practice de-escalation dialogue.",
      "Publish verified panchnama and seizure protocols to prevent illegal device confiscation."
    ],
    metricTarget: "50,000+ Citizens Trained & Certified",
    progressPercent: 78,
    iconName: "ShieldAlert"
  },
  {
    id: "goal-2",
    number: "02",
    category: "PLAIN LANGUAGE TRANSLATION",
    title: "Bridge Legal Language Barriers",
    subtitle: "Translating Archaic Statutes into Actionable Scripts",
    description: "Legal texts are deliberately structured in archaic phrases that disempower ordinary people. We translate dense statutes, Bharatiya Nyaya Sanhita provisions, and High Court rulings into clear, plain-language scripts anyone can understand and cite.",
    mandate: "Democratize legal comprehension by providing plain-language summaries of statutory rights.",
    constitutionalBasis: "Article 19(1)(a) (Freedom of Information) & Article 39A (Free Legal Aid)",
    actionPoints: [
      "Create 1-minute audio and visual explainers for high-frequency legal encounters.",
      "Publish searchable cheat-sheets for traffic stops, FIR registrations, and consumer grievances.",
      "Develop multi-lingual pocket cards with exact verbatim legal phrases."
    ],
    metricTarget: "100+ Plain-Language Legal Briefs Indexed",
    progressPercent: 85,
    iconName: "FileText"
  },
  {
    id: "goal-3",
    number: "03",
    category: "CONSTITUTIONAL NEUTRALITY",
    title: "Promote Non-Partisan Democratic Literacy",
    subtitle: "Fostering Rule of Law Above Ideological Divides",
    description: "Constitutional rights belong to every citizen equally, regardless of political affiliation, background, or identity. We maintain strict non-partisan objectivity, anchoring every insight exclusively in constitutional text and Supreme Court jurisprudence.",
    mandate: "Maintain 100% objective, non-partisan legal education accessible to all demographics.",
    constitutionalBasis: "Article 14 (Equality Before Law) & Article 15 (Prohibition of Discrimination)",
    actionPoints: [
      "Peer-review all published materials through neutral constitutional scholars.",
      "Provide open-access tools for civic self-defense without subscription barriers.",
      "Facilitate respectful civic discourse anchored in empirical constitutional precedents."
    ],
    metricTarget: "100% Non-Partisan Compliance Rating",
    progressPercent: 92,
    iconName: "Scale"
  },
  {
    id: "goal-4",
    number: "04",
    category: "ANTI-COERCION SAFEGUARDS",
    title: "Educate Against Unlawful Coercion",
    subtitle: "Immunizing Citizens Against Forced Confessions & Illegal Fines",
    description: "Unlawful demands, on-the-spot cash extortions, and forced confessions crumble when citizens know the exact statutory boundaries of official authority. We equip citizens with knowledge of legal payment avenues and complaint redressal.",
    mandate: "Protect citizens from arbitrary overreach and unauthorized coercive demands.",
    constitutionalBasis: "Article 20(3) (Immunity against Self-Incrimination) & Prevention of Corruption Act",
    actionPoints: [
      "Train citizens in demanding formal electronic receipts (Challans) and officer badge verification.",
      "Provide complaint escalation templates to Police Complaints Authorities (PCA) and Lokayukta.",
      "Educate motorists on DigiLocker / mParivahan legal validity under MVA Rule 139."
    ],
    metricTarget: "Zero Tolerance for Coercive Cash Demands",
    progressPercent: 80,
    iconName: "Eye"
  },
  {
    id: "goal-5",
    number: "05",
    category: "PUBLIC ACCOUNTABILITY",
    title: "Institutionalize Transparent Accountability",
    subtitle: "Leveraging RTI & Public Grievance Portals",
    description: "Public officials are constitutional trustees of citizen power. We teach citizens how to effectively utilize Right to Information (RTI) petitions, municipal grievance mechanisms, and administrative appeal procedures.",
    mandate: "Empower citizens to hold municipal and administrative bodies accountable through lawful inquiry.",
    constitutionalBasis: "Section 3, Right to Information Act, 2005 / Article 19(1)(a)",
    actionPoints: [
      "Provide instant RTI draft generators for common civic concerns like road repairs and public audits.",
      "Track administrative response timelines under Public Services Guarantee Acts.",
      "Offer step-by-step guidance on filing First and Second RTI Appeals."
    ],
    metricTarget: "10,000+ RTI Petitions Successfully Guided",
    progressPercent: 74,
    iconName: "Landmark"
  },
  {
    id: "goal-6",
    number: "06",
    category: "COMMUNITY ALLIANCE",
    title: "Build a Rapid Community Legal Network",
    subtitle: "Decentralized Peer Support & Verification Hub",
    description: "When an individual citizen stands alone, authority can feel overwhelming. We are constructing a nationwide decentralized network of informed citizens, paralegals, and advocates ready to verify legal facts and support one another.",
    mandate: "Create a mutual-assistance community of legally literate citizens across all regions.",
    constitutionalBasis: "Article 19(1)(c) (Right to Form Associations) & Directive Principles Article 39A",
    actionPoints: [
      "Launch localized study groups and civic workshops in universities and community centers.",
      "Establish a verified pro-bono advocate referral directory for urgent fundamental rights breaches.",
      "Host monthly legal literacy webinars and live scenario simulations."
    ],
    metricTarget: "28 States & UTs Active in Legal Literacy Alliance",
    progressPercent: 68,
    iconName: "Award"
  }
];

const IconMap: { [key: string]: LucideIcon } = {
  ShieldAlert,
  FileText,
  Scale,
  Eye,
  Landmark,
  Award,
  ShieldCheck,
  Target,
  Zap
};

interface BookOfGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoalIndex?: number;
  accentColor?: string;
}

export default function BookOfGoalsModal({
  isOpen,
  onClose,
  initialGoalIndex = 0,
  accentColor = "#d4af37"
}: BookOfGoalsModalProps) {
  const [activeGoalIndex, setActiveGoalIndex] = useState(initialGoalIndex);
  const [bookmarkedGoals, setBookmarkedGoals] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("civic_bookmarked_goals");
      return stored ? JSON.parse(stored) : ["goal-1"];
    } catch {
      return ["goal-1"];
    }
  });

  const [completedActions, setCompletedActions] = useState<{ [key: string]: boolean }>(() => {
    try {
      const stored = localStorage.getItem("civic_completed_actions");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        playSynthSound("powerup");
      } catch (e) {}
      if (initialGoalIndex >= 0 && initialGoalIndex < STRATEGIC_GOALS.length) {
        setActiveGoalIndex(initialGoalIndex);
      }
    }
  }, [isOpen, initialGoalIndex]);

  if (!isOpen) return null;

  const currentGoal = STRATEGIC_GOALS[activeGoalIndex] || STRATEGIC_GOALS[0];
  const CurrentIcon = IconMap[currentGoal.iconName] || Scale;
  const isBookmarked = bookmarkedGoals.includes(currentGoal.id);

  const toggleBookmark = (id: string) => {
    try { playSynthSound("click"); } catch (e) {}
    setBookmarkedGoals((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("civic_bookmarked_goals", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleActionItem = (goalId: string, actionIdx: number) => {
    try { playSynthSound("success"); } catch (e) {}
    const key = `${goalId}_action_${actionIdx}`;
    setCompletedActions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("civic_completed_actions", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleNextGoal = () => {
    if (activeGoalIndex < STRATEGIC_GOALS.length - 1) {
      try { playSynthSound("click"); } catch (e) {}
      setActiveGoalIndex((prev) => prev + 1);
    }
  };

  const handlePrevGoal = () => {
    if (activeGoalIndex > 0) {
      try { playSynthSound("click"); } catch (e) {}
      setActiveGoalIndex((prev) => prev - 1);
    }
  };

  const handleCopyGoal = () => {
    try { playSynthSound("success"); } catch (e) {}
    const text = `[CIVIC SHIELD MANDATE ${currentGoal.number} • ${currentGoal.category}]\n` +
      `TITLE: ${currentGoal.title}\n` +
      `SUBTITLE: ${currentGoal.subtitle}\n` +
      `CONSTITUTIONAL BASIS: ${currentGoal.constitutionalBasis}\n\n` +
      `CORE MANDATE:\n${currentGoal.mandate}\n\n` +
      `FULL DETAILS:\n${currentGoal.description}\n\n` +
      `ACTION DIRECTIVES:\n` + currentGoal.actionPoints.map((a, idx) => `[${completedActions[`${currentGoal.id}_action_${idx}`] ? 'X' : ' '}] ${a}`).join("\n") + "\n\n" +
      `TARGET BENCHMARK: ${currentGoal.metricTarget}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* VINTAGE ILLUMINATED CONSTITUTIONAL DOSSIER COMPENDIUM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="relative w-full max-w-5xl bg-gradient-to-b from-[#1c1007] via-[#24150b] to-[#120803] border-2 border-[#d4af37]/60 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Top Gold Leaf Filigree Trim */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#805e13] via-[#ffd754] to-[#805e13] shadow-[0_0_15px_rgba(255,215,84,0.6)]" />

          {/* Modal Vintage Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4af37]/30 bg-[#140b04]/95 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/30 to-black/80 border border-[#ffd754]/60 flex items-center justify-center text-[#ffd754] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#f4ecd8] tracking-wide flex items-center gap-2">
                  <span>Constitutional Directives & Strategic Mandates</span>
                </h3>
                <p className="text-[10px] font-mono text-[#ffd754] uppercase tracking-widest flex items-center gap-2 mt-0.5">
                  <span>CIVIC SHIELD ALLIANCE</span>
                  <span className="w-1 h-1 rounded-full bg-[#ffd754]" />
                  <span>MANDATE {currentGoal.number} OF 06</span>
                </p>
              </div>
            </div>

            {/* Header Right Tools */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyGoal}
                className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#d4af37]/40 text-[#ebdcc2] hover:text-white hover:border-[#ffd754] text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                title="Copy Full Mandate Dossier"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ffd754]" />}
                <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy Dossier"}</span>
              </button>

              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#d4af37]/40 text-[#ffd754] hover:text-white hover:border-[#ffd754] hover:bg-[#d4af37]/20 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                title="Close Goals"
              >
                Close Goals
              </button>
            </div>
          </div>

          {/* Modal Main Body (Grid Layout) */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#d4af37]/25">
            
            {/* Left Sidebar: 6 Goals Selector (4 cols) */}
            <div className="md:col-span-4 p-4 sm:p-5 bg-black/40 space-y-2.5 overflow-y-auto max-h-[600px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#44280f]">
                <span className="text-[9.5px] font-mono text-[#bfa982] uppercase tracking-[0.2em] font-bold">
                  SELECT MANDATE:
                </span>
                <span className="text-[9px] font-mono text-[#ffd754]">
                  6 OF 6 RATIFIED
                </span>
              </div>

              {STRATEGIC_GOALS.map((goal, idx) => {
                const isSelected = idx === activeGoalIndex;
                const hasBookmark = bookmarkedGoals.includes(goal.id);

                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      try { playSynthSound("click"); } catch (e) {}
                      setActiveGoalIndex(idx);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-r from-[#d4af37]/25 via-[#381e09] to-[#200e04] border-[#ffd754] text-white shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#ffd754]/40"
                        : "bg-[#180c04]/60 border-[#3d230d] text-[#cfbe9f] hover:border-[#d4af37]/50 hover:text-white hover:bg-[#2b1608]/70"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected ? "bg-[#ffd754] text-[#1c1007] shadow-[0_0_10px_rgba(255,215,84,0.5)]" : "bg-black/60 text-[#ffd754] border border-[#d4af37]/30"
                      }`}>
                        {goal.number}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-xs font-serif font-bold truncate ${isSelected ? "text-[#ffd754]" : "text-[#ebe0ca]"}`}>
                          {goal.title}
                        </p>
                        <p className="text-[9.5px] text-[#a89574] truncate">
                          {goal.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {hasBookmark && <Bookmark className="w-3 h-3 text-[#ffd754] fill-[#ffd754]" />}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-[#ffd754] translate-x-1" : "text-gray-600"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Main Column: Detailed Strategic Dossier (8 cols) */}
            <div className="md:col-span-8 p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#221206] to-[#120803] overflow-y-auto">
              
              {/* Directive Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#d4af37]/25 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#ffd754] bg-[#d4af37]/20 px-2.5 py-0.5 rounded-full border border-[#d4af37]/40 font-bold uppercase tracking-wider">
                      MANDATE {currentGoal.number} • {currentGoal.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#a89574]">RATIFIED DIRECTIVE</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#f7efe1] leading-snug">
                    {currentGoal.title}
                  </h4>
                  <p className="text-xs text-[#ffd754] italic font-serif">
                    &ldquo;{currentGoal.subtitle}&rdquo;
                  </p>
                </div>

                <button
                  onClick={() => toggleBookmark(currentGoal.id)}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer border shrink-0 ${
                    isBookmarked
                      ? "bg-[#d4af37]/25 border-[#ffd754] text-[#ffd754] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                      : "bg-black/50 border-[#4a2b10] text-[#a89574] hover:text-white"
                  }`}
                  title={isBookmarked ? "Remove Bookmark" : "Bookmark this Goal"}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#ffd754]" : ""}`} />
                </button>
              </div>

              {/* Core Description Box */}
              <div className="p-4 rounded-xl bg-black/50 border border-[#3d230d] text-xs sm:text-sm text-[#e6d8c1] font-light leading-relaxed">
                {currentGoal.description}
              </div>

              {/* Constitutional Statutory Basis Banner */}
              <div className="p-4 rounded-xl bg-[#2e1708]/60 border border-[#d4af37]/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#ffd754]" />
                  <span className="font-mono text-[9.5px] font-bold text-[#ffd754] uppercase tracking-wider">
                    CONSTITUTIONAL & STATUTORY ANCHOR:
                  </span>
                </div>
                <p className="text-xs text-[#f4ecd8] font-sans font-medium pl-6">
                  {currentGoal.constitutionalBasis}
                </p>
              </div>

              {/* Action Directives Interactive Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#cfbe9f] uppercase tracking-wider block">
                    ACTION DIRECTIVES & CITIZEN ROADMAP:
                  </span>
                  <span className="text-[9.5px] font-mono text-[#ffd754]">
                    Click to mark completion
                  </span>
                </div>

                <div className="space-y-2">
                  {currentGoal.actionPoints.map((point, pIdx) => {
                    const isDone = !!completedActions[`${currentGoal.id}_action_${pIdx}`];

                    return (
                      <div 
                        key={pIdx} 
                        onClick={() => toggleActionItem(currentGoal.id, pIdx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isDone 
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" 
                            : "bg-black/40 border-[#3d230d] text-[#cfbe9f] hover:border-[#d4af37]/40 hover:bg-black/60"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <span className={`text-xs font-light leading-relaxed ${isDone ? "line-through opacity-80" : ""}`}>
                          {point}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Benchmark Progress Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#241306] via-[#1a0c04] to-black/60 border border-[#d4af37]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#ffd754] font-bold uppercase tracking-wider text-[10px]">
                    TARGET BENCHMARK:
                  </span>
                  <span className="text-white font-bold">
                    {currentGoal.metricTarget}
                  </span>
                </div>

                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-[#3d230d]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentGoal.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd754] rounded-full shadow-[0_0_10px_rgba(255,215,84,0.5)]"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#d4af37]/30 bg-[#120802]/95 text-[11px] font-mono text-[#bfa982]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{bookmarkedGoals.length} MANDATES BOOKMARKED</span>
            </span>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrevGoal}
                disabled={activeGoalIndex === 0}
                className="px-3.5 py-1.5 rounded-lg bg-black/60 border border-[#44280f] text-[#cfbe9f] disabled:opacity-25 hover:border-[#ffd754] hover:text-white cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={handleNextGoal}
                disabled={activeGoalIndex === STRATEGIC_GOALS.length - 1}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffd754] text-[#1c1007] font-bold disabled:opacity-25 hover:brightness-110 cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
