import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");

  return (
    <footer className="bg-ink text-paper/80 border-t border-gold/20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="font-display text-2xl text-paper mb-3">
            Krish Lanka<span className="text-gold italic"> Tours</span>
          </div>
          <p className="font-body text-sm text-paper/60 max-w-xs">
            {t("tagline")}
          </p>
        </div>

        <div>
          <div className="font-stamp text-xs uppercase tracking-widest text-gold mb-4">
            {t("quickLinks")}
          </div>
          <ul className="flex flex-col gap-2 font-body text-sm">
            <li><Link href="/tours" className="hover:text-gold transition-colors">{nav("tours")}</Link></li>
            <li><Link href="/gallery" className="hover:text-gold transition-colors">{nav("gallery")}</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">{nav("about")}</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">{nav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-stamp text-xs uppercase tracking-widest text-gold mb-4">
            {t("contactTitle")}
          </div>
          <ul className="flex flex-col gap-2.5 font-body text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-gold shrink-0" />
              {contact("locationValue")}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold shrink-0" />
              +94 XX XXX XXXX
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold shrink-0" />
              hello@krishlankatours.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10 py-5 text-center font-body text-xs text-paper/40">
        © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
