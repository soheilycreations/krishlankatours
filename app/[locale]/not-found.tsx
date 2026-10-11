import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** 404 inside the localized site (unknown tour, destination, blog post, ...). */
export default function NotFound() {
  const t = useTranslations("nav");
  return (
    <section className="bg-paper-textured min-h-[60vh] flex items-center justify-center px-5 py-24">
      <div className="text-center max-w-md">
        <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">404</p>
        <h1 className="font-display text-3xl text-navy mb-8">Page not found · Seite nicht gefunden</h1>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-body font-medium hover:bg-blue-light transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 border border-navy/25 text-navy px-6 py-3 rounded-full font-body font-medium hover:border-navy transition-colors"
          >
            {t("tours")}
          </Link>
        </div>
      </div>
    </section>
  );
}
