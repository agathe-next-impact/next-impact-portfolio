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

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <VideoObjectJsonLd
        name="Panorama Pub — Marketplace B2B livrée en 2 mois"
        description="Démonstration de Panorama Pub, premier annuaire en ligne dédié aux fournisseurs d'objets publicitaires. Web app sur-mesure : Next.js + base PostgreSQL serverless, admin autonome, architecture pensée SEO et croissance."
        thumbnailUrl="/img/desktop-screen-panoramapub.png"
        uploadDate="2026-05-01"
        contentUrl="https://youtu.be/9fMaBL1amYk"
        embedUrl="https://www.youtube.com/embed/9fMaBL1amYk"
      />
      <VideoObjectJsonLd
        name="Hermitage — Jeu de piste mobile (PWA)"
        description="Application mobile installable sans store, géolocalisée et fonctionnant hors-ligne pour le domaine forestier du Tiers Lieu L'Hermitage. PWA Next.js, service worker, persistance locale."
        thumbnailUrl="/img/mobile-screen-jeu-de-piste-hermitage.jpg"
        uploadDate="2026-04-01"
        contentUrl="https://youtube.com/shorts/_kt_wA4zT68"
        embedUrl="https://www.youtube.com/embed/_kt_wA4zT68"
      />
      <VideoObjectJsonLd
        name="Comme des Fous — Section Jeux en ligne"
        description="Une zone applicative (jeux interactifs) intégrée au site Headless du média Comme des Fous : extension web app sur socle WordPress + Next.js."
        thumbnailUrl="https://img.youtube.com/vi/SIj61ECS1Mo/maxresdefault.jpg"
        uploadDate="2026-02-01"
        contentUrl="https://youtu.be/SIj61ECS1Mo"
        embedUrl="https://www.youtube.com/embed/SIj61ECS1Mo"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour Le Café citoyen — Site vitrine"
        description="Découvrez le site vitrine du Café citoyen d'Auger-Saint-Vincent, propulsé par WordPress Headless et Next.js, avec les événements et l'histoire du café."
        thumbnailUrl="/img/desktop-screen-cafe-citoyen.png"
        uploadDate="2026-03-01"
        contentUrl="https://youtu.be/8aVVoDFakCY"
        embedUrl="https://www.youtube.com/embed/8aVVoDFakCY"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour Comme des Fous — Média participatif"
        description="Le site du média participatif Comme des Fous, propulsé par WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/6vUSbG6F50w/maxresdefault.jpg"
        uploadDate="2026-01-01"
        contentUrl="https://youtu.be/6vUSbG6F50w"
        embedUrl="https://www.youtube.com/embed/6vUSbG6F50w"
      />
      <VideoObjectJsonLd
        name="Next Event — Démo billetterie WordPress Headless"
        description="Démonstration complète d'un site WordPress Headless avec Next.js : billetterie événementielle, performance et expérience utilisateur."
        thumbnailUrl="/img/desktop-screen-next-event.jpg"
        uploadDate="2025-10-01"
        contentUrl="https://youtu.be/I1qi5o31Lnk"
        embedUrl="https://www.youtube.com/embed/I1qi5o31Lnk"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour les États Généraux Communaux"
        description="Une plateforme pour les États Généraux Communaux utilisant WordPress Headless avec Next.js."
        thumbnailUrl="https://img.youtube.com/vi/dJIndpLBm7o/maxresdefault.jpg"
        uploadDate="2025-10-01"
        contentUrl="https://youtu.be/dJIndpLBm7o"
        embedUrl="https://www.youtube.com/embed/dJIndpLBm7o"
      />
      <VideoObjectJsonLd
        name="WordPress Headless pour Les Doléances — Site de mobilisation"
        description="Un site de promotion des doléances citoyennes avec WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/_OjiGiOWJus/maxresdefault.jpg"
        uploadDate="2025-05-01"
        contentUrl="https://youtu.be/_OjiGiOWJus"
        embedUrl="https://www.youtube.com/embed/_OjiGiOWJus"
      />
      <DemoClient />
    </>
  );
}
