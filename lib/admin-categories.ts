import type { SupabaseClient } from "@supabase/supabase-js";
import { BUILT_IN_CATEGORIES, getCategoryLabel } from "@/lib/tours";

export interface CategoryOption {
  slug: string;
  label: string;
}

/** Every category a tour can use: the categories table (incl. inactive
 *  ones, e.g. "village") merged with the built-in list, so the admin tour
 *  form never "loses" a tour's category. */
export async function getCategoryOptions(supabase: SupabaseClient): Promise<CategoryOption[]> {
  const options = new Map<string, string>();
  const { data } = await supabase.from("categories").select("slug, name_en").order("sort_order");
  for (const row of data ?? []) {
    if (row.slug) options.set(row.slug, row.name_en || getCategoryLabel(row.slug, "en"));
  }
  for (const slug of BUILT_IN_CATEGORIES) {
    if (!options.has(slug)) options.set(slug, getCategoryLabel(slug, "en"));
  }
  return Array.from(options, ([slug, label]) => ({ slug, label }));
}
