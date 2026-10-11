import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

/**
 * Caching on Cloudflare:
 * - R2 stores rendered ISR/SSG pages (incremental cache), with a per-region
 *   Cache API layer in front so most hits never touch R2.
 * - D1 stores tag/path revalidation timestamps, so `revalidatePath()` calls
 *   from the admin panel refresh the live pages immediately.
 * - A Durable Object queue runs time-based background revalidation.
 *
 * Net effect: public pages are served from cache and Supabase is only
 * queried when a page is (re)generated, not on every visit.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  tagCache: d1NextTagCache,
  queue: doQueue,
  enableCacheInterception: true,
});
