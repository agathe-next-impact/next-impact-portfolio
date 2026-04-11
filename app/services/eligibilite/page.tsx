import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import PageLayout from "@/components/page-layout";
import EligibilityForm from "@/components/tarifs/EligibilityForm";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Diagnostic de stack WordPress — Présence Essentielle, Croissance Accélérée ou Plateforme Sur-Mesure",
    description:
      "Identifiez en 2 minutes la stack WordPress adaptée à votre projet : monolithique optimisée, hybride Astro ou Next.js complète.",
    path: "/services/eligibilite",
    keywords: ["diagnostic stack", "WordPress monolithique", "WordPress Astro", "WordPress Next.js", "modernisation WordPress"],
  });
}

export default function EligibilityPage() {
  return (
    <PageLayout
      titre="Diagnostic de stack WordPress"
      sousTitre="Un diagnostic immédiat pour identifier la stack — Présence Essentielle, Croissance Accélérée ou Plateforme Sur-Mesure — la plus adaptée à votre projet."
    >
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <EligibilityForm />
        </div>
      </section>
    </PageLayout>
  );
}
