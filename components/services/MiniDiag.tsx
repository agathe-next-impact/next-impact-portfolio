"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
  recoName: string;
  recoPrice: string;
  recoLine: string;
  anchor: string;
  recommended?: boolean;
};

function getOptions(isEn: boolean): Option[] {
  return [
    {
      id: "vitrine",
      label: isEn ? "A brochure or simple site" : "Une vitrine ou un site simple",
      recoName: isEn ? "High-performance brochure site" : "Site vitrine performant",
      recoPrice: isEn ? "From €2,250" : "Depuis 2 250 €",
      recoLine: isEn
        ? "Modernized WordPress: fast, secure, controlled cost."
        : "WordPress modernisé : rapide, sécurisé, à coût maîtrisé.",
      anchor: "#forfait-classique",
    },
    {
      id: "croissance",
      label: isEn ? "A growth site (SEO, content)" : "Un site de croissance (SEO, contenu)",
      recoName: isEn ? "High-speed website" : "Site haute performance",
      recoPrice: isEn ? "From €4,000" : "Depuis 4 000 €",
      recoLine: isEn
        ? "Headless WordPress + Next.js: front-end performance, critical SEO."
        : "WordPress Headless + Next.js : performance front, SEO critique.",
      anchor: "#forfait-headless",
      recommended: true,
    },
    {
      id: "plateforme",
      label: isEn ? "A platform or an app" : "Une plateforme ou une application",
      recoName: isEn ? "Custom business platform" : "Plateforme métier sur-mesure",
      recoPrice: isEn ? "From €6,500" : "Depuis 6 500 €",
      recoLine: isEn
        ? "Dedicated architecture: business logic, accounts, real-time."
        : "Architecture dédiée : logique métier, comptes, temps réel.",
      anchor: "#forfait-webapp",
    },
  ];
}

/**
 * MiniDiag — orienteur 1 question. Ramène le choix des 3 forfaits à UNE décision :
 * le visiteur dit ce qu'est son projet, on recommande le forfait + on pointe vers
 * lui. Pour aller plus loin, lien vers le diagnostic complet (/solutions-web/eligibilite).
 */
export default function MiniDiag({ index = "№ 03" }: { index?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const options = getOptions(isEn);
  const [selected, setSelected] = useState<string | null>(null);
  const reco = options.find((o) => o.id === selected) ?? null;

  return (
    <BlueprintSection tone="jet" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
      <Reveal>
        <SectionHeading
          index={index}
          kicker={isEn ? "Quick diagnostic" : "Diagnostic express"}
          title={isEn ? "Your project is more like…" : "Votre projet, c'est plutôt…"}
          description={
            isEn
              ? "One question to point you to the right package. For a detailed recommendation, run the full 2-minute diagnostic."
              : "Une question pour vous orienter vers le bon forfait. Pour une reco détaillée, lancez le diagnostic complet en 2 minutes."
          }
        />
      </Reveal>

      {/* Options — 1 décision */}
      <Reveal delay={0.06} className="mt-8 grid gap-px bg-dark-gray md:grid-cols-3">
        {options.map((o) => {
          const active = selected === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelected(o.id)}
              aria-pressed={active}
              className={cn(
                "relative flex items-center justify-between gap-3 p-5 text-left font-inter-tight text-sm leading-snug transition-colors lg:p-6",
                active ? "bg-obsidian text-foreground" : "bg-jet text-mid-gray hover:bg-obsidian hover:text-foreground",
              )}
            >
              {active && (
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary" />
              )}
              <span>{o.label}</span>
              <ArrowRight
                size={14}
                className={cn("shrink-0", active ? "text-accent-secondary" : "text-mid-gray")}
              />
            </button>
          );
        })}
      </Reveal>

      {/* Recommandation */}
      {reco ? (
        <Reveal className="mt-px border border-dark-gray bg-obsidian p-6 lg:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
                {isEn ? "Recommended" : "Recommandé"}
                {reco.recommended && (
                  <span className="text-mid-gray">· {isEn ? "most popular" : "le plus demandé"}</span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-light tracking-tight text-foreground">{reco.recoName}</span>
                <span className="font-mono text-[12px] tracking-[0.06em] text-mid-gray">{reco.recoPrice}</span>
              </div>
              <p className="mt-2 max-w-xl font-inter-tight text-sm leading-relaxed text-mid-gray">
                {reco.recoLine}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:shrink-0">
              <a
                href={reco.anchor}
                className="inline-flex h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85"
              >
                {isEn ? "See this package" : "Voir ce forfait"}
                <ArrowRight size={14} />
              </a>
              <Link
                href="/solutions-web/eligibilite"
                className="inline-flex h-11 items-center gap-2 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet"
              >
                {isEn ? "Full diagnostic" : "Diagnostic complet"}
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal className="mt-6">
          <Link
            href="/solutions-web/eligibilite"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
          >
            {isEn ? "Or run the full diagnostic — 2 min" : "Ou lancez le diagnostic complet — 2 min"}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      )}
    </BlueprintSection>
  );
}
