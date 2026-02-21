import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { MarkdownContent } from "@/components/documentation/markdown-content"
import { MdxContent } from "@/components/documentation/mdx-content"
import { getArticleBySlug, getArticlesByCategory } from "@/lib/markdown"
import TableOfContentsPopup from "@/components/documentation/table-of-content-popup"
import ShareSocial from "@/components/share-social"
import { ArticleReadTracker } from "@/components/documentation/article-read-tracker"
import { ReadingProgress } from "@/components/documentation/reading-progress"
import { ArticleNavigation } from "@/components/documentation/article-navigation"
import { ScrollToTop } from "@/components/documentation/scroll-to-top"
import { MobileToc } from "@/components/documentation/mobile-toc"
import { ArticleSequentialNav } from "@/components/documentation/article-sequential-nav"
import { RelatedArticles } from "@/components/documentation/related-articles"
import { ArticleInternalLinks } from "@/components/documentation/documentation-internal-links"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/json-ld";

const categoryLabels: Record<string, string> = {
  "marketing-digital": "Marketing Digital",
  seo: "SEO",
  "design-ui-ux": "Design & UI/UX",
  "projet-site-web": "Projet de site web",
  wordpress: "WordPress",
  "headless-cms": "Headless CMS",
  blog: "Blog",
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function generateMetadata(props: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = getArticleBySlug(params.category, params.slug);
  if (!post) {
    return {
      title: "Article introuvable",
      description: "L'article demandé n'existe pas.",
    };
  }

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    path: `/documentation/${post.category}/${post.slug}`,
    type: "article",
    keywords: ["documentation", post.category, "article", "comprendre"],
  });
}


interface ArticlePageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}


export function generateTableOfContents(content: string) {
  if (!content || typeof content !== "string") {
    return [];
  }

  const toc: { id: string; text: string; level: number }[] = [];
  const headingRegex = /^(#{2,6})\s+(.*)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const [_, hashes, text] = match;
    const level = hashes.length;
    const id = text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "");

    if (level === 2 || level === 3) {
      toc.push({ id, text, level });
    }
  }

  return toc;
}

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const article = getArticleBySlug(params.category, params.slug)

    const categoryArticles = getArticlesByCategory(params.category)
    const currentIndex = categoryArticles.findIndex((a) => a.slug === params.slug)
    const prevArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null
    const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null

    // Same-category related articles
    const sameCategoryCandidates = categoryArticles
      .filter((a) =>
        a.slug !== params.slug &&
        a.slug !== prevArticle?.slug &&
        a.slug !== nextArticle?.slug
      )
      .slice(0, 3)

    // Cross-category related articles
    const RELATED_CATEGORIES: Record<string, string[]> = {
      "headless-cms": ["wordpress", "seo", "projet-site-web"],
      wordpress: ["headless-cms", "design-ui-ux", "projet-site-web"],
      seo: ["marketing-digital", "headless-cms", "projet-site-web"],
      "design-ui-ux": ["projet-site-web", "marketing-digital", "wordpress"],
      "marketing-digital": ["seo", "design-ui-ux", "projet-site-web"],
      "projet-site-web": ["headless-cms", "design-ui-ux", "seo"],
      blog: ["headless-cms", "wordpress"],
    }

    const relatedCategorySlugs = RELATED_CATEGORIES[params.category] || []
    const crossCategoryArticles = relatedCategorySlugs
      .flatMap((cat) => getArticlesByCategory(cat).slice(0, 2))
      .slice(0, 3)

    // Combine: prioritize same-category, then add cross-category
    const allRelatedCandidates = [
      ...sameCategoryCandidates,
      ...crossCategoryArticles.filter(
        (a) => !sameCategoryCandidates.some((s) => s.slug === a.slug && s.category === a.category)
      ),
    ].slice(0, 5)

    const relatedWithTime = allRelatedCandidates.map((a) => {
      const full = getArticleBySlug(a.category, a.slug)
      return { ...a, readingTime: estimateReadingTime(full.content) }
    })

    const tableOfContents = article?.content ? generateTableOfContents(article.content) : []
    const readingTime = article?.content ? estimateReadingTime(article.content) : 0
    const categoryLabel = categoryLabels[article.category] || article.category.charAt(0).toUpperCase() + article.category.slice(1).replace(/-/g, " ")

    const breadcrumbItems = [
      { name: "Accueil", url: "/" },
      { name: "Comprendre", url: "/documentation" },
      { name: categoryLabel, url: `/documentation/${params.category}` },
      { name: article.title, url: `/documentation/${params.category}/${params.slug}` },
    ];

    return (
      <div className="relative min-h-screen">
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <ArticleJsonLd
          title={article.title}
          description={article.description}
          image="/img/desktop-screen-next-impact.png"
          datePublished={typeof article.date === "string" ? article.date : new Date().toISOString()}
          author={article.author || "Next Impact"}
          url={`/documentation/${article.category}/${article.slug}`}
        />
        <ReadingProgress />
        <ArticleReadTracker category={params.category} slug={params.slug} />
        <ScrollToTop />
        <MobileToc tableOfContents={tableOfContents} />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <Link
                href="/documentation"
                className="inline-flex items-center gap-2 rounded-full bg-mediumblue/60 backdrop-blur-sm px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-mediumblue/80 transition-colors border border-lightblue/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Comprendre
              </Link>
              <Link
                href={`/documentation/${article.category}`}
                className="rounded-full bg-darkblue/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80 hover:text-white/80 transition-colors border border-lightblue/10"
              >
                {categoryLabel}
              </Link>
            </div>

            {/* Article header — hero style */}
            <div className="rounded-3xl bg-gradient-to-br from-mediumblue/90 via-mediumblue/80 to-darkblue/70 backdrop-blur-sm p-6 md:p-10 lg:p-12 border border-lightblue/10 mb-6">
              {/* Category + Reading time */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="rounded-full bg-regularblue/20 border border-regularblue/30 px-3 py-1 text-xs font-googletexte text-regularblue">
                  {categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/80 font-googletexte">
                  <Clock className="h-3 w-3" />
                  {readingTime} min de lecture
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/80 font-googletexte">
                  <BookOpen className="h-3 w-3" />
                  {tableOfContents.filter(t => t.level === 2).length} sections
                </span>
              </div>

              {/* Title */}
              <h1 className="font-googletitre text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium mb-5 text-white leading-tight">
                {article.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/80 font-googletexte font-light max-w-3xl leading-relaxed">
                {article.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-lightblue/10 flex-wrap">
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/logo-blanc-carre.png"
                    alt="Next Impact"
                    width={28}
                    height={28}
                    className="object-contain rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-white/80 font-googletexte font-medium">
                      {article.author || "Next Impact"}
                    </p>
                    <p className="text-xs text-white/80 font-googletexte">
                      {typeof article.date === "string" ? article.date : "Récemment"}
                    </p>
                  </div>
                </div>
                <div className="ml-auto">
                  <ShareSocial url={`/documentation/${article.category}/${article.slug}`} title={article.title} />
                </div>
              </div>
            </div>

            {/* Content grid: TOC + Article */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <aside className="col-span-1 hidden lg:block">
                <div className="sticky top-28 space-y-4">
                  <TableOfContentsPopup tableOfContents={tableOfContents} />
                </div>
              </aside>
              <div id="article-body" className="col-span-1 lg:col-span-3 flex flex-col gap-8">
                {/* Reading area */}
                <div className="w-full p-5 md:p-10 bg-mediumblue/90 rounded-3xl shadow-sm">
                  {article.isMdx ? (
                    <MdxContent source={article.content} />
                  ) : (
                    <MarkdownContent content={article.content} />
                  )}
                </div>

                {/* Next in journey (profile-aware) */}
                <ArticleNavigation category={params.category} slug={params.slug} />

                {/* Sequential prev/next navigation */}
                <ArticleSequentialNav prev={prevArticle} next={nextArticle} />

                {/* Related articles */}
                <RelatedArticles
                  articles={relatedWithTime}
                  categoryLabels={categoryLabels}
                />

                {/* Liens internes vers outils et services */}
                <ArticleInternalLinks category={params.category} />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}
