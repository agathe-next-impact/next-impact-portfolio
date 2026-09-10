import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import VisioConseilPage from "@/components/visio-conseil/visio-conseil-page";
import { FAQ, OFFERS } from "@/lib/visio-conseil";
import {
  CTO_BILLING_UNIT_CODE,
  CTO_PATH,
  CTO_PRICE_CURRENCY,
} from "@/lib/cto-externalise";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

// Métadonnées alignées sur le contenu réel depuis l'ADR-009 : la page présente
// TROIS offres de conseil (§ 04 visio 150 €, § 05 audit + roadmap 650 €, § 06
// Expert technique externalisé), et non plus deux.
//
// Anti-cannibalisation assumée : le titre, la description et les mots-clés
// restent sur l'intention PONCTUELLE (« conseil refonte », « audit »), qui est
// celle de cette page. Les requêtes récurrentes (« expert technique externalisé »,
// « directeur technique externalisé ») appartiennent à /cto-externalise, page
// canonique de l'offre : aucun de ses mots-clés n'est repris ici, et la
// troisième section n'est évoquée que par son bénéfice (« direction technique
// au mois »). Même raison pour le prix de l'expert technique, absent des
// métadonnées : il ne s'écrit qu'à partir de lib/cto-externalise.ts.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return generatePageMetadata({
    title: isEn
      ? "Redesign advice: a clear-cut opinion before you commit a budget"
      : "Conseil refonte : un avis tranché avant d'engager un budget",
    description: isEn
      ? "Your WordPress site is aging? A €150 advisory call, a €650 audit with roadmap, or monthly technical direction: settle the trajectory before you commit a budget."
      : "Votre site WordPress vieillit ? Visio conseil 150 € HT, audit + roadmap 650 € HT ou direction technique au mois : trancher la trajectoire avant d'engager un budget.",
    path: "/conseil",
    keywords: isEn
      ? [
          "WordPress redesign advice",
          "redesign advisory call",
          "website audit and roadmap",
          "WordPress site audit",
          "redesign or optimize WordPress",
          "challenge agency quote",
          "website second opinion",
          "independent advice before a redesign",
          "one-off or ongoing technical advice",
        ]
      : [
          "conseil refonte WordPress",
          "visio conseil refonte",
          "audit site WordPress",
          "audit et roadmap site web",
          "refondre ou optimiser WordPress",
          "challenger devis agence",
          "deuxième avis site web",
          "avis technique avant refonte",
          "conseil technique ponctuel ou récurrent",
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
  // (`pricePrefix`, « à partir de ») devient un `minPrice` ; l'offre récurrente
  // porte en plus son unité de facturation (« MON »).
  //
  // Son `url` pointe vers /cto-externalise et NON vers l'ancre § 06 : la fiche
  // canonique de l'offre vit là-bas, et le nœud d'ici s'y rattache au lieu de
  // la dupliquer (ADR-009 : /conseil présente, /cto-externalise vend).
  const catalogItems = OFFERS.map((offer) => {
    const copy = isEn ? offer.en : offer.fr;
    const tier = offer.tiers[0];
    return {
      name: copy.name,
      description: copy.tagline,
      url: offer.recurring ? CTO_PATH : `/conseil#${offer.id}`,
      ...(tier.pricePrefix ? { minPrice: tier.value } : { price: tier.value }),
      ...(offer.recurring
        ? {
            priceCurrency: CTO_PRICE_CURRENCY,
            billingUnitCode: CTO_BILLING_UNIT_CODE,
          }
        : {}),
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
            ? "Independent advice before a redesign, in three formats: a one-hour advisory call with a written opinion, a full audit with costed recommendations and a roadmap, and shared-time technical direction when the decisions come back every month."
            : "Conseil indépendant avant une refonte, en trois formats : une visio d'une heure avec avis écrit, un audit complet avec préconisations chiffrées et roadmap, et une direction technique à temps partagé quand les décisions reviennent tous les mois."
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
