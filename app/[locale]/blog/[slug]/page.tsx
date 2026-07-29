import { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getBlogPost, getBlogPosts } from "@/lib/blog"
import { BlogLayout } from "@/components/blog/BlogLayout"
import { ArticleCallout } from "@/components/articles/ArticleCallout"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import { ReadingProgress } from "@/components/ui/reading-progress"

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

function BlogH2({ children }: { children?: React.ReactNode }) {
  const text = extractText(children)
  const id = slugify(text)
  return <h2 id={id}>{children}</h2>
}

function BlogH3({ children }: { children?: React.ReactNode }) {
  const text = extractText(children)
  const id = slugify(text)
  return <h3 id={id}>{children}</h3>
}

function BlogTable(props: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto my-8 rounded-xl">
      <table {...props} />
    </div>
  )
}

const mdxComponents = {
  h2: BlogH2,
  h3: BlogH3,
  table: BlogTable,
  Callout: ArticleCallout,
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: import("@/i18n/routing").Locale }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  try {
    const post = await getBlogPost(slug, locale)
    const { generatePageMetadata } = await import("@/lib/metadata")
    return generatePageMetadata({
      title: `${post.title} | Next Impact Digital`,
      description: post.excerpt || post.title,
      path: `/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      keywords: post.tags,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: import("@/i18n/routing").Locale }>
}) {
  const { slug, locale } = await params

  let post
  try {
    post = await getBlogPost(slug, locale)
  } catch {
    notFound()
  }

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  const breadcrumbItems = [
    { name: locale === "en" ? "Home" : "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]

  return (
    <>
      <ReadingProgress />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt || post.title}
        image="/img/desktop-screen-next-impact.png"
        datePublished={post.date || new Date().toISOString()}
        author={post.author || "Agathe"}
        url={`/blog/${slug}`}
      />
      <BlogLayout post={post}>{content}</BlogLayout>
    </>
  )
}
