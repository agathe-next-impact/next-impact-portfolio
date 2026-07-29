"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { RadialGauge } from "@/components/visuals/radial-gauge";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

export default function HomeTihTeaser() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-24">
      {/* En-tête de section */}
      <Reveal className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        <span>№ 08</span>
        <span className="h-px w-6 bg-accent-secondary/50" />
        <span className="text-mid-gray">
          {isEn ? "AGEFIPH benefit · TIH provider" : "Avantage AGEFIPH · Prestataire TIH"}
        </span>
      </Reveal>

      {/* 2 colonnes */}
      <div className="mt-10 grid gap-12 border-t border-dark-gray pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        {/* Gauche — gain concret */}
        <Reveal delay={0.08} className="flex flex-col">
          <h2 className="max-w-2xl text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {isEn ? (
              <>
                Your website costs you{" "}
                <span className="text-accent-secondary">30% less</span>, funded by a contribution you already pay.
              </>
            ) : (
              <>
                Votre site vous coûte{" "}
                <span className="text-accent-secondary">30 % de moins</span>, financé par une contribution que vous versez déjà.
              </>
            )}
          </h2>

          <p className="mt-5 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray">
            {isEn
              ? "Subject to the OETH and paying an AGEFIPH contribution? As a TIH provider, every project deducts 30% of its labour cost from it."
              : "Assujetti à l'OETH et versant une contribution AGEFIPH ? En tant que prestataire TIH, chaque projet en déduit 30 % du coût de main-d'œuvre."}
          </p>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
            {isEn
              ? "Legal basis: Art. D.5212-7 of the French Labour Code."
              : "Base légale : Art. D.5212-7 du Code du travail."}
          </p>

          <div className="mt-9">
            <Link href="/avantage-oeth" className={BTN_PRIMARY}>
              {isEn ? "See how it works" : "Découvrir l'avantage AGEFIPH"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>

        {/* Droite — chiffre repère matérialisé */}
        <Reveal
          delay={0.16}
          className="flex flex-col items-center gap-7 border-dark-gray lg:border-l lg:pl-10"
        >
          <RadialGauge
            value={30}
            size={168}
            label={isEn ? "labour cost" : "coût de main-d'œuvre"}
            sublabel={isEn ? "deductible" : "déductible"}
          />
          <p className="max-w-[200px] text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-mid-gray">
            {isEn
              ? "deductible from your AGEFIPH contribution"
              : "déductible de votre contribution AGEFIPH"}
          </p>
        </Reveal>
      </div>
    </BlueprintSection>
  );
}
