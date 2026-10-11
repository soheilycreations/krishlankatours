"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import TourCard from "@/components/TourCard";
import Reveal from "@/components/Reveal";
import { getCategoryLabel, type Tour } from "@/lib/tours";
import type { CategoryItem } from "@/lib/content-data";
import type { Locale } from "@/i18n/routing";

/** Category chips come from the categories table (/admin/categories, with a
 *  built-in fallback list), plus any category a tour uses that isn't listed
 *  — so every tour is always reachable through a filter. */
export default function ToursFilterGrid({
  tours,
  categories,
}: {
  tours: Tour[];
  categories: CategoryItem[];
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("tours");

  const chips = useMemo(() => {
    const list = categories.map((c) => ({ slug: c.slug, label: c.name[locale] || c.name.en }));
    const known = new Set(list.map((c) => c.slug));
    for (const tour of tours) {
      if (!known.has(tour.category)) {
        known.add(tour.category);
        list.push({ slug: tour.category, label: getCategoryLabel(tour.category, locale) });
      }
    }
    return list;
  }, [categories, tours, locale]);

  // ?category= and ?duration= are read after hydration (not via
  // useSearchParams) so the full tour grid is in the static HTML that
  // search engines see.
  const [active, setActive] = useState<string>("all");
  const [duration, setDuration] = useState<string | null>(null); // "day" | "multi" | null

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");
      setActive(category && chips.some((c) => c.slug === category) ? category : "all");
      setDuration(params.get("duration"));
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [chips]);

  const byDuration =
    duration === "day"
      ? tours.filter((tr) => tr.durationDays <= 1)
      : duration === "multi"
        ? tours.filter((tr) => tr.durationDays > 1)
        : tours;
  const filtered =
    active === "all" ? byDuration : byDuration.filter((tr) => tr.category === active);

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
        {chips.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`font-stamp text-xs uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
              active === c.slug
                ? "bg-blue text-white border-blue"
                : "border-navy/15 text-ink-text/65 hover:border-blue/50 hover:text-navy"
            }`}
          >
            {c.label}
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
