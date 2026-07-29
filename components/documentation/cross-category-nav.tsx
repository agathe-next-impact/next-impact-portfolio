"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, FolderOpen } from "lucide-react";
import { useLocale } from "next-intl";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/visuals/spotlight-card";
import { cn } from "@/lib/utils";
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
    slug: "wordpress-headless",
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
    slug: "wordpress-headless",
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
  "wordpress-headless": ["wordpress", "seo", "projet-site-web"],
  wordpress: ["wordpress-headless", "design-ui-ux", "projet-site-web"],
  seo: ["marketing-digital", "wordpress-headless", "projet-site-web"],
  "design-ui-ux": ["projet-site-web", "marketing-digital", "wordpress"],
  "marketing-digital": ["seo", "design-ui-ux", "projet-site-web"],
  "projet-site-web": ["wordpress-headless", "design-ui-ux", "seo"],
};

/* ─── Carte de catégorie (cellule SpotlightCard) ──────────────────────────── */

function CategoryCell({
  cat,
  titleClassName,
}: {
  cat: CategoryMeta;
  titleClassName?: string;
}) {
  return (
    <Link
      href={`/documentation/${cat.slug}` as never}
      className="group block focus:outline-none"
    >
      <SpotlightCard className="h-full rounded-none border-0 bg-transparent p-6 transition-colors hover:bg-jet/40">
        <FolderOpen
          className="mb-4 h-4 w-4 text-accent-secondary"
          strokeWidth={1.5}
          aria-hidden
        />
        <h3
          className={cn(
            "font-light tracking-tight text-foreground",
            titleClassName ?? "text-lg",
          )}
        >
          {cat.title}
        </h3>
        <p className="mt-1.5 font-inter-tight text-sm leading-relaxed text-mid-gray">
          {cat.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-dark-gray pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          <span>{cat.articleCount}</span>
          <ArrowRight
            className="h-3.5 w-3.5 text-accent-secondary transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </SpotlightCard>
    </Link>
  );
}

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
    <section className="mt-16 border-t border-dark-gray pt-10">
      <Reveal>
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>{isEn ? "Related" : "À explorer"}</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
        </p>
        <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
          {isEn ? "Related categories" : "Catégories associées"}
        </h2>
        <p className="mt-1.5 max-w-xl font-inter-tight text-sm text-mid-gray md:text-base">
          {isEn
            ? "Continue exploring with complementary topics."
            : "Continuez votre exploration avec des thématiques complémentaires."}
        </p>
      </Reveal>

      <Stagger className="mt-6 grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3">
        {relatedCategories.map((cat) => (
          <StaggerItem
            key={cat.slug}
            className="border-b border-r border-dark-gray"
          >
            <CategoryCell cat={cat} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ─── Composant : grille complète pour la page hub ────────────────────────── */

export function AllCategoriesGrid() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const allCategories = isEn ? ALL_CATEGORIES_EN : ALL_CATEGORIES_FR;

  return (
    <section className="mt-12 border-y border-dark-gray py-10">
      <Reveal>
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>{isEn ? "Browse" : "Parcourir"}</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
        </p>
        <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
          {isEn ? "Explore the documentation" : "Explorer la documentation"}
        </h2>
        <p className="mt-1.5 max-w-xl font-inter-tight text-sm text-mid-gray md:text-base">
          {isEn
            ? "All guides and resources, organized by topic."
            : "Tous nos guides et ressources, organisés par thématique."}
        </p>
      </Reveal>

      <Stagger className="mt-6 grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3">
        {allCategories.map((cat) => (
          <StaggerItem
            key={cat.slug}
            className="border-b border-r border-dark-gray"
          >
            <CategoryCell cat={cat} titleClassName="text-xl" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
