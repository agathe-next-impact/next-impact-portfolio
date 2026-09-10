// Offre « Expert technique externalisé » — direction technique à temps
// partagé.
//
// Source de vérité UNIQUE de l'offre récurrente. La page /cto-externalise, la
// bannière de renvoi, l'item du mega menu, le sujet du formulaire de contact et
// les fichiers SEO/GEO en dérivent : un seul endroit à corriger si le tarif,
// l'engagement ou le contenu d'un palier bouge.
//
// Refonte du 2026-09-08, sur la synthèse d'offre « Direction technique
// externalisée » : prix d'entrée ramené de 950 à 900 € HT/mois, engagement porté
// de 3 à 6 mois avec préavis de 2 mois, et passage d'un tarif unique à DEUX
// paliers publics (Référent, Direction technique). Le troisième palier de la
// synthèse (Renforcée, 3 500 €/mois) n'est PAS publié : il se cadre en
// conversation. Ne pas l'ajouter ici sans arbitrage.
//
// Le libellé commercial est « Expert technique externalisé » (charte §1,
// ADR-010 du 2026-09-10, qui remplace l'ancien nom « CTO externalisé ») :
// Agathe préfère un intitulé compréhensible sans jargon pour une cible
// DIRCOM/dirigeant non technique à un acronyme qui misait sur la requête tapée
// par le prospect. « Direction technique à temps partagé » reste sa
// traduction, donnée dès la ligne suivante. Le palier 2 porte, lui, le nom de
// la fonction : Direction technique. L'URL `/cto-externalise` et les
// identifiants de code préfixés `CTO_` ne changent pas (routes, base de
// données, espace client `src/cto/`).
//
// Règles de charte appliquées (DIRECTIVES-CHARTE-EDITORIALE.md §3) : « vous »
// pour le prospect, « je » pour Agathe, jamais « nous ». Aucun tiret cadratin
// dans les chaînes publiées. Prix avec espace insécable, « à partir de ».

export const CTO_PATH = "/cto-externalise";

/** Deep-link du formulaire de contact, pré-sélectionne le sujet dédié. */
export const CTO_CONTACT_HREF = "/contact?sujet=cto-externalise";

/**
 * Prix D'ENTRÉE de la gamme (palier Référent), toujours formulé « à partir de ».
 * Les deux paliers publiés vivent dans CTO_TIERS ci-dessous.
 */
export const CTO_PRICE = {
  fr: { amount: "À partir de 900 € HT", period: "par mois" },
  en: { amount: "From €900 excl. VAT", period: "per month" },
} as const;

/**
 * Le même plancher, en valeur brute : consommé par les données structurées
 * (Schema.org attend un nombre, pas une chaîne formatée) et par les fichiers
 * llms.txt / llms-full.txt, qui écrivent en texte normalisé sans accent ni
 * symbole. Doit rester synchronisé avec CTO_PRICE ci-dessus.
 */
export const CTO_PRICE_VALUE = 900;
export const CTO_PRICE_CURRENCY = "EUR";
/** Unité de facturation UN/CEFACT : « MON » = par mois (offre récurrente). */
export const CTO_BILLING_UNIT_CODE = "MON";
/** Durée minimale d'engagement, en mois. */
export const CTO_MIN_MONTHS = 6;
/** Préavis de résiliation, en mois, une fois l'engagement initial écoulé. */
export const CTO_NOTICE_MONTHS = 2;

export const CTO_COMMITMENT = {
  fr: "Engagement de 6 mois, puis reconduction au mois, préavis de 2 mois",
  en: "Six-month commitment, then rolling monthly, two-month notice",
} as const;

interface Bilingual {
  fr: string;
  en: string;
}

interface TitledItem {
  fr: { title: string; body: string };
  en: { title: string; body: string };
}

/**
 * Bloc « En bref » (TL;DR) : résumé autoportant, cible de citation pour les
 * moteurs de réponse (GEO). Chaque ligne doit pouvoir être citée seule. Reprend
 * la définition en une phrase de la synthèse d'offre (§1), découpée en unités
 * citables et débarrassée des tirets cadratins.
 */
export const CTO_TLDR: { label: Bilingual; lines: { fr: string; en: string }[] } = {
  label: { fr: "En bref", en: "In short" },
  lines: [
    {
      fr: "L'expert technique externalisé est une direction technique à temps partagé pour le numérique visible d'une PME : quelqu'un qui décide, l'écrit, pilote vos prestataires et répond de ce qui est décidé.",
      en: "An outsourced technical expert is technical direction on shared time for the customer-facing digital estate of a mid-sized company: someone who decides, writes it down, steers your vendors and answers for what is decided.",
    },
    {
      fr: "Chaque mois, cette direction propose aussi ce qu'il faut faire évoluer, du correctif imposé par une fin de support à la fonctionnalité qui manque à votre activité.",
      en: "Every month, that direction also proposes what should evolve, from a fix forced by an end-of-support date to the feature your business is missing.",
    },
    {
      fr: "Quelques jours par mois, sans recruter. Comme un DAF externalisé, pour le numérique.",
      en: "A few days a month, without hiring. Like an outsourced CFO, for digital.",
    },
    {
      fr: `${CTO_PRICE.fr.amount} ${CTO_PRICE.fr.period} chez Next Impact, en deux paliers. ${CTO_COMMITMENT.fr}.`,
      en: `${CTO_PRICE.en.amount} ${CTO_PRICE.en.period} with Next Impact, in two tiers. ${CTO_COMMITMENT.en}.`,
    },
  ],
};

export interface CtoProcessStep {
  id: string;
  /** Rythme de l'étape : ce qui revient, et à quelle fréquence. */
  when: Bilingual;
  fr: { title: string; body: string };
  en: { title: string; body: string };
}

/**
 * Le mois type, rendu en timeline (§2 de la page). Arbitrage : la section qui
 * définit le rôle ne dit plus « pour qui » ni « pourquoi », seulement COMMENT ça
 * se passe une fois en place. Le « pour qui » et le « pourquoi » se traitent en
 * FAQ, en réponse à une question posée.
 *
 * À ne pas confondre avec STEPS, qui décrit le DÉMARRAGE (premier message,
 * audit, mise en route). Ici, c'est le régime de croisière : ce qui revient tous
 * les mois une fois le contrat signé.
 *
 * Les rythmes annoncés doivent rester cohérents avec CTO_TIER_ROWS : quand un
 * délai bouge dans le comparatif, il bouge ici.
 *
 * QUATRE étapes, pas une par geste : le conseil et le pilotage tiennent en une
 * seule (même déclencheur, une demande de votre part), la veille
 * porte ses deux faces dans son titre (ce qui menace l'existant, ce qui devient
 * possible). Une timeline se lit d'un coup d'œil ou ne se lit pas.
 *
 * Le pilotage porte sur des PROJETS, quel que soit l'exécutant : une agence, un
 * freelance, quelqu'un chez le client, ou moi. Ne pas le réduire aux
 * « prestataires » : la moitié des projets qui dérapent sont tenus en interne,
 * et l'offre répond aussi de ceux-là.
 *
 * L'ORDRE est un choix éditorial, pas une chronologie : point mensuel, conseil
 * et pilotage, veille, puis suivi. Le suivi ferme la boucle parce qu'il est la
 * trace de tout le reste, et il annonce les livrables détaillés en § 04 : ne pas
 * le remonter en tête.
 *
 * « Espace en ligne » est le nom retenu pour l'espace client, ici comme dans
 * DELIVERABLES et CTO_TIER_ROWS : un seul nom par objet sur la page.
 */
export const CTO_PROCESS: CtoProcessStep[] = [
{
    id: "comite",
    when: { fr: "Chaque mois", en: "Every month" },
    fr: {
      title: "Le point technique mensuel",
      body: "Une à deux heures avec vous selon le palier : ce qui a bougé, ce qui arrive, ce qu'il faut trancher. La roadmap sort du comité à jour.",
    },
    en: {
      title: "The technical steering committee",
      body: "One to two hours with you depending on the tier: what moved, what is coming, what needs deciding. The roadmap leaves the committee up to date.",
    },
  },
  {
    id: "conseil-pilotage",
    when: { fr: "À la demande", en: "On demand" },
    fr: {
      title: "Le conseil et le pilotage de vos projets",
      body: "Un devis à relire, une panne, une refonte qu'on vous propose : vous m'écrivez, vous avez une position argumentée sous 24 à 48 h selon le palier. Je relis ce qui est proposé, je cadre ce qui manque et je suis l'exécution, que le projet soit tenu par une agence, un freelance, quelqu'un chez vous ou par moi. Vous gardez la relation, je tiens la technique.",
    },
    en: {
      title: "Advice and project oversight",
      body: "A quote to review, an outage, a rebuild someone is pitching to you: you write to me, you get a reasoned position within 24 to 48 hours depending on the tier. I review what is proposed, scope what is missing and follow the delivery, whether the project is run by an agency, a freelance, someone on your team or by me. You keep the relationship, I hold the technical side.",
    },
  },
  {
    id: "veille",
    when: { fr: "En continu", en: "Continuously" },
    fr: {
      title: "La veille dédiée : existant et évolutions",
      body: "D'un côté ce qui met en cause ce que vous faites déjà tourner : fins de support, failles, obligations réglementaires, contrats qui se renouvellent. De l'autre ce que votre système pourrait faire et ne fait pas encore, au vu du contexte technique. Une page par mois, et des pistes d'évolution qualifiées : trois par trimestre au palier Référent, trois par mois et chiffrées au palier Direction technique.",
    },
    en: {
      title: "Dedicated watch: your existing system and its evolutions",
      body: "On one side, what puts at risk what you already run: end-of-support dates, vulnerabilities, regulatory obligations, contracts up for renewal. On the other, what your system could do and does not do yet, given the technical context. One page a month, and qualified leads for what to change: three a quarter on the Adviser tier, three a month and costed on the Technical direction tier.",
    },
  },
  {
    id: "suivi",
    when: { fr: "Sous 24 h", en: "Within 24h" },
    fr: {
      title: "Le suivi dans votre espace en ligne",
      body: "Vous suivez l'accompagnement au même endroit : chaque arbitrage écrit, daté, motivé, avec l'option écartée, et vos livrables tenus à jour (cartographie du système, roadmap, revues de devis, budget à trois ans). Tout vous appartient et se lit sans moi.",
    },
    en: {
      title: "Tracking in your online workspace",
      body: "You follow the engagement in one place: every call written down, dated, explained, with the option ruled out, and your deliverables kept current (system map, roadmap, quote reviews, three-year budget). All of it is yours and reads without me.",
    },
  },
];

/**
 * NON RENDU depuis le 2026-09-08 : la section « Pour qui » a été retirée de la
 * page, la qualification passe désormais par les paliers et la FAQ. Le contenu
 * est conservé ici parce qu'il est juste et coûteux à réécrire ; le remettre à
 * l'écran demande une section, pas seulement un import.
 *
 * Les symptômes qui appellent l'offre (synthèse §2). Le prospect ne cherche pas
 * « un expert technique externalisé » : il reconnaît une situation. Formulés en « vous »
 * (charte §3), sans jargon, pour que la reconnaissance soit immédiate.
 */
export const SIGNALS: Bilingual[] = [
  {
    fr: "Un site, un CRM, une newsletter, deux ou trois prestataires, et personne chez vous dont c'est le métier de les faire tenir ensemble.",
    en: "A website, a CRM, a newsletter, two or three vendors, and nobody in-house whose job it is to hold them together.",
  },
  {
    fr: "Des devis techniques que personne ne sait relire.",
    en: "Technical quotes that nobody can review.",
  },
  {
    fr: "Des dates qui arrivent, fin de support, obligation réglementaire, contrat qui se renouvelle, sans que quiconque les suive.",
    en: "Deadlines coming up, end of support, a regulatory obligation, a contract up for renewal, with nobody tracking them.",
  },
  {
    fr: "Un prestataire qui part, ou qui ne répond plus, et des accès que vous ne savez pas récupérer.",
    en: "A vendor who leaves, or stops replying, and access credentials you have no idea how to recover.",
  },
  {
    fr: "Un dirigeant qui tranche des questions techniques par défaut, faute d'interlocuteur.",
    en: "A director settling technical questions by default, for lack of anyone to ask.",
  },
  {
    fr: "Un système qui fait ce qu'il faisait il y a cinq ans, alors que l'activité a changé : des tâches reprises à la main, des demandes clients sans réponse en ligne, un tableur qui porte un processus critique.",
    en: "A system still doing what it did five years ago, while the business has moved on: tasks redone by hand, customer requests with no answer online, a spreadsheet carrying a critical process.",
  },
];

export interface CtoTier {
  id: string;
  /** Prix mensuel HT, en valeur brute (données structurées, llms). */
  price: number;
  /** Prix affiché, déjà formaté avec espace insécable. */
  priceLabel: Bilingual;
  name: Bilingual;
  forWho: Bilingual;
  /** Palier mis en avant : le cas courant. */
  featured?: boolean;
}

/**
 * Les DEUX paliers publiés (synthèse §5). Le palier Renforcée (3 500 €/mois) est
 * volontairement absent du site : il se cadre en conversation, sur un projet en
 * cours ou un système chargé.
 */
export const CTO_TIERS: CtoTier[] = [
  {
    id: "referent",
    price: 900,
    priceLabel: { fr: "900 € HT", en: "€900 excl. VAT" },
    name: { fr: "Référent", en: "Adviser" },
    forWho: {
      fr: "Un système simple, des décisions ponctuelles.",
      en: "A simple system, occasional decisions.",
    },
  },
  {
    id: "direction",
    price: 1900,
    priceLabel: { fr: "1 900 € HT", en: "€1,900 excl. VAT" },
    name: { fr: "Direction technique", en: "Technical direction" },
    forWho: {
      fr: "Le cas courant : plusieurs outils, des prestataires, des échéances.",
      en: "The common case: several tools, vendors, deadlines.",
    },
    featured: true,
  },
];

/**
 * Le comparatif ligne à ligne des deux paliers. Une ligne = un critère, deux
 * valeurs, dans l'ordre de CTO_TIERS. Aucun tiret cadratin ni « + » : la charte
 * demande des formulations lisibles à voix haute, que les moteurs de réponse
 * puissent citer telles quelles.
 */
export const CTO_TIER_ROWS: { label: Bilingual; values: [Bilingual, Bilingual] }[] = [
  {
    label: { fr: "Comité", en: "Steering committee" },
    values: [
      { fr: "1 h par mois", en: "1 hour a month" },
      { fr: "2 h par mois", en: "2 hours a month" },
    ],
  },
  {
    label: { fr: "Arbitrages entre comités", en: "Decisions between committees" },
    values: [
      { fr: "Par écrit, sous 48 h", en: "In writing, within 48h" },
      { fr: "Par écrit, sous 24 h", en: "In writing, within 24h" },
    ],
  },
  {
    label: { fr: "Roadmap", en: "Roadmap" },
    values: [
      { fr: "Tenue à jour trimestriellement", en: "Updated quarterly" },
      { fr: "Tenue à jour en continu", en: "Updated continuously" },
    ],
  },
  {
    label: { fr: "Veille dédiée", en: "Dedicated watch" },
    values: [
      { fr: "Une page par mois", en: "One page a month" },
      {
        fr: "Une page par mois, plus une alerte à chaud",
        en: "One page a month, plus a same-day alert",
      },
    ],
  },
  {
    label: { fr: "Évolutions suggérées", en: "Suggested evolutions" },
    values: [
      { fr: "3 par trimestre, qualifiées", en: "3 a quarter, qualified" },
      { fr: "3 par mois, qualifiées et chiffrées", en: "3 a month, qualified and costed" },
    ],
  },
  {
    label: { fr: "Revue d'opportunité", en: "Opportunity review" },
    values: [
      { fr: "1 par an", en: "1 a year" },
      { fr: "2 par an", en: "2 a year" },
    ],
  },
  {
    label: { fr: "Pilotage des prestataires", en: "Vendor management" },
    values: [
      { fr: "Relecture de devis", en: "Quote review" },
      { fr: "Relecture, cadrage, suivi", en: "Review, scoping, follow-up" },
    ],
  },
  {
    label: { fr: "Réalisation incluse", en: "Implementation included" },
    values: [
      { fr: "Non incluse", en: "Not included" },
      { fr: "4 h par mois", en: "4 hours a month" },
    ],
  },
  {
    label: { fr: "Espace en ligne", en: "Online workspace" },
    values: [
      { fr: "Oui", en: "Yes" },
      { fr: "Oui", en: "Yes" },
    ],
  },
];

/** Conditions communes aux deux paliers (synthèse §5). */
export const CTO_TERMS: Bilingual[] = [
  {
    fr: `Engagement de ${CTO_MIN_MONTHS} mois, puis reconduction au mois, avec un préavis de ${CTO_NOTICE_MONTHS} mois.`,
    en: `A ${CTO_MIN_MONTHS}-month commitment, then rolling monthly, with ${CTO_NOTICE_MONTHS} months' notice.`,
  },
  {
    fr: "Clause de restitution documentée : vos livrables vous appartiennent et se lisent sans moi.",
    en: "A documented handover clause: your deliverables belong to you and read without me.",
  },
  {
    fr: "100 % à distance.",
    en: "100% remote.",
  },
  {
    fr: "4 accompagnements simultanés au maximum, pour que le suivi reste réel.",
    en: "Four concurrent engagements at most, so the follow-up stays real.",
  },
  {
    fr: "Toute réalisation au delà du quota de votre palier est devisée à part, aux tarifs publics.",
    en: "Any implementation beyond your tier's quota is quoted separately, at public rates.",
  },
];

/**
 * Les livrables qui font la preuve (synthèse §9). Ce sont eux qui distinguent
 * une direction technique d'un abonnement au conseil : le client repart avec des
 * documents opposables, pas avec le souvenir d'une conversation.
 */
export const DELIVERABLES: TitledItem[] = [
  {
    fr: {
      title: "Cartographie du système",
      body: "Outils, fournisseurs, flux, accès et détenteurs, contrats et échéances. Tenue à jour dans votre espace en ligne.",
    },
    en: {
      title: "System map",
      body: "Tools, vendors, data flows, credentials and who holds them, contracts and renewal dates. Kept current in your online workspace.",
    },
  },
  {
    fr: {
      title: "Roadmap datée et budgétée",
      body: "Ce qui est décidé, ce qui est ouvert, ce qui arrive, avec les dates et les budgets. Opposable à vos prestataires comme à votre direction.",
    },
    en: {
      title: "A dated, budgeted roadmap",
      body: "What is decided, what is open, what is coming, with dates and budgets. Something you can hold up to vendors and to your own board.",
    },
  },
  {
    fr: {
      title: "Relevé de décisions techniques",
      body: "Chaque arbitrage, sa date, son motif et l'option écartée. Envoyé dans les 24 h qui suivent le comité.",
    },
    en: {
      title: "Record of technical decisions",
      body: "Every call made, its date, its rationale and the option ruled out. Sent within 24h of the committee.",
    },
  },
  {
    fr: {
      title: "Revue de devis avec alternative chiffrée",
      body: "Les propositions de vos prestataires relues : ce qui est chiffré, ce qui manque, ce qui vous engage.",
    },
    en: {
      title: "Quote review with a costed alternative",
      body: "Your vendors' proposals reviewed: what is priced, what is missing, what locks you in.",
    },
  },
  {
    fr: {
      title: "Budget technique à trois ans",
      body: "Ce que votre numérique va coûter, poste par poste, pour que la dépense se décide en amont plutôt qu'en urgence.",
    },
    en: {
      title: "A three-year technology budget",
      body: "What your digital estate will cost, line by line, so spending is decided ahead of time rather than under pressure.",
    },
  },
  {
    fr: {
      title: "Plan de continuité et dossier de restitution",
      body: "De quoi reprendre la main sans moi : accès, contrats, décisions, état du système.",
    },
    en: {
      title: "Continuity plan and handover pack",
      body: "Everything needed to take over without me: access, contracts, decisions, state of the system.",
    },
  },
  {
    fr: {
      title: "Registre des évolutions",
      body: "Ce qui a été proposé, ce qui a été retenu, ce qui a été écarté et pourquoi. C'est ce registre qui rend la direction technique vérifiable.",
    },
    en: {
      title: "Register of proposed evolutions",
      body: "What was proposed, what was accepted, what was ruled out and why. That register is what makes the technical direction auditable.",
    },
  },
  {
    fr: {
      title: "Revue d'opportunité",
      body: "Deux à quatre opportunités par revue, une page chacune, classées sur deux axes seulement : l'effort et l'effet sur votre activité.",
    },
    en: {
      title: "Opportunity review",
      body: "Two to four opportunities per review, one page each, ranked on two axes only: the effort and the effect on your business.",
    },
  },
];

/**
 * Le périmètre, énoncé POSITIVEMENT (synthèse §3, moitié « ce que ça couvre »).
 *
 * Rendu sous la définition du rôle (§2 de la page), en bandeau : il répond à
 * « sur quoi porte ce rôle », donc il appartient à l'explication, pas au pied
 * des livrables. D'où des formulations COURTES, sans phrase ni verbe : le
 * bandeau doit se balayer en cinq secondes. Toute reformulation qui rallonge
 * une entrée casse cet usage.
 *
 * Arbitrage du 2026-09-08 : la page ne met plus en avant ce que l'offre ne
 * comporte pas. La liste de garde-fous en négatif (« ce n'est pas une astreinte,
 * ce n'est pas de l'infogérance ») a été retirée du rendu : sur une offre de
 * direction, elle place le lecteur devant un catalogue de refus avant qu'il ait
 * fini de comprendre ce qu'il achète. Le périmètre ci-dessous dit la même chose
 * par ce qui est couvert. Les limites subsistantes se traitent en FAQ, en
 * réponse à une question posée, et jamais en section mise en avant.
 */
export const PERIMETER: Bilingual[] = [
  {
    fr: "Site et applications web",
    en: "Website and web apps",
  },
  {
    fr: "Outils en ligne : CRM, e-mailing, formulaires, paiement, rendez-vous",
    en: "Online tools: CRM, emailing, forms, payments, booking",
  },
  {
    fr: "Briques d'IA, en interne comme côté client",
    en: "AI components, in-house and customer-facing",
  },
  {
    fr: "Hébergement, sécurité, conformité",
    en: "Hosting, security, compliance",
  },
  {
    fr: "Prestataires et contrats",
    en: "Vendors and contracts",
  },
];

/**
 * NON RENDU depuis le 2026-09-08 : la section « Comment ça démarre » a laissé
 * la place à une bannière « Commencer » qui ne garde que l'audit préalable et
 * le délai de réponse. Le détail du parcours se dit en conversation. Contenu
 * conservé, comme SIGNALS, pour ne pas le réécrire s'il revient à l'écran.
 *
 * Le parcours de démarrage.
 */
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
      title: "L'audit + roadmap établit l'état des lieux",
      body: "650 € HT, trois semaines : l'état de votre système, les scénarios, la recommandation et le plan par étapes. Aucun accompagnement ne démarre sans lui. S'il ne débouche sur rien, vous repartez avec le document.",
    },
    en: {
      title: "The audit and roadmap set the baseline",
      body: "€650 excl. VAT, three weeks: the state of your system, the scenarios, the recommendation and the step-by-step plan. No retainer starts without it. If it leads nowhere, you keep the document.",
    },
  },
  {
    fr: {
      title: "Le rythme s'installe",
      body: "Le palier est choisi, la roadmap issue de l'audit devient vivante, le comité se tient tous les mois. Premier mois de palier Référent offert si le contrat démarre dans les 30 jours suivant la restitution.",
    },
    en: {
      title: "The rhythm settles in",
      body: "The tier is chosen, the roadmap from the audit becomes a living document, the committee meets every month. First month of the Adviser tier free if the contract starts within 30 days of the handover.",
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
      a: "Une maintenance entretient l'existant : mises à jour, sauvegardes, correctifs. L'expert technique externalisé décide de l'existant : faut-il maintenir, refondre ou remplacer, dans quel ordre et à quel budget. Les deux se complètent, ils ne se remplacent pas. Votre prestataire de maintenance garde son contrat.",
    },
    en: {
      q: "How is this different from a maintenance contract?",
      a: "Maintenance keeps what exists running: updates, backups, fixes. An outsourced technical expert decides about what exists: whether to maintain, rebuild or replace, in which order and at what budget. The two complement each other, they do not replace each other. Your maintenance vendor keeps their contract.",
    },
  },
  {
    // Objection n° 2 de la synthèse §12. Elle sépare la direction technique du
    // service communication, qui est membre du comité et non commanditaire.
    fr: {
      q: "C'est le rôle de notre service communication, non ?",
      a: "La communication décide de ce que le site dit. Je réponds de ce qui le fait tenir : les outils, les prestataires, les échéances, les arbitrages techniques. Je m'interdis de faire son métier, et le service communication siège au comité sans en être le commanditaire. La direction technique rend compte au dirigeant ou au directeur financier.",
    },
    en: {
      q: "Isn't that our communications team's job?",
      a: "Communications decides what the site says. I answer for what keeps it standing: the tools, the vendors, the deadlines, the technical trade-offs. I stay out of their work, and the comms team sits on the committee without commissioning it. The technical direction reports to the managing director or the finance director.",
    },
  },
  {
    fr: {
      q: "Vous conseillez et vous réalisez : n'êtes-vous pas juge et partie ?",
      a: "Si, et c'est pour cela que le contrat le borde. La réalisation est plafonnée au quota de votre palier ; au delà, elle est devisée à part, aux tarifs publics. Toute recommandation qui débouche sur une prestation Next Impact est accompagnée d'une alternative externe chiffrée. Vous restez libre de faire exécuter ailleurs : je pilote alors ce prestataire.",
    },
    en: {
      q: "You advise and you build: aren't you judge and jury?",
      a: "I am, and that is why the contract frames it. Implementation is capped at your tier's quota; beyond that it is quoted separately, at public rates. Any recommendation leading to a Next Impact engagement comes with a costed external alternative. You stay free to have the work done elsewhere: I then steer that vendor.",
    },
  },
  {
    fr: {
      q: "Dois-je changer de prestataire ou d'agence ?",
      a: "Non. Vous gardez vos prestataires, je vous aide à les piloter : leurs devis sont relus, leurs livrables sont contrôlés, leurs arbitrages sont tranchés. L'infogérance, les sauvegardes et l'hébergement restent chez votre prestataire actuel. L'expert technique externalisé décide, il ne remplace pas ceux qui exécutent.",
    },
    en: {
      q: "Do I have to change vendor or agency?",
      a: "No. You keep your vendors, I help you steer them: their quotes are reviewed, their deliverables checked, their trade-offs settled. Managed services, backups and hosting stay with your current vendor. An outsourced technical expert decides, it does not replace those who execute.",
    },
  },
  {
    fr: {
      q: `Pourquoi un engagement de ${CTO_MIN_MONTHS} mois ?`,
      a: "Le premier mois sert à cartographier votre système, vos contrats et vos échéances. Les effets arrivent ensuite, quand la roadmap et le registre des évolutions commencent à tourner. Six mois, c'est la durée qu'il faut pour qu'un cycle complet se voie : la cartographie, la roadmap tenue, les arbitrages rendus, une première revue d'opportunité. Passé le sixième mois, la reconduction est mensuelle, avec un préavis de deux mois.",
    },
    en: {
      q: `Why a ${CTO_MIN_MONTHS}-month commitment?`,
      a: "The first month goes into mapping your system, your contracts and your deadlines. The effects come after that, once the roadmap and the register of evolutions start turning. Six months is what it takes for a full cycle to show: the map, the roadmap kept current, the decisions delivered, a first opportunity review. After the sixth month it rolls monthly, with two months' notice.",
    },
  },
  {
    fr: {
      q: "Nous n'avons pas de budget informatique.",
      a: "C'est une dépense de direction, pas d'informatique. Elle se déclenche sur une échéance : une mise en conformité, un projet, le renouvellement d'un contrat. À comparer au coût d'une décision technique prise à l'aveugle, pas à un tarif journalier. L'audit + roadmap à 650 € HT permet de juger sur pièce avant de s'engager.",
    },
    en: {
      q: "We have no IT budget.",
      a: "This is a management expense, not an IT one. It is triggered by a deadline: a compliance requirement, a project, a contract renewal. Compare it to the cost of a technical decision made blind, not to a day rate. The €650 audit and roadmap lets you judge on evidence before committing.",
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
