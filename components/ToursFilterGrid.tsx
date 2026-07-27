"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import TourCard from "@/components/TourCard";
import Reveal from "@/components/Reveal";
import { categoryLabels, type TourCategory, type Tour } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";

const categories: TourCategory[] = [
  "wildlife",
  "heritage",
  "hillcountry",
  "wetland",
  "coastal",
  "city",
];

export default function ToursFilterGrid({ tours }: { tours: Tour[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as TourCategory | null;
  const [active, setActive] = useState<TourCategory | "all">(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "all"
  );
  const locale = useLocale() as Locale;
  const t = useTranslations("tours");

  const filtered =
    active === "all" ? tours : tours.filter((tr) => tr.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5 mb-10">
        <button
          onClick={() => setActive("all")}
          className={`font-stamp text-xs uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
            active === "all"
              ? "bg-blue text-white border-blue"
              : "border-navy/15 text-ink-text/65 hover:border-blue/50 hover:text-navy"
          }`}
        >
          {t("filterAll")}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`font-stamp text-xs uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
              active === c
                ? "bg-blue text-white border-blue"
                : "border-navy/15 text-ink-text/65 hover:border-blue/50 hover:text-navy"
            }`}
          >
            {categoryLabels[c][locale]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tour, i) => (
          <Reveal key={tour.slug} delay={i * 0.06}>
            <TourCard tour={tour} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
