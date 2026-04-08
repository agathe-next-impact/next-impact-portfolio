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
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-coral text-darkblue ",
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
      ctaLabel: "Planifier un appel de découverte",
      ctaLink: CALENDAR_LINK,
      ctaColor: "bg-lightyellow text-darkblue ",
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
        ? "bg-regularblue text-darkblue "
        : "bg-lightyellow text-darkblue ",
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
      ctaColor: "bg-coral text-darkblue ",
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
    ctaLabel: "Planifier un appel de découverte",
    ctaLink: CALENDAR_LINK,
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
  const offer = getOffer(profile, budget);

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
