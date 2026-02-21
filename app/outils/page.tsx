import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld"
import PageLayout from "@/components/page-layout"
import OutilsBentoGrid from "@/components/outils/outils-bento-grid"
import { BlocReassurance } from "@/components/cta-section"

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Boîte à outils — Simulateur ROI, Benchmarking & Audit",
    description:
      "Des outils gratuits pour évaluer, mesurer et projeter la performance de votre présence digitale. " +
      "Simulateur de ROI, benchmarking concurrentiel et audit de site web.",
    path: "/outils",
    keywords: [
      "simulateur ROI",
      "calculateur performance web",
      "audit site web gratuit",
      "migration headless",
      "vitesse site web",
      "optimisation conversion",
      "benchmarking concurrentiel",
    ],
  })
}

const outilsItems = [
  { name: "Simulateur de tarifs", url: "/simulateur-tarifs", description: "Estimez le coût de votre projet web en quelques clics." },
  { name: "Quiz WordPress ou Headless", url: "/cms-headless", description: "Déterminez la solution CMS la plus adaptée à vos besoins." },
  { name: "Générateur de cahier des charges", url: "/cahier-des-charges", description: "Créez votre cahier des charges complet et personnalisé." },
];

export default function OutilsPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/outils" },
  ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name="Boîte à outils — Simulateur ROI, Benchmarking & Audit"
        description="Des outils gratuits pour évaluer, mesurer et projeter la performance de votre présence digitale."
        url="/outils"
        items={outilsItems}
      />
      <PageLayout
        titre="Boîte à outils"
        sousTitre="Des outils gratuits pour évaluer, mesurer et projeter la performance de votre présence digitale."
      >
        <div className="container mx-auto py-12">
          <OutilsBentoGrid />
          <div className="mt-12">
            <BlocReassurance />
          </div>
        </div>
      </PageLayout>
    </main>
  )
}
