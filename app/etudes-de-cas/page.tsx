import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import CaseStudiesClient from "@/components/case-studies/CaseStudiesClient";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.caseStudies();
}

const caseStudyItems = [
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

export default function CaseStudiesPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Études de cas", url: "/etudes-de-cas" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name="Études de cas WordPress Headless — Réalisations"
        description="Découvrez les projets réalisés : sites corporate, institutionnels, ESS, headless. Résultats concrets en performance, design et conversion."
        url="/etudes-de-cas"
        items={caseStudyItems}
      />
      <main>
        <CaseStudiesClient />
      </main>
    </>
  );
}
