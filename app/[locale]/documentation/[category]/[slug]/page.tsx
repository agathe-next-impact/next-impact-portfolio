import { Link } from "@/i18n/navigation"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"
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

export async function generateMetadata(props: { params: Promise<{ category: string; slug: string; locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const post = getArticleBySlug(params.category, params.slug, params.locale);
  if (!post) {
    return {
      title: params.locale === "en" ? "Article not found" : "Article introuvable",
      description: params.locale === "en" ? "The requested article does not exist." : "L'article demandé n'existe pas.",
    };
  }

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    path: `/documentation/${post.category}/${post.slug}`,
    type: "article",
    keywords: ["documentation", post.category, "article", params.locale === "en" ? "learn" : "comprendre"],
    locale: params.locale,
  });
}


interface ArticlePageProps {
  params: Promise<{
    category: string
    slug: string
    locale: Locale
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
    const t = await getTranslations({ locale: params.locale, namespace: "documentationPage" });
    const tArticle =
      params.locale === "en"
        ? { minutes: "min read", sections: "sections", recently: "Recently" }
        : { minutes: "min de lecture", sections: "sections", recently: "Récemment" };
    const article = getArticleBySlug(params.category, params.slug, params.locale)

    const categoryArticles = getArticlesByCategory(params.category, params.locale)
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
      .flatMap((cat) => getArticlesByCategory(cat, params.locale).slice(0, 2))
      .slice(0, 3)

    // Combine: prioritize same-category, then add cross-category
    const allRelatedCandidates = [
      ...sameCategoryCandidates,
      ...crossCategoryArticles.filter(
        (a) => !sameCategoryCandidates.some((s) => s.slug === a.slug && s.category === a.category)
      ),
    ].slice(0, 5)

    const relatedWithTime = allRelatedCandidates.map((a) => {
      const full = getArticleBySlug(a.category, a.slug, params.locale)
      return { ...a, readingTime: estimateReadingTime(full.content) }
    })

    const tableOfContents = article?.content ? generateTableOfContents(article.content) : []
    const readingTime = article?.content ? estimateReadingTime(article.content) : 0
    const categoryLabel = categoryLabels[article.category] || article.category.charAt(0).toUpperCase() + article.category.slice(1).replace(/-/g, " ")

    const breadcrumbItems = [
      { name: t("breadcrumbHome"), url: "/" },
      { name: t("breadcrumbDocs"), url: "/documentation" },
      { name: categoryLabel, url: `/documentation/${params.category}` },
      { name: article.title, url: `/documentation/${params.category}/${params.slug}` },
    ];

    return (
      <div style={{ minHeight: "100vh" }}>
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
        <TranslationFallbackBanner show={article.isFallback} />
        <section className="s">
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <Link
                href="/documentation"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8125rem",
                  color: "var(--muted-color)",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                {t("breadcrumbDocs")}
              </Link>
              <span style={{ color: "var(--rule-strong)" }}>·</span>
              <Link
                href={`/documentation/${article.category}` as never}
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted-color)",
                  textDecoration: "none",
                }}
              >
                {categoryLabel}
              </Link>
            </div>

            {/* Article header */}
            <div style={{
              borderTop: "2px solid var(--ink)",
              paddingTop: "2.5rem",
              marginBottom: "2.5rem",
            }}>
              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <span className="label">{categoryLabel}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted-color)", fontSize: "0.75rem" }}>
                  <Clock className="h-3 w-3" />
                  {readingTime} {tArticle.minutes}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted-color)", fontSize: "0.75rem" }}>
                  <BookOpen className="h-3 w-3" />
                  {tableOfContents.filter(toc => toc.level === 2).length} {tArticle.sections}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: "1rem",
              }}>
                {article.title}
              </h1>

              {/* Description */}
              <p style={{
                fontSize: "1.0625rem",
                color: "var(--muted-color)",
                lineHeight: 1.65,
                maxWidth: "56ch",
                marginBottom: "1.5rem",
              }}>
                {article.description}
              </p>

              {/* Author / date / share */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid var(--rule)",
                paddingTop: "1rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--ink-2)", fontWeight: 500 }}>
                    {article.author || "Next Impact"}
                  </span>
                  <span style={{ color: "var(--rule-strong)" }}>·</span>
                  <span className="annot">
                    {typeof article.date === "string" ? article.date : tArticle.recently}
                  </span>
                </div>
                <ShareSocial url={`/documentation/${article.category}/${article.slug}`} title={article.title} />
              </div>
            </div>

            {/* Content grid: TOC + Article */}
            <div className="grid grid-cols-1 lg:grid-cols-4" style={{ gap: "3rem" }}>
              <aside className="col-span-1 hidden lg:block">
                <div style={{ position: "sticky", top: "7rem" }}>
                  <TableOfContentsPopup tableOfContents={tableOfContents} />
                </div>
              </aside>
              <div id="article-body" className="col-span-1 lg:col-span-3" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Reading area */}
                <div
                  className="light article-text"
                  style={{
                    width: "100%",
                    padding: "2.5rem",
                    background: "var(--paper-2)",
                    color: "var(--ink)",
                  }}
                >
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
        </section>
      </div>
    )
}
