import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";

/**
 * HeroOfferStrip — bande d'aperçu des offres d'une page, placée dans le slot
 * `children` du PageHero (sous la note). Mini-cartes compactes : nom + prix +
 * micro-bénéfice, chacune cliquable vers sa section. Aperçu secondaire : le CTA
 * principal du héros reste la décision de la section (charte : une décision par
 * section). Tokens DS Blueprint uniquement, a11y (liste + liens).
 */
export interface HeroOffer {
  /** Nom court de l'offre. */
  name: string;
  /** Prix affiché (optionnel — ex. ressources/outils gratuits). */
  price?: string;
  /** Micro-bénéfice, une ligne. */
  benefit: string;
  /** Ancre (#…), lien externe, ou route interne i18n. */
  href: string;
  /** Lien externe (ouvre un nouvel onglet). */
  external?: boolean;
  /** Met la carte en avant (filet accent + mention). */
  recommended?: boolean;
}

export function HeroOfferStrip({
  offers,
  label,
  recommendedLabel = "Recommandée",
  ctaLabel = "Voir",
  externalCtaLabel = "Découvrir",
  className,
}: {
  offers: HeroOffer[];
  label?: string;
  recommendedLabel?: string;
  ctaLabel?: string;
  externalCtaLabel?: string;
  className?: string;
}) {
  return (
    <div className={"mt-8" + (className ? " " + className : "")}>
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
          {label}
        </p>
      )}
      <ul className="mt-3 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
        {offers.map((offer) => {
          const isAnchor = offer.href.startsWith("#");
          const cardClass =
            "group relative flex h-full w-full flex-col bg-jet p-4 no-underline transition-colors hover:bg-obsidian";

          const content = (
            <>
              {offer.recommended && (
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary"
                  aria-hidden
                />
              )}
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
                  {offer.name}
                </span>
                {offer.price && (
                  <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.04em] text-accent-secondary">
                    {offer.price}
                  </span>
                )}
              </span>
              {offer.recommended && (
                <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
                  ★ {recommendedLabel}
                </span>
              )}
              <span className="mt-2 font-inter-tight text-[13px] leading-snug text-mid-gray">
                {offer.benefit}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
                {offer.external ? externalCtaLabel : ctaLabel}
                <ArrowRight
                  size={11}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </>
          );

          return (
            <li key={offer.name} className="flex">
              {offer.external || isAnchor ? (
                <a
                  href={offer.href}
                  {...(offer.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={cardClass}
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={offer.href as Parameters<typeof Link>[0]["href"]}
                  className={cardClass}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
