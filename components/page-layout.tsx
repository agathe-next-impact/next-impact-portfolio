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
}

/**
 * PageLayout — en-tête de héros + enveloppe des pages secondaires (outils, audit,
 * cahier-des-charges, avantage-oeth, etc.). Réhabillé en bande « blueprint » :
 * kicker mono (`№` + libellé court) → titre Figtree `font-light` (apparition mot
 * à mot) → sous-titre `font-inter-tight text-mid-gray`. Les rails verticaux se
 * prolongent dans `children` via le `<Separator/>` qui suit le héros.
 *
 * API publique inchangée : `titre`, `sousTitre`, `children`, `secNo`.
 */
const PageLayout: React.FC<PageLayoutProps> = ({ titre, sousTitre, children, secNo = "№ 01" }) => (
  <div>
    <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-24">
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
    </BlueprintSection>
    <Separator />
    <div>
      {children}
    </div>
  </div>
);

export default PageLayout;
