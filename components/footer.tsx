import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CTASection } from "./cta-section";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="w-full p-4 md:p-12 bg-mediumblue/10 backdrop-blur-sm border-t border-white/10 space-y-8">
      {/* CTA Section — cartes contextuelles */}
      <CTASection />

      {/* Contact direct — dernier filet avant les liens */}
      <div className="container max-w-2xl mx-auto py-8 border-t border-white/10 text-center space-y-3">
        <p className="text-white/50 font-googletexte text-sm uppercase tracking-widest">
          {t("contactQuestion")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <a
            href="mailto:agathe@next-impact.digital"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm font-googletexte"
          >
            <Mail className="w-4 h-4 text-coral shrink-0" />
            agathe@next-impact.digital
          </a>
          <a
            href="tel:0673981638"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm font-googletexte"
          >
            <Phone className="w-4 h-4 text-lightyellow shrink-0" />
            06 73 98 16 38
          </a>
        </div>
        <p className="text-xs text-white/40 font-googletexte">
          {t("availability")}
        </p>
      </div>

      {/* Footer info */}
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-10 py-8 border-t border-white/10">
        {/* Colonne 1 : Identité */}
        <div className="flex flex-col gap-3">
          <h3 className="font-googletitre text-white text-lg font-semibold mb-2">
            {t("company")}
          </h3>
          <p className="text-white/70 text-sm font-googletexte">
            {t("owner")}
          </p>
          <div className="flex items-start gap-2 text-white/60 text-sm font-googletexte">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-white/70">{t("address")}</span>
          </div>
        </div>

        {/* Colonne 2 : Liens */}
        <div className="flex flex-col gap-3">
          <h3 className="font-googletitre text-white text-lg font-semibold mb-2">
            {t("usefulLinks")}
          </h3>
          <nav className="flex flex-col gap-2">
            <Link href="/mentions-legales" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("legalNotice")}
            </Link>
            <Link href="/a-propos" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("about")}
            </Link>
            <Link href="/services" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("services")}
            </Link>
            <Link href="/etudes-de-cas" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("caseStudies")}
            </Link>
            <Link href="/documentation" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("documentation")}
            </Link>
            <Link href="/blog" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("blog")}
            </Link>
            <Link href="/avantage-oeth" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("oethAdvantage")}
            </Link>
          </nav>
        </div>

        {/* Colonne 3 : Ressources */}
        <div className="flex flex-col gap-3">
          <h3 className="font-googletitre text-white text-lg font-semibold mb-2">
            {t("resources")}
          </h3>
          <nav className="flex flex-col gap-2">
            <a href="/ressources/livre_blanc_wp_headless.pdf" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("whitepaperHeadless")}
            </a>
            <a href="/ressources/livre_blanc_web_app.pdf" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("whitepaperWebApp")}
            </a>
            <Link href="/audit-site-ia" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("freeAiAudit")}
            </Link>
            <Link href="/outils/simulateur-roi" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("roiSimulator")}
            </Link>
            <Link href="/outils/benchmarking" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("benchmarking")}
            </Link>
            <Link href="/avantage-oeth" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("agefiphSimulator")}
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              {t("startWebApp")}
            </Link>
          </nav>
        </div>

        {/* Colonne 4 : Logo certification */}
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src="/img/logo-activateurs.svg"
            alt={t("certificationAlt")}
            width={120}
            height={120}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="container border-t border-white/10 pt-4 space-y-1">
        <p className="text-center text-sm text-white/50 font-googletexte">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
        <p className="text-center text-xs text-white/35 font-googletexte">
          {t("tihMention")}
        </p>
      </div>
    </footer>
  );
}
