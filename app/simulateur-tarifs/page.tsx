import PricingCalculator from "@/components/pricing-calculator/pricing-calculator-wrapper"
import { Metadata } from "next";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Simulateur de tarif de site web | Next Impact",
    description: "Simulateur de tarif pour estimer le coût de votre projet web selon les prestataires et fonctionnalités souhaitées.",
    openGraph: {
      title: "Simulateur de tarif de site web | Next Impact",
      url: "https://next-impact.digital/simulateur-tarifs",
      description: "Simulateur de tarif pour estimer le coût de votre projet web selon les prestataires et fonctionnalités souhaitées.",
      type: "website",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      images: [
        {
          url: "/img/avatar.webp",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

export default function Home() {
  return (
    <main>
       <section className="w-full pt-4 md:pt-8 lg:pt-12 xl:pt-12">
        <div className="container px-4 md:px-6">
        <div className="flex flex-col justify-center space-y-4 py-8">
            <h1 className="font-medium text-center">
              Simulateur de Tarif de site web 
            </h1>            
            <p className="text-regularblue/70 text-center max-w-3xl mx-auto">
              Estimez le coût de votre projet web selon le type de projet.
            </p>
          </div>
      <PricingCalculator />
      </div>
    </section> 
    </main>
  )
}
