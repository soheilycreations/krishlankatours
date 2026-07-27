import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Users, Calendar, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import TourImagePlaceholder from "@/components/TourImagePlaceholder";
import { tours as staticTours, categoryLabels } from "@/lib/tours";
import { getTours, getTourBySlugFromDb } from "@/lib/tours-data";
import type { Locale } from "@/i18n/routing";

export const revalidate = 60;

export function generateStaticParams() {
  return staticTours.map((t) => ({ slug: t.slug }));
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = await getTourBySlugFromDb(slug);
  if (!tour) notFound();

  const loc = locale as Locale;
  const t = await getTranslations("tourDetail");
  const tListing = await getTranslations("tours");
  const allTours = await getTours();
  const others = allTours.filter((tr) => tr.slug !== tour.slug).slice(0, 3);

  return (
    <>
      <section
        className={`relative flex items-end overflow-hidden ${
          tour.heroImage ? "h-[60vh] min-h-[420px]" : "h-[34vh] min-h-[260px]"
        }`}
      >
        {tour.heroImage ? (
          <Image
            src={tour.heroImage}
            alt={tour.title[loc]}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <TourImagePlaceholder
            category={tour.category}
            label={tListing("photoComingSoon")}
            className="absolute inset-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="relative z-10 mx-auto max-w-5xl w-full px-5 sm:px-8 pb-12">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 font-body text-sm text-white/70 hover:text-blue-light mb-6"
          >
            <ArrowLeft size={15} /> {t("back")}
          </Link>
          <span className="font-stamp text-[10px] uppercase tracking-widest bg-blue text-white px-2.5 py-1 rounded-full">
            {categoryLabels[tour.category][loc]}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-white mt-4 max-w-2xl text-balance">
            {tour.title[loc]}
          </h1>
          <p className="font-body text-white/70 mt-3 max-w-xl">{tour.tagline[loc]}</p>
        </div>
      </section>

      <section className="bg-paper-textured py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Reveal>
              <p className="font-body text-ink-text/75 leading-relaxed text-lg mb-10">
                {tour.summary[loc]}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-display text-2xl text-navy mb-5">
                {t("highlightsTitle")}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4 mb-12">
                {tour.highlights.map((h) => (
                  <li key={h[loc]} className="flex gap-3 items-start">
                    <Check size={17} className="text-blue mt-0.5 shrink-0" />
                    <span className="font-body text-sm text-ink-text/75">{h[loc]}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-2xl text-navy mb-6">
                {t("itineraryTitle")}
              </h2>
              <div className="flex flex-col">
                {tour.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="flex gap-5 pb-8 mb-8 border-b border-navy/8 last:border-0 last:mb-0 last:pb-0"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-full border-2 border-dashed border-blue/50 flex flex-col items-center justify-center font-stamp">
                      <span className="text-[9px] uppercase text-blue/70 leading-none">
                        {t("day")}
                      </span>
                      <span className="text-base font-bold text-blue leading-none mt-1">
                        {day.day}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-navy mb-1.5">
                        {day.title[loc]}
                      </h3>
                      <p className="font-body text-sm text-ink-text/65 leading-relaxed">
                        {day.description[loc]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {tour.gallery.length > 1 && (
              <Reveal delay={0.1} className="grid grid-cols-3 gap-3 mt-4">
                {tour.gallery.map((src) => (
                  <div key={src} className="relative h-32 sm:h-44 rounded-xl overflow-hidden">
                    <Image src={src} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={0.1} className="sticky top-28 bg-white rounded-2xl p-7 border border-navy/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-navy/8 font-body text-sm text-ink-text/70">
                <Calendar size={16} className="text-blue shrink-0" />
                {tour.durationDays} {tour.durationDays === 1 ? tListing("day") : tListing("days")}
              </div>
              <div className="flex items-center gap-3 mb-6 font-body text-sm text-ink-text/70">
                <Users size={16} className="text-blue shrink-0" />
                {tour.groupSize}
              </div>
              <p className="font-body text-xs text-ink-text/45 leading-relaxed mb-6">
                {t("priceNote")}
              </p>
              <Link
                href={`/contact?tour=${tour.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue text-white px-5 py-3.5 rounded-full font-body font-medium hover:bg-blue-light transition-colors"
              >
                {t("enquire")} <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-paper-2-textured py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-navy mb-8">
            {t("otherTours")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((tr) => (
              <TourCard key={tr.slug} tour={tr} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
