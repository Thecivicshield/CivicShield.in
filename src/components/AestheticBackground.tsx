import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export default function AestheticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // If reduced motion is requested, do not run canvas loops
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize 25 subtle gold/blue drifting particles
    const particles: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.16,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.22 + 0.08,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle dust
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    // Use Intersection Observer or Page Visibility API to save performance
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
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animId);
    };
  }, [prefersReduced]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Legal Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.05]" />

      {/* 2. Floating Particle Canvas */}
      {!prefersReduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60"
        />
      )}

      {/* 3. Blueprint courthouse dome / columns drawing line art (Far Right / Left backdrops) */}
      <svg
        className="absolute right-0 top-[12%] w-[480px] h-[550px] text-[#d4af37]/[0.025] hidden xl:block select-none pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.25"
      >
        {/* Courthouse blueprint drawing */}
        <path d="M10 90 L90 90 M15 85 L85 85 M20 80 L80 80" />
        <rect x="25" y="45" width="50" height="35" />
        {/* Columns */}
        <line x1="30" y1="45" x2="30" y2="80" />
        <line x1="38" y1="45" x2="38" y2="80" />
        <line x1="46" y1="45" x2="46" y2="80" />
        <line x1="54" y1="45" x2="54" y2="80" />
        <line x1="62" y1="45" x2="62" y2="80" />
        <line x1="70" y1="45" x2="70" y2="80" />
        {/* Dome / Pediment */}
        <polygon points="25,45 50,28 75,45" />
        <circle cx="50" cy="55" r="4" />
        {/* Compass blueprint detailing */}
        <circle cx="50" cy="20" r="10" strokeDasharray="1,1" />
        <line x1="50" y1="5" x2="50" y2="35" strokeDasharray="2,2" />
        <line x1="35" y1="20" x2="65" y2="20" strokeDasharray="2,2" />
      </svg>

      <svg
        className="absolute left-[-50px] top-[45%] w-[420px] h-[480px] text-[#d4af37]/[0.02] hidden xl:block select-none pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.25"
      >
        {/* Scales of Justice blueprint drawing */}
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="35" y1="90" x2="65" y2="90" />
        {/* Crossbar */}
        <line x1="20" y1="25" x2="80" y2="25" />
        {/* Left scale */}
        <line x1="20" y1="25" x2="10" y2="55" />
        <line x1="20" y1="25" x2="30" y2="55" />
        <path d="M10 55 C10 65, 30 65, 30 55 Z" />
        {/* Right scale */}
        <line x1="80" y1="25" x2="70" y2="55" />
        <line x1="80" y1="25" x2="90" y2="55" />
        <path d="M70 55 C70 65, 90 65, 90 55 Z" />
        {/* Geometric tracer circles */}
        <circle cx="50" cy="25" r="5" />
        <circle cx="50" cy="55" r="28" strokeDasharray="1,2" />
      </svg>

      {/* 4. Giant glowing rotating shield outline */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-[0.015] pointer-events-none select-none">
        <svg
          className="w-full h-full text-[#d4af37] animate-[spin_120s_linear_infinite]"
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
