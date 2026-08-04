import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServicePage from "@/components/ServicePage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Private Taxi Service Sri Lanka — Point-to-Point Transfers",
    description:
      "Private taxi service across Sri Lanka — comfortable, air-conditioned point-to-point transfers between cities, beaches and hill country with English-speaking drivers.",
  };
}

export default async function TaxiServicePage() {
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
