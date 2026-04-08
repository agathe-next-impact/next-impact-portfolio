"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

type Sector =
  | "ecommerce"
  | "saas"
  | "media"
  | "services"
  | "b2b"

interface SectorData {
  name: string
  description: string
  /** Perte de conversion par seconde de latence supplémentaire (%) */
  conversionLossPerSecond: number
  /** Temps de chargement moyen d'un site classique dans ce secteur (s) */
  avgLoadTimeLegacy: number
  /** Temps de chargement moyen après migration Headless (s) */
  avgLoadTimeHeadless: number
  /** Taux de rebond supplémentaire par seconde de latence (%) */
  bounceRatePerSecond: number
}

const sectors: Record<Sector, SectorData> = {
  ecommerce: {
    name: "E-commerce",
    description: "Boutique en ligne, marketplace",
    conversionLossPerSecond: 7,
    avgLoadTimeLegacy: 5.2,
    avgLoadTimeHeadless: 1.8,
    bounceRatePerSecond: 8.3,
  },
  saas: {
    name: "SaaS / Application",
    description: "Logiciel, plateforme en ligne",
    conversionLossPerSecond: 5,
    avgLoadTimeLegacy: 4.5,
    avgLoadTimeHeadless: 1.5,
    bounceRatePerSecond: 6,
  },
  media: {
    name: "Média / Contenu",
    description: "Blog, portail d'information",
    conversionLossPerSecond: 4.5,
    avgLoadTimeLegacy: 6.0,
    avgLoadTimeHeadless: 2.0,
    bounceRatePerSecond: 9.5,
  },
  services: {
    name: "Services / Vitrine",
    description: "Présentation d'entreprise, génération de leads",
    conversionLossPerSecond: 6,
    avgLoadTimeLegacy: 4.8,
    avgLoadTimeHeadless: 1.6,
    bounceRatePerSecond: 7.0,
  },
  b2b: {
    name: "B2B / Industrie",
    description: "Site institutionnel, catalogue industriel",
    conversionLossPerSecond: 5.5,
    avgLoadTimeLegacy: 5.5,
    avgLoadTimeHeadless: 1.9,
    bounceRatePerSecond: 6.5,
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)

const formatPercent = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)

// ---------------------------------------------------------------------------
// Animated number component
// ---------------------------------------------------------------------------

function AnimatedValue({
  value,
  formatter,
}: {
  value: number
  formatter: (v: number) => string
}) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const start = displayValue
    const end = value
    if (start === end) return

    const duration = 500
    let startTime: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(start + (end - start) * eased)
      if (progress < 1) raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className="text-white">{formatter(displayValue)}</span>
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ROISimulator() {
  // --- User inputs ---
  const [sector, setSector] = useState<Sector>("ecommerce")
  const [monthlyTraffic, setMonthlyTraffic] = useState(50000)
  const [conversionRate, setConversionRate] = useState(2.5)
  const [avgCartValue, setAvgCartValue] = useState(80)

  // --- Derived calculations ---
  const results = useMemo(() => {
    const s = sectors[sector]
    const timeSaved = s.avgLoadTimeLegacy - s.avgLoadTimeHeadless

    // Current state
    const currentMonthlyRevenue =
      monthlyTraffic * (conversionRate / 100) * avgCartValue

    // Conversion loss due to slow site
    // Formula : X% loss per extra second compared to optimal
    const excessLoadTime = s.avgLoadTimeLegacy - s.avgLoadTimeHeadless
    const conversionPenalty =
      (s.conversionLossPerSecond * excessLoadTime) / 100
    const effectiveConversionRate = conversionRate * (1 - conversionPenalty)
    const lostConversionRate = conversionRate - effectiveConversionRate

    // Revenue with an optimised (headless) site
    const optimisedMonthlyRevenue =
      monthlyTraffic * (conversionRate / 100) * avgCartValue
    // Revenue currently lost due to slow speed
    const currentEffectiveRevenue =
      monthlyTraffic * (effectiveConversionRate / 100) * avgCartValue
    const monthlyLoss = optimisedMonthlyRevenue - currentEffectiveRevenue
    const yearlyLoss = monthlyLoss * 12

    // Bounce rate impact
    const extraBounce = s.bounceRatePerSecond * excessLoadTime
    const visitorsLostToBounce = Math.round(
      monthlyTraffic * (extraBounce / 100)
    )

    // Additional conversions after migration
    const additionalMonthlyConversions = Math.round(
      monthlyTraffic * (lostConversionRate / 100)
    )

    return {
      timeSaved,
      currentMonthlyRevenue,
      effectiveConversionRate,
      lostConversionRate,
      monthlyLoss,
      yearlyLoss,
      extraBounce,
      visitorsLostToBounce,
      additionalMonthlyConversions,
      loadTimeLegacy: s.avgLoadTimeLegacy,
      loadTimeHeadless: s.avgLoadTimeHeadless,
    }
  }, [sector, monthlyTraffic, conversionRate, avgCartValue])

  const sectorData = sectors[sector]

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-5">
        {/* ---- INPUT PANEL ---- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl border border-white/10 bg-mediumblue/60 backdrop-blur-xl p-6 md:p-8">
            <h2 className="text-white font-googletitre text-2xl font-medium mb-1">
              Vos données actuelles
            </h2>
            <p className="text-white/60 font-googletexte text-sm mb-6">
              Renseignez vos métriques pour une projection personnalisée
            </p>
            <div className="space-y-8">
              {/* Sector */}
              <div className="space-y-2">
                <Label className="text-white/80 font-googletitre text-base font-semibold">
                  Secteur d&apos;activité
                </Label>
                <Select
                  value={sector}
                  onValueChange={(v) => setSector(v as Sector)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-darkblue/95 backdrop-blur-xl border-white/10 rounded-xl ">
                    {Object.entries(sectors).map(([key, data]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-white/80 focus:bg-white/10 focus:text-white data-[state=checked]:text-lightyellow rounded-lg py-2.5 pl-8 pr-3 cursor-pointer"
                      >
                        <span className="font-googletitre font-medium text-white">{data.name}</span>
                        <span className="block text-xs text-white/40 font-googletexte mt-0.5">{data.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-white/10" />

              {/* Monthly Traffic */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <Label className="text-white/80 font-googletitre text-base font-semibold">
                    Trafic mensuel
                  </Label>
                  <span className="text-lg font-bold text-lightyellow">
                    {formatNumber(monthlyTraffic)} visites
                  </span>
                </div>
                <Slider
                  value={[monthlyTraffic]}
                  onValueChange={([v]) => setMonthlyTraffic(v)}
                  min={1000}
                  max={500000}
                  step={1000}
                  className="[&_[role=slider]]:bg-lightyellow [&_[role=slider]]:border-lightyellow [&_span:first-child>span]:bg-lightyellow"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>1 000</span>
                  <span>500 000</span>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <Label className="text-white/80 font-googletitre text-base font-semibold">
                    Taux de conversion
                  </Label>
                  <span className="text-lg font-bold text-lightyellow">
                    {conversionRate.toFixed(1)} %
                  </span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={([v]) => setConversionRate(v)}
                  min={0.1}
                  max={15}
                  step={0.1}
                  className="[&_[role=slider]]:bg-lightyellow [&_[role=slider]]:border-lightyellow [&_span:first-child>span]:bg-lightyellow"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>0,1 %</span>
                  <span>15 %</span>
                </div>
              </div>

              {/* Average Cart Value */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <Label className="text-white/80 font-googletitre text-base font-semibold">
                    Panier moyen
                  </Label>
                  <span className="text-lg font-bold text-lightyellow">
                    {formatCurrency(avgCartValue)}
                  </span>
                </div>
                <Slider
                  value={[avgCartValue]}
                  onValueChange={([v]) => setAvgCartValue(v)}
                  min={5}
                  max={1000}
                  step={5}
                  className="[&_[role=slider]]:bg-lightyellow [&_[role=slider]]:border-lightyellow [&_span:first-child>span]:bg-lightyellow"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>5 &euro;</span>
                  <span>1 000 &euro;</span>
                </div>
              </div>

              {/* Speed context */}
              <div className="rounded-xl bg-darkblue/40 border border-white/10 p-4 space-y-2">
                <p className="text-sm font-semibold text-white/80 font-googletitre flex items-center gap-2">
                  <Clock className="w-4 h-4 text-lightyellow" />
                  Temps de chargement moyen ({sectorData.name})
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex-1">
                    <span className="block text-xs text-white/40 uppercase tracking-wide">
                      Site classique
                    </span>
                    <span className="text-xl font-bold text-coral">
                      {sectorData.avgLoadTimeLegacy.toFixed(1)}s
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20" />
                  <div className="flex-1">
                    <span className="block text-xs text-white/40 uppercase tracking-wide">
                      Site Headless
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      {sectorData.avgLoadTimeHeadless.toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- RESULTS PANEL ---- */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Revenue impact card */}
          <div className="rounded-2xl border border-coral/20 bg-coral/5 backdrop-blur-xl p-6 md:p-8 space-y-4">
            <div>
              <h3 className="text-coral font-googletitre text-xl font-medium flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5" />
                Le coût de l&apos;inaction
              </h3>
              <p className="text-white/60 font-googletexte text-sm">
                Revenus perdus chaque mois à cause de la lenteur de votre site
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly loss */}
              <div className="rounded-xl bg-darkblue/40 border border-coral/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">
                  Perte mensuelle
                </p>
                <p className="text-3xl font-bold text-coral">
                  <AnimatedValue
                    value={results.monthlyLoss}
                    formatter={formatCurrency}
                  />
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {formatPercent(results.lostConversionRate)} de conversion
                  perdue
                </p>
              </div>
              {/* Yearly loss */}
              <div className="rounded-xl bg-darkblue/40 border border-coral/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">
                  Perte annuelle
                </p>
                <p className="text-3xl font-bold text-coral">
                  <AnimatedValue
                    value={results.yearlyLoss}
                    formatter={formatCurrency}
                  />
                </p>
                <p className="text-xs text-white/40 mt-1">
                  soit{" "}
                  <AnimatedValue
                    value={results.additionalMonthlyConversions * 12}
                    formatter={formatNumber}
                  />{" "}
                  ventes perdues / an
                </p>
              </div>
            </div>

            {/* Bounce rate */}
            <div className="flex items-center gap-3 rounded-lg bg-coral/10 border border-coral/20 p-3">
              <TrendingDown className="w-5 h-5 text-coral shrink-0" />
              <p className="text-sm text-white/70">
                <strong className="text-coral">
                  <AnimatedValue
                    value={results.visitorsLostToBounce}
                    formatter={formatNumber}
                  />
                </strong>{" "}
                visiteurs / mois quittent votre site avant qu&apos;il ne
                charge (+
                {results.extraBounce.toFixed(1)}% de taux de rebond)
              </p>
            </div>
          </div>

          {/* Opportunity card */}
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-xl p-6 md:p-8 space-y-4">
            <div>
              <h3 className="text-green-400 font-googletitre text-xl font-medium flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5" />
                L&apos;opportunité Headless
              </h3>
              <p className="text-white/60 font-googletexte text-sm">
                Projection après migration vers une architecture Headless
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Additional monthly revenue */}
              <div className="rounded-xl bg-darkblue/40 border border-green-500/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">
                  Revenus supplémentaires / mois
                </p>
                <p className="text-3xl font-bold text-green-400">
                  +
                  <AnimatedValue
                    value={results.monthlyLoss}
                    formatter={formatCurrency}
                  />
                </p>
                <p className="text-xs text-white/40 mt-1">
                  +
                  <AnimatedValue
                    value={results.additionalMonthlyConversions}
                    formatter={formatNumber}
                  />{" "}
                  conversions / mois
                </p>
              </div>
              {/* Time saved */}
              <div className="rounded-xl bg-darkblue/40 border border-green-500/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">
                  Temps de chargement gagné
                </p>
                <p className="text-3xl font-bold text-green-400">
                  -{results.timeSaved.toFixed(1)}s
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {sectorData.avgLoadTimeLegacy.toFixed(1)}s &rarr;{" "}
                  {sectorData.avgLoadTimeHeadless.toFixed(1)}s
                </p>
              </div>
            </div>

            {/* Recovery summary */}
            <div className="flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
              <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-sm text-white/70">
                <strong className="text-green-400">
                  <AnimatedValue
                    value={results.visitorsLostToBounce}
                    formatter={formatNumber}
                  />
                </strong>{" "}
                visiteurs récupérés / mois grâce à un chargement{" "}
                {results.timeSaved.toFixed(1)}s plus rapide
              </p>
            </div>

            {/* ROI projection */}
            <Separator className="bg-green-500/10" />
            <div className="text-center py-2">
              <p className="text-sm text-white/50 mb-1">
                Projection sur 12 mois
              </p>
              <p className="text-4xl font-bold text-green-400 font-googletitre">
                +
                <AnimatedValue
                  value={results.yearlyLoss}
                  formatter={formatCurrency}
                />
              </p>
              <p className="text-sm text-white/50 mt-1">
                de chiffre d&apos;affaires récupéré
              </p>
            </div>
          </div>

          {/* Methodology note */}
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-4">
            <p className="text-xs text-white/40 leading-relaxed">
              <strong className="text-white/50">Méthodologie :</strong>{" "}
              Les calculs reposent sur les études Google/Deloitte mesurant
              l&apos;impact de la vitesse de chargement sur les taux de
              conversion e-commerce. Chaque seconde supplémentaire de latence
              entraîne une perte moyenne de{" "}
              {sectorData.conversionLossPerSecond}% des conversions dans le
              secteur {sectorData.name.toLowerCase()}. Les temps de chargement
              sont basés sur des moyennes sectorielles (sites monolithiques vs
              architecture Headless/Jamstack).
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
