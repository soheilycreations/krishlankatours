import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import ServicePage from "@/components/ServicePage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale as Locale, "/surfing");
}

export default async function SurfingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
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
      image2="/images/learn-to-surf.jpg"
      ctaTitle={t("ctaTitle")}
      ctaBody={t("ctaBody")}
      whatsappText={t("whatsapp")}
      contactText={t("contactCta")}
    />
  );
}
