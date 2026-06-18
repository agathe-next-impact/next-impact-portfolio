import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import AgencesClient from "@/components/partenaires/AgencesClient";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "Agencies & studios — White-label web subcontracting, fixed scope"
      : "Agences & studios — Sous-traitance web en marque blanche, forfait garanti",
    description: isEn
      ? "Your client needs a fast, modern website but you don't have the dev team? I build it under your brand. WordPress + modern web, fixed scope, no-poaching guarantee."
      : "Vous avez un client qui veut un site rapide et moderne mais pas le pôle dev ? Je le construis sous votre marque. WordPress + web moderne, forfait délai et budget, engagement de non-démarchage.",
    path: "/agences",
    keywords: isEn
      ? [
          "white-label web development agency",
          "WordPress subcontracting agency",
          "agency web dev partner",
        ]
      : [
          "sous-traitance développement web agence",
          "marque blanche WordPress Next.js",
          "prestataire dev web agence",
          "sous-traitance site web freelance",
          "partenaire technique agence communication",
        ],
    locale,
    // Contenu uniquement FR pour l'instant : on n'indexe pas la locale EN
    // tant que la traduction n'est pas faite (cf. AgencesClient).
    noindex: isEn,
  });
}

export default async function AgencesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    {
      name: isEn ? "Agencies & studios" : "Agences & studios",
      url: "/agences",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <AgencesClient />
    </>
  );
}
