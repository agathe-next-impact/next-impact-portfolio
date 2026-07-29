"use client";

import React from "react";

import { BlueprintSection, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { WordAppear } from "@/components/visuals/word-appear";

interface PageLayoutProps {
  titre: string
  sousTitre?: string
  children?: React.ReactNode
  secNo?: string
  /** Contenu rendu DANS le héros, sous le sous-titre (ex. champ de recherche). */
  headerSlot?: React.ReactNode
  /** Décor de fond du héros (transmis à BlueprintSection). */
  backdrop?: React.ReactNode
  /** Équerres d'angle du héros. */
  ticks?: boolean
}

/**
 * PageLayout — en-tête de héros + enveloppe des pages secondaires (outils, audit,
 * cahier-des-charges, etc.). Réhabillé en bande « blueprint » :
 * kicker mono (`№` + libellé court) → titre Figtree `font-light` (apparition mot
 * à mot) → sous-titre `font-inter-tight text-mid-gray`. Les rails verticaux se
 * prolongent dans `children` via le `<Separator/>` qui suit le héros.
 *
 * `headerSlot` permet d'injecter un contenu interactif (champ, CTA) directement
 * dans le héros, sous le sous-titre. API existante (`titre`, `sousTitre`,
 * `children`, `secNo`) inchangée.
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  titre,
  sousTitre,
  children,
  secNo = "№ 01",
  headerSlot,
  backdrop,
  ticks,
}) => (
  <div>
    <BlueprintSection
      tone="obsidian"
      ticks={ticks}
      backdrop={backdrop}
      innerClassName="px-6 py-16 lg:px-8 lg:py-24"
    >
      <Reveal className="flex flex-col gap-5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>{secNo}</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
        </div>
        <h1 className="max-w-4xl text-3xl font-light leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          <WordAppear text={titre} />
        </h1>
        {sousTitre && (
          <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {sousTitre}
          </p>
        )}
      </Reveal>

      {headerSlot && (
        <Reveal delay={0.08} className="mt-10">
          {headerSlot}
        </Reveal>
      )}
    </BlueprintSection>
    <Separator />
    <div>
      {children}
    </div>
  </div>
);

export default PageLayout;
