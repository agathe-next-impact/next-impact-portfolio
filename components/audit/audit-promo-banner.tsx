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
        "Auditez votre site actuel et obtenez une recommandation d'architecture en 2 minutes.",
      cta: "Auditer mon site",
    },
    en: {
      title: "Not sure which stack to choose?",
      subtitle:
        "Audit your current site and get an architecture recommendation in 2 minutes.",
      cta: "Audit my site",
    },
  },
  headless: {
    fr: {
      title: "Le Headless est-il pertinent pour votre site ?",
      subtitle:
        "Testez votre site : le diagnostic indique si une migration en vaut la peine.",
      cta: "Tester mon site",
    },
    en: {
      title: "Is Headless relevant for your site?",
      subtitle:
        "Test your site: the diagnosis tells you whether a migration is worth it.",
      cta: "Test my site",
    },
  },
  caseStudy: {
    fr: {
      title: "Votre site se compare-t-il à ce projet ?",
      subtitle: "Lancez un diagnostic gratuit et situez votre site en 2 minutes.",
      cta: "Comparer mon site",
    },
    en: {
      title: "How does your site compare to this project?",
      subtitle: "Run a free diagnosis and benchmark your site in 2 minutes.",
      cta: "Compare my site",
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
        <p className="font-inter-tight text-sm text-mid-gray">{copy.subtitle}</p>
      </div>

      <Link
        href="/audit-site-web"
        className="group inline-flex flex-shrink-0 items-center gap-1.5 border border-accent-deep bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-white no-underline transition-colors hover:bg-accent/90"
      >
        {copy.cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}
