"use client";

// Bandeau « Dépannage WordPress » — band pleine largeur, drop-in sur la home,
// la page contact et la page services. Modèle : components/audit/audit-promo-
// banner.tsx. Tokens DS uniquement, i18n inline, reduced-motion via <Reveal>.

import { Link } from "@/i18n/navigation";
import { ArrowRight, Wrench } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";

const COPY = {
  fr: {
    eyebrow: "Sans abonnement",
    title: "Un souci sur votre site WordPress ?",
    subtitle:
      "Intervention à la demande : diagnostic, correction ou pack d'heures. Réponse sous 24h ouvrées, sauvegarde avant toute action, devis clair au-delà d'1h.",
    cta: "Voir le dépannage WordPress",
  },
  en: {
    eyebrow: "No subscription",
    title: "Something broken on your WordPress site?",
    subtitle:
      "On-demand help: diagnosis, fix or prepaid hours. Reply within 24 business hours, backup before any action, clear quote beyond 1h.",
    cta: "See WordPress support",
  },
};

export function WordpressExpressBanner({
  tone = "obsidian",
}: {
  tone?: "obsidian" | "jet";
}) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale === "en" ? "en" : "fr"];

  return (
    <BlueprintSection tone={tone} innerClassName="px-6 py-12 lg:px-8 lg:py-16">
      <Reveal
        as="section"
        className="flex flex-wrap items-center gap-6 border border-l-[3px] border-dark-gray border-l-vermilion bg-jet/40 p-6 px-8"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
          <Wrench className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>

        <div className="min-w-[12rem] flex-1">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            {copy.eyebrow}
          </p>
          <h3 className="mb-1 text-lg font-light tracking-tight text-foreground">
            {copy.title}
          </h3>
          <p className="font-inter-tight text-sm text-mid-gray">{copy.subtitle}</p>
        </div>

        <Link
          href="/depannage-wordpress"
          className="group inline-flex flex-shrink-0 items-center gap-1.5 border border-vermilion bg-vermilion px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-white no-underline transition-colors hover:bg-vermilion-bright"
        >
          {copy.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}
