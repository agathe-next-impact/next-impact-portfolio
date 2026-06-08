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
  ArrowRight,
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
        /* Bento bordé sans gouttière : rails haut + droite portés par le cadre,
           chaque cellule ajoute son filet gauche + bas → cadre complet et robuste
           à tous les breakpoints (1 / 2 / 3 colonnes). */
        className="grid grid-cols-1 border-r border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3"
      >
        {orderedCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className={
                card.hideOnMobile
                  ? "hidden border-b border-l border-dark-gray md:block"
                  : "border-b border-l border-dark-gray"
              }
            >
              <Link
                href={card.href as Parameters<typeof Link>[0]["href"]}
                className="group flex min-h-[200px] flex-col justify-between p-7 transition-colors hover:bg-jet lg:p-8"
              >
                <div className="mb-5 flex items-start justify-between">
                  <Icon
                    size={18}
                    className="mt-0.5 shrink-0 text-mid-gray transition-colors group-hover:text-accent-secondary"
                  />
                  {card.tag && (
                    <span className="border border-accent-secondary px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
                      {card.tag}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="mb-2 text-base font-light leading-snug tracking-tight text-foreground">
                    {card.title}
                  </h2>
                  <p className="mb-4 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
                    {isEn ? "Open" : "Ouvrir"}
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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
