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

export const HEADLESS_TABS: Tab[] = [
  {
    id: "quoi",
    label: "C'est quoi ?",
    content: {
      title: "WordPress sans les contraintes",
      description:
        "WordPress gere votre contenu en back-office, Next.js propulse l'interface utilisateur a la vitesse de l'eclair. Les deux communiquent via une API REST ou GraphQL, totalement decouplees.",
      steps: [
        {
          label: "Vous editez dans WP",
          description: "Interface classique familiere, aucune formation necessaire",
        },
        {
          label: "L'API transmet les donnees",
          description: "JSON propre, securise, decouple du front-end",
        },
        {
          label: "Next.js affiche en <1s",
          description: "Pages generees statiquement, distribuees sur CDN mondial",
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
