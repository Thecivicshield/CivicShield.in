import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: "gold" | "outline";
  href?: string;
  type?: "button" | "submit" | "reset";
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function PremiumButton({
  children,
  onClick,
  className = "",
  variant = "gold",
  href,
  type = "button"
}: PremiumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const prefersReduced = useReducedMotion();

  // Motion values for magnetic spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring config for responsive yet gentle magnetic snap
  const springConfig = { stiffness: 120, damping: 12, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReduced || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates inside the button (-width/2 to width/2)
    const relX = e.clientX - rect.left - width / 2;
    const relY = e.clientY - rect.top - height / 2;

    // Pull intensity limit (max 10px in X and Y)
    const strengthX = 10;
    const strengthY = 8;
    
    x.set((relX / (width / 2)) * strengthX);
    y.set((relY / (height / 2)) * strengthY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleTriggerRipple = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const clickX = e.clientX - rect.left - size / 2;
    const clickY = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      size
    };

    setRipples((prev) => [...prev, newRipple]);

    // Cleanup ripple after animation (600ms)
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const btnClass = variant === "gold" ? "premium-btn-gold" : "premium-btn-outline";

  // Shared inner contents
  const innerContent = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-1.5">{children}</span>
      
      {/* Click ripple overlays */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/25 pointer-events-none z-0 mix-blend-screen"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: "scale(0)",
            animation: "button-ripple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Styled inline keyframes for the soft click ripple */}
      <style>{`
        @keyframes button-ripple {
          to {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );

  // If link
  if (href) {
    return (
      <motion.a
        ref={buttonRef as any}
        href={href}
        className={`${btnClass} ripple-element ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e: any) => handleTriggerRipple(e)}
        style={{
          x: prefersReduced ? 0 : springX,
          y: prefersReduced ? 0 : springY,
        }}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef as any}
      type={type}
      className={`${btnClass} ripple-element ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        handleTriggerRipple(e);
        if (onClick) onClick(e);
      }}
      style={{
        x: prefersReduced ? 0 : springX,
        y: prefersReduced ? 0 : springY,
      }}
    >
      {innerContent}
    </motion.button>
  );
}
