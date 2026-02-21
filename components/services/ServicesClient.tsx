"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  Play,
  Lightbulb,
  FileText,
  Building2,
  Leaf,
  Heart,
  Award,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PricingCards } from "@/components/services/PricingCards";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import TarifsESSCarousel from "@/components/tarifs/TarifsESSCarousel";
import PageLayout from "@/components/page-layout";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { SERVICES_PAGE_VARIANTS } from "@/lib/homepage-profiles";

export default function ServicesClient() {
  const { profileId } = useDocumentationMode();
  const variant = profileId
    ? SERVICES_PAGE_VARIANTS[profileId]
    : SERVICES_PAGE_VARIANTS.default;

  return (
    <PageLayout
      titre={variant.titre}
      sousTitre={variant.sousTitre}
    >
      <div className="mt-8 mb-6 space-y-24">

        {/* Carousel ESS */}
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto mb-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={`carousel-label-${profileId || "default"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center"
              >
                {variant.carouselLabel}
              </motion.p>
            </AnimatePresence>
          </div>
          <TarifsESSCarousel />
        </section>

        {/* 3 Offres tarifaires */}
        <PricingCards />

        {/* Comparatif des offres */}
        <ServicesComparisonTable />

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

        {/* Budget / ROI — contenu adaptatif */}
        <AnimatePresence mode="wait">
          <motion.section
            key={`budget-${profileId || "default"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative"
          >
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
                {variant.budgetTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Carte gauche */}
                <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="h-8 w-8 text-coral shrink-0" />
                    <h3 className="text-xl font-googletitre font-medium text-white">
                      {variant.budgetCards.left.title}
                    </h3>
                  </div>
                  <p className="text-white/70 font-googletexte leading-relaxed mb-4">
                    {variant.budgetCards.left.description}
                  </p>
                  {variant.budgetCards.left.price && (
                    <p className="text-4xl font-googletitre font-medium text-coral text-center py-4">
                      {variant.budgetCards.left.price} <span className="text-2xl text-white/60">€</span>
                    </p>
                  )}
                </div>

                {/* Carte droite */}
                <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-8 w-8 text-lightyellow shrink-0" />
                    <h3 className="text-xl font-googletitre font-medium text-white">
                      {variant.budgetCards.right.title}
                    </h3>
                  </div>
                  <p className="text-white/70 font-googletexte leading-relaxed mb-4">
                    {variant.budgetCards.right.description}
                  </p>
                  {variant.budgetCards.right.highlight && (
                    <div className="bg-lightblue/10 border border-lightblue/20 rounded-xl p-4 text-center">
                      <p className="text-lightyellow font-googletitre font-medium">
                        {variant.budgetCards.right.highlight}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>

        {/* Bandeau Audit / Démo / Éligibilité */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/outils" className="group">
              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-coral/40 transition-all duration-300">
                <ClipboardCheck className="h-12 w-12 text-coral mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-googletitre font-semibold text-white mb-2">Outils</h3>
                <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                  Simulateur ROI, audit de site et diagnostic IA pour évaluer votre présence digitale.
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

            <Link href="/contact" className="group">
              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-lightblue/40 transition-all duration-300">
                <Lightbulb className="h-12 w-12 text-lightblue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-googletitre font-semibold text-white mb-2">Déterminez votre offre</h3>
                <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                  Répondez à quelques questions pour découvrir l&apos;offre adaptée à votre structure.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Process */}
        <Process />

        {/* FAQ — contenu adaptatif */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`faq-${profileId || "default"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ServicesFAQ faqs={variant.faqs} />
          </motion.div>
        </AnimatePresence>



      </div>
    </PageLayout>
  );
}
