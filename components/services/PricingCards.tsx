import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingCards() {
  return (
    <section className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Présence Essentielle — WordPress monolithique optimisé */}
          <div className="flex flex-col border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg duration-300">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/brand-reach-icon.svg" alt="Présence Essentielle" width={32} height={32} className="shrink-0" />
                <h3 className="text-2xl font-googletitre font-semibold text-coral">
                  PRÉSENCE ESSENTIELLE
                </h3>
              </div>
              <p className="text-base text-white/60 font-googletexte italic mb-4">
                WordPress monolithique optimisé
              </p>
              <p className="text-4xl font-googletitre font-medium text-white mb-1">
                Depuis 2 250 <span className="text-2xl text-white/60">€</span>
              </p>
              <p className="text-sm text-white/40 font-googletexte">
                Mise en ligne rapide, coût maîtrisé
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Pour quel projet ?
                </p>
                <p className="text-white/80 font-googletexte leading-relaxed">
                  Site vitrine, site institutionnel ou refonte rapide d&apos;un WordPress vieillissant.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Stack technique
                </p>
                <p className="text-white/80 font-googletexte leading-relaxed">
                  WordPress monolithique avec <strong className="text-lightyellow">thème custom moderne</strong>, build optimisé, sécurité durcie.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Ce qui est inclus
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <Image src="/icons/frontend-icon.svg" alt="Design" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Design moderne et responsive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/code-icon.svg" alt="Pages" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">5 pages clés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/content-icon.svg" alt="Formation" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Formation à l&apos;admin WordPress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/shield-icon.svg" alt="Sécurité" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Sécurité durcie</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/contact" className="mt-8">
              <Button className="w-full h-12 font-bold font-googletitre text-base md:text-lg rounded-full bg-coral text-darkblue transition-all duration-300">
                Choisir cette stack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Croissance Accélérée — WordPress + Astro */}
          <div className="flex flex-col border-2 border-lightyellow/30 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg duration-300 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-lightyellow text-darkblue text-sm font-googletitre font-semibold px-4 py-1 rounded-full">
                Le plus demandé
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/scale-icon.svg" alt="Croissance Accélérée" width={32} height={32} className="shrink-0" />
                <h3 className="text-2xl font-googletitre font-semibold text-lightyellow">
                  CROISSANCE ACCÉLÉRÉE
                </h3>
              </div>
              <p className="text-base text-white/60 font-googletexte italic mb-4">
                WordPress headless + Astro
              </p>
              <p className="text-4xl font-googletitre font-medium text-white mb-1">
                Depuis 4 000 <span className="text-2xl text-white/60">€</span>
              </p>
              <p className="text-sm text-white/40 font-googletexte">
                Performance front, conversion optimisée
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Pour quel projet ?
                </p>
                <p className="text-white/80 font-googletexte leading-relaxed">
                  Site à fort enjeu SEO, blog éditorial, marque ou produit dont la performance front est un levier de conversion.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Stack technique
                </p>
                <p className="text-white/80 font-googletexte leading-relaxed">
                  WordPress headless en backend + <strong className="text-lightyellow">Astro</strong> en frontend (SSG, hydratation partielle).
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
                Choisir cette stack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Plateforme Sur-Mesure — WordPress + Next.js */}
          <div className="flex flex-col border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-lg duration-300">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/rocket-icon.svg" alt="Plateforme Sur-Mesure" width={32} height={32} className="shrink-0" />
                <h3 className="text-2xl font-googletitre font-semibold text-extralightblue">
                  PLATEFORME SUR-MESURE
                </h3>
              </div>
              <p className="text-base text-white/60 font-googletexte italic mb-4">
                WordPress headless + Next.js
              </p>
              <p className="text-4xl font-googletitre font-medium text-white mb-1">
                Depuis 5 000 <span className="text-2xl text-white/60">€</span>
              </p>
              <p className="text-sm text-white/40 font-googletexte">
                Architecture évolutive, ISR/SSR, multisites
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Pour quel projet ?
                </p>
                <p className="text-white/80 font-googletexte leading-relaxed">
                  Plateforme à forte volumétrie, multisites, intégrations API tierces, applications métier ou portails clients.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-2">
                  Stack technique
                </p>
                <p className="text-white/80 font-googletexte leading-relaxed">
                  WordPress headless + <strong className="text-lightblue">Next.js App Router</strong> (SSG, ISR, SSR), TypeScript, CI/CD complet.
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
                    <span className="text-white/80 font-googletexte text-sm">Performances critiques (ISR/SSR)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/shield-icon.svg" alt="Sécurité" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Sécurité renforcée par découplage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/settings-icon.svg" alt="Support" width={16} height={16} className="mt-1 shrink-0" />
                    <span className="text-white/80 font-googletexte text-sm">Support prioritaire 12 mois</span>
                  </li>
                </ul>
              </div>

              <div className="border border-lightblue/20 rounded-xl p-4 bg-lightblue/5">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/icons/analytics-icon.svg" alt="OETH" width={16} height={16} className="shrink-0" />
                  <span className="text-sm font-googletitre font-medium text-lightblue">
                    Avantage fiscal OETH
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
              <Button className="w-full h-12 font-bold font-googletitre text-base md:text-lg rounded-full bg-regularblue text-white transition-all duration-300">
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
