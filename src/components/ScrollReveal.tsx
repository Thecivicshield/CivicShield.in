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

  // If user prefers reduced motion, only fade in with no spatial transform or scale
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Generate unique, non-repetitive reveal variants based on section index
  // We alternate between:
  // 1. Bottom slide + scale up + blur
  // 2. Left slide + slight rotation + scale + blur
  // 3. Right slide + slight negative rotation + scale + blur
  // 4. Center scale + intense blur + fade
  const animationType = index % 4;

  const getVariants = () => {
    switch (animationType) {
      case 0: // Bottom Slide + Scale
        return {
          hidden: {
            opacity: 0,
            y: 45,
            scale: 0.94,
            filter: "blur(8px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 70,
              damping: 15,
              delay: delay,
            },
          },
        };
      case 1: // Left Slide + Subtle Tilt
        return {
          hidden: {
            opacity: 0,
            x: -50,
            rotate: -1.5,
            scale: 0.96,
            filter: "blur(10px)",
          },
          visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 65,
              damping: 14,
              delay: delay,
            },
          },
        };
      case 2: // Right Slide + Reverse Subtle Tilt
        return {
          hidden: {
            opacity: 0,
            x: 50,
            rotate: 1.5,
            scale: 0.96,
            filter: "blur(10px)",
          },
          visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 65,
              damping: 14,
              delay: delay,
            },
          },
        };
      case 3: // Pure Scale + Depth Blur
      default:
        return {
          hidden: {
            opacity: 0,
            scale: 0.9,
            filter: "blur(14px)",
          },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1], // elegant ease-out expo
              delay: delay,
            },
          },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
