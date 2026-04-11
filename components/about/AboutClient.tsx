"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Zap,
  Code,
  Quote,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import PageLayout from "@/components/page-layout";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { ABOUT_PAGE_VARIANTS } from "@/lib/homepage-profiles";

export default function AboutClient() {
  const { profileId } = useDocumentationMode();
  const variant = profileId
    ? ABOUT_PAGE_VARIANTS[profileId]
    : ABOUT_PAGE_VARIANTS.default;

  const key = profileId || "default";

  return (
    <PageLayout titre={variant.titre} sousTitre={variant.sousTitre}>
      {/* Manifeste Section — adaptatif */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`manifeste-${key}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-mediumblue/60 w-full mx-auto mt-20 flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative"
        >
          <div className="max-w-4xl mx-auto px-4 mb-16">
            <p className="text-lg text-white/80 font-googletexte leading-relaxed">
              {variant.manifesteIntro}
            </p>
            <p className="text-2xl text-lightyellow font-googletitre font-medium mt-6">
              {variant.manifesteAccroche}
            </p>
          </div>

          {/* Piliers */}
          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto px-4">
            {variant.piliers.map((pilier, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm"
              >
                <div className="basis-1/3 flex items-center gap-3 mb-4">
                  <Image
                    src={pilier.icon}
                    alt={pilier.title}
                    width={72}
                    height={72}
                    className="w-1/2 h-full md:w-full text-lightyellow"
                  />
                </div>
                <div className="flex flex-col md:ml-12">
                  <h3 className="text-xl font-googletitre font-medium text-white">
                    {pilier.title}
                  </h3>
                  <p className="text-white/70 font-googletexte leading-relaxed mb-4">
                    {pilier.description}
                  </p>
                  <ul className="space-y-3 ml-12">
                    {pilier.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-white/80 font-googletexte"
                      >
                        <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Parcours / Histoire Section — statique */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            Le parcours
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-4 text-center">
            De l&apos;utilisateur WordPress à l&apos;architecte de stacks modernes
          </h2>
          <p className="text-lg text-white/70 text-center mb-16 font-googletexte">
            Vingt ans à manipuler, personnaliser puis reconstruire WordPress — du back-office à l&apos;architecture headless.
          </p>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-regularblue/60 via-coral/60 to-lightyellow/60" />

            {/* Étape 1 - 2005 */}
            <div className="absolute right-0 top-10 md:w-1/2 md:h-64 hidden md:flex items-center">
              <Image
                src="/img/about-nb-asso.jpg"
                alt="Engagement associatif de Next Impact"
                width={200}
                height={200}
                className="h-full w-full object-cover rounded-2xl border border-white/10"
              />
            </div>
            <div className="relative flex flex-col md:flex-row md:items-start mb-16">
              <div className="md:w-1/2 md:pr-12 bg-mediumblue/20 backdrop-blur-md md:text-right p-4 md:pl-12 md:pl-0 border md:ml-8 border-white/10 rounded-2xl">
                <span className="inline-block text-2xl font-googletitre text-lightyellow font-medium mb-2">
                  2005 — Le terrain
                </span>
                <hr className="border-white/10 my-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  Quinze ans à utiliser WordPress avant de le coder
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  Mettre de côté une passion pour le développement informatique
                  pour plonger dans la communication digitale. Pendant 15 ans,
                  utiliser WordPress au quotidien : créer des pages, gérer des
                  contenus, configurer des thèmes, débugger des plugins. Vivre de
                  l&apos;intérieur ce qui marche — et surtout ce qui frustre les
                  équipes éditoriales sur cet outil.
                </p>
              </div>
            </div>

            {/* Étape 2 - Le retour au code */}
            <div className="relative flex flex-col md:flex-row md:items-start mb-16">
              <div className="absolute left-0 top-10 md:w-1/2 md:h-64 hidden md:flex items-center">
                <Image
                  src="/img/about-code.jpg"
                  alt="Retour au code de Next Impact"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover rounded-2xl border border-white/10"
                />
              </div>
              <div className="md:w-1/2 md:pr-12 hidden md:flex md:justify-end items-center">
                <Code className="h-12 w-12 text-lightyellow/40" />
              </div>
              <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 top-0">
                <div className="h-5 w-5 rounded-full bg-regularblue border-4" />
              </div>
              <div className="md:w-1/2 md:pl-12 border md:mr-8 border-white/10 rounded-2xl bg-mediumblue/20 backdrop-blur-md p-4">
                <span className="inline-block text-2xl font-googletitre text-lightyellow font-medium mb-2">
                  2020 — Le retour au code
                </span>
                <hr className="border-white/10 my-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  De la personnalisation WordPress au développement sur-mesure
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  Face aux limites des thèmes et plugins du marché, repasser au
                  code. D&apos;abord au coup par coup pour résoudre des frictions
                  précises, puis de façon structurelle : thèmes custom, plugins
                  WordPress sur-mesure, intégrations API. Une expertise WordPress
                  full-stack, construite par la nécessité.
                </p>
              </div>
            </div>

            {/* Étape 3 - Next Impact */}
            <div className="relative flex flex-col md:flex-row md:items-start">
              <div className="absolute right-0 top-10 md:w-1/2 md:h-64 hidden md:flex items-center">
                <Image
                  src="/img/contact-agathe-km.png"
                  alt="Engagement associatif de Next Impact"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover rounded-2xl border border-white/10"
                />
              </div>
              <div className="md:w-1/2 md:text-right md:pr-12 pl-4 border md:ml-8 border-white/10 rounded-2xl bg-mediumblue/20 backdrop-blur-md p-4">
                <span className="inline-block text-2xl font-googletitre text-lightyellow font-medium mb-2">
                  Aujourd&apos;hui — Next Impact
                </span>
                <hr className="border-white/10 my-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  Trois stacks WordPress, une conviction
                </h3>
                <ul className="space-y-4 text-white/70 font-googletexte">
                  <li className="flex items-start gap-3 md:flex-row-reverse">
                    <span className="text-white/70">
                      <strong className="text-white">
                        L&apos;expertise utilisateur :
                      </strong>{" "}
                      15 ans à manipuler WordPress côté édition pour comprendre
                      ce qu&apos;il faut absolument préserver de son admin.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 md:flex-row-reverse">
                    <span className="text-white/70">
                      <strong className="text-white">
                        La maîtrise technique :
                      </strong>{" "}
                      Trois stacks au choix — WordPress monolithique optimisé,
                      headless + Astro, headless + Next.js — pour révolutionner
                      le front sans toucher à l&apos;admin.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 md:flex-row-reverse">
                    <span className="text-white/70">
                      <strong className="text-white">
                        L&apos;accélération par l&apos;IA :
                      </strong>{" "}
                      Outils d&apos;audit et workflows IA pour livrer plus vite
                      des sites WordPress aux standards de la Tech.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 top-0" />
              <div className="md:w-1/2 md:pl-12 hidden md:flex items-center">
                <Zap className="h-12 w-12 text-lightyellow/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citation — adaptatif */}
      <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote className="h-10 w-10 text-lightyellow/60 mx-auto mb-6" />
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={`citation-${key}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-2xl md:text-3xl font-googletitre font-medium text-white leading-relaxed mb-6"
            >
              &ldquo;{variant.citation}&rdquo;
            </motion.blockquote>
          </AnimatePresence>
          <p className="text-lg text-white/60 font-googletexte">
            — Agathe Karinthi-Martin, Fondateur de Next Impact
          </p>
        </div>
      </section>

      {/* Chiffres clés — statique */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4">
            En chiffres
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
            Preuve par l&apos;engagement
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center">
            <p className="text-5xl font-googletitre font-medium text-coral mb-2">
              <CountUp end={15} prefix="+" className="text-coral" />
            </p>
            <p className="text-lg text-white/60 font-googletexte">
              ans d&apos;engagement
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center">
            <p className="text-5xl font-googletitre font-medium text-white/80 mb-2">
              <CountUp end={8} prefix="+" className="text-white" />
            </p>
            <p className="text-lg text-white/60 font-googletexte">
              ans de développement
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center">
            <p className="text-5xl font-googletitre font-medium text-lightyellow mb-2">
              <CountUp end={25} prefix="+" className="text-lightyellow" />
            </p>
            <p className="text-lg text-white/60 font-googletexte">
              projets web livrés
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final — adaptatif */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`cta-${key}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative"
        >
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-lg text-white/70 font-googletexte mb-8">
              {variant.ctaDescription}
            </p>
            <Link
              href={variant.ctaHref}
              {...(variant.ctaHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Button className="h-14 px-10 font-bold font-googletitre text-lg rounded-full bg-coral text-darkblue transition-all duration-300">
                {variant.ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.section>
      </AnimatePresence>
    </PageLayout>
  );
}
