"use client";

import { motion } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";

/** Floating vertical social bar on the left edge (desktop only). */
export default function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3"
    >
      <span className="font-stamp text-[9px] uppercase tracking-[0.25em] text-navy/40 [writing-mode:vertical-rl] rotate-180 mb-1">
        Follow us
      </span>
      <span className="w-px h-8 bg-navy/20" />
      <div className="bg-white/90 backdrop-blur-sm rounded-full border border-navy/10 shadow-lg shadow-navy/10 p-2 flex flex-col gap-2 [&>div]:flex-col [&>div]:gap-2">
        <SocialLinks />
      </div>
    </motion.div>
  );
}
