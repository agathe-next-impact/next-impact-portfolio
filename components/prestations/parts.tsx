// Briques communes aux trois pages de prestations web (/solutions-web,
// /landing-evolutive, /refonte-wordpress, ADR-047). Composants serveur, sans
// hook : tokens du design system Blueprint uniquement. Aucun texte d'offre ni
// prix n'est écrit ici : tout vient de lib/prestations-web.ts.

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { BlueprintSection } from "@/components/aspect/section";
import { HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { cn } from "@/lib/utils";

type Href = Parameters<typeof Link>[0]["href"];

/**
 * Titre sur deux lignes, selon la charte : la première ligne en bleu, la
 * seconde en encre.
 */
export function TitreDeuxLignes({ bleu, encre }: { bleu: string; encre: string }) {
  return (
    <>
      <em className="font-normal not-italic text-accent-secondary">{bleu}</em>
      <br />
      {encre}
    </>
  );
}

/**
 * Colonne droite du héros : la vidéo, comme sur le héros historique de
 * /solutions-web. Muette, en boucle, `preload="metadata"` : elle ne pèse pas
 * sur le premier affichage.
 */
export function HeroVideo({ src, label }: { src: string; label: string }) {
  return (
    <video
      src={src}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="mx-auto aspect-[4/5] w-full max-w-[480px] rounded-md border border-dark-gray bg-obsidian object-cover lg:max-w-none"
    />
  );
}

/**
 * Ligne de prix du héros, sous l'accroche : « 1 700 € HT · En ligne en
 * 4 semaines · … ». Rendue en <span> : elle vit dans le <p> de la description.
 */
export function LignePrix({ items }: { items: string[] }) {
  return (
    <span className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 font-mono text-xs uppercase tracking-[0.08em] text-foreground">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && (
            <span aria-hidden className="text-accent-secondary">
              ·
            </span>
          )}
          <span className={i === 0 ? "text-accent-secondary" : undefined}>{item}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

/** Grille de cellules jointives : un titre, une phrase. Deux, trois ou quatre colonnes. */
export function Cellules({
  items,
  cols = 3,
  numbered = false,
}: {
  items: { titre: string; texte?: React.ReactNode; surtitre?: string }[];
  cols?: 2 | 3 | 4;
  /** Numérote les cellules (01, 02…) : étapes d'un déroulé. */
  numbered?: boolean;
}) {
  const grid = cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <ul className={cn("grid gap-px bg-dark-gray", grid)}>
      {items.map((item, i) => (
        <li key={item.titre} className="flex flex-col gap-3 bg-obsidian p-6 lg:p-8">
          {(numbered || item.surtitre) && (
            <span className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-accent-secondary">
              {numbered && <span>{String(i + 1).padStart(2, "0")}</span>}
              {numbered && item.surtitre && <span aria-hidden className="h-px w-4 bg-accent-secondary/50" />}
              {item.surtitre && <span className="text-mid-gray">{item.surtitre}</span>}
            </span>
          )}
          <h3 className="text-lg font-light tracking-tight text-foreground">{item.titre}</h3>
          {item.texte && (
            <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{item.texte}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Lignes empilées : un nom, une valeur mise en avant (prix), une phrase. */
export function Lignes({
  rows,
}: {
  rows: { titre: string; valeur?: string; texte?: React.ReactNode }[];
}) {
  return (
    <ul className="divide-y divide-dark-gray">
      {rows.map((row) => (
        <li
          key={row.titre}
          className="grid gap-2 px-6 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,2fr)] md:items-baseline md:gap-8 lg:px-8"
        >
          <h3 className="text-lg font-light tracking-tight text-foreground">{row.titre}</h3>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary">{row.valeur}</p>
          <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{row.texte}</p>
        </li>
      ))}
    </ul>
  );
}

/** En-tête d'une section de page de prestation : filet bas, marges du gabarit. */
export function EnTete({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">{children}</div>;
}

export type Action = {
  label: string;
  href: string;
  /** Lien externe (Calendly) : nouvel onglet. */
  external?: boolean;
  /** Route hors de app/[locale]/ (ex. /scan) ou ancre : balise <a>, même onglet. */
  plain?: boolean;
};

/** Un bouton : plein (`primary`) ou en filet. */
export function BoutonAction({ action, primary = false }: { action: Action; primary?: boolean }) {
  const className = primary ? HERO_BTN_PRIMARY : HERO_BTN_SECONDARY;
  const inner = (
    <>
      {action.label}
      {primary && <ArrowRight size={14} aria-hidden />}
    </>
  );
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  if (action.plain) {
    return (
      <a href={action.href} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={action.href as Href} className={className}>
      {inner}
    </Link>
  );
}

/**
 * Appel final d'une page : un titre, un ou deux boutons, puis le lien croisé
 * vers l'autre prestation.
 */
export function AppelFinal({
  titre,
  texte,
  primary,
  secondary,
  croise,
}: {
  titre: React.ReactNode;
  texte?: string;
  primary: Action;
  secondary?: Action;
  croise?: { texte: string; label: string; href: string };
}) {
  return (
    <BlueprintSection tone="jet" ticks innerClassName="px-6 py-16 lg:px-12 lg:py-20">
      <div className="flex flex-col gap-6">
        <h2 className="max-w-3xl text-3xl font-light tracking-tight text-foreground md:text-4xl">{titre}</h2>
        {texte && (
          <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">{texte}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <BoutonAction action={primary} primary />
          {secondary && <BoutonAction action={secondary} />}
        </div>
        {croise && (
          <p className="border-t border-dark-gray pt-6 font-inter-tight text-base leading-relaxed text-mid-gray">
            {croise.texte}{" "}
            <Link
              href={croise.href as Href}
              className="group inline-flex items-center gap-1.5 text-accent-secondary no-underline hover:text-foreground"
            >
              {croise.label}
              <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        )}
      </div>
    </BlueprintSection>
  );
}
