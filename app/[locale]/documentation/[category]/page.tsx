import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
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
import { DocBreadcrumb, toCrumbs } from "@/components/documentation/doc-breadcrumb";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

// Titres et descriptions par locale : le même objet alimente la meta ET le
// header visible (H1 + chapo), pour que les deux ne divergent jamais.
type CategoryInfo = {
  title: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
};

const categoryInfo: Record<string, CategoryInfo> = {
  "marketing-digital": {
    title: "Marketing Digital",
    description: "Découvrez les principes et concepts de base du marketing digital.",
    titleEn: "Digital marketing",
    descriptionEn: "Learn the principles and core concepts of digital marketing.",
  },
  seo: {
    title: "SEO",
    description: "Guides et ressources pour maîtriser le SEO de votre site.",
    titleEn: "SEO",
    descriptionEn: "Guides and resources to master your site's SEO.",
  },
  "design-ui-ux": {
    title: "Design & UI/UX",
    description: "Créez des expériences utilisateurs engageantes et accessibles.",
    titleEn: "Design & UI/UX",
    descriptionEn: "Create engaging, accessible user experiences.",
  },
  "projet-site-web": {
    title: "Projet de site web",
    description: "Préparer et mener un projet de site web de A à Z.",
    titleEn: "Web project",
    descriptionEn: "Prepare and run a website project from A to Z.",
  },
  wordpress: {
    title: "WordPress",
    description: "Bonnes pratiques et guides pour WordPress.",
    titleEn: "WordPress",
    descriptionEn: "Best practices and guides for WordPress.",
  },
  "wordpress-headless": {
    title: "WordPress Headless",
    description: "Architecture headless, API REST et découplage front/back.",
    titleEn: "Headless WordPress",
    descriptionEn: "Headless architecture, REST API and front/back decoupling.",
  },
  "applications-web-mobile": {
    title: "Web app & plateforme",
    description:
      "Web app, plateforme métier, PWA : comprendre, cadrer et budgéter un projet applicatif quand le site ne suffit plus.",
    titleEn: "Web app & platform",
    descriptionEn:
      "Web apps, business platforms, PWAs: understand, scope and budget an application project when a website is no longer enough.",
  },
}

function localizedCategoryInfo(
  category: string,
  locale: Locale,
): { title?: string; description?: string } {
  const info = categoryInfo[category];
  if (!info) return {};
  return locale === "en"
    ? { title: info.titleEn, description: info.descriptionEn }
    : { title: info.title, description: info.description };
}

export async function generateMetadata(props: { params: Promise<{ category: string; locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const info = localizedCategoryInfo(params.category, params.locale);
  const title = info.title || params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, " ");
  const learnLabel = params.locale === "en" ? "Learn" : "Comprendre";
  const description =
    info.description ||
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

  const info = localizedCategoryInfo(category, locale)
  const categoryTitle = info.title || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
  const categoryDescription = info.description || ""
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
          {/* Fil d'Ariane visible — miroir du BreadcrumbList ci-dessus */}
          <DocBreadcrumb items={toCrumbs(breadcrumbItems)} />

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
                    ? "Definition, comparison table, costs, performance and FAQ: the full picture in one page."
                    : "Définition, comparatif, coûts, performance et FAQ : la vue complète sur une page."}
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
