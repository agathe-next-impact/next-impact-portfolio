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
import { Reveal } from "@/components/ui/reveal";

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
    href: "/audit-site-web",
    title: "Diagnostic Web & IA",
    description: "Obtenez une première orientation avant de construire.",
    icon: SearchCheck,
    color: "text-lightyellow",
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
    href: "/audit-site-web",
    title: "Web & AI diagnostic",
    description: "Get a first direction before building.",
    icon: SearchCheck,
    color: "text-lightyellow",
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
    href: "/solutions-web",
    title: "Nos offres",
    description: "Mise en œuvre après une décision Web & IA claire.",
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
    href: "/solutions-web",
    title: "Our offerings",
    description: "Implementation after a clear Web & AI decision.",
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
      href: "/solutions-web",
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
      href: "/solutions-web",
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
    <section className="mt-12 border-t border-dark-gray pt-12">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-light tracking-tight text-foreground">
          {isEn ? "Tools and resources" : "Outils et ressources"}
        </h2>
        <p className="font-inter-tight text-sm text-mid-gray">
          {isEn
            ? "Free tools to evaluate and plan your web project."
            : "Des outils gratuits pour évaluer et planifier votre projet web."}
        </p>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col border-b border-r border-dark-gray bg-transparent px-8 py-7 no-underline transition-colors hover:bg-jet/40"
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className="mb-3 block text-mid-gray transition-colors group-hover:text-accent-secondary"
              />
              <h3 className="mb-1.5 text-lg font-light tracking-tight text-foreground transition-colors group-hover:text-accent-secondary">
                {tool.title}
              </h3>
              <p className="flex-1 font-inter-tight text-[0.8125rem] leading-relaxed text-mid-gray">
                {tool.description}
              </p>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
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
    "wordpress-headless": [
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
    <section className="mt-10 border-t border-dark-gray pt-8">
      <div className="mb-5 flex items-center gap-2">
        <Wrench size={16} strokeWidth={1.5} className="text-mid-gray" />
        <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">
          {isEn ? "Useful tools" : "Outils utiles"}
        </h3>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3 border-b border-r border-dark-gray bg-transparent px-6 py-5 no-underline transition-colors hover:bg-jet/40"
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                className="mt-0.5 flex-shrink-0 text-mid-gray transition-colors group-hover:text-accent-secondary"
              />
              <div>
                <p className="mb-1 text-sm font-medium text-foreground transition-colors group-hover:text-accent-secondary">
                  {tool.title}
                </p>
                <p className="font-inter-tight text-xs leading-relaxed text-mid-gray">
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
    <Reveal className="mt-6 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
        {isEn ? "Going further" : "Pour aller plus loin"}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1 border border-dark-gray bg-obsidian px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray no-underline transition-colors hover:border-accent-secondary hover:text-accent-secondary"
          >
            {link.title}
            <ArrowRight size={10} />
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

function getCategoryRelevantLinks(
  category: string,
  isEn: boolean,
): { href: string; title: string }[] {
  const t = (en: string, fr: string) => (isEn ? en : fr);
  const base = [{ href: "/documentation", title: t("All guides", "Tous les guides") }];

  switch (category) {
    case "wordpress-headless":
      return [
        { href: "/wordpress-headless", title: t("Headless WordPress", "WordPress Headless") },
        ...base,
        { href: "/audit-site-web", title: t("AI audit", "Audit IA") },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
        { href: "/solutions-web", title: t("Our offerings", "Nos offres") },
      ];
    case "wordpress":
      return [
        ...base,
        { href: "/wordpress-headless", title: t("Headless WordPress", "WordPress Headless") },
        { href: "/audit-site-web", title: t("AI audit", "Audit IA") },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
      ];
    case "seo":
      return [
        ...base,
        { href: "/audit-site-web", title: t("AI audit", "Audit IA") },
        { href: "/documentation/marketing-digital", title: t("Digital marketing", "Marketing Digital") },
        { href: "/solutions-web", title: t("Our SEO offerings", "Nos offres SEO") },
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
        { href: "/documentation/seo", title: t("SEO guide", "Guide SEO") },
        { href: "/audit-site-web", title: t("AI audit", "Audit IA") },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
    case "projet-site-web":
      return [
        ...base,
        { href: "/cahier-des-charges", title: t("Specifications", "Cahier des charges") },
        { href: "/audit-site-web", title: t("AI audit", "Audit IA") },
        { href: "/wordpress-headless", title: t("Headless WordPress", "WordPress Headless") },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
    default:
      return [
        ...base,
        { href: "/audit-site-web", title: t("AI audit", "Audit IA") },
        { href: "/etudes-de-cas", title: t("Case studies", "Études de cas") },
        { href: "/solutions-web", title: t("Our offerings", "Nos offres") },
        { href: "/contact", title: t("Start a project", "Démarrer un projet") },
      ];
  }
}
