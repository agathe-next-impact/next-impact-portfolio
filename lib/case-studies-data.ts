import type { Locale } from "@/i18n/routing";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ClientTypeKey =
  | "grande-entreprise"
  | "pme"
  | "association"
  | "ess"
  | "institutionnel"
  | "groupement"
  | "independant";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | null;
export type Year = number | null;

export interface CaseStudyMeta {
  id: string;
  slug: string;
  clientType: ClientTypeKey;
  clientName: string;
  imageUrl: string;
  galleryUrl: string;
  date: { month: Month; year: Year };
  technologies: string[];
  website?: string;
  youtubeVideoId?: string;
  youtubeIsShort?: boolean;
}

export interface CaseStudyContent {
  title: string;
  description: string;
  detailedDescription: string;
  objectives: string[];
  results: string[];
  /**
   * L'arbitrage technologique — ce qui transforme une fiche portfolio en preuve
   * de conseil : quelles options étaient sur la table, laquelle a été retenue
   * et pourquoi. À remplir uniquement avec les faits réels du projet (pas de
   * reconstruction a posteriori) ; la section ne s'affiche que si présent.
   */
  arbitrage?: {
    consideredOptions: string[];
    decision: string;
    rationale: string;
  };
  testimonial?: {
    content: string;
    author: string;
    position: string;
  };
  galleryAlt: string;
  tags: string[];
  duration: string;
}

export interface ResultHighlight {
  value: string;
  label: string;
}

export interface CaseStudy extends CaseStudyMeta, CaseStudyContent {
  gallery: { url: string; alt: string };
}

// ─── Locale-agnostic meta ──────────────────────────────────────────────────

const META: CaseStudyMeta[] = [
  {
    id: "22",
    slug: "arguin-marine",
    clientType: "pme",
    clientName: "Arguin Marine",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-arguinmarine.jpg",
    date: { month: 6, year: 2026 },
    technologies: ["WordPress", "Full Site Editing"],
    website: "https://www.arguinmarine.fr",
    youtubeVideoId: "ash0Q83Z9gQ",
  },
  {
    id: "20",
    slug: "peer-to-peer",
    clientType: "ess",
    clientName: "Peer to Peer",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-peertopeer.jpg",
    date: { month: 6, year: 2026 },
    technologies: ["Next.js", "React", "TypeScript", "Stockage local (navigateur)", "Tailwind CSS", "Vercel"],
    website: "https://peer-to-peer.fr",
    youtubeVideoId: "VAB_u0kvR64",
  },
  {
    id: "19",
    slug: "panorama-pub",
    clientType: "pme",
    clientName: "Panorama Pub",
    imageUrl: "/img/desktop-screen-panoramapub.png",
    galleryUrl: "/img/desktop-screen-panoramapub.png",
    date: { month: 5, year: 2026 },
    technologies: ["Next.js", "PostgreSQL", "TypeScript", "Tailwind CSS", "Vercel"],
    website: "https://panorama-pub.com",
    youtubeVideoId: "9fMaBL1amYk",
  },
  {
    id: "17",
    slug: "cafe-citoyen",
    clientType: "association",
    clientName: "Café citoyen d'Auger-Saint-Vincent",
    imageUrl: "/img/desktop-screen-cafe-citoyen.png",
    galleryUrl: "/img/desktop-screen-cafe-citoyen.png",
    date: { month: 3, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://cafecitoyen.art",
    youtubeVideoId: "8aVVoDFakCY",
  },
  {
    id: "18",
    slug: "hermitage-jeu-de-piste",
    clientType: "ess",
    clientName: "Tiers Lieu L'Hermitage",
    imageUrl: "/img/logo-hermitage.webp",
    galleryUrl: "/img/mobile-screen-jeu-de-piste-hermitage.jpg",
    date: { month: 4, year: 2026 },
    technologies: ["Next.js", "PWA", "Géolocalisation", "Persistance locale", "Tailwind CSS", "Vercel"],
    website: "https://jeu-de-piste.hermitagelelab.com/",
    youtubeVideoId: "_kt_wA4zT68",
    youtubeIsShort: true,
  },
  {
    id: "16",
    slug: "comme-des-fous-jeux",
    clientType: "association",
    clientName: "Comme des fous",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-comme-des-fous-jeux.jpg",
    date: { month: 2, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://jeux.commedesfous.com",
    youtubeVideoId: "SIj61ECS1Mo",
  },
  {
    id: "15",
    slug: "comme-des-fous",
    clientType: "pme",
    clientName: "Comme des fous",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-comme-des-fous.jpg",
    date: { month: 1, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://commedesfous.com",
    youtubeVideoId: "6vUSbG6F50w",
  },
  {
    id: "3",
    slug: "next-event",
    clientType: "pme",
    clientName: "Next Event",
    imageUrl: "/img/desktop-screen-next-event.jpg",
    galleryUrl: "/img/desktop-screen-next-event.jpg",
    date: { month: 10, year: 2025 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://next-event.fr",
    youtubeVideoId: "I1qi5o31Lnk",
  },
  {
    id: "0",
    slug: "les-etats-generaux-communaux",
    clientType: "association",
    clientName: "Les Etats Généraux Communaux",
    imageUrl: "/img/logo-egc.png",
    galleryUrl: "/img/desktop-screen-egc.png",
    date: { month: 10, year: 2025 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://lesetatsgenerauxcommunaux.org",
    youtubeVideoId: "dJIndpLBm7o",
  },
  {
    id: "1",
    slug: "proditec",
    clientType: "pme",
    clientName: "Proditec",
    imageUrl: "/img/logo-proditec.webp",
    galleryUrl: "/img/desktop-screen-proditec.jpg",
    date: { month: 5, year: 2025 },
    technologies: ["WordPress", "LiteSpeed", "Polylang", "elementor", "Hostinger"],
    website: "https://proditec.com",
  },
  {
    id: "2",
    slug: "doleances",
    clientType: "association",
    clientName: "Association Les Doléances",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-lesdoleances.jpg",
    date: { month: 5, year: 2025 },
    technologies: ["WordPress", "Next.js", "Tailwind CSS", "Headless CMS", "Vercel"],
    website: "https://lesdoleances.fr",
    youtubeVideoId: "_OjiGiOWJus",
  },
  {
    id: "4",
    slug: "sowee",
    clientType: "grande-entreprise",
    clientName: "Sowee",
    imageUrl: "/img/logo-sowee.svg",
    galleryUrl: "/img/desktop-screen-sowee.png",
    date: { month: 11, year: 2023 },
    technologies: [
      "GeneratePress",
      "WordPress",
      "Figma (maquettes)",
      "PHP",
      "GitHub Actions (CI/CD)",
    ],
    website: "https://sowee.fr/conseils",
    youtubeVideoId: "PHImvgHrScE",
  },
  {
    id: "5",
    slug: "salon-de-la-carrosserie",
    clientType: "pme",
    clientName: "Salon de la Carrosserie",
    imageUrl: "/img/logo-salondelacarrosserie.webp",
    galleryUrl: "/img/desktop-screen-salondelacarrosserie.jpg",
    date: { month: 2, year: 2024 },
    technologies: ["WordPress", "Elementor Pro", "Ultimate Member"],
    website: "https://salondelacarrosserie.com",
    youtubeVideoId: "s_tyz8ubqSo",
  },
  {
    id: "6",
    slug: "hermitage",
    clientType: "ess",
    clientName: "L'Hermitage",
    imageUrl: "/img/logo-hermitage.webp",
    galleryUrl: "/img/desktop-screen-hermitage.jpg",
    date: { month: 1, year: 2025 },
    technologies: ["WordPress", "Elementor Pro", "Optimisation des performances"],
    website: "https://hermitagelelab.com",
  },
  {
    id: "7",
    slug: "erp-services",
    clientType: "pme",
    clientName: "ERP Services",
    imageUrl: "/img/logo-erp-services.webp",
    galleryUrl: "/img/desktop-screen-erp-services.jpg",
    date: { month: 7, year: 2024 },
    technologies: ["WordPress", "Elementor Pro", "LiteSpeed Cache"],
  },
  {
    id: "8",
    slug: "senza-nature",
    clientType: "pme",
    clientName: "Senza Nature",
    imageUrl: "/img/logo-senza-nature.png",
    galleryUrl: "/img/desktop-screen-senza-nature.jpg",
    date: { month: 9, year: 2024 },
    technologies: ["WordPress", "Woocommerce", "LiteSpeed Cache"],
    website: "https://senza-nature.com",
  },
  {
    id: "9",
    slug: "wagner-hamisky",
    clientType: "pme",
    clientName: "Wagner Hamisky",
    imageUrl: "/img/logo-wagner-hamisky.jpeg",
    galleryUrl: "/img/desktop-screen-wagner-hamisky.jpg",
    date: { month: 2, year: 2024 },
    technologies: ["WordPress", "Thème custom", "ACF Pro"],
    website: "https://wagner-hamisky.com",
    youtubeVideoId: "Zv7SUqZPo08",
  },
  {
    id: "10",
    slug: "mediatico",
    clientType: "ess",
    clientName: "Mediatico",
    imageUrl: "/img/logo-mediatico.png",
    galleryUrl: "/img/desktop-screen-mediatico.jpg",
    date: { month: 12, year: 2024 },
    technologies: ["WordPress", "Gutenberg", "Thème custom"],
    website: "https://mediatico.fr",
    youtubeVideoId: "2RfDio_6oQQ",
  },
  {
    id: "11",
    slug: "infralliance",
    clientType: "groupement",
    clientName: "Infralliance",
    imageUrl: "/img/logo-infralliance.png",
    galleryUrl: "/img/desktop-screen-infralliance.jpg",
    date: { month: 4, year: 2023 },
    technologies: ["WordPress", "Elementor Pro", "Advanced Custom Fields"],
    website: "https://infralliance.net",
    youtubeVideoId: "LtMBegTX06Q",
  },
  {
    id: "12",
    slug: "connexion-plus",
    clientType: "ess",
    clientName: "GEM Connexion",
    imageUrl: "/img/logo-connexion-plus.jpg",
    galleryUrl: "/img/desktop-screen-gem-connexion.jpg",
    date: { month: 5, year: 2022 },
    technologies: ["WordPress", "Thème communautaire", "Co-construction par ateliers"],
    website: "https://gem-connexion.fr",
  },
  {
    id: "13",
    slug: "sdevo",
    clientType: "institutionnel",
    clientName: "SDEVO",
    imageUrl: "/img/logo-sdevo.png",
    galleryUrl: "/img/desktop-screen-sdevo.png",
    date: { month: 8, year: 2024 },
    technologies: ["WordPress", "PHP", "Plugin custom"],
  },
];

// ─── French content ────────────────────────────────────────────────────────

const CONTENT_FR: Record<string, CaseStudyContent> = {
  "arguin-marine": {
    title: "Arguin Marine",
    description:
      "Création du site vitrine WordPress d'Arguin Marine, service de location de bateaux haut de gamme sur le Bassin d'Arcachon : une présence en ligne simple, soignée et facile à administrer.",
    detailedDescription: `Arguin Marine propose de la location de bateaux haut de gamme sur le Bassin d'Arcachon. L'entreprise avait besoin d'une présence en ligne simple et soignée, à la hauteur de son positionnement, pour présenter son activité et faciliter la prise de contact.\n\nJ'ai créé un site vitrine WordPress clair et épuré, qui met en avant l'offre de location, les bateaux et les informations pratiques, avec une prise de contact directe. Le site a été pensé pour rester facile à administrer côté client et pour bien se positionner sur les recherches locales (Bassin d'Arcachon, Arcachon, location de bateau).\n\nLe résultat est une vitrine professionnelle, responsive et rapide, qui donne à Arguin Marine une image à la hauteur de son positionnement haut de gamme et un canal de contact simple pour ses clients.`,
    objectives: [
      "Donner à Arguin Marine une présence en ligne simple, soignée et professionnelle",
      "Présenter l'offre de location de bateaux et les informations pratiques",
      "Faciliter la prise de contact avec les clients",
      "Livrer un site facile à administrer et optimisé pour les recherches locales",
    ],
    results: [
      "Site vitrine WordPress clair, épuré et responsive",
      "Offre de location et informations pratiques mises en avant",
      "Prise de contact directe pour les clients",
      "Site simple à administrer côté client",
    ],
    galleryAlt: "Site vitrine d'Arguin Marine, location de bateaux sur le Bassin d'Arcachon",
    tags: ["PME", "Nautisme", "Site vitrine", "WordPress"],
    duration: "3 semaines",
  },
  "peer-to-peer": {
    title: "Peer to Peer",
    description:
      "Création de Peer to Peer, une plateforme libre d'auto-observation et de soutien au rétablissement en santé mentale : 14 outils utilisables directement dans le navigateur, sans compte et sans aucune donnée envoyée.",
    detailedDescription: `Peer to Peer est une initiative à impact de Next Impact : mettre à disposition de toutes et tous, gratuitement, une boîte à outils d'auto-observation et de soutien au rétablissement en santé mentale, inspirée de la pair-aidance et de méthodes et guides existants. L'enjeu central : proposer des outils sensibles — questionnaires, échelles, parcours, carnets — dans un cadre qui protège absolument l'intimité des personnes.\n\nJ'ai conçu une application web pensée « local-first » : aucune création de compte, rien à installer, et surtout aucune donnée envoyée à un serveur. Toutes les saisies de la personne restent dans son propre navigateur, le temps de la session. Cette exigence de confidentialité a guidé toute l'architecture — le traitement se fait intégralement côté client, ce qui est à la fois un parti pris éthique et un gage de confiance pour un public vulnérable.\n\nLa plateforme regroupe 14 outils répartis en deux familles : 9 questionnaires et échelles d'auto-observation (Inventaire de Burns, échelle RAS, pensées négatives, attaques de panique, plan de crise…) et 5 parcours et carnets guidés (directives anticipées, composer avec la psychose, La Fleur de Patricia…). Trois portes d'entrée sont proposées — choisir directement un outil, suivre un parcours guidé, ou explorer librement — pour respecter le rythme de chacun.\n\nLe ton, sans jugement, et le cadrage sont soignés : les outils ne posent aucun diagnostic, ne remplacent pas un professionnel de santé et orientent vers les ressources d'aide. Le résultat est une plateforme sobre, rapide et rassurante, qui rend des outils de rétablissement accessibles à tous, sans barrière et sans collecte de données.`,
    objectives: [
      "Rendre accessibles, gratuitement et sans barrière, des outils d'auto-observation en santé mentale",
      "Garantir une confidentialité absolue : aucun compte, aucune donnée envoyée à un serveur",
      "Proposer plusieurs portes d'entrée (outil direct, parcours guidé, exploration libre) pour respecter le rythme de chacun",
      "Inscrire les outils dans un cadre responsable, sans diagnostic et orientant vers l'aide",
    ],
    results: [
      "14 outils d'auto-observation en accès libre (9 questionnaires/échelles, 5 parcours/carnets)",
      "Traitement 100 % local : les saisies restent dans le navigateur, aucune donnée transmise",
      "Aucun compte ni installation requis — une porte d'entrée immédiate",
      "Une expérience sobre et rassurante, adaptée à un public sensible",
    ],
    galleryAlt: "Plateforme Peer to Peer d'auto-observation en santé mentale",
    tags: ["Impact", "Santé mentale", "Web App", "Local-first", "Next.js"],
    duration: "1 mois",
  },
  "cafe-citoyen": {
    title: "Café citoyen",
    description:
      "Création du site vitrine du Café citoyen d'Auger-Saint-Vincent : un site WordPress Headless avec Next.js, pour promouvoir les événements et faciliter les réservations de cette association citoyenne.",
    detailedDescription: `Le Café citoyen d'Auger-Saint-Vincent, un lieu de rencontre et d'échange pour les citoyens, souhaitait créer un site vitrine pour promouvoir ses activités et faciliter la prise de contact. L'objectif était de créer un site moderne et fonctionnel qui reflète l'esprit convivial du café.\n\nJ'ai développé un site WordPress en mode Headless avec Next.js, offrant une expérience utilisateur fluide et rapide. Le design est épuré, mettant en avant les événements et les actualités du café.\n\nLe site comprend une section d'actualités régulièrement mise à jour, une page dédiée aux événements à venir et un formulaire de contact pour faciliter les réservations et les demandes d'information.`,
    objectives: [
      "Créer un site vitrine pour le Café citoyen d'Auger-Saint-Vincent",
      "Mettre en avant les événements et les actualités du café",
      "Faciliter la prise de contact et les réservations",
    ],
    results: [
      "Site vitrine moderne et épuré",
      "Section d'actualités et d'événements à jour",
      "Formulaire de contact fonctionnel",
    ],
    galleryAlt: "Page d'accueil du site Café citoyen",
    tags: ["Association", "WordPress", "Headless", "Next.js"],
    duration: "3 semaines",
  },
  "hermitage-jeu-de-piste": {
    title: "L'hermitage - Jeu de piste",
    description:
      "Création d'une application mobile (PWA) pour le domaine forestier du Tiers Lieu L'Hermitage. Une expérience ludique et géolocalisée, installable sur smartphone sans passer par les stores et fonctionnant sans connexion permanente.",
    detailedDescription: `Le Tiers Lieu L'Hermitage, un lieu de séjours sur-mesure pour entreprises et de rencontres situé dans un domaine forestier, souhaitait offrir aux équipes en séjour une expérience ludique et interactive pour découvrir le domaine. L'objectif : un jeu de piste mobile, fluide en pleine forêt, sans contrainte de téléchargement sur les stores ni dépendance à une connexion stable.\n\nJ'ai développé une Progressive Web App (PWA) avec Next.js : aucun serveur dédié, aucun compte à créer. L'application tourne entièrement sur le smartphone des visiteurs et s'installe d'un tap depuis le navigateur sur l'écran d'accueil iOS ou Android, en mode plein écran comme une vraie app.\n\nLa géolocalisation native du navigateur déclenche les énigmes contextuelles selon la position des joueurs dans le domaine. Toute la progression et les scores sont persistés localement sur l'appareil (LocalStorage / IndexedDB) — la partie reste exploitable même hors-ligne et reprend où elle s'est arrêtée.\n\nLe jeu a été un succès, avec un engagement accru des visiteurs et une expérience utilisateur fluide, immédiate et adaptée à un usage en pleine nature.`,
    objectives: [
      "Créer une application mobile pour explorer le domaine forestier du Tiers Lieu L'Hermitage",
      "Offrir une expérience ludique, géolocalisée et interactive aux visiteurs",
      "Permettre une installation sans store et un fonctionnement hors-ligne",
    ],
    results: [
      "Application mobile (PWA) installable sans passer par les stores iOS / Android",
      "Énigmes déclenchées par la géolocalisation des joueurs dans le domaine",
      "Progression et scores persistés localement, fonctionnement hors-ligne",
      "Visiteurs des séjours engagés dans la découverte active du domaine",
    ],
    arbitrage: {
      consideredOptions: [
        "Application native iOS/Android publiée sur les stores",
        "Site web mobile classique consulté dans le navigateur",
        "Progressive Web App (PWA) installable sans store",
      ],
      decision: "PWA Next.js, installable d'un tap depuis le navigateur, sans serveur dédié.",
      rationale:
        "Le natif imposait le coût et les délais de publication sur deux stores pour un usage événementiel ; le site web classique ne tenait pas le mode plein écran ni le hors-ligne en forêt. La PWA offre l'installation immédiate, la géolocalisation native et la persistance locale (LocalStorage / IndexedDB) — la partie continue même sans réseau.",
    },
    testimonial: {
      content:
        "Merci à Agathe pour son travail sérieux et créatif pour la création d'un jeu de piste sur le site du Tiers-Lieux l'Hermitage. C'était un plaisir de co-créer ce jeu de piste avec Agathe. Réactive, à l'écoute et très efficace dans nos échanges. Premier test avec 120 personnes.",
      author: "Charlotte Bourez",
      position: "Gérante du café associatif, L'Hermitage",
    },
    galleryAlt: "Application mobile de jeu de piste du domaine forestier du Tiers Lieu L'Hermitage",
    tags: ["ESS", "App mobile", "PWA", "Géolocalisation", "Gamification", "Hors-ligne"],
    duration: "4 semaines",
  },
  "comme-des-fous-jeux": {
    title: "Comme des fous - Jeux en ligne",
    description: "Jeux en ligne du média participatif Comme des fous",
    detailedDescription: `Comme des fous, un média participatif, souhaitait créer une section de jeux en ligne pour engager davantage ses lecteurs. L'objectif était d'offrir une expérience ludique et interactive tout en utilisant une architecture Headless pour garantir des performances optimales.\n\nNous avons développé une section de jeux en ligne intégrée au site WordPress en mode Headless avec Next.js. Les jeux sont conçus pour être engageants et interactifs, encourageant les lecteurs à passer plus de temps sur le site.\n\nLa section de jeux a été un succès, avec un engagement accru des lecteurs et une expérience utilisateur fluide et réactive.`,
    objectives: [
      "Créer une section de jeux en ligne pour engager les lecteurs",
      "Utiliser une architecture Headless pour une meilleure performance",
      "Offrir une expérience utilisateur ludique et interactive",
    ],
    results: [
      "Section de jeux en ligne intégrée avec succès",
      "Engagement accru des lecteurs avec les jeux",
      "Expérience utilisateur fluide et réactive",
    ],
    galleryAlt: "Jeux en ligne du média Comme des fous",
    tags: ["Média", "WordPress", "Headless", "Next.js"],
    duration: "15 jours",
  },
  "comme-des-fous": {
    title: "Comme des fous",
    description: "Site du média participatif Comme des fous",
    detailedDescription: `Comme des fous est un média participatif qui souhaitait moderniser son site web en adoptant une architecture Headless. L'objectif principal était d'améliorer l'expérience utilisateur tout en offrant des performances optimales.\n\nJ'ai migré le site existant vers une architecture Headless en utilisant WordPress comme CMS pour la gestion de contenu et Next.js pour le front-end. Cette approche a permis de séparer la gestion du contenu de l'affichage, offrant ainsi une plus grande flexibilité et des performances accrues.\n\nLe nouveau site offre une expérience utilisateur fluide et réactive, avec des temps de chargement considérablement réduits. De plus, les rédacteurs ont pu conserver exactement la même interface d'administration WordPress qu'ils connaissaient déjà, facilitant ainsi la transition.\n\nJ'ai également conservé tout le contenu existant et la structure du site WordPress, seul le front-end a changé, garantissant ainsi une continuité pour les lecteurs fidèles du média.`,
    objectives: [
      "Migrer le site existant vers une architecture Headless",
      "Améliorer les performances et la rapidité du site",
      "Offrir une meilleure expérience utilisateur",
    ],
    results: [
      "Temps de chargement de 56 à 98 sur PageSpeed Insights",
      "Expérience utilisateur fluide et réactive",
      "Interface d'administration inchangée pour les rédacteurs",
      "Récupération de tout le contenu existant du site WordPress",
    ],
    arbitrage: {
      consideredOptions: [
        "Refonte du thème WordPress classique (PHP)",
        "Réécriture complète hors WordPress (autre CMS ou sur-mesure)",
        "Migration vers WordPress headless : WordPress conservé en back-end, front Next.js",
      ],
      decision: "WordPress headless — WordPress conservé pour la rédaction, Next.js pour le rendu public.",
      rationale:
        "La rédaction maîtrisait l'admin WordPress et le site portait des années de contenu : en sortir aurait coûté une migration éditoriale complète et une re-formation de l'équipe. Une refonte de thème classique ne pouvait pas atteindre les performances visées. Le headless a permis les deux : interface d'administration inchangée, contenu intégralement conservé, et un score PageSpeed passé de 56 à 98.",
    },
    testimonial: {
      content:
        "Agathe a confirmé ses compétences sur WordPress Headless pour réaliser une refonte complète du site internet commedesfous.com avec une interface utilisateur compatible sur PC comme sur smartphone. Un design impeccable, une ergonomie sans comparaison, une vitesse d'affichage performante. Agathe est très à l'écoute, réactive et pointilleuse. Je recommande vivement.",
      author: "Joan Sidawy",
      position: "Architecte & Community Manager, Comme des Fous",
    },
    galleryAlt: "Comme des fous",
    tags: ["Média", "WordPress", "Headless", "Next.js"],
    duration: "2 mois",
  },
  "next-event": {
    title: "Next Event - Démo WordPress Headless",
    description: "Site de démonstration pour une billetterie événementielle.",
    detailedDescription:
      "Next Event est un site de démonstration conçu pour présenter une solution de billetterie événementielle utilisant WordPress en mode Headless. Le site met en avant les événements à venir, permet la gestion des billets et offre une expérience utilisateur optimale.\n\nJ'ai développé un site WordPress en Headless avec Next.js, permettant une expérience utilisateur fluide et rapide. Le design est épuré, mettant en avant les événements et facilitant la navigation.\n\nLe site comprend un système d'agenda pour les événements, une billetterie intégrée et des pages dédiées pour chaque événement.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, afin d'attirer un maximum de visiteurs et de promouvoir les événements efficacement.",
    objectives: [
      "Présenter les événements de manière professionnelle",
      "Faciliter la gestion des billets et inscriptions",
      "Offrir une expérience utilisateur fluide et rapide",
    ],
    results: [
      "Système d'agenda et de gestion des événements fonctionnel",
      "Intégration d'une billetterie fonctionnelle",
      "Navigation fluide et responsive",
    ],
    galleryAlt: "Page d'accueil du site Next Event",
    tags: ["Evénementiel", "WordPress", "Headless", "Next.js"],
    duration: "3 semaines",
  },
  "les-etats-generaux-communaux": {
    title: "Les Etats Généraux Communaux",
    description: "Site vitrine des Etats Généraux Communaux",
    detailedDescription:
      "Les Etats Généraux Communaux est un site vitrine conçu pour promouvoir un événement citoyen visant à encourager la participation locale. Le site met en avant les ressources, les actualités et facilite la constitution des groupes locaux.\n\nJ'ai développé un site WordPress en Headless avec Next.js, permettant une expérience utilisateur fluide et rapide. Le design est épuré, mettant en avant l'événement et ses objectifs.\n\nLe site comprend une section de ressources téléchargeables, un calendrier des événements et une carte interactive des groupes locaux constitués.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, afin d'attirer un maximum de visiteurs et de sensibiliser le public à l'initiative.",
    objectives: [
      "Présenter l'événement de manière professionnelle",
      "Faciliter la constitution des groupes locaux",
      "Mettre en avant les ressources et les actualités",
    ],
    results: [
      "Mise en ligne du site avant la date de l'événement",
      "Augmentation du nombre de groupes locaux constitués",
      "Navigation fluide et responsive",
    ],
    galleryAlt: "Page d'accueil du site Les Etats Généraux Communaux",
    tags: ["Association", "WordPress", "Headless", "Next.js"],
    duration: "4 semaines",
  },
  "panorama-pub": {
    title: "Panorama Pub",
    description:
      "Lancement de Panorama Pub, premier annuaire en ligne dédié aux fournisseurs d'objets publicitaires : un nouveau marché digital pour connecter acheteurs et fournisseurs sur un secteur encore éclaté.",
    detailedDescription: `Le marché des objets publicitaires reste l'un des derniers secteurs B2B sans plateforme de référence : les acheteurs (agences de communication, services marketing, événementiel) doivent encore composer avec des recherches éclatées, des bases incomplètes et des heures perdues à identifier le bon fournisseur. Panorama Pub est né de ce constat : créer l'annuaire qui n'existe pas encore et s'imposer comme la référence digitale du secteur.\n\nJ'ai accompagné le projet du concept à la mise en ligne : structuration de la base fournisseurs, parcours utilisateur orienté efficacité de sourcing, fiches fournisseurs riches et lisibles, recherche performante, et back-office permettant d'enrichir le catalogue en toute autonomie. L'enjeu n'était pas seulement de livrer un site, mais de poser les fondations d'un produit destiné à grandir : SEO solide pour capter une demande encore non adressée, performances optimales pour un référencement durable, architecture évolutive pour absorber l'ajout de milliers de fiches et de futures fonctionnalités (espaces fournisseurs, mise en relation, contenus éditoriaux).\n\nLivré en 2 mois, Panorama Pub est aujourd'hui en ligne et prêt à conquérir son marché : un positionnement de pionnier, une plateforme déjà solide, et une feuille de route claire pour devenir l'incontournable du sourcing d'objets publicitaires en France.`,
    objectives: [
      "Occuper un marché vacant en créant la référence digitale du secteur des objets publicitaires",
      "Centraliser une offre fournisseurs aujourd'hui dispersée et difficile à comparer",
      "Faire gagner un temps précieux aux acheteurs (agences, services com', marketing) dans leur sourcing",
      "Offrir aux fournisseurs une visibilité qualifiée auprès d'une cible B2B engagée",
      "Poser une fondation technique capable d'absorber la croissance du catalogue et du trafic",
    ],
    results: [
      "Plateforme inédite sur son segment : aucun équivalent existant sur le marché français",
      "Sourcing fournisseurs simplifié : recherche, filtrage et comparaison en quelques clics",
      "Catalogue évolutif : ajout, mise à jour et enrichissement des fiches fournisseurs en autonomie",
      "Architecture pensée pour le SEO et la croissance : prête à monter en charge",
      "Mise en ligne en 2 mois, du concept à la production",
    ],
    arbitrage: {
      consideredOptions: [
        "Annuaire sur WordPress + plugin directory",
        "Solution no-code (type Webflow + base externe)",
        "Application sur-mesure Next.js + PostgreSQL",
      ],
      decision: "Application sur-mesure Next.js + PostgreSQL avec back-office dédié.",
      rationale:
        "Un annuaire destiné à absorber des milliers de fiches et des fonctionnalités produit (espaces fournisseurs, mise en relation) dépasse ce qu'un plugin WordPress ou une stack no-code tiennent sans dette : requêtes structurées, recherche performante et SEO programmatique exigeaient une base relationnelle et un rendu contrôlé. Le sur-mesure posait la fondation évolutive dès le lancement — livré en 2 mois.",
    },
    testimonial: {
      content:
        "Agathe est très pro, réactive et se met à la portée du client même sur les sujets techniques, je recommande !",
      author: "Benoit Huberd",
      position: "Fondateur, Panorama Pub",
    },
    galleryAlt: "Annuaire en ligne Panorama Pub",
    tags: ["PME", "Annuaire B2B", "Marketplace", "Lancement produit"],
    duration: "2 mois",
  },
  proditec: {
    title: "Proditec",
    description:
      "Refonte du site vitrine pour une entreprise de l'industrie robotique internationale.",
    detailedDescription: `Proditec, une entreprise spécialisée dans la robotique industrielle, avait besoin d'une refonte complète de son site web pour refléter son travail et sa reconnaissance internationale. Leur ancien site était obsolète, difficile à naviguer et à administrer et ne prenait pas en charge le multilingue.\n\nJ'ai créé un site WordPress avec un design responsive et une interface utilisateur et administrateur technique et efficace pour être utilisées par tous. Le site est entièrement multilingue grâce à l'intégration de Polylang, permettant aux visiteurs de choisir leur langue préférée.\n\nLe nouveau site met en avant les produits phares de Proditec avec des détails précis sur leurs machines. Des optimisations techniques ont été mises en place pour améliorer la vitesse de chargement du site, ce qui a permis d'atteindre un score PageSpeed de 98 sur mobile et desktop.`,
    objectives: [
      "Améliorer l'expérience mobile",
      "Gérer le contenu multilingue",
      "Optimiser la vitesse de chargement du site",
    ],
    results: [
      "Amélioration du score d'accessibilité de 30%",
      "Prise en charge de 5 langues",
      "Amélioration du score PageSpeed de 45 à 98",
    ],
    testimonial: {
      content:
        "J'ai eu le plaisir de collaborer avec Agathe pour la refonte de notre site multilingue, et je ne peux que recommander ses services. Agathe se distingue par sa capacité à comprendre rapidement les enjeux business et à les traduire en solutions techniques efficaces. Pour notre projet, elle a su créer une landing page sur mesure qui reflète parfaitement notre identité de marque, tout en intégrant un système multilingue fluide et intuitif.",
      author: "Christophe Riboulet",
      position: "PDG, Proditec",
    },
    galleryAlt: "Page d'accueil du site Proditec",
    tags: ["Corporate", "WordPress", "Polylang"],
    duration: "1 mois",
  },
  doleances: {
    title: "Association des Doléances",
    description:
      "Création d'un site vitrine inspiré de Wikipédia destiné à promouvoir l'action de l'association.",
    detailedDescription:
      "L'association Les Doléances, nouvellement créée a pour vocation de mettre à disposition des citoyens les Doléances de 2018-2019. Pour évoquer l'esprit communautaire et participatif, ainsi que la liberté d'accès à l'information, un template très largement inspiré de Wikipédia a été choisi.\n\nLe site est construit sur WordPress en Headless avec Next.js, permettant une expérience utilisateur fluide et rapide. Le design est épuré, mettant en avant l'action et la démarche.\n\nLe site comprend une cartographie de ses groupes locaux et une section d'articles catégorisés.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, afin d'attirer un maximum de visiteurs et de sensibiliser le public aux actions de l'association.",
    objectives: [
      "Présenter les actions et les projets de l'association",
      "S'inspirer de Wikipédia pour communiquer l'idée de participation libre",
      "Inciter à l'engagement citoyen",
    ],
    results: [
      "Cartographie interactive des groupes locaux",
      "Section Agenda pour les événements",
      "Administration simplifiée via WordPress en Headless",
    ],
    galleryAlt: "Page d'accueil du site Les Doléances",
    tags: ["WordPress", "Next.js", "Association"],
    duration: "2 mois",
  },
  sowee: {
    title: "Sowee",
    description:
      "Création d'une section blog pour le portail de l'entreprise Sowee, spécialisée dans les solutions énergétiques.",
    detailedDescription:
      "Sowee, une entreprise spécialisée dans les solutions énergétiques, souhaitait créer une section blog pour son portail Drupal tout en utilisant WordPress. L'objectif était de fournir un espace où l'équipe marketing pourrait publier des articles sur les tendances du secteur, les innovations et les conseils pour les consommateurs.\n\nJ'ai développé un thème WordPress personnalisé en respectant les maquettes fournies par l'équipe marketing. Le design est moderne et épuré, avec une navigation intuitive pour les lecteurs.\n\nLa section blog permet à l'équipe de publier facilement des articles, d'ajouter des images et de gérer les catégories.",
    objectives: [
      "Créer un thème WordPress personnalisé pour le blog",
      "Respecter les maquettes fournies par l'équipe marketing",
      "Réaliser le projet dans un délai de 10 jours",
    ],
    results: [
      "Intégration réussie du thème personnalisé",
      "Respect des maquettes et de l'identité visuelle",
      "Tenue du délai de 10 jours",
      "Administration simplifiée pour l'équipe marketing",
    ],
    galleryAlt: "Interface de la section blog Sowee",
    tags: ["WordPress", "Blog", "Thème custom"],
    duration: "5 jours",
  },
  "salon-de-la-carrosserie": {
    title: "Salon de la Carrosserie 2024",
    description:
      "Création d'un site vitrine pour le Salon de la Carrosserie 2024, avec un design moderne et un espace d'inscription pour exposants.",
    detailedDescription:
      "Le Salon de la Carrosserie, un événement majeur pour les professionnels du secteur, avait besoin d'un site vitrine pour promouvoir l'événement et faciliter l'inscription des exposants. L'objectif était de créer un site moderne et fonctionnel qui reflète l'importance de l'événement.\n\nJ'ai développé un site WordPress avec un design épuré et une navigation intuitive. La page d'accueil présente les informations clés sur l'événement, les exposants et les partenaires.\n\nUn espace d'inscription pour les exposants a été mis en place, permettant aux entreprises de s'inscrire facilement et de gérer leurs disponibilités. Le site est entièrement responsive et optimisé pour le référencement naturel.",
    objectives: [
      "Communiquer sur l'événement et ses exposants",
      "Créer un espace d'inscription pour les exposants",
      "Mettre en avant les partenaires et sponsors",
      "Optimiser le référencement naturel pour attirer les visiteurs",
      "Faciliter la navigation et l'accès aux informations",
    ],
    results: [
      "Informations claires sur l'événement et les exposants",
      "Espace d'inscription pour les exposants avec gestion des disponibilités",
      "Partenaires et sponsors mis en avant sur la page d'accueil",
    ],
    testimonial: {
      content:
        "Du professionnalisme, un réel esprit d'initiative, le sens du conseil et une réactivité totale ! Ajouter un bon état d'esprit d'une personne qui n'hésite pas à « dépasser » la charge de travail et sa fonction pour améliorer la qualité de la prestation.",
      author: "Luc Poigniez",
      position: "Fondateur, Agence Créaclic",
    },
    galleryAlt: "Page d'accueil du site Salon de la Carrosserie",
    tags: ["WordPress", "Evénementiel", "Espace membres"],
    duration: "15 jours",
  },
  hermitage: {
    title: "Tiers Lieu L'Hermitage",
    description:
      "Refonte progressive à la marge du site vitrine du Tiers Lieu L'Hermitage.",
    detailedDescription:
      "Le Tiers Lieu L'Hermitage, un espace collaboratif d'innovation rurale, souhaitait moderniser son site vitrine tout en conservant son identité. Le site existant était construit avec Divi, ce qui posait des problèmes de performance et de stabilité.\n\nJ'ai entrepris une refonte progressive du site en passant à Elementor, un constructeur de pages plus performant et flexible. Le design a été modernisé pour refléter l'identité du Tiers Lieu tout en restant fidèle à ses valeurs.\n\nDes fonctionnalités ont été ajoutées pour faciliter les dons récurrents et les dons dédiés à des projets spécifiques. Le site est désormais stable, rapide et facile à administrer.",
    objectives: [
      "Passer du builder Divi à Elementor pour une meilleure performance",
      "Passer à un design moderne et épuré dans la continuité",
      "Faciliter les dons récurrents et les dons dédiés à des projets spécifiques",
      "Stabiliser le site pour éviter les bugs récurrents",
    ],
    results: [
      "Passage réussi de Divi à Elementor avec une meilleure performance",
      "Design plus moderne et épuré qui reflète l'identité du Tiers Lieu",
      "Facilitation des dons récurrents et des dons dédiés",
      "Stabilisation du site avec une réduction significative des bugs",
      "Hausse des performances du site avec gain de 30pt sur le score PageSpeed",
    ],
    testimonial: {
      content:
        "Agathe est une remarquable professionnelle, très compétente sur les questions techniques, la veille quant à l'évolution des technologies, et systèmes. Egalement capable de donner des conseils stratégiques, sur le fond et la forme des contenus, Agathe est très attentive aux besoins exprimés, en amont comme dans la réalisation des missions convenues, elle est très réactive pendant l'exécution des missions. Je recommande sans réserves.",
      author: "Jean Karinthi",
      position: "Fondateur, Tiers Lieu L'Hermitage",
    },
    galleryAlt: "Page d'accueil du site Tiers Lieu L'Hermitage",
    tags: ["Refonte", "Impact", "WordPress"],
    duration: "1 mois",
  },
  "erp-services": {
    title: "ERP Services",
    description:
      "Refonte à l'identique du site vitrine d'ERP Services, bureau d'études en ingénierie.",
    detailedDescription:
      "ERP Services, un bureau d'études en ingénierie, avait besoin d'une refonte de son site vitrine pour améliorer la performance et la sécurité tout en conservant l'identité visuelle existante. Le site devait également être plus facile à administrer pour l'équipe interne.\n\nJ'ai réalisé une refonte à l'identique du site existant, en améliorant les performances et la sécurité. Le design a été légèrement revu pour une meilleure lisibilité et une navigation intuitive.\n\nLe site met en avant les projets phares d'ERP Services avec des descriptions détaillées et des photos de haute qualité. Des moyens de contact ont été développés pour faciliter la prise de contact avec les clients potentiels.",
    objectives: [
      "Renover le site vitrine existant",
      "Améliorer la performance et la sécurité",
      "Revoir marginalement le design",
      "Organiser le contenu pour une meilleure lisibilité",
    ],
    results: [
      "Passage des performances de 45 à 99 sur mobile",
      "Mise en avant des projets phares",
      "Développement des moyens de contact",
      "Amélioration de la sécurité du site",
    ],
    galleryAlt: "Page de service du site ERP Services",
    tags: ["WordPress", "Site vitrine", "Refonte"],
    duration: "2 semaines",
  },
  "senza-nature": {
    title: "Senza Nature",
    description:
      "Création d'un site e-commerce pour la vente de produits naturels et bio.",
    detailedDescription:
      "Senza Nature, une entreprise spécialisée dans la vente de produits naturels et bio, avait besoin d'un support et suivi global du site e-commerce pour vendre ses produits en ligne. L'objectif était de maintenir une boutique en ligne stable et performante tout en réalisant des évolutions continues.\n\nJ'ai mis en place un suivi global du site, en assurant la maintenance, les mises à jour et les évolutions nécessaires. Le site est construit sur WooCommerce, permettant une gestion facile des produits et des commandes.\n\nDes optimisations techniques ont été mises en place pour améliorer la vitesse de chargement du site, ce qui a permis d'atteindre un score PageSpeed élevé sur mobile et desktop.",
    objectives: [
      "Maintenir une boutique en ligne pour vendre des produits naturels",
      "Réaliser les évolutions du site en continu",
      "Optimiser les performances du site",
    ],
    results: [
      "Stabilisation du site avec une réduction significative des bugs",
      "Amélioration de la vitesse de chargement du site",
    ],
    testimonial: {
      content:
        "Nous travaillons exclusivement avec Agathe depuis plusieurs mois. Très pro, rapide et pédagogue, elle est aussi de très bon conseil ! Notre site est entre de bonnes mains, et nous la recommandons vivement !",
      author: "Laura Schorestene",
      position: "Fondatrice, Senza Nature",
    },
    galleryAlt: "Page d'accueil du site Senza Nature",
    tags: ["Ecommerce", "Woocommerce", "WordPress"],
    duration: "depuis 2024",
  },
  "wagner-hamisky": {
    title: "Wagner Hamisky",
    description:
      "Création d'un site vitrine pour la galerie d'art Wagner Hamisky.",
    detailedDescription:
      "Wagner Hamisky, une galerie d'art spécialisée dans la restauration d'œuvres d'art, souhaitait créer un site vitrine pour présenter ses artistes et leurs œuvres, à l'occasion de son ouverture. L'objectif était de fournir un espace d'exposition tout en facilitant la prise de contact avec les clients potentiels.\n\nJ'ai développé un site WordPress avec un design moderne et épuré, mettant en avant les œuvres des deux artistes. Le site comprend une galerie d'images et des descriptions détaillées des œuvres.\n\nLe site est entièrement optimisé pour une gestion simple du catalogue des œuvres afin de permettre l'autonomie ultérieure.",
    objectives: [
      "Présenter les œuvres des artistes et de la galerie",
      "Créer un espace de gestion des œuvres simple et efficace",
      "Faciliter la prise de contact pour les acheteurs potentiels",
    ],
    results: [
      "Site vitrine moderne et épuré",
      "Espace d'exposition des œuvres",
      "Descriptions détaillées des œuvres",
      "Facilitation de la prise de contact avec les acheteurs",
    ],
    galleryAlt: "Page d'accueil du site Wagner Hamisky",
    tags: ["WordPress", "Galerie d'art", "Site vitrine"],
    duration: "3 semaines",
  },
  mediatico: {
    title: "Mediatico",
    description:
      "Création d'un Média en ligne pour Mediatico, toute l'actualité de l'ESS.",
    detailedDescription:
      "Mediatico, un média en ligne dédié à l'actualité de l'économie sociale et solidaire, souhaitait refondre son média pour présenter ses articles et ses partenaires. L'objectif était de fournir un espace d'information accessible et attrayant pour les lecteurs.\n\nJ'ai développé un site WordPress avec un design moderne et une navigation intuitive. Le site met en avant les articles récents, les partenaires et sponsors, ainsi qu'un espace dédié aux publications des visiteurs.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, permettant à Mediatico d'attirer un large public intéressé par l'ESS.",
    objectives: [
      "Moderniser le thème WordPress existant",
      "Améliorer l'expérience utilisateur",
      "Permettre la publication d'articles par les visiteurs",
    ],
    results: [
      "Site moderne et professionnel",
      "Espace dédié aux partenaires et sponsors",
      "Stabilisation du site avec une réduction significative des bugs",
    ],
    galleryAlt: "Page d'accueil du site Mediatico",
    tags: ["WordPress", "Media en ligne", "Full Site Editing"],
    duration: "4 semaines",
  },
  infralliance: {
    title: "Infralliance",
    description:
      "Création d'un site vitrine pour Infralliance, Think and Do Thank des opérateurs d'infrastructures numériques.",
    detailedDescription:
      "Infralliance, un think and do tank des opérateurs d'infrastructures numériques, souhaitait créer un site vitrine pour présenter ses actions et ses membres.\n\nJ'ai développé un site WordPress avec un design épuré et une navigation intuitive. Le site met en avant les actions de l'association, ainsi que son réseau d'opérateurs d'infrastructures numériques.\n\nLe site a été mis en ligne avant l'événement de lancement de l'association, permettant à Infralliance de communiquer efficacement sur ses enjeux et ses projets.",
    objectives: [
      "Présenter les actions et les projets de l'association",
      "Mettre en avant le réseau des opérateurs d'infrastructures numériques",
      "Communiquer sur les enjeux de l'infrastructure numérique",
    ],
    results: [
      "Site vitrine moderne et professionnel",
      "Mise en ligne avant l'événement de lancement de l'association",
      "Simple à administrer pour l'équipe interne",
    ],
    galleryAlt: "Page d'accueil du site Connexion Plus",
    tags: ["WordPress", "Advanced Custom Fields", "Elementor Pro"],
    duration: "2 semaines",
  },
  "connexion-plus": {
    title: "GEM Connexion",
    description:
      "Création d'un site vitrine pour le GEM Connexion Plus, association socio-culturelle parisienne.",
    detailedDescription:
      "GEM Connexion Plus, un groupe d'entraide mutuelle (GEM) parisien, souhaitait créer un site vitrine pour donner de la visibilité à ses activités et à ses projets. L'objectif était de fournir un espace professionnel et moderne pour attirer de nouveaux membres et partenaires.\n\nJ'ai développé un site WordPress avec un design épuré et une navigation intuitive. Le site met en avant les activités du GEM, ainsi que les projets en cours.\n\nUn espace dédié aux membres a été intégré, permettant à chacun de publier ses actualités et de partager ses expériences. Le site est entièrement responsive et optimisé pour le référencement naturel.",
    objectives: [
      "Donner de la visibilité à GEM Connexion aux partenaires et au public",
      "Permettre aux membres de l'association de publier leur actualité",
      "Rendre accessible les informations sur les activités et les projets",
    ],
    results: [
      "Site vitrine moderne et professionnel",
      "Espace dédié aux membres pour publier des actualités",
      "Facilitation de la prise de contact pour les partenaires et le public",
    ],
    galleryAlt: "Page d'accueil du site GEM Connexion",
    tags: ["WordPress", "Site vitrine", "Association"],
    duration: "4 semaines",
  },
  sdevo: {
    title: "SDEVO",
    description:
      "Création d'un plugin de gestion des demandes de subventions pour le Syndicat départemental des énergies du Val d'Oise.",
    detailedDescription:
      "Le Syndicat départemental des énergies du Val d'Oise (SDEVO) souhaitait créer un plugin WordPress pour gérer les demandes de subventions des communes. L'objectif était de permettre aux communes de soumettre leurs demandes en ligne et de faciliter le suivi pour le SDEVO.\n\nJ'ai développé un plugin personnalisé qui permet aux communes de soumettre leurs demandes de subventions via une interface utilisateur intuitive. Le plugin gère également le suivi des demandes, permettant au SDEVO de centraliser et de suivre les demandes de manière efficace.\n\nLe plugin est entièrement intégré à WordPress, ce qui permet une gestion facile et une administration simplifiée pour les utilisateurs du SDEVO.",
    objectives: [
      "Permettre aux communes de soumettre des demandes de subventions en ligne",
      "Gérer les demandes de subventions de manière centralisée",
      "Faciliter le suivi des demandes pour les communes et le SDEVO",
    ],
    results: [
      "Plugin WordPress personnalisé pour la gestion des subventions",
      "Interface utilisateur intuitive pour les communes",
      "Suivi des demandes de subventions simplifié pour le SDEVO",
    ],
    galleryAlt: "Page de gestion des subventions du SDEVO",
    tags: ["WordPress", "Plugin custom", "Gestion des subventions"],
    duration: "3 semaines",
  },
};

// ─── English content ───────────────────────────────────────────────────────

const CONTENT_EN: Record<string, CaseStudyContent> = {
  "arguin-marine": {
    title: "Arguin Marine",
    description:
      "Built the WordPress brochure site for Arguin Marine, a high-end boat-rental service on the Arcachon Basin: a simple, polished online presence that's easy to manage.",
    detailedDescription: `Arguin Marine offers high-end boat rentals on the Arcachon Basin. The business needed a simple, polished online presence — one that matched its positioning — to showcase its activity and make it easy to get in touch.\n\nI built a clean, uncluttered WordPress brochure site that puts the rental offer, the boats and the practical information front and centre, with a direct way to make contact. The site was designed to stay easy for the client to administer and to rank well on local searches (Arcachon Basin, Arcachon, boat rental).\n\nThe result is a professional, responsive and fast brochure site that gives Arguin Marine an image worthy of its high-end positioning and a simple contact channel for its customers.`,
    objectives: [
      "Give Arguin Marine a simple, polished and professional online presence",
      "Showcase the boat-rental offer and the practical information",
      "Make it easy for customers to get in touch",
      "Deliver a site that's easy to administer and optimized for local searches",
    ],
    results: [
      "Clean, uncluttered and responsive WordPress brochure site",
      "Rental offer and practical information put front and centre",
      "Direct contact channel for customers",
      "Site that's simple for the client to administer",
    ],
    galleryAlt: "Arguin Marine brochure site, boat rental on the Arcachon Basin",
    tags: ["SMB", "Boating", "Brochure site", "WordPress"],
    duration: "TBD",
  },
  "peer-to-peer": {
    title: "Peer to Peer",
    description:
      "Built Peer to Peer, a free self-observation and mental-health recovery support platform: 14 tools that run right in the browser, with no account and no data ever sent.",
    detailedDescription: `Peer to Peer is an impact initiative by Next Impact: to give everyone free access to a toolbox for self-observation and mental-health recovery support, drawing on peer support and on existing methods and guides. The core challenge: offering sensitive tools — questionnaires, scales, pathways, journals — within a framework that absolutely protects people's privacy.\n\nI built a "local-first" web application: no account to create, nothing to install, and above all no data sent to any server. Everything a person enters stays in their own browser, for the duration of the session. This privacy requirement shaped the entire architecture — all processing happens client-side, which is both an ethical stance and a mark of trust for a vulnerable audience.\n\nThe platform brings together 14 tools in two families: 9 self-observation questionnaires and scales (Burns Inventory, RAS scale, negative thoughts, panic attacks, crisis plan…) and 5 guided pathways and journals (advance directives, living with psychosis, La Fleur de Patricia…). Three entry points are offered — pick a tool directly, follow a guided pathway, or explore freely — to respect each person's pace.\n\nThe non-judgmental tone and careful framing matter: the tools make no diagnosis, don't replace a healthcare professional and point users toward support resources. The result is a calm, fast and reassuring platform that makes recovery tools accessible to everyone, with no barriers and no data collection.`,
    objectives: [
      "Make mental-health self-observation tools freely accessible, with no barriers",
      "Guarantee absolute privacy: no account, no data sent to any server",
      "Offer several entry points (direct tool, guided pathway, free exploration) to respect each person's pace",
      "Frame the tools responsibly — no diagnosis, with signposting to support",
    ],
    results: [
      "14 freely accessible self-observation tools (9 questionnaires/scales, 5 pathways/journals)",
      "100% local processing: entries stay in the browser, no data transmitted",
      "No account or installation required — an immediate entry point",
      "A calm, reassuring experience suited to a sensitive audience",
    ],
    galleryAlt: "Peer to Peer mental-health self-observation platform",
    tags: ["Impact", "Mental health", "Web App", "Local-first", "Next.js"],
    duration: "TBD",
  },
  "cafe-citoyen": {
    title: "Café Citoyen",
    description:
      "Brochure site for the Café Citoyen of Auger-Saint-Vincent: a Headless WordPress site with Next.js, to promote events and make booking easier for this community-driven non-profit.",
    detailedDescription: `The Café Citoyen of Auger-Saint-Vincent, a meeting place for citizens, wanted a brochure site to promote its activities and make contact easier. The goal was to create a modern, functional site that reflects the friendly spirit of the café.\n\nI built a Headless WordPress site with Next.js, delivering a smooth, fast user experience. The design is clean, putting events and news front and centre.\n\nThe site includes a regularly updated news section, a dedicated page for upcoming events, and a contact form to streamline reservations and enquiries.`,
    objectives: [
      "Build a brochure site for the Café Citoyen of Auger-Saint-Vincent",
      "Showcase the café's events and news",
      "Make it easy to get in touch and book",
    ],
    results: [
      "Modern, clean brochure site",
      "Up-to-date news and events section",
      "Working contact form",
    ],
    galleryAlt: "Café Citoyen homepage",
    tags: ["Non-profit", "WordPress", "Headless", "Next.js"],
    duration: "3 weeks",
  },
  "hermitage-jeu-de-piste": {
    title: "L'Hermitage – Treasure Hunt",
    description:
      "A mobile application (PWA) for the woodland estate of Tiers Lieu L'Hermitage. A playful, geolocated experience, installable on smartphones without app stores and working without a permanent connection.",
    detailedDescription: `Tiers Lieu L'Hermitage — a tailor-made retreat venue for companies and gatherings, set in a woodland estate — wanted to give teams on corporate retreats a playful, interactive way to explore the grounds. The goal: a mobile treasure hunt that runs smoothly deep in the forest, with no app-store download and no dependency on a stable connection.\n\nI built a Progressive Web App (PWA) with Next.js: no dedicated server, no account required. The app runs entirely on the visitor's smartphone and can be installed with a single tap from the browser onto the iOS or Android home screen, in full-screen mode like a native app.\n\nThe browser's native geolocation API triggers contextual riddles depending on where the players are in the estate. Progress and scores are persisted locally on the device (LocalStorage / IndexedDB) — the game stays playable offline and resumes exactly where it was left.\n\nThe game has been a hit, with stronger visitor engagement and a smooth, immediate user experience suited to outdoor use.`,
    objectives: [
      "Build a mobile application to explore the L'Hermitage woodland estate",
      "Deliver a playful, geolocated and interactive experience for visitors",
      "Enable store-free installation and offline operation",
    ],
    results: [
      "Mobile app (PWA) installable without going through iOS / Android stores",
      "Riddles triggered by the players' geolocation across the estate",
      "Progress and scores persisted locally, offline operation",
      "Retreat visitors actively engaged in exploring the estate",
    ],
    arbitrage: {
      consideredOptions: [
        "Native iOS/Android app published on the stores",
        "Classic mobile website used in the browser",
        "Progressive Web App (PWA), installable without stores",
      ],
      decision: "Next.js PWA, installable in one tap from the browser, no dedicated server.",
      rationale:
        "Native meant the cost and delays of publishing on two stores for an event-driven use case; a classic website couldn't deliver full-screen mode or offline play deep in the forest. The PWA provides instant installation, native geolocation and local persistence (LocalStorage / IndexedDB) — the game keeps running without network.",
    },
    testimonial: {
      content:
        "Thank you Agathe for the serious, creative work on the treasure hunt for the Tiers-Lieu L'Hermitage site. Co-creating this game with her was a pleasure — responsive, attentive and very efficient throughout. First test run with 120 people.",
      author: "Charlotte Bourez",
      position: "Community café manager, L'Hermitage",
    },
    galleryAlt: "Mobile treasure hunt application for the Tiers Lieu L'Hermitage woodland estate",
    tags: ["Social economy", "Mobile app", "PWA", "Geolocation", "Gamification", "Offline"],
    duration: "4 weeks",
  },
  "comme-des-fous-jeux": {
    title: "Comme des Fous – Online Games",
    description: "Online games for the participatory media outlet Comme des Fous",
    detailedDescription: `Comme des Fous, a participatory media outlet, wanted an online games section to drive deeper reader engagement. The goal was a playful, interactive experience on a Headless architecture for top-tier performance.\n\nWe built an online games section integrated into the Headless WordPress site with Next.js. The games are engaging and interactive, encouraging readers to spend more time on the site.\n\nThe games section has been a success, with stronger reader engagement and a smooth, responsive user experience.`,
    objectives: [
      "Build an online games section to engage readers",
      "Use a Headless architecture for better performance",
      "Deliver a playful, interactive user experience",
    ],
    results: [
      "Games section successfully integrated",
      "Stronger reader engagement with the games",
      "Smooth, responsive user experience",
    ],
    galleryAlt: "Online games on the Comme des Fous media outlet",
    tags: ["Media", "WordPress", "Headless", "Next.js"],
    duration: "15 days",
  },
  "comme-des-fous": {
    title: "Comme des Fous",
    description: "The website of the participatory media outlet Comme des Fous",
    detailedDescription: `Comme des Fous is a participatory media outlet that wanted to modernize its website by adopting a Headless architecture. The main goal was to improve the user experience while delivering top-tier performance.\n\nI migrated the existing site to a Headless architecture using WordPress as the content CMS and Next.js for the front end. This decoupling separated content management from rendering, unlocking far more flexibility and a major performance boost.\n\nThe new site delivers a smooth, responsive experience with drastically reduced load times. Editors kept exactly the same WordPress admin interface they were already used to, making the transition seamless.\n\nI also preserved all of the existing content and the WordPress site structure — only the front end changed — ensuring continuity for the outlet's loyal readers.`,
    objectives: [
      "Migrate the existing site to a Headless architecture",
      "Improve site performance and speed",
      "Deliver a better user experience",
    ],
    results: [
      "Load-time score from 56 to 98 on PageSpeed Insights",
      "Smooth, responsive user experience",
      "Editors' admin interface unchanged",
      "All existing WordPress content preserved",
    ],
    arbitrage: {
      consideredOptions: [
        "Rebuilding the classic WordPress (PHP) theme",
        "Full rewrite off WordPress (another CMS or custom build)",
        "Migrating to headless WordPress: WordPress kept as back-end, Next.js front",
      ],
      decision: "Headless WordPress — WordPress kept for the editorial team, Next.js for the public site.",
      rationale:
        "The editorial team knew the WordPress admin inside out and the site carried years of content: leaving WordPress meant a full editorial migration and retraining. A classic theme rebuild couldn't reach the performance targets. Headless delivered both: admin unchanged, all content preserved, and a PageSpeed score up from 56 to 98.",
    },
    testimonial: {
      content:
        "Agathe confirmed her Headless WordPress skills with a complete rebuild of commedesfous.com, with a user interface that works as well on desktop as on smartphone. Impeccable design, unmatched ergonomics, fast page loads. Agathe is attentive, responsive and meticulous. I highly recommend her.",
      author: "Joan Sidawy",
      position: "Architect & Community Manager, Comme des Fous",
    },
    galleryAlt: "Comme des Fous",
    tags: ["Media", "WordPress", "Headless", "Next.js"],
    duration: "2 months",
  },
  "next-event": {
    title: "Next Event – Headless WordPress Demo",
    description: "Demo site for an event ticketing platform.",
    detailedDescription:
      "Next Event is a demo site built to showcase an event ticketing solution running on Headless WordPress. The site highlights upcoming events, handles ticket management and delivers an optimal user experience.\n\nI built a Headless WordPress site with Next.js, delivering a smooth, fast user experience. The design is clean — events are front and centre and navigation is effortless.\n\nThe site features an event calendar, an integrated ticketing system and dedicated pages for each event.\n\nIt's fully responsive and SEO-optimized to attract as many visitors as possible and promote events effectively.",
    objectives: [
      "Showcase events professionally",
      "Streamline ticket and registration management",
      "Deliver a smooth, fast user experience",
    ],
    results: [
      "Working event calendar and management system",
      "Integrated, functional ticketing",
      "Smooth, responsive navigation",
    ],
    galleryAlt: "Next Event homepage",
    tags: ["Events", "WordPress", "Headless", "Next.js"],
    duration: "3 weeks",
  },
  "les-etats-generaux-communaux": {
    title: "Les Etats Généraux Communaux",
    description: "Brochure site for Les Etats Généraux Communaux",
    detailedDescription:
      "Les Etats Généraux Communaux is a brochure site built to promote a citizen event aimed at boosting local participation. The site highlights resources, news and makes it easy to set up local groups.\n\nI built a Headless WordPress site with Next.js, delivering a smooth, fast user experience. The design is clean, with the event and its goals front and centre.\n\nThe site features a downloadable resources section, an event calendar and an interactive map of registered local groups.\n\nIt's fully responsive and SEO-optimized to draw as many visitors as possible and raise awareness of the initiative.",
    objectives: [
      "Showcase the event professionally",
      "Make it easy to set up local groups",
      "Highlight resources and news",
    ],
    results: [
      "Site shipped before the event date",
      "Growth in the number of local groups created",
      "Smooth, responsive navigation",
    ],
    galleryAlt: "Les Etats Généraux Communaux homepage",
    tags: ["Non-profit", "WordPress", "Headless", "Next.js"],
    duration: "4 weeks",
  },
  "panorama-pub": {
    title: "Panorama Pub",
    description:
      "Launching Panorama Pub, the first online directory dedicated to promotional-products suppliers — a brand-new digital marketplace connecting buyers and suppliers in a still-fragmented sector.",
    detailedDescription: `The promotional-products market is one of the last B2B sectors without a reference platform: buyers (communication agencies, marketing departments, events teams) still rely on scattered searches, incomplete databases, and hours wasted finding the right supplier. Panorama Pub was born from that gap: build the directory that doesn't yet exist and become the digital reference for the sector.\n\nI took the project from concept to launch: structuring the supplier database, designing a sourcing-first user journey, creating rich and clear supplier profiles, building high-performance search, and shipping a back-office that lets the team enrich the catalogue autonomously. The goal wasn't just to deliver a website — it was to lay the foundations of a product built to grow: solid SEO to capture untapped demand, top-tier performance for durable rankings, and an architecture able to absorb thousands of new entries and future features (supplier accounts, lead routing, editorial content).\n\nShipped in 2 months, Panorama Pub is now live and ready to claim its market: a first-mover position, a platform that already stands on solid ground, and a clear roadmap to become the go-to source for sourcing promotional products in France.`,
    objectives: [
      "Claim an open market by creating the digital reference for promotional-products sourcing",
      "Centralise a fragmented and hard-to-compare supplier landscape",
      "Save buyers (agencies, marcomms, marketing teams) meaningful time in their sourcing",
      "Give suppliers qualified visibility in front of an engaged B2B audience",
      "Lay a technical foundation able to absorb catalogue and traffic growth",
    ],
    results: [
      "A platform unique in its segment — no equivalent in the French market",
      "Streamlined supplier sourcing: search, filter and compare in a few clicks",
      "Scalable catalogue: add, update and enrich supplier profiles autonomously",
      "Architecture built for SEO and growth, ready to scale",
      "Live in 2 months, from concept to production",
    ],
    arbitrage: {
      consideredOptions: [
        "Directory on WordPress + a directory plugin",
        "No-code stack (Webflow-style + external database)",
        "Custom Next.js + PostgreSQL application",
      ],
      decision: "Custom Next.js + PostgreSQL application with a dedicated back-office.",
      rationale:
        "A directory built to absorb thousands of entries and product features (supplier accounts, lead routing) outgrows what a WordPress plugin or a no-code stack can hold without debt: structured queries, high-performance search and programmatic SEO required a relational database and full rendering control. The custom build laid a scalable foundation from day one — shipped in 2 months.",
    },
    testimonial: {
      content:
        "Agathe is highly professional, responsive, and makes technical topics accessible to the client — I recommend her!",
      author: "Benoit Huberd",
      position: "Founder, Panorama Pub",
    },
    galleryAlt: "Panorama Pub online directory",
    tags: ["SMB", "B2B directory", "Marketplace", "Product launch"],
    duration: "2 months",
  },
  proditec: {
    title: "Proditec",
    description:
      "Brochure-site rebuild for an international industrial-robotics company.",
    detailedDescription: `Proditec, a company specializing in industrial robotics, needed a complete website rebuild to reflect its work and international standing. Their previous site was outdated, hard to navigate and to administer, and lacked multilingual support.\n\nI built a WordPress site with a responsive design and a technical, efficient interface for both end-users and admins, usable by everyone. The site is fully multilingual thanks to Polylang, letting visitors choose their preferred language.\n\nThe new site showcases Proditec's flagship products with precise machine specifications. Technical optimizations were applied to improve load times, reaching a PageSpeed score of 98 on both mobile and desktop.`,
    objectives: [
      "Improve the mobile experience",
      "Manage multilingual content",
      "Optimize site load speed",
    ],
    results: [
      "Accessibility score improved by 30%",
      "Support for 5 languages",
      "PageSpeed score improved from 45 to 98",
    ],
    testimonial: {
      content:
        "It was a pleasure working with Agathe on the rebuild of our multilingual site, and I can only recommend her services. Agathe stands out for how quickly she grasps business challenges and translates them into effective technical solutions. For our project, she built a custom landing page that perfectly reflects our brand identity, alongside a smooth, intuitive multilingual system.",
      author: "Christophe Riboulet",
      position: "CEO, Proditec",
    },
    galleryAlt: "Proditec homepage",
    tags: ["Corporate", "WordPress", "Polylang"],
    duration: "1 month",
  },
  doleances: {
    title: "Les Doléances",
    description:
      "A Wikipedia-inspired brochure site to promote the work of Les Doléances.",
    detailedDescription:
      "Les Doléances, a newly formed non-profit, exists to make the citizens' grievances of 2018-2019 publicly available. To convey the community-driven, participatory spirit and the freedom of access to information, a template heavily inspired by Wikipedia was chosen.\n\nThe site is built on Headless WordPress with Next.js, delivering a smooth, fast user experience. The design is clean — the action and the cause take centre stage.\n\nThe site includes a map of local groups and a categorized articles section.\n\nIt's fully responsive and SEO-optimized to draw as many visitors as possible and raise public awareness of the non-profit's work.",
    objectives: [
      "Showcase the non-profit's work and projects",
      "Take cues from Wikipedia to convey the idea of open participation",
      "Drive citizen engagement",
    ],
    results: [
      "Interactive map of local groups",
      "Events agenda section",
      "Simplified administration via Headless WordPress",
    ],
    galleryAlt: "Les Doléances homepage",
    tags: ["WordPress", "Next.js", "Non-profit"],
    duration: "2 months",
  },
  sowee: {
    title: "Sowee",
    description:
      "Built a blog section for the portal of Sowee, a company specializing in energy solutions.",
    detailedDescription:
      "Sowee, a company specializing in energy solutions, wanted to add a blog section to its Drupal portal — but built on WordPress. The goal was to give the marketing team a space to publish articles on industry trends, innovations and consumer tips.\n\nI built a custom WordPress theme that strictly followed the mockups provided by the marketing team. The design is modern and clean, with intuitive navigation for readers.\n\nThe blog section lets the team easily publish articles, add images and manage categories.",
    objectives: [
      "Build a custom WordPress theme for the blog",
      "Strictly follow the mockups provided by the marketing team",
      "Deliver the project within 10 days",
    ],
    results: [
      "Custom theme successfully integrated",
      "Mockups and brand identity respected",
      "10-day deadline met",
      "Streamlined admin for the marketing team",
    ],
    galleryAlt: "Sowee blog section interface",
    tags: ["WordPress", "Blog", "Custom theme"],
    duration: "5 days",
  },
  "salon-de-la-carrosserie": {
    title: "Salon de la Carrosserie 2024",
    description:
      "Built a brochure site for the Salon de la Carrosserie 2024, with a modern design and an exhibitor sign-up area.",
    detailedDescription:
      "The Salon de la Carrosserie, a major event for industry professionals, needed a brochure site to promote the event and streamline exhibitor sign-ups. The goal was a modern, functional site that reflects the importance of the event.\n\nI built a WordPress site with a clean design and intuitive navigation. The homepage surfaces the key info on the event, exhibitors and partners.\n\nA dedicated sign-up area was set up so companies could register easily and manage their availability. The site is fully responsive and SEO-optimized.",
    objectives: [
      "Communicate about the event and its exhibitors",
      "Build a sign-up area for exhibitors",
      "Spotlight partners and sponsors",
      "Optimize SEO to attract visitors",
      "Make navigation and information access frictionless",
    ],
    results: [
      "Clear information about the event and exhibitors",
      "Exhibitor sign-up area with availability management",
      "Partners and sponsors spotlighted on the homepage",
    ],
    testimonial: {
      content:
        "Professionalism, real initiative, sharp judgement and complete responsiveness! Add to that the right mindset — someone who doesn't hesitate to go beyond the workload and the brief to raise the quality of the deliverable.",
      author: "Luc Poigniez",
      position: "Founder, Agence Créaclic",
    },
    galleryAlt: "Salon de la Carrosserie homepage",
    tags: ["WordPress", "Events", "Members area"],
    duration: "15 days",
  },
  hermitage: {
    title: "Tiers Lieu L'Hermitage",
    description:
      "Progressive incremental rebuild of the Tiers Lieu L'Hermitage brochure site.",
    detailedDescription:
      "Tiers Lieu L'Hermitage, a collaborative rural-innovation hub, wanted to modernize its brochure site while keeping its identity. The existing site was built on Divi, which was causing performance and stability issues.\n\nI led a progressive rebuild, switching to Elementor — a faster, more flexible page builder. The design was modernized to reflect L'Hermitage's identity while staying true to its values.\n\nFeatures were added to streamline recurring donations and donations earmarked for specific projects. The site is now stable, fast and easy to administer.",
    objectives: [
      "Move from the Divi builder to Elementor for better performance",
      "Move to a modern, clean design in continuity with the existing one",
      "Streamline recurring donations and project-earmarked donations",
      "Stabilize the site to eliminate recurring bugs",
    ],
    results: [
      "Successful migration from Divi to Elementor with better performance",
      "More modern, cleaner design that reflects L'Hermitage's identity",
      "Streamlined recurring and project-earmarked donations",
      "Site stabilized with significantly fewer bugs",
      "Performance gains: +30 points on PageSpeed score",
    ],
    testimonial: {
      content:
        "Agathe is an outstanding professional, highly skilled on technical matters and on tracking the evolution of technologies and systems. Equally able to give strategic advice on both the substance and the form of content, Agathe is very attentive to the needs expressed — both up front and during delivery — and is very responsive throughout. I recommend her without reservation.",
      author: "Jean Karinthi",
      position: "Founder, Tiers Lieu L'Hermitage",
    },
    galleryAlt: "Tiers Lieu L'Hermitage homepage",
    tags: ["Rebuild", "Impact", "WordPress"],
    duration: "1 month",
  },
  "erp-services": {
    title: "ERP Services",
    description:
      "Like-for-like rebuild of the brochure site of ERP Services, an engineering consultancy.",
    detailedDescription:
      "ERP Services, an engineering consultancy, needed a brochure-site rebuild to improve performance and security while keeping the existing visual identity. The site also needed to be easier for the in-house team to administer.\n\nI delivered a like-for-like rebuild of the existing site, with better performance and security. The design was lightly refreshed for improved readability and intuitive navigation.\n\nThe site spotlights ERP Services' flagship projects with detailed descriptions and high-quality photos. Contact channels were expanded to make it easier for prospective clients to get in touch.",
    objectives: [
      "Refresh the existing brochure site",
      "Improve performance and security",
      "Marginally refresh the design",
      "Organize content for better readability",
    ],
    results: [
      "Performance improved from 45 to 99 on mobile",
      "Flagship projects highlighted",
      "Expanded contact channels",
      "Improved site security",
    ],
    galleryAlt: "ERP Services service page",
    tags: ["WordPress", "Brochure site", "Rebuild"],
    duration: "2 weeks",
  },
  "senza-nature": {
    title: "Senza Nature",
    description:
      "Built an e-commerce site for selling natural and organic products.",
    detailedDescription:
      "Senza Nature, a company specializing in natural and organic products, needed end-to-end support and ongoing maintenance for its e-commerce site. The goal was to keep the online shop stable and high-performing while shipping continuous improvements.\n\nI set up end-to-end support — handling maintenance, updates and the necessary improvements. The site runs on WooCommerce, making product and order management easy.\n\nTechnical optimizations were applied to improve load times, achieving a high PageSpeed score on both mobile and desktop.",
    objectives: [
      "Maintain an online shop for selling natural products",
      "Ship site improvements on an ongoing basis",
      "Optimize site performance",
    ],
    results: [
      "Site stabilized with significantly fewer bugs",
      "Improved page load speed",
    ],
    testimonial: {
      content:
        "We have been working exclusively with Agathe for several months. Highly professional, fast and a great teacher — and excellent advice too! Our site is in good hands, and we highly recommend her.",
      author: "Laura Schorestene",
      position: "Founder, Senza Nature",
    },
    galleryAlt: "Senza Nature homepage",
    tags: ["E-commerce", "Woocommerce", "WordPress"],
    duration: "since 2024",
  },
  "wagner-hamisky": {
    title: "Wagner Hamisky",
    description: "Built a brochure site for the Wagner Hamisky art gallery.",
    detailedDescription:
      "Wagner Hamisky, an art gallery specializing in art restoration, wanted a brochure site to showcase its artists and their works for its opening. The goal was to provide an exhibition space while making it easy for prospective buyers to get in touch.\n\nI built a WordPress site with a modern, clean design that puts the two artists' works front and centre. The site features an image gallery and detailed descriptions of the artworks.\n\nThe site is fully optimized for simple catalogue management, so the gallery can run it independently going forward.",
    objectives: [
      "Showcase the artists' and the gallery's works",
      "Build a simple, effective catalogue-management area",
      "Make it easy for prospective buyers to get in touch",
    ],
    results: [
      "Modern, clean brochure site",
      "Exhibition area for the artworks",
      "Detailed descriptions of the artworks",
      "Streamlined contact for prospective buyers",
    ],
    galleryAlt: "Wagner Hamisky homepage",
    tags: ["WordPress", "Art gallery", "Brochure site"],
    duration: "3 weeks",
  },
  mediatico: {
    title: "Mediatico",
    description:
      "Built an online media outlet for Mediatico, covering everything happening in France's social-economy sector.",
    detailedDescription:
      "Mediatico, an online media outlet covering France's social-economy sector, wanted to rebuild its media platform to showcase its articles and partners. The goal was an accessible, attractive information hub for readers.\n\nI built a WordPress site with a modern design and intuitive navigation. The site highlights recent articles, partners and sponsors, plus a dedicated area for visitor submissions.\n\nThe site is fully responsive and SEO-optimized, helping Mediatico reach a wide audience interested in the social-economy sector.",
    objectives: [
      "Modernize the existing WordPress theme",
      "Improve the user experience",
      "Allow visitors to submit articles for publication",
    ],
    results: [
      "Modern, professional site",
      "Dedicated area for partners and sponsors",
      "Site stabilized with significantly fewer bugs",
    ],
    galleryAlt: "Mediatico homepage",
    tags: ["WordPress", "Online media", "Full Site Editing"],
    duration: "4 weeks",
  },
  infralliance: {
    title: "Infralliance",
    description:
      "Built a brochure site for Infralliance, a Think and Do Tank of digital-infrastructure operators.",
    detailedDescription:
      "Infralliance, a think and do tank of digital-infrastructure operators, wanted a brochure site to showcase its work and its members.\n\nI built a WordPress site with a clean design and intuitive navigation. The site highlights the alliance's work and its network of digital-infrastructure operators.\n\nThe site shipped ahead of the alliance's launch event, letting Infralliance communicate effectively about its priorities and projects.",
    objectives: [
      "Showcase the alliance's work and projects",
      "Highlight the digital-infrastructure-operator network",
      "Communicate on the digital-infrastructure agenda",
    ],
    results: [
      "Modern, professional brochure site",
      "Shipped before the alliance's launch event",
      "Easy for the in-house team to administer",
    ],
    galleryAlt: "Connexion Plus homepage",
    tags: ["WordPress", "Advanced Custom Fields", "Elementor Pro"],
    duration: "2 weeks",
  },
  "connexion-plus": {
    title: "GEM Connexion",
    description:
      "Built a brochure site for GEM Connexion Plus, a Paris-based socio-cultural non-profit.",
    detailedDescription:
      "GEM Connexion Plus, a Paris-based mutual-support group (GEM), wanted a brochure site to give visibility to its activities and projects. The goal was a professional, modern space to attract new members and partners.\n\nI built a WordPress site with a clean design and intuitive navigation. The site highlights the GEM's activities and ongoing projects.\n\nA dedicated members' area was added so each member can publish their news and share their experiences. The site is fully responsive and SEO-optimized.",
    objectives: [
      "Give GEM Connexion visibility with partners and the public",
      "Let members publish their own news",
      "Make information about activities and projects accessible",
    ],
    results: [
      "Modern, professional brochure site",
      "Dedicated members' area for publishing news",
      "Streamlined contact for partners and the public",
    ],
    galleryAlt: "GEM Connexion homepage",
    tags: ["WordPress", "Brochure site", "Non-profit"],
    duration: "4 weeks",
  },
  sdevo: {
    title: "SDEVO",
    description:
      "Built a grant-application management plugin for the Syndicat départemental des énergies du Val d'Oise.",
    detailedDescription:
      "The Syndicat départemental des énergies du Val d'Oise (SDEVO) wanted a WordPress plugin to manage grant applications from member municipalities. The goal was to let municipalities submit applications online and to make tracking easier for SDEVO.\n\nI built a custom plugin that lets municipalities submit grant applications through an intuitive UI. The plugin also handles application tracking, letting SDEVO centralize and follow up efficiently.\n\nThe plugin is fully integrated with WordPress, providing easy management and a streamlined admin experience for SDEVO users.",
    objectives: [
      "Let municipalities submit grant applications online",
      "Manage grant applications centrally",
      "Make application tracking easier for both municipalities and SDEVO",
    ],
    results: [
      "Custom WordPress plugin for grant management",
      "Intuitive UI for municipalities",
      "Streamlined application tracking for SDEVO",
    ],
    galleryAlt: "SDEVO grant-management page",
    tags: ["WordPress", "Custom plugin", "Grant management"],
    duration: "3 weeks",
  },
};

// ─── Result highlights (per slug, per locale) ──────────────────────────────

const RESULT_HIGHLIGHTS_FR: Record<string, ResultHighlight[]> = {
  "arguin-marine": [
    { value: "Vitrine", label: "Présence en ligne clé en main" },
    { value: "WordPress", label: "Site simple à administrer" },
    { value: "Arcachon", label: "Location de bateaux haut de gamme" },
  ],
  "peer-to-peer": [
    { value: "14", label: "Outils en accès libre" },
    { value: "100%", label: "Local — aucune donnée envoyée" },
    { value: "0 compte", label: "Sans inscription ni installation" },
  ],
  "panorama-pub": [
    { value: "1er", label: "Annuaire du secteur en France" },
    { value: "2 mois", label: "Du concept à la mise en ligne" },
    { value: "B2B", label: "Sourcing fournisseurs simplifié" },
  ],
  "cafe-citoyen": [
    { value: "+20%", label: "Visites du lieu" },
    { value: "x3", label: "Abonnements à la newsletter" },
    { value: "Headless", label: "Architecture Next.js" },
  ],
  "comme-des-fous-jeux": [
    { value: "15 jours", label: "Délai de livraison" },
    { value: "100%", label: "Expérience interactive" },
    { value: "Headless", label: "Architecture Next.js" },
  ],
  "hermitage-jeu-de-piste": [
    { value: "4 semaines", label: "Délai de réalisation" },
    { value: "Gamification", label: "Découverte active du domaine" },
    { value: "Appli mobile", label: "PWA native" },
  ],
  "comme-des-fous": [
    { value: "98/100", label: "Score PageSpeed" },
    { value: "+42 pts", label: "Gain de performance" },
    { value: "0 interruption", label: "Pour les rédacteurs" },
  ],
  "next-event": [
    { value: "3 semaines", label: "Délai de réalisation" },
    { value: "Agenda", label: "Gestion des événements" },
    { value: "Billetterie", label: "Intégrée et fonctionnelle" },
  ],
  "les-etats-generaux-communaux": [
    { value: "4 semaines", label: "Délai de réalisation" },
    { value: "J-0", label: "Livré avant l'événement" },
    { value: "Carte", label: "Groupes locaux interactifs" },
  ],
  proditec: [
    { value: "98/100", label: "Score PageSpeed" },
    { value: "+30%", label: "Accessibilité améliorée" },
    { value: "5 langues", label: "Support multilingue" },
  ],
  doleances: [
    { value: "2 mois", label: "Délai de réalisation" },
    { value: "Carte", label: "Groupes locaux interactifs" },
    { value: "Headless", label: "Architecture Next.js" },
  ],
  sowee: [
    { value: "5 jours", label: "Délai de livraison" },
    { value: "100%", label: "Fidélité aux maquettes" },
    { value: "Autonomie", label: "Pour l'équipe marketing" },
  ],
  "salon-de-la-carrosserie": [
    { value: "15 jours", label: "Délai de livraison" },
    { value: "Inscriptions", label: "Espace exposants en ligne" },
    { value: "SEO", label: "Référencement optimisé" },
  ],
  hermitage: [
    { value: "+30 pts", label: "Score PageSpeed" },
    { value: "Elementor", label: "Migration depuis Divi" },
    { value: "Dons", label: "Récurrents et dédiés" },
  ],
  "erp-services": [
    { value: "99/100", label: "Score PageSpeed mobile" },
    { value: "+54 pts", label: "Gain de performance" },
    { value: "2 semaines", label: "Délai de livraison" },
  ],
  "senza-nature": [
    { value: "-90%", label: "Réduction des bugs" },
    { value: "+50%", label: "Vitesse de chargement" },
    { value: "Continu", label: "Accompagnement depuis 2024" },
  ],
  "wagner-hamisky": [
    { value: "3 semaines", label: "Délai de livraison" },
    { value: "2 artistes", label: "Exposés en ligne" },
    { value: "Autonomie", label: "Gestion du catalogue" },
  ],
  mediatico: [
    { value: "4 semaines", label: "Délai de réalisation" },
    { value: "FSE", label: "Full Site Editing WordPress" },
    { value: "0 bug", label: "Stabilisation réussie" },
  ],
  infralliance: [
    { value: "2 semaines", label: "Délai de livraison" },
    { value: "J-0", label: "Livré avant le lancement" },
    { value: "Autonomie", label: "Administration simplifiée" },
  ],
  "connexion-plus": [
    { value: "4 semaines", label: "Délai de réalisation" },
    { value: "Co-construction", label: "Ateliers participatifs" },
    { value: "Membres", label: "Publication autonome" },
  ],
  sdevo: [
    { value: "3 semaines", label: "Délai de livraison" },
    { value: "Plugin", label: "Solution sur-mesure" },
    { value: "100%", label: "Suivi simplifié" },
  ],
};

const RESULT_HIGHLIGHTS_EN: Record<string, ResultHighlight[]> = {
  "arguin-marine": [
    { value: "Brochure", label: "Turnkey online presence" },
    { value: "WordPress", label: "Easy for the client to manage" },
    { value: "Arcachon", label: "High-end boat rental" },
  ],
  "peer-to-peer": [
    { value: "14", label: "Freely accessible tools" },
    { value: "100%", label: "Local — no data sent" },
    { value: "0 account", label: "No sign-up, no install" },
  ],
  "panorama-pub": [
    { value: "1st", label: "Industry directory in France" },
    { value: "2 months", label: "From concept to launch" },
    { value: "B2B", label: "Streamlined supplier sourcing" },
  ],
  "cafe-citoyen": [
    { value: "+20%", label: "On-site visits" },
    { value: "x3", label: "Newsletter signups" },
    { value: "Headless", label: "Next.js architecture" },
  ],
  "comme-des-fous-jeux": [
    { value: "15 days", label: "Delivery time" },
    { value: "100%", label: "Interactive experience" },
    { value: "Headless", label: "Next.js architecture" },
  ],
  "hermitage-jeu-de-piste": [
    { value: "4 weeks", label: "Build time" },
    { value: "Gamification", label: "Active estate discovery" },
    { value: "Mobile app", label: "Native PWA" },
  ],
  "comme-des-fous": [
    { value: "98/100", label: "PageSpeed score" },
    { value: "+42 pts", label: "Performance gain" },
    { value: "0 disruption", label: "For the editorial team" },
  ],
  "next-event": [
    { value: "3 weeks", label: "Build time" },
    { value: "Agenda", label: "Event management" },
    { value: "Ticketing", label: "Integrated and functional" },
  ],
  "les-etats-generaux-communaux": [
    { value: "4 weeks", label: "Build time" },
    { value: "D-0", label: "Shipped before the event" },
    { value: "Map", label: "Interactive local groups" },
  ],
  proditec: [
    { value: "98/100", label: "PageSpeed score" },
    { value: "+30%", label: "Accessibility improved" },
    { value: "5 languages", label: "Multilingual support" },
  ],
  doleances: [
    { value: "2 months", label: "Build time" },
    { value: "Map", label: "Interactive local groups" },
    { value: "Headless", label: "Next.js architecture" },
  ],
  sowee: [
    { value: "5 days", label: "Delivery time" },
    { value: "100%", label: "Mockup fidelity" },
    { value: "Autonomy", label: "For the marketing team" },
  ],
  "salon-de-la-carrosserie": [
    { value: "15 days", label: "Delivery time" },
    { value: "Sign-ups", label: "Online exhibitor area" },
    { value: "SEO", label: "Search-optimized" },
  ],
  hermitage: [
    { value: "+30 pts", label: "PageSpeed score" },
    { value: "Elementor", label: "Migration from Divi" },
    { value: "Donations", label: "Recurring and earmarked" },
  ],
  "erp-services": [
    { value: "99/100", label: "Mobile PageSpeed score" },
    { value: "+54 pts", label: "Performance gain" },
    { value: "2 weeks", label: "Delivery time" },
  ],
  "senza-nature": [
    { value: "-90%", label: "Bug reduction" },
    { value: "+50%", label: "Load speed" },
    { value: "Ongoing", label: "Support since 2024" },
  ],
  "wagner-hamisky": [
    { value: "3 weeks", label: "Delivery time" },
    { value: "2 artists", label: "Showcased online" },
    { value: "Autonomy", label: "Catalogue management" },
  ],
  mediatico: [
    { value: "4 weeks", label: "Build time" },
    { value: "FSE", label: "WordPress Full Site Editing" },
    { value: "0 bugs", label: "Stabilization shipped" },
  ],
  infralliance: [
    { value: "2 weeks", label: "Delivery time" },
    { value: "D-0", label: "Shipped before launch" },
    { value: "Autonomy", label: "Streamlined admin" },
  ],
  "connexion-plus": [
    { value: "4 weeks", label: "Build time" },
    { value: "Co-design", label: "Participatory workshops" },
    { value: "Members", label: "Self-service publishing" },
  ],
  sdevo: [
    { value: "3 weeks", label: "Delivery time" },
    { value: "Plugin", label: "Bespoke solution" },
    { value: "100%", label: "Tracking simplified" },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function pickContent(locale: Locale): Record<string, CaseStudyContent> {
  return locale === "en" ? CONTENT_EN : CONTENT_FR;
}

export function getCaseStudies(locale: Locale): CaseStudy[] {
  const content = pickContent(locale);
  return META.map((meta) => {
    const c = content[meta.slug] ?? CONTENT_FR[meta.slug];
    return {
      ...meta,
      ...c,
      gallery: { url: meta.galleryUrl, alt: c.galleryAlt },
    };
  });
}

export function getCaseStudy(locale: Locale, slug: string): CaseStudy | undefined {
  return getCaseStudies(locale).find((s) => s.slug === slug);
}

export function getResultHighlights(
  locale: Locale,
  slug: string,
): ResultHighlight[] | undefined {
  const map = locale === "en" ? RESULT_HIGHLIGHTS_EN : RESULT_HIGHLIGHTS_FR;
  return map[slug];
}

export function getAllSlugs(): string[] {
  return META.map((m) => m.slug);
}
