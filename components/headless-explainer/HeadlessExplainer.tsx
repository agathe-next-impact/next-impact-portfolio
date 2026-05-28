"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

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
      <div className="sec-head">
        <div className="sec-no">№ —</div>
        <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, margin: 0 }}>
          {isEn
            ? <>Three stacks, <em style={{ color: "var(--accent-color)" }}>one right choice</em></>
            : <>Trois stacks, <em style={{ color: "var(--accent-color)" }}>un bon choix</em></>}
        </h2>
        <div className="sec-meta">
          {isEn ? "Stack comparison · Fig. 01" : "Comparatif technique · Fig. 01"}
        </div>
      </div>

      {/* Tab bar */}
      <div
        role="tablist"
        style={{
          display: "flex",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {stacks.map((stack, i) => (
          <button
            key={stack.id}
            role="tab"
            aria-selected={activeId === stack.id}
            onClick={() => setActiveId(stack.id)}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "18px 32px",
              background: activeId === stack.id ? "var(--paper-2)" : "none",
              border: "none",
              borderRight: i < stacks.length - 1 ? "1px solid var(--rule)" : "none",
              borderBottom: activeId === stack.id ? "2px solid var(--ink)" : "2px solid transparent",
              color: activeId === stack.id ? "var(--ink)" : "var(--muted-color)",
              cursor: "pointer",
              transition: "color 0.15s, background 0.15s",
              marginBottom: "-1px",
              textAlign: "left",
            }}
          >
            {stack.label}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          {/* Left: description + tech + strengths */}
          <div style={{ padding: "40px 32px", borderRight: "1px solid var(--rule)" }}>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 16,
            }}>
              {current.sublabel}
            </div>
            <p style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-2)",
              lineHeight: 1.7,
              marginBottom: 32,
            }}>
              {current.description}
            </p>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 8,
            }}>
              Stack
            </div>
            <p style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-2)",
              marginBottom: 32,
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            }}>
              {current.tech}
            </p>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 14,
            }}>
              {isEn ? "Key strengths" : "Points forts"}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {current.strengths.map((s) => (
                <li key={s} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--accent-color)", fontFamily: "var(--mono)", fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: ideal + limit + price */}
          <div style={{ padding: "40px 32px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                marginBottom: 14,
              }}>
                {isEn ? "Ideal for" : "Idéal pour"}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                {current.ideal.map((item) => (
                  <li key={item} style={{
                    fontSize: 13,
                    color: "var(--ink-2)",
                    padding: "8px 14px",
                    borderLeft: "1px solid var(--rule)",
                    lineHeight: 1.5,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 24 }}>
                <div style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  marginBottom: 8,
                }}>
                  {isEn ? "To consider" : "À prévoir"}
                </div>
                <p style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                }}>
                  {current.limit}
                </p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 28, marginTop: 32 }}>
              <div style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(22px, 2.5vw, 32px)",
                color: "var(--ink)",
                lineHeight: 1,
                marginBottom: 16,
              }}>
                {current.priceFrom}
              </div>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-color)",
                  textDecoration: "none",
                }}
              >
                {isEn ? "Discuss this stack" : "Discuter de cette stack"}
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
