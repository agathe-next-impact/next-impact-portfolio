
// Update the import path if the file is named differently or located elsewhere
import CmsQuizComponent from "@/components/cms-choice-quiz-wrapper";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "WordPress ou WordPress Headless ?",
    description:
      "Répondez à ce quiz pour déterminer la solution la plus adaptée à vos besoins. " +
      "Outil d'aide au choix entre WordPress classique et WordPress Headless.",
    path: "/cms-headless",
    keywords: [
      "WordPress vs Headless",
      "choix CMS",
      "quiz solution technique",
      "WordPress Headless",
    ],
  });
}

export default function CmsQuiz() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "WordPress ou Headless ?", url: "/cms-headless" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre="WordPress ou WordPress Headless ?"
        sousTitre="Répondez à ce quiz pour déterminer la solution la plus adapté à vos besoins."
      >
      <div className="mt-8">
      <CmsQuizComponent />
      </div>
      </PageLayout>
    </main>
  )
}
