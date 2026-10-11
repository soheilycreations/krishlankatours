import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE, SITE_URL } from "@/lib/site-config";

/**
 * URL + metadata helpers.
 *
 * URL scheme (next-intl, localePrefix "as-needed"):
 *   English (default): https://krishlankatours.com/tours
 *   German:            https://krishlankatours.com/de/tours
 * `/en/...` URLs redirect to the unprefixed version, so they are never
 * used as canonical or in the sitemap.
 */

/** `path` is "" for the home page, otherwise starts with "/" (e.g. "/tours/kandy-day-tour"). */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  const p = localizedPath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

/** canonical + hreflang (en, de, x-default) for a page. */
export function alternatesFor(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(l, path);
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return { canonical: absoluteUrl(locale, path), languages };
}

/** Converts a site-relative image path to an absolute URL for OG tags. */
export function absoluteImage(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  absoluteTitle = false,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
  image?: string | null;
  /** Use the title as-is instead of the "%s | Krish Lanka Tours & Travels" template. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(locale, path);
  const ogImage = absoluteImage(image);
  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    ...(description ? { description } : {}),
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      url,
      locale: locale === "de" ? "de_DE" : "en_GB",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    ...(ogImage || title
      ? {
          twitter: {
            card: "summary_large_image",
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            ...(ogImage ? { images: [ogImage] } : {}),
          },
        }
      : {}),
  };
}

type PageSeo = { title: string; description: string };

/** Titles/descriptions for the fixed pages, per locale. */
export const STATIC_PAGE_SEO: Record<string, Record<Locale, PageSeo>> = {
  "": {
    en: {
      title: "Krish Lanka Tours & Travels — Private Tours in Sri Lanka",
      description:
        "Private driver-guided Sri Lanka tours, airport transfers, and custom itineraries — Yala safari, Sigiriya, Ella day tours, whale watching and more. Rated 5.0 on TripAdvisor. Based in Ahungalla.",
    },
    de: {
      title: "Krish Lanka Tours & Travels — Private Touren in Sri Lanka",
      description:
        "Private Sri-Lanka-Touren mit Fahrer-Guide, Flughafentransfers und individuelle Reiserouten — Yala-Safari, Sigiriya, Ella, Walbeobachtung und mehr. 5,0 auf TripAdvisor. Mit Sitz in Ahungalla.",
    },
  },
  "/tours": {
    en: {
      title: "Sri Lanka Tour Packages & Day Tours",
      description:
        "Private Sri Lanka tours and day trips — safaris, ancient cities, tea country, the coast and village tours. Every route can be adjusted to your pace.",
    },
    de: {
      title: "Sri-Lanka-Touren & Tagesausflüge",
      description:
        "Private Sri-Lanka-Touren und Tagesausflüge — Safaris, alte Königsstädte, Teeland, Küste und Dorftouren. Jede Route lässt sich an Ihr Tempo anpassen.",
    },
  },
  "/destinations": {
    en: {
      title: "Sri Lanka Destinations",
      description:
        "The places most Sri Lanka trips are built around — what each is really like, the highlights, and the best time to visit.",
    },
    de: {
      title: "Reiseziele in Sri Lanka",
      description:
        "Die Orte, um die sich die meisten Sri-Lanka-Reisen drehen — wie sie wirklich sind, die Highlights und die beste Reisezeit.",
    },
  },
  "/gallery": {
    en: {
      title: "Photo Gallery",
      description:
        "Wildlife, ancient stone, tea country and coast — photos from our private Sri Lanka tours over the years.",
    },
    de: {
      title: "Fotogalerie",
      description:
        "Tierwelt, alte Steinstädte, Teeland und Küste — Fotos von unseren privaten Sri-Lanka-Touren aus mehreren Jahren.",
    },
  },
  "/about": {
    en: {
      title: "About Us",
      description:
        "Meet the driver-guide behind Krish Lanka Tours & Travels — private Sri Lanka tours from Ahungalla since 2008.",
    },
    de: {
      title: "Über uns",
      description:
        "Lernen Sie den Fahrer-Guide hinter Krish Lanka Tours & Travels kennen — private Sri-Lanka-Touren aus Ahungalla seit 2008.",
    },
  },
  "/contact": {
    en: {
      title: "Contact & Booking Enquiry",
      description:
        "Plan your private Sri Lanka tour — send your dates and interests, or message us on WhatsApp. Personal replies within a day.",
    },
    de: {
      title: "Kontakt & Buchungsanfrage",
      description:
        "Planen Sie Ihre private Sri-Lanka-Tour — senden Sie Reisedaten und Interessen oder schreiben Sie uns auf WhatsApp. Persönliche Antwort innerhalb eines Tages.",
    },
  },
  "/plan": {
    en: {
      title: "Build Your Own Sri Lanka Trip",
      description:
        "Pick the places you love, choose your dates, vehicle and hotel style — we'll craft a private Sri Lanka itinerary around you.",
    },
    de: {
      title: "Eigene Sri-Lanka-Reise zusammenstellen",
      description:
        "Wählen Sie Ihre Lieblingsorte, Reisedaten, Fahrzeug und Hotelstil — wir planen Ihre private Sri-Lanka-Route.",
    },
  },
  "/faq": {
    en: {
      title: "Frequently Asked Questions",
      description: "Everything guests usually ask before booking a private Sri Lanka tour.",
    },
    de: {
      title: "Häufig gestellte Fragen",
      description: "Alles, was Gäste vor einer privaten Sri-Lanka-Tour meist fragen.",
    },
  },
  "/vehicles": {
    en: {
      title: "Our Vehicle Fleet — Sri Lanka Private Tours",
      description:
        "Cars, vans, SUVs and mini coaches for private Sri Lanka tours — all with experienced, English-speaking driver-guides. Choose the right vehicle for your group.",
    },
    de: {
      title: "Unsere Fahrzeuge — Private Sri-Lanka-Touren",
      description:
        "Autos, Vans, SUVs und Minibusse für private Sri-Lanka-Touren — alle mit erfahrenem, englischsprachigem Fahrer-Guide.",
    },
  },
  "/blog": {
    en: {
      title: "Sri Lanka Travel Tips & Blog",
      description:
        "Practical Sri Lanka travel tips — best time to visit, packing lists, Sigiriya vs Pidurangala, and more from a local private tour operator.",
    },
    de: {
      title: "Sri-Lanka-Reisetipps & Blog",
      description:
        "Praktische Sri-Lanka-Reisetipps — beste Reisezeit, Packliste, Sigiriya oder Pidurangala und mehr von einem lokalen Tourenanbieter.",
    },
  },
  "/airport-transfer": {
    en: {
      title: "Airport Transfer Sri Lanka — Colombo (CMB) to Ahungalla, Bentota & Beyond",
      description:
        "Reliable private airport transfer Sri Lanka — Bandaranaike Airport (CMB) pickup and drop-off to Ahungalla, Bentota, Galle and hotels across the south coast. Fixed prices, English-speaking drivers.",
    },
    de: {
      title: "Flughafentransfer Sri Lanka — Colombo (CMB) nach Ahungalla, Bentota & mehr",
      description:
        "Zuverlässiger privater Flughafentransfer in Sri Lanka — Abholung am Flughafen Bandaranaike (CMB) und Fahrt nach Ahungalla, Bentota, Galle und zu Hotels an der Südküste. Festpreise.",
    },
  },
  "/taxi-service": {
    en: {
      title: "Private Taxi Service Sri Lanka — Point-to-Point Transfers",
      description:
        "Private taxi service across Sri Lanka — comfortable, air-conditioned point-to-point transfers between cities, beaches and hill country with English-speaking drivers.",
    },
    de: {
      title: "Privater Taxiservice Sri Lanka — Transfers von Ort zu Ort",
      description:
        "Privater Taxiservice in ganz Sri Lanka — komfortable, klimatisierte Transfers zwischen Städten, Stränden und Hochland.",
    },
  },
  "/surfing": {
    en: {
      title: "Surfing Tours — Hikkaduwa & Weligama, Sri Lanka",
      description:
        "Private surf trips to Hikkaduwa and Weligama, Sri Lanka's best beginner and intermediate surf spots. Board hire, spot recommendations, and driver-guided transport from your hotel.",
    },
    de: {
      title: "Surftouren — Hikkaduwa & Weligama, Sri Lanka",
      description:
        "Private Surfausflüge nach Hikkaduwa und Weligama, Sri Lankas beste Spots für Anfänger und Fortgeschrittene. Boardverleih, Spot-Tipps und Transport ab Ihrem Hotel.",
    },
  },
};

/** Metadata for one of the fixed pages listed in STATIC_PAGE_SEO. */
export function staticPageMetadata(locale: Locale, path: string): Metadata {
  const seo = STATIC_PAGE_SEO[path]?.[locale];
  return pageMetadata({
    locale,
    path,
    title: seo?.title,
    description: seo?.description,
    absoluteTitle: path === "",
  });
}

/** The fixed (non-database) public pages, for the sitemap. */
export const STATIC_PATHS = Object.keys(STATIC_PAGE_SEO);
