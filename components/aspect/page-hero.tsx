import * as React from "react";

import { BlueprintSection, SectionHeading } from "@/components/aspect/section";

/* Boutons du héros — mêmes classes que la page /veille, référence de
   l'harmonisation. Primaire = accent-2 plein, secondaire = filet. */
export const HERO_BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian no-underline transition-opacity hover:opacity-90";
export const HERO_BTN_SECONDARY =
  "inline-flex items-center justify-center gap-2 border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray no-underline transition-colors hover:text-foreground";

/**
 * PageHero — héros de page harmonisé sur celui de /veille : équerres d'angle,
 * kicker `№ + libellé`, H1 `font-light` (mettre la portion saillante du titre
 * dans un `<em className="font-normal not-italic text-accent-secondary">`),
 * description, rangée de CTA (`actions`), micro-ligne mono (`note`).
 * Composant serveur (aucun hook) — importable des deux côtés.
 */
export function PageHero({
  index = "№ 00",
  kicker,
  title,
  description,
  actions,
  note,
  breadcrumb,
  aside,
  backdrop,
  id,
  className,
  children,
}: {
  index?: string;
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Rangée de CTA sous la description (HERO_BTN_PRIMARY / HERO_BTN_SECONDARY). */
  actions?: React.ReactNode;
  /** Micro-ligne mono de réassurance sous les CTA. */
  note?: React.ReactNode;
  /** Fil d'Ariane rendu au-dessus du kicker. */
  breadcrumb?: React.ReactNode;
  /** Colonne de droite du héros (ex. portrait) — grille 1.2fr/0.8fr en lg. */
  aside?: React.ReactNode;
  backdrop?: React.ReactNode;
  id?: string;
  /** Classes ajoutées à la section (ex. surcharge locale de tokens). */
  className?: string;
  /** Contenu libre rendu après la note (champ de recherche, visuel…). */
  children?: React.ReactNode;
}) {
  const body = (
    <>
      <SectionHeading
        as="h1"
        index={index}
        kicker={kicker}
        title={title}
        description={description}
      />
      {actions && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {actions}
        </div>
      )}
      {note && (
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {note}
        </p>
      )}
      {children}
    </>
  );

  return (
    <BlueprintSection
      ticks
      id={id}
      backdrop={backdrop}
      className={className}
      innerClassName="px-6 py-16 lg:px-12 lg:py-24"
    >
      {breadcrumb}
      {aside ? (
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>{body}</div>
          {aside}
        </div>
      ) : (
        body
      )}
    </BlueprintSection>
  );
}
