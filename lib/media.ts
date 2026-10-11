/**
 * Supabase Storage → Cloudflare image proxy.
 *
 * Photos uploaded in the admin panel live in the public `tour-images`
 * bucket and are stored in the database as full Supabase URLs, e.g.
 *   https://<ref>.supabase.co/storage/v1/object/public/tour-images/<uuid>.webp
 *
 * The public site rewrites those to `/media/tour-images/<uuid>.webp`, which
 * is served by `app/media/[...path]/route.ts`. That route caches each file
 * at Cloudflare's edge for a year (file names are random UUIDs, so they
 * never change), so Supabase Storage egress is paid once per file per
 * Cloudflare location instead of once per page view.
 *
 * Nothing in the database changes — the rewrite happens at render time.
 */

export const MEDIA_BUCKETS = ["tour-images"] as const;

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const PUBLIC_PREFIX = SUPABASE_URL ? `${SUPABASE_URL}/storage/v1/object/public/` : "";

/** Rewrites a Supabase public-storage URL to the cached `/media/...` path.
 *  Any other value (local `/images/...` paths, other hosts, empty) is
 *  returned unchanged. */
export function mediaUrl(src: string | null | undefined): string {
  if (!src) return "";
  if (!PUBLIC_PREFIX || !src.startsWith(PUBLIC_PREFIX)) return src;
  const rest = src.slice(PUBLIC_PREFIX.length).split("?")[0];
  const bucket = rest.split("/")[0];
  if (!(MEDIA_BUCKETS as readonly string[]).includes(bucket)) return src;
  return `/media/${rest}`;
}

export function mediaUrls(list: (string | null | undefined)[] | null | undefined): string[] {
  return (list ?? []).map(mediaUrl).filter(Boolean);
}

/** Origin URL in Supabase Storage for a proxied `/media/<bucket>/<path>` request. */
export function supabaseStorageUrl(bucket: string, pathSegments: string[]): string | null {
  if (!PUBLIC_PREFIX) return null;
  return `${PUBLIC_PREFIX}${bucket}/${pathSegments.map(encodeURIComponent).join("/")}`;
}
