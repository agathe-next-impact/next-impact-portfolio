"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlogCard } from "./BlogCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogIndexProps {
  posts: BlogPostMeta[];
}

export function BlogIndex({ posts }: BlogIndexProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        {/* En-tête de page */}
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 01</span>
            <span className="h-px w-6 bg-accent-secondary/50" aria-hidden />
            <span className="text-mid-gray">{isEn ? "Journal" : "Le journal"}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-light tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {isEn
              ? "Notes, lessons learned and behind-the-scenes from my web projects."
              : "Notes, retours d'expérience et coulisses de mes projets web."}
          </p>
        </Reveal>

        {/* Grille de cartes bordées jointives */}
        {posts.length > 0 ? (
          <Stagger className="grid md:grid-cols-2">
            {posts.map((post, i) => (
              <StaggerItem
                key={post.slug}
                className="flex border-b border-dark-gray md:[&:nth-child(odd)]:border-r"
              >
                <BlogCard post={post} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="px-6 py-16 text-center lg:px-8 lg:py-20">
            <p className="font-inter-tight text-base text-foreground">
              {isEn ? "The blog is coming soon." : "Le blog arrive bientôt."}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">
              {isEn ? "First articles in the works." : "Premiers articles en cours d'écriture."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
