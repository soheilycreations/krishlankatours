import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images are served as-is (no on-the-fly optimisation). Static photos in
    // /public are pre-compressed, and admin uploads are resized to WebP in the
    // browser before upload (lib/image-compress.ts). Supabase photos are
    // proxied and edge-cached via /media/... (app/media/[...path]/route.ts).
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);

// Makes Cloudflare bindings (R2, D1, ...) available to `next dev`.
initOpenNextCloudflareForDev();
