"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface Stop {
  label: string;
  note: string;
}

export default function RoutePath({ stops }: { stops: Stop[] }) {
  return (
    <div className="relative">
      {/* Desktop: horizontal dotted path */}
      <div className="hidden md:grid grid-cols-5 gap-4 relative">
        <div className="absolute top-6 left-[10%] right-[10%] h-px dotted-rule" />
        {stops.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="flex flex-col items-center text-center px-2"
          >
            <div className="relative z-10 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-ink font-stamp font-bold text-sm mb-4">
              {i + 1}
            </div>
            <p className="font-display text-base text-paper mb-1.5">{s.label}</p>
            <p className="font-body text-xs text-paper/55 leading-relaxed">{s.note}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile: vertical dotted path */}
      <div className="md:hidden flex flex-col relative pl-14">
        <div className="absolute left-[23px] top-2 bottom-2 w-px dotted-rule-vertical" />
        {stops.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative pb-9 last:pb-0"
          >
            <div className="absolute -left-14 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-ink font-stamp font-bold text-sm">
              {i + 1}
            </div>
            <p className="font-display text-base text-paper mb-1">{s.label}</p>
            <p className="font-body text-xs text-paper/55 leading-relaxed">{s.note}</p>
          </motion.div>
        ))}
      </div>

      <MapPin className="hidden" />
    </div>
  );
}
