import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { destinations } from "@/lib/destinations";
import { getTourBySlug } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations("destinations");

  return (
    <>
      <section className="bg-white pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <Reveal>
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
              {t("pageEyebrow")}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-navy mb-5 text-balance">
              {t("pageTitle")}
            </h1>
            <p className="font-body text-ink-text/60 leading-relaxed max-w-xl mx-auto">
              {t("pageSubtitle")}
            </p>
          </Reveal>
        </div>
      </section>

      {destinations.map((dest, i) => {
        const relatedTour = getTourBySlug(dest.relatedTourSlug);
        const imageLeft = i % 2 === 0;

        return (
          <section
            key={dest.slug}
            id={dest.slug}
            className={`scroll-mt-20 ${i % 2 === 0 ? "bg-paper-2/50" : "bg-white"}`}
          >
            <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <Reveal
                  className={`relative h-72 sm:h-[26rem] rounded-2xl overflow-hidden postcard-edge ${
                    imageLeft ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name[loc]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                  <span className="absolute top-5 left-5 font-stamp text-[10px] uppercase tracking-widest bg-blue text-white px-3 py-1.5 rounded-full">
                    {dest.region[loc]}
                  </span>
                </Reveal>

                <Reveal
                  delay={0.1}
                  className={imageLeft ? "lg:order-2" : "lg:order-1"}
                >
                  <h2 className="font-display text-3xl sm:text-4xl text-navy mb-2 text-balance">
                    {dest.name[loc]}
                  </h2>
                  <p className="font-body text-blue text-base mb-5">{dest.tagline[loc]}</p>

                  {dest.description.map((para, pi) => (
                    <p
                      key={pi}
                      className="font-body text-ink-text/70 leading-relaxed mb-4 last:mb-6"
                    >
                      {para[loc]}
                    </p>
                  ))}

                  <div className="flex items-start gap-2.5 mb-3">
                    <Sparkles size={16} className="text-blue mt-0.5 shrink-0" />
                    <span className="font-stamp text-xs uppercase tracking-wide text-ink-text/45 mt-0.5">
                      {t("highlightsTitle")}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1.5 mb-6 pl-[26px]">
                    {dest.highlights.map((h) => (
                      <li key={h[loc]} className="font-body text-sm text-ink-text/70 list-disc">
                        {h[loc]}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-start gap-2.5 mb-6 bg-white/60 rounded-xl p-4 border border-navy/8">
                    <Calendar size={16} className="text-blue mt-0.5 shrink-0" />
                    <div>
                      <span className="font-stamp text-xs uppercase tracking-wide text-ink-text/45 block mb-1">
                        {t("bestTimeTitle")}
                      </span>
                      <span className="font-body text-sm text-ink-text/70">{dest.bestTime[loc]}</span>
                    </div>
                  </div>

                  {relatedTour && (
                    <Link
                      href={`/tours/${relatedTour.slug}`}
                      className="inline-flex items-center gap-2 font-body text-sm font-medium text-blue hover:text-navy transition-colors border-b border-blue/40 pb-0.5"
                    >
                      <MapPin size={15} />
                      {t("relatedTourCta")} <ArrowRight size={14} />
                    </Link>
                  )}
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-4 text-balance">
              {t("ctaTitle")}
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3.5 rounded-full font-body font-medium hover:bg-blue-light transition-colors"
            >
              {t("ctaButton")} <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
