"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, FolderOpen } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

/* ─── Données catégories ──────────────────────────────────────────────────── */

interface CategoryMeta {
  slug: string;
  title: string;
  description: string;
  articleCount: string;
}

const ALL_CATEGORIES_FR: CategoryMeta[] = [
  {
    slug: "headless-cms",
    title: "Headless CMS",
    description: "Architecture découplée, API WordPress et Next.js.",
    articleCount: "35 articles",
  },
  {
    slug: "design-ui-ux",
    title: "Design & UI/UX",
    description: "Identité visuelle, charte graphique et maquettes.",
    articleCount: "20 articles",
  },
  {
    slug: "marketing-digital",
    title: "Marketing Digital",
    description: "Stratégie, marque et visibilité en ligne.",
    articleCount: "12 articles",
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Référencement, mots-clés et arborescence.",
    articleCount: "10 articles",
  },
  {
    slug: "projet-site-web",
    title: "Projet de site web",
    description: "Cahier des charges, pilotage et bonnes pratiques.",
    articleCount: "8 articles",
  },
  {
    slug: "wordpress",
    title: "WordPress",
    description: "Thèmes, plugins et bonnes pratiques.",
    articleCount: "8 articles",
  },
];

const ALL_CATEGORIES_EN: CategoryMeta[] = [
  {
    slug: "headless-cms",
    title: "Headless CMS",
    description: "Decoupled architecture, WordPress API and Next.js.",
    articleCount: "35 articles",
  },
  {
    slug: "design-ui-ux",
    title: "Design & UI/UX",
    description: "Brand identity, design system and mockups.",
    articleCount: "20 articles",
  },
  {
    slug: "marketing-digital",
    title: "Digital marketing",
    description: "Strategy, brand and online visibility.",
    articleCount: "12 articles",
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Search ranking, keywords and information architecture.",
    articleCount: "10 articles",
  },
  {
    slug: "projet-site-web",
    title: "Web project",
    description: "Specifications, project management and best practices.",
    articleCount: "8 articles",
  },
  {
    slug: "wordpress",
    title: "WordPress",
    description: "Themes, plugins and best practices.",
    articleCount: "8 articles",
  },
];

/* ─── Relations entre catégories ──────────────────────────────────────────── */

const RELATED_CATEGORIES: Record<string, string[]> = {
  "headless-cms": ["wordpress", "seo", "projet-site-web"],
  wordpress: ["headless-cms", "design-ui-ux", "projet-site-web"],
  seo: ["marketing-digital", "headless-cms", "projet-site-web"],
  "design-ui-ux": ["projet-site-web", "marketing-digital", "wordpress"],
  "marketing-digital": ["seo", "design-ui-ux", "projet-site-web"],
  "projet-site-web": ["headless-cms", "design-ui-ux", "seo"],
  blog: ["headless-cms", "wordpress"],
};

/* ─── Composant : liens croisés sur pages catégorie ──────────────────────── */

interface CrossCategoryNavProps {
  currentCategory: string;
}

export function CrossCategoryNav({ currentCategory }: CrossCategoryNavProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const allCategories = isEn ? ALL_CATEGORIES_EN : ALL_CATEGORIES_FR;
  const relatedSlugs = RELATED_CATEGORIES[currentCategory] || [];
  const relatedCategories = relatedSlugs
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter(Boolean) as CategoryMeta[];

  if (relatedCategories.length === 0) return null;

  return (
    <section style={{ marginTop: "4rem", borderTop: "1px solid var(--rule)", paddingTop: "2.5rem" }}>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: "var(--ink)",
        marginBottom: "0.375rem",
      }}>
        {isEn ? "Related categories" : "Catégories associées"}
      </h2>
      <p style={{ fontSize: "0.875rem", color: "var(--muted-color)", marginBottom: "1.5rem" }}>
        {isEn
          ? "Continue exploring with complementary topics."
          : "Continuez votre exploration avec des thématiques complémentaires."}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        background: "var(--rule)",
      }}>
        {relatedCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/documentation/${cat.slug}` as never}
            className="hover-row"
            style={{
              display: "block",
              padding: "1.25rem",
              background: "var(--paper)",
              textDecoration: "none",
            }}
          >
            <FolderOpen style={{ width: "1.125rem", height: "1.125rem", color: "var(--accent-color)", marginBottom: "0.5rem" }} />
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              fontWeight: 400,
              color: "var(--ink)",
              marginBottom: "0.25rem",
            }}>
              {cat.title}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-color)", lineHeight: 1.4 }}>
              {cat.description}
            </p>
            <span style={{
              fontSize: "0.75rem",
              color: "var(--muted-color)",
              fontFamily: "var(--font-mono)",
              marginTop: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}>
              {cat.articleCount}
              <ArrowRight style={{ width: "0.75rem", height: "0.75rem" }} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─── Composant : grille complète pour la page hub ────────────────────────── */

export function AllCategoriesGrid() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const allCategories = isEn ? ALL_CATEGORIES_EN : ALL_CATEGORIES_FR;

  return (
    <section style={{ marginTop: "3rem", borderTop: "1px solid var(--rule)", paddingTop: "2.5rem", borderBottom: "1px solid var(--rule)", paddingBottom: "2.5rem" }}>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: "var(--ink)",
        marginBottom: "0.375rem",
      }}>
        {isEn ? "Explore the documentation" : "Explorer la documentation"}
      </h2>
      <p style={{ fontSize: "0.875rem", color: "var(--muted-color)", marginBottom: "1.5rem" }}>
        {isEn
          ? "All guides and resources, organized by topic."
          : "Tous nos guides et ressources, organisés par thématique."}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        background: "var(--rule)",
      }}>
        {allCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/documentation/${cat.slug}` as never}
            className="hover-row"
            style={{
              display: "block",
              padding: "1.25rem",
              background: "var(--paper)",
              textDecoration: "none",
            }}
          >
            <FolderOpen style={{ width: "1.125rem", height: "1.125rem", color: "var(--accent-color)", marginBottom: "0.5rem" }} />
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--ink)",
              marginBottom: "0.25rem",
            }}>
              {cat.title}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-color)", lineHeight: 1.4 }}>
              {cat.description}
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid var(--rule)",
              marginTop: "0.75rem",
              paddingTop: "0.75rem",
            }}>
              <span className="annot">{cat.articleCount}</span>
              <ArrowRight style={{ width: "0.875rem", height: "0.875rem", color: "var(--muted-color)" }} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
