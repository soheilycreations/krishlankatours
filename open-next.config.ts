import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

/**
 * Caching on Cloudflare (Workers FREE plan — no R2, no Durable Objects):
 * - KV stores rendered ISR/SSG pages (incremental cache).
 * - D1 stores tag/path revalidation timestamps, so `revalidatePath()` calls
 *   from the admin panel refresh the live pages immediately.
 * - The memory queue runs time-based background revalidation by calling
 *   this same Worker through the WORKER_SELF_REFERENCE service binding.
 *
 * Net effect: public pages are served from cache and Supabase is only
 * queried when a page is (re)generated, not on every visit.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: memoryQueue,
});
