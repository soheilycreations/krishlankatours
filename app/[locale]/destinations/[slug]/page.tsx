import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, MapPin, Calendar } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";
import { getDestinations } from "@/lib/destinations-data";
import { getTours } from "@/lib/tours-data";
import type { Locale } from "@/i18n/routing";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const destinations = await getDestinations();
  const dest = destinations.find((d) => d.slug === slug);
  if (!dest) return {};
  return {
    title: dest.name[loc],
    description: dest.tagline[loc],
    openGraph: dest.image
      ? { title: dest.name[loc], description: dest.tagline[loc], images: [{ url: dest.image, width: 1200, height: 630 }] }
      : undefined,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const t = await getTranslations("destinations");
  const destinations = await getDestinations();
  const dest = destinations.find((d) => d.slug === slug);
  if (!dest) notFound();

  const tours = await getTours();
  const relatedTour = tours.find((tr) => tr.slug === dest.relatedTourSlug);

  return (
    <>
      <PageHero
        image={dest.image || "/images/stock2/hillcountry-misty-dusk.jpg"}
        eyebrow={dest.region[loc]}
        title={dest.name[loc]}
        subtitle={dest.tagline[loc]}
      />

      <section className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link href="/destinations" className="inline-flex items-center gap-2 font-body text-sm text-ink-text/50 hover:text-blue mb-8">
            <ArrowLeft size={15} /> {t("backToDestinations")}
          </Link>

          <Reveal>
            {dest.description.map((para, i) => (
              <p key={i} className="font-body text-ink-text/75 leading-relaxed mb-4 last:mb-0">
                {para[loc]}
              </p>
            ))}
          </Reveal>

          {dest.highlights.length > 0 && (
            <Reveal delay={0.1} className="mt-8">
              <p className="font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-3">
                {t("highlightsTitle")}
              </p>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {dest.highlights.map((h) => (
                  <li key={h[loc]} className="font-body text-sm text-ink-text/70 list-disc list-inside">
                    {h[loc]}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={0.15} className="flex items-start gap-2.5 mt-8 bg-white rounded-xl p-4 border border-navy/8 max-w-sm">
            <Calendar size={16} className="text-blue mt-0.5 shrink-0" />
            <div>
              <span className="font-stamp text-xs uppercase tracking-wide text-ink-text/45 block mb-1">
                {t("bestTimeTitle")}
              </span>
              <span className="font-body text-sm text-ink-text/70">{dest.bestTime[loc]}</span>
            </div>
          </Reveal>

          {relatedTour && (
            <Reveal delay={0.2} className="mt-6">
              <Link
                href={`/tours/${relatedTour.slug}`}
                className="inline-flex items-center gap-2 font-body text-sm font-medium text-blue hover:text-navy transition-colors border-b border-blue/40 pb-0.5"
              >
                <MapPin size={15} />
                {t("relatedTourCta")} <ArrowRight size={14} />
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {dest.gallery && dest.gallery.length > 0 && (
        <section className="bg-navy torn-top relative overflow-hidden py-14 sm:py-20">
          <div
            className="absolute inset-0 opacity-50"
            style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,80,43,0.35), transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="canvas-texture absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="text-center mb-9">
              <p className="font-stamp text-xs uppercase tracking-[0.2em] text-golden mb-4">
                {t("galleryEyebrow")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-white">{t("galleryTitle")}</h2>
            </Reveal>
            <GalleryGrid
              images={dest.gallery.map((src, i) => ({
                src,
                caption: { en: "", de: "" },
                tall: i % 4 === 0,
              }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
