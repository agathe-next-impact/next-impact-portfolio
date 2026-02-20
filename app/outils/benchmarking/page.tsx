import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import BenchmarkingTool from "@/components/benchmarking/benchmarking-wrapper"
import PageLayout from "@/components/page-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Benchmarking Concurrentiel — Comparez votre site aux leaders",
    description:
      "Comparez les performances de votre site web avec les leaders de votre secteur. Audit PageSpeed, Core Web Vitals et analyse concurrentielle gratuite.",
    path: "/outils/benchmarking",
    keywords: [
      "benchmarking concurrentiel",
      "audit performance site web",
      "core web vitals",
      "comparaison concurrents",
      "pagespeed insights",
      "analyse concurrentielle web",
    ],
  })
}

export default function BenchmarkingPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/outils" },
    { name: "Benchmarking", url: "/outils/benchmarking" },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre="Benchmarking Concurrentiel"
        sousTitre="Mesurez les performances réelles de votre site face à vos concurrents directs via Google PageSpeed."
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
            <BenchmarkingTool />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
