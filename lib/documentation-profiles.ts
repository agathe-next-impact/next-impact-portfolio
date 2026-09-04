import {
  Briefcase,
  User,
  Code,
  BookOpen,
  FileText,
  Megaphone,
  Zap,
  Globe,
  Palette,
  Search,
  Layers,
  Database,
  Rocket,
  SearchCheck,
  Smartphone,
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
  external?: boolean;
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

  // ── Headless CMS (15 — après élagage vague 5) ────────────────────────────
  // Fondations
  "wordpress-headless/comprendre-le-headless":              ["decideur", "developpeur"],
  "wordpress-headless/dois-je-passer-au-headless":          ["decideur"],
  // Backend WordPress
  "wordpress-headless/api-rest-wordpress":                  ["developpeur"],
  "wordpress-headless/wpgraphql":                           ["developpeur"],
  "wordpress-headless/custom-post-types-et-acf":            ["developpeur", "utilisateur"],
  // Frontend Next.js
  "wordpress-headless/nextjs-pour-wordpress-headless":      ["developpeur"],
  // Opérations
  "wordpress-headless/gerer-le-contenu":                    ["utilisateur", "developpeur"],
  "wordpress-headless/securite-wordpress-headless":         ["developpeur", "decideur"],
  // Performance & SEO
  "wordpress-headless/performance-et-core-web-vitals":      ["developpeur", "decideur"],
  "wordpress-headless/seo-pour-architecture-headless":      ["developpeur", "utilisateur"],
  // Déploiement & Migration
  "wordpress-headless/deploiement-vercel-nextjs":           ["developpeur"],
  "wordpress-headless/migration-monolithique-vers-headless": ["decideur", "developpeur"],
  "wordpress-headless/comment-creer-un-headless":           ["developpeur", "utilisateur"],
  // Avancé
  "wordpress-headless/woocommerce-headless":                ["decideur", "developpeur"],
  "wordpress-headless/internationalisation-headless":       ["developpeur", "utilisateur"],

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

  // ── Applications web & mobile (17) ───────────────────────────────────────
  // Web app
  "applications-web-mobile/quest-ce-quune-web-app":                        ["decideur", "utilisateur"],
  "applications-web-mobile/site-ou-web-app-comment-choisir":               ["decideur"],
  "applications-web-mobile/anatomie-dune-web-app":                         ["decideur", "developpeur"],
  "applications-web-mobile/ladmin-autonome-comme-wordpress-mais-sur-mesure": ["decideur", "utilisateur"],
  "applications-web-mobile/comptes-utilisateurs-et-securite":              ["decideur", "developpeur"],
  // Plateforme web
  "applications-web-mobile/plateforme-metier-vs-saas":                     ["decideur"],
  "applications-web-mobile/marketplace-et-annuaire-b2b":                   ["decideur"],
  "applications-web-mobile/espace-membre-portail-client-extranet":         ["decideur", "utilisateur"],
  "applications-web-mobile/plateforme-de-reservation-les-briques-indispensables": ["decideur", "utilisateur"],
  "applications-web-mobile/du-tableur-a-la-plateforme-web":                ["decideur", "utilisateur"],
  "applications-web-mobile/interconnecter-sa-plateforme-crm-erp-paiement": ["decideur", "developpeur"],
  "applications-web-mobile/migrer-dun-saas-vers-une-web-app-sur-mesure":   ["decideur", "developpeur"],
  // PWA & mobile
  "applications-web-mobile/pwa-vs-application-native":                     ["decideur", "developpeur"],
  "applications-web-mobile/installable-sans-store-le-pouvoir-de-la-pwa":   ["decideur", "utilisateur", "developpeur"],
  // Décider & budgéter
  "applications-web-mobile/quand-wordpress-nest-plus-le-bon-outil":        ["decideur", "developpeur"],
  "applications-web-mobile/combien-coute-une-web-app-sur-mesure":          ["decideur"],
  "applications-web-mobile/delai-et-jalons-dune-web-app":                  ["decideur", "utilisateur"],

  // ── SEO (5) ──────────────────────────────────────────────────────────────
  "seo/penser-seo-en-amont":                       ["decideur", "utilisateur"],
  "seo/planifier-seo-en-amont":                    ["utilisateur", "developpeur"],
  "seo/definir-l-arborescence":                    ["utilisateur", "developpeur"],
  "seo/mots-cles-et-cocon-semantique":             ["utilisateur", "developpeur"],
  "seo/outils-seo":                                ["developpeur"],
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
      slug: "comprendre-le-headless",
      category: "wordpress-headless",
      title: "Comprendre le headless",
      description: "L'avantage stratégique du découplage front/back.",
    },
    {
      slug: "dois-je-passer-au-headless",
      category: "wordpress-headless",
      title: "Dois-je passer au headless ?",
      description: "Auto-diagnostic pour évaluer la pertinence.",
    },
    {
      slug: "migration-monolithique-vers-headless",
      category: "wordpress-headless",
      title: "Migrer vers le headless",
      description: "Les étapes de migration sans interruption.",
    },
    {
      slug: "performance-et-core-web-vitals",
      category: "wordpress-headless",
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
      category: "wordpress-headless",
      title: "Gérer le contenu en headless",
      description: "L'interface d'administration reste identique.",
    },
    {
      slug: "custom-post-types-et-acf",
      category: "wordpress-headless",
      title: "Structurer le contenu : CPT et ACF",
      description: "Des champs structurés pour publier sans casse.",
    },
    {
      slug: "performance-et-core-web-vitals",
      category: "wordpress-headless",
      title: "Performance et Core Web Vitals",
      description: "Un site rapide pour vos visiteurs, médias compris.",
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
      category: "wordpress-headless",
      title: "Comprendre le headless",
      description: "Les fondamentaux de l'architecture découplée.",
    },
    {
      slug: "api-rest-wordpress",
      category: "wordpress-headless",
      title: "L'API REST WordPress",
      description: "Endpoints, requêtes et authentification.",
    },
    {
      slug: "nextjs-pour-wordpress-headless",
      category: "wordpress-headless",
      title: "Next.js pour WordPress headless",
      description: "Configurer Next.js et connecter l'API WordPress.",
    },
    {
      slug: "securite-wordpress-headless",
      category: "wordpress-headless",
      title: "Sécuriser le WordPress headless",
      description: "Surface d'attaque réduite, authentification, JWT.",
    },
    {
      slug: "deploiement-vercel-nextjs",
      category: "wordpress-headless",
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
      gradient: "bg-mediumblue/40 backdrop-blur-xl border-orange/20",
      textColor: "text-white",
    },
    {
      id: "dec-audit",
      title: "Audit de migration IA",
      description: "Analysez votre site : performance, SEO et conversion.",
      icon: SearchCheck,
      href: "/audit-site-web",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
      textColor: "text-white",
    },
    {
      id: "dec-headless",
      title: "Comprendre le headless",
      description: "L'architecture découplée expliquée.",
      icon: BookOpen,
      href: "/documentation/wordpress-headless",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-lightblue/20",
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
      gradient: "bg-darkblue/60 backdrop-blur-xl border-orange/20",
      textColor: "text-white",
    },
    {
      id: "dec-apps",
      title: "Web app & plateforme",
      description: "Quand WordPress n'est plus le bon outil : web app, marketplace, PWA.",
      icon: Smartphone,
      href: "/documentation/applications-web-mobile",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
      textColor: "text-white",
    },
    {
      id: "dec-performance",
      title: "Performance & ROI",
      description: "Core Web Vitals et impact SEO.",
      icon: Zap,
      href: "/documentation/wordpress-headless/performance-et-core-web-vitals",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-regularblue/20",
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
      gradient: "bg-mediumblue/40 backdrop-blur-xl border-regularblue/20",
      textColor: "text-white",
    },
    {
      id: "util-audit",
      title: "Audit de migration IA",
      description: "Analysez votre site : performance, SEO et conversion.",
      icon: SearchCheck,
      href: "/audit-site-web",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
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
      gradient: "bg-darkblue/60 backdrop-blur-xl border-lightblue/20",
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
      gradient: "bg-darkblue/60 backdrop-blur-xl border-regularblue/20",
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
      gradient: "bg-darkblue/60 backdrop-blur-xl border-lightblue/20",
      textColor: "text-white",
    },
    {
      id: "util-apps",
      title: "Web app & plateforme",
      description: "Une admin sur-mesure pour votre logique métier : comme WordPress, mais pour votre activité.",
      icon: Smartphone,
      href: "/documentation/applications-web-mobile",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
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
      gradient: "bg-mediumblue/40 backdrop-blur-xl border-lightblue/20",
      textColor: "text-white",
    },
    {
      id: "dev-audit",
      title: "Audit de migration IA",
      description: "Analysez votre site : performance, SEO et conversion.",
      icon: SearchCheck,
      href: "/audit-site-web",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
      textColor: "text-white",
    },
    {
      id: "dev-architecture",
      title: "Architecture headless",
      description: "Fondations et principes du découplage.",
      icon: Layers,
      href: "/documentation/wordpress-headless",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-lightblue/20",
      textColor: "text-white",
    },
    {
      id: "dev-api",
      title: "API & Backend",
      description: "REST, GraphQL et WordPress.",
      icon: Database,
      href: "/documentation/wordpress-headless/api-rest-wordpress",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-lightblue/20",
      textColor: "text-white",
    },
    {
      id: "dev-deploiement",
      title: "Déploiement",
      description: "Vercel, CI/CD et mise en production.",
      icon: Rocket,
      href: "/documentation/wordpress-headless/deploiement-vercel-nextjs",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-regularblue/20",
      textColor: "text-white",
    },
    {
      id: "dev-apps",
      title: "Web app & plateforme",
      description: "Next.js + PostgreSQL serverless pour les web apps, PWA pour le mobile. Admin autonome sur-mesure.",
      icon: Smartphone,
      href: "/documentation/applications-web-mobile",
      colSpan: "md:col-span-1",
      rowSpan: "",
      gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
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
