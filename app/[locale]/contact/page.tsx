import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { MessageCircle, Mail, Phone, MapPin, Plane } from "lucide-react";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getTours } from "@/lib/tours-data";

export const revalidate = 60;

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const pickupAreas = t.raw("pickupAreas") as string[];
  const tours = await getTours();

  return (
    <section className="bg-paper-2-textured min-h-screen pt-16 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
            {t("pageEyebrow")}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-navy mb-5 text-balance">
            {t("pageTitle")}
          </h1>
          <p className="font-body text-ink-text/60 leading-relaxed">{t("pageSubtitle")}</p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8">
          <Reveal delay={0.05} className="lg:col-span-2">
            <Suspense fallback={null}>
              <ContactForm tours={tours} />
            </Suspense>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="bg-white border border-navy/8 shadow-sm rounded-2xl p-6">
              <MessageCircle className="text-blue mb-3" size={24} />
              <h3 className="font-display text-lg text-navy mb-1.5">
                {t("whatsappTitle")}
              </h3>
              <p className="font-body text-sm text-ink-text/60 mb-4">{t("whatsappBody")}</p>
              <a
                href={
                  whatsappNumber
                    ? `https://wa.me/${whatsappNumber}`
                    : "https://wa.me/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-sm bg-blue text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-light transition-colors"
              >
                {t("whatsappCta")}
              </a>
            </div>

            <div className="bg-white border border-navy/8 shadow-sm rounded-2xl p-6">
              <h3 className="font-stamp text-xs uppercase tracking-widest text-blue mb-4">
                {t("directTitle")}
              </h3>
              <ul className="flex flex-col gap-4 font-body text-sm text-ink-text/75">
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-blue shrink-0" />
                  hello@krishlankatours.com
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-blue shrink-0" />
                  +94 XX XXX XXXX
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-blue shrink-0" />
                  {t("locationValue")}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* FIND US */}
        <Reveal delay={0.15} className="mt-16">
          <div className="bg-white border border-navy/8 shadow-sm rounded-2xl overflow-hidden grid lg:grid-cols-2">
            <div className="p-7 sm:p-9">
              <h2 className="font-display text-2xl sm:text-3xl text-navy mb-4 text-balance">
                {t("findUsTitle")}
              </h2>
              <p className="font-body text-ink-text/70 leading-relaxed mb-7">
                {t("findUsBody")}
              </p>

              <h3 className="font-stamp text-xs uppercase tracking-widest text-blue mb-4">
                {t("pickupTitle")}
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {pickupAreas.map((area) => (
                  <span
                    key={area}
                    className="font-body text-sm bg-paper-2 text-navy px-3.5 py-1.5 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="font-body text-xs text-ink-text/50 leading-relaxed flex items-start gap-2">
                <Plane size={14} className="text-blue mt-0.5 shrink-0" />
                {t("pickupAirportNote")}
              </p>
            </div>

            <div className="relative min-h-[320px] lg:min-h-full">
              <iframe
                title="Krish Lanka Tours & Travels — Ahungalla"
                src="https://www.google.com/maps?q=Ahungalla,+Sri+Lanka&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
