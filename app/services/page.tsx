import { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable"
import Process from "@/components/process"
import ServicesFAQ from "@/components/services/ServicesFAQ"
import {
  ArrowRight,
  Heart,
  Scale,
  Rocket,
  Palette,
  Code,
  BookOpen,
  Shield,
  Search,
  Database,
  Zap,
  Headphones,
  Award,
  ClipboardCheck,
  Play,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PageLayout from "@/components/page-layout"

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.services()
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
    { name: "Services", url: "/services" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
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
        sousTitre="Notre tarification solidaire est basée sur la péréquation : la réussite des projets « Business » finance l'accessibilité numérique du secteur associatif."
      >
        <div className="mt-8 mb-6 space-y-24">



          {/* Section 3 Packs Tarifs */}
          <section className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Offre Solidaire */}
                <div className="flex flex-col border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="h-8 w-8 text-coral shrink-0" />
                      <h3 className="text-2xl font-googletitre font-semibold text-coral">
                        OFFRE SOLIDAIRE
                      </h3>
                    </div>
                    <p className="text-base text-white/60 font-googletexte italic mb-4">
                      Le boost de lancement
                    </p>
                    <p className="text-4xl font-googletitre font-medium text-white mb-1">
                      Depuis 2 250 <span className="text-2xl text-white/60">€</span>
                    </p>
                    <p className="text-sm text-white/40 font-googletexte">
                      TJM réduit : 350 €
                    </p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Pour qui ?
                      </p>
                      <p className="text-white/80 font-googletexte leading-relaxed">
                        Petites assos (budget &lt; 100k€), projets d&apos;utilité sociale en démarrage.
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Technologie
                      </p>
                      <p className="text-white/80 font-googletexte leading-relaxed">
                        WordPress Headless via <strong className="text-lightyellow">Starter Kit Next.js</strong> (optimisé pour le coût).
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Ce qui est inclus
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <Palette className="h-4 w-4 text-coral mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Design éco-conçu (base)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Code className="h-4 w-4 text-coral mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">5 pages clés</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <BookOpen className="h-4 w-4 text-coral mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Formation autonomie</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Shield className="h-4 w-4 text-coral mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Sécurité maximale</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Link href="/tarifs/eligibilite" className="mt-8">
                    <Button className="w-full h-12 font-bold font-googletitre text-base rounded-full shadow bg-coral hover:bg-coral/90 text-white">
                      Vérifier mon éligibilité
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Offre Équilibre */}
                <div className="flex flex-col border-2 border-lightyellow/30 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:shadow-lg transition-shadow duration-300 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-lightyellow text-darkblue text-sm font-googletitre font-semibold px-4 py-1 rounded-full">
                      Recommandé ESS
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Scale className="h-8 w-8 text-lightyellow shrink-0" />
                      <h3 className="text-2xl font-googletitre font-semibold text-lightyellow">
                        OFFRE ÉQUILIBRE
                      </h3>
                    </div>
                    <p className="text-base text-white/60 font-googletexte italic mb-4">
                      La performance durable
                    </p>
                    <p className="text-4xl font-googletitre font-medium text-white mb-1">
                      Depuis 4 000 <span className="text-2xl text-white/60">€</span>
                    </p>
                    <p className="text-sm text-white/40 font-googletexte">
                      TJM pivot : 450 €
                    </p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Pour qui ?
                      </p>
                      <p className="text-white/80 font-googletexte leading-relaxed">
                        SCOP, SCIC, assos employeuses, fondations à budget moyen.
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Technologie
                      </p>
                      <p className="text-white/80 font-googletexte leading-relaxed">
                        WordPress Headless <strong className="text-lightyellow">sur-mesure</strong> (Astro ou Next.js).
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Ce qui est inclus
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <Palette className="h-4 w-4 text-lightyellow mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Design personnalisé</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Search className="h-4 w-4 text-lightyellow mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Stratégie SEO avancée</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Database className="h-4 w-4 text-lightyellow mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Migration de données</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Zap className="h-4 w-4 text-lightyellow mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Accompagnement stratégique</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Link href="/tarifs/eligibilite" className="mt-8">
                    <Button className="w-full h-12 font-bold font-googletitre text-base rounded-full shadow bg-lightyellow hover:bg-lightyellow/90 text-darkblue">
                      Vérifier mon éligibilité
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Offre Soutien */}
                <div className="flex flex-col border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="h-8 w-8 text-lightblue shrink-0" />
                      <h3 className="text-2xl font-googletitre font-semibold text-extralightblue">
                        OFFRE SOUTIEN
                      </h3>
                    </div>
                    <p className="text-base text-white/60 font-googletexte italic mb-4">
                      L&apos;excellence engagée
                    </p>
                    <p className="text-4xl font-googletitre font-medium text-white mb-1">
                      Depuis 5 000 <span className="text-2xl text-white/60">€</span>
                    </p>
                    <p className="text-sm text-white/40 font-googletexte">
                      TJM corporate : 650 €
                    </p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Pour qui ?
                      </p>
                      <p className="text-white/80 font-googletexte leading-relaxed">
                        PME, grands comptes, structures ESS à fort CA (&gt; 500k€).
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Technologie
                      </p>
                      <p className="text-white/80 font-googletexte leading-relaxed">
                        Architecture Headless <strong className="text-lightblue">complexe</strong>, multisites ou besoins API spécifiques.
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Ce qui est inclus
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <Palette className="h-4 w-4 text-lightblue mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">UI/UX sur-mesure totale</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Zap className="h-4 w-4 text-lightblue mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Performances critiques</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Shield className="h-4 w-4 text-lightblue mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Sécurité renforcée</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Headphones className="h-4 w-4 text-lightblue mt-1 shrink-0" />
                          <span className="text-white/80 font-googletexte text-sm">Support prioritaire</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                        Impact social
                      </p>
                      <div className="flex items-start gap-3">
                        <Award className="h-4 w-4 text-lightblue mt-0.5 shrink-0" />
                        <p className="text-white/70 font-googletexte text-sm leading-relaxed">
                          <strong className="text-lightblue">Financeur</strong> : cette offre subventionne directement 40% d&apos;un projet solidaire.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href="https://calendar.app.google/RwZqaabSR5aDMnk46" className="mt-8" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full h-12 font-bold font-googletitre text-base rounded-full shadow bg-regularblue hover:bg-regularblue/90 text-white">
                      Discuter de mon projet
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <ServicesComparisonTable />

          {/* Bandeau Audit / Démo / Comprendre */}
          <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Link href="/audit-site-ia" className="group">
                <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-coral/40 transition-all duration-300">
                  <ClipboardCheck className="h-12 w-12 text-coral mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-googletitre font-semibold text-white mb-2">Audit</h3>
                  <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                    Évaluez votre présence numérique et identifiez les axes d&apos;amélioration.
                  </p>
                </div>
              </Link>

              <Link href="/demo" className="group">
                <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-lightyellow/40 transition-all duration-300">
                  <Play className="h-12 w-12 text-lightyellow mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-googletitre font-semibold text-white mb-2">Démo</h3>
                  <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                    Découvrez en live la puissance du WordPress Headless sur votre projet.
                  </p>
                </div>
              </Link>

              <Link href="/tarifs/eligibilite" className="group">
                <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-lightblue/40 transition-all duration-300">
                  <Lightbulb className="h-12 w-12 text-lightblue mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-googletitre font-semibold text-white mb-2">Tarif</h3>
                  <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                    Estimez et comprenez notre modèle de tarification solidaire.
                  </p>
                </div>
              </Link>
            </div>
          </section>

          <Process />
          <ServicesFAQ faqs={faqs} />
        </div>
      </PageLayout>
    </main>
  )
}
