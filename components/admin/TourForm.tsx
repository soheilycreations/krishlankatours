"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import GalleryUploadField from "@/components/admin/GalleryUploadField";
import { saveTour } from "@/app/admin/actions";
import { slugify } from "@/lib/slug";
import type { CategoryOption } from "@/lib/admin-categories";

interface HighlightItem {
  key: string;
  en: string;
  de: string;
}

interface ItineraryItem {
  key: string;
  titleEn: string;
  titleDe: string;
  descEn: string;
  descDe: string;
}

export interface TourFormData {
  id?: string;
  slug: string;
  category: string;
  duration_days: number;
  price_from_usd: number | null;
  group_size: string;
  hero_image: string | null;
  gallery: string[];
  title_en: string;
  title_de: string;
  tagline_en: string;
  tagline_de: string;
  summary_en: string;
  summary_de: string;
  highlights: { en: string; de: string }[];
  itinerary: { day: number; title: { en: string; de: string }; description: { en: string; de: string } }[];
  published: boolean;
}

/** Stable React keys for list rows. Using the array index as key makes React
 *  reuse the wrong inputs when a row is removed (deleting row 1 used to
 *  remove the last row instead). */
let keySeq = 0;
const newKey = () => `row-${Date.now().toString(36)}-${(keySeq++).toString(36)}`;

export default function TourForm({
  tour,
  categoryOptions,
}: {
  tour?: TourFormData;
  categoryOptions: CategoryOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [titleEn, setTitleEn] = useState(tour?.title_en ?? "");

  // Make sure a tour's current category is always selectable, even if it
  // was removed from /admin/categories — otherwise saving would change it.
  const options =
    tour?.category && !categoryOptions.some((c) => c.slug === tour.category)
      ? [...categoryOptions, { slug: tour.category, label: tour.category }]
      : categoryOptions;

  const [highlights, setHighlights] = useState<HighlightItem[]>(
    tour?.highlights?.length
      ? tour.highlights.map((h) => ({ key: newKey(), en: h.en, de: h.de }))
      : [{ key: newKey(), en: "", de: "" }]
  );
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(
    tour?.itinerary?.length
      ? tour.itinerary.map((d) => ({
          key: newKey(),
          titleEn: d.title.en,
          titleDe: d.title.de,
          descEn: d.description.en,
          descDe: d.description.de,
        }))
      : [{ key: newKey(), titleEn: "", titleDe: "", descEn: "", descDe: "" }]
  );

  const slugPreview = tour?.slug ?? slugify(titleEn);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(e.currentTarget);

    if (!tour?.slug) {
      if (!slugify(String(formData.get("title_en") ?? ""))) {
        setError("Title (EN) needs at least one letter or number.");
        setPending(false);
        return;
      }
      // The server re-sanitizes; this is just the same value it will use.
      formData.set("slug", slugify(String(formData.get("title_en") ?? "")));
    }

    try {
      const result = await saveTour(tour?.id ?? null, undefined, formData);
      if (result?.error) {
        setError(result.error);
        setPending(false);
      }
      // on success, saveTour() redirects server-side
    } catch (err) {
      // redirect() is delivered as a thrown control-flow signal — let Next handle it.
      if (err && typeof err === "object" && "digest" in err) throw err;
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1.5 font-body text-sm text-ink-text/60 hover:text-blue mb-6"
      >
        <ArrowLeft size={15} /> Back to tours
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
                Category
              </label>
              <select
                name="category"
                defaultValue={tour?.category ?? options[0]?.slug ?? "wildlife"}
                className="w-full border border-navy/15 rounded-lg px-3 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
              >
                {options.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Duration (days)"
              name="duration_days"
              type="number"
              min={1}
              defaultValue={String(tour?.duration_days ?? 1)}
            />
            <Field
              label="Price from (USD, optional — shown on the site when above 0)"
              name="price_from_usd"
              type="number"
              min={0}
              defaultValue={tour?.price_from_usd != null ? String(tour.price_from_usd) : ""}
            />
            <Field label="Group size" name="group_size" defaultValue={tour?.group_size} className="sm:col-span-2" />
          </div>
          <label className="flex items-center gap-2 mt-4 font-body text-sm text-ink-text/70">
            <input
              type="checkbox"
              name="published"
              defaultChecked={tour?.published ?? true}
              className="w-4 h-4 accent-blue"
            />
            Published (visible on the public site)
          </label>
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Images</h2>
          <div className="flex flex-col gap-5">
            <ImageUploadField label="Hero image" name="hero_image" defaultValue={tour?.hero_image ?? ""} />
            <GalleryUploadField
              label="Tour photo gallery"
              name="gallery"
              defaultValue={tour?.gallery ?? []}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Text (English / German)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
                Title (EN)
              </label>
              <input
                type="text"
                name="title_en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                maxLength={160}
                className="w-full border border-navy/15 rounded-lg px-3 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
              />
              <p className="font-body text-[11px] text-ink-text/45 mt-1.5">
                Web address: /tours/<span className="text-navy">{slugPreview || "…"}</span>
                {tour?.slug ? " (fixed once a tour is created)" : ""}
              </p>
            </div>
            <Field label="Title (DE)" name="title_de" defaultValue={tour?.title_de} />
            <Field label="Tagline (EN)" name="tagline_en" defaultValue={tour?.tagline_en} />
            <Field label="Tagline (DE)" name="tagline_de" defaultValue={tour?.tagline_de} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <TextArea label="Summary (EN)" name="summary_en" defaultValue={tour?.summary_en} />
            <TextArea label="Summary (DE)" name="summary_de" defaultValue={tour?.summary_de} />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-navy">Highlights</h2>
            <button
              type="button"
              onClick={() => setHighlights([...highlights, { key: newKey(), en: "", de: "" }])}
              className="inline-flex items-center gap-1 font-body text-xs text-blue hover:text-blue-light"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {highlights.map((h, i) => (
              <div key={h.key} className="grid sm:grid-cols-2 gap-2 items-start">
                <input
                  name={`highlight_en_${i}`}
                  defaultValue={h.en}
                  placeholder="Highlight (EN)"
                  className="border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none"
                />
                <div className="flex gap-2">
                  <input
                    name={`highlight_de_${i}`}
                    defaultValue={h.de}
                    placeholder="Highlight (DE)"
                    className="flex-1 border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Remove highlight"
                    onClick={() => setHighlights(highlights.filter((x) => x.key !== h.key))}
                    className="shrink-0 w-9 h-9 rounded-lg border border-navy/12 flex items-center justify-center text-ink-text/40 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-navy">Itinerary (one entry per day, in order)</h2>
            <button
              type="button"
              onClick={() =>
                setItinerary([
                  ...itinerary,
                  { key: newKey(), titleEn: "", titleDe: "", descEn: "", descDe: "" },
                ])
              }
              className="inline-flex items-center gap-1 font-body text-xs text-blue hover:text-blue-light"
            >
              <Plus size={14} /> Add day
            </button>
          </div>
          <div className="flex flex-col gap-5">
            {itinerary.map((day, i) => (
              <div key={day.key} className="border border-navy/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-stamp text-xs uppercase tracking-wide text-blue">Day {i + 1}</span>
                  <button
                    type="button"
                    aria-label={`Remove day ${i + 1}`}
                    onClick={() => setItinerary(itinerary.filter((x) => x.key !== day.key))}
                    className="text-ink-text/40 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 mb-2">
                  <input
                    name={`itinerary_title_en_${i}`}
                    defaultValue={day.titleEn}
                    placeholder="Day title (EN)"
                    className="border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none"
                  />
                  <input
                    name={`itinerary_title_de_${i}`}
                    defaultValue={day.titleDe}
                    placeholder="Day title (DE)"
                    className="border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <textarea
                    name={`itinerary_desc_en_${i}`}
                    defaultValue={day.descEn}
                    placeholder="Description (EN)"
                    rows={2}
                    className="border border-navy/12 rounded-lg px-3 py-2 font-body text-xs text-navy focus:border-blue outline-none resize-none"
                  />
                  <textarea
                    name={`itinerary_desc_de_${i}`}
                    defaultValue={day.descDe}
                    placeholder="Description (DE)"
                    rows={2}
                    className="border border-navy/12 rounded-lg px-3 py-2 font-body text-xs text-navy focus:border-blue outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p role="alert" className="font-body text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-body font-medium hover:bg-blue-light transition-colors disabled:opacity-60"
          >
            <Save size={16} /> {pending ? "Saving..." : "Save tour"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/tours")}
            className="font-body text-sm text-ink-text/60 hover:text-navy px-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  min,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  min?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        min={min}
        className="w-full border border-navy/15 rounded-lg px-3 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
        {label}
      </label>
      <textarea
        name={name}
        rows={4}
        defaultValue={defaultValue}
        className="w-full border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none resize-none"
      />
    </div>
  );
}
