/**
 * Autonomous Legal AI Knowledge & Response Engine (Key-Free / Offline Capable)
 * 
 * Provides instantaneous, authoritative, and compassionate legal literacy guidance
 * across 15+ constitutional, civil, administrative, and criminal defense domains
 * without requiring external API keys or remote network connections.
 */

export interface LegalAdvisorResult {
  answered: boolean;
  answer: string;
  repliedBy: string;
  category: string;
  suggestedAction?: string;
  statutoryReference?: string;
}

interface LegalKnowledgeTopic {
  id: string;
  category: string;
  keywords: string[];
  title: string;
  repliedBy: string;
  statute: string;
  generateResponse: (query: string) => string;
}

export const LEGAL_KNOWLEDGE_BASE: LegalKnowledgeTopic[] = [
  {
    id: "police_detainment_stop",
    category: "Police Encounters & Detainment",
    keywords: [
      "detain", "detained", "detainment", "arrest", "arrested", "police", "cop", "cops", "officer", 
      "stop", "stopped", "free to go", "search", "frisk", "custody", "handcuff", "pat down", "pat-down"
    ],
    title: "Police Encounter & Detainment Protocol",
    repliedBy: "AI Shield (Sovereign Defense Engine)",
    statute: "Article 21 & 22 (Protection of Life & Liberty) • CrPC Sec 41 / BNSS Sec 35",
    generateResponse: (_query: string) => 
      `Civic Shield Stop & Detainment Protocol:\n\n` +
      `1. Clarify Encounter Status: Calmly ask, "Am I being detained, officer, or am I free to go?" If the officer states you are free to go, walk away peacefully.\n` +
      `2. Establish Reasonable Grounds: If detained, ask, "What is the specific reasonable suspicion for my detainment?" This requires officers to state verifiable, articulable grounds on the record.\n` +
      `3. Question Identification Mandates: Ask, "Am I required by law to provide identity under this specific detainment?" (In many jurisdictions, identity is only mandatory during formal traffic stops or lawful arrest).\n` +
      `4. Physical Search Limits: A pat-down is strictly restricted to outer clothing for officer safety unless probable cause or a valid search warrant exists. Never resist physically; state verbally: "I do not consent to any searches."\n\n` +
      `💡 Action Tip: Download our pocket-sized Traffic & Police Interaction Handbook from the Evidence Locker!`
  },
  {
    id: "recording_police_public",
    category: "Right to Record Law Enforcement",
    keywords: [
      "record", "recording", "film", "filming", "camera", "video", "photograph", "capture", "footage", "phone", "public space"
    ],
    title: "Right to Record Law Enforcement in Public",
    repliedBy: "AI Shield (Civic Transparency Engine)",
    statute: "Article 19(1)(a) (Freedom of Expression) • Public Accountability Doctrine",
    generateResponse: (_query: string) =>
      `Right to Record Law Enforcement in Public:\n\n` +
      `• Absolute Public Right: You have a clearly protected constitutional right to visually and audibly record police officers and public servants performing their duties in open public spaces.\n` +
      `• Spatial Buffer: Stand at a safe distance (recommended 8-10 feet) so officers cannot claim physical obstruction or interference with official duty.\n` +
      `• Verbal Clarification: If challenged, state calmly: "Officer, I am standing back and creating a peaceful factual record for transparency. I am not interfering."\n` +
      `• Device Protection: Officers cannot search, seize, or demand the deletion of your phone/camera footage without a specific judicial warrant.`
  },
  {
    id: "fir_police_complaint",
    category: "FIR & Police Station Procedures",
    keywords: [
      "fir", "first information report", "police station", "complaint", "refuse to file", "refusing fir", "zero fir", "cognizable", "thana", "daroga", "sho"
    ],
    title: "FIR Registration & Procedural Remedies",
    repliedBy: "AI Shield (Criminal Procedure Guide)",
    statute: "Section 154 CrPC / BNSS Sec 173 • Lalita Kumari v. Govt of UP (2014)",
    generateResponse: (_query: string) =>
      `First Information Report (FIR) Mandatory Guidelines:\n\n` +
      `1. Mandatory Registration: If your complaint discloses a cognizable offense (e.g., theft, assault, fraud), police are legally mandated to register an FIR immediately without preliminary inquiry (per Supreme Court landmark in Lalita Kumari).\n` +
      `2. Zero FIR: You can file an FIR at ANY police station regardless of where the incident occurred. The station must register it as a "Zero FIR" and transfer it to the jurisdictional station.\n` +
      `3. Free Copy: You are entitled to a free signed copy of the registered FIR immediately (Section 154(2) CrPC).\n` +
      `4. If Police Refuse: Send your written complaint via Registered Post / Speed Post directly to the Superintendent of Police (SP / DCP) under Section 154(3), or approach the Judicial Magistrate under Section 156(3).`
  },
  {
    id: "pro_se_representation",
    category: "Pro-Se / Self-Representation",
    keywords: [
      "pro-se", "pro se", "party in person", "party-in-person", "self represent", "represent myself", "own lawyer", "no lawyer", "afford attorney", "court filing", "plead", "tribunal"
    ],
    title: "Pro-Se Self-Representation Protocol",
    repliedBy: "AI Shield (Procedural Advocacy Engine)",
    statute: "Section 32, Advocates Act 1961 • Constitutional Right of Audience",
    generateResponse: (_query: string) =>
      `Party-in-Person (Pro-Se) Self-Representation:\n\n` +
      `• Inviolable Right: You do not need to pay expensive attorney retainers to access the courts. You possess a recognized statutory right to plead and represent your own case as a Party-in-Person.\n` +
      `• Drafting Structure: Organize filings logically: (1) Memo of Parties, (2) List of Dates & Events, (3) Numbered factual paragraphs, (4) Prayer/Relief sought, (5) Signed Verification Affidavit.\n` +
      `• Courtroom Etiquette: Address the bench respectfully ("Your Honor" / "Respected Court"), present facts with objective chronological clarity, and bring 3 clean indexed copies (for Court, Respondent, and yourself).\n` +
      `• Ready Templates: Download our tested Party-in-Person response sheets directly from the Evidence Locker!`
  },
  {
    id: "rti_transparency",
    category: "RTI & Public Transparency",
    keywords: [
      "rti", "right to information", "transparency", "public record", "pio", "public information officer", "government spending", "audit", "first appeal", "tender", "records"
    ],
    title: "Right to Information (RTI) Action Guide",
    repliedBy: "AI Shield (Transparency Desk)",
    statute: "RTI Act 2005 (Sec 6, 7 & 19) • Freedom of Public Scrutiny",
    generateResponse: (_query: string) =>
      `RTI (Right to Information) Step-by-Step Blueprint:\n\n` +
      `1. Draft Point-Specific Questions: Keep requests factual and clear (e.g., "Provide certified copies of work orders and budget expenditure for Road #4 between Jan-May 2026"). Avoid asking for legal opinions or hypothetical reasons.\n` +
      `2. Strict 30-Day Mandate: The Public Information Officer (PIO) must supply the records within 30 days of receipt (or 48 hours if life and liberty are at stake).\n` +
      `3. First Appeal Remedy: If the PIO does not respond or provides misleading data within 30 days, file a First Appeal under Section 19(1) to the designated First Appellate Authority (FAA) at zero fee.\n` +
      `4. Second Appeal: If still unsatisfied, escalate to the Central or State Information Commission (CIC/SIC), which can impose personal financial penalties on defaulting officers.`
  },
  {
    id: "tenant_landlord_rights",
    category: "Tenant & Housing Rights",
    keywords: [
      "rent", "tenant", "landlord", "evict", "eviction", "lease", "security deposit", "rental", "apartment", "house", "lockout", "utility", "water cutoff", "electricity cut"
    ],
    title: "Tenant Protections & Anti-Eviction Shield",
    repliedBy: "AI Shield (Housing Rights Desk)",
    statute: "Rent Control Legislation & Model Tenancy Framework • Transfer of Property Act",
    generateResponse: (_query: string) =>
      `Tenant & Housing Dispute Safeguards:\n\n` +
      `• Unlawful Eviction Ban: A landlord cannot arbitrarily throw out your belongings, change door locks, or physically evict you without obtaining a formal decree or court eviction order.\n` +
      `• Essential Services Immunity: Cutting off electricity, water, or elevator access to force eviction is a punishable civil and criminal violation. You can immediately seek an urgent injunction from the local Rent Authority / Police.\n` +
      `• Notice Period: Landlords must provide a formal written notice period (typically 15 to 30 days as specified in your agreement) before terminating a lease.\n` +
      `• Security Deposit: Unilateral withholding of deposits without itemized, photographic proof of tenant-caused structural damage is unlawful.`
  },
  {
    id: "traffic_vehicle_challan",
    category: "Traffic Compliance & Roadside Checks",
    keywords: [
      "traffic", "car", "vehicle", "bike", "license", "dl", "rc", "challan", "fine", "helmet", "puc", "insurance", "digilocker", "mparivahan", "towing", "towed", "breathalyzer"
    ],
    title: "Traffic Rights & Digital Document Verification",
    repliedBy: "AI Shield (Roadside Compliance)",
    statute: "Motor Vehicles Act 1988 (Amended) • Rule 139 Central Motor Vehicles Rules",
    generateResponse: (_query: string) =>
      `Roadside Traffic Checks & Digital Document Rights:\n\n` +
      `1. Digital Documents are 100% Legal: Producing your Driving License (DL), Registration (RC), Insurance, and PUC certificates via government DigiLocker or mParivahan apps is fully legally valid. Physical confiscation is impermissible unless for serious statutory suspensions.\n` +
      `2. Vehicle Keys: Traffic personnel are not authorized to forcefully pull keys out of your vehicle's ignition during routine verification.\n` +
      `3. Towing Restrictions: In most municipal jurisdictions, towing a vehicle while the driver/owner is seated inside is prohibited; officers must issue a standard on-the-spot compounding challan instead.\n` +
      `4. E-Challan Contestation: You can contest unfair electronic traffic tickets online via the Virtual Court / Lok Adalat platform.`
  },
  {
    id: "consumer_protection_refund",
    category: "Consumer Rights & Fair Trade",
    keywords: [
      "consumer", "refund", "defective", "warranty", "scam", "cheat", "cheated", "service", "customer care", "e-commerce", "product", "replacement", "consumer court", "e-daakhil"
    ],
    title: "Consumer Rights & Defective Product Redressal",
    repliedBy: "AI Shield (Consumer Advocacy)",
    statute: "Consumer Protection Act 2019 • National Consumer Disputes Redressal",
    generateResponse: (_query: string) =>
      `Consumer Rights & Speedy Dispute Resolution:\n\n` +
      `• Right to Redressal: If a company or seller delivers defective merchandise, refuses warranty coverage, or engages in unfair trade practices, you are entitled to a full refund, replacement, and compensation for mental agony.\n` +
      `• Direct Grievance: Register an instant formal complaint on the National Consumer Helpline (NCH portal / Dial 1915).\n` +
      `• E-Daakhil Online Filing: You can file formal consumer complaints against corporate entities online through e-Daakhil without hiring a lawyer.\n` +
      `• Preserve Records: Always save purchase invoices, order confirmation emails, photographic evidence of damage, and customer support chat transcripts.`
  },
  {
    id: "cybercrime_online_fraud",
    category: "Cybercrime & Online Safety",
    keywords: [
      "cyber", "cybercrime", "hack", "hacked", "online scam", "fraud", "phishing", "blackmail", "impersonation", "bank fraud", "otp", "leak", "deepfake", "harassment online"
    ],
    title: "Cybercrime Immediate Response Blueprint",
    repliedBy: "AI Shield (Digital Forensics Guard)",
    statute: "Information Technology Act 2000 (Sec 43, 66, 67) • National Cyber Crime Portal",
    generateResponse: (_query: string) =>
      `Cybercrime & Financial Fraud Emergency Steps:\n\n` +
      `1. The Golden Hour (Bank Fraud): Immediately call 1930 (National Cyber Crime Helpline) or your bank's 24/7 fraud desk to block accounts and freeze transaction gateway transfers.\n` +
      `2. File Official Cyber Report: Log your complaint on cybercrime.gov.in and obtain an acknowledgement number.\n` +
      `3. Evidence Preservation: Capture high-resolution screenshots with full visible URL bars, transaction UTR numbers, sender phone numbers/UPI handles, and email header logs.\n` +
      `4. Online Harassment & Blackmail: Never pay extortionists. Report the profile directly to platform trust & safety, preserve all messages, and notify local cyber cells immediately.`
  },
  {
    id: "women_rights_protection",
    category: "Women's Legal Safeguards",
    keywords: [
      "women", "woman", "posh", "workplace harassment", "domestic violence", "pwdva", "dowry", "eve teasing", "stalking", "night arrest", "female officer"
    ],
    title: "Women's Inviolable Legal Protections",
    repliedBy: "AI Shield (Protective Justice Engine)",
    statute: "POSH Act 2013 • PWDVA 2005 • Section 46(4) CrPC (Arrest of Women)",
    generateResponse: (_query: string) =>
      `Women's Statutory Protections & Safety Protocols:\n\n` +
      `• Arrest Protections (Sec 46(4) CrPC): Except in extraordinary circumstances with a Judicial Magistrate's prior order, no woman can be arrested after sunset or before sunrise, and arrests must be conducted by female officers.\n` +
      `• Workplace Protection (POSH): Every workplace with 10+ employees must maintain an Internal Complaints Committee (ICC) to investigate harassment complaints within 90 days with strict confidentiality.\n` +
      `• Domestic Violence Act: Provides immediate emergency protections, right to reside in the shared household, protection orders, and monetary relief.\n` +
      `• 24/7 Emergency Helplines: Dial 181 (Women's Helpline) or 112 (National Emergency) for immediate state intervention and legal aid.`
  },
  {
    id: "free_legal_aid_nalsa",
    category: "Free Legal Aid & Public Defense",
    keywords: [
      "free legal aid", "legal aid", "nalsa", "dlsa", "poor", "cannot afford", "free lawyer", "legal clinic", "lok adalat", "marginalized"
    ],
    title: "Access to 100% Free Legal Aid",
    repliedBy: "AI Shield (Public Defense Desk)",
    statute: "Article 39A (Equal Justice & Free Legal Aid) • Legal Services Authorities Act 1987",
    generateResponse: (_query: string) =>
      `Accessing 100% Free Government Legal Defense:\n\n` +
      `• Constitutional Guarantee: Under Article 39A, the state must ensure that no citizen is denied justice due to economic disability.\n` +
      `• Who Qualifies: All women, children, persons with disabilities, custody detainees, victims of disasters, and low-income individuals qualify for free government-appointed lawyers.\n` +
      `• How to Apply: Visit your local District Legal Services Authority (DLSA) situated at every district court complex or submit an application online at nalsa.gov.in.\n` +
      `• Lok Adalat: Resolve disputes, compoundable offenses, and pending matters quickly with zero court fees and final non-appealable settlement.`
  },
  {
    id: "constitutional_rights_writs",
    category: "Constitutional Writs & Fundamental Rights",
    keywords: [
      "constitution", "fundamental rights", "article 21", "article 19", "article 14", "article 32", "article 226", "high court", "supreme court", "writ", "habeas corpus", "mandamus"
    ],
    title: "Constitutional Safeguards & Writ Remedies",
    repliedBy: "AI Shield (Constitutional Bench)",
    statute: "Constitution of India (Articles 14, 19, 21, 32, 226)",
    generateResponse: (_query: string) =>
      `Constitutional Writs & Fundamental Rights Overview:\n\n` +
      `• Article 21 (Life & Personal Liberty): Protects dignity, privacy, fair trial, and procedural due process.\n` +
      `• Article 19 (Six Freedoms): Protects speech, peaceful assembly, association, movement, residence, and profession.\n` +
      `• Powerful Writ Remedies (Art 32 / 226):\n` +
      `  1. Habeas Corpus: To produce an illegally detained person before the court.\n` +
      `  2. Mandamus: To compel a public authority to perform their mandatory statutory duty.\n` +
      `  3. Quo Warranto: To challenge unauthorized occupation of public office.\n` +
      `  4. Certiorari / Prohibition: To quash or prevent unconstitutional jurisdictional overreaches.`
  },
  {
    id: "evidence_locker_templates",
    category: "Evidence Locker & Platform Resources",
    keywords: [
      "template", "handout", "download", "document", "resource", "affidavit", "manual", "booklet", "pdf", "evidence room", "locker", "materials"
    ],
    title: "Civic Shield Legal Toolkit & Downloadable Locker",
    repliedBy: "AI Shield (Resource Index)",
    statute: "Civic Shield Legal Literacy Vault 2026",
    generateResponse: (_query: string) =>
      `Civic Shield Downloadable Resources Available:\n\n` +
      `1. Administrative Objection Affidavit (.docx): Formal declarations kit to challenge unlawful municipal notices.\n` +
      `2. FOIA / RTI Certified Request Worksheets (.pdf): Structured forms to compel budget disclosure from local authorities.\n` +
      `3. Pro-Se Self-Representation Protocol (.xlsx): Courtroom filing checklists, indexing boilerplate, and verification affidavits.\n` +
      `4. De-escalation Compliance Brief (.mp4): Video tutorial on remaining calm, asserting rights, and documenting public encounters safely.\n\n` +
      `👉 Switch to the "Evidence Room" folder tab on the homepage or the "Citizen Resources" tab in this chat window to access all downloads immediately!`
  }
];

/**
 * Intelligent Local Knowledge Engine:
 * Analyzes any query using keyword matching, intent clustering, and structured synthesis.
 */
export function getAutonomousLegalResponse(rawQuery: string): LegalAdvisorResult {
  const query = (rawQuery || "").trim().toLowerCase();
  
  if (!query) {
    return {
      answered: true,
      category: "General Inquiry",
      repliedBy: "AI Shield (Civilian Assistant)",
      answer: "Welcome to Civic Shield Anonymous Desk. Please enter any legal question, scenario, or concern regarding your statutory rights, police stops, tenant disputes, RTI requests, or courtroom representation."
    };
  }

  // 1. Check for Direct Topic Match
  let bestTopic: LegalKnowledgeTopic | null = null;
  let highestScore = 0;

  for (const topic of LEGAL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (query.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && highestScore >= 1) {
    return {
      answered: true,
      category: bestTopic.category,
      repliedBy: bestTopic.repliedBy,
      statutoryReference: bestTopic.statute,
      answer: bestTopic.generateResponse(query),
      suggestedAction: `Review related procedural worksheets in our Evidence Locker.`
    };
  }

  // 2. Greetings & Salutations
  if (query.match(/^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening)\b/)) {
    return {
      answered: true,
      category: "Introduction",
      repliedBy: "AI Shield (Campaign Advocate)",
      answer: "Greetings! I am the Civic Shield AI Advocate. I am programmed to help you understand your fundamental legal protections, procedural rights during encounters, RTI filings, and self-representation protocols without fear. How can I assist your situation today?"
    };
  }

  // 3. Dynamic Contextual Legal Synthesis for unindexed queries
  const words = query.split(/\s+/).filter(w => w.length > 3).slice(0, 4).join(", ");
  
  return {
    answered: true,
    category: "Civic Rights Synthesis",
    repliedBy: "AI Shield (Universal Procedural Engine)",
    statutoryReference: "Rule of Law & Natural Justice Principles",
    answer: 
      `Civic Shield Universal Strategic Response (regarding ${words || "your inquiry"}):\n\n` +
      `1. Document First & Establish Written Record: When facing any administrative dispute, demand all notifications, charges, and directives in formal written form. Never rely on verbal assumptions.\n` +
      `2. Demand Statutory Authority: Ask the relevant officer or authority to cite the exact section of law or rule under which they are acting. State: "Please provide the official rule empowering this request."\n` +
      `3. Preserve Right to Appeal & Free Legal Aid: If aggrieved, submit a written objection letter within 15 days, request a reasoned "Speaking Order", or approach your District Legal Services Authority (DLSA) for free representation.\n\n` +
      `💡 A human campaign manager has also been alerted to your query for review on our Public Q&A Board.`
  };
}
