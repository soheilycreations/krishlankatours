"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { tours } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const preselectedTour = searchParams.get("tour") || "";

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tourSlug: preselectedTour,
    travelDates: "",
    groupSize: "",
    message: "",
  });

  useEffect(() => {
    if (preselectedTour) {
      setForm((f) => ({ ...f, tourSlug: preselectedTour }));
    }
  }, [preselectedTour]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-ink-2 border border-gold/20 rounded-2xl p-10 text-center">
        <CheckCircle2 className="text-gold mx-auto mb-4" size={40} />
        <h3 className="font-display text-2xl text-paper mb-2">{t("successTitle")}</h3>
        <p className="font-body text-paper/65 max-w-sm mx-auto">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ink-2 border border-gold/20 rounded-2xl p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t("formName")} name="name" value={form.name} onChange={handleChange} required />
        <Field label={t("formEmail")} name="email" type="email" value={form.email} onChange={handleChange} required />
        <Field label={t("formPhone")} name="phone" value={form.phone} onChange={handleChange} />
        <div>
          <label className="block font-stamp text-xs uppercase tracking-wide text-paper/50 mb-2">
            {t("formTour")}
          </label>
          <select
            name="tourSlug"
            value={form.tourSlug}
            onChange={handleChange}
            className="w-full bg-ink border border-paper/15 rounded-lg px-4 py-3 font-body text-sm text-paper focus:border-gold outline-none"
          >
            <option value="">{t("formTourPlaceholder")}</option>
            {tours.map((tour) => (
              <option key={tour.slug} value={tour.slug}>
                {tour.title[locale]}
              </option>
            ))}
          </select>
        </div>
        <Field label={t("formDates")} name="travelDates" value={form.travelDates} onChange={handleChange} />
        <Field label={t("formGroupSize")} name="groupSize" value={form.groupSize} onChange={handleChange} />
      </div>

      <div className="mt-5">
        <label className="block font-stamp text-xs uppercase tracking-wide text-paper/50 mb-2">
          {t("formMessage")}
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder={t("formMessagePlaceholder")}
          value={form.message}
          onChange={handleChange}
          className="w-full bg-ink border border-paper/15 rounded-lg px-4 py-3 font-body text-sm text-paper placeholder:text-paper/30 focus:border-gold outline-none resize-none"
        />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 mt-5 text-clay"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="font-body text-sm">{t("errorBody")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-ink px-7 py-3.5 rounded-full font-body font-medium hover:bg-gold-light transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
        {status !== "submitting" && <Send size={16} />}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-stamp text-xs uppercase tracking-wide text-paper/50 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-ink border border-paper/15 rounded-lg px-4 py-3 font-body text-sm text-paper focus:border-gold outline-none"
      />
    </div>
  );
}
