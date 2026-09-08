// Offre « CTO externalisé » — direction technique à temps partagé.
//
// Arbitrage du 2026-09-07 : l'offre récurrente supprimée le 2026-08-27 (commit
// b8a328d, « Direction technique externalisée » à 750 € HT/mois) est réinstaurée
// sous son nom recherché, à un tarif et un engagement révisés. Elle vit sur sa
// propre page et NON sur /conseil, qui reste réservée aux deux portes d'entrée
// payantes du catalogue (visio conseil 150 € · audit + roadmap 650 €).
//
// Source de vérité unique : la page /cto-externalise, la bannière de renvoi, le
// sujet du formulaire de contact et les fichiers SEO/GEO en dérivent. Un seul
// endroit à corriger si le tarif bouge.
//
// Règles de charte appliquées (DIRECTIVES-CHARTE-EDITORIALE.md §3) : « vous »
// pour le prospect, « je » pour Agathe, jamais « nous ». Aucun tiret cadratin
// dans les chaînes publiées. Prix avec espace insécable, « à partir de ».

export const CTO_PATH = "/cto-externalise";

/** Deep-link du formulaire de contact, pré-sélectionne le sujet dédié. */
export const CTO_CONTACT_HREF = "/contact?sujet=cto-externalise";

export const CTO_PRICE = {
  fr: { amount: "À partir de 950 € HT", period: "par mois" },
  en: { amount: "From €950 excl. VAT", period: "per month" },
} as const;

/**
 * Le même palier, en valeur brute : consommé par les données structurées
 * (Schema.org attend un nombre, pas une chaîne formatée) et par les fichiers
 * llms.txt / llms-full.txt, qui écrivent en texte normalisé sans accent ni
 * symbole. Doit rester synchronisé avec CTO_PRICE ci-dessus.
 */
export const CTO_PRICE_VALUE = 950;
export const CTO_PRICE_CURRENCY = "EUR";
/** Unité de facturation UN/CEFACT : « MON » = par mois (offre récurrente). */
export const CTO_BILLING_UNIT_CODE = "MON";
/** Durée minimale d'engagement, en mois. */
export const CTO_MIN_MONTHS = 3;

export const CTO_COMMITMENT = {
  fr: "Engagement de 3 mois minimum, puis reconduction au mois",
  en: "Three-month minimum, then rolling monthly",
} as const;

interface Bilingual {
  fr: string;
  en: string;
}

/**
 * Bloc « En bref » (TL;DR) : résumé autoportant, cible de citation pour les
 * moteurs de réponse (GEO). Même rôle que `home-content.ts` et
 * `about-content.ts` : une seule source, consommée par le rendu visible ET par
 * les fichiers llms. Les chiffres dérivent de CTO_PRICE et CTO_COMMITMENT :
 * un seul endroit à corriger si le tarif ou l'engagement bouge.
 */
export const CTO_TLDR: { label: Bilingual; lines: { fr: string; en: string }[] } = {
  label: { fr: "En bref", en: "In short" },
  lines: [
    {
      fr: "Le CTO externalisé est un directeur technique à temps partagé : quelques jours par mois, sans contrat de travail ni recrutement.",
      en: "A fractional CTO is a technical director on shared time: a few days a month, with no employment contract and no hiring.",
    },
    {
      fr: `${CTO_PRICE.fr.amount} ${CTO_PRICE.fr.period} chez Next Impact. ${CTO_COMMITMENT.fr}.`,
      en: `${CTO_PRICE.en.amount} ${CTO_PRICE.en.period} with Next Impact. ${CTO_COMMITMENT.en}.`,
    },
    {
      fr: "L'abonnement couvre une visio de pilotage par mois, vos arbitrages en continu sous 48 h ouvrées, la relecture de vos devis, une roadmap tenue à jour et une veille ciblée sur votre parc.",
      en: "The retainer covers one steering call a month, your decisions arbitrated continuously within two working days, your vendor quotes reviewed, a living roadmap and a watch targeted on your systems.",
    },
    {
      fr: "Ce n'est ni un contrat de maintenance, ni une astreinte, ni du développement inclus : les chantiers se chiffrent à part, au forfait.",
      en: "It is not a maintenance contract, not an on-call contract, and development is not included: projects are priced separately, as a fixed fee.",
    },
  ],
};

interface TitledItem {
  fr: { title: string; body: string };
  en: { title: string; body: string };
}

/** Les signes qu'un accompagnement récurrent est la bonne réponse. */
export const SIGNALS: Bilingual[] = [
  {
    fr: "Vous recevez des devis techniques que personne ne sait relire en interne.",
    en: "You receive technical quotes nobody in-house can review.",
  },
  {
    fr: "Vos prestataires se succèdent et plus personne ne tient la vue d'ensemble.",
    en: "Vendors come and go, and nobody holds the overall picture any more.",
  },
  {
    fr: "Vos arbitrages techniques attendent la prochaine réunion de direction.",
    en: "Your technical decisions wait for the next management meeting.",
  },
  {
    fr: "Votre parc accumule de la dette technique, sans que personne sache laquelle ni ce qu'elle coûte.",
    en: "Your systems accumulate technical debt, and nobody knows which, or what it costs.",
  },
  {
    fr: "Vous n'avez pas le volume pour un directeur technique salarié, et vous n'en avez pas besoin à plein temps.",
    en: "You do not have the volume for a salaried tech director, and you do not need one full time.",
  },
];

/** Ce que couvre l'abonnement. Repris de l'offre 2026-08, réécrit sans tiret cadratin. */
export const COVERAGE: TitledItem[] = [
  {
    fr: {
      title: "Une visio de pilotage par mois",
      body: "Soixante minutes en visio : arbitrages en attente, priorités du mois, points de vigilance. Compte rendu écrit derrière.",
    },
    en: {
      title: "One steering call per month",
      body: "Sixty minutes on a call: pending decisions, priorities for the month, watch points. A written summary follows.",
    },
  },
  {
    fr: {
      title: "Vos arbitrages en continu",
      body: "Entre deux visios, vous m'écrivez quand une décision se présente. Réponse sous 48 h ouvrées, sans compteur de temps.",
    },
    en: {
      title: "Ongoing arbitration",
      body: "Between calls, you write to me whenever a decision comes up. Reply within two working days, no time metering.",
    },
  },
  {
    fr: {
      title: "La relecture de vos devis",
      body: "Les propositions de vos prestataires relues au fil de l'eau : ce qui est chiffré, ce qui manque, ce qui vous engage.",
    },
    en: {
      title: "Vendor quote review",
      body: "Your vendors' proposals reviewed as they arrive: what is priced, what is missing, what locks you in.",
    },
  },
  {
    fr: {
      title: "Une roadmap tenue à jour",
      body: "Priorités, budget et prochaines étapes dans un document vivant, opposable à vos prestataires comme à votre direction.",
    },
    en: {
      title: "A living roadmap",
      body: "Priorities, budget and next steps in a living document you can hold up to vendors and to your own management.",
    },
  },
  {
    fr: {
      title: "Une veille ciblée sur votre parc",
      body: "Sécurité, obsolescence, dette technique et usages de l'IA : ce qui concerne vos outils, pas l'actualité générale.",
    },
    en: {
      title: "A watch targeted on your systems",
      body: "Security, obsolescence, technical debt and AI practices: what concerns your tools, not general news.",
    },
  },
  {
    fr: {
      title: "Un accès prioritaire à la mise en œuvre",
      body: "Si un chantier se lance, il passe devant dans mon planning. Il se chiffre à part, au forfait, prix et délai annoncés.",
    },
    en: {
      title: "Priority access to implementation",
      body: "If a project starts, it moves to the front of my schedule. It is priced separately, as a fixed fee, with a committed timeline.",
    },
  },
];

/** Garde-fous. Dire ce que l'offre n'est pas rassure un prospect froid. */
export const BOUNDARIES: Bilingual[] = [
  {
    fr: "Ce n'est pas un contrat de maintenance : les mises à jour, les sauvegardes et l'hébergement restent chez votre prestataire actuel.",
    en: "This is not a maintenance contract: updates, backups and hosting stay with your current vendor.",
  },
  {
    fr: "Ce n'est pas une astreinte : je n'interviens pas la nuit ni le week-end sur incident.",
    en: "This is not an on-call contract: I do not handle incidents at night or on weekends.",
  },
  {
    fr: "Ce n'est pas du développement inclus : les chantiers se chiffrent à part, au forfait.",
    en: "This does not include development: projects are priced separately, as a fixed fee.",
  },
  {
    fr: "Ce n'est pas une exclusivité : vous gardez vos prestataires, je vous aide à les piloter.",
    en: "This is not an exclusivity clause: you keep your vendors, I help you steer them.",
  },
];

/** Le parcours de démarrage. */
export const STEPS: TitledItem[] = [
  {
    fr: {
      title: "Vous décrivez votre situation",
      body: "Le contexte, les décisions en attente, les prestataires en place. Réponse sous 48 h.",
    },
    en: {
      title: "You describe your situation",
      body: "The context, the pending decisions, the vendors in place. Reply within 48h.",
    },
  },
  {
    fr: {
      title: "Je cadre le périmètre",
      body: "Ce que je couvre, ce que je ne couvre pas, la date de la première visio de pilotage. Le tarif est fixé avant de commencer.",
    },
    en: {
      title: "I scope the perimeter",
      body: "What I cover, what I do not, the date of the first steering call. The price is fixed before we start.",
    },
  },
  {
    fr: {
      title: "Le rythme s'installe",
      body: "Une visio par mois, vos arbitrages en continu, la roadmap tenue à jour. Reconduction au mois après le troisième.",
    },
    en: {
      title: "The rhythm settles in",
      body: "One call a month, your decisions handled continuously, the roadmap kept current. Rolling monthly after the third month.",
    },
  },
];

export interface CtoFaqItem {
  fr: { q: string; a: string };
  en: { q: string; a: string };
}

export const CTO_FAQ: CtoFaqItem[] = [
  {
    fr: {
      q: "En quoi est-ce différent d'un contrat de maintenance ?",
      a: "Une maintenance entretient l'existant : mises à jour, sauvegardes, correctifs. Le CTO externalisé décide de l'existant : faut-il maintenir, refondre ou remplacer, dans quel ordre et à quel budget. Les deux se complètent, ils ne se remplacent pas. Votre prestataire de maintenance garde son contrat.",
    },
    en: {
      q: "How is this different from a maintenance contract?",
      a: "Maintenance keeps what exists running: updates, backups, fixes. A fractional CTO decides about what exists: whether to maintain, rebuild or replace, in which order and at what budget. The two complement each other, they do not replace each other. Your maintenance vendor keeps their contract.",
    },
  },
  {
    fr: {
      q: "Faut-il vous confier aussi le développement ?",
      a: "Non, et c'est le point. Je suis payée pour l'arbitrage, pas pour remporter le chantier. Si la meilleure réponse est de garder votre prestataire actuel ou de ne rien faire cette année, je le dis. Si un chantier me revient, il est chiffré à part, au forfait, avec prix et délai annoncés avant de commencer.",
    },
    en: {
      q: "Do I have to give you the development work too?",
      a: "No, and that is the point. I am paid to arbitrate, not to win the project. If the best answer is to keep your current vendor or to do nothing this year, I say so. If a project does come to me, it is quoted separately, as a fixed fee, with price and timeline committed before we start.",
    },
  },
  {
    fr: {
      q: "Pourquoi un engagement de 3 mois ?",
      a: "Le premier mois sert à comprendre votre parc et vos contraintes ; les effets arrivent au deuxième et au troisième. En dessous, vous payez la mise en route sans en récolter le bénéfice. Passé le troisième mois, la reconduction est mensuelle et vous arrêtez quand vous voulez.",
    },
    en: {
      q: "Why a three-month minimum?",
      a: "The first month goes into understanding your systems and constraints; the effects arrive in months two and three. Below that, you pay for the ramp-up without reaping the benefit. After the third month it rolls monthly and you stop whenever you want.",
    },
  },
  {
    fr: {
      q: "Je préfère un avis ponctuel. C'est possible ?",
      a: "Oui, et c'est souvent le bon point de départ. La visio conseil refonte (150 € HT) tranche une direction en une heure, avec un avis écrit sous 48 h. L'audit + roadmap (650 € HT) documente l'existant et remet une feuille de route. L'accompagnement récurrent n'a de sens que si les décisions reviennent tous les mois.",
    },
    en: {
      q: "I would rather have a one-off opinion. Is that possible?",
      a: "Yes, and it is often the right starting point. The redesign advisory call (€150 excl. VAT) settles a direction in one hour, with a written opinion within 48h. The audit + roadmap (€650 excl. VAT) documents what exists and delivers a plan. The recurring retainer only makes sense if decisions come up every month.",
    },
  },
];
