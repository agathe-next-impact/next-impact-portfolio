export type TabVariant = "timeline" | "grid" | "two-columns" | "pros-cons"

export interface TimelineStepData {
  label: string
  description: string
}

export interface ProjectItem {
  label: string
  description: string
  status: "ideal" | "evaluate" | "avoid"
}

export interface StructureGroup {
  label: string
  color: "teal" | "blue"
  items: string[]
}

export interface ProItem {
  label: string
  score: number
}

export interface ConItem {
  label: string
  description: string
}

interface TimelineContent {
  title: string
  description: string
  steps: TimelineStepData[]
  variant: "timeline"
}

interface GridContent {
  title: string
  items: ProjectItem[]
  variant: "grid"
}

interface TwoColumnsContent {
  title: string
  groups: StructureGroup[]
  variant: "two-columns"
}

interface ProsConsContent {
  title: string
  pros: ProItem[]
  cons: ConItem[]
  variant: "pros-cons"
}

export type TabContent = TimelineContent | GridContent | TwoColumnsContent | ProsConsContent

export interface Tab {
  id: string
  label: string
  content: TabContent
}

import type { Locale } from "@/i18n/routing"

const HEADLESS_TABS_FR: Tab[] = [
  {
    id: "quoi",
    label: "C'est quoi ?",
    content: {
      title: "WordPress sans les contraintes",
      description:
        "WordPress gere votre contenu en back-office, Next.js propulse l'interface utilisateur a la vitesse de l'eclair. Les deux communiquent via une API REST ou GraphQL, totalement decouplees.",
      steps: [
        {
          label: "Une administration WordPress familiere",
          description: "Interface classique familiere, aucune formation necessaire",
        },
        {
          label: "Une interface Next.js rapide et moderne pour vos visiteurs",
          description: "Experience utilisateur fluide, design personnalise, animations, etc.",
        },
      ],
      variant: "timeline",
    },
  },
  {
    id: "projet",
    label: "Quel projet ?",
    content: {
      title: "Projets adaptes au Headless",
      items: [
        {
          label: "Refonte ambitieuse",
          status: "ideal",
          description: "Migration depuis un WP lent ou site vieillissant",
        },
        {
          label: "Plateforme a fort trafic",
          status: "ideal",
          description: "Medias, portails, marketplaces ESS",
        },
        {
          label: "Web app metier",
          status: "ideal",
          description: "Espace membre, services en ligne, formulaires complexes",
        },
        {
          label: "Vitrine simple 1-3 pages",
          status: "evaluate",
          description: "Si le budget est serre, peser le ROI",
        },
        {
          label: "E-commerce complexe",
          status: "evaluate",
          description: "Faisable avec WooCommerce + API, a bien cadrer",
        },
        {
          label: "Blog gere en autonomie totale",
          status: "avoid",
          description: "Si l'equipe veut tout gerer seule sans competences dev",
        },
      ],
      variant: "grid",
    },
  },
  {
    id: "entreprise",
    label: "Quelle structure ?",
    content: {
      title: "Adapte a votre organisation",
      groups: [
        {
          label: "Structures ESS & associations",
          color: "teal",
          items: [
            "Associations Loi 1901 — credibilite & autonomie",
            "SCOP / SCIC — performance durable",
            "Fondations — image de marque soignee",
          ],
        },
        {
          label: "Entreprises",
          color: "blue",
          items: [
            "PME (50-500 sal.) — SEO & acquisition",
            "Scale-ups — architecture evolutive & API",
            "Medias / Portails — volume & vitesse critique",
          ],
        },
      ],
      variant: "two-columns",
    },
  },
  {
    id: "bilan",
    label: "Avantages & limites",
    content: {
      title: "Bilan honnete",
      pros: [
        { label: "Performance (Core Web Vitals)", score: 99 },
        { label: "Securite", score: 95 },
        { label: "Evolutivite", score: 90 },
        { label: "SEO technique", score: 93 },
      ],
      cons: [
        {
          label: "Investissement initial",
          description: "Plus cher qu'un theme, rentabilise sur 2-3 ans",
        },
        {
          label: "Plugins visuels incompatibles",
          description: "Elementor, Divi → remplaces par des composants custom",
        },
        {
          label: "Competence specifique requise",
          description: "Freelance ou agence specialisee Next.js",
        },
      ],
      variant: "pros-cons",
    },
  },
]

const HEADLESS_TABS_EN: Tab[] = [
  {
    id: "quoi",
    label: "What is it?",
    content: {
      title: "WordPress without the constraints",
      description:
        "WordPress manages your content in the back office, Next.js powers the user interface at lightning speed. The two communicate via a REST or GraphQL API — fully decoupled.",
      steps: [
        {
          label: "A familiar WordPress admin",
          description: "Classic familiar interface, no training required",
        },
        {
          label: "A fast, modern Next.js front end for your visitors",
          description: "Smooth user experience, custom design, animations and more",
        },
      ],
      variant: "timeline",
    },
  },
  {
    id: "projet",
    label: "Which project?",
    content: {
      title: "Projects suited to Headless",
      items: [
        {
          label: "Ambitious redesign",
          status: "ideal",
          description: "Migration from a slow WP or aging site",
        },
        {
          label: "High-traffic platform",
          status: "ideal",
          description: "Media, portals, social-economy marketplaces",
        },
        {
          label: "Business web app",
          status: "ideal",
          description: "Member area, online services, complex forms",
        },
        {
          label: "Simple 1-3 page brochure",
          status: "evaluate",
          description: "If the budget is tight, weigh the ROI",
        },
        {
          label: "Complex e-commerce",
          status: "evaluate",
          description: "Doable with WooCommerce + API, needs careful scoping",
        },
        {
          label: "Blog managed fully in-house",
          status: "avoid",
          description: "If the team wants to handle everything alone without dev skills",
        },
      ],
      variant: "grid",
    },
  },
  {
    id: "entreprise",
    label: "Which organization?",
    content: {
      title: "Tailored to your organization",
      groups: [
        {
          label: "Social economy & nonprofits",
          color: "teal",
          items: [
            "Nonprofits — credibility & autonomy",
            "Co-ops — sustainable performance",
            "Foundations — polished brand image",
          ],
        },
        {
          label: "Companies",
          color: "blue",
          items: [
            "SMEs (50-500 employees) — SEO & acquisition",
            "Scale-ups — scalable architecture & APIs",
            "Media / Portals — critical volume & speed",
          ],
        },
      ],
      variant: "two-columns",
    },
  },
  {
    id: "bilan",
    label: "Benefits & limits",
    content: {
      title: "An honest verdict",
      pros: [
        { label: "Performance (Core Web Vitals)", score: 99 },
        { label: "Security", score: 95 },
        { label: "Scalability", score: 90 },
        { label: "Technical SEO", score: 93 },
      ],
      cons: [
        {
          label: "Initial investment",
          description: "More expensive than a theme, paid back over 2-3 years",
        },
        {
          label: "Visual page builders incompatible",
          description: "Elementor, Divi → replaced by custom components",
        },
        {
          label: "Specialized skills required",
          description: "Freelance or agency specialized in Next.js",
        },
      ],
      variant: "pros-cons",
    },
  },
]

export const HEADLESS_TABS = HEADLESS_TABS_FR

export function getHeadlessTabs(locale: Locale): Tab[] {
  return locale === "en" ? HEADLESS_TABS_EN : HEADLESS_TABS_FR
}
