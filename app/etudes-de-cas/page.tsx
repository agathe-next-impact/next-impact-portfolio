import Realisations from "@/components/case-studies/realisations" 
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

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
        <PageLayout 
          titre="Études de cas"
          sousTitre="Découvrez nos réalisations de sites web WordPress pour divers secteurs d'activité."
        >
        <div className="mt-8 mb-16 px-4">
          <Realisations count={30} />
        </div>

        </PageLayout>
      </main>
    </>
  )
}
