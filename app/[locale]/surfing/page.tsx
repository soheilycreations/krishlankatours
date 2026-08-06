import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServicePage from "@/components/ServicePage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Surfing Tours — Hikkaduwa & Weligama, Sri Lanka",
    description:
      "Private surf trips to Hikkaduwa and Weligama, Sri Lanka's best beginner and intermediate surf spots. Board hire, spot recommendations, and driver-guided transport from your hotel.",
  };
}

export default async function SurfingPage() {
  const t = await getTranslations("surfing");
  return (
    <ServicePage
      heroImage="/images/learn-to-surf.jpg"
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      script="Catch the perfect wave..."
      intro={t("intro")}
      points={t.raw("points") as string[]}
      image2="/images/stock2/rocky-coast-cloudy.jpg"
      ctaTitle={t("ctaTitle")}
      ctaBody={t("ctaBody")}
      whatsappText={t("whatsapp")}
      contactText={t("contactCta")}
    />
  );
}
