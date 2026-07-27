"use client";

import { motion } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";

/** Floating vertical social bar, perfectly centered on the left edge (desktop only).
 *  Outer div owns the centering transform; the motion div only animates
 *  opacity/x so framer-motion never overwrites the -translate-y-1/2. */
export default function SocialRail() {
  return (
    <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="flex flex-col items-center gap-2.5"
      >
        <span className="font-stamp text-[9px] uppercase tracking-[0.25em] text-navy/40 [writing-mode:vertical-rl] rotate-180">
          Follow us
        </span>
        <span className="w-px h-6 bg-navy/20" />
        <div className="bg-white/90 backdrop-blur-sm rounded-full border border-navy/10 shadow-lg shadow-navy/10 p-1.5 flex flex-col gap-1.5 [&>div]:flex-col [&>div]:gap-1.5 [&_a]:w-9 [&_a]:h-9">
          <SocialLinks />
        </div>
      </motion.div>
    </div>
  );
}
