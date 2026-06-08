import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { ArticleHeader } from "./ArticleHeader"
import { ArticleSidebar } from "./ArticleSidebar"
import { BlueprintSection } from "@/components/aspect/section"
import type { Article } from "@/lib/articles"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"

interface ArticleLayoutProps {
  article: Article
  sectionCount: number
  children: React.ReactNode
}

export function ArticleLayout({ article, sectionCount, children }: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-obsidian">
      <TranslationFallbackBanner show={article.isFallback} />
      <BlueprintSection ticks>
        {/* Fil d'Ariane */}
        <div className="flex flex-wrap items-center gap-3 border-b border-dark-gray px-6 py-4 font-mono text-[11px] uppercase tracking-[0.12em] lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-mid-gray transition-colors hover:text-accent-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Articles
          </Link>
          <span aria-hidden className="text-dark-gray">·</span>
          <span className="text-accent-secondary">{article.category}</span>
        </div>

        {/* En-tête de l'article */}
        <div className="px-6 py-10 lg:px-8 lg:py-12">
          <ArticleHeader article={article} sectionCount={sectionCount} />
        </div>

        {/* Corps : sommaire + texte */}
        <div className="grid grid-cols-1 border-t border-dark-gray lg:grid-cols-4">
          <ArticleSidebar
            relatedArticles={article.relatedArticles}
            relatedDocs={article.relatedDocs}
          />
          <div
            id="article-body"
            className="col-span-1 border-t border-dark-gray px-6 py-10 lg:col-span-3 lg:border-l lg:border-t-0 lg:px-10 lg:py-12"
          >
            <div data-article-content className="article-prose">
              {children}
            </div>
          </div>
        </div>
      </BlueprintSection>
    </div>
  )
}
