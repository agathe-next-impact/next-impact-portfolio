
// Update the import path if the file is named differently or located elsewhere
import CmsQuizComponent from "@/components/cms-choice-quiz-wrapper";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Aide au choix de solution technique pour son projet de site web | Next Impact",
    description: "Outil d'évaluation pour le choix d'une solution technique pour votre projet web selon les prestataires et fonctionnalités souhaitées.",
    openGraph: {
      title: "Aide au choix d'une solution technique pour son projet de site web | Next Impact",
      url: "https://next-impact.digital/cms-headless",
      description: "Outil d'évaluation pour le choix d'une solution technique pour votre projet web selon les prestataires et fonctionnalités souhaitées.",
      type: "website",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      images: [
        {
          url: "/img/avatar.png",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

export default function CmsQuiz() {

  return (
    <main>
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
