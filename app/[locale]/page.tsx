import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Quote, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import RoutePath from "@/components/RoutePath";
import HeroSearchBar from "@/components/HeroSearchBar";
import HeroShowcase from "@/components/HeroShowcase";
import TrustBadges from "@/components/TrustBadges";
import FaqAccordion from "@/components/FaqAccordion";
import CategoryIcons from "@/components/CategoryIcons";
import HorizontalScroller from "@/components/HorizontalScroller";
import DestinationCard from "@/components/DestinationCard";
import CornerMotif from "@/components/motifs/CornerMotif";
import PostcardsFromParadise from "@/components/PostcardsFromParadise";
import ParallaxSection from "@/components/ParallaxSection";
import { getDestinations } from "@/lib/destinations-data";
import { getCategories, getReviews, getGalleryImages } from "@/lib/content-data";
import { getTours } from "@/lib/tours-data";

export const revalidate = 60;

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const td = await getTranslations("destinations");
  const tours = await getTours();
  const destinations = await getDestinations();
  const categories = await getCategories();
  const dbReviews = await getReviews();
  const galleryImgs = await getGalleryImages();
  const routeStops = t.raw("routeStops") as { label: string; note: string }[];
  const sriLankaStats = t.raw("sriLankaStats") as { value: string; label: string }[];
  const fallbackTestimonials = t.raw("testimonials") as {
    quote: string;
    name: string;
    origin: string;
  }[];
  const testimonials =
    dbReviews.length > 0
      ? dbReviews.slice(0, 6).map((r) => ({
          quote: r.text[locale as "en" | "de"] ?? r.text.en,
          name: r.author,
          origin: r.country,
        }))
      : fallbackTestimonials;
  const trustItems = t.raw("trust") as { title: string; body: string }[];
  const faqItems = t.raw("faq") as { q: string; a: string }[];

  const galleryPreview = galleryImgs.slice(0, 5).map((g) => g.src);

  return (
    <>
      {/* HERO — modern card composition on warm canvas */}
      <section className="relative overflow-hidden bg-paper">
        {/* organic color blobs */}
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-clay/20 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full bg-sea/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 right-1/4 w-[380px] h-[380px] rounded-full bg-blue/10 blur-3xl" aria-hidden="true" />
        <div className="canvas-texture absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-10 sm:pt-14 pb-14 sm:pb-16">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            {/* LEFT: copy */}
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-3">
                  <span className="w-8 h-px bg-blue/50" />
                  {t("heroEyebrow")}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="font-script text-2xl sm:text-3xl text-clay -rotate-2 origin-left mb-2">
                  Ayubowan!
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.06] text-balance">
                  {t("heroTitle")}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-body text-base sm:text-lg text-ink-text/65 max-w-xl mt-5 leading-relaxed">
                  {t("heroSubtitle")}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mt-7">
                  <Link
                    href="/tours"
                    className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3.5 rounded-full font-body font-semibold shadow-lg shadow-blue/30 hover:bg-blue-light transition-all"
                  >
                    {t("heroCtaPrimary")} <ArrowRight size={17} />
                  </Link>
                  <Link
                    href="/plan"
                    className="inline-flex items-center gap-2 border border-navy/25 text-navy px-6 py-3.5 rounded-full font-body font-medium hover:border-navy hover:bg-navy/5 transition-colors"
                  >
                    {t("heroCtaSecondary")}
                  </Link>
                </div>
              </Reveal>

              {/* stats as clean mini cards */}
              <Reveal delay={0.4}>
                <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sriLankaStats.map((s) => (
                    <div
                      key={s.label}
                      className="bg-white/85 backdrop-blur-sm border border-navy/8 rounded-2xl px-3.5 py-3 shadow-sm"
                    >
                      <p className="font-display text-lg sm:text-xl text-navy leading-none">
                        {s.value}
                      </p>
                      <p className="font-body text-[10px] sm:text-[11px] text-ink-text/55 mt-1.5 leading-snug">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* RIGHT: layered postcard showcase */}
            <Reveal delay={0.15} className="pb-8 lg:pb-0">
              <HeroShowcase
                images={[
                  "/images/golden-temple-hills.jpg",
                  "/images/stock2/sigiriya-sunset.jpg",
                  "/images/stock2/galle-fort-rampart.jpg",
                  "/images/stock2/nuwaraeliya-lake-aerial.jpg",
                  "/images/elephants-trio.jpg",
                ]}
                ratingLabel={t("heroRatingLabel")}
                pinLabel="Ahungalla, Sri Lanka"
              />
            </Reveal>
          </div>

          {/* search card, cleanly in flow */}
          <div className="mt-12 sm:mt-14 max-w-5xl mx-auto">
            <Reveal delay={0.45}>
              <HeroSearchBar />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <ParallaxSection image="/images/palm-avenue-garden.jpg" variant="light" glow="bottom" className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-9">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("categoriesEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy text-balance">
              {t("categoriesTitle")}
            </h2>
          </Reveal>
          <CategoryIcons categories={categories} />
        </div>
      </ParallaxSection>

      {/* TRUST BADGES */}
      <ParallaxSection image="/images/stock2/mountain-road-teacountry.jpg" variant="dark" torn className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TrustBadges items={trustItems} />
        </div>
      </ParallaxSection>

      {/* INTRO */}
      <section className="bg-paper-textured py-14 sm:py-20">
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
                className="object-cover painterly"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROUTE PATH */}
      <ParallaxSection image="/images/stock3/rice-paddy-aerial.jpg" variant="light" glow="top" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-10">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("routeEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy text-balance">
              {t("routeTitle")}
            </h2>
          </Reveal>
          <RoutePath stops={routeStops} />
        </div>
      </ParallaxSection>

      {/* TOURS SCROLLER */}
      <section className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">
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

      {/* POSTCARDS FROM PARADISE — signature section */}
      <PostcardsFromParadise
        eyebrow={t("postcardsEyebrow")}
        title={t("postcardsTitle")}
        subtitle={t("postcardsSubtitle")}
      />

      {/* POPULAR DESTINATIONS */}
      <ParallaxSection image="/images/stock3/anuradhapura-stupa-dusk.jpg" variant="light" glow="bottom" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">
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
      </ParallaxSection>

      {/* GALLERY TEASER */}
      <ParallaxSection image="/images/monk-meditation-cliff.jpg" variant="dark" torn glow="bottom" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-9">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-golden mb-4">
              {t("galleryEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-white">
              {t("galleryTitle")}
            </h2>
          </Reveal>
          <div className="grid grid-cols-3 auto-rows-[7.5rem] sm:auto-rows-[11rem] gap-3 sm:gap-4">
            {galleryPreview.map((src, i) => (
              <Reveal
                key={src}
                delay={i * 0.06}
                className={`relative overflow-hidden rounded-lg ring-4 ring-paper/90 postcard-shadow ${
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
              className="inline-flex items-center gap-2 font-body text-sm text-blue-light hover:text-golden border-b border-blue-light/40 pb-0.5"
            >
              {t("galleryCta")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </ParallaxSection>

      {/* TESTIMONIALS */}
      <ParallaxSection image="/images/couple-pool-sunset.jpg" variant="dark" torn className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-10">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-golden mb-4">
              {t("testimonialsEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-white">
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
          <Reveal className="text-center mt-8">
            <a
              href="https://maps.app.goo.gl/x7srx8h3AX121UUj9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-full font-body text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              <Star size={15} className="fill-clay text-clay" /> {t("reviewUsGoogle")}
            </a>
          </Reveal>
        </div>
      </ParallaxSection>

      {/* FAQ */}
      <section className="bg-paper-2-textured py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="text-center mb-9">
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
      <ParallaxSection image="/images/stock2/sigiriya-sunset.jpg" variant="dark" torn glow="bottom" className="py-16 sm:py-20">
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
      </ParallaxSection>
    </>
  );
}
