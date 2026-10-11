import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import { getCategories } from "@/lib/content-data";
import type { Locale } from "@/i18n/routing";
import ToursFilterGrid from "@/components/ToursFilterGrid";
import PageHero from "@/components/PageHero";
import { getTours } from "@/lib/tours-data";

// Re-generated at most hourly; admin edits refresh it immediately.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale as Locale, "/tours");
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tours");
  const [tours, categories] = await Promise.all([getTours(), getCategories()]);

  return (
    <>
      <PageHero
        image="/images/stock3/sigiriya-landscape-view.jpg"
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        script="Pick your adventure..."
      />
    <section className="bg-paper-textured pt-12 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">

        <Suspense fallback={null}>
          <ToursFilterGrid tours={tours} categories={categories} />
        </Suspense>
      </div>
    </section>
    </>
  );
}
