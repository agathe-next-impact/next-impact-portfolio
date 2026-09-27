"use client";

// Bandeau de renvoi vers l'Expert technique externalisé : bas de page de
// /conseil (charte v1.5, ADR-013).
//
// L'offre vit dans le moment « Gérer » et se vend sur /cto-externalise. La page
// Conseil ne la présente plus comme l'une de ses offres : elle y renvoie, par
// ce bandeau, le lecteur dont les décisions reviennent tous les mois. Offre
// récurrente, donc chaude : jamais dans un héros ni en bouton froid.
//
// Historique : créé pour /solutions-web, retiré de /conseil le 2026-09-10
// (ADR-009, l'offre y avait repris une section), supprimé le 2026-09-27
// (ADR-012, remplacé par TenirBanner sur /solutions-web), rétabli le même jour
// sur /conseil (ADR-013, qui revient sur l'ADR-009).
//
// Aucun prix recopié : lib/cto-externalise.ts fait foi. Tokens DS uniquement,
// i18n inline, reduced-motion via <Reveal>.

import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { CTO_PATH, CTO_PRICE } from "@/lib/cto-externalise";

const COPY = {
  fr: {
    eyebrow: "Gérer · Expert technique externalisé",
    title: "Les décisions techniques reviennent tous les mois ?",
    subtitle:
      "Un avis ponctuel se rachèterait à chaque fois. Une direction technique à temps partagé prend le relais : un comité de pilotage par mois, vos devis relus, une roadmap tenue à jour. Sans recruter.",
    price: `${CTO_PRICE.fr.amount} ${CTO_PRICE.fr.period}`,
    cta: "Voir l'accompagnement",
  },
  en: {
    eyebrow: "Manage · Outsourced technical expert",
    title: "Do technical decisions come up every month?",
    subtitle:
      "A one-off opinion would have to be bought again each time. Shared-time technical direction takes over: one steering committee a month, your quotes reviewed, a roadmap kept up to date. Without hiring.",
    price: `${CTO_PRICE.en.amount} ${CTO_PRICE.en.period}`,
    cta: "See the retainer",
  },
};

export function CtoExternaliseBanner({
  tone = "jet",
  id,
}: {
  tone?: "obsidian" | "jet";
  /** Ancre de la section (ex. « cto-externalise », pour les anciens liens). */
  id?: string;
}) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale === "en" ? "en" : "fr"];

  return (
    <BlueprintSection
      id={id}
      tone={tone}
      className="scroll-mt-24"
      innerClassName="px-6 py-12 lg:px-8 lg:py-16"
    >
      <Reveal
        className="flex flex-wrap items-center gap-6 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-obsidian/40 p-6 px-8"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
          <CalendarClock className="h-[1.125rem] w-[1.125rem] text-accent-secondary" aria-hidden />
        </div>

        <div className="min-w-[12rem] flex-1">
          <p className="mb-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            {copy.eyebrow}
          </p>
          <h2 className="mb-1 text-lg font-light tracking-tight text-foreground">{copy.title}</h2>
          <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{copy.subtitle}</p>
          <p className="mt-2 font-inter-tight text-base text-foreground">{copy.price}</p>
        </div>

        <Link
          href={CTO_PATH}
          className="group inline-flex min-h-11 flex-shrink-0 items-center gap-1.5 border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-foreground no-underline transition-colors hover:border-accent-secondary"
        >
          {copy.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}
