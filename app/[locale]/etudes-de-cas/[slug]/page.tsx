import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CaseStudyCTA from "@/components/case-studies/CaseStudyCTA";
import CaseStudyProfileContent from "@/components/case-studies/CaseStudyProfileContent";
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
  });
}

// Couleurs d'accent pour les boîtes de résultats
const highlightColors = [
  { border: "border-coral/30", bg: "bg-coral/10", text: "text-coral" },
  { border: "border-orange/30", bg: "bg-orange/10", text: "text-orange" },
  { border: "border-lightblue/30", bg: "bg-lightblue/10", text: "text-lightblue" },
];

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

      <main className="min-h-screen">
        {/* Hero section avec image et titre */}
        <div className="container relative h-full flex flex-col justify-end py-4 mt-10 mb-20 px-4 md:px-6 bg-mediumblue/50 backdrop-blur-md rounded-3xl">
          <Link
            href="/etudes-de-cas"
            className="text-white/70 mb-4 flex items-center hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToCaseStudies")}
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            {caseStudy.title}
          </h1>
          <p className="text-xl max-w-3xl text-white/70">
            {caseStudy.description}
          </p>
          {caseStudy.imageUrl && (
            <Image
              src={caseStudy.imageUrl}
              alt={caseStudy.title}
              width={150}
              height={150}
              className="object-contain mt-12"
              priority
              fetchPriority="high"
            />
          )}
        </div>

        {/* Contenu principal */}
        <div className="container relative z-10 px-4 md:px-6 pb-6 -mt-12 rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start bg-mediumblue/90 backdrop-blur-sm p-4 md:p-8 rounded-3xl z-50">
            <div className="lg:col-span-2 space-y-6 sm:space-y-10">
              {/* Galerie */}
              <section>
                <h2 className="text-2xl md:mb-6 text-white/80">
                  {t("projectOverview")}
                </h2>
                <div className="rounded-lg border overflow-hidden">
                  {caseStudy.youtubeVideoId ? (
                    caseStudy.youtubeIsShort ? (
                      <div className="flex justify-center bg-black p-4">
                        <div
                          className="w-full max-w-[280px]"
                          style={{ position: "relative" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              paddingTop: "177.78%",
                              position: "relative",
                            }}
                          >
                            <iframe
                              className="absolute top-0 left-0 w-full h-full border-0"
                              src={`https://www.youtube.com/embed/${caseStudy.youtubeVideoId}`}
                              title={caseStudy.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${caseStudy.youtubeVideoId}`}
                          title={caseStudy.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )
                  ) : (
                    <Image
                      src={caseStudy.gallery.url || "/placeholder.svg"}
                      alt={caseStudy.gallery.alt}
                      width={800}
                      height={500}
                      className="w-full object-cover"
                      priority
                      fetchPriority="high"
                    />
                  )}
                </div>
              </section>

              {/* Chiffres clés */}
              {resultHighlights && (
                <section className="bg-mediumblue/80 backdrop-blur-md rounded-2xl p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {resultHighlights.map((highlight, index) => {
                      const color = highlightColors[index % highlightColors.length];
                      return (
                        <div
                          key={index}
                          className={`rounded-2xl border p-4 sm:p-6 text-center ${color.bg} ${color.border}`}
                        >
                          <p className={`text-xl sm:text-3xl font-googletitre font-bold mb-1 ${color.text}`}>
                            {highlight.value}
                          </p>
                          <p className="text-xs sm:text-sm font-googletexte font-medium text-white/80">
                            {highlight.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
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
                <section className="bg-mediumblue/90 backdrop-blur-xl p-6 rounded-2xl">
                  <h2 className="text-2xl md:mb-6 text-white/80">
                    {t("testimonial")}
                  </h2>
                  <blockquote className="relative">
                    <div className="italic text-white/70 mb-4">
                      &ldquo;{caseStudy.testimonial.content}&rdquo;
                    </div>
                    <footer className="flex items-center">
                      <div className="h-12 w-12 flex items-center justify-center mr-4">
                        <Image
                          src={caseStudy.imageUrl}
                          alt={caseStudy.testimonial.author}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-googletitre text-white/80">
                          {caseStudy.testimonial.author}
                        </div>
                        <div className="text-sm text-white/70">
                          {caseStudy.testimonial.position}
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                </section>
              )}
            </div>
            {/* Sidebar avec informations du projet */}
            <div className="lg:col-span-1 sticky top-16 self-start">
              <div className="p-4 md:p-6 top-8 bg-mediumblue backdrop-blur-md rounded-2xl">
                <h2 className="text-xl md:mb-6 text-white">
                  {t("projectInfo")}
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white/70 md:mb-1">
                      {t("client")}
                    </h3>
                    <div className="flex flex-col items-start gap-4">
                      <Badge
                        variant="outline"
                        className="bg-lightblue/10 text-white/70 font-medium"
                      >
                        {clientTypeLabel}
                      </Badge>
                      <div className="font-medium font-googletitre text-lg text-white">
                        {caseStudy.clientName}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">
                      {t("deliveryDate")}
                    </h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-extralightblue" />
                      <span className="font-medium font-googletitre text-lg text-white">
                        {caseStudy.date.month && monthsRaw[caseStudy.date.month - 1]}{" "}
                        {caseStudy.date.year}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">
                      {t("duration")}
                    </h3>
                    <span className="font-medium font-googletitre text-lg text-white">
                      {caseStudy.duration}
                    </span>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">
                      {t("technologies")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-extralightblue/10 text-white/70 font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white/80 mb-2">
                      {t("tags")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-extralightblue/10 text-white/80 font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {caseStudy.website && (
                    <div>
                      <h3 className="text-sm font-medium text-white/80 mb-2">
                        {t("website")}
                      </h3>
                      <a
                        href={caseStudy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 font-googletitre hover:underline"
                      >
                        {caseStudy.website}
                      </a>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <CaseStudyCTA />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Autres projets similaires */}
          <section className="my-8 sm:my-16">
            <h2 className="text-2xl text-white mb-6 sm:mb-8">{t("similarProjects")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {similarCaseStudies.map((study) => (
                <Link
                  key={study.id}
                  href={`/etudes-de-cas/${study.slug}`}
                  className="block rounded-lg"
                >
                  <Card className="h-full overflow-hidden bg-mediumblue/40 backdrop-blur-lg border-1 border-white/10 rounded-2xl ">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={study.gallery.url || "/placeholder.svg"}
                        alt={study.title}
                        fill
                        className="object-cover object-top transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardContent className="p-5 h-full">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          variant="outline"
                          className="bg-extralightblue/10 text-white font-medium"
                        >
                          {t(`clientTypes.${study.clientType}`)}
                        </Badge>
                        <div className="text-sm text-white/70">
                          {study.date.month && monthsRaw[study.date.month - 1]}{" "}
                          {study.date.year}
                        </div>
                      </div>
                      <h3 className="text-xl  text-white mb-2">{study.title}</h3>
                      <p className="text-white/80 mb-4 line-clamp-3">
                        {study.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
