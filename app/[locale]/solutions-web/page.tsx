import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { generatePageMetadata, servicesMeta, siteConfig } from "@/lib/metadata"
import { ServiceJsonLd, BreadcrumbJsonLd, JsonLd } from "@/components/json-ld"
import { BlueprintSection, Separator } from "@/components/aspect/section"
import { CartesOffres } from "@/components/prestations/cartes-offres"
import { AppelFinal } from "@/components/prestations/parts"
import {
  LANDING,
  LANDING_DELAI,
  LANDING_PRIX,
  PRESTATIONS_PATH,
  RDV_HREF,
  REFONTE_DELAI,
  REFONTE_PRIX,
  REFONTE_WP,
  SCAN_HREF,
} from "@/lib/prestations-web"
import { MAINTENANCE_2026_11_LABEL, MAINTENANCE_PATH } from "@/lib/maintenance-offer"
import type { Locale } from "@/i18n/routing"

// Page d'orientation des prestations web (ADR-047, 2026-11-21). Sans héros,
// quatre blocs : les deux cartes, un bandeau sur la maintenance, la ligne
// « application », l'appel final. Le visiteur part de sa situation et choisit
// dès le premier écran
// entre la Vitrine évolutive et la Refonte WordPress, chacune vendue sur sa
// page. Aucun prix n'est écrit ici : tout se lit dans lib/prestations-web.ts
// (et, pour la maintenance, dans lib/maintenance-offer.ts).
//
// Page rédigée en français ; l'anglais est fermé (ENGLISH_PUBLISHED) et sa
// locale reste en noindex tant qu'elle n'est pas traduite.

type Href = Parameters<typeof Link>[0]["href"]

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
    path: PRESTATIONS_PATH,
    eyebrow: "Prestations web",
    keywords: meta.keywords,
    locale,
    noindex: locale === "en",
    alternateLocales: ["fr"],
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
  setRequestLocale(locale)
  const meta = servicesMeta(locale)

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Prestations web", url: PRESTATIONS_PATH },
  ]

  // Nœud WebPage « speakable » : les deux cartes, la zone réellement affichée
  // et autoportante de la page (le h1 n'est plus visible).
  const speakableWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}${PRESTATIONS_PATH}#webpage`,
    url: `${siteConfig.url}${PRESTATIONS_PATH}`,
    name: meta.title,
    description: meta.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".prestations-orientation"],
    },
  }

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <JsonLd data={speakableWebPage} />
      {/* Schéma aligné sur le contenu réel : les deux prestations présentées,
          chacune à son prix affiché, chacune détaillée sur sa propre page. */}
      <ServiceJsonLd
        locale={locale}
        name="Prestations web : landing page ou refonte WordPress"
        description={`Deux prestations, deux prix écrits. ${LANDING.nom} : ${LANDING.promesse} ${LANDING_PRIX}, ${LANDING_DELAI.toLowerCase()}. ${REFONTE_WP.nom} : ${REFONTE_WP.promesse} ${REFONTE_PRIX}, ${REFONTE_DELAI}.`}
        serviceType="Création de landing page et refonte de site WordPress"
        url={PRESTATIONS_PATH}
        offerCatalog={{
          name: "Les deux prestations web",
          items: [
            {
              name: LANDING.nom,
              description: LANDING.promesse,
              url: LANDING.path,
              price: LANDING.priceValue,
            },
            {
              name: REFONTE_WP.nom,
              description: REFONTE_WP.promesse,
              url: REFONTE_WP.path,
              minPrice: REFONTE_WP.priceValue,
            },
          ],
        }}
      />

      {/* Pas de héros (demande d'Agathe du 2026-11-21) : la page s'ouvre sur les
          deux cartes, le choix se fait dès le premier écran. Le h1 reste dans
          le HTML, pour les lecteurs d'écran et les moteurs, sans occuper
          l'écran. */}
      <h1 className="sr-only">Prestations web : lancer un projet ou refondre un site WordPress</h1>

      {/* Bloc 1 : les deux cartes. Le visiteur se reconnaît dans une
          situation avant de lire un nom d'offre ou un prix. */}
      <BlueprintSection tone="obsidian" id="prestations">
        <CartesOffres className="prestations-orientation" />
      </BlueprintSection>

      <Separator />

      {/* Bloc 2 : un bandeau sur la maintenance (demande d'Agathe du
          2026-11-21, à la place de la section « Ce qui est commun »). Une
          phrase, un prix lu dans lib/maintenance-offer.ts, un lien. */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Après la mise en ligne</p>
            <p className="text-lg font-light tracking-tight text-foreground md:text-xl">
              Maintenance à partir de{" "}
              <span className="text-accent-secondary">{MAINTENANCE_2026_11_LABEL.essentiel}</span>, sans obligation.
            </p>
          </div>
          <Link
            href={MAINTENANCE_PATH as Href}
            className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
          >
            Voir le suivi et la maintenance
            <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </BlueprintSection>

      <Separator />

      {/* Bloc 3 : l'offre application, en une ligne. Ni carte, ni prix mis en
          avant, ni page dédiée. L'ancre #forfait-webapp est celle des anciens
          liens vers la prestation Évolution. */}
      <BlueprintSection tone="obsidian" id="forfait-webapp" innerClassName="px-6 py-10 lg:px-8 lg:py-12">
        <p className="max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
          Vous avez besoin d&apos;une application ou d&apos;un outil métier ? C&apos;est possible, sur devis.{" "}
          <a
            href={RDV_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-secondary no-underline hover:text-foreground"
          >
            Parlons-en.
          </a>
        </p>
      </BlueprintSection>

      <Separator />

      {/* Bloc 4 : appel final. L'échange gratuit pour qui hésite ; l'analyse du
          site reste proposée à qui en a déjà un (deux températures). */}
      <AppelFinal
        titre="Vous hésitez entre les deux ?"
        primary={{ label: "Échange gratuit de 15 minutes", href: RDV_HREF, external: true }}
        secondary={{ label: "Analyser mon site", href: SCAN_HREF, plain: true }}
      />
    </main>
  )
}
