import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  category: string
  author: string
  date: string
  order?: number
  isMdx?: boolean
}

export interface Article extends ArticleMeta {
  content: string
}

const contentDirectory = path.join(process.cwd(), "content")

/** Resolve article file path, preferring .mdx over .md */
function resolveArticlePath(category: string, slug: string): { filePath: string; isMdx: boolean } {
  const mdxPath = path.join(contentDirectory, "documentation", category, `${slug}.mdx`)
  if (fs.existsSync(mdxPath)) {
    return { filePath: mdxPath, isMdx: true }
  }
  const mdPath = path.join(contentDirectory, "documentation", category, `${slug}.md`)
  return { filePath: mdPath, isMdx: false }
}

function formatDate(date: unknown): string {
  if (date instanceof Date) {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  return date as string
}

/** Check if a file is .md or .mdx */
function isContentFile(file: string): boolean {
  return file.endsWith(".md") || file.endsWith(".mdx")
}

/** Extract slug from filename, removing .md or .mdx extension */
function fileToSlug(file: string): string {
  return file.replace(/\.mdx?$/, "")
}

export function getArticleBySlug(category: string, slug: string): Article {
  const { filePath, isMdx } = resolveArticlePath(category, slug)
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    author: data.author,
    date: formatDate(data.date),
    content,
    order: data.order,
    isMdx,
  }
}

export function getAllArticles(): ArticleMeta[] {
  const categories = fs.readdirSync(path.join(contentDirectory, "documentation"))

  const articlesMap = new Map<string, ArticleMeta>()

  categories.forEach((category) => {
    const categoryPath = path.join(contentDirectory, "documentation", category)
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath)

      files.forEach((file) => {
        if (isContentFile(file)) {
          const filePath = path.join(categoryPath, file)
          const fileContents = fs.readFileSync(filePath, "utf8")
          const { data } = matter(fileContents)
          const slug = fileToSlug(file)
          const key = `${category}/${slug}`
          const isMdx = file.endsWith(".mdx")

          // .mdx takes priority over .md
          if (!articlesMap.has(key) || isMdx) {
            articlesMap.set(key, {
              slug,
              title: data.title,
              description: data.description,
              category: data.category,
              author: data.author,
              date: formatDate(data.date),
              order: data.order,
              isMdx,
            })
          }
        }
      })
    }
  })

  return Array.from(articlesMap.values())
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  const categoryPath = path.join(contentDirectory, "documentation", category)

  if (!fs.existsSync(categoryPath)) {
    return []
  }

  const files = fs.readdirSync(categoryPath)
  const articlesMap = new Map<string, ArticleMeta>()

  files.forEach((file) => {
    if (isContentFile(file)) {
      const filePath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data } = matter(fileContents)
      const slug = fileToSlug(file)
      const isMdx = file.endsWith(".mdx")

      // .mdx takes priority over .md
      if (!articlesMap.has(slug) || isMdx) {
        articlesMap.set(slug, {
          slug,
          title: data.title,
          description: data.description,
          category: data.category,
          author: data.author,
          date: formatDate(data.date),
          order: data.order,
          isMdx,
        })
      }
    }
  })

  return Array.from(articlesMap.values())
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

export function getAllCategories() {
  const categories = fs.readdirSync(path.join(contentDirectory, "documentation"))

  return categories.filter((category) => {
    const categoryPath = path.join(contentDirectory, "documentation", category)
    return fs.statSync(categoryPath).isDirectory()
  })
}
