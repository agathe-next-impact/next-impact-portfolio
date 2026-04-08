"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDocumentationMode } from "@/contexts/documentation-mode-context"
import type { ProfileId } from "@/lib/documentation-profiles"

interface BentoCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  gradient: string
  textColor: string
  accentColor: string
  tag?: string
  hideOnMobile?: boolean
}

const CARDS: Record<string, BentoCard> = {
  "simulateur-roi": {
    id: "simulateur-roi",
    title: "Simulateur de ROI",
    description:
      "Calculez le manque à gagner dû à un site lent et projetez les revenus supplémentaires après migration Headless. Un outil concret pour chiffrer le coût de l'inaction.",
    icon: BarChart3,
    href: "/outils/simulateur-roi",
    gradient: "bg-gradient-to-br from-green-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-green-400",
    tag: "Nouveau",
  },
  "benchmarking": {
    id: "benchmarking",
    title: "Benchmarking Concurrentiel",
    description:
      "Comparez votre site aux leaders de votre secteur — Core Web Vitals, vitesse, performance.",
    icon: Trophy,
    href: "/outils/benchmarking",
    gradient: "bg-gradient-to-br from-coral/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-coral",
    tag: "Nouveau",
  },
  "audit-ia": {
    id: "audit-ia",
    title: "Audit IA Headless",
    description:
      "Diagnostic WordPress propulsé par l'IA avec recommandations de migration personnalisées.",
    icon: BotMessageSquare,
    href: "/audit-site-ia",
    gradient: "bg-gradient-to-br from-orange/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-orange",
  },
  "cahier-des-charges": {
    id: "cahier-des-charges",
    title: "Cahier des Charges",
    description:
      "Générez un cahier des charges complet et structuré pour votre projet web en répondant à quelques questions.",
    icon: FileText,
    href: "/cahier-des-charges",
    gradient: "bg-gradient-to-br from-indigo-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-indigo-400",
  },
  "mind-map": {
    id: "mind-map",
    title: "Mind Map Headless",
    description:
      "Explorez l'architecture WordPress Headless de façon interactive : avantages, défis et roadmap de migration.",
    icon: Network,
    href: "/documentation/mind-map",
    gradient: "bg-gradient-to-br from-purple-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-purple-400",
    hideOnMobile: true,
  },
  "determiner-offre": {
    id: "determiner-offre",
    title: "Déterminer l'Offre",
    description:
      "Identifiez l'offre solidaire, équilibre ou soutien la plus adaptée à votre structure en quelques clics.",
    icon: BadgePercent,
    href: "/contact",
    gradient: "bg-gradient-to-br from-amber-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-amber-400",
  },
}

// Ordre des cartes par profil — le zigzag (2-1 / 1-2 / 2-1) est géré par la position
const CARD_ORDER: Record<ProfileId | "default", string[]> = {
  // Décideur = défaut : ROI & business en priorité
  decideur: [
    "simulateur-roi",    // row 1 — 2 cols
    "benchmarking",      // row 1 — 1 col
    "determiner-offre",  // row 2 — 1 col
    "cahier-des-charges",// row 2 — 2 cols
    "audit-ia",          // row 3 — 2 cols
    "mind-map",          // row 3 — 1 col
  ],
  default: [
    "simulateur-roi",
    "benchmarking",
    "determiner-offre",
    "cahier-des-charges",
    "audit-ia",
    "mind-map",
  ],
  // Utilisateur : outils pratiques et cadrage en priorité
  utilisateur: [
    "cahier-des-charges",// row 1 — 2 cols
    "determiner-offre",  // row 1 — 1 col
    "audit-ia",          // row 2 — 1 col
    "mind-map",          // row 2 — 2 cols
    "simulateur-roi",    // row 3 — 2 cols
    "benchmarking",      // row 3 — 1 col
  ],
  // Développeur : architecture et technique en priorité
  developpeur: [
    "mind-map",          // row 1 — 2 cols
    "audit-ia",          // row 1 — 1 col
    "benchmarking",      // row 2 — 1 col
    "simulateur-roi",    // row 2 — 2 cols
    "cahier-des-charges",// row 3 — 2 cols
    "determiner-offre",  // row 3 — 1 col
  ],
}

// colSpan par position pour le pattern zigzag : 2-1 / 1-2 / 2-1
const COL_SPAN_BY_POSITION = [
  "md:col-span-2", // pos 0 — row 1 gauche
  "md:col-span-1", // pos 1 — row 1 droite
  "md:col-span-1", // pos 2 — row 2 gauche
  "md:col-span-2", // pos 3 — row 2 droite
  "md:col-span-2", // pos 4 — row 3 gauche
  "md:col-span-1", // pos 5 — row 3 droite
]

const stats = [
  {
    icon: Zap,
    value: "-3.4s",
    label: "Temps de chargement moyen gagné",
  },
  {
    icon: TrendingUp,
    value: "+23%",
    label: "Conversions récupérées en moyenne",
  },
]

export default function OutilsBentoGrid() {
  const { profileId } = useDocumentationMode()

  const orderedCards = useMemo(() => {
    const order = profileId ? CARD_ORDER[profileId] : CARD_ORDER.default
    return order.map((id, index) => ({
      ...CARDS[id],
      colSpan: COL_SPAN_BY_POSITION[index],
    }))
  }, [profileId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={profileId || "default"}
          className="contents"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
      {orderedCards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            whileHover={{ scale: 1.03 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-lightblue/10",
              "cursor-pointer transition-all duration-300 hover:border-lightblue/20",
              card.colSpan,
              card.gradient,
              card.hideOnMobile && "hidden md:block"
            )}
          >
            <Link href={card.href} className="absolute inset-0 z-10">
              <span className="sr-only">{card.title}</span>
            </Link>

            <div className="relative z-0 flex flex-col justify-between h-full min-h-[180px] p-6 md:p-8">
              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
                  )}
                >
                  <Icon className={cn("h-6 w-6", card.accentColor)} />
                </div>
                {card.tag && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                    {card.tag}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="mt-auto pt-6">
                <h2
                  className={cn(
                    "font-googletitre text-xl md:text-2xl font-bold mb-2",
                    card.textColor
                  )}
                >
                  {card.title}
                </h2>
                <p
                  className={cn(
                    "text-sm md:text-base font-googletexte leading-relaxed",
                    card.textColor,
                    "opacity-70"
                  )}
                >
                  {card.description}
                </p>

                {/* CTA arrow */}
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className={card.accentColor}>Ouvrir l&apos;outil</span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:translate-x-1",
                      card.accentColor
                    )}
                  />
                </div>
              </div>

              {/* Large card: stats strip */}
              {card.id === "simulateur-roi" && (
                <div className="hidden md:flex gap-6 mt-6 pt-5 border-t border-white/10">
                  {stats.map((stat) => {
                    const StatIcon = stat.icon
                    return (
                      <div key={stat.label} className="flex items-center gap-3">
                        <StatIcon className="w-5 h-5 text-green-400 shrink-0" />
                        <div>
                          <p className="text-xl font-bold text-white font-googletitre">
                            {stat.value}
                          </p>
                          <p className="text-xs text-white/50 font-googletexte">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
