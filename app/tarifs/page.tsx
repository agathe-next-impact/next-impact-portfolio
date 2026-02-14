import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import {
  CheckCircle,
  FileText,
  Building2,
  Heart,
  ArrowRight,
  Rocket,
  BadgeCheck,
  Scale,
  Code,
  Palette,
  BookOpen,
  Shield,
  Search,
  Database,
  Headphones,
  Zap,
  Leaf,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TarifsESSCarousel from "@/components/tarifs/TarifsESSCarousel";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Tarifs WordPress Headless & Next.js — Forfaits transparents",
    description:
      "Tarification solidaire basée sur la péréquation. Offre Solidaire dès 2 250 €, " +
      "Équilibre à 4 000 €, Soutien à partir de 5 000 €. WordPress Headless accessible à tous.",
    path: "/tarifs",
    keywords: [
      "tarifs WordPress Headless",
      "prix site web",
      "tarification solidaire",
      "péréquation",
      "ESS",
      "Next.js",
      "association",
    ],
  });
}

export const revalidate = 86400;

export default function TarifsPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Tarifs", url: "/tarifs" },
  ];

  return (
    <>
    <BreadcrumbJsonLd items={breadcrumbItems} />
    <PageLayout
      titre="Technologies au service de l'impact."
      sousTitre="Notre tarification solidaire est basée sur la péréquation : la réussite des projets « Business » finance l'accessibilité numérique du secteur associatif."
    >

      {/* Carousel ESS */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto mb-12">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            Pourquoi Next Impact ?
          </p>
        </div>
        <TarifsESSCarousel />
      </section>

      {/* Section Tarifs */}
      <section className="container mx-auto px-4 py-12 md:py-16">
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

      {/* Critères d'éligibilité & Transparence */}
      <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            Critères de sélection &amp; Transparence
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-4 text-center">
            Critères d&apos;éligibilité
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
              <FileText className="h-12 w-12 text-lightyellow mb-4" />
              <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                Justificatif financier
              </h3>
              <p className="text-white/70 font-googletexte leading-relaxed">
                Dernier compte de résultat ou budget prévisionnel certifié.
              </p>
            </div>

            <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
              <Building2 className="h-12 w-12 text-lightyellow mb-4" />
              <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                Preuve d&apos;impact
              </h3>
              <p className="text-white/70 font-googletexte leading-relaxed">
                Statuts de la structure (Loi 1901, agrément ESUS, Coopérative).
              </p>
            </div>

            <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
              <Leaf className="h-12 w-12 text-lightyellow mb-4" />
              <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                Engagement
              </h3>
              <p className="text-white/70 font-googletexte leading-relaxed">
                Signature de la charte de sobriété numérique de Next Impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quel impact sur votre budget ? */}
      <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            Quel impact sur votre budget ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Petite association */}
            <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-coral shrink-0" />
                <h3 className="text-xl font-googletitre font-medium text-white">
                  Si vous êtes une petite association
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed mb-4">
                Vous bénéficiez d&apos;un site performant et sécurisé à un tarif solidaire vous permettant de rivaliser avec les grands acteurs.
              </p>
              <p className="text-4xl font-googletitre font-medium text-coral text-center py-4">
               2 250 <span className="text-2xl text-white/60">€</span>
              </p>
            </div>

            {/* Entreprise Soutien */}
            <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-8 w-8 text-lightyellow shrink-0" />
                <h3 className="text-xl font-googletitre font-medium text-white">
                  Si vous êtes une entreprise « Soutien »
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed mb-4">
                En choisissant Next Impact, vous n&apos;achetez pas seulement un site WordPress Headless de haute volée ; vous financez directement la transition numérique d&apos;un acteur de l&apos;intérêt général.
              </p>
              <div className="bg-lightblue/10 border border-lightblue/20 rounded-xl p-4 text-center">
                <p className="text-lightyellow font-googletitre font-medium">
                  Mention « Mécène de la transition numérique » ajoutée à votre communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Final */}
      <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-6">
            Vérifiez votre tarif en 2 minutes
          </h2>
          <p className="text-lg text-white/70 font-googletexte mb-8">
            Répondez à quelques questions pour découvrir l&apos;offre adaptée à votre structure et les aides auxquelles vous avez droit.
          </p>
          <Link
            href="/tarifs/eligibilite"
          >
            <Button className="h-14 px-10 font-bold font-googletitre text-lg rounded-full shadow bg-coral hover:bg-coral/90 text-white">
              Tester mon éligibilité
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

    </PageLayout>
    </>
  );
}
