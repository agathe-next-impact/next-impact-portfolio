import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import AboutClient from "@/components/about/AboutClient";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "À propos de Next Impact — Agathe Karinthi-Martin, développeur WordPress Headless",
    description:
      "Agathe Karinthi-Martin est développeur freelance WordPress Headless chez Next Impact. " +
      "8 ans de développement web, 15 ans d'engagement associatif. " +
      "Spécialiste Next.js, Astro et WPGraphQL au service de l'ESS et des TPE-PME.",
    path: "/a-propos",
    keywords: [
      "à propos Next Impact",
      "Agathe Karinthi-Martin",
      "développeur WordPress Headless freelance",
      "ESS",
      "engagement durable",
      "headless",
      "parcours freelance",
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
