import Realisations from "@/components/case-studies/realisations" 
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Réalisations de site web WordPress | Next Impact",
    description: "Découvrez nos études de cas de création de sites web WordPress pour les entreprises. Solutions adaptées aux sites à fonctionnalités avancées, exigences de qualité ou applications web.",
    openGraph: {
      title: "Réalisations de site web WordPress  | Next Impact",
      url: "https://next-impact.digital/etudes-de-cas",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      description: "Découvrez nos études de cas de création de sites web WordPress pour les entreprises. Solutions adaptées aux sites à fonctionnalités avancées, exigences de qualité ou applications web.",
      type: "website",
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

export default function CaseStudiesPage() {
  return (
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
  )
}
