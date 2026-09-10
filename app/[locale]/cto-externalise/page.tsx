import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import CtoExternalisePage from "@/components/cto-externalise/cto-externalise-page";
import {
  CTO_FAQ,
  CTO_PRICE,
  CTO_COMMITMENT,
  CTO_PATH,
  CTO_PRICE_VALUE,
  CTO_PRICE_CURRENCY,
  CTO_BILLING_UNIT_CODE,
} from "@/lib/cto-externalise";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return generatePageMetadata({
    title: isEn
      ? "Outsourced technical expert: your technical direction without hiring"
      : "Expert technique externalisé : votre direction technique sans embaucher",
    // Descriptions calibrées pour l'affichage SERP (≤ 160 caractères) : la
    // version longue précédente était tronquée avant l'engagement, qui est
    // l'objection n° 1 sur une offre récurrente.
    description: isEn
      ? "Shared-time technical direction, from €900 excl. VAT a month: monthly steering, quotes reviewed, roadmap kept current. No hiring, six-month commitment."
      : "Direction technique à temps partagé, dès 900 € HT par mois : pilotage mensuel, devis relus, roadmap tenue à jour. Sans embaucher, engagement 6 mois.",
    path: CTO_PATH,
    keywords: isEn
      ? [
          "outsourced technical expert",
          "outsourced technical director",
          "part-time technical director",
          "fractional technical leadership",
          "technical direction retainer",
          "technical advisor retainer",
          "outsourced technical expert for SMEs",
          "vendor quote review",
        ]
      : [
          "expert technique externalisé",
          "directeur technique externalisé",
          "expert technique à temps partagé",
          "direction technique externalisée",
          "expert technique à temps partiel",
          "expert technique externalisé PME",
          "accompagnement technique mensuel",
          "relecture de devis technique",
        ],
    locale,
  });
}

export default async function CtoExternaliseRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const lang = isEn ? "en" : "fr";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Outsourced technical expert" : "Expert technique externalisé", url: CTO_PATH },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      {/* Schéma aligné sur le visible : prix et engagement affichés sur la page. */}
      <ServiceJsonLd
        name={isEn ? "Outsourced technical expert" : "Expert technique externalisé"}
        description={
          isEn
            ? `Shared-time technical direction for organisations with no technical profile in-house: one monthly steering call, ongoing arbitration, vendor quote review, a living roadmap and a watch targeted on your systems. ${CTO_PRICE.en.amount} ${CTO_PRICE.en.period}. ${CTO_COMMITMENT.en}.`
            : `Direction technique à temps partagé pour les structures sans profil technique interne : une visio de pilotage par mois, des arbitrages en continu, la relecture de vos devis, une roadmap tenue à jour et une veille ciblée sur votre parc. ${CTO_PRICE.fr.amount} ${CTO_PRICE.fr.period}. ${CTO_COMMITMENT.fr}.`
        }
        serviceType={isEn ? "Fractional technical direction" : "Direction technique à temps partagé"}
        url={CTO_PATH}
        locale={locale}
        // Prix récurrent réellement affiché en § 04 : plancher mensuel, donc
        // minPrice + unité de facturation « MON ». Valeurs importées de la
        // source de vérité, jamais réécrites ici.
        offer={{
          minPrice: CTO_PRICE_VALUE,
          priceCurrency: CTO_PRICE_CURRENCY,
          billingUnitCode: CTO_BILLING_UNIT_CODE,
        }}
      />
      <FAQJsonLd
        questions={CTO_FAQ.map((item) => ({
          question: item[lang].q,
          answer: item[lang].a,
        }))}
      />
      <CtoExternalisePage />
    </>
  );
}
