// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BenchmarkMetrics {
  performanceScore: number
  lcp: number
  tbt: number
  cls: number
  fcp: number
  si: number
  ttfb: number
}

export interface CompetitorResult {
  name: string
  url: string
  metrics: BenchmarkMetrics
  error?: boolean
}

export interface BenchmarkResult {
  url: string
  siteMetrics: BenchmarkMetrics
  competitors: CompetitorResult[]
  /** Average of the 3 competitors' real metrics */
  competitorAvg: BenchmarkMetrics
  timestamp: string
  gaps: BenchmarkGap[]
  overallVerdict: "ahead" | "average" | "behind" | "critical"
}

export interface BenchmarkGap {
  metric: string
  label: string
  siteValue: number
  competitorAvgValue: number
  competitorValues: { name: string; value: number }[]
  unit: string
  gapPercent: number
  impact: "positive" | "neutral" | "warning" | "critical"
}

// ---------------------------------------------------------------------------
// Sector definitions (competitor URLs for live PageSpeed analysis)
// ---------------------------------------------------------------------------

export type SectorKey =
  | "ecommerce"
  | "saas"
  | "media"
  | "services"
  | "industrie"
  | "sante"
  | "finance"
  | "education"

export interface SectorDef {
  name: string
  description: string
  competitors: { name: string; url: string }[]
}

export const SECTORS: Record<SectorKey, SectorDef> = {
  ecommerce: {
    name: "E-commerce",
    description: "Boutiques en ligne, marketplaces",
    competitors: [
      { name: "Amazon", url: "https://www.amazon.fr" },
      { name: "Zalando", url: "https://www.zalando.fr" },
      { name: "Cdiscount", url: "https://www.cdiscount.com" },
    ],
  },
  saas: {
    name: "SaaS / Tech",
    description: "Logiciels, plateformes, applications",
    competitors: [
      { name: "Notion", url: "https://www.notion.so" },
      { name: "Linear", url: "https://linear.app" },
      { name: "Vercel", url: "https://vercel.com" },
    ],
  },
  media: {
    name: "Média / Contenu",
    description: "Blogs, portails d'information, presse",
    competitors: [
      { name: "Le Monde", url: "https://www.lemonde.fr" },
      { name: "Medium", url: "https://medium.com" },
      { name: "Les Echos", url: "https://www.lesechos.fr" },
    ],
  },
  services: {
    name: "Services / Vitrine",
    description: "Présentation d'entreprise, génération de leads",
    competitors: [
      { name: "HubSpot", url: "https://www.hubspot.com" },
      { name: "Stripe", url: "https://stripe.com" },
      { name: "Mailchimp", url: "https://mailchimp.com" },
    ],
  },
  industrie: {
    name: "Industrie / B2B",
    description: "Fabricants, catalogues industriels, B2B",
    competitors: [
      { name: "Schneider Electric", url: "https://www.se.com" },
      { name: "Siemens", url: "https://www.siemens.com" },
      { name: "Dassault Systèmes", url: "https://www.3ds.com" },
    ],
  },
  sante: {
    name: "Santé / Pharma",
    description: "Cliniques, laboratoires, pharmacies",
    competitors: [
      { name: "Doctolib", url: "https://www.doctolib.fr" },
      { name: "Sanofi", url: "https://www.sanofi.com" },
      { name: "Qare", url: "https://www.qare.fr" },
    ],
  },
  finance: {
    name: "Finance / Banque",
    description: "Banques, assurances, fintech",
    competitors: [
      { name: "Qonto", url: "https://qonto.com" },
      { name: "Alan", url: "https://alan.com" },
      { name: "Lydia", url: "https://www.lydia-app.com" },
    ],
  },
  education: {
    name: "Education / Formation",
    description: "Universités, e-learning, formations",
    competitors: [
      { name: "OpenClassrooms", url: "https://openclassrooms.com" },
      { name: "Coursera", url: "https://www.coursera.org" },
      { name: "360Learning", url: "https://360learning.com" },
    ],
  },
}
