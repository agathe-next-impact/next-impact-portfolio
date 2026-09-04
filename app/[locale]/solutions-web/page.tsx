import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import ServicesClient from "@/components/services/ServicesClient"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "servicesPage" })
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/solutions-web",
    keywords:
      locale === "en"
        ? [
            "WordPress redesign price",
            "optimized WordPress redesign",
            "headless WordPress redesign",
            "Headless WordPress pricing",
            "custom web app",
            "custom mobile application",
            "WordPress Next.js",
          ]
        : [
            "refonte site WordPress prix",
            "refonte WordPress optimisée",
            "refonte WordPress headless",
            "tarifs WordPress Headless",
            "web app sur-mesure",
            "application mobile sur-mesure",
            "WordPress Next.js",
          ],
    locale,
  })
}

// Revalidate toutes les 24 heures
export const revalidate = 86400

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "servicesPage" })

  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbServices"), url: "/solutions-web" },
  ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* Schéma aligné sur le contenu réel de la page : les trois trajectoires
          de refonte du catalogue (charte §5), prix « à partir de » affichés. */}
      <ServiceJsonLd
        name={
          locale === "en"
            ? "Three trajectories for an aging WordPress site: consolidate, decouple or rebuild"
            : "Solutions pour une refonte de WordPress : consolider, découpler ou refonder"
        }
        description={
          locale === "en"
            ? "Three redesign trajectories for an aging WordPress site: optimized WordPress (from €2,250 excl. VAT), headless WordPress (recommended, from €4,000 excl. VAT), web app (from €6,500 excl. VAT). Price and timeline fixed before starting."
            : "Trois trajectoires de refonte pour un site WordPress qui vieillit : WordPress optimisé (dès 2 250 € HT), WordPress headless (recommandée, dès 4 000 € HT), web app (dès 6 500 € HT). Prix et délai fixés avant de commencer."
        }
        serviceType={locale === "en" ? "Web redesign and development" : "Refonte et développement web"}
        url="/solutions-web"
      />
      {/* La FAQ visible et son schéma FAQPage sont portés par ServicesClient →
          ServicesFAQ → FaqSchema (profile-aware, schéma = contenu affiché). Pas
          de FAQJsonLd ici : cela créerait un second FAQPage divergent du visible. */}
      <ServicesClient />
    </main>
  )
}
