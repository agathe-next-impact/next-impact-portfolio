import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import ROISimulator from "@/components/roi-simulator/roi-simulator-wrapper"
import PageLayout from "@/components/page-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Simulateur de ROI — Performance Web & Migration Headless",
    description:
      "Calculez le manque à gagner dû à un site lent et projetez les revenus supplémentaires générés par une migration Headless.",
    path: "/outils/simulateur-roi",
    keywords: [
      "simulateur ROI",
      "calculateur performance web",
      "migration headless",
      "vitesse site web",
      "optimisation conversion",
      "coût site lent",
    ],
  })
}

export default function SimulateurROIPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/outils" },
    { name: "Simulateur de ROI", url: "/outils/simulateur-roi" },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre="Simulateur de ROI — Performance Web"
        sousTitre="Calculez le manque à gagner dû à un site lent et projetez les revenus supplémentaires générés par une migration Headless."
      >
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Link
              href="/outils"
              className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux outils
            </Link>
            <ROISimulator />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
