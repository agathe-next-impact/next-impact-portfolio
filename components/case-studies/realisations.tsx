"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { FAMILLE_ORDER } from "@/lib/case-studies-data";
import type { CaseStudyCard, FamilleKey } from "@/lib/case-studies-data";
import { cn } from "@/lib/utils";

interface RealisationsProps {
  /** Cartes calculées côté serveur (getCaseStudyCards) — cas publiés uniquement. */
  cards: CaseStudyCard[];
  defaultTab?: FamilleKey;
}

export default function Realisations({ cards, defaultTab = "site-headless" }: RealisationsProps) {
  const [activeTab, setActiveTab] = useState<FamilleKey>(defaultTab);
  const t = useTranslations("realisations");
  const locale = useLocale();

  // Onglets et compteurs dérivés des données : une famille sans cas publié est masquée.
  const tabs = FAMILLE_ORDER.filter((famille) => cards.some((c) => c.famille === famille));

  return (
    <section id="realisations">
      {/* Sélecteur d'onglets — cellules bordées blueprint */}
      <div className="mb-12 flex border border-dark-gray">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          const projectCount = cards.filter((c) => c.famille === tab).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={isActive}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3.5 text-center font-mono text-[10px] uppercase leading-tight tracking-[0.08em] transition-colors",
                idx < tabs.length - 1 && "border-r border-dark-gray",
                isActive
                  ? "bg-vermilion text-white"
                  : "bg-jet text-mid-gray hover:bg-ebony hover:text-foreground",
              )}
            >
              <span className="text-inherit">{t(`tabs.${tab}`)}</span>
              <span className={cn("font-mono text-[9px] tracking-[0.05em] text-inherit", isActive ? "opacity-100" : "opacity-50")}>
                {projectCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille de réalisations — cellules jointives bordées */}
      {tabs.map((tab) =>
        activeTab === tab ? (
          <Stagger
            key={tab}
            stagger={0.04}
            className="grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3"
          >
            {cards
              .filter((card) => card.famille === tab)
              .map((card) => (
                <StaggerItem
                  key={card.slug}
                  className={cn(
                    "group relative flex flex-col border-b border-r border-dark-gray transition-colors duration-300",
                    "hover:border-mid-gray/40 hover:bg-jet/40",
                  )}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    {card.isDemo && (
                      <span className="absolute right-2 top-2 z-10 border border-dark-gray bg-obsidian/85 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-mid-gray backdrop-blur-sm">
                        {locale === "en" ? "Demo" : "Démo"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-dark-gray px-6 py-5">
                    <Link href={card.link} className="block no-underline">
                      <h3 className="text-lg font-light tracking-tight text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                        {card.description}
                      </p>
                    </Link>
                    {/* Résultat chiffré (1er highlight de l'étude de cas) — une carte
                        sans chiffre est une image, pas une preuve. */}
                    {card.highlight && (
                      <div className="mt-3.5 inline-flex w-fit items-baseline gap-2 border border-dark-gray bg-jet/50 px-2.5 py-1">
                        <span className="font-mono text-[13px] font-semibold tracking-tight text-accent-secondary tabular-nums">
                          {card.highlight.value}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-mid-gray">
                          {card.highlight.label}
                        </span>
                      </div>
                    )}
                    <div className="mt-auto pt-4">
                      <Link
                        href={card.link}
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary no-underline transition-colors hover:text-foreground"
                      >
                        {t("viewProject")}
                        <ArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
          </Stagger>
        ) : null
      )}
    </section>
  );
}
