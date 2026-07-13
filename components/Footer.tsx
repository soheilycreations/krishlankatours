import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Mail, Phone } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");

  return (
    <footer className="bg-navy text-white/75 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/images/logo-icon.png"
                alt="Krish Lanka Tours & Travels"
                width={44}
                height={44}
                className="object-contain w-10 h-10"
              />
            </span>
            <div className="font-display text-2xl text-white">
              Krish Lanka Tours<span className="text-blue-light italic"> &amp; Travels</span>
            </div>
          </div>
          <p className="font-body text-sm text-white/55 max-w-xs">
            {t("tagline")}
          </p>
        </div>

        <div>
          <div className="font-stamp text-xs uppercase tracking-widest text-blue-light mb-4">
            {t("quickLinks")}
          </div>
          <ul className="flex flex-col gap-2 font-body text-sm">
            <li><Link href="/tours" className="hover:text-blue-light transition-colors">{nav("tours")}</Link></li>
            <li><Link href="/destinations" className="hover:text-blue-light transition-colors">{nav("destinations")}</Link></li>
            <li><Link href="/gallery" className="hover:text-blue-light transition-colors">{nav("gallery")}</Link></li>
            <li><Link href="/about" className="hover:text-blue-light transition-colors">{nav("about")}</Link></li>
            <li><Link href="/contact" className="hover:text-blue-light transition-colors">{nav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-stamp text-xs uppercase tracking-widest text-blue-light mb-4">
            {t("contactTitle")}
          </div>
          <ul className="flex flex-col gap-2.5 font-body text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-blue-light shrink-0" />
              {contact("locationValue")}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-blue-light shrink-0" />
              +94 XX XXX XXXX
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-blue-light shrink-0" />
              hello@krishlankatours.com
            </li>
          </ul>
        </div>

        <div>
          <div className="font-stamp text-xs uppercase tracking-widest text-blue-light mb-4">
            {t("newsletterTitle")}
          </div>
          <p className="font-body text-sm text-white/55">{t("newsletterBody")}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center font-body text-xs text-white/35">
        © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
