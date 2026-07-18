"use client";

import { m as motion } from "framer-motion";
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
  // Une application web : voie Web app sur-mesure (Next.js + PostgreSQL)
  if (siteType === "application") {
    return {
      badge: "Web app sur-mesure",
      badgeColor: "bg-lightblue/10 text-extralightblue border-lightblue/20",
      title: "Votre projet appelle une web app sur-mesure",
      highlight: "Next.js + PostgreSQL",
      highlightColor: "text-extralightblue",
      description:
        "Une application web sur-mesure : Next.js, base PostgreSQL serverless, comptes utilisateurs, admin autonome conçu pour votre logique métier. Vous gardez la main sur vos contenus, vos données et vos utilisateurs.",
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-regularblue text-darkblue ",
    };
  }

  // Petit budget — site vitrine ou institutionnel : WordPress classique optimisé
  if (budget === "less-3000") {
    return {
      badge: "Classique",
      badgeColor: "bg-coral/10 text-coral border-coral/20",
      title: "Le forfait Classique est fait pour vous",
      highlight: "À partir de 2 250 €",
      highlightColor: "text-coral",
      description:
        "Un WordPress classique optimisé suffit largement pour votre projet : thème custom moderne, build rapide, sécurité durcie. Vous gardez l'admin que vous connaissez, je révolutionne le reste — pour un coût maîtrisé.",
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-coral text-darkblue ",
    };
  }

  // Budget intermédiaire — site à fort enjeu SEO ou éditorial : Headless + Next.js
  if (budget === "3000-5000") {
    return {
      badge: "Headless",
      badgeColor: "bg-lightyellow/10 text-lightyellow border-lightyellow/20",
      title: "Le forfait Headless correspond à vos enjeux",
      highlight: "WordPress Headless + Next.js",
      highlightColor: "text-lightyellow",
      description:
        "Pour un site à fort enjeu SEO ou éditorial, l'architecture WordPress Headless + Next.js offre le meilleur compromis : conservation de l'admin WordPress, performance front maximale, hydratation partielle pour des Core Web Vitals au vert.",
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-lightyellow text-darkblue ",
    };
  }

  // Gros budget : Web app (Headless complexe / multisites ou Next.js + PostgreSQL)
  return {
    badge: "Web app",
    badgeColor: "bg-lightblue/10 text-extralightblue border-lightblue/20",
    title: "Le forfait Web app correspond à votre ambition",
    highlight: "WordPress Headless complexe / multisites",
    highlightColor: "text-extralightblue",
    description:
      "Pour une plateforme à forte volumétrie, multisites ou intégrations complexes, WordPress Headless + Next.js offre une architecture évolutive, ISR/SSR à la demande et un CI/CD complet. Une plateforme prête à grandir avec votre activité.",
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

      </div>
    </motion.div>
  );
}
