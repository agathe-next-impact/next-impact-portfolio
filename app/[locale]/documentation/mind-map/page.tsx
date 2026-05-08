import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import MindMapWrapper from "@/components/mind-map/mind-map-wrapper"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title:
      locale === "en"
        ? "Mind Map — Headless WordPress architecture"
        : "Mind Map — WordPress Headless Architecture",
    description:
      locale === "en"
        ? "Explore the Headless WordPress architecture interactively: benefits, challenges, editor experience and migration roadmap."
        : "Explorez l'architecture WordPress Headless de façon interactive : avantages, défis, expérience éditeur et roadmap de migration.",
    path: "/documentation/mind-map",
    keywords:
      locale === "en"
        ? [
            "Headless WordPress mind map",
            "decoupled architecture",
            "Headless WordPress benefits",
            "WordPress migration",
          ]
        : [
            "WordPress Headless mind map",
            "architecture découplée",
            "WordPress Headless avantages",
            "migration WordPress",
          ],
    locale,
  })
}

export default async function MindMapPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "documentationPage" })
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDocs"), url: "/documentation" },
    { name: "Mind Map", url: "/documentation/mind-map" },
  ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <section className="relative w-full pt-4 md:pt-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-3 py-6">
              <h1 className="font-googletitre font-medium text-center text-white">
                {locale === "en" ? "Headless WordPress" : "WordPress Headless"}
              </h1>
              <p className="text-lg text-white/60 text-center max-w-2xl font-googletexte">
                {locale === "en"
                  ? "Explore the Headless WordPress architecture and its challenges interactively."
                  : "Explorez l'architecture WordPress Headless et ses enjeux de façon interactive."}
              </p>
            </div>
          </div>
        </section>

        <section className="flex-1 container px-4 md:px-6 pb-8">
          <MindMapWrapper />
        </section>
      </div>
    </main>
  )
}
