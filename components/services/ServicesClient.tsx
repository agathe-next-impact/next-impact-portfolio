"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PricingCards } from "@/components/services/PricingCards";
import AppsSection from "@/components/services/AppsSection";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import { HeadlessExplainer } from "@/components/headless-explainer";
import PageLayout from "@/components/page-layout";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getServicesPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";

export default function ServicesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const servicesVariants = getServicesPageVariants(locale);
  const variant = profileId ? servicesVariants[profileId] : servicesVariants.default;
  const t = useTranslations("servicesPage");

  return (
    <PageLayout
      titre={variant.titre}
      sousTitre=""
    >
      <div className="mt-8 mb-6 space-y-24">

        {/* Comprendre le WordPress Headless — parcours interactif */}
        <section className="container mx-auto px-4 pb-12">
          <HeadlessExplainer />
        </section>

        {/* Section 1 — Création de sites web (3 forfaits) */}
        <PricingCards />

        {/* Comparatif des offres */}
        <ServicesComparisonTable />

        {/* Section 2 — Applications web & mobile sur-mesure */}
        <AppsSection />

        {/* CTA tertiaire — Simulateur ROI */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto rounded-2xl border border-lightyellow/20 bg-gradient-to-r from-darkblue/60 to-mediumblue/40 backdrop-blur-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lightyellow/10 border border-lightyellow/20 shrink-0">
                <Image src="/icons/analytics-icon.svg" alt={t("calculateGain.iconAlt")} width={24} height={24} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-googletitre text-lg md:text-xl font-medium text-white mb-1">
                  {t("calculateGain.title")}
                </h3>
                <p className="text-sm text-white/60 font-googletexte">
                  {t("calculateGain.description")}
                </p>
              </div>
              <Link
                href="/outils/simulateur-roi"
                className="inline-flex items-center gap-2 text-lightyellow text-sm font-googletitre font-semibold hover:text-white transition-colors shrink-0"
              >
                {t("calculateGain.ctaLabel")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Comment choisir sa stack */}
        <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
              {t("stackMethod.label")}
            </p>
            <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-4 text-center">
              {t("stackMethod.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                <Image src="/icons/content-icon.svg" alt={t("stackMethod.scope.iconAlt")} width={48} height={48} className="mb-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  {t("stackMethod.scope.title")}
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  {t("stackMethod.scope.description")}
                </p>
              </div>

              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                <Image src="/icons/globe-network-icon.svg" alt={t("stackMethod.volume.iconAlt")} width={48} height={48} className="mb-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  {t("stackMethod.volume.title")}
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  {t("stackMethod.volume.description")}
                </p>
              </div>

              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                <Image src="/icons/eco-design-icon.svg" alt={t("stackMethod.scalability.iconAlt")} width={48} height={48} className="mb-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  {t("stackMethod.scalability.title")}
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  {t("stackMethod.scalability.description")}
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
                    <Image src="/icons/brand-reach-icon.svg" alt={t("budgetCardsAlt.left")} width={32} height={32} className="shrink-0" />
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
                    <Image src="/icons/rocket-icon.svg" alt={t("budgetCardsAlt.right")} width={32} height={32} className="shrink-0" />
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
                <Image src="/icons/scan-icon.svg" alt={t("shortcuts.tools.iconAlt")} width={48} height={48} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-googletitre font-semibold text-white mb-2">{t("shortcuts.tools.title")}</h3>
                <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                  {t("shortcuts.tools.description")}
                </p>
              </div>
            </Link>

            <Link href="/demo" className="group">
              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-lightyellow/40 transition-all duration-300">
                <Image src="/icons/desktop-headless-icon.svg" alt={t("shortcuts.demo.iconAlt")} width={48} height={48} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-googletitre font-semibold text-white mb-2">{t("shortcuts.demo.title")}</h3>
                <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                  {t("shortcuts.demo.description")}
                </p>
              </div>
            </Link>

            <Link href="/services/eligibilite" className="group">
              <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-mediumblue/60 backdrop-blur-lg hover:border-lightblue/40 transition-all duration-300">
                <Image src="/icons/optimize-icon.svg" alt={t("shortcuts.stack.iconAlt")} width={48} height={48} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-googletitre font-semibold text-white mb-2">{t("shortcuts.stack.title")}</h3>
                <p className="text-white/60 font-googletexte text-sm leading-relaxed">
                  {t("shortcuts.stack.description")}
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
