import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Shield, Scale, Link2, Sparkles, Cpu, Book, Compass, Search } from "lucide-react";

interface LegalPrinciple {
  id: string;
  name: string;
  description: string;
}

interface CountryNode {
  id: string;
  name: string;
  code: string;
  x: number; // Percentage coordinate for positioning
  y: number;
  safeguardTitle: string;
  description: string;
  precedentCitations: string[];
  principles: string[]; // Principle IDs connected to this country
}

const LEGAL_PRINCIPLES: LegalPrinciple[] = [
  { id: "due-process", name: "Due Process & Natural Justice", description: "The supreme requirement that administrative actions must remain procedurally fair and hear both parties." },
  { id: "habeas-corpus", name: "Habeas Corpus Writ Protection", description: "The historical constitutional demand that prevents illegal detentions by producing prisoners before a judge." },
  { id: "privacy-immunity", name: "Device & Digital Privacy Immunity", description: "Absolute immunity protecting citizens and local nodes from arbitrary searches, device seizures, and warrantless surveillance." },
  { id: "info-freedom", name: "Right to Information & Certified Copies", description: "Sovereign rights forcing local public officers to deliver certified budget logs and public correspondence upon application." },
  { id: "dignity-charter", name: "Inviolable Human Dignity Covenant", description: "Primary constitutional protection that anchors all physical, mental, and spatial safety as completely immune to state overreach." }
];

const COUNTRY_NODES: CountryNode[] = [
  {
    id: "us",
    name: "United States",
    code: "US_JURIS_SEC_01",
    x: 18,
    y: 35,
    safeguardTitle: "4th & 5th Amendment Matrices",
    description: "Rigid due process protection and absolute warrants requirement for searching or seizing digital correspondence, personal devices, and spatial quarters.",
    precedentCitations: ["Katz v. United States (Expectation of Privacy)", "Carpenter v. US (Cell Site Location Records)"],
    principles: ["due-process", "privacy-immunity", "habeas-corpus"]
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "UK_JURIS_SEC_02",
    x: 48,
    y: 24,
    safeguardTitle: "Magna Carta Rule of Law",
    description: "The supreme binding covenant stating that no sovereign or public authority is above judicial review, establishing Natural Justice for all administrative codes.",
    precedentCitations: ["R (Miller) v Prime Minister (Prerogative Overreach)", "Entick v Carrington (Trespass by State Officers)"],
    principles: ["due-process", "habeas-corpus"]
  },
  {
    id: "de",
    name: "Germany",
    code: "DE_JURIS_SEC_03",
    x: 55,
    y: 30,
    safeguardTitle: "Grundgesetz (Basic Law) Art. 1",
    description: "Human dignity is inviolable. Standardized structural constitutional rights that bind all public administration directly as actionable statutory laws.",
    precedentCitations: ["Census Act Case (Informational Self-Determination)", "BVerfG (Warrantless Online Searches Restriction)"],
    principles: ["privacy-immunity", "dignity-charter", "due-process"]
  },
  {
    id: "in",
    name: "India",
    code: "IN_JURIS_SEC_04",
    x: 72,
    y: 52,
    safeguardTitle: "Article 21 Fundamental Core",
    description: "The right to life and personal liberty, interpreted dynamically to include privacy, speedy trials, and absolute protection against arbitrary detention.",
    precedentCitations: ["K.S. Puttaswamy v. Union of India (Fundamental Privacy)", "A.K. Gopalan v. State of Madras (Due Process Limits)"],
    principles: ["due-process", "habeas-corpus", "privacy-immunity", "dignity-charter"]
  },
  {
    id: "za",
    name: "South Africa",
    code: "ZA_JURIS_SEC_05",
    x: 54,
    y: 78,
    safeguardTitle: "Ubuntu Constitutional Charter",
    description: "Immersive post-apartheid framework asserting restorative justice, physical security, and absolute access to official data logs held by administrative boards.",
    precedentCitations: ["S v Makwanyane (Inviolable Dignity Protection)", "Biowatch Trust v Registrar (Cost Protections for Public Rights)"],
    principles: ["dignity-charter", "info-freedom", "due-process"]
  },
  {
    id: "br",
    name: "Brazil",
    code: "BR_JURIS_SEC_06",
    x: 34,
    y: 68,
    safeguardTitle: "Habeas Data Constitutional Act",
    description: "The specific procedural action allowing citizens to compel the state to disclose, verify, or correct any private information compiled in state-run dossiers.",
    precedentCitations: ["STF ADI 6529 (Protections of Personal Correspondence)", "Habeas Data Writ Act No. 9507"],
    principles: ["info-freedom", "privacy-immunity", "habeas-corpus"]
  },
  {
    id: "jp",
    name: "Japan",
    code: "JP_JURIS_SEC_07",
    x: 88,
    y: 42,
    safeguardTitle: "Shōwa Sovereign Liberty",
    description: "Article 31 and 35 protections asserting due process under the law, preventing house entries, searches, and device seizures except under explicit judicial warrants.",
    precedentCitations: ["Supreme Court (Warrantless GPS Surveillance Strike)", "Article 35 (Absolute Warrants Clause)"],
    principles: ["due-process", "privacy-immunity"]
  }
];

export default function ConstitutionalNetwork() {
  const [selectedCountry, setSelectedCountry] = useState<CountryNode>(COUNTRY_NODES[0]);
  const [hoveredCountry, setHoveredCountry] = useState<CountryNode | null>(null);
  const [activePrincipleFilter, setActivePrincipleFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter countries based on search and principle filters
  const filteredCountries = COUNTRY_NODES.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.safeguardTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activePrincipleFilter) {
      return matchesSearch && c.principles.includes(activePrincipleFilter);
    }
    return matchesSearch;
  });

  // Check if a line should glow based on filters and selections
  const getLineGlowClass = (c1: CountryNode, c2: CountryNode) => {
    // If a principle is filtered, do they both share it?
    if (activePrincipleFilter) {
      if (c1.principles.includes(activePrincipleFilter) && c2.principles.includes(activePrincipleFilter)) {
        return "stroke-[#d4af37] stroke-[1.5] opacity-90 shadow-[0_0_10px_#d4af37] stroke-dasharray-[6_3] animate-[dashSweep_15s_linear_infinite]";
      }
      return "stroke-gray-800/25 stroke-[0.5] opacity-10";
    }

    // Is one of them hovered or selected?
    const isRelated = hoveredCountry?.id === c1.id || hoveredCountry?.id === c2.id || selectedCountry.id === c1.id || selectedCountry.id === c2.id;
    if (isRelated) {
      // Do they share any common principles?
      const shared = c1.principles.filter(p => c2.principles.includes(p));
      if (shared.length > 0) {
        return "stroke-[#d4af37]/60 stroke-[1] opacity-75 animate-pulse";
      }
    }

    return "stroke-[#d4af37]/15 stroke-[0.5] opacity-40";
  };

  return (
    <section
      id="constitutional-network"
      className="py-24 bg-gradient-to-b from-[#001a4d] to-[#000d26] border-t border-b border-[#d4af37]/25 relative overflow-hidden font-sans"
    >
      {/* Background blueprint details */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.06] pointer-events-none" />

      {/* Decorative Technical Grid Coordinate Crosses */}
      <div className="absolute top-12 left-12 font-mono text-[7px] text-[#d4af37]/30 select-none pointer-events-none hidden sm:block">
        GRID_REF: CON_NET_v2.1
      </div>
      <div className="absolute bottom-12 right-12 font-mono text-[7px] text-[#d4af37]/30 select-none pointer-events-none hidden sm:block">
        CORE_LOAD_OK: FIREBASE_BLUEPRINT
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-[#d4af37] leading-none mb-4">
            <Globe className="w-3.5 h-3.5 animate-spin-slow" /> Sovereign Global Map
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-3">
            Digital Constitutional <span className="text-[#d4af37] font-serif not-italic font-bold">Network</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto font-light">
            We do not run standard maps. Our interactive digital net links global sovereign administrative statutes together by core legal principles. Tap nodes or filters to decrypt the network connections.
          </p>
        </div>

        {/* Dynamic Controls / Filters row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-4xl mx-auto">
          <button
            onClick={() => setActivePrincipleFilter(null)}
            className={`px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider uppercase border transition-all cursor-pointer ${
              activePrincipleFilter === null
                ? "bg-[#d4af37] border-[#d4af37] text-[#000d26] font-bold shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                : "bg-black/60 border-gray-800 text-gray-400 hover:border-[#d4af37]/45 hover:text-white"
            }`}
          >
            Show All Safeguards
          </button>
          
          {LEGAL_PRINCIPLES.map((principle) => {
            const isActive = activePrincipleFilter === principle.id;
            return (
              <button
                key={principle.id}
                onClick={() => setActivePrincipleFilter(principle.id)}
                className={`px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
                    : "bg-black/60 border-gray-800 text-gray-400 hover:border-[#d4af37]/45 hover:text-white"
                }`}
                title={principle.description}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#d4af37] animate-ping" : "bg-gray-500"}`} />
                {principle.name.split(" & ")[0]}
              </button>
            );
          })}
        </div>

        {/* Main Content Split Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: DIGITAL GRAPHICS NETWORK BOX (7 Cols) */}
          <div className="lg:col-span-8 bg-black/85 rounded-sm border border-gray-800 relative h-[380px] sm:h-[500px] overflow-hidden flex flex-col justify-between p-4 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.9)]">
            
            {/* Holographic grid and compass overlay lines */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
            <div className="absolute inset-4 border border-dashed border-gray-900 pointer-events-none" />
            
            {/* Compass Rings Underlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-[#d4af37]">
              <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-current animate-spin-slow" />
              <div className="absolute inset-10 border border-dashed border-current rounded-full" />
              <div className="absolute inset-24 border border-current rounded-full" />
            </div>

            {/* Network Interactive Search */}
            <div className="relative z-20 max-w-xs">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Decrypt sector query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/90 border border-gray-800 focus:border-[#d4af37] focus:outline-none text-[10px] font-mono text-white placeholder-gray-600 rounded-sm pl-8 pr-3 py-1.5 tracking-wider uppercase transition-all"
                />
              </div>
            </div>

            {/* THE FLOATING CONSTELLATION INTERFACE */}
            <div className="absolute inset-0 z-15">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* 1. DRAW CONNECTING NETWORK PRINCIPLE CHANNELS */}
                {COUNTRY_NODES.map((countryA, idxA) => {
                  return COUNTRY_NODES.slice(idxA + 1).map((countryB, idxB) => {
                    const lineClass = getLineGlowClass(countryA, countryB);
                    return (
                      <line
                        key={`${countryA.id}-${countryB.id}`}
                        x1={countryA.x}
                        y1={countryA.y}
                        x2={countryB.x}
                        y2={countryB.y}
                        className={lineClass}
                        style={{ transition: "stroke 0.4s, stroke-width 0.4s, opacity 0.4s" }}
                      />
                    );
                  });
                })}
              </svg>

              {/* 2. PLOT COUNTRY NODES (ABSOLUTELY POSITIONED REACT DOM LAYERS FOR SMOOTH INTERACTION) */}
              {COUNTRY_NODES.map((country) => {
                const isSelected = selectedCountry.id === country.id;
                const isHovered = hoveredCountry?.id === country.id;
                const isFilteredOut = filteredCountries.find(f => f.id === country.id) === undefined;
                
                // If a global principle filter is active, highlight if it matches
                const matchesActiveFilter = activePrincipleFilter ? country.principles.includes(activePrincipleFilter) : false;

                return (
                  <div
                    key={country.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
                    style={{ 
                      left: `${country.x}%`, 
                      top: `${country.y}%`,
                      opacity: isFilteredOut ? 0.25 : 1,
                      transition: "opacity 0.4s, transform 0.3s"
                    }}
                    onClick={() => setSelectedCountry(country)}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    {/* Glowing radar rings */}
                    <AnimatePresence>
                      {(isSelected || isHovered || matchesActiveFilter) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.65, scale: 1.4 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                          className={`absolute inset-0 -m-3 rounded-full border ${
                            matchesActiveFilter 
                              ? "border-[#d4af37] shadow-[0_0_8px_#d4af37]" 
                              : isSelected 
                                ? "border-[#d4af37]" 
                                : "border-gray-500/55"
                          }`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Node Core Core Graphic */}
                    <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border rotate-45 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-[#d4af37] border-[#d4af37] text-[#000d26] scale-125 shadow-[0_0_12px_#d4af37]"
                        : matchesActiveFilter
                          ? "bg-[#d4af37]/35 border-[#d4af37] text-[#d4af37] scale-110 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                          : isHovered
                            ? "bg-[#001233] border-[#d4af37] text-white scale-110 shadow-[0_0_8px_rgba(212,175,55,0.25)]"
                            : "bg-[#000a1a] border-gray-700 text-gray-500"
                    }`}>
                      {/* Very tiny bullet dot */}
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-black" : "bg-current"}`} />
                    </div>

                    {/* Country Tooltip Title */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
                      <div className={`px-2 py-0.5 text-[8px] sm:text-[9.5px] font-mono tracking-wider uppercase rounded-sm border transition-all duration-300 ${
                        isSelected
                          ? "bg-[#d4af37] text-black border-[#d4af37] font-bold"
                          : isHovered
                            ? "bg-black/95 text-white border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                            : "bg-black/80 text-gray-400 border-transparent"
                      }`}>
                        {country.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Panel Map Legends */}
            <div className="relative z-20 flex justify-between items-end font-mono text-[8px] text-gray-500">
              <div className="space-y-0.5">
                <div>COORD_INDEX: {selectedCountry ? `${selectedCountry.x}° E, ${selectedCountry.y}° N` : "SCANNING_ACTIVE"}</div>
                <div>SYSTEM_NET_OK: SECTOR_7_STABLE</div>
              </div>
              <div className="text-right space-y-0.5 uppercase tracking-wider text-[#d4af37]/65">
                <div>* Hover coordinates to highlight nodes *</div>
                <div>* Network nodes express constitutional covenances *</div>
              </div>
            </div>
          </div>

          {/* RIGHT: CLASSIFIED ARCHIVE DATA PANEL (4 Cols) */}
          <div className="lg:col-span-4 bg-[#001233]/90 border border-gray-800 rounded-sm p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Decorative blueprint corners */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#d4af37]/35" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#d4af37]/35" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#d4af37]/35" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#d4af37]/35" />

            <div>
              {/* Heading sector coordinates */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3.5 mb-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold flex items-center gap-1.5 leading-none">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" /> Archive Decryption
                </span>
                <span className="font-mono text-[8.5px] text-gray-500 font-bold uppercase tracking-wider">
                  {selectedCountry.code}
                </span>
              </div>

              {/* Node Country Title */}
              <div className="space-y-1 mb-5">
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                  {selectedCountry.name}
                </h3>
                <p className="font-mono text-[10px] text-[#d4af37] tracking-widest uppercase font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> {selectedCountry.safeguardTitle}
                </p>
              </div>

              {/* Safeguard Description */}
              <div className="space-y-2 mb-6">
                <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500 block">Sovereign Declaration</span>
                <p className="text-xs text-gray-200 leading-relaxed font-light">
                  {selectedCountry.description}
                </p>
              </div>

              {/* Shared connections */}
              <div className="space-y-2.5 mb-6">
                <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500 block">System Connected Safegaurds</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCountry.principles.map((pId) => {
                    const principle = LEGAL_PRINCIPLES.find(p => p.id === pId);
                    return (
                      <span
                        key={pId}
                        className={`text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                          activePrincipleFilter === pId
                            ? "bg-[#d4af37] text-black border-[#d4af37] font-bold"
                            : "bg-black/50 text-[#d4af37]/85 border-gray-800"
                        }`}
                      >
                        {principle ? principle.name.split(" & ")[0] : pId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Legal Precedents */}
              <div className="space-y-3.5 pt-4 border-t border-gray-800">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Book className="w-3.5 h-3.5" /> Classified Precedents
                </span>
                
                <div className="space-y-2.5">
                  {selectedCountry.precedentCitations.map((cit, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 bg-black/40 border border-gray-800/80 rounded-sm relative flex gap-2 items-start"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-mono font-bold text-gray-400 block mb-0.5">CIT_PRECEDENT_0{idx + 1}</span>
                        <span className="text-gray-200 italic font-medium">{cit.split(" (")[0]}</span>
                        <span className="text-gray-400"> {cit.includes(" (") ? `(${cit.split(" (")[1]}` : ""}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mt-8 pt-4 border-t border-gray-800">
              <a
                href="#justice-shield"
                className="w-full py-2 bg-gradient-to-r from-black via-[#d4af37]/10 to-black hover:via-[#d4af37]/20 border border-[#d4af37]/25 hover:border-[#d4af37]/65 text-white hover:text-[#d4af37] rounded-sm font-mono text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Scale className="w-3.5 h-3.5 text-[#d4af37]" /> Access Handbook Statute Codifications
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
