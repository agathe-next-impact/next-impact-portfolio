// Offre « Dépannage WordPress » (Ticket WordPress Express + Crédits WordPress).
// Source de vérité unique : pricing + copie FR/EN, consommée par la page, le
// formulaire de demande et les données structurées (FAQ/Service JSON-LD).
// Doctrine : offre d'appel sans abonnement, on PROUVE (sauvegarde, devis clair)
// avant de DEMANDER. Aucun paiement en ligne : la demande déclenche un échange
// mail, réponse sous 24h ouvrées avec lien de paiement si validée.

import type { Locale } from "@/i18n/routing";

export interface PriceItem {
  id: string;
  price: string; // montant affiché, ex. « 149 € »
  unit?: { fr: string; en: string }; // suffixe, ex. « /h »
  value: number; // valeur numérique (données structurées)
  featured?: boolean;
  fr: { name: string; desc: string; tag?: string };
  en: { name: string; desc: string; tag?: string };
}

/** Tickets à l'unité — payez à l'usage, sans abonnement. */
export const TICKETS: PriceItem[] = [
  {
    id: "diagnostic-express",
    price: "69 €",
    value: 69,
    fr: {
      name: "Diagnostic express",
      desc: "Analyse de la panne ou du bug + compte-rendu écrit avec la marche à suivre. Pour comprendre avant d'agir.",
    },
    en: {
      name: "Express diagnosis",
      desc: "Analysis of the issue or bug + a written report with the way forward. To understand before acting.",
    },
  },
  {
    id: "ticket-express",
    price: "149 €",
    value: 149,
    featured: true,
    fr: {
      name: "Ticket Express",
      tag: "Recommandé",
      desc: "Analyse + sauvegarde préalable + correction simple si réalisable en moins d'1h. Sinon, devis clair — rien n'est facturé sans votre accord.",
    },
    en: {
      name: "Express Ticket",
      tag: "Recommended",
      desc: "Analysis + prior backup + simple fix if doable in under 1h. Otherwise, a clear quote — nothing is billed without your approval.",
    },
  },
  {
    id: "urgent-24h",
    price: "229 €",
    value: 229,
    fr: {
      name: "Intervention urgente 24h",
      desc: "Prise en charge prioritaire sous 24h ouvrées. Pour un site en panne ou un bug bloquant en production.",
    },
    en: {
      name: "Urgent 24h intervention",
      desc: "Priority handling within 24 business hours. For a down site or a blocking bug in production.",
    },
  },
  {
    id: "heure-supplementaire",
    price: "99 €",
    unit: { fr: "/h", en: "/hr" },
    value: 99,
    fr: {
      name: "Heure supplémentaire",
      desc: "Au-delà de l'heure incluse, facturée à l'heure entamée. Toujours après un devis validé par vos soins.",
    },
    en: {
      name: "Additional hour",
      desc: "Beyond the included hour, billed per started hour. Always after a quote you have approved.",
    },
  },
];

/** Packs prépayés (crédits) — heures utilisables à la demande, tarif dégressif. */
export const PACKS: PriceItem[] = [
  {
    id: "pack-3h",
    price: "330 €",
    value: 330,
    fr: { name: "Pack 3h", desc: "Petites corrections ponctuelles." },
    en: { name: "3h pack", desc: "Small one-off fixes." },
  },
  {
    id: "pack-5h",
    price: "525 €",
    value: 525,
    fr: { name: "Pack 5h", desc: "Support régulier léger." },
    en: { name: "5h pack", desc: "Light ongoing support." },
  },
  {
    id: "pack-10h",
    price: "990 €",
    value: 990,
    featured: true,
    fr: { name: "Pack 10h", tag: "Le plus choisi", desc: "PME aux besoins fréquents." },
    en: { name: "10h pack", tag: "Most chosen", desc: "SMEs with frequent needs." },
  },
  {
    id: "pack-20h",
    price: "1 800 €",
    value: 1800,
    fr: { name: "Pack 20h", desc: "Client actif, évolutions régulières." },
    en: { name: "20h pack", desc: "Active client, regular evolutions." },
  },
];

/** Tarif horaire effectif d'un pack, ex. « 99 €/h » — incitation au volume. */
export function packHourlyRate(pack: PriceItem, hours: number, locale: Locale): string {
  const rate = Math.round(pack.value / hours);
  return locale === "en" ? `${rate} €/hr` : `${rate} €/h`;
}

export interface FaqItem {
  fr: { q: string; a: string };
  en: { q: string; a: string };
}

export const FAQ: FaqItem[] = [
  {
    fr: {
      q: "Faut-il souscrire un abonnement ?",
      a: "Non. Vous payez à l'intervention, ou via un pack d'heures prépayées utilisables quand vous voulez. Aucun engagement de durée.",
    },
    en: {
      q: "Do I need a subscription?",
      a: "No. You pay per intervention, or via a prepaid pack of hours usable whenever you want. No time commitment.",
    },
  },
  {
    fr: {
      q: "Comment se passe le paiement ?",
      a: "Vous décrivez votre besoin via le formulaire. Je réponds sous 24h ouvrées : si je peux intervenir, je vous envoie un lien de paiement sécurisé. Sinon, un devis clair — rien n'est facturé sans votre accord.",
    },
    en: {
      q: "How does payment work?",
      a: "You describe your need via the form. I reply within 24 business hours: if I can act, I send you a secure payment link. Otherwise, a clear quote — nothing is billed without your approval.",
    },
  },
  {
    fr: {
      q: "Et si la correction prend plus d'une heure ?",
      a: "Le Ticket Express couvre l'analyse, la sauvegarde et la correction si elle tient en moins d'1h. Au-delà, je vous envoie un devis avant de continuer. Pas de mauvaise surprise sur la facture.",
    },
    en: {
      q: "What if the fix takes more than one hour?",
      a: "The Express Ticket covers analysis, backup and the fix if it fits in under 1h. Beyond that, I send a quote before continuing. No nasty surprise on the invoice.",
    },
  },
  {
    fr: {
      q: "Mes données sont-elles protégées ?",
      a: "Oui. Une sauvegarde est réalisée avant toute intervention, et vous recevez un compte-rendu écrit de ce qui a été fait.",
    },
    en: {
      q: "Is my data protected?",
      a: "Yes. A backup is taken before any intervention, and you receive a written report of what was done.",
    },
  },
  {
    fr: {
      q: "Quels types de problèmes WordPress ?",
      a: "Mise à jour qui casse le site, écran blanc, erreur 500, site piraté ou faille, lenteurs, bug d'affichage, conflit d'extension, migration, petite évolution… Si ce n'est pas réalisable, je vous le dis et je vous oriente.",
    },
    en: {
      q: "What kinds of WordPress problems?",
      a: "An update that breaks the site, white screen, 500 error, hacked site or security hole, slowness, display bug, plugin conflict, migration, small evolution… If it isn't doable, I tell you and point you in the right direction.",
    },
  },
];
