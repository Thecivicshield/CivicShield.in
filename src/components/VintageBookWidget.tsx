import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Sparkles, 
  Feather, 
  ShieldCheck, 
  Scale, 
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Star,
  MessageSquareQuote,
  Plus,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BookReview } from "../types";

interface VintageBookProps {
  accentColor?: string;
}

const BOOK_PAGES = [
  {
    chapter: "Prologue",
    title: "The Sovereign Citizen",
    quote: "“The Constitution was not framed to grant liberty to citizens; it was framed to restrain government from infringing upon liberties already inherent.”",
    content: [
      "In any free society, legal literacy is the primary barrier against arbitrary excess. When a citizen understands the exact boundaries of statutory power, intimidation evaporates.",
      "This handbook contains no theoretical abstractions—only tested, procedural shields that safeguard your liberty, property, and digital privacy during real encounters."
    ],
    scripture: "Preamble & Article 21"
  },
  {
    chapter: "Chapter I",
    title: "The 3 Inviolable Rules",
    quote: "“Calm clarity disarms hostility faster than argument.”",
    content: [
      "Rule 1: Always clarify encounter status immediately by asking: 'Am I being detained, Officer, or am I free to go?'",
      "Rule 2: If detained, require verifiable grounds: 'What is the specific reasonable suspicion for my detainment?'",
      "Rule 3: Register peaceful, non-consensual objection: 'I do not consent to searches of my person, vehicle, or phone, but I will not resist physically.'"
    ],
    scripture: "D.K. Basu Guidelines (1997)"
  },
  {
    chapter: "Chapter II",
    title: "Sanctity of the Digital Device",
    quote: "“Your phone is not an open ledger; it is the modern sanctum of personal conscience.”",
    content: [
      "Under Article 20(3) (Self-Incrimination) and the landmark Puttaswamy privacy judgment, police cannot force you to unlock your phone, reveal passcodes, or inspect chats without a judicial search warrant.",
      "If seized under Sec 102 CrPC / Sec 107 BNSS, insist upon an immediate Seizure Memo (Panchnama) recording device serial number and physical hash."
    ],
    scripture: "K.S. Puttaswamy (Retd.) v. UOI"
  },
  {
    chapter: "Chapter III",
    title: "Pro-Se Self Representation",
    quote: "“The courtroom is open to all who come with truth and procedural discipline.”",
    content: [
      "You are never legally required to pay prohibitive advocate retainers to speak in court. Under Section 32 of the Advocates Act 1961, any citizen may apply as a Party-in-Person.",
      "Structure your filing: (1) Index, (2) Synopsis & Timeline, (3) Numbered factual paragraphs, (4) Specific Prayer, and (5) Signed Verification Affidavit."
    ],
    scripture: "Section 32, Advocates Act 1961"
  },
  {
    chapter: "Chapter IV",
    title: "The Sunlight of Public Audit",
    quote: "“Public officials are custodians of public wealth, not its owners.”",
    content: [
      "Under Section 6 of the RTI Act 2005, you have the statutory right to inspect records, road tender files, and municipal accounts.",
      "Public Information Officers who fail to reply within 30 days face mandatory personal penalties of ₹250/day under Section 20(1)."
    ],
    scripture: "RTI Act 2005 • Sec 4 & 6"
  },
  {
    chapter: "Epilogue",
    title: "The Citizen's Creed",
    quote: "“Liberty is maintained not by the benevolence of the state, but by the vigilance of the informed citizen.”",
    content: [
      "Carry this knowledge not as a weapon of aggression, but as an armor of quiet dignity.",
      "When one citizen stands confidently upon the law, the entire community is protected from overreach."
    ],
    scripture: "Civic Shield Mandate"
  }
];

export default function VintageBookWidget({ accentColor = "#D4AF37" }: VintageBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"book" | "reviews">("book");
  const [currentPage, setCurrentPage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewChapter, setReviewChapter] = useState("Chapter I: The 3 Inviolable Rules");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch reviews on mount and when modal opens
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/book-reviews");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch (e) {
      console.warn("Could not fetch book reviews:", e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Track page reading event to server disk store
  const trackPageRead = async (pageNum: number) => {
    try {
      await fetch("/api/track-reading-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageNum + 1 })
      });
    } catch (e) {}
  };

  // Soft vintage page rustle synth
  const playPageSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  const nextPage = () => {
    if (currentPage < BOOK_PAGES.length - 1) {
      playPageSound();
      const nextIdx = currentPage + 1;
      setCurrentPage(nextIdx);
      trackPageRead(nextIdx);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      playPageSound();
      const prevIdx = currentPage - 1;
      setCurrentPage(prevIdx);
      trackPageRead(prevIdx);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/book-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: "The Sovereign Defense Doctrine",
          chapterTitle: reviewChapter,
          reviewerName: reviewerName.trim(),
          rating: reviewRating,
          reviewText: reviewText.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setReviews(prev => [data.review, ...prev]);
        }
        setReviewSuccess(true);
        setReviewerName("");
        setReviewText("");
        setTimeout(() => {
          setReviewSuccess(false);
          setIsWritingReview(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Failed submitting review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const page = BOOK_PAGES[currentPage];

  return (
    <>
      {/* VINTAGE POCKET BOOK TRIGGER (Compact, Antique Leather-Bound Tome) */}
      <div className="relative inline-block my-2">
        <motion.button
          type="button"
          onClick={() => {
            playPageSound();
            setIsOpen(true);
            trackPageRead(currentPage);
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-sm bg-gradient-to-r from-[#2c1810] via-[#3d2314] to-[#1e0f0a] border-2 border-[#d4af37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,215,84,0.3)] text-left cursor-pointer transition-all hover:border-[#ffd754]"
          title="Click to Open the Vintage Handbook of Rights"
        >
          {/* Embossed Gold Spine Strip */}
          <div className="w-2 self-stretch bg-gradient-to-b from-[#b38827] via-[#ffd754] to-[#805e15] rounded-l-xs shadow-inner" />

          {/* Book Icon & Ribbon */}
          <div className="relative">
            <BookOpen className="w-5 h-5 text-[#ffd754] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Title & Micro Tag */}
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#ffd754] font-bold">
              CIVIC SHIELD GOALS & CODEX
            </span>
            <span className="text-xs font-serif italic text-amber-100 font-medium leading-tight">
              The Sovereign Defense Doctrine
            </span>
          </div>

          {/* Small Antique Lock Charm */}
          <div className="ml-1 pl-2 border-l border-[#d4af37]/30 text-[#ffd754] text-[10px] font-mono opacity-80 group-hover:opacity-100 flex items-center gap-1">
            <span>Read</span>
            <span className="text-xs">→</span>
          </div>
        </motion.button>
      </div>

      {/* INTERACTIVE FULL-SCREEN / MODAL PARCHMENT TOME */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            
            {/* Backdrop click to close */}
            <div 
              className="fixed inset-0"
              onClick={() => setIsOpen(false)} 
            />

            {/* Vintage Book Frame */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 25 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative z-10 w-full max-w-2xl bg-[#f7f1e3] text-[#2c1d11] rounded-lg shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.4)] border-4 border-[#3e2723] overflow-hidden flex flex-col max-h-[90vh] my-auto"
              style={{
                backgroundImage: `radial-gradient(#d7c4a3 1px, transparent 1px), linear-gradient(to bottom, #fdfbf7, #f4ecd8)`,
                backgroundSize: "20px 20px, 100% 100%"
              }}
            >
              {/* Antique Leather Outer Header / Banner */}
              <div className="bg-gradient-to-r from-[#2c1810] via-[#3e2415] to-[#1e0f0a] px-4 sm:px-5 py-3.5 border-b-2 border-[#d4af37] flex items-center justify-between text-[#ffd754] shrink-0">
                <div className="flex items-center gap-2.5">
                  <Feather className="w-4 h-4 text-[#ffd754]" />
                  <span className="font-serif italic text-xs sm:text-sm tracking-wider text-amber-100 font-semibold">
                    Civic Shield Sovereign Goals & Codex
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mode switcher: Doctrine vs Reviews */}
                  <div className="flex items-center bg-black/30 rounded p-0.5 border border-[#d4af37]/40 text-[10px] font-mono">
                    <button
                      onClick={() => setActiveTab("book")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        activeTab === "book" ? "bg-[#d4af37] text-[#001a4d] font-bold" : "text-amber-200 hover:text-white"
                      }`}
                    >
                      Doctrine
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("reviews");
                        fetchReviews();
                      }}
                      className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                        activeTab === "reviews" ? "bg-[#d4af37] text-[#001a4d] font-bold" : "text-amber-200 hover:text-white"
                      }`}
                    >
                      <span>Reviews</span>
                      <span className="text-[9px] px-1 bg-black/40 rounded-full text-amber-300">
                        {reviews.length}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsBookmarked(isBookmarked === currentPage ? null : currentPage);
                    }}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      isBookmarked === currentPage ? "text-[#ffd754] bg-black/40" : "text-amber-300 hover:text-white"
                    }`}
                    title={isBookmarked === currentPage ? "Bookmarked!" : "Bookmark Page"}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked === currentPage ? "fill-[#ffd754]" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 text-amber-300 hover:text-white rounded transition-colors cursor-pointer"
                    title={soundEnabled ? "Mute Page Sounds" : "Enable Page Sounds"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-2.5 py-1 text-xs text-amber-200 hover:text-white bg-black/40 hover:bg-black/60 rounded border border-amber-500/30 transition-all font-mono font-bold uppercase cursor-pointer"
                    title="Close Codex"
                  >
                    Close Codex
                  </button>
                </div>
              </div>

              {/* TAB 1: DOCTRINE PAGES */}
              {activeTab === "book" ? (
                <div className="p-6 sm:p-10 space-y-6 flex-1 overflow-y-auto flex flex-col justify-between relative">
                  
                  {/* Antique Watermark / Emblem */}
                  <div className="absolute right-6 bottom-16 opacity-5 pointer-events-none text-[#2c1d11]">
                    <Scale className="w-48 h-48" />
                  </div>

                  <div className="space-y-4">
                    {/* Chapter Heading */}
                    <div className="flex items-center justify-between border-b border-[#c8b69b] pb-2">
                      <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8c6239] font-bold">
                        {page.chapter}
                      </span>
                      <span className="text-[10px] font-serif italic text-[#8c6239]">
                        {page.scripture}
                      </span>
                    </div>

                    {/* Page Title */}
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2c1810] tracking-tight">
                      {page.title}
                    </h3>

                    {/* Golden Quote Ribbon */}
                    <div className="bg-[#ede1ca] p-3.5 rounded-sm border-l-4 border-[#b38827] shadow-inner">
                      <p className="text-xs sm:text-sm font-serif italic text-[#3e2415] leading-relaxed">
                        {page.quote}
                      </p>
                    </div>

                    {/* Main Paragraphs */}
                    <div className="space-y-3 pt-1">
                      {page.content.map((para, pIdx) => (
                        <p key={pIdx} className="text-xs sm:text-sm text-[#3c2a1e] font-serif leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Page Navigation & Pagination Footer */}
                  <div className="pt-6 border-t border-[#c8b69b] flex items-center justify-between text-xs font-serif shrink-0">
                    
                    {/* Previous Page Button */}
                    <button
                      type="button"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded border border-[#bfa888] transition-all cursor-pointer ${
                        currentPage === 0
                          ? "opacity-30 cursor-not-allowed bg-transparent text-gray-500"
                          : "bg-[#ebdcc4] hover:bg-[#dfcbb0] text-[#2c1810] font-semibold shadow-xs"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {/* Page Counter Indicator */}
                    <div className="flex items-center gap-1.5">
                      {BOOK_PAGES.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            playPageSound();
                            setCurrentPage(idx);
                            trackPageRead(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            currentPage === idx 
                              ? "bg-[#8c6239] w-5" 
                              : "bg-[#c8b69b] hover:bg-[#8c6239]/60"
                          }`}
                          title={`Go to page ${idx + 1}`}
                        />
                      ))}
                      <span className="text-[11px] font-mono text-[#8c6239] ml-2">
                        {currentPage + 1} / {BOOK_PAGES.length}
                      </span>
                    </div>

                    {/* Next Page Button */}
                    <button
                      type="button"
                      onClick={nextPage}
                      disabled={currentPage === BOOK_PAGES.length - 1}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded border border-[#bfa888] transition-all cursor-pointer ${
                        currentPage === BOOK_PAGES.length - 1
                          ? "opacity-30 cursor-not-allowed bg-transparent text-gray-500"
                          : "bg-[#ebdcc4] hover:bg-[#dfcbb0] text-[#2c1810] font-semibold shadow-xs"
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ) : (
                /* TAB 2: ADVOCATE & READER REVIEWS (Synced to Disk & Source Code) */
                <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#c8b69b] pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-xl text-[#2c1810]">
                        Reader & Advocate Reviews
                      </h4>
                      <p className="text-xs text-[#705234] font-serif">
                        Verified peer testimonials persisted across system builds
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsWritingReview(!isWritingReview)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#8c6239] hover:bg-[#70502c] text-[#f7f1e3] text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isWritingReview ? "Cancel" : "Write Review"}</span>
                    </button>
                  </div>

                  {/* Review Submission Form */}
                  <AnimatePresence>
                    {isWritingReview && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmitReview}
                        className="bg-[#ede1ca] p-4 rounded-sm border border-[#bfa888] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono uppercase text-[#705234] block mb-1">
                              Your Name / Designation
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Adv. Ananya Roy (High Court)"
                              value={reviewerName}
                              onChange={(e) => setReviewerName(e.target.value)}
                              className="w-full bg-[#fdfbf7] border border-[#bfa888] rounded p-2 text-xs text-[#2c1d11] focus:outline-none focus:ring-1 focus:ring-[#8c6239]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono uppercase text-[#705234] block mb-1">
                              Chapter / Topic Referenced
                            </label>
                            <select
                              value={reviewChapter}
                              onChange={(e) => setReviewChapter(e.target.value)}
                              className="w-full bg-[#fdfbf7] border border-[#bfa888] rounded p-2 text-xs text-[#2c1d11] focus:outline-none focus:ring-1 focus:ring-[#8c6239]"
                            >
                              <option value="Prologue: The Sovereign Citizen">Prologue: The Sovereign Citizen</option>
                              <option value="Chapter I: The 3 Inviolable Rules">Chapter I: The 3 Inviolable Rules</option>
                              <option value="Chapter II: Sanctity of the Digital Device">Chapter II: Sanctity of the Digital Device</option>
                              <option value="Chapter III: Pro-Se Self Representation">Chapter III: Pro-Se Self Representation</option>
                              <option value="Chapter IV: The Sunlight of Public Audit">Chapter IV: The Sunlight of Public Audit</option>
                              <option value="Epilogue: The Citizen's Creed">Epilogue: The Citizen's Creed</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#705234] block mb-1">
                            Rating
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-1 text-[#b38827] hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star className={`w-4 h-4 ${reviewRating >= star ? "fill-[#b38827]" : "text-gray-400"}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#705234] block mb-1">
                            Review / Practical Legal Application
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Describe how this procedural guidance aided your case or encounter..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full bg-[#fdfbf7] border border-[#bfa888] rounded p-2 text-xs text-[#2c1d11] focus:outline-none focus:ring-1 focus:ring-[#8c6239]"
                          />
                        </div>

                        {reviewSuccess && (
                          <p className="text-xs text-emerald-800 font-mono flex items-center gap-1.5 bg-emerald-100 p-2 rounded">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            Review saved directly to disk and synced across redeployments!
                          </p>
                        )}

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsWritingReview(false)}
                            className="px-3 py-1.5 rounded border border-[#bfa888] text-[#705234] text-xs font-mono cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="px-4 py-1.5 rounded bg-[#8c6239] hover:bg-[#70502c] disabled:opacity-50 text-[#f7f1e3] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                          >
                            {submittingReview ? "Persisting..." : "Save Review"}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-xs font-serif italic text-gray-500 text-center py-6">
                        No reviews yet. Be the first citizen to leave a doctrine assessment!
                      </p>
                    ) : (
                      reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-[#fdfbf7] p-4 rounded border border-[#dfcbb0] shadow-xs space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-serif font-bold text-sm text-[#2c1810] block">
                                {rev.reviewerName}
                              </span>
                              <span className="text-[10px] font-mono text-[#8c6239] uppercase tracking-wider">
                                {rev.chapterTitle || "The Sovereign Defense Doctrine"}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, sIdx) => (
                                <Star
                                  key={sIdx}
                                  className={`w-3.5 h-3.5 ${
                                    sIdx < rev.rating ? "text-[#b38827] fill-[#b38827]" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-xs font-serif text-[#3c2a1e] leading-relaxed italic">
                            "{rev.reviewText}"
                          </p>

                          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pt-1 border-t border-[#ede1ca]">
                            <span>{rev.date}</span>
                            {rev.verified && (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified Citizen
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
