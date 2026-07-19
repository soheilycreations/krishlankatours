import { destinations } from "../lib/destinations";
import { writeFileSync, readFileSync, existsSync } from "fs";

function esc(s: string | undefined | null): string {
  if (s === undefined || s === null) return "null";
  return `'${s.replace(/'/g, "''")}'`;
}

function escJson(obj: unknown): string {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

let sql = `

-- Auto-generated from lib/destinations.ts — seeds the Supabase
-- "destinations" table with the same 6 destinations already on the site.
`;

destinations.forEach((dest, i) => {
  const description = dest.description.map((p) => ({ en: p.en, de: p.de }));
  const highlights = dest.highlights.map((h) => ({ en: h.en, de: h.de }));

  sql += `insert into destinations (
  slug, name_en, name_de, region_en, region_de, tagline_en, tagline_de,
  image, description, highlights, best_time_en, best_time_de,
  related_tour_slug, sort_order
) values (
  ${esc(dest.slug)}, ${esc(dest.name.en)}, ${esc(dest.name.de)}, ${esc(dest.region.en)}, ${esc(dest.region.de)},
  ${esc(dest.tagline.en)}, ${esc(dest.tagline.de)}, ${esc(dest.image)}, ${escJson(description)}, ${escJson(highlights)},
  ${esc(dest.bestTime.en)}, ${esc(dest.bestTime.de)}, ${esc(dest.relatedTourSlug)}, ${i}
);

`;
});

const seedPath = __dirname + "/../supabase/seed.sql";
const existing = existsSync(seedPath) ? readFileSync(seedPath, "utf-8") : "";
writeFileSync(seedPath, existing + sql);
console.log(`Appended ${destinations.length} destinations to supabase/seed.sql`);
