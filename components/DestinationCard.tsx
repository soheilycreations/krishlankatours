"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Destination } from "@/lib/destinations";
import type { Locale } from "@/i18n/routing";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const locale = useLocale() as Locale;

  return (
    <Link
      href={`/destinations#${destination.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-navy/8 shadow-sm hover:shadow-lg hover:border-blue/30 transition-all"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <span className="absolute top-3 left-3 font-stamp text-[10px] uppercase tracking-widest bg-blue text-white px-2.5 py-1 rounded-full">
          {destination.region[locale]}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-navy mb-1.5 group-hover:text-blue transition-colors">
          {destination.name[locale]}
        </h3>
        <p className="font-body text-sm text-ink-text/60 leading-relaxed line-clamp-2">
          {destination.tagline[locale]}
        </p>
      </div>
    </Link>
  );
}
