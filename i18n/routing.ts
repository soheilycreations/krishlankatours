import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // hreflang alternates are emitted in each page's <head> (lib/seo.ts)
  // using the canonical domain, so the middleware's Link header is off.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
