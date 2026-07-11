import React, { useEffect, useRef, useState } from "react";
import { Shield, ArrowRight, Compass, Eye, EyeOff, Scale, Gavel, BookOpen, FileText, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntroGateProps {
  onEnter: (sectionId?: string) => void;
}

interface InteractiveNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  label: string;
  alpha: number;
  baseAlpha: number;
}

export default function IntroGate({ onEnter }: IntroGateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transitActive, setTransitActive] = useState(false);
  const [interactiveGrid, setInteractiveGrid] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const [scaleTilt, setScaleTilt] = useState(0); // Tilts based on mouse position

  // Inject classical legal aesthetics keyframes
  useEffect(() => {
    const styleId = "legal-sanctuary-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @keyframes judicialGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); filter: blur(6px); }
          50% { opacity: 0.55; transform: scale(1.05); filter: blur(10px); }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .judicial-glow {
          animation: judicialGlow 5s infinite ease-in-out;
        }
        .law-float {
          animation: subtleFloat 6s infinite ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Canvas interactive drawing: scales of justice & columns of the law
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize decorative case/law node citations that drift in background
    const legalNodes: InteractiveNode[] = [];
    const legalMaxims = [
      "FIAT IUSTITIA", "DURA LEX SED LEX", "DUE PROCESS", "ARTICLE ONE",
      "CIVIC COVENANT", "HABEAS CORPUS", "DE-ESCALATION", "PUBLIC TRUST",
      "PROPORTIONALITY", "EQUAL PROTECTION", "CHARTER SAFEGUARD", "MUNICIPAL AUDIT"
    ];

    for (let i = 0; i < 28; i++) {
      legalNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 1,
        label: legalMaxims[i % legalMaxims.length],
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.4 + 0.1
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Tilts the central scales of justice gently based on mouse cursor's X position
      const centerX = window.innerWidth / 2;
      const pct = (e.clientX - centerX) / centerX; // ranges from -1 to 1
      setScaleTilt(pct * 12); // Max 12 degrees tilt
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      setScaleTilt(0); // Reset scale tilt to balance
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep judicial dark-navy to gold-dust vignette gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.9
      );
      bgGrad.addColorStop(0, "#001033"); // Deep navy legal chambers
      bgGrad.addColorStop(0.6, "#000a22"); // Midnight core
      bgGrad.addColorStop(1, "#00040f"); // Pitch black outer sovereign void
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;
      const mActive = mouseRef.current.active;

      // 2. Draw Classical Roman/Greek Courtroom Pillars (Far Left & Right)
      ctx.strokeStyle = "rgba(212, 175, 55, 0.05)";
      ctx.lineWidth = 1;

      // Draw Left Pillar Architecture
      const drawPillar = (baseX: number) => {
        ctx.beginPath();
        // Column Shafts
        ctx.moveTo(baseX - 40, 0); ctx.lineTo(baseX - 40, height);
        ctx.moveTo(baseX - 20, 0); ctx.lineTo(baseX - 20, height);
        ctx.moveTo(baseX, 0); ctx.lineTo(baseX, height);
        ctx.moveTo(baseX + 20, 0); ctx.lineTo(baseX + 20, height);
        ctx.moveTo(baseX + 40, 0); ctx.lineTo(baseX + 40, height);
        ctx.stroke();

        // Pillar Cap & Base lines
        ctx.fillStyle = "rgba(212, 175, 55, 0.03)";
        ctx.fillRect(baseX - 55, height - 120, 110, 40);
        ctx.fillRect(baseX - 55, 80, 110, 40);

        ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
        ctx.strokeRect(baseX - 55, height - 120, 110, 40);
        ctx.strokeRect(baseX - 55, 80, 110, 40);
      };

      if (width > 800) {
        drawPillar(110); // Left pillar
        drawPillar(width - 110); // Right pillar
      }

      // 3. Draw Central Scales of Justice dynamically behind the text!
      const scaleCenterX = width / 2;
      const scaleCenterY = height / 2 - 20;

      if (interactiveGrid) {
        ctx.save();
        ctx.translate(scaleCenterX, scaleCenterY);

        // Gentle tilt animation calculations
        const radTilt = (scaleTilt * Math.PI) / 180;

        // Draw scale pillar base (Stand of Justice)
        ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Vertical post
        ctx.moveTo(0, -180);
        ctx.lineTo(0, 190);
        ctx.stroke();

        // Base pedestal steps
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.beginPath();
        ctx.moveTo(-100, 190); ctx.lineTo(100, 190);
        ctx.moveTo(-80, 180); ctx.lineTo(80, 180);
        ctx.moveTo(-60, 170); ctx.lineTo(60, 170);
        ctx.stroke();

        // Classical cap on top of post
        ctx.fillStyle = "#d4af37";
        ctx.beginPath();
        ctx.arc(0, -185, 9, 0, Math.PI * 2);
        ctx.fill();

        // Rotatable Crossbeam balancing left and right
        ctx.rotate(radTilt);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-160, -145);
        ctx.lineTo(160, -145);
        ctx.stroke();

        // Hanging strings & plates of the balance pans
        // Left Pan (weighted by mouse if mouse is left)
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.beginPath();
        // Strings
        ctx.moveTo(-160, -145); ctx.lineTo(-195, -20);
        ctx.moveTo(-160, -145); ctx.lineTo(-125, -20);
        ctx.stroke();
        // Pan Plate
        ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-160, -20, 35, 0, Math.PI, false);
        ctx.stroke();

        // Right Pan
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.beginPath();
        // Strings
        ctx.moveTo(160, -145); ctx.lineTo(125, -20);
        ctx.moveTo(160, -145); ctx.lineTo(195, -20);
        ctx.stroke();
        // Pan Plate
        ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(160, -20, 35, 0, Math.PI, false);
        ctx.stroke();

        ctx.restore();
      }

      // 4. Render Floating Case Citations and Interactive Connection Threads
      legalNodes.forEach((node, idx) => {
        // Move the node
        node.x += node.vx;
        node.y += node.vy;

        // Wall rebound
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Interaction with mouse pointer
        if (mActive) {
          const dx = mX - node.x;
          const dy = mY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            node.alpha = Math.min(node.alpha + 0.02, 0.85);
            // Gentle draw towards mouse
            node.x += (dx / dist) * 0.25;
            node.y += (dy / dist) * 0.25;
          } else {
            node.alpha = Math.max(node.alpha - 0.01, node.baseAlpha);
          }
        }

        // Render the nodes as miniature glowing golden crosshairs (Scales symbols)
        ctx.strokeStyle = `rgba(212, 175, 55, ${node.alpha})`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(node.x - 4, node.y); ctx.lineTo(node.x + 4, node.y);
        ctx.moveTo(node.x, node.y - 4); ctx.lineTo(node.x, node.y + 4);
        ctx.stroke();

        // Render subtle typography label for the legal concept next to it
        if (node.alpha > 0.35 && width > 640) {
          ctx.fillStyle = `rgba(255, 255, 255, ${node.alpha * 0.7})`;
          ctx.font = "7px monospace";
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      });

      // Draw connection threads between close citations (Precedents link web)
      if (interactiveGrid) {
        for (let i = 0; i < legalNodes.length; i++) {
          for (let j = i + 1; j < legalNodes.length; j++) {
            const n1 = legalNodes[i];
            const n2 = legalNodes[j];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 95) {
              let threadAlpha = (1 - dist / 95) * 0.09;
              if (mActive) {
                const distToMouse = Math.sqrt((n1.x - mX) ** 2 + (n1.y - mY) ** 2);
                if (distToMouse < 140) {
                  threadAlpha *= 2.5; // Glow intensely near hover!
                }
              }
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `rgba(212, 175, 55, ${threadAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactiveGrid, scaleTilt]);

  const triggerTransitEnter = (stationId?: string) => {
    setTransitActive(true);
    // Give time for sovereign flash of justice before sliding viewport
    setTimeout(() => {
      onEnter(stationId);
    }, 850);
  };

  const judicialDivisions = [
    {
      id: "justice-shield",
      title: "I. Core Charters",
      badge: "ARTICLE CONSTITUTIONAL",
      desc: "Fundamental citizen protections, municipal charters, and procedural codes.",
      icon: <Shield className="w-5 h-5 text-[#d4af37]" />
    },
    {
      id: "evidence",
      title: "II. Evidence Cabinet",
      badge: "PROBATIVE DISCOVERY",
      desc: "Sovereign logbooks, bodycam audit records, and de-escalation indexes.",
      icon: <FileText className="w-5 h-5 text-[#d4af37]" />
    },
    {
      id: "impact-metrics",
      title: "III. Analytical Metrics",
      badge: "D3 EMPIRICAL DATA",
      desc: "Empirical vector graphs, real-time response rates, and judicial statistics.",
      icon: <Activity className="w-5 h-5 text-[#d4af37]" />
    },
    {
      id: "blog",
      title: "IV. Strategic Bulletins",
      badge: "REGULATORY REPORTING",
      desc: "Legal audits, executive dispatches, and public accountability journals.",
      icon: <BookOpen className="w-5 h-5 text-[#d4af37]" />
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-screen min-h-screen overflow-y-auto bg-black text-gray-100 font-sans select-none flex flex-col justify-between py-8 sm:py-16"
    >
      {/* 1. INTERACTIVE VECTOR COVENANT CANVAS BACKGROUND */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* 2. ATMOSPHERIC AMBIENT JUDICIAL GLOWS (No high-tech space colors, only legal prestige gold and midnight blue) */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden mix-blend-screen opacity-40">
        <div className="judicial-glow absolute top-[15%] left-[25%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.045)_0%,transparent_70%)] blur-[90px]" />
        <div className="judicial-glow absolute bottom-[10%] right-[20%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.035)_0%,transparent_75%)] blur-[100px] delay-1000" />
      </div>

      {/* 3. CLASSICAL LAW GRAIN OVERLAY */}
      <div className="absolute inset-0 z-2 pointer-events-none opacity-[0.025] bg-[radial-gradient(rgba(212,175,55,0.15)_1px,transparent_0)] [background-size:24px_24px]" />

      {/* 4. REFINED SOVEREIGN HEADER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between pb-8 border-b border-[#d4af37]/10 mb-8 sm:mb-12">
        {/* Supreme Seal */}
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="w-11 h-11 border border-[#d4af37]/45 rounded-full flex items-center justify-center bg-black/80 relative shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <div className="absolute inset-1 border border-[#d4af37]/15 rounded-full border-dashed" />
            <Scale className="w-5 h-5 text-[#d4af37]" />
          </motion.div>
          <div className="text-left">
            <h4 className="text-base font-serif font-bold tracking-widest text-[#d4af37] leading-none">
              CIVIC <span className="text-white font-serif font-light">SHIELD</span>
            </h4>
            <p className="text-[9px] font-mono tracking-[0.25em] text-gray-400 uppercase mt-1">SOVEREIGN COALITION ARCHIVE</p>
          </div>
        </div>

        {/* Legal Grid Control */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setInteractiveGrid(!interactiveGrid)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-[#d4af37]/20 hover:border-[#d4af37]/60 rounded-sm text-[9px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-all cursor-pointer"
          >
            {interactiveGrid ? (
              <>
                <Eye className="w-3.5 h-3.5" /> DECOR: ENGAGED
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" /> DECOR: SILENCED
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400">
            <Gavel className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
            <span className="tracking-widest uppercase text-[#d4af37]">JURISDICTION v4.9 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 5. HERO CHAMBER & COVENANT DECLARATION */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex-1 flex flex-col items-center justify-center text-center space-y-10">
        
        {/* Pulsing Law Gavel Emblem */}
        <div className="relative inline-flex items-center justify-center">
          <div className="judicial-glow absolute w-24 h-24 rounded-full border border-[#d4af37]/25 blur-sm" />
          <div className="judicial-glow absolute w-36 h-36 rounded-full border border-[#d4af37]/10 blur-md delay-500" />

          <motion.button
            onClick={() => triggerTransitEnter()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-20 h-20 bg-black border border-[#d4af37]/50 hover:border-[#d4af37] rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.2)] group overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/0 via-[#d4af37]/5 to-[#d4af37]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Gavel className="w-8 h-8 text-[#d4af37] group-hover:rotate-12 transition-transform duration-300" />
          </motion.button>
        </div>

        {/* Main Sovereign Proclamation */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/35 rounded-sm text-[#d4af37] text-[10px] font-mono uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(212,175,55,0.08)]"
          >
            ⚖ FIAT IUSTITIA RUAT CAELUM • LET JUSTICE BE DONE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight text-white leading-tight"
          >
            Before arbitrary power, <br />
            <span className="text-[#d4af37] font-serif italic not-light font-bold drop-shadow-[0_2px_15px_rgba(212,175,55,0.2)]">stands a shield.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto"
          >
            Welcome to the Civic Shield alliance archives. We equip civil defense advocates, legal defense clinics, and public groups with unyielding constitutional evidence, direct government audits, and legal codes.
          </motion.p>
        </div>

        {/* Four Sovereign Jurisdictions / Departments - Fixed overlaps with flex/grid with clean gap */}
        <div className="space-y-5 pt-4 w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/45" />
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] font-semibold">
              SELECT DEPARMENTAL CHAMBER
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/45" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {judicialDivisions.map((div, index) => (
              <motion.button
                key={div.id}
                onClick={() => triggerTransitEnter(div.id)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  y: -4, 
                  borderColor: "rgba(212, 175, 55, 0.75)", 
                  boxShadow: "0 6px 20px rgba(212, 175, 55, 0.15)",
                  background: "rgba(212, 175, 55, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/90 p-5 border border-gray-800 hover:border-[#d4af37]/40 rounded-sm text-left transition-all duration-300 relative group cursor-pointer flex flex-col justify-between min-h-[145px]"
              >
                <div className="flex items-start justify-between">
                  <div className="p-1.5 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-sm group-hover:border-[#d4af37]/50 transition-colors">
                    {div.icon}
                  </div>
                  <div className="text-[8px] font-mono text-[#d4af37] tracking-wider text-right uppercase">
                    {div.badge}
                  </div>
                </div>
                
                <div className="space-y-1 mt-3">
                  <h5 className="text-xs font-bold text-white font-mono uppercase group-hover:text-[#d4af37] transition-colors flex items-center justify-between">
                    {div.title}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#d4af37]" />
                  </h5>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                    {div.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Master Entry Gilt Gavel CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="pt-6 pb-4"
        >
          <motion.button
            onClick={() => triggerTransitEnter()}
            whileHover={{ 
              scale: 1.04, 
              boxShadow: "0 0 35px rgba(212, 175, 55, 0.45)",
              borderColor: "white"
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-4 bg-gradient-to-r from-[#d4af37] to-[#f4d75e] text-[#001233] font-mono font-black text-xs tracking-[0.25em] uppercase rounded-sm cursor-pointer shadow-xl transition-all flex items-center gap-4 mx-auto border border-transparent"
          >
            <span>ENTER CHAMBERS OF JUSTICE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2 text-[#001233]" />
          </motion.button>
        </motion.div>

      </div>

      {/* 6. CORNER STATUTES & SOVEREIGN GEOMETRY */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 mt-8 pt-6 border-t border-[#d4af37]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-gray-500">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-gray-400">LEX ANCHORA CIVITATIS: ACTIVE</span>
          </p>
          <p>DUE PROCESS CODES SECURED UNDER HIGH COURT STANDARDS</p>
          <p>ZERO DECK TELEMETRY LOGS</p>
        </div>
        <div className="text-center md:text-right space-y-0.5">
          <p>© 2026 CIVIC SHIELD ALLIANCE & PUBLIC COUNSEL COALESCE</p>
          <p>INTEGRITY ASSURED BY CRYPTOGRAPHIC LEDGER</p>
        </div>
      </div>

      {/* 7. SOVEREIGN FLASH OVERLAY */}
      <AnimatePresence>
        {transitActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100000] bg-white pointer-events-none"
            transition={{ duration: 0.55 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
