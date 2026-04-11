"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const CALENDAR_LINK = "https://calendar.app.google/CiBQuqFLNu3vJwSc7";

export type ProfileType = "association" | "pme" | "grand-compte";
export type PainPoint = "lenteur" | "securite" | "refonte" | "carbone";
export type BudgetRange = "less-3000" | "3000-5000" | "more-5000";
export type SiteType = "vitrine" | "institutionnel" | "blog" | "application" | "landing";

interface StepResultProps {
  profile: ProfileType;
  painPoint: PainPoint;
  budget: BudgetRange;
  siteType: SiteType;
  onCtaClick: () => void;
}

interface OfferConfig {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaLink?: string;
  ctaColor: string;
  highlight: string;
  highlightColor: string;
}

function getOffer(_profile: ProfileType, budget: BudgetRange, siteType: SiteType): OfferConfig {
  // Une application web a quasi systématiquement besoin d'une stack Next.js,
  // quel que soit le budget annoncé.
  if (siteType === "application") {
    return {
      badge: "Plateforme Sur-Mesure",
      badgeColor: "bg-lightblue/10 text-extralightblue border-lightblue/20",
      title: "Votre projet appelle une Plateforme Sur-Mesure",
      highlight: "WordPress headless + Next.js",
      highlightColor: "text-extralightblue",
      description:
        "Une application web à base de WordPress demande une architecture découplée : Next.js App Router, ISR/SSR, intégrations API et CI/CD complet. C'est exactement le périmètre de la stack Plateforme Sur-Mesure.",
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-regularblue text-darkblue ",
    };
  }

  // Petit budget — site vitrine ou institutionnel : WordPress monolithique optimisé
  if (budget === "less-3000") {
    return {
      badge: "Présence Essentielle",
      badgeColor: "bg-coral/10 text-coral border-coral/20",
      title: "La stack Présence Essentielle est faite pour vous",
      highlight: "À partir de 2 250 €",
      highlightColor: "text-coral",
      description:
        "Un WordPress monolithique optimisé suffit largement pour votre projet : thème custom moderne, build rapide, sécurité durcie. Vous gardez l'admin que vous connaissez, je révolutionne le front — pour un coût maîtrisé.",
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-coral text-darkblue ",
    };
  }

  // Budget intermédiaire — site à fort enjeu SEO ou éditorial : WordPress + Astro
  if (budget === "3000-5000") {
    return {
      badge: "Croissance Accélérée",
      badgeColor: "bg-lightyellow/10 text-lightyellow border-lightyellow/20",
      title: "La stack Croissance Accélérée correspond à vos enjeux",
      highlight: "WordPress headless + Astro",
      highlightColor: "text-lightyellow",
      description:
        "Pour un site à fort enjeu SEO ou éditorial, l'architecture WordPress headless + Astro offre le meilleur compromis : conservation de l'admin WordPress, performance front maximale, hydratation partielle pour des Core Web Vitals au vert.",
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-lightyellow text-darkblue ",
    };
  }

  // Gros budget : Plateforme Sur-Mesure (Next.js)
  return {
    badge: "Plateforme Sur-Mesure",
    badgeColor: "bg-lightblue/10 text-extralightblue border-lightblue/20",
    title: "La stack Plateforme Sur-Mesure correspond à votre ambition",
    highlight: "WordPress headless + Next.js",
    highlightColor: "text-extralightblue",
    description:
      "Pour une plateforme à forte volumétrie, multisites ou intégrations complexes, WordPress headless + Next.js offre une architecture évolutive, ISR/SSR à la demande et un CI/CD complet. Une plateforme prête à grandir avec votre activité.",
    ctaLabel: "Demander mon Audit IA Gratuit",
    ctaColor: "bg-regularblue text-darkblue ",
  };
}

const painPointLabels: Record<PainPoint, string> = {
  lenteur: "la performance",
  securite: "la sécurité",
  refonte: "le design",
  carbone: "l'éco-conception",
};

const siteTypeLabels: Record<SiteType, string> = {
  vitrine: "Site vitrine",
  institutionnel: "Site institutionnel",
  blog: "Blog / Média",
  application: "Application web",
  landing: "Landing page",
};

export function StepResult({ profile, painPoint, budget, siteType, onCtaClick }: StepResultProps) {
  const offer = getOffer(profile, budget, siteType);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 bg-mediumblue/60 backdrop-blur-lg text-center space-y-4 sm:space-y-6">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`inline-block px-4 py-1.5 rounded-full font-googletitre font-semibold text-sm border ${offer.badgeColor}`}
        >
          {offer.badge}
        </motion.span>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-googletitre font-medium text-white"
        >
          {offer.title}
        </motion.h2>

        {/* Highlight */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl sm:text-3xl md:text-4xl font-googletitre font-medium ${offer.highlightColor}`}
        >
          {offer.highlight}
        </motion.p>

        {/* Pain point focus */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-sm text-white/60 font-googletexte uppercase tracking-widest"
        >
          {siteTypeLabels[siteType]} · Focus : {painPointLabels[painPoint]}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 font-googletexte leading-relaxed max-w-md mx-auto"
        >
          {offer.description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-2"
        >
          {offer.ctaLink ? (
            <Link href={offer.ctaLink} target="_blank" rel="noopener noreferrer" onClick={onCtaClick}>
              <Button className={`whitespace-normal text-center h-auto min-h-[3rem] py-3 px-5 text-sm sm:min-h-[3.5rem] sm:px-10 sm:text-lg font-bold font-googletitre rounded-full ${offer.ctaColor}`}>
                {offer.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <Button
                onClick={onCtaClick}
                className={`whitespace-normal text-center h-auto min-h-[3rem] py-3 px-5 text-sm sm:min-h-[3.5rem] sm:px-10 sm:text-lg font-bold font-googletitre rounded-full cursor-pointer ${offer.ctaColor}`}
              >
                {offer.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              </Button>
              <Link
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-googletexte text-white/70 hover:text-white transition-colors"
              >
                <Video className="w-4 h-4" />
                Ou planifier un appel visio (15 min)
              </Link>
            </div>
          )}
        </motion.div>

        {/* Livre blanc */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-4 border-t border-white/10 mt-4"
        >
          <Link
            href="/ressources/livre_blanc_wp_headless.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-googletexte text-white/50 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            En attendant, découvrez notre livre blanc WordPress Headless
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
