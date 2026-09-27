"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { getTiers } from "@/components/services/PricingCards";
import { OFFERS as CONSEIL_OFFERS, CREDIT_WINDOW_DAYS } from "@/lib/visio-conseil";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { CTO_PATH, CTO_PRICE } from "@/lib/cto-externalise";
import {
  MAINTENANCE_PATH,
  MAINTENANCE_PRICE,
  SUIVI_INCLUS_LABEL,
  SUIVI_INCLUS_MOIS,
} from "@/lib/maintenance-offer";

// ─────────────────────────────────────────────────────────────────────────────
// Home § 02 — les offres en trois moments : Décider · Refaire · Tenir
// (charte v1.4, ADR-012 ; maquette « Offres en trois moments »).
//
// Le visiteur ne choisit pas dans un catalogue : il se situe dans une colonne.
// Trois offres au plus par colonne, une seule mise en avant (Découpler).
// « Refaire » est au centre et plus large ; « Tenir » (les abonnements) vient
// en dernier et plus discret : offres de fin de parcours (charte §5).
//
// Chaque carte suit le même gabarit : situation, résultat, un prix « à partir
// de », une action. Aucun prix recopié : chacun est lu dans sa source unique
// (PricingCards.getTiers, lib/visio-conseil, lib/sentinelle-offer,
// lib/maintenance-offer, lib/cto-externalise). Les paliers vivent sur /tarifs
// et sur la page de chaque offre.
// ─────────────────────────────────────────────────────────────────────────────

type Href = Parameters<typeof Link>[0]["href"];

type Card = {
  kicker?: string;
  name: string;
  situation: string;
  result?: string;
  price: string;
  href: string;
  cta: string;
  recommended?: boolean;
  recommendedLabel?: string;
};

const HT = { fr: " HT", en: " excl. VAT" };

function useContent(locale: Locale) {
  const isEn = locale === "en";
  const tiers = getTiers(isEn);
  const tier = (slug: string) => tiers.find((t) => t.slug === slug)!;
  const visio = CONSEIL_OFFERS.find((o) => o.id === "choix-techno-ia")!.tiers[0];
  const audit = CONSEIL_OFFERS.find((o) => o.id === "architecture-projet-ia")!.tiers[0];
  const l = isEn ? "en" : "fr";

  const decider: Card[] = [
    {
      name: isEn ? "Redesign advisory call" : "Visio conseil refonte",
      situation: isEn
        ? "For you if you are torn between keeping, evolving or rebuilding."
        : "Pour vous si vous hésitez entre garder, faire évoluer ou refaire.",
      result: isEn
        ? "A written opinion within 48 h, after a one-hour call."
        : "Un avis écrit sous 48 h, après une heure en visio.",
      price: visio.price[l] + HT[l],
      href: "/conseil#choix-techno-ia",
      cta: isEn ? "Book" : "Réserver",
    },
    {
      name: "Audit + roadmap",
      situation: isEn
        ? "For you if you want a costed plan before committing a budget."
        : "Pour vous si vous voulez un plan chiffré avant d'engager un budget.",
      result: isEn
        ? "Report, recommendations and roadmap, delivered in your online workspace."
        : "Rapport, préconisations et roadmap, remis dans votre espace en ligne.",
      price: audit.price[l] + HT[l],
      href: "/conseil#architecture-projet-ia",
      cta: isEn ? "See the offer" : "Voir l'offre",
    },
  ];

  const refaire: Card[] = [
    {
      kicker: isEn ? "Consolidate" : "Consolider",
      name: isEn ? "Optimized WordPress redesign" : "Refonte WordPress optimisée",
      situation: isEn
        ? "For you if the problem is the theme and the plugin pile-up."
        : "Pour vous si le problème, c'est le thème et l'empilement d'extensions.",
      result: isEn
        ? "A cleaned-up, faster WordPress, fewer updates to watch."
        : "Un WordPress assaini et plus rapide, moins de mises à jour à surveiller.",
      price: tier("forfait-classique").price + HT[l],
      href: "/solutions-web#forfait-classique",
      cta: isEn ? "See the trajectory" : "Voir la trajectoire",
    },
    {
      kicker: isEn ? "Decouple" : "Découpler",
      name: isEn ? "Headless WordPress redesign" : "Refonte WordPress headless",
      situation: isEn
        ? "For you if the site is slow and your team already publishes in WordPress."
        : "Pour vous si le site est lent et que votre équipe publie déjà dans WordPress.",
      result: isEn
        ? "A fast, modern site. Your team publishes as before."
        : "Un site rapide et moderne. Votre équipe publie comme avant.",
      price: tier("forfait-headless").price + HT[l],
      href: "/solutions-web#forfait-headless",
      cta: isEn ? "See the trajectory" : "Voir la trajectoire",
      recommended: true,
      recommendedLabel: isEn ? "Recommended" : "Recommandée",
    },
    {
      kicker: isEn ? "Rebuild" : "Refonder",
      name: isEn ? "Redesign as a web app" : "Refonte vers une web app",
      situation: isEn
        ? "For you if the site has become a work tool."
        : "Pour vous si le site est devenu un outil de travail.",
      result: isEn
        ? "A web or mobile platform, connected to your tools."
        : "Une plateforme web ou mobile, reliée à vos outils.",
      price: tier("forfait-webapp").price + HT[l],
      href: "/solutions-web#forfait-webapp",
      cta: isEn ? "See the trajectory" : "Voir la trajectoire",
    },
  ];

  const tenir: Card[] = [
    {
      kicker: isEn ? "Prevent" : "Prévenir",
      name: "Sentinelle",
      situation: isEn
        ? "Two letters a month and an alert when a component of your site becomes a risk."
        : "Deux lettres par mois et une alerte quand un composant de votre site devient un risque.",
      price: isEn ? "€19/month" : OFFER_PRICE_LABEL,
      href: "/sentinelle",
      cta: isEn ? "See" : "Voir",
    },
    {
      kicker: isEn ? "Maintain" : "Entretenir",
      name: isEn ? "Care and maintenance" : "Suivi et maintenance",
      situation: isEn
        ? "Monitoring, backups, checked updates, a report every month."
        : "Surveillance, sauvegardes, mises à jour vérifiées, rapport chaque mois.",
      price: `${MAINTENANCE_PRICE[l].amount} ${MAINTENANCE_PRICE[l].period}`,
      href: MAINTENANCE_PATH,
      cta: isEn ? "See" : "Voir",
    },
    {
      kicker: isEn ? "Decide every month" : "Décider chaque mois",
      name: isEn ? "Outsourced technical expert" : "Expert technique externalisé",
      situation: isEn
        ? "Shared-time technical leadership, without hiring."
        : "Une direction technique à temps partagé, sans recruter.",
      price: `${CTO_PRICE[l].amount} ${CTO_PRICE[l].period}`,
      href: CTO_PATH,
      cta: isEn ? "See" : "Voir",
    },
  ];

  return { decider, refaire, tenir };
}

function OfferCard({ card, compact, surface }: { card: Card; compact?: boolean; surface: "obsidian" | "jet" }) {
  return (
    <Link
      href={card.href as Href}
      className={cn(
        "group relative flex flex-col gap-2.5 rounded-md border p-5 no-underline transition-colors lg:p-6",
        surface === "obsidian" ? "bg-obsidian" : "bg-jet",
        card.recommended
          ? "border-accent-secondary shadow-[0_0_0_4px_hsl(var(--accent-2)/0.12)]"
          : "border-charcoal hover:border-mid-gray",
      )}
    >
      {(card.kicker || card.recommended) && (
        <div className="flex items-center justify-between gap-3">
          {card.kicker && (
            <span
              className={cn(
                "font-mono text-2xs uppercase tracking-[0.14em]",
                card.recommended ? "text-accent-secondary" : "text-mid-gray",
              )}
            >
              {card.kicker}
            </span>
          )}
          {card.recommended && (
            <span className="rounded-full bg-accent-secondary px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
              {card.recommendedLabel}
            </span>
          )}
        </div>
      )}
      <h4 className={cn("font-medium tracking-tight text-foreground", compact ? "text-lg" : "text-xl")}>
        {card.name}
      </h4>
      <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{card.situation}</p>
      {card.result && (
        <p className="font-inter-tight text-base leading-relaxed text-foreground/85">{card.result}</p>
      )}
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className={cn("tracking-tight text-foreground", compact ? "text-base" : "text-lg")}>
          {card.price}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary transition-colors group-hover:text-foreground">
          {card.cta}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-charcoal px-3 py-1.5 font-inter-tight text-sm text-foreground/85">
      {children}
    </span>
  );
}

function MomentHead({ index, label, question, highlight }: { index: string; label: string; question: string; highlight?: boolean }) {
  return (
    <div className="mb-2 flex flex-col gap-3">
      <p className={cn("font-mono text-2xs uppercase tracking-[0.14em]", highlight ? "text-accent-secondary" : "text-mid-gray")}>
        {index} · {label}
      </p>
      <h3 className={cn("font-light leading-snug tracking-tight text-foreground", highlight ? "text-2xl" : "text-xl")}>
        « {question} »
      </h3>
    </div>
  );
}

export default function HomeOffres() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const l = isEn ? "en" : "fr";
  const { decider, refaire, tenir } = useContent(locale);

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        {/* En-tête */}
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "Decide · Rebuild · Keep it running" : "Décider · Refaire · Tenir"}
            title={
              isEn ? (
                <>Where does your site stand? <span className="text-accent-secondary">Three ways forward.</span></>
              ) : (
                <>Où en est votre site ? <span className="text-accent-secondary">Trois façons d'avancer.</span></>
              )
            }
            description={
              isEn
                ? "You do not have to pick from a catalogue. Find your column, or start by analyzing your site."
                : "Vous n'avez pas à choisir dans un catalogue. Situez-vous dans l'une des trois colonnes, ou commencez par analyser votre site."
            }
          />
        </Reveal>

        <Stagger className="grid lg:grid-cols-[1fr_1.45fr_1fr]">
          {/* 01 · Décider */}
          <StaggerItem className="flex flex-col gap-4 border-b border-dark-gray p-6 lg:border-b-0 lg:border-r lg:p-7">
            <MomentHead
              index="01"
              label={isEn ? "Decide" : "Décider"}
              question={isEn ? "I don't know what to do, or I have a quote to assess." : "Je ne sais pas quoi faire, ou j'ai un devis à juger."}
            />
            {decider.map((c) => (
              <OfferCard key={c.name} card={c} compact surface="jet" />
            ))}
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {isEn
                ? `The call is deducted from the quote if a project starts within ${CREDIT_WINDOW_DAYS} days.`
                : `La visio est déduite du devis si un projet démarre sous ${CREDIT_WINDOW_DAYS} jours.`}{" "}
              <Link href="/veille" className="text-accent-secondary no-underline hover:text-foreground">
                {isEn ? "Free newsletter and resources →" : "Lettre gratuite et ressources →"}
              </Link>
            </p>
          </StaggerItem>

          {/* 02 · Refaire — au centre, mis en avant */}
          <StaggerItem className="flex flex-col gap-4 border-b border-dark-gray bg-jet p-6 lg:border-b-0 lg:border-r lg:p-8">
            <MomentHead
              index="02"
              label={isEn ? "Rebuild" : "Refaire"}
              question={isEn ? "My site is aging, or I don't have one yet." : "Mon site vieillit, ou je n'en ai pas encore."}
              highlight
            />
            {refaire.map((c) => (
              <OfferCard key={c.name} card={c} surface="obsidian" />
            ))}
            <div className="flex flex-wrap gap-2">
              {SUIVI_INCLUS_MOIS > 0 && <Pill>{SUIVI_INCLUS_LABEL[l]}</Pill>}
              <Pill>{isEn ? "Price and timeline in writing before we start" : "Prix et délai écrits avant de commencer"}</Pill>
              <Pill>{isEn ? "6 to 10 weeks" : "6 à 10 semaines"}</Pill>
            </div>
            <p className="font-inter-tight text-base leading-relaxed text-mid-gray">
              {isEn
                ? "No site yet? Same packages, same timelines: we start from a blank page instead of the existing one."
                : "Pas encore de site ? Mêmes forfaits, mêmes délais : on part d'une page blanche au lieu de l'existant."}
            </p>
          </StaggerItem>

          {/* 03 · Tenir — les abonnements, en dernier */}
          <StaggerItem className="flex flex-col gap-3.5 p-6 lg:p-7">
            <MomentHead
              index="03"
              label={isEn ? "Keep it running" : "Tenir"}
              question={isEn ? "My site works, I want it to stay that way." : "Mon site tourne, je veux qu'il le reste."}
            />
            {tenir.map((c) => (
              <OfferCard key={c.name} card={c} compact surface="jet" />
            ))}
            <div className="flex flex-wrap gap-2">
              <Pill>{isEn ? "Sentinelle included from maintenance up" : "Sentinelle incluse dès la maintenance"}</Pill>
              <Link href="/espace-client" className="no-underline">
                <Pill>{isEn ? "Tracked in your online workspace →" : "Suivi dans votre espace en ligne →"}</Pill>
              </Link>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Bandeau : les deux températures */}
        <div className="flex flex-col gap-6 border-t border-dark-gray px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex max-w-xl flex-col gap-2">
            <p className="text-2xl font-light leading-snug tracking-tight text-foreground">
              {isEn ? (
                <>Not sure? <span className="text-accent-secondary">Start by analyzing your site.</span></>
              ) : (
                <>Vous hésitez ? <span className="text-accent-secondary">Commencez par analyser votre site.</span></>
              )}
            </p>
            <p className="font-inter-tight text-base leading-relaxed text-mid-gray">
              {isEn
                ? "One address, two minutes, no access required: you see what your site is made of and what is at risk."
                : "Une adresse, deux minutes, aucun accès demandé : vous voyez de quoi votre site est fait et ce qui est à risque."}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-3">
              {/* /scan vit hors de app/[locale]/ : balise <a>, pas le Link i18n. */}
              <a
                href="/scan"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent-secondary px-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
              >
                {isEn ? "Analyze your site in 2 minutes" : "Analysez votre site en 2 minutes"}
                <ArrowRight size={14} />
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-sm border border-dark-gray px-5 font-mono text-xs uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:bg-ebony"
              >
                {isEn ? "Let's talk about your project" : "Discutons de votre projet"}
              </Link>
            </div>
            <Link
              href="/tarifs"
              className="font-mono text-2xs tracking-[0.06em] text-mid-gray no-underline transition-colors hover:text-foreground"
            >
              {isEn ? "All prices, tiers included →" : "Tous les tarifs, paliers compris →"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
