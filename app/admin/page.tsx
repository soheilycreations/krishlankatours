import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ImageOff, AlertTriangle } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { tours as staticTours } from "@/lib/tours";
import DeleteTourButton from "@/app/admin/DeleteTourButton";

export const dynamic = "force-dynamic";

interface TourRow {
  id: string;
  slug: string;
  title_en: string;
  category: string;
  hero_image: string | null;
  published: boolean;
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <h1 className="font-display text-xl text-navy mb-2">Supabase isn&apos;t configured</h1>
        <p className="font-body text-sm text-ink-text/60 max-w-md mx-auto">
          Add <code className="bg-paper-2 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="bg-paper-2 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
          your environment, run <code className="bg-paper-2 px-1.5 py-0.5 rounded">supabase/schema.sql</code>,
          then reload this page.
        </p>
      </div>
    );
  }

  const { data } = await supabase
    .from("tours")
    .select("id, slug, title_en, category, hero_image, published")
    .order("sort_order", { ascending: true });

  const tours = (data as TourRow[]) ?? [];
  const usingFallback = tours.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy">Tours</h1>
          <p className="font-body text-sm text-ink-text/55 mt-1">
            {usingFallback
              ? "No tours in the database yet — the public site is showing the starter content from lib/tours.ts."
              : `${tours.length} tour${tours.length === 1 ? "" : "s"} in the database.`}
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 bg-blue text-white px-4 py-2.5 rounded-full font-body text-sm font-medium hover:bg-blue-light transition-colors shrink-0"
        >
          <Plus size={16} /> New tour
        </Link>
      </div>

      {usingFallback && (
        <div className="bg-clay/10 border border-clay/25 rounded-xl p-4 mb-8 font-body text-sm text-ink-text/70">
          Tip: run <code className="bg-white px-1.5 py-0.5 rounded">supabase/seed.sql</code> in your
          Supabase SQL editor to load the same 12 tours currently on the site, then edit them from here.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-navy/10 divide-y divide-navy/8 overflow-hidden">
        {tours.map((tour) => (
          <div key={tour.id} className="flex items-center gap-4 p-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-paper-2 shrink-0">
              {tour.hero_image ? (
                <Image src={tour.hero_image} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-text/30">
                  <ImageOff size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-navy truncate">{tour.title_en}</p>
              <p className="font-body text-xs text-ink-text/50">
                {tour.category} · {tour.slug} {!tour.published && "· draft"}
              </p>
            </div>
            <Link
              href={`/admin/tours/${tour.id}`}
              className="shrink-0 w-9 h-9 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-colors"
              aria-label="Edit"
            >
              <Pencil size={15} />
            </Link>
            <DeleteTourButton tourId={tour.id} tourTitle={tour.title_en} />
          </div>
        ))}
        {tours.length === 0 && (
          <div className="p-8 text-center font-body text-sm text-ink-text/50">
            No tours yet. Click &ldquo;New tour&rdquo; to add one, or run the seed script mentioned above.
          </div>
        )}
      </div>

      <p className="font-body text-xs text-ink-text/40 mt-6">
        Showing {staticTours.length} starter tours as reference in{" "}
        <code className="bg-white px-1.5 py-0.5 rounded border border-navy/10">lib/tours.ts</code> — these
        aren&apos;t affected by anything you do here.
      </p>
    </div>
  );
}
