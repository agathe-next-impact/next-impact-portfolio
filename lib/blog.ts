import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Locale } from "@/i18n/routing"

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  tags: string[]
  readingTime: number
  isFallback?: boolean
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

const blogRootFr = path.join(process.cwd(), "content", "blog")
const blogRootEn = path.join(process.cwd(), "content", "en", "blog")

export async function getBlogPosts(locale?: Locale): Promise<BlogPostMeta[]> {
  const posts = new Map<string, BlogPostMeta>()

  if (fs.existsSync(blogRootFr)) {
    for (const file of fs.readdirSync(blogRootFr).filter((f) => f.endsWith(".mdx"))) {
      const filePath = path.join(blogRootFr, file)
      const { data } = matter(fs.readFileSync(filePath, "utf8"))
      const slug = data.slug || file.replace(/\.mdx$/, "")
      posts.set(slug, {
        slug,
        title: data.title || "",
        date: data.date || "",
        author: data.author || "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        readingTime: data.readingTime || 0,
        isFallback: locale === "en",
      })
    }
  }

  if (locale === "en" && fs.existsSync(blogRootEn)) {
    for (const file of fs.readdirSync(blogRootEn).filter((f) => f.endsWith(".mdx"))) {
      const filePath = path.join(blogRootEn, file)
      const { data } = matter(fs.readFileSync(filePath, "utf8"))
      const slug = data.slug || file.replace(/\.mdx$/, "")
      posts.set(slug, {
        slug,
        title: data.title || "",
        date: data.date || "",
        author: data.author || "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        readingTime: data.readingTime || 0,
        isFallback: false,
      })
    }
  }

  return [...posts.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export async function getBlogPost(slug: string, locale?: Locale): Promise<BlogPost> {
  let isFallback = false
  let filePath = ""

  if (locale === "en") {
    const enPath = path.join(blogRootEn, `${slug}.mdx`)
    if (fs.existsSync(enPath)) {
      filePath = enPath
    } else {
      filePath = path.join(blogRootFr, `${slug}.mdx`)
      isFallback = true
    }
  } else {
    filePath = path.join(blogRootFr, `${slug}.mdx`)
  }

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug: data.slug || slug,
    title: data.title || "",
    date: data.date || "",
    author: data.author || "",
    excerpt: data.excerpt || "",
    tags: data.tags || [],
    readingTime: data.readingTime || 0,
    content,
    isFallback,
  }
}
