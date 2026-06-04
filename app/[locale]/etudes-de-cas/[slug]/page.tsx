import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CaseStudyCTA from "@/components/case-studies/CaseStudyCTA";
import CaseStudyProfileContent from "@/components/case-studies/CaseStudyProfileContent";
import { YoutubePlayer } from "@/components/youtube-player";
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
        {/* Back link + sec-head */}
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            <Link
              href="/etudes-de-cas"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 32,
              }}
            >
              ← {t("backToCaseStudies")}
            </Link>
            <div className="sec-head">
              <div className="sec-no">№ —</div>
              <h1
                className="ni-serif"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 64px)",
                  lineHeight: 1.0,
                  margin: 0,
                  color: "var(--ink)",
                }}
              >
                {caseStudy.title}
              </h1>
              <div className="sec-meta">
                {clientTypeLabel} ·{" "}
                {caseStudy.date.month && monthsRaw[caseStudy.date.month - 1]}{" "}
                {caseStudy.date.year}
              </div>
            </div>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-2)",
                maxWidth: 640,
                lineHeight: 1.65,
                marginTop: 16,
              }}
            >
              {caseStudy.description}
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: 0,
                alignItems: "start",
              }}
            >
              {/* Left: media + stats + content */}
              <div style={{ paddingRight: 48, borderRight: "1px solid var(--rule)" }}>
                {/* Media */}
                <div style={{ border: "1px solid var(--rule)", marginBottom: 40 }}>
                  {caseStudy.youtubeVideoId ? (
                    caseStudy.youtubeIsShort ? (
                      <div style={{ display: "flex", justifyContent: "center", background: "#000", padding: 16 }}>
                        <div style={{ width: "100%", maxWidth: 280, position: "relative" }}>
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
                      <YoutubePlayer videoId={caseStudy.youtubeVideoId} title={caseStudy.title} />
                    )
                  ) : (
                    <Image
                      src={caseStudy.gallery.url || "/placeholder.svg"}
                      alt={caseStudy.gallery.alt}
                      width={800}
                      height={500}
                      style={{ width: "100%", objectFit: "cover", display: "block" }}
                      priority
                      fetchPriority="high"
                    />
                  )}
                </div>

                {/* Chiffres clés */}
                {resultHighlights && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      borderTop: "1px solid var(--rule)",
                      marginBottom: 40,
                    }}
                  >
                    {resultHighlights.map((highlight, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "24px",
                          borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                          textAlign: "center",
                        }}
                      >
                        <div
                          className="ni-serif"
                          style={{
                            fontSize: 32,
                            color: "var(--ink)",
                            marginBottom: 4,
                          }}
                        >
                          {highlight.value}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 9,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--muted-color)",
                          }}
                        >
                          {highlight.label}
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <blockquote
                    style={{
                      borderLeft: "3px solid var(--accent-color)",
                      paddingLeft: 24,
                      marginTop: 32,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--serif)",
                        fontStyle: "italic",
                        fontSize: 15,
                        color: "var(--ink-2)",
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      &ldquo;{caseStudy.testimonial.content}&rdquo;
                    </p>
                    <footer style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Image
                        src={caseStudy.imageUrl}
                        alt={caseStudy.testimonial.author}
                        width={40}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                          {caseStudy.testimonial.author}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            color: "var(--muted-color)",
                          }}
                        >
                          {caseStudy.testimonial.position}
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                )}
              </div>

              {/* Right sidebar: sticky */}
              <div style={{ paddingLeft: 32, position: "sticky", top: 80 }}>
                {/* Client */}
                <div
                  style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted-color)",
                      marginBottom: 6,
                    }}
                  >
                    {t("client")}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>
                    {caseStudy.clientName}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      color: "var(--muted-color)",
                      marginTop: 2,
                    }}
                  >
                    {clientTypeLabel}
                  </div>
                </div>

                {/* Date de livraison */}
                <div
                  style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted-color)",
                      marginBottom: 6,
                    }}
                  >
                    {t("deliveryDate")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--ink)",
                    }}
                  >
                    <Calendar size={14} style={{ color: "var(--muted-color)" }} />
                    {caseStudy.date.month && monthsRaw[caseStudy.date.month - 1]}{" "}
                    {caseStudy.date.year}
                  </div>
                </div>

                {/* Durée */}
                <div
                  style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted-color)",
                      marginBottom: 6,
                    }}
                  >
                    {t("duration")}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>
                    {caseStudy.duration}
                  </div>
                </div>

                {/* Technologies */}
                <div
                  style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted-color)",
                      marginBottom: 8,
                    }}
                  >
                    {t("technologies")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {caseStudy.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          border: "1px solid var(--rule)",
                          padding: "3px 8px",
                          color: "var(--ink-2)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted-color)",
                      marginBottom: 8,
                    }}
                  >
                    {t("tags")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {caseStudy.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          border: "1px solid var(--rule)",
                          padding: "3px 8px",
                          color: "var(--ink-2)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Site web */}
                {caseStudy.website && (
                  <div
                    style={{
                      paddingBottom: 16,
                      marginBottom: 16,
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--muted-color)",
                        marginBottom: 6,
                      }}
                    >
                      {t("website")}
                    </div>
                    <a
                      href={caseStudy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--ink-2)",
                        textDecoration: "underline",
                        wordBreak: "break-all",
                      }}
                    >
                      {caseStudy.website}
                    </a>
                  </div>
                )}

                {/* CTA */}
                <div style={{ marginTop: 8 }}>
                  <CaseStudyCTA />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projets similaires */}
        <section
          className="s"
          style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}
        >
          <div className="container">
            <h2
              className="ni-serif"
              style={{ fontSize: "clamp(22px, 2.5vw, 36px)", marginBottom: 32 }}
            >
              {t("similarProjects")}
            </h2>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}
            >
              {similarCaseStudies.map((study, i) => (
                <Link
                  key={study.id}
                  href={`/etudes-de-cas/${study.slug}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                  }}
                >
                  <div>
                    <div style={{ position: "relative", aspectRatio: "16/9" }}>
                      <Image
                        src={study.gallery.url || "/placeholder.svg"}
                        alt={study.title}
                        fill
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </div>
                    <div
                      style={{
                        padding: "20px 24px",
                        borderTop: "1px solid var(--rule)",
                      }}
                    >
                      <h3
                        className="ni-serif"
                        style={{ fontSize: 18, color: "var(--ink)", marginBottom: 6 }}
                      >
                        {study.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
                        {study.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
