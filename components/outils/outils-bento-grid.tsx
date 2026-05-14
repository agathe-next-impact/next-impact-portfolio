"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  gradient: string
  textColor: string
  accentColor: string
  tag?: string
  hideOnMobile?: boolean
}

const buildCards = (isEn: boolean): Record<string, BentoCard> => ({
  // ─── Transverse ─────────────────────────────────────────────────────────
  "determiner-offre": {
    id: "determiner-offre",
    title: isEn ? "Project diagnostic" : "Diagnostic projet",
    description: isEn
      ? "In a few clicks, identify the right path for your project: classic WordPress site, Headless WordPress + Next.js, custom web app or mobile application."
      : "Identifiez en quelques clics la voie adaptée à votre projet : site WordPress classique, site Headless WordPress + Next.js, web app sur-mesure ou application mobile.",
    icon: BadgePercent,
    href: "/services/eligibilite",
    gradient: "bg-gradient-to-br from-amber-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-amber-400",
  },
  "estimateur-budget": {
    id: "estimateur-budget",
    title: isEn ? "Budget & timeline estimator" : "Estimateur budget & délai",
    description: isEn
      ? "Get an indicative budget range and lead time for your web project. Works for sites, web apps and mobile PWAs."
      : "Obtenez une fourchette de budget et un délai indicatif pour votre projet web. Sites, web apps, PWA mobile : toutes les voies couvertes.",
    icon: Calculator,
    href: "/outils/estimateur-budget",
    gradient: "bg-gradient-to-br from-lightyellow/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-lightyellow",
    tag: isEn ? "New" : "Nouveau",
  },
  "cahier-des-charges": {
    id: "cahier-des-charges",
    title: isEn ? "Specifications" : "Cahier des Charges",
    description: isEn
      ? "Generate a complete, structured specifications document for your web project — site, web app or mobile app."
      : "Générez un cahier des charges complet et structuré pour votre projet web — site, web app ou app mobile.",
    icon: FileText,
    href: "/cahier-des-charges",
    gradient: "bg-gradient-to-br from-indigo-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-indigo-400",
  },
  "simulateur-agefiph": {
    id: "simulateur-agefiph",
    title: isEn ? "AGEFIPH simulator (OETH)" : "Simulateur AGEFIPH (OETH)",
    description: isEn
      ? "Calculate the 30% AGEFIPH deduction applicable to your project. TIH provider — applies to all paths (site, Headless, web app, mobile)."
      : "Calculez la déduction AGEFIPH de 30 % applicable à votre projet. Prestataire TIH — valable pour toutes les voies (site, Headless, web app, mobile).",
    icon: Scale,
    href: "/outils/simulateur-agefiph",
    gradient: "bg-gradient-to-br from-lightblue/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-extralightblue",
    tag: isEn ? "New" : "Nouveau",
  },

  // ─── Sites web ──────────────────────────────────────────────────────────
  "audit-ia": {
    id: "audit-ia",
    title: isEn ? "AI site audit" : "Audit IA de site",
    description: isEn
      ? "AI-powered audit of your current site: performance, SEO, accessibility, conversion. Personalized recommendations — Headless, web app or rebuild."
      : "Audit IA de votre site actuel : performance, SEO, accessibilité, conversion. Recommandations personnalisées — Headless, web app ou refonte.",
    icon: BotMessageSquare,
    href: "/audit-site-ia",
    gradient: "bg-gradient-to-br from-orange/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-orange",
  },
  "simulateur-roi": {
    id: "simulateur-roi",
    title: isEn ? "Web project ROI simulator" : "Simulateur de ROI projet web",
    description: isEn
      ? "Calculate the revenue lost to a slow site and project earnings after modernization: rebuild, Headless or custom web app."
      : "Calculez le manque à gagner dû à un site lent et projetez les revenus après modernisation : refonte, Headless ou web app sur-mesure.",
    icon: BarChart3,
    href: "/outils/simulateur-roi",
    gradient: "bg-gradient-to-br from-green-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-green-400",
  },
  "benchmarking": {
    id: "benchmarking",
    title: isEn ? "Competitive benchmarking" : "Benchmarking concurrentiel",
    description: isEn
      ? "Compare your site to the leaders in your sector — Core Web Vitals, speed, performance."
      : "Comparez votre site aux leaders de votre secteur — Core Web Vitals, vitesse, performance.",
    icon: Trophy,
    href: "/outils/benchmarking",
    gradient: "bg-gradient-to-br from-coral/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-coral",
  },
  "mind-map": {
    id: "mind-map",
    title: isEn ? "Headless Mind Map" : "Mind Map Headless",
    description: isEn
      ? "Explore the Headless WordPress architecture interactively: benefits, challenges and migration roadmap."
      : "Explorez l'architecture WordPress Headless de façon interactive : avantages, défis et roadmap de migration.",
    icon: Network,
    href: "/documentation/mind-map",
    gradient: "bg-gradient-to-br from-purple-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-purple-400",
    hideOnMobile: true,
  },

  // ─── Apps sur-mesure ────────────────────────────────────────────────────
  "audit-pwa": {
    id: "audit-pwa",
    title: isEn ? "PWA / mobile readiness audit" : "Audit PWA / mobile readiness",
    description: isEn
      ? "Is your site ready to become an installable mobile app? 9 criteria, a score and a verdict."
      : "Votre site est-il prêt à devenir une app mobile installable ? 9 critères, un score et un verdict.",
    icon: Smartphone,
    href: "/outils/audit-pwa",
    gradient: "bg-gradient-to-br from-coral/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-coral",
    tag: isEn ? "New" : "Nouveau",
  },
  "tco-saas": {
    id: "tco-saas",
    title: isEn ? "TCO — SaaS vs custom" : "TCO — SaaS vs sur-mesure",
    description: isEn
      ? "Compare the 3-year cost of staying on your SaaS vs migrating to a custom web app. Includes workaround time and user growth."
      : "Comparez le coût sur 3 ans entre rester sur votre SaaS et migrer vers une web app sur-mesure. Inclut temps perdu en contournements et croissance utilisateur.",
    icon: Calculator,
    href: "/outils/tco-saas-vs-sur-mesure",
    gradient: "bg-gradient-to-br from-blue-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-blue-400",
    tag: isEn ? "New" : "Nouveau",
  },
})

// Ordre des cartes par profil — pattern zigzag adapté à 11 cartes
const CARD_ORDER: Record<ProfileId | "default", string[]> = {
  // Décideur = défaut : diagnostic et chiffrage en priorité
  decideur: [
    "determiner-offre",
    "estimateur-budget",
    "simulateur-agefiph",
    "simulateur-roi",
    "tco-saas",
    "audit-ia",
    "cahier-des-charges",
    "benchmarking",
    "audit-pwa",
    "mind-map",
  ],
  default: [
    "determiner-offre",
    "estimateur-budget",
    "simulateur-agefiph",
    "audit-ia",
    "simulateur-roi",
    "audit-pwa",
    "tco-saas",
    "benchmarking",
    "cahier-des-charges",
    "mind-map",
  ],
  // Utilisateur : outils pratiques et cadrage en priorité
  utilisateur: [
    "determiner-offre",
    "cahier-des-charges",
    "estimateur-budget",
    "audit-ia",
    "audit-pwa",
    "simulateur-agefiph",
    "tco-saas",
    "simulateur-roi",
    "benchmarking",
    "mind-map",
  ],
  // Développeur : architecture et technique en priorité
  developpeur: [
    "audit-pwa",
    "mind-map",
    "audit-ia",
    "benchmarking",
    "estimateur-budget",
    "simulateur-roi",
    "tco-saas",
    "determiner-offre",
    "simulateur-agefiph",
    "cahier-des-charges",
  ],
}

// Pattern de colSpan zigzag (2-1 alternance) sur 10 cartes
const COL_SPAN_BY_POSITION = [
  "md:col-span-2", // 0
  "md:col-span-1", // 1
  "md:col-span-1", // 2
  "md:col-span-2", // 3
  "md:col-span-2", // 4
  "md:col-span-1", // 5
  "md:col-span-1", // 6
  "md:col-span-2", // 7
  "md:col-span-2", // 8
  "md:col-span-1", // 9
]

export default function OutilsBentoGrid() {
  const { profileId } = useDocumentationMode()
  const locale = useLocale() as Locale
  const isEn = locale === "en"

  const stats = isEn
    ? [
        { icon: Zap, value: "-3.4s", label: "Average load-time gained" },
        { icon: TrendingUp, value: "+23%", label: "Conversions recovered on average" },
      ]
    : [
        { icon: Zap, value: "-3.4s", label: "Temps de chargement moyen gagné" },
        { icon: TrendingUp, value: "+23%", label: "Conversions récupérées en moyenne" },
      ]

  const orderedCards = useMemo(() => {
    const cards = buildCards(isEn)
    const order = profileId ? CARD_ORDER[profileId] : CARD_ORDER.default
    return order.map((id, index) => ({
      ...cards[id],
      colSpan: COL_SPAN_BY_POSITION[index % COL_SPAN_BY_POSITION.length],
    }))
  }, [profileId, isEn])

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
              delay: index * 0.05,
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
            <Link
              // @ts-expect-error – href comes from internal data
              href={card.href}
              className="absolute inset-0 z-10"
            >
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
                  <span className={card.accentColor}>{isEn ? "Open the tool" : "Ouvrir l'outil"}</span>
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
