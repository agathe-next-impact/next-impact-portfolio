import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  tags: string[]
  readingTime: number
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

const blogDirectory = path.join(process.cwd(), "content", "blog")

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  if (!fs.existsSync(blogDirectory)) return []

  const files = fs.readdirSync(blogDirectory).filter((f) => f.endsWith(".mdx"))

  const posts: BlogPostMeta[] = files.map((file) => {
    const filePath = path.join(blogDirectory, file)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)

    return {
      slug: data.slug || file.replace(/\.mdx$/, ""),
      title: data.title || "",
      date: data.date || "",
      author: data.author || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      readingTime: data.readingTime || 0,
    }
  })

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const filePath = path.join(blogDirectory, `${slug}.mdx`)
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
  }
}
