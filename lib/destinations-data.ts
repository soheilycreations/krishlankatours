import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  destinations as staticDestinations,
  type Destination,
} from "@/lib/destinations";
import type { LocalizedText } from "@/lib/tours";

interface DestinationRow {
  id: string;
  slug: string;
  name_en: string;
  name_de: string | null;
  region_en: string | null;
  region_de: string | null;
  tagline_en: string | null;
  tagline_de: string | null;
  image: string | null;
  description: LocalizedText[] | null;
  highlights: LocalizedText[] | null;
  best_time_en: string | null;
  best_time_de: string | null;
  related_tour_slug: string | null;
  published: boolean;
  sort_order: number;
}

function rowToDestination(row: DestinationRow): Destination {
  return {
    slug: row.slug,
    name: { en: row.name_en, de: row.name_de ?? row.name_en },
    region: { en: row.region_en ?? "", de: row.region_de ?? row.region_en ?? "" },
    tagline: { en: row.tagline_en ?? "", de: row.tagline_de ?? row.tagline_en ?? "" },
    image: row.image ?? "",
    description: row.description ?? [],
    highlights: row.highlights ?? [],
    bestTime: { en: row.best_time_en ?? "", de: row.best_time_de ?? row.best_time_en ?? "" },
    relatedTourSlug: row.related_tour_slug ?? "",
  };
}

/** Fetches destinations from Supabase (published only), falling back to
 *  the starter content in lib/destinations.ts if Supabase isn't
 *  configured, the table is empty, or the request fails. */
export async function getDestinations(): Promise<Destination[]> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return staticDestinations;

    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticDestinations;

    return (data as DestinationRow[]).map(rowToDestination);
  } catch {
    return staticDestinations;
  }
}
