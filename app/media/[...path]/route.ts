import { getCloudflareContext } from "@opennextjs/cloudflare";
import { MEDIA_BUCKETS, supabaseStorageUrl } from "@/lib/media";

/**
 * GET /media/<bucket>/<path>
 *
 * Serves files from the public Supabase Storage bucket through Cloudflare:
 *   1. Look in Cloudflare's edge cache (Cache API) — hit → no Supabase request.
 *   2. Miss → fetch once from Supabase, store in the edge cache for a year,
 *      and return it with a long browser Cache-Control.
 *
 * Uploaded file names are random UUIDs and never overwritten, so caching
 * them "immutable" is safe. See lib/media.ts.
 *
 * Note: the Cache API only persists on a custom domain (krishlankatours.com),
 * not on *.workers.dev — there it still works, just without the edge cache.
 */

export const dynamic = "force-dynamic";

const ONE_YEAR = 60 * 60 * 24 * 365;
const SAFE_SEGMENT = /^[A-Za-z0-9._ ()-]+$/;

function notFound(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "public, max-age=60" },
  });
}

function edgeCache(): Cache | null {
  const c = (globalThis as unknown as { caches?: CacheStorage & { default?: Cache } }).caches;
  return c?.default ?? null;
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const [bucket, ...rest] = path ?? [];

  if (!bucket || !(MEDIA_BUCKETS as readonly string[]).includes(bucket) || rest.length === 0) {
    return notFound();
  }
  if (rest.some((seg) => seg === "." || seg === ".." || !SAFE_SEGMENT.test(seg))) {
    return notFound();
  }

  const upstreamUrl = supabaseStorageUrl(bucket, rest);
  if (!upstreamUrl) return notFound();

  // Cache key ignores query strings so ?v=... can't be used to bypass the cache.
  const url = new URL(request.url);
  const cacheKey = new Request(`${url.origin}${url.pathname}`, { method: "GET" });
  const cache = edgeCache();

  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl);
  } catch {
    return new Response("Upstream error", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  if (upstream.status === 404 || upstream.status === 400) return notFound();
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("Content-Type") ?? "application/octet-stream");
  const length = upstream.headers.get("Content-Length");
  if (length) headers.set("Content-Length", length);
  const etag = upstream.headers.get("ETag");
  if (etag) headers.set("ETag", etag);
  headers.set("Cache-Control", `public, max-age=${ONE_YEAR}, immutable`);
  headers.set("X-Content-Type-Options", "nosniff");

  const response = new Response(upstream.body, { status: 200, headers });

  if (cache) {
    const toStore = response.clone();
    try {
      getCloudflareContext().ctx.waitUntil(cache.put(cacheKey, toStore));
    } catch {
      // Not running on Cloudflare (e.g. `next dev`) — skip edge caching.
    }
  }

  return response;
}
