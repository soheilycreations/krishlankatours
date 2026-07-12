import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import RoutePath from "@/components/RoutePath";
import { tours } from "@/lib/tours";

export default async function HomePage() {
  const t = await getTranslations("home");
  const routeStops = t.raw("routeStops") as { label: string; note: string }[];
  const testimonials = t.raw("testimonials") as {
    quote: string;
    name: string;
    origin: string;
  }[];

  const galleryPreview = [
    "/images/monk-meditation-cliff.jpg",
    "/images/kandyan-dance.jpg",
    "/images/elephants-trio.jpg",
    "/images/polonnaruwa-ruins.jpg",
    "/images/river-boat-safari.jpg",
    "/images/villa-pool-sunset.jpg",
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <Image
          src="/images/golden-temple-hills.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-ink/10" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pb-20 sm:pb-28 w-full">
          <Reveal>
            <p className="font-stamp text-xs sm:text-sm uppercase tracking-[0.2em] text-gold mb-5">
              {t("heroEyebrow")}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-paper leading-[1.05] max-w-3xl text-balance">
              {t("heroTitle")}
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="font-body text-base sm:text-lg text-paper/75 max-w-xl mt-6 leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 bg-gold text-ink px-6 py-3.5 rounded-full font-body font-medium hover:bg-gold-light transition-colors"
              >
                {t("heroCtaPrimary")} <ArrowRight size={17} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-paper/40 text-paper px-6 py-3.5 rounded-full font-body font-medium hover:border-gold hover:text-gold transition-colors"
              >
                {t("heroCtaSecondary")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-clay mb-4">
              {t("introEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink-text leading-tight mb-6 text-balance">
              {t("introTitle")}
            </h2>
            <p className="font-body text-ink-text/70 leading-relaxed">
              {t("introBody")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden postcard-edge">
              <Image
                src="/images/monk-meditation-cliff.jpg"
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
      <section className="bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-gold mb-4">
              {t("routeEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-paper text-balance">
              {t("routeTitle")}
            </h2>
          </Reveal>
          <RoutePath stops={routeStops} />
        </div>
      </section>

      {/* TOURS GRID */}
      <section className="bg-ink pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="font-stamp text-xs uppercase tracking-[0.2em] text-gold mb-4">
                {t("toursEyebrow")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-paper mb-3">
                {t("toursTitle")}
              </h2>
              <p className="font-body text-paper/60 max-w-lg">{t("toursSubtitle")}</p>
            </div>
            <Link
              href="/tours"
              className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-gold hover:text-gold-light shrink-0"
            >
              {t("viewAllTours")} <ArrowRight size={15} />
            </Link>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, i) => (
              <Reveal key={tour.slug} delay={i * 0.08}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 font-body text-sm text-gold"
            >
              {t("viewAllTours")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-12">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-clay mb-4">
              {t("galleryEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink-text">
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
              className="inline-flex items-center gap-2 font-body text-sm text-clay hover:text-ink-text border-b border-clay/40 pb-0.5"
            >
              {t("galleryCta")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-14">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-gold mb-4">
              {t("testimonialsEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-paper">
              {t("testimonialsTitle")}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <Reveal
                key={item.name}
                delay={i * 0.1}
                className="bg-ink-2 border border-gold/15 rounded-2xl p-7 flex flex-col"
              >
                <Quote className="text-gold/50 mb-4" size={26} />
                <p className="font-body text-paper/75 text-sm leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="dotted-rule pt-5 mt-5">
                  <p className="font-stamp text-xs text-paper/50 uppercase tracking-wide pt-4">
                    {item.name} — {item.origin}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl text-ink mb-4 text-balance">
              {t("ctaTitle")}
            </h2>
            <p className="font-body text-ink/70 mb-8 max-w-lg mx-auto">{t("ctaBody")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-ink text-paper px-7 py-3.5 rounded-full font-body font-medium hover:bg-ink-2 transition-colors"
            >
              {t("ctaButton")} <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
