import { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, FAQJsonLd } from "@/components/json-ld"

import ServicesOffers from "@/components/services/ServicesOffers"
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable"
import ServicesGuide from "@/components/services/ServicesGuide"
import Process from "@/components/process"
import ServicesFAQ from "@/components/services/ServicesFAQ"
import { ArrowRight, CheckCircle2, ChevronDown, Zap, Shield, Users, TrendingUp, Rocket, Smartphone, Monitor, Code, Settings, FileSearch, GraduationCap } from "lucide-react"
import PageLayout from "@/components/page-layout"

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.services()
}

// Revalidate toutes les 24 heures
export const revalidate = 86400

export default function ServicesPage() {

  const offers = [
    {
      name: "ESSENTIEL",
      tech: "WordPress Standard",
      target: "Pour les TPE/PME et créateurs",
      concept: "Un site robuste avec une autonomie totale.",
      icon: "/icons/wordpress-icon.svg",
      color: "oklch(87.9% 0.169 91.605)",
      features: ["Budget maîtrisé", "Mise en ligne rapide", "Évolutif via plugins", "Formation incluse"],
      recommended: false,
    },
    {
      name: "PREMIUM",
      tech: "WordPress + Astro",
      target: "Enjeux d'image, de SEO et de performance",
      concept: "La puissance des technologies modernes.",
      icon: "/icons/speed-icon.svg",
      color: "#F2E57E",
      features: [
        "Flexibilité totale du design",
        "Score PageSpeed maximum",
        "Sécurité maximale (statique)",
        "SEO optimisé nativement",
      ],
      recommended: true,
    },
    {
      name: "ULTIMATE",
      tech: "WordPress + Next.js",
      target: "Pour des fonctionnalités spécifiques",
      concept: "L'expérience utilisateur fluide d'une application.",
      icon: "/icons/saas-features-icon.svg",
      color: "oklch(87.9% 0.169 91.605)",
      features: [
        "Interactions dynamiques",
        "Espace client complexe",
        "Flexibilité totale du design",
        "Intégrations API illimitées",
      ],
      recommended: false,
    },
  ]


  const needsGuide = [
    {
      need: "Je veux changer mes menus et mon design seul",
      solution: "WordPress Classique",
      icon: Monitor,
    },
    {
      need: "Mon site actuel est trop lent et daté",
      solution: "Astro + Headless",
      icon: TrendingUp,
    },
    {
      need: "Je veux un portail client avec des services en ligne",
      solution: "Next.js + Headless",
      icon: Smartphone,
    },
  ]


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

  return (
    <main>
      <ServiceJsonLd
        name="Services de création de site web WordPress Headless"
        description="Services de création de site WordPress, Astro et Next.js. Solutions adaptées aux PME, entreprises et startups avec des besoins spécifiques de performance et de fonctionnalités."
        serviceType="Développement web"
        url="/services"
      />
      <FAQJsonLd
        questions={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <PageLayout
        titre="Nos services WordPress"
        sousTitre="Choisissez la solution adaptée à vos besoins et à votre budget."
      >
                  <div className="mt-8 mb-6 space-y-24">
                    <ServicesOffers offers={offers} />
                    <ServicesComparisonTable />
                    <ServicesGuide needsGuide={needsGuide} />
                    <Process />
                    <ServicesFAQ faqs={faqs} />
                  </div>
      </PageLayout>
    </main>
  )
}