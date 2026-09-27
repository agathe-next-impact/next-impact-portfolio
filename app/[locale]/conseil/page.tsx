import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import VisioConseilPage from "@/components/visio-conseil/visio-conseil-page";
import { FAQ, OFFERS } from "@/lib/visio-conseil";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

// Métadonnées alignées sur le contenu réel depuis l'ADR-013 (charte v1.5) : la
// page présente DEUX offres (§ 04 échange de 15 minutes gratuit, ADR-023, § 05 audit + roadmap
// 650 €). L'expert technique externalisé n'y est plus qu'un renvoi.
//
// Anti-cannibalisation : le titre, la description et les mots-clés restent sur
// l'intention PONCTUELLE (« conseil refonte », « audit »), qui est celle de
// cette page. Les requêtes récurrentes (« expert technique externalisé »,
// « directeur technique externalisé ») appartiennent à /cto-externalise, page
// canonique de l'offre : aucun de ses mots-clés n'est repris ici. La requête
// de SITUATION (« devis de refonte à juger », « second avis sur un devis »)
// appartient à la page de pack /packs/devis-a-juger (ADR-014) : les mots-clés
// de devis n'y sont pas repris non plus.
//
// Les deux prix sont lus dans lib/visio-conseil.ts, jamais réécrits ici.
const tierOf = (id: string) => OFFERS.find((offer) => offer.id === id)!.tiers[0];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const audit = tierOf("architecture-projet-ia");
  return generatePageMetadata({
    title: isEn
      ? "Redesign advice: a clear-cut opinion before you commit a budget"
      : "Conseil refonte : un avis tranché avant d'engager un budget",
    description: isEn
      ? `Your WordPress site is aging? A free 15-minute call to lay out the situation, then a ${audit.price.en} audit with its roadmap: settle the direction before you commit a budget.`
      : `Votre site WordPress vieillit ? Un échange gratuit de 15 minutes pour poser la situation, puis un audit + roadmap à ${audit.price.fr} HT : trancher la direction avant d'engager un budget.`,
    path: "/conseil",
    keywords: isEn
      ? [
          "WordPress redesign advice",
          "free website consultation",
          "website audit and roadmap",
          "WordPress site audit",
          "redesign or optimize WordPress",
          "website redesign consultation",
          "website second opinion",
          "independent advice before a redesign",
        ]
      : [
          "conseil refonte WordPress",
          "échange gratuit refonte site",
          "audit site WordPress",
          "audit et roadmap site web",
          "refondre ou optimiser WordPress",
          "conseil refonte gratuit",
          "deuxième avis site web",
          "avis technique avant refonte",
        ],
    locale,
  });
}

export default async function ConseilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Redesign advice" : "Conseil refonte", url: "/conseil" },
  ];

  // Catalogue d'offres dérivé d'OFFERS : le schéma ne peut pas diverger de ce
  // que la page affiche, prix compris. Une offre à plancher tarifaire
  // (`pricePrefix`, « à partir de ») devient un `minPrice`. L'expert technique
  // externalisé n'y figure plus (ADR-013) : son offre se déclare sur
  // /cto-externalise, sa page canonique.
  const catalogItems = OFFERS.map((offer) => {
    const copy = isEn ? offer.en : offer.fr;
    const tier = offer.tiers[0];
    return {
      name: copy.name,
      description: copy.tagline,
      url: `/conseil#${offer.id}`,
      ...(tier.pricePrefix ? { minPrice: tier.value } : { price: tier.value }),
    };
  });

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <ServiceJsonLd
        locale={locale}
        name={isEn ? "Website redesign advice" : "Conseil refonte de site web"}
        description={
          isEn
            ? "Independent advice before a redesign, in two formats: a free 15-minute call to lay out the situation, and a full audit with costed recommendations and a roadmap."
            : "Conseil indépendant avant une refonte, en deux formats : un échange gratuit de 15 minutes pour poser la situation, et un audit complet avec préconisations chiffrées et roadmap."
        }
        serviceType={isEn ? "Web consulting" : "Conseil web"}
        url="/conseil"
        offerCatalog={{
          name: isEn ? "Redesign advice" : "Conseil refonte",
          items: catalogItems,
        }}
      />
      <FAQJsonLd
        questions={FAQ.map((item) => ({
          question: isEn ? item.en.q : item.fr.q,
          answer: isEn ? item.en.a : item.fr.a,
        }))}
      />
      <VisioConseilPage />
    </>
  );
}
