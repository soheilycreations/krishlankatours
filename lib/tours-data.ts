import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  tours as staticTours,
  type Tour,
  type TourCategory,
  type LocalizedText,
} from "@/lib/tours";

interface TourRow {
  id: string;
  slug: string;
  category: string;
  duration_days: number;
  price_from_usd: number | null;
  group_size: string | null;
  hero_image: string | null;
  gallery: string[] | null;
  title_en: string;
  title_de: string | null;
  tagline_en: string | null;
  tagline_de: string | null;
  summary_en: string | null;
  summary_de: string | null;
  highlights: LocalizedText[] | null;
  itinerary:
    | {
        day: number;
        title: LocalizedText;
        description: LocalizedText;
      }[]
    | null;
  published: boolean;
  sort_order: number;
}

function rowToTour(row: TourRow): Tour {
  return {
    slug: row.slug,
    category: row.category as TourCategory,
    durationDays: row.duration_days,
    priceFromUsd: row.price_from_usd ?? 0,
    groupSize: row.group_size ?? "",
    heroImage: row.hero_image ?? undefined,
    gallery: row.gallery ?? [],
    title: { en: row.title_en, de: row.title_de ?? row.title_en },
    tagline: { en: row.tagline_en ?? "", de: row.tagline_de ?? row.tagline_en ?? "" },
    summary: { en: row.summary_en ?? "", de: row.summary_de ?? row.summary_en ?? "" },
    highlights: row.highlights ?? [],
    itinerary: row.itinerary ?? [],
  };
}

/** Fetches tours from Supabase (published only). Falls back to the
 *  starter content in lib/tours.ts if Supabase isn't configured, the
 *  table is empty, or the request fails — the public site never breaks
 *  because of the CMS. */
export async function getTours(): Promise<Tour[]> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return staticTours;

    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticTours;

    return (data as TourRow[]).map(rowToTour);
  } catch {
    return staticTours;
  }
}

export async function getTourBySlugFromDb(slug: string): Promise<Tour | undefined> {
  const tours = await getTours();
  return tours.find((t) => t.slug === slug);
}
