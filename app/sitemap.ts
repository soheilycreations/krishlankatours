import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getTours } from "@/lib/tours-data";
import { getDestinations } from "@/lib/destinations-data";
import { getBlogPosts } from "@/lib/blog";
import { STATIC_PATHS, absoluteUrl } from "@/lib/seo";

// Regenerated at most once a day; admin edits to tours/destinations refresh it immediately.
export const revalidate = 86400; // 24 hours (keeps KV writes within the free plan)

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale, each listing every language version (hreflang). */
function entriesFor(
  path: string,
  opts: { changeFrequency: Entry["changeFrequency"]; priority: number; lastModified?: Date }
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(l, path);
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);

  return routing.locales.map((locale) => ({
    url: absoluteUrl(locale, path),
    ...(opts.lastModified ? { lastModified: opts.lastModified } : {}),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push(
      ...entriesFor(path, {
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      })
    );
  }

  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);

  for (const tour of tours) {
    entries.push(...entriesFor(`/tours/${tour.slug}`, { changeFrequency: "monthly", priority: 0.7 }));
  }
  for (const d of destinations) {
    entries.push(...entriesFor(`/destinations/${d.slug}`, { changeFrequency: "monthly", priority: 0.6 }));
  }
  for (const post of getBlogPosts()) {
    entries.push(
      ...entriesFor(`/blog/${post.slug}`, {
        changeFrequency: "yearly",
        priority: 0.6,
        lastModified: new Date(`${post.date}T00:00:00Z`),
      })
    );
  }

  return entries;
}
