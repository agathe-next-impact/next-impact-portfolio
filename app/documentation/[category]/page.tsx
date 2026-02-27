import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { getArticlesByCategory, getAllCategories } from "@/lib/markdown"
import { CategoryPageContent } from "@/components/documentation/category-theme-cards"
import { CrossCategoryNav } from "@/components/documentation/cross-category-nav"
import { CategoryToolsLinks } from "@/components/documentation/documentation-internal-links"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

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
  "headless-cms": {
    title: "Headless CMS",
    description: "Architecture headless, API REST et découplage front/back.",
  },
  blog: {
    title: "Blog",
    description: "Les dernières actualités et analyses.",
  },
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const info = categoryInfo[params.category];
  const title = info?.title || params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, " ");
  const description = info?.description || `Articles et ressources sur ${title}.`;

  return generatePageMetadata({
    title: `${title} | Comprendre`,
    description,
    path: `/documentation/${params.category}`,
    keywords: ["documentation", params.category, "guide", "comprendre"],
  });
}

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({ category }))
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const { category } = params
  const articles = getArticlesByCategory(category)

  if (articles.length === 0) {
    notFound()
  }

  const info = categoryInfo[category]
  const categoryTitle = info?.title || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
  const categoryDescription = info?.description || ""

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Comprendre", url: "/documentation" },
    { name: categoryTitle, url: `/documentation/${category}` },
  ];

  return (
    <div className="relative min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/documentation"
                className="inline-flex items-center gap-2 rounded-full bg-mediumblue/60 backdrop-blur-sm px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-mediumblue/80 transition-colors border border-lightblue/10 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Comprendre
              </Link>
              <h1 className="font-googletitre text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight">
                {categoryTitle}
              </h1>
              {categoryDescription && (
                <p className="mt-3 text-lg text-white/80 font-googletexte max-w-2xl">
                  {categoryDescription}
                </p>
              )}
            </div>

            {/* Theme cards + Articles grid */}
            <CategoryPageContent articles={articles} category={category} />

            {/* Catégories associées */}
            <CrossCategoryNav currentCategory={category} />

          </div>
        </section>
      </main>
    </div>
  )
}
