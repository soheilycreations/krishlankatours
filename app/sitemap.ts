import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getTours } from "@/lib/tours-data";
import { getDestinations } from "@/lib/destinations-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://krishlankatours.com";

const STATIC_PATHS = ["", "/tours", "/destinations", "/gallery", "/about", "/contact", "/plan"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  try {
    const tours = await getTours();
    for (const locale of routing.locales) {
      for (const tour of tours) {
        entries.push({
          url: `${SITE_URL}/${locale}/tours/${tour.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Supabase not configured at build time — static tours still covered above
  }

  try {
    const destinations = await getDestinations();
    for (const locale of routing.locales) {
      for (const d of destinations) {
        entries.push({
          url: `${SITE_URL}/${locale}/destinations/${d.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // ignore
  }

  return entries;
}
