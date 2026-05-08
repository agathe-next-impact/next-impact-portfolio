import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import ServicesClient from "@/components/services/ServicesClient"
import { getServicesPageVariants } from "@/lib/homepage-profiles"
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
    path: "/services",
    keywords:
      locale === "en"
        ? [
            "Headless WordPress services",
            "Headless WordPress pricing",
            "site cost",
            "optimized monolithic WordPress",
            "WordPress Astro",
            "WordPress Next.js",
            "WordPress modernization",
            "WordPress stack",
          ]
        : [
            "services WordPress Headless",
            "tarifs WordPress Headless",
            "prix site web",
            "WordPress monolithique optimisé",
            "WordPress Astro",
            "WordPress Next.js",
            "modernisation WordPress",
            "stack WordPress",
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
  const faqs = getServicesPageVariants(locale).default.faqs

  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbServices"), url: "/services" },
  ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name={
          locale === "en"
            ? "Headless WordPress site build services"
            : "Services de création de site web WordPress Headless"
        }
        description={
          locale === "en"
            ? "Three WordPress stacks: optimized monolithic, hybrid Astro and full Next.js. Solutions tailored to SMEs, enterprises and organizations with strong web requirements."
            : "Trois stacks WordPress : monolithique optimisé, hybride Astro et Next.js complet. Solutions adaptées aux PME, entreprises et organisations à fort enjeu web."
        }
        serviceType={locale === "en" ? "Web development" : "Développement web"}
        url="/services"
      />
      <FAQJsonLd
        questions={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <ServicesClient />
    </main>
  )
}
