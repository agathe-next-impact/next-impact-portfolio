"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleMeta } from "@/lib/markdown";

interface ArticleSequentialNavProps {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

export function ArticleSequentialNav({ prev, next }: ArticleSequentialNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-2">
      {prev ? (
        <Link
          href={`/documentation/${prev.category}/${prev.slug}`}
          className={cn(
            "group flex flex-col gap-2 rounded-3xl p-5 border transition-all duration-300",
            "bg-darkblue/50 backdrop-blur-sm border-lightblue/10",
            "hover:border-lightblue/30 hover:shadow-xl hover:shadow-regularblue/10"
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-white/80 font-googletexte">
            <ArrowLeft className="h-3 w-3" />
            Article précédent
          </span>
          <p className="text-sm font-medium text-white/80 group-hover:text-white font-googletexte transition-colors leading-snug">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/documentation/${next.category}/${next.slug}`}
          className={cn(
            "group flex flex-col gap-2 rounded-3xl p-5 border transition-all duration-300 text-right",
            "bg-darkblue/50 backdrop-blur-sm border-lightblue/10",
            "hover:border-lightblue/30 hover:shadow-xl hover:shadow-regularblue/10"
          )}
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-white/80 font-googletexte">
            Article suivant
            <ArrowRight className="h-3 w-3" />
          </span>
          <p className="text-sm font-medium text-white/80 group-hover:text-white font-googletexte transition-colors leading-snug">
            {next.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
