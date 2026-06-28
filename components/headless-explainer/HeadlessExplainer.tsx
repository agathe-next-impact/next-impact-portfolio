"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import { SignalPaths } from "@/components/visuals/signal-paths"

type StackTab = {
  id: string
  label: string
  sublabel: string
  tech: string
  description: string
  strengths: string[]
  ideal: string[]
  limit: string
  priceFrom: string
}

function getStackTabs(isEn: boolean): StackTab[] {
  if (isEn) return [
    {
      id: "classic",
      label: "Classic",
      sublabel: "Custom WordPress theme",
      tech: "WordPress · PHP · ACF · Custom theme",
      description: "WordPress manages content and presentation in a single application. A fully custom theme replaces off-the-shelf templates — familiar admin, controlled cost, fast to launch.",
      strengths: [
        "Fast time to launch — 6 to 8 weeks",
        "100% familiar WordPress admin",
        "Lower initial investment",
        "Hardened security and optimized performance",
      ],
      ideal: ["Brochure and institutional sites", "Quick redesigns of aging sites", "Simple editorial blogs", "Budget-constrained projects"],
      limit: "Bound to WordPress's rendering engine — no React, limited interactivity",
      priceFrom: "From €2,250",
    },
    {
      id: "headless",
      label: "Headless",
      sublabel: "WordPress API + Next.js frontend",
      tech: "WordPress (REST / GraphQL) · Next.js · TypeScript · SSG / ISR",
      description: "WordPress serves as a content backend via API. Next.js builds the front end independently — blazing fast, React-powered, fully custom design. The two communicate without coupling.",
      strengths: [
        "Core Web Vitals score > 95 / 100",
        "SEO-critical: pre-rendered static HTML",
        "Security by decoupling — WP not publicly exposed",
        "Scalable architecture, CDN-ready",
      ],
      ideal: ["High-traffic editorial platforms", "Sites where performance is a conversion lever", "Ambitious redesigns with SEO stakes", "Brands or products requiring bespoke UI"],
      limit: "Higher initial cost — specialized skills required for ongoing maintenance",
      priceFrom: "From €4,000",
    },
    {
      id: "webapp",
      label: "Web App",
      sublabel: "Next.js + dedicated database",
      tech: "Next.js · TypeScript · PostgreSQL / Supabase · CI/CD",
      description: "A fully bespoke stack, free from CMS constraints. Purpose-built for your business logic: user accounts, real-time data, complex workflows, PWA installable on mobile.",
      strengths: [
        "Business logic without CMS limitations",
        "User accounts and authentication",
        "Real-time data and offline mode",
        "PWA — installable, home-screen ready",
      ],
      ideal: ["Marketplaces and B2B directories", "Business tools and internal platforms", "Simulators, calculators, configurators", "Mobile field applications"],
      limit: "Largest investment — scoping session required before quoting",
      priceFrom: "From €6,500",
    },
  ]
  return [
    {
      id: "classic",
      label: "Classique",
      sublabel: "Thème WordPress custom",
      tech: "WordPress · PHP · ACF · Thème custom",
      description: "WordPress gère le contenu et la présentation dans une seule application. Un thème entièrement custom remplace les templates génériques — admin familière, coût maîtrisé, mise en ligne rapide.",
      strengths: [
        "Mise en ligne rapide — 6 à 8 semaines",
        "Admin WordPress 100% familière",
        "Investissement initial réduit",
        "Sécurité durcie et performance optimisée",
      ],
      ideal: ["Sites vitrines et institutionnels", "Refontes rapides de sites vieillissants", "Blogs éditoriaux simples", "Projets à budget cadré"],
      limit: "Lié au moteur de rendu WordPress — pas de React, interactivité limitée",
      priceFrom: "Depuis 2 250 €",
    },
    {
      id: "headless",
      label: "Headless",
      sublabel: "API WordPress + frontend Next.js",
      tech: "WordPress (REST / GraphQL) · Next.js · TypeScript · SSG / ISR",
      description: "WordPress sert de backend de contenu via API. Next.js construit le front indépendamment — ultra rapide, propulsé par React, design entièrement custom. Les deux communiquent sans couplage.",
      strengths: [
        "Score Core Web Vitals > 95 / 100",
        "SEO critique : HTML statique pré-rendu",
        "Sécurité par découplage — WP non exposé publiquement",
        "Architecture évolutive, CDN-ready",
      ],
      ideal: ["Plateformes éditoriales à fort trafic", "Sites dont la performance est un levier de conversion", "Refontes ambitieuses à enjeux SEO", "Marques ou produits avec UI sur-mesure"],
      limit: "Coût initial plus élevé — compétences spécialisées requises pour la maintenance",
      priceFrom: "Depuis 4 000 €",
    },
    {
      id: "webapp",
      label: "Web App",
      sublabel: "Next.js + base de données dédiée",
      tech: "Next.js · TypeScript · PostgreSQL / Supabase · CI/CD",
      description: "Une stack entièrement sur-mesure, sans les contraintes d'un CMS. Pensée pour votre logique métier : comptes utilisateurs, données temps réel, workflows complexes, PWA installable sur mobile.",
      strengths: [
        "Logique métier sans les limites d'un CMS",
        "Comptes utilisateurs et authentification",
        "Données temps réel et mode hors-ligne",
        "PWA — installable, écran d'accueil",
      ],
      ideal: ["Marketplaces et annuaires B2B", "Outils métier et plateformes internes", "Simulateurs, calculateurs, configurateurs", "Applications terrain et mobiles"],
      limit: "Investissement le plus conséquent — cadrage requis avant devis",
      priceFrom: "Depuis 6 500 €",
    },
  ]
}

export default function HeadlessExplainer() {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const stacks = getStackTabs(isEn)
  const [activeId, setActiveId] = useState("headless")
  const current = stacks.find((s) => s.id === activeId) ?? stacks[1]

  return (
    <>
      {/* En-tête de section */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 06</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">{isEn ? "Stack comparison" : "Comparatif technique"}</span>
          </div>
          <h2 className="max-w-3xl text-3xl font-light tracking-tight text-foreground md:text-4xl">
            {isEn ? (
              <>Three stacks, <span className="text-accent-secondary">one right choice</span></>
            ) : (
              <>Plusieurs voies, <span className="text-accent-secondary">un bon choix</span></>
            )}
          </h2>
        </div>
      </Reveal>

      {/* Barre d'onglets — track bg-jet, onglet actif bg-obsidian + liseré accent */}
      <div role="tablist" aria-orientation="horizontal" className="flex bg-jet">
        {stacks.map((stack, i) => {
          const isActive = activeId === stack.id
          return (
            <button
              key={stack.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(stack.id)}
              className={cn(
                "relative px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.12em] transition-colors lg:px-8",
                i < stacks.length - 1 && "border-r border-dark-gray",
                isActive
                  ? "bg-obsidian text-foreground"
                  : "text-mid-gray hover:text-foreground",
              )}
            >
              {stack.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-[-1px] h-px bg-accent-secondary" />
              )}
            </button>
          )
        })}
      </div>

      {/* Panneau de l'onglet actif */}
      <div className="relative border-t border-dark-gray bg-obsidian">
        {/* Backdrop discret : flux Headless (WordPress → API → Next.js) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-[0.18]">
          <SignalPaths />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative grid md:grid-cols-2"
          >
            {/* Gauche : sous-titre + description + stack + points forts */}
            <div className="border-b border-dark-gray p-6 md:border-b-0 md:border-r lg:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                {current.sublabel}
              </p>
              <p className="mt-4 font-inter-tight text-base leading-relaxed text-mid-gray">
                {current.description}
              </p>

              <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                Stack
              </p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-foreground/80">
                {current.tech}
              </p>

              <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                {isEn ? "Key strengths" : "Points forts"}
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {current.strengths.map((s) => (
                  <li key={s} className="flex gap-2.5 font-inter-tight text-sm leading-snug text-foreground/80">
                    <ArrowRight size={12} className="mt-0.5 shrink-0 text-accent-secondary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Droite : idéal pour + à prévoir + prix + CTA */}
            <div className="flex flex-col p-6 lg:p-8">
              <div className="flex-1">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {isEn ? "Ideal for" : "Idéal pour"}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {current.ideal.map((item) => (
                    <li
                      key={item}
                      className="border-l border-dark-gray py-1 pl-3.5 font-inter-tight text-sm leading-snug text-foreground/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-dark-gray pt-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                    {isEn ? "To consider" : "À prévoir"}
                  </p>
                  <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {current.limit}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-dark-gray pt-7">
                <p className="text-3xl font-light leading-none tracking-tight text-foreground">
                  {current.priceFrom}
                </p>
                <Link
                  href="/contact"
                  className="group mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary transition-colors hover:text-foreground"
                >
                  {isEn ? "Discuss this stack" : "Discuter de cette stack"}
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
