import { Link } from "@/i18n/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

import { getArticlesByCategory, getAllCategories } from "@/lib/markdown"
import { CategoryPageContent } from "@/components/documentation/category-theme-cards"
import { CrossCategoryNav } from "@/components/documentation/cross-category-nav"
import { CategoryToolsLinks } from "@/components/documentation/documentation-internal-links"
import { AuditPromoBanner } from "@/components/audit/audit-promo-banner"
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

const categoryInfo: Record<string, { title: string; description: string }> = {
  "marketing-digital": {
    title: "Marketing Digital",
    description: "Découvrez les principes et concepts de base du marketing digital.",
  },
  seo: {
    title: "SEO",
    description: "Guides et ressources pour maîtriser le SEO de votre site.",
  },
  "design-ui-ux": {
    title: "Design & UI/UX",
    description: "Créez des expériences utilisateurs engageantes et accessibles.",
  },
  "projet-site-web": {
    title: "Projet de site web",
    description: "Préparer et mener un projet de site web de A à Z.",
  },
  wordpress: {
    title: "WordPress",
    description: "Bonnes pratiques et guides pour WordPress.",
  },
  "wordpress-headless": {
    title: "WordPress Headless",
    description: "Architecture headless, API REST et découplage front/back.",
  },
  blog: {
    title: "Blog",
    description: "Les dernières actualités et analyses.",
  },
}

export async function generateMetadata(props: { params: Promise<{ category: string; locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const info = categoryInfo[params.category];
  const title = info?.title || params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, " ");
  const learnLabel = params.locale === "en" ? "Learn" : "Comprendre";
  const description =
    info?.description ||
    (params.locale === "en"
      ? `Articles and resources on ${title}.`
      : `Articles et ressources sur ${title}.`);

  return generatePageMetadata({
    title: `${title} | ${learnLabel}`,
    description,
    path: `/documentation/${params.category}`,
    keywords: ["documentation", params.category, "guide", learnLabel.toLowerCase()],
    locale: params.locale,
  });
}

interface CategoryPageProps {
  params: Promise<{
    category: string
    locale: Locale
  }>
}

export function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({ category }))
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const { category, locale } = params
  const articles = getArticlesByCategory(category, locale)

  if (articles.length === 0) {
    notFound()
  }

  const info = categoryInfo[category]
  const categoryTitle = info?.title || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
  const categoryDescription = info?.description || ""
  const t = await getTranslations({ locale, namespace: "documentationPage" });

  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDocs"), url: "/documentation" },
    { name: categoryTitle, url: `/documentation/${category}` },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <section className="s">
        <div className="container">
          {/* Back link */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              href="/documentation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8125rem",
                color: "var(--muted-color)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("breadcrumbDocs")}
            </Link>
          </div>

          {/* Section header */}
          <div className="sec-head" style={{ marginBottom: "2.5rem" }}>
            <div className="sec-no">№ —</div>
            <h1
              className="ni-serif"
              style={{ fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 1.05, margin: 0 }}
            >
              {categoryTitle}
            </h1>
            <div className="sec-meta">Documentation</div>
          </div>
          {categoryDescription && (
            <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 640, marginBottom: "2.5rem" }}>
              {categoryDescription}
            </p>
          )}

          {/* Page pilier : vue d'ensemble dédiée pour la catégorie wordpress-headless. */}
          {category === "wordpress-headless" && (
            <Link
              href="/wordpress-headless"
              className="mb-10 flex items-start justify-between gap-4 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 no-underline transition-colors hover:border-accent-secondary"
            >
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
                  {locale === "en" ? "Overview" : "Vue d'ensemble"}
                </p>
                <p className="text-base font-medium text-foreground">
                  {locale === "en"
                    ? "Headless WordPress"
                    : "WordPress Headless"}
                </p>
                <p className="mt-1 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {locale === "en"
                    ? "Definition, comparison table, costs, performance and FAQ — the full picture in one page."
                    : "Définition, comparatif, coûts, performance et FAQ — la vue complète sur une page."}
                </p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-mid-gray" />
            </Link>
          )}

          {/* Theme cards + Articles grid */}
          <CategoryPageContent articles={articles} category={category} />

          {/* Maillage : sur le Headless, proposer de tester son propre site. */}
          {category === "wordpress-headless" && (
            <div style={{ marginTop: "2.5rem" }}>
              <AuditPromoBanner variant="headless" />
            </div>
          )}

          {/* Catégories associées */}
          <CrossCategoryNav currentCategory={category} />
        </div>
      </section>
    </div>
  )
}
