import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Cpu, 
  Activity, 
  Terminal, 
  Eye, 
  EyeOff, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Database, 
  Lock, 
  Unlock, 
  CheckCircle, 
  RefreshCw,
  AlertTriangle,
  Play,
  Layers,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Predefined legal nodes for the Quantum Scythe Decryptor
const SCAN_TEMPLATES = [
  {
    name: "Article 21: Life & Liberty Shield",
    code: "ART_21_CONSTITUTION_IN",
    securityLevel: "LEVEL_5_SOVEREIGN",
    payload: "RIGHT_TO_PRIVACY // PROTECTION_AGAINST_ILLEGAL_SEARCH // PUTTASWAMY_MANDATE",
    output: [
      "STATUS: SEIZURE_IMMUNIZATION_ACTIVE",
      "DECRYPTED: No executive officer or inspector can force device decryption or passcode disclosures without a judicial search warrant.",
      "CIVIC_SHIELD_ADVISORY: In case of warrantless checkpoint inspection, demand written panchnama detailing the probable cause of search."
    ]
  },
  {
    name: "Section 32: Advocates Act (Pro Se)",
    code: "SEC_32_ADVOCATES_1961",
    securityLevel: "LEVEL_4_PROCEDURAL",
    payload: "PARTY_IN_PERSON_REPRESENTATION // REMOVAL_OF_PRIVATE_COUNSEL_EXCLUSIVITY",
    output: [
      "STATUS: SELF_ADVOCACY_GRANTED",
      "DECRYPTED: Any citizen can represent their own case before high courts or municipal bodies as a Party-In-Person.",
      "CIVIC_SHIELD_ADVISORY: You do not need expensive private attorneys. Prepare your drafts in standard formats and address judges directly."
    ]
  },
  {
    name: "Natural Justice: Audi Alteram Partem",
    code: "AUDI_ALTERAM_PARTEM_SHIELD",
    securityLevel: "LEVEL_5_DUE_PROCESS",
    payload: "MUNICIPAL_SHOW_CAUSE_AUDIT // PRE_DEMOLITION_HEARING_MANDATE",
    output: [
      "STATUS: ADMINISTRATIVE_BAR_ACTIVE",
      "DECRYPTED: No local administrative or municipal authority can demolish, seal, or attach your home without a prior written notice.",
      "CIVIC_SHIELD_ADVISORY: Standard compliance mandates a minimum 15-day prior notice to file your official objections."
    ]
  },
  {
    name: "RTI Act: Public Asset Inquest",
    code: "SEC_6_RTI_ACT_2005",
    securityLevel: "LEVEL_3_TRANSPARENCY",
    payload: "BUDGET_DISBURSEMENT_AUDIT // PIO_RESPONSE_CLOCK",
    output: [
      "STATUS: TRANSPARENCY_BURST_OK",
      "DECRYPTED: PIOs must deliver certified copies of contracts, municipal logs, or budget maps within 30 days of application.",
      "CIVIC_SHIELD_ADVISORY: No justification is required to file an RTI request. Keep applications narrow, focusing on line-item budgets."
    ]
  }
];

export default function CyberHUD() {
  // Global Viewport Elements Control
  const [hudActive, setHudActive] = useState(true);
  const [bracketsActive, setBracketsActive] = useState(true);
  const [railsActive, setRailsActive] = useState(true);

  // Stats State
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [integrityRate, setIntegrityRate] = useState(100);
  const [secPulse, setSecPulse] = useState(true);
  const [scanlinesActive, setScanlinesActive] = useState(false);
  const [threadCount, setThreadCount] = useState(4);

  // Monitor Minimization
  const [isMonitorMinimized, setIsMonitorMinimized] = useState(false);

  // Quantum Decryptor States
  const [isDecryptorOpen, setIsDecryptorOpen] = useState(false);
  const [selectedScan, setSelectedScan] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [decryptionSuccess, setDecryptionSuccess] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Control Hub Settings menu
  const [isControlMenuOpen, setIsControlMenuOpen] = useState(false);

  // Initialize and run real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toISOString().slice(0, 10));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Soft random oscillations for dynamic high-tech statistics
  useEffect(() => {
    const statInterval = setInterval(() => {
      setIntegrityRate(prev => {
        const delta = Math.random() > 0.5 ? 0.04 : -0.04;
        return parseFloat(Math.min(100, Math.max(99.3, prev + delta)).toFixed(2));
      });
      setSecPulse(p => !p);
      setThreadCount(prev => {
        if (Math.random() > 0.8) {
          const shift = Math.random() > 0.5 ? 1 : -1;
          return Math.min(8, Math.max(2, prev + shift));
        }
        return prev;
      });
    }, 2800);
    return () => clearInterval(statInterval);
  }, []);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Handler to run scifi simulation of legal scan decryption
  const handleInitiateScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setDecryptionSuccess(false);
    setScanStep(1);
    setTerminalLogs([]);

    const template = SCAN_TEMPLATES[selectedScan];
    const logs = [
      `[SYS_LOG] INITIALIZING COGNITIVE INTERCEPT PORT: 3000...`,
      `[SYS_LOG] ESTABLISHING CIVIL SECURE CHANNEL ENCRYPTED RSA-4096`,
      `[SECURITY_SHIELD] CHECKING PROTOCOL INTEGRITY... STATUS: ${integrityRate}%`,
      `[DECRYPTOR] ATTEMPTING INQUEST ON NODAL CODE: [${template.code}]`,
      `[DECRYPTOR] BYPASSING MUNICIPAL OBFUSCATION MATRIX...`,
      `[DATA_LINK] EXTRACTING METADATA: ${template.payload}`,
      `[ANALYSIS] COMPILED JURISDICTION PROTOCOLS // ${template.securityLevel}`
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        // Completed initial check, start finalizing
        setScanStep(2);
        setTimeout(() => {
          setTerminalLogs(prev => [
            ...prev,
            `[SYS_LOG] DECRYPTION COMPLETE. PARSING CONSTITUTIONAL SAFEGUARDS...`
          ]);
          setDecryptionSuccess(true);
          setIsScanning(false);
          setScanStep(3);
        }, 1200);
      }
    }, 450);
  };

  return (
    <>
      {/* 1. SCIFI CORNER BRACKETS */}
      {bracketsActive && (
        <div className="fixed inset-0 pointer-events-none z-[40] select-none">
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/30 rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/30 rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/30 rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/30 rounded-br-sm" />
        </div>
      )}

      {/* 2. LEFT DESKTOP HUD RAIL */}
      {railsActive && (
        <div className="fixed left-4 top-24 bottom-24 w-12 hidden xl:flex flex-col items-center justify-between pointer-events-none z-[40] select-none text-[#d4af37]/35 font-mono text-[8px] tracking-widest">
          <div className="flex flex-col items-center gap-1">
            <Shield className="w-4 h-4 text-[#d4af37]/45 animate-pulse" />
            <div className="writing-mode-vertical uppercase font-semibold">ALLIANCE_LINK</div>
          </div>
          
          <div className="h-24 w-[1px] bg-gradient-to-b from-[#d4af37]/10 via-[#d4af37]/25 to-[#d4af37]/10 flex flex-col justify-between py-1">
            <div className="w-1.5 h-[1px] bg-[#d4af37]/40 -ml-[2px]" />
            <div className="w-1 h-[1px] bg-[#d4af37]/20 -ml-[1.5px]" />
            <div className="w-1.5 h-[1px] bg-[#d4af37]/40 -ml-[2px]" />
          </div>

          <div className="flex flex-col items-center gap-1.5 font-bold">
            <div className="text-[7px]">UTC</div>
            <div className="text-[8px] bg-[#d4af37]/10 px-1 py-0.5 rounded-sm border border-[#d4af37]/25 text-white">
              {timeStr.slice(0, 5) || "00:00"}
            </div>
          </div>
        </div>
      )}

      {/* 3. RIGHT DESKTOP HUD RAIL */}
      {railsActive && (
        <div className="fixed right-4 top-24 bottom-24 w-12 hidden xl:flex flex-col items-center justify-between pointer-events-none z-[40] select-none text-[#d4af37]/35 font-mono text-[8px] tracking-widest">
          <div className="flex flex-col items-center gap-1 font-bold">
            <div className="text-white text-[7px] tracking-wide">SEC_STAT</div>
            <div className="flex items-center gap-1 text-[7px] text-[#00ffcc]">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#00ffcc] ${secPulse ? 'animate-ping' : ''}`} />
              <span>ACT</span>
            </div>
          </div>

          <div className="h-24 w-[1px] bg-gradient-to-b from-[#d4af37]/10 via-[#d4af37]/25 to-[#d4af37]/10 flex flex-col justify-between py-1">
            <div className="w-1.5 h-[1px] bg-[#d4af37]/40 -ml-[2px]" />
            <div className="w-1 h-[1px] bg-[#d4af37]/20 -ml-[1.5px]" />
            <div className="w-1.5 h-[1px] bg-[#d4af37]/40 -ml-[2px]" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="writing-mode-vertical uppercase text-[7px] text-[#d4af37]/25">STT_VER_v2.0</div>
            <Cpu className="w-4 h-4 text-[#d4af37]/25" />
          </div>
        </div>
      )}

      {/* 4. REALTIME FLOATING SYSTEM MONITOR HUD (Collapsible) */}
      <AnimatePresence>
        {hudActive && (
          <div 
            id="matrix-hud-card"
            className="fixed bottom-6 left-6 z-[45] hidden md:flex flex-col transition-all duration-300 pointer-events-auto"
          >
            {isMonitorMinimized ? (
              /* Minimized Floating Cog / Node */
              <motion.button
                layoutId="matrix-hud-container"
                onClick={() => setIsMonitorMinimized(false)}
                whileHover={{ scale: 1.05, borderColor: "rgba(212, 175, 55, 0.8)" }}
                className="flex items-center gap-2 p-2.5 rounded-sm border border-[#d4af37]/40 bg-[#001233]/95 backdrop-blur-md shadow-2xl text-[#d4af37] cursor-pointer"
              >
                <Activity className="w-4 h-4 text-[#00ffcc] animate-pulse" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white">RESTORE HUD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-ping" />
              </motion.button>
            ) : (
              /* Expanded HUD Panel */
              <motion.div
                layoutId="matrix-hud-container"
                className="flex flex-col p-3 rounded-sm border border-[#d4af37]/25 bg-[#001233]/95 backdrop-blur-md w-72 text-left shadow-2xl hover:border-[#d4af37]/50 transition-all duration-300"
              >
                {/* Header controls */}
                <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                    <div>
                      <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">HUD Matrix Link</h4>
                      <p className="text-[7.5px] font-mono text-[#00ffcc] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse" />
                        <span>SECURE PORT 3000</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Control Actions */}
                  <div className="flex items-center gap-1">
                    {/* Scanlines toggle */}
                    <button
                      onClick={() => setScanlinesActive(!scanlinesActive)}
                      title="Toggle Holographic Scanlines"
                      className="p-1 rounded-sm bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/20 text-[#d4af37] hover:text-white transition-all cursor-pointer"
                    >
                      {scanlinesActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>

                    {/* Minimize button */}
                    <button
                      onClick={() => setIsMonitorMinimized(true)}
                      title="Minimize HUD to System Tray"
                      className="p-1 rounded-sm bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/20 text-[#d4af37] hover:text-white transition-all cursor-pointer"
                    >
                      <Minimize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Real-time metrics grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[8px] text-gray-300 mb-2">
                  <div>
                    <span className="text-[#d4af37]/50 font-bold">SYS_DATE:</span> <span className="text-white">{dateStr || "2026-07-10"}</span>
                  </div>
                  <div>
                    <span className="text-[#d4af37]/50 font-bold">UTC_TIME:</span> <span className="text-white">{timeStr || "00:00:00"}</span>
                  </div>
                  <div>
                    <span className="text-[#d4af37]/50 font-bold">LIT_INTEG:</span> <span className="text-[#00ffcc] font-bold">{integrityRate}%</span>
                  </div>
                  <div>
                    <span className="text-[#d4af37]/50 font-bold">THREADS:</span> <span className="text-white">0{threadCount} LINKS</span>
                  </div>
                </div>

                {/* Cyber HUD Control Panel Toggle */}
                <div className="border-t border-[#d4af37]/15 pt-2 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setIsDecryptorOpen(!isDecryptorOpen)}
                    className="flex-1 py-1 px-2 rounded-sm bg-[#d4af37]/15 border border-[#d4af37]/35 text-white hover:bg-[#d4af37] hover:text-[#001233] transition-all text-[8px] font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Terminal className="w-2.5 h-2.5" />
                    <span>{isDecryptorOpen ? "CLOSE DECRYPTOR" : "OPEN DECRYPTOR"}</span>
                  </button>

                  <button
                    onClick={() => setIsControlMenuOpen(!isControlMenuOpen)}
                    title="Interface Settings"
                    className="p-1 rounded-sm bg-[#00173d] hover:bg-[#d4af37]/20 border border-[#d4af37]/20 text-[#d4af37] hover:text-white transition-all cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* 5. INTERACTIVE HIGH-TECH QUANTUM CIVIC DECRYPTOR (Newer Different Scifi Thing!) */}
      <AnimatePresence>
        {isDecryptorOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-[48] flex flex-col w-80 sm:w-[350px] p-4 rounded-sm border border-[#d4af37]/35 bg-[#000a20]/95 backdrop-blur-md shadow-2xl text-left text-white font-mono pointer-events-auto select-none"
          >
            {/* Scifi Header */}
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#d4af37] animate-pulse" />
                <div>
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Quantum Civic Decryptor</h3>
                  <p className="text-[7px] text-[#00ffcc] tracking-widest">DE-OBFUSCATING STATUTORY CODES</p>
                </div>
              </div>

              <button
                onClick={() => setIsDecryptorOpen(false)}
                className="p-1 text-[#d4af37]/70 hover:text-white hover:bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm transition-all cursor-pointer"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>

            {/* Selector Field */}
            <div className="space-y-1 mb-3">
              <label className="text-[8px] text-[#d4af37]/80 uppercase tracking-widest block">Select Statute Vector</label>
              <div className="flex gap-2">
                <select
                  value={selectedScan}
                  onChange={(e) => {
                    setSelectedScan(Number(e.target.value));
                    setDecryptionSuccess(false);
                    setTerminalLogs([]);
                    setScanStep(0);
                  }}
                  disabled={isScanning}
                  className="flex-1 bg-[#001233] border border-[#d4af37]/25 text-white font-mono text-[9px] rounded-sm p-1.5 focus:outline-none focus:border-[#d4af37]"
                >
                  {SCAN_TEMPLATES.map((tmpl, idx) => (
                    <option key={idx} value={idx}>{tmpl.name}</option>
                  ))}
                </select>

                <button
                  onClick={handleInitiateScan}
                  disabled={isScanning}
                  className="px-3 bg-[#d4af37]/20 hover:bg-[#d4af37] border border-[#d4af37] text-white hover:text-[#001233] rounded-sm text-[9px] font-bold tracking-wider transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1"
                >
                  {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  <span>SCAN</span>
                </button>
              </div>
            </div>

            {/* Interactive Scanning HUD Console Screen */}
            <div className="h-32 bg-black/75 rounded-sm border border-gray-800 p-2.5 overflow-y-auto font-mono text-[8.5px] leading-relaxed select-text flex flex-col gap-1 mb-3 shadow-inner">
              {terminalLogs.length === 0 && (
                <div className="text-gray-500 italic text-center py-8">
                  SELECT STATUTE AND CLICK SECURE SCAN TO DECRYPT PROCEDURAL TRUTHS...
                </div>
              )}
              {terminalLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={
                    log && log.includes("STATUS:") 
                      ? "text-[#00ffcc]" 
                      : log && log.includes("DECRYPTOR") 
                        ? "text-[#d4af37]" 
                        : log && log.includes("[SECURITY_SHIELD]")
                          ? "text-blue-400"
                          : "text-gray-400"
                  }
                >
                  {log}
                </div>
              ))}
              
              {/* Animated Progress Loader Bar */}
              {isScanning && (
                <div className="space-y-1 py-1">
                  <div className="flex justify-between text-[7px] text-gray-500">
                    <span>DECRYPT_PROGRESS:</span>
                    <span>{scanStep === 1 ? "45%" : "85%"}</span>
                  </div>
                  <div className="h-1 bg-gray-900 rounded-full overflow-hidden border border-[#d4af37]/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: scanStep === 1 ? "45%" : "85%" }}
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#00ffcc]"
                    />
                  </div>
                </div>
              )}

              <div ref={terminalBottomRef} />
            </div>

            {/* Decoded Output Reveal */}
            <AnimatePresence>
              {decryptionSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#00173d] border border-[#d4af37]/35 rounded-sm p-3 space-y-2 text-left"
                >
                  <div className="flex items-center justify-between text-[8px] border-b border-[#d4af37]/15 pb-1">
                    <span className="text-[#00ffcc] font-bold flex items-center gap-1">
                      <Unlock className="w-2.5 h-2.5" /> DECRYPTED_INTEGRITY
                    </span>
                    <span className="text-[#d4af37]">{SCAN_TEMPLATES[selectedScan].securityLevel}</span>
                  </div>

                  <div className="space-y-1.5 text-[9px] leading-relaxed">
                    <p className="text-white font-bold">{SCAN_TEMPLATES[selectedScan].output[1]}</p>
                    <p className="text-gray-300 font-light border-l-2 border-[#d4af37]/30 pl-1.5">{SCAN_TEMPLATES[selectedScan].output[2]}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. SYSTEM CONTROLLER MENU MODAL */}
      <AnimatePresence>
        {isControlMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <div className="w-full max-w-sm rounded-sm border border-[#d4af37]/35 bg-[#001233]/95 p-5 text-left text-white font-mono relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">HUD CONTROL SWITCHBOARD</h3>
                </div>
                <button
                  onClick={() => setIsControlMenuOpen(false)}
                  className="text-xs text-gray-400 hover:text-white uppercase tracking-wider transition-all cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                Customize your high-tech tactical view of The Civic Shield portal. Toggle real-time sensors, telemetry rails, and structural layout overlays on/off instantly.
              </p>

              <div className="space-y-3 mb-5">
                {/* 1. Toggle Bottom Left HUD */}
                <div className="flex items-center justify-between bg-black/40 p-2 border border-gray-800 rounded-sm">
                  <div>
                    <span className="text-[9px] font-bold text-white uppercase">Matrix Monitor Block</span>
                    <p className="text-[7.5px] text-gray-500">Pulsing stats link in bottom-left</p>
                  </div>
                  <button
                    onClick={() => setHudActive(!hudActive)}
                    className={`py-1 px-3 rounded-sm text-[8px] font-bold font-mono transition-all uppercase cursor-pointer border ${
                      hudActive 
                        ? "bg-[#d4af37]/15 border-[#d4af37] text-white" 
                        : "bg-[#000]/40 border-gray-700 text-gray-500"
                    }`}
                  >
                    {hudActive ? "ONLINE" : "OFFLINE"}
                  </button>
                </div>

                {/* 2. Toggle Left & Right Telemetry Rails */}
                <div className="flex items-center justify-between bg-black/40 p-2 border border-gray-800 rounded-sm">
                  <div>
                    <span className="text-[9px] font-bold text-white uppercase">Sovereign Viewport Rails</span>
                    <p className="text-[7.5px] text-gray-500">Vertical digital bars in left/right gutters</p>
                  </div>
                  <button
                    onClick={() => setRailsActive(!railsActive)}
                    className={`py-1 px-3 rounded-sm text-[8px] font-bold font-mono transition-all uppercase cursor-pointer border ${
                      railsActive 
                        ? "bg-[#d4af37]/15 border-[#d4af37] text-white" 
                        : "bg-[#000]/40 border-gray-700 text-gray-500"
                    }`}
                  >
                    {railsActive ? "ONLINE" : "OFFLINE"}
                  </button>
                </div>

                {/* 3. Toggle Corner Brackets */}
                <div className="flex items-center justify-between bg-black/40 p-2 border border-gray-800 rounded-sm">
                  <div>
                    <span className="text-[9px] font-bold text-white uppercase">Symmetric Corner Brackets</span>
                    <p className="text-[7.5px] text-gray-500">Gilded border brackets on outer viewport</p>
                  </div>
                  <button
                    onClick={() => setBracketsActive(!bracketsActive)}
                    className={`py-1 px-3 rounded-sm text-[8px] font-bold font-mono transition-all uppercase cursor-pointer border ${
                      bracketsActive 
                        ? "bg-[#d4af37]/15 border-[#d4af37] text-white" 
                        : "bg-[#000]/40 border-gray-700 text-gray-500"
                    }`}
                  >
                    {bracketsActive ? "ONLINE" : "OFFLINE"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/15">
                <span className="text-[7.5px] text-gray-500">COGNITIVE HUB v2.0 // DEEP INTEGRATION</span>
                <button
                  onClick={() => {
                    setHudActive(true);
                    setBracketsActive(true);
                    setRailsActive(true);
                    setScanlinesActive(false);
                    setIsMonitorMinimized(false);
                  }}
                  className="text-[#00ffcc] hover:text-white text-[8px] font-bold uppercase transition-all"
                >
                  RESET DEFAULTS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. IMMERSIVE SCANLINE CRT HOLO EFFECT */}
      <AnimatePresence>
        {scanlinesActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden animate-pulse"
            style={{ animationDuration: "10s" }}
          >
            {/* Fine horizontal scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]" />
            {/* Soft scanline flicker vignette */}
            <div className="absolute inset-0 bg-radial-vignette opacity-20 mix-blend-overlay" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
