// Les deux cartes du Studio digital, une par situation (ADR-047) : étiquette,
// situation, nom d'offre, promesse, prix, délai, bouton. Le visiteur se
// reconnaît dans une situation avant de lire un nom d'offre ou un prix.
//
// Un seul gabarit pour la home et pour la page d'orientation /solutions-web :
// les deux pages ne peuvent pas dire deux choses différentes. Aucun texte ni
// prix n'est écrit ici : tout vient de lib/prestations-web.ts.
//
// Composant serveur. Les cartes portent les ancres `#lancer` et `#refondre`.

import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { HERO_BTN_PRIMARY } from "@/components/aspect/page-hero";
import {
  LANDING,
  LANDING_DELAI,
  LANDING_PRIX,
  REFONTE_DELAI,
  REFONTE_PRIX,
  REFONTE_WP,
} from "@/lib/prestations-web";
import { cn } from "@/lib/utils";

type Href = Parameters<typeof Link>[0]["href"];

const CARTES = [
  {
    ...LANDING,
    prix: `${LANDING_PRIX}, textes et visuels compris`,
    delai: LANDING_DELAI,
    bouton: `Découvrir la ${LANDING.nom}`,
  },
  {
    ...REFONTE_WP,
    prix: REFONTE_PRIX,
    delai: REFONTE_DELAI,
    bouton: `Découvrir la ${REFONTE_WP.nom}`,
  },
];

export function CartesOffres({
  as: Titre = "h2",
  className,
}: {
  /** Niveau du nom d'offre : h2 sous un h1 de page, h3 sous un titre de section. */
  as?: "h2" | "h3";
  /** Classe ajoutée à la grille (cible du balisage Speakable, par exemple). */
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px bg-dark-gray md:grid-cols-2", className)}>
      {CARTES.map((carte) => (
        <article
          key={carte.ancre}
          id={carte.ancre}
          className="flex scroll-mt-16 flex-col gap-6 bg-obsidian p-6 lg:p-10"
        >
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">{carte.etiquette}</p>
          <p className="font-inter-tight text-base leading-relaxed text-foreground/85 md:text-lg">
            {carte.situation}
          </p>
          <div className="flex flex-col gap-2 border-t border-dark-gray pt-6">
            <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">{carte.verbe}</p>
            <Titre className="text-3xl font-light tracking-tight text-foreground md:text-4xl">{carte.nom}</Titre>
          </div>
          <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{carte.promesse}</p>
          <dl className="mt-auto flex flex-col gap-1.5 border-t border-dark-gray pt-6">
            <dt className="sr-only">Prix</dt>
            <dd className="text-xl font-light leading-snug tracking-tight text-accent-secondary md:text-2xl">
              {carte.prix}
            </dd>
            <dt className="sr-only">Délai</dt>
            <dd className="font-mono text-2xs uppercase tracking-[0.08em] text-mid-gray">{carte.delai}</dd>
          </dl>
          <Link href={carte.path as Href} className={`${HERO_BTN_PRIMARY} self-start`}>
            {carte.bouton}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
