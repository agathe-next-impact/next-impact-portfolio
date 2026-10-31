"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { FAMILLE_ORDER } from "@/lib/case-studies-data";
import type { CaseStudyCard, FamilleKey } from "@/lib/case-studies-data";
import { cn } from "@/lib/utils";

/** « tous » = vue par défaut : tous les cas publiés, toutes familles confondues. */
export type RealisationsTab = FamilleKey | "tous";

interface RealisationsProps {
  /** Cartes calculées côté serveur (getCaseStudyCards) — cas publiés uniquement. */
  cards: CaseStudyCard[];
  defaultTab?: RealisationsTab;
}

/** Cas retirés de la liste (demande d'Agathe, 2026-10-27) ; leurs fiches restent en ligne. */
const MASQUES = ["comme-des-fous", "comme-des-fous-jeux"];
/** Cas remontés en tête de chaque vue, dans cet ordre. */
const EN_TETE = ["signaux-faibles", "sowee", "proditec"];
/** Cartes en pleine largeur de grille (image à gauche, texte à droite en desktop). */
const PLEINE_LARGEUR = ["signaux-faibles"];
/** Cas descendus de quelques rangs dans la liste complète. */
const DESCENDUS: Record<string, number> = { "hermitage-sejours": 3 };

const rang = (slug: string) => {
  const i = EN_TETE.indexOf(slug);
  return i === -1 ? EN_TETE.length : i;
};

export default function Realisations({ cards: toutes, defaultTab = "tous" }: RealisationsProps) {
  // Tri stable : seuls les cas en tête bougent, le reste garde son ordre.
  const cards = toutes
    .filter((c) => !MASQUES.includes(c.slug))
    .sort((a, b) => rang(a.slug) - rang(b.slug));
  for (const [slug, crans] of Object.entries(DESCENDUS)) {
    const i = cards.findIndex((c) => c.slug === slug);
    if (i === -1) continue;
    const [carte] = cards.splice(i, 1);
    cards.splice(Math.min(i + crans, cards.length), 0, carte);
  }
  const t = useTranslations("realisations");
  const locale = useLocale();

  // Onglets dérivés des données : une famille sans cas publié est masquée.
  const tabs: RealisationsTab[] = [
    "tous",
    ...FAMILLE_ORDER.filter((famille) => cards.some((c) => c.famille === famille)),
  ];
  const [activeTab, setActiveTab] = useState<RealisationsTab>(
    tabs.includes(defaultTab) ? defaultTab : tabs[0],
  );

  const cardsFor = (tab: RealisationsTab): CaseStudyCard[] =>
    tab === "tous" ? cards : cards.filter((c) => c.famille === tab);

  // Mobile : les onglets sur deux lignes (la première en compte la moitié).
  const premiereLigne = Math.floor(tabs.length / 2);

  return (
    <section id="realisations">
      {/* Sélecteur d'onglets — cellules bordées blueprint, collé au filet de
          section (haut) et à la grille (bas) : bordures latérales seulement. */}
      <div className="flex flex-wrap border-x border-dark-gray md:flex-nowrap">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          const ligne1 = idx < premiereLigne;
          const finDeLigne = idx === premiereLigne - 1 || idx === tabs.length - 1;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={isActive}
              style={{ "--b": `${100 / (ligne1 ? premiereLigne : tabs.length - premiereLigne)}%` } as CSSProperties}
              className={cn(
                "flex min-w-0 grow flex-col items-center px-2 py-3.5 text-center font-mono text-2xs uppercase leading-tight tracking-[0.08em] transition-colors basis-[var(--b)] md:basis-0",
                ligne1 && "border-b border-dark-gray md:border-b-0",
                !finDeLigne && "border-r border-dark-gray",
                finDeLigne && idx < tabs.length - 1 && "md:border-r md:border-dark-gray",
                isActive
                  ? "bg-accent-secondary text-obsidian"
                  : "bg-jet text-mid-gray hover:bg-ebony hover:text-foreground",
              )}
            >
              <span className="text-inherit">{t(`tabs.${tab}`)}</span>
            </button>
          );
        })}
      </div>

      {/* Grille de réalisations — cellules jointives bordées.
          Toutes les familles sont rendues côté serveur (les 24 cartes publiées
          sont dans le HTML initial, SEO) ; le filtre n'est qu'un masquage CSS. */}
      {tabs.filter((tab) => tab === "tous" || activeTab === tab).map((tab) => (
          <Stagger
            key={tab}
            stagger={0.04}
            className={cn(
              "grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3",
              activeTab !== tab && "hidden",
            )}
          >
            {cardsFor(tab)
              .map((card) => {
                const large = PLEINE_LARGEUR.includes(card.slug);
                return (
                <StaggerItem
                  key={card.slug}
                  className={cn(
                    "group relative flex flex-col border-b border-r border-dark-gray transition-colors duration-300",
                    large && "sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-2",
                    "hover:border-mid-gray/40 hover:bg-jet/40",
                  )}
                >
                  {/* Image cliquable : doublon souris du lien titre, donc hors
                      tabulation et masquée aux lecteurs d'écran. */}
                  <Link
                    href={card.link}
                    tabIndex={-1}
                    aria-hidden="true"
                    className={cn("relative block aspect-[16/9] overflow-hidden", large && "lg:aspect-auto lg:min-h-[320px]")}
                  >
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    />
                    {card.isDemo && (
                      <span className="absolute right-2 top-2 z-10 border border-dark-gray bg-obsidian/85 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray backdrop-blur-sm">
                        {locale === "en" ? "Demo" : "Démo"}
                      </span>
                    )}
                  </Link>
                  <div className={cn("flex flex-1 flex-col border-t border-dark-gray px-6 py-5", large && "lg:justify-center lg:border-l lg:border-t-0 lg:px-10 lg:py-8")}>
                    <Link href={card.link} className="block no-underline">
                      <h3 className={cn("font-light tracking-tight text-foreground", large ? "text-lg lg:text-2xl" : "text-lg")}>
                        {card.title}
                      </h3>
                      <p className="mt-1.5 font-inter-tight text-base leading-relaxed text-mid-gray">
                        {card.description}
                      </p>
                    </Link>
                    {/* Résultat chiffré (1er highlight de l'étude de cas) — une carte
                        sans chiffre est une image, pas une preuve. */}
                    {card.highlight && (
                      <div className="mt-3.5 flex w-fit flex-col gap-0.5 border border-dark-gray bg-jet/50 px-2.5 py-1 sm:inline-flex sm:flex-row sm:items-baseline sm:gap-2">
                        <span className="font-mono text-sm font-semibold tracking-tight text-accent-secondary tabular-nums">
                          {card.highlight.value}
                        </span>
                        <span className="font-mono text-2xs uppercase tracking-[0.08em] text-mid-gray">
                          {card.highlight.label}
                        </span>
                      </div>
                    )}
                    <div className="mt-auto pt-4">
                      <Link
                        href={card.link}
                        className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline transition-colors hover:text-foreground"
                      >
                        {t("viewProject")}
                        <ArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
                );
              })}
          </Stagger>
      ))}
    </section>
  );
}
