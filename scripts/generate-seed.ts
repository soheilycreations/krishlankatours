import { tours } from "../lib/tours";
import { writeFileSync } from "fs";

function esc(s: string | undefined | null): string {
  if (s === undefined || s === null) return "null";
  return `'${s.replace(/'/g, "''")}'`;
}

function escArr(arr: string[]): string {
  if (!arr || arr.length === 0) return "'{}'";
  return `ARRAY[${arr.map((s) => esc(s)).join(", ")}]::text[]`;
}

function escJson(obj: unknown): string {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

let sql = `-- Auto-generated from lib/tours.ts — seeds the Supabase "tours" table
-- with the same 12 tours already on the site. Safe to run once after
-- supabase/schema.sql. Re-running will error on the unique slug
-- constraint rather than duplicate rows.

`;

tours.forEach((tour, i) => {
  const highlights = tour.highlights.map((h) => ({ en: h.en, de: h.de }));
  const itinerary = tour.itinerary.map((day) => ({
    day: day.day,
    title: { en: day.title.en, de: day.title.de },
    description: { en: day.description.en, de: day.description.de },
  }));

  sql += `insert into tours (
  slug, category, duration_days, price_from_usd, group_size,
  hero_image, gallery, title_en, title_de, tagline_en, tagline_de,
  summary_en, summary_de, highlights, itinerary, sort_order
) values (
  ${esc(tour.slug)}, ${esc(tour.category)}, ${tour.durationDays}, ${tour.priceFromUsd}, ${esc(tour.groupSize)},
  ${esc(tour.heroImage)}, ${escArr(tour.gallery)}, ${esc(tour.title.en)}, ${esc(tour.title.de)}, ${esc(tour.tagline.en)}, ${esc(tour.tagline.de)},
  ${esc(tour.summary.en)}, ${esc(tour.summary.de)}, ${escJson(highlights)}, ${escJson(itinerary)}, ${i}
);

`;
});

writeFileSync(__dirname + "/../supabase/seed.sql", sql);
console.log(`Wrote supabase/seed.sql with ${tours.length} tours`);
