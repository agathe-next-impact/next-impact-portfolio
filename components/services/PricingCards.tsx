"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import {
  TRAJECTOIRES,
  trajectoirePriceHT,
  variantePriceHT,
  type Lang,
  type TrajectoireSlug,
} from "@/lib/trajectoires";

export type Tier = {
  slug: string;
  name: string;
  /** Nom technique, lisible, affiché sous le nom de la prestation. */
  technique: string;
  /** Ce que c'est techniquement, en une phrase (lib/trajectoires.ts). */
  enClair: string;
  tech: string;
  price: string;
  priceTagline: string;
  forProjectLabel: string;
  forProject: string;
  solutionLabel: string;
  solution: string;
  stackLabel: string;
  stackHtml: React.ReactNode;
  includedLabel: string;
  included: { text: string }[];
  ctaLabel: string;
  badge?: string;
  ctaHref: string;
  ctaExternal?: boolean;
  /** Lien hors de app/[locale]/ (ex. /scan) : balise <a>, même onglet. */
  ctaPlain?: boolean;
  highlight?: boolean;
  /** Variantes à égalité (la Refonte : sur mesure ou headless, ADR-031). */
  variantes?: TierVariante[];
};

export type TierVariante = {
  slug: string;
  technique: string;
  enClair: string;
  quand: string;
  price: string;
};

/** Les variantes d'une prestation, lues dans lib/trajectoires.ts. */
function variantesDe(slug: TrajectoireSlug, l: Lang): TierVariante[] {
  return (TRAJECTOIRES[slug].variantes ?? []).map((v) => ({
    slug: v.slug,
    technique: v.technique[l],
    enClair: v.enClair[l],
    quand: v.quand[l],
    price: variantePriceHT(v, l),
  }));
}

// Source unique des trois trajectoires : la section d'introduction (aperçu),
// les sections détaillées par offre (OfferSections), la home et /tarifs en
// dérivent.
//
// Un seul nom par prestation (charte v1.6, ADR-014) : Optimisation
// (ex-Consolider), Refonte (ex-Découpler, recommandée), Évolution
// (ex-Refonder). Le nom et le montant sont lus dans lib/trajectoires.ts ; le
// nom technique vit dans `tech`, en sous-titre. Les anciens libellés par type
// de site (« Vitrine simple », « Site complexe », « Plateforme et app »)
// détournaient la cible de la prestation recommandée.
//
// Bouton froid unique : l'analyse du site (/scan), libellé fixe. /scan vit
// hors de app/[locale]/, d'où `ctaPlain` (balise <a>, pas le Link i18n).
export function getTiers(isEn: boolean): Tier[] {
  const l = isEn ? "en" : "fr";
  return [
    {
      slug: "forfait-classique",
      name: TRAJECTOIRES["forfait-classique"].name[l],
      technique: TRAJECTOIRES["forfait-classique"].technique[l],
      enClair: TRAJECTOIRES["forfait-classique"].enClair[l],
      tech: isEn
        ? "optimized WordPress · your current site, brought up to standard"
        : "WordPress optimisé · votre site actuel, remis à niveau",
      price: trajectoirePriceHT("forfait-classique", l),
      priceTagline: isEn ? "No rebuild, same theme, controlled cost" : "Sans reconstruction, même thème, coût maîtrisé",
      forProjectLabel: isEn ? "When?" : "Pour quand ?",
      forProject: isEn
        ? "The site still does the job, but it has become slow, cluttered or fragile. The design suits you; you do not need a new site, you need a healthy one."
        : "Le site fait encore le travail, mais il est devenu lent, encombré ou fragile. Son design vous convient : il ne vous faut pas un nouveau site, il vous faut un site sain.",
      solutionLabel: isEn ? "The solution" : "La solution",
      solution: isEn
        ? "I keep your existing WordPress and its theme, and bring it up to standard: speed, clean-up of redundant plugins, security, hosting. Nothing is rebuilt; your editing habits stay the same, and the site becomes fast and sound again."
        : "Je garde votre WordPress existant et son thème, et je le remets à niveau : vitesse, ménage des extensions redondantes, sécurité, hébergement. Rien n'est reconstruit ; vos habitudes d'édition restent les mêmes, et le site redevient rapide et sain.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Your current WordPress, <em className="text-foreground not-italic">same theme</em>: performance tuning, caching, plugin audit, hardened security, hosting checked or moved.</>
        : <>Votre WordPress actuel, <em className="text-foreground not-italic">même thème</em> : réglages de performance, cache, audit des extensions, sécurité durcie, hébergement vérifié ou changé.</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "First technical and strategic watch analysis" },
            { text: "Speed measured before and after" },
            { text: "Redundant plugins removed" },
            { text: "Hardened security and updates" },
            { text: "Hosting checked or moved" },
          ]
        : [
            { text: "Première analyse de veille technique et stratégique" },
            { text: "Vitesse mesurée avant et après" },
            { text: "Extensions redondantes retirées" },
            { text: "Sécurité durcie, mises à jour faites" },
            { text: "Hébergement vérifié ou changé" },
          ],
      ctaLabel: isEn ? "Analyze your site" : "Analysez votre site",
      // Froid : l'analyse du site, pas le contact direct.
      ctaHref: "/scan",
      ctaPlain: true,
    },
    {
      slug: "forfait-headless",
      name: TRAJECTOIRES["forfait-headless"].name[l],
      technique: TRAJECTOIRES["forfait-headless"].technique[l],
      enClair: TRAJECTOIRES["forfait-headless"].enClair[l],
      tech: isEn
        ? "custom or headless WordPress · your team still publishes in WordPress"
        : "WordPress sur mesure ou headless · votre équipe publie toujours dans WordPress",
      price: trajectoirePriceHT("forfait-headless", l),
      priceTagline: isEn ? "Site rebuilt, two variants chosen by situation" : "Site reconstruit, deux variantes selon la situation",
      forProjectLabel: isEn ? "When?" : "Pour quand ?",
      forProject: isEn
        ? "The site is slow or dated, and your team publishes in WordPress. Tuning is no longer enough: the site has to be rebuilt, without changing the publishing tool."
        : "Le site est lent ou daté, et votre équipe publie dans WordPress. Les réglages ne suffisent plus : il faut reconstruire le site, sans changer d'outil de publication.",
      solutionLabel: isEn ? "The solution" : "La solution",
      solution: isEn
        ? "I rebuild the site and your editors keep publishing in WordPress. Two variants, on an equal footing: custom WordPress, a theme written for your site with only the plugins you need, one tool to maintain; or headless WordPress, WordPress as the back office and the visible site rebuilt with Next.js. We choose together, according to your situation."
        : "Je reconstruis le site et vos rédacteurs publient toujours dans WordPress. Deux variantes, à égalité : WordPress sur mesure, un thème écrit pour votre site avec le strict nécessaire en extensions, un seul outil à tenir ; ou WordPress headless, WordPress en back-office et le site affiché reconstruit avec Next.js. Le choix se fait ensemble, selon votre situation.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Custom WordPress: <em className="text-foreground not-italic">a theme written for the site</em>, minimal plugins. Or headless WordPress as backend + <em className="text-foreground not-italic">Next.js</em> as frontend (SSG, ISR).</>
        : <>WordPress sur mesure : <em className="text-foreground not-italic">thème écrit pour le site</em>, extensions réduites. Ou WordPress headless en backend + <em className="text-foreground not-italic">Next.js</em> en frontend (SSG, ISR).</>,
      variantes: variantesDe("forfait-headless", l),
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "First technical and strategic watch analysis" },
            { text: "Custom design" },
            { text: "Advanced SEO strategy" },
            { text: "Data migration" },
            { text: "Strategic support" },
          ]
        : [
            { text: "Première analyse de veille technique et stratégique" },
            { text: "Design personnalisé" },
            { text: "Stratégie SEO avancée" },
            { text: "Migration de données" },
            { text: "Accompagnement stratégique" },
          ],
      ctaLabel: isEn ? "Analyze your site" : "Analysez votre site",
      // Préconisation > popularité : c'est un conseil, pas un effet de foule.
      badge: isEn ? "Recommended" : "Recommandée",
      highlight: true,
      ctaHref: "/scan",
      ctaPlain: true,
    },
    {
      slug: "forfait-webapp",
      name: TRAJECTOIRES["forfait-webapp"].name[l],
      technique: TRAJECTOIRES["forfait-webapp"].technique[l],
      enClair: TRAJECTOIRES["forfait-webapp"].enClair[l],
      tech: isEn
        ? "web app, platform or mobile application"
        : "web app, plateforme ou application mobile",
      price: trajectoirePriceHT("forfait-webapp", l),
      priceTagline: isEn ? "Scalable architecture, ISR/SSR, multisite" : "Architecture évolutive, ISR/SSR, multisites",
      forProjectLabel: isEn ? "When?" : "Pour quand ?",
      forProject: isEn
        ? "The site has become a working tool: high-volume platform, multisite, third-party integrations, business applications or client portals."
        : "Le site est devenu un outil de travail : plateforme à forte volumétrie, multisites, intégrations tierces, applications métier ou portails clients.",
      solutionLabel: isEn ? "The solution" : "La solution",
      solution: isEn
        ? "I design a bespoke web application: scalable architecture, third-party integrations, multisite or client area. The site becomes a real working tool, built for high volume and critical performance."
        : "Je conçois une application web sur-mesure : architecture évolutive, intégrations tierces, multisite ou espace client. Le site devient un vrai outil de travail, pensé pour la volumétrie et la performance critique.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <><em className="text-foreground not-italic">Next.js App Router</em> (SSG, ISR, SSR), TypeScript, database and a bespoke admin built around your business: no WordPress. Complete CI/CD.</>
        : <><em className="text-foreground not-italic">Next.js App Router</em> (SSG, ISR, SSR), TypeScript, base de données et administration sur mesure, pensée pour votre métier : pas de WordPress. CI/CD complet.</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "First technical and strategic watch analysis" },
            { text: "Fully bespoke UI/UX" },
            { text: "Critical performance (ISR/SSR)" },
            { text: "Security strengthened by decoupling" },
            { text: "12-month priority support" },
          ]
        : [
            { text: "Première analyse de veille technique et stratégique" },
            { text: "UI/UX sur-mesure totale" },
            { text: "Performances critiques (ISR/SSR)" },
            { text: "Sécurité renforcée par découplage" },
            { text: "Support prioritaire 12 mois" },
          ],
      ctaLabel: isEn ? "Discuss my project" : "Discuter de mon projet",
      ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
      ctaExternal: true,
    },
  ];
}

// § Introduction — aperçu des trois trajectoires : prix, « Pour quand », « Ce
// qui est inclus ». Le détail de chaque offre (la solution + la stack) vit plus
// bas dans OfferSections, atteignable via « Voir le détail ».
export function PricingCards() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const tiers = getTiers(isEn);

  return (
    <BlueprintSection id="tarifs" tone="obsidian">
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "The three services at a glance" : "Les trois prestations en un coup d'œil"}
          title={
            isEn ? (
              <>Build only when <span className="text-accent-secondary">it makes sense</span></>
            ) : (
              <>Construire <span className="text-accent-secondary">sur le besoin</span></>
            )
          }
          description={
            isEn
              ? "When each service fits and what it includes. The full detail of each offer follows below."
              : "Pour quelle situation chaque prestation est faite, et ce qu'elle inclut. Le détail complet de chaque offre suit juste en dessous."
          }
        />
      </Reveal>

      {/* Bento — pleine largeur, sans gouttière */}
      <Stagger className="grid md:grid-cols-3">
        {tiers.map((tier) => (
          <StaggerItem key={tier.name} className="h-full">
            <div
              className={cn(
                "group relative flex h-full flex-col p-6 transition-colors hover:bg-jet lg:p-8",
                "border-b border-dark-gray md:border-b-0",
                "md:border-r md:border-dark-gray md:[&:nth-child(3n)]:border-r-0",
                tier.highlight && "bg-jet",
              )}
            >
              {tier.highlight && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary" aria-hidden />
              )}

              {tier.badge && (
                <span className="mb-4 inline-flex w-fit items-center border border-accent-secondary/60 bg-accent-secondary/10 px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-accent-secondary">
                  {tier.badge}
                </span>
              )}

              {/* Le nom de la prestation, très visible (ADR-015). */}
              <h3
                className={cn(
                  "text-3xl font-normal leading-none tracking-tight md:text-4xl",
                  tier.highlight ? "text-accent-secondary" : "text-foreground",
                )}
              >
                {tier.name}
              </h3>
              {/* Ce que c'est techniquement, tout de suite : le nom technique,
                  puis une phrase en clair. */}
              <p className="mt-3 text-lg font-regular leading-snug tracking-tight text-foreground">
                {tier.technique}
              </p>
              <p className="mt-1 font-inter-tight text-base leading-relaxed text-foreground/85">
                {tier.enClair}
              </p>

              {/* Prix */}
              <div className="mt-6">
                <div className="text-xl font-light leading-none tracking-tight text-accent-secondary md:text-2xl">
                  {tier.price}
                </div>
                <div className="mt-2 font-mono text-2xs tracking-[0.08em] text-mid-gray">
                  {tier.priceTagline}
                </div>
              </div>

              {/* Variantes à égalité (Refonte) : même poids visuel, pas d'ordre de préférence. */}
              {tier.variantes && tier.variantes.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1.5">
                  {tier.variantes.map((v) => (
                    <li key={v.slug} className="flex flex-wrap items-baseline justify-between gap-x-3 font-inter-tight text-base text-foreground/85">
                      <span>{v.technique}</span>
                      <span className="font-mono text-2xs tracking-[0.08em] text-mid-gray">{v.price}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Pour quand + Ce qui est inclus */}
              <div className="mt-6 flex flex-1 flex-col">
                {[
                  {
                    label: tier.forProjectLabel,
                    content: (
                      <p className="font-inter-tight text-base leading-relaxed text-mid-gray">
                        {tier.forProject}
                      </p>
                    ),
                  },
                  {
                    label: tier.includedLabel,
                    content: (
                      <ul className="flex flex-col gap-1.5">
                        {tier.included.map((item) => (
                          <li
                            key={item.text}
                            className="flex items-start gap-2 font-inter-tight text-base leading-relaxed text-mid-gray"
                          >
                            <span className="shrink-0 pt-px font-mono text-2xs text-accent-secondary">→</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ].map(({ label, content }) => (
                  <div key={label} className="border-t border-dark-gray py-5">
                    <div className="mb-2.5 font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray">
                      {label}
                    </div>
                    {content}
                  </div>
                ))}
              </div>

              {/* Renvoi vers la section détaillée (ancre du mega menu) */}
              <a
                href={`#${tier.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
              >
                {isEn ? "See the detail" : "Voir le détail"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </BlueprintSection>
  );
}
