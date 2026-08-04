import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServicePage from "@/components/ServicePage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Airport Transfer Sri Lanka — Colombo (CMB) to Ahungalla, Bentota & Beyond",
    description:
      "Reliable private airport transfer Sri Lanka — Bandaranaike Airport (CMB) pickup and drop-off to Ahungalla, Bentota, Galle and hotels across the south coast. Fixed prices, English-speaking drivers.",
  };
}

export default async function AirportTransferPage() {
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
