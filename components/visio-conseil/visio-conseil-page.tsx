"use client";

// Page « Conseil » : page d'atterrissage du moment « Diagnostiquer ». Les DEUX
// offres du moment, dans l'ordre d'engagement croissant : l'échange de 15
// minutes, gratuit (ADR-023, il remplace la visio conseil refonte payante),
// puis l'audit + roadmap.
//
// Arbitrage du 2026-09-27 (charte v1.5, ADR-013, qui revient sur l'ADR-009) :
// l'expert technique externalisé ne vit plus que dans le moment « Gérer ». La
// page n'en porte plus de section d'offre : un bandeau de renvoi en fin de
// catalogue (CtoExternaliseBanner, ancre #cto-externalise conservée pour les
// anciens liens) mène à /cto-externalise, où l'offre se vend.
// Garde-fous inchangés (charte §5) : offre récurrente jamais en accroche,
// jamais en CTA froid ; le héros et son CTA principal restent sur la visio
// conseil.
//
// DS Blueprint, i18n inline, a11y.

import { useLocale } from "next-intl";
import {
  ArrowRight,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import {
  BlueprintSection,
  SectionHeading,
  Separator,
} from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY,
  HERO_BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { HeroNavCards, heroCardsEnfants } from "@/components/aspect/hero-nav-cards";
import { MEGA_SECTIONS } from "@/lib/mega-menu";
import { BesoinTitle } from "@/components/aspect/besoin-title";
import { ConstellationTechno } from "@/components/visuals/constellation-techno";
import { ConseilOfferSections } from "@/components/visio-conseil/conseil-offer-sections";
import { CtoExternaliseBanner } from "@/components/cto-externalise/cto-externalise-banner";
import { CONSEIL_TLDR, ECHANGE_URL, FAQ, OFFERS } from "@/lib/visio-conseil";
import { EnBref } from "@/components/en-bref";

export default function VisioConseilPage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  // Colonne droite du héros (page mère) : ses pages enfants, et elles seules,
  // les parcours du panneau « Diagnostiquer » du menu. Arbitrage n'a pas de
  // page : sa carte réserve l'échange (Calendly), comme la case du menu. Le CTA
  // principal réserve l'échange de 15 minutes, gratuit (ADR-023).
  // L'expert technique externalisé n'y figure plus (ADR-013) : il vit dans
  // « Gérer ».
  const heroCards = heroCardsEnfants(MEGA_SECTIONS.decider, isEn ? "en" : "fr");

  return (
    <main>
      {/* § 01 — Hero */}
      <PageHero
        index="№ 01"
        kicker={
          isEn
            ? "Diagnose · Redesign advice"
            : "Diagnostiquer · Conseil refonte"
        }
        backdrop={
          /* Constellation projet ↔ technos : la métaphore du conseil. */
          <div className="absolute -right-24 top-1/2 hidden w-[560px] -translate-y-1/2 opacity-20 lg:block">
            <ConstellationTechno showTags={false} />
          </div>
        }
        // h1 propre à la page (demande du 2026-09-27) ; le panneau
        // « Diagnostiquer » du mega menu garde la phrase du besoin.
        title={
          <BesoinTitle
            phrase={isEn ? "Audit to decide" : "Auditer pour décider"}
            accent={isEn ? "decide" : "décider"}
          />
        }
        description={
          isEn
            ? "Your site is aging and the direction is still open: keep, evolve or rebuild. A free 15-minute call, then an audit if the decision commits a budget, before any quote and any line of code."
            : "Votre site vieillit et la direction reste à trancher : garder, faire évoluer ou refaire. Un échange gratuit de 15 minutes, puis un audit si la décision engage un budget, avant tout devis et toute ligne de code."
        }
        actions={
          <>
            <a
              href={ECHANGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={"group " + HERO_BTN_PRIMARY}
            >
              {isEn ? "Book the 15-minute call" : "Réserver l'échange de 15 minutes"}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a href="#comment" className={HERO_BTN_SECONDARY}>
              {isEn ? "How it works" : "Comment ça marche"}
            </a>
          </>
        }
        note={
          isEn
            ? "15 minutes free · Displayed prices · Audit in writing"
            : "15 minutes gratuites · Prix affichés · Audit par écrit"
        }
        aside={
          <HeroNavCards
            label={isEn ? "The services" : "Les prestations"}
            cards={heroCards}
            recommendedLabel={isEn ? "Recommended" : "Recommandée"}
            fill
          />
        }
      />

      {/* § 02 : les deux offres du catalogue Conseil, puis leur détail. */}
      <BlueprintSection
        id="conseils"
        tone="obsidian"
        innerClassName="px-6 pt-16 pb-12 lg:px-8 lg:pt-20 lg:pb-14"
      >
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Two offers" : "Deux offres"}
          title={
            isEn ? (
              <>
                15 minutes to frame it,{" "}
                <span className="text-accent-secondary">the audit to set the course</span>
              </>
            ) : (
              <>
                15 min pour cadrer,{" "}
                <span className="text-accent-secondary">l'audit pour orienter</span>
              </>
            )
          }
          description={
            isEn
              ? "The cost of a wrong choice is counted in months. Fifteen free minutes to lay out the situation, then, if the decision commits a budget, a full audit with costed recommendations and a step-by-step roadmap."
              : "Le coût d'un mauvais choix se compte en mois. Quinze minutes gratuites pour poser la situation, puis, si la décision engage un budget, un audit complet avec préconisations chiffrées et roadmap par étapes."
          }
        />
        <p className="mt-6 max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray">
          {isEn
            ? "Prices excl. VAT. The 15-minute call is free and commits you to nothing. The audit + roadmap is a standalone deliverable: it serves you even if the work goes to someone else. The detail of each offer follows below."
            : "Prix HT. L'échange de 15 minutes est gratuit et ne vous engage à rien. L'audit + roadmap est un livrable à part entière : il vous sert même si la prestation est confiée à quelqu'un d'autre. Le détail de chaque offre suit juste en dessous."}
        </p>

      </BlueprintSection>

      {/* Suite de la § 02, sans séparateur : une section détaillée par offre
          (ancres du mega menu et du bandeau du héros : #choix-techno-ia,
          #architecture-projet-ia). */}
      <ConseilOfferSections />
      <Separator />

      {/* Renvoi vers le moment « Gérer » : l'expert technique externalisé n'est
          plus une offre de cette page (ADR-013). Le bandeau garde l'ancre
          #cto-externalise, encore en circulation. Fond jet : le dernier bloc
          d'offre est en obsidian, la § 03 aussi. */}
      <CtoExternaliseBanner id="cto-externalise" tone="jet" />
      <Separator />

      {/* § 02b — « L'essentiel » : TL;DR autoportant, citable tel quel par les
          moteurs de réponse, juste avant la FAQ (ADR-024). Le texte vient de
          CONSEIL_TLDR ; les fichiers llms lisent les mêmes sources (OFFERS, CTO_PRICE)
          et les prix y sont dérivés du catalogue, jamais recopiés. */}
      <EnBref
        className="conseil-tldr"
        label={isEn ? CONSEIL_TLDR.label.en : CONSEIL_TLDR.label.fr}
        lines={CONSEIL_TLDR.lines.map((line) => (isEn ? line.en : line.fr))}
      />
      <Separator />

      {/* § 03 : FAQ */}
      <BlueprintSection id="faq" tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker="FAQ"
          title={isEn ? "Frequently asked questions" : "Questions fréquentes"}
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {FAQ.map((item) => {
            const c = isEn ? item.en : item.fr;
            return (
              <div key={c.q} className="bg-jet p-6 lg:p-8">
                <h3 className="text-base font-medium text-foreground">{c.q}</h3>
                <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
                  {c.a}
                </p>
              </div>
            );
          })}
        </div>
      </BlueprintSection>
    </main>
  );
}
