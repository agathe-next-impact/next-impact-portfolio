import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import ServicesClient from "@/components/services/ServicesClient"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Services & Tarifs WordPress Headless — Trois stacks, trois résultats",
    description:
      "Trois niveaux de modernisation WordPress : Présence Essentielle (monolithique optimisé) dès 2 250 €, " +
      "Croissance Accélérée (Astro headless) dès 4 000 €, Plateforme Sur-Mesure (Next.js) dès 5 000 €.",
    path: "/services",
    keywords: [
      "services WordPress Headless",
      "tarifs WordPress Headless",
      "prix site web",
      "WordPress monolithique optimisé",
      "WordPress Astro",
      "WordPress Next.js",
      "modernisation WordPress",
      "stack WordPress",
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
        description="Trois stacks WordPress : monolithique optimisé, hybride Astro et Next.js complet. Solutions adaptées aux PME, entreprises et organisations à fort enjeu web."
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
