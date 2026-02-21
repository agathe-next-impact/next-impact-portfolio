import PageLayout from "@/components/page-layout";
import CahierDesChargesForm from "@/components/cahier-des-charges/cahier-des-charges-form-wrapper"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Générateur de cahier des charges",
    description:
      "Remplissez le formulaire pour obtenir votre cahier des charges complet et personnalisé. " +
      "Outil gratuit pour structurer votre projet de site web.",
    path: "/cahier-des-charges",
    keywords: [
      "cahier des charges",
      "projet site web",
      "spécifications",
      "brief projet",
    ],
  });
}

export default function Home() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Cahier des charges", url: "/cahier-des-charges" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre="Générateur de cahier des charges"
        sousTitre="Remplissez le formulaire pour obtenir votre cahier des charges complet."
      >
      <div className="mt-8">
      <CahierDesChargesForm />
      </div>
      </PageLayout>
    </main>
  )
}
