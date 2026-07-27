"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { saveTour } from "@/app/admin/actions";
import { categoryLabels, type TourCategory } from "@/lib/tours";

interface HighlightItem {
  en: string;
  de: string;
}
interface ItineraryItem {
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
  highlights: HighlightItem[];
  itinerary: { day: number; title: { en: string; de: string }; description: { en: string; de: string } }[];
  published: boolean;
}

const categories: TourCategory[] = [
  "wildlife",
  "heritage",
  "hillcountry",
  "wetland",
  "coastal",
  "city",
];

export default function TourForm({ tour }: { tour?: TourFormData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveTour(tour?.id ?? null, undefined, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
    // on success, saveTour() redirects server-side
  };

  const [highlights, setHighlights] = useState<HighlightItem[]>(
    tour?.highlights?.length ? tour.highlights : [{ en: "", de: "" }]
  );
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(
    tour?.itinerary?.length
      ? tour.itinerary.map((d) => ({
          titleEn: d.title.en,
          titleDe: d.title.de,
          descEn: d.description.en,
          descDe: d.description.de,
        }))
      : [{ titleEn: "", titleDe: "", descEn: "", descDe: "" }]
  );

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 font-body text-sm text-ink-text/60 hover:text-blue mb-6"
      >
        <ArrowLeft size={15} /> Back to tours
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug (URL, lowercase-with-dashes)" name="slug" defaultValue={tour?.slug} required />
            <div>
              <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
                Category
              </label>
              <select
                name="category"
                defaultValue={tour?.category ?? "wildlife"}
                className="w-full border border-navy/15 rounded-lg px-3 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c].en}
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
              label="Price from (USD, optional — not shown publicly)"
              name="price_from_usd"
              type="number"
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
            <div>
              <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
                Gallery images (one path/URL per line)
              </label>
              <textarea
                name="gallery"
                rows={4}
                defaultValue={tour?.gallery?.join("\n")}
                placeholder="/images/example.jpg"
                className="w-full border border-navy/12 rounded-lg px-3 py-2 font-body text-xs text-navy focus:border-blue outline-none resize-none"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Text (English / German)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title (EN)" name="title_en" defaultValue={tour?.title_en} required />
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
              onClick={() => setHighlights([...highlights, { en: "", de: "" }])}
              className="inline-flex items-center gap-1 font-body text-xs text-blue hover:text-blue-light"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {highlights.map((h, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-2 items-start">
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
                    onClick={() => setHighlights(highlights.filter((_, hi) => hi !== i))}
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
                setItinerary([...itinerary, { titleEn: "", titleDe: "", descEn: "", descDe: "" }])
              }
              className="inline-flex items-center gap-1 font-body text-xs text-blue hover:text-blue-light"
            >
              <Plus size={14} /> Add day
            </button>
          </div>
          <div className="flex flex-col gap-5">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-navy/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-stamp text-xs uppercase tracking-wide text-blue">Day {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => setItinerary(itinerary.filter((_, di) => di !== i))}
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
          <p className="font-body text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
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
            onClick={() => router.push("/admin")}
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
