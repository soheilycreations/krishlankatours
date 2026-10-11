import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/site-config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import SocialRail from "@/components/SocialRail";
import GoogleTranslate from "@/components/GoogleTranslate";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const travelAgencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/images/logo.jpg`,
  image: `${SITE.url}/og-image.jpg`,
  telephone: SITE.phoneTel,
  email: SITE.email,
  foundingDate: String(SITE.founded),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahungalla",
    addressCountry: "LK",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "6",
  },
  sameAs: [SITE.tripadvisor, SITE.facebook, SITE.instagram, SITE.youtube, SITE.googleMaps],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Only "en" (served unprefixed) and "de" exist; anything else is a 404.
  // (Don't use `dynamicParams = false` here: it makes Next.js answer 404
  // for /de pages when they are regenerated after an admin edit.)
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enables static rendering for every page below this layout.
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${fontVariables} font-body bg-paper text-ink-text antialiased`}>
        <NextIntlClientProvider>
          <GoogleTranslate />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencyJsonLd) }}
          />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
          <SocialRail />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
