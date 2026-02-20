import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import ServicesClient from "@/components/services/ServicesClient"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Services & Tarifs WordPress Headless — Forfaits transparents",
    description:
      "Services de création de site WordPress Headless avec tarification solidaire basée sur la péréquation. " +
      "Offre Solidaire dès 2 250 €, Équilibre à 4 000 €, Soutien à partir de 5 000 €.",
    path: "/services",
    keywords: [
      "services WordPress Headless",
      "tarifs WordPress Headless",
      "prix site web",
      "tarification solidaire",
      "péréquation",
      "ESS",
      "Next.js",
      "association",
    ],
  })
}

// Revalidate toutes les 24 heures
export const revalidate = 86400

export default function ServicesPage() {
  const faqs = [
    {
      question: "Est-ce que je pourrai toujours modifier mes textes ?",
      answer:
        "Oui, pour les 3 solutions. Vous conservez l'interface WordPress que vous connaissez pour gérer tous vos contenus, images et pages. Aucune compétence technique n'est requise.",
    },
    {
      question: "Le Headless est-il plus cher à maintenir ?",
      answer:
        "Légèrement, car il y a deux systèmes à maintenir (WordPress + front-end). Cependant, la sécurité renforcée et les performances accrues réduisent souvent les coûts d'intervention d'urgence et de perte de trafic.",
    },
    {
      question: "Combien de temps prend la mise en place ?",
      answer:
        "Comptez 2-4 semaines pour un site WordPress classique, 4-6 semaines pour une solution Astro, et 6-10 semaines pour une architecture Next.js complète, selon la complexité du projet.",
    },
    {
      question: "Mes plugins WordPress fonctionneront-ils encore ?",
      answer:
        "Les plugins front-end (sliders, formulaires affichés) sont remplacés par des équivalents plus performants. Les plugins back-end (SEO, analytics, sécurité) continuent de fonctionner normalement.",
    },
  ]

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Services & Tarifs", url: "/services" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="Services de création de site web WordPress Headless"
        description="Services de création de site WordPress, Astro et Next.js avec tarification solidaire. Solutions adaptées aux PME, entreprises, associations et startups."
        serviceType="Développement web"
        url="/services"
      />
      <FAQJsonLd
        questions={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <ServicesClient />
    </main>
  )
}
