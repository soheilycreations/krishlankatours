"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBackgroundImage({ src }: { src: string }) {
  return (
    <motion.div
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{ duration: 8, ease: "easeOut" }}
      className="absolute inset-0"
    >
      <Image src={src} alt="" fill priority className="object-cover" />
    </motion.div>
  );
}
