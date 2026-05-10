import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Locale } from "@/i18n/routing"

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  category: string
  author: string
  date: string
  order?: number
  isMdx?: boolean
  isFallback?: boolean
}

export interface Article extends ArticleMeta {
  content: string
}

const contentDirectoryFr = path.join(process.cwd(), "content")
const contentDirectoryEn = path.join(process.cwd(), "content", "en")

function docsRoot(locale?: Locale): string {
  if (locale === "en" && fs.existsSync(path.join(contentDirectoryEn, "documentation"))) {
    return contentDirectoryEn
  }
  return contentDirectoryFr
}

/** Resolve article file path, preferring .mdx over .md, with EN→FR fallback. */
function resolveArticlePath(
  category: string,
  slug: string,
  locale?: Locale,
): { filePath: string; isMdx: boolean; isFallback: boolean } {
  const tryRoot = (root: string) => {
    const mdx = path.join(root, "documentation", category, `${slug}.mdx`)
    if (fs.existsSync(mdx)) return { filePath: mdx, isMdx: true }
    const md = path.join(root, "documentation", category, `${slug}.md`)
    if (fs.existsSync(md)) return { filePath: md, isMdx: false }
    return null
  }

  if (locale === "en") {
    const en = tryRoot(contentDirectoryEn)
    if (en) return { ...en, isFallback: false }
    const fr = tryRoot(contentDirectoryFr)
    if (fr) return { ...fr, isFallback: true }
  }

  const fr = tryRoot(contentDirectoryFr)
  if (fr) return { ...fr, isFallback: false }

  // Default to .md path even if missing — caller will hit the read error.
  return {
    filePath: path.join(contentDirectoryFr, "documentation", category, `${slug}.md`),
    isMdx: false,
    isFallback: false,
  }
}

function formatDate(date: unknown, locale?: Locale): string {
  if (date instanceof Date) {
    return date.toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
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

export function getArticleBySlug(category: string, slug: string, locale?: Locale): Article {
  const { filePath, isMdx, isFallback } = resolveArticlePath(category, slug, locale)
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    author: data.author,
    date: formatDate(data.date, locale),
    content,
    order: data.order,
    isMdx,
    isFallback,
  }
}

function readArticlesIn(rootDir: string, fallback: boolean, locale?: Locale): Map<string, ArticleMeta> {
  const docsDir = path.join(rootDir, "documentation")
  if (!fs.existsSync(docsDir)) return new Map()
  const categories = fs.readdirSync(docsDir)

  const articlesMap = new Map<string, ArticleMeta>()

  categories.forEach((category) => {
    const categoryPath = path.join(docsDir, category)
    if (!fs.statSync(categoryPath).isDirectory()) return
    const files = fs.readdirSync(categoryPath)

    files.forEach((file) => {
      if (!isContentFile(file)) return
      const filePath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data } = matter(fileContents)
      const slug = fileToSlug(file)
      const key = `${category}/${slug}`
      const isMdx = file.endsWith(".mdx")

      if (!articlesMap.has(key) || isMdx) {
        articlesMap.set(key, {
          slug,
          title: data.title,
          description: data.description,
          category: data.category,
          author: data.author,
          date: formatDate(data.date, locale),
          order: data.order,
          isMdx,
          isFallback: fallback,
        })
      }
    })
  })

  return articlesMap
}

export function getAllArticles(locale?: Locale): ArticleMeta[] {
  if (locale !== "en") {
    return Array.from(readArticlesIn(contentDirectoryFr, false).values())
  }

  const fr = readArticlesIn(contentDirectoryFr, true, locale)
  const en = readArticlesIn(contentDirectoryEn, false, locale)
  // Overlay EN over FR.
  en.forEach((value, key) => {
    fr.set(key, value)
  })
  return Array.from(fr.values())
}

export function getArticlesByCategory(category: string, locale?: Locale): ArticleMeta[] {
  const tryDir = (root: string, fallback: boolean) => {
    const categoryPath = path.join(root, "documentation", category)
    if (!fs.existsSync(categoryPath)) return new Map<string, ArticleMeta>()
    const files = fs.readdirSync(categoryPath)
    const map = new Map<string, ArticleMeta>()

    files.forEach((file) => {
      if (!isContentFile(file)) return
      const filePath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data } = matter(fileContents)
      const slug = fileToSlug(file)
      const isMdx = file.endsWith(".mdx")

      if (!map.has(slug) || isMdx) {
        map.set(slug, {
          slug,
          title: data.title,
          description: data.description,
          category: data.category,
          author: data.author,
          date: formatDate(data.date, locale),
          order: data.order,
          isMdx,
          isFallback: fallback,
        })
      }
    })
    return map
  }

  if (locale === "en") {
    const en = tryDir(contentDirectoryEn, false)
    const fr = tryDir(contentDirectoryFr, true)
    // EN overrides FR; missing translations fall back to FR with isFallback=true.
    fr.forEach((value, key) => {
      if (!en.has(key)) en.set(key, value)
    })
    return Array.from(en.values()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  }

  return Array.from(tryDir(contentDirectoryFr, false).values()).sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  )
}

export function getAllCategories(locale?: Locale): string[] {
  const root = docsRoot(locale)
  const docsDir = path.join(root, "documentation")
  if (!fs.existsSync(docsDir)) return []

  return fs.readdirSync(docsDir).filter((category) => {
    const categoryPath = path.join(docsDir, category)
    return fs.statSync(categoryPath).isDirectory()
  })
}
