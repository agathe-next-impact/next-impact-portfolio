import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  ServiceJsonLd,
  BreadcrumbJsonLd,
} from "@/components/json-ld";
import AvantageOethClient from "@/components/avantage-oeth/AvantageOethClient";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title:
      locale === "en"
        ? "OETH advantage — Deduct 30% of the invoice from your AGEFIPH contribution with a TIH provider"
        : "Avantage OETH — Déduisez 30 % de la facture de votre contribution AGEFIPH avec un prestataire TIH",
    description:
      locale === "en"
        ? "Next Impact is a French TIH provider (independent worker with disability). " +
          "Each web project lets you deduct 30% of the labor cost from your AGEFIPH contribution. " +
          "Deduction simulator and attestation included."
        : "Next Impact est un prestataire TIH (Travailleur Indépendant Handicapé). " +
          "Chaque prestation web permet de déduire 30 % du coût de main-d'œuvre de votre contribution AGEFIPH. " +
          "Simulateur de déduction et attestation inclus.",
    path: "/avantage-oeth",
    modifiedTime: "2026-07-18",
    type: "website",
    keywords: [
      "réduire contribution AGEFIPH sous-traitance",
      "prestataire TIH développement web",
      "déduction OETH prestation informatique",
      "sous-traitance handicap numérique",
      "TIH WordPress Headless",
      "obligation emploi travailleurs handicapés",
      "attestation déductibilité TIH",
      "AGEFIPH déduction",
      "travailleur indépendant handicapé",
    ],
    locale,
  });
}

export const revalidate = 86400;

export default function AvantageOethPage() {
  // La FAQ visible ET son schéma FAQPage sont portés par <AvantageOethClient />
  // (composant FaqSchema, réponses détaillées = source de vérité). On ne
  // redéclare donc pas de FAQJsonLd ici pour éviter un doublon de schéma
  // divergent du contenu affiché (politique Google : schéma = visible).
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Avantage OETH", url: "/avantage-oeth" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="Prestataire TIH — Déduction AGEFIPH sur votre site web"
        description="Next Impact est un prestataire TIH spécialisé dans la création de sites et d'applications. 30 % du coût de main-d'œuvre est déductible de votre contribution AGEFIPH. Attestation de déductibilité fournie."
        serviceType="Conseil et développement web — Prestataire TIH"
        url="/avantage-oeth"
      />
      <AvantageOethClient />
    </main>
  );
}
