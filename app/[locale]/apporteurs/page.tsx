import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import ApporteursClient from "@/components/partenaires/ApporteursClient";
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
      ? "Referral partners — Earn 10–15% on every project you recommend"
      : "Apporteurs d'affaires — Touchez 10 à 15 % sur chaque projet recommandé",
    description: isEn
      ? "Know a business with an ageing website? Refer them to Next Impact and earn 10–15% of the signed project, paid on invoice settlement. Fixed scope, no surprises for your contact."
      : "Vous connaissez une PME dont le site vieillit mal ? Recommandez-la à Next Impact et touchez 10 à 15 % du projet signé, versés à l'encaissement. Forfait garanti, aucune surprise pour votre contact.",
    path: "/apporteurs",
    keywords: isEn
      ? [
          "web referral partner",
          "referral commission website",
          "recommend web project",
          "WordPress project referral",
        ]
      : [
          "apporteur d'affaires web",
          "commission recommandation site web",
          "partenaire référent développement web",
          "recommander projet WordPress",
          "apport d'affaires freelance",
        ],
    locale,
    // Contenu uniquement FR pour l'instant : on n'indexe pas la locale EN
    // tant que la traduction n'est pas faite (cf. ApporteursClient).
    noindex: isEn,
  });
}

export default async function ApporteursPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    {
      name: isEn ? "Referral partners" : "Apporteurs d'affaires",
      url: "/apporteurs",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ApporteursClient />
    </>
  );
}
