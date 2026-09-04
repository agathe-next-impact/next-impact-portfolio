import { Link } from "@/i18n/navigation"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"
import { MarkdownContent } from "@/components/documentation/markdown-content"
import { MdxContent } from "@/components/documentation/mdx-content"
import { getArticleBySlug, getArticlesByCategory, getAllCategories } from "@/lib/markdown"
import { routing } from "@/i18n/routing"
import TableOfContentsPopup from "@/components/documentation/table-of-content-popup"
import ShareSocial from "@/components/share-social"
import { ArticleReadTracker } from "@/components/documentation/article-read-tracker"
import { ReadingProgress } from "@/components/ui/reading-progress"
import { ArticleNavigation } from "@/components/documentation/article-navigation"
import { ScrollToTop } from "@/components/documentation/scroll-to-top"
import { MobileToc } from "@/components/documentation/mobile-toc"
import { ArticleSequentialNav } from "@/components/documentation/article-sequential-nav"
import { RelatedArticles } from "@/components/documentation/related-articles"
import { ArticleInternalLinks } from "@/components/documentation/documentation-internal-links"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ArticleJsonLd, FAQJsonLd, HowToJsonLd } from "@/components/json-ld";
import { DocBreadcrumb, toCrumbs } from "@/components/documentation/doc-breadcrumb";
import { ArticleEnBref } from "@/components/documentation/article-en-bref";
import { ArticleTocInline } from "@/components/documentation/article-toc-inline";
import { ArticleKeyFigures } from "@/components/documentation/article-key-figures";
import { ArticleAuthorCard } from "@/components/documentation/article-author-card";
import { ArticleCta } from "@/components/documentation/article-cta";
import { getRubrique, rubriqueHref, rx } from "@/lib/documentation-rubriques";
import { generateTableOfContents } from "@/lib/toc";

// Même politique que la page de catégorie : les articles sont des fichiers du
// dépôt, ils n'ont aucune raison d'être rendus à la demande. Sans ces deux
// exports, chaque article partait en fonction serverless — les logs de
// production du 2026-08-16 montrent 288 à 1808 ms de TTFB en `vercelCache: MISS`
// sur les articles, quand tout le reste du site répondait en PRERENDER à ~250 ms.
export const revalidate = 86400;

/**
 * Couples (catégorie, slug) à prérendre.
 *
 * On énumère par RÉPERTOIRE, pas par le champ `category` du front matter :
 * `getArticleBySlug` résout un chemin de fichier, donc c'est le nom de dossier
 * qui fait l'URL. Les deux locales sont fusionnées — un article traduit
 * seulement en anglais doit exister lui aussi. `dynamicParams` reste à sa valeur
 * par défaut : un article ajouté hors build est servi à la demande, pas en 404.
 */
export function generateStaticParams() {
  const pairs = new Map<string, { category: string; slug: string }>()

  for (const locale of routing.locales) {
    for (const category of getAllCategories(locale)) {
      for (const article of getArticlesByCategory(category, locale)) {
        pairs.set(`${category}/${article.slug}`, { category, slug: article.slug })
      }
    }
  }

  return Array.from(pairs.values())
}

const categoryLabels: Record<string, string> = {
  "marketing-digital": "Marketing Digital",
  seo: "SEO",
  "design-ui-ux": "Design & UI/UX",
  "projet-site-web": "Projet de site web",
  wordpress: "WordPress",
  "wordpress-headless": "WordPress Headless",
  "applications-web-mobile": "Web app & plateforme",
  choisir: "Choisir sa techno",
  "etre-trouve": "Être trouvé à l'heure de l'IA",
  "ia-et-code": "IA & code",
  "avant-signer": "Avant de signer",
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

/** « Mis à jour : juillet 2026 » — mois + année, jamais codé en dur. */
function formatMonthYear(iso: string | undefined, locale: Locale): string | null {
  if (!iso) return null
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
  })
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
      "applications-web-mobile": ["wordpress-headless", "projet-site-web", "design-ui-ux"],
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

    // ── Gabarit « GEO-ready » ─────────────────────────────────────────────────
    // Un article n'y bascule que s'il respecte le contrat de contenu (rubrique +
    // enBref + dateModified — voir content/documentation/README.md). Les autres
    // gardent le rendu historique : la migration se fait par lots.
    const rubrique = article.isGeoReady ? getRubrique(article.rubrique ?? "") : undefined;
    const isGeoReady = Boolean(rubrique);
    const updatedMonthYear = formatMonthYear(article.updatedIso, params.locale);

    // Le 3e niveau du fil d'Ariane suit la taxonomie visible : la rubrique quand
    // l'article en déclare une, la catégorie de contenu sinon.
    const parentName = rubrique ? rx(rubrique.label, params.locale) : categoryLabel;
    const parentUrl = rubrique
      ? rubriqueHref(rubrique.slug)
      : `/documentation/${params.category}`;

    const breadcrumbItems = [
      { name: t("breadcrumbHome"), url: "/" },
      { name: t("breadcrumbDocs"), url: "/documentation" },
      { name: parentName, url: parentUrl },
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
          inLanguage={params.locale === "en" ? "en-US" : "fr-FR"}
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
            {/* Breadcrumb — 4 niveaux visibles sur le gabarit, miroir exact du
                BreadcrumbList JSON-LD. Rendu historique sinon. */}
            {isGeoReady ? (
              <DocBreadcrumb items={toCrumbs(breadcrumbItems)} />
            ) : (
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
            )}

            {/* Article header */}
            <div className="mb-10 border-t-2 border-foreground pt-10">
              {/* Meta row */}
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <span className="border border-dark-gray px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                  {rubrique ? rx(rubrique.label, params.locale) : categoryLabel}
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
                  {/* Date de mise à jour — mois + année sur le gabarit, toujours
                      alimentée par le front matter, jamais codée en dur. */}
                  {(isGeoReady ? updatedMonthYear : article.updated) && (
                    <>
                      <span className="text-dark-gray" aria-hidden>·</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                        {tArticle.updated} {isGeoReady ? updatedMonthYear : article.updated}
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
                  {/* « En bref » + sommaire ancré : rendus AVANT le corps et côté
                      serveur — c'est ce que les moteurs IA extraient en premier. */}
                  {isGeoReady && article.enBref && (
                    <ArticleEnBref lines={article.enBref} locale={params.locale} />
                  )}
                  {isGeoReady && (
                    <ArticleTocInline entries={tableOfContents} locale={params.locale} />
                  )}
                  {article.isMdx ? (
                    <MdxContent source={article.content} />
                  ) : (
                    <MarkdownContent content={article.content} />
                  )}
                </div>

                {/* Chiffres clés (optionnel — contenu éditorial) */}
                {isGeoReady && article.keyFigures && (
                  <ArticleKeyFigures figures={article.keyFigures} locale={params.locale} />
                )}

                {/* Encart auteur — composant unique partagé */}
                {isGeoReady && <ArticleAuthorCard locale={params.locale} />}

                {/* Un seul CTA de sortie, contextuel à la rubrique */}
                {rubrique && <ArticleCta rubrique={rubrique.slug} locale={params.locale} />}


                {/* Next in journey (profile-aware) */}
                <ArticleNavigation category={params.category} slug={params.slug} />

                {/* Sequential prev/next navigation */}
                <ArticleSequentialNav prev={prevArticle} next={nextArticle} />

                {/* Related articles */}
                <RelatedArticles
                  articles={relatedWithTime}
                  categoryLabels={categoryLabels}
                />

                {/* Liens internes vers outils et services — remplacés par le CTA
                    unique sur le gabarit (la doc prouve, elle ne vend pas). */}
                {!isGeoReady && <ArticleInternalLinks category={params.category} />}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
}
