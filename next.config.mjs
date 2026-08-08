import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    // Vercel's free plan has a monthly Image Optimization quota (source
    // images processed). Once it's hit, ANY newly-referenced image starts
    // returning errors — which is exactly what was happening here (old
    // images kept working, new ones broke). Serving images unoptimized
    // trades a bit of automatic compression for images that always,
    // reliably display, with no quota risk.
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
