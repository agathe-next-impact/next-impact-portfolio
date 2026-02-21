import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/json-ld";
import DemoClient from "@/components/demo/DemoClient";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Démo WordPress Headless — Vidéos de projets Next.js",
    description:
      "Découvrez en vidéo le fonctionnement d'un site WordPress Headless avec Next.js. " +
      "Démonstrations de projets réels : billetterie, média participatif, plateforme citoyenne.",
    path: "/demo",
    keywords: [
      "démo WordPress Headless",
      "vidéo Next.js",
      "démonstration site web",
      "WordPress Headless en action",
    ],
  });
}

export default function DemoPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Démo", url: "/demo" },
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
      <DemoClient />
    </>
  );
}
