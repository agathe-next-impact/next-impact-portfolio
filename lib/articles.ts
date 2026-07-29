import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Locale } from "@/i18n/routing"

export interface ArticleKpi {
  value: string
  label: string
}

export interface RelatedArticle {
  slug: string
  title: string
  category: string
}

export interface RelatedDoc {
  path: string
  title: string
}

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  author: string
  authorRole: string
  category: string
  cluster: string
  readingTime: number
  kpis: ArticleKpi[]
  tags: string[]
  relatedArticles: RelatedArticle[]
  relatedDocs: RelatedDoc[]
  isFallback?: boolean
}

export interface Article extends ArticleMeta {
  content: string
}

const articlesRootFr = path.join(process.cwd(), "content", "articles")
const articlesRootEn = path.join(process.cwd(), "content", "en", "articles")

function buildMeta(filePath: string, fallback: boolean): ArticleMeta | null {
  if (!fs.existsSync(filePath)) return null
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data } = matter(fileContents)
  return {
    slug: data.slug || path.basename(filePath, ".mdx"),
    title: data.title || "",
    date: data.date || "",
    author: data.author || "",
    authorRole: data.authorRole || "",
    category: data.category || "",
    cluster: data.cluster || "",
    readingTime: data.readingTime || 0,
    kpis: data.kpis || [],
    tags: data.tags || [],
    relatedArticles: data.relatedArticles || [],
    relatedDocs: data.relatedDocs || [],
    isFallback: fallback,
  }
}

export async function getArticles(locale?: Locale): Promise<ArticleMeta[]> {
  const articles = new Map<string, ArticleMeta>()

  if (fs.existsSync(articlesRootFr)) {
    for (const file of fs.readdirSync(articlesRootFr).filter((f) => f.endsWith(".mdx"))) {
      const meta = buildMeta(path.join(articlesRootFr, file), locale === "en")
      if (meta) articles.set(meta.slug, meta)
    }
  }

  if (locale === "en" && fs.existsSync(articlesRootEn)) {
    for (const file of fs.readdirSync(articlesRootEn).filter((f) => f.endsWith(".mdx"))) {
      const meta = buildMeta(path.join(articlesRootEn, file), false)
      if (meta) articles.set(meta.slug, meta)
    }
  }

  return [...articles.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export async function getArticle(slug: string, locale?: Locale): Promise<Article> {
  let isFallback = false
  let filePath = ""

  if (locale === "en") {
    const enPath = path.join(articlesRootEn, `${slug}.mdx`)
    if (fs.existsSync(enPath)) {
      filePath = enPath
    } else {
      filePath = path.join(articlesRootFr, `${slug}.mdx`)
      isFallback = true
    }
  } else {
    filePath = path.join(articlesRootFr, `${slug}.mdx`)
  }

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug: data.slug || slug,
    title: data.title || "",
    date: data.date || "",
    author: data.author || "",
    authorRole: data.authorRole || "",
    category: data.category || "",
    cluster: data.cluster || "",
    readingTime: data.readingTime || 0,
    kpis: data.kpis || [],
    tags: data.tags || [],
    relatedArticles: data.relatedArticles || [],
    relatedDocs: data.relatedDocs || [],
    content,
    isFallback,
  }
}
