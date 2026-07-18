"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { FileText, FolderOpen } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ThemeCard {
  icon: string;
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
  // Groupes refondus sur les 15 articles conservés après l'élagage vague 5
  // (plan : .claude/docs/plan-fusion-headless.md).
  "wordpress-headless": [
    {
      icon: "/icons/layers-icon.svg",
      title: "Fondations",
      description: "Comprendre l'architecture headless et décider",
      slugs: [
        "comprendre-le-headless",
        "dois-je-passer-au-headless",
      ],
    },
    {
      icon: "/icons/api-icon.svg",
      title: "Backend & API",
      description: "WordPress comme backend, REST et GraphQL",
      slugs: [
        "api-rest-wordpress",
        "wpgraphql",
        "custom-post-types-et-acf",
      ],
    },
    {
      icon: "/icons/code-icon.svg",
      title: "Frontend Next.js",
      description: "Développer avec Next.js, viser un Lighthouse à 100",
      slugs: [
        "nextjs-pour-wordpress-headless",
        "performance-et-core-web-vitals",
      ],
    },
    {
      icon: "/icons/shield-icon.svg",
      title: "Production",
      description: "Contenu au quotidien, sécurité et SEO",
      slugs: [
        "gerer-le-contenu",
        "securite-wordpress-headless",
        "seo-pour-architecture-headless",
      ],
    },
    {
      icon: "/icons/rocket-icon.svg",
      title: "Déploiement",
      description: "Mise en ligne, migration et cas avancés",
      slugs: [
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
      icon: "/icons/brand-reach-icon.svg",
      title: "Identité visuelle",
      description: "Construire une identité de marque cohérente",
      slugs: ["identite-visuelle", "creer-son-identite-visuelle"],
    },
    {
      icon: "/icons/content-icon.svg",
      title: "Charte graphique",
      description: "Formaliser les règles visuelles du projet",
      slugs: ["charte-graphique", "creer-une-charte-graphique"],
    },
    {
      icon: "/icons/scan-icon.svg",
      title: "UX Design",
      description: "Concevoir l'expérience utilisateur",
      slugs: ["ux", "definir-son-ux"],
    },
    {
      icon: "/icons/frontend-icon.svg",
      title: "UI Design",
      description: "Créer des interfaces efficaces",
      slugs: ["ui", "definir-son-ui"],
    },
    {
      icon: "/icons/dashboard-icon.svg",
      title: "Maquettage",
      description: "Wireframes et prototypes",
      slugs: ["pourquoi-des-maquettes", "comment-creer-des-maquettes"],
    },
  ],
  seo: [
    {
      icon: "/icons/seo-icon.svg",
      title: "Vision stratégique",
      description: "Penser le référencement dès le départ",
      slugs: ["penser-seo-en-amont"],
    },
    {
      icon: "/icons/workflow-icon.svg",
      title: "Planification",
      description: "Planifier les actions SEO en amont",
      slugs: ["planifier-seo-en-amont"],
    },
    {
      icon: "/icons/layers-icon.svg",
      title: "Architecture",
      description: "Structurer l'arborescence du site",
      slugs: ["definir-l-arborescence"],
    },
    {
      icon: "/icons/scan-icon.svg",
      title: "Mots-clés",
      description: "Cocon sémantique et recherche de mots-clés",
      slugs: ["mots-cles-et-cocon-semantique"],
    },
    {
      icon: "/icons/analytics-icon.svg",
      title: "Outils",
      description: "Comparatif des outils d'analyse SEO",
      slugs: ["outils-seo"],
    },
  ],
  "marketing-digital": [
    {
      icon: "/icons/growth-icon.svg",
      title: "Fondamentaux",
      description: "Les bases du marketing digital",
      slugs: ["strategie-marketing"],
    },
    {
      icon: "/icons/workflow-icon.svg",
      title: "Plan d'action",
      description: "Définir et exécuter sa stratégie",
      slugs: ["definir-sa-strategie-marketing"],
    },
    {
      icon: "/icons/brand-reach-icon.svg",
      title: "Image de marque",
      description: "Positionnement et stratégie de marque",
      slugs: ["strategie-de-marque", "mettre-en-oeuvre-strategie-de-marque"],
    },
    {
      icon: "/icons/globe-network-icon.svg",
      title: "Réseaux sociaux",
      description: "Présence et visibilité sociale",
      slugs: ["presence-sur-les-reseaux-sociaux"],
    },
    {
      icon: "/icons/notification-icon.svg",
      title: "Stratégie sociale",
      description: "Élaborer un plan de médias sociaux",
      slugs: ["definir-sa-strategie-de-medias-sociaux"],
    },
  ],
  "projet-site-web": [
    {
      icon: "/icons/content-icon.svg",
      title: "Cahier des charges",
      description: "Définir le périmètre et les exigences",
      slugs: ["cahier-des-charges"],
    },
    {
      icon: "/icons/workflow-icon.svg",
      title: "Les 6 étapes",
      description: "Processus de création de A à Z",
      slugs: ["creer-site-web-6-etapes"],
    },
    {
      icon: "/icons/team-icon.svg",
      title: "Pilotage",
      description: "Pourquoi structurer son projet web",
      slugs: ["pourquoi-gerer-projet-web"],
    },
    {
      icon: "/icons/settings-icon.svg",
      title: "Guide pratique",
      description: "Méthodes et outils de gestion",
      slugs: ["gestion-projet-web-guide-pratique"],
    },
    {
      icon: "/icons/dashboard-icon.svg",
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
      icon: "/icons/wordpress-icon.svg",
      title: "Découvrir",
      description: "Pourquoi choisir WordPress",
      slugs: ["pourquoi-utiliser-wordpress"],
    },
    {
      icon: "/icons/frontend-icon.svg",
      title: "Thèmes",
      description: "Choisir et configurer son thème",
      slugs: ["les-themes"],
    },
    {
      icon: "/icons/plugin-icon.svg",
      title: "Plugins",
      description: "Étendre les fonctionnalités",
      slugs: ["les-plugins"],
    },
    {
      icon: "/icons/shield-icon.svg",
      title: "Bonnes pratiques",
      description: "Sécurité, performance et maintenance",
      slugs: ["bonnes-pratiques-wordpress"],
    },
    {
      icon: "/icons/dashboard-icon.svg",
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
  // Catégorie doc « blog » éteinte (vague 5) : /documentation/blog → 301 /blog.
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
      {/* Cartes de thèmes — cellules bordées jointives */}
      {themes && (
        <div className="mb-10">
          <Stagger
            className={cn(
              "grid grid-cols-2 border-l border-t border-dark-gray sm:grid-cols-3",
              themes.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4",
            )}
          >
            {themes.map((theme, index) => {
              const isActive = activeTheme === index;
              const count = articles.filter((a) =>
                theme.slugs.includes(a.slug)
              ).length;

              return (
                <StaggerItem key={theme.title} className="flex">
                  <button
                    type="button"
                    onClick={() => setActiveTheme(isActive ? null : index)}
                    aria-pressed={isActive}
                    className={cn(
                      "group flex w-full flex-col border-b border-r border-dark-gray p-5 text-left transition-colors",
                      isActive
                        ? "bg-accent-secondary/10"
                        : "hover:bg-jet/40",
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <FolderOpen
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive ? "text-accent-secondary" : "text-mid-gray",
                        )}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                        {count}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "font-light leading-snug tracking-tight text-foreground",
                        isActive && "text-accent-secondary",
                      )}
                    >
                      {theme.title}
                    </p>
                    <p className="mt-0.5 font-inter-tight text-xs leading-relaxed text-mid-gray">
                      {theme.description}
                    </p>
                  </button>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* Indicateur de filtre actif */}
          {activeTheme !== null && themes[activeTheme] && (
            <div className="mt-3 flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                Filtre actif : {themes[activeTheme].title}
              </span>
              <span className="text-dark-gray" aria-hidden>
                ·
              </span>
              <button
                type="button"
                onClick={() => setActiveTheme(null)}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-secondary transition-colors hover:text-foreground"
              >
                Afficher tout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grille d'articles */}
      <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
        {filteredArticles.map((article) => {
          const relevant = isArticleRelevantToProfile(
            article.category,
            article.slug,
            profileId
          );
          return (
            <Link
              key={article.slug}
              href={`/documentation/${article.category}/${article.slug}` as never}
              className={cn(
                "group block border-t border-dark-gray py-5 transition-opacity",
                profileId && !relevant ? "opacity-40" : "opacity-100",
              )}
            >
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-accent-secondary"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  {profileId && relevant && (
                    <span className="mb-1.5 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                      Recommandé
                    </span>
                  )}
                  <h3 className="font-light leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent-secondary">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-inter-tight text-[0.8125rem] leading-relaxed text-mid-gray">
                    {article.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
