import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import AboutClient from "@/components/about/AboutClient";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "À propos - L'alliance performance technologique & engagement durable",
    description:
      "Découvrez Next Impact : 15 ans d'engagement associatif, 8 ans de développement web. L'architecture Headless au service de l'ESS et de l'impact social.",
    path: "/a-propos",
    keywords: [
      "à propos",
      "Next Impact",
      "ESS",
      "engagement durable",
      "headless",
      "Agathe Karinthi-Martin",
    ],
  });
}

export default function AProposPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "À propos", url: "/a-propos" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PersonJsonLd />
      <AboutClient />
    </>
  );
}
