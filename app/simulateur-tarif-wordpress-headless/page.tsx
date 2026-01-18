import PageHero from "@/components/page-hero";
import PricingCalculator from "@/components/pricing-calculator/pricing-calculator"
import { Metadata } from "next";

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
          url: "/img/avatar.png",
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
      <PageHero
        titre1="Simulateur de tarif"
        titre2="de site web WordPress Headless"
        sousTitre="Estimez le coût de votre projet web selon les prestataires et fonctionnalités souhaitées."
        badge="Simulateur de tarif"
        illustration="/illustrations/pricing-simulator.svg"
        cta1Link=""
        cta1Text=""
        cta2Link=""
        cta2Text=""
      />
      <section className="container mx-auto mt-12 px-6 lg:px-8">
      <PricingCalculator />
      </section>
    </main>
  )
}
