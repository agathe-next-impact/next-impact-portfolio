import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ArticleHeader } from "./ArticleHeader"
import { ArticleSidebar } from "./ArticleSidebar"
import type { Article } from "@/lib/articles"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"

interface ArticleLayoutProps {
  article: Article
  sectionCount: number
  children: React.ReactNode
}

export function ArticleLayout({ article, sectionCount, children }: ArticleLayoutProps) {
  return (
    <div className="relative z-10 min-h-screen">
      <TranslationFallbackBanner show={article.isFallback} />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full bg-mediumblue/60 backdrop-blur-sm px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-mediumblue/80 transition-colors border border-lightblue/10 font-googletexte"
            >
              <ArrowLeft className="h-4 w-4" />
              Articles
            </Link>
            <span className="rounded-full bg-darkblue/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80 transition-colors border border-lightblue/10 font-googletexte">
              {article.category}
            </span>
          </div>

          {/* Article header — hero style */}
          <ArticleHeader article={article} sectionCount={sectionCount} />

          {/* Content grid: TOC sidebar + Article body */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ArticleSidebar
              relatedArticles={article.relatedArticles}
              relatedDocs={article.relatedDocs}
            />

            <div id="article-body" className="col-span-1 lg:col-span-3 flex flex-col gap-8">
              {/* Reading area */}
              <div
                data-article-content
                className="w-full p-5 md:p-10 bg-mediumblue/90 rounded-3xl article-text text-white/80"
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
