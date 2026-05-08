import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/blog"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"

interface BlogLayoutProps {
  post: BlogPost
  children: React.ReactNode
}

export function BlogLayout({ post, children }: BlogLayoutProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <div className="relative z-10 min-h-screen">
      <TranslationFallbackBanner show={post.isFallback} />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-mediumblue/60 backdrop-blur-sm px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-mediumblue/80 transition-colors border border-lightblue/10 font-googletexte"
            >
              <ArrowLeft className="h-4 w-4" />
              Blog
            </Link>
          </div>

          <header className="mb-8 space-y-4">
            <h1 className="font-googletitre text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60 font-googletexte">
              {post.author && <span>{post.author}</span>}
              {formattedDate && <span>{formattedDate}</span>}
              {post.readingTime > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min
                </span>
              )}
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-lightblue/10 bg-darkblue/40 px-2.5 py-0.5 text-[10px] font-googletexte text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            data-article-content
            className="w-full p-5 md:p-10 bg-mediumblue/90 rounded-3xl article-text text-white/80"
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
