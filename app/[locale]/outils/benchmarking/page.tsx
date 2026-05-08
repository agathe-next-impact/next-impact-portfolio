import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import BenchmarkingTool from "@/components/benchmarking/benchmarking-wrapper"
import PageLayout from "@/components/page-layout"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import type { Locale } from "@/i18n/routing"

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "benchmarkingPage" })
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/outils/benchmarking",
    keywords:
      locale === "en"
        ? [
            "competitive benchmarking",
            "website performance audit",
            "core web vitals",
            "competitor comparison",
            "pagespeed insights",
            "competitive web analysis",
          ]
        : [
            "benchmarking concurrentiel",
            "audit performance site web",
            "core web vitals",
            "comparaison concurrents",
            "pagespeed insights",
            "analyse concurrentielle web",
          ],
    locale,
  })
}

export default async function BenchmarkingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "benchmarkingPage" })
  const tTools = await getTranslations({ locale, namespace: "toolsPage" })
  const breadcrumbItems = [
    { name: tTools("breadcrumbHome"), url: "/" },
    { name: tTools("breadcrumbTools"), url: "/outils" },
    { name: t("breadcrumbBenchmarking"), url: "/outils/benchmarking" },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout titre={t("title")} sousTitre={t("subtitle")}>
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Link
              href="/outils"
              className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {tTools("backToTools")}
            </Link>
            <BenchmarkingTool />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
