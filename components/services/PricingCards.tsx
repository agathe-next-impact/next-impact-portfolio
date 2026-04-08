import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingCards() {
  return (
    <section className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Offre Solidaire */}
          <div className="flex flex-col border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg duration-300">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/brand-reach-icon.svg" alt="Solidaire" width={32} height={32} className="shrink-0" />
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
                    <Image src="/icons/frontend-icon.svg" alt="Design" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Design éco-conçu (base)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/code-icon.svg" alt="Code" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">5 pages clés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/content-icon.svg" alt="Formation" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Formation autonomie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/shield-icon.svg" alt="Sécurité" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Sécurité maximale</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/contact" className="mt-8">
              <Button className="w-full h-12 font-bold font-googletitre text-base md:text-lg rounded-full bg-coral text-darkblue transition-all duration-300">
                Déterminer mon offre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Offre Équilibre */}
          <div className="flex flex-col border-2 border-lightyellow/30 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg duration-300 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-lightyellow text-darkblue text-sm font-googletitre font-semibold px-4 py-1 rounded-full">
                Recommandé ESS
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/scale-icon.svg" alt="Équilibre" width={32} height={32} className="shrink-0" />
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
                    <Image src="/icons/frontend-icon.svg" alt="Design" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Design personnalisé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/seo-icon.svg" alt="SEO" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Stratégie SEO avancée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/database-icon.svg" alt="Migration" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Migration de données</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/speed-icon.svg" alt="Accompagnement" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Accompagnement stratégique</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/contact" className="mt-8">
              <Button className="w-full h-12 font-bold font-googletitre text-base rounded-full bg-lightyellow hover:bg-lightyellow/90 text-darkblue">
                Déterminer mon offre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Offre Soutien */}
          <div className="flex flex-col border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-lg duration-300">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/rocket-icon.svg" alt="Soutien" width={32} height={32} className="shrink-0" />
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
                    <Image src="/icons/frontend-icon.svg" alt="UI/UX" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">UI/UX sur-mesure totale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/speed-icon.svg" alt="Performances" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Performances critiques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/shield-icon.svg" alt="Sécurité" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Sécurité renforcée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/settings-icon.svg" alt="Support" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Support prioritaire</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Impact social
                </p>
                <div className="flex items-start gap-3">
                  <Image src="/icons/rocket-icon.svg" alt="Impact" width={16} height={16} className="mt-0.5 shrink-0" />
                  <p className="text-white/70 font-googletexte text-sm leading-relaxed">
                    <strong className="text-lightblue">Financeur</strong> : cette offre subventionne directement 40% d&apos;un projet solidaire.
                  </p>
                </div>
              </div>

              <div className="border border-lightblue/20 rounded-xl p-4 bg-lightblue/5">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/icons/analytics-icon.svg" alt="OETH" width={16} height={16} className="shrink-0" />
                  <span className="text-sm font-googletitre font-medium text-lightblue">
                    Avantage OETH
                  </span>
                </div>
                <p className="text-white/70 font-googletexte text-sm leading-relaxed mb-2">
                  Prestataire TIH : 30% du coût de main-d&apos;œuvre déductible de votre contribution AGEFIPH.
                </p>
                <Link href="/avantage-oeth" className="inline-flex items-center gap-1 text-sm text-lightblue font-googletexte hover:underline">
                  Simuler mon économie
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <Link href="https://calendar.app.google/RwZqaabSR5aDMnk46" className="mt-8" target="_blank" rel="noopener noreferrer">
              <Button className="w-full h-12 font-bold font-googletitre text-base md:text-lg rounded-full bg-regularblue text-darkblue transition-all duration-300">
                Discuter de mon projet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
