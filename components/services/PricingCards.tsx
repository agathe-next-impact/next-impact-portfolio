"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Tier = {
  slug: string;
  name: string;
  tech: string;
  price: string;
  priceTagline: string;
  forProjectLabel: string;
  forProject: string;
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

function getTiers(isEn: boolean): Tier[] {
  return [
    {
      slug: "forfait-classique",
      name: isEn ? "OPTIMIZED WORDPRESS SITE" : "SITE WORDPRESS OPTIMISE",
      tech: isEn ? "classic WordPress, bespoke theme" : "WordPress classique, thème sur-mesure",
      price: isEn ? "From €2,250" : "Depuis 2 250 €",
      priceTagline: isEn ? "Quick to ship, controlled cost" : "Mise en ligne rapide, coût maîtrisé",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "Brochure site, institutional site or quick redesign of an aging WordPress."
        : "Site vitrine, site institutionnel ou refonte rapide d'un WordPress vieillissant.",
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
      name: isEn ? "HEADLESS WORDPRESS + NEXT.JS" : "WORDPRESS HEADLESS + NEXT.JS",
      tech: "WordPress Headless + Next.js",
      price: isEn ? "From €4,000" : "Depuis 4 000 €",
      priceTagline: isEn ? "Front-end performance, optimized conversion" : "Performance front, conversion optimisée",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "A site with strong SEO stakes, editorial blog, brand or product where front-end performance is a conversion lever."
        : "Site à fort enjeu SEO, blog éditorial, marque ou produit dont la performance front est un levier de conversion.",
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
      badge: isEn ? "Recommended for most redesigns" : "Recommandé pour la plupart des refontes",
      highlight: true,
      ctaHref: "/solutions-web/eligibilite",
    },
    {
      slug: "forfait-webapp",
      name: isEn ? "CUSTOM PLATFORM / BUSINESS TOOL" : "PLATEFORME METIER / OUTIL SUR MESURE",
      tech: isEn ? "dedicated architecture, multisite / high-volume" : "architecture dédiée, multisites / forte volumétrie",
      price: isEn ? "From €6,500" : "Depuis 6 500 €",
      priceTagline: isEn ? "Scalable architecture, ISR/SSR, multisite" : "Architecture évolutive, ISR/SSR, multisites",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "High-volume platform, multisite, third-party API integrations, business applications or client portals."
        : "Plateforme à forte volumétrie, multisites, intégrations API tierces, applications métier ou portails clients.",
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

export function PricingCards() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const tiers = getTiers(isEn);

  return (
    <BlueprintSection id="tarifs" tone="obsidian">
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 04"
          kicker={isEn ? "Implementation after decision" : "Mise en oeuvre après décision"}
          title={
            isEn ? (
              <>Build only when <span className="text-accent-secondary">it makes sense</span></>
            ) : (
              <>Construire seulement <span className="text-accent-secondary">quand c'est utile</span></>
            )
          }
        />
      </Reveal>

      {/* Bento — pleine largeur, sans gouttière */}
      <Stagger className="grid md:grid-cols-3">
        {tiers.map((tier) => (
          <StaggerItem key={tier.name} className="h-full">
            <div
              id={tier.slug}
              className={cn(
                "group relative flex h-full scroll-mt-24 flex-col p-6 transition-colors hover:bg-jet lg:p-8",
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
                <div className="text-3xl font-light leading-none tracking-tight text-foreground md:text-4xl">
                  {tier.price}
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.08em] text-mid-gray">
                  {tier.priceTagline}
                </div>
              </div>

              {/* Sections détaillées */}
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
                    label: tier.stackLabel,
                    content: (
                      <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                        {tier.stackHtml}
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

              {/* CTA */}
              {tier.ctaExternal ? (
                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
                    tier.highlight
                      ? "border border-charcoal bg-vermilion text-white hover:bg-vermilion-bright"
                      : "border border-dark-gray text-foreground hover:bg-obsidian",
                  )}
                >
                  {tier.ctaLabel}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link
                  href={tier.ctaHref as Parameters<typeof Link>[0]["href"]}
                  className={cn(
                    "mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
                    tier.highlight
                      ? "border border-charcoal bg-vermilion text-white hover:bg-vermilion-bright"
                      : "border border-dark-gray text-foreground hover:bg-obsidian",
                  )}
                >
                  {tier.ctaLabel}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </BlueprintSection>
  );
}
