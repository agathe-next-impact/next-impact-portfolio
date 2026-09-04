"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export type Tier = {
  slug: string;
  name: string;
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
  highlight?: boolean;
};

// Source unique des trois trajectoires : la section d'introduction (aperçu) et
// les sections détaillées par offre (OfferSections) en dérivent.
export function getTiers(isEn: boolean): Tier[] {
  return [
    {
      slug: "forfait-classique",
      name: isEn ? "Simple showcase site" : "Vitrine simple",
      tech: isEn
        ? "optimized WordPress redesign · bespoke theme"
        : "refonte WordPress optimisée · thème sur-mesure",
      price: isEn ? "From €2,250" : "À partir de 2 250 €",
      priceTagline: isEn ? "Quick to ship, controlled cost" : "Mise en ligne rapide, coût maîtrisé",
      forProjectLabel: isEn ? "When?" : "Pour quand ?",
      forProject: isEn
        ? "The problem is the theme and the plugin pile-up, not WordPress. Brochure or institutional site, redesign of an aging WordPress."
        : "Le problème, c'est le thème et l'empilement de plugins, pas WordPress. Site vitrine ou institutionnel, refonte d'un WordPress vieillissant.",
      solutionLabel: isEn ? "The solution" : "La solution",
      solution: isEn
        ? "I start from your existing WordPress, replace the theme and the plugin pile-up with a lightweight bespoke theme, and harden security. You keep your editing habits; the site becomes fast and clean again — without changing tools."
        : "Je repars de votre WordPress, je remplace le thème et l'empilement de plugins par un thème sur-mesure léger, et je durcis la sécurité. Vous gardez vos habitudes d'édition ; le site redevient rapide et net — sans changer d'outil.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Monolithic WordPress with <em className="text-foreground not-italic">a modern custom theme</em>, optimized build, hardened security.</>
        : <>WordPress monolithique avec <em className="text-foreground not-italic">thème custom moderne</em>, build optimisé, sécurité durcie.</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "Modern, responsive design" },
            { text: "5 key pages" },
            { text: "WordPress admin training" },
            { text: "Hardened security" },
          ]
        : [
            { text: "Design moderne et responsive" },
            { text: "5 pages clés" },
            { text: "Formation à l'admin WordPress" },
            { text: "Sécurité durcie" },
          ],
      ctaLabel: isEn ? "Pick this stack" : "Choisir cette stack",
      // Froid : on route vers le diagnostic de stack, pas le contact direct.
      ctaHref: "/solutions-web/eligibilite",
    },
    {
      slug: "forfait-headless",
      name: isEn ? "Complex site" : "Site complexe",
      tech: isEn
        ? "headless WordPress redesign · back office kept, modern front end"
        : "refonte WordPress headless · back-office conservé, front moderne",
      price: isEn ? "From €4,000" : "À partir de 4 000 €",
      priceTagline: isEn ? "Front-end performance, optimized conversion" : "Performance front, conversion optimisée",
      forProjectLabel: isEn ? "When?" : "Pour quand ?",
      forProject: isEn
        ? "The site is slow and the editorial team is settled in. Your editors keep publishing in WordPress; your visitors see a fast, modern site."
        : "Le site est lent, l'équipe éditoriale est installée. Vos rédacteurs continuent de publier dans WordPress ; vos visiteurs voient un site rapide et moderne.",
      solutionLabel: isEn ? "The solution" : "La solution",
      solution: isEn
        ? "I keep your WordPress back office for your editors and plug a Next.js front end on top of it. Publishing doesn't change, but the visible site becomes as fast as a modern app, with SEO reworked from the ground up."
        : "Je conserve votre back-office WordPress pour vos rédacteurs et je branche dessus un front Next.js. La publication ne change pas, mais le site affiché devient aussi rapide qu'une app moderne, avec un SEO repris de fond en comble.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Headless WordPress as backend + <em className="text-foreground not-italic">Next.js</em> as frontend (SSG, ISR, partial hydration).</>
        : <>WordPress headless en backend + <em className="text-foreground not-italic">Next.js</em> en frontend (SSG, ISR, hydratation partielle).</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "Custom design" },
            { text: "Advanced SEO strategy" },
            { text: "Data migration" },
            { text: "Strategic support" },
          ]
        : [
            { text: "Design personnalisé" },
            { text: "Stratégie SEO avancée" },
            { text: "Migration de données" },
            { text: "Accompagnement stratégique" },
          ],
      ctaLabel: isEn ? "Pick this stack" : "Choisir cette stack",
      // Préconisation > popularité : c'est un conseil, pas un effet de foule.
      badge: isEn ? "Recommended" : "Recommandée",
      highlight: true,
      ctaHref: "/solutions-web/eligibilite",
    },
    {
      slug: "forfait-webapp",
      name: isEn ? "Platform & app" : "Plateforme et app",
      tech: isEn
        ? "web app, platform or mobile application"
        : "web app, plateforme ou application mobile",
      price: isEn ? "From €6,500" : "À partir de 6 500 €",
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
        ? <>Headless WordPress + <em className="text-foreground not-italic">Next.js App Router</em> (SSG, ISR, SSR), TypeScript, complete CI/CD.</>
        : <>WordPress headless + <em className="text-foreground not-italic">Next.js App Router</em> (SSG, ISR, SSR), TypeScript, CI/CD complet.</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "Fully bespoke UI/UX" },
            { text: "Critical performance (ISR/SSR)" },
            { text: "Security strengthened by decoupling" },
            { text: "12-month priority support" },
          ]
        : [
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
          kicker={isEn ? "The three trajectories at a glance" : "Les trois trajectoires en un coup d'œil"}
          title={
            isEn ? (
              <>Build only when <span className="text-accent-secondary">it makes sense</span></>
            ) : (
              <>Construire <span className="text-accent-secondary">sur le besoin</span></>
            )
          }
          description={
            isEn
              ? "When each trajectory fits and what it includes. The full detail of each offer follows below."
              : "Pour quelle situation chaque trajectoire est faite, et ce qu'elle inclut. Le détail complet de chaque offre suit juste en dessous."
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
                <span className="mb-4 inline-flex w-fit items-center border border-accent-secondary/60 bg-accent-secondary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
                  {tier.badge}
                </span>
              )}

              {/* Nom + tech */}
              <div
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.14em]",
                  tier.highlight ? "text-accent-secondary" : "text-mid-gray",
                )}
              >
                {tier.name}
              </div>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                {tier.tech}
              </p>

              {/* Prix */}
              <div className="mt-6">
                <div className="text-xl font-light leading-none tracking-tight text-accent-secondary md:text-2xl">
                  {tier.price}
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.08em] text-mid-gray">
                  {tier.priceTagline}
                </div>
              </div>

              {/* Pour quand + Ce qui est inclus */}
              <div className="mt-6 flex flex-1 flex-col">
                {[
                  {
                    label: tier.forProjectLabel,
                    content: (
                      <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
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
                            className="flex items-start gap-2 font-inter-tight text-[13px] leading-relaxed text-mid-gray"
                          >
                            <span className="shrink-0 pt-px font-mono text-[11px] text-accent-secondary">→</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ].map(({ label, content }) => (
                  <div key={label} className="border-t border-dark-gray py-5">
                    <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                      {label}
                    </div>
                    {content}
                  </div>
                ))}
              </div>

              {/* Renvoi vers la section détaillée (ancre du mega menu) */}
              <a
                href={`#${tier.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
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
