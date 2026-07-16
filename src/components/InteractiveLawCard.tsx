import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface InteractiveLawCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}

export default function InteractiveLawCard({ children, className = "", id, onClick }: InteractiveLawCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Spring configurations for super smooth organic card movement
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  
  // Reflection/shine tracking
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: "radial-gradient(circle at 0% 0%, rgba(212,175,55,0.1) 0%, transparent 50%)"
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Rotate cards up to 8 degrees
    rotateX.set(-relativeY * 16);
    rotateY.set(relativeX * 16);

    // Shine/glare sweep following the mouse position
    const shineX = ((e.clientX - rect.left) / width) * 100;
    const shineY = ((e.clientY - rect.top) / height) * 100;
    
    setShineStyle({
      opacity: 0.65,
      background: `radial-gradient(circle 180px at ${shineX}% ${shineY}%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`
    });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setShineStyle({
      opacity: 0,
      transition: "opacity 0.4s ease"
    });
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98, y: 0 }}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onClick={onClick}
      className={`relative rounded-sm border border-[#d4af37]/20 bg-[#001233]/90 p-5 shadow-xl transition-all cursor-pointer forensic-scanner paper-stack-card group ${className}`}
    >
      {/* 1. Reflective holographic shine sweep layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
        style={shineStyle}
      />

      {/* 2. Delicate gold corner tracer brackets appearing on hover */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#d4af37]/0 group-hover:border-[#d4af37]/60 transition-all duration-300 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#d4af37]/0 group-hover:border-[#d4af37]/60 transition-all duration-300 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#d4af37]/0 group-hover:border-[#d4af37]/60 transition-all duration-300 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#d4af37]/0 group-hover:border-[#d4af37]/60 transition-all duration-300 pointer-events-none" />

      {/* 3. Deep inner shadow 3D effect */}
      <div 
        className="relative z-20"
        style={{ transform: "translateZ(12px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
