import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import ServicePage from "@/components/ServicePage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale as Locale, "/taxi-service");
}

export default async function TaxiServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("taxiService");
  return (
    <ServicePage
      heroImage="/images/stock2/mountain-road-teacountry.jpg"
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      script="Wherever you need to be..."
      intro={t("intro")}
      points={t.raw("points") as string[]}
      image2="/images/stock3/tuktuk-forest-road.jpg"
      ctaTitle={t("ctaTitle")}
      ctaBody={t("ctaBody")}
      whatsappText={t("whatsapp")}
      contactText={t("contactCta")}
    />
  );
}
