import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Démo WordPress Headless Next.js — Billeterie événementielle",
    description:
      "Découvrez en live le fonctionnement d'un WordPress Headless " +
      "avec Next.js sur le cas d'une billeterie en ligne. " +
      "Performance, flexibilité et back-office WordPress.",
    path: "/demo",
    keywords: [
      "démo WordPress Headless",
      "WordPress Headless Next.js",
      "billeterie événementielle",
      "vidéo WordPress Headless",
    ],
  });
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Démo", url: "/demo" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {children}
    </>
  );
}
