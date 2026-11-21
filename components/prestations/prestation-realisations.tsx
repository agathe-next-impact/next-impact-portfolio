// Bas des pages de prestation : « Réalisations et inspirations » (ADR-047).
// Un même composant pour /landing-evolutive et /refonte-wordpress, filtré sur
// la prestation de la page : les études de cas d'abord, les inspirations
// ensuite. Les deux rangées se composent dans lib/prestations-web.ts.
//
// Chaque vignette porte son étiquette, « Réalisation client » ou « Démo », lue
// dans `isDemo` de l'étude de cas (lib/case-studies-data.ts) : une démo
// présentée comme une réalisation client tromperait le visiteur.
//
// Composant serveur : les vignettes sont dans le HTML servi.

import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { TitreDeuxLignes } from "@/components/prestations/parts";
import { VIGNETTE_CADRE, VignetteImage } from "@/components/case-studies/vignette-image";
import { getCaseStudyCards, type CaseStudyCard } from "@/lib/case-studies-data";
import { REALISATIONS_PAR_PRESTATION, type PrestationKey } from "@/lib/prestations-web";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Les cartes d'une prestation, rangée par rangée, dans l'ordre de la
 * sélection ; un cas non publié est ignoré.
 */
export function cartesDePrestation(
  prestation: PrestationKey,
  locale: Locale,
): { cas: CaseStudyCard[]; inspirations: CaseStudyCard[] } {
  const cards = getCaseStudyCards(locale);
  const pick = (slugs: string[]) =>
    slugs.map((slug) => cards.find((c) => c.slug === slug)).filter((c): c is CaseStudyCard => Boolean(c));
  const selection = REALISATIONS_PAR_PRESTATION[prestation];
  return { cas: pick(selection.cas), inspirations: pick(selection.inspirations) };
}

function Vignette({ card }: { card: CaseStudyCard }) {
  return (
    <li className="group relative flex flex-col border-b border-r border-dark-gray transition-colors hover:bg-jet/60">
      {/* Image cliquable : doublon souris du lien titre, hors tabulation.
          Cadre noir et format commun : voir vignette-image.tsx. */}
      <Link href={card.link} tabIndex={-1} aria-hidden="true" className={VIGNETTE_CADRE}>
        <VignetteImage src={card.image} alt={card.alt} sizes="(min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 border-t border-dark-gray px-6 py-5">
        <span
          className={cn(
            "w-fit border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.14em]",
            card.isDemo
              ? "border-dark-gray text-mid-gray"
              : "border-accent-secondary/60 bg-accent-secondary/10 text-accent-secondary",
          )}
        >
          {card.isDemo ? "Démo" : "Réalisation client"}
        </span>
        <Link href={card.link} className="block no-underline">
          <h3 className="text-lg font-light tracking-tight text-foreground">{card.title}</h3>
          <p className="mt-1.5 line-clamp-3 font-inter-tight text-base leading-relaxed text-mid-gray">
            {card.description}
          </p>
        </Link>
        {card.highlight && (
          <div className="flex w-fit flex-col gap-0.5 border border-dark-gray bg-jet/50 px-2.5 py-1 sm:flex-row sm:items-baseline sm:gap-2">
            <span className="font-mono text-sm font-semibold tracking-tight text-accent-secondary tabular-nums">
              {card.highlight.value}
            </span>
            <span className="font-mono text-2xs uppercase tracking-[0.08em] text-mid-gray">
              {card.highlight.label}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

function Rangee({ titre, cards }: { titre: string; cards: CaseStudyCard[] }) {
  if (cards.length === 0) return null;
  // Trois colonnes à partir de trois vignettes, deux sinon : une vignette
  // seule garde la largeur d'une demi-ligne.
  const cols = cards.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div>
      <p className="border-b border-dark-gray px-6 py-4 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray lg:px-8">
        {titre}
      </p>
      <ul className={cn("grid", cols)}>
        {cards.map((card) => (
          <Vignette key={card.slug} card={card} />
        ))}
      </ul>
    </div>
  );
}

/**
 * La même grille de vignettes pour une sélection libre d'études de cas (la
 * home) : une seule rangée, dans l'ordre des slugs. Un cas non publié est
 * ignoré ; l'étiquette de chaque vignette vient toujours de `isDemo`.
 */
export function RealisationsSelection({
  slugs,
  locale,
  index,
  kicker,
  titre,
  description,
}: {
  slugs: string[];
  locale: Locale;
  index: string;
  kicker: string;
  titre: { bleu: string; encre: string };
  description?: string;
}) {
  const all = getCaseStudyCards(locale);
  const cards = slugs
    .map((slug) => all.find((c) => c.slug === slug))
    .filter((c): c is CaseStudyCard => Boolean(c));

  return (
    <BlueprintSection tone="obsidian" id="realisations">
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker={kicker}
          title={<TitreDeuxLignes bleu={titre.bleu} encre={titre.encre} />}
          description={description}
        />
      </div>

      <ul className={cn("grid", cards.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
        {cards.map((card) => (
          <Vignette key={card.slug} card={card} />
        ))}
      </ul>

      <div className="px-6 py-6 lg:px-8">
        <Link
          href="/etudes-de-cas"
          className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
        >
          Voir toutes les études de cas
          <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </BlueprintSection>
  );
}

export function PrestationRealisations({
  prestation,
  locale,
  index,
  titre,
  description,
}: {
  prestation: PrestationKey;
  locale: Locale;
  index: string;
  titre: { bleu: string; encre: string };
  description?: string;
}) {
  const { cas, inspirations: demos } = cartesDePrestation(prestation, locale);

  return (
    <BlueprintSection tone="obsidian" id="realisations">
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker="Réalisations et inspirations"
          title={<TitreDeuxLignes bleu={titre.bleu} encre={titre.encre} />}
          description={description}
        />
      </div>

      <Rangee titre="Études de cas" cards={cas} />
      <Rangee titre="Inspirations · sites de démonstration" cards={demos} />

      <div className="px-6 py-6 lg:px-8">
        <Link
          href="/etudes-de-cas"
          className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
        >
          Voir toutes les études de cas
          <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </BlueprintSection>
  );
}
