"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const collagePhotos = [
  { src: "/images/elephants-trio.jpg", rotate: -6, className: "top-0 left-4 w-36 sm:w-44" },
  { src: "/images/kandyan-dance.jpg", rotate: 4, className: "top-6 right-0 w-32 sm:w-40" },
  { src: "/images/monk-meditation-cliff.jpg", rotate: -3, className: "bottom-10 left-0 w-32 sm:w-40" },
  { src: "/images/polonnaruwa-ruins.jpg", rotate: 7, className: "bottom-0 right-6 w-36 sm:w-44" },
];

export default function HeroCollage() {
  return (
    <div className="relative h-[340px] sm:h-[420px] w-full hidden lg:block">
      {/* soft decorative blob behind the collage */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-paper-2 blur-2xl opacity-90" />
      </div>

      {/* dotted flight-path squiggle, echoes the postcard/route motif */}
      <svg
        className="absolute -top-4 -left-6 w-24 h-24 text-blue/40 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M5 40 Q 30 5, 60 20 T 95 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
      </svg>

      {collagePhotos.map((p, i) => (
        <motion.div
          key={p.src}
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: p.rotate }}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
          className={`absolute ${p.className} aspect-[4/5] rounded-xl overflow-hidden border-[6px] border-white shadow-xl bg-white`}
        >
          <Image
            src={p.src}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
}
