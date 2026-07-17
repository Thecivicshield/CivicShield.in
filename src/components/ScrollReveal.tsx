import React, { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  index?: number;
  className?: string;
  delay?: number;
  key?: React.Key | null;
}

export default function ScrollReveal({
  children,
  index = 0,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, only fade in with no spatial transform
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.4, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Snappy, silky-smooth scroll reveal transitions. 
  // We keep it extremely consistent, clean, and instant-acting.
  const animationType = index % 3;

  const getVariants = () => {
    switch (animationType) {
      case 0: // Subtle slide up + fade (standard and clean)
        return {
          hidden: {
            opacity: 0,
            y: 15,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1], // easeOutExpo: starts fast, finishes smooth
              delay: delay,
            },
          },
        };
      case 1: // Subtle scale + fade (adds beautiful rhythm)
        return {
          hidden: {
            opacity: 0,
            scale: 0.98,
          },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: delay,
            },
          },
        };
      case 2: // Subtle slide from left + fade (asymmetric accent)
        return {
          hidden: {
            opacity: 0,
            x: -12,
          },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: delay,
            },
          },
        };
      default:
        return {
          hidden: { opacity: 0, y: 15 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut", delay },
          },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
