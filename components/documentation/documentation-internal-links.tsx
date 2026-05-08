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
  Network,
  Code,
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

/* ─── Outils par profil (jamais ceux du footer) ──────────────────────────── */
// Footer contient : Audit IA, Simulateur ROI, Benchmarking, Services, Études de cas
// → On ne les affiche jamais ici.

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
      href: "/simulateur-tarifs",
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
      href: "/documentation/mind-map",
      title: "Mind Map",
      description: "Explorez l'architecture headless de façon interactive.",
      icon: Network,
      color: "text-extralightblue",
    },
    {
      href: "/documentation/playground",
      title: "Playground",
      description: "Testez les composants et le rendu en direct.",
      icon: Code,
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
      href: "/simulateur-tarifs",
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
      href: "/documentation/mind-map",
      title: "Mind Map",
      description: "Explore the headless architecture interactively.",
      icon: Network,
      color: "text-extralightblue",
    },
    {
      href: "/documentation/playground",
      title: "Playground",
      description: "Test components and rendering live.",
      icon: Code,
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
    <section className="mt-12 py-12">
      <h2 className="font-googletitre text-2xl md:text-3xl font-medium text-white mb-2">
        {isEn ? "Tools and resources" : "Outils et ressources"}
      </h2>
      <p className="text-sm text-white/60 font-googletexte mb-6">
        {isEn
          ? "Free tools to evaluate and plan your web project."
          : "Des outils gratuits pour évaluer et planifier votre projet web."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              // @ts-expect-error – href comes from internal data
              href={tool.href}
              className="group rounded-2xl p-5 border border-lightblue/10 bg-darkblue/90 backdrop-blur-sm hover:border-lightblue/20 hover:bg-darkblue/60 transition-all duration-300"
            >
              <Icon className={`h-12 w-12 ${tool.color} mb-3`} />
              <h3 className="font-googletitre text-xl md:text-2xl font-medium text-white/90 group-hover:text-white transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-white/50 font-googletexte mt-1 line-clamp-2">
                {tool.description}
              </p>
              <span className={`inline-flex items-center gap-1 text-sm ${tool.color} font-googletexte mt-3 group-hover:text-regularblue transition-colors`}>
                {isEn ? "Discover" : "Découvrir"}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
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
    <section className="mt-10 pt-8 border-t border-lightblue/10">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="h-6 w-6 text-extralightblue mt-2" />
        <h3 className="font-googletitre text-xl md:text-2xl font-medium text-white/80">
          {isEn ? "Useful tools" : "Outils utiles"}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              // @ts-expect-error – href comes from internal data
              href={tool.href}
              className="group flex items-center gap-3 rounded-2xl p-4 border border-lightblue/10 bg-darkblue/30 backdrop-blur-sm hover:border-lightblue/20 hover:bg-darkblue/50 transition-all duration-300"
            >
              <Icon className={`h-5 w-5 ${tool.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-white/80 group-hover:text-white font-googletexte transition-colors">
                  {tool.title}
                </p>
                <p className="text-xs text-white/40 font-googletexte mt-0.5 line-clamp-1">
                  {tool.description}
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/50 shrink-0 group-hover:translate-x-0.5 transition-all" />
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
    <div className="mt-6 rounded-2xl border border-lightblue/10 bg-darkblue/30 backdrop-blur-sm p-5">
      <p className="text-xs text-white/40 font-googletexte uppercase tracking-wider mb-3">
        {isEn ? "Going further" : "Pour aller plus loin"}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            // @ts-expect-error – href comes from internal data
            href={link.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-mediumblue/60 border border-lightblue/10 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:border-lightblue/20 hover:bg-mediumblue/80 transition-all duration-200 font-googletexte"
          >
            {link.title}
            <ArrowRight className="h-2.5 w-2.5" />
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
