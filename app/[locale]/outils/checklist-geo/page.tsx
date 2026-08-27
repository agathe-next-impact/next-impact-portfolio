import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import ChecklistGeo from "@/components/outils/checklist-geo";
import PageLayout from "@/components/page-layout";
import { BlueprintSection } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title:
      locale === "en"
        ? "GEO checklist - 24 actions to get cited by ChatGPT and Perplexity"
        : "Checklist GEO - 24 actions pour être cité par ChatGPT et Perplexity",
    description:
      locale === "en"
        ? "A free, actionable GEO checklist for SMBs: 24 concrete actions across 4 priorities (AI crawler access, answer pages, structure and markup, external authority). Checkable online, downloadable as PDF, no email required."
        : "Checklist GEO actionnable et gratuite pour PME : 24 actions concrètes sur 4 chantiers (accès des robots IA, pages-réponses, structure et balisage, autorité externe). Cochable en ligne, téléchargeable en PDF, sans email.",
    path: "/outils/checklist-geo",
    keywords:
      locale === "en"
        ? [
            "GEO checklist",
            "generative engine optimization checklist",
            "get cited by ChatGPT",
            "AI visibility actions",
            "llms.txt robots.txt AI crawlers",
          ]
        : [
            "checklist GEO",
            "checklist generative engine optimization",
            "être cité par ChatGPT",
            "actions visibilité IA",
            "llms.txt robots.txt robots IA",
          ],
    locale,
  });
}

export default async function ChecklistGeoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Tools" : "Outils", url: "/outils" },
    {
      name: isEn ? "GEO checklist" : "Checklist GEO",
      url: "/outils/checklist-geo",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={isEn ? "The GEO checklist" : "La checklist GEO"}
        sousTitre={
          isEn
            ? "24 concrete actions to get cited by AI engines, grouped by the 4 GEO priorities for an SMB: checkable online, downloadable as PDF."
            : "24 actions concrètes pour être cité par les moteurs IA, groupées par les 4 chantiers GEO d'une PME : cochable en ligne, téléchargeable en PDF."
        }
      >
        <BlueprintSection
          tone="obsidian"
          innerClassName="px-6 py-12 lg:px-8 lg:py-16"
        >
          <Link
            href="/outils"
            className="group mb-10 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-accent-secondary"
          >
            <ArrowLeft
              size={12}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            {isEn ? "Back to tools" : "Retour aux outils"}
          </Link>
          <ChecklistGeo />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
