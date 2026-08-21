/**
 * Autonomous Dynamic Legal Knowledge & Response Engine
 * 
 * Provides instantaneous, tailored, and authoritative legal literacy guidance
 * across constitutional, civil, administrative, and criminal defense domains.
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
  patterns?: RegExp[];
  title: string;
  repliedBy: string;
  statute: string;
  generateResponse: (query: string) => string;
}

export const LEGAL_KNOWLEDGE_BASE: LegalKnowledgeTopic[] = [
  {
    id: "why_know_rights_philosophy",
    category: "The Importance of Legal Knowledge",
    keywords: [
      "why do i need to know", "why should i know", "why know rights", "why is this important", 
      "why does it matter", "what is the point", "does knowing rights help", "why learn the law",
      "why should citizens learn", "why know them", "why care about rights", "what good is knowing",
      "why do i need to know them", "why should i care", "why know"
    ],
    patterns: [
      /why (do|should) (i|we|citizens) (need to )?know/i,
      /why (is it|is this) important/i,
      /what('s| is) the (use|point|benefit) of knowing/i,
      /does (it|knowing|rights) (really|actually) (matter|help|work)/i,
      /why do i need to know/i
    ],
    title: "Why Knowing Your Legal Rights is Essential",
    repliedBy: "AI Legal Advocate (Civic Empowerment Desk)",
    statute: "Article 21 (Right to Dignified Life) • Rule of Law Doctrine • Natural Justice",
    generateResponse: (rawQuery: string) =>
      `### Why Knowing Your Rights is Your Most Essential Armor\n\n` +
      `Regarding *"**${rawQuery.trim()}**"*:\n\n` +
      `Knowledge of the law isn't just for lawyers—it is the everyday shield that separates an informed citizen from an easy target of bureaucratic intimidation or police overreach. Here is why understanding your legal rights is transformative:\n\n` +
      `1. **Eliminates Fear & Shifts Power Dynamics:** In an encounter with authority (traffic police, municipal officers, or landlords), fear comes from uncertainty. When you know the exact statutory limit of an official's power, you remain calm, polite, and unshakeable.\n\n` +
      `2. **Prevents Extortion & Arbitrary Fines:** Corrupt actors exploit ignorance. Simply asking, *"Under which specific section or rule is this required, officer?"* immediately signals that you cannot be coerced into paying bribes or accepting unlawful fines.\n\n` +
      `3. **Protects Your Family & Property:** Whether facing unlawful eviction, illegal phone searches, or refusal to register a police report, knowing immediate remedies (like Zero FIR, D.K. Basu guidelines, or Rent Control laws) stops abuse before irreversible damage occurs.\n\n` +
      `4. **Democratizes Justice:** The legal system is meant to serve the public, not oppress them. When citizens understand procedural remedies like RTI (Right to Information) and Pro-Se self-representation, justice becomes accessible without high legal fees.\n\n` +
      `*Bottom line:* When you know your rights, you don't need to argue or raise your voice—the law speaks for you.`
  },
  {
    id: "about_civic_shield",
    category: "Civic Shield Platform Mission",
    keywords: [
      "what is civic shield", "who made civic shield", "what do you do", "what is this website", 
      "civic shield mission", "how does civic shield work", "who are you", "what can you do"
    ],
    patterns: [
      /what is (this|civic shield)/i,
      /who (made|created|runs) (this|civic shield)/i,
      /how (can you|does this) (help|work)/i
    ],
    title: "About Civic Shield & AI Legal Advocate",
    repliedBy: "Civic Shield Legal System",
    statute: "Article 39A (Free Legal Aid & Equal Justice) • Article 19(1)(a) Public Literacy",
    generateResponse: (_query: string) =>
      `### About Civic Shield: Independent Public Legal Literacy\n\n` +
      `**Civic Shield** is an open, independent civic literacy and procedural defense initiative dedicated to dismantling the knowledge gap between everyday citizens and legal/administrative systems.\n\n` +
      `**What Civic Shield Provides:**\n` +
      `• **Interactive Case Handbooks & Evidence Vault:** Certified statutory guidance, printable rights cards, and downloadable party-in-person litigation templates.\n` +
      `• **AI Legal Advocate Desk:** Instant, constitutionally grounded answers for roadside traffic stops, tenant lockouts, consumer grievances, FIR registration, and pro-se court defense.\n` +
      `• **Community Voice & Verified Stories:** Real-world case files and investigative analyses examining administrative accountability and constitutional freedoms.\n\n` +
      `Ask me any question about your rights during police encounters, landlord disputes, government filings, or court procedures!`
  },
  {
    id: "police_detainment_stop",
    category: "Police Encounters & Detainment",
    keywords: [
      "detain", "detained", "detainment", "arrest", "arrested", "police", "cop", "cops", "officer", 
      "stop", "stopped", "free to go", "search", "frisk", "custody", "handcuff", "pat down", "pat-down",
      "interrogate", "interrogation", "police stop", "pulled over"
    ],
    title: "Police Encounter & Detainment Protocol",
    repliedBy: "AI Legal Advocate (Encounter Defense Desk)",
    statute: "Article 21 & 22 (Protection of Life & Liberty) • CrPC Sec 41 / BNSS Sec 35 • D.K. Basu Guidelines (1997)",
    generateResponse: (rawQuery: string) => 
      `### Step-by-Step Police Encounter Protocol (${rawQuery.trim()})\n\n` +
      `1. **Clarify Encounter Status:** Calmly ask: *"Am I being detained, officer, or am I free to go?"* If the officer states you are free to go, walk away peacefully without further conversation.\n` +
      `2. **Establish Reasonable Grounds:** If detained, ask: *"What is the specific reasonable suspicion for my detainment?"* Officers must have verifiable, articulable legal grounds on record.\n` +
      `3. **Physical Search Limits:** A pat-down is strictly restricted to outer clothing for officer safety unless probable cause or a search warrant exists. State verbally: *"I do not consent to any searches."*\n` +
      `4. **Mandatory Arrest Memo:** Under landmark *D.K. Basu* guidelines, if placed under arrest, the officer MUST prepare an Arrest Memo signed by a witness and notify a family member within 8-12 hours.\n` +
      `5. **Right to Silence & Counsel:** You have the fundamental right to consult an advocate under Article 22(1) and the right against self-incrimination under Article 20(3).`
  },
  {
    id: "recording_police_public",
    category: "Right to Record Law Enforcement",
    keywords: [
      "record", "recording", "film", "filming", "camera", "video", "photograph", "capture", "footage", "shoot video", "record police", "take video"
    ],
    title: "Right to Record Law Enforcement in Public",
    repliedBy: "AI Legal Advocate (Transparency Desk)",
    statute: "Article 19(1)(a) (Freedom of Expression) • Public Accountability Doctrine",
    generateResponse: (_query: string) =>
      `### Right to Record Public Officials & Police\n\n` +
      `• **Constitutional Protection:** You have a protected right under Article 19(1)(a) to record video and audio of police officers and public servants performing duties in open public spaces.\n` +
      `• **Maintain Spatial Buffer:** Stand at a safe distance (8-10 feet away) so officers cannot claim physical obstruction or interference with official duty.\n` +
      `• **Assert Calmly:** If ordered to stop filming, state: *"Officer, I am standing back and creating a peaceful factual record for transparency. I am not interfering."*\n` +
      `• **No Warrantless Deletion:** Officers cannot seize your phone or demand the deletion of recordings without a specific judicial warrant.`
  },
  {
    id: "phone_privacy_digital_search",
    category: "Digital Privacy & Device Searches",
    keywords: [
      "phone", "search phone", "unlock phone", "passcode", "password", "whatsapp", "chat search", "mobile search", "digital privacy", "seize phone", "check phone", "messages"
    ],
    title: "Digital Device Privacy & Phone Search Protocols",
    repliedBy: "AI Legal Advocate (Digital Privacy Desk)",
    statute: "Article 20(3) (Self-Incrimination) • Article 21 (Right to Privacy - Puttaswamy 2017) • CrPC Sec 100 / BNSS",
    generateResponse: (_query: string) =>
      `### Smartphone & Digital Device Privacy Protections\n\n` +
      `1. **No Arbitrary Phone Browsing:** Police officers or officials cannot stop you on the street and casually demand you unlock your phone or scroll through your private chats, photos, or apps.\n` +
      `2. **Right Against Self-Incrimination (Article 20(3)):** Forcing a citizen to unlock their encrypted smartphone to extract confessions violates constitutional guarantees under *K.S. Puttaswamy* & *Selvi v. State of Karnataka*.\n` +
      `3. **Formal Seizure Protocol:** To seize a device, officers MUST issue a formal Seizure Memo (with hash value recorded in an anti-static forensic bag) and state the connection to a registered FIR.\n` +
      `4. **What to Say:** Calmly state: *"Officer, this device contains private privileged personal and professional data protected under Article 21. Unless an official seizure memo under a registered investigation is being executed, I do not consent to unlocking it."*`
  },
  {
    id: "fir_police_complaint",
    category: "FIR & Police Station Procedures",
    keywords: [
      "fir", "first information report", "police station", "complaint", "refuse to file", "refusing fir", "zero fir", "cognizable", "thana", "daroga", "sho", "police complaint", "file fir"
    ],
    title: "FIR Registration & Procedural Remedies",
    repliedBy: "AI Legal Advocate (Criminal Procedure Desk)",
    statute: "Section 154 CrPC / BNSS Sec 173 • Lalita Kumari v. Govt of UP (2014) 2 SCC 1",
    generateResponse: (_query: string) =>
      `### FIR Registration & What to Do If Police Refuse\n\n` +
      `1. **Mandatory Registration:** If your complaint discloses a cognizable offense (theft, assault, fraud, threats), police are legally mandated to register an FIR immediately without preliminary inquiry (*Lalita Kumari landmark*).\n` +
      `2. **Zero FIR:** You can file an FIR at ANY police station regardless of where the incident occurred. The station must register it as a "Zero FIR" and transfer it.\n` +
      `3. **Free Copy:** You are entitled to a free signed copy of the registered FIR immediately (Section 154(2) CrPC).\n` +
      `4. **If Police Refuse to Register:**\n` +
      `   - Send written complaint via Registered/Speed Post to the Superintendent of Police (SP / DCP) under Section 154(3).\n` +
      `   - File an application before the Judicial Magistrate under Section 156(3) CrPC to direct the police to register the FIR and investigate.`
  },
  {
    id: "women_arrest_protections",
    category: "Women's Legal Safeguards & Arrest Rules",
    keywords: [
      "women", "woman", "female", "sunset", "sunrise", "lady officer", "female arrest", "women rights", "girl arrest", "search woman"
    ],
    title: "Women's Arrest & Custodial Safeguards",
    repliedBy: "AI Legal Advocate (Women's Rights Desk)",
    statute: "Section 46(4) CrPC / BNSS Sec 35 • Sheela Barse v. State of Maharashtra",
    generateResponse: (_query: string) =>
      `### Statutory Safeguards for Women During Encounters & Arrests\n\n` +
      `1. **Sunset to Sunrise Immunity (Section 46(4) CrPC):** No woman can be arrested after sunset and before sunrise except in exceptional circumstances with prior written permission from a Judicial Magistrate.\n` +
      `2. **Female Officer Requirement:** Arrest and physical search of a woman can ONLY be conducted by a female police officer with strict regard to decency (Section 51(2) CrPC).\n` +
      `3. **Police Station Summons Protection (Section 160 CrPC):** Women and children below 15 cannot be called to the police station for questioning; interrogation must take place at their place of residence.\n` +
      `4. **Zero FIR & Virtual Complaints:** Women can register complaints or Zero FIRs via email or post to the Commissioner of Police.`
  },
  {
    id: "pro_se_representation",
    category: "Pro-Se / Self-Representation",
    keywords: [
      "pro-se", "pro se", "party in person", "party-in-person", "self represent", "represent myself", "own lawyer", "no lawyer", "afford attorney", "court filing", "plead", "tribunal"
    ],
    title: "Pro-Se Self-Representation Protocol",
    repliedBy: "AI Legal Advocate (Procedural Advocacy Desk)",
    statute: "Section 32, Advocates Act 1961 • Constitutional Right of Audience",
    generateResponse: (_query: string) =>
      `### Party-in-Person (Pro-Se) Self-Representation\n\n` +
      `• **Statutory Right:** Under Section 32 of the Advocates Act 1961, any court, tribunal, or authority may permit any citizen to appear and plead their own case without an advocate.\n` +
      `• **Standard Filing Structure:**\n` +
      `  1. Memo of Parties (Petitioner vs. Respondent)\n` +
      `  2. List of Dates & Chronological Events\n` +
      `  3. Numbered factual statements supported by certified annexures\n` +
      `  4. Prayer (exact relief requested from the Court)\n` +
      `  5. Signed Verification Affidavit\n` +
      `• **In Court:** Address the bench respectfully (*"Your Honor"*), speak clearly on documented facts, and keep 3 clean indexed sets of copies.`
  },
  {
    id: "rti_transparency",
    category: "RTI & Public Transparency",
    keywords: [
      "rti", "right to information", "transparency", "public record", "pio", "public information officer", "government spending", "audit", "first appeal", "tender", "records", "application fee"
    ],
    title: "Right to Information (RTI) Action Guide",
    repliedBy: "AI Legal Advocate (Transparency Desk)",
    statute: "RTI Act 2005 (Sec 6, 7 & 19) • Central / State Information Commissions",
    generateResponse: (_query: string) =>
      `### How to File an Effective RTI Application\n\n` +
      `1. **Draft Factual, Numbered Questions:** Request certified records, work orders, logbooks, or inspection memos (e.g., *"Provide certified copies of tender disbursements for Road #4"*). Avoid asking for hypothetical opinions.\n` +
      `2. **Nominal Fee:** ₹10 application fee (postal order, court fee stamp, or online at rtionline.gov.in). BPL cardholders pay ₹0.\n` +
      `3. **Strict 30-Day Limit:** The PIO must provide records within 30 days (or 48 hours for life and liberty matters).\n` +
      `4. **First Appeal (Section 19(1)):** If the PIO fails to reply or gives incomplete answers, submit a First Appeal to the First Appellate Authority at zero fee.\n` +
      `5. **Second Appeal & Penalty:** The Information Commission can fine defaulting officers ₹250/day up to ₹25,000.`
  },
  {
    id: "tenant_landlord_rights",
    category: "Tenant & Housing Rights",
    keywords: [
      "rent", "tenant", "landlord", "evict", "eviction", "lease", "security deposit", "rental", "apartment", "house", "lockout", "utility", "water cutoff", "electricity cut", "landlord dispute"
    ],
    title: "Tenant Protections & Anti-Eviction Shield",
    repliedBy: "AI Legal Advocate (Housing Rights Desk)",
    statute: "Rent Control Legislation & Model Tenancy Act • Transfer of Property Act 1882",
    generateResponse: (_query: string) =>
      `### Tenant Rights & Protection Against Unlawful Eviction\n\n` +
      `• **No Arbitrary Eviction:** A landlord cannot throw your belongings out, change locks, or forcefully evict you without obtaining a formal decree or court order.\n` +
      `• **Disconnection of Utilities is Illegal:** Cutting off water, electricity, or gas supply to coerce eviction is a punishable offense. You can seek emergency police intervention or an injunction.\n` +
      `• **Mandatory Notice Period:** Landlords must issue a written notice period (typically 15 to 30 days per the agreement) before terminating a tenancy.\n` +
      `• **Security Deposit Recovery:** Landlords cannot withhold deposits without itemized bills and photographic proof of tenant-caused structural damage.`
  },
  {
    id: "traffic_vehicle_challan",
    category: "Traffic Compliance & Roadside Checks",
    keywords: [
      "traffic", "car", "vehicle", "bike", "license", "dl", "rc", "challan", "fine", "helmet", "puc", "insurance", "digilocker", "mparivahan", "towing", "towed", "breathalyzer", "traffic police", "key pull"
    ],
    title: "Traffic Rights & Digital Document Verification",
    repliedBy: "AI Legal Advocate (Roadside Compliance Desk)",
    statute: "Motor Vehicles Act 1988 (Amended 2019) • Rule 139 Central Motor Vehicles Rules 1989",
    generateResponse: (_query: string) =>
      `### Roadside Traffic Checks & Citizen Protections\n\n` +
      `1. **Digital Documents are 100% Valid:** Presenting your DL, RC, Insurance, and PUC via government DigiLocker or mParivahan apps is fully recognized under MoRTH rules. Physical confiscation is unlawful for standard checks.\n` +
      `2. **Key Snatching is Prohibited:** Traffic personnel cannot forcefully remove the keys from your vehicle's ignition.\n` +
      `3. **Towing With Passenger Inside:** Towing a vehicle while any occupant is inside is strictly prohibited.\n` +
      `4. **Breathalyzer Hygiene:** You are entitled to see a fresh disposable mouthpiece unwrapped before testing.\n` +
      `5. **Contesting Challans:** You can contest arbitrary fines before the Virtual Traffic Court or Lok Adalat without paying bribes.`
  },
  {
    id: "consumer_protection_refund",
    category: "Consumer Rights & Fair Trade",
    keywords: [
      "consumer", "refund", "defective", "warranty", "scam", "cheat", "cheated", "service", "customer care", "e-commerce", "product", "replacement", "consumer court", "e-daakhil", "fake product"
    ],
    title: "Consumer Rights & Defective Product Redressal",
    repliedBy: "AI Legal Advocate (Consumer Advocacy Desk)",
    statute: "Consumer Protection Act 2019 • National Consumer Disputes Redressal Commission (NCDRC)",
    generateResponse: (_query: string) =>
      `### Consumer Rights & Speedy Refund Procedures\n\n` +
      `• **Statutory Rights:** If a company sells defective goods, provides deficient services, or uses deceptive trade practices, you are entitled to full replacement, refund, and compensation for mental harassment.\n` +
      `• **National Consumer Helpline (NCH):** Register an instant complaint online at consumerhelpline.gov.in or Dial 1915.\n` +
      `• **e-Daakhil Online Filing:** Submit formal consumer complaints online at edaakhil.nic.in without hiring a lawyer.\n` +
      `• **Preserve Evidence:** Retain invoices, order confirmations, photos of defects, and customer service email/chat logs.`
  },
  {
    id: "bail_rights_custody",
    category: "Bail Rights & Custodial Appearance",
    keywords: [
      "bail", "anticipatory bail", "bailable", "non-bailable", "jail", "remand", "magistrate 24 hours", "surety", "bond"
    ],
    title: "Bail & Custodial Appearance Safeguards",
    repliedBy: "AI Legal Advocate (Custodial Defense Desk)",
    statute: "Section 436/437/438 CrPC / BNSS 478-482 • Article 22(2) Constitution of India",
    generateResponse: (_query: string) =>
      `### Bail Rights & Judicial Safeguards\n\n` +
      `1. **Bailable Offenses are a Matter of Right (Section 436 CrPC):** For bailable offenses, police must grant bail immediately upon submission of a reasonable bond.\n` +
      `2. **24-Hour Magistrate Rule (Article 22(2)):** Anyone detained must be produced before the nearest Judicial Magistrate within 24 hours. Detention beyond 24h without judicial order is illegal confinement.\n` +
      `3. **Free Legal Aid at Remand (Article 39A):** The Magistrate must appoint a free legal aid counsel before considering remand.\n` +
      `4. **Anticipatory Bail (Section 438 CrPC):** If you anticipate false arrest in non-bailable matters, apply for Anticipatory Bail before the Sessions Court or High Court.`
  },
  {
    id: "cyber_fraud_online_scam",
    category: "Cyber Crime & Financial Fraud",
    keywords: [
      "cyber", "scam", "fraud", "hacked", "phishing", "upi", "bank fraud", "otp", "stolen money", "cybercrime", "online fraud", "impersonation"
    ],
    title: "Cyber Fraud & Financial Recovery Protocol",
    repliedBy: "AI Legal Advocate (Cyber Defense Desk)",
    statute: "Information Technology Act 2000 • National Cyber Crime Reporting Portal (1930)",
    generateResponse: (_query: string) =>
      `### Emergency Steps for Cyber & Banking Fraud\n\n` +
      `1. **Golden Hour Action (Dial 1930):** Immediately call the National Cyber Crime Helpline **1930** or visit **cybercrime.gov.in** within 2-4 hours. Authorities can freeze fraudulent beneficiary bank accounts before funds are withdrawn.\n` +
      `2. **Notify Your Bank:** Formally report unauthorized transactions to your bank within 3 days to limit liability to zero under RBI guidelines.\n` +
      `3. **Collect Electronic Proof:** Screenshot transaction IDs, debit SMS, sender phone numbers, WhatsApp chats, and phishing URLs.\n` +
      `4. **File Cyber Cell Complaint:** Submit the incident report to your local district Cyber Crime Police Station.`
  },
  {
    id: "cheque_bounce_138",
    category: "Cheque Dishonour & Financial Recovery",
    keywords: [
      "cheque", "cheque bounce", "dishonour", "insufficient funds", "138", "negotiable instruments", "stop payment", "bank memo"
    ],
    title: "Cheque Bounce (Section 138 NI Act) Protocol",
    repliedBy: "AI Legal Advocate (Commercial Law Desk)",
    statute: "Section 138 to 142, Negotiable Instruments Act 1881",
    generateResponse: (_query: string) =>
      `### Cheque Bounce (Section 138 NI Act) Action Roadmap\n\n` +
      `1. **Obtain Return Memo:** Secure the official memo from your bank stating the reason for dishonour (e.g., "Funds Insufficient").\n` +
      `2. **Mandatory 30-Day Legal Notice:** Send a formal Statutory Demand Notice via Registered Post within 30 days of receiving the memo.\n` +
      `3. **15-Day Payment Window:** Give the drawer 15 days from notice receipt to clear the payment.\n` +
      `4. **File Criminal Complaint:** If unpaid after 15 days, file a complaint before the Judicial Magistrate within 30 days thereafter.`
  }
];

/**
 * Advanced Dynamic Response Synthesizer
 * Breaks down arbitrary user queries by intent, syntax, subject matter, and generates tailored legal guidance.
 */
export function getAutonomousLegalResponse(rawQuery: string): LegalAdvisorResult {
  if (!rawQuery || rawQuery.trim().length === 0) {
    return {
      answered: false,
      category: "General",
      repliedBy: "AI Legal Advocate",
      answer: "Please enter your question about constitutional rights, police encounters, RTI, tenant protections, or legal procedures."
    };
  }

  const query = rawQuery.toLowerCase().trim();

  // 1. Check Regex Patterns across Knowledge Base
  for (const topic of LEGAL_KNOWLEDGE_BASE) {
    if (topic.patterns) {
      for (const pattern of topic.patterns) {
        if (pattern.test(query)) {
          return {
            answered: true,
            category: topic.category,
            repliedBy: topic.repliedBy,
            statutoryReference: topic.statute,
            answer: topic.generateResponse(rawQuery)
          };
        }
      }
    }
  }

  // 2. High-scoring Keyword Matcher
  let bestMatch: LegalKnowledgeTopic | null = null;
  let highestScore = 0;

  for (const topic of LEGAL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (query.includes(kw)) {
        score += kw.length > 5 ? 3 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && highestScore >= 2) {
    return {
      answered: true,
      category: bestMatch.category,
      repliedBy: bestMatch.repliedBy,
      statutoryReference: bestMatch.statute,
      answer: bestMatch.generateResponse(rawQuery)
    };
  }

  // 3. Greetings & Salutations
  if (query.match(/^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening|who are you|what can you do|help)\b/i)) {
    return {
      answered: true,
      category: "Introduction & Capabilities",
      repliedBy: "Civic Shield AI Advocate",
      answer: 
        `### Greetings from Civic Shield AI Legal Advocate\n\n` +
        `I am your interactive legal literacy and procedural defense companion. I provide immediate, constitutionally verified guidance on:\n\n` +
        `• **Police & Traffic Encounters:** Detainment status, search limits, vehicle checks, digital document rights, and D.K. Basu arrest protocols.\n` +
        `• **RTI & Government Transparency:** Drafting information requests, 30-day deadlines, and appeal mechanisms.\n` +
        `• **Tenant & Consumer Rights:** Protection against arbitrary eviction, utility disconnections, defective goods, and e-Daakhil filing.\n` +
        `• **Pro-Se Court Representation:** Self-drafting legal memos, court appearances under Section 32 Advocates Act, and filing templates.\n\n` +
        `What specific situation or question can I help you analyze right now?`
    };
  }

  // 4. Conversational "Why" & Conceptual Inquiries
  if (query.startsWith("why") || query.includes("why do") || query.includes("why should") || query.includes("why is") || query.includes("why know")) {
    return {
      answered: true,
      category: "Civic Empowerment & Rule of Law",
      repliedBy: "AI Legal Advocate (Constitutional Jurisprudence)",
      statutoryReference: "Article 14 (Equality) • Article 21 (Right to Life) • Natural Justice",
      answer:
        `### Legal Analysis: Why Understanding This Protects You\n\n` +
        `Regarding your question: *"**${rawQuery.trim()}**"*\n\n` +
        `1. **Rule of Law vs. Arbitrary Authority:** In a constitutional democracy, no official, police officer, or private corporation has unlimited power. Every public action requires a specific legislative mandate (Article 14 & 21).\n\n` +
        `2. **The Prevention of Coercion:** Coercion relies entirely on the citizen's hesitation. When you understand statutory boundaries, you can firmly say: *"Official, I respect your duty, but please cite the section of law authorizing this request."*\n\n` +
        `3. **Proactive Documentation:** If an injustice occurs, having timestamped evidence, knowing where to file an official grievance (SP office, Consumer Forum, Magistrate), and having clean records makes holding violators accountable straightforward.\n\n` +
        `4. **Need specific steps?** Feel free to describe your situation in detail—whether it involves traffic stops, police refusal of an FIR, housing disputes, or administrative harassment!`
    };
  }

  // 5. Procedural "How" & Action Inquiries
  if (query.startsWith("how") || query.includes("how to") || query.includes("how can i") || query.includes("steps for") || query.includes("what should i do")) {
    return {
      answered: true,
      category: "Procedural Defense & Action Blueprint",
      repliedBy: "AI Legal Advocate (Procedural Desk)",
      statutoryReference: "Administrative Due Process • Civil & Criminal Procedure Codes",
      answer:
        `### Procedural Blueprint for: "${rawQuery.trim()}"\n\n` +
        `Here is the recommended Civic Shield step-by-step approach tailored to your question:\n\n` +
        `1. **Establish a Clean Fact Trail:** Record exact dates, times, badge numbers, names of officials, and document numbers. Never rely on verbal representations.\n` +
        `2. **Demand Written Communication:** If an official or counter-party makes a demand or gives an order, request it in formal writing with their official designation and seal.\n` +
        `3. **Exercise Right to Representation:** You are never required to navigate administrative tribunals alone. You can represent yourself directly under Section 32 of the Advocates Act 1961 or request free legal aid from DLSA/NALSA.\n` +
        `4. **Formal Escalation:** If public authorities fail to act, submit an RTI application under Section 6 of the RTI Act 2005 or escalate a written complaint via Registered Post.`
    };
  }

  // 6. Legality & Boundary Checks ("Can they...", "Is it legal...")
  if (query.includes("can they") || query.includes("can police") || query.includes("is it legal") || query.includes("are they allowed") || query.includes("can i")) {
    return {
      answered: true,
      category: "Statutory Authority & Limits",
      repliedBy: "AI Legal Advocate (Constitutional Boundaries Desk)",
      statutoryReference: "Doctrine of Ultra Vires • Fundamental Rights Protections",
      answer:
        `### Legal Limits & Authority Assessment\n\n` +
        `Regarding: *"**${rawQuery.trim()}**"*\n\n` +
        `1. **Principle of Statutory Authority:** Government officers and police can ONLY do what the written law specifically permits. If no statute authorizes an action, it is legally void (*Ultra Vires*).\n` +
        `2. **Your Right to Ask for Citation:** You have every legal right to calmly ask: *"Officer, please state the specific section or legal provision under which this is required."*\n` +
        `3. **Right Against Forced Waiver:** You cannot be coerced into waiving fundamental constitutional rights, including privacy (Article 21) or non-self-incrimination (Article 20(3)).\n` +
        `4. **Documenting Overreach:** If an officer insists on unlawful demands, preserve video or witness records without physical resistance and file a formal vigilance complaint.`
    };
  }

  // 7. General Synthesis for other unique queries
  return {
    answered: true,
    category: "Civic Legal Guidance",
    repliedBy: "AI Legal Advocate (Civic Knowledge Node)",
    statutoryReference: "Rule of Law • Natural Justice",
    answer: 
      `### Civic Shield Legal Guidance on: "${rawQuery.trim()}"\n\n` +
      `Here is the key constitutional and procedural framework for your query:\n\n` +
      `1. **Statutory Clarity:** In any administrative, municipal, or law enforcement interaction, you are legally entitled to know the exact rule under which any directive is given. Calmly ask: *"Under which specific legal provision is this required?"*\n` +
      `2. **Right to Documentation (Article 19(1)(a)):** Citizens have the right to maintain written, photographic, or digital records of public procedures in non-restricted public spaces.\n` +
      `3. **Protection from Arbitrary Action:** No authority can impose arbitrary penalties, detain individuals without reasonable suspicion, or force self-incrimination (Articles 14, 20(3), and 21).\n` +
      `4. **Next Steps:** If you have an active dispute, you can file an RTI for transparency, access the ready templates in our Evidence Vault, or represent yourself directly before tribunals under Section 32 of the Advocates Act 1961.`
  };
}
