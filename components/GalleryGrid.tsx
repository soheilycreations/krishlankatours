"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "@/lib/gallery";
import type { Locale } from "@/i18n/routing";
import Reveal from "@/components/Reveal";

export default function GalleryGrid() {
  const locale = useLocale() as Locale;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const next = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % galleryImages.length));
  const prev = () =>
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length
    );

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-3 sm:gap-4 [column-fill:balance]">
        {galleryImages.map((img, i) => (
          <Reveal
            key={img.src}
            delay={(i % 6) * 0.05}
            className={`mb-3 sm:mb-4 break-inside-avoid relative overflow-hidden rounded-xl cursor-pointer group ${
              img.tall ? "aspect-[3/4]" : "aspect-[4/3]"
            }`}
          >
            <button
              onClick={() => setActiveIndex(i)}
              className="block w-full h-full relative"
              aria-label={img.caption[locale]}
            >
              <Image
                src={img.src}
                alt={img.caption[locale]}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors" />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 flex items-center justify-center px-4"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-6 right-6 text-paper/70 hover:text-blue-light"
            >
              <X size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-3 sm:left-8 text-paper/70 hover:text-blue-light"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-3 sm:right-8 text-paper/70 hover:text-blue-light"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full max-h-[80vh] aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[activeIndex].src}
                alt={galleryImages[activeIndex].caption[locale]}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
            <p className="absolute bottom-6 left-0 right-0 text-center font-body text-sm text-paper/70">
              {galleryImages[activeIndex].caption[locale]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
