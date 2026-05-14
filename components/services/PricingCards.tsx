"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Tier = {
  iconSrc: string;
  iconAlt: string;
  name: string;
  tech: string;
  price: string;
  priceTagline: string;
  forProjectLabel: string;
  forProject: string;
  stackLabel: string;
  stackHtml: React.ReactNode;
  includedLabel: string;
  included: { iconSrc: string; iconAlt: string; text: string }[];
  ctaLabel: string;
  badge?: string;
  oeth?: {
    title: string;
    text: string;
    cta: string;
  };
  ctaHref: string;
  ctaExternal?: boolean;
};

function getTiers(isEn: boolean): Tier[] {
  return [
    // Solidaire
    {
      iconSrc: "/icons/brand-reach-icon.svg",
      iconAlt: isEn ? "Solidarity tier" : "Solidaire",
      name: isEn ? "SOLIDARITY" : "SOLIDAIRE",
      tech: isEn ? "Classic or light headless WordPress" : "WordPress classique ou Headless léger",
      price: isEn ? "From €2,250" : "Depuis 2 250 €",
      priceTagline: isEn ? "Quick to ship, controlled cost" : "Mise en ligne rapide, coût maîtrisé",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "Brochure site, institutional site or quick redesign of an aging WordPress."
        : "Site vitrine, site institutionnel ou refonte rapide d'un WordPress vieillissant.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn ? (
        <>
          Monolithic WordPress with <strong className="text-lightyellow">a modern custom theme</strong>, optimized build, hardened security.
        </>
      ) : (
        <>
          WordPress monolithique avec <strong className="text-lightyellow">thème custom moderne</strong>, build optimisé, sécurité durcie.
        </>
      ),
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { iconSrc: "/icons/frontend-icon.svg", iconAlt: "Design", text: "Modern, responsive design" },
            { iconSrc: "/icons/code-icon.svg", iconAlt: "Pages", text: "5 key pages" },
            { iconSrc: "/icons/content-icon.svg", iconAlt: "Training", text: "WordPress admin training" },
            { iconSrc: "/icons/shield-icon.svg", iconAlt: "Security", text: "Hardened security" },
          ]
        : [
            { iconSrc: "/icons/frontend-icon.svg", iconAlt: "Design", text: "Design moderne et responsive" },
            { iconSrc: "/icons/code-icon.svg", iconAlt: "Pages", text: "5 pages clés" },
            { iconSrc: "/icons/content-icon.svg", iconAlt: "Formation", text: "Formation à l'admin WordPress" },
            { iconSrc: "/icons/shield-icon.svg", iconAlt: "Sécurité", text: "Sécurité durcie" },
          ],
      ctaLabel: isEn ? "Pick this stack" : "Choisir cette stack",
      ctaHref: "/contact",
    },
    // Équilibre
    {
      iconSrc: "/icons/scale-icon.svg",
      iconAlt: isEn ? "Balance tier" : "Équilibre",
      name: isEn ? "BALANCE" : "ÉQUILIBRE",
      tech: isEn ? "Headless WordPress + Next.js" : "WordPress headless + Next.js",
      price: isEn ? "From €4,000" : "Depuis 4 000 €",
      priceTagline: isEn ? "Front-end performance, optimized conversion" : "Performance front, conversion optimisée",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "A site with strong SEO stakes, editorial blog, brand or product where front-end performance is a conversion lever."
        : "Site à fort enjeu SEO, blog éditorial, marque ou produit dont la performance front est un levier de conversion.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn ? (
        <>
          Headless WordPress as backend + <strong className="text-lightyellow">Next.js</strong> as frontend (SSG, ISR, partial hydration).
        </>
      ) : (
        <>
          WordPress headless en backend + <strong className="text-lightyellow">Next.js</strong> en frontend (SSG, ISR, hydratation partielle).
        </>
      ),
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { iconSrc: "/icons/frontend-icon.svg", iconAlt: "Design", text: "Custom design" },
            { iconSrc: "/icons/seo-icon.svg", iconAlt: "SEO", text: "Advanced SEO strategy" },
            { iconSrc: "/icons/database-icon.svg", iconAlt: "Migration", text: "Data migration" },
            { iconSrc: "/icons/speed-icon.svg", iconAlt: "Support", text: "Strategic support" },
          ]
        : [
            { iconSrc: "/icons/frontend-icon.svg", iconAlt: "Design", text: "Design personnalisé" },
            { iconSrc: "/icons/seo-icon.svg", iconAlt: "SEO", text: "Stratégie SEO avancée" },
            { iconSrc: "/icons/database-icon.svg", iconAlt: "Migration", text: "Migration de données" },
            { iconSrc: "/icons/speed-icon.svg", iconAlt: "Accompagnement", text: "Accompagnement stratégique" },
          ],
      ctaLabel: isEn ? "Pick this stack" : "Choisir cette stack",
      badge: isEn ? "Most popular" : "Le plus demandé",
      ctaHref: "/contact",
    },
    // Soutien
    {
      iconSrc: "/icons/rocket-icon.svg",
      iconAlt: isEn ? "Support tier" : "Soutien",
      name: isEn ? "SUPPORT" : "SOUTIEN",
      tech: isEn ? "Complex / multisite Headless WordPress" : "WordPress Headless complexe / multisites",
      price: isEn ? "From €5,000" : "Depuis 5 000 €",
      priceTagline: isEn
        ? "Scalable architecture, ISR/SSR, multisite"
        : "Architecture évolutive, ISR/SSR, multisites",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "High-volume platform, multisite, third-party API integrations, business applications or client portals."
        : "Plateforme à forte volumétrie, multisites, intégrations API tierces, applications métier ou portails clients.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn ? (
        <>
          Headless WordPress + <strong className="text-lightblue">Next.js App Router</strong> (SSG, ISR, SSR), TypeScript, complete CI/CD.
        </>
      ) : (
        <>
          WordPress headless + <strong className="text-lightblue">Next.js App Router</strong> (SSG, ISR, SSR), TypeScript, CI/CD complet.
        </>
      ),
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { iconSrc: "/icons/frontend-icon.svg", iconAlt: "UI/UX", text: "Fully bespoke UI/UX" },
            { iconSrc: "/icons/speed-icon.svg", iconAlt: "Performance", text: "Critical performance (ISR/SSR)" },
            { iconSrc: "/icons/shield-icon.svg", iconAlt: "Security", text: "Security strengthened by decoupling" },
            { iconSrc: "/icons/settings-icon.svg", iconAlt: "Support", text: "12-month priority support" },
          ]
        : [
            { iconSrc: "/icons/frontend-icon.svg", iconAlt: "UI/UX", text: "UI/UX sur-mesure totale" },
            { iconSrc: "/icons/speed-icon.svg", iconAlt: "Performances", text: "Performances critiques (ISR/SSR)" },
            { iconSrc: "/icons/shield-icon.svg", iconAlt: "Sécurité", text: "Sécurité renforcée par découplage" },
            { iconSrc: "/icons/settings-icon.svg", iconAlt: "Support", text: "Support prioritaire 12 mois" },
          ],
      ctaLabel: isEn ? "Discuss my project" : "Discuter de mon projet",
      oeth: {
        title: isEn ? "OETH tax advantage" : "Avantage fiscal OETH",
        text: isEn
          ? "TIH provider: 30% of labor cost deductible from your AGEFIPH contribution."
          : "Prestataire TIH : 30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH.",
        cta: isEn ? "Simulate my savings" : "Simuler mon économie",
      },
      ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
      ctaExternal: true,
    },
  ];
}

export function PricingCards() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const tiers = getTiers(isEn);

  const tierStyles = [
    { card: "flex flex-col border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg duration-300", title: "text-coral", btn: "bg-coral text-darkblue" },
    { card: "flex flex-col border-2 border-lightyellow/30 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg duration-300 relative", title: "text-lightyellow", btn: "bg-lightyellow hover:bg-lightyellow/90 text-darkblue" },
    { card: "flex flex-col border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-lg duration-300", title: "text-extralightblue", btn: "bg-regularblue text-white" },
  ];

  return (
    <section className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => {
            const style = tierStyles[idx];
            return (
              <div key={tier.name} className={style.card}>
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-lightyellow text-darkblue text-sm font-googletitre font-semibold px-4 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Image src={tier.iconSrc} alt={tier.iconAlt} width={32} height={32} className="shrink-0" />
                    <h3 className={`text-2xl font-googletitre font-semibold ${style.title}`}>
                      {tier.name}
                    </h3>
                  </div>
                  <p className="text-base text-white/60 font-googletexte italic mb-4">{tier.tech}</p>
                  <p className="text-4xl font-googletitre font-medium text-white mb-1">
                    {tier.price}
                  </p>
                  <p className="text-sm text-white/40 font-googletexte">{tier.priceTagline}</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                      {tier.forProjectLabel}
                    </p>
                    <p className="text-white/80 font-googletexte leading-relaxed">{tier.forProject}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                      {tier.stackLabel}
                    </p>
                    <p className="text-white/80 font-googletexte leading-relaxed">{tier.stackHtml}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                      {tier.includedLabel}
                    </p>
                    <ul className="space-y-2">
                      {tier.included.map((item) => (
                        <li key={item.text} className="flex items-start gap-3">
                          <Image src={item.iconSrc} alt={item.iconAlt} width={16} height={16} className="mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.oeth && (
                    <div className="border border-lightblue/20 rounded-xl p-4 bg-lightblue/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Image src="/icons/analytics-icon.svg" alt="OETH" width={16} height={16} className="shrink-0" />
                        <span className="text-sm font-googletitre font-medium text-lightblue">{tier.oeth.title}</span>
                      </div>
                      <p className="text-white/70 font-googletexte text-sm leading-relaxed mb-2">
                        {tier.oeth.text}
                      </p>
                      <Link href="/avantage-oeth" className="inline-flex items-center gap-1 text-sm text-lightblue font-googletexte hover:underline">
                        {tier.oeth.cta}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {tier.ctaExternal ? (
                  <a href={tier.ctaHref} className="mt-8" target="_blank" rel="noopener noreferrer">
                    <Button className={`w-full h-12 font-bold font-googletitre text-base md:text-lg rounded-full ${style.btn} transition-all duration-300`}>
                      {tier.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Link
                    // @ts-expect-error – href comes from internal data
                    href={tier.ctaHref}
                    className="mt-8"
                  >
                    <Button className={`w-full h-12 font-bold font-googletitre text-base md:text-lg rounded-full ${style.btn} transition-all duration-300`}>
                      {tier.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
