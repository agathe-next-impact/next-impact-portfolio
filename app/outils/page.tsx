import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import PageLayout from "@/components/page-layout"
import OutilsBentoGrid from "@/components/outils/outils-bento-grid"

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

export default function OutilsPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/outils" },
  ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre="Boîte à outils"
        sousTitre="Des outils gratuits pour évaluer, mesurer et projeter la performance de votre présence digitale."
      >
        <div className="container mx-auto py-12">
          <OutilsBentoGrid />
        </div>
      </PageLayout>
    </main>
  )
}
