import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/json-ld"
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
            "site modernization",
            "headless migration",
            "web app build",
            "website speed",
            "conversion optimization",
            "slow site cost",
          ]
        : [
            "simulateur ROI",
            "calculateur performance web",
            "modernisation site",
            "migration headless",
            "création web app",
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
      <WebApplicationJsonLd
        name={t("metaTitle")}
        description={t("metaDescription")}
        url="/outils/simulateur-roi"
        applicationCategory="BusinessApplication"
        offers={{ price: "0" }}
      />
      <PageLayout titre={t("title")} sousTitre={t("subtitle")}>
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            <Link
              href="/outils"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                textDecoration: "none",
                marginBottom: 40,
              }}
            >
              <ArrowLeft size={12} />
              {tTools("backToTools")}
            </Link>
            <ROISimulator />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
