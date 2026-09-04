import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/json-ld";
import DemoClient, { type DemoVideo } from "@/components/demo/DemoClient";
import { getVideoCaseStudies, type CaseStudy } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

/** Toujours mise en avant en tête de page, quelle que soit sa date. */
const FEATURED_SLUG = "reseauteurs";

function toDemoVideo(study: CaseStudy): DemoVideo {
  return {
    slug: study.slug,
    videoId: study.youtubeVideoId as string,
    isShort: study.youtubeIsShort ?? false,
    title: study.cardTitle ?? study.title,
    description: study.cardDescription ?? study.description,
  };
}

function uploadDate(study: CaseStudy): string {
  const month = String(study.date.month ?? 1).padStart(2, "0");
  return `${study.date.year ?? new Date().getFullYear()}-${month}-01`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demoPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/demo",
    keywords:
      locale === "en"
        ? [
            "Next.js demo",
            "web app video",
            "mobile PWA demo",
            "Headless WordPress demo",
            "marketplace demo",
            "website demonstration",
          ]
        : [
            "démo Next.js",
            "vidéo web app",
            "démo PWA mobile",
            "démo WordPress Headless",
            "démo marketplace",
            "démonstration site web",
          ],
    locale,
  });
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demoPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDemo"), url: "/demo" },
  ];

  const studies = getVideoCaseStudies(locale);
  const featured = studies.find((s) => s.slug === FEATURED_SLUG) ?? studies[0];
  const others = studies.filter((s) => s.slug !== featured.slug);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {[featured, ...others].map((study) => (
        <VideoObjectJsonLd
          key={study.slug}
          name={study.cardTitle ?? study.title}
          description={study.cardDescription ?? study.description}
          thumbnailUrl={study.galleryUrl}
          uploadDate={uploadDate(study)}
          contentUrl={
            study.youtubeIsShort
              ? `https://youtube.com/shorts/${study.youtubeVideoId}`
              : `https://youtu.be/${study.youtubeVideoId}`
          }
          embedUrl={`https://www.youtube.com/embed/${study.youtubeVideoId}`}
        />
      ))}
      <DemoClient
        featured={toDemoVideo(featured)}
        videos={others.map(toDemoVideo)}
      />
    </>
  );
}
