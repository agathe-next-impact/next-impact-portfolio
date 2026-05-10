import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/json-ld";
import DemoClient from "@/components/demo/DemoClient";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

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
            "Headless WordPress demo",
            "Next.js video",
            "website demonstration",
            "Headless WordPress in action",
          ]
        : [
            "démo WordPress Headless",
            "vidéo Next.js",
            "démonstration site web",
            "WordPress Headless en action",
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

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <VideoObjectJsonLd
        name="WordPress Headless en action — Présentation de la plateforme Next Event"
        description="Démonstration complète d'un site WordPress Headless avec Next.js : billetterie événementielle, performance et expérience utilisateur."
        thumbnailUrl="/img/desktop-screen-next-event.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/I1qi5o31Lnk"
        embedUrl="https://www.youtube.com/embed/I1qi5o31Lnk"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour Le Café citoyen — Site vitrine"
        description="Découvrez le site vitrine du Café citoyen d'Auger-Saint-Vincent, propulsé par WordPress Headless et Next.js, avec les événemeents et l'histoire du café."
        thumbnailUrl="/img/desktop-screen-cafe-citoyen.png"
        uploadDate="2025-03-01"
        contentUrl="https://youtu.be/8aVVoDFakCY"
        embedUrl="https://www.youtube.com/embed/8aVVoDFakCY"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour Comme des Fous — Média participatif"
        description="Le site du média participatif Comme des Fous, propulsé par WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/6vUSbG6F50w/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/6vUSbG6F50w"
        embedUrl="https://www.youtube.com/embed/6vUSbG6F50w"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour Les Doléances — Plateforme citoyenne"
        description="Un site de promotion des doléances citoyennes avec WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/_OjiGiOWJus/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/_OjiGiOWJus"
        embedUrl="https://www.youtube.com/embed/_OjiGiOWJus"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour les États Généraux Communaux"
        description="Une plateforme pour les États Généraux Communaux utilisant WordPress Headless avec Next.js."
        thumbnailUrl="https://img.youtube.com/vi/dJIndpLBm7o/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/dJIndpLBm7o"
        embedUrl="https://www.youtube.com/embed/dJIndpLBm7o"
      />
      <VideoObjectJsonLd
        name="Comme des Fous — Section Jeux en ligne"
        description="Une section de jeux en ligne intégrée au site de Comme des Fous, développée en WordPress Headless avec Next.js."
        thumbnailUrl="https://img.youtube.com/vi/SIj61ECS1Mo/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/SIj61ECS1Mo"
        embedUrl="https://www.youtube.com/embed/SIj61ECS1Mo"
      />
      <DemoClient />
    </>
  );
}
