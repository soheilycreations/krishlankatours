import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Quote, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import RoutePath from "@/components/RoutePath";
import HeroSearchBar from "@/components/HeroSearchBar";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import TrustBadges from "@/components/TrustBadges";
import FaqAccordion from "@/components/FaqAccordion";
import CategoryIcons from "@/components/CategoryIcons";
import HorizontalScroller from "@/components/HorizontalScroller";
import DestinationCard from "@/components/DestinationCard";
import CornerMotif from "@/components/motifs/CornerMotif";
import { getDestinations } from "@/lib/destinations-data";
import { getTours } from "@/lib/tours-data";

export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations("home");
  const td = await getTranslations("destinations");
  const tours = await getTours();
  const destinations = await getDestinations();
  const routeStops = t.raw("routeStops") as { label: string; note: string }[];
  const testimonials = t.raw("testimonials") as {
    quote: string;
    name: string;
    origin: string;
  }[];
  const trustItems = t.raw("trust") as { title: string; body: string }[];
  const faqItems = t.raw("faq") as { q: string; a: string }[];

  const galleryPreview = [
    "/images/monk-meditation-cliff.jpg",
    "/images/kandyan-dance.jpg",
    "/images/elephants-trio.jpg",
    "/images/polonnaruwa-ruins.jpg",
    "/images/real/river-safari-mangrove-silhouette.jpg",
    "/images/villa-pool-sunset.jpg",
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[78vh] min-h-[560px] sm:min-h-[620px] flex items-center">
          <HeroBackgroundImage
            images={[
              "/images/golden-temple-hills.jpg",
              "/images/stock2/sigiriya-sunset.jpg",
              "/images/stock2/galle-fort-rampart.jpg",
              "/images/stock2/nuwaraeliya-lake-aerial.jpg",
              "/images/elephants-trio.jpg",
            ]}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/50 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 w-full">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-stamp text-xs sm:text-sm uppercase tracking-[0.2em] text-clay mb-6">
                <span className="w-8 h-px bg-clay/60" />
                {t("heroEyebrow")}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.05] max-w-2xl text-balance">
                {t("heroTitle")}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-base sm:text-lg text-white/80 max-w-xl mt-6 leading-relaxed">
                {t("heroSubtitle")}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 mt-9">
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 bg-clay text-navy px-6 py-3.5 rounded-full font-body font-semibold shadow-lg shadow-navy/30 hover:bg-clay/90 transition-all"
                >
                  {t("heroCtaPrimary")} <ArrowRight size={17} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3.5 rounded-full font-body font-medium hover:border-white hover:bg-white/10 transition-colors"
                >
                  {t("heroCtaSecondary")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* floating glass search card, overlapping the photo edge */}
        <div className="relative z-20 mx-auto max-w-5xl px-5 sm:px-8 -mt-10 sm:-mt-12">
          <Reveal delay={0.4}>
            <HeroSearchBar />
          </Reveal>
        </div>
      </section>

      {/* spacer for the floating search card's overlap */}
      <div className="h-6 sm:h-8 bg-paper-textured" />

      {/* CATEGORIES */}
      <section className="bg-paper-textured py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-12">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("categoriesEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy text-balance">
              {t("categoriesTitle")}
            </h2>
          </Reveal>
          <CategoryIcons />
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-paper-2-textured py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TrustBadges items={trustItems} />
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-paper-textured py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("introEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy leading-tight mb-6 text-balance">
              {t("introTitle")}
            </h2>
            <p className="font-body text-ink-text/70 leading-relaxed">
              {t("introBody")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden postcard-edge">
              <Image
                src="/images/stock3/tuktuk-forest-road.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROUTE PATH */}
      <section className="bg-paper-2-textured py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("routeEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy text-balance">
              {t("routeTitle")}
            </h2>
          </Reveal>
          <RoutePath stops={routeStops} />
        </div>
      </section>

      {/* TOURS SCROLLER */}
      <section className="bg-paper-textured py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
                {t("toursEyebrow")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-navy mb-3">
                {t("toursTitle")}
              </h2>
              <p className="font-body text-ink-text/60 max-w-lg">{t("toursSubtitle")}</p>
            </div>
            <Link
              href="/tours"
              className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-blue hover:text-blue-light shrink-0"
            >
              {t("viewAllTours")} <ArrowRight size={15} />
            </Link>
          </Reveal>

          <HorizontalScroller>
            {tours.map((tour) => (
              <div
                key={tour.slug}
                data-card
                className="snap-start shrink-0 w-[280px] sm:w-[320px]"
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </HorizontalScroller>

          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 font-body text-sm text-blue"
            >
              {t("viewAllTours")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="bg-paper-2-textured py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
                {td("homeEyebrow")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-navy mb-3">
                {td("homeTitle")}
              </h2>
              <p className="font-body text-ink-text/60 max-w-lg">
                {td("homeSubtitle")}
              </p>
            </div>
            <Link
              href="/destinations"
              className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-blue hover:text-blue-light shrink-0"
            >
              {td("viewAll")} <ArrowRight size={15} />
            </Link>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <Reveal key={dest.slug} delay={i * 0.06}>
                <DestinationCard destination={dest} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="bg-paper-2-textured py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-12">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("galleryEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy">
              {t("galleryTitle")}
            </h2>
          </Reveal>
          <div className="grid grid-cols-3 auto-rows-[7.5rem] sm:auto-rows-[11rem] gap-3 sm:gap-4">
            {galleryPreview.map((src, i) => (
              <Reveal
                key={src}
                delay={i * 0.06}
                className={`relative overflow-hidden rounded-xl ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 300px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-body text-sm text-blue hover:text-navy border-b border-blue/40 pb-0.5"
            >
              {t("galleryCta")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-paper-textured py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-14">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("testimonialsEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy">
              {t("testimonialsTitle")}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <Reveal
                key={item.name}
                delay={i * 0.1}
                className="bg-white border border-navy/8 shadow-sm rounded-2xl p-7 flex flex-col"
              >
                <Quote className="text-blue/40 mb-3" size={26} />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={13} className="fill-clay text-clay" />
                  ))}
                </div>
                <p className="font-body text-ink-text/75 text-sm leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="dotted-rule pt-5 mt-5">
                  <p className="font-stamp text-xs text-ink-text/50 uppercase tracking-wide pt-4">
                    {item.name} — {item.origin}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper-2-textured py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="text-center mb-12">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("faqEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy">
              {t("faqTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqAccordion items={faqItems} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy py-20 sm:py-24">
        <CornerMotif className="hidden sm:block absolute -bottom-16 -left-16 w-80 h-80 text-blue-light/20 pointer-events-none rotate-180" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4 text-balance">
              {t("ctaTitle")}
            </h2>
            <p className="font-body text-white/65 mb-8 max-w-lg mx-auto">{t("ctaBody")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue text-white px-7 py-3.5 rounded-full font-body font-medium hover:bg-blue-light transition-colors"
            >
              {t("ctaButton")} <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
