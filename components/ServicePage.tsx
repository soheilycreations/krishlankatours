import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export interface ServicePageProps {
  heroImage: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  script: string;
  intro: string;
  points: string[];
  image2: string;
  ctaTitle: string;
  ctaBody: string;
  whatsappText: string;
  contactText: string;
}

/** Shared layout for simple service/offering pages (Airport Transfer, Surfing, Taxi, etc). */
export default function ServicePage({
  heroImage, eyebrow, title, subtitle, script, intro, points, image2, ctaTitle, ctaBody, whatsappText, contactText,
}: ServicePageProps) {
  return (
    <>
      <PageHero image={heroImage} eyebrow={eyebrow} title={title} subtitle={subtitle} script={script} />

      <section className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="font-body text-ink-text/70 leading-relaxed mb-6">{intro}</p>
            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue/10 text-blue flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </span>
                  <span className="font-body text-sm text-ink-text/75">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden ring-8 ring-paper postcard-shadow rotate-2">
              <Image src={image2} alt="" fill sizes="500px" className="object-cover painterly" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy torn-top relative overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,80,43,0.35), transparent 65%)" }} aria-hidden="true" />
        <div className="canvas-texture absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <Reveal>
            <MessageCircle size={28} className="text-golden mx-auto mb-4" />
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-3">{ctaTitle}</h2>
            <p className="font-body text-white/65 mb-7">{ctaBody}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/94779168959"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-body text-sm font-semibold shadow-lg hover:brightness-110 transition-all"
              >
                {whatsappText}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-body text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {contactText} <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
