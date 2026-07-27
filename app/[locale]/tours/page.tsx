import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ToursFilterGrid from "@/components/ToursFilterGrid";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { getTours } from "@/lib/tours-data";

export const revalidate = 60;

export default async function ToursPage() {
  const t = await getTranslations("tours");
  const tours = await getTours();

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
          <ToursFilterGrid tours={tours} />
        </Suspense>
      </div>
    </section>
    </>
  );
}
