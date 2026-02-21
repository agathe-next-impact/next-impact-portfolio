"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const CALENDAR_LINK = "https://calendar.app.google/CiBQuqFLNu3vJwSc7";

export type ProfileType = "association" | "pme" | "grand-compte";
export type PainPoint = "lenteur" | "securite" | "refonte" | "carbone";
export type BudgetRange = "less-3000" | "3000-5000" | "more-5000";

interface StepResultProps {
  profile: ProfileType;
  painPoint: PainPoint;
  budget: BudgetRange;
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

function getOffer(profile: ProfileType, budget: BudgetRange): OfferConfig {
  // Scénario A : Profil "Bénéficiaire" (Asso + < 3000€)
  if (profile === "association" && budget === "less-3000") {
    return {
      badge: "Offre Solidaire",
      badgeColor: "bg-coral/10 text-coral border-coral/20",
      title: "L'Offre \"Solidaire\" est faite pour vous",
      highlight: "À partir de 2 250 €",
      highlightColor: "text-coral",
      description:
        "Grâce à notre modèle de péréquation, bénéficiez d'un site ultra-rapide, sécurisé et éco-conçu qui soutiendra vos campagnes de dons sans jamais ralentir.",
      ctaLabel: "Planifier un appel de découverte (15 min)",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-coral hover:bg-coral/90 text-white",
    };
  }

  // Scénario A bis : Asso avec budget intermédiaire
  if (profile === "association" && budget === "3000-5000") {
    return {
      badge: "Offre Équilibre",
      badgeColor: "bg-lightyellow/10 text-lightyellow border-lightyellow/20",
      title: "L'Offre \"Équilibre\" correspond à vos ambitions",
      highlight: "Un accompagnement sur mesure",
      highlightColor: "text-lightyellow",
      description:
        "Votre association mérite un site performant qui porte votre mission. Bénéficiez de notre expertise technique à un tarif adapté au secteur associatif.",
      ctaLabel: "Planifier un appel de découverte (15 min)",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-lightyellow hover:bg-lightyellow/90 text-darkblue",
    };
  }

  // Scénario B : Profil "Performance" (PME/Grand Compte + budget > 3000€)
  if ((profile === "pme" || profile === "grand-compte") && (budget === "3000-5000" || budget === "more-5000")) {
    const offerName = budget === "more-5000" ? "Soutien" : "Équilibre";
    const isSoutien = budget === "more-5000";
    return {
      badge: `Offre ${offerName}`,
      badgeColor: isSoutien
        ? "bg-lightblue/10 text-extralightblue border-lightblue/20"
        : "bg-lightyellow/10 text-lightyellow border-lightyellow/20",
      title: `L'Offre "${offerName}" correspond à vos enjeux`,
      highlight: "Devenez Mécène",
      highlightColor: isSoutien ? "text-extralightblue" : "text-lightyellow",
      description:
        "Boostez vos conversions en passant au WordPress Headless. En prime, en choisissant Next Impact, vous devenez Mécène et financez la transition numérique d'une association locale !",
      ctaLabel: "Demander mon Audit IA Gratuit",
      ctaColor: isSoutien
        ? "bg-regularblue hover:bg-regularblue/90 text-white"
        : "bg-lightyellow hover:bg-lightyellow/90 text-darkblue",
    };
  }

  // Scénario C : PME/Grand Compte avec petit budget
  if ((profile === "pme" || profile === "grand-compte") && budget === "less-3000") {
    return {
      badge: "Premiers pas",
      badgeColor: "bg-coral/10 text-coral border-coral/20",
      title: "Commençons par un diagnostic",
      highlight: "Audit offert",
      highlightColor: "text-coral",
      description:
        "Même avec un budget limité, des optimisations rapides peuvent faire une vraie différence. Commençons par identifier les leviers les plus impactants pour votre activité.",
      ctaLabel: "Demander mon Audit IA Gratuit",
      ctaColor: "bg-coral hover:bg-coral/90 text-white",
    };
  }

  // Asso + gros budget (rare mais possible)
  return {
    badge: "Offre Premium Solidaire",
    badgeColor: "bg-lightblue/10 text-extralightblue border-lightblue/20",
    title: "Un projet ambitieux pour votre association",
    highlight: "Accompagnement complet",
    highlightColor: "text-extralightblue",
    description:
      "Votre budget permet un site sur mesure, ultra-performant et éco-conçu. Nous construirons ensemble une plateforme qui maximise votre impact.",
    ctaLabel: "Planifier un appel de découverte (15 min)",
    ctaLink: CALENDAR_LINK,
    ctaColor: "bg-regularblue hover:bg-regularblue/90 text-white",
  };
}

const painPointLabels: Record<PainPoint, string> = {
  lenteur: "la performance",
  securite: "la sécurité",
  refonte: "le design",
  carbone: "l'éco-conception",
};

export function StepResult({ profile, painPoint, budget, onCtaClick }: StepResultProps) {
  const offer = getOffer(profile, budget);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="border border-white/10 rounded-2xl p-8 md:p-10 bg-mediumblue/60 backdrop-blur-lg text-center space-y-6">
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
          className={`text-4xl font-googletitre font-medium ${offer.highlightColor}`}
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
          Focus prioritaire : {painPointLabels[painPoint]}
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
              <Button className={`h-14 px-10 font-bold font-googletitre text-lg rounded-full shadow ${offer.ctaColor}`}>
                {offer.ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={onCtaClick}
                className={`h-14 px-10 font-bold font-googletitre text-lg rounded-full shadow cursor-pointer ${offer.ctaColor}`}
              >
                {offer.ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
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
