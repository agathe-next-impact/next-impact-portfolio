import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CaseStudyCTA from "@/components/case-studies/CaseStudyCTA";
import CaseStudyProfileContent from "@/components/case-studies/CaseStudyProfileContent";
import { YoutubePlayer } from "@/components/youtube-player";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { Metadata } from "next";
import { generateArticleMetadata } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import {
  getAllSlugs,
  getCaseStudies,
  getCaseStudy,
  getResultHighlights,
} from "@/lib/case-studies-data";
import type { CaseStudy } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

// meta données dynamiques pour la page d'étude de cas
export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const t = await getTranslations({ locale, namespace: "caseStudyDetail" });
  const caseStudy = getCaseStudy(locale, slug);
  if (!caseStudy) {
    return {
      title: t("metaNotFoundTitle"),
      description: t("metaNotFoundDescription"),
    };
  }

  return generateArticleMetadata({
    title: caseStudy.title,
    description: caseStudy.description,
    slug: caseStudy.slug,
    image: caseStudy.gallery.url || caseStudy.imageUrl,
    publishedTime:
      caseStudy.date.year && caseStudy.date.month
        ? new Date(caseStudy.date.year, caseStudy.date.month - 1).toISOString()
        : new Date().toISOString(),
    tags: caseStudy.technologies,
    locale,
  });
}

// Fonction pour obtenir les études de cas similaires
function getSimilarCaseStudies(
  all: CaseStudy[],
  current: CaseStudy,
  limit = 3,
): CaseStudy[] {
  return all
    .filter((study) => {
      if (study.id === current.id) return false;
      const sameClientType = study.clientType === current.clientType;
      const commonTags = study.tags.filter((tag) => current.tags.includes(tag));
      return sameClientType || commonTags.length > 0;
    })
    .slice(0, limit);
}

// Fonction pour générer les chemins statiques
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudyDetail" });
  const allCaseStudies = getCaseStudies(locale);
  const caseStudy = allCaseStudies.find((study) => study.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const similarCaseStudies = getSimilarCaseStudies(allCaseStudies, caseStudy);
  const resultHighlights = getResultHighlights(locale, caseStudy.slug);
  const monthsRaw = t.raw("months") as string[];
  const clientTypeLabel = t(`clientTypes.${caseStudy.clientType}`);

  // Fil d'Ariane pour le SEO
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbCaseStudies"), url: "/etudes-de-cas" },
    { name: caseStudy.title, url: `/etudes-de-cas/${caseStudy.slug}` },
  ];

  // Date de publication pour JSON-LD
  const publishedDate =
    caseStudy.date.year && caseStudy.date.month
      ? new Date(caseStudy.date.year, caseStudy.date.month - 1).toISOString()
      : new Date().toISOString();

  return (
    <>
      {/* Données structurées pour le SEO */}
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={`${t("articleTitlePrefix")} ${caseStudy.title} - ${t("articleTitleSuffix")}`}
        description={caseStudy.description}
        image={caseStudy.gallery.url || caseStudy.imageUrl}
        datePublished={publishedDate}
        url={`/etudes-de-cas/${caseStudy.slug}`}
      />

      <main>
        {/* Back link + en-tête d'étude de cas */}
        <BlueprintSection tone="obsidian">
          <Reveal>
            <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
              <Link
                href="/etudes-de-cas"
                className="group mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-foreground"
              >
                <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
                {t("backToCaseStudies")}
              </Link>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                  <span>{clientTypeLabel}</span>
                  <span className="h-px w-6 bg-accent-secondary/50" />
                  <span className="text-mid-gray">
                    {caseStudy.date.month && monthsRaw[caseStudy.date.month - 1]}{" "}
                    {caseStudy.date.year}
                  </span>
                </div>
                <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  {caseStudy.title}
                </h1>
                <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
                  {caseStudy.description}
                </p>
              </div>
            </div>
          </Reveal>
        </BlueprintSection>

        {/* Contenu principal */}
        <BlueprintSection tone="obsidian">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* Colonne gauche : média + chiffres + contenu */}
            <div className="border-b border-dark-gray px-6 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
              {/* Média */}
              <Reveal>
                <div className="mb-10 rounded-md bg-overlay-gray p-2 md:p-4">
                  {caseStudy.youtubeVideoId ? (
                    caseStudy.youtubeIsShort ? (
                      <div className="flex justify-center overflow-hidden rounded-sm bg-obsidian p-4">
                        <div className="relative w-full max-w-[280px]">
                          <YoutubePlayer
                            videoId={caseStudy.youtubeVideoId}
                            title={caseStudy.title}
                            aspect="short"
                            compact
                            label={locale === "en" ? "Mobile demo" : "Demo mobile"}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-sm">
                        <YoutubePlayer
                          videoId={caseStudy.youtubeVideoId}
                          title={caseStudy.title}
                        />
                      </div>
                    )
                  ) : (
                    <Image
                      src={caseStudy.gallery.url || "/placeholder.svg"}
                      alt={caseStudy.gallery.alt}
                      width={800}
                      height={500}
                      className="block w-full rounded-sm object-cover"
                      priority
                      fetchPriority="high"
                    />
                  )}
                </div>
              </Reveal>

              {/* Chiffres clés */}
              {resultHighlights && (
                <Reveal>
                  <div className="mb-10 grid grid-cols-3 border border-dark-gray">
                    {resultHighlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="px-4 py-6 text-center md:px-6 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-dark-gray"
                      >
                        <div className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
                          {highlight.value}
                        </div>
                        <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                          {highlight.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* Présentation du projet + Objectifs + Résultats (adaptatif par profil) */}
              <CaseStudyProfileContent
                slug={caseStudy.slug}
                locale={locale}
                defaultDescription={caseStudy.description}
                defaultDetailedDescription={caseStudy.detailedDescription}
                defaultObjectives={caseStudy.objectives}
                defaultResults={caseStudy.results}
              />

              {/* Témoignage client */}
              {caseStudy.testimonial && (
                <Reveal>
                  <blockquote className="mt-10 border-l-2 border-accent-secondary pl-6">
                    <p className="mb-4 font-inter-tight text-[15px] italic leading-relaxed text-foreground">
                      &ldquo;{caseStudy.testimonial.content}&rdquo;
                    </p>
                    <footer className="flex items-center gap-3">
                      <Image
                        src={caseStudy.imageUrl}
                        alt={caseStudy.testimonial.author}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {caseStudy.testimonial.author}
                        </div>
                        <div className="font-mono text-[10px] text-mid-gray">
                          {caseStudy.testimonial.position}
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                </Reveal>
              )}
            </div>

            {/* Colonne droite : barre latérale sticky */}
            <aside className="px-6 py-10 lg:sticky lg:top-20 lg:self-start lg:px-8 lg:py-12">
              {/* Client */}
              <div className="mb-4 border-b border-dark-gray pb-4">
                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {t("client")}
                </div>
                <div className="text-[15px] font-medium text-foreground">
                  {caseStudy.clientName}
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-mid-gray">
                  {clientTypeLabel}
                </div>
              </div>

              {/* Date de livraison */}
              <div className="mb-4 border-b border-dark-gray pb-4">
                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {t("deliveryDate")}
                </div>
                <div className="flex items-center gap-1.5 text-[15px] font-medium text-foreground">
                  <Calendar size={14} className="text-mid-gray" />
                  {caseStudy.date.month && monthsRaw[caseStudy.date.month - 1]}{" "}
                  {caseStudy.date.year}
                </div>
              </div>

              {/* Durée */}
              <div className="mb-4 border-b border-dark-gray pb-4">
                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {t("duration")}
                </div>
                <div className="text-[15px] font-medium text-foreground">
                  {caseStudy.duration}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-4 border-b border-dark-gray pb-4">
                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {t("technologies")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {caseStudy.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-sm border border-dark-gray px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-mid-gray"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4 border-b border-dark-gray pb-4">
                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {t("tags")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {caseStudy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-dark-gray px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-mid-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Site web */}
              {caseStudy.website && (
                <div className="mb-4 border-b border-dark-gray pb-4">
                  <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                    {t("website")}
                  </div>
                  <a
                    href={caseStudy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-mono text-[11px] text-accent-secondary underline underline-offset-2 hover:text-foreground"
                  >
                    {caseStudy.website}
                  </a>
                </div>
              )}

              {/* CTA */}
              <div className="mt-2">
                <CaseStudyCTA />
              </div>
            </aside>
          </div>
        </BlueprintSection>

        {/* Projets similaires */}
        <BlueprintSection tone="jet">
          <Reveal>
            <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
              <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
                {t("similarProjects")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {similarCaseStudies.map((study, i) => (
                <Link
                  key={study.id}
                  href={`/etudes-de-cas/${study.slug}`}
                  className="group block border-b border-dark-gray last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={study.gallery.url || "/placeholder.svg"}
                      alt={study.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="border-t border-dark-gray px-6 py-5">
                    <h3 className="mb-1.5 text-lg font-light tracking-tight text-foreground">
                      {study.title}
                    </h3>
                    <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                      {study.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </BlueprintSection>
      </main>
    </>
  );
}
