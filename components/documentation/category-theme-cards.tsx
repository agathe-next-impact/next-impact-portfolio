"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";
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
  "headless-cms": [
    {
      icon: "/icons/layers-icon.svg",
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
      icon: "/icons/api-icon.svg",
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
      icon: "/icons/code-icon.svg",
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
      icon: "/icons/shield-icon.svg",
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
      icon: "/icons/rocket-icon.svg",
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
  blog: [
    {
      icon: "/icons/migration-icon.svg",
      title: "Migration",
      description: "Passer au WordPress headless",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: "/icons/analytics-icon.svg",
      title: "Analyses",
      description: "Retours d'expérience et tendances",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: "/icons/code-icon.svg",
      title: "Technique",
      description: "Aspects techniques du headless",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: "/icons/scale-icon.svg",
      title: "Décision",
      description: "Aide à la prise de décision",
      slugs: ["passage-wp-headless"],
    },
    {
      icon: "/icons/growth-icon.svg",
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
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(themes.length, 5)}, 1fr)`,
            gap: "1px",
            background: "var(--rule)",
          }}>
            {themes.map((theme, index) => {
              const isActive = activeTheme === index;
              const count = articles.filter((a) =>
                theme.slugs.includes(a.slug)
              ).length;

              return (
                <button
                  key={theme.title}
                  onClick={() => setActiveTheme(isActive ? null : index)}
                  style={{
                    background: isActive ? "var(--paper-2)" : "var(--paper)",
                    padding: "1.25rem",
                    textAlign: "left",
                    border: "none",
                    borderBottom: isActive
                      ? "2px solid var(--ink)"
                      : "2px solid transparent",
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <FolderOpen style={{ width: "1.125rem", height: "1.125rem", color: "var(--accent-color)", flexShrink: 0 }} />
                    <span className="annot">{count}</span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "var(--ink)",
                    lineHeight: 1.3,
                    marginBottom: "0.25rem",
                  }}>
                    {theme.title}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", lineHeight: 1.4 }}>
                    {theme.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active filter indicator */}
          {activeTheme !== null && themes[activeTheme] && (
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="annot">
                Filtre actif : {themes[activeTheme].title}
              </span>
              <span style={{ color: "var(--rule-strong)" }}>·</span>
              <button
                onClick={() => setActiveTheme(null)}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent-color)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Afficher tout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Article grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0 4rem",
      }}>
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
              className="hover-row"
              style={{
                display: "block",
                borderTop: "1px solid var(--rule)",
                padding: "1.25rem 0",
                textDecoration: "none",
                opacity: profileId && !relevant ? 0.4 : 1,
                transition: "opacity 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <FileText style={{
                  width: "0.875rem",
                  height: "0.875rem",
                  color: "var(--accent-color)",
                  marginTop: "0.25rem",
                  flexShrink: 0,
                }} />
                <div>
                  {profileId && relevant && (
                    <span className="label" style={{ marginBottom: "0.375rem", display: "inline-block" }}>
                      Recommandé
                    </span>
                  )}
                  <h3 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "var(--ink)",
                    lineHeight: 1.35,
                    marginBottom: "0.25rem",
                  }}>
                    {article.title}
                  </h3>
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "var(--muted-color)",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
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
