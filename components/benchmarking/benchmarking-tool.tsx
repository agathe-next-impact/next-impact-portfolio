"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import {
  Globe,
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
  Monitor,
  Plus,
  X,
} from "lucide-react"
import {
  type BenchmarkResult,
  type BenchmarkGap,
  type BenchmarkMetrics,
  type Strategy,
} from "@/lib/audit/benchmarking-data"
import { runBenchmark } from "@/lib/audit/benchmarking-service"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COMPETITOR_FILL_COLORS = [
  "#93c5fd", // blue-300-ish, readable on paper
  "#c4b5fd", // purple-300-ish
  "#67e8f9", // cyan-300-ish
]

const verdictConfigFr = {
  ahead: {
    label: "En avance sur vos concurrents",
    description: "Votre site surpasse les concurrents directs analysés.",
    color: "#2a7a2a",
    borderColor: "#2a7a2a",
    icon: Trophy,
  },
  average: {
    label: "Au coude-à-coude",
    description: "Votre site est dans la même gamme que vos concurrents, mais quelques optimisations vous feraient prendre l'avantage.",
    color: "#b85c09",
    borderColor: "#b85c09",
    icon: TrendingUp,
  },
  behind: {
    label: "En retard sur vos concurrents",
    description: "Vos concurrents directs offrent une meilleure expérience de chargement. Vos prospects risquent de les préférer.",
    color: "#b85c09",
    borderColor: "#b85c09",
    icon: TrendingDown,
  },
  critical: {
    label: "Nettement distancé",
    description: "L'écart avec vos concurrents est significatif. Chaque seconde de retard se traduit par des clients perdus.",
    color: "var(--accent-color)",
    borderColor: "var(--accent-color)",
    icon: AlertTriangle,
  },
}

const verdictConfigEn = {
  ahead: {
    label: "Ahead of your competitors",
    description: "Your site outperforms the direct competitors analyzed.",
    color: "#2a7a2a",
    borderColor: "#2a7a2a",
    icon: Trophy,
  },
  average: {
    label: "Neck and neck",
    description: "Your site is in the same range as your competitors, but a few optimizations would give you the edge.",
    color: "#b85c09",
    borderColor: "#b85c09",
    icon: TrendingUp,
  },
  behind: {
    label: "Behind your competitors",
    description: "Your direct competitors offer a better loading experience. Prospects may prefer them.",
    color: "#b85c09",
    borderColor: "#b85c09",
    icon: TrendingDown,
  },
  critical: {
    label: "Significantly behind",
    description: "The gap with your competitors is significant. Every second of delay means lost customers.",
    color: "var(--accent-color)",
    borderColor: "var(--accent-color)",
    icon: AlertTriangle,
  },
}

function impactIconEl(impact: BenchmarkGap["impact"]) {
  const style = { width: 16, height: 16, flexShrink: 0 }
  switch (impact) {
    case "positive": return <CheckCircle2 style={{ ...style, color: "#2a7a2a" }} />
    case "neutral":  return <Minus style={{ ...style, color: "#b85c09" }} />
    case "warning":  return <AlertTriangle style={{ ...style, color: "#b85c09" }} />
    case "critical": return <XCircle style={{ ...style, color: "var(--accent-color)" }} />
  }
}

function impactCssColor(impact: BenchmarkGap["impact"]): string {
  switch (impact) {
    case "positive": return "#2a7a2a"
    case "neutral":  return "#b85c09"
    case "warning":  return "#b85c09"
    case "critical": return "var(--accent-color)"
  }
}

function barWidth(value: number, max: number) {
  if (max === 0) return "0%"
  return `${Math.min((value / max) * 100, 100)}%`
}

// ---------------------------------------------------------------------------
// Solo audit helpers — Web Vitals thresholds (Google recommendations)
// ---------------------------------------------------------------------------

const buildSoloMetrics = (
  isEn: boolean,
): {
  key: keyof BenchmarkMetrics
  label: string
  unit: string
  good: number
  poor: number
}[] => [
  { key: "performanceScore", label: isEn ? "Overall score" : "Score Global", unit: "/100", good: 90, poor: 50 },
  { key: "lcp", label: "LCP", unit: "s", good: 2.5, poor: 4 },
  { key: "fcp", label: "FCP", unit: "s", good: 1.8, poor: 3 },
  { key: "tbt", label: "TBT", unit: "ms", good: 200, poor: 600 },
  { key: "cls", label: "CLS", unit: "", good: 0.1, poor: 0.25 },
  { key: "si", label: "Speed Index", unit: "s", good: 3.4, poor: 5.8 },
  { key: "ttfb", label: "TTFB", unit: "ms", good: 800, poor: 1800 },
]

const SOLO_METRICS = buildSoloMetrics(false)

function scoreArcColor(score: number): string {
  if (score >= 90) return "#2a7a2a"
  if (score >= 50) return "#b85c09"
  return "var(--accent-color)"
}

function metricStatus(key: keyof BenchmarkMetrics, value: number): "good" | "mid" | "poor" {
  const def = SOLO_METRICS.find((m) => m.key === key)
  if (!def) return "mid"
  if (key === "performanceScore") {
    return value >= def.good ? "good" : value >= def.poor ? "mid" : "poor"
  }
  // Lower is better for all other metrics
  return value <= def.good ? "good" : value <= def.poor ? "mid" : "poor"
}

const STATUS_CSS_COLORS = {
  good: "#2a7a2a",
  mid:  "#b85c09",
  poor: "var(--accent-color)",
}

const STATUS_LABELS_FR = {
  good: "Bon",
  mid: "À améliorer",
  poor: "Faible",
}

const STATUS_LABELS_EN = {
  good: "Good",
  mid: "Needs improvement",
  poor: "Poor",
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
// Score Gauge — Swiss-styled SVG ring
// ---------------------------------------------------------------------------

function ScoreGauge({
  score,
  label,
  size = "lg",
}: {
  score: number
  label: string
  size?: "sm" | "lg"
}) {
  const radius = size === "lg" ? 52 : 28
  const stroke = size === "lg" ? 8 : 4
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const svgSize = (radius + stroke) * 2
  const arcColor = scoreArcColor(score)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative" }}>
        <svg
          width={svgSize}
          height={svgSize}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="var(--rule)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontWeight: 700,
              fontSize: size === "lg" ? 28 : 14,
              color: arcColor,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
        </div>
      </div>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 11,
          color: "var(--muted-color)",
          textAlign: "center",
          maxWidth: 80,
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Metric comparison bar — shows each competitor individually
// ---------------------------------------------------------------------------

function MetricBar({ gap }: { gap: BenchmarkGap }) {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const isScoreMetric = gap.metric === "performanceScore"
  const allValues = [gap.siteValue, ...gap.competitorValues.map((c) => c.value)]
  const maxVal = Math.max(...allValues) * 1.15 || 1
  const fillColor = impactCssColor(gap.impact)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {impactIconEl(gap.impact)}
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            {gap.label}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: fillColor,
          }}
        >
          {gap.competitorValues.length === 0 ? (
            isEn ? "Insufficient data" : "Données insuffisantes"
          ) : gap.gapPercent === 0 ? (
            isEn ? "Equivalent" : "Équivalent"
          ) : gap.impact === "positive" ? (
            isScoreMetric
              ? isEn
                ? `+${Math.abs(gap.gapPercent)}% vs competitors`
                : `+${Math.abs(gap.gapPercent)}% vs concurrents`
              : isEn
                ? `${Math.abs(gap.gapPercent)}% faster`
                : `${Math.abs(gap.gapPercent)}% plus rapide`
          ) : (
            isScoreMetric
              ? isEn
                ? `${gap.gapPercent}% below`
                : `${gap.gapPercent}% en dessous`
              : isEn
                ? `${gap.gapPercent}% slower`
                : `${gap.gapPercent}% plus lent`
          )}
        </span>
      </div>

      {/* Bar rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Your site */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--ink-2)",
              width: 96,
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {isEn ? "Your site" : "Votre site"}
          </span>
          <div
            style={{
              flex: 1,
              height: 10,
              background: "var(--paper-2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: barWidth(gap.siteValue, maxVal),
                height: "100%",
                background: fillColor,
                transition: "width 0.8s ease-out",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-2)",
              width: 64,
            }}
          >
            {gap.siteValue}{gap.unit}
          </span>
        </div>

        {/* Each competitor */}
        {gap.competitorValues.map((cv, i) => (
          <div key={cv.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted-color)",
                width: 96,
                flexShrink: 0,
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={cv.name}
            >
              {cv.name}
            </span>
            <div
              style={{
                flex: 1,
                height: 10,
                background: "var(--paper-2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: barWidth(cv.value, maxVal),
                  height: "100%",
                  background: COMPETITOR_FILL_COLORS[i] ?? "rgba(14,14,12,0.2)",
                  transition: "width 0.8s ease-out",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--muted-color)",
                width: 64,
              }}
            >
              {cv.value}{gap.unit}
            </span>
          </div>
        ))}

        {/* Competitor average */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--muted-color)",
              width: 96,
              flexShrink: 0,
              textAlign: "right",
              fontStyle: "italic",
            }}
          >
            {isEn ? "Avg. competitors" : "Moy. concurrents"}
          </span>
          <div
            style={{
              flex: 1,
              height: 6,
              background: "var(--paper-2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: barWidth(gap.competitorAvgValue, maxVal),
                height: "100%",
                background: "rgba(14,14,12,0.18)",
                transition: "width 0.8s ease-out",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--muted-color)",
              width: 64,
            }}
          >
            {gap.competitorAvgValue}{gap.unit}
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function BenchmarkingTool() {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const verdictConfig = isEn ? verdictConfigEn : verdictConfigFr
  const SOLO_METRICS_LOCALIZED = buildSoloMetrics(isEn)
  const STATUS_LABELS = isEn ? STATUS_LABELS_EN : STATUS_LABELS_FR
  const [url, setUrl] = useState("")
  const [competitors, setCompetitors] = useState<string[]>([])
  const [strategy, setStrategy] = useState<Strategy>("mobile")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<BenchmarkResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [urlErrors, setUrlErrors] = useState<{ site?: string; competitors: (string | null)[] }>({ competitors: [] })

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
    setCompetitors(competitors.filter((_, i) => i !== index))
    setUrlErrors((prev) => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || competitors.some((c) => !c.trim())) return

    const FORMAT_MSG = isEn
      ? "Expected format: https://domain.xx"
      : "Format attendu : https://domaine.xx"
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
      const data = await runBenchmark(url, entries, strategy)
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError(
        isEn
          ? "Unable to analyze the sites. Check the URLs and try again."
          : "Impossible d'analyser les sites. Vérifiez les URLs et réessayez.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Shared input style
  // ---------------------------------------------------------------------------
  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--rule)",
    background: "var(--paper)",
    color: "var(--ink)",
    fontFamily: "var(--sans)",
    padding: "10px 12px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  }

  const btnPrimaryStyle: React.CSSProperties = {
    border: "1px solid var(--ink)",
    background: "var(--ink)",
    color: "var(--paper)",
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "12px 24px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  }

  const btnPrimaryDisabledStyle: React.CSSProperties = {
    ...btnPrimaryStyle,
    opacity: 0.4,
    cursor: "not-allowed",
  }

  return (
    <section style={{ width: "100%", maxWidth: 1152, margin: "0 auto" }}>
      {/* ── Input form ── */}
      <div
        style={{
          border: "1px solid var(--rule)",
          padding: "32px",
          background: "var(--paper)",
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: 24,
            fontWeight: 500,
            color: "var(--ink)",
            marginBottom: 4,
            marginTop: 0,
          }}
        >
          {isEn ? "Analyze your site" : "Analysez votre site"}
        </h2>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 13,
            color: "var(--muted-color)",
            marginBottom: 20,
            marginTop: 0,
          }}
        >
          {isEn
            ? "Enter your URL — add up to 3 competitors for a direct comparison. Real-time analysis via Google PageSpeed Insights."
            : "Entrez votre URL — ajoutez jusqu'à 3 concurrents pour une comparaison directe. Analyse en temps réel via Google PageSpeed Insights."}
        </p>

        {/* Strategy toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              color: "var(--muted-color)",
              marginRight: 4,
            }}
          >
            {isEn ? "Strategy:" : "Stratégie :"}
          </span>
          <button
            type="button"
            onClick={() => setStrategy("mobile")}
            style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              padding: "6px 12px",
              background: "none",
              border: "none",
              borderBottom: strategy === "mobile" ? "2px solid var(--ink)" : "2px solid transparent",
              color: strategy === "mobile" ? "var(--ink)" : "var(--muted-color)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Smartphone style={{ width: 13, height: 13 }} />
            Mobile
          </button>
          <button
            type="button"
            onClick={() => setStrategy("desktop")}
            style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              padding: "6px 12px",
              background: "none",
              border: "none",
              borderBottom: strategy === "desktop" ? "2px solid var(--ink)" : "2px solid transparent",
              color: strategy === "desktop" ? "var(--ink)" : "var(--muted-color)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Monitor style={{ width: 13, height: 13 }} />
            Desktop
          </button>
          {strategy === "mobile" && (
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: 10,
                color: "var(--muted-color)",
                marginLeft: 4,
              }}
            >
              {isEn
                ? "Recommended — Google indexes the mobile version first"
                : "Recommandé — Google indexe en priorité la version mobile"}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Your URL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="bench-url"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink-2)",
              }}
            >
              {isEn ? "Your site URL" : "URL de votre site"}
            </label>
            <div style={{ position: "relative" }}>
              <Globe
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 15,
                  height: 15,
                  color: "var(--muted-color)",
                  pointerEvents: "none",
                }}
              />
              <input
                id="bench-url"
                type="text"
                placeholder={isEn ? "https://www.your-site.com" : "https://www.votre-site.fr"}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (urlErrors.site) setUrlErrors((prev) => ({ ...prev, site: undefined }))
                }}
                style={{
                  ...inputStyle,
                  paddingLeft: 36,
                  borderColor: urlErrors.site ? "var(--accent-color)" : "var(--rule)",
                }}
                required
              />
            </div>
            {urlErrors.site && (
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--accent-color)", margin: 0 }}>
                {urlErrors.site}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--rule)" }} />

          {/* Competitor URLs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                }}
              >
                {competitors.length === 0
                  ? isEn
                    ? "Competitors (optional)"
                    : "Concurrents (optionnel)"
                  : competitors.length === 1
                    ? isEn
                      ? "1 competitor site"
                      : "1 site concurrent"
                    : isEn
                      ? `${competitors.length} competitor sites`
                      : `${competitors.length} sites concurrents`}
              </span>
              {competitors.length < 3 && (
                <button
                  type="button"
                  onClick={addCompetitor}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--sans)",
                    fontSize: 12,
                    color: "var(--ink-2)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    padding: 0,
                  }}
                >
                  <Plus style={{ width: 13, height: 13 }} />
                  {isEn ? "Add a competitor" : "Ajouter un concurrent"}
                </button>
              )}
            </div>
            {competitors.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    competitors.length === 1
                      ? "1fr"
                      : competitors.length === 2
                        ? "1fr 1fr"
                        : "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                {competitors.map((comp, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ position: "relative" }}>
                      {/* Competitor index badge */}
                      <div
                        style={{
                          position: "absolute",
                          left: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 18,
                          height: 18,
                          background: "var(--ink-2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "var(--paper)",
                          flexShrink: 0,
                          pointerEvents: "none",
                        }}
                      >
                        {i + 1}
                      </div>
                      <input
                        type="text"
                        placeholder={
                          isEn
                            ? `https://competitor-${i + 1}.com`
                            : `https://concurrent-${i + 1}.fr`
                        }
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
                        style={{
                          ...inputStyle,
                          paddingLeft: 36,
                          paddingRight: 36,
                          borderColor: urlErrors.competitors[i] ? "var(--accent-color)" : "var(--rule)",
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeCompetitor(i)}
                        title={isEn ? "Remove this competitor" : "Retirer ce concurrent"}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--muted-color)",
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <X style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                    {urlErrors.competitors[i] && (
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 12,
                          color: "var(--accent-color)",
                          margin: 0,
                        }}
                      >
                        {urlErrors.competitors[i]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !url.trim() || competitors.some((c) => !c.trim())}
              style={
                isLoading || !url.trim() || competitors.some((c) => !c.trim())
                  ? btnPrimaryDisabledStyle
                  : btnPrimaryStyle
              }
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid var(--rule)",
                      borderTopColor: "var(--paper)",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  {isEn ? "Running analysis…" : "Analyse en cours..."}
                </>
              ) : competitors.length === 0 ? (
                <>
                  <Zap style={{ width: 14, height: 14 }} />
                  {isEn ? "Run audit" : "Lancer l'audit"}
                </>
              ) : (
                <>
                  <BarChart3 style={{ width: 14, height: 14 }} />
                  {isEn ? "Run benchmark" : "Lancer le benchmark"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Loading state ── */}
      <AnimatePresence>
        {isLoading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 0",
              gap: 16,
            }}
          >
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "3px solid var(--rule)",
                  borderTopColor: "var(--ink)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <Zap
                style={{
                  position: "absolute",
                  inset: 0,
                  margin: "auto",
                  width: 20,
                  height: 20,
                  color: "var(--ink-2)",
                }}
              />
            </div>
            {(() => {
              const total = 1 + competitors.filter((c) => c.trim()).length
              return (
                <>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      color: "var(--muted-color)",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {isEn
                      ? `${strategy === "mobile" ? "Mobile" : "Desktop"} analysis ${
                          total === 1 ? "of your site" : `of ${total} sites`
                        } via Google PageSpeed…`
                      : `Analyse ${strategy === "mobile" ? "mobile" : "desktop"} ${
                          total === 1 ? "de votre site" : `de ${total} sites`
                        } via Google PageSpeed...`}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--ink-2)",
                        padding: "3px 8px",
                        border: "1px solid var(--rule)",
                        background: "var(--paper-2)",
                      }}
                    >
                      {url}
                    </span>
                    {competitors.filter((c) => c.trim()).map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--muted-color)",
                          padding: "3px 8px",
                          border: "1px solid var(--rule)",
                          background: "var(--paper-2)",
                        }}
                      >
                        {extractName(c)}
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 11,
                      color: "var(--muted-color)",
                      margin: 0,
                    }}
                  >
                    {isEn
                      ? total === 1
                        ? "This may take 15 to 30 seconds"
                        : "This may take 30 to 60 seconds"
                      : total === 1
                        ? "Cela peut prendre 15 à 30 secondes"
                        : "Cela peut prendre 30 à 60 secondes"}
                  </p>
                </>
              )
            })()}
          </div>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <div
            style={{
              border: "1px solid var(--rule)",
              borderLeft: "3px solid var(--accent-color)",
              background: "var(--paper-2)",
              padding: 20,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <AlertTriangle
              style={{ width: 22, height: 22, color: "var(--accent-color)", margin: "0 auto 8px" }}
            />
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 14,
                color: "var(--accent-color)",
                margin: 0,
              }}
            >
              {error}
            </p>
          </div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && !isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Warning if some sites failed */}
            {(result.siteMetrics.performanceScore === 0 ||
              result.competitors.some((c) => c.error)) && (
              <div
                style={{
                  border: "1px solid var(--rule)",
                  borderLeft: "3px solid #b85c09",
                  background: "var(--paper-2)",
                  padding: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <AlertTriangle
                  style={{ width: 18, height: 18, color: "#b85c09", flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>
                  <p style={{ fontWeight: 600, color: "#b85c09", margin: "0 0 4px" }}>
                    {result.competitors.length === 0
                      ? isEn ? "Your site could not be analyzed" : "Votre site n'a pas pu être analysé"
                      : isEn ? "Some sites could not be analyzed" : "Certains sites n'ont pas pu être analysés"}
                  </p>
                  {result.siteMetrics.performanceScore === 0 && (
                    <p style={{ margin: "0 0 2px" }}>
                      {isEn ? "Your site did not return PageSpeed data." : "Votre site n'a pas retourné de données PageSpeed."}
                    </p>
                  )}
                  {result.competitors
                    .filter((c) => c.error)
                    .map((c) => (
                      <p key={c.name} style={{ margin: "0 0 2px" }}>
                        {c.name} — {isEn ? "analysis failed." : "échec de l'analyse."}
                      </p>
                    ))}
                  <p style={{ marginTop: 4, color: "var(--muted-color)", margin: "4px 0 0" }}>
                    {isEn
                      ? "Make sure the URLs are publicly accessible. Without a PageSpeed API key, quotas are limited."
                      : "Vérifiez que les URLs sont accessibles publiquement. Sans clé API PageSpeed, les quotas sont limités."}
                  </p>
                </div>
              </div>
            )}

            {/* ── Solo audit mode (no competitors) ── */}
            {result.competitors.length === 0 ? (
              <>
                {/* Score card */}
                <div
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                    padding: "32px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--muted-color)",
                      }}
                    >
                      {result.strategy === "mobile" ? (
                        <Smartphone style={{ width: 12, height: 12 }} />
                      ) : (
                        <Monitor style={{ width: 12, height: 12 }} />
                      )}
                      {isEn
                        ? `PageSpeed ${result.strategy === "mobile" ? "mobile" : "desktop"} score`
                        : `Score ${result.strategy === "mobile" ? "mobile" : "desktop"} PageSpeed`}
                    </span>
                    <ScoreGauge
                      score={result.siteMetrics.performanceScore}
                      label={isEn ? "Your site" : "Votre site"}
                    />
                    <p
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 13,
                        color: "var(--muted-color)",
                        textAlign: "center",
                        maxWidth: 480,
                        margin: 0,
                      }}
                    >
                      {result.siteMetrics.performanceScore >= 90
                        ? isEn
                          ? `Excellent — your site performs very well on ${result.strategy === "mobile" ? "mobile" : "desktop"}.`
                          : `Excellent — votre site est très performant en ${result.strategy === "mobile" ? "mobile" : "desktop"}.`
                        : result.siteMetrics.performanceScore >= 50
                          ? isEn
                            ? "Decent — targeted optimizations can improve the user experience."
                            : "Correct — des optimisations ciblées peuvent améliorer l'expérience utilisateur."
                          : isEn
                            ? "Poor — significant improvements are needed to stay competitive."
                            : "Faible — des améliorations significatives sont nécessaires pour rester compétitif."}
                    </p>
                  </div>
                </div>

                {/* Core Web Vitals grid */}
                <div
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px 16px",
                      borderBottom: "1px solid var(--rule)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 20,
                          fontWeight: 500,
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        Core Web Vitals
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 12,
                          color: "var(--muted-color)",
                          margin: "4px 0 0",
                        }}
                      >
                        {isEn
                          ? "Performance metrics breakdown — Google recommended thresholds"
                          : "Détail des métriques de performance — seuils recommandés par Google"}
                      </p>
                    </div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        color: "var(--muted-color)",
                        border: "1px solid var(--rule)",
                        padding: "3px 8px",
                      }}
                    >
                      {result.strategy === "mobile" ? (
                        <Smartphone style={{ width: 11, height: 11 }} />
                      ) : (
                        <Monitor style={{ width: 11, height: 11 }} />
                      )}
                      {result.strategy === "mobile" ? "Mobile" : "Desktop"}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: 24,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {SOLO_METRICS_LOCALIZED.map((m) => {
                      const value = result.siteMetrics[m.key]
                      const status = metricStatus(m.key, value)
                      return (
                        <div
                          key={m.key}
                          style={{
                            border: "1px solid var(--rule)",
                            background: "var(--paper-2)",
                            padding: 16,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: 10,
                              color: "var(--muted-color)",
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            {m.label}
                          </span>
                          <p
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: 22,
                              fontWeight: 700,
                              color: STATUS_CSS_COLORS[status],
                              margin: "0 0 4px",
                            }}
                          >
                            {value}{m.unit}
                          </p>
                          <span
                            style={{
                              fontFamily: "var(--sans)",
                              fontSize: 10,
                              color: STATUS_CSS_COLORS[status],
                            }}
                          >
                            {STATUS_LABELS[status]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* CTA: add competitors */}
                <div
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper-2)",
                    padding: "32px",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "var(--ink)",
                      marginTop: 0,
                      marginBottom: 8,
                    }}
                  >
                    {isEn ? "Compare with your competitors" : "Comparez avec vos concurrents"}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      color: "var(--muted-color)",
                      marginBottom: 20,
                      maxWidth: 480,
                      margin: "0 auto 20px",
                    }}
                  >
                    {isEn
                      ? "Add up to 3 competitor sites to see where you stand and identify areas for improvement."
                      : "Ajoutez jusqu'à 3 sites concurrents pour voir où vous vous situez et identifier vos axes d'amélioration."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      addCompetitor()
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    style={btnPrimaryStyle}
                  >
                    <Plus style={{ width: 14, height: 14 }} />
                    {isEn ? "Add competitors" : "Ajouter des concurrents"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* ── Comparison mode (with competitors) ── */}

                {/* Verdict + scores */}
                {(() => {
                  const V = verdictConfig[result.overallVerdict]
                  const Icon = V.icon
                  return (
                    <div
                      style={{
                        border: "1px solid var(--rule)",
                        borderLeft: `3px solid ${V.borderColor}`,
                        background: "var(--paper)",
                        padding: "32px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 32,
                        }}
                      >
                        {/* Strategy label */}
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--muted-color)",
                          }}
                        >
                          {result.strategy === "mobile" ? (
                            <Smartphone style={{ width: 12, height: 12 }} />
                          ) : (
                            <Monitor style={{ width: 12, height: 12 }} />
                          )}
                          {isEn
                            ? `PageSpeed ${result.strategy === "mobile" ? "mobile" : "desktop"} scores`
                            : `Scores ${result.strategy === "mobile" ? "mobiles" : "desktop"} PageSpeed`}
                        </span>

                        {/* Score gauges */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
                          <ScoreGauge
                            score={result.siteMetrics.performanceScore}
                            label={isEn ? "Your site" : "Votre site"}
                          />
                          {result.competitors.filter((c) => !c.error).map((c) => (
                            <ScoreGauge
                              key={c.name}
                              score={c.metrics.performanceScore}
                              label={c.name}
                              size="sm"
                            />
                          ))}
                        </div>

                        {/* Verdict text */}
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 8,
                            }}
                          >
                            <Icon style={{ width: 22, height: 22, color: V.color, flexShrink: 0 }} />
                            <h3
                              style={{
                                fontFamily: "var(--serif)",
                                fontSize: 22,
                                fontWeight: 500,
                                color: V.color,
                                margin: 0,
                              }}
                            >
                              {V.label}
                            </h3>
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--sans)",
                              fontSize: 14,
                              color: "var(--ink-2)",
                              margin: "0 0 8px",
                            }}
                          >
                            {V.description}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--sans)",
                              fontSize: 13,
                              color: "var(--muted-color)",
                              margin: 0,
                            }}
                          >
                            {isEn
                              ? `Average competitor ${result.strategy === "mobile" ? "mobile" : "desktop"} score:`
                              : `Score ${result.strategy === "mobile" ? "mobile" : "desktop"} moyen concurrents :`}{" "}
                            <strong style={{ color: "var(--ink-2)" }}>{result.competitorAvg.performanceScore}/100</strong>
                            {result.competitors.some((c) => c.error) && (
                              <span style={{ color: "#b85c09" }}>
                                {" "}({result.competitors.filter((c) => !c.error).length}/{result.competitors.length}{" "}
                                {isEn ? "analyzed" : "analysés"})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Metrics comparison */}
                <div
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px 16px",
                      borderBottom: "1px solid var(--rule)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 20,
                          fontWeight: 500,
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        {isEn ? "Metric-by-metric comparison" : "Comparaison métrique par métrique"}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 12,
                          color: "var(--muted-color)",
                          margin: "4px 0 0",
                        }}
                      >
                        {isEn
                          ? `Core Web Vitals (${result.strategy}) — your site vs ${result.competitors.map((c) => c.name).join(", ")}`
                          : `Core Web Vitals (${result.strategy}) — votre site vs ${result.competitors.map((c) => c.name).join(", ")}`}
                      </p>
                    </div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        color: "var(--muted-color)",
                        border: "1px solid var(--rule)",
                        padding: "3px 8px",
                      }}
                    >
                      {result.strategy === "mobile" ? (
                        <Smartphone style={{ width: 11, height: 11 }} />
                      ) : (
                        <Monitor style={{ width: 11, height: 11 }} />
                      )}
                      {result.strategy === "mobile" ? "Mobile" : "Desktop"}
                    </span>
                  </div>
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                    {result.gaps.map((gap, i) => (
                      <div key={gap.metric}>
                        <MetricBar gap={gap} />
                        {i < result.gaps.length - 1 && (
                          <div
                            style={{ borderTop: "1px solid var(--rule)", marginTop: 24 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key takeaways */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 16,
                  }}
                >
                  {(() => {
                    const criticals = result.gaps.filter((g) => g.impact === "critical" || g.impact === "warning")
                    if (criticals.length === 0) return null
                    return (
                      <div
                        style={{
                          border: "1px solid var(--rule)",
                          borderLeft: "3px solid var(--accent-color)",
                          background: "var(--paper-2)",
                          padding: 20,
                          gridColumn: criticals.length > 2 ? "span 2" : undefined,
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--accent-color)",
                            margin: "0 0 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <AlertTriangle style={{ width: 15, height: 15 }} />
                          {isEn ? "Competitors are ahead on" : "Vos concurrents vous devancent sur"}
                        </h4>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                          {criticals.map((gap) => (
                            <li
                              key={gap.metric}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                                fontFamily: "var(--sans)",
                                fontSize: 13,
                                color: "var(--ink-2)",
                              }}
                            >
                              {impactIconEl(gap.impact)}
                              <span>
                                <strong style={{ color: "var(--ink)" }}>{gap.label}</strong>
                                {" "}:{" "}
                                {gap.siteValue}{gap.unit} vs {gap.competitorAvgValue}{gap.unit}{" "}
                                {isEn ? "(avg. competitors)" : "(moy. concurrents)"}
                                {" "}—{" "}
                                <span style={{ color: impactCssColor(gap.impact) }}>
                                  {gap.gapPercent}% {isEn ? "gap" : "d'écart"}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })()}

                  {(() => {
                    const positives = result.gaps.filter((g) => g.impact === "positive")
                    if (positives.length === 0) return null
                    return (
                      <div
                        style={{
                          border: "1px solid var(--rule)",
                          borderLeft: "3px solid #2a7a2a",
                          background: "var(--paper-2)",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#2a7a2a",
                            margin: "0 0 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <CheckCircle2 style={{ width: 15, height: 15 }} />
                          {isEn ? "You are ahead on" : "Vous les devancez sur"}
                        </h4>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                          {positives.map((gap) => (
                            <li
                              key={gap.metric}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontFamily: "var(--sans)",
                                fontSize: 13,
                                color: "var(--ink)",
                              }}
                            >
                              <CheckCircle2 style={{ width: 14, height: 14, color: "#2a7a2a", flexShrink: 0 }} />
                              {gap.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })()}
                </div>
              </>
            )}

            {/* ── CTA — shared between solo and comparison ── */}
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginTop: 0,
                  marginBottom: 8,
                }}
              >
                {result.competitors.length === 0
                  ? isEn ? "Want to go further?" : "Envie d'aller plus loin ?"
                  : isEn ? "Want to close the gap?" : "Envie de combler l'écart ?"}
              </h3>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                  marginBottom: 20,
                  maxWidth: 480,
                  margin: "0 auto 20px",
                }}
              >
                {isEn ? "A Headless architecture (Next.js + WordPress) can" : "Une architecture Headless (Next.js + WordPress) peut"}
                {result.competitors.length === 0
                  ? isEn
                    ? " boost your site's performance in a few weeks."
                    : " booster les performances de votre site en quelques semaines."
                  : isEn
                    ? " bring you closer — or even ahead — of your competitors in a few weeks."
                    : " vous rapprocher — voire dépasser — vos concurrents en quelques semaines."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                <a
                  href="/outils/simulateur-roi"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                    padding: "12px 20px",
                    textDecoration: "none",
                  }}
                >
                  {isEn ? "Calculate my ROI" : "Calculer mon ROI"}
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </a>
                <a
                  href="/audit-site-web"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--paper)",
                    border: "1px solid var(--ink)",
                    background: "var(--ink)",
                    padding: "12px 20px",
                    textDecoration: "none",
                  }}
                >
                  {isEn ? "Full AI audit" : "Audit IA complet"}
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </a>
              </div>
            </div>

            {/* ── Methodology ── */}
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {result.strategy === "mobile" ? (
                  <Smartphone style={{ width: 14, height: 14, color: "var(--muted-color)", flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <Monitor style={{ width: 14, height: 14, color: "var(--muted-color)", flexShrink: 0, marginTop: 2 }} />
                )}
                <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--muted-color)", lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: "var(--ink-2)" }}>
                    {isEn
                      ? `Methodology — ${result.strategy === "mobile" ? "Mobile" : "Desktop"} score:`
                      : `Méthodologie — Score ${result.strategy === "mobile" ? "Mobile" : "Desktop"} :`}
                  </strong>{" "}
                  {result.competitors.length === 0 ? (
                    isEn ? (
                      <>
                        The score is based on the <strong style={{ color: "var(--ink-2)" }}>{result.strategy} strategy</strong> from
                        Google PageSpeed Insights.
                        {result.strategy === "mobile" && (
                          <> It&apos;s the score that matters most: since
                          <em> mobile-first indexing</em>, Google evaluates and ranks your site
                          on its mobile version.</>
                        )} No data is stored.
                      </>
                    ) : (
                      <>
                        Le score est basé sur la <strong style={{ color: "var(--ink-2)" }}>stratégie {result.strategy}</strong> de
                        Google PageSpeed Insights.
                        {result.strategy === "mobile" && (
                          <> C&apos;est le score qui compte le plus : depuis
                          le <em>mobile-first indexing</em>, Google évalue et classe votre site
                          sur sa version mobile.</>
                        )} Aucune donnée n&apos;est stockée.
                      </>
                    )
                  ) : (
                    isEn ? (
                      <>
                        All scores are based on the <strong style={{ color: "var(--ink-2)" }}>{result.strategy} strategy</strong> from
                        Google PageSpeed Insights.
                        {result.strategy === "mobile" && (
                          <> It&apos;s the score that matters most: since
                          <em> mobile-first indexing</em>, Google evaluates and ranks your site
                          on its mobile version.</>
                        )} The {1 + result.competitors.length} sites are analyzed simultaneously
                        to ensure comparable conditions. No data is stored.
                      </>
                    ) : (
                      <>
                        Tous les scores sont basés sur la <strong style={{ color: "var(--ink-2)" }}>stratégie {result.strategy}</strong> de
                        Google PageSpeed Insights.
                        {result.strategy === "mobile" && (
                          <> C&apos;est le score qui compte le plus : depuis
                          le <em>mobile-first indexing</em>, Google évalue et classe votre site
                          sur sa version mobile.</>
                        )} Les {1 + result.competitors.length} sites sont analysés simultanément
                        pour garantir des conditions comparables. Aucune donnée n&apos;est stockée.
                      </>
                    )
                  )}
                </p>
              </div>
            </div>

          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
