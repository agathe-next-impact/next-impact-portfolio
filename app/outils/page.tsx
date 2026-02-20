import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
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
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main className="flex-1">
        {/* Hero */}
        <section className="w-full pt-8 md:pt-12 pb-6">
          <div className="container px-4 md:px-6 text-center z-10 relative">
            <h1 className="text-4xl md:text-5xl font-googletitre font-bold text-white mb-4">
              Boîte à outils
            </h1>
            <p className="text-lg text-extralightblue/80 max-w-2xl mx-auto font-googletexte">
              Des outils gratuits pour évaluer, mesurer et projeter la
              performance de votre présence&nbsp;digitale.
            </p>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <OutilsBentoGrid />
          </div>
        </section>
      </main>
    </>
  )
}
