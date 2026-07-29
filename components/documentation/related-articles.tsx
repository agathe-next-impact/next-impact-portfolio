"use client";

import { Link } from "@/i18n/navigation";
import { Clock } from "lucide-react";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";
import type { ArticleMeta } from "@/lib/markdown";

interface RelatedArticleData extends ArticleMeta {
  readingTime: number;
}

interface RelatedArticlesProps {
  articles: RelatedArticleData[];
  categoryLabels: Record<string, string>;
}

export function RelatedArticles({ articles, categoryLabels }: RelatedArticlesProps) {
  const { profileId } = useDocumentationMode();

  const sorted = profileId
    ? [...articles].sort((a, b) => {
        const aRel = isArticleRelevantToProfile(a.category, a.slug, profileId) ? 0 : 1;
        const bRel = isArticleRelevantToProfile(b.category, b.slug, profileId) ? 0 : 1;
        return aRel - bRel;
      })
    : articles;

  const display = sorted.slice(0, 3);

  if (display.length === 0) return null;

  return (
    <div>
      <div className="mb-5 border-t border-dark-gray pt-8">
        <h3 className="text-xl font-light tracking-tight text-foreground">
          Continuer la lecture
        </h3>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-3">
        {display.map((article, i) => {
          const isRecommended = profileId
            ? isArticleRelevantToProfile(article.category, article.slug, profileId)
            : false;

          return (
            <Link
              key={article.slug}
              href={`/documentation/${article.category}/${article.slug}` as never}
              className="group relative flex flex-col border-b border-r border-dark-gray bg-transparent p-5 no-underline transition-colors hover:bg-jet/40"
            >
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="border border-dark-gray px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {categoryLabels[article.category] || article.category}
                </span>
                {isRecommended && (
                  <span className="border border-accent-secondary px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent-secondary">
                    Recommandé
                  </span>
                )}
              </div>
              <h4 className="mb-1.5 flex-1 text-[0.9375rem] font-light leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent-secondary">
                {article.title}
              </h4>
              <p className="mb-2 line-clamp-2 font-inter-tight text-xs leading-relaxed text-mid-gray">
                {article.description}
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-mid-gray">
                <Clock className="h-3 w-3" />
                <span>{article.readingTime} min</span>
                <span className="ml-auto font-mono text-[10px] tracking-[0.08em] text-mid-gray">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
