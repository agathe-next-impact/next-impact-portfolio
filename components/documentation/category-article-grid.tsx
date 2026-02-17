"use client";

import Link from "next/link";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";
import { cn } from "@/lib/utils";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
}

export function CategoryArticleGrid({ articles }: { articles: Article[] }) {
  const { profileId } = useDocumentationMode();

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => {
        const relevant = isArticleRelevantToProfile(article.category, article.slug, profileId);
        return (
          <div
            key={article.slug}
            className={cn(
              "group relative overflow-hidden rounded-3xl bg-mediumblue/80 backdrop-blur-sm p-6 border border-lightblue/10 hover:border-lightblue/30 hover:shadow-2xl hover:shadow-regularblue/10 transition-all duration-300",
              profileId && !relevant && "opacity-40 hover:opacity-70"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-googletitre text-xl font-medium text-white/90 group-hover:text-white transition-colors">
                  {article.title}
                </h3>
                {profileId && relevant && (
                  <span className="shrink-0 rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-googletexte text-orange/80">
                    Recommandé
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80 font-googletexte line-clamp-3">
                {article.description}
              </p>
            </div>
            <Link
              href={`/documentation/${article.category}/${article.slug}`}
              className="absolute inset-0 rounded-3xl"
              aria-label={article.title}
            >
              <span className="sr-only">{article.title}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
