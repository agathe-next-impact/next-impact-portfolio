import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { generatePageMetadata, landingMeta, siteConfig } from "@/lib/metadata"
import { ServiceJsonLd, BreadcrumbJsonLd, JsonLd } from "@/components/json-ld"
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section"
import { PageHero } from "@/components/aspect/page-hero"
import { BlueprintGrid } from "@/components/visuals/blueprint-grid"
import { EnBref } from "@/components/en-bref"
import FaqSchema from "@/components/services/FaqSchema"
import {
  AppelFinal,
  BoutonAction,
  Cellules,
  EnTete,
  HeroVideo,
  Lignes,
  LignePrix,
  TitreDeuxLignes,
} from "@/components/prestations/parts"
import { RealisationsSelection } from "@/components/prestations/prestation-realisations"
import {
  EXTENSION_PRIX,
  HERO_VIDEOS,
  LANDING,
  LANDING_DELAI,
  LANDING_FAQ,
  LANDING_PRIX,
  RDV_HREF,
  REALISATIONS_PAR_PRESTATION,
  REFONTE_DELAI,
  REFONTE_WP,
} from "@/lib/prestations-web"
import { MAINTENANCE_2026_11_LABEL, MAINTENANCE_PATH } from "@/lib/maintenance-offer"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"

// Page d'offre « Vitrine évolutive » (ADR-047, 2026-11-21) : le point de
// départ « Vous lancez ou vous testez ». Huit blocs : le prix tout compris,
// puis trois études de cas dès le bloc 3 (remontées du bas de page le
// 2026-11-21), l'argumentaire, la FAQ et l'appel final. Aucun prix ni délai n'est écrit ici : tout se lit
// dans lib/prestations-web.ts et lib/maintenance-offer.ts.
//
// Page rédigée en français ; la locale anglaise est en noindex.

type Href = Parameters<typeof Link>[0]["href"]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: landingMeta.title,
    description: landingMeta.description,
    path: LANDING.path,
    eyebrow: LANDING.nom,
    keywords: landingMeta.keywords,
    locale,
    noindex: locale === "en",
    alternateLocales: ["fr"],
  })
}

// Revalidate toutes les 24 heures
export const revalidate = 86400

const DEMARRER = { label: LANDING.demarrerLabel, href: LANDING.demarrerHref }

// Bloc 6 : la base technique retenue selon la situation. Le visiteur ne
// choisit pas ; la correspondance est celle des directives du 2026-11-21.
const BASES = [
  { situation: "Vous voulez modifier vos contenus vous-même", base: "WordPress" },
  { situation: "La page restera légère, avec quelques extensions", base: "Astro" },
  { situation: "Vous prévoyez un site plus large ou des fonctions sur mesure", base: "Next.js" },
]

export default async function LandingEvolutivePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: LANDING.nom, url: LANDING.path },
  ]

  // Nœud WebPage « speakable » : le h1 et le cartouche « L'essentiel ».
  const speakableWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}${LANDING.path}#webpage`,
    url: `${siteConfig.url}${LANDING.path}`,
    name: landingMeta.title,
    description: landingMeta.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".landing-tldr"],
    },
  }

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <JsonLd data={speakableWebPage} />
      {/* Le prix déclaré est celui que la page affiche : un prix fixe. */}
      <ServiceJsonLd
        locale={locale}
        name={`${LANDING.nom} : landing page premium, textes et visuels compris`}
        description={`Une grande page aboutie, travaillée dans sa structure, ses textes et son rendu, pensée pour convertir. ${LANDING_PRIX}, textes et visuels compris, ${LANDING_DELAI.toLowerCase()}. Page supplémentaire : ${EXTENSION_PRIX}, prix fixe.`}
        serviceType="Création de landing page"
        url={LANDING.path}
        offer={{ price: LANDING.priceValue }}
      />

      {/* Bloc 1 : héros. La vidéo en colonne droite, la ligne de prix sous
          l'accroche. */}
      <PageHero
        index="№ 01"
        kicker="Lancement d'offre"
        title={<em className="font-normal not-italic text-accent-secondary">Vitrine évolutive</em>}
        description={
          <>
            Une grande page qui dit l&apos;essentiel, travaillée dans sa structure, ses textes et son rendu, pensée
            pour convertir. Vous êtes en ligne en {LANDING.delaiSemaines} semaines et vous décidez des pages
            suivantes sur des faits.
            <LignePrix
              items={[
                `${LANDING_PRIX}, textes et visuels compris`,
                LANDING_DELAI,
                `Page supplémentaire : ${EXTENSION_PRIX}`,
              ]}
            />
          </>
        }
        backdrop={<BlueprintGrid />}
        actions={
          <>
            <BoutonAction action={DEMARRER} primary />
            <BoutonAction action={{ label: "Voir les réalisations", href: "#realisations", plain: true }} />
          </>
        }
        aside={<HeroVideo src={HERO_VIDEOS.landing.src} label={HERO_VIDEOS.landing.label} />}
      />

      <Separator />

      {/* Bloc 2 : ce qui est compris. */}
      <BlueprintSection tone="obsidian" id="compris">
        <EnTete>
          <SectionHeading
            index="№ 02"
            kicker="Ce qui est compris"
            title={<TitreDeuxLignes bleu={`${LANDING_PRIX}.`} encre="Textes et visuels compris." />}
          />
        </EnTete>
        <Cellules
          cols={4}
          items={[
            { titre: "Les textes", texte: "Rédigés si vous ne les fournissez pas." },
            { titre: "Les visuels", texte: "Créés si vous ne les fournissez pas." },
            {
              titre: "La conception et le développement",
              texte: "La page est conçue et développée pour vous, optimisée pour la conversion.",
            },
            {
              titre: "L'hébergement et le nom de domaine",
              texte: `Mis en place à votre nom : vous en restez propriétaire. Leur coût courant relève de la maintenance, pas des ${LANDING_PRIX}.`,
            },
          ]}
        />
      </BlueprintSection>

      <Separator />

      {/* Bloc 3 : la grille d'études de cas, trois réalisations (ancre du
          bouton du héros). Remontée du bas de page le 2026-11-21 (demande
          d'Agathe) : la preuve arrive avant l'argumentaire. La sélection se
          lit dans lib/prestations-web.ts. */}
      <RealisationsSelection
        slugs={REALISATIONS_PAR_PRESTATION.landing.cas}
        locale={locale}
        index="№ 03"
        kicker="Études de cas"
        titre={{ bleu: "Ce que donne une page", encre: "quand on y met tout." }}
      />

      <Separator />

      {/* Bloc 4 : trois raisons de commencer par une page. */}
      <BlueprintSection tone="obsidian">
        <EnTete>
          <SectionHeading
            index="№ 04"
            kicker="Pourquoi une seule page"
            title={<TitreDeuxLignes bleu="Trois raisons de commencer" encre="par une page." />}
          />
        </EnTete>
        <Cellules
          items={[
            {
              titre: "Aboutie",
              texte:
                "Tout l'effort va dans une page : structure, contenus et finition visuelle sont poussés plus loin que sur un site de dix pages au même budget.",
            },
            {
              titre: "Rapide",
              texte: `${LANDING_DELAI}, contre ${REFONTE_DELAI} pour un site complet.`,
            },
            {
              titre: "Guidée par les faits",
              texte:
                "Les retours de vos clients et le comportement des visiteurs indiquent quelles pages ajouter. Vous ne payez pas de pages que personne ne lit.",
            },
          ]}
        />
      </BlueprintSection>

      <Separator />

      {/* Bloc 5 : quatre semaines, quatre étapes. */}
      <BlueprintSection tone="obsidian" id="etapes">
        <EnTete>
          <SectionHeading
            index="№ 05"
            kicker="Le déroulé"
            title={<TitreDeuxLignes bleu="Quatre semaines," encre="quatre étapes." />}
          />
        </EnTete>
        <Cellules
          cols={4}
          numbered
          items={[
            {
              surtitre: "Semaine 1",
              titre: "Choisir une direction",
              texte: "Vous partez des inspirations pour fixer le style avant toute production.",
            },
            {
              surtitre: "Semaine 2",
              titre: "Écrire et dessiner",
              texte: "Structure de la page, textes, visuels.",
            },
            {
              surtitre: "Semaine 3",
              titre: "Construire",
              texte: "Développement, réglages de vitesse, tests sur mobile.",
            },
            {
              surtitre: "Semaine 4",
              titre: "Mettre en ligne et observer",
              texte: "Domaine, hébergement, mesure des visites et des clics.",
            },
          ]}
        />
      </BlueprintSection>

      <Separator />

      {/* Bloc 6 : la suite, à votre rythme. Extension et maintenance. */}
      <BlueprintSection tone="obsidian" id="suite">
        <EnTete>
          <SectionHeading
            index="№ 06"
            kicker="La suite, à votre rythme"
            title={<TitreDeuxLignes bleu="Votre site grandit" encre="quand un besoin est prouvé." />}
          />
        </EnTete>
        <Lignes
          rows={[
            {
              titre: "Extension",
              valeur: `${EXTENSION_PRIX} la page, prix fixe`,
              texte: "Une page ajoutée quand les retours clients ou les statistiques montrent qu'elle manque.",
            },
            {
              titre: "Maintenance",
              valeur: `À partir de ${MAINTENANCE_2026_11_LABEL.essentiel}`,
              texte: (
                <>
                  Hébergement, nom de domaine, mises à jour et sauvegardes. Formule Essentiel à{" "}
                  {MAINTENANCE_2026_11_LABEL.essentiel}, {MAINTENANCE_2026_11_LABEL.monitoring} avec monitoring.{" "}
                  <Link
                    href={MAINTENANCE_PATH as Href}
                    className="text-accent-secondary no-underline hover:text-foreground"
                  >
                    Voir le suivi et la maintenance
                  </Link>
                </>
              ),
            },
          ]}
        />
        <p className="border-t border-dark-gray px-6 py-6 font-inter-tight text-base leading-relaxed text-mid-gray lg:px-8">
          La maintenance n&apos;est pas obligatoire. Sans abonnement, vous réglez l&apos;hébergement et le domaine
          directement, et vous prenez un forfait d&apos;heures d&apos;intervention le jour où vous en avez besoin.
        </p>
      </BlueprintSection>

      <Separator />

      {/* Bloc 7 : la technologie se décide selon le projet. */}
      <BlueprintSection tone="obsidian" id="technologie">
        <EnTete>
          <SectionHeading
            index="№ 07"
            kicker="La base technique"
            title={<TitreDeuxLignes bleu="La technologie se décide" encre="selon votre projet." />}
            description="Vous n'avez pas à choisir. Je retiens la base la plus légère pour ce que vous prévoyez."
          />
        </EnTete>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-dark-gray">
              <th
                scope="col"
                className="px-6 py-4 font-mono text-2xs font-normal uppercase tracking-[0.12em] text-mid-gray lg:px-8"
              >
                Votre situation
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-mono text-2xs font-normal uppercase tracking-[0.12em] text-mid-gray lg:px-8"
              >
                Base retenue
              </th>
            </tr>
          </thead>
          <tbody>
            {BASES.map((row) => (
              <tr key={row.base} className="border-b border-dark-gray last:border-b-0">
                <th
                  scope="row"
                  className="px-6 py-5 font-inter-tight text-base font-normal leading-relaxed text-foreground/85 lg:px-8"
                >
                  {row.situation}
                </th>
                <td className="px-6 py-5 text-lg font-light tracking-tight text-accent-secondary lg:px-8">
                  {row.base}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BlueprintSection>

      <Separator />

      {/* Bloc 8 : « L'essentiel », la FAQ, puis l'appel final. Le cartouche
          est le résumé citable de la page, juste avant la FAQ (ADR-024). Sa
          première ligne relie le nom de l'offre à ce qu'elle est, une landing
          page : c'est le terme que portent le titre de la page et ses
          données structurées. */}
      <EnBref
        className="landing-tldr"
        label="L'essentiel"
        lines={[
          `La ${LANDING.nom} est une landing page premium : une grande page aboutie, à ${LANDING_PRIX}, textes et visuels compris, en ligne en ${LANDING.delaiSemaines} semaines.`,
          "Pour un nouveau projet, une nouvelle offre ou un nouveau marché : vous décidez des pages suivantes sur des faits, pas sur des suppositions.",
          `Extension : ${EXTENSION_PRIX} la page, prix fixe, ajoutée quand les retours clients ou les statistiques montrent qu'elle manque.`,
          `Maintenance à partir de ${MAINTENANCE_2026_11_LABEL.essentiel}, sans obligation : hébergement, nom de domaine, mises à jour et sauvegardes. Le domaine et l'hébergement sont à votre nom.`,
          "La base technique (WordPress, Astro ou Next.js) est retenue selon ce que vous prévoyez : vous n'avez pas à choisir.",
        ]}
      />

      <Separator />

      <FaqSchema
        faqs={LANDING_FAQ}
        title="Questions fréquentes"
        description="Les réponses aux questions les plus courantes sur la Vitrine évolutive."
        sectionId="landing-faq"
        index="№ 08"
      />

      <Separator />

      <AppelFinal
        titre={<TitreDeuxLignes bleu="Une page aboutie," encre={`en ligne en ${LANDING.delaiSemaines} semaines.`} />}
        primary={DEMARRER}
        secondary={{ label: "Échange gratuit", href: RDV_HREF, external: true }}
        croise={{
          texte: "Vous avez déjà un site et des contenus ?",
          label: `Voir la ${REFONTE_WP.nom}`,
          href: REFONTE_WP.path,
        }}
      />
    </main>
  )
}
