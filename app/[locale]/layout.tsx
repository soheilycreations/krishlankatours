import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import SocialRail from "@/components/SocialRail";
import GoogleTranslate from "@/components/GoogleTranslate";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <GoogleTranslate />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Krish Lanka Tours & Travels",
            url: "https://krishlankatours.vercel.app",
            logo: "https://krishlankatours.vercel.app/images/logo.jpg",
            telephone: "+94779168959",
            foundingDate: "2008",
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
            sameAs: [
              "https://www.tripadvisor.com/Attraction_Review-g608521-d34220717-Reviews-Krish_Lanka_Tours_Travels-Ahungalla_Galle_District_Southern_Province.html",
              "https://www.facebook.com/people/Krish-Lanka-Tours-Travels/61582721903932/",
              "https://www.instagram.com/p/DX9dCTTiP5b/",
              "https://www.youtube.com/channel/UCcQ9ReFdTijG2JACuwz1W9Q",
              "https://maps.app.goo.gl/x7srx8h3AX121UUj9",
            ],
          }),
        }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFab />
      <SocialRail />
    </NextIntlClientProvider>
  );
}
