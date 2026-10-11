import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CustomTripPlanner from "@/components/CustomTripPlanner";
import { getDestinations } from "@/lib/destinations-data";
import { getVehicles } from "@/lib/vehicles-data";
import type { Locale } from "@/i18n/routing";

// Re-generated at most once a day; admin edits refresh it immediately.
export const revalidate = 86400; // 24 hours (keeps KV writes within the free plan)

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale as Locale, "/plan");
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("plan");
  const [destinations, vehicles] = await Promise.all([getDestinations(), getVehicles()]);

  return (
    <>
      <PageHero
        image="/images/stock3/tuktuk-forest-road.jpg"
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        script="Your island, your way..."
      />
      <section className="bg-paper-2-textured pt-12 pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <CustomTripPlanner
            destinations={destinations.map((d) => ({
              slug: d.slug,
              name: d.name[loc] ?? d.name.en,
              region: d.region[loc] ?? d.region.en,
              image: d.image,
            }))}
            vehicles={vehicles}
          />
        </div>
      </section>
    </>
  );
}
