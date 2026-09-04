"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { getTiers, type Tier } from "@/components/services/PricingCards";

// Index affiché (№ 0X) de chaque section d'offre, dans l'ordre des trois
// trajectoires. Les sections servent d'ancres au mega menu (#forfait-*).
const SECTION_INDEX = ["№ 04", "№ 05", "№ 06"];

function OfferSection({ tier, index }: { tier: Tier; index: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <BlueprintSection id={tier.slug} tone={tier.highlight ? "jet" : "obsidian"} className="scroll-mt-24">
      {tier.highlight && (
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-accent-secondary" aria-hidden />
      )}

      {/* En-tête : index + nom + prix */}
      <Reveal className="flex flex-col gap-6 border-b border-dark-gray px-6 py-12 md:flex-row md:items-end md:justify-between lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>{index}</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">{tier.tech}</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
              {tier.name}
            </h2>
            {tier.badge && (
              <span className="inline-flex items-center border border-accent-secondary/60 bg-accent-secondary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
                {tier.badge}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="text-xl font-light leading-none tracking-tight text-accent-secondary md:text-2xl">
            {tier.price}
          </div>
          <div className="mt-2 font-mono text-[10px] tracking-[0.08em] text-mid-gray">
            {tier.priceTagline}
          </div>
        </div>
      </Reveal>

      {/* Corps : « Pour quand » + « La solution » + stack technique. */}
      <Reveal className="grid gap-8 px-6 py-10 md:grid-cols-2 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {tier.forProjectLabel}
            </div>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {tier.forProject}
            </p>
          </div>
          <div>
            <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {tier.stackLabel}
            </div>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {tier.stackHtml}
            </p>
          </div>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
            {tier.solutionLabel}
          </div>
          <p className="font-inter-tight text-base leading-relaxed text-foreground">
            {tier.solution}
          </p>
        </div>
      </Reveal>

      {/* CTA de l'offre */}
      <div className="border-t border-dark-gray px-6 py-8 lg:px-8">
        {tier.ctaExternal ? (
          <a
            href={tier.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
              tier.highlight
                ? "border border-accent-secondary bg-accent-secondary text-obsidian hover:bg-accent-secondary/85"
                : "border border-dark-gray text-foreground hover:bg-jet",
            )}
          >
            {tier.ctaLabel}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link
            href={tier.ctaHref as Parameters<typeof Link>[0]["href"]}
            className={cn(
              "group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
              tier.highlight
                ? "border border-accent-secondary bg-accent-secondary text-obsidian hover:bg-accent-secondary/85"
                : "border border-dark-gray text-foreground hover:bg-jet",
            )}
          >
            {tier.ctaLabel}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </BlueprintSection>
  );
}

// Une section par offre, dans l'ordre des trois trajectoires. Chaque section
// porte l'id (#forfait-classique/headless/webapp) qui sert d'ancre au mega menu
// et au bandeau du héros.
export function OfferSections() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const tiers = getTiers(isEn);

  return (
    <>
      {tiers.map((tier, i) => (
        <React.Fragment key={tier.slug}>
          {i > 0 && <Separator />}
          <OfferSection tier={tier} index={SECTION_INDEX[i] ?? `№ ${4 + i}`} />
        </React.Fragment>
      ))}
    </>
  );
}
