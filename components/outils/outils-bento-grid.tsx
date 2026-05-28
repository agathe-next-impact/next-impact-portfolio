"use client"

import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "@/i18n/navigation"
import {
  BotMessageSquare,
  FileText,
  BadgePercent,
  Smartphone,
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
    title: isEn ? "Should I migrate to Headless WordPress?" : "Faut-il migrer en WordPress Headless ?",
    description: isEn
      ? "AI-powered audit: performance, SEO, accessibility, conversion. Personalized recommendations."
      : "Audit IA de votre site actuel : performance, SEO, accessibilité, conversion.",
    icon: BotMessageSquare,
    href: "/audit-site-ia",
  },
  "audit-pwa": {
    id: "audit-pwa",
    title: isEn ? "PWA opportunity diagnostic" : "Diagnostic d'opportunité PWA",
    description: isEn
      ? "Should your project become an installable mobile app? 9 questions and a decision signal."
      : "Votre projet gagnerait-il à devenir une app mobile installable ? 9 questions et un signal de décision.",
    icon: Smartphone,
    href: "/outils/audit-pwa",
    tag: isEn ? "New" : "Nouveau",
  },
})

const CARD_ORDER: Record<ProfileId | "default", string[]> = {
  decideur:    ["determiner-offre", "simulateur-agefiph", "audit-ia", "cahier-des-charges", "audit-pwa"],
  default:     ["determiner-offre", "simulateur-agefiph", "audit-ia", "audit-pwa", "cahier-des-charges"],
  utilisateur: ["determiner-offre", "cahier-des-charges", "audit-ia", "audit-pwa", "simulateur-agefiph"],
  developpeur: ["audit-pwa", "audit-ia", "determiner-offre", "simulateur-agefiph", "cahier-des-charges"],
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
