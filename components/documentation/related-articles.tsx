"use client";

import Link from "next/link";
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
    <div className="space-y-5">
      <div className="border-t border-lightblue/10 pt-8" />
      <h3 className="font-googletitre text-xl font-medium text-white/80">
        Continuer la lecture
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {display.map((article, i) => {
          const isRecommended = profileId
            ? isArticleRelevantToProfile(article.category, article.slug, profileId)
            : false;

          return (
            <Link
              key={article.slug}
              href={`/documentation/${article.category}/${article.slug}`}
              className="group relative rounded-3xl border border-lightblue/10 p-5 hover:border-lightblue/30 transition-all duration-300 bg-darkblue/50 backdrop-blur-sm overflow-hidden"
            >
              <span className="absolute top-4 right-4 text-5xl font-googletitre font-bold text-white/[0.03]">
                {i + 1}
              </span>
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block rounded-full bg-regularblue/10 px-2.5 py-0.5 text-[10px] font-googletexte text-regularblue/80">
                    {categoryLabels[article.category] || article.category}
                  </span>
                  {isRecommended && (
                    <span className="inline-block rounded-full bg-orange/10 px-2.5 py-0.5 text-[10px] font-googletexte text-orange/80 border border-orange/20">
                      Recommandé
                    </span>
                  )}
                </div>
                <h4 className="font-googletitre font-medium text-white/80 group-hover:text-white transition-colors text-sm leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-white/80 font-googletexte mt-2 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-[10px] text-white/80 font-googletexte">
                  <Clock className="h-3 w-3" />
                  <span>{article.readingTime} min</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
