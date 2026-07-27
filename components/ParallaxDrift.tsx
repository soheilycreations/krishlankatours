"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/** Content drifts up slower than the page scroll and gently fades — used on the hero. */
export default function ParallaxDrift({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  return (
    <motion.div ref={ref} style={reduceMotion ? undefined : { y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
