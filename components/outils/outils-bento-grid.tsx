"use client"

import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "@/i18n/navigation"
import {
  BarChart3,
  Search,
  BotMessageSquare,
  Trophy,
  TrendingUp,
  Zap,
  ArrowRight,
  FileText,
  Network,
  BadgePercent,
  Smartphone,
  Calculator,
  Scale,
} from "lucide-react"
import { useDocumentationMode } from "@/contexts/documentation-mode-context"
import type { ProfileId } from "@/lib/documentation-profiles"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

interface BentoCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  tag?: string
  hideOnMobile?: boolean
}

const buildCards = (isEn: boolean): Record<string, BentoCard> => ({
  "determiner-offre": {
    id: "determiner-offre",
    title: isEn ? "Project diagnostic" : "Diagnostic projet",
    description: isEn
      ? "In a few clicks, identify the right path: classic WordPress, Headless + Next.js, web app or mobile."
      : "Identifiez en quelques clics la voie adaptée : site WordPress classique, Headless + Next.js, web app ou mobile.",
    icon: BadgePercent,
    href: "/services/eligibilite",
  },
  "estimateur-budget": {
    id: "estimateur-budget",
    title: isEn ? "Budget & timeline estimator" : "Estimateur budget & délai",
    description: isEn
      ? "Get an indicative budget range and lead time for your web project."
      : "Obtenez une fourchette de budget et un délai indicatif pour votre projet web.",
    icon: Calculator,
    href: "/outils/estimateur-budget",
    tag: isEn ? "New" : "Nouveau",
  },
  "cahier-des-charges": {
    id: "cahier-des-charges",
    title: isEn ? "Specifications" : "Cahier des Charges",
    description: isEn
      ? "Generate a complete, structured specifications document for your web project."
      : "Générez un cahier des charges complet et structuré pour votre projet web.",
    icon: FileText,
    href: "/cahier-des-charges",
  },
  "simulateur-agefiph": {
    id: "simulateur-agefiph",
    title: isEn ? "AGEFIPH simulator (OETH)" : "Simulateur AGEFIPH (OETH)",
    description: isEn
      ? "Calculate the 30% AGEFIPH deduction applicable to your project. TIH provider."
      : "Calculez la déduction AGEFIPH de 30 % applicable à votre projet. Prestataire TIH.",
    icon: Scale,
    href: "/outils/simulateur-agefiph",
    tag: isEn ? "New" : "Nouveau",
  },
  "audit-ia": {
    id: "audit-ia",
    title: isEn ? "AI site audit" : "Audit IA de site",
    description: isEn
      ? "AI-powered audit: performance, SEO, accessibility, conversion. Personalized recommendations."
      : "Audit IA de votre site actuel : performance, SEO, accessibilité, conversion.",
    icon: BotMessageSquare,
    href: "/audit-site-ia",
  },
  "simulateur-roi": {
    id: "simulateur-roi",
    title: isEn ? "Web project ROI simulator" : "Simulateur de ROI projet web",
    description: isEn
      ? "Calculate revenue lost to a slow site and project earnings after modernization."
      : "Calculez le manque à gagner dû à un site lent et projetez les revenus après modernisation.",
    icon: BarChart3,
    href: "/outils/simulateur-roi",
  },
  "benchmarking": {
    id: "benchmarking",
    title: isEn ? "Competitive benchmarking" : "Benchmarking concurrentiel",
    description: isEn
      ? "Compare your site to sector leaders — Core Web Vitals, speed, performance."
      : "Comparez votre site aux leaders de votre secteur — Core Web Vitals, vitesse, performance.",
    icon: Trophy,
    href: "/outils/benchmarking",
  },
  "mind-map": {
    id: "mind-map",
    title: isEn ? "Headless Mind Map" : "Mind Map Headless",
    description: isEn
      ? "Explore Headless WordPress architecture interactively: benefits, challenges, roadmap."
      : "Explorez l'architecture WordPress Headless de façon interactive : avantages, défis et roadmap.",
    icon: Network,
    href: "/documentation/mind-map",
    hideOnMobile: true,
  },
  "audit-pwa": {
    id: "audit-pwa",
    title: isEn ? "PWA / mobile readiness audit" : "Audit PWA / mobile readiness",
    description: isEn
      ? "Is your site ready to become an installable mobile app? 9 criteria, a score and a verdict."
      : "Votre site est-il prêt à devenir une app mobile installable ? 9 critères, un score et un verdict.",
    icon: Smartphone,
    href: "/outils/audit-pwa",
    tag: isEn ? "New" : "Nouveau",
  },
  "tco-saas": {
    id: "tco-saas",
    title: isEn ? "TCO — SaaS vs custom" : "TCO — SaaS vs sur-mesure",
    description: isEn
      ? "Compare the 3-year cost of staying on SaaS vs migrating to a custom web app."
      : "Comparez le coût sur 3 ans entre rester sur votre SaaS et migrer vers une web app sur-mesure.",
    icon: Calculator,
    href: "/outils/tco-saas-vs-sur-mesure",
    tag: isEn ? "New" : "Nouveau",
  },
})

const CARD_ORDER: Record<ProfileId | "default", string[]> = {
  decideur: ["determiner-offre", "estimateur-budget", "simulateur-agefiph", "simulateur-roi", "tco-saas", "audit-ia", "cahier-des-charges", "benchmarking", "audit-pwa", "mind-map"],
  default: ["determiner-offre", "estimateur-budget", "simulateur-agefiph", "audit-ia", "simulateur-roi", "audit-pwa", "tco-saas", "benchmarking", "cahier-des-charges", "mind-map"],
  utilisateur: ["determiner-offre", "cahier-des-charges", "estimateur-budget", "audit-ia", "audit-pwa", "simulateur-agefiph", "tco-saas", "simulateur-roi", "benchmarking", "mind-map"],
  developpeur: ["audit-pwa", "mind-map", "audit-ia", "benchmarking", "estimateur-budget", "simulateur-roi", "tco-saas", "determiner-offre", "simulateur-agefiph", "cahier-des-charges"],
}

export default function OutilsBentoGrid() {
  const { profileId } = useDocumentationMode()
  const locale = useLocale() as Locale
  const isEn = locale === "en"

  const orderedCards = useMemo(() => {
    const cards = buildCards(isEn)
    const order = profileId ? CARD_ORDER[profileId] : CARD_ORDER.default
    return order.map((id) => cards[id]).filter(Boolean)
  }, [profileId, isEn])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={profileId || "default"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          border: "1px solid var(--rule)",
        }}
      >
        {orderedCards.map((card, index) => {
          const Icon = card.icon
          const col = index % 3
          const row = Math.floor(index / 3)
          const totalRows = Math.ceil(orderedCards.length / 3)
          return (
            <div
              key={card.id}
              style={{
                borderRight: col < 2 ? "1px solid var(--rule)" : "none",
                borderBottom: row < totalRows - 1 ? "1px solid var(--rule)" : "none",
                display: card.hideOnMobile ? undefined : "block",
              }}
              className={card.hideOnMobile ? "hidden md:block" : undefined}
            >
              <Link
                // @ts-expect-error – href comes from internal data
                href={card.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 200,
                  padding: "28px 32px",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--paper-2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <Icon size={18} style={{ color: "var(--muted-color)", flexShrink: 0, marginTop: 2 }} />
                  {card.tag && (
                    <span style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent-color)",
                      border: "1px solid var(--accent-color)",
                      padding: "2px 8px",
                    }}>
                      {card.tag}
                    </span>
                  )}
                </div>

                <div>
                  <h2 style={{
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}>
                    {card.title}
                  </h2>
                  <p style={{
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    color: "var(--ink-2)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}>
                    {card.description}
                  </p>
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--accent-color)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    {isEn ? "Open" : "Ouvrir"} →
                  </span>
                </div>
              </Link>
            </div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
