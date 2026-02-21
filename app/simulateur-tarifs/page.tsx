import PricingCalculator from "@/components/pricing-calculator/pricing-calculator-wrapper"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Simulateur de tarif de site web",
    description:
      "Estimez le coût de votre projet web selon le type de projet. " +
      "Simulateur gratuit pour obtenir une fourchette de prix instantanée.",
    path: "/simulateur-tarifs",
    keywords: [
      "simulateur prix",
      "tarifs site web",
      "coût site web",
      "estimation projet web",
    ],
  });
}

export default function Home() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Simulateur de tarifs", url: "/simulateur-tarifs" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
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
