"use client";

import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  SearchCheck,
  Calculator,
  BarChart3,
  ClipboardCheck,
  FileText,
  Briefcase,
  FolderOpen,
  Wrench,
  PlayCircle,
} from "lucide-react";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import type { ProfileId } from "@/lib/documentation-profiles";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

/* ─── Liens vers outils & services ─────────────────────────────────────────── */

interface ToolLink {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const TOOL_LINKS_FR: ToolLink[] = [
  {
    href: "/audit-site-ia",
    title: "Audit IA gratuit",
    description: "Analysez performance, SEO et conversion de votre site.",
    icon: SearchCheck,
    color: "text-lightyellow",
  },
  {
    href: "/outils/simulateur-roi",
    title: "Simulateur ROI",
    description: "Calculez le manque à gagner dû à un site lent.",
    icon: Calculator,
    color: "text-lightblue",
  },
  {
    href: "/outils/benchmarking",
    title: "Benchmarking",
    description: "Comparez vos performances face à vos concurrents.",
    icon: BarChart3,
    color: "text-regularblue",
  },
  {
    href: "/cahier-des-charges",
    title: "Cahier des charges",
    description: "Générez un cahier des charges structuré pour votre projet.",
    icon: FileText,
    color: "text-coral",
  },
];

const TOOL_LINKS_EN: ToolLink[] = [
  {
    href: "/audit-site-ia",
    title: "Free AI audit",
    description: "Analyze your site's performance, SEO and conversion.",
    icon: SearchCheck,
    color: "text-lightyellow",
  },
  {
    href: "/outils/simulateur-roi",
    title: "ROI simulator",
    description: "Calculate the revenue lost to a slow site.",
    icon: Calculator,
    color: "text-lightblue",
  },
  {
    href: "/outils/benchmarking",
    title: "Benchmarking",
    description: "Compare your performance against competitors.",
    icon: BarChart3,
    color: "text-regularblue",
  },
  {
    href: "/cahier-des-charges",
    title: "Specifications",
    description: "Generate a structured specifications document for your project.",
    icon: FileText,
    color: "text-coral",
  },
];

const SERVICE_LINKS_FR: ToolLink[] = [
  {
    href: "/services",
    title: "Nos offres",
    description: "Solutions WordPress Headless & Next.js adaptées à vos besoins.",
    icon: Briefcase,
    color: "text-orange",
  },
  {
    href: "/etudes-de-cas",
    title: "Études de cas",
    description: "Découvrez nos réalisations concrètes en production.",
    icon: FolderOpen,
    color: "text-regularblue",
  },
  {
    href: "/contact",
    title: "Démarrer un projet",
    description: "Déterminez l'offre adaptée avec notre questionnaire interactif.",
    icon: ClipboardCheck,
    color: "text-coral",
  },
];

const SERVICE_LINKS_EN: ToolLink[] = [
  {
    href: "/services",
    title: "Our offerings",
    description: "Headless WordPress & Next.js solutions tailored to your needs.",
    icon: Briefcase,
    color: "text-orange",
  },
  {
    href: "/etudes-de-cas",
    title: "Case studies",
    description: "Discover our real-world projects in production.",
    icon: FolderOpen,
    color: "text-regularblue",
  },
  {
    href: "/contact",
    title: "Start a project",
    description: "Find the right offering with our interactive questionnaire.",
    icon: ClipboardCheck,
    color: "text-coral",
  },
];

/* ─── Outils par profil ──────────────────────────────────────────────────── */

const PROFILE_TOOLS_FR: Record<ProfileId | "default", ToolLink[]> = {
  default: [
    {
      href: "/cahier-des-charges",
      title: "Cahier des charges",
      description: "Générez un cahier des charges structuré pour votre projet.",
      icon: FileText,
      color: "text-coral",
    },
    {
      href: "/demo",
      title: "Démo interactive",
      description: "Découvrez un site WordPress Headless en action.",
      icon: PlayCircle,
      color: "text-lightyellow",
    },
    {
      href: "/contact",
      title: "Démarrer un projet",
      description: "Déterminez l'offre adaptée à votre structure.",
      icon: ClipboardCheck,
      color: "text-regularblue",
    },
  ],
  decideur: [
    {
      href: "/cahier-des-charges",
      title: "Cahier des charges",
      description: "Cadrez votre projet avec un document structuré.",
      icon: FileText,
      color: "text-coral",
    },
    {
      href: "/tarifs",
      title: "Simulateur de tarifs",
      description: "Estimez le budget adapté à votre projet.",
      icon: Calculator,
      color: "text-lightyellow",
    },
    {
      href: "/contact",
      title: "Démarrer un projet",
      description: "Échangeons sur vos objectifs business.",
      icon: ClipboardCheck,
      color: "text-orange",
    },
  ],
  utilisateur: [
    {
      href: "/demo",
      title: "Démo interactive",
      description: "Testez la gestion de contenu en conditions réelles.",
      icon: PlayCircle,
      color: "text-lightyellow",
    },
    {
      href: "/cahier-des-charges",
      title: "Cahier des charges",
      description: "Formalisez vos besoins en un document clair.",
      icon: FileText,
      color: "text-coral",
    },
    {
      href: "/contact",
      title: "Démarrer un projet",
      description: "Trouvez l'offre adaptée à votre organisation.",
      icon: ClipboardCheck,
      color: "text-regularblue",
    },
  ],
  developpeur: [
    {
      href: "/demo",
      title: "Démo interactive",
      description: "Découvrez un site WordPress Headless en action.",
      icon: PlayCircle,
      color: "text-lightyellow",
    },
    {
      href: "/cahier-des-charges",
      title: "Cahier des charges",
      description: "Structurez les spécifications techniques du projet.",
      icon: FileText,
      color: "text-coral",
    },
  ],
};

const PROFILE_TOOLS_EN: Record<ProfileId | "default", ToolLink[]> = {
  default: [
    {
      href: "/cahier-des-charges",
      title: "Specifications",
      description: "Generate a structured specifications document for your project.",
      icon: FileText,
      color: "text-coral",
    },
    {
      href: "/demo",
      title: "Interactive demo",
      description: "Discover a Headless WordPress site in action.",
      icon: PlayCircle,
      color: "text-lightyellow",
    },
    {
      href: "/contact",
      title: "Start a project",
      description: "Find the offering that fits your organization.",
      icon: ClipboardCheck,
      color: "text-regularblue",
    },
  ],
  decideur: [
    {
      href: "/cahier-des-charges",
      title: "Specifications",
      description: "Frame your project with a structured document.",
      icon: FileText,
      color: "text-coral",
    },
    {
      href: "/tarifs",
      title: "Pricing simulator",
      description: "Estimate the budget that fits your project.",
      icon: Calculator,
      color: "text-lightyellow",
    },
    {
      href: "/contact",
      title: "Start a project",
      description: "Let's discuss your business goals.",
      icon: ClipboardCheck,
      color: "text-orange",
    },
  ],
  utilisateur: [
    {
      href: "/demo",
      title: "Interactive demo",
      description: "Test content management in real conditions.",
      icon: PlayCircle,
      color: "text-lightyellow",
    },
    {
      href: "/cahier-des-charges",
      title: "Specifications",
      description: "Formalize your needs in a clear document.",
      icon: FileText,
      color: "text-coral",
    },
    {
      href: "/contact",
      title: "Start a project",
      description: "Find the offering that fits your organization.",
      icon: ClipboardCheck,
      color: "text-regularblue",
    },
  ],
  developpeur: [
    {
      href: "/demo",
      title: "Interactive demo",
      description: "Discover a Headless WordPress site in action.",
      icon: PlayCircle,
      color: "text-lightyellow",
    },
    {
      href: "/cahier-des-charges",
      title: "Specifications",
      description: "Structure the technical specifications of your project.",
      icon: FileText,
      color: "text-coral",
    },
  ],
};

/* ─── Composant : section outils (page hub) ───────────────────────────────── */

export function DocumentationToolsSection() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const tools = (isEn ? PROFILE_TOOLS_EN : PROFILE_TOOLS_FR)[profileId || "default"];

  return (
    <section style={{ marginTop: 48, paddingTop: 48, borderTop: "1px solid var(--rule)" }}>
      <div style={{ marginBottom: 32 }}>
        <h2
          className="ni-serif"
          style={{ fontSize: "clamp(20px, 2vw, 28px)", color: "var(--ink)", marginBottom: 8 }}
        >
          {isEn ? "Tools and resources" : "Outils et ressources"}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
          {isEn
            ? "Free tools to evaluate and plan your web project."
            : "Des outils gratuits pour évaluer et planifier votre projet web."}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          borderTop: "1px solid var(--rule)",
          borderLeft: "1px solid var(--rule)",
        }}
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                border: "1px solid var(--rule)",
                borderTop: "none",
                borderLeft: "none",
                padding: "28px 32px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                background: "var(--paper)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                style={{ color: "var(--muted-color)", marginBottom: 12, display: "block" }}
              />
              <h3 className="ni-serif" style={{ fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>
                {tool.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, flex: 1 }}>
                {tool.description}
              </p>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent-color)",
                  marginTop: 16,
                }}
              >
                {isEn ? "Discover →" : "Découvrir →"}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Composant : liens outils compacts (pages catégorie + article) ───────── */

function buildCategoryTools(isEn: boolean): Record<string, ToolLink[]> {
  const TOOL_LINKS = isEn ? TOOL_LINKS_EN : TOOL_LINKS_FR;
  const SERVICE_LINKS = isEn ? SERVICE_LINKS_EN : SERVICE_LINKS_FR;
  const t = (en: string, fr: string) => (isEn ? en : fr);
  return {
    "headless-cms": [
      TOOL_LINKS[0],
      TOOL_LINKS[1],
      { ...SERVICE_LINKS[1], description: t("Headless projects in production.", "Projets headless en production.") },
    ],
    wordpress: [
      TOOL_LINKS[0],
      TOOL_LINKS[2],
      { ...SERVICE_LINKS[1], description: t("Successful WordPress migrations.", "Migrations WordPress réussies.") },
    ],
    seo: [
      TOOL_LINKS[2],
      TOOL_LINKS[0],
      { ...SERVICE_LINKS[0], description: t("SEO built into our offerings.", "SEO intégré dans nos offres.") },
    ],
    "design-ui-ux": [
      TOOL_LINKS[3],
      { ...SERVICE_LINKS[0], description: t("UI/UX design in our offerings.", "Design UI/UX dans nos offres.") },
      { ...SERVICE_LINKS[1], description: t("Our design work.", "Nos réalisations design.") },
    ],
    "marketing-digital": [
      TOOL_LINKS[1],
      TOOL_LINKS[2],
      { ...SERVICE_LINKS[2], description: t("Let's plan your strategy.", "Planifions votre stratégie.") },
    ],
    "projet-site-web": [
      TOOL_LINKS[3],
      TOOL_LINKS[0],
      { ...SERVICE_LINKS[2], description: t("Launch your project.", "Lancez votre projet.") },
    ],
    blog: [
      TOOL_LINKS[0],
      { ...SERVICE_LINKS[1], description: t("Our projects in detail.", "Nos projets en détail.") },
      { ...SERVICE_LINKS[2], description: t("Let's discuss your project.", "Discutons de votre projet.") },
    ],
  };
}

interface CategoryToolsLinksProps {
  category: string;
}

export function CategoryToolsLinks({ category }: CategoryToolsLinksProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const TOOL_LINKS = isEn ? TOOL_LINKS_EN : TOOL_LINKS_FR;
  const tools = buildCategoryTools(isEn)[category] || TOOL_LINKS.slice(0, 3);

  return (
    <section style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--rule)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Wrench size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />
        <h3
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-2)",
            margin: 0,
          }}
        >
          {isEn ? "Useful tools" : "Outils utiles"}
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          border: "1px solid var(--rule)",
        }}
      >
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                padding: "20px 24px",
                textDecoration: "none",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                borderRight: i < tools.length - 1 ? "1px solid var(--rule)" : "none",
                background: "var(--paper)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                style={{ color: "var(--muted-color)", flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>
                  {tool.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {tool.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Composant : mini CTA pour les pages article ─────────────────────────── */

export function ArticleInternalLinks({ category }: { category: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const links = getCategoryRelevantLinks(category, isEn);

  return (
    <div
      style={{
        marginTop: 24,
        padding: "20px 24px",
        border: "1px solid var(--rule)",
        borderLeft: "3px solid var(--accent-color)",
        background: "var(--paper-2)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted-color)",
          marginBottom: 12,
        }}
      >
        {isEn ? "Going further" : "Pour aller plus loin"}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              border: "1px solid var(--rule)",
              padding: "6px 12px",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
              textDecoration: "none",
              background: "var(--paper)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-2)")}
          >
            {link.title}
            <ArrowRight size={10} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function getCategoryRelevantLinks(
  category: string,
  isEn: boolean,
): { href: string; title: string }[] {
  const t = (en: string, fr: string) => (isEn ? en : fr);
  const base = [{ href: "/documentation", title: t("All guides", "Tous les guides") }];

  switch (category) {
    case "headless-cms":
      return [
        ...base,
        { href: "/audit-site-ia", title: t("AI audit", "Audit IA") },
        { href: "/outils/simulateur-roi", title: t("ROI simulator", "Simulateur ROI") },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
        { href: "/services", title: t("Our offerings", "Nos offres") },
      ];
    case "wordpress":
      return [
        ...base,
        { href: "/audit-site-ia", title: t("AI audit", "Audit IA") },
        { href: "/documentation/headless-cms", title: "Headless CMS" },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
        { href: "/outils/benchmarking", title: "Benchmarking" },
      ];
    case "seo":
      return [
        ...base,
        { href: "/outils/benchmarking", title: "Benchmarking" },
        { href: "/audit-site-ia", title: t("AI audit", "Audit IA") },
        { href: "/documentation/marketing-digital", title: t("Digital marketing", "Marketing Digital") },
        { href: "/services", title: t("Our SEO offerings", "Nos offres SEO") },
      ];
    case "design-ui-ux":
      return [
        ...base,
        { href: "/cahier-des-charges", title: t("Specifications", "Cahier des charges") },
        { href: "/documentation/projet-site-web", title: t("Web project", "Projet site web") },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
    case "marketing-digital":
      return [
        ...base,
        { href: "/outils/simulateur-roi", title: t("ROI simulator", "Simulateur ROI") },
        { href: "/documentation/seo", title: t("SEO guide", "Guide SEO") },
        { href: "/outils/benchmarking", title: "Benchmarking" },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
    case "projet-site-web":
      return [
        ...base,
        { href: "/cahier-des-charges", title: t("Specifications", "Cahier des charges") },
        { href: "/audit-site-ia", title: t("AI audit", "Audit IA") },
        { href: "/documentation/headless-cms", title: "Headless CMS" },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
    default:
      return [
        ...base,
        { href: "/audit-site-ia", title: t("AI audit", "Audit IA") },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
        { href: "/services", title: t("Our offerings", "Nos offres") },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
  }
}
