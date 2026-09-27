import * as React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { MegaSection } from "@/lib/mega-menu";
import type { Lang } from "@/lib/trajectoires";

type Href = Parameters<typeof Link>[0]["href"];

/**
 * HeroNavCards — colonne droite du PageHero (slot `aside`) : les éléments
 * importants de la page en cartes empilées, chacune menant à sa section (ancre
 * `#…`), à une page interne ou, plus rarement, à un lien externe. Sur une page
 * mère, uniquement ses pages enfants (heroCardsEnfants), en mode `fill`. Aperçu
 * démonstratif (chiffre, prix), le détail reste dans la section. Composant
 * serveur, tokens DS Blueprint uniquement.
 */
export interface HeroNavCard {
  /** Numéro de la section visée (ex. « 01 »). */
  index?: string;
  /** Libellé court de la section. */
  label: string;
  /** Valeur mise en avant : prix, chiffre de preuve… */
  value?: string;
  /** Une ligne de contexte. */
  detail?: string;
  /** Ancre (#…), route interne i18n ou URL externe (avec `external`). */
  href: string;
  /** Lien externe : nouvel onglet. */
  external?: boolean;
  /** Carte mise en avant (filet accent + mention). */
  recommended?: boolean;
}

/**
 * Cartes d'une page mère : ses pages enfants, lues dans la section du mega menu
 * (même nom, même prix, même lien que les cases du menu). Un parcours sans page
 * (Arbitrage) mène à son lien externe, comme dans le menu.
 */
export function heroCardsEnfants(section: MegaSection, lang: Lang): HeroNavCard[] {
  return section.items.map((item) => ({
    label: item.label[lang],
    value: item.price?.[lang] ?? item.tag?.[lang],
    detail: item.desc[lang],
    href: item.href,
    external: item.external,
    recommended: item.tag?.fr === "Recommandé",
  }));
}

export function HeroNavCards({
  cards,
  label,
  recommendedLabel = "Recommandée",
  fill = false,
}: {
  cards: HeroNavCard[];
  /** Titre accessible de la navigation (ex. « Sur cette page »). */
  label: string;
  recommendedLabel?: string;
  /**
   * Occupe toute la hauteur du héros (lg), cartes à parts égales. Pages mères :
   * la colonne ne porte que les prestations enfants.
   */
  fill?: boolean;
}) {
  return (
    <nav aria-label={label} className={fill ? "flex flex-col lg:self-stretch" : undefined}>
      <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">{label}</p>
      <ul
        className={
          "mt-3 grid gap-px border border-dark-gray bg-dark-gray" +
          (fill ? " flex-1 auto-rows-fr" : "")
        }
      >
        {cards.map((card) => {
          const className =
            "group relative flex h-full items-center gap-4 bg-jet p-4 no-underline transition-colors hover:bg-obsidian lg:p-5";
          const Arrow = card.external ? ArrowUpRight : ArrowRight;
          const content = (
            <>
              {card.recommended && (
                <span className="absolute inset-y-0 left-0 w-0.5 bg-accent-secondary" aria-hidden />
              )}
              {card.index && (
                <span className="font-mono text-2xs tracking-[0.14em] text-mid-gray">{card.index}</span>
              )}
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-mono text-2xs uppercase tracking-[0.1em] text-foreground">
                    {card.label}
                  </span>
                  {card.value && (
                    <span className="font-mono text-2xs tracking-[0.04em] text-accent-secondary">
                      {card.value}
                    </span>
                  )}
                </span>
                {card.recommended && (
                  <span className="font-mono text-2xs uppercase tracking-[0.12em] text-accent-secondary">
                    {recommendedLabel}
                  </span>
                )}
                {/* Sous-titre : 1,5 ligne au plus, jamais coupé (demande
                    d'Agathe du 2026-09-27). La limite tient à la longueur des
                    textes, environ 75 signes, pas à un rognage CSS. */}
                {card.detail && (
                  <span className="font-inter-tight text-sm leading-snug text-mid-gray">{card.detail}</span>
                )}
              </span>
              <Arrow
                size={14}
                aria-hidden
                className="shrink-0 text-mid-gray transition-colors group-hover:text-accent-secondary"
              />
            </>
          );
          return (
            <li key={card.href} className={fill ? "flex [&>*]:flex-1" : undefined}>
              {card.external ? (
                <a href={card.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {content}
                </a>
              ) : card.href.startsWith("#") ? (
                <a href={card.href} className={className}>
                  {content}
                </a>
              ) : (
                <Link href={card.href as Href} className={className}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
