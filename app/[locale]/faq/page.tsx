import { getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";

export const revalidate = 3600;

export default async function FaqPage() {
  const t = await getTranslations("faqPage");
  const th = await getTranslations("home");
  const faqItems = th.raw("faq") as { q: string; a: string }[];
  const moreItems = t.raw("more") as { q: string; a: string }[];

  return (
    <>
      <PageHero
        image="/images/stock2/kandy-colonial-street.jpg"
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        script="Everything you're wondering..."
      />
      <section className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <FaqAccordion items={[...faqItems, ...moreItems]} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 bg-white border border-navy/8 shadow-sm rounded-2xl p-7 text-center">
              <MessageCircle size={26} className="text-blue mx-auto mb-3" />
              <p className="font-display text-lg text-navy mb-2">{t("stillQuestions")}</p>
              <p className="font-body text-sm text-ink-text/60 mb-5">{t("stillQuestionsBody")}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-body text-sm font-semibold shadow-lg shadow-blue/25 hover:bg-blue-light transition-colors"
              >
                {t("contactCta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
