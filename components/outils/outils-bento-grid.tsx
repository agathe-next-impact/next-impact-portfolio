"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  BarChart3,
  Search,
  BotMessageSquare,
  Trophy,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BentoCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  colSpan: string
  rowSpan: string
  gradient: string
  textColor: string
  accentColor: string
  tag?: string
}

const cards: BentoCard[] = [
  {
    id: "simulateur-roi",
    title: "Simulateur de ROI",
    description:
      "Calculez le manque à gagner dû à un site lent et projetez les revenus supplémentaires après migration Headless. Un outil concret pour chiffrer le coût de l'inaction.",
    icon: BarChart3,
    href: "/outils/simulateur-roi",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    gradient: "bg-gradient-to-br from-green-500/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-green-400",
    tag: "Nouveau",
  },
  {
    id: "benchmarking",
    title: "Benchmarking Concurrentiel",
    description:
      "Comparez votre site aux leaders de votre secteur — Core Web Vitals, vitesse, performance.",
    icon: Trophy,
    href: "/outils/benchmarking",
    colSpan: "md:col-span-1",
    rowSpan: "",
    gradient: "bg-gradient-to-br from-coral/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-coral",
    tag: "Nouveau",
  },
  {
    id: "audit-ia",
    title: "Audit IA Headless",
    description:
      "Diagnostic WordPress propulsé par l'IA avec recommandations de migration personnalisées.",
    icon: BotMessageSquare,
    href: "/audit-site-ia",
    colSpan: "md:col-span-1",
    rowSpan: "",
    gradient: "bg-gradient-to-br from-orange/20 via-mediumblue to-darkblue",
    textColor: "text-white",
    accentColor: "text-orange",
  },
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {cards.map((card, index) => {
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
              "cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-regularblue/10 hover:border-lightblue/20",
              card.colSpan,
              card.rowSpan,
              card.gradient
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
    </div>
  )
}
