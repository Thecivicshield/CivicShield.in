import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Pin, Link2, BookOpen, AlertTriangle, ShieldCheck, 
  FileText, Landmark, ZoomIn, Globe, X, CheckSquare, 
  Award, CornerDownRight, Scale, ChevronRight, Lock, 
  ShieldAlert, Sparkles, RefreshCw
} from "lucide-react";

// Extend BoardNode interface with rich legal metadata for unsealing
interface BoardNode {
  id: string;
  label: string;
  type: "topic" | "right" | "case" | "article";
  description: string;
  x: number; // percentage coordinate on geographical layout
  y: number; // percentage coordinate on geographical layout
  targetId: string; // section on the page to navigate to
  connections: string[]; // ids of connected nodes
  country: string;
  countryCode: "US" | "GB" | "IN" | "SG" | "BR" | "ZA" | "GLOBAL";
  flag: string;
  citations?: string;
  caseSummary?: string;
  ruling?: string;
  legalImpact?: string;
}

const BOARD_NODES: BoardNode[] = [
  // --- UNITED STATES ---
  {
    id: "device-seizure",
    label: "Warrantless Seizure",
    type: "topic",
    description: "Protection of digital possessions and personal lockers against random examinations by administrators without a specific warrant.",
    x: 18,
    y: 30,
    targetId: "evidence",
    connections: ["privacy-immunity", "carpenter-case", "evidence-locker-guide"],
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    citations: "US Const. Amend. IV",
    caseSummary: "Federal and local officials are strictly prohibited from searching digital communications, physical lockers, or portable hard drives without a search warrant issued upon a detailed showing of probable cause signed by a neutral judge.",
    ruling: "The court holds that warrantless search of physical and digital compartments lacks structural authority and is per se unreasonable under administrative covenants.",
    legalImpact: "Citizens may decline to yield device passwords or files to public agents unless a physical written court warrant specifying the item is served."
  },
  {
    id: "carpenter-case",
    label: "Carpenter v. US",
    type: "case",
    description: "U.S. Supreme Court precedent holding that collection of cell tower locations is a search requiring a probable cause warrant.",
    x: 14,
    y: 35,
    targetId: "evidence",
    connections: ["device-seizure", "evidence-locker-guide"],
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    citations: "138 S. Ct. 2206 (2018)",
    caseSummary: "The FBI acquired cell phone tower location pings (CSLI) spanning 127 days from wireless carriers without a warrant. The Supreme Court ruled that because digital tracking records compile an intimate chronicle of a citizen's physical movements, they are protected under the Fourth Amendment.",
    ruling: "We hold that an individual maintains a legitimate expectation of privacy in the record of his physical movements. The government must obtain a warrant before acquiring such records.",
    legalImpact: "Establishes that digital tracking logs held by third parties cannot be quietly grabbed by state agents without a formal judicial warrant."
  },
  {
    id: "katz-case",
    label: "Katz v. United States",
    type: "case",
    description: "Famous precedent defining constitutional privacy as protecting 'people, not places' wherever reasonable privacy is expected.",
    x: 22,
    y: 33,
    targetId: "justice-shield",
    connections: ["privacy-immunity"],
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    citations: "389 U.S. 347 (1967)",
    caseSummary: "Federal agents attached an external recording device to a public telephone booth to intercept the conversational transmissions of a citizen. The government argued the booth was a public structure. The Court ruled that conversational privacy extends to anywhere a person seeks to exclude intrusion.",
    ruling: "The Fourth Amendment protects people, not places. What a person knowingly exposes to the public is not protected, but what he seeks to preserve as private, even in an area accessible to the public, may be constitutionally protected.",
    legalImpact: "Forms the foundational 'Reasonable Expectation of Privacy' standard used to challenge wiretapping and spatial digital eavesdropping."
  },

  // --- BRAZIL ---
  {
    id: "info-freedom",
    label: "Citizen Audit Access",
    type: "topic",
    description: "Sovereign rights of citizens to inspect public expenditure logs and audit classified executive files holding their private profiles.",
    x: 35,
    y: 68,
    targetId: "timeline",
    connections: ["records-freedom", "habeas-data-case", "audit-ledger-article"],
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    citations: "Brazil Const. Art. 5, XXXIII",
    caseSummary: "Public administration bodies are bound to supply documents of individual or collective interests, under pain of accountability, except for rare files whose secrecy is vital to national safety.",
    ruling: "All citizens possess an active right to receive from state departments information of private or public nature, ensuring democratic transparency.",
    legalImpact: "Citizens can file direct administrative petitions demanding transparency regarding how local authorities compile files and spend civic funds."
  },
  {
    id: "habeas-data-case",
    label: "STF ADI 6529 Act",
    type: "case",
    description: "Brazil Supreme Court writ protecting activist files from state intelligence agency database aggregation.",
    x: 38,
    y: 74,
    targetId: "timeline",
    connections: ["info-freedom"],
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    citations: "STF ADI 6529 (2020)",
    caseSummary: "The Federal Supreme Court of Brazil ruled on a writ of Habeas Data challenging secret intelligence operations that compiled private surveillance dossiers on university professors and civic opposition activists. The court prohibited sharing these aggregates without judicial orders.",
    ruling: "The state's intelligence power must serve citizen protection, and cannot compile profile archives on citizens for exercising their peaceful civil liberties.",
    legalImpact: "Gives citizens a direct legal mechanism to freeze, review, and delete any secret political or profile dossiers held by state offices."
  },

  // --- UNITED KINGDOM ---
  {
    id: "miller-case",
    label: "R (Miller) v. PM",
    type: "case",
    description: "UK Supreme Court ruling establishing that administrative heads remain fully subject to common law judicial review.",
    x: 50,
    y: 24,
    targetId: "blog",
    connections: ["due-process"],
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    citations: "[2019] UKSC 41",
    caseSummary: "The Prime Minister attempted to prorogue (suspend) Parliament for a prolonged period, shielding administrative decisions from legislative auditing. Private citizens brought suit under common law. The UK Supreme Court ruled the suspension was unlawful as it systematically avoided public scrutiny.",
    ruling: "The decision to advise Her Majesty to prorogue Parliament was unlawful because it had the effect of frustrating or preventing the ability of Parliament to carry out its constitutional functions without reasonable justification.",
    legalImpact: "Ensures that executive and administrative officers are never permitted to suspend procedural accountability rules to bypass citizen auditing."
  },

  // --- SOUTH AFRICA ---
  {
    id: "records-freedom",
    label: "Records Disclosure Right",
    type: "right",
    description: "Sovereign rights enabling citizens to demand and obtain administrative and environmental records from government and private bodies.",
    x: 54,
    y: 72,
    targetId: "timeline",
    connections: ["info-freedom", "biowatch-case"],
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    citations: "PAIA Act 2 of 2000; SA Const. Sec. 32",
    caseSummary: "Statutory mandates guarantee citizens access to any information held by the state, and any information held by another person that is required for the exercise or protection of any fundamental rights.",
    ruling: "No department can refuse disclosure of public records unless a high burden of statutory exemption is strictly proven under judicial oversight.",
    legalImpact: "Provides a powerful tool for citizens to audit toxic land files, public works contracts, and internal police operational guidelines."
  },
  {
    id: "biowatch-case",
    label: "Biowatch v. Registrar",
    type: "case",
    description: "Constitutional Court ruling protecting public auditors and litigators from punitive state court fees.",
    x: 56,
    y: 78,
    targetId: "impact-metrics",
    connections: ["records-freedom"],
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    citations: "[2009] ZACC 14",
    caseSummary: "An environmental trust petitioned the Registrar for public disclosure of GMO crop logs. The Registrar delayed, forcing court action. While granting records, a lower court penalized the activists with massive legal costs. The Constitutional Court overturned this, establishing the landmark Biowatch cost-protection rule.",
    ruling: "In constitutional litigation against state organs, successful private litigants should get their costs, and unsuccessful public litigants should not pay state costs unless their action is completely frivolous.",
    legalImpact: "Protects community campaigns and legal advocates from being financially crushed by state legal fees when suing to reveal administrative documents."
  },

  // --- INDIA ---
  {
    id: "due-process",
    label: "Due Process Matrices",
    type: "topic",
    description: "Constitutional procedure demanding that all administrative acts be fair, just, and completely non-arbitrary.",
    x: 70,
    y: 40,
    targetId: "pillars",
    connections: ["natural-justice", "miller-case", "statute-handbook", "maneka-case"],
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    citations: "India Const. Art. 21 & 14",
    caseSummary: "The sovereign state is barred from depriving any citizen of personal liberty except through a process that is substantively and procedurally fair, reasonable, and just. Arbitrariness is the absolute opposite of equality.",
    ruling: "Procedure established by law must satisfy the test of fairness and cannot be arbitrary, fanciful, or oppressive. Natural justice is integrated into Art. 21.",
    legalImpact: "Enables citizens to challenge municipal notices, warrantless building audits, and random fines that fail to offer proper advance hearings."
  },
  {
    id: "privacy-immunity",
    label: "Digital Privacy Immunity",
    type: "right",
    description: "Fundamental right safeguarding spatial, bodily, and informational privacy of all citizens from state surveillance.",
    x: 74,
    y: 44,
    targetId: "justice-shield",
    connections: ["device-seizure", "katz-case", "puttaswamy-case"],
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    citations: "India Const. Art. 21",
    caseSummary: "Surveillance of citizens, collection of personal coordinates, and building secret databases must satisfy three conditions: a state law authorizing it, a legitimate state aim, and strict proportionality.",
    ruling: "Privacy is an essential element of human dignity. Informational privacy and the right to shield digital metadata are fundamental aspects of personal liberty.",
    legalImpact: "Provides a powerful shield against invasive state data collection, biometric overreach, and warrantless communication interceptions."
  },
  {
    id: "puttaswamy-case",
    label: "Justice Puttaswamy v. India",
    type: "case",
    description: "Supreme Court of India's historic 9-judge bench ruling establishing privacy as a fundamental constitutional right.",
    x: 72,
    y: 48,
    targetId: "justice-shield",
    connections: ["privacy-immunity"],
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    citations: "(2017) 10 SCC 1",
    caseSummary: "A landmark appeal challenged the mandatory collection of personal biometric data under the Aadhaar framework without explicit consent limits. A 9-judge bench unanimously declared that privacy is a fundamental right. It protects spatial, informational, and bodily autonomy.",
    ruling: "Privacy is a constitutionally protected value. It is the core of human dignity. Any state intrusion must pass the rigorous triple test of legality, necessity, and strict proportionality.",
    legalImpact: "Anchors data privacy and personal autonomy as supreme protections that override administrative convenience."
  },
  {
    id: "maneka-case",
    label: "Maneka Gandhi v. India",
    type: "case",
    description: "Precedent establishing that administrative acts must provide detailed written reasons and fair hearings.",
    x: 68,
    y: 45,
    targetId: "pillars",
    connections: ["due-process"],
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    citations: "1978 AIR 597",
    caseSummary: "The passport authority impounded Maneka Gandhi's travel document in 'public interest' and refused to supply any written reasons or offer a hearing. The Supreme Court ruled that such silent, arbitrary actions violate Article 21's liberty guarantees and natural justice.",
    ruling: "Procedural due process means that no authority can issue oppressive orders without providing a fair chance for the citizen to present their case. Audits must be transparent.",
    legalImpact: "Mandates that public administrators, police, and corporate offices must supply clear written reasons and hearings prior to seizing citizen documents."
  },

  // --- SINGAPORE ---
  {
    id: "natural-justice",
    label: "Natural Justice Covenants",
    type: "right",
    description: "Fundamental procedural protections ensuring an unbiased adjudicator and the absolute right to a fair hearing.",
    x: 84,
    y: 58,
    targetId: "pillars",
    connections: ["due-process", "yong-case"],
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    citations: "Singapore Const. Art. 9(1)",
    caseSummary: "No person shall be deprived of life or personal liberty save in accordance with law. The Court of Appeal has ruled that 'accordance with law' incorporates the rules of natural justice.",
    ruling: "The rules of natural justice require two core pillars: 'audi alteram partem' (hear the other side) and 'nemo iudex in causa sua' (no one should be a judge in their own cause).",
    legalImpact: "Guarantees that administrative tribunal hearings and license revocations are null and void if bias or refusal to hear defense evidence is demonstrated."
  },
  {
    id: "yong-case",
    label: "Yong Vui Kong v. PP",
    type: "case",
    description: "Landmark Singapore Court of Appeal ruling incorporating customary international natural justice into Article 9.",
    x: 86,
    y: 62,
    targetId: "pillars",
    connections: ["natural-justice"],
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    citations: "[2015] SGCA 11",
    caseSummary: "In a high-profile constitutional appeal regarding executive clemency powers, the Court of Appeal examined if absolute administrative discretion was exempt from legal audit. The court held that customary principles of natural justice are incorporated into the constitution's fabric.",
    ruling: "The constitutional guarantee of the rules of natural justice applies to all exercises of state power. The court maintains a permanent supervisory jurisdiction to review procedural fairness.",
    legalImpact: "Affirms that administrative discretion can never be absolute or immune from judicial review on procedural natural justice grounds."
  },

  // --- GLOBAL / NEUTRAL ---
  {
    id: "evidence-locker-guide",
    label: "Evidence Locker Manual",
    type: "article",
    description: "Citizen handbook outlining correct evidentiary preservation, metadata capture, and custody maintenance.",
    x: 32,
    y: 18,
    targetId: "evidence",
    connections: ["device-seizure", "carpenter-case"],
    country: "Global Framework",
    countryCode: "GLOBAL",
    flag: "🌐",
    citations: "Civic Shield Document CS_G01",
    caseSummary: "An operational protocol compiled by defense attorneys and digital investigators. Details how citizens should film police stop-and-searches, establish non-obstructive spatial distances, and hash digital files to prevent administrative tampering.",
    ruling: "Standard operating manual outlining correct digital hygiene. Guides citizens on how to export video files alongside metadata (GPS coordinates, timestamps) to verify official accountability.",
    legalImpact: "Provides citizens with an actionable blueprint to create tamper-proof logs of interactions that are admissible in local court hearings."
  },
  {
    id: "statute-handbook",
    label: "Sovereign Statutes",
    type: "article",
    description: "Quick-reference pocket checklist of legal scripts, detainment thresholds, and municipal audit sheets.",
    x: 62,
    y: 15,
    targetId: "pillars",
    connections: ["due-process"],
    country: "Global Framework",
    countryCode: "GLOBAL",
    flag: "🌐",
    citations: "Civic Shield Document CS_G02",
    caseSummary: "A summarized catalog listing basic civic responses during roadside checkpoints, home building code audits, and identity requests. Emphasizes asking 'Am I being detained, or am I free to go?' to immediately force official legal justification.",
    ruling: "Practical citizen guide. Designed to de-escalate tension while preserving civil rights, replacing fear with calm, articulable constitutional queries.",
    legalImpact: "Helps individuals remain respectful, calm, and firmly focused on forcing agents to establish articulable legal grounds on the public record."
  },
  {
    id: "audit-ledger-article",
    label: "Audit Ledger Bulletin",
    type: "article",
    description: "Administrative template guidelines for drafting records petitions and RTI compliance demands.",
    x: 88,
    y: 20,
    targetId: "blog",
    connections: ["info-freedom"],
    country: "Global Framework",
    countryCode: "GLOBAL",
    flag: "🌐",
    citations: "Civic Shield Document CS_G03",
    caseSummary: "A procedural ledger providing standardized layout blueprints for drafting Freedom of Information (FOIA) or Right to Information (RTI) requests. Outlines how to request municipal contract lists, asset ledgers, and official communication logs.",
    ruling: "Citizen audit guidelines detailing correct registries, fee schedules, and appeals procedures to bypass bureaucratic roadblocks and reveal public-spending files.",
    legalImpact: "Enables communities to self-organize audit teams, mapping municipal expenditures and holding local departments to public account."
  }
];

export default function ConstitutionalNetwork() {
  const [selectedNode, setSelectedNode] = useState<BoardNode>(BOARD_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<BoardNode | null>(null);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("ALL");
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [cryptographicStatus, setCryptographicStatus] = useState<"idle" | "scanning" | "verified">("idle");
  const [dossierStamped, setDossierStamped] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger sound effect
  const playNetworkSound = (type: "beep" | "unseal" | "stamp" | "click") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "beep") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === "unseal") {
        // Dramatic multi-tone unsealing sound
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === "stamp") {
        // Thick physical heavy stamp thud
        osc.type = "triangle";
        osc.frequency.setValueAtTime(90, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio system disabled/not supported
    }
  };

  // Handle unsealing a case file (Dramatic open + Nav trigger)
  const handleUnsealCaseFile = (node: BoardNode) => {
    playNetworkSound("unseal");
    
    // Open the immersive vintage declassified folder modal
    setIsDossierOpen(true);
    setDossierStamped(false);
    setCryptographicStatus("idle");

    // Trigger the filing cabinet drawer slide effect in the background!
    window.dispatchEvent(
      new CustomEvent("trigger-cabinet-nav", {
        detail: { targetId: node.targetId, label: node.label }
      })
    );
  };

  const handleCryptographicScan = () => {
    if (cryptographicStatus !== "idle") return;
    playNetworkSound("click");
    setCryptographicStatus("scanning");
    
    setTimeout(() => {
      setCryptographicStatus("verified");
      playNetworkSound("stamp");
    }, 1200);
  };

  const handleApplyStamp = () => {
    if (dossierStamped) return;
    playNetworkSound("stamp");
    setDossierStamped(true);
  };

  // Filter nodes according to selected country
  const filteredNodes = BOARD_NODES.filter(node => {
    if (selectedCountryFilter === "ALL") return true;
    return node.countryCode === selectedCountryFilter;
  });

  // Determine connection line styling based on node interaction
  const getLineStyle = (nodeA: BoardNode, nodeB: BoardNode) => {
    const isConnected = nodeA.connections.includes(nodeB.id) || nodeB.connections.includes(nodeA.id);
    if (!isConnected) return null;

    // Is either node related to active selections
    const isNodeSelected = selectedNode.id === nodeA.id || selectedNode.id === nodeB.id;
    const isNodeHovered = hoveredNode?.id === nodeA.id || hoveredNode?.id === nodeB.id;
    
    // Is country filter matching
    const matchesFilterA = selectedCountryFilter === "ALL" || nodeA.countryCode === selectedCountryFilter;
    const matchesFilterB = selectedCountryFilter === "ALL" || nodeB.countryCode === selectedCountryFilter;
    const filterActive = matchesFilterA && matchesFilterB;

    if (isNodeHovered) {
      return {
        stroke: "#ef4444",
        strokeWidth: 2.5,
        opacity: 0.95,
        strokeDasharray: "none",
        filter: "drop-shadow(0px 0px 8px rgba(239, 68, 68, 0.85))"
      };
    }

    if (isNodeSelected) {
      return {
        stroke: "#d4af37",
        strokeWidth: 2.0,
        opacity: 0.9,
        strokeDasharray: "5,3",
        filter: "drop-shadow(0px 0px 6px rgba(212, 175, 55, 0.6))"
      };
    }

    if (selectedCountryFilter !== "ALL" && filterActive) {
      return {
        stroke: "rgba(212, 175, 55, 0.5)",
        strokeWidth: 1.5,
        opacity: 0.75,
        strokeDasharray: "none",
        filter: "none"
      };
    }

    return {
      stroke: "rgba(212,175,55,0.12)",
      strokeWidth: 1.0,
      opacity: 0.25,
      strokeDasharray: "4,4",
      filter: "none"
    };
  };

  // Auto-focus on country's representative node if filter changes
  useEffect(() => {
    if (selectedCountryFilter !== "ALL") {
      const match = BOARD_NODES.find(n => n.countryCode === selectedCountryFilter);
      if (match) setSelectedNode(match);
    }
  }, [selectedCountryFilter]);

  return (
    <section
      id="constitutional-network"
      className="py-24 bg-gradient-to-b from-[#020d20] via-[#00050e] to-[#020d20] border-t border-b border-[#d4af37]/20 relative overflow-hidden font-sans select-none"
    >
      {/* Background blueprint coordinate markings */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#d4af37]/15 to-transparent pointer-events-none" />

      {/* Blueprint Coordinates */}
      <div className="absolute top-8 left-8 font-mono text-[8px] text-[#d4af37]/30 tracking-[0.3em] uppercase hidden md:block">
        CORE_BOARD_REF: JURISDICTIONAL_MAP_v5.1 // DEPLOY: CONTAINER_INGRESS
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[8px] text-[#d4af37]/30 tracking-[0.3em] uppercase hidden md:block">
        SECURITY: VERIFIED_PUBLIC_SEAL // SOURCE: INTERNATIONAL_LITERACY
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-800/40 rounded-sm px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[#ef4444] leading-none mb-4 animate-pulse">
            <Globe className="w-3.5 h-3.5 animate-spin-slow text-red-500" />
            GLOBAL CONSTITUTIONAL ALLIANCE MAP
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-3">
            Sovereign Alliance <span className="text-[#d4af37] font-serif not-italic font-bold">Investigation Grid</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Examine how local topics, statutory rights, precedents, and manuals are linked. Select a jurisdiction to illuminate connective red thread paths, and click to unseal the declassified case files.
          </p>
        </div>

        {/* JURISDICTIONAL SELECTOR TABS (The Country Map Navigator) */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-10 max-w-4xl mx-auto bg-black/60 p-2 border border-[#d4af37]/15 rounded-md backdrop-blur-sm shadow-md">
          {[
            { id: "ALL", label: "All Jurisdictions", flag: "🌐" },
            { id: "IN", label: "India", flag: "🇮🇳" },
            { id: "US", label: "United States", flag: "🇺🇸" },
            { id: "GB", label: "United Kingdom", flag: "🇬🇧" },
            { id: "SG", label: "Singapore", flag: "🇸🇬" },
            { id: "BR", label: "Brazil", flag: "🇧🇷" },
            { id: "ZA", label: "South Africa", flag: "🇿🇦" }
          ].map((country) => (
            <button
              key={country.id}
              onClick={() => {
                playNetworkSound("click");
                setSelectedCountryFilter(country.id);
              }}
              className={`px-3 py-2 text-[10px] font-mono tracking-widest uppercase rounded-sm border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                selectedCountryFilter === country.id
                  ? "bg-[#d4af37] text-black border-[#d4af37] font-extrabold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-black/40 text-gray-400 border-[#d4af37]/15 hover:border-[#d4af37]/50 hover:text-white"
              }`}
            >
              <span className="text-xs">{country.flag}</span>
              <span>{country.label}</span>
            </button>
          ))}
        </div>

        {/* Board Container Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: THE CORKBOARD STRING GRAPHICS PANEL (8 Cols) */}
          <div 
            ref={containerRef}
            className="lg:col-span-8 bg-gradient-to-b from-[#000814] to-[#000206] rounded-sm border border-[#d4af37]/20 relative h-[420px] sm:h-[580px] overflow-hidden flex flex-col justify-between p-4 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.9)]"
          >
            {/* Wooden cork board frame border */}
            <div className="absolute inset-0 border-[3px] border-[#d4af37]/15 pointer-events-none rounded-sm z-30" />
            <div className="absolute inset-1 border border-dashed border-[#d4af37]/5 pointer-events-none z-30" />

            {/* HIGH-TECH STYLIZED WORLD MAP UNDERLAY GRAPHIC */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center select-none z-0 scale-95 sm:scale-105">
              <svg className="w-full h-full text-[#d4af37]" viewBox="0 0 1000 500" fill="currentColor">
                {/* North America */}
                <path d="M120,80 L220,100 L250,150 L200,180 L180,240 L120,200 L100,140 Z" />
                {/* South America */}
                <path d="M280,260 L380,280 L420,380 L320,440 L260,340 Z" />
                {/* Europe */}
                <path d="M480,80 L560,90 L580,140 L520,180 L460,140 Z" />
                {/* Africa */}
                <path d="M480,200 L580,220 L620,340 L560,420 L480,320 Z" />
                {/* South Asia / India */}
                <path d="M680,180 L760,190 L740,260 L690,240 Z" />
                {/* Southeast / East Asia */}
                <path d="M780,140 L880,150 L910,240 L840,280 Z" />
                {/* Australia */}
                <path d="M820,360 L920,370 L900,440 L810,420 Z" />
                
                {/* Target Locator Circles for Countries */}
                <circle cx="180" cy="150" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="350" cy="350" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="510" cy="120" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="550" cy="320" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="710" cy="210" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="850" cy="220" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>

            {/* Continent Labels on Board */}
            <div className="absolute top-[32%] left-[15%] font-mono text-[7px] text-gray-600 uppercase tracking-widest pointer-events-none hidden sm:block">NORTH AMERICA</div>
            <div className="absolute top-[72%] left-[32%] font-mono text-[7px] text-gray-600 uppercase tracking-widest pointer-events-none hidden sm:block">SOUTH AMERICA</div>
            <div className="absolute top-[22%] left-[48%] font-mono text-[7px] text-gray-600 uppercase tracking-widest pointer-events-none hidden sm:block">EUROPEAN ZONE</div>
            <div className="absolute top-[68%] left-[51%] font-mono text-[7px] text-gray-600 uppercase tracking-widest pointer-events-none hidden sm:block">AFRICAN CONTINENT</div>
            <div className="absolute top-[42%] left-[69%] font-mono text-[7px] text-gray-600 uppercase tracking-widest pointer-events-none hidden sm:block">SOUTH ASIA / IN</div>
            <div className="absolute top-[58%] left-[83%] font-mono text-[7px] text-gray-600 uppercase tracking-widest pointer-events-none hidden sm:block">EAST ASIA / SG</div>

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-4 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.015]">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-[#d4af37]" />
              ))}
            </div>

            {/* Animated Red Yarn SVG Strings Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {BOARD_NODES.map((nodeA, idxA) => {
                  return BOARD_NODES.slice(idxA + 1).map((nodeB) => {
                    const style = getLineStyle(nodeA, nodeB);
                    if (!style) return null;

                    return (
                      <line
                        key={`${nodeA.id}-${nodeB.id}`}
                        x1={nodeA.x}
                        y1={nodeA.y}
                        x2={nodeB.x}
                        y2={nodeB.y}
                        style={{
                          transition: "stroke 0.4s, stroke-width 0.4s, opacity 0.4s",
                          ...style
                        }}
                      />
                    );
                  });
                })}
              </svg>
            </div>

            {/* MAP NODES / PINS */}
            <div className="absolute inset-0 z-20">
              {BOARD_NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                
                // Check if matches country filter
                const matchesFilter = selectedCountryFilter === "ALL" || node.countryCode === selectedCountryFilter;
                
                // Connection checking helper
                const isConnectedToHovered = hoveredNode
                  ? node.connections.includes(hoveredNode.id) || hoveredNode.connections.includes(node.id)
                  : false;

                // Color themes based on node types
                const pinColors = {
                  topic: { bg: "bg-amber-500", border: "border-amber-400", text: "text-amber-400" },
                  right: { bg: "bg-blue-500", border: "border-blue-400", text: "text-blue-400" },
                  case: { bg: "bg-red-500", border: "border-red-400", text: "text-red-400" },
                  article: { bg: "bg-emerald-500", border: "border-emerald-400", text: "text-emerald-400" }
                };

                const currentColors = pinColors[node.type];

                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      opacity: !matchesFilter ? 0.15 : hoveredNode && !isHovered && !isConnectedToHovered ? 0.35 : 1,
                      transform: `translate(-50%, -50%) scale(${isHovered || isSelected ? 1.2 : 1})`,
                      zIndex: isHovered || isSelected ? 40 : 30
                    }}
                    onClick={() => {
                      playNetworkSound("beep");
                      setSelectedNode(node);
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Pulsing ring for selected/hovered pin */}
                    <AnimatePresence>
                      {(isSelected || isHovered) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 0.75, scale: 1.8 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                          className={`absolute inset-0 -m-3.5 rounded-full border-2 ${
                            node.type === "case" ? "border-red-500" : "border-[#d4af37]"
                          }`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Cork Board Push Pin Graphic */}
                    <div className="flex flex-col items-center">
                      {/* Pushpin Head */}
                      <div className={`w-3.5 h-3.5 rounded-full ${currentColors.bg} border-2 ${currentColors.border} flex items-center justify-center shadow-[0_5px_12px_rgba(0,0,0,0.6)] relative`}>
                        {/* Metallic reflection shine */}
                        <div className="w-1 h-1 bg-white/70 rounded-full absolute top-0.5 left-0.5" />
                      </div>
                      
                      {/* Metallic Pin Shaft */}
                      <div className="w-[1.5px] h-3.5 bg-gradient-to-b from-gray-200 to-gray-500 shadow-sm" />

                      {/* Small Shadow on the Board */}
                      <div className="w-1.5 h-0.5 bg-black/50 blur-[0.5px] rounded-full mt-[1px]" />
                    </div>

                    {/* Node Tag Title with Flag */}
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-50">
                      <div className={`px-2 py-0.5 text-[8.5px] font-mono tracking-wider uppercase rounded-sm border transition-all duration-300 flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#d4af37] text-black border-[#d4af37] font-extrabold shadow-[0_0_12px_#d4af37]"
                          : isHovered
                            ? "bg-[#ef4444] text-white border-[#ef4444] font-extrabold"
                            : isConnectedToHovered
                              ? "bg-black/95 text-white border-[#d4af37]/40"
                              : "bg-black/85 text-gray-300 border-[#d4af37]/10"
                      }`}>
                        <span>{node.flag}</span>
                        <span>{node.label}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Legend / Instructions Row */}
            <div className="relative z-30 flex justify-between items-end font-mono text-[8px] text-gray-500 border-t border-gray-900/50 pt-2.5">
              <div className="space-y-0.5 uppercase">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Topic Coordinate</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Statutory Protection</div>
              </div>
              <div className="space-y-0.5 uppercase text-right">
                <div className="flex items-center gap-1.5 justify-end"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> International Precedent</div>
                <div className="flex items-center gap-1.5 justify-end"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Accountability Manual</div>
              </div>
            </div>

          </div>

          {/* RIGHT: CLASSIFIED DOSSIER CARD (4 Cols) */}
          <div className="lg:col-span-4 bg-[#000a1c] border border-[#d4af37]/20 rounded-sm p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Dossier paper clip detail */}
            <div className="absolute top-2 right-6 w-8 h-12 border-2 border-slate-600 rounded-b-md opacity-20 rotate-12 pointer-events-none" />

            {/* Retro Stamp */}
            <div className="absolute top-24 -left-6 w-32 h-32 rounded-full border-4 border-[#ef4444]/10 flex items-center justify-center -rotate-12 pointer-events-none">
              <span className="font-mono text-[9px] font-black text-[#ef4444]/15 uppercase tracking-[0.25em]">CLASSIFIED</span>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Heading coordinate stamp */}
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-bold flex items-center gap-1.5 leading-none">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" /> INVESTIGATION
                </span>
                <span className="font-mono text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                  SYS_REF_{selectedNode.id.toUpperCase().slice(0, 8)}
                </span>
              </div>

              {/* Node Title & Type Badge */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
                    selectedNode.type === "topic"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : selectedNode.type === "right"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : selectedNode.type === "case"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}>
                    {selectedNode.type}
                  </span>
                  <span className="font-mono text-[8px] text-gray-500 flex items-center gap-1">
                    <span>{selectedNode.flag}</span>
                    <span>{selectedNode.country}</span>
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                  {selectedNode.label}
                </h3>
                {selectedNode.citations && (
                  <p className="font-mono text-[9px] text-[#d4af37] tracking-wider leading-none">
                    CITATION: {selectedNode.citations}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5 bg-black/40 border border-[#d4af37]/10 p-3 rounded-sm">
                <span className="font-mono text-[8px] uppercase tracking-widest text-gray-400 block">Classified Memorandum</span>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {selectedNode.description}
                </p>
              </div>

              {/* Connective links */}
              <div className="space-y-2">
                <span className="font-mono text-[8px] uppercase tracking-widest text-gray-500 block">Connected Coordinates</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.connections.map((cId) => {
                    const connNode = BOARD_NODES.find(n => n.id === cId);
                    if (!connNode) return null;
                    return (
                      <button
                        key={cId}
                        onClick={() => {
                          playNetworkSound("beep");
                          setSelectedNode(connNode);
                        }}
                        className="text-[9px] font-mono uppercase tracking-wider px-2 py-1 bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-sm transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Link2 className="w-3 h-3 text-[#d4af37]" /> {connNode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Document Unseal click navigate action */}
            <div className="mt-8 pt-4 border-t border-gray-900">
              <button
                onClick={() => handleUnsealCaseFile(selectedNode)}
                className="w-full py-2.5 bg-gradient-to-r from-red-600/10 via-[#d4af37]/10 to-red-600/10 hover:via-[#d4af37]/20 border border-[#d4af37]/30 hover:border-[#d4af37] text-white hover:text-[#d4af37] rounded-sm font-mono text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                id="unseal-case-button"
              >
                <BookOpen className="w-4 h-4 text-[#d4af37]" /> Unseal Associated case file
              </button>
              <p className="text-center font-mono text-[7px] text-gray-500 uppercase tracking-widest mt-2">
                CRITICAL WARNING: SUBMIT DIRECTORY ACCESS SEQUENCE
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* CLASSIFIED DECLASSIFIED DOSSIER MODAL OVERLAY */}
      <AnimatePresence>
        {isDossierOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDossierOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-[4px] pointer-events-auto"
            />

            {/* Immersive declassified file folder content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: -80 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative bg-[#efece1] text-[#1c1c1c] border-2 border-[#b59d57] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] w-full max-w-2xl rounded-r-md rounded-bl-md overflow-hidden pointer-events-auto flex flex-col md:flex-row border-t-[14px] border-t-[#d4af37]"
            >
              
              {/* Folder Left Margin: Stamp, Seal, & Signature */}
              <div className="w-full md:w-[240px] bg-[#e5e1d3] border-b md:border-b-0 md:border-r border-[#cbc6b3] p-6 flex flex-col justify-between">
                <div>
                  <div className="border border-[#b59d57] bg-white/40 p-2 text-center rounded-sm mb-6">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-gray-600 font-extrabold block">CIVIC CABINET FILE</span>
                    <span className="font-serif text-lg font-bold text-[#8c1d1d] tracking-widest">CS-RECR_908</span>
                  </div>

                  <div className="space-y-4">
                    <div className="font-mono text-[9px] uppercase space-y-1.5 text-gray-600">
                      <div>
                        <span className="opacity-70 font-bold">STATE REF:</span> 
                        <span className="text-[#1c1c1c] font-black block mt-0.5">{selectedNode.countryCode}_FED_DOC</span>
                      </div>
                      <div>
                        <span className="opacity-70 font-bold">JURISDICTION:</span> 
                        <span className="text-[#1c1c1c] font-black block mt-0.5">{selectedNode.country}</span>
                      </div>
                      <div>
                        <span className="opacity-70 font-bold">CATEGORY:</span> 
                        <span className="text-[#1c1c1c] font-black block mt-0.5">{selectedNode.type} CASE</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#cbc6b3] space-y-3">
                      {/* Integrity Verification System */}
                      <button
                        onClick={handleCryptographicScan}
                        className={`w-full py-2 border rounded-sm font-mono text-[9px] tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                          cryptographicStatus === "verified"
                            ? "bg-[#001233] text-[#d4af37] border-[#001233] font-bold shadow-sm"
                            : cryptographicStatus === "scanning"
                              ? "bg-amber-950 text-amber-400 border-amber-800 animate-pulse"
                              : "bg-[#e5e1d3] hover:bg-[#cbc6b3] text-gray-800 border-[#cbc6b3]"
                        }`}
                      >
                        {cryptographicStatus === "verified" ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" /> SCAN INTEGRITY: OK
                          </>
                        ) : cryptographicStatus === "scanning" ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" /> AUDITING HASH...
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-gray-700" /> VERIFY INTEGRITY HASH
                          </>
                        )}
                      </button>

                      {/* Administrative stamp */}
                      <button
                        onClick={handleApplyStamp}
                        disabled={dossierStamped}
                        className={`w-full py-2 border rounded-sm font-mono text-[9px] tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                          dossierStamped
                            ? "bg-red-50 text-red-800 border-red-300 opacity-60 cursor-not-allowed"
                            : "bg-red-800 hover:bg-red-900 text-white border-transparent"
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" /> {dossierStamped ? "STAMP APPLIED" : "APPLY SOVEREIGN STAMP"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rubber stamp visual overlay */}
                <div className="mt-8 relative flex justify-center h-28 items-center">
                  {dossierStamped && (
                    <motion.div
                      initial={{ scale: 3, opacity: 0, rotate: -35 }}
                      animate={{ scale: 1, opacity: 1, rotate: -15 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="absolute border-4 border-dashed border-[#8c1d1d] text-[#8c1d1d] px-4 py-2 text-center uppercase font-mono text-xs font-black tracking-widest rounded-sm pointer-events-none select-none rotate-[-15deg] shadow-lg"
                    >
                      DECLASSIFIED
                      <div className="text-[7px] mt-0.5 tracking-normal">CIVIC SHIELD ADVOCACY</div>
                    </motion.div>
                  )}
                  
                  {!dossierStamped && (
                    <div className="text-[8.5px] font-mono text-gray-400/80 uppercase text-center border border-dashed border-gray-300 p-3 w-full rounded-sm">
                      STAMP REQUIRED FOR ARCHIVE COMPLIANCE
                    </div>
                  )}
                </div>

              </div>

              {/* Folder Right Body: Declassified Legal Brief */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-none">
                
                {/* Folder Top Tabs */}
                <div className="absolute top-0 right-4 flex gap-1 transform -translate-y-full">
                  <div className="bg-[#efece1] px-3 py-1 text-[8.5px] font-mono font-bold text-gray-600 border-t border-x border-[#b59d57] uppercase rounded-t-sm">
                    {selectedNode.type} BRIEF
                  </div>
                  <div className="bg-gray-200 px-3 py-1 text-[8.5px] font-mono font-bold text-gray-500 border-t border-x border-gray-300 uppercase rounded-t-sm opacity-50">
                    METADATA
                  </div>
                </div>

                {/* Main Legal Content */}
                <div className="space-y-6">
                  
                  {/* Document Header */}
                  <div className="flex items-start justify-between border-b border-gray-300 pb-4">
                    <div>
                      <p className="font-mono text-[8.5px] uppercase tracking-widest text-[#8c1d1d] font-bold">SOVEREIGN CASE STUDY EXAMINER</p>
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1c1c1c] leading-tight">
                        {selectedNode.label}
                      </h2>
                      {selectedNode.citations && (
                        <p className="font-mono text-[10px] text-gray-600 font-extrabold mt-1 uppercase">
                          OFFICIAL CODES: {selectedNode.citations}
                        </p>
                      )}
                    </div>
                    
                    {/* Close button */}
                    <button
                      onClick={() => setIsDossierOpen(false)}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Fact Summary */}
                  <div className="space-y-2">
                    <h4 className="font-serif text-sm font-extrabold uppercase text-[#1c1c1c] flex items-center gap-1.5 border-b border-dashed border-gray-300 pb-1">
                      <Scale className="w-4 h-4 text-[#8c1d1d]" /> Declassified Memorandum & Facts
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-serif text-justify font-light">
                      {selectedNode.caseSummary || selectedNode.description}
                    </p>
                  </div>

                  {/* Absolute Ruling */}
                  {selectedNode.ruling && (
                    <div className="space-y-2 bg-[#e1ddce] border-l-4 border-red-700 p-3 sm:p-4 rounded-r-sm">
                      <h4 className="font-serif text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> Constitutional Ratio Decidendi (The Holding)
                      </h4>
                      <p className="text-xs text-gray-800 leading-relaxed font-serif italic">
                        "{selectedNode.ruling}"
                      </p>
                    </div>
                  )}

                  {/* Sovereign Takeaway */}
                  {selectedNode.legalImpact && (
                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-extrabold uppercase text-[#1c1c1c] flex items-center gap-1.5 border-b border-dashed border-gray-300 pb-1">
                        <CheckSquare className="w-4 h-4 text-emerald-800" /> Sovereign Citizen Takeaway
                      </h4>
                      <p className="text-xs text-emerald-900 leading-relaxed font-sans font-medium flex items-start gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-sm">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{selectedNode.legalImpact}</span>
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer action */}
                <div className="mt-8 pt-4 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left font-mono text-[9px] text-gray-500 uppercase">
                  <div>
                    <span>UNSEAL TIME: {new Date().toLocaleDateString()}</span>
                    <span className="mx-2">|</span>
                    <span>RETRIEVED: SYSTEM_OPERATOR</span>
                  </div>
                  
                  <button
                    onClick={() => setIsDossierOpen(false)}
                    className="px-4 py-1.5 bg-[#1c1c1c] hover:bg-gray-800 text-white rounded-sm transition-all duration-300 tracking-wider cursor-pointer"
                  >
                    CLOSE BRIEF
                  </button>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
