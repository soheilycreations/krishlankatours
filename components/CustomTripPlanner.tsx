"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, Car, Hotel, Send, CheckCircle2, AlertCircle, Star, Check, Minus, Plus,
} from "lucide-react";
import DateRangeField, { type DateRange } from "@/components/DateRangeField";
import type { Locale } from "@/i18n/routing";
import type { Vehicle } from "@/lib/vehicles-data";

interface PlannerDestination {
  slug: string;
  name: string;
  region: string;
  image: string;
}

const HOTEL_CATEGORIES = [
  { id: "3-star", stars: 3, key: "hotel3" },
  { id: "4-star", stars: 4, key: "hotel4" },
  { id: "5-star", stars: 5, key: "hotel5" },
  { id: "boutique", stars: 0, key: "hotelBoutique" },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

function SectionHeading({ step, icon: Icon, title, subtitle }: {
  step: string; icon: React.ElementType; title: string; subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <span className="w-11 h-11 rounded-full bg-blue text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue/25">
        <Icon size={19} />
      </span>
      <div>
        <p className="font-stamp text-[10px] uppercase tracking-[0.2em] text-blue">{step}</p>
        <h2 className="font-display text-xl sm:text-2xl text-navy leading-tight">{title}</h2>
        <p className="font-body text-sm text-ink-text/55 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function CustomTripPlanner({
  destinations,
  vehicles,
}: {
  destinations: PlannerDestination[];
  vehicles: Vehicle[];
}) {
  const t = useTranslations("plan");
  const locale = useLocale() as Locale;

  const [picked, setPicked] = useState<string[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();
  const [travelers, setTravelers] = useState(2);
  const [vehicleId, setVehicleId] = useState("");
  const [hotel, setHotel] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [status, setStatus] = useState<Status>("idle");

  const toggleLocation = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));

  const canSubmit =
    picked.length > 0 && contact.name.trim() && contact.email.trim() && status !== "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    try {
      const res = await fetch("/api/custom-trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          arrivalDate: range?.from ? range.from.toISOString().slice(0, 10) : null,
          departureDate: range?.to ? range.to.toISOString().slice(0, 10) : null,
          travelers,
          locations: picked.map((slug) => {
            const d = destinations.find((x) => x.slug === slug);
            return { slug, name: d?.name ?? slug };
          }),
          vehicleId: vehicleId || null,
          vehicleName: vehicle?.name ?? null,
          hotelCategory: hotel || null,
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white border border-navy/8 shadow-sm rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto">
        <CheckCircle2 size={52} className="text-blue mx-auto mb-5" />
        <h2 className="font-display text-2xl sm:text-3xl text-navy mb-3">{t("successTitle")}</h2>
        <p className="font-script text-xl text-clay mb-4">{t("successScript")}</p>
        <p className="font-body text-sm text-ink-text/60 max-w-md mx-auto">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-14">
      {/* STEP 1 — LOCATIONS */}
      <section>
        <SectionHeading step={t("step1")} icon={MapPin} title={t("locationsTitle")} subtitle={t("locationsSubtitle")} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((d) => {
            const idx = picked.indexOf(d.slug);
            const selected = idx !== -1;
            return (
              <button
                type="button"
                key={d.slug}
                onClick={() => toggleLocation(d.slug)}
                aria-pressed={selected}
                className={`relative text-left rounded-2xl overflow-hidden group transition-all ${
                  selected
                    ? "ring-[3px] ring-blue shadow-lg shadow-blue/20 scale-[1.02]"
                    : "ring-1 ring-navy/10 hover:ring-blue/40"
                }`}
              >
                <div className="relative h-28 sm:h-32">
                  {d.image ? (
                    <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover painterly group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-paper-2" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/15 to-transparent" />
                  {/* pick-order badge */}
                  <span
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-bold transition-all ${
                      selected ? "bg-blue text-white" : "bg-white/85 text-navy/50 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {selected ? idx + 1 : <Check size={14} />}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-display text-sm text-white leading-tight">{d.name}</p>
                    {d.region && <p className="font-body text-[10px] text-white/65 mt-0.5">{d.region}</p>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {picked.length > 0 && (
          <p className="font-body text-sm text-blue mt-4">
            {t("locationsPicked", { count: picked.length })}
          </p>
        )}
      </section>

      {/* STEP 2 — DATES & TRAVELERS */}
      <section>
        <SectionHeading step={t("step2")} icon={Users} title={t("datesTitle")} subtitle={t("datesSubtitle")} />
        <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-start max-w-2xl">
          <DateRangeField
            value={range}
            onChange={setRange}
            arrivalLabel={t("arrival")}
            departureLabel={t("departure")}
            placeholder={t("pickDate")}
          />
          <div>
            <span className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/45 mb-1">
              {t("travelers")}
            </span>
            <div className="flex items-center gap-3 bg-paper-2/40 border border-navy/12 rounded-lg px-3 py-2.5">
              <button type="button" aria-label="-" onClick={() => setTravelers((n) => Math.max(1, n - 1))} className="w-7 h-7 rounded-full bg-white border border-navy/10 flex items-center justify-center text-navy hover:border-blue">
                <Minus size={13} />
              </button>
              <span className="font-display text-lg text-navy w-6 text-center">{travelers}</span>
              <button type="button" aria-label="+" onClick={() => setTravelers((n) => Math.min(40, n + 1))} className="w-7 h-7 rounded-full bg-white border border-navy/10 flex items-center justify-center text-navy hover:border-blue">
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3 — VEHICLE */}
      <section>
        <SectionHeading step={t("step3")} icon={Car} title={t("vehicleTitle")} subtitle={t("vehicleSubtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => {
            const selected = vehicleId === v.id;
            return (
              <button
                type="button"
                key={v.id}
                onClick={() => setVehicleId(selected ? "" : v.id)}
                aria-pressed={selected}
                className={`text-left bg-white rounded-2xl p-4 transition-all ${
                  selected ? "ring-[3px] ring-blue shadow-lg shadow-blue/20" : "ring-1 ring-navy/10 hover:ring-blue/40"
                }`}
              >
                {v.imageUrl ? (
                  <div className="relative h-24 rounded-xl overflow-hidden mb-3">
                    <Image src={v.imageUrl} alt={v.name} fill sizes="240px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-24 rounded-xl bg-paper-2 flex items-center justify-center mb-3">
                    <Car size={30} className="text-blue/50" />
                  </div>
                )}
                <p className="font-display text-sm text-navy leading-tight">{v.name}</p>
                <p className="font-body text-[11px] text-ink-text/50 mt-1">{v.description}</p>
                <p className="font-stamp text-[10px] uppercase tracking-wide text-blue mt-2">
                  {t("seats", { count: v.seats })}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 4 — HOTEL CATEGORY */}
      <section>
        <SectionHeading step={t("step4")} icon={Hotel} title={t("hotelTitle")} subtitle={t("hotelSubtitle")} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {HOTEL_CATEGORIES.map((h) => {
            const selected = hotel === h.id;
            return (
              <button
                type="button"
                key={h.id}
                onClick={() => setHotel(selected ? "" : h.id)}
                aria-pressed={selected}
                className={`bg-white rounded-2xl p-5 text-center transition-all ${
                  selected ? "ring-[3px] ring-blue shadow-lg shadow-blue/20" : "ring-1 ring-navy/10 hover:ring-blue/40"
                }`}
              >
                <div className="flex justify-center gap-0.5 mb-2.5 h-4">
                  {h.stars > 0 ? (
                    [...Array(h.stars)].map((_, i) => <Star key={i} size={14} className="fill-clay text-clay" />)
                  ) : (
                    <span className="font-script text-base text-clay leading-none">♥</span>
                  )}
                </div>
                <p className="font-display text-sm text-navy">{t(`${h.key}Title`)}</p>
                <p className="font-body text-[11px] text-ink-text/50 mt-1">{t(`${h.key}Body`)}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 5 — CONTACT */}
      <section>
        <SectionHeading step={t("step5")} icon={Send} title={t("contactTitle")} subtitle={t("contactSubtitle")} />
        <div className="bg-white border border-navy/8 shadow-sm rounded-3xl p-6 sm:p-8 max-w-2xl">
          <div className="grid sm:grid-cols-2 gap-5">
            {(["name", "email", "phone"] as const).map((field) => (
              <div key={field} className={field === "phone" ? "sm:col-span-2" : ""}>
                <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-2">
                  {t(field)}{field !== "phone" && " *"}
                </label>
                <input
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  required={field !== "phone"}
                  value={contact[field]}
                  onChange={(e) => setContact((c) => ({ ...c, [field]: e.target.value }))}
                  className="w-full bg-paper-2/40 border border-navy/12 rounded-lg px-4 py-3 font-body text-sm text-navy focus:border-blue outline-none"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-2">
                {t("notes")}
              </label>
              <textarea
                rows={4}
                value={contact.notes}
                onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                placeholder={t("notesPlaceholder")}
                className="w-full bg-paper-2/40 border border-navy/12 rounded-lg px-4 py-3 font-body text-sm text-navy focus:border-blue outline-none resize-none"
              />
            </div>
          </div>

          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 font-body text-sm text-blue mt-4"
              >
                <AlertCircle size={15} /> {t("error")}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 inline-flex items-center gap-2 bg-blue text-white px-7 py-3.5 rounded-full font-body font-semibold shadow-lg shadow-blue/30 hover:bg-blue-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? t("submitting") : t("submit")} <Send size={16} />
          </button>
          {picked.length === 0 && (
            <p className="font-body text-xs text-ink-text/45 mt-3">{t("pickAtLeastOne")}</p>
          )}
        </div>
      </section>
    </form>
  );
}
