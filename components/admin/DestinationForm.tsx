"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { saveDestination } from "@/app/admin/actions";

interface TextItem {
  en: string;
  de: string;
}

export interface DestinationFormData {
  id?: string;
  slug: string;
  name_en: string;
  name_de: string;
  region_en: string;
  region_de: string;
  tagline_en: string;
  tagline_de: string;
  image: string | null;
  description: TextItem[];
  highlights: TextItem[];
  best_time_en: string;
  best_time_de: string;
  related_tour_slug: string;
  published: boolean;
}

export default function DestinationForm({ destination }: { destination?: DestinationFormData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const [description, setDescription] = useState<TextItem[]>(
    destination?.description?.length ? destination.description : [{ en: "", de: "" }]
  );
  const [highlights, setHighlights] = useState<TextItem[]>(
    destination?.highlights?.length ? destination.highlights : [{ en: "", de: "" }]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveDestination(destination?.id ?? null, undefined, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-1.5 font-body text-sm text-ink-text/60 hover:text-blue mb-6"
      >
        <ArrowLeft size={15} /> Back to destinations
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug (URL, lowercase-with-dashes)" name="slug" defaultValue={destination?.slug} required />
            <Field label="Related tour slug" name="related_tour_slug" defaultValue={destination?.related_tour_slug} />
            <Field label="Name (EN)" name="name_en" defaultValue={destination?.name_en} required />
            <Field label="Name (DE)" name="name_de" defaultValue={destination?.name_de} />
            <Field label="Region (EN)" name="region_en" defaultValue={destination?.region_en} />
            <Field label="Region (DE)" name="region_de" defaultValue={destination?.region_de} />
            <Field label="Tagline (EN)" name="tagline_en" defaultValue={destination?.tagline_en} />
            <Field label="Tagline (DE)" name="tagline_de" defaultValue={destination?.tagline_de} />
            <Field label="Best time to visit (EN)" name="best_time_en" defaultValue={destination?.best_time_en} />
            <Field label="Best time to visit (DE)" name="best_time_de" defaultValue={destination?.best_time_de} />
          </div>
          <label className="flex items-center gap-2 mt-4 font-body text-sm text-ink-text/70">
            <input
              type="checkbox"
              name="published"
              defaultChecked={destination?.published ?? true}
              className="w-4 h-4 accent-blue"
            />
            Published (visible on the public site)
          </label>
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <h2 className="font-display text-lg text-navy mb-4">Image</h2>
          <ImageUploadField label="Photo" name="image" defaultValue={destination?.image ?? ""} />
        </section>

        <section className="bg-white rounded-2xl border border-navy/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-navy">Description paragraphs</h2>
            <button
              type="button"
              onClick={() => setDescription([...description, { en: "", de: "" }])}
              className="inline-flex items-center gap-1 font-body text-xs text-blue hover:text-blue-light"
            >
              <Plus size={14} /> Add paragraph
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {description.map((d, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-2 items-start">
                <textarea
                  name={`description_en_${i}`}
                  defaultValue={d.en}
                  placeholder="Paragraph (EN)"
                  rows={3}
                  className="border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none resize-none"
                />
                <div className="flex gap-2">
                  <textarea
                    name={`description_de_${i}`}
                    defaultValue={d.de}
                    placeholder="Paragraph (DE)"
                    rows={3}
                    className="flex-1 border border-navy/12 rounded-lg px-3 py-2 font-body text-sm text-navy focus:border-blue outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => setDescription(description.filter((_, di) => di !== i))}
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

        {error && (
          <p className="font-body text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-body font-medium hover:bg-blue-light transition-colors disabled:opacity-60"
          >
            <Save size={16} /> {pending ? "Saving..." : "Save destination"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/destinations")}
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
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-navy/15 rounded-lg px-3 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
      />
    </div>
  );
}
