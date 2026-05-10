import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import ROISimulator from "@/components/roi-simulator/roi-simulator-wrapper"
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
  const t = await getTranslations({ locale, namespace: "roiSimulatorPage" })
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/outils/simulateur-roi",
    keywords:
      locale === "en"
        ? [
            "ROI simulator",
            "web performance calculator",
            "headless migration",
            "website speed",
            "conversion optimization",
            "slow site cost",
          ]
        : [
            "simulateur ROI",
            "calculateur performance web",
            "migration headless",
            "vitesse site web",
            "optimisation conversion",
            "coût site lent",
          ],
    locale,
  })
}

export default async function SimulateurROIPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "roiSimulatorPage" })
  const tTools = await getTranslations({ locale, namespace: "toolsPage" })
  const breadcrumbItems = [
    { name: tTools("breadcrumbHome"), url: "/" },
    { name: tTools("breadcrumbTools"), url: "/outils" },
    { name: t("breadcrumbRoi"), url: "/outils/simulateur-roi" },
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
            <ROISimulator />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
