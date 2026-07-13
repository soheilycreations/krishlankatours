"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { categoryLabels, type TourCategory } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";

const categories: TourCategory[] = [
  "wildlife",
  "heritage",
  "hillcountry",
  "wetland",
  "coastal",
  "city",
];

export default function HeroSearchBar() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [category, setCategory] = useState<TourCategory | "">("");
  const [dates, setDates] = useState("");
  const [travelers, setTravelers] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      router.push(`/tours?category=${category}`);
    } else {
      router.push("/tours");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl border border-navy/8 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center"
    >
      <label className="flex-1 flex items-center gap-2.5 px-3 py-2 sm:border-r border-navy/8">
        <MapPin size={17} className="text-blue shrink-0" />
        <span className="flex flex-col w-full">
          <span className="font-stamp text-[10px] uppercase tracking-wide text-ink-text/45">
            {t("searchWhere")}
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TourCategory | "")}
            className="font-body text-sm text-navy bg-transparent outline-none -ml-0.5"
          >
            <option value="">{t("searchWhereAny")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c][locale]}
              </option>
            ))}
          </select>
        </span>
      </label>

      <label className="flex-1 flex items-center gap-2.5 px-3 py-2 sm:border-r border-navy/8">
        <Calendar size={17} className="text-blue shrink-0" />
        <span className="flex flex-col w-full">
          <span className="font-stamp text-[10px] uppercase tracking-wide text-ink-text/45">
            {t("searchWhen")}
          </span>
          <input
            type="text"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder={t("searchWhenPlaceholder")}
            className="font-body text-sm text-navy bg-transparent outline-none placeholder:text-ink-text/35 w-full"
          />
        </span>
      </label>

      <label className="flex-1 flex items-center gap-2.5 px-3 py-2">
        <Users size={17} className="text-blue shrink-0" />
        <span className="flex flex-col w-full">
          <span className="font-stamp text-[10px] uppercase tracking-wide text-ink-text/45">
            {t("searchTravelers")}
          </span>
          <input
            type="number"
            min={1}
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            className="font-body text-sm text-navy bg-transparent outline-none w-full"
          />
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-blue text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-blue-light transition-colors shrink-0"
      >
        <Search size={16} /> {t("searchButton")}
      </button>
    </form>
  );
}
