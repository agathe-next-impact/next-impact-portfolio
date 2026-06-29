import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import ServicesClient from "@/components/services/ServicesClient"
import { getServicesPageVariants } from "@/lib/homepage-profiles"
import { BlueprintSection } from "@/components/aspect/section"
import { AuditPromoBanner } from "@/components/audit/audit-promo-banner"
import { WordpressExpressBanner } from "@/components/wordpress-express/wordpress-express-banner"
import { VisioConseilBanner } from "@/components/visio-conseil/visio-conseil-banner"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
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
    { name: t("breadcrumbServices"), url: "/solutions-web" },
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
        url="/solutions-web"
      />
      <FAQJsonLd
        questions={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <ServicesClient />
      {/* Maillage SEO/GEO : ancre exacte vers la page pilier WordPress Headless. */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-10 lg:px-8 lg:py-12">
        <Link
          href="/wordpress-headless"
          className="group flex flex-col gap-2 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-obsidian/40 p-6 no-underline transition-colors hover:border-accent-secondary"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
            {locale === "en" ? "Background reading" : "Pour comprendre la techno"}
          </span>
          <span className="flex items-center justify-between gap-3">
            <span className="text-lg font-light tracking-tight text-foreground md:text-xl">
              {locale === "en"
                ? "Headless WordPress with Next.js — definition, costs, performance"
                : "WordPress Headless avec Next.js — définition, coûts, performance"}
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-mid-gray transition-colors group-hover:text-accent-secondary" />
          </span>
        </Link>
      </BlueprintSection>
      {/* Une décision à trancher avant de s'engager → visio conseil (déduite du devis). */}
      <VisioConseilBanner tone="obsidian" />
      {/* Offre d'appel : un besoin ponctuel plutôt qu'un projet → dépannage. */}
      <WordpressExpressBanner tone="jet" />
      {/* Maillage : orienter ceux qui hésitent sur la stack vers l'audit. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
        <AuditPromoBanner variant="services" />
      </BlueprintSection>
    </main>
  )
}
