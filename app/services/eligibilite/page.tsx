import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import PageLayout from "@/components/page-layout";
import EligibilityForm from "@/components/tarifs/EligibilityForm";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Test d'éligibilité tarif solidaire",
    description:
      "Calculez votre tarif solidaire, équilibre ou soutien en 2 minutes selon votre budget et votre statut.",
    path: "/services/eligibilite",
    keywords: ["tarifs", "éligibilité", "tarif solidaire", "calculateur", "Next Impact"],
  });
}

export default function EligibilityPage() {
  return (
    <PageLayout
      titre="Calculez votre tarif et testez votre éligibilité"
      sousTitre="Un calculateur immédiat pour identifier l'offre solidaire, équilibre ou soutien la plus adaptée à votre structure."
    >
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <EligibilityForm />
        </div>
      </section>
    </PageLayout>
  );
}
