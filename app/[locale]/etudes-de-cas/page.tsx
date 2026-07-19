import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { getCaseStudies } from "@/lib/case-studies-data";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import CaseStudiesClient from "@/components/case-studies/CaseStudiesClient";
import { BlueprintSection } from "@/components/aspect/section";
import { AuditPromoBanner } from "@/components/audit/audit-promo-banner";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata.caseStudies(locale);
}

// Landings externes sans fiche étude de cas (démos et projets hors catalogue) —
// les études de cas elles-mêmes sont générées depuis lib/case-studies-data.ts
// pour que la liste ne dérive plus quand une étude est ajoutée ou retirée.
const externalLandings = [
  { name: "Séjours à L'Hermitage", url: "https://sejours.hermitagelelab.com/", fr: "Landing de séjours dans un Tiers Lieu rural", en: "Landing page for stays at a rural third place" },
  { name: "Mariage Nicolas & Cécile", url: "https://www.nicocecile23mai2026.fr/", fr: "Landing de mariage Nicolas et Cécile", en: "Wedding landing page for Nicolas & Cécile" },
  { name: "Mariage Agathe & Alain", url: "https://www.mariage-agathe-et-alain.fun/", fr: "Landing de mariage Agathe et Alain", en: "Wedding landing page for Agathe & Alain" },
  { name: "Artisan Coiffeur", url: "https://artisan-coiffeur.lapetitevitrine.com/", fr: "Landing artisan coiffeur — La Petite Vitrine", en: "Hairdresser landing page — La Petite Vitrine" },
];

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbCaseStudies"), url: "/etudes-de-cas" },
  ];

  const caseStudyItems = [
    ...getCaseStudies(locale).map((study) => ({
      name: study.title,
      url: `/etudes-de-cas/${study.slug}`,
      description: study.description,
    })),
    ...externalLandings.map((landing) => ({
      name: landing.name,
      url: landing.url,
      description: locale === "en" ? landing.en : landing.fr,
    })),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={t("collectionName")}
        description={t("collectionDescription")}
        url="/etudes-de-cas"
        items={caseStudyItems}
      />
      <main>
        <CaseStudiesClient />
        {/* Maillage : inviter à situer son propre site par rapport aux projets. */}
        <BlueprintSection tone="obsidian" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
          <AuditPromoBanner variant="caseStudy" />
        </BlueprintSection>
      </main>
    </>
  );
}
