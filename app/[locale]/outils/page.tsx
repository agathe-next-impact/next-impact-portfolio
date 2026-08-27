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
            "free website audit",
            "web & AI tech selector",
            "PWA opportunity diagnostic",
            "specifications generator",
            "headless migration",
          ]
        : [
            "audit site web gratuit",
            "sélecteur techno web IA",
            "diagnostic opportunité PWA",
            "cahier des charges",
            "migration headless",
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
  // Miroir de la grille réellement affichée (OutilsBentoGrid) : le schéma
  // CollectionPage liste les mêmes outils que le visible, aux mêmes URLs.
  const outilsItems =
    locale === "en"
      ? [
          { name: "Web & AI tech selector", url: "/outils/selecteur-techno", description: "Which web technology for your project: 8 criteria, one recommendation." },
          { name: "AI visibility diagnostic", url: "/outils/visibilite-ia", description: "Is your site visible to ChatGPT and Perplexity? Score on 4 axes." },
          { name: "GEO checklist", url: "/outils/checklist-geo", description: "24 concrete actions to get cited by AI engines." },
          { name: "Web quote decoder", url: "/outils/decrypteur-devis", description: "9 checks to read a website quote before signing." },
          { name: "Repair or rebuild?", url: "/outils/reparer-ou-refaire", description: "A health score and a clear decision signal for your site." },
          { name: "AI prototype: throwaway or maintainable?", url: "/outils/prototype-ia", description: "9 checks to know whether your AI prototype can go to production." },
          { name: "No-code, SaaS or custom?", url: "/outils/nocode-saas-surmesure", description: "Build, buy or no-code: the right family for your business tool." },
          { name: "Project diagnostic", url: "/solutions-web/eligibilite", description: "Identify the right path: classic WordPress, Headless, web app or mobile." },
          { name: "2-minute site diagnostic", url: "/audit-site-web", description: "See what slows your site down and which trajectory fits." },
          { name: "PWA opportunity diagnostic", url: "/outils/audit-pwa", description: "Should you build an installable PWA? 9 scoping questions." },
          { name: "Project specifications generator", url: "/cahier-des-charges", description: "Build your complete, personalized specifications document." },
        ]
      : [
          { name: "Sélecteur techno web & IA", url: "/outils/selecteur-techno", description: "Quelle techno web pour votre projet : 8 critères, une recommandation." },
          { name: "Diagnostic visibilité IA", url: "/outils/visibilite-ia", description: "Votre site est-il visible dans ChatGPT et Perplexity ? Score sur 4 axes." },
          { name: "Checklist GEO", url: "/outils/checklist-geo", description: "24 actions concrètes pour être cité par les moteurs IA." },
          { name: "Décrypteur de devis web", url: "/outils/decrypteur-devis", description: "9 vérifications pour lire un devis web avant de signer." },
          { name: "Réparer ou refaire ?", url: "/outils/reparer-ou-refaire", description: "Un score de santé et un signal de décision clair pour votre site." },
          { name: "Prototype IA : jetable ou maintenable ?", url: "/outils/prototype-ia", description: "9 vérifications pour savoir si votre prototype IA peut passer en production." },
          { name: "No-code, SaaS ou sur-mesure ?", url: "/outils/nocode-saas-surmesure", description: "Construire, acheter ou no-code : la bonne famille pour votre outil métier." },
          { name: "Diagnostic de projet", url: "/solutions-web/eligibilite", description: "Identifiez la voie adaptée : WordPress classique, Headless, web app ou mobile." },
          { name: "Diagnostic de site en 2 minutes", url: "/audit-site-web", description: "Voyez ce qui ralentit votre site et quelle trajectoire correspond." },
          { name: "Diagnostic d'opportunité PWA", url: "/outils/audit-pwa", description: "Faut-il créer une PWA installable ? 9 questions de cadrage." },
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
