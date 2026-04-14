import fs from "fs"
import path from "path"
import matter from "gray-matter"

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
}

export interface Article extends ArticleMeta {
  content: string
}

const articlesDirectory = path.join(process.cwd(), "content", "articles")

export async function getArticles(): Promise<ArticleMeta[]> {
  if (!fs.existsSync(articlesDirectory)) return []

  const files = fs.readdirSync(articlesDirectory).filter((f) => f.endsWith(".mdx"))

  const articles: ArticleMeta[] = files.map((file) => {
    const filePath = path.join(articlesDirectory, file)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)

    return {
      slug: data.slug || file.replace(/\.mdx$/, ""),
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
    }
  })

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export async function getArticle(slug: string): Promise<Article> {
  const filePath = path.join(articlesDirectory, `${slug}.mdx`)
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
  }
}
