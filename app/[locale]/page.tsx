import { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import Hero from "@/components/hero";
import HomeTldr from "@/components/home-tldr";
import HomeFaq from "@/components/home-faq";
import { ProofStrip } from "@/components/proof-strip";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { CartesOffres } from "@/components/prestations/cartes-offres";
import { AppelFinal } from "@/components/prestations/parts";
import { RealisationsSelection } from "@/components/prestations/prestation-realisations";
import { pageMetadata, siteConfig } from "@/lib/metadata";
import { HomepageJsonLd, ServiceJsonLd, FAQJsonLd } from "@/components/json-ld";
import { getHomeContent } from "@/lib/home-content";
import { getAllSlugs } from "@/lib/case-studies-data";
import {
  LANDING,
  RDV_HREF,
  REALISATIONS_HOME,
  REFONTE_WP,
  SCAN_HREF,
} from "@/lib/prestations-web";
import type { Locale } from "@/i18n/routing";

// Home refaite le 2026-11-21 (ADR-047, demande d'Agathe) : elle ne reflète que
// l'offre du Studio digital, deux points de départ, la Vitrine évolutive et la
// Refonte WordPress. L'audit, le suivi et maintenance, l'expert technique
// externalisé et la section veille n'y sont plus présentés.
//
// Ordre de conviction : se reconnaître (héros), vérifier (bande de preuve),
// choisir (les deux cartes), voir ce que ça donne (études de cas, témoignages,
// vitesse mesurée en direct), savoir qui le fait (le studio), puis la synthèse
// citable, la FAQ et l'appel final à deux températures.
//
// Composition côté serveur : les cartes et les études de cas sont dans le HTML
// servi ; les sections interactives sous la ligne de flottaison restent
// chargées à part. Aucun prix n'est écrit ici : lib/prestations-web.ts.

const HomeTestimonials = dynamic(() => import("@/components/home-testimonials"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomePerf = dynamic(() => import("@/components/home-perf"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeStudio = dynamic(() => import("@/components/home-studio"), {
  loading: () => <div style={{ minHeight: 500 }} />,
});

// Revalidate toutes les heures
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata.home(locale);
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { faq, tldr } = getHomeContent(locale);
  // Nombre d'études de cas publiées, pour la bande de preuve sous le héros :
  // lu dans la source, jamais écrit en dur.
  const documented = getAllSlugs().length;

  return (
    <>
      <HomepageJsonLd locale={locale} />
      {/* Les deux prestations que la home présente, chacune à son prix
          affiché, chacune détaillée sur sa propre page. Ce nœud décrit la
          HOME : son adresse est celle de la home, et sa description reprend
          mot pour mot les trois premières lignes de « L'essentiel », visibles
          sur la page. /solutions-web déclare son propre nœud Service, à sa
          propre adresse : deux pages, deux nœuds, sans adresse en commun. */}
      <ServiceJsonLd
        locale={locale}
        name="Studio digital : vitrine évolutive ou refonte WordPress"
        description={tldr.lines.slice(0, 3).join(" ")}
        serviceType="Création de site vitrine et refonte de site WordPress"
        url={siteConfig.url}
        offerCatalog={{
          name: "Les deux prestations du Studio digital",
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
      <FAQJsonLd
        questions={faq.items.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <main className="flex-1">
        {/* № 01 : héros. Les deux points de départ, les deux prix. */}
        <Hero />

        {/* Preuve immédiate, juste sous le héros : chaque chiffre est
            vérifiable au clic. */}
        <ProofStrip documented={documented} sansEspaceClient />

        {/* № 02 : les deux prestations, une carte par situation. */}
        <BlueprintSection tone="obsidian" id="prestations">
          <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
            <SectionHeading
              index="№ 02"
              kicker="Deux points de départ"
              title={
                <>
                  Deux <span className="text-accent-secondary">prestations</span>
                </>
              }
            />
          </div>
          <CartesOffres as="h3" />
        </BlueprintSection>
        <Separator />

        {/* № 03 : ce que ça donne. Trois refontes, dans l'ordre de
            REALISATIONS_HOME (lib/prestations-web.ts). */}
        <RealisationsSelection
          slugs={REALISATIONS_HOME}
          locale={locale}
          index="№ 03"
          kicker="Études de cas"
          titre={{ bleu: "Des projets livrés,", encre: "des résultats chiffrés." }}
        />
        <Separator />

        {/* № 04 : témoignages clients. */}
        <HomeTestimonials index="№ 04" />

        {/* № 05 : la vitesse se prouve par la mesure en direct de cette page. */}
        <HomePerf index="№ 05" />
        <Separator />

        {/* № 06 : le studio (présence humaine). */}
        <HomeStudio index="№ 06" />
        <Separator />

        {/* « L'essentiel » (TL;DR citable par les IA), juste avant la FAQ
            (ADR-024), puis la FAQ (même source que le schéma FAQPage). */}
        <HomeTldr />
        <HomeFaq />
        <Separator />

        {/* Appel final : l'échange gratuit pour qui hésite, l'analyse du site
            pour qui en a déjà un (deux températures). */}
        <AppelFinal
          titre="Vous hésitez entre les deux ?"
          primary={{ label: "Échange gratuit de 15 minutes", href: RDV_HREF, external: true }}
          secondary={{ label: "Analyser mon site", href: SCAN_HREF, plain: true }}
        />
      </main>
    </>
  );
}
