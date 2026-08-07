// Les 7 rubriques de décision du hub « Quelle techno web ? » — taxonomie
// éditoriale VISIBLE du site, découplée de `category` (le dossier de contenu qui
// pilote l'URL). Un article déclare sa rubrique en front matter (`rubrique:`) ;
// c'est elle qui détermine son fil d'Ariane et son CTA de sortie.
//
// Doctrine du CTA : température FROIDE par défaut — l'outil gratuit d'abord.
// Seule « Avant de signer » peut pousser la visio 150 € : son lecteur est déjà
// en phase d'achat. La documentation prouve, elle ne vend pas.

import type { Locale } from "@/i18n/routing";

export const RUBRIQUE_SLUGS = [
  "choisir",
  "ia-et-code",
  "reparer",
  "avant-signer",
  "outils-metier",
  "presence",
  "etre-trouve",
] as const;

export type RubriqueSlug = (typeof RUBRIQUE_SLUGS)[number];

export function isRubriqueSlug(value: unknown): value is RubriqueSlug {
  return typeof value === "string" && (RUBRIQUE_SLUGS as readonly string[]).includes(value);
}

type Text = { fr: string; en: string };

export interface RubriqueCta {
  /** Libellé du bouton — un seul CTA de sortie par article. */
  label: Text;
  href: string;
  /** Précision sous le bouton (gratuité, durée). */
  note: Text;
  /**
   * Relance discrète vers la visio payante. Réservée à « Avant de signer » :
   * partout ailleurs, l'outil gratuit reste la seule sortie.
   */
  secondary?: { label: Text; href: string };
}

export interface Rubrique {
  slug: RubriqueSlug;
  label: Text;
  /** Titre du bloc CTA — formulé comme la suite logique de la lecture. */
  ctaTitle: Text;
  cta: RubriqueCta;
}

const RUBRIQUES: Record<RubriqueSlug, Rubrique> = {
  choisir: {
    slug: "choisir",
    label: { fr: "Choisir sa techno", en: "Choose your tech" },
    ctaTitle: {
      fr: "Reste à trancher pour votre cas",
      en: "Now settle it for your own case",
    },
    cta: {
      label: { fr: "Lancer le Sélecteur techno", en: "Run the tech Selector" },
      href: "/outils/selecteur-techno",
      note: { fr: "Gratuit · sans inscription", en: "Free · no signup" },
    },
  },
  "ia-et-code": {
    slug: "ia-et-code",
    label: { fr: "IA & code", en: "AI & code" },
    ctaTitle: {
      fr: "Votre prototype IA tiendra-t-il en production ?",
      en: "Will your AI prototype hold in production?",
    },
    cta: {
      label: {
        fr: "Tester « Prototype IA : jetable ou maintenable ? »",
        en: "Test “AI prototype: throwaway or maintainable?”",
      },
      href: "/outils/prototype-ia",
      note: { fr: "Gratuit · sans inscription", en: "Free · no signup" },
    },
  },
  reparer: {
    slug: "reparer",
    label: { fr: "Réparer ou refaire", en: "Repair or rebuild" },
    ctaTitle: {
      fr: "Où en est vraiment votre site ?",
      en: "Where does your site actually stand?",
    },
    cta: {
      label: { fr: "Auditer mon site", en: "Audit my site" },
      href: "/audit-site-web",
      note: { fr: "Gratuit · 2 minutes", en: "Free · 2 minutes" },
    },
  },
  "avant-signer": {
    slug: "avant-signer",
    label: { fr: "Avant de signer", en: "Before you sign" },
    ctaTitle: {
      fr: "Un devis sur la table ?",
      en: "Got a quote on the table?",
    },
    cta: {
      label: { fr: "Décrypter mon devis", en: "Decode my quote" },
      href: "/outils/decrypteur-devis",
      note: { fr: "Gratuit · sans inscription", en: "Free · no signup" },
      // Unique exception à la règle du CTA froid : ce lecteur est en phase d'achat.
      secondary: {
        label: {
          fr: "Enjeu important ? Avis indépendant en visio — 150 €",
          en: "High stakes? Independent second opinion on a call — €150",
        },
        href: "/conseil",
      },
    },
  },
  "outils-metier": {
    slug: "outils-metier",
    label: { fr: "Outils métier", en: "Business tools" },
    ctaTitle: {
      fr: "Plugin, SaaS ou sur-mesure pour votre besoin ?",
      en: "Plugin, SaaS or custom for your need?",
    },
    cta: {
      label: { fr: "No-code, SaaS ou sur-mesure ?", en: "No-code, SaaS or custom?" },
      href: "/outils/nocode-saas-surmesure",
      note: { fr: "Gratuit · sans inscription", en: "Free · no signup" },
    },
  },
  presence: {
    slug: "presence",
    label: { fr: "Présence et audience", en: "Presence & audience" },
    ctaTitle: {
      fr: "Ce que votre présence actuelle produit vraiment",
      en: "What your current presence actually produces",
    },
    cta: {
      label: { fr: "Lancer le Diagnostic Web & IA", en: "Run the Web & AI diagnostic" },
      href: "/audit-site-web",
      note: { fr: "Gratuit · 2 minutes", en: "Free · 2 minutes" },
    },
  },
  "etre-trouve": {
    slug: "etre-trouve",
    label: { fr: "Être trouvé à l'heure de l'IA", en: "Be found in the AI era" },
    ctaTitle: {
      fr: "Les moteurs IA vous citent-ils ?",
      en: "Do AI engines cite you?",
    },
    cta: {
      label: { fr: "Visible dans les moteurs IA ?", en: "Visible in AI engines?" },
      href: "/outils/visibilite-ia",
      note: { fr: "Gratuit · sans inscription", en: "Free · no signup" },
    },
  },
};

export function getRubrique(slug: string): Rubrique | undefined {
  return isRubriqueSlug(slug) ? RUBRIQUES[slug] : undefined;
}

export function rx(text: Text, locale: Locale | string): string {
  return locale === "en" ? text.en : text.fr;
}

/** URL de la page de rubrique (hub thématique). */
export function rubriqueHref(slug: RubriqueSlug): string {
  return `/documentation/${slug}`;
}
