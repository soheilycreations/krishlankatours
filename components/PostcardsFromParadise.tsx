"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface Postcard {
  image: string;
  place: string;
  note: string;
  stamp: string;
  rotate: number;
}

const POSTCARDS: Postcard[] = [
  {
    image: "/images/stock2/sigiriya-sunset.jpg",
    place: "Sigiriya",
    note: "Climbed the Lion Rock at golden hour — worth every step!",
    stamp: "CEYLON 1982",
    rotate: -3,
  },
  {
    image: "/images/stock2/galle-fort-rampart.jpg",
    place: "Galle Fort",
    note: "Sunset walks on 400-year-old ramparts by the sea.",
    stamp: "GALLE POST",
    rotate: 2,
  },
  {
    image: "/images/elephants-trio.jpg",
    place: "Udawalawe",
    note: "A whole elephant family crossed right in front of our jeep!",
    stamp: "WILD LK",
    rotate: -2,
  },
  {
    image: "/images/real/river-safari-mangrove-silhouette.jpg",
    place: "Madu River",
    note: "Drifting through mangrove tunnels — so peaceful here.",
    stamp: "BALAPITIYA",
    rotate: 3,
  },
  {
    image: "/images/golden-temple-hills.jpg",
    place: "Kandy",
    note: "Temple bells and misty hills. Wish you were here!",
    stamp: "KANDY HILLS",
    rotate: -1.5,
  },
];

export default function PostcardsFromParadise({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative bg-navy torn-top py-20 sm:py-28 overflow-hidden">
      {/* sunset glow + canvas grain over the dark teal */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(232,80,43,0.35), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="canvas-texture absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center mb-14">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-golden mb-4">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white text-balance">
            {title}{" "}
            <span className="font-script text-blue-light text-2xl sm:text-3xl align-middle ml-1">
              with love, Sri Lanka
            </span>
          </h2>
          <p className="font-body text-white/60 max-w-xl mx-auto mt-4">{subtitle}</p>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hidden snap-x snap-mandatory pb-6 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible">
          {POSTCARDS.map((card, i) => (
            <motion.article
              key={card.place}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
              whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="postcard-shadow snap-start shrink-0 w-[240px] sm:w-auto bg-paper rounded-lg p-3 pb-4"
            >
              {/* photo with painterly grade */}
              <div className="relative h-40 rounded-md overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.place}
                  fill
                  sizes="240px"
                  className="object-cover painterly"
                />
                {/* postage stamp corner */}
                <div className="absolute top-2 right-2 bg-paper-2/95 border border-dashed border-blue/50 rounded-sm px-1.5 py-1 rotate-3">
                  <p className="font-stamp text-[8px] leading-none text-blue uppercase tracking-wide">
                    {card.stamp}
                  </p>
                </div>
              </div>

              <div className="mt-3 px-1">
                <p className="flex items-center gap-1 font-stamp text-[10px] uppercase tracking-[0.15em] text-blue">
                  <MapPin size={10} /> {card.place}
                </p>
                <p className="font-script text-lg text-ink-text/85 leading-snug mt-1.5">
                  {card.note}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
