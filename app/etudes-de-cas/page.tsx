import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import CaseStudiesClient from "@/components/case-studies/CaseStudiesClient";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.caseStudies();
}

export default function CaseStudiesPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Études de cas", url: "/etudes-de-cas" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main>
        <CaseStudiesClient />
      </main>
    </>
  );
}
