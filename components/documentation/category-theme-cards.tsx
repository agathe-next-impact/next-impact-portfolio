"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";
import {
  BookOpen,
  Database,
  Monitor,
  Shield,
  Rocket,
  Palette,
  FileText,
  Eye,
  Layout,
  PenTool,
  Search,
  Target,
  GitBranch,
  BarChart,
  Briefcase,
  Share2,
  Megaphone,
  Users,
  Plug,
  Layers,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ThemeCard {
  icon: LucideIcon;
  title: string;
  description: string;
  slugs: string[];
}

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
}

/* ─── Thèmes par catégorie ───────────────────────────────────────────────── */

const CATEGORY_THEMES: Record<string, ThemeCard[]> = {
  "headless-cms": [
    {
      icon: BookOpen,
      title: "Fondations",
      description: "Comprendre l'architecture headless et décider",
      slugs: [
        "comprendre-le-headless",
        "pourquoi-le-headless",
        "comment-fonctionne-le-headless",
        "dois-je-passer-au-headless",
        "quand-utiliser-wordpress-headless",
      ],
    },
    {
      icon: Database,
      title: "Backend & API",
      description: "WordPress comme backend, REST et GraphQL",
      slugs: [
        "wordpress-headless-en-pratique",
        "api-rest-wordpress",
        "wpgraphql",
        "custom-post-types-et-acf",
      ],
    },
    {
      icon: Monitor,
      title: "Frontend Next.js",
      description: "Développer avec Next.js et React",
      slugs: [
        "les-technos-frontend",
        "nextjs-pour-wordpress-headless",
        "rendu-nextjs-ssg-ssr-isr",
        "gestion-des-medias-headless",
      ],
    },
    {
      icon: Shield,
      title: "Production",
      description: "Sécurité, performance et workflows éditoriaux",
      slugs: [
        "gerer-le-contenu",
        "preview-et-workflow-editorial",
        "authentification-jwt-headless",
        "securite-wordpress-headless",
        "performance-et-core-web-vitals",
        "seo-pour-architecture-headless",
      ],
    },
    {
      icon: Rocket,
      title: "Déploiement",
      description: "Mise en ligne, migration et cas avancés",
      slugs: [
        "herbergement-et-mise-en-ligne",
        "deploiement-vercel-nextjs",
        "migration-monolithique-vers-headless",
        "comment-creer-un-headless",
        "woocommerce-headless",
        "internationalisation-headless",
      ],
    },
  ],
  "design-ui-ux": [
    {
      icon: Palette,
      title: "Identité visuelle",
      description: "Construire une identité de marque cohérente",
      slugs: ["identite-visuelle", "creer-son-identite-visuelle"],
    },
    {
      icon: FileText,
      title: "Charte graphique",
      description: "Formaliser les règles visuelles du projet",
      slugs: ["charte-graphique", "creer-une-charte-graphique"],
    },
    {
      icon: Eye,
      title: "UX Design",
      description: "Concevoir l'expérience utilisateur",
      slugs: ["ux", "definir-son-ux"],
    },
    {
      icon: Layout,
      title: "UI Design",
      description: "Créer des interfaces efficaces",
      slugs: ["ui", "definir-son-ui"],
    },
    {
      icon: PenTool,
      title: "Maquettage",
      description: "Wireframes et prototypes",
      slugs: ["pourquoi-des-maquettes", "comment-creer-des-maquettes"],
    },
  ],
  seo: [
    {
      icon: Search,
      title: "Vision stratégique",
      description: "Penser le référencement dès le départ",
      slugs: ["penser-seo-en-amont"],
    },
    {
      icon: Target,
      title: "Planification",
      description: "Planifier les actions SEO en amont",
      slugs: ["planifier-seo-en-amont"],
    },
    {
      icon: GitBranch,
      title: "Architecture",
      description: "Structurer l'arborescence du site",
      slugs: ["definir-l-arborescence"],
    },
    {
      icon: FileText,
      title: "Mots-clés",
      description: "Cocon sémantique et recherche de mots-clés",
      slugs: ["mots-cles-et-cocon-semantique"],
    },
    {
      icon: BarChart,
      title: "Outils",
      description: "Comparatif des outils d'analyse SEO",
      slugs: ["outils-seo"],
    },
  ],
  "marketing-digital": [
    {
      icon: Target,
      title: "Fondamentaux",
      description: "Les bases du marketing digital",
      slugs: ["strategie-marketing"],
    },
    {
      icon: Briefcase,
      title: "Plan d'action",
      description: "Définir et exécuter sa stratégie",
      slugs: ["definir-sa-strategie-marketing"],
    },
    {
      icon: Palette,
      title: "Image de marque",
      description: "Positionnement et stratégie de marque",
      slugs: ["strategie-de-marque", "mettre-en-oeuvre-strategie-de-marque"],
    },
    {
      icon: Share2,
      title: "Réseaux sociaux",
      description: "Présence et visibilité sociale",
      slugs: ["presence-sur-les-reseaux-sociaux"],
    },
    {
      icon: Megaphone,
      title: "Stratégie sociale",
      description: "Élaborer un plan de médias sociaux",
      slugs: ["definir-sa-strategie-de-medias-sociaux"],
    },
  ],
  "projet-site-web": [
    {
      icon: FileText,
      title: "Cahier des charges",
      description: "Définir le périmètre et les exigences",
      slugs: ["cahier-des-charges"],
    },
    {
      icon: Layers,
      title: "Les 6 étapes",
      description: "Processus de création de A à Z",
      slugs: ["creer-site-web-6-etapes"],
    },
    {
      icon: Users,
      title: "Pilotage",
      description: "Pourquoi structurer son projet web",
      slugs: ["pourquoi-gerer-projet-web"],
    },
    {
      icon: GitBranch,
      title: "Guide pratique",
      description: "Méthodes et outils de gestion",
      slugs: ["gestion-projet-web-guide-pratique"],
    },
    {
      icon: CheckCircle,
      title: "Vue d'ensemble",
      description: "Tous les articles du thème",
      slugs: [
        "cahier-des-charges",
        "creer-site-web-6-etapes",
        "pourquoi-gerer-projet-web",
        "gestion-projet-web-guide-pratique",
      ],
    },
  ],
  wordpress: [
    {
      icon: BookOpen,
      title: "Découvrir",
      description: "Pourquoi choisir WordPress",
      slugs: ["pourquoi-utiliser-wordpress"],
    },
    {
      icon: Palette,
      title: "Thèmes",
      description: "Choisir et configurer son thème",
      slugs: ["les-themes"],
    },
    {
      icon: Plug,
      title: "Plugins",
      description: "Étendre les fonctionnalités",
      slugs: ["les-plugins"],
    },
    {
      icon: Shield,
      title: "Bonnes pratiques",
      description: "Sécurité, performance et maintenance",
      slugs: ["bonnes-pratiques-wordpress"],
    },
    {
      icon: CheckCircle,
      title: "Vue d'ensemble",
      description: "Tous les articles WordPress",
      slugs: [
        "pourquoi-utiliser-wordpress",
        "les-themes",
        "les-plugins",
        "bonnes-pratiques-wordpress",
      ],
    },
  ],
  blog: [
    {
      icon: Rocket,
      title: "Migration",
      description: "Passer au WordPress headless",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: BookOpen,
      title: "Analyses",
      description: "Retours d'expérience et tendances",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: Monitor,
      title: "Technique",
      description: "Aspects techniques du headless",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: Briefcase,
      title: "Décision",
      description: "Aide à la prise de décision",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: Target,
      title: "Stratégie",
      description: "Approche stratégique du web moderne",
      slugs: ["passage-wp-headless"],
    },
  ],
};

/* ─── Composant principal ────────────────────────────────────────────────── */

export function CategoryPageContent({
  articles,
  category,
}: {
  articles: Article[];
  category: string;
}) {
  const [activeTheme, setActiveTheme] = useState<number | null>(null);
  const { profileId } = useDocumentationMode();

  const themes = CATEGORY_THEMES[category];

  const filteredArticles =
    activeTheme !== null && themes
      ? articles.filter((a) => themes[activeTheme].slugs.includes(a.slug))
      : articles;

  return (
    <>
      {/* Theme cards */}
      {themes && (
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {themes.map((theme, index) => {
              const Icon = theme.icon;
              const isActive = activeTheme === index;
              const count = articles.filter((a) =>
                theme.slugs.includes(a.slug)
              ).length;

              return (
                <motion.button
                  key={theme.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  onClick={() =>
                    setActiveTheme(isActive ? null : index)
                  }
                  className={cn(
                    "group relative rounded-2xl p-4 border text-left transition-all duration-200",
                    isActive
                      ? "bg-regularblue/20 border-regularblue/40 shadow-lg shadow-regularblue/10"
                      : "bg-darkblue/40 border-lightblue/10 hover:bg-darkblue/60 hover:border-lightblue/20"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                        isActive
                          ? "bg-regularblue/30"
                          : "bg-lightblue/10 group-hover:bg-lightblue/20"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-lightblue/80 group-hover:text-lightblue"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-mono tabular-nums rounded-full px-1.5 py-0.5",
                        isActive
                          ? "bg-regularblue/30 text-white/80"
                          : "bg-darkblue/60 text-white/80"
                      )}
                    >
                      {count}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "font-googletitre text-sm font-medium leading-tight transition-colors",
                      isActive ? "text-white" : "text-white/80"
                    )}
                  >
                    {theme.title}
                  </p>
                  <p className="text-xs text-white/80 font-googletexte mt-0.5 line-clamp-2">
                    {theme.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Active filter indicator */}
          <AnimatePresence>
            {activeTheme !== null && themes[activeTheme] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80 font-googletexte">
                    Filtre actif : {themes[activeTheme].title}
                  </span>
                  <span className="text-xs text-white/80">·</span>
                  <button
                    onClick={() => setActiveTheme(null)}
                    className="text-xs text-regularblue/80 hover:text-regularblue font-googletexte transition-colors"
                  >
                    Afficher tout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Article grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => {
            const relevant = isArticleRelevantToProfile(
              article.category,
              article.slug,
              profileId
            );
            return (
              <motion.div
                key={article.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl bg-mediumblue/80 backdrop-blur-sm p-6 border border-lightblue/10 hover:border-lightblue/30 hover:shadow-2xl hover:shadow-regularblue/10 transition-all duration-300",
                  profileId && !relevant && "opacity-40 hover:opacity-70"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-googletitre text-xl font-medium text-white/90 group-hover:text-white transition-colors">
                      {article.title}
                    </h3>
                    {profileId && relevant && (
                      <span className="shrink-0 rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-googletexte text-orange/80">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 font-googletexte line-clamp-3">
                    {article.description}
                  </p>
                </div>
                <Link
                  href={`/documentation/${article.category}/${article.slug}`}
                  className="absolute inset-0 rounded-3xl"
                  aria-label={article.title}
                >
                  <span className="sr-only">{article.title}</span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
