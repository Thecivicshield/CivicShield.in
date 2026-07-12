import React, { useState, useEffect } from "react";
import { Scale, HeartHandshake, FileText, Gavel, BookOpen, AlertCircle, CheckCircle, HelpCircle, Clock, Smartphone, Trash2, Plus, Search, Filter, Pin, PinOff, Bookmark, Star, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Statute } from "../types";

interface LawCard {
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
  citation: string;
}

interface CivicMisconception {
  question: string;
  answerOnTrue: string;
  myth: string;
}

interface JusticeShieldSectionProps {
  key?: string;
  isAdmin: boolean;
  basicLaws?: LawCard[];
  legalMyths?: CivicMisconception[];
  libraryStatutes?: Statute[];
  onUpdateLaws?: (nextLaws: LawCard[]) => void;
  onUpdateMyths?: (nextMyths: CivicMisconception[]) => void;
  onUpdateLibrary?: (nextLibrary: Statute[]) => void;
}

const DEFAULT_LAWS: LawCard[] = [
  {
    title: "Right to Free Legal Aid",
    subtitle: "The Covenant of Equal Protection",
    description: "Under Article 39A of the Indian Constitution, the State is mandated to provide free legal aid to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities. This is supported internationally by Article 14 of the ICCPR, guaranteeing free legal assistance where the interests of justice so require.",
    keyPoints: [
      "Mandated under Article 39A of the Constitution of India (introduced via the 42nd Amendment).",
      "The Legal Services Authorities Act, 1987, establishes SLSA, DLSA, and Lok Adalats to offer real pro-bono aid.",
      "Guarantees that low-income or marginalized citizens receive free certified legal representation in any proceeding."
    ],
    citation: "Art. 39A, Constitution of India / Art. 14, ICCPR"
  },
  {
    title: "Party-in-Person Representation",
    subtitle: "The Inherent Right to Self-Advocacy",
    description: "You have an absolute statutory and constitutional right to represent your own case as a 'Party-in-Person' before any Indian court, tribunal, or administrative authority without being forced to hire or pay private counsel advocates.",
    keyPoints: [
      "Governed by Section 32 of the Advocates Act, 1961, which permits any court to allow non-advocates to appear.",
      "Provides equal standing to draft, verify, file, and argue Writ Petitions under Article 226 or Article 32.",
      "Requires adhering to standard High Court or District court registry procedures and simple procedural formatting."
    ],
    citation: "Sec. 32, Advocates Act, 1961"
  },
  {
    title: "Principles of Natural Justice",
    subtitle: "Shield Against Arbitrary Municipal Execution",
    description: "No local municipal corporation, building inspector, or state official can deprive you of life, liberty, or property without proper legal proceedings and fair hearing. The golden rule 'Audi Alteram Partem' guarantees that no administrative order can be passed to your detriment without a fair chance to state your defense.",
    keyPoints: [
      "Inextricably linked with Article 21 (Protection of Life and Liberty) and Article 14 (Equality before Law).",
      "Strictly requires a clear written 'Show-Cause' notice explaining any alleged statutory infraction.",
      "Guarantees a right to an impartial hearing and a speaking order detailing the rationale of any municipal decision."
    ],
    citation: "Art. 21, Constitution of India"
  },
  {
    title: "Right to Information (RTI)",
    subtitle: "Sovereign Inquest of Public Records & Budgets",
    description: "Citizens have the statutory authority to audit public spending, verify records, read municipal officer emails, and inspect local development files. This ensures absolute transparency and curbs administrative corruption.",
    keyPoints: [
      "Enacted under the revolutionary Right to Information (RTI) Act, 2005, celebrating citizen auditing power.",
      "Public Information Officers (PIOs) must respond to your statutory applications within 30 days.",
      "Aligned with Article 19 of the Universal Declaration of Human Rights (UDHR) protecting freedom of information."
    ],
    citation: "RTI Act, 2005 / Article 19, UDHR"
  },
  {
    title: "Arrest Guard & 24-Hour Presentation",
    subtitle: "The Vital Guard on Personal Liberty",
    description: "No authority or police unit can keep an arrested person in executive custody for more than 24 hours without bringing them directly before a judicial magistrate. This prevents arbitrary enforcement, illegal detention, and guarantees judicial review.",
    keyPoints: [
      "Guaranteed as a Fundamental Right under Article 22(2) of the Indian Constitution.",
      "Statutorily mandated under Sec 57 of the Criminal Procedure Code (and corresponding Sec 56 of the new BNSS, 2024).",
      "Mandates that the 24-hour limit excludes the time travel journey, ensuring immediate and neutral judicial overview."
    ],
    citation: "Art. 22(2), Constitution of India / CrPC Sec 57"
  },
  {
    title: "Digital Privacy & Device Protection",
    subtitle: "Constitutional Shield for Your Personal Devices",
    description: "Under Article 21's Right to Privacy (established in Puttaswamy), your smartphones, laptops, and digital accounts are protected against arbitrary inspection. Officers cannot force you to unlock or browse through your devices without specific judicial search orders.",
    keyPoints: [
      "Protected from forced self-incrimination under Article 20(3) of the Indian Constitution, as forced passcode disclosure is restricted.",
      "Requires official written panchnama / seizure memo specifying digital metadata and hash values to prevent tampering.",
      "Provides civil recourse and protection under IT Act provisions when private data is accessed or leaked without consent."
    ],
    citation: "Art. 21 & Art. 20(3), Constitution of India"
  }
];

const DEFAULT_MYTHS: CivicMisconception[] = [
  {
    question: "Are citizens legally permitted to record video of public officials or police officers on duty in public spaces?",
    myth: "MYTH: Public officers can instantly forbid video recordation of their duties using verbal bans or privacy claims.",
    answerOnTrue: "Yes. Under Article 19(1)(a) of the Constitution of India (Freedom of Speech and Expression), recording public officials performing statutory tasks in a public space is fully permitted. As long as you do not obstruct their physical duties or cross into notified high-security zones, documenting is fully legal."
  },
  {
    question: "Can an administrative or municipal officer impose an immediate property lien or seal your house without a notice?",
    myth: "MYTH: Building or civil citations bypass municipal tribunals and instantly attach directly as final properties seizures.",
    answerOnTrue: "No. Under the Principles of Natural Justice and Article 300A (Right to Property), no property can be deprived or sealed without proper fair warning (Show-Cause notice), an opportunity to challenge the order, and a formal neutral board determination."
  },
  {
    question: "Does an advocate assigned through the District Legal Services Authority (DLSA) have the right to demand separate filing fees or research markups?",
    myth: "MYTH: State-provided legal aid permits retroactive back-billing or supplementary fee demands from citizens.",
    answerOnTrue: "No. Services provided through the SLSA, DLSA, or Supreme Court Legal Services Committee are 100% free of charge to eligible persons. Any request by an assigned advocate for private payments constitutes a severe professional misconduct under BCI rules."
  },
  {
    question: "Can the police detain you indefinitely at a local station without showing you to a judge as long as they call it questioning?",
    myth: "MYTH: Informal or formal station house detentions do not trigger the 24-hour presentation deadline.",
    answerOnTrue: "No. The 24-hour presenting deadline (Article 22(2) & CrPC Sec 57) is strict. The moment physical restraint or custody is imposed, the 24-hour clock starts. Prolonging detention beyond 24 hours without a Magistrate's order is illegal and constitutes unlawful confinement."
  },
  {
    question: "Can a patrolling officer legally seize your phone or force you to unlock it during a routine check?",
    myth: "MYTH: Police possess automatic statutory powers to inspect devices or read chats without warning or judicial case logs.",
    answerOnTrue: "No. Patrolling officers cannot force you to unlock your phone, browse chats, or copy your digital files without a specific written warrant or a formal summons linked to an active, documented FIR connection. Forced device unlocked violates Article 21 and Article 20(3)."
  }
];

const DEFAULT_LIBRARY_STATUTES: Statute[] = [
  {
    id: "statute-art21",
    title: "Article 21: Protection of Life and Personal Liberty",
    citation: "Constitution of India, Art. 21",
    category: "Fundamental Rights",
    description: "No person shall be deprived of his life or personal liberty except according to procedure established by law. This serves as the fountainhead of civil liberties, protecting citizens from arbitrary State action and illegal custody.",
    keyPoints: [
      "Includes the Right to Privacy as established in the landmark K.S. Puttaswamy judgment.",
      "Protects against arbitrary police search, unauthorized surveillance, and physical violence in custody.",
      "Ensures the right to live with human dignity, food, clean environment, and immediate medical aid."
    ],
    relevance: "Absolute shield against illegal confinement, police high-handedness, and forced warrantless searches of home or body."
  },
  {
    id: "statute-art19",
    title: "Article 19(1)(a): Freedom of Speech and Expression",
    citation: "Constitution of India, Art. 19(1)(a)",
    category: "Fundamental Rights",
    description: "All citizens have the right to freedom of speech and expression. This includes the freedom of press, dissemination of information, and the right to observe and record public events.",
    keyPoints: [
      "Protects the citizen's right to record video or audio of police and public officials on duty in public spots.",
      "Forbids officials from summarily banning recording unless in specific notified military or high-security grids.",
      "Includes the right to hold peaceful demonstrations and express dissent against administrative policies."
    ],
    relevance: "Empowers citizens to document bodycam-equivalent footage of state officials during civic inspections and detentions."
  },
  {
    id: "statute-art14",
    title: "Article 14: Equality Before Law",
    citation: "Constitution of India, Art. 14",
    category: "Fundamental Rights",
    description: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
    keyPoints: [
      "Stands as an absolute bar against class legislation and arbitrary, discriminatory administrative orders.",
      "Demands that similar groups or situations must be treated similarly by municipal and municipal-state bodies.",
      "Guarantees that administrative guidelines must be applied uniformly without favor or prejudice."
    ],
    relevance: "Useful when fighting arbitrary selective demolition of houses, selective licensing, or unfair municipal tax assessments."
  },
  {
    id: "statute-art22",
    title: "Article 22(2): Right to Magistrate Presentation",
    citation: "Constitution of India, Art. 22(2)",
    category: "Criminal Procedure",
    description: "Every person who is arrested and detained in custody shall be produced before the nearest magistrate within a period of twenty-four hours of such arrest.",
    keyPoints: [
      "The 24-hour presentation deadline is absolute and excludes only the time necessary for the journey to the court.",
      "No arrestee can be detained in police custody beyond the 24 hours without explicit judicial remand orders from a judge.",
      "Guarantees the right to consult and be defended by a legal practitioner of their choice immediately upon arrest."
    ],
    relevance: "The ultimate safeguard against secret detention, continuous third-degree interrogation, or informal station house lockup."
  },
  {
    id: "statute-adv32",
    title: "Section 32, Advocates Act, 1961: Party-in-Person Stand",
    citation: "Advocates Act, 1961, Sec. 32",
    category: "Citizen Representation",
    description: "Permits any court, authority, or person to allow any non-advocate to appear before it or him in any particular case.",
    keyPoints: [
      "Recognizes the sovereign right of self-advocacy and representing one's own legal case without hired counsel.",
      "Allows self-represented citizens to file petitions, move motions, and argue directly before judges.",
      "Judges hold an inherent duty to guide and accommodate self-represented litigants on simple procedural hurdles."
    ],
    relevance: "Eliminates the financial barrier of expensive lawyers, allowing citizens to defend their rights pro-se in any tribunal."
  },
  {
    id: "statute-rti6",
    title: "Section 6, Right to Information (RTI) Act, 2005: Public Request",
    citation: "RTI Act, 2005, Sec. 6",
    category: "Administrative & Transparency",
    description: "A person who desires to obtain any information under this Act shall make a request in writing or through electronic means to the Public Information Officer (PIO).",
    keyPoints: [
      "No applicant is required to give any reason for requesting information, or any personal details except contact info.",
      "PIOs must provide the information within 30 days, or within 48 hours if it concerns the life or liberty of a person.",
      "Enables inspection of public works, certified copies of contracts, budgets, and public official communications."
    ],
    relevance: "Primary tool for obtaining concrete administrative evidence of municipal budgets, illegal zoning, or land records."
  },
  {
    id: "statute-bnss35",
    title: "Section 35, BNSS, 2024: Notice of Arrest Mandate",
    citation: "Bharatiya Nagarik Suraksha Sanhita, Sec. 35",
    category: "Criminal Procedure",
    description: "The police officer shall, in all cases where the arrest of a person is not required under sub-section (1), issue a notice directing the person to appear before him.",
    keyPoints: [
      "Mandatory for all alleged offenses carrying a maximum punishment of less than 7 years of imprisonment.",
      "As long as the citizen complies with the notice conditions, they cannot be arrested unless the police record written reasons.",
      "Protects citizens from being summarily arrested on simple complaints, verbal allegations, or commercial disputes."
    ],
    relevance: "Stops instant police arrest on simple, unverified complaints, establishing a mandatory non-arrest warning phase."
  },
  {
    id: "statute-ipc166",
    title: "Section 166A, IPC / BNS: Liability for Refusing FIR",
    citation: "Indian Penal Code, Sec. 166A / BNS",
    category: "Administrative & Transparency",
    description: "Penalizes public servants who knowingly disobey directions of law, specifically police officers who refuse to register an FIR.",
    keyPoints: [
      "Refusal to register an FIR for specified cognizable offenses (such as crimes against women or severe abuse) carries strict imprisonment.",
      "Requires police station heads to enter complaints into the General Diary and issue a free copy of the FIR to the complainant.",
      "Establishes personal criminal accountability for police officers acting in deliberate defiance of procedural codes."
    ],
    relevance: "Leverage for citizens against police officers who refuse to record complaints, try to compromise cases, or demand bribes."
  },
  {
    id: "statute-art300a",
    title: "Article 300A: Right to Property Protection",
    citation: "Constitution of India, Art. 300A",
    category: "Civil & Property",
    description: "No person shall be deprived of his property save by authority of law. While no longer a Fundamental Right, it remains a vital constitutional guarantee.",
    keyPoints: [
      "State cannot seal, demolish, or acquire private land or buildings without an explicit legislative act and fair procedure.",
      "Demands the issuance of a written prior notice, opportunity to raise objections, and a formal administrative order.",
      "Forbids municipal demolishers from acting on verbal commands or political pressure without written warrants."
    ],
    relevance: "Protects home, commercial stalls, and land from arbitrary bulldozing or municipal encroachment without judicial review."
  },
  {
    id: "statute-bsa63",
    title: "Section 63, BSA, 2024: Admissibility of Electronic Records",
    citation: "Bharatiya Sakshya Adhiniyam, Sec. 63",
    category: "Criminal Procedure",
    description: "Lays down strict criteria for admitting digital records (bodycam footage, phone video, chats, emails) as legal evidence in court.",
    keyPoints: [
      "Requires a formal certificate validating the integrity of the computer/device and hash value of the electronic file.",
      "Ensures that digital footage recorded by citizens is protected from tampering and carries equivalent weight to paper records.",
      "Digital logs, system history, and WhatsApp chats can serve as primary evidence of innocence if preserved securely."
    ],
    relevance: "Ensures citizen-recorded video evidence of official misconduct or verbal compliance is legally admissible in defense."
  },
  {
    id: "statute-lsa12",
    title: "Section 12, Legal Services Authorities Act, 1987: Entitlement to Legal Aid",
    citation: "Legal Services Authorities Act, 1987, Sec. 12",
    category: "Citizen Representation",
    description: "Lists the criteria for citizens to receive free, state-sponsored legal services from certified pro-bono lawyers.",
    keyPoints: [
      "Automatically entitles women, children, industrial workers, custody detainees, and SC/ST citizens to free legal counsel.",
      "Encompasses court fees, drafting charges, typing expenses, and active representation in District and High courts.",
      "Income limit criteria apply for general citizens, offering an expansive social safety net for legal defense."
    ],
    relevance: "Guarantees that no person is left defenseless in court due to poverty, lack of resources, or systemic marginalization."
  },
  {
    id: "statute-cpc80",
    title: "Section 80, CPC: Mandatory Prior Notice to Government",
    citation: "Code of Civil Procedure, Sec. 80",
    category: "Civil & Property",
    description: "No suit shall be instituted against the Government or against a public officer in respect of any act purporting to be done by such public officer in his official capacity, until the expiration of two months.",
    keyPoints: [
      "Requires a written notice delivered to the secretary or office specifying the cause of action, name, and relief claimed.",
      "Allows the State to correct administrative mistakes or settle grievances out of court within the 2-month cooling period.",
      "Exceptions are allowed for urgent or immediate relief with the permission of the court (e.g., stopping an imminent demolition)."
    ],
    relevance: "Provides an early formal notification channel to freeze arbitrary administrative actions before litigation."
  }
];

export default function JusticeShieldSection({
  isAdmin,
  basicLaws,
  legalMyths,
  libraryStatutes,
  onUpdateLaws,
  onUpdateMyths,
  onUpdateLibrary
}: JusticeShieldSectionProps) {
  const [activeLawIndex, setActiveLawIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: boolean }>({});
  const [revealedQuiz, setRevealedQuiz] = useState<{ [key: number]: boolean }>({});
  const [isEditingActiveLaw, setIsEditingActiveLaw] = useState(false);
  const [editingMythIndex, setEditingMythIndex] = useState<number | null>(null);

  const laws = basicLaws && basicLaws.length > 0 ? basicLaws : DEFAULT_LAWS;
  const myths = legalMyths && legalMyths.length > 0 ? legalMyths : DEFAULT_MYTHS;

  // Searchable Statutes Library States
  const library = libraryStatutes && libraryStatutes.length > 0 ? libraryStatutes : DEFAULT_LIBRARY_STATUTES;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewingStatute, setViewingStatute] = useState<Statute | null>(null);

  // Admin Library Management States
  const [editingStatuteId, setEditingStatuteId] = useState<string | null>(null);
  const [isAddingStatute, setIsAddingStatute] = useState(false);
  const [newStatuteForm, setNewStatuteForm] = useState<Omit<Statute, "id">>({
    title: "",
    citation: "",
    category: "Fundamental Rights",
    description: "",
    keyPoints: [""],
    relevance: ""
  });

  // Pinned Statutes State (Stored in localStorage for individual users)
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("civic_shield_pinned_statutes");
      return stored ? JSON.parse(stored) : ["statute-art21", "statute-art19"];
    } catch {
      return ["statute-art21", "statute-art19"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("civic_shield_pinned_statutes", JSON.stringify(pinnedIds));
    } catch (e) {
      console.error("Failed to write pinned statutes:", e);
    }
  }, [pinnedIds]);

  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPinnedIds((prev) => 
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleAddKeyPointInput = () => {
    setNewStatuteForm((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ""]
    }));
  };

  const handleRemoveKeyPointInput = (idx: number) => {
    setNewStatuteForm((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== idx)
    }));
  };

  const handleKeyPointChange = (idx: number, val: string) => {
    const updated = [...newStatuteForm.keyPoints];
    updated[idx] = val;
    setNewStatuteForm((prev) => ({
      ...prev,
      keyPoints: updated
    }));
  };

  const handleSaveNewStatute = () => {
    if (!onUpdateLibrary) return;
    if (!newStatuteForm.title || !newStatuteForm.citation) {
      alert("Title and Citation references are required.");
      return;
    }
    const created: Statute = {
      ...newStatuteForm,
      id: "statute-" + Date.now(),
      keyPoints: newStatuteForm.keyPoints.filter(Boolean)
    };
    onUpdateLibrary([...library, created]);
    setIsAddingStatute(false);
    setNewStatuteForm({
      title: "",
      citation: "",
      category: "Fundamental Rights",
      description: "",
      keyPoints: [""],
      relevance: ""
    });
  };

  const handleDeleteStatute = (id: string, title: string) => {
    if (!onUpdateLibrary) return;
    if (confirm(`Do you want to permanently delete "${title}" from the searchable library?`)) {
      onUpdateLibrary(library.filter((s) => s.id !== id));
      setPinnedIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const categories = [
    "All",
    "Fundamental Rights",
    "Criminal Procedure",
    "Civil & Property",
    "Administrative & Transparency",
    "Citizen Representation"
  ];

  const filteredStatutes = library.filter((statute) => {
    const matchesSearch = 
      statute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statute.citation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statute.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statute.relevance.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || statute.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedStatutes = library.filter((s) => pinnedIds.includes(s.id));

  return (
    <motion.section 
      id="justice-shield" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001a4d] border-t border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Background visual accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Civic Shield Educational Hub
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-2">
            The Justice <span className="text-[#d4af37] font-serif not-italic">Shield</span>
          </h2>
          <p className="text-[10px] font-mono text-[#d4af37]/75 uppercase tracking-[0.25em]">
            Bridging Civic Advocacy, Eliminating Fear, Securing Procedural Integrity
          </p>
          <p className="mt-5 text-gray-300 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Procedural fear disappears when you speak the language of absolute statutory law. Explore simple, structured legal reviews on self-representation, pro-bono ethics, and due process protocols below.
          </p>
        </motion.div>

        {/* Statutes Board Explanation Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-16 bg-[#001233]/40 border border-[#d4af37]/15 rounded-sm p-6 relative overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start gap-6 font-sans text-left">
            <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] rounded-sm shrink-0 flex items-center justify-center">
              <Gavel className="w-8 h-8" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#d4af37]">
                  How to Use the Statutes Board
                </h3>
                <p className="text-[11px] text-gray-400 font-mono tracking-wider mt-1 uppercase">
                  Sovereign Citizen Administrative Interface & Auditing Protocol
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-2 border-l-2 border-[#d4af37]/30 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[#d4af37]/15 text-[#d4af37] px-1.5 py-0.5 rounded-sm font-bold">01</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Demystify Core Protections</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Examine core legal standards under <strong>Constitutional Articles</strong> and active <strong>Civil & Penal codes</strong>. Understanding these safeguards limits arbitrary administrative overreach.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-[#d4af37]/30 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[#d4af37]/15 text-[#d4af37] px-1.5 py-0.5 rounded-sm font-bold">02</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Debunk Common Misconceptions</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Test your understanding with the <strong>Interactive Mythbusters Panel</strong> below. Learn about your absolute rights to record public officers, challenge immediate seals, and reject warrantless searches.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-[#d4af37]/30 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[#d4af37]/15 text-[#d4af37] px-1.5 py-0.5 rounded-sm font-bold">03</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Reference Pins</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Filter, search, and click the <strong>Pin Icon</strong> on relevant statutes to anchor them directly to your personal workspace deck for instant quick-access during urgent roadside or municipal interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pinned Statutes Dashboard (Citizen's Quick-Access Hub) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 bg-[#001233]/85 border border-[#d4af37]/25 rounded-sm p-6 sm:p-8 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative scanner background line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 font-sans text-left">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
                  My Pinned Statutes Dashboard
                </h3>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider mt-1 uppercase">
                Synchronized Sovereign Quick-Reference Index
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/35 py-1 px-3 rounded-sm uppercase tracking-wider font-semibold">
                {pinnedStatutes.length} {pinnedStatutes.length === 1 ? "Statute" : "Statutes"} Secured
              </span>
              {pinnedStatutes.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your pinned statutes?")) {
                      setPinnedIds([]);
                    }
                  }}
                  className="px-2.5 py-1 bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500 rounded-sm text-[9.5px] font-mono uppercase text-red-400 tracking-wider transition-all cursor-pointer"
                >
                  Reset All Pins
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {pinnedStatutes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-dashed border-gray-700 rounded-sm p-8 text-center bg-black/30 flex flex-col items-center justify-center space-y-3 font-sans text-left"
              >
                <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-500">
                  <Pin className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-xs font-mono text-gray-300 font-semibold uppercase">Your reference dashboard is empty</p>
                  <p className="text-[11px] text-gray-500 font-sans max-w-md mx-auto leading-relaxed">
                    Scroll down to the <span className="text-[#d4af37] font-semibold">Sovereign Law & Article Reference Library</span>. Enter keywords or filter by legal categories, then click the pin icon on any article to lock it onto this dashboard.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {pinnedStatutes.map((statute) => (
                  <motion.div
                    key={statute.id}
                    layoutId={`pinned-card-${statute.id}`}
                    whileHover={{ 
                      y: -2,
                      borderColor: "rgba(212, 175, 55, 0.6)",
                      boxShadow: "0 4px 15px rgba(212, 175, 55, 0.08)"
                    }}
                    className="bg-black/60 p-4 border border-[#d4af37]/15 rounded-sm flex flex-col justify-between space-y-4 relative group text-left font-sans"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-[8px] font-mono bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-sm uppercase border border-[#d4af37]/20">
                          {statute.category}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleTogglePin(statute.id, e)}
                            className="p-1 rounded-sm text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Unpin statute"
                          >
                            <PinOff className="w-3.5 h-3.5 text-[#d4af37]" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-xs font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">
                        {statute.title}
                      </h4>
                      <p className="text-[9px] font-mono text-[#d4af37]/80 uppercase font-semibold">
                        {statute.citation}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-light line-clamp-2">
                        {statute.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-900 text-[10px]">
                      <button
                        onClick={() => setViewingStatute(statute)}
                        className="text-[#d4af37] hover:text-white font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> Read Full Statute
                      </button>
                      
                      <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                        ACTIVE REFERENCE
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tab-like basic laws panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Law List Sidebar - 4 cols */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-4 block font-bold">
              Core Legal Concepts
            </h4>
            {laws.map((law, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setActiveLawIndex(idx);
                  setIsEditingActiveLaw(false);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-sm border transition-all text-xs flex items-center justify-between group cursor-pointer ${
                  activeLawIndex === idx
                    ? "bg-[#d4af37]/15 border-[#d4af37] text-white"
                    : "bg-[#001233]/70 border-[#d4af37]/10 hover:border-[#d4af37]/30 text-gray-300"
                }`}
              >
                <div>
                  <p className={`font-serif font-semibold text-sm transition-colors ${
                    activeLawIndex === idx ? "text-[#d4af37]" : "group-hover:text-[#d4af37]"
                  }`}>
                    {law.title}
                  </p>
                  <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">{law.citation}</p>
                </div>
                <Scale className={`w-4 h-4 transition-transform duration-300 ${
                  activeLawIndex === idx ? "rotate-12 text-[#d4af37]" : "text-gray-500 group-hover:text-gray-300"
                }`} />
              </motion.button>
            ))}

            {isAdmin && onUpdateLaws && (
              <button
                onClick={() => {
                  const newLaw: LawCard = {
                    title: "New Constitutional Safeguard",
                    subtitle: "The Covenant of Due Process",
                    description: "Specify the exact statutory details or global human rights charter provisions protecting citizens during this administrative workflow...",
                    keyPoints: [
                      "Constitutional or statutory reference under active codes (BNSS/BN/RTI Act).",
                      "Procedural mandate required of public officials during executive checks.",
                      "Legal remedies, appeals, or petitions available to citizens against infraction."
                    ],
                    citation: "E.g., Art. 21, Constitution of India"
                  };
                  const updated = [...laws, newLaw];
                  onUpdateLaws(updated);
                  setActiveLawIndex(laws.length);
                  setIsEditingActiveLaw(true);
                }}
                className="w-full text-center py-3 bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#d4af37] text-[10px] uppercase font-mono font-bold rounded-sm border border-[#d4af37]/45 border-dashed transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-4"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Legal Safeguard Card
              </button>
            )}
          </div>

          {/* Active Law Description Display - 8 cols */}
          <div className="lg:col-span-8 bg-[#001233]/95 border border-[#d4af37]/20 p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[9px] font-mono font-bold text-gray-500 tracking-wider">
              SECTION DETAILED OUTLINE
            </div>

            <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] rounded-sm shrink-0">
                  <Scale className="w-6 h-6 rotate-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white">{laws[activeLawIndex]?.title || "Select Card"}</h3>
                  <p className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider">
                    {laws[activeLawIndex]?.citation} • {laws[activeLawIndex]?.subtitle}
                  </p>
                </div>
              </div>

              {isAdmin && onUpdateLaws && laws[activeLawIndex] && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsEditingActiveLaw(!isEditingActiveLaw)}
                    className="px-2.5 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/25 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#001a4d] text-[9.5px] font-mono uppercase font-bold transition-all cursor-pointer"
                  >
                    {isEditingActiveLaw ? "View Mode" : "Edit Card"}
                  </button>
                  {laws.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Do you want to permanently delete "${laws[activeLawIndex].title}"?`)) {
                          const updated = laws.filter((_, idx) => idx !== activeLawIndex);
                          onUpdateLaws(updated);
                          setActiveLawIndex(Math.max(0, activeLawIndex - 1));
                          setIsEditingActiveLaw(false);
                        }
                      }}
                      className="p-1.5 rounded-sm bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                      title="Delete this law card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeLawIndex + (isEditingActiveLaw ? "-edit" : "-view")}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {isEditingActiveLaw && isAdmin && onUpdateLaws && laws[activeLawIndex] ? (
                  <div className="space-y-4 bg-[#00173d] p-4 rounded-sm border border-[#d4af37]/20 font-sans">
                    <div>
                      <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Law Safeguard Title</label>
                      <input
                        type="text"
                        value={laws[activeLawIndex].title}
                        onChange={(e) => {
                          const next = [...laws];
                          next[activeLawIndex] = { ...next[activeLawIndex], title: e.target.value };
                          onUpdateLaws(next);
                        }}
                        className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5 font-semibold font-sans"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Subheading</label>
                        <input
                          type="text"
                          value={laws[activeLawIndex].subtitle}
                          onChange={(e) => {
                            const next = [...laws];
                            next[activeLawIndex] = { ...next[activeLawIndex], subtitle: e.target.value };
                            onUpdateLaws(next);
                          }}
                          className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Citation Reference</label>
                        <input
                          type="text"
                          value={laws[activeLawIndex].citation}
                          onChange={(e) => {
                            const next = [...laws];
                            next[activeLawIndex] = { ...next[activeLawIndex], citation: e.target.value };
                            onUpdateLaws(next);
                          }}
                          className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5 font-mono"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Full Description</label>
                      <textarea
                        value={laws[activeLawIndex].description}
                        onChange={(e) => {
                          const next = [...laws];
                          next[activeLawIndex] = { ...next[activeLawIndex], description: e.target.value };
                          onUpdateLaws(next);
                        }}
                        rows={4}
                        className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block">Checkpoints (One checklist-bullet point per line)</label>
                        <span className="text-[8px] text-gray-400 font-mono">Separate entries with enters</span>
                      </div>
                      <textarea
                        value={laws[activeLawIndex].keyPoints.join("\n")}
                        onChange={(e) => {
                          const next = [...laws];
                          next[activeLawIndex] = { ...next[activeLawIndex], keyPoints: e.target.value.split("\n").filter(Boolean) };
                          onUpdateLaws(next);
                        }}
                        rows={4}
                        className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed">
                      {laws[activeLawIndex]?.description}
                    </p>

                    <div className="border-t border-[#d4af37]/15 pt-5 space-y-3">
                      <p className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest font-bold">
                        Critical Compliance Checkpoints & Realities:
                      </p>
                      <ul className="space-y-2.5">
                        {laws[activeLawIndex]?.keyPoints.map((point, pIdx) => (
                          <motion.li 
                            key={pIdx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: pIdx * 0.08 }}
                            className="flex items-start gap-2.5 text-xs text-gray-300"
                          >
                            <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* SOVEREIGN LAW & ARTICLE REFERENCE LIBRARY */}
        <div className="mt-16 bg-[#001233]/70 border border-[#d4af37]/15 p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-base font-serif text-white uppercase tracking-wider font-semibold">
                  Sovereign Law & Article Reference Library
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans font-light mt-1">
                Enter queries or click categories below to retrieve legal statutes, due process guidelines, and self-representation acts.
              </p>
            </div>

            {isAdmin && onUpdateLibrary && (
              <button
                onClick={() => {
                  setNewStatuteForm({
                    title: "New Statute Reference Card",
                    citation: "Code/Act reference, e.g., Art. 19(1)(g)",
                    category: "Fundamental Rights",
                    description: "Describe the core constitutional protection or statutory mandate...",
                    keyPoints: ["Key compliance checkpoint or judicial standard"],
                    relevance: "Explain exactly how a citizen or advocate uses this protection in real-world scenarios."
                  });
                  setIsAddingStatute(true);
                  setEditingStatuteId(null);
                }}
                className="px-3.5 py-1.5 bg-[#d4af37] text-[#001a4d] text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#b08f25] cursor-pointer transition-colors flex items-center gap-1.5 shadow-md self-start md:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-[#001a4d]" /> Add Statute Card
              </button>
            )}
          </div>

          {/* Interactive Form for Adding / Editing Statutes */}
          {isAddingStatute && isAdmin && onUpdateLibrary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-[#00173d] p-5 rounded-sm border border-[#d4af37]/30 space-y-4 text-left font-sans"
            >
              <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-2">
                <h4 className="text-xs font-mono font-bold text-[#d4af37] uppercase">
                  {editingStatuteId ? "Edit Statute Entry" : "Create New Statute Card"}
                </h4>
                <button
                  onClick={() => setIsAddingStatute(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Statute / Article Title</label>
                  <input
                    type="text"
                    value={newStatuteForm.title}
                    onChange={(e) => setNewStatuteForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Citation Code</label>
                  <input
                    type="text"
                    value={newStatuteForm.citation}
                    onChange={(e) => setNewStatuteForm((prev) => ({ ...prev, citation: e.target.value }))}
                    className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Legal Category</label>
                  <select
                    value={newStatuteForm.category}
                    onChange={(e) => setNewStatuteForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#001a4d] text-xs text-[#d4af37] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5"
                  >
                    {categories.filter(c => c !== "All").map((cat) => (
                      <option key={cat} value={cat} className="bg-[#001233] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Defense Relevance Note</label>
                  <input
                    type="text"
                    value={newStatuteForm.relevance}
                    onChange={(e) => setNewStatuteForm((prev) => ({ ...prev, relevance: e.target.value }))}
                    placeholder="E.g., Prevents unauthorized phone inspection..."
                    className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Core Legal Description</label>
                <textarea
                  value={newStatuteForm.description}
                  onChange={(e) => setNewStatuteForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] font-mono uppercase text-[#d4af37] block">Statute Key Checkpoints</label>
                  <button
                    type="button"
                    onClick={handleAddKeyPointInput}
                    className="text-[9px] font-mono text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Checkpoint
                  </button>
                </div>
                {newStatuteForm.keyPoints.map((pt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => handleKeyPointChange(index, e.target.value)}
                      placeholder={`Checkpoint #${index + 1}`}
                      className="flex-1 bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2.5 py-1.5"
                    />
                    {newStatuteForm.keyPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyPointInput(index)}
                        className="p-1.5 bg-red-950/20 hover:bg-red-900 border border-red-500/10 rounded-sm text-red-400 hover:text-white cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsAddingStatute(false)}
                  className="px-4 py-2 border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white rounded-sm text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingStatuteId) {
                      // Save edited
                      const updatedLib = library.map((s) => 
                        s.id === editingStatuteId ? { ...s, ...newStatuteForm, keyPoints: newStatuteForm.keyPoints.filter(Boolean) } : s
                      );
                      onUpdateLibrary(updatedLib);
                      setIsAddingStatute(false);
                      setEditingStatuteId(null);
                    } else {
                      handleSaveNewStatute();
                    }
                  }}
                  className="px-4 py-2 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold rounded-sm text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer shadow-md"
                >
                  {editingStatuteId ? "Apply Edits" : "Deploy Card"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Search, Filter Tag Pill Rails */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/80" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search legal articles (e.g., 'Article 21', 'arrest', 'privacy', 'property')..."
                className="w-full bg-[#001233]/90 text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm pl-11 pr-4 py-3 font-sans transition-all placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#d4af37] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Responsive Category Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#d4af37]" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#d4af37] text-[#001a4d] border-[#d4af37] font-semibold"
                      : "bg-[#001233]/40 border-gray-800 text-gray-400 hover:border-[#d4af37]/40 hover:text-[#d4af37]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Statutes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <AnimatePresence mode="popLayout">
              {filteredStatutes.map((statute, idx) => {
                const isPinned = pinnedIds.includes(statute.id);
                return (
                  <motion.div
                    key={statute.id}
                    layoutId={`library-card-${statute.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                    className="bg-black/45 border border-gray-850 hover:border-[#d4af37]/35 rounded-sm p-5 flex flex-col justify-between space-y-4 group transition-colors relative"
                  >
                    <div className="space-y-2 text-left font-sans">
                      <div className="flex items-start justify-between">
                        <span className="text-[8px] font-mono bg-[#d4af37]/5 text-[#d4af37] px-2 py-0.5 rounded-sm uppercase border border-[#d4af37]/20 font-semibold tracking-wider">
                          {statute.category}
                        </span>

                        <div className="flex items-center gap-2">
                          {isAdmin && onUpdateLibrary && (
                            <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-mono">
                              <button
                                onClick={() => {
                                  setNewStatuteForm({
                                    title: statute.title,
                                    citation: statute.citation,
                                    category: statute.category,
                                    description: statute.description,
                                    keyPoints: statute.keyPoints,
                                    relevance: statute.relevance
                                  });
                                  setEditingStatuteId(statute.id);
                                  setIsAddingStatute(true);
                                }}
                                className="hover:text-[#d4af37] transition-colors cursor-pointer uppercase font-bold"
                              >
                                Edit
                              </button>
                              <span>|</span>
                              <button
                                onClick={() => handleDeleteStatute(statute.id, statute.title)}
                                className="hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <button
                            onClick={(e) => handleTogglePin(statute.id, e)}
                            className={`p-1.5 rounded-sm border transition-all cursor-pointer ${
                              isPinned
                                ? "bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.25)]"
                                : "bg-black/40 border-gray-800 text-gray-500 hover:text-[#d4af37] hover:border-[#d4af37]/40"
                            }`}
                            title={isPinned ? "Unpin from Dashboard" : "Pin to Dashboard"}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors">
                        {statute.title}
                      </h4>
                      <p className="text-[10px] font-mono text-[#d4af37] uppercase font-semibold">
                        {statute.citation}
                      </p>
                      <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                        {statute.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-900 flex items-center justify-between font-sans">
                      <button
                        onClick={() => setViewingStatute(statute)}
                        className="text-xs text-[#d4af37] hover:text-white font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Safeguards & Relevance
                      </button>

                      <span className="text-[9px] text-gray-600 font-mono">
                        {isPinned ? "📌 PINNED" : "UNPINNED"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredStatutes.length === 0 && (
              <div className="md:col-span-2 border border-dashed border-gray-800 rounded-sm p-12 text-center bg-black/20 text-gray-500">
                <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-xs font-mono uppercase font-bold text-gray-400">No matching statutes found</p>
                <p className="text-[11px] text-gray-500 font-sans mt-1">
                  Try clearing your search keyword or selecting a different reference category pill above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DETAILED STATUTE MODAL OVERLAY */}
        <AnimatePresence>
          {viewingStatute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
              onClick={() => setViewingStatute(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="w-full max-w-2xl bg-[#001233] border-2 border-[#d4af37]/80 rounded-sm p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] space-y-6 relative max-h-[90vh] overflow-y-auto text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setViewingStatute(null)}
                  className="absolute top-4 right-4 p-1 rounded-sm text-gray-400 hover:text-white border border-transparent hover:border-gray-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header details */}
                <div className="space-y-1.5 border-b border-[#d4af37]/25 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-sm uppercase border border-[#d4af37]/20 font-semibold">
                      {viewingStatute.category}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono uppercase">
                      Official Archive Log
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white pr-6">
                    {viewingStatute.title}
                  </h3>
                  <p className="text-xs font-mono text-[#d4af37] uppercase tracking-wider font-semibold">
                    {viewingStatute.citation}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest font-bold">
                    Statutory Codification / Text:
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed">
                    {viewingStatute.description}
                  </p>
                </div>

                {/* Key Points Checkpoints */}
                {viewingStatute.keyPoints && viewingStatute.keyPoints.length > 0 && (
                  <div className="space-y-3 bg-black/40 border border-gray-900 p-4 rounded-sm">
                    <h5 className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest font-bold">
                      Critical Procedural Safeguards:
                    </h5>
                    <ul className="space-y-2.5">
                      {viewingStatute.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed font-sans">
                          <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Strategic Relevance */}
                {viewingStatute.relevance && (
                  <div className="space-y-2 bg-[#d4af37]/5 border border-[#d4af37]/20 p-4 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Scale className="w-16 h-16 text-[#d4af37]" />
                    </div>
                    <h5 className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Citizen Strategic Leverage:
                    </h5>
                    <p className="text-xs text-gray-300 font-sans leading-relaxed italic">
                      "{viewingStatute.relevance}"
                    </p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-900">
                  <button
                    onClick={() => handleTogglePin(viewingStatute.id)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      pinnedIds.includes(viewingStatute.id)
                        ? "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]"
                        : "bg-transparent border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]"
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    {pinnedIds.includes(viewingStatute.id) ? "Unpin from Dashboard" : "Pin to Dashboard"}
                  </button>

                  <button
                    onClick={() => setViewingStatute(null)}
                    className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b59526] text-[#001233] font-mono font-bold text-xs tracking-wider uppercase rounded-sm cursor-pointer shadow-md text-center"
                  >
                    Close Archives
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Legal Mythbuster Panel */}
        <div className="mt-16 bg-[#001233]/70 border border-[#d4af37]/15 p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#d4af37]" />
              <h4 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                Campaign Citizen Mythbuster
              </h4>
            </div>

            {isAdmin && onUpdateMyths && (
              <button
                onClick={() => {
                  const newMyth: CivicMisconception = {
                    question: "Is there any statutory protection regarding...",
                    myth: "MYTH: Officers claim standard procedures allow them to bypass warning requirements completely.",
                    answerOnTrue: "No. Formal guidelines demand absolute procedural compliance and explicitly protect your civil liberties."
                  };
                  const updated = [...myths, newMyth];
                  onUpdateMyths(updated);
                  setEditingMythIndex(myths.length);
                }}
                className="px-3 py-1.5 rounded-sm bg-[#d4af37] text-[#001a4d] text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#b08f25] cursor-pointer transition-colors flex items-center gap-1 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 text-[#001a4d]" /> Add Mythbuster Card
              </button>
            )}
          </div>
          <p className="text-xs text-gray-300 font-sans font-light">
            Test your legal literacy bounds below by reviewing common legal interactions. Click any myth cards below to reveal verified legal explanations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {myths.map((myth, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4, scale: 1.01, boxShadow: "0 15px 30px -10px rgba(212,175,55,0.08)" }}
                className="bg-[#001a4d]/90 border border-[#d4af37]/15 p-5 rounded-sm hover:border-[#d4af37]/40 transition-colors flex flex-col justify-between"
              >
                {editingMythIndex === idx && isAdmin && onUpdateMyths ? (
                  <div className="space-y-3 bg-[#001233] p-3 rounded-sm border border-[#d4af37]/25 mt-1 animate-in fade-in duration-200 text-left">
                    <div>
                      <label className="text-[9px] font-mono uppercase text-[#d4af37] block mb-0.5">Mythbuster Question</label>
                      <textarea
                        value={myth.question}
                        onChange={(e) => {
                          const next = [...myths];
                          next[idx] = { ...next[idx], question: e.target.value };
                          onUpdateMyths(next);
                        }}
                        rows={2}
                        className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2 py-1 font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-[#d4af37] block mb-0.5">Misconception Text</label>
                      <textarea
                        value={myth.myth}
                        onChange={(e) => {
                          const next = [...myths];
                          next[idx] = { ...next[idx], myth: e.target.value };
                          onUpdateMyths(next);
                        }}
                        rows={2}
                        className="w-full bg-[#001a4d] text-[11px] text-gray-300 border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2 py-1 font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-[#d4af37] block mb-0.5">Legal Reality / Answer</label>
                      <textarea
                        value={myth.answerOnTrue}
                        onChange={(e) => {
                          const next = [...myths];
                          next[idx] = { ...next[idx], answerOnTrue: e.target.value };
                          onUpdateMyths(next);
                        }}
                        rows={3}
                        className="w-full bg-[#001a4d] text-xs text-white border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none rounded-sm px-2 py-1 font-sans"
                      />
                    </div>
                    <button
                      onClick={() => setEditingMythIndex(null)}
                      className="w-full py-1.5 bg-[#d4af37] hover:bg-[#b08f25] text-[#001a4d] text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors text-center"
                    >
                      Save & Complete
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 relative group text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/20 border border-red-500/10 py-0.5 px-2 rounded-sm inline-block uppercase">
                          Misconception {idx + 1}
                        </span>
                        
                        {isAdmin && onUpdateMyths && (
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <button
                              onClick={() => {
                                setEditingMythIndex(idx);
                              }}
                              className="font-mono text-gray-400 hover:text-[#d4af37] transition-colors cursor-pointer"
                              title="Edit Mythbuster details"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Permanently remove Misconception #${idx+1}?`)) {
                                  onUpdateMyths(myths.filter((_, mIdx) => mIdx !== idx));
                                }
                              }}
                              className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer transition-colors"
                              title="Delete this misconception"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-serif font-semibold text-white leading-relaxed">
                        {myth.question}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400 italic">
                        {myth.myth}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#d4af37]/10 mt-4">
                      <AnimatePresence mode="wait">
                        {revealedQuiz[idx] ? (
                          <motion.div 
                            key="answer"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-gray-300 leading-relaxed font-sans space-y-1 bg-[#d4af37]/5 p-2.5 rounded-sm border border-[#d4af37]/15 text-left"
                          >
                            <p className="font-mono text-[9px] text-[#d4af37] font-bold uppercase">VERIFIED LAW STATUS :</p>
                            <p>{myth.answerOnTrue}</p>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="reveal-btn"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setRevealedQuiz(p => ({ ...p, [idx]: true }));
                              try {
                                window.dispatchEvent(new CustomEvent("unlock-achievement", {
                                  detail: {
                                    id: "myth-busted",
                                    title: "Legal Myth Busted",
                                    description: "You exposed a common administrative misconception and unlocked the statutory truth.",
                                    category: "myth"
                                  }
                                }));
                              } catch (e) {}
                            }}
                            className="w-full text-center py-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 text-[#d4af37] text-[10px] uppercase font-mono font-bold rounded-sm border border-[#d4af37]/20 transition-all cursor-pointer"
                          >
                            Expose Legal Reality
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
}
