"use client"

import PageHero from "@/components/page-hero"
import SolutionsOffers from "@/components/solutions/SolutionsOffers"
import { SolutionsComparisonTable } from "@/components/solutions/SolutionsComparisonTable"
import SolutionsGuide from "@/components/solutions/SolutionsGuide"
import Process from "@/components/process"
import SolutionsFAQ from "@/components/solutions/SolutionsFAQ"
import { ArrowRight, CheckCircle2, ChevronDown, Zap, Shield, Users, TrendingUp, Rocket, Smartphone, Monitor, Code, Settings, FileSearch, GraduationCap } from "lucide-react"


export default function SolutionsPage() {

  const offers = [
    {
      name: "ESSENTIEL",
      tech: "WordPress Standard",
      target: "Pour les TPE/PME et créateurs",
      concept: "Un site robuste avec une autonomie totale.",
      icon: "/icons/wordpress-icon.svg",
      color: "#719ED9",
      features: ["Budget maîtrisé", "Mise en ligne rapide", "Évolutif via plugins", "Formation incluse"],
      recommended: false,
    },
    {
      name: "PREMIUM",
      tech: "WordPress + Astro",
      target: "Enjeux d'image, de SEO et de performance",
      concept: "La puissance des technologies modernes.",
      icon: "/icons/speed-icon.svg",
      color: "#FF6B6B",
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
      color: "#719ED9",
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

                  <div className="min-h-screen font-googletexte text-foreground">
                    <PageHero
                      badge="Solutions web sur-mesure"
                      titre1="Des sites web puissants"
                      titre2="adaptés à vos ambitions"
                      sousTitre="Du site vitrine administrable à l'application web haute performance, nous choisissons l'architecture qui sert vos objectifs de croissance."
                      cta1Text="Démo"
                      cta1Link="/demo"
                      cta2Text="Contact"
                      cta2Link="https://calendar.app.google/HuwRpoVGoKBj2PkX8"
                      illustration="/illustrations/tech-ecosystem.svg"
                    />
                    <SolutionsOffers offers={offers} />
                    <SolutionsComparisonTable />
                    <SolutionsGuide needsGuide={needsGuide} />
                    <Process />
                    <SolutionsFAQ faqs={faqs} />
                  </div>

    </main>
)}
                                     