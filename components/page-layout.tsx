"use client";

import React from "react";

import { Separator } from "@/components/aspect/section";
import { PageHero } from "@/components/aspect/page-hero";
import { Reveal } from "@/components/ui/reveal";

interface PageLayoutProps {
  titre: string
  sousTitre?: string
  children?: React.ReactNode
  secNo?: string
  /** Fil d'Ariane rendu en tête de héros, au-dessus du kicker. */
  breadcrumb?: React.ReactNode
  /** Contenu rendu DANS le héros, sous le sous-titre (ex. champ de recherche). */
  headerSlot?: React.ReactNode
  /** Décor de fond du héros (transmis à BlueprintSection). */
  backdrop?: React.ReactNode
  /** Conservé pour compatibilité d'API — le héros harmonisé a toujours ses équerres. */
  ticks?: boolean
}

/**
 * PageLayout — en-tête de héros + enveloppe des pages secondaires (outils, audit,
 * cahier-des-charges, etc.). Le héros est délégué à `PageHero`, harmonisé sur
 * celui de /veille (équerres, kicker `№`, H1 `font-light`, description). Les
 * rails verticaux se prolongent dans `children` via le `<Separator/>` qui suit.
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
  breadcrumb,
  headerSlot,
  backdrop,
}) => (
  <div>
    <PageHero
      index={secNo}
      title={titre}
      description={sousTitre}
      breadcrumb={breadcrumb}
      backdrop={backdrop}
    >
      {headerSlot && (
        <Reveal delay={0.08} className="mt-10">
          {headerSlot}
        </Reveal>
      )}
    </PageHero>
    <Separator />
    <div>
      {children}
    </div>
  </div>
);

export default PageLayout;
