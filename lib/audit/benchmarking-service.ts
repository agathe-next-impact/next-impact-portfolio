"use server"

import {
  type BenchmarkMetrics,
  type BenchmarkResult,
  type BenchmarkGap,
  type CompetitorResult,
} from "./benchmarking-data"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ZERO_METRICS: BenchmarkMetrics = {
  performanceScore: 0, lcp: 0, tbt: 0, cls: 0, fcp: 0, si: 0, ttfb: 0,
}

/** Small delay to stagger API calls and avoid rate-limit / throttle issues */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// In-memory cache — avoids burning API quota on repeated analyses
// Cache entries expire after CACHE_TTL_MS (4 hours).
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 4 * 60 * 60 * 1000

interface CacheEntry {
  metrics: BenchmarkMetrics
  timestamp: number
}

const metricsCache = new Map<string, CacheEntry>()

function getCached(url: string): BenchmarkMetrics | null {
  const entry = metricsCache.get(url)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    metricsCache.delete(url)
    return null
  }
  console.log(`[Benchmark] ↩ Cache hit pour ${url} (score ${entry.metrics.performanceScore}/100)`)
  return entry.metrics
}

function setCache(url: string, metrics: BenchmarkMetrics) {
  metricsCache.set(url, { metrics, timestamp: Date.now() })
}

// ---------------------------------------------------------------------------
// Main benchmarking function
// ---------------------------------------------------------------------------

export async function runBenchmark(
  url: string,
  competitors: { name: string; url: string }[]
): Promise<BenchmarkResult> {
  const apiKey = process.env.PAGESPEED_API_KEY
  if (!apiKey) {
    console.warn(`[Benchmark] ⚠ PAGESPEED_API_KEY non définie — les quotas API seront très limités (~25 req/jour)`)
  }

  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  // Normalize competitor URLs
  const normalizedCompetitors = competitors.map((c) => {
    let compUrl = c.url.trim()
    if (!compUrl.startsWith("http")) {
      compUrl = `https://${compUrl}`
    }
    return { name: c.name, url: compUrl }
  })

  // ---- Fetch site metrics first ----
  console.log(`[Benchmark] === Début de l'analyse ===`)

  let siteMetrics: BenchmarkMetrics
  try {
    siteMetrics = await fetchPageSpeedMetrics(normalizedUrl)
    console.log(`[Benchmark] ✓ Votre site (${normalizedUrl}) → score ${siteMetrics.performanceScore}/100`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[Benchmark] ✗ Échec pour votre site: ${msg}`)
    const isQuotaError = msg.includes("Quota") || msg.includes("429")
    // Quota errors affect all subsequent calls too — bail out early.
    if (isQuotaError) {
      return {
        url: normalizedUrl,
        siteMetrics: ZERO_METRICS,
        competitors: [],
        competitorAvg: ZERO_METRICS,
        timestamp: new Date().toISOString(),
        gaps: [],
        overallVerdict: "critical" as const,
        error: msg,
      }
    }
    // In solo mode (no competitors), return an error result so the UI can
    // show a proper message instead of all-zero metrics.
    if (normalizedCompetitors.length === 0) {
      return {
        url: normalizedUrl,
        siteMetrics: ZERO_METRICS,
        competitors: [],
        competitorAvg: ZERO_METRICS,
        timestamp: new Date().toISOString(),
        gaps: [],
        overallVerdict: "critical" as const,
        error: `Impossible d'analyser ${normalizedUrl}. Vérifiez que l'URL est accessible publiquement et réessayez.`,
      }
    }
    siteMetrics = ZERO_METRICS
  }

  // ---- Fetch competitor metrics sequentially with a stagger ----
  const competitorResults: CompetitorResult[] = []
  // Without API key, use longer delay to reduce rate-limit risk
  const staggerMs = apiKey ? 300 : 1500

  for (const comp of normalizedCompetitors) {
    await delay(staggerMs)
    try {
      const metrics = await fetchPageSpeedMetrics(comp.url)
      console.log(`[Benchmark] ✓ ${comp.name} (${comp.url}) → score ${metrics.performanceScore}/100`)
      competitorResults.push({ name: comp.name, url: comp.url, metrics })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[Benchmark] ✗ Échec pour ${comp.name}: ${msg}`)
      competitorResults.push({ name: comp.name, url: comp.url, metrics: ZERO_METRICS, error: true })
    }
  }

  // ---- Compute averages & gaps (only from successful competitors) ----
  const validCompetitors = competitorResults.filter((c) => !c.error)
  const competitorAvg = averageMetrics(validCompetitors.map((c) => c.metrics))

  console.log(`[Benchmark] ${validCompetitors.length}/${competitorResults.length} concurrents analysés avec succès`)
  console.log(`[Benchmark] Moyenne concurrents → score ${competitorAvg.performanceScore}/100`)

  const gaps = calculateGaps(siteMetrics, competitorResults, competitorAvg)
  const overallVerdict = determineVerdict(siteMetrics, competitorAvg)

  console.log(`[Benchmark] Verdict: ${overallVerdict}`)
  console.log(`[Benchmark] === Analyse terminée ===`)

  return {
    url: normalizedUrl,
    siteMetrics,
    competitors: competitorResults,
    competitorAvg,
    timestamp: new Date().toISOString(),
    gaps,
    overallVerdict,
  }
}

// ---------------------------------------------------------------------------
// PageSpeed API fetch
// ---------------------------------------------------------------------------

async function fetchPageSpeedMetrics(url: string): Promise<BenchmarkMetrics> {
  // Check cache first
  const cached = getCached(url)
  if (cached) return cached

  const apiKey = process.env.PAGESPEED_API_KEY
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance${apiKey ? `&key=${apiKey}` : ""}`

  console.log(`[Benchmark] Requête PageSpeed pour ${url}...`)

  const response = await fetch(apiUrl, { cache: "no-store" })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    console.error(`[Benchmark] HTTP ${response.status} pour ${url}: ${body.slice(0, 300)}`)
    if (response.status === 429) {
      throw new Error(
        `Quota API PageSpeed dépassé. ` +
        (apiKey
          ? `Réessayez dans quelques minutes.`
          : `Ajoutez une PAGESPEED_API_KEY dans .env.local pour augmenter le quota (gratuit).`)
      )
    }
    throw new Error(`PageSpeed API ${response.status} pour ${url}`)
  }

  const data = await response.json()
  const lr = data.lighthouseResult

  if (!lr?.audits || !lr?.categories?.performance) {
    console.error(`[Benchmark] Réponse inattendue pour ${url}:`, JSON.stringify(data).slice(0, 500))
    throw new Error(`Réponse PageSpeed invalide pour ${url}`)
  }

  const audits = lr.audits
  const rawScore = lr.categories.performance.score

  // Log raw values for debugging
  console.log(`[Benchmark] ${url} — raw score: ${rawScore}, LCP: ${audits["largest-contentful-paint"]?.numericValue}ms, FCP: ${audits["first-contentful-paint"]?.numericValue}ms, TBT: ${audits["total-blocking-time"]?.numericValue}ms, CLS: ${audits["cumulative-layout-shift"]?.numericValue}, SI: ${audits["speed-index"]?.numericValue}ms, TTFB: ${audits["server-response-time"]?.numericValue}ms`)

  const metrics: BenchmarkMetrics = {
    performanceScore: Math.round((rawScore ?? 0) * 100),
    lcp: parseFloat(((audits["largest-contentful-paint"]?.numericValue ?? 0) / 1000).toFixed(1)),
    tbt: Math.round(audits["total-blocking-time"]?.numericValue ?? 0),
    cls: parseFloat((audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(2)),
    fcp: parseFloat(((audits["first-contentful-paint"]?.numericValue ?? 0) / 1000).toFixed(1)),
    si: parseFloat(((audits["speed-index"]?.numericValue ?? 0) / 1000).toFixed(1)),
    ttfb: Math.round(audits["server-response-time"]?.numericValue ?? 0),
  }

  // Store in cache
  setCache(url, metrics)

  return metrics
}

// ---------------------------------------------------------------------------
// Average metrics from real competitor data
// ---------------------------------------------------------------------------

function averageMetrics(metricsList: BenchmarkMetrics[]): BenchmarkMetrics {
  const valid = metricsList.filter((m) => m.performanceScore > 0)
  if (valid.length === 0) {
    return { ...ZERO_METRICS }
  }

  const avg = (key: keyof BenchmarkMetrics) =>
    valid.reduce((acc, m) => acc + m[key], 0) / valid.length

  return {
    performanceScore: Math.round(avg("performanceScore")),
    lcp: parseFloat(avg("lcp").toFixed(1)),
    tbt: Math.round(avg("tbt")),
    cls: parseFloat(avg("cls").toFixed(2)),
    fcp: parseFloat(avg("fcp").toFixed(1)),
    si: parseFloat(avg("si").toFixed(1)),
    ttfb: Math.round(avg("ttfb")),
  }
}

// ---------------------------------------------------------------------------
// Gap analysis — uses real competitor data
// ---------------------------------------------------------------------------

interface MetricDef {
  key: keyof BenchmarkMetrics
  label: string
  unit: string
  lowerIsBetter: boolean
  /** Absolute difference below which the gap is considered negligible */
  negligibleThreshold: number
}

const METRIC_DEFS: MetricDef[] = [
  { key: "performanceScore", label: "Score Performance Mobile", unit: "/100", lowerIsBetter: false, negligibleThreshold: 5 },
  { key: "lcp", label: "LCP (Largest Contentful Paint)", unit: "s", lowerIsBetter: true, negligibleThreshold: 0.3 },
  { key: "fcp", label: "FCP (First Contentful Paint)", unit: "s", lowerIsBetter: true, negligibleThreshold: 0.2 },
  { key: "tbt", label: "TBT (Total Blocking Time)", unit: "ms", lowerIsBetter: true, negligibleThreshold: 50 },
  { key: "cls", label: "CLS (Cumulative Layout Shift)", unit: "", lowerIsBetter: true, negligibleThreshold: 0.05 },
  { key: "si", label: "Speed Index", unit: "s", lowerIsBetter: true, negligibleThreshold: 0.3 },
  { key: "ttfb", label: "TTFB (Time to First Byte)", unit: "ms", lowerIsBetter: true, negligibleThreshold: 100 },
]

function calculateGaps(
  site: BenchmarkMetrics,
  competitors: CompetitorResult[],
  competitorAvg: BenchmarkMetrics
): BenchmarkGap[] {
  // Only include successful competitors in the per-bar values
  const validCompetitors = competitors.filter((c) => !c.error)

  return METRIC_DEFS.map((def) => {
    const siteVal = site[def.key]
    const avgVal = competitorAvg[def.key]

    const competitorValues = validCompetitors.map((c) => ({
      name: c.name,
      value: c.metrics[def.key],
    }))

    // Calculate percentage gap
    let gapPercent: number
    if (avgVal === 0) {
      gapPercent = 0
    } else if (def.lowerIsBetter) {
      gapPercent = ((siteVal - avgVal) / avgVal) * 100
    } else {
      gapPercent = ((avgVal - siteVal) / avgVal) * 100
    }

    // Round first, then determine impact (avoids mismatch between displayed % and icon)
    const roundedGap = Math.round(gapPercent)

    // Check absolute difference to avoid misleading % on small values
    const absDiff = Math.abs(siteVal - avgVal)
    const isNegligible = absDiff <= def.negligibleThreshold

    let impact: BenchmarkGap["impact"]
    if (isNegligible || roundedGap <= 0) {
      impact = isNegligible && roundedGap > 0 ? "neutral" : "positive"
    } else if (roundedGap < 30) {
      impact = "neutral"
    } else if (roundedGap < 80) {
      impact = "warning"
    } else {
      impact = "critical"
    }

    return {
      metric: def.key,
      label: def.label,
      siteValue: siteVal,
      competitorAvgValue: avgVal,
      competitorValues,
      unit: def.unit,
      gapPercent: roundedGap,
      impact,
    }
  })
}

// ---------------------------------------------------------------------------
// Verdict
// ---------------------------------------------------------------------------

function determineVerdict(
  site: BenchmarkMetrics,
  competitorAvg: BenchmarkMetrics
): BenchmarkResult["overallVerdict"] {
  const score = site.performanceScore
  const avgScore = competitorAvg.performanceScore

  if (avgScore === 0) return "average"
  if (score >= avgScore * 1.1) return "ahead"
  if (score >= avgScore * 0.85) return "average"
  if (score >= avgScore * 0.6) return "behind"
  return "critical"
}
