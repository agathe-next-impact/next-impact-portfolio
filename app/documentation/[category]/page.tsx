import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getArticlesByCategory, getAllCategories } from "@/lib/markdown"
import { Metadata } from "next";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

// meta données dynamiques pour la page d'étude de cas
export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const categoryInfo = {
    bases: {
      title: "Marketing Digital",
      description: "Découvrez les principes et concepts de base du marketing digital",
    },
    seo: {
      title: "Search Engine Optimization (SEO)",
      description: "Comprehensive guides and resources to help you master SEO for your website.",
    },
    uxui: {
      title: "UX/UI Design",
      description: "Learn how to create user-friendly and engaging website experiences.",
    },
    content: {
      title: "Content Strategy",
      description: "Develop effective content strategies to engage and convert your audience.",
    },
    analytics: {
      title: "Analytics",
      description: "Understand how to measure and analyze your website's performance.",
    },
  };

  const info = categoryInfo[params.category as keyof typeof categoryInfo];
  const title = info?.title || params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, " ");
  const description = info?.description || `Articles et ressources sur ${title}.`;

  return {
    title: `${title} | Documentation | Next Impact`,
    description,
    openGraph: {
      title: `${title} | Documentation | Next Impact`,
      description,
      url: `https://next-impact.digital/documentation/${params.category}`,
      type: "website",
      images: [
        {
          url: "https://next-impact.digital/img/avatar.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}


interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export function generateStaticParams() {
  const categories = getAllCategories()

  return categories.map((category) => ({
    category,
  }))
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const { category } = params
  const articles =  getArticlesByCategory(category)

  if (articles.length === 0) {
    notFound()
  }


  // Titre et description de la catégorie
  const categoryInfo = {
    bases: {
      title: "Marketing Digital",
      description: "Découvrez les principes et concepts de base du marketing digital",
    },
    seo: {
      title: "Search Engine Optimization (SEO)",
      description: "Comprehensive guides and resources to help you master SEO for your website.",
    },
    "ux-ui": {
      title: "UX/UI Design",
      description: "Learn how to create user-friendly and engaging website experiences.",
    },
    content: {
      title: "Content Strategy",
      description: "Develop effective content strategies to engage and convert your audience.",
    },
    analytics: {
      title: "Analytics",
      description: "Understand how to measure and analyze your website's performance.",
    },
  }

  const categoryTitle =
    categoryInfo[category as keyof typeof categoryInfo]?.title || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")


  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        <section className="w-full py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="space-y-2 pb-4">
                <h1 className="text-3xl tracking-tighter sm:text-4xl md:text-5xl">{categoryTitle}</h1>
            </div>
            <div className="flex justify-between items-center mb-8">
              <Link href="/documentation">
                <Button className="text-regularblue bg-transparent hover:bg-lightblue/10 rounded-full" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la documentation
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.slug}
                  className="group relative rounded-lg bg-white p-6 border border-lightblue/10 hover:border-lightblue/20 hover:bg-extrelightblue/5 transition-colors">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-regularblue">{article.title}</h3>
                    <p className="text-mediumblue text-sm">{article.description}</p>
                  </div>
                  <Link
                    href={`/documentation/${article.category}/${article.slug}`}
                    className="absolute inset-0 rounded-lg"
                    aria-label={article.title}
                  >
                    <span className="sr-only">{article.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

