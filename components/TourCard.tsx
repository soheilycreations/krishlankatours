"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Users, ArrowRight, Clock } from "lucide-react";
import type { Tour } from "@/lib/tours";
import { categoryLabels, categoryColors } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";
import TourImagePlaceholder from "@/components/TourImagePlaceholder";

export default function TourCard({ tour }: { tour: Tour }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("tours");
  const colors = categoryColors[tour.category];

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={`group block bg-white rounded-2xl overflow-hidden border border-navy/8 shadow-sm hover:shadow-lg transition-all`}
    >
      <div className="relative h-52 stamp-corner overflow-hidden">
        {tour.heroImage ? (
          <Image
            src={tour.heroImage}
            alt={tour.title[locale]}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <TourImagePlaceholder
            category={tour.category}
            label={t("photoComingSoon")}
            className="absolute inset-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/5 to-transparent" />
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full border-2 border-white/80 bg-navy/40 backdrop-blur-sm flex flex-col items-center justify-center text-white font-stamp leading-none">
          <span className="text-base font-bold">{tour.durationDays}</span>
          <span className="text-[9px] uppercase tracking-wide">
            {tour.durationDays === 1 ? t("day") : t("days")}
          </span>
        </div>
        <span className={`absolute bottom-4 left-4 font-stamp text-[10px] uppercase tracking-widest ${colors.bg} text-white px-2.5 py-1 rounded-full shadow-sm`}>
          {categoryLabels[tour.category][locale]}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl text-navy mb-2 group-hover:text-blue transition-colors">
          {tour.title[locale]}
        </h3>
        <p className="font-body text-sm text-ink-text/60 leading-relaxed mb-4 line-clamp-2">
          {tour.tagline[locale]}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1 font-body text-[11px] text-ink-text/55 bg-paper-2 rounded-full px-2.5 py-1">
            <Clock size={11} className={colors.text} />
            {tour.durationDays} {tour.durationDays === 1 ? t("day") : t("days")}
          </span>
          <span className="flex items-center gap-1 font-body text-[11px] text-ink-text/55 bg-paper-2 rounded-full px-2.5 py-1">
            <Users size={11} className={colors.text} />
            {tour.groupSize.split(",")[0]}
          </span>
        </div>

        <div className="dotted-rule pb-4 mb-1" />
        <div className="flex items-center justify-between">
          <span className={`font-stamp text-[10px] uppercase tracking-wide ${colors.text}`}>
            {categoryLabels[tour.category][locale]}
          </span>
          <span className="flex items-center gap-1 font-body text-xs font-medium text-blue group-hover:gap-1.5 transition-all">
            {t("viewDetails")} <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
