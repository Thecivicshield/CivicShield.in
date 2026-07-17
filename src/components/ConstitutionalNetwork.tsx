import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Pin, Link2, BookOpen, AlertTriangle, ShieldCheck, 
  FileText, Landmark, ZoomIn, Globe, X, CheckSquare, 
  Award, CornerDownRight, Scale, ChevronRight, Lock, 
  ShieldAlert, Sparkles, RefreshCw, Clipboard, CheckCircle2, 
  Trophy, Key, Scroll, HelpCircle, AlertCircle
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
  countryCode: string;
  flag: string;
  citations?: string;
  caseSummary?: string;
  ruling?: string;
  legalImpact?: string;
}

const BOARD_NODES: BoardNode[] = [
  {
    id: "device-seizure",
    label: "Constitutional Privacy",
    type: "right",
    description: "Protection of private lockers, digital files, and communications from arbitrary search and seizure under fundamental Fourth Amendment principles.",
    x: 18,
    y: 32,
    targetId: "evidence",
    connections: ["common-law-review", "habeas-data", "canada-assembly"],
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    citations: "US Const. Amend. IV",
    caseSummary: "In Carpenter v. United States, the government collected wireless location history logs spanning 127 days without a warrant. The Supreme Court dissected physical tracking precedents and ruled that because digital location records compile an intimate chronicle of physical movements, state departments must obtain a probable-cause search warrant signed by a neutral judge.",
    ruling: "The state maintains no absolute authority to secretly track citizens' physical locations. A warrant is required to compile third-party communications.",
    legalImpact: "You can decline to yield electronic devices or passwords to inspectors unless a formal, written judicial warrant is presented."
  },
  {
    id: "canada-assembly",
    label: "Peaceful Assembly",
    type: "right",
    description: "Protection of peaceful demonstration, strike activities, and citizen assembly from arbitrary state dispersion or mass detention.",
    x: 16,
    y: 20,
    targetId: "evidence",
    connections: ["device-seizure", "common-law-review"],
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    citations: "Charter of Rights Sec. 2(c)",
    caseSummary: "In Garbeau v. Montreal, civic advocates contested municipal bylaws that authorized police to disperse any gathering without prior notice or showing a breach of the peace. The Court dissected the fundamental guarantee of peaceful assembly, ruling that arbitrary kettling and preemptive dispersion violate basic democratic laws.",
    ruling: "The state cannot demand arbitrary permits or disperse peaceful public assemblies unless a real, imminent threat of public safety is demonstrated.",
    legalImpact: "You have the right to peacefully stand, picket, and hold placards in public areas without preemptive dispersion or police warnings."
  },
  {
    id: "habeas-data",
    label: "Habeas Data Audits",
    type: "right",
    description: "The absolute legal right enabling citizens to inspect, review, and delete records compiled on them in secret government profile databases.",
    x: 34,
    y: 68,
    targetId: "timeline",
    connections: ["device-seizure", "records-disclosure"],
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    citations: "Brazil Const. Art. 5, XXXIII",
    caseSummary: "In STF ADI 6529, the Federal Supreme Court of Brazil examined secret intelligence agency databases that quietly aggregated dossiers and tracking files on university faculty and civic organizers. The Court ruled that aggregating files on peaceful citizens violates fundamental freedoms.",
    ruling: "State intelligence offices cannot compile profile databases on citizens for exercising peaceful civil liberties; any audit access must be transparent.",
    legalImpact: "You hold the direct right to petition public departments to inspect, correct, and completely erase any surveillance files or credit logs."
  },
  {
    id: "common-law-review",
    label: "Common Law Review",
    type: "right",
    description: "The historic constitutional standard establishing that all administrative and executive offices remain subject to common law judicial audits.",
    x: 48,
    y: 22,
    targetId: "blog",
    connections: ["device-seizure", "natural-justice-sg", "germany-home"],
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    citations: "Magna Carta Foundations",
    caseSummary: "In R (Miller) v. Prime Minister, the prime minister suspended Parliament for five weeks to avoid legislative review of sweeping administrative protocols. Private citizens petitioned the Supreme Court under common law, arguing that executive suspension violated sovereignty rules.",
    ruling: "Administrative officers cannot suspend legislative oversight or silence public audits without a substantively reasonable, proven justification.",
    legalImpact: "Executive orders, municipal warnings, or internal protocols cannot override common law guidelines or bypass standard procedural review."
  },
  {
    id: "germany-home",
    label: "Inviolability of Home",
    type: "right",
    description: "Absolute spatial sanctity protecting private domiciles, cabins, and electronic files from unannounced police entry or secret bugging.",
    x: 53,
    y: 25,
    targetId: "pillars",
    connections: ["common-law-review", "kenya-information"],
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    citations: "Germany Basic Law Art. 13",
    caseSummary: "In the landmark Acoustic Surveillance Case, the Federal Constitutional Court ruled on the constitutionality of eavesdropping inside private homes. The Court strictly curtailed state snooping, stating that the home is a sanctuary of human dignity and cannot be compromised without severe, strictly narrow judicial review.",
    ruling: "Private living quarters are inviolable. Any technological or physical state monitoring is void unless approved by a full panel of independent judges for extreme emergencies.",
    legalImpact: "You can demand that any state inspector, code enforcement officer, or police agent step back from your threshold unless they hold a valid judicial entry order."
  },
  {
    id: "records-disclosure",
    label: "Records Disclosure",
    type: "right",
    description: "Legislative mandates enabling citizens to demand and secure environmental reports, financial ledgers, and public works documents from state organs.",
    x: 55,
    y: 72,
    targetId: "timeline",
    connections: ["habeas-data", "due-process-in", "kenya-information"],
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    citations: "SA Const. Sec. 32",
    caseSummary: "In Biowatch v. Registrar, an environmental protection group petitioned the state for crop safety records. The state dragged out proceedings and lower courts penalized the group with massive court costs. The Constitutional Court overturned the fees, establishing protective cost rules for public interest litigation.",
    ruling: "Public interest advocates suing state organs to reveal public records are protected from paying state legal costs, preventing administrative intimidation.",
    legalImpact: "Citizens are legally insulated from high court fees when suing government departments to release public spending or safety files."
  },
  {
    id: "kenya-information",
    label: "Access to State Records",
    type: "right",
    description: "The constitutional mandate securing every citizen's right to obtain state-held data, audits, and environmental reports.",
    x: 59,
    y: 52,
    targetId: "timeline",
    connections: ["records-disclosure", "germany-home"],
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    citations: "Kenya Const. Art. 35",
    caseSummary: "In Katiba Institute v. Presidents Advisory, civic organizations sued to obtain details of secret public spending, advisory council appointments, and regulatory contracts. The High Court ruled that transparency is a sovereign pillar, ordering full declassification.",
    ruling: "All citizens are entitled to demand records held by state organs. The administration cannot claim blanket, unspecified secrecy to hide public activities.",
    legalImpact: "You have the legal standing to request budget reports, environmental data, and state contracts from local departments to inspect where public funds are diverted."
  },
  {
    id: "due-process-in",
    label: "Due Process Matrices",
    type: "right",
    description: "Constitutional guarantees demanding that all administrative notices, fines, and spatial audits be fair, just, and completely non-arbitrary.",
    x: 70,
    y: 44,
    targetId: "pillars",
    connections: ["records-disclosure", "natural-justice-sg", "australia-political", "japan-conscience"],
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    citations: "India Const. Art. 21",
    caseSummary: "In Justice Puttaswamy v. India, a historic 9-judge bench dissected the biometric identification scheme. They unanimously ruled that informational privacy and bodily autonomy are fundamental rights integrated into the core Article 21 guarantee of life and personal liberty.",
    ruling: "Privacy is the core of human dignity. Any administrative intrusion or tracking must pass the triple test of legality, necessity, and strict proportionality.",
    legalImpact: "Invasive tracking, data collection, or warrantless spatial fines are void unless backed by explicit law, legitimate need, and minimal intrusion."
  },
  {
    id: "natural-justice-sg",
    label: "Natural Justice",
    type: "right",
    description: "The dual pillars of natural justice: the absolute right to an unbiased adjudicator, and the right to present a complete defense.",
    x: 82,
    y: 56,
    targetId: "pillars",
    connections: ["due-process-in", "common-law-review", "australia-political", "japan-conscience"],
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    citations: "Singapore Const. Art. 9(1)",
    caseSummary: "In Yong Vui Kong v. PP, the Court of Appeal examined whether administrative heads possessed absolute, unchecked discretion that was immune from review. The Court ruled that the constitutional guarantee of 'law' incorporates fundamental guidelines of natural justice.",
    ruling: "The rules of natural justice apply to all exercises of public power, and tribunals cannot deny citizens a fair, unbiased procedural hearing.",
    legalImpact: "Any administrative order, license suspension, or code citation is void if issued without detailed reason or an impartial hearing."
  },
  {
    id: "japan-conscience",
    label: "Freedom of Thought",
    type: "right",
    description: "Unconditional constitutional protection over an individual's inner beliefs, conscience, and ideological refusals.",
    x: 88,
    y: 32,
    targetId: "timeline",
    connections: ["due-process-in", "natural-justice-sg"],
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    citations: "Japan Const. Art. 19",
    caseSummary: "In the National Anthem Case, public school teachers contested administrative directives forcing them to stand and sing a nationalistic anthem, which violated their pacifist beliefs. The Supreme Court dissected Article 19, establishing that forcing ideological allegiance is unconstitutional.",
    ruling: "State offices and public employers cannot compel citizens to take pledges, make signs, or execute rituals that directly conflict with their sincere conscience.",
    legalImpact: "You are insulated from state-compelled oaths, declarations, or ideological pledges as a prerequisite for retaining public services or travel cards."
  },
  {
    id: "australia-political",
    label: "Implied Speech Protection",
    type: "right",
    description: "The fundamental implied constitutional freedom protecting political communication, discourse, and critique of public officials.",
    x: 88,
    y: 78,
    targetId: "blog",
    connections: ["natural-justice-sg", "due-process-in"],
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    citations: "Australia Const. Implied Freedom",
    caseSummary: "In Lange v. Australian Broadcasting Corporation, the High Court established that the system of representative and responsible government set up by the Constitution requires an absolute freedom of communication on political and government matters.",
    ruling: "Sovereign citizens hold an implied, unalterable right to criticize administrative policies, state officers, and governmental programs without fear of civil or criminal libel.",
    legalImpact: "Public officers cannot use state authority or defamation threats to silence political criticism or documentation of administrative failures."
  }
];

interface ClipboardCase {
  id: string;
  title: string;
  topic: string;
  country: string;
  flag: string;
  scenario: string;
  question: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  educationalFact: string;
  unlockedStoryText: string;
}

const CLIPBOARD_CASES: ClipboardCase[] = [
  {
    id: "digital-sanctity",
    title: "The Highway Electronic Search",
    topic: "Digital Privacy & Warrant Limits",
    country: "United States",
    flag: "🇺🇸",
    scenario: "During a routine traffic stop, a highway patrol agent notices your locked smartphone resting on the dashboard. They command you to fingerprint-unlock it immediately so they can search your photos for 'potential civil evidence' under corporate policy codes.",
    question: "Which of the following fundamental constitutional shields protects you from being forced to surrender your phone contents in this situation?",
    options: [
      {
        key: "A",
        text: "The Fourth Amendment standard protecting private digital papers from arbitrary search. An inspector must present a specific judicial search warrant describing the device to be searched.",
        isCorrect: true,
        feedback: "Correct! Digital files maintain the exact same common law privacy sanctuary as a sealed physical cabinet. An officer cannot browse them without a signed judicial warrant."
      },
      {
        key: "B",
        text: "The speed-limit exemption clause, which grants inspectors absolute digital jurisdiction over any mobile device traveling on interstate highways.",
        isCorrect: false,
        feedback: "Incorrect. There is no travel speed exception that voids basic human privacy rights. Try again."
      }
    ],
    educationalFact: "In the landmark supreme ruling Carpenter v. United States, the court held that compiling and searching a citizen's personal digital records is a search under the Fourth Amendment, demanding high-level probable cause warrants.",
    unlockedStoryText: "🔑 Milestone 1 Cleared: Digital Shield established! You learned that state officials cannot turn a simple mechanical traffic inquiry into an unlimited search of your digital consciousness without explicit judicial consent."
  },
  {
    id: "arbitrary-fees",
    title: "The Secret Administrative Citation",
    topic: "Rules of Natural Justice & The Right to Be Heard",
    country: "United Kingdom",
    flag: "🇬🇧",
    scenario: "A regional administrative board sends you an immediate £1,200 fine for failing to attend an unannounced council meeting. When you write a letter to contest it, they respond that administrative rulings are final, that you have no legal standing to appeal, and that you must pay or face asset seizure.",
    question: "What core pillar of standard Natural Justice has been breached by this administrative order?",
    options: [
      {
        key: "A",
        text: "The rule of absolute administrative supremacy, which allows municipal boards to ignore common law court hearings to protect legislative speed.",
        isCorrect: false,
        feedback: "Incorrect. No agency is supreme over common law natural justice. Try again."
      },
      {
        key: "B",
        text: "The rule of 'Audi Alteram Partem' (Hear the other side). No authority can penalize a citizen without providing notice, specific grounds, and an unbiased tribunal to present a complete defense.",
        isCorrect: true,
        feedback: "Correct! The dual rules of natural justice make any administrative citation completely void if issued without a reasonable, unbiased avenue to present a defense."
      }
    ],
    educationalFact: "Common law standards guarantee that executive power remains subject to natural justice. An administrative agency cannot act as judge, jury, and executioner without an open, impartial appeal path.",
    unlockedStoryText: "📜 Milestone 2 Cleared: Procedural Due Process mastered! You discovered that any fine or enforcement action is legally void from its inception if it denies you the right to a fair, objective hearing."
  },
  {
    id: "environmental-hush",
    title: "The Hidden Community Safety Audit",
    topic: "Access to State Records & Public Transparency",
    country: "Kenya / South Africa",
    flag: "🇰🇪",
    scenario: "You observe a state-backed contractor discharging chemical residue into a local irrigation canal. When you petition the regional water department to inspect their recent water safety tests and regulatory contracts, they refuse, asserting the documents are 'confidential cabinet property' exempt from citizen oversight.",
    question: "Which supreme guarantee allows you to dismantle this administrative wall of secrecy?",
    options: [
      {
        key: "A",
        text: "The Constitutional Right to Access State Information. Any record compiled or held by a public body or state organ is public property and must be transparently released unless specific, proven security harms exist.",
        isCorrect: true,
        feedback: "Correct! Article 35 (Kenya) and Section 32 (South Africa) assert that state transparency is an unalterable citizen power. The state cannot lock away environmental or safety tests to protect developers."
      },
      {
        key: "B",
        text: "The Corporate Confidentiality doctrine, which holds that state-backed private entities are exempt from all civic disclosure laws to maximize economic efficiency.",
        isCorrect: false,
        feedback: "Incorrect. State-backed contractors and state organs are fully subject to public access rules. Try again."
      }
    ],
    educationalFact: "In cases like Katiba Institute v. President, the High Court confirmed that secrecy cannot be used as a shield by administrators. Transparency of public expenditures and community safety is a fundamental constitutional mandate.",
    unlockedStoryText: "🌊 Milestone 3 Cleared: The Vault of Secrecy shattered! By exercising the right to public records, you hold the key to expose regulatory collusions and reclaim community environmental audits."
  },
  {
    id: "compelled-allegiance",
    title: "The Compelled Employee Oath",
    topic: "Freedom of Thought, Conscience, & Ideology",
    country: "Japan",
    flag: "🇯🇵",
    scenario: "To renew your community bus driver card, the regional transport board requires all transit workers to sign a standard 'Loyalty & Speech Pledge' agreeing to never speak critically of municipal tax laws or council procedures during private or public hours.",
    question: "Under standard Freedom of Thought rules, why is this administrative mandate unconstitutional?",
    options: [
      {
        key: "A",
        text: "Because the state has no authority to regulate employee speech, which means transit employees are legally allowed to drive buses wherever they want.",
        isCorrect: false,
        feedback: "Incorrect. The state can regulate professional transit routes, but that does not give them authority to force ideological loyalty oaths. Try again."
      },
      {
        key: "B",
        text: "Because the Constitution protects your inner thoughts and conscience. Public agencies cannot condition a technical work license or a public benefit on forcing you to sign away your personal ideological beliefs or opinions.",
        isCorrect: true,
        feedback: "Correct! Under Article 19 (Japan) and general human rights charters, the state is strictly forbidden from compelling ideological pledges or punishing citizens for quiet dissent on public policies."
      }
    ],
    educationalFact: "The Supreme Court of Japan has established that while professional training can be requested, public offices cannot cross the boundary to force employees to actively profess particular political or state ideologies.",
    unlockedStoryText: "🕊️ Milestone 4 Cleared: Sanctity of Conscience preserved! You proved that professional licenses and civic permits cannot be held hostage to force citizens to sign away their natural freedom of mind."
  },
  {
    id: "arbitrary-kettling",
    title: "The Park Peace Enclosure",
    topic: "Freedom of Peaceful Assembly & Police Overreach",
    country: "Canada",
    flag: "🇨🇦",
    scenario: "You and fifty fellow citizens gather in a public square to hold a silent candlelit vigil against an unfair property tax. Although there is zero disruption, police surround the square with physical barricades (kettling), trap everyone inside for three hours, and hand out $500 'unauthorized assembly' fines.",
    question: "What core legal principle voids these mass preemptive citations?",
    options: [
      {
        key: "A",
        text: "The right of Peaceful Assembly. Peaceful citizens do not require arbitrary police permits to gather in public spaces, and police cannot use mass enclosure and preemptive fines to intimidate demonstrators.",
        isCorrect: true,
        feedback: "Correct! The court in Garbeau v. Montreal ruled that municipal rules cannot treat peaceful citizen gatherings as inherently illegal or use kettling as a tool of mass intimidation."
      },
      {
        key: "B",
        text: "The open-field doctrine, which declares that any citizen holding a burning candle gains immunity from all civic codes.",
        isCorrect: false,
        feedback: "Incorrect. The candle is a peaceful symbol, but the actual shield is your constitutional right of peaceful assembly. Try again."
      }
    ],
    educationalFact: "Under Section 2(c) of the Canadian Charter of Rights, peaceful public assembly is a core democratic right. Municipalities cannot enact arbitrary bylaws that strip citizens of their ability to stand and assemble peacefully in public view.",
    unlockedStoryText: "✊ Milestone 5 Cleared: Sovereignty of Assembly vindicated! You demonstrated that mass kettling and preemptive intimidation cannot stand against the supreme democratic right of peaceful, orderly association."
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

  // Investigator Case File Clipboard state
  const [solvedCases, setSolvedCases] = useState<Record<string, boolean>>({
    "digital-sanctity": true // start with one solved so they see how the progress mechanism works!
  });
  const [activeClipboardCaseId, setActiveClipboardCaseId] = useState<string>("digital-sanctity");
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(null);
  const [isCorrectResult, setIsCorrectResult] = useState<boolean | null>(null);
  const [userCertName, setUserCertName] = useState<string>("");
  const [isCertShowing, setIsCertShowing] = useState<boolean>(false);

  // Trigger sound effect
  const playNetworkSound = (type: "beep" | "unseal" | "stamp" | "click") => {
    // Sound effects removed by user request
  };

  // Handle unsealing a case file (Dramatic open without background page scrolling)
  const handleUnsealCaseFile = (node: BoardNode) => {
    playNetworkSound("unseal");
    
    // Open the immersive vintage declassified folder modal
    setIsDossierOpen(true);
    setDossierStamped(false);
    setCryptographicStatus("idle");
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

  // Clipboard Event Handlers
  const handleSelectOption = (key: string) => {
    playNetworkSound("click");
    setSelectedOptionKey(key);
    setIsCorrectResult(null);
  };

  const handleSubmitOption = () => {
    if (!selectedOptionKey) return;
    const currentCase = CLIPBOARD_CASES.find(c => c.id === activeClipboardCaseId);
    if (!currentCase) return;

    const selectedOpt = currentCase.options.find(o => o.key === selectedOptionKey);
    if (selectedOpt?.isCorrect) {
      playNetworkSound("stamp");
      setIsCorrectResult(true);
      setSolvedCases(prev => ({ ...prev, [currentCase.id]: true }));
    } else {
      playNetworkSound("beep");
      setIsCorrectResult(false);
    }
  };

  const handleSwitchClipboardCase = (caseId: string) => {
    playNetworkSound("click");
    setActiveClipboardCaseId(caseId);
    setSelectedOptionKey(null);
    setIsCorrectResult(null);
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
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-sm px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] leading-none mb-4 animate-pulse">
            <Globe className="w-3.5 h-3.5 animate-spin-slow text-[#d4af37]" />
            GLOBAL SOVEREIGN INTELLIGENCE GRID & JURISDICTIONAL ARCHIVE
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-3">
            World Case <span className="text-[#d4af37] font-serif not-italic font-bold">Dossier Map</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto font-light">
            Examine how local topics, constitutional protections, international precedents, and citizen manuals are linked. Select a jurisdiction to illuminate red thread paths, and unseal declassified folder dossiers. Use the Case Clipboard below to solve interactive legal investigations!
          </p>
        </div>

        {/* JURISDICTIONAL SELECTOR TABS (The Country Map Navigator) */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-10 max-w-5xl mx-auto bg-black/60 p-2 border border-[#d4af37]/15 rounded-md backdrop-blur-sm shadow-md">
          {[
            { id: "ALL", label: "All", flag: "🌐" },
            { id: "US", label: "United States", flag: "🇺🇸" },
            { id: "CA", label: "Canada", flag: "🇨🇦" },
            { id: "BR", label: "Brazil", flag: "🇧🇷" },
            { id: "GB", label: "United Kingdom", flag: "🇬🇧" },
            { id: "DE", label: "Germany", flag: "🇩🇪" },
            { id: "ZA", label: "South Africa", flag: "🇿🇦" },
            { id: "KE", label: "Kenya", flag: "🇰🇪" },
            { id: "IN", label: "India", flag: "🇮🇳" },
            { id: "SG", label: "Singapore", flag: "🇸🇬" },
            { id: "JP", label: "Japan", flag: "🇯🇵" },
            { id: "AU", label: "Australia", flag: "🇦🇺" }
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
          <div className="fixed inset-0 z-[100000] overflow-y-auto">
            
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDossierOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-[6px] pointer-events-auto cursor-crosshair"
            />

            {/* Centering container */}
            <div className="flex min-h-screen items-center justify-center p-3 sm:p-6 md:p-8 relative pointer-events-none z-10">
              {/* Immersive declassified file folder content with 3D paper folders aesthetics */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#f4ebd0] text-[#1c1c1c] border border-[#c5b080] shadow-[0_35px_80px_rgba(0,0,0,0.85)] w-full max-w-3xl rounded-sm overflow-hidden pointer-events-auto flex flex-col md:flex-row border-t-[16px] border-t-[#d4af37] font-sans"
              >
                
                {/* Folder Left Margin: Stamp, Seal, & Signature */}
                <div className="w-full md:w-[250px] bg-[#e5e0cc] border-b md:border-b-0 md:border-r border-[#cbc6b3] p-6 flex flex-col justify-between relative overflow-hidden shrink-0">
                  {/* Subtle retro security watermark lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-grid-lines" />
                  
                  {/* Decrypted grid fingerprint scan vector background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] pointer-events-none">
                    <svg className="w-full h-full text-red-950" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="35" />
                      <circle cx="50" cy="50" r="25" strokeDasharray="1 2" />
                      <path d="M50 5v90M5 50h90" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="border border-[#b59d57] bg-white/60 p-2.5 text-center rounded-sm mb-6 shadow-sm">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-gray-600 font-extrabold block">CIVIC CABINET FILE</span>
                      <span className="font-serif text-lg font-bold text-[#8c1d1d] tracking-widest">CS-RECR_908</span>
                    </div>

                    <div className="space-y-4">
                      <div className="font-mono text-[9px] uppercase space-y-1.5 text-gray-700">
                        <div>
                          <span className="opacity-60 font-bold">STATE REF:</span> 
                          <span className="text-[#1c1c1c] font-black block mt-0.5">{selectedNode.countryCode}_FED_DOC</span>
                        </div>
                        <div>
                          <span className="opacity-60 font-bold">JURISDICTION:</span> 
                          <span className="text-[#1c1c1c] font-black block mt-0.5">{selectedNode.country}</span>
                        </div>
                        <div>
                          <span className="opacity-60 font-bold">CATEGORY:</span> 
                          <span className="text-[#1c1c1c] font-black block mt-0.5">{selectedNode.type.toUpperCase()} SPEC</span>
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
                              ? "bg-[#8c1d1d]/10 text-[#8c1d1d] border-[#8c1d1d]/20 opacity-80 cursor-not-allowed font-extrabold"
                              : "bg-[#8c1d1d] hover:bg-red-900 text-white border-transparent shadow-sm font-bold"
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" /> {dossierStamped ? "STAMP APPLIED" : "APPLY SOVEREIGN STAMP"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rubber stamp visual overlay */}
                  <div className="mt-8 relative flex justify-center h-28 items-center z-10">
                    {dossierStamped && (
                      <motion.div
                        initial={{ scale: 3.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: -12 }}
                        transition={{ type: "spring", damping: 10, stiffness: 200 }}
                        className="absolute border-4 border-dashed border-[#8c1d1d] text-[#8c1d1d] px-4 py-2.5 text-center uppercase font-mono text-[11px] font-black tracking-widest rounded-sm pointer-events-none select-none rotate-[-12deg] bg-white/30 backdrop-blur-[0.5px] shadow-sm flex flex-col items-center justify-center"
                      >
                        <span className="text-[13px] leading-none mb-0.5 font-sans font-extrabold">DECLASSIFIED</span>
                        <span className="text-[7px] tracking-wider uppercase">CIVIC SHIELD ADVOCACY</span>
                      </motion.div>
                    )}
                    
                    {!dossierStamped && (
                      <div className="text-[8px] font-mono text-gray-500/80 uppercase text-center border border-dashed border-gray-400/80 p-3.5 w-full rounded-sm bg-white/20 select-none">
                        STAMP REQUIRED FOR ARCHIVE COMPLIANCE
                      </div>
                    )}
                  </div>
                </div>

                {/* Folder Right Body: Declassified Legal Brief */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[550px] md:max-h-[620px] relative pointer-events-auto">
                  {/* Decrypted official crest background watermark */}
                  <div className="absolute bottom-8 right-8 w-44 h-44 opacity-[0.025] pointer-events-none select-none">
                    <svg className="w-full h-full text-red-900" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M50 15 L80 30 L80 70 L50 85 L20 70 L20 30 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M50 25 L70 35 L70 65 L50 75 L30 65 L30 35 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Folder Top Tabs */}
                  <div className="absolute top-0 right-4 flex gap-1 transform -translate-y-full">
                    <div className="bg-[#f4ebd0] px-3 py-1.5 text-[8px] font-mono font-bold text-gray-600 border-t border-x border-[#c5b080] uppercase rounded-t-sm select-none">
                      {selectedNode.type} BRIEF
                    </div>
                  </div>

                  {/* Main Legal Content */}
                  <div className="space-y-6 relative z-10">
                    
                    {/* Document Header */}
                    <div className="flex items-start justify-between border-b border-gray-300 pb-4">
                      <div>
                        <p className="font-mono text-[8.5px] uppercase tracking-widest text-[#8c1d1d] font-bold">SOVEREIGN CASE STUDY EXAMINER</p>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1c1c1c] leading-tight mt-0.5">
                          {selectedNode.label}
                        </h2>
                        {selectedNode.citations && (
                          <p className="font-mono text-[9.5px] text-gray-600 font-extrabold mt-1 uppercase">
                            OFFICIAL CODES: {selectedNode.citations}
                          </p>
                        )}
                      </div>
                      
                      {/* Close button */}
                      <button
                        onClick={() => setIsDossierOpen(false)}
                        className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-gray-600 cursor-pointer shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Fact Summary */}
                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-extrabold uppercase text-[#1c1c1c] flex items-center gap-1.5 border-b border-dashed border-gray-300 pb-1">
                        <Scale className="w-4 h-4 text-[#8c1d1d]" /> Declassified Memorandum & Facts
                      </h4>
                      <p className="text-xs sm:text-[13px] text-gray-800 leading-relaxed font-serif text-justify font-normal">
                        {selectedNode.caseSummary || selectedNode.description}
                      </p>
                    </div>

                    {/* Absolute Ruling */}
                    {selectedNode.ruling && (
                      <div className="space-y-2 bg-[#e8e4d3] border-l-4 border-[#8c1d1d] p-3 sm:p-4 rounded-r-sm">
                        <h4 className="font-serif text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-red-800" /> Constitutional Ratio Decidendi (The Holding)
                        </h4>
                        <p className="text-xs text-gray-800 leading-relaxed font-serif italic font-normal">
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
                        <p className="text-xs text-emerald-900 leading-relaxed font-sans font-medium flex items-start gap-2 bg-emerald-50/50 border border-emerald-200/60 p-3 rounded-sm">
                          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{selectedNode.legalImpact}</span>
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Footer action */}
                  <div className="mt-8 pt-4 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left font-mono text-[9px] text-gray-500 uppercase relative z-10">
                    <div>
                      <span>UNSEAL TIME: {new Date().toLocaleDateString()}</span>
                      <span className="mx-2">|</span>
                      <span>RETRIEVED: SYSTEM_OPERATOR</span>
                    </div>
                    
                    <button
                      onClick={() => setIsDossierOpen(false)}
                      className="px-4 py-1.5 bg-[#1c1c1c] hover:bg-gray-800 text-white rounded-sm transition-all duration-300 tracking-wider cursor-pointer font-bold"
                    >
                      CLOSE BRIEF
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* INVESTIGATOR CASE FILE CLIPBOARD SECTION */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 relative z-10" id="case-clinics">
        
        {/* Section Divider with Badge */}
        <div className="my-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020d20] px-4 py-1.5 border border-[#d4af37]/30 text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] flex items-center gap-1.5 rounded-full shadow-md">
            <Clipboard className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" /> SOVEREIGN ADVOCATE CASE STUDY ARCHIVES
          </div>
        </div>

        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal italic">
            Investigator's <span className="text-[#d4af37] font-serif not-italic font-bold">Case Clipboard</span>
          </h3>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed font-light">
            Analyze real-world scenarios, dissect statutory boundaries, and apply core legal principles. Complete cases to progress your clearance status and earn the Certificate of Constitutional Mastery!
          </p>
        </div>

        {/* Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: THE WOODEN CLIPBOARD WITH PAPER (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Wooden clipboard backplate */}
            <div className="bg-gradient-to-b from-[#8a6d45] to-[#5c4424] p-4 sm:p-5 rounded-md shadow-2xl border-[5px] border-[#3a2712] relative overflow-hidden flex flex-col justify-between min-h-[580px]">
              
              {/* Clipboard wood grain aesthetic rings */}
              <div className="absolute inset-0 opacity-[0.03] bg-grid-lines pointer-events-none" />
              
              {/* Heavy duty binder clip on top */}
              <div className="relative w-full mb-6">
                <div className="w-36 h-10 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 border border-gray-700 rounded-b-md mx-auto relative shadow-md z-30 flex items-center justify-center">
                  {/* Chrome metallic spring loop */}
                  <div className="w-16 h-12 border-[5.5px] border-gray-400 rounded-t-full absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none z-10 shadow-sm" />
                  <span className="font-mono text-[7px] text-gray-200 uppercase tracking-widest font-extrabold select-none">CASE BRIEF_REF</span>
                </div>
                {/* Simulated shadow on paper */}
                <div className="w-40 h-2 bg-black/40 blur-[3px] mx-auto -mt-[1px] rounded-full" />
              </div>

              {/* White paper sheets stacked stack effect */}
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                
                {/* Rear paper sheet offset */}
                <div className="absolute inset-x-1 -top-1 bottom-1 bg-white/70 rounded-sm shadow-sm rotate-1 pointer-events-none" />
                <div className="absolute inset-x-2 -top-2 bottom-2 bg-white/40 rounded-sm shadow-sm -rotate-1 pointer-events-none" />
                
                {/* Main active paper sheet */}
                <div className="relative bg-[#fffdfa] text-slate-800 p-6 sm:p-8 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.15)] border border-[#e8dfc7] flex-1 flex flex-col justify-between select-text">
                  
                  {(() => {
                    const currentCase = CLIPBOARD_CASES.find(c => c.id === activeClipboardCaseId);
                    if (!currentCase) return <p className="font-mono text-xs text-red-500">Case file not found.</p>;
                    const currentCaseIdx = CLIPBOARD_CASES.findIndex(c => c.id === activeClipboardCaseId);
                    const isSolved = solvedCases[currentCase.id];

                    return (
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        
                        {/* Paper Sheet Header */}
                        <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">{currentCase.flag}</span>
                            <div className="leading-none">
                              <span className="font-mono text-[8px] font-black tracking-widest text-[#8c1d1d] uppercase block">CASE JURISDICTION</span>
                              <span className="font-sans font-bold text-[11px] text-slate-900">{currentCase.country}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-mono text-[9px] font-extrabold text-gray-500 block">DOSSIER INDEX</span>
                            <span className="font-mono text-[10px] font-black text-slate-800">#00{currentCaseIdx + 1}</span>
                          </div>
                        </div>

                        {/* Title & Topic badge */}
                        <div>
                          <div className="inline-block bg-[#8c1d1d]/10 border border-[#8c1d1d]/20 px-2 py-0.5 rounded-sm text-[8px] font-mono uppercase text-[#8c1d1d] font-bold mb-1 select-none">
                            {currentCase.topic}
                          </div>
                          <h4 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                            {currentCase.title}
                          </h4>
                        </div>

                        {/* Typewriter Story Scenario Block */}
                        <div className="bg-[#fcfaf5] border-l-4 border-amber-600 p-4 font-serif text-slate-800 text-[12.5px] sm:text-[13.5px] leading-relaxed italic rounded-r-sm border border-gray-200/60 shadow-sm relative overflow-hidden">
                          {/* Retro typewriter background grid lines */}
                          <div className="absolute inset-0 bg-grid-lines opacity-[0.01] pointer-events-none" />
                          <p className="relative z-10">"{currentCase.scenario}"</p>
                        </div>

                        {/* Case Study Question */}
                        <div className="space-y-3">
                          <p className="font-sans font-extrabold text-slate-900 text-xs sm:text-[13px] flex items-center gap-1.5 uppercase tracking-wide">
                            <HelpCircle className="w-4 h-4 text-[#8c1d1d] shrink-0" /> Case Investigator Challenge:
                          </p>
                          <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                            {currentCase.question}
                          </p>
                        </div>

                        {/* Multi-choice Options list */}
                        <div className="space-y-2 pt-2">
                          {currentCase.options.map((opt) => {
                            const isSelected = selectedOptionKey === opt.key;
                            return (
                              <button
                                key={opt.key}
                                onClick={() => handleSelectOption(opt.key)}
                                className={`w-full p-3 sm:p-4 text-left border rounded-sm transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                                  isSelected
                                    ? "bg-[#d4af37]/10 border-[#d4af37] text-slate-900 font-medium shadow-sm"
                                    : "bg-slate-50/50 hover:bg-slate-100/50 border-gray-200 text-slate-700"
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 transition-all ${
                                  isSelected 
                                    ? "bg-[#d4af37] text-black border-[#d4af37]"
                                    : "bg-white border-gray-300 text-gray-500"
                                }`}>
                                  {opt.key}
                                </span>
                                <span className="font-sans text-xs sm:text-[13px] leading-relaxed">
                                  {opt.text}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Submit Action Button (if not already solved or showing feedback) */}
                        {isCorrectResult === null && !isSolved && (
                          <button
                            onClick={handleSubmitOption}
                            disabled={!selectedOptionKey}
                            className={`w-full py-3 font-mono text-[10px] tracking-widest uppercase rounded-sm border transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                              selectedOptionKey
                                ? "bg-[#8c1d1d] hover:bg-red-900 text-white border-transparent cursor-pointer"
                                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            }`}
                          >
                            <Key className="w-3.5 h-3.5" /> Submit Evidence Hash & Solve Case
                          </button>
                        )}

                        {/* INCORRECT RESULT FEEDBACK WINDOW */}
                        {isCorrectResult === false && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 p-4 rounded-sm flex items-start gap-3 mt-4"
                          >
                            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-red-800">SOLVER ERROR: OVERREACH DETECTED</p>
                              <p className="text-xs text-red-700 font-semibold mt-0.5">
                                Your analysis was incorrect! Review the constitutional boundaries and try selecting the alternate defense strategy.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* CORRECT RESULT / STAMPED WORKSPACE OUTCOME REPORT */}
                        {(isCorrectResult === true || isSolved) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="border-t border-dashed border-gray-300 pt-6 mt-4 space-y-4 relative"
                          >
                            {/* Tactile double-bordered Rubber Stamp Slam Animation */}
                            <motion.div 
                              initial={{ scale: 5, opacity: 0, rotate: -40, filter: "blur(6px)" }}
                              animate={{ scale: 1, opacity: 0.9, rotate: -12, filter: "blur(0px)" }}
                              transition={{ type: "spring", damping: 10, stiffness: 260, delay: 0.15 }}
                              className="absolute top-1 right-3 pointer-events-none select-none z-30"
                            >
                              <div className="border-[3px] border-double border-red-600 text-red-600 px-3 py-1 text-center font-mono text-[10px] font-black uppercase tracking-[0.2em] rounded-sm bg-white/95 shadow-md relative overflow-hidden rotate-1 select-none">
                                <div className="absolute inset-0 bg-red-600/5 mix-blend-multiply" />
                                CASE COMPLIANT
                              </div>
                            </motion.div>

                            <div className="space-y-3">
                              <span className="font-mono text-[9.5px] uppercase tracking-widest text-emerald-700 font-black flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Declassified Investigator Report Unlocked
                              </span>
                              
                              <p className="text-xs sm:text-[13px] text-emerald-950 font-sans leading-relaxed font-medium bg-emerald-50/70 border border-emerald-100 p-3 sm:p-4 rounded-sm italic">
                                "{currentCase.options.find(o => o.isCorrect)?.feedback}"
                              </p>

                              <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-sm space-y-1.5">
                                <span className="font-mono text-[8px] uppercase tracking-widest text-gray-500 block font-bold">EDUCATIONAL CONSTITUTIONAL FACT</span>
                                <p className="text-xs text-slate-700 leading-relaxed font-serif">
                                  {currentCase.educationalFact}
                                </p>
                              </div>

                              <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-sm flex items-start gap-2 text-amber-950 font-sans text-xs font-semibold">
                                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 animate-pulse" />
                                <span>{currentCase.unlockedStoryText}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      </div>
                    );
                  })()}

                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: PROGRESS TRACKER & DOSSIER LIST (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="bg-[#000d21] border border-[#d4af37]/20 rounded-sm p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-6">
              
              {/* Retro carbon watermark watermark */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 opacity-[0.02] pointer-events-none">
                <svg className="w-full h-full text-amber-500" viewBox="0 0 100 100" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* Status Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-900 pb-3">
                  <Trophy className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-bold leading-none">PROGRESS LEDGER</span>
                </div>

                {/* Progress bar block */}
                {(() => {
                  const solvedCount = Object.keys(solvedCases).length;
                  const totalCount = CLIPBOARD_CASES.length;
                  const progressPct = (solvedCount / totalCount) * 100;
                  
                  let clearanceLevel = "Novice Advocate";
                  if (solvedCount >= 5) clearanceLevel = "Constitutional Mastermind";
                  else if (solvedCount >= 3) clearanceLevel = "Sovereign Specialist";
                  else if (solvedCount >= 1) clearanceLevel = "Civic Investigator";

                  return (
                    <div className="space-y-2 bg-black/40 border border-white/5 p-4 rounded-sm">
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-gray-400">
                        <span>Clearance Status</span>
                        <span className="text-[#d4af37] font-extrabold">{solvedCount} of {totalCount} Solved</span>
                      </div>
                      
                      {/* Real animated progress bar */}
                      <div className="w-full bg-slate-950 border border-white/10 rounded-full h-3.5 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.6 }}
                          className="bg-gradient-to-r from-red-600 via-[#d4af37] to-emerald-500 h-full rounded-full"
                        />
                      </div>

                      <div className="pt-2 flex justify-between items-center">
                        <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block font-bold">DESIGNATED RANK:</span>
                        <span className="font-mono text-[9.5px] text-[#d4af37] font-black uppercase tracking-wider">{clearanceLevel}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Dossier Navigation file tabs */}
              <div className="space-y-2 flex-1">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-gray-500 block font-bold">Investigation Folders</span>
                
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {CLIPBOARD_CASES.map((item, idx) => {
                    const isActive = item.id === activeClipboardCaseId;
                    const isSolved = solvedCases[item.id];
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSwitchClipboardCase(item.id)}
                        className={`w-full p-2.5 text-left border rounded-sm transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-[#d4af37]/10 border-[#d4af37]/50 text-white font-bold"
                            : "bg-black/30 border-white/5 text-gray-400 hover:text-white hover:border-[#d4af37]/35"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <div className="leading-none text-left">
                            <span className="font-mono text-[7px] text-gray-500 tracking-wider block">FOLDER_00{idx + 1}</span>
                            <span className="font-sans text-[11px] font-semibold line-clamp-1">{item.title}</span>
                          </div>
                        </div>

                        <div>
                          {isSolved ? (
                            <span className="text-[8px] font-mono font-bold uppercase py-0.5 px-1.5 bg-emerald-950/70 border border-emerald-500/20 text-emerald-400 rounded-sm">
                              ✓ SOLVED
                            </span>
                          ) : isActive ? (
                            <span className="text-[8px] font-mono font-bold uppercase py-0.5 px-1.5 bg-amber-950/70 border border-amber-500/20 text-amber-400 rounded-sm animate-pulse">
                              ● ACTIVE
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono font-bold uppercase py-0.5 px-1.5 bg-slate-900 border border-white/5 text-gray-500 rounded-sm">
                              ⍛ SEALED
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Achievement Generation Block (Unlocks when 100% solved) */}
              <div className="pt-4 border-t border-gray-900">
                {(() => {
                  const solvedCount = Object.keys(solvedCases).length;
                  const totalCount = CLIPBOARD_CASES.length;
                  const isAllSolved = solvedCount >= totalCount;

                  if (isAllSolved) {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <button
                          onClick={() => {
                            playNetworkSound("unseal");
                            setIsCertShowing(true);
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 hover:brightness-110 text-black font-mono font-bold text-[10px] tracking-widest uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-bounce"
                        >
                          <Scroll className="w-4 h-4 text-black" /> Claim Sovereignty Certificate
                        </button>
                        <p className="text-center font-mono text-[7px] text-emerald-400 uppercase tracking-widest">
                          ★ 100% LEGAL LITERCY CLEARANCE LOGGED
                        </p>
                      </motion.div>
                    );
                  } else {
                    return (
                      <div className="text-center bg-black/40 border border-dashed border-gray-800 p-3 rounded-sm">
                        <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest leading-relaxed">
                          Solve all {totalCount} clipboard cases to generate your signed certificate of Constitutional Mastery!
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* SOVEREIGN ACHIEVEMENT CERTIFICATE MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {isCertShowing && (
          <div className="fixed inset-0 z-[110000] overflow-y-auto flex items-center justify-center p-3 sm:p-6 md:p-8">
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCertShowing(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md pointer-events-auto cursor-crosshair"
            />

            {/* Certificate frame paper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative bg-[#fbf8ed] text-slate-900 border-[16px] border-[#d4af37] shadow-[0_30px_70px_rgba(0,0,0,0.95)] w-full max-w-2xl rounded-sm p-8 sm:p-12 pointer-events-auto text-center font-serif border-double"
            >
              {/* Inner thin decorative border */}
              <div className="absolute inset-2 border border-amber-800/40 pointer-events-none" />
              <div className="absolute inset-3 border-[3px] border-double border-amber-800/30 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsCertShowing(false)}
                className="absolute top-5 right-5 p-1.5 hover:bg-black/5 rounded-full text-slate-500 hover:text-slate-950 transition-colors cursor-pointer z-50 select-none font-sans"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Content */}
              <div className="space-y-6 select-text">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-800 font-extrabold block">GLOBAL SOVEREIGN ALLIANCE</span>
                  <h2 className="text-2xl sm:text-4xl font-serif text-[#8c1d1d] font-bold tracking-tight">
                    Certificate of Mastery
                  </h2>
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent w-48 mx-auto my-2" />
                  <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">IN THE STUDY OF GLOBAL CIVIL SOVEREIGNTY</span>
                </div>

                <p className="font-serif italic text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed mt-4">
                  "This official document is generated in recognition of complete academic and interactive legal literacy audits, demonstrating mastery of fundamental common law, privacy sanctuary, and constitutional parameters."
                </p>

                {/* Interactive Name input field */}
                <div className="max-w-xs mx-auto py-4 font-sans select-none">
                  <label className="block text-[8.5px] font-mono uppercase tracking-widest text-slate-500 mb-1 font-bold">
                    Enter Sovereign Advocate Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Advocate Name"
                    value={userCertName}
                    onChange={(e) => setUserCertName(e.target.value)}
                    className="w-full text-center px-3 py-1.5 bg-white border border-gray-300 rounded-sm font-sans text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Dynamic Calligraphy script name on the certificate */}
                <div className="py-2">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">THIS CERTIFICATE IS GRANTED UNTO</p>
                  <div className="min-h-[50px] flex items-center justify-center">
                    <p className="font-serif italic font-extrabold text-3xl sm:text-4xl text-[#1c1c1c] tracking-wide border-b-2 border-slate-300 px-6 pb-2 min-w-[200px]">
                      {userCertName || "Master Advocate"}
                    </p>
                  </div>
                </div>

                <p className="font-serif italic text-[11px] sm:text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  "Being fully certified in procedural due process, natural justice defenses, and state administrative constraints, the bearer is empowered to stand securely with the shield of legal compliance."
                </p>

                {/* Signatures & Seal columns */}
                <div className="grid grid-cols-2 gap-8 pt-8 max-w-lg mx-auto font-sans items-end select-none">
                  
                  {/* Left Signature */}
                  <div className="space-y-1 text-center">
                    <p className="font-serif italic text-sm text-slate-800 font-bold">Civic Alliance Council</p>
                    <div className="h-[1px] bg-slate-300 w-32 mx-auto" />
                    <p className="font-mono text-[7.5px] text-slate-500 uppercase tracking-widest">AUTHORIZED ATTESTATION</p>
                  </div>

                  {/* Right Gold Seal Seal */}
                  <div className="flex flex-col items-center justify-center space-y-1 relative">
                    {/* Golden stamp SVG Seal */}
                    <div className="w-16 h-16 bg-[#d4af37] border-4 border-dashed border-amber-800/60 rounded-full flex items-center justify-center shadow-md rotate-[-5deg] relative">
                      {/* Metallic shine effect */}
                      <div className="absolute inset-0.5 rounded-full border border-amber-800/30" />
                      <div className="text-[6.5px] font-serif font-black text-amber-950 uppercase text-center leading-none">
                        SOVEREIGN<br/>SEAL
                      </div>
                    </div>
                    <p className="font-mono text-[7px] text-amber-800 font-extrabold uppercase tracking-widest mt-1">OFFICIAL VERIFICATION HASH</p>
                  </div>

                </div>

                {/* Print button & Close actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto font-sans text-xs font-bold select-none">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Scroll className="w-4 h-4 text-amber-400" /> Print Document
                  </button>
                  <button
                    onClick={() => setIsCertShowing(false)}
                    className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-slate-800 rounded-sm transition-colors cursor-pointer"
                  >
                    Close Certificate
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
