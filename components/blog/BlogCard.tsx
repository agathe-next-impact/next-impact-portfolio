"use client";

import { ArrowRight, Clock } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPostMeta;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString(isEn ? "en-US" : "fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full w-full flex-col p-6 transition-colors hover:bg-jet lg:p-8"
    >
      <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-accent-secondary transition-transform duration-300 group-hover:scale-x-100" aria-hidden />

      {/* Méta : index + date */}
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
        <span>{String(index + 1).padStart(2, "0")}</span>
        {formattedDate && <span className="h-px w-5 bg-dark-gray" aria-hidden />}
        {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
      </div>

      <h3 className="mt-4 text-xl font-light leading-snug tracking-tight text-foreground md:text-2xl">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="mt-3 line-clamp-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
          {post.excerpt}
        </p>
      )}

      <div className="mt-6 flex flex-1 items-end justify-between gap-4">
        {post.readingTime > 0 ? (
          <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-mid-gray">
            <Clock size={12} aria-hidden />
            {post.readingTime} min
          </span>
        ) : (
          <span />
        )}
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors group-hover:text-foreground"
          aria-hidden
        >
          {isEn ? "Read" : "Lire"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
