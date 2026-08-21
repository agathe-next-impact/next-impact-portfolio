import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CaseStudyCTA from "@/components/case-studies/CaseStudyCTA";
import CaseStudyDecisionPath from "@/components/case-studies/CaseStudyDecisionPath";
import CaseStudyProfileContent from "@/components/case-studies/CaseStudyProfileContent";
import { ArticleEnBref } from "@/components/documentation/article-en-bref";
import { YoutubePlayer } from "@/components/youtube-player";
import { BlueprintSection } from "@/components/aspect/section";
import { PageHero } from "@/components/aspect/page-hero";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { Reveal } from "@/components/ui/reveal";
import { Metadata } from "next";
import { generateArticleMetadata } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import {
  formatDelai,
  getAllSlugs,
  getCaseStudies,
  getCaseStudy,
  getResultHighlights,
} from "@/lib/case-studies-data";
import type { CaseStudy } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

// Les brouillons (statut ≠ publie) ne sont prévisualisables qu'en dev :
// en production ils restent introuvables (404), hors sitemap et hors liste.
const PREVIEW_DRAFTS = process.env.NODE_ENV === "development";

// meta données dynamiques pour la page d'étude de cas
export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const t = await getTranslations({ locale, namespace: "caseStudyDetail" });
  const caseStudy = getCaseStudy(locale, slug, { includeDrafts: PREVIEW_DRAFTS });
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

// Fonction pour générer les chemins statiques.
// dynamicParams = false (layout [locale]) : en production, seuls les slugs
// publiés existent — les brouillons font 404 ; en dev ils sont prévisualisables.
export async function generateStaticParams() {
  return getAllSlugs({ includeDrafts: PREVIEW_DRAFTS }).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudyDetail" });
  // Listes annexes (similaires, historique) : cas publiés uniquement, même en dev.
  const allCaseStudies = getCaseStudies(locale);
  const caseStudy =
    allCaseStudies.find((study) => study.slug === slug) ??
    (PREVIEW_DRAFTS ? getCaseStudy(locale, slug, { includeDrafts: true }) : undefined);

  if (!caseStudy) {
    notFound();
  }

  const similarCaseStudies = getSimilarCaseStudies(allCaseStudies, caseStudy);

  // Historique client : les cas publiés partageant le même clientId.
  // S'il y en a plusieurs, ce bloc remplace « Projets similaires ».
  const clientProjects = caseStudy.clientId
    ? allCaseStudies.filter((s) => s.clientId === caseStudy.clientId)
    : [];
  const hasClientHistory = clientProjects.length >= 2;
  const otherClientProjects = clientProjects.filter((s) => s.id !== caseStudy.id);
  const clientYears = clientProjects
    .map((s) => s.date.year)
    .filter((y): y is number => y !== null);
  const clientSince = clientYears.length ? Math.min(...clientYears) : null;

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

  // Date de dernière mise à jour éditoriale réelle (champ `updated` de la
  // fiche) → dateModified JSON-LD. Absente = jamais retouchée depuis
  // publication, ArticleJsonLd retombe alors sur datePublished.
  const modifiedDate =
    caseStudy.updated?.year && caseStudy.updated?.month
      ? new Date(caseStudy.updated.year, caseStudy.updated.month - 1).toISOString()
      : undefined;

  return (
    <>
      {/* Données structurées pour le SEO */}
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={`${t("articleTitlePrefix")} ${caseStudy.title} - ${t("articleTitleSuffix")}`}
        description={caseStudy.description}
        image={caseStudy.gallery.url || caseStudy.imageUrl}
        datePublished={publishedDate}
        dateModified={modifiedDate}
        url={`/etudes-de-cas/${caseStudy.slug}`}
      />

      <main>
        {/* Back link + en-tête d'étude de cas (harmonisé /veille) */}
        <PageHero
          index={clientTypeLabel}
          kicker={`${caseStudy.date.month ? monthsRaw[caseStudy.date.month - 1] : ""} ${caseStudy.date.year ?? ""}`.trim()}
          title={caseStudy.title}
          description={caseStudy.description}
          backdrop={<AuroraGlow intensity="subtle" />}
          breadcrumb={
            <Link
              href="/etudes-de-cas"
              className="group mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-foreground"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              {t("backToCaseStudies")}
            </Link>
          }
        />

        {/* Contenu principal */}
        <BlueprintSection tone="obsidian" className="border-t border-dark-gray">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* Colonne gauche : média + chiffres + contenu */}
            <div className="border-b border-dark-gray px-6 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
              {/* « En bref » — résumé citable en tête de fiche, rendu AVANT le
                  média : c'est ce qu'un moteur de réponse IA extrait en premier. */}
              {caseStudy.enBref && (
                <ArticleEnBref lines={caseStudy.enBref} locale={locale} />
              )}

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

              {/* Présentation du projet + Objectifs + Résultats (adaptatif par profil ;
                  titres de sections transposés pour la famille agents-ia) */}
              <CaseStudyProfileContent
                slug={caseStudy.slug}
                locale={locale}
                famille={caseStudy.famille}
                defaultDescription={caseStudy.description}
                defaultDetailedDescription={caseStudy.detailedDescription}
                defaultObjectives={caseStudy.objectives}
                defaultResults={caseStudy.results}
              />

              {/* L'arbitrage technologique — preuve de conseil : options sur la
                  table, décision, raison. Affiché uniquement si renseigné. */}
              {caseStudy.arbitrage && (
                <Reveal>
                  <div className="mt-10 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 p-6">
                    <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                      {t("arbitrageTitle")}
                    </div>
                    <div className="mb-4">
                      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                        {t("arbitrageOptions")}
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {caseStudy.arbitrage.consideredOptions.map((option) => (
                          <li
                            key={option}
                            className="font-inter-tight text-sm leading-relaxed text-mid-gray"
                          >
                            — {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                        {t("arbitrageDecision")}
                      </div>
                      <p className="font-inter-tight text-sm font-medium leading-relaxed text-foreground">
                        {caseStudy.arbitrage.decision}
                      </p>
                    </div>
                    <div>
                      <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                        {t("arbitrageRationale")}
                      </div>
                      <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                        {caseStudy.arbitrage.rationale}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* La solution — section du gabarit automatisation (sources
                  surveillées, tri/synthèse, lettre par mail). Masquée si absente. */}
              {caseStudy.solution && (
                <Reveal>
                  <section className="mt-10">
                    <h2 className="mb-5 text-2xl font-light leading-tight tracking-tight text-foreground md:text-3xl">
                      {t("solutionTitle")}
                    </h2>
                    <div className="font-inter-tight">
                      {caseStudy.solution.split("\n\n").map((paragraph, index) => (
                        <p
                          key={index}
                          className="mb-4 text-[15px] leading-relaxed text-mid-gray"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* Le chemin de décision — besoin → arbitrage → construction,
                  relié aux offres /conseil et /solutions-web quand renseigné. */}
              <CaseStudyDecisionPath caseStudy={caseStudy} locale={locale} />

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

              {/* Historique client — un client qui revient est une preuve plus
                  forte qu'une similarité de tags : remplace « Projets similaires ». */}
              {hasClientHistory && (
                <Reveal>
                  <div className="mt-10 border border-dark-gray">
                    <div className="border-b border-dark-gray px-6 py-4">
                      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                        {t("clientHistory.title")}
                      </div>
                      <p className="font-inter-tight text-sm leading-relaxed text-foreground">
                        {clientSince !== null
                          ? t("clientHistory.hook", {
                              client: caseStudy.clientName,
                              year: String(clientSince),
                              count: String(clientProjects.length),
                            })
                          : t("clientHistory.hookNoYear", {
                              client: caseStudy.clientName,
                              count: String(clientProjects.length),
                            })}
                      </p>
                    </div>
                    {otherClientProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/etudes-de-cas/${project.slug}`}
                        className="group flex items-center justify-between gap-4 px-6 py-4 no-underline transition-colors hover:bg-jet/40 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-dark-gray"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-light tracking-tight text-foreground">
                            {project.title}
                          </span>
                          {project.date.year && (
                            <span className="font-mono text-[10px] text-mid-gray">
                              {project.date.year}
                            </span>
                          )}
                        </span>
                        <ArrowRight
                          size={12}
                          className="shrink-0 text-accent-secondary transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </Link>
                    ))}
                  </div>
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

              {/* Durée — masquée tant que la donnée n'est pas fournie (brouillons) */}
              {caseStudy.delai && (
                <div className="mb-4 border-b border-dark-gray pb-4">
                  <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                    {t("duration")}
                  </div>
                  <div className="text-[15px] font-medium text-foreground">
                    {formatDelai(caseStudy.delai, locale)}
                  </div>
                </div>
              )}

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

              {/* CTA à deux températures : froid (audit) + chaud (RDV par famille) */}
              <div className="mt-2">
                <CaseStudyCTA famille={caseStudy.famille} locale={locale} />
              </div>
            </aside>
          </div>
        </BlueprintSection>

        {/* Projets similaires — remplacé par l'historique client quand il existe */}
        {!hasClientHistory && (
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
        )}
      </main>
    </>
  );
}
