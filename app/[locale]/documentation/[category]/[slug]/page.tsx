import { Link } from "@/i18n/navigation"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"
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
import { BreadcrumbJsonLd, ArticleJsonLd, FAQJsonLd, HowToJsonLd } from "@/components/json-ld";

const categoryLabels: Record<string, string> = {
  "marketing-digital": "Marketing Digital",
  seo: "SEO",
  "design-ui-ux": "Design & UI/UX",
  "projet-site-web": "Projet de site web",
  wordpress: "WordPress",
  "wordpress-headless": "WordPress Headless",
  choisir: "Choisir sa techno",
  "etre-trouve": "Être trouvé à l'heure de l'IA",
  "ia-et-code": "IA & code",
  "avant-signer": "Avant de signer",
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
        ? { minutes: "min read", sections: "sections", recently: "Recently", updated: "Updated:" }
        : { minutes: "min de lecture", sections: "sections", recently: "Récemment", updated: "Mis à jour :" };
    const article = getArticleBySlug(params.category, params.slug, params.locale)

    // Garde : slug ou catégorie inexistants → 404 propre au lieu d'une erreur runtime.
    if (!article) notFound()

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
      "wordpress-headless": ["wordpress", "seo", "projet-site-web"],
      wordpress: ["wordpress-headless", "design-ui-ux", "projet-site-web"],
      seo: ["marketing-digital", "wordpress-headless", "projet-site-web"],
      "design-ui-ux": ["projet-site-web", "marketing-digital", "wordpress"],
      "marketing-digital": ["seo", "design-ui-ux", "projet-site-web"],
      "projet-site-web": ["wordpress-headless", "design-ui-ux", "seo"],
      choisir: ["wordpress-headless", "projet-site-web", "wordpress"],
      "etre-trouve": ["seo", "marketing-digital", "wordpress-headless"],
      "ia-et-code": ["etre-trouve", "wordpress-headless", "applications-web-mobile"],
      "avant-signer": ["choisir", "ia-et-code", "projet-site-web"],
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
      return { ...a, readingTime: full ? estimateReadingTime(full.content) : 1 }
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
          datePublished={article.dateIso || (typeof article.date === "string" ? article.date : new Date().toISOString())}
          dateModified={article.updatedIso}
          author={article.author || "Agathe Karinthi-Martin"}
          url={`/documentation/${article.category}/${article.slug}`}
          type={article.category === "wordpress-headless" ? "TechArticle" : "Article"}
          proficiencyLevel={article.category === "wordpress-headless" ? "Intermediate" : undefined}
          dependencies={article.category === "wordpress-headless" ? "WordPress, Next.js, Node.js" : undefined}
        />
        {article.faq && article.faq.length > 0 && <FAQJsonLd questions={article.faq} />}
        {article.howto && article.howto.length > 0 && (
          <HowToJsonLd
            name={article.title}
            description={article.description}
            steps={article.howto}
            totalTime={article.howtoTotalTime}
          />
        )}
        <ReadingProgress />
        <ArticleReadTracker category={params.category} slug={params.slug} />
        <ScrollToTop />
        <MobileToc tableOfContents={tableOfContents} />
        <TranslationFallbackBanner show={article.isFallback} />
        <section className="bg-obsidian">
          <div className="container">
            {/* Breadcrumb */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Link
                href="/documentation"
                className="inline-flex items-center gap-1.5 text-[0.8125rem] text-mid-gray no-underline transition-colors hover:text-accent-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("breadcrumbDocs")}
              </Link>
              <span className="text-dark-gray" aria-hidden>·</span>
              <Link
                href={`/documentation/${article.category}` as never}
                className="text-[0.8125rem] text-mid-gray no-underline transition-colors hover:text-accent-secondary"
              >
                {categoryLabel}
              </Link>
            </div>

            {/* Article header */}
            <div className="mb-10 border-t-2 border-foreground pt-10">
              {/* Meta row */}
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <span className="border border-dark-gray px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                  {categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-mid-gray">
                  <Clock className="h-3 w-3" />
                  {readingTime} {tArticle.minutes}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-mid-gray">
                  <BookOpen className="h-3 w-3" />
                  {tableOfContents.filter(toc => toc.level === 2).length} {tArticle.sections}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {article.title}
              </h1>

              {/* Description */}
              <p className="mb-6 max-w-[56ch] font-inter-tight text-lg leading-relaxed text-mid-gray">
                {article.description}
              </p>

              {/* Author / date / share */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dark-gray pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {article.author || "Next Impact"}
                  </span>
                  <span className="text-dark-gray" aria-hidden>·</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                    {typeof article.date === "string" ? article.date : tArticle.recently}
                  </span>
                  {article.updated && (
                    <>
                      <span className="text-dark-gray" aria-hidden>·</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                        {tArticle.updated} {article.updated}
                      </span>
                    </>
                  )}
                </div>
                <ShareSocial url={`/documentation/${article.category}/${article.slug}`} title={article.title} />
              </div>
            </div>

            {/* Content grid: TOC + Article */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
              <aside className="col-span-1 hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContentsPopup tableOfContents={tableOfContents} />
                </div>
              </aside>
              <div id="article-body" className="col-span-1 flex flex-col gap-8 lg:col-span-3">
                {/* Reading area */}
                <div className="w-full border border-dark-gray bg-jet p-6 md:p-10">
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
