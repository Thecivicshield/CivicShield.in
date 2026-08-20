import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Video, 
  Table, 
  Eye, 
  Download, 
  Users, 
  Trash2, 
  Calendar, 
  FileCheck, 
  Search, 
  Database, 
  ExternalLink, 
  X,
  Scale,
  Shield,
  ShieldAlert,
  Smartphone,
  Landmark,
  FileSpreadsheet,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  HelpCircle,
  Clock,
  Key,
  Lock,
  Unlock,
  Radio,
  Plus,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EvidenceItem } from "../types";
import SocialShare from "./SocialShare";
import HolographicVerifiedBadge from "./HolographicVerifiedBadge";
import EvidenceDetailsModal from "./EvidenceDetailsModal";
import { playSynthSound } from "./JusticeShieldSection";

// Pre-seeded verified legal rights for immediate instant lookup
export interface ConstitutionalRightDossier {
  id: string;
  category: "police" | "privacy" | "arrest" | "property" | "rti" | "court" | "women";
  categoryLabel: string;
  title: string;
  statute: string;
  landmarkCase: string;
  summary: string;
  dialogueScript: string;
  proceduralSteps: string[];
  keySafeguard: string;
}

export const INSTANT_RIGHTS_REGISTRY: ConstitutionalRightDossier[] = [
  {
    id: "right-police-stop",
    category: "police",
    categoryLabel: "Traffic & Roadside Stops",
    title: "Right to Police Identification & Reason for Stop",
    statute: "Section 130, Motor Vehicles Act, 1988 / Police Act Regulations",
    landmarkCase: "D.K. Basu v. State of West Bengal (1997) 1 SCC 416",
    summary: "An officer stopping you must display a clear name tag with designation and state the specific legal infraction or purpose of the stop. You have the right to politely inspect their identification before answering questions.",
    dialogueScript: "“Officer, I respect your duty and intend to cooperate fully. May I respectfully note your name and badge number before we proceed with the inspection?”",
    proceduralSteps: [
      "Keep hands visible on the steering wheel and remain calm and courteous.",
      "You are required to produce driving license, registration, insurance, and PUC certificate on demand.",
      "Under DigiLocker / mParivahan rules (Rule 139 MVA), digitally verified documents stored on government apps are legally equivalent to physical documents."
    ],
    keySafeguard: "Officers below Sub-Inspector rank cannot confiscate original licenses for minor traffic offenses."
  },
  {
    id: "right-digital-privacy",
    category: "privacy",
    categoryLabel: "Digital & Device Privacy",
    title: "Immunity Against Forced Smartphone & Passcode Seizure",
    statute: "Article 20(3) (Self-Incrimination) & Article 21 (Right to Privacy)",
    landmarkCase: "Justice K.S. Puttaswamy (Retd.) v. Union of India (2017) 10 SCC 1",
    summary: "Your mobile device contains protected biometric, personal, and confidential records. Police officers cannot arbitrarily demand your passcode, pattern, or browse your private WhatsApp chats without a formal judicial search warrant.",
    dialogueScript: "“Officer, under Article 20(3) of the Constitution and the Puttaswamy privacy judgment, I am not obliged to disclose my personal passcode without a specific judicial warrant or formal seizure panchnama.”",
    proceduralSteps: [
      "Never physically resist, but clearly register oral and written non-consent to arbitrary searches.",
      "If a device is formally seized under Sec 102 CrPC / Sec 107 BNSS, demand an immediate written Seizure Memo (Panchnama).",
      "Ensure the Seizure Memo records the exact IMEI number, device serial number, and SHA-256 hash to prevent post-seizure data planting."
    ],
    keySafeguard: "Routine traffic stops or beat patrols possess zero legal authority to conduct digital phone inspections."
  },
  {
    id: "right-24hr-magistrate",
    category: "arrest",
    categoryLabel: "Arrest & Custodial Guard",
    title: "Mandatory 24-Hour Presentation Before Judicial Magistrate",
    statute: "Article 22(2), Constitution of India / Section 57 CrPC (Sec 56 BNSS 2024)",
    landmarkCase: "Manoj v. State of MP (2023) / D.K. Basu Guidelines",
    summary: "No person arrested by any law enforcement agency can be detained in custody for more than 24 hours without being produced directly before the nearest Judicial Magistrate. Detention beyond 24 hours without a magistrate's remand order is unconstitutional and constitutes illegal detention.",
    dialogueScript: "“Under Article 22(2) of the Indian Constitution, my custody is bounded by a strict 24-hour limit. I formally request intimation to my family and immediate production before the jurisdictional Magistrate.”",
    proceduralSteps: [
      "Police must inform a chosen family member or friend immediately upon arrest (D.K. Basu Guideline 2).",
      "Mandatory medical examination by an independent government doctor must be conducted at the time of arrest and every 48 hours.",
      "You have the absolute right to meet your legal counsel during interrogation, though not throughout the entire interrogation."
    ],
    keySafeguard: "The 24-hour presentation clock starts the exact minute you are detained, not when the formal FIR is registered."
  },
  {
    id: "right-demolition-injunction",
    category: "property",
    categoryLabel: "Property & Municipal Defense",
    title: "Protection Against Arbitrary Demolition & Natural Justice Rule",
    statute: "Article 300A, Constitution of India / Principles of Natural Justice",
    landmarkCase: "Olga Tellis v. BMC (1985) / Supreme Court Demolition Guidelines (2024)",
    summary: "No municipal corporation, development authority, or administrative body can demolish residential or commercial structures without issuing a mandatory 15-day show-cause notice and providing a fair personal hearing (Audi Alteram Partem).",
    dialogueScript: "“Under the Supreme Court's binding demolition directives and Article 300A, no punitive action can proceed without a 15-day statutory show-cause notice and a formal speaking order addressing our written reply.”",
    proceduralSteps: [
      "Upon receiving any notice, immediately prepare a dated written objection referencing your sanction plans, tax receipts, and electricity bills.",
      "File your reply with the Municipal Commissioner via Registered Post A.D. and hand delivery with an acknowledged receiving stamp.",
      "If demolition is threatened without due process, approach the District Civil Court or High Court under Article 226 for an ad-interim stay."
    ],
    keySafeguard: "Demolition cannot be executed within 15 days of the speaking order, allowing the citizen reasonable time to seek judicial remedy."
  },
  {
    id: "right-party-in-person",
    category: "court",
    categoryLabel: "Self-Advocacy in Courts",
    title: "Sovereign Right to Self-Representation (Party-in-Person)",
    statute: "Section 32, Advocates Act, 1961 / Order IV, Supreme Court Rules 2013",
    landmarkCase: "T.C. Mathai v. District & Sessions Judge (1999) 3 SCC 614",
    summary: "Citizens are not legally required to hire costly private advocates. Under Section 32 of the Advocates Act, any court or tribunal has statutory discretion to allow a non-advocate to draft, file, and argue their own case with full legal standing.",
    dialogueScript: "“Your Honor, I appear respectfully as a Party-in-Person under Section 32 of the Advocates Act, 1961. I have complied with court registry formats and pray for permission to state my case.”",
    proceduralSteps: [
      "Format your petition with standard margins, index, synopsis, verified affidavit, and court fees.",
      "Submit your papers to the High Court / District Court Filing Counter with a Party-in-Person verification form.",
      "Address the bench with standard judicial decorum: present facts chronologically and highlight the specific statutory violations."
    ],
    keySafeguard: "Courts have an affirmative duty to assist unrepresented litigants in understanding procedural compliance."
  },
  {
    id: "right-women-safeguards",
    category: "women",
    categoryLabel: "Women & Vulnerable Citizens",
    title: "Sunset-to-Sunrise Arrest Ban & Female Officer Mandate",
    statute: "Section 46(4), Code of Criminal Procedure / Section 43(5) BNSS 2024",
    landmarkCase: "State of Maharashtra v. Christian Community Welfare Council (2003)",
    summary: "Except in extraordinary circumstances with prior written permission from a Judicial Magistrate First Class, no woman can be arrested after sunset and before sunrise. All body searches and arrests of female citizens must be conducted strictly by female police officers with absolute decency.",
    dialogueScript: "“Under Section 46(4) of the CrPC, arrest of a female citizen after sunset without prior judicial magistrate authorization is unlawful. Any inquiry must be conducted by female officers at my residence.”",
    proceduralSteps: [
      "Under Section 160 CrPC, women and children under 15 cannot be summoned to police stations for questioning—inquiries must take place at their residence.",
      "Female arrestees must be housed in dedicated female custodial cells with separate sanitary facilities.",
      "Free medical check-ups must be conducted exclusively by female registered medical practitioners."
    ],
    keySafeguard: "Male police personnel are strictly prohibited from physically touching or searching a female citizen."
  },
  {
    id: "right-rti-audit",
    category: "rti",
    categoryLabel: "RTI & Public Audit",
    title: "Right to Information & Mandatory 30-Day Public Disclosure",
    statute: "Section 6 & Section 4(1)(b), Right to Information Act, 2005",
    landmarkCase: "CBSE v. Aditya Bandopadhyay (2011) 8 SCC 497",
    summary: "Citizens hold the statutory authority to inspect public records, municipal expenditure logs, tender allocations, and official notes. Public Information Officers (PIOs) must provide certified copies within 30 days, or within 48 hours if concerning life and liberty.",
    dialogueScript: "“This application is submitted under Section 6 of the RTI Act, 2005. Under Section 7(1), the PIO is mandated to provide certified records within 30 days without inquiring into my personal reasons for requesting public records.”",
    proceduralSteps: [
      "Draft concise, numbered questions requesting specific documents rather than hypothetical legal opinions.",
      "Attach the nominal statutory fee (₹10 postal order, court fee stamp, or online payment).",
      "If no response is received within 30 days, file a First Appeal under Section 19(1) before the designated First Appellate Authority."
    ],
    keySafeguard: "Under Section 20(1), PIOs who delay or obstruct information face personal penalties of ₹250 per day up to ₹25,000."
  },
  {
    id: "right-arnesh-kumar-bail",
    category: "arrest",
    categoryLabel: "Arrest & Custodial Guard",
    title: "Mandatory Notice Prior to Arrest for Offenses Under 7 Years",
    statute: "Section 41A, Code of Criminal Procedure / Section 35(3) BNSS 2024",
    landmarkCase: "Arnesh Kumar v. State of Bihar (2014) 8 SCC 273",
    summary: "For alleged offenses punishable with imprisonment up to 7 years, police cannot arrest an individual routinely. Instead, they must issue a Section 41A Notice of Appearance directing the citizen to cooperate with the inquiry.",
    dialogueScript: "“As established in Arnesh Kumar v. State of Bihar, arrest in offenses punishable under 7 years is an exception. I am ready to accept a Section 41A notice and cooperate fully with lawful inquiries.”",
    proceduralSteps: [
      "Request a written Section 41A notice with a reasonable date, time, and venue for appearance.",
      "Attend the inquiry accompanied by a legal adviser or representative.",
      "Police officers who effect mechanical arrests violating Arnesh Kumar directions face departmental action and contempt of court."
    ],
    keySafeguard: "Arrest without satisfying the specific conditions in Sec 41(1)(b) CrPC is illegal and entitles the citizen to bail."
  }
];

interface EvidenceSectionProps {
  key?: string;
  evidence: EvidenceItem[];
  isAdmin: boolean;
  onDeleteEvidence: (id: string) => Promise<void>;
  accentColor: string;
}

export default function EvidenceSection({ evidence, isAdmin, onDeleteEvidence, accentColor }: EvidenceSectionProps) {
  // Vault Chambers: "matrix" (Instant Rights Matrix) vs "locker" (Evidence Files) vs "scenarios" (Emergency Tactical Action)
  const [activeChamber, setActiveChamber] = useState<'matrix' | 'locker' | 'scenarios'>('matrix');
  
  // Rights Filters
  const [rightsCategory, setRightsCategory] = useState<string>('all');
  const [rightsSearch, setRightsSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRightId, setExpandedRightId] = useState<string | null>("right-police-stop");

  // Document Locker Filters
  const [activeDocFilter, setActiveDocFilter] = useState<'all' | 'pdf' | 'video' | 'spreadsheet'>('all');
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<EvidenceItem | null>(null);

  // Selected Emergency Scenario
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  // Vault Wheel Rotation Angle (aesthetic mechanical visual)
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  const handleSwitchChamber = (chamber: 'matrix' | 'locker' | 'scenarios') => {
    try {
      playSynthSound("click");
    } catch (e) {}
    setActiveChamber(chamber);
    setWheelRotation(prev => prev + 120);
  };

  // Filtered Rights - instant calculation
  const filteredRights = useMemo(() => {
    return INSTANT_RIGHTS_REGISTRY.filter(r => {
      const matchesCategory = rightsCategory === 'all' || r.category === rightsCategory;
      const q = rightsSearch.toLowerCase().trim();
      const matchesSearch = !q || 
        r.title.toLowerCase().includes(q) || 
        r.statute.toLowerCase().includes(q) || 
        r.summary.toLowerCase().includes(q) ||
        r.landmarkCase.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [rightsCategory, rightsSearch]);

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return evidence.filter(item => {
      const matchesFilter = activeDocFilter === 'all' || item.type === activeDocFilter;
      const q = docSearchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (item.title || "").toLowerCase().includes(q) || 
        (item.description || "").toLowerCase().includes(q) ||
        (item.fileName || "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [evidence, activeDocFilter, docSearchQuery]);

  const handleCopyScript = (scriptText: string, id: string) => {
    try {
      navigator.clipboard.writeText(scriptText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.warn("Clipboard copy fallback:", e);
    }
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-[#ffd754]" />;
      case 'spreadsheet':
        return <Table className="w-5 h-5 text-[#ffd754]" />;
      default:
        return <FileText className="w-5 h-5 text-[#ffd754]" />;
    }
  };

  const EMERGENCY_SCENARIOS = [
    {
      title: "Vehicle Stopped at Checkpoint",
      badge: "Roadside Protocol",
      icon: ShieldAlert,
      threat: "Officer demanding keys, vehicle seizure, or imposing arbitrary fines.",
      steps: [
        "Step 1: Roll window down 3 inches, greet politely, and ask: 'Officer, may I respectfully note your name and police station before we begin?'",
        "Step 2: Present your digital documents via DigiLocker / mParivahan on your phone screen without handing over unlocked device.",
        "Step 3: If a fine is alleged, request an official e-challan or printed compounding receipt. Under no circumstances pay cash without a stamped receipt."
      ],
      legalWeapon: "Rule 139 Central Motor Vehicles Rules / Sec 130 Motor Vehicles Act"
    },
    {
      title: "Officer Demands Phone Unlock & WhatsApp Search",
      badge: "Digital Privacy",
      icon: Smartphone,
      threat: "Illegal browsing of personal galleries, chats, banking apps, and private messages.",
      steps: [
        "Step 1: Do not panic. State clearly: 'Officer, my phone contains private and personal data protected under Article 20(3) and the Puttaswamy Supreme Court ruling.'",
        "Step 2: Ask: 'Do you have a judicial search warrant from a Magistrate authorized to search this device?'",
        "Step 3: If forcefully seized under Sec 102 CrPC, demand a formal written Seizure Memo (Panchnama) signed by independent witnesses on the spot."
      ],
      legalWeapon: "Justice K.S. Puttaswamy (Retd.) v. Union of India / Article 20(3)"
    },
    {
      title: "Demolition Notice or Municipal Inspection",
      badge: "Property Defense",
      icon: Landmark,
      threat: "Unscheduled demolition warnings, property sealing, or municipal eviction threats.",
      steps: [
        "Step 1: Demand the certified copy of the 15-day Show-Cause Notice in writing. Verbal orders or 24-hour warnings are illegal.",
        "Step 2: Immediately compile your property title deed, tax receipts, sanctioned building plan, and electricity bills.",
        "Step 3: File a formal written reply via Registered Post A.D. and approach the Civil Court or High Court for an immediate stay injunction."
      ],
      legalWeapon: "Supreme Court Demolition Directives (2024) / Article 300A"
    },
    {
      title: "Public Office Refuses RTI Application",
      badge: "Transparency Inquest",
      icon: FileSpreadsheet,
      threat: "Public Information Officer (PIO) refusing to accept application or stonewalling queries.",
      steps: [
        "Step 1: Dispatch your RTI application via Registered Post A.D. or speed post with a ₹10 Indian Postal Order—the post office serves as legal proof of delivery.",
        "Step 2: Start a 30-day countdown timer from the date the postal tracking shows delivery.",
        "Step 3: On day 31, file a First Appeal directly to the First Appellate Authority seeking penal proceedings under Section 20(1) of the RTI Act."
      ],
      legalWeapon: "Section 6 & Section 20, Right to Information Act, 2005"
    }
  ];

  return (
    <section 
      id="evidence" 
      className="py-20 relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* HEXAGONAL CYBER-ARMORED VAULT CHASSIS CONTAINER                           */}
        {/* ========================================================================= */}
        <div 
          className="relative bg-gradient-to-b from-[#020a17] via-[#051124] to-[#01060e] border-2 border-[#d4af37]/60 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.25)] p-5 sm:p-8 md:p-10 text-white"
          style={{
            clipPath: "polygon(28px 0%, calc(100% - 28px) 0%, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0% calc(100% - 28px), 0% 28px)"
          }}
        >
          {/* Top Brass Bolts & Rivet Details on Cut Corners */}
          <div className="absolute top-3 left-4 w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-[#fff3b0] shadow-[0_0_8px_#ffd754]" />
          <div className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-[#fff3b0] shadow-[0_0_8px_#ffd754]" />
          <div className="absolute bottom-3 left-4 w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-[#fff3b0] shadow-[0_0_8px_#ffd754]" />
          <div className="absolute bottom-3 right-4 w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-[#fff3b0] shadow-[0_0_8px_#ffd754]" />

          {/* VAULT CENTRAL SECURITY DIAL & CHAMBER SWITCHER */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 mb-10 border-b border-[#d4af37]/30">
            
            {/* Left: Vault Identity */}
            <div className="text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd754] text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-sm">
                <Shield className="w-3.5 h-3.5" />
                <span>HEXAGONAL ARMAMENT // CIVIC VAULT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-white">
                Sovereign <span className="text-[#ffd754] font-semibold italic">Defense Matrix</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-light leading-relaxed">
                Tested courtroom filing templates, unsealed police conduct statutes, and instant emergency verbal scripts formatted for immediate retrieval.
              </p>
            </div>

            {/* Center: Rotary Mechanical Wheel Visual */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={{ type: "spring", stiffness: 90, damping: 15 }}
                className="w-20 h-20 rounded-full border-4 border-dashed border-[#d4af37] bg-[#001026] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#ffd754] to-[#b38827] flex items-center justify-center shadow-inner">
                  <Key className="w-5 h-5 text-[#001a4d]" />
                </div>
              </motion.div>
              <div className="absolute -bottom-5 text-[9px] font-mono text-[#ffd754] tracking-widest uppercase font-bold whitespace-nowrap">
                ROTARY SEAL // UNLOCKED
              </div>
            </div>

            {/* Right: 3 Chamber Selector Terminals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 w-full lg:w-72">
              <button
                type="button"
                onClick={() => handleSwitchChamber('matrix')}
                className={`px-4 py-2.5 rounded text-left transition-all cursor-pointer border flex items-center justify-between ${
                  activeChamber === 'matrix'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#ffd754] text-[#001233] border-[#fff3b0] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#000a17] border-slate-800 text-gray-300 hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">Chamber I: Rights Matrix</span>
                </div>
                <span className="text-[10px] font-mono opacity-80 font-black">01</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchChamber('locker')}
                className={`px-4 py-2.5 rounded text-left transition-all cursor-pointer border flex items-center justify-between ${
                  activeChamber === 'locker'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#ffd754] text-[#001233] border-[#fff3b0] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#000a17] border-slate-800 text-gray-300 hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">Chamber II: File Locker</span>
                </div>
                <span className="text-[10px] font-mono opacity-80 font-black">02</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchChamber('scenarios')}
                className={`px-4 py-2.5 rounded text-left transition-all cursor-pointer border flex items-center justify-between ${
                  activeChamber === 'scenarios'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#ffd754] text-[#001233] border-[#fff3b0] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#000a17] border-slate-800 text-gray-300 hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">Chamber III: Scenarios</span>
                </div>
                <span className="text-[10px] font-mono opacity-80 font-black">03</span>
              </button>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* CHAMBER I: INSTANT RIGHTS MATRIX                                          */}
          {/* ========================================================================= */}
          {activeChamber === 'matrix' && (
            <div className="space-y-6">
              
              {/* Category Filter & Search Ribbon */}
              <div className="bg-[#000d20] p-4 rounded border border-[#d4af37]/30 shadow-inner flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Rights' },
                    { id: 'police', label: 'Traffic & Police' },
                    { id: 'privacy', label: 'Digital Privacy' },
                    { id: 'arrest', label: 'Arrest & Bail' },
                    { id: 'property', label: 'Property & Demolition' },
                    { id: 'court', label: 'Court Pro-Se' },
                    { id: 'women', label: 'Women Safeguards' },
                    { id: 'rti', label: 'RTI Audits' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setRightsCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        rightsCategory === cat.id
                          ? 'bg-[#d4af37] text-[#001233] font-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                          : 'bg-[#001738] text-gray-300 hover:text-white hover:bg-[#002456] border border-[#d4af37]/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={rightsSearch}
                    onChange={(e) => setRightsSearch(e.target.value)}
                    placeholder="Search statutes, rulings, keywords..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded border border-[#d4af37]/35 bg-[#00122e] text-white placeholder-gray-400 focus:outline-none focus:border-[#ffd754]"
                  />
                  <Search className="w-4 h-4 text-[#ffd754] absolute left-3 top-2.5 pointer-events-none" />
                  {rightsSearch && (
                    <button
                      onClick={() => setRightsSearch('')}
                      className="absolute right-2.5 top-2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Instant Counter */}
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
                <span>ACTIVE RECORD NODES: <span className="text-[#ffd754] font-bold">{filteredRights.length}</span> CONSTITUTIONAL DOSSIERS</span>
                <span className="text-[#ffd754] flex items-center gap-1"><Sparkles className="w-3 h-3" /> Zero Latency Statutory Engine</span>
              </div>

              {/* Rights Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredRights.map((right) => {
                  const isExpanded = expandedRightId === right.id;
                  const isCopied = copiedId === right.id;

                  return (
                    <div
                      key={right.id}
                      className={`bg-gradient-to-b from-[#001538] via-[#000e26] to-[#000817] rounded border transition-all p-5 flex flex-col justify-between ${
                        isExpanded
                          ? "border-[#ffd754] shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.2)]"
                          : "border-slate-800 hover:border-[#d4af37]/60"
                      }`}
                    >
                      <div className="space-y-3.5">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/15 pb-2.5">
                          <span className="px-2.5 py-0.5 rounded bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#ffd754] text-[9.5px] font-mono uppercase tracking-widest font-bold">
                            {right.categoryLabel}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {right.statute.split('/')[0]}
                          </span>
                        </div>

                        {/* Title & Case */}
                        <div>
                          <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                            {right.title}
                          </h3>
                          <p className="text-[11px] font-mono text-[#ffd754] mt-1 flex items-center gap-1">
                            <Scale className="w-3.5 h-3.5 shrink-0" />
                            <span>{right.landmarkCase}</span>
                          </p>
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-gray-300 font-light leading-relaxed">
                          {right.summary}
                        </p>

                        {/* Practical Dialogue Script (What to say) */}
                        <div className="bg-[#000a1a] rounded p-3 border border-[#d4af37]/30 relative group">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9.5px] font-mono font-bold text-[#ffd754] uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Exact Verbal Script:
                            </span>
                            <button
                              onClick={() => handleCopyScript(right.dialogueScript, right.id)}
                              className="text-[10px] font-mono text-gray-300 hover:text-white bg-black/60 hover:bg-[#d4af37]/30 px-2 py-0.5 rounded border border-[#d4af37]/25 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? "Copied" : "Copy Script"}</span>
                            </button>
                          </div>
                          <p className="text-xs text-[#ffd754] font-serif italic leading-relaxed">
                            {right.dialogueScript}
                          </p>
                        </div>

                        {/* Expandable Procedural Rules */}
                        {isExpanded && (
                          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs text-gray-300">
                            <div>
                              <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                                Mandatory Procedural Steps:
                              </span>
                              <ul className="space-y-1.5">
                                {right.proceduralSteps.map((step, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="font-light">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-[#001c45]/70 p-2.5 rounded border-l-2 border-[#ffd754] text-[11px]">
                              <span className="font-mono text-[9px] text-[#ffd754] uppercase tracking-wider font-bold block">
                                Key Statutory Shield:
                              </span>
                              <span className="text-white font-medium">{right.keySafeguard}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3.5 mt-3.5 border-t border-[#d4af37]/15 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedRightId(isExpanded ? null : right.id)}
                          className="text-xs font-mono text-[#ffd754] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? "Collapse Protocol" : "View Full Protocol & Steps"}</span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>

                        <button
                          onClick={() => {
                            try {
                              const blob = new Blob([
                                `CIVIC SHIELD RIGHT DOSSIER: ${right.title}\n` +
                                `CATEGORY: ${right.categoryLabel}\n` +
                                `STATUTE: ${right.statute}\n` +
                                `LANDMARK CASE: ${right.landmarkCase}\n\n` +
                                `SUMMARY:\n${right.summary}\n\n` +
                                `VERBAL SCRIPT:\n${right.dialogueScript}\n\n` +
                                `PROCEDURAL STEPS:\n` + right.proceduralSteps.map(p => `- ${p}`).join('\n') + '\n\n' +
                                `KEY SAFEGUARD: ${right.keySafeguard}\n`
                              ], { type: "text/plain" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `Civic_Shield_${right.id}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            } catch (e) {}
                          }}
                          className="p-1.5 rounded bg-black/50 border border-slate-800 text-gray-400 hover:text-white hover:border-[#ffd754] cursor-pointer"
                          title="Download Dossier"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CHAMBER II: EVIDENTIARY FILE LOCKER & DOWNLOADS                           */}
          {/* ========================================================================= */}
          {activeChamber === 'locker' && (
            <div className="space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#000d20] p-4 rounded border border-[#d4af37]/30 shadow-inner">
                
                {/* Type Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'pdf', 'video', 'spreadsheet'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveDocFilter(filter)}
                      className={`px-4 py-2 rounded-sm text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                        activeDocFilter === filter 
                          ? 'bg-[#d4af37] text-[#001233] font-black shadow-[0_0_15px_rgba(212,175,55,0.35)]' 
                          : 'bg-[#001738] text-gray-300 hover:text-[#ffd754] hover:bg-[#002456] border border-[#d4af37]/20'
                      }`}
                    >
                      {filter === 'all' ? 'All Records' : filter.toUpperCase() + 's'}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    placeholder="Search filing templates, handbooks..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded border border-[#d4af37]/35 bg-[#00122e] text-white placeholder-gray-400 focus:outline-none focus:border-[#ffd754]"
                  />
                  <Search className="w-4 h-4 text-[#ffd754] absolute left-3 top-2.5 pointer-events-none" />
                  {docSearchQuery && (
                    <button onClick={() => setDocSearchQuery('')} className="absolute right-2.5 top-2 text-gray-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Document Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDocs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-b from-[#001538] via-[#000e26] to-[#000817] rounded border border-[#d4af37]/30 hover:border-[#ffd754] p-5 flex flex-col justify-between shadow-xl group transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDocIcon(item.type)}
                          {item.verifiedBy && (
                            <HolographicVerifiedBadge verifiedBy={item.verifiedBy} compact={true} />
                          )}
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffd754] bg-[#d4af37]/15 px-2 py-0.5 rounded border border-[#d4af37]/30 font-bold">
                          {item.fileSize}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-serif font-bold text-white group-hover:text-[#ffd754] transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed font-light mt-1.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#d4af37]/15 pt-3.5 mt-3.5 space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#d4af37]" />
                          <span>{item.uploadedAt}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#ffd754]">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[110px]">{item.verifiedBy}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDetailsItem(item)}
                          className="flex-1 py-2 px-3 rounded-sm bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd754] hover:bg-[#d4af37] hover:text-[#001233] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Unseal & Inspect
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => onDeleteEvidence(item.id)}
                            className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CHAMBER III: EMERGENCY SITUATIONAL RESPONSE MATRIX                        */}
          {/* ========================================================================= */}
          {activeChamber === 'scenarios' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Scenario Buttons */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-[#ffd754] uppercase tracking-widest block mb-2">
                  SELECT YOUR IMMEDIATE ENCOUNTER:
                </span>
                {EMERGENCY_SCENARIOS.map((scen, sIdx) => {
                  const ScenIcon = scen.icon;
                  const isSelected = selectedScenario === sIdx;

                  return (
                    <button
                      key={sIdx}
                      onClick={() => setSelectedScenario(sIdx)}
                      className={`w-full text-left p-4 rounded border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#d4af37]/30 to-[#d4af37]/10 border-[#ffd754] text-white shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-[#ffd754]"
                          : "bg-[#000a17] border-slate-800 text-gray-300 hover:border-[#d4af37]/40 hover:text-white"
                      }`}
                    >
                      <div className={`p-2 rounded shrink-0 ${isSelected ? "bg-[#d4af37] text-[#001233]" : "bg-black/60 text-[#ffd754]"}`}>
                        <ScenIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-[#ffd754] uppercase tracking-wider block font-bold">
                          {scen.badge}
                        </span>
                        <h4 className="font-serif font-bold text-sm leading-tight text-white mt-0.5">
                          {scen.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Detailed Emergency Action Plan */}
              <div className="lg:col-span-2 bg-gradient-to-b from-[#001538] via-[#000e26] to-[#000817] rounded-lg border-2 border-[#d4af37]/60 p-6 sm:p-8 shadow-2xl space-y-6">
                {(() => {
                  const scen = EMERGENCY_SCENARIOS[selectedScenario];
                  const ScenIcon = scen.icon;

                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd754]">
                            <ScenIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-[#ffd754] uppercase tracking-widest font-bold">
                              CIVILIAN DEFENSE PROTOCOL // {scen.badge}
                            </span>
                            <h3 className="text-xl font-serif font-bold text-white">
                              {scen.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Threat Assessment */}
                      <div className="bg-red-950/30 border border-red-500/30 p-3.5 rounded flex items-start gap-2.5 text-xs text-red-200">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-mono font-bold uppercase text-red-300 block text-[10px]">
                            Risk / Challenge:
                          </span>
                          <span>{scen.threat}</span>
                        </div>
                      </div>

                      {/* Step-by-Step Action Directives */}
                      <div className="space-y-3">
                        <span className="font-mono text-[10px] font-bold text-[#ffd754] uppercase tracking-wider block">
                          Exact 3-Step Execution Plan:
                        </span>
                        <div className="space-y-3">
                          {scen.steps.map((step, idx) => (
                            <div key={idx} className="bg-black/50 p-3.5 rounded border border-slate-800 text-xs text-gray-200 font-light leading-relaxed">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Legal Weapon Statutory Anchor */}
                      <div className="bg-[#001f4d]/80 p-3.5 rounded border border-[#d4af37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-mono text-[9px] text-[#ffd754] uppercase tracking-widest font-bold block">
                            Statutory & Judicial Citation:
                          </span>
                          <span className="text-white font-medium">{scen.legalWeapon}</span>
                        </div>

                        <button
                          onClick={() => {
                            const textToCopy = `${scen.title.toUpperCase()}\n` +
                              `RISK: ${scen.threat}\n` +
                              `STATUTE: ${scen.legalWeapon}\n\n` +
                              `STEPS:\n` + scen.steps.join('\n\n');
                            handleCopyScript(textToCopy, `scen-${selectedScenario}`);
                          }}
                          className="px-3 py-1.5 rounded bg-[#d4af37] text-[#001233] hover:bg-[#ffd754] font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
                        >
                          {copiedId === `scen-${selectedScenario}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === `scen-${selectedScenario}` ? "Copied Protocol" : "Copy Full Protocol"}</span>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Details Modal */}
      {selectedDetailsItem && (
        <EvidenceDetailsModal
          item={selectedDetailsItem}
          isOpen={true}
          onClose={() => setSelectedDetailsItem(null)}
        />
      )}
    </section>
  );
}
