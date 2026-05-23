import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import CaseStudiesClient from "@/components/case-studies/CaseStudiesClient";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata.caseStudies(locale);
}

const caseStudyItems = [
  { name: "Séjours à L'Hermitage", url: "https://sejours.hermitagelelab.com/", description: "Landing de séjours dans un Tiers Lieu rural" },
  { name: "Mariage Nicolas & Cécile", url: "https://www.nicocecile23mai2026.fr/", description: "Landing de mariage Nicolas et Cécile" },
  { name: "Mariage Agathe & Alain", url: "https://www.mariage-agathe-et-alain.fun/", description: "Landing de mariage Agathe et Alain" },
  { name: "Artisan Coiffeur", url: "https://artisan-coiffeur.lapetitevitrine.com/", description: "Landing artisan coiffeur — La Petite Vitrine" },
  { name: "Café citoyen", url: "/etudes-de-cas/cafe-citoyen", description: "Site vitrine du Café citoyen" },
  { name: "Comme des fous - Jeux en ligne", url: "/etudes-de-cas/comme-des-fous-jeux", description: "Jeux en ligne du média participatif Comme des fous" },
  { name: "Comme des fous", url: "/etudes-de-cas/comme-des-fous", description: "Site du média participatif Comme des fous" },
  { name: "Next Event", url: "/etudes-de-cas/next-event", description: "Billetterie événementielle WordPress Headless" },
  { name: "Les États Généraux Communaux", url: "/etudes-de-cas/les-etats-generaux-communaux", description: "Site vitrine des États Généraux Communaux" },
  { name: "Les Doléances", url: "/etudes-de-cas/doleances", description: "Vitrine des Doléances citoyennes" },
  { name: "Panorama Pub", url: "/etudes-de-cas/panorama-pub", description: "Premier annuaire en ligne des fournisseurs d'objets publicitaires" },
  { name: "Proditec", url: "/etudes-de-cas/proditec", description: "Site corporate multilingue" },
  { name: "Sowee", url: "/etudes-de-cas/sowee", description: "Section blog de Sowee" },
  { name: "Infralliance", url: "/etudes-de-cas/infralliance", description: "Site vitrine d'Infralliance" },
  { name: "SDEVO", url: "/etudes-de-cas/sdevo", description: "Plugin de gestion des subventions" },
  { name: "Salon de la Carrosserie", url: "/etudes-de-cas/salon-de-la-carrosserie", description: "Site vitrine du Salon de la Carrosserie 2024" },
  { name: "Tiers Lieu L'Hermitage", url: "/etudes-de-cas/hermitage", description: "Site vitrine du Tiers Lieu L'Hermitage" },
  { name: "ERP Services", url: "/etudes-de-cas/erp-services", description: "Site vitrine d'ERP Services" },
  { name: "Wagner Hamisky", url: "/etudes-de-cas/wagner-hamisky", description: "Site vitrine de la galerie Wagner Hamisky" },
  { name: "Mediatico", url: "/etudes-de-cas/mediatico", description: "Site vitrine de Mediatico" },
];

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbCaseStudies"), url: "/etudes-de-cas" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={t("collectionName")}
        description={t("collectionDescription")}
        url="/etudes-de-cas"
        items={caseStudyItems}
      />
      <main>
        <CaseStudiesClient />
      </main>
    </>
  );
}
