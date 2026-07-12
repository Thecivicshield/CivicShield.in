import React, { useEffect, useState } from "react";
import { useScroll, motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, BookOpen, Compass, Award, X, ChevronRight, FileText, CheckCircle2 } from "lucide-react";

// Map section DOM element IDs to user-friendly legal names
const SECTION_NAMES: Record<string, { title: string; desc: string }> = {
  hero: { title: "Sovereign Sanctuary Portal", desc: "Initiated classified archive access" },
  pillars: { title: "Foundational Pillars", desc: "Discovered the constitutional core safeguards" },
  "impact-metrics": { title: "Campaign Impact Metrics", desc: "Analyzed citizen empowerment stats" },
  "justice-shield": { title: "The Justice Shield Matrix", desc: "Unlocked codifications & statute handbook" },
  evidence: { title: "Vault Evidence Folders", desc: "Revealed administrative compliance reports" },
  timeline: { title: "Active Campaign Roadmap", desc: "Synchronized milestone coordinates" },
  "constitutional-network": { title: "Digital Constitutional Network", desc: "Mapped global sovereign connections" },
  "social-feed": { title: "Legal Dispatches Stream", desc: "Connected to front-line communications" },
  blog: { title: "Classified Intel Archives", desc: "Decrypted detailed citizen handbooks" },
  newsletter: { title: "Covenant Dispatch Subscription", desc: "Integrated with sovereign newsletter" }
};

// Detailed statutory records for each discoverable right
const SECTION_DETAILS: Record<string, {
  title: string;
  subtitle: string;
  codeReference: string;
  explanation: string;
  proceduralRights: string[];
}> = {
  hero: {
    title: "Sovereign Sanctuary Portal",
    subtitle: "Inviolable Personal Dominion & Freedom",
    codeReference: "Common Law Precedent & Magna Carta Art. 39",
    explanation: "This portal establishes the core claim of physical and sovereign integrity. Every individual possesses original jurisdictional sovereignty, protected from arbitrary administrative summons or color-of-law notices unless explicit bilateral consent is established.",
    proceduralRights: [
      "Inviolable territorial boundary rights",
      "Immunity from non-consensual adhesion contracts",
      "Original jurisdiction claim protection"
    ]
  },
  pillars: {
    title: "Foundational Pillars",
    subtitle: "The Three Pillars of Legal Self-Defense",
    codeReference: "Constitutional Safeguard - Absolute Natural Rights",
    explanation: "Understanding the distinction between Administrative Code, statutory legislation, and Common Law. The Pillars empower individuals to object to summary administrative decrees by asserting their status as a beneficiary of the trust, not the trustee.",
    proceduralRights: [
      "Distinction of statutory vs common law",
      "Establishment of beneficiary trust status",
      "Refusal of summary administrative delegation"
    ]
  },
  "impact-metrics": {
    title: "Campaign Impact Metrics",
    subtitle: "Quantifying Citizen Empowerment & Defense",
    codeReference: "Public Records Act & Information Autonomy Regulations",
    explanation: "Tracks the growth of self-represented litigant success and administrative pushback. Demonstrates a scalable blueprint for communities to reclaim local councils and protect private property through structured judicial feedback loops.",
    proceduralRights: [
      "Access to certified public records",
      "Public audit of municipal balance sheets",
      "Freedom from administrative fine automation"
    ]
  },
  "justice-shield": {
    title: "The Justice Shield Matrix",
    subtitle: "Codification & Statute Enforcement Safeguards",
    codeReference: "United States Code Title 42 Section 1983 & UCC 1-308",
    explanation: "Contains precise statutory scripts and administrative objection blueprints. It lists exactly how to sign documents under reserve of rights (without prejudice) so you do not waive your constitutional protections when forced to sign state instruments.",
    proceduralRights: [
      "Uniform Commercial Code UCC 1-308 rights reservation",
      "Defense against deprivation of rights under color of law",
      "Mandatory public official bond liability claims"
    ]
  },
  evidence: {
    title: "Vault Evidence Folders",
    subtitle: "Classified Administrative Compliance Reports",
    codeReference: "Rules of Evidence & Administrative Procedure Acts",
    explanation: "The gathering and presenting of hard documentary proof. Highlights that administrative bodies operate on presumptions, which are destroyed the moment you formally demand written proof of claim and official delegation of authority.",
    proceduralRights: [
      "Destruction of uncontested legal presumptions",
      "Formal demand for written Delegation of Authority",
      "Admissible record certification protocols"
    ]
  },
  timeline: {
    title: "Active Campaign Roadmap",
    subtitle: "Chronology of Sovereign Milestones",
    codeReference: "Sovereign Action Plan & Civic Defense Roadmap",
    explanation: "Strategic milestones mapped out for total legal autonomy. From creating initial declarations to building sovereign physical hubs, this timeline establishes the framework for progressive community empowerment.",
    proceduralRights: [
      "Step-by-step notice of claim timeline",
      "Pre-court administrative exhaustion process",
      "Estoppel by acquiescence filing intervals"
    ]
  },
  "constitutional-network": {
    title: "Digital Constitutional Network",
    subtitle: "Sovereign Node Peer-to-Peer Grid",
    codeReference: "First Amendment Right of Assembly & Cryptographic Association",
    explanation: "The connection matrix linking localized sovereign nodes. Bypasses centralized corporate channels using peer-to-peer communication tools and decentralized directories, establishing robust local emergency communications.",
    proceduralRights: [
      "Decentralized physical and digital assembly",
      "Uncensorable peer-to-peer data replication",
      "Mutual legal defense cooperative networks"
    ]
  },
  "social-feed": {
    title: "Legal Dispatches Stream",
    subtitle: "Frontline Sovereign Alerts & Communications",
    codeReference: "Freedom of Speech & Unfiltered Public Reporting",
    explanation: "Real-time feeds detailing local council overrides, code enforcement pushbacks, and operational victories. These updates build collective situational awareness for frontline legal self-defense.",
    proceduralRights: [
      "Right to record public officers in duty performance",
      "Instant citizen reporting of rights violations",
      "Dissemination of administrative alert systems"
    ]
  },
  blog: {
    title: "Classified Intel Archives",
    subtitle: "In-Depth Administrative De-escalation Briefs",
    codeReference: "Decrypted Sovereign Jurisprudence & Treatises",
    explanation: "In-depth, peer-reviewed legal treatises written by experienced self-represented litigators. Guides readers step-by-step through administrative de-escalation, public auditing, and personal sovereignty filings.",
    proceduralRights: [
      "Explanatory briefs on legal word deceptions",
      "Cross-jurisdictional common law sovereignty studies",
      "Step-by-step guidance on notice templates"
    ]
  },
  newsletter: {
    title: "Covenant Dispatch Subscription",
    subtitle: "Securing Permanent Sovereign Directives",
    codeReference: "Private Contractual Covenant & Protected Mailing list",
    explanation: "The ongoing line of security briefings, statutory defense toolkits, and template updates delivered directly to your private communication channel under non-disclosure protection.",
    proceduralRights: [
      "Protected private communication channel delivery",
      "Bi-weekly template updates and legal alerts",
      "Direct action coordinates for network events"
    ]
  }
};

export default function FloatingScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [unlockedSections, setUnlockedSections] = useState<Set<string>>(new Set(["hero"]));
  const [discoveryNotification, setDiscoveryNotification] = useState<{
    id: string;
    title: string;
    desc: string;
    sectionKey: string;
  } | null>(null);

  // For the detail popover card
  const [selectedDetail, setSelectedDetail] = useState<typeof SECTION_DETAILS[keyof typeof SECTION_DETAILS] | null>(null);

  // Scroll position to fill the glowing shield/sword
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollPercent(Math.min(100, Math.max(0, latest * 100)));
    });
  }, [scrollYProgress]);

  // Track sections crossing the viewport to trigger "✓ Right Discovered"
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -40% 0px", // Trigger when section occupies the middle portion of viewport
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && SECTION_NAMES[sectionId]) {
            setActiveSection(sectionId);
            
            // Check if this is the first time we discover this "right / section"
            setUnlockedSections((prev) => {
              if (!prev.has(sectionId)) {
                const updated = new Set(prev);
                updated.add(sectionId);
                
                // Trigger a beautiful transient notification with the sectionKey attached
                setDiscoveryNotification({
                  id: `${sectionId}-${Date.now()}`,
                  title: SECTION_NAMES[sectionId].title,
                  desc: SECTION_NAMES[sectionId].desc,
                  sectionKey: sectionId
                });
                
                return updated;
              }
              return prev;
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all possible sections in DOM
    const targetIds = [
      "hero",
      "pillars",
      "impact-metrics",
      "justice-shield",
      "evidence",
      "timeline",
      "constitutional-network",
      "social-feed",
      "blog",
      "newsletter"
    ];

    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Automatically clear notification after 6 seconds
  useEffect(() => {
    if (discoveryNotification) {
      const t = setTimeout(() => {
        setDiscoveryNotification(null);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [discoveryNotification]);

  return (
    <>
      {/* COMPACT FLOATING SHIELD PROGRESS INDICATOR */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed right-6 bottom-24 z-[400] hidden md:block select-none group font-sans"
        id="sovereign-hud-scroll"
      >
        {/* Tooltip on Hover showing the current active sovereign section */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2 whitespace-nowrap">
          <div className="bg-[#001233]/95 border border-[#d4af37]/45 shadow-[0_0_15px_rgba(212,175,55,0.25)] rounded-sm px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#d4af37] block mb-0.5 font-bold">Active Jurisdiction</span>
            <span className="text-white text-xs font-serif font-medium">{SECTION_NAMES[activeSection]?.title || "The Civic Shield"}</span>
            <span className="text-[8px] font-mono text-gray-400 block mt-0.5">[ Click to decypher details ]</span>
          </div>
        </div>

        {/* Small Glowing Sword Container */}
        <div 
          onClick={() => {
            const details = SECTION_DETAILS[activeSection];
            if (details) {
              setSelectedDetail(details);
            }
          }}
          className="w-12 h-16 flex items-center justify-center bg-black/90 border border-[#d4af37]/20 rounded-sm p-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md hover:border-[#d4af37]/65 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer active:scale-95"
        >
          <svg viewBox="0 0 100 120" className="w-full h-full text-gray-800" fill="none">
            <defs>
              {/* Dynamic clip path for filling the blade from top to bottom */}
              <clipPath id="sword-fill-clip">
                <rect x="0" y="0" width="100" height={15 + (70 * (scrollPercent / 100))} />
              </clipPath>
              {/* Gold glow filter */}
              <filter id="sword-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. THE SWORD UNLIT SHADOW / UNDERLAY */}
            <g className="opacity-40">
              {/* Blade underlay */}
              <path 
                d="M45 85 L47 25 L50 10 L53 25 L55 85 Z" 
                fill="#1e293b" 
                stroke="#475569" 
                strokeWidth="1.5"
                strokeLinejoin="miter"
              />
              {/* Center fuller/ridge line */}
              <line x1="50" y1="18" x2="50" y2="84" stroke="#475569" strokeWidth="1" />
              {/* Crossguard */}
              <path d="M32 85 L68 85 L50 89 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
              {/* Handle/Grip */}
              <rect x="47" y="89" width="6" height="18" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Pommel */}
              <circle cx="50" cy="110" r="4.5" fill="#334155" stroke="#475569" strokeWidth="1" />
            </g>

            {/* 2. THE GLOWING GOLD SWORD OVERLAY (CLIPPED) */}
            <g clipPath="url(#sword-fill-clip)" filter="url(#sword-glow)">
              {/* Golden glowing blade */}
              <path 
                d="M45 85 L47 25 L50 10 L53 25 L55 85 Z" 
                fill="url(#goldGradient)" 
                stroke="#ffd754" 
                strokeWidth="1.8"
                strokeLinejoin="miter"
                style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.8))" }}
              />
              {/* Glowing center ridge */}
              <line 
                x1="50" 
                y1="15" 
                x2="50" 
                y2="84" 
                stroke="#ffffff" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                opacity="0.9"
              />
              {/* Crossguard glowing gold */}
              <path d="M32 85 L68 85 L50 89 Z" fill="#d4af37" stroke="#ffd754" strokeWidth="1.2" />
              {/* Handle glowing details */}
              <rect x="47" y="89" width="6" height="18" rx="1" fill="#9a3412" stroke="#d4af37" strokeWidth="1" />
              {/* Golden Pommel */}
              <circle cx="50" cy="110" r="4.5" fill="#d4af37" stroke="#ffd754" strokeWidth="1.2" />
            </g>

            {/* Extra glowing energy sparks around the tip if fully completed */}
            {scrollPercent > 98 && (
              <g className="animate-pulse">
                <circle cx="50" cy="8" r="1.5" fill="#ffffff" />
                <circle cx="43" cy="15" r="1" fill="#ffd754" />
                <circle cx="57" cy="15" r="1" fill="#ffd754" />
              </g>
            )}

            {/* Standard SVG Gradients */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b89423" />
                <stop offset="35%" stopColor="#ffd754" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#ffd754" />
                <stop offset="100%" stopColor="#b89423" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* TRANSIENT RIGHT DISCOVERED POPUP (Interactive & Clickable to see detail card) */}
      <AnimatePresence>
        {discoveryNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: "-50%", transition: { duration: 0.3 } }}
            className="fixed bottom-8 left-1/2 z-[1000] w-full max-w-sm px-4 select-none cursor-pointer"
            onClick={() => {
              const details = SECTION_DETAILS[discoveryNotification.sectionKey];
              if (details) {
                setSelectedDetail(details);
              }
              setDiscoveryNotification(null); // Clear notification after click
            }}
          >
            <div className="bg-[#001233]/95 border border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.3)] rounded-sm p-4 backdrop-blur-md relative overflow-hidden transition-all hover:scale-[1.03] hover:border-[#ffd754]">
              {/* High tech scanner bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-[shimmerSweep_2s_infinite]" />
              
              {/* Decorative brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4af37]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#d4af37]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#d4af37]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4af37]" />

              <div className="flex items-start gap-3.5">
                {/* Glowing Trophy Badge */}
                <div className="p-2 bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-sm text-[#d4af37] animate-pulse">
                  <Award className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold flex items-center gap-1.5 leading-none mb-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Right Discovered
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                    {discoveryNotification.title}
                  </h4>
                  <p className="font-sans text-[10px] text-gray-300 font-light mt-0.5">
                    {discoveryNotification.desc}
                  </p>
                  <p className="text-[8px] font-mono text-[#d4af37]/80 mt-2 flex items-center gap-1">
                    <ChevronRight className="w-2.5 h-2.5" /> CLICK TO DECIPHER JURISDICTIONAL RIGHTS
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED SOVEREIGN EXPLANATION CARD (Popup Modal) */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            {/* Modal Backdrop with deep blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Glowing Detailed Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#001233] to-black border-2 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.3)] rounded-sm p-6 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* High-tech scanning overlay lines */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Gold corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-sm bg-[#d4af37]/10 hover:bg-[#d4af37] border border-[#d4af37]/35 text-[#d4af37] hover:text-[#001233] transition-all cursor-pointer z-50"
                title="Close Decryption Portal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto space-y-5 pr-1">
                {/* Header Section */}
                <div className="space-y-1.5 text-left pb-4 border-b border-[#d4af37]/20">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                    <Shield className="w-3.5 h-3.5" /> SECURED JURISDICTIONAL RECORD
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                    {selectedDetail.title}
                  </h3>
                  <p className="font-sans text-xs text-[#ffd754]/80 tracking-wide font-medium italic">
                    {selectedDetail.subtitle}
                  </p>
                </div>

                {/* Code Reference Badge */}
                <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 p-2.5 rounded-sm text-left">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-gray-400 block mb-0.5">Statutory Authority Code:</span>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span className="font-mono text-[11px] font-bold text-white tracking-wide">{selectedDetail.codeReference}</span>
                  </div>
                </div>

                {/* Legal Explanation */}
                <div className="space-y-2 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#d4af37] font-bold block">Legal Interpretation :</span>
                  <p className="font-sans text-xs text-gray-300 leading-relaxed font-light">
                    {selectedDetail.explanation}
                  </p>
                </div>

                {/* Procedural Safeguards List */}
                <div className="space-y-2.5 text-left pt-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#d4af37] font-bold block">Active Procedural Safeguards :</span>
                  <div className="space-y-2">
                    {selectedDetail.proceduralRights.map((right, index) => (
                      <div key={index} className="flex items-start gap-2.5 bg-black/40 border border-[#d4af37]/10 rounded-sm p-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="font-sans text-xs text-gray-200 font-light leading-snug">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom confirmation action */}
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setSelectedDetail(null)}
                    className="w-full text-center py-2.5 bg-gradient-to-r from-[#d4af37]/15 to-[#d4af37]/25 hover:from-[#d4af37] hover:to-[#ffd754] text-[#d4af37] hover:text-[#001233] text-[10px] uppercase font-mono font-bold rounded-sm border border-[#d4af37]/45 transition-all cursor-pointer shadow-md tracking-widest"
                  >
                    Acknowledge Safeguard Protection
                  </button>
                  <p className="text-[8px] font-mono text-gray-500 mt-2">
                    SOVEREIGN COMPLIANCE RECORDS SECURED IN LOCAL ARCHIVES • SYSTEM COMPLIANT
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
