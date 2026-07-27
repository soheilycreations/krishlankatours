import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ImageOff, AlertTriangle } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DeleteDestinationButton from "@/app/admin/DeleteDestinationButton";

export const dynamic = "force-dynamic";

interface DestinationRow {
  id: string;
  slug: string;
  name_en: string;
  region_en: string | null;
  image: string | null;
  published: boolean;
}

export default async function DestinationsAdminPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <h1 className="font-display text-xl text-navy mb-2">Not connected yet</h1>
        <p className="font-body text-sm text-ink-text/60 max-w-md mx-auto">
          This system isn&apos;t connected yet. Please contact your developer to finish setting this up.
        </p>
      </div>
    );
  }

  const { data } = await supabase
    .from("destinations")
    .select("id, slug, name_en, region_en, image, published")
    .order("sort_order", { ascending: true });

  const destinations = (data as DestinationRow[]) ?? [];
  const usingFallback = destinations.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy">Destinations</h1>
          <p className="font-body text-sm text-ink-text/55 mt-1">
            {usingFallback
              ? "No destinations added yet — the public site is showing the default starter destinations for now."
              : `${destinations.length} destination${destinations.length === 1 ? "" : "s"} added.`}
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 bg-blue text-white px-4 py-2.5 rounded-full font-body text-sm font-medium hover:bg-blue-light transition-colors shrink-0"
        >
          <Plus size={16} /> New destination
        </Link>
      </div>

      {usingFallback && (
        <div className="bg-clay/10 border border-clay/25 rounded-xl p-4 mb-8 font-body text-sm text-ink-text/70">
          Tip: ask your developer to load the starter destinations into this system, so you can start
          editing them straight away instead of beginning from a blank list.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-navy/10 divide-y divide-navy/8 overflow-hidden">
        {destinations.map((dest) => (
          <div key={dest.id} className="flex items-center gap-4 p-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-paper-2 shrink-0">
              {dest.image ? (
                <Image src={dest.image} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-text/30">
                  <ImageOff size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-navy truncate">{dest.name_en}</p>
              <p className="font-body text-xs text-ink-text/50">
                {dest.region_en} · {dest.slug} {!dest.published && "· draft"}
              </p>
            </div>
            <Link
              href={`/admin/destinations/${dest.id}`}
              className="shrink-0 w-9 h-9 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-colors"
              aria-label="Edit"
            >
              <Pencil size={15} />
            </Link>
            <DeleteDestinationButton destinationId={dest.id} destinationName={dest.name_en} />
          </div>
        ))}
        {destinations.length === 0 && (
          <div className="p-8 text-center font-body text-sm text-ink-text/50">
            No destinations yet. Click &ldquo;New destination&rdquo; to add one.
          </div>
        )}
      </div>
    </div>
  );
}
