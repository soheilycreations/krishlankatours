"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Full-bleed section with a parallax photo backdrop, in two moods:
 *  - "dark":  painterly photo under a deep-teal wash + sunset glow
 *             (the Postcards-from-Paradise look) — put white text on it
 *  - "light": very faint photo under a warm cream wash — teal text stays
 */
export default function ParallaxSection({
  image,
  variant = "dark",
  glow = "top",
  torn = false,
  className = "",
  children,
}: {
  image: string;
  variant?: "dark" | "light";
  glow?: "top" | "bottom" | "none";
  torn?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const glowStyle =
    glow === "none"
      ? undefined
      : {
          background: `radial-gradient(ellipse 80% 55% at 50% ${
            glow === "top" ? "0%" : "100%"
          }, rgba(232,80,43,${variant === "dark" ? 0.35 : 0.14}), transparent 65%)`,
        };

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${variant === "dark" ? "bg-navy" : "bg-paper"} ${
        torn ? "torn-top" : ""
      } ${className}`}
    >
      {/* parallax photo layer (taller than the section so it can drift) */}
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute -top-[12%] left-0 right-0 h-[124%]"
        aria-hidden="true"
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover painterly ${
            variant === "dark" ? "opacity-40" : "opacity-[0.13]"
          }`}
        />
      </motion.div>

      {/* mood wash */}
      <div
        className={`absolute inset-0 ${
          variant === "dark"
            ? "bg-gradient-to-b from-navy/80 via-navy/70 to-navy/85"
            : "bg-gradient-to-b from-paper/80 via-paper/70 to-paper/85"
        }`}
        aria-hidden="true"
      />

      {/* sunset glow */}
      {glowStyle && <div className="absolute inset-0" style={glowStyle} aria-hidden="true" />}

      {/* canvas grain */}
      <div className="canvas-texture absolute inset-0" aria-hidden="true" />

      <div className="relative z-10">{children}</div>
    </section>
  );
}
