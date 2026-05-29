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
            "website build services",
            "Headless WordPress pricing",
            "custom web app",
            "custom mobile application",
            "WordPress Next.js",
            "PWA build",
            "marketplace build",
            "web project pricing",
          ]
        : [
            "services création site web",
            "tarifs WordPress Headless",
            "prix application web",
            "web app sur-mesure",
            "application mobile sur-mesure",
            "WordPress Next.js",
            "marketplace sur-mesure",
            "PWA création",
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
            ? "Website and custom application build services"
            : "Services de création de sites web et d'applications sur-mesure"
        }
        description={
          locale === "en"
            ? "Custom websites and applications: classic WordPress, Headless WordPress + Next.js, custom web apps and mobile PWAs. Solutions tailored to SMEs, enterprises and organizations with strong web requirements."
            : "Sites web et applications sur-mesure : WordPress classique, Headless WordPress + Next.js, web apps et PWA mobile. Solutions adaptées aux PME, entreprises et organisations à fort enjeu web."
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
