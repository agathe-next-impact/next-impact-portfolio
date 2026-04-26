import { getBlogPosts } from "@/lib/blog"
import { BlogIndex } from "@/components/blog/BlogIndex"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Next Impact Digital",
  description:
    "Notes, retours d'expérience et coulisses des projets web de Next Impact Digital.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return <BlogIndex posts={posts} />
}
