import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Démo vidéo de WordPress Headless",
    description:
      "Comment fonctionne WordPress Headless avec Next.js ? Découvrez notre démo vidéo présentant une plateforme événementielle complète propulsée par WordPress Headless.",
    path: "/demo",
    keywords: [
      "solutions WordPress",
      "WordPress Headless",
      "Astro",
      "Next.js",
      "Démo WordPress Headless",
      "Vidéo WordPress Headless",
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
