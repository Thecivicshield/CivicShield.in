import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Sparkles, 
  X, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Lock 
} from "lucide-react";
import { playSynthSound } from "./JusticeShieldSection";

interface QuizQuestion {
  sectionKey: string;
  sectionTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Record<string, QuizQuestion> = {
  hero: {
    sectionKey: "hero",
    sectionTitle: "Sanctuary Ingress Portal",
    question: "Under natural rights precedent and original jurisdiction claims, what is required for an administrative body to enforce summary codes over a sovereign individual?",
    options: [
      "Explicit bilateral consent or an established adhesion contract.",
      "The simple delivery of an automated digital or physical notice.",
      "The officer's verbal assertion of official mandate.",
      "Unilateral approval by any commercial registry office."
    ],
    correctIndex: 0,
    explanation: "Administrative bodies operate on commerce and contracts. Without explicit bilateral consent or an adhesion contract, they lack original personal jurisdiction over a sovereign individual."
  },
  pillars: {
    sectionKey: "pillars",
    sectionTitle: "Sovereign Core Axioms",
    question: "What is the critical jurisdictional distinction between administrative statute codes and Common Law?",
    options: [
      "Administrative codes have absolute supremacy over all natural rights.",
      "Common Law only applies inside specialized military tribunal chambers.",
      "Common Law operates on actual proven damage/harm and consent, whereas statutes are commercial regulatory trust rules.",
      "Statute codes are immutable natural laws of physics."
    ],
    correctIndex: 2,
    explanation: "Common Law requires a damaged party, a broken contract, or criminal intent. Statutes are standard commercial rules designed for public trustees and commercial entities."
  },
  "impact-metrics": {
    sectionKey: "impact-metrics",
    sectionTitle: "Civic Empowerment Ledger",
    question: "How do self-represented litigants systematically disrupt automated administrative fines?",
    options: [
      "By ignoring all formal documents and hoping they dissolve.",
      "By relocating their physical residence to a different municipality.",
      "By paying the fines immediately but enclosing a letter of complaint.",
      "By executing public audits of balance sheets and formally demanding proof of delegated authority."
    ],
    correctIndex: 3,
    explanation: "Filing formal administrative demands for written Delegation of Authority and conducting municipal audits systematically dismantles the legal presumptions on which automated fines rely."
  },
  "justice-shield": {
    sectionKey: "justice-shield",
    sectionTitle: "Jurisprudential Shield Matrix",
    question: "Which reservation should a citizen add when signing a state instrument to avoid waiving their constitutional protections?",
    options: [
      "No reservation is necessary as public forms are entirely safe.",
      "'Without Prejudice / UCC 1-308' or equivalent reservation of rights.",
      "'Signed under protest of high municipal tax rates'.",
      "'This signature is completely void where prohibited by state law'."
    ],
    correctIndex: 1,
    explanation: "Signing 'UCC 1-308' or 'Without Prejudice' explicitly reserves your natural common law rights, ensuring that your signature does not create a binding commercial adhesion contract."
  },
  evidence: {
    sectionKey: "evidence",
    sectionTitle: "Evidentiary Vault Board",
    question: "When an administrative agency issues a presumption, how is it legally destroyed under administrative rules?",
    options: [
      "By formally requesting written Proof of Claim and Delegation of Authority under oath.",
      "By refusing to speak with any public agents.",
      "By shredding the physical notice or returning it without stamps.",
      "By submitting a verbal objection to the court clerk."
    ],
    correctIndex: 0,
    explanation: "An unrebutted presumption stands as truth in law. Formally requesting written Proof of Claim and Delegated Authority under oath forces the claimant to prove their standing, destroying the presumption."
  },
  timeline: {
    sectionKey: "timeline",
    sectionTitle: "Sovereign Mobilization Roadmap",
    question: "What is the primary legal goal of exhausting the pre-court administrative notification timeline?",
    options: [
      "To delay subsequent enforcement actions until the next fiscal quarter.",
      "To trigger automated bankruptcy protocols inside corporate registries.",
      "To establish estoppel by acquiescence and secure an unrebutted administrative record of facts.",
      "To completely bypass commercial UCC codification tables."
    ],
    correctIndex: 2,
    explanation: "By issuing notices and allowing the counter-party to default, you establish 'Estoppel by Acquiescence,' securing an unrebutted administrative record that binds them in any future court proceeding."
  },
  "constitutional-network": {
    sectionKey: "constitutional-network",
    sectionTitle: "Sovereign Alliance Grid",
    question: "How do peer-to-peer digital constitutional networks maintain communications during outages?",
    options: [
      "By subscribing to backup corporate cloud servers.",
      "By requesting temporary emergency licenses from regulatory offices.",
      "By shifting all traffic exclusively to cellular tracking frequencies.",
      "By utilizing decentralized nodes, peer-to-peer data replication, and localized directories."
    ],
    correctIndex: 3,
    explanation: "Peer-to-peer digital grids rely on mesh directories and decentralized, local data copies, bypassing centralized corporate checkpoints and single points of failure."
  },
  "social-feed": {
    sectionKey: "social-feed",
    sectionTitle: "Frontline Dispatch Stream",
    question: "What is a primary citizen safeguard when interacting with a public officer performing official duties?",
    options: [
      "The right to record their conduct on video and broadcast administrative alerts.",
      "The right to declare absolute personal diplomatic immunity on the spot.",
      "The right to issue counter-fines using private commercial templates.",
      "The right to refuse to show physical license documents when driving."
    ],
    correctIndex: 0,
    explanation: "Recording public officers in public space is a constitutionally protected right, serving as instant, objective documentary proof against deprivation of rights under color of law."
  },
  blog: {
    sectionKey: "blog",
    sectionTitle: "Decrypted Intel Dossiers",
    question: "According to sovereign jurisprudence, what is the most powerful tool to de-escalate administrative overreach?",
    options: [
      "Publishing unstructured emotional complaints on commercial social media.",
      "Issuing verbal warnings to administrative personnel at their offices.",
      "Responding with precise, structured legal notices using certified statutory template authority.",
      "Attempting to physically lock administrative agents out of your property."
    ],
    correctIndex: 2,
    explanation: "A structured, polite, and legally grounded written notice established as a matter of record provides concrete leverage and forces administrative compliance."
  },
  newsletter: {
    sectionKey: "newsletter",
    sectionTitle: "Covenant Dispatch Protocols",
    question: "What standard of protection applies to citizens communicating under a private contractual covenant mailing list?",
    options: [
      "General public disclosure rules under the Freedom of Information Act.",
      "Strict private contractual protection and non-disclosure covenants.",
      "Direct oversight by corporate municipal administrative boards.",
      "Absolute diplomatic classification by federal military councils."
    ],
    correctIndex: 1,
    explanation: "Private covenants operate as private contracts, shielding communication from public disclosure rules and securing proprietary statutory defense toolkits."
  }
};

interface SovereignQuizArenaProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedSections: Set<string>;
}

export default function SovereignQuizArena({ isOpen, onClose, unlockedSections }: SovereignQuizArenaProps) {
  const [muted, setMuted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lives, setLives] = useState(3);
  const [quizComplete, setQuizComplete] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isCredentialStamped, setIsCredentialStamped] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Filter questions to ONLY those that the user has actually discovered!
  const availableQuestions = Object.values(QUIZ_QUESTIONS).filter(q => 
    unlockedSections.has(q.sectionKey)
  );

  const totalPossibleQuestions = Object.keys(QUIZ_QUESTIONS).length;

  useEffect(() => {
    // Reset quiz state when opened
    if (isOpen) {
      setCurrentQuestionIdx(0);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setLives(3);
      setQuizComplete(false);
      setCorrectAnswersCount(0);
      setIsCredentialStamped(false);
      setIsCardFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestion = availableQuestions[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(idx);
    if (!muted) playSynthSound("click");
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      if (!muted) playSynthSound("success");
    } else {
      setLives(prev => Math.max(0, prev - 1));
      if (!muted) playSynthSound("shatter");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < availableQuestions.length - 1 && lives > 0) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setQuizComplete(true);
      if (lives > 0 && !muted) {
        playSynthSound("success");
        try {
          window.dispatchEvent(new CustomEvent("unlock-achievement", {
            detail: {
              id: "sovereign-graduate",
              title: "Sovereign Jurisprudence Graduate",
              description: `You scored ${correctAnswersCount}/${availableQuestions.length} in the Trial Arena and verified your administrative knowledge.`,
              category: "quiz"
            }
          }));
        } catch (e) {}
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setLives(3);
    setQuizComplete(false);
    setCorrectAnswersCount(0);
    setIsCredentialStamped(false);
    setIsCardFlipped(false);
    if (!muted) playSynthSound("powerup");
  };

  const handleStampCredential = () => {
    setIsCredentialStamped(true);
    if (!muted) playSynthSound("success");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* High-tech main terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#000a1a] via-black to-[#001233] border-2 border-[#d4af37] shadow-[0_0_60px_rgba(212,175,55,0.4)] rounded-sm p-6 overflow-hidden max-h-[92vh] flex flex-col font-sans text-white text-left"
        >
          {/* Cyber scanner animation bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffd754] to-transparent animate-[shimmerSweep_3s_infinite]" />

          {/* Golden Corner Brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#d4af37]" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#d4af37]" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#d4af37]" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#d4af37]" />

          {/* Terminal grid lines backdrop */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:14px_14px]" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 relative z-10 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Shield className="w-5 h-5 text-[#d4af37] animate-pulse" />
                <Sparkles className="w-3 h-3 text-[#ffd754] absolute -top-1 -right-1 animate-spin-slow" />
              </div>
              <div>
                <span className="block font-mono text-[8px] uppercase tracking-[0.3em] text-[#d4af37] font-extrabold">SOVEREIGN TRIAL ARENA</span>
                <h2 className="font-serif text-lg font-bold text-white tracking-wide">Constitutional Comprehension</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mute toggle */}
              <button
                onClick={() => setMuted(!muted)}
                className="p-1.5 rounded-sm bg-black/40 border border-gray-800 text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-colors cursor-pointer"
                title={muted ? "Unmute sounds" : "Mute sounds"}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-sm bg-[#d4af37]/10 hover:bg-[#d4af37] border border-[#d4af37]/30 text-[#d4af37] hover:text-[#001233] transition-all cursor-pointer"
                title="Exit Arena"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* No rights discovered fallback */}
          {availableQuestions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-5">
              <div className="p-4 bg-red-950/25 border border-red-500/30 rounded-full text-red-400 relative">
                <Lock className="w-10 h-10 animate-bounce" />
                <div className="absolute inset-0 border border-red-500/20 rounded-full animate-ping" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-serif text-lg font-bold text-white">Mainframe Database Locked</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  The Trial Arena is directly calibrated to your discovered natural rights. You have currently decrypted <span className="text-red-400 font-mono font-bold">0 / 10</span> safeguards.
                </p>
                <p className="text-xs text-[#d4af37] italic font-serif">
                  "One cannot defend what they do not comprehend."
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b59526] text-[#001233] text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Return & Scroll Mainframe to Unlock Rights
              </button>
            </div>
          ) : quizComplete || lives === 0 ? (
            /* QUIZ COMPLETED / GAME OVER VIEW */
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 py-2">
              {lives === 0 ? (
                /* Shield Depleted (Game Over) */
                <div className="text-center py-6 space-y-5">
                  <div className="inline-block p-4 bg-red-950/35 border-2 border-red-500 rounded-sm text-red-500">
                    <AlertTriangle className="w-10 h-10 mx-auto animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-white">Sovereign Shield Defeated</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-light">
                      Your legal shielding charges have been completely depleted. You suffered too many procedural presumptions.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-6 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500 text-red-400 hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 inline mr-1.5 animate-spin-slow" /> Re-charge Shielding & Retry
                    </button>
                  </div>
                </div>
              ) : (
                /* Success / Graduation */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-block p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-full text-emerald-400 mb-2">
                      <Award className="w-10 h-10 animate-bounce" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#d4af37]">Trial Assessment Secured</h3>
                    <p className="text-[10px] font-mono text-gray-400">
                      COMPREHENSION STATS: {correctAnswersCount} / {availableQuestions.length} SAFEGUARDS DECRYPTED
                    </p>
                  </div>

                  {/* VIRTUAL SOVEREIGN ID CARD (TACTILE INTERACTIVE EXTREMELY FUN) */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#d4af37]" /> Interactive Sovereign Comprehension Badge (Click to Flip)
                    </span>

                    {/* Flippable card wrapper */}
                    <div 
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="relative w-80 h-48 cursor-pointer select-none [perspective:1000px] group"
                    >
                      <motion.div
                        animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="relative w-full h-full w-full h-full rounded-sm border border-[#d4af37]/40 shadow-[0_0_25px_rgba(212,175,55,0.2)] bg-[#000d21] [transform-style:preserve-3d]"
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full p-4 flex flex-col justify-between backface-hidden [backface-visibility:hidden]">
                          {/* Microchip decoration and watermarks */}
                          <div className="absolute top-4 right-4 w-7 h-6 bg-gradient-to-br from-[#d4af37]/40 to-[#ffd754]/10 rounded-sm border border-[#d4af37]/35 overflow-hidden flex flex-col justify-between p-0.5">
                            <div className="h-[1px] bg-[#d4af37]/50 w-full" />
                            <div className="h-[1px] bg-[#d4af37]/50 w-full" />
                            <div className="h-[1px] bg-[#d4af37]/50 w-full" />
                          </div>

                          <div className="flex items-start gap-2.5">
                            <div className="p-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-sm text-[#d4af37]">
                              <Shield className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-[#d4af37]">JURISDICTIONAL CARD</span>
                              <h4 className="font-serif text-xs font-bold text-white tracking-wide">Sovereign Guardian</h4>
                            </div>
                          </div>

                          {/* Center info */}
                          <div className="space-y-1 my-2">
                            <div className="flex items-center justify-between text-[7px] font-mono text-gray-500">
                              <span>VERIFIED RECOGNITION:</span>
                              <span className="text-[#ffd754] font-bold">LEVEL {availableQuestions.length === totalPossibleQuestions ? "MAX" : availableQuestions.length} COMPREHENSION</span>
                            </div>
                            <div className="text-[10px] font-serif font-bold text-gray-200 tracking-wide truncate">
                              Beneficiary: Citizens of the Covenant
                            </div>
                            <div className="text-[7px] font-mono text-gray-400">
                              DECRYPTED SECURED LAWS: {correctAnswersCount} OF {totalPossibleQuestions} STATUTORY CODES
                            </div>
                          </div>

                          {/* Footer with stamp / seal */}
                          <div className="flex items-end justify-between border-t border-gray-900 pt-2 shrink-0">
                            <div className="font-mono text-[6px] text-gray-500">
                              <div>ISSUED: 2026 COVENANT CALENDAR</div>
                              <div>VALID: IN PERPETUITY (WITHOUT PREJUDICE)</div>
                            </div>
                            
                            {/* Tap to stamp interaction */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStampCredential();
                              }}
                              className="relative"
                            >
                              <AnimatePresence mode="wait">
                                {!isCredentialStamped ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileActive={{ scale: 0.95 }}
                                    className="px-2 py-1 bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd754] text-[6px] font-mono font-bold uppercase rounded-sm animate-pulse tracking-wide"
                                  >
                                    Stamp Seal
                                  </motion.button>
                                ) : (
                                  <motion.div
                                    initial={{ scale: 2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-7 h-7 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-serif text-[8px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                                    title="Certified Sovereign Seal of Trust"
                                  >
                                    UCC
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 w-full h-full p-4 flex flex-col justify-between bg-[#00050e] rounded-sm border border-[#d4af37]/35 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
                          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-xl" />
                          
                          <div className="space-y-2 text-[7px] font-sans text-gray-400 leading-normal text-left">
                            <span className="font-mono text-[8px] text-[#ffd754] font-bold block border-b border-gray-900 pb-1">COVENANT LEGAL NOTICE :</span>
                            <p>
                              1. This instrument certifies that the beneficiary has successfully identified administrative presumptions and asserted their natural jurisdiction.
                            </p>
                            <p>
                              2. Signed and authenticated under reserve of all natural rights. UCC 1-308 / without prejudice.
                            </p>
                            <p>
                              3. All administrative claims are rebutted unless official written Delegation of Authority is produced under penalty of perjury.
                            </p>
                          </div>

                          <div className="text-center font-mono text-[6px] text-gray-600 mt-2">
                            SECURITY HASH: CC-{availableQuestions.length}S-{correctAnswersCount}C-2026
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Complete Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                    <button
                      onClick={handleRestartQuiz}
                      className="w-full sm:flex-1 py-2.5 bg-black hover:bg-[#001233] border border-[#d4af37]/35 text-gray-300 hover:text-[#d4af37] text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Start Trial Again
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full sm:flex-1 py-2.5 bg-[#d4af37] hover:bg-[#ffd754] text-[#001233] text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer shadow-md"
                    >
                      Confirm Comprehension & Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ACTIVE QUIZ SCREEN */
            <div className="flex-1 flex flex-col justify-between overflow-hidden relative z-10 py-1 space-y-4">
              {/* Question progress and shields tracker */}
              <div className="flex items-center justify-between font-mono text-[9px] text-gray-400 bg-black/40 border border-gray-900 p-2 rounded-sm shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#d4af37] font-bold">STAGE {currentQuestionIdx + 1} / {availableQuestions.length}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-300 font-light truncate max-w-[180px]">{currentQuestion.sectionTitle}</span>
                </div>
                
                {/* Visual heart/shield charges */}
                <div className="flex items-center gap-1">
                  <span className="text-[8px] uppercase text-gray-500 mr-1">SHIELD CHARGES:</span>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={idx < lives ? { scale: [1, 1.15, 1], opacity: 1 } : { scale: 0.8, opacity: 0.15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Shield 
                        className={`w-3.5 h-3.5 ${
                          idx < lives 
                            ? "text-[#d4af37] fill-[#d4af37]/20" 
                            : "text-red-500"
                        }`} 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-gray-900/40 rounded-full overflow-hidden shrink-0">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIdx) / availableQuestions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd754]"
                />
              </div>

              {/* The Question Card */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                <div className="bg-[#001233]/40 border border-[#d4af37]/15 p-4 rounded-sm text-left">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-[#ffd754] shrink-0 mt-0.5" />
                    <h3 className="font-serif text-sm font-semibold text-white leading-relaxed tracking-wide">
                      {currentQuestion.question}
                    </h3>
                  </div>
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 gap-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    let optionStyle = "bg-black/35 border-gray-800 hover:border-[#d4af37]/45 hover:bg-[#001233]/20";
                    
                    if (isSubmitted) {
                      if (idx === currentQuestion.correctIndex) {
                        optionStyle = "bg-emerald-950/25 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                      } else if (isSelected) {
                        optionStyle = "bg-red-950/25 border-red-500 text-red-300";
                      } else {
                        optionStyle = "bg-black/20 border-gray-900 opacity-40";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-[#d4af37]/10 border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.1)]";
                    }

                    return (
                      <motion.button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        whileHover={!isSubmitted ? { x: 4, transition: { duration: 0.1 } } : {}}
                        className={`w-full p-3 border rounded-sm text-left text-xs font-sans leading-normal transition-all cursor-pointer flex items-start gap-2.5 ${optionStyle}`}
                      >
                        <span className={`w-4 h-4 rounded-full border text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected 
                            ? "border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10" 
                            : "border-gray-800 text-gray-500"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 font-light">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Dynamic Explanation Panel */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 border rounded-sm text-left relative overflow-hidden ${
                        selectedAnswer === currentQuestion.correctIndex
                          ? "bg-emerald-950/15 border-emerald-500/20 text-emerald-400"
                          : "bg-red-950/15 border-red-500/20 text-red-400"
                      }`}
                    >
                      {/* Tactile legal stamp on quiz submit */}
                      <div className="absolute top-1 right-2 z-30 pointer-events-none select-none rubber-stamp-impact">
                        <div className={`border-2 border-dashed font-mono font-black tracking-[0.15em] text-[8px] px-2.5 py-0.5 rounded rotate-12 ${
                          selectedAnswer === currentQuestion.correctIndex
                            ? "border-emerald-400 text-emerald-400 bg-black/90"
                            : "border-red-500 text-red-400 bg-black/90"
                        }`}>
                          {selectedAnswer === currentQuestion.correctIndex ? "VERIFIED" : "REBUTTED"}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 relative z-10">
                        {selectedAnswer === currentQuestion.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold block">
                            {selectedAnswer === currentQuestion.correctIndex ? "Correct Safeguard Verified" : "Misconception Rebuttal"}
                          </span>
                          <p className="text-xs text-gray-300 font-sans leading-normal font-light">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action control bar */}
              <div className="pt-3 border-t border-gray-900/60 flex items-center justify-between shrink-0">
                <div className="text-[9px] font-mono text-gray-500">
                  {isSubmitted 
                    ? "REPUTABLE SOURCES INTEGRATED" 
                    : "SELECT A CONSTITUTIONAL ANSWER"
                  }
                </div>

                <div>
                  {!isSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={handleSubmitAnswer}
                      className={`px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm border transition-all ${
                        selectedAnswer !== null
                          ? "bg-[#d4af37] hover:bg-[#ffd754] border-[#d4af37] text-[#001233] cursor-pointer"
                          : "bg-transparent border-gray-800 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Expose Answer <ChevronRight className="w-3 h-3 inline ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 bg-[#d4af37] hover:bg-[#ffd754] border border-[#d4af37] text-[#001233] text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-md"
                    >
                      {currentQuestionIdx < availableQuestions.length - 1 && lives > 0
                        ? "Next Safeguard Trial"
                        : "Expose Assessment"
                      } <ChevronRight className="w-3 h-3 inline ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Locked/Total overview footer */}
          <div className="mt-4 pt-2.5 border-t border-gray-900/60 flex items-center justify-between font-mono text-[8px] text-gray-500 shrink-0">
            <span>COVENANT COMPLIANCE SECURED</span>
            <span className="text-[#d4af37]">
              {unlockedSections.size} / 10 RIGHTS DISCOVERED
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
