import Link from "next/link"
import { Clock } from "lucide-react"
import type { ArticleMeta } from "@/lib/articles"

interface ArticleCardProps {
  article: ArticleMeta
  index?: number
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative rounded-3xl border border-lightblue/10 p-5 hover:border-lightblue/30 transition-all duration-300 bg-darkblue/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Background number */}
      <span className="absolute top-4 right-4 text-2xl font-googletitre font-bold text-white">
        {index + 1}
      </span>

      <div className="relative">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-googletexte text-blue-600 dark:text-blue-300/80">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-googletitre font-medium text-white/80 group-hover:text-white transition-colors text-lg leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] text-white/70 font-googletexte"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-1 mt-3 text-[10px] text-white/80 font-googletexte">
          <Clock className="h-3 w-3" />
          <span className="text-white/80">{article.readingTime} min</span>
        </div>
      </div>
    </Link>
  )
}
