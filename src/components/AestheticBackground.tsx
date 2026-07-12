import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  label: string;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

export default function AestheticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const ripplesRef = useRef<ClickRipple[]>([]);

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic 'Rights Network' nodes representing fundamental legal concepts
    const concepts = [
      "Habeas Corpus", "Due Process", "Audi Alteram Partem", "Art. 21 Privacy", 
      "Natural Justice", "RTI Audit", "Equality", "Legal Aid", "Self Representation", 
      "Arrest Guard", "Public Trust", "Precedent", "Sovereign Shield", "Civic Covenant"
    ];

    const nodes: Node[] = [];
    const numNodes = 32;

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.25 + 0.1,
        baseAlpha: Math.random() * 0.18 + 0.08,
        label: concepts[i % concepts.length]
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Add a 'Knowledge Ripple' on click
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 320,
        speed: 6.5,
        alpha: 1.0
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const m = mouseRef.current;
      const ripples = ripplesRef.current;

      // Update click ripples
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const ripple = ripples[rIdx];
        ripple.radius += ripple.speed;
        ripple.alpha -= 0.02;
        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(rIdx, 1);
        }
      }

      // Draw active click ripples (fading concentric gold circles)
      ripples.forEach((ripple) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${ripple.alpha * 0.22})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, Math.max(0, ripple.radius - 20), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${ripple.alpha * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Update & Draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Wrap boundaries
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Mouse influence: calculate distance
        let brightnessBoost = 0;
        let repelX = 0;
        let repelY = 0;

        if (m.active) {
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            // Brightness boost based on proximity
            brightnessBoost = (1 - dist / 180) * 0.55;

            // Subtle magnetic push away from cursor (Cursor influence)
            const force = (1 - dist / 180) * 0.35;
            repelX = -(dx / dist) * force;
            repelY = -(dy / dist) * force;
            n.x += repelX;
            n.y += repelY;
          }
        }

        // Ripple influence: check if ripple wavefront is passing over this node
        ripples.forEach((ripple) => {
          const rx = ripple.x - n.x;
          const ry = ripple.y - n.y;
          const rDist = Math.sqrt(rx * rx + ry * ry);
          const tolerance = 40;

          if (Math.abs(rDist - ripple.radius) < tolerance) {
            const rippleBoost = (1 - Math.abs(rDist - ripple.radius) / tolerance) * ripple.alpha * 0.85;
            brightnessBoost = Math.max(brightnessBoost, rippleBoost);
          }
        });

        const currentAlpha = Math.min(1.0, n.baseAlpha + brightnessBoost);

        // Draw node (micro golden crosshair/star)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + (brightnessBoost * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
        ctx.fill();

        // Crosshair lines
        ctx.strokeStyle = `rgba(212, 175, 55, ${currentAlpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(n.x - 5, n.y); ctx.lineTo(n.x + 5, n.y);
        ctx.moveTo(n.x, n.y - 5); ctx.lineTo(n.x, n.y + 5);
        ctx.stroke();

        // Print node concept label when sufficiently illuminated or near hover
        if (currentAlpha > 0.35 && width > 768) {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
          ctx.font = "8px ui-monospace, SFMono-Regular, monospace";
          ctx.fillText(n.label, n.x + 8, n.y + 3);
        }
      });

      // Draw connection threads (The Constitutional Principle Connections)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            let threadAlpha = (1 - dist / 130) * 0.08;

            // Hover illumination highlight
            if (m.active) {
              const dm1 = Math.sqrt((n1.x - m.x) ** 2 + (n1.y - m.y) ** 2);
              const dm2 = Math.sqrt((n2.x - m.x) ** 2 + (n2.y - m.y) ** 2);
              if (dm1 < 160 || dm2 < 160) {
                const hoverWeight = (1 - Math.min(dm1, dm2) / 160);
                threadAlpha += hoverWeight * 0.16;
              }
            }

            // Click ripple boost
            ripples.forEach((ripple) => {
              const r1 = Math.sqrt((n1.x - ripple.x) ** 2 + (n1.y - ripple.y) ** 2);
              const r2 = Math.sqrt((n2.x - ripple.x) ** 2 + (n2.y - ripple.y) ** 2);
              const avgDist = (r1 + r2) / 2;
              if (Math.abs(avgDist - ripple.radius) < 50) {
                const rippleBoost = (1 - Math.abs(avgDist - ripple.radius) / 50) * ripple.alpha * 0.35;
                threadAlpha += rippleBoost;
              }
            });

            if (threadAlpha > 0) {
              ctx.strokeStyle = `rgba(212, 175, 55, ${Math.min(0.65, threadAlpha)})`;
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    // Performance safety
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animId);
    };
  }, [prefersReduced]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Legal Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.06] pointer-events-none" />

      {/* 2. Floating Particle & Network Canvas */}
      {!prefersReduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
        />
      )}

      {/* 3. Blueprint courthouse dome / columns drawing line art (Far Right Backdrop) */}
      <svg
        className="absolute right-[-40px] top-[14%] w-[480px] h-[550px] text-[#d4af37]/[0.022] hidden xl:block select-none pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.22"
      >
        <path d="M10 90 L90 90 M15 85 L85 85 M20 80 L80 80" />
        <rect x="25" y="45" width="50" height="35" />
        <line x1="30" y1="45" x2="30" y2="80" />
        <line x1="38" y1="45" x2="38" y2="80" />
        <line x1="46" y1="45" x2="46" y2="80" />
        <line x1="54" y1="45" x2="54" y2="80" />
        <line x1="62" y1="45" x2="62" y2="80" />
        <line x1="70" y1="45" x2="70" y2="80" />
        <polygon points="25,45 50,28 75,45" />
        <circle cx="50" cy="55" r="4" />
        <circle cx="50" cy="20" r="10" strokeDasharray="1,1" />
        <line x1="50" y1="5" x2="50" y2="35" strokeDasharray="2,2" />
        <line x1="35" y1="20" x2="65" y2="20" strokeDasharray="2,2" />
      </svg>

      {/* 4. Scales of Justice blueprint drawing (Far Left Backdrop) */}
      <svg
        className="absolute left-[-60px] top-[42%] w-[420px] h-[480px] text-[#d4af37]/[0.018] hidden xl:block select-none pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.22"
      >
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="35" y1="90" x2="65" y2="90" />
        <line x1="20" y1="25" x2="80" y2="25" />
        <line x1="20" y1="25" x2="10" y2="55" />
        <line x1="20" y1="25" x2="30" y2="55" />
        <path d="M10 55 C10 65, 30 65, 30 55 Z" />
        <line x1="80" y1="25" x2="70" y2="55" />
        <line x1="80" y1="25" x2="90" y2="55" />
        <path d="M70 55 C70 65, 90 65, 90 55 Z" />
        <circle cx="50" cy="25" r="5" />
        <circle cx="50" cy="55" r="28" strokeDasharray="1,2" />
      </svg>

      {/* 5. Giant glowing rotating shield outline */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-[0.012] pointer-events-none select-none">
        <svg
          className="w-full h-full text-[#d4af37] animate-[spin_130s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
        >
          <path d="M50 12 L82 24 L82 54 C82 72 68 84 50 88 C32 84 18 72 18 54 L18 24 Z" />
          <circle cx="50" cy="50" r="45" strokeDasharray="2,3" />
          <circle cx="50" cy="50" r="35" strokeDasharray="1,4" />
        </svg>
      </div>
    </div>
  );
}
