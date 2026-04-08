"use client";

import Link from "next/link";
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

/* ─── Liens vers outils & services ─────────────────────────────────────────── */

interface ToolLink {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const TOOL_LINKS: ToolLink[] = [
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

const SERVICE_LINKS: ToolLink[] = [
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

/* ─── Outils par profil (jamais ceux du footer) ──────────────────────────── */
// Footer contient : Audit IA, Simulateur ROI, Benchmarking, Services, Études de cas
// → On ne les affiche jamais ici.

const PROFILE_TOOLS: Record<ProfileId | "default", ToolLink[]> = {
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

/* ─── Composant : section outils (page hub) ───────────────────────────────── */

export function DocumentationToolsSection() {
  const { profileId } = useDocumentationMode();
  const tools = PROFILE_TOOLS[profileId || "default"];

  return (
    <section className="mt-12 py-12">
      <h2 className="font-googletitre text-2xl md:text-3xl font-medium text-white mb-2">
        Outils et ressources
      </h2>
      <p className="text-sm text-white/60 font-googletexte mb-6">
        Des outils gratuits pour évaluer et planifier votre projet web.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
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
                Découvrir
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

const CATEGORY_TOOLS: Record<string, ToolLink[]> = {
  "headless-cms": [
    TOOL_LINKS[0], // Audit IA
    TOOL_LINKS[1], // Simulateur ROI
    { ...SERVICE_LINKS[1], description: "Projets headless en production." }, // Études de cas
  ],
  wordpress: [
    TOOL_LINKS[0], // Audit IA
    TOOL_LINKS[2], // Benchmarking
    { ...SERVICE_LINKS[1], description: "Migrations WordPress réussies." },
  ],
  seo: [
    TOOL_LINKS[2], // Benchmarking
    TOOL_LINKS[0], // Audit IA
    { ...SERVICE_LINKS[0], description: "SEO intégré dans nos offres." },
  ],
  "design-ui-ux": [
    TOOL_LINKS[3], // Cahier des charges
    { ...SERVICE_LINKS[0], description: "Design UI/UX dans nos offres." },
    { ...SERVICE_LINKS[1], description: "Nos réalisations design." },
  ],
  "marketing-digital": [
    TOOL_LINKS[1], // Simulateur ROI
    TOOL_LINKS[2], // Benchmarking
    { ...SERVICE_LINKS[2], description: "Planifions votre stratégie." },
  ],
  "projet-site-web": [
    TOOL_LINKS[3], // Cahier des charges
    TOOL_LINKS[0], // Audit IA
    { ...SERVICE_LINKS[2], description: "Lancez votre projet." },
  ],
  blog: [
    TOOL_LINKS[0], // Audit IA
    { ...SERVICE_LINKS[1], description: "Nos projets en détail." },
    { ...SERVICE_LINKS[2], description: "Discutons de votre projet." },
  ],
};

interface CategoryToolsLinksProps {
  category: string;
}

export function CategoryToolsLinks({ category }: CategoryToolsLinksProps) {
  const tools = CATEGORY_TOOLS[category] || TOOL_LINKS.slice(0, 3);

  return (
    <section className="mt-10 pt-8 border-t border-lightblue/10">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="h-6 w-6 text-extralightblue mt-2" />
        <h3 className="font-googletitre text-xl md:text-2xl font-medium text-white/80">
          Outils utiles
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
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
  const links = getCategoryRelevantLinks(category);

  return (
    <div className="mt-6 rounded-2xl border border-lightblue/10 bg-darkblue/30 backdrop-blur-sm p-5">
      <p className="text-xs text-white/40 font-googletexte uppercase tracking-wider mb-3">
        Pour aller plus loin
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
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

function getCategoryRelevantLinks(category: string): { href: string; title: string }[] {
  const base = [
    { href: "/documentation", title: "Tous les guides" },
  ];

  switch (category) {
    case "headless-cms":
      return [
        ...base,
        { href: "/audit-site-ia", title: "Audit IA" },
        { href: "/outils/simulateur-roi", title: "Simulateur ROI" },
        { href: "/etudes-de-cas", title: "Études de cas" },
        { href: "/services", title: "Nos offres" },
      ];
    case "wordpress":
      return [
        ...base,
        { href: "/audit-site-ia", title: "Audit IA" },
        { href: "/documentation/headless-cms", title: "Headless CMS" },
        { href: "/etudes-de-cas", title: "Études de cas" },
        { href: "/outils/benchmarking", title: "Benchmarking" },
      ];
    case "seo":
      return [
        ...base,
        { href: "/outils/benchmarking", title: "Benchmarking" },
        { href: "/audit-site-ia", title: "Audit IA" },
        { href: "/documentation/marketing-digital", title: "Marketing Digital" },
        { href: "/services", title: "Nos offres SEO" },
      ];
    case "design-ui-ux":
      return [
        ...base,
        { href: "/cahier-des-charges", title: "Cahier des charges" },
        { href: "/documentation/projet-site-web", title: "Projet site web" },
        { href: "/etudes-de-cas", title: "Études de cas" },
        { href: "/contact", title: "Démarrer un projet" },
      ];
    case "marketing-digital":
      return [
        ...base,
        { href: "/outils/simulateur-roi", title: "Simulateur ROI" },
        { href: "/documentation/seo", title: "Guide SEO" },
        { href: "/outils/benchmarking", title: "Benchmarking" },
        { href: "/contact", title: "Démarrer un projet" },
      ];
    case "projet-site-web":
      return [
        ...base,
        { href: "/cahier-des-charges", title: "Cahier des charges" },
        { href: "/audit-site-ia", title: "Audit IA" },
        { href: "/documentation/headless-cms", title: "Headless CMS" },
        { href: "/contact", title: "Démarrer un projet" },
      ];
    default:
      return [
        ...base,
        { href: "/audit-site-ia", title: "Audit IA" },
        { href: "/etudes-de-cas", title: "Études de cas" },
        { href: "/services", title: "Nos offres" },
        { href: "/contact", title: "Démarrer un projet" },
      ];
  }
}
