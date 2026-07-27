"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Star, MapPin, Plane } from "lucide-react";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";

/** Layered card composition for the hero — tilted postcard slideshow with floating detail cards. */
export default function HeroShowcase({
  images,
  ratingLabel,
  pinLabel,
}: {
  images: string[];
  ratingLabel: string;
  pinLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const float = (delay = 0, dist = 8) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: { duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      {/* dashed flight path doodle behind */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -top-10 -left-16 w-[130%] text-blue/25 pointer-events-none hidden sm:block"
        aria-hidden="true"
      >
        <path
          d="M20 300 C 80 120, 260 60, 380 110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
      </svg>

      {/* main postcard photo card with Ken Burns slideshow */}
      <motion.div
        initial={{ opacity: 0, y: 26, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden ring-8 ring-paper postcard-shadow"
      >
        <HeroBackgroundImage images={images} />
        {/* soft grade so the white cards pop against any slide */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent z-[6]" />
        {/* postage stamp corner */}
        <div className="absolute top-4 right-4 z-[7] bg-paper/95 border border-dashed border-blue/50 rounded-sm px-2 py-1.5 rotate-3">
          <p className="font-stamp text-[9px] leading-none text-blue uppercase tracking-wider">
            Ceylon · Est. Paradise
          </p>
        </div>
      </motion.div>

      {/* floating rating card */}
      <motion.a
        href="https://www.tripadvisor.com/Attraction_Review-g608521-d34220717-Reviews-Krish_Lanka_Tours_Travels-Ahungalla_Galle_District_Southern_Province.html"
        target="_blank"
        rel="noopener noreferrer"
        {...float(0.4)}
        className="absolute -left-4 sm:-left-10 top-8 bg-white rounded-2xl shadow-xl shadow-navy/15 px-4 py-3 rotate-[-4deg] block"
      >
        <div className="flex items-center gap-1.5">
          <p className="font-display text-xl text-navy leading-none">5.0</p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-clay text-clay" />
            ))}
          </div>
        </div>
        <p className="font-body text-[10px] text-ink-text/55 mt-1">{ratingLabel}</p>
      </motion.a>

      {/* floating location chip */}
      <motion.div
        {...float(1.2, 7)}
        className="absolute -right-3 sm:-right-8 top-1/2 bg-white rounded-full shadow-lg shadow-navy/15 pl-2.5 pr-4 py-2 flex items-center gap-2 rotate-2"
      >
        <span className="w-7 h-7 rounded-full bg-blue/10 flex items-center justify-center">
          <MapPin size={13} className="text-blue" />
        </span>
        <p className="font-stamp text-[10px] uppercase tracking-wide text-navy">{pinLabel}</p>
      </motion.div>

      {/* floating mini postcard note */}
      <motion.div
        {...float(2, 9)}
        className="absolute -bottom-8 -left-2 sm:-left-8 bg-paper rounded-xl postcard-shadow p-2.5 pb-3 w-40 rotate-[-6deg]"
      >
        <div className="relative h-16 rounded-lg overflow-hidden">
          <Image
            src="/images/stock2/galle-fort-rampart.jpg"
            alt=""
            fill
            sizes="160px"
            className="object-cover painterly"
          />
        </div>
        <p className="font-script text-sm text-ink-text/80 leading-tight mt-2 px-0.5">
          Wish you were here!
        </p>
      </motion.div>

      {/* plane on the flight path */}
      <motion.div
        {...float(0.8, 6)}
        className="absolute -top-6 right-8 w-9 h-9 rounded-full bg-navy text-golden flex items-center justify-center shadow-lg rotate-12"
      >
        <Plane size={16} />
      </motion.div>
    </div>
  );
}
