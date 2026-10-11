import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import ServicePage from "@/components/ServicePage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale as Locale, "/airport-transfer");
}

export default async function AirportTransferPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("airportTransfer");
  return (
    <ServicePage
      heroImage="/images/stock2/colombo-galle-face.jpg"
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      script="Straight from the plane to paradise..."
      intro={t("intro")}
      points={t.raw("points") as string[]}
      image2="/images/stock3/aerial-coastal-boats.jpg"
      ctaTitle={t("ctaTitle")}
      ctaBody={t("ctaBody")}
      whatsappText={t("whatsapp")}
      contactText={t("contactCta")}
    />
  );
}
