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
      ? "Agencies & studios: white-label web subcontracting, fixed scope"
      : "Agences & studios : sous-traitance web en marque blanche, forfait garanti",
    description: isEn
      ? "A client needs a fast, modern website and you have no dev team? I build it under your brand: fixed price and timeline, no-poaching guarantee."
      : "Un client veut un site rapide et moderne, vous n'avez pas le pôle dev ? Je le construis sous votre marque : forfait, délai annoncé, non-démarchage.",
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
    // Pas d'alternate hreflang EN : la locale EN est en noindex (cohérent
    // avec le sitemap, qui liste /agences sans alternates).
    alternateLocales: ["fr"],
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
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <AgencesClient />
    </>
  );
}
