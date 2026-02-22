"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Globe,
  Loader2,
  Trophy,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Minus,
  ArrowRight,
  BarChart3,
  Zap,
  Smartphone,
  Plus,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type BenchmarkResult,
  type BenchmarkGap,
} from "@/lib/audit/benchmarking-data"
import { runBenchmark } from "@/lib/audit/benchmarking-service"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COMPETITOR_COLORS = [
  "bg-blue-400",
  "bg-purple-400",
  "bg-cyan-400",
]
const COMPETITOR_TEXT_COLORS = [
  "text-blue-400",
  "text-purple-400",
  "text-cyan-400",
]

const verdictConfig = {
  ahead: {
    label: "En avance sur vos concurrents",
    description: "Votre site surpasse les concurrents directs analysés.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    icon: Trophy,
  },
  average: {
    label: "Au coude-à-coude",
    description: "Votre site est dans la même gamme que vos concurrents, mais quelques optimisations vous feraient prendre l'avantage.",
    color: "text-lightblue",
    bg: "bg-lightblue/10 border-lightblue/20",
    icon: TrendingUp,
  },
  behind: {
    label: "En retard sur vos concurrents",
    description: "Vos concurrents directs offrent une meilleure expérience de chargement. Vos prospects risquent de les préférer.",
    color: "text-orange",
    bg: "bg-orange/10 border-orange/20",
    icon: TrendingDown,
  },
  critical: {
    label: "Nettement distancé",
    description: "L'écart avec vos concurrents est significatif. Chaque seconde de retard se traduit par des clients perdus.",
    color: "text-coral",
    bg: "bg-coral/10 border-coral/20",
    icon: AlertTriangle,
  },
}

function impactIcon(impact: BenchmarkGap["impact"]) {
  switch (impact) {
    case "positive": return <CheckCircle2 className="w-4 h-4 text-green-400" />
    case "neutral": return <Minus className="w-4 h-4 text-lightblue" />
    case "warning": return <AlertTriangle className="w-4 h-4 text-orange" />
    case "critical": return <XCircle className="w-4 h-4 text-coral" />
  }
}

function impactColor(impact: BenchmarkGap["impact"]) {
  switch (impact) {
    case "positive": return "text-green-400"
    case "neutral": return "text-lightblue"
    case "warning": return "text-orange"
    case "critical": return "text-coral"
  }
}

function barWidth(value: number, max: number) {
  if (max === 0) return "0%"
  return `${Math.min((value / max) * 100, 100)}%`
}

const URL_REGEX = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+\/?.*$/

function isValidUrl(value: string): boolean {
  return URL_REGEX.test(value.trim())
}

function extractName(url: string): string {
  try {
    const hostname = new URL(
      url.startsWith("http") ? url : `https://${url}`
    ).hostname
    const domain = hostname.replace(/^www\./, "").split(".")[0]
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return url
  }
}

// ---------------------------------------------------------------------------
// Score Gauge
// ---------------------------------------------------------------------------

function ScoreGauge({
  score,
  label,
  color,
  size = "lg",
}: {
  score: number
  label: string
  color: string
  size?: "sm" | "lg"
}) {
  const radius = size === "lg" ? 52 : 28
  const stroke = size === "lg" ? 8 : 4
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const svgSize = (radius + stroke) * 2

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="rotate-[-90deg]">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-white/10"
          />
          <motion.circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold font-googletitre", size === "lg" ? "text-3xl" : "text-base", color)}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs text-white/50 font-googletexte text-center max-w-[80px] leading-tight">{label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Metric comparison bar — shows each competitor individually
// ---------------------------------------------------------------------------

function MetricBar({ gap }: { gap: BenchmarkGap }) {
  const isScoreMetric = gap.metric === "performanceScore"
  const allValues = [gap.siteValue, ...gap.competitorValues.map((c) => c.value)]
  const maxVal = Math.max(...allValues) * 1.15 || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {impactIcon(gap.impact)}
          <span className="text-sm font-medium text-white font-googletexte">
            {gap.label}
          </span>
        </div>
        <span className={cn("text-xs font-medium", impactColor(gap.impact))}>
          {gap.competitorValues.length === 0 ? (
            "Données insuffisantes"
          ) : gap.gapPercent === 0 ? (
            "Équivalent"
          ) : gap.impact === "positive" ? (
            isScoreMetric ? `+${Math.abs(gap.gapPercent)}% vs concurrents` : `${Math.abs(gap.gapPercent)}% plus rapide`
          ) : (
            isScoreMetric ? `${gap.gapPercent}% en dessous` : `${gap.gapPercent}% plus lent`
          )}
        </span>
      </div>

      <div className="space-y-1.5">
        {/* Your site */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/60 w-24 shrink-0 text-right font-medium">Votre site</span>
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: barWidth(gap.siteValue, maxVal) }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                gap.impact === "positive" ? "bg-green-500" :
                gap.impact === "neutral" ? "bg-lightblue" :
                gap.impact === "warning" ? "bg-orange" : "bg-coral"
              )}
            />
          </div>
          <span className="text-xs text-white/70 w-16 font-mono">
            {gap.siteValue}{gap.unit}
          </span>
        </div>

        {/* Each competitor */}
        {gap.competitorValues.map((cv, i) => (
          <div key={cv.name} className="flex items-center gap-3">
            <span className="text-[10px] text-white/40 w-24 shrink-0 text-right truncate" title={cv.name}>
              {cv.name}
            </span>
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: barWidth(cv.value, maxVal) }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * (i + 1) }}
                className={cn("h-full rounded-full", COMPETITOR_COLORS[i] || "bg-white/30")}
              />
            </div>
            <span className="text-xs text-white/50 w-16 font-mono">
              {cv.value}{gap.unit}
            </span>
          </div>
        ))}

        {/* Average */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 w-24 shrink-0 text-right italic">Moy. concurrents</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: barWidth(gap.competitorAvgValue, maxVal) }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="h-full rounded-full bg-white/15"
            />
          </div>
          <span className="text-xs text-white/30 w-16 font-mono">
            {gap.competitorAvgValue}{gap.unit}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function BenchmarkingTool() {
  const [url, setUrl] = useState("")
  const [competitors, setCompetitors] = useState([""])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<BenchmarkResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [urlErrors, setUrlErrors] = useState<{ site?: string; competitors: (string | null)[] }>({ competitors: [null] })

  const updateCompetitor = (index: number, value: string) => {
    const next = [...competitors]
    next[index] = value
    setCompetitors(next)
  }

  const addCompetitor = () => {
    if (competitors.length >= 3) return
    setCompetitors([...competitors, ""])
    setUrlErrors((prev) => ({ ...prev, competitors: [...prev.competitors, null] }))
  }

  const removeCompetitor = (index: number) => {
    if (competitors.length <= 1) return
    setCompetitors(competitors.filter((_, i) => i !== index))
    setUrlErrors((prev) => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || competitors.some((c) => !c.trim())) return

    const FORMAT_MSG = "Format attendu : https://domaine.xx"
    const newErrors: typeof urlErrors = { competitors: competitors.map(() => null) }
    let hasError = false

    if (!isValidUrl(url)) {
      newErrors.site = FORMAT_MSG
      hasError = true
    }
    competitors.forEach((c, i) => {
      if (!isValidUrl(c)) {
        newErrors.competitors[i] = FORMAT_MSG
        hasError = true
      }
    })

    setUrlErrors(newErrors)
    if (hasError) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const entries = competitors.map((c) => ({
        name: extractName(c),
        url: c.trim(),
      }))
      const data = await runBenchmark(url, entries)
      setResult(data)
    } catch {
      setError("Impossible d'analyser les sites. Vérifiez les URLs et réessayez.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full max-w-6xl mx-auto">
      {/* Input form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-2xl border border-white/10 bg-mediumblue/60 backdrop-blur-xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white font-googletitre text-2xl font-medium">
              Analysez votre site
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lightyellow/10 border border-lightyellow/20 text-lightyellow text-xs font-medium font-googletexte">
              <Smartphone className="w-3 h-3" />
              Score Mobile
            </span>
          </div>
          <p className="text-white/60 font-googletexte text-sm mb-6">
            Entrez votre URL et celles de 1 à 3 concurrents — nous les
            analysons en temps réel via Google PageSpeed Insights (stratégie mobile).
            Le score mobile est décisif : Google indexe prioritairement la version mobile de votre site.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Your URL */}
            <div className="space-y-2">
              <Label
                htmlFor="bench-url"
                className="text-white/80 font-googletitre text-sm font-semibold"
              >
                URL de votre site
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="bench-url"
                  type="text"
                  placeholder="https://www.votre-site.fr"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    if (urlErrors.site) setUrlErrors((prev) => ({ ...prev, site: undefined }))
                  }}
                  className={cn(
                    "pl-10 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-lightblue/40",
                    urlErrors.site ? "border-coral" : "border-white/20"
                  )}
                  required
                />
              </div>
              {urlErrors.site && (
                <p className="text-xs text-coral font-googletexte">{urlErrors.site}</p>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Competitor URLs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white/80 font-googletitre text-sm font-semibold">
                  {competitors.length === 1
                    ? "1 site concurrent à comparer"
                    : `${competitors.length} sites concurrents à comparer`}
                </Label>
                {competitors.length < 3 && (
                  <button
                    type="button"
                    onClick={addCompetitor}
                    className="inline-flex items-center gap-1 text-xs text-lightblue hover:text-lightblue/80 font-googletexte font-medium transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter un concurrent
                  </button>
                )}
              </div>
              <div className={cn("grid gap-3", competitors.length === 1 ? "md:grid-cols-1 max-w-md" : competitors.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
                {competitors.map((comp, i) => (
                  <div key={i} className="space-y-1">
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                          i === 0 && "bg-blue-500",
                          i === 1 && "bg-purple-500",
                          i === 2 && "bg-cyan-500"
                        )}
                      >
                        {i + 1}
                      </div>
                      <Input
                        type="text"
                        placeholder={`\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0https://concurrent-${i + 1}.fr`}
                        value={comp}
                        onChange={(e) => {
                          updateCompetitor(i, e.target.value)
                          if (urlErrors.competitors[i]) {
                            setUrlErrors((prev) => {
                              const next = [...prev.competitors]
                              next[i] = null
                              return { ...prev, competitors: next }
                            })
                          }
                        }}
                        className={cn(
                          "pl-7 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-lightblue/40",
                          urlErrors.competitors[i] ? "border-coral" : "border-white/20",
                          competitors.length > 1 ? "pr-9" : ""
                        )}
                        required
                      />
                      {competitors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCompetitor(i)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-white/30 hover:text-coral hover:bg-coral/10 transition"
                          title="Retirer ce concurrent"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {urlErrors.competitors[i] && (
                      <p className="text-xs text-coral font-googletexte">{urlErrors.competitors[i]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || !url.trim() || competitors.some((c) => !c.trim())}
              className="w-full md:w-auto gap-2 rounded-full text-white bg-coral hover:bg-coral/90 font-googletitre font-bold shadow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Lancer le benchmark
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-lightyellow/20 border-t-lightyellow" />
              <Zap className="absolute inset-0 m-auto w-6 h-6 text-lightyellow" />
            </div>
            <p className="text-white/60 font-googletexte text-sm">
              Analyse mobile de 4 sites en parallèle via Google PageSpeed...
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-white/10 text-white/70">{url}</span>
              {competitors.filter((c) => c.trim()).map((c, i) => (
                <span key={i} className="px-2 py-1 rounded bg-white/5 text-white/40">{extractName(c)}</span>
              ))}
            </div>
            <p className="text-white/40 font-googletexte text-xs">
              Cela peut prendre 30 à 60 secondes
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-coral/10 border border-coral/20 p-5 text-center"
          >
            <AlertTriangle className="w-6 h-6 text-coral mx-auto mb-2" />
            <p className="text-coral font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Warning if some sites failed */}
            {(result.siteMetrics.performanceScore === 0 ||
              result.competitors.some((c) => c.error)) && (
              <div className="rounded-xl bg-orange/10 border border-orange/20 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                <div className="text-sm text-white/70">
                  <p className="font-medium text-orange mb-1">Certains sites n&apos;ont pas pu être analysés</p>
                  {result.siteMetrics.performanceScore === 0 && (
                    <p>Votre site n&apos;a pas retourné de données PageSpeed.</p>
                  )}
                  {result.competitors
                    .filter((c) => c.error)
                    .map((c) => (
                      <p key={c.name}>{c.name} — échec de l&apos;analyse.</p>
                    ))}
                  <p className="mt-1 text-white/50">
                    Vérifiez que les URLs sont accessibles publiquement. Sans clé API PageSpeed, les quotas sont limités.
                  </p>
                </div>
              </div>
            )}

            {/* Verdict + scores */}
            <Card
              className={cn(
                "border backdrop-blur-sm shadow-lg overflow-hidden",
                verdictConfig[result.overallVerdict].bg
              )}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Score gauges — your site + each competitor */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] text-white/40 font-googletexte uppercase tracking-wider">
                      <Smartphone className="w-3 h-3" />
                      Scores mobiles PageSpeed
                    </span>
                    <div className="flex items-end gap-4">
                      <ScoreGauge
                        score={result.siteMetrics.performanceScore}
                        label="Votre site"
                        color={verdictConfig[result.overallVerdict].color}
                      />
                      {result.competitors.filter((c) => !c.error).map((c, i) => (
                        <ScoreGauge
                          key={c.name}
                          score={c.metrics.performanceScore}
                          label={c.name}
                          color={COMPETITOR_TEXT_COLORS[i] || "text-white/40"}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verdict text */}
                  <div className="flex-1 text-center md:text-left">
                    {(() => {
                      const V = verdictConfig[result.overallVerdict]
                      const Icon = V.icon
                      return (
                        <>
                          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                            <Icon className={cn("w-6 h-6", V.color)} />
                            <h3 className={cn("text-2xl font-googletitre font-bold", V.color)}>
                              {V.label}
                            </h3>
                          </div>
                          <p className="text-white/70 font-googletexte mb-3">
                            {V.description}
                          </p>
                          <p className="text-sm text-white/50 font-googletexte">
                            Score mobile moyen concurrents : <span className="text-white/70">{result.competitorAvg.performanceScore}/100</span>
                            {result.competitors.some((c) => c.error) && (
                              <span className="text-orange"> ({result.competitors.filter((c) => !c.error).length}/{result.competitors.length} analysés)</span>
                            )}
                          </p>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics comparison */}
            <Card className="border-white/10 bg-mediumblue/60 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-googletitre text-xl">
                    Comparaison métrique par métrique
                  </CardTitle>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-medium">
                    <Smartphone className="w-3 h-3" />
                    Mobile
                  </span>
                </div>
                <CardDescription className="text-white/50">
                  Core Web Vitals (mobile) — votre site vs {result.competitors.map((c) => c.name).join(", ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.gaps.map((gap, i) => (
                  <div key={gap.metric}>
                    <MetricBar gap={gap} />
                    {i < result.gaps.length - 1 && (
                      <Separator className="bg-white/5 mt-5" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Key takeaways */}
            <div className="grid gap-4 md:grid-cols-3">
              {(() => {
                const criticals = result.gaps.filter((g) => g.impact === "critical" || g.impact === "warning")
                if (criticals.length === 0) return null
                return (
                  <Card className="border-coral/20 bg-coral/5 backdrop-blur-sm md:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-coral font-googletitre text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Vos concurrents vous devancent sur
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {criticals.map((gap) => (
                          <li key={gap.metric} className="flex items-start gap-2 text-sm text-white/70">
                            {impactIcon(gap.impact)}
                            <span>
                              <strong className="text-white">{gap.label}</strong> :{" "}
                              {gap.siteValue}{gap.unit} vs {gap.competitorAvgValue}{gap.unit} (moy. concurrents)
                              — <span className={impactColor(gap.impact)}>{gap.gapPercent}% d&apos;écart</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })()}

              {(() => {
                const positives = result.gaps.filter((g) => g.impact === "positive")
                if (positives.length === 0) return null
                return (
                  <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-400 font-googletitre text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Vous les devancez sur
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {positives.map((gap) => (
                          <li key={gap.metric} className="flex items-start gap-2 text-sm text-white/70">
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            <span className="text-white">{gap.label}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })()}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-mediumblue/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 text-center"
            >
              <h3 className="text-xl font-googletitre font-bold text-white mb-2">
                Envie de combler l&apos;écart ?
              </h3>
              <p className="text-white/60 font-googletexte mb-4 text-sm max-w-lg mx-auto">
                Une architecture Headless (Next.js + WordPress) peut vous
                rapprocher — voire dépasser — vos concurrents en quelques semaines.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="/outils/simulateur-roi"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
                >
                  Calculer mon ROI
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/audit-site-ia"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-coral text-darkblue hover:shadow-[0_0_20px_rgba(255,107,107,0.45)] transition-all duration-300 shadow"
                >
                  Audit IA complet
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>

            {/* Methodology */}
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                <p className="text-xs text-white/40 leading-relaxed">
                  <strong className="text-white/50">Méthodologie — Score Mobile :</strong>{" "}
                  Tous les scores sont basés sur la <strong className="text-white/50">stratégie mobile</strong> de
                  Google PageSpeed Insights. C&apos;est le score qui compte le plus : depuis
                  le <em>mobile-first indexing</em>, Google évalue et classe votre site
                  sur sa version mobile. Les 4 sites sont analysés simultanément
                  pour garantir des conditions comparables. Aucune donnée n&apos;est stockée.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
