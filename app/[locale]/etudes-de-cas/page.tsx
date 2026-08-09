import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { getCaseStudies, getCaseStudyCards } from "@/lib/case-studies-data";
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

  const caseStudyItems = getCaseStudies(locale).map((study) => ({
    name: study.title,
    url: `/etudes-de-cas/${study.slug}`,
    description: study.description,
  }));
  const cards = getCaseStudyCards(locale);

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
        <CaseStudiesClient cards={cards} />
        {/* Maillage : inviter à situer son propre site par rapport aux projets. */}
        <BlueprintSection tone="obsidian" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
          <AuditPromoBanner variant="caseStudy" />
        </BlueprintSection>
      </main>
    </>
  );
}
