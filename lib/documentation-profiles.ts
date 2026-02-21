import {
  Briefcase,
  User,
  Code,
  BookOpen,
  Megaphone,
  Zap,
  Globe,
  Palette,
  Search,
  Layers,
  Database,
  Rocket,
  SearchCheck,
  Network,
  type LucideIcon,
} from "lucide-react";

export type ProfileId = "decideur" | "utilisateur" | "developpeur";

export interface UserProfile {
  id: ProfileId;
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  accentColor: string;
}

export interface JourneyStep {
  slug: string;
  category: string;
  title: string;
  description: string;
}

export interface BentoCardConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colSpan: string;
  rowSpan: string;
  gradient: string;
  textColor: string;
}

// ─── Profils ────────────────────────────────────────────────────────────────

export const PROFILES: Record<ProfileId, UserProfile> = {
  decideur: {
    id: "decideur",
    label: "Décideur",
    description:
      "Dirigeants, chefs de projet, ESS — Comprendre le « pourquoi » pour décider.",
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-orange/20 to-orange/5",
    accentColor: "text-orange",
  },
  utilisateur: {
    id: "utilisateur",
    label: "Utilisateur",
    description:
      "Content managers, marketing — Maîtriser le « comment » au quotidien.",
    icon: User,
    gradient: "bg-gradient-to-br from-regularblue/20 to-regularblue/5",
    accentColor: "text-extralightblue",
  },
  developpeur: {
    id: "developpeur",
    label: "Développeur",
    description:
      "Devs, freelances, techniques — Implémenter avec les bonnes technos.",
    icon: Code,
    gradient: "bg-gradient-to-br from-lightblue/20 to-lightblue/5",
    accentColor: "text-lightblue",
  },
};

// ─── Mapping article-par-article ────────────────────────────────────────────
// Clé = "category/slug", valeurs = profils concernés.
// Un article peut appartenir à plusieurs profils.

const ARTICLE_PROFILES: Record<string, ProfileId[]> = {
  // ── Projet site web (4) ──────────────────────────────────────────────────
  "projet-site-web/cahier-des-charges":            ["decideur", "utilisateur"],
  "projet-site-web/creer-site-web-6-etapes":       ["decideur", "utilisateur"],
  "projet-site-web/pourquoi-gerer-projet-web":     ["decideur"],
  "projet-site-web/gestion-projet-web-guide-pratique": ["decideur", "utilisateur"],

  // ── Marketing digital (6) ────────────────────────────────────────────────
  "marketing-digital/definir-sa-strategie-marketing":      ["decideur", "utilisateur"],
  "marketing-digital/strategie-marketing":                 ["decideur", "utilisateur"],
  "marketing-digital/strategie-de-marque":                 ["decideur"],
  "marketing-digital/mettre-en-oeuvre-strategie-de-marque": ["decideur", "utilisateur"],
  "marketing-digital/presence-sur-les-reseaux-sociaux":    ["decideur", "utilisateur"],
  "marketing-digital/definir-sa-strategie-de-medias-sociaux": ["decideur", "utilisateur"],

  // ── Headless CMS (25) ────────────────────────────────────────────────────
  // Fondations
  "headless-cms/comprendre-le-headless":              ["decideur", "developpeur"],
  "headless-cms/pourquoi-le-headless":                ["decideur", "developpeur"],
  "headless-cms/comment-fonctionne-le-headless":      ["developpeur"],
  "headless-cms/dois-je-passer-au-headless":          ["decideur"],
  "headless-cms/quand-utiliser-wordpress-headless":   ["decideur", "developpeur"],
  // Backend WordPress
  "headless-cms/wordpress-headless-en-pratique":      ["developpeur"],
  "headless-cms/api-rest-wordpress":                  ["developpeur"],
  "headless-cms/wpgraphql":                           ["developpeur"],
  "headless-cms/custom-post-types-et-acf":            ["developpeur", "utilisateur"],
  // Frontend Next.js
  "headless-cms/les-technos-frontend":                ["developpeur"],
  "headless-cms/nextjs-pour-wordpress-headless":      ["developpeur"],
  "headless-cms/rendu-nextjs-ssg-ssr-isr":            ["developpeur"],
  "headless-cms/gestion-des-medias-headless":         ["developpeur", "utilisateur"],
  // Opérations
  "headless-cms/gerer-le-contenu":                    ["utilisateur", "developpeur"],
  "headless-cms/preview-et-workflow-editorial":       ["utilisateur", "developpeur"],
  "headless-cms/authentification-jwt-headless":       ["developpeur"],
  "headless-cms/securite-wordpress-headless":         ["developpeur", "decideur"],
  // Performance & SEO
  "headless-cms/performance-et-core-web-vitals":      ["developpeur", "decideur"],
  "headless-cms/seo-pour-architecture-headless":      ["developpeur", "utilisateur"],
  // Déploiement & Migration
  "headless-cms/herbergement-et-mise-en-ligne":       ["developpeur"],
  "headless-cms/deploiement-vercel-nextjs":           ["developpeur"],
  "headless-cms/migration-monolithique-vers-headless": ["decideur", "developpeur"],
  "headless-cms/comment-creer-un-headless":           ["developpeur", "utilisateur"],
  // Avancé
  "headless-cms/woocommerce-headless":                ["decideur", "developpeur"],
  "headless-cms/internationalisation-headless":       ["developpeur", "utilisateur"],

  // ── WordPress (4) ────────────────────────────────────────────────────────
  "wordpress/pourquoi-utiliser-wordpress":          ["decideur", "utilisateur"],
  "wordpress/bonnes-pratiques-wordpress":           ["utilisateur", "developpeur"],
  "wordpress/les-plugins":                          ["utilisateur", "developpeur"],
  "wordpress/les-themes":                           ["utilisateur", "developpeur"],

  // ── Design UI/UX (11) ────────────────────────────────────────────────────
  "design-ui-ux/identite-visuelle":                ["decideur", "utilisateur"],
  "design-ui-ux/charte-graphique":                 ["decideur", "utilisateur"],
  "design-ui-ux/creer-son-identite-visuelle":      ["decideur", "utilisateur"],
  "design-ui-ux/creer-une-charte-graphique":       ["utilisateur"],
  "design-ui-ux/ux":                               ["utilisateur", "developpeur"],
  "design-ui-ux/ui":                               ["utilisateur", "developpeur"],
  "design-ui-ux/definir-son-ux":                   ["utilisateur", "developpeur"],
  "design-ui-ux/definir-son-ui":                   ["utilisateur", "developpeur"],
  "design-ui-ux/pourquoi-des-maquettes":           ["decideur", "utilisateur"],
  "design-ui-ux/comment-creer-des-maquettes":      ["utilisateur", "developpeur"],

  // ── SEO (5) ──────────────────────────────────────────────────────────────
  "seo/penser-seo-en-amont":                       ["decideur", "utilisateur"],
  "seo/planifier-seo-en-amont":                    ["utilisateur", "developpeur"],
  "seo/definir-l-arborescence":                    ["utilisateur", "developpeur"],
  "seo/mots-cles-et-cocon-semantique":             ["utilisateur", "developpeur"],
  "seo/outils-seo":                                ["developpeur"],

  // ── Blog (1) ─────────────────────────────────────────────────────────────
  "blog/passage-wp-headless":                      ["decideur", "developpeur"],
};

// ─── Parcours guidés (5 articles clés par profil) ───────────────────────────

export const JOURNEYS: Record<ProfileId, JourneyStep[]> = {
  decideur: [
    {
      slug: "cahier-des-charges",
      category: "projet-site-web",
      title: "Rédiger un cahier des charges",
      description: "Cadrer votre projet avant de lancer quoi que ce soit.",
    },
    {
      slug: "pourquoi-le-headless",
      category: "headless-cms",
      title: "Pourquoi le headless ?",
      description: "L'avantage stratégique du découplage front/back.",
    },
    {
      slug: "dois-je-passer-au-headless",
      category: "headless-cms",
      title: "Dois-je passer au headless ?",
      description: "Auto-diagnostic pour évaluer la pertinence.",
    },
    {
      slug: "migration-monolithique-vers-headless",
      category: "headless-cms",
      title: "Migrer vers le headless",
      description: "Les étapes de migration sans interruption.",
    },
    {
      slug: "performance-et-core-web-vitals",
      category: "headless-cms",
      title: "Performance et Core Web Vitals",
      description: "L'impact mesurable sur le SEO et la conversion.",
    },
  ],
  utilisateur: [
    {
      slug: "pourquoi-utiliser-wordpress",
      category: "wordpress",
      title: "Pourquoi utiliser WordPress",
      description: "Les atouts de WordPress pour gérer votre contenu.",
    },
    {
      slug: "gerer-le-contenu",
      category: "headless-cms",
      title: "Gérer le contenu en headless",
      description: "L'interface d'administration reste identique.",
    },
    {
      slug: "preview-et-workflow-editorial",
      category: "headless-cms",
      title: "Prévisualisation et workflow",
      description: "Prévisualiser et publier en mode headless.",
    },
    {
      slug: "gestion-des-medias-headless",
      category: "headless-cms",
      title: "Gestion des médias",
      description: "Images, vidéos et fichiers en headless.",
    },
    {
      slug: "penser-seo-en-amont",
      category: "seo",
      title: "Penser SEO en amont",
      description: "Intégrer le référencement dès la conception.",
    },
  ],
  developpeur: [
    {
      slug: "comprendre-le-headless",
      category: "headless-cms",
      title: "Comprendre le headless",
      description: "Les fondamentaux de l'architecture découplée.",
    },
    {
      slug: "api-rest-wordpress",
      category: "headless-cms",
      title: "L'API REST WordPress",
      description: "Endpoints, requêtes et authentification.",
    },
    {
      slug: "nextjs-pour-wordpress-headless",
      category: "headless-cms",
      title: "Next.js pour WordPress headless",
      description: "Configurer Next.js et connecter l'API WordPress.",
    },
    {
      slug: "rendu-nextjs-ssg-ssr-isr",
      category: "headless-cms",
      title: "SSG, SSR et ISR avec Next.js",
      description: "Choisir la bonne stratégie de rendu par page.",
    },
    {
      slug: "deploiement-vercel-nextjs",
      category: "headless-cms",
      title: "Déployer avec Vercel",
      description: "Mettre en production le frontend Next.js.",
    },
  ],
};

// ─── Bento Grid configs par profil ──────────────────────────────────────────

export const BENTO_CONFIGS: Record<ProfileId, BentoCardConfig[]> = {
  decideur: [
    {
      id: "parcours-decideur",
      title: "Mon parcours",
      description: "5 articles pour comprendre, décider et lancer votre projet web.",
      icon: Briefcase,
      href: "#parcours",
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
      gradient: "bg-gradient-to-br from-orange/30 via-mediumblue to-darkblue",
      textColor: "text-white",
    },
    {
      id: "dec-audit",
      title: "Audit de migration IA",
      description: "Analysez votre site : performance, SEO et conversion.",
      icon: SearchCheck,
      href: "/audit-site-ia",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/90",
      textColor: "text-white",
    },
    {
      id: "dec-mindmap",
      title: "Mind Map",
      description: "Explorez l'architecture headless de façon interactive.",
      icon: Network,
      href: "/documentation/mind-map",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-lightblue/30 to-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "dec-headless",
      title: "Comprendre le headless",
      description: "L'architecture découplée expliquée.",
      icon: BookOpen,
      href: "/documentation/headless-cms",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "dec-marketing",
      title: "Marketing Digital",
      description: "Stratégie, marque et visibilité.",
      icon: Megaphone,
      href: "/documentation/marketing-digital",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-orange/20 to-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "dec-performance",
      title: "Performance & ROI",
      description: "Core Web Vitals et impact SEO.",
      icon: Zap,
      href: "/documentation/headless-cms/performance-et-core-web-vitals",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-regularblue/30 to-darkblue/90",
      textColor: "text-white",
    },
  ],
  utilisateur: [
    {
      id: "parcours-utilisateur",
      title: "Mon parcours",
      description: "5 articles pour maîtriser WordPress, le contenu et le SEO.",
      icon: User,
      href: "#parcours",
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
      gradient: "bg-gradient-to-br from-regularblue via-mediumblue to-darkblue",
      textColor: "text-white",
    },
    {
      id: "util-audit",
      title: "Audit de migration IA",
      description: "Analysez votre site : performance, SEO et conversion.",
      icon: SearchCheck,
      href: "/audit-site-ia",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/90",
      textColor: "text-white",
    },
    {
      id: "util-mindmap",
      title: "Mind Map",
      description: "Explorez l'architecture headless de façon interactive.",
      icon: Network,
      href: "/documentation/mind-map",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-lightblue/30 to-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "util-wordpress",
      title: "WordPress",
      description: "Gérer votre contenu au quotidien.",
      icon: Globe,
      href: "/documentation/wordpress",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "util-design",
      title: "Design & UI/UX",
      description: "Créer des interfaces engageantes.",
      icon: Palette,
      href: "/documentation/design-ui-ux",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-regularblue/20 to-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "util-seo",
      title: "SEO",
      description: "Être visible sur les moteurs.",
      icon: Search,
      href: "/documentation/seo",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-lightblue/20 to-darkblue/90",
      textColor: "text-white",
    },
  ],
  developpeur: [
    {
      id: "parcours-dev",
      title: "Mon parcours",
      description: "5 articles pour implémenter un site headless de bout en bout.",
      icon: Code,
      href: "#parcours",
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
      gradient: "bg-gradient-to-br from-lightblue/30 via-mediumblue to-darkblue",
      textColor: "text-white",
    },
    {
      id: "dev-audit",
      title: "Audit de migration IA",
      description: "Analysez votre site : performance, SEO et conversion.",
      icon: SearchCheck,
      href: "/audit-site-ia",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/90",
      textColor: "text-white",
    },
    {
      id: "dev-mindmap",
      title: "Mind Map",
      description: "Explorez l'architecture headless de façon interactive.",
      icon: Network,
      href: "/documentation/mind-map",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-lightblue/30 to-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "dev-architecture",
      title: "Architecture headless",
      description: "Fondations et principes du découplage.",
      icon: Layers,
      href: "/documentation/headless-cms",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "dev-api",
      title: "API & Backend",
      description: "REST, GraphQL et WordPress.",
      icon: Database,
      href: "/documentation/headless-cms/api-rest-wordpress",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-lightblue/20 to-mediumblue/80 backdrop-blur-sm",
      textColor: "text-white",
    },
    {
      id: "dev-deploiement",
      title: "Déploiement",
      description: "Vercel, CI/CD et mise en production.",
      icon: Rocket,
      href: "/documentation/headless-cms/deploiement-vercel-nextjs",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-gradient-to-br from-regularblue/30 to-darkblue/90",
      textColor: "text-white",
    },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Vérifie si un article est pertinent pour un profil donné.
 * Granularité article-par-article (pas seulement par catégorie).
 */
export function isArticleRelevantToProfile(
  category: string,
  slug: string,
  profileId: ProfileId | null
): boolean {
  if (!profileId) return true;
  const key = `${category}/${slug}`;
  const profiles = ARTICLE_PROFILES[key];
  if (!profiles) return false;
  return profiles.includes(profileId);
}

/**
 * Retourne le nombre d'articles pertinents pour un profil dans une catégorie.
 */
export function getRelevantCountForCategory(
  category: string,
  profileId: ProfileId | null
): number {
  if (!profileId) return 0;
  return Object.entries(ARTICLE_PROFILES).filter(
    ([key, profiles]) =>
      key.startsWith(`${category}/`) && profiles.includes(profileId)
  ).length;
}
