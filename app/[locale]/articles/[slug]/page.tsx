import { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getArticle, getArticles } from "@/lib/articles"
import { ArticleLayout } from "@/components/articles/ArticleLayout"
import { ArticleCallout } from "@/components/articles/ArticleCallout"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "")
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractText).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children.props as { children?: React.ReactNode }).children)
  }
  return ""
}

function ArticleH2({ children }: { children?: React.ReactNode }) {
  const text = extractText(children)
  const id = slugify(text)
  return (
    <>
      <div className="mt-12 mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-lightblue/40 to-transparent" />
        <div className="h-1.5 w-1.5 rounded-full bg-regularblue/30" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-lightblue/40 to-transparent" />
      </div>
      <h2 id={id}>{children}</h2>
    </>
  )
}

function ArticleH3({ children }: { children?: React.ReactNode }) {
  const text = extractText(children)
  const id = slugify(text)
  return <h3 id={id}>{children}</h3>
}

function ArticleTable(props: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto my-8 rounded-xl">
      <table {...props} />
    </div>
  )
}

function ArticleBlockquote(props: React.ComponentProps<"blockquote">) {
  return <blockquote {...props} />
}

function ArticleLink(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

const mdxComponents = {
  h2: ArticleH2,
  h3: ArticleH3,
  table: ArticleTable,
  blockquote: ArticleBlockquote,
  a: ArticleLink,
  Callout: ArticleCallout,
}

function countH2Sections(content: string): number {
  const matches = content.match(/^##\s+/gm)
  return matches ? matches.length : 0
}

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: import("@/i18n/routing").Locale }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  try {
    const article = await getArticle(slug)
    const { generatePageMetadata } = await import("@/lib/metadata")
    return generatePageMetadata({
      title: `${article.title} | Next Impact Digital`,
      description: article.title,
      path: `/articles/${slug}`,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      locale,
    })
  } catch {
    return {
      title:
        locale === "en"
          ? "Article not found | Next Impact Digital"
          : "Article introuvable | Next Impact Digital",
    }
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: import("@/i18n/routing").Locale }>
}) {
  const { slug, locale } = await params

  let article
  try {
    article = await getArticle(slug, locale)
  } catch {
    notFound()
  }

  const sectionCount = countH2Sections(article.content)

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  const breadcrumbItems = [
    { name: locale === "en" ? "Home" : "Accueil", url: "/" },
    { name: locale === "en" ? "Articles" : "Articles", url: "/articles" },
    { name: article.title, url: `/articles/${slug}` },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={article.title}
        description={article.category}
        image="/img/desktop-screen-next-impact.png"
        datePublished={article.date}
        author={article.author}
        url={`/articles/${slug}`}
      />
      <ArticleLayout article={article} sectionCount={sectionCount}>
        {content}
      </ArticleLayout>
    </>
  )
}
