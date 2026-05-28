"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingUp, TrendingDown, Clock, Zap, AlertTriangle, ChevronRight } from "lucide-react"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

type Sector = "ecommerce" | "saas" | "media" | "services" | "b2b"

interface SectorData {
  name: string
  description: string
  conversionLossPerSecond: number
  avgLoadTimeLegacy: number
  avgLoadTimeHeadless: number
  bounceRatePerSecond: number
}

const sectorsFr: Record<Sector, SectorData> = {
  ecommerce: { name: "E-commerce", description: "Boutique en ligne, marketplace", conversionLossPerSecond: 7, avgLoadTimeLegacy: 5.2, avgLoadTimeHeadless: 1.8, bounceRatePerSecond: 8.3 },
  saas: { name: "SaaS / Application", description: "Logiciel, plateforme en ligne", conversionLossPerSecond: 5, avgLoadTimeLegacy: 4.5, avgLoadTimeHeadless: 1.5, bounceRatePerSecond: 6 },
  media: { name: "Média / Contenu", description: "Blog, portail d'information", conversionLossPerSecond: 4.5, avgLoadTimeLegacy: 6.0, avgLoadTimeHeadless: 2.0, bounceRatePerSecond: 9.5 },
  services: { name: "Services / Vitrine", description: "Présentation d'entreprise, génération de leads", conversionLossPerSecond: 6, avgLoadTimeLegacy: 4.8, avgLoadTimeHeadless: 1.6, bounceRatePerSecond: 7.0 },
  b2b: { name: "B2B / Industrie", description: "Site institutionnel, catalogue industriel", conversionLossPerSecond: 5.5, avgLoadTimeLegacy: 5.5, avgLoadTimeHeadless: 1.9, bounceRatePerSecond: 6.5 },
}

const sectorsEn: Record<Sector, SectorData> = {
  ecommerce: { name: "E-commerce", description: "Online store, marketplace", conversionLossPerSecond: 7, avgLoadTimeLegacy: 5.2, avgLoadTimeHeadless: 1.8, bounceRatePerSecond: 8.3 },
  saas: { name: "SaaS / App", description: "Software, online platform", conversionLossPerSecond: 5, avgLoadTimeLegacy: 4.5, avgLoadTimeHeadless: 1.5, bounceRatePerSecond: 6 },
  media: { name: "Media / Content", description: "Blog, news portal", conversionLossPerSecond: 4.5, avgLoadTimeLegacy: 6.0, avgLoadTimeHeadless: 2.0, bounceRatePerSecond: 9.5 },
  services: { name: "Services / Brochure", description: "Company presentation, lead generation", conversionLossPerSecond: 6, avgLoadTimeLegacy: 4.8, avgLoadTimeHeadless: 1.6, bounceRatePerSecond: 7.0 },
  b2b: { name: "B2B / Industry", description: "Institutional site, industrial catalog", conversionLossPerSecond: 5.5, avgLoadTimeLegacy: 5.5, avgLoadTimeHeadless: 1.9, bounceRatePerSecond: 6.5 },
}

const intlLocale = (locale: Locale) => (locale === "en" ? "en-US" : "fr-FR")
const formatCurrency = (value: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale(locale), { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
const formatNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 0 }).format(value)
const formatPercent = (value: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale(locale), { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100)

function AnimatedValue({ value, formatter, color }: { value: number; formatter: (v: number) => string; color?: string }) {
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

  return <span style={{ color }}>{formatter(displayValue)}</span>
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--mono)",
  fontSize: 9,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--muted-color)",
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--sans)",
  color: "var(--ink)",
  background: "var(--paper)",
  border: "1px solid var(--rule)",
  outline: "none",
}

export default function ROISimulator() {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const sectors = isEn ? sectorsEn : sectorsFr

  const [sector, setSector] = useState<Sector>("ecommerce")
  const [monthlyTraffic, setMonthlyTraffic] = useState(50000)
  const [conversionRate, setConversionRate] = useState(2.5)
  const [avgCartValue, setAvgCartValue] = useState(80)

  const results = useMemo(() => {
    const s = sectors[sector]
    const timeSaved = s.avgLoadTimeLegacy - s.avgLoadTimeHeadless
    const currentMonthlyRevenue = monthlyTraffic * (conversionRate / 100) * avgCartValue
    const excessLoadTime = s.avgLoadTimeLegacy - s.avgLoadTimeHeadless
    const conversionPenalty = (s.conversionLossPerSecond * excessLoadTime) / 100
    const effectiveConversionRate = conversionRate * (1 - conversionPenalty)
    const lostConversionRate = conversionRate - effectiveConversionRate
    const optimisedMonthlyRevenue = monthlyTraffic * (conversionRate / 100) * avgCartValue
    const currentEffectiveRevenue = monthlyTraffic * (effectiveConversionRate / 100) * avgCartValue
    const monthlyLoss = optimisedMonthlyRevenue - currentEffectiveRevenue
    const yearlyLoss = monthlyLoss * 12
    const extraBounce = s.bounceRatePerSecond * excessLoadTime
    const visitorsLostToBounce = Math.round(monthlyTraffic * (extraBounce / 100))
    const additionalMonthlyConversions = Math.round(monthlyTraffic * (lostConversionRate / 100))
    return { timeSaved, currentMonthlyRevenue, effectiveConversionRate, lostConversionRate, monthlyLoss, yearlyLoss, extraBounce, visitorsLostToBounce, additionalMonthlyConversions, loadTimeLegacy: s.avgLoadTimeLegacy, loadTimeHeadless: s.avgLoadTimeHeadless }
  }, [sector, monthlyTraffic, conversionRate, avgCartValue, sectors])

  const sectorData = sectors[sector]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 0, border: "1px solid var(--rule)", alignItems: "start" }}>

      {/* ── Inputs ── */}
      <div style={{ borderRight: "1px solid var(--rule)", padding: "32px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 24 }}>
          {isEn ? "Your current data" : "Vos données actuelles"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Sector */}
          <div>
            <label style={labelStyle}>{isEn ? "Sector" : "Secteur d'activité"}</label>
            <select value={sector} onChange={(e) => setSector(e.target.value as Sector)} style={inputStyle}>
              {(Object.entries(sectors) as [Sector, SectorData][]).map(([key, data]) => (
                <option key={key} value={key}>{data.name} — {data.description}</option>
              ))}
            </select>
          </div>

          {/* Monthly traffic */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>{isEn ? "Monthly traffic" : "Trafic mensuel"}</label>
              <span className="ni-serif" style={{ fontSize: 18, color: "var(--ink)" }}>
                {formatNumber(monthlyTraffic, locale)} {isEn ? "visits" : "visites"}
              </span>
            </div>
            <input type="range" min={1000} max={500000} step={1000} value={monthlyTraffic}
              onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-color)", marginTop: 4 }}>
              <span>1 000</span><span>500 000</span>
            </div>
          </div>

          {/* Conversion rate */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>{isEn ? "Conversion rate" : "Taux de conversion"}</label>
              <span className="ni-serif" style={{ fontSize: 18, color: "var(--ink)" }}>{conversionRate.toFixed(1)} %</span>
            </div>
            <input type="range" min={0.1} max={15} step={0.1} value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-color)", marginTop: 4 }}>
              <span>0,1 %</span><span>15 %</span>
            </div>
          </div>

          {/* Avg cart */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>{isEn ? "Average cart value" : "Panier moyen"}</label>
              <span className="ni-serif" style={{ fontSize: 18, color: "var(--ink)" }}>{formatCurrency(avgCartValue, locale)}</span>
            </div>
            <input type="range" min={5} max={1000} step={5} value={avgCartValue}
              onChange={(e) => setAvgCartValue(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-color)", marginTop: 4 }}>
              <span>5 €</span><span>1 000 €</span>
            </div>
          </div>

          {/* Speed context */}
          <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={10} />
              {isEn ? `Load time — ${sectorData.name}` : `Temps de chargement — ${sectorData.name}`}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-color)", textTransform: "uppercase", marginBottom: 2 }}>{isEn ? "Legacy" : "Classique"}</div>
                <span className="ni-serif" style={{ fontSize: 22, color: "var(--accent-color)" }}>{sectorData.avgLoadTimeLegacy.toFixed(1)}s</span>
              </div>
              <ChevronRight size={14} style={{ color: "var(--muted-color)" }} />
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-color)", textTransform: "uppercase", marginBottom: 2 }}>Headless</div>
                <span className="ni-serif" style={{ fontSize: 22, color: "#2a7a2a" }}>{sectorData.avgLoadTimeHeadless.toFixed(1)}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div>
        {/* Cost of inaction */}
        <div style={{ padding: "32px", borderBottom: "1px solid var(--rule)", borderLeft: "3px solid var(--accent-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <AlertTriangle size={14} style={{ color: "var(--accent-color)" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-color)" }}>
              {isEn ? "The cost of inaction" : "Le coût de l'inaction"}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 24 }}>
            {isEn ? "Revenue lost each month because of your site's slowness" : "Revenus perdus chaque mois à cause de la lenteur de votre site"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <div style={{ borderRight: "1px solid var(--rule)", paddingRight: 24, paddingBottom: 20 }}>
              <div style={labelStyle}>{isEn ? "Monthly loss" : "Perte mensuelle"}</div>
              <div className="ni-serif" style={{ fontSize: "clamp(24px, 2.5vw, 36px)", color: "var(--accent-color)", lineHeight: 1 }}>
                <AnimatedValue value={results.monthlyLoss} formatter={(v) => formatCurrency(v, locale)} color="var(--accent-color)" />
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", marginTop: 6 }}>
                {formatPercent(results.lostConversionRate, locale)} {isEn ? "conversion lost" : "de conversion perdue"}
              </div>
            </div>
            <div style={{ paddingLeft: 24, paddingBottom: 20 }}>
              <div style={labelStyle}>{isEn ? "Yearly loss" : "Perte annuelle"}</div>
              <div className="ni-serif" style={{ fontSize: "clamp(24px, 2.5vw, 36px)", color: "var(--accent-color)", lineHeight: 1 }}>
                <AnimatedValue value={results.yearlyLoss} formatter={(v) => formatCurrency(v, locale)} color="var(--accent-color)" />
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", marginTop: 6 }}>
                <AnimatedValue value={results.additionalMonthlyConversions * 12} formatter={(v) => formatNumber(v, locale)} color="var(--muted-color)" />{" "}
                {isEn ? "lost sales / year" : "ventes perdues / an"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid var(--rule)", paddingTop: 16, marginTop: 4 }}>
            <TrendingDown size={14} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
              <strong style={{ color: "var(--accent-color)" }}>
                <AnimatedValue value={results.visitorsLostToBounce} formatter={(v) => formatNumber(v, locale)} color="var(--accent-color)" />
              </strong>{" "}
              {isEn
                ? `visitors / month leave before load (+${results.extraBounce.toFixed(1)}% bounce rate)`
                : `visiteurs / mois quittent avant chargement (+${results.extraBounce.toFixed(1)}% de rebond)`}
            </p>
          </div>
        </div>

        {/* Headless opportunity */}
        <div style={{ padding: "32px", borderBottom: "1px solid var(--rule)", borderLeft: "3px solid #2a7a2a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Zap size={14} style={{ color: "#2a7a2a" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a7a2a" }}>
              {isEn ? "The Headless opportunity" : "L'opportunité Headless"}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 24 }}>
            {isEn ? "Projection after migrating to Headless architecture" : "Projection après migration vers une architecture Headless"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <div style={{ borderRight: "1px solid var(--rule)", paddingRight: 24, paddingBottom: 20 }}>
              <div style={labelStyle}>{isEn ? "Additional monthly revenue" : "Revenus supplémentaires / mois"}</div>
              <div className="ni-serif" style={{ fontSize: "clamp(24px, 2.5vw, 36px)", color: "#2a7a2a", lineHeight: 1 }}>
                +<AnimatedValue value={results.monthlyLoss} formatter={(v) => formatCurrency(v, locale)} color="#2a7a2a" />
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", marginTop: 6 }}>
                +<AnimatedValue value={results.additionalMonthlyConversions} formatter={(v) => formatNumber(v, locale)} color="var(--muted-color)" />{" "}
                {isEn ? "conversions / month" : "conversions / mois"}
              </div>
            </div>
            <div style={{ paddingLeft: 24, paddingBottom: 20 }}>
              <div style={labelStyle}>{isEn ? "Load time saved" : "Temps de chargement gagné"}</div>
              <div className="ni-serif" style={{ fontSize: "clamp(24px, 2.5vw, 36px)", color: "#2a7a2a", lineHeight: 1 }}>
                -{results.timeSaved.toFixed(1)}s
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", marginTop: 6 }}>
                {sectorData.avgLoadTimeLegacy.toFixed(1)}s → {sectorData.avgLoadTimeHeadless.toFixed(1)}s
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid var(--rule)", paddingTop: 16, marginTop: 4 }}>
            <TrendingUp size={14} style={{ color: "#2a7a2a", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
              <strong style={{ color: "#2a7a2a" }}>
                <AnimatedValue value={results.visitorsLostToBounce} formatter={(v) => formatNumber(v, locale)} color="#2a7a2a" />
              </strong>{" "}
              {isEn
                ? `visitors recovered / month thanks to a ${results.timeSaved.toFixed(1)}s faster load`
                : `visiteurs récupérés / mois grâce à un chargement ${results.timeSaved.toFixed(1)}s plus rapide`}
            </p>
          </div>
        </div>

        {/* 12-month projection */}
        <div style={{ padding: "32px", borderBottom: "1px solid var(--rule)", textAlign: "center" }}>
          <div style={labelStyle}>{isEn ? "12-month projection" : "Projection sur 12 mois"}</div>
          <div className="ni-serif" style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#2a7a2a", lineHeight: 1 }}>
            +<AnimatedValue value={results.yearlyLoss} formatter={(v) => formatCurrency(v, locale)} color="#2a7a2a" />
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isEn ? "of revenue recovered" : "de chiffre d'affaires récupéré"}
          </div>
        </div>

        {/* Methodology */}
        <div style={{ padding: "20px 32px", background: "var(--paper-2)" }}>
          <p style={{ fontSize: 11, color: "var(--muted-color)", lineHeight: 1.65 }}>
            <strong style={{ color: "var(--ink-2)" }}>{isEn ? "Methodology:" : "Méthodologie :"}</strong>{" "}
            {isEn
              ? `Based on Google/Deloitte studies on load-time impact on conversion rates. Each extra second causes ~${sectorData.conversionLossPerSecond}% conversion drop in the ${sectorData.name.toLowerCase()} sector. Load times are sector averages (monolithic vs Headless/Jamstack).`
              : `Basé sur les études Google/Deloitte sur l'impact de la vitesse sur les conversions. Chaque seconde supplémentaire entraîne ~${sectorData.conversionLossPerSecond}% de perte dans le secteur ${sectorData.name.toLowerCase()}. Temps de chargement : moyennes sectorielles (monolithique vs Headless/Jamstack).`}
          </p>
        </div>
      </div>
    </div>
  )
}
