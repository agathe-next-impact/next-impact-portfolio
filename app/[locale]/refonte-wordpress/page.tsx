import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import { generatePageMetadata, refonteWordpressMeta, siteConfig } from "@/lib/metadata"
import { ServiceJsonLd, BreadcrumbJsonLd, JsonLd } from "@/components/json-ld"
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section"
import { PageHero } from "@/components/aspect/page-hero"
import { BlueprintGrid } from "@/components/visuals/blueprint-grid"
import { EnBref } from "@/components/en-bref"
import FaqSchema from "@/components/services/FaqSchema"
import Process from "@/components/process"
import {
  AppelFinal,
  BoutonAction,
  EnTete,
  HeroVideo,
  LignePrix,
  TitreDeuxLignes,
} from "@/components/prestations/parts"
import { PrestationRealisations } from "@/components/prestations/prestation-realisations"
import {
  FORMULES,
  FORMULES_DUREES,
  HERO_VIDEOS,
  LANDING,
  RDV_HREF,
  REFONTE_DELAI,
  REFONTE_FAQ,
  REFONTE_PRIX,
  REFONTE_WP,
  SCAN_HREF,
  formulePrix,
} from "@/lib/prestations-web"
import { MAINTENANCE_2026_11_LABEL, MAINTENANCE_PATH } from "@/lib/maintenance-offer"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"

// Page d'offre « Refonte WordPress » (ADR-047, 2026-11-21) : le point de
// départ « Votre stratégie est stable ». Six blocs, en miroir de
// /landing-evolutive pour que les deux se comparent. Les deux formules, thème
// sur mesure et headless, restent à égalité (ADR-031) : leurs prix se lisent
// dans lib/trajectoires.ts, à travers lib/prestations-web.ts.
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
    title: refonteWordpressMeta.title,
    description: refonteWordpressMeta.description,
    path: REFONTE_WP.path,
    eyebrow: REFONTE_WP.nom,
    keywords: refonteWordpressMeta.keywords,
    locale,
    noindex: locale === "en",
    alternateLocales: ["fr"],
  })
}

// Revalidate toutes les 24 heures
export const revalidate = 86400

const ANALYSER = { label: "Analyser mon site", href: SCAN_HREF, plain: true }
const PARLER = { label: "Parler de ma refonte", href: RDV_HREF, external: true }

export default async function RefonteWordpressPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: REFONTE_WP.nom, url: REFONTE_WP.path },
  ]

  // Nœud WebPage « speakable » : le h1 et le cartouche « L'essentiel ».
  const speakableWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}${REFONTE_WP.path}#webpage`,
    url: `${siteConfig.url}${REFONTE_WP.path}`,
    name: refonteWordpressMeta.title,
    description: refonteWordpressMeta.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".refonte-tldr"],
    },
  }

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <JsonLd data={speakableWebPage} />
      {/* Les deux formules, chacune à son plancher affiché sur la page. */}
      <ServiceJsonLd
        locale={locale}
        name={`${REFONTE_WP.nom} : thème sur mesure ou headless`}
        description={`${REFONTE_WP.promesse} ${REFONTE_PRIX}, ${REFONTE_DELAI}. Prix et délai écrits avant de commencer.`}
        serviceType="Refonte de site WordPress"
        url={REFONTE_WP.path}
        offerCatalog={{
          name: "Les deux formules de la Refonte WordPress",
          items: FORMULES.map((f) => ({
            name: `${REFONTE_WP.nom} · ${f.nom}`,
            description: `${f.pourQui} ${f.variante.enClair.fr}`,
            url: `${REFONTE_WP.path}#formules`,
            minPrice: f.variante.priceValue,
          })),
        }}
      />

      {/* Bloc 1 : héros. Sur-titre = le verbe, h1 = le nom de l'offre (demande
          d'Agathe du 2026-11-21) ; l'ancien titre, la promesse, passe en
          sous-titre. La vidéo en colonne droite, la ligne de prix sous le
          sous-titre ; l'analyse du site en bouton principal. Sans descriptif
          depuis le 2026-11-22 (demande d'Agathe). */}
      <PageHero
        index="№ 01"
        kicker={REFONTE_WP.verbe}
        title={
          <>
            Refonte <em className="font-normal not-italic text-accent-secondary">WordPress</em>
          </>
        }
        subtitle="Vos contenus restent. Tout ce qui les porte est refait."
        facts={<LignePrix items={[REFONTE_PRIX, REFONTE_DELAI]} />}
        backdrop={<BlueprintGrid />}
        actions={
          <>
            <BoutonAction action={ANALYSER} primary />
            <BoutonAction action={PARLER} />
          </>
        }
        aside={<HeroVideo src={HERO_VIDEOS.refonte.src} label={HERO_VIDEOS.refonte.label} />}
        asideFirstOnMobile
      />

      <Separator />

      {/* Bloc 2 : deux formules, à égalité (ADR-031). Même poids visuel, pas
          d'ordre de préférence : la situation tranche. */}
      <BlueprintSection tone="obsidian" id="formules">
        <EnTete>
          <SectionHeading
            index="№ 02"
            kicker="Deux formules"
            title={<TitreDeuxLignes bleu="Deux formules," encre="choisies selon votre situation." />}
          />
        </EnTete>
        <ul className="grid gap-px bg-dark-gray md:grid-cols-2">
          {FORMULES.map((f) => (
            <li key={f.slug} className="flex flex-col gap-4 bg-obsidian p-6 lg:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">{f.nom}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary">
                  {formulePrix(f)}
                </span>
              </div>
              <p className="font-inter-tight text-base leading-relaxed text-foreground/85">{f.pourQui}</p>
              {/* Ce que c'est, en clair : lu dans lib/trajectoires.ts. */}
              <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{f.variante.enClair.fr}</p>
              {f.slug === "headless" && (
                <Link
                  href={"/wordpress-headless" as Href}
                  className="group mt-auto inline-flex items-center gap-1.5 self-start font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
                >
                  Comprendre le headless
                  <ArrowRight size={12} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="border-t border-dark-gray px-6 py-6 font-inter-tight text-base leading-relaxed text-foreground/85 lg:px-8">
          Le headless n&apos;est pas une mode, c&apos;est une option quand la performance le justifie.
        </p>
      </BlueprintSection>

      <Separator />

      {/* Bloc 3 : les études de cas, remontées juste après les deux formules
          (demande d'Agathe du 2026-11-21) : la preuve avant la méthode. Même
          gabarit que la landing, où le bloc reste en bas de page. L'ancien
          bloc « Trois raisons de refondre sans tout changer », avec la mesure
          de vitesse en direct, est retiré (même demande). */}
      <PrestationRealisations
        prestation="refonte"
        locale={locale}
        index="№ 03"
        titre={{ bleu: "Ce que devient un site", encre: "quand ses contenus restent." }}
      />

      <Separator />

      {/* Bloc 4 : la méthode en cinq phases, inchangée ; les durées par
          formule s'écrivent en toutes lettres. (L'ancien bloc « Comment je
          choisis la formule » est retiré, demande d'Agathe du 2026-11-21.) */}
      <BlueprintSection
        tone="obsidian"
        id="methode"
        innerClassName="border-t border-dark-gray px-6 py-16 lg:px-8 lg:py-20"
      >
        <Process index="№ 04" recap={FORMULES_DUREES} />
      </BlueprintSection>

      <Separator />

      {/* Bloc 5 : après la mise en ligne. La maintenance, sans obligation. */}
      <BlueprintSection tone="obsidian" id="apres">
        <EnTete>
          <SectionHeading
            index="№ 05"
            kicker="Après la mise en ligne"
            title={
              <TitreDeuxLignes
                bleu="Maintenance sans obligation,"
                encre={`à partir de ${MAINTENANCE_2026_11_LABEL.essentiel}.`}
              />
            }
            description="Sans abonnement, un forfait d'heures d'intervention reste disponible à la demande."
          />
        </EnTete>
        <div className="px-6 py-6 lg:px-8">
          <Link
            href={MAINTENANCE_PATH as Href}
            className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
          >
            Voir le suivi et la maintenance
            <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </BlueprintSection>

      <Separator />

      {/* Bloc 6 : « L'essentiel », la FAQ, puis l'appel final. Le cartouche
          est le résumé citable de la page, juste avant la FAQ (ADR-024). */}
      <EnBref
        className="refonte-tldr"
        label="L'essentiel"
        lines={[
          `${REFONTE_WP.nom} : vos contenus restent et votre équipe publie toujours dans WordPress ; le design, la vitesse et la base technique sont refaits. ${REFONTE_PRIX}, ${REFONTE_DELAI}.`,
          `Deux formules à égalité, choisies selon votre situation : ${FORMULES.map(
            (f) => `${f.nom.toLowerCase()} (${formulePrix(f).replace(/^À/, "à")}, ${f.semaines} semaines)`,
          ).join(" ou ")}.`,
          "Continuité : contenus repris, adresses de pages préservées ou redirigées. Aucune page perdue, aucun référencement perdu.",
          "Chaque refonte commence par une première analyse de veille technique et stratégique. Prix et délai écrits avant de commencer, vitesse mesurée avant et après.",
          `Maintenance à partir de ${MAINTENANCE_2026_11_LABEL.essentiel}, sans obligation ; sans abonnement, un forfait d'heures d'intervention reste disponible à la demande.`,
        ]}
      />

      <Separator />

      <FaqSchema
        faqs={REFONTE_FAQ}
        title="Questions fréquentes"
        description="Les réponses aux questions les plus courantes sur la Refonte WordPress."
        sectionId="refonte-faq"
        index="№ 06"
      />

      <Separator />

      <AppelFinal
        titre={<TitreDeuxLignes bleu="Commencez par l'état des lieux :" encre="une adresse, un rapport, aucun accès demandé." />}
        primary={ANALYSER}
        secondary={PARLER}
        croise={{
          texte: "Vous lancez un nouveau projet ?",
          label: `Voir la ${LANDING.nom}`,
          href: LANDING.path,
        }}
      />
    </main>
  )
}
