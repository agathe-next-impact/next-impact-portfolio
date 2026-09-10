"use client";

// Bandeau « Expert technique externalisé » — drop-in de bas de page sur
// /solutions-web. Offre RÉCURRENTE, donc chaude : elle ne s'adresse qu'à
// quelqu'un qui a déjà lu les trajectoires. Ne jamais la placer dans un héros
// ni en CTA froid.
//
// Retiré de /conseil le 2026-09-10 (ADR-009) : l'expert technique externalisé
// y a repris une section d'offre en propre (#cto-externalise), le bandeau y
// ferait doublon.
//
// Tokens DS uniquement, i18n inline, reduced-motion via <Reveal>.

import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { CTO_PATH, CTO_PRICE } from "@/lib/cto-externalise";

const COPY = {
  fr: {
    eyebrow: "Expert technique externalisé",
    title: "Les décisions techniques reviennent tous les mois ?",
    subtitle: `Un directeur technique à temps partagé, ${CTO_PRICE.fr.amount} ${CTO_PRICE.fr.period} : une visio de pilotage par mois, vos devis relus, une roadmap tenue à jour. Sans embaucher.`,
    cta: "Voir l'accompagnement",
  },
  en: {
    eyebrow: "Outsourced technical expert",
    title: "Do technical decisions come up every month?",
    subtitle: `A technical director on shared time, ${CTO_PRICE.en.amount} ${CTO_PRICE.en.period}: one steering call a month, your quotes reviewed, a roadmap kept up to date. Without hiring.`,
    cta: "See the retainer",
  },
};

export function CtoExternaliseBanner({
  tone = "jet",
}: {
  tone?: "obsidian" | "jet";
}) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale === "en" ? "en" : "fr"];

  return (
    <BlueprintSection tone={tone} innerClassName="px-6 py-12 lg:px-8 lg:py-16">
      <Reveal
        as="section"
        className="flex flex-wrap items-center gap-6 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-obsidian/40 p-6 px-8"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
          <CalendarClock className="h-[1.125rem] w-[1.125rem] text-accent-secondary" />
        </div>

        <div className="min-w-[12rem] flex-1">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            {copy.eyebrow}
          </p>
          <h3 className="mb-1 text-lg font-light tracking-tight text-foreground">{copy.title}</h3>
          <p className="font-inter-tight text-sm text-mid-gray">{copy.subtitle}</p>
        </div>

        <Link
          href={CTO_PATH}
          className="group inline-flex flex-shrink-0 items-center gap-1.5 border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-foreground no-underline transition-colors hover:border-accent-secondary"
        >
          {copy.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}
