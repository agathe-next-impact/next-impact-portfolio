"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { OFFERS, type ConseilOffer } from "@/lib/visio-conseil";

// Index affiché (№ 0X) de chaque section d'offre, dans l'ordre des trois offres
// de conseil. Les sections servent d'ancres au mega menu (#choix-techno-ia,
// #architecture-projet-ia, #cto-externalise).
const SECTION_INDEX = ["№ 04", "№ 05", "№ 06"];

function OfferSection({
  offer,
  index,
  isEn,
}: {
  offer: ConseilOffer;
  index: string;
  isEn: boolean;
}) {
  const copy = isEn ? offer.en : offer.fr;
  const tier = offer.tiers[0];
  const featured = offer.featured;

  const ctaLabel = offer.cta
    ? isEn
      ? offer.cta.en
      : offer.cta.fr
    : isEn
      ? "Book & pay"
      : "Réserver et payer";

  const ctaClass = cn(
    "group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
    featured
      ? "border border-accent-secondary bg-accent-secondary text-obsidian hover:bg-accent-secondary/85"
      : "border border-dark-gray text-foreground hover:bg-jet",
  );

  const cta = offer.internalCta ? (
    <Link href={tier.calendlyUrl as Parameters<typeof Link>[0]["href"]} className={ctaClass}>
      {ctaLabel}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  ) : (
    <a href={tier.calendlyUrl} target="_blank" rel="noopener noreferrer" className={ctaClass}>
      {ctaLabel}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  );

  return (
    <BlueprintSection id={offer.id} tone={featured ? "jet" : "obsidian"} className="scroll-mt-24">
      {featured && (
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-accent-secondary" aria-hidden />
      )}

      {/* En-tête : index + tag + nom + tarif */}
      <Reveal className="flex flex-col gap-6 border-b border-dark-gray px-6 py-12 md:flex-row md:items-end md:justify-between lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>{index}</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            {copy.tag && <span className="text-mid-gray">{copy.tag}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
              {copy.name}
            </h2>
            {offer.credited && (
              <span className="inline-flex items-center border border-accent-secondary/60 bg-accent-secondary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
                {isEn ? "Deducted from your quote" : "Déduit du devis"}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 md:text-right">
          {tier.pricePrefix && (
            <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
              {isEn ? tier.pricePrefix.en : tier.pricePrefix.fr}
            </span>
          )}
          <div className="flex items-baseline gap-2 md:justify-end">
            <span className="text-xl font-light leading-none tracking-tight text-accent-secondary md:text-2xl">
              {tier.price}
            </span>
            {!tier.noHt && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                HT
              </span>
            )}
          </div>
          <div className="mt-2 font-mono text-[10px] tracking-[0.08em] text-mid-gray">
            {isEn ? tier.duration.en : tier.duration.fr}
          </div>
        </div>
      </Reveal>

      {/* Corps : « Pour quand » + « Ce que c'est » | « Ce qui est inclus » */}
      <Reveal className="grid gap-8 px-6 py-10 md:grid-cols-2 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {isEn ? "When?" : "Pour quand ?"}
            </div>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {copy.forWho}
            </p>
          </div>
          <div>
            <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {isEn ? "What it is" : "Ce que c'est"}
            </div>
            <p className="font-inter-tight text-base leading-relaxed text-foreground">
              {copy.tagline}
            </p>
          </div>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
            {isEn ? "What's included" : "Ce qui est inclus"}
          </div>
          <ul className="flex flex-col gap-2.5">
            {copy.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
                <span className="font-inter-tight text-sm leading-snug text-mid-gray">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* CTA de l'offre */}
      <div className="border-t border-dark-gray px-6 py-8 lg:px-8">{cta}</div>
    </BlueprintSection>
  );
}

// Une section par offre de conseil, dans l'ordre du catalogue. Chaque section
// porte l'id (#choix-techno-ia / #architecture-projet-ia / #cto-externalise) qui
// sert d'ancre au mega menu et au bandeau du héros.
export function ConseilOfferSections() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <>
      {OFFERS.map((offer, i) => (
        <React.Fragment key={offer.id}>
          {i > 0 && <Separator />}
          <OfferSection offer={offer} index={SECTION_INDEX[i] ?? `№ ${4 + i}`} isEn={isEn} />
        </React.Fragment>
      ))}
    </>
  );
}
