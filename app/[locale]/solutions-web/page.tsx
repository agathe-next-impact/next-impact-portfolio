import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata, servicesMeta, siteConfig } from "@/lib/metadata"
import { ServiceJsonLd, BreadcrumbJsonLd, JsonLd } from "@/components/json-ld"
import ServicesClient from "@/components/services/ServicesClient"
import { TenirBanner } from "@/components/tenir/tenir-banner"
import { TRAJECTOIRES, TRAJECTOIRE_ORDER, formatEuros } from "@/lib/trajectoires"
import type { Locale } from "@/i18n/routing"

// Titre, description et mots-clés : lus dans lib/metadata.ts (`servicesMeta`),
// qui lit lui-même le nom et le plancher de chaque prestation dans
// lib/trajectoires.ts (charte v1.6, ADR-014). Aucun prix n'est écrit ici.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = servicesMeta(locale)
  return generatePageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/solutions-web",
    keywords: meta.keywords,
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
  const isEn = locale === "en"
  const lang = isEn ? "en" : "fr"
  const meta = servicesMeta(locale)

  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbServices"), url: "/solutions-web" },
  ]

  // Nœud WebPage « speakable » : désigne aux assistants de lecture le H1 et le
  // cartouche « L'essentiel » de la page, deux zones réellement affichées et
  // autoportantes. Même dispositif que la home et la page pilier headless.
  const speakableWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}${isEn ? "/en" : ""}/solutions-web#webpage`,
    url: `${siteConfig.url}${isEn ? "/en" : ""}/solutions-web`,
    name: meta.title,
    description: meta.description,
    inLanguage: isEn ? "en-US" : "fr-FR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".services-tldr"],
    },
  }

  // Les trois prestations, telles que la page les affiche : le nom, le nom
  // technique en sous-titre, le plancher « à partir de ». Lus dans
  // lib/trajectoires.ts, comme les cartes.
  const prestations = TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug])
  const prestationList = prestations
    .map((p) => {
      const recommended = p.recommended ? (isEn ? "recommended, " : "recommandée, ") : ""
      return isEn
        ? `${p.name.en} (${p.technique.en}, ${recommended}from ${formatEuros(p.priceValue, "en")} excl. VAT)`
        : `${p.name.fr} (${p.technique.fr}, ${recommended}dès ${formatEuros(p.priceValue, "fr")} HT)`
    })
    .join(", ")

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <JsonLd data={speakableWebPage} />
      {/* Schéma aligné sur le contenu réel de la page : les trois prestations
          du catalogue (charte §5), prix « à partir de » affichés, et la
          première analyse de veille par laquelle chacune commence. Les packs
          n'y figurent pas : ce sont des parcours, pas des offres. */}
      <ServiceJsonLd
        locale={locale}
        name={
          isEn
            ? "WordPress redesign: three services for an aging site"
            : "Refonte WordPress : trois prestations pour un site qui vieillit"
        }
        description={
          isEn
            ? `Three services for an aging WordPress site: ${prestationList}. Each service starts with a first technical and strategic watch analysis. Price and timeline in writing before starting.`
            : `Trois prestations pour un site WordPress qui vieillit : ${prestationList}. Chaque prestation commence par une première analyse de veille technique et stratégique. Prix et délai écrits avant de commencer.`
        }
        serviceType={isEn ? "Web redesign and development" : "Refonte et développement web"}
        url="/solutions-web"
        offerCatalog={{
          name: isEn ? "The three services" : "Les trois prestations",
          items: prestations.map((p) => ({
            name: `${p.name[lang]}${isEn ? ": " : " : "}${p.technique[lang]}`,
            // La phrase « en clair » de la carte (ADR-015), lue dans la source,
            // puis les variantes à égalité quand la prestation en a (la
            // Refonte : WordPress sur mesure ou headless, ADR-031).
            description: p.variantes?.length
              ? `${p.enClair[lang]} ${
                  isEn
                    ? `Two variants on an equal footing, chosen according to the situation: ${p.variantes
                        .map((v) => `${v.technique.en}, from ${formatEuros(v.priceValue, "en")} excl. VAT`)
                        .join("; ")}.`
                    : `Deux variantes à égalité, choisies selon la situation : ${p.variantes
                        .map((v) => `${v.technique.fr}, à partir de ${formatEuros(v.priceValue, "fr")} HT`)
                        .join(" ; ")}.`
                }`
              : p.enClair[lang],
            url: p.href,
            minPrice: p.priceValue,
          })),
        }}
      />
      {/* La FAQ visible et son schéma FAQPage sont portés par ServicesClient →
          ServicesFAQ → FaqSchema (profile-aware, schéma = contenu affiché). Pas
          de FAQJsonLd ici : cela créerait un second FAQPage divergent du visible. */}
      <ServicesClient />
      {/* Après la livraison : les deux abonnements du moment « Gérer » (suivi
          et maintenance, expert technique externalisé), Sentinelle en mention
          incluse (ADR-013). Récurrents, ils ne rentrent pas dans les trois
          prestations au forfait. */}
      <TenirBanner tone="jet" />
    </main>
  )
}
