"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/markdown";

interface ArticleSequentialNavProps {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

export function ArticleSequentialNav({ prev, next }: ArticleSequentialNavProps) {
  if (!prev && !next) return null;

  const cardClass =
    "group flex flex-col gap-1.5 border-b border-r border-dark-gray bg-transparent p-4 px-5 no-underline transition-colors hover:bg-jet/40";
  const labelClass =
    "flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-mid-gray";
  const titleClass =
    "text-sm font-light leading-tight tracking-tight text-foreground transition-colors group-hover:text-accent-secondary";

  return (
    <div className="grid grid-cols-2 border-l border-t border-dark-gray">
      {prev ? (
        <Link
          href={`/documentation/${prev.category}/${prev.slug}` as never}
          className={cardClass}
        >
          <span className={labelClass}>
            <ArrowLeft className="h-3 w-3" />
            Article précédent
          </span>
          <p className={titleClass}>{prev.title}</p>
        </Link>
      ) : (
        <div className="border-b border-r border-dark-gray" />
      )}

      {next ? (
        <Link
          href={`/documentation/${next.category}/${next.slug}` as never}
          className={`${cardClass} text-right`}
        >
          <span className={`${labelClass} justify-end`}>
            Article suivant
            <ArrowRight className="h-3 w-3" />
          </span>
          <p className={titleClass}>{next.title}</p>
        </Link>
      ) : (
        <div className="border-b border-r border-dark-gray" />
      )}
    </div>
  );
}
