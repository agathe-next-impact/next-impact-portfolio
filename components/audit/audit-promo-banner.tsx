"use client";

// Bannière de maillage contextuel vers /audit-site-web. Variante choisie selon la
// page hôte (services, contenu Headless, étude de cas). Modèle :
// components/documentation/audit-contextual-banner.tsx (qui pointe, lui, vers le
// diagnostic de stack /solutions-web/eligibilite). Tokens DS uniquement, i18n inline.

import { Link } from "@/i18n/navigation";
import { ArrowRight, Gauge } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/reveal";

type Variant = "services" | "headless" | "caseStudy";

const COPY: Record<Variant, { fr: Banner; en: Banner }> = {
  services: {
    fr: {
      title: "Pas sûr de la stack à choisir ?",
      subtitle:
        "Réservez un audit gratuit et obtenez une recommandation d'architecture personnalisée.",
      cta: "Réserver mon audit gratuit",
    },
    en: {
      title: "Not sure which stack to choose?",
      subtitle:
        "Book a free audit and get a personalized architecture recommendation.",
      cta: "Book my free audit",
    },
  },
  headless: {
    fr: {
      title: "Le Headless est-il pertinent pour votre site ?",
      subtitle:
        "Réservez un audit gratuit : on regarde ensemble si une migration en vaut la peine.",
      cta: "Réserver mon audit",
    },
    en: {
      title: "Is Headless relevant for your site?",
      subtitle:
        "Book a free audit: we'll look together at whether a migration is worth it.",
      cta: "Book my audit",
    },
  },
  caseStudy: {
    fr: {
      title: "Votre site se compare-t-il à ce projet ?",
      subtitle: "Réservez un audit gratuit et situez votre site par rapport à ce projet.",
      cta: "Réserver mon audit gratuit",
    },
    en: {
      title: "How does your site compare to this project?",
      subtitle: "Book a free audit and see how your site compares to this project.",
      cta: "Book my free audit",
    },
  },
};

interface Banner {
  title: string;
  subtitle: string;
  cta: string;
}

export function AuditPromoBanner({
  variant = "services",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const copy = COPY[variant][locale === "en" ? "en" : "fr"];

  return (
    <Reveal
      as="section"
      className={
        "flex flex-wrap items-center gap-6 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 p-6 px-8" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
        <Gauge className="h-[1.125rem] w-[1.125rem] text-accent-secondary" />
      </div>

      <div className="min-w-[12rem] flex-1">
        <h3 className="mb-1 text-lg font-light tracking-tight text-foreground">
          {copy.title}
        </h3>
        <p className="font-inter-tight text-base text-mid-gray">{copy.subtitle}</p>
      </div>

      <Link
        href="/audit-site-web"
        className="group inline-flex flex-shrink-0 items-center gap-1.5 border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
      >
        {copy.cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}
