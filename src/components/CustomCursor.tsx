import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Mouse coordinates using motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring options for trailing smooth ring
  const springConfig = { damping: 30, stiffness: 220, mass: 0.5 };
  const trailingX = useSpring(mouseX, springConfig);
  const trailingY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const checkDevice = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch || window.innerWidth < 1024);
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
    const handleQueryChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handleQueryChange);

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Event listeners for hovering clickable items to trigger reactions
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const isClickable = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.closest("a") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("clickable-cyber");

      if (isClickable) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkDevice);
      mediaQuery.removeEventListener("change", handleQueryChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, visible]);

  // Do not render anything if on touch screen/mobile or prefers reduced motion
  if (isMobile || prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999999] overflow-hidden">
      {/* 1. Trailing Outer Ring (Lagging spring effect) */}
      <motion.div
        className="absolute rounded-full border flex items-center justify-center"
        style={{
          x: trailingX,
          y: trailingY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovered ? 46 : 28,
          height: hovered ? 46 : 28,
          borderColor: hovered ? "#d4af37" : "rgba(212, 175, 55, 0.45)",
          backgroundColor: hovered ? "rgba(212, 175, 55, 0.08)" : "rgba(212, 175, 55, 0)",
          boxShadow: hovered 
            ? "0 0 12px rgba(212, 175, 55, 0.35), inset 0 0 8px rgba(212, 175, 55, 0.15)"
            : "0 0 0px transparent",
        }}
        animate={{
          scale: clicked ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Subtle crosshairs inside the trailing ring when hovered */}
        {hovered && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[4px] h-[1px] bg-[#d4af37]/70 left-1" />
            <div className="absolute w-[4px] h-[1px] bg-[#d4af37]/70 right-1" />
            <div className="absolute w-[1px] h-[4px] bg-[#d4af37]/70 top-1" />
            <div className="absolute w-[1px] h-[4px] bg-[#d4af37]/70 bottom-1" />
          </div>
        )}
      </motion.div>

      {/* 2. Precision Center Dot (Snaps immediately to mouse) */}
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: hovered ? "#ffffff" : "#d4af37",
          boxShadow: hovered 
            ? "0 0 10px #ffffff, 0 0 20px #d4af37" 
            : "0 0 6px #d4af37",
        }}
        animate={{
          scale: clicked ? 1.4 : hovered ? 0.75 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
