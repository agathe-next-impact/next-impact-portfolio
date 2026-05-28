import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld"
import PageLayout from "@/components/page-layout"
import OutilsBentoGrid from "@/components/outils/outils-bento-grid"
import { BlocReassurance } from "@/components/cta-section"
import type { Locale } from "@/i18n/routing"

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "toolsPage" })
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/outils",
    keywords:
      locale === "en"
        ? [
            "ROI simulator",
            "web performance calculator",
            "free website audit",
            "headless migration",
            "website speed",
            "conversion optimization",
            "competitive benchmarking",
          ]
        : [
            "simulateur ROI",
            "calculateur performance web",
            "audit site web gratuit",
            "migration headless",
            "vitesse site web",
            "optimisation conversion",
            "benchmarking concurrentiel",
          ],
    locale,
  })
}

export default async function OutilsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "toolsPage" })
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbTools"), url: "/outils" },
  ]
  const outilsItems =
    locale === "en"
      ? [
          { name: "Pricing simulator", url: "/simulateur-tarifs", description: "Estimate the cost of your web project in a few clicks." },
          { name: "WordPress or Headless quiz", url: "/cms-headless", description: "Find out which CMS solution best fits your needs." },
          { name: "Project specifications generator", url: "/cahier-des-charges", description: "Build your complete, personalized specifications document." },
        ]
      : [
          { name: "Simulateur de tarifs", url: "/simulateur-tarifs", description: "Estimez le coût de votre projet web en quelques clics." },
          { name: "Quiz WordPress ou Headless", url: "/cms-headless", description: "Déterminez la solution CMS la plus adaptée à vos besoins." },
          { name: "Générateur de cahier des charges", url: "/cahier-des-charges", description: "Créez votre cahier des charges complet et personnalisé." },
        ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={t("collectionName")}
        description={t("collectionDescription")}
        url="/outils"
        items={outilsItems}
      />
      <PageLayout titre={t("title")} sousTitre={t("subtitle")}>
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            <OutilsBentoGrid />
          </div>
        </section>
        <BlocReassurance />
      </PageLayout>
    </main>
  )
}
