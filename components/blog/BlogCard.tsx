import Link from "next/link"
import { Clock } from "lucide-react"
import type { BlogPostMeta } from "@/lib/blog"

interface BlogCardProps {
  post: BlogPostMeta
  index?: number
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative rounded-3xl border border-lightblue/10 p-5 hover:border-lightblue/30 transition-all duration-300 bg-darkblue/50 backdrop-blur-sm overflow-hidden"
    >
      <span className="absolute top-4 right-4 text-2xl font-googletitre font-bold text-white">
        {index + 1}
      </span>

      <div className="relative">
        {formattedDate && (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-googletexte text-blue-600 dark:text-blue-300/80">
              {formattedDate}
            </span>
          </div>
        )}

        <h3 className="font-googletitre font-medium text-white/80 group-hover:text-white transition-colors text-lg leading-snug line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 text-sm text-white/60 font-googletexte font-light leading-snug line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] text-white/70 font-googletexte"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.readingTime > 0 && (
          <div className="flex items-center gap-1 mt-3 text-[10px] text-white/80 font-googletexte">
            <Clock className="h-3 w-3" />
            <span className="text-white/80">{post.readingTime} min</span>
          </div>
        )}
      </div>
    </Link>
  )
}
