import Realisations from "@/components/case-studies/realisations" 
import PageHero from "@/components/page-hero";
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
              {/* Hero Section */}
      <PageHero 
        titre1="Études de cas"
        titre2="de sites web WordPress"
        sousTitre="Penser besoin de la vie réelle, comprendre les enjeux concrets du client constituent la base de la mise au point d'une solution adaptée." 
        badge="Études de cas"
        illustration="/illustrations/user-experience.svg"
        cta1Text="Solutions"
        cta1Link="/solutions"
        cta2Text="Contact"
        cta2Link="https://calendar.app.google/HuwRpoVGoKBj2PkX8"
        illustration="/illustrations/tech-ecosystem.svg"
      />

      <div className="container mx-auto mt-12">
        <Realisations count={100} />
      </div>
    </main>
  )
}
