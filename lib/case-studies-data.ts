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

/**
 * Catégories orientées bénéfice, jamais techno : un prospect froid cherche
 * « un site » ou « une app », pas « du Headless ». La techno reste expliquée
 * dans l'arbitrage de chaque fiche.
 */
export type FamilleKey = "sites-institutionnels" | "app-web-mobile" | "automatisations";

/** Ordre canonique des familles dans la liste ; une famille sans cas publié est masquée. */
export const FAMILLE_ORDER: FamilleKey[] = [
  "sites-institutionnels",
  "app-web-mobile",
  "automatisations",
];

export type OffreConstructionKey = "wordpress" | "headless" | "plateforme" | "composant";

export type OffreConseilKey =
  | "selecteur-techno"
  | "architecture-ia"
  | "pack-ia"
  | "direction-technique";

export type StatutKey = "publie" | "brouillon";

/** Délai de réalisation normalisé, locale-agnostique — affiché via formatDelai. */
export type Delai =
  | { value: number; unit: "jours" | "semaines" | "mois" }
  | { depuis: number };

export interface CaseStudyMeta {
  id: string;
  slug: string;
  /** Une seule famille par cas — pilote les onglets et compteurs de la liste. */
  famille: FamilleKey;
  /** Un brouillon n'est jamais rendu : ni liste, ni fiche, ni sitemap, ni flux. */
  statut: StatutKey;
  /** Rang dans la vue par défaut de la liste ; null = absent de cette vue. */
  featured: number | null;
  offreConstruction: OffreConstructionKey | null;
  offreConseil: OffreConseilKey | null;
  /** Affiché tel quel (ex. « à partir de 4 000 € »), jamais calculé ; null = masqué. */
  budgetIndicatif: string | null;
  /** null = non communiqué (brouillons en attente de données) : la durée est masquée. */
  delai: Delai | null;
  /** Identifiant commun aux fiches d'un même client (ex. "hermitage"). */
  clientId: string | null;
  /** Variante optimisée pour la carte de liste ; fallback sur galleryUrl. */
  cardImageUrl?: string;
  /** Site de démonstration (pas un projet client). */
  isDemo?: boolean;
  clientType: ClientTypeKey;
  clientName: string;
  imageUrl: string;
  galleryUrl: string;
  date: { month: Month; year: Year };
  /** Dernière mise à jour éditoriale réelle de la fiche → dateModified JSON-LD. Null = jamais retouchée depuis publication (retombe sur `date`). */
  updated?: { month: Month; year: Year } | null;
  technologies: string[];
  website?: string;
  youtubeVideoId?: string;
  youtubeIsShort?: boolean;
}

export interface CaseStudyContent {
  title: string;
  description: string;
  /**
   * Résumé « En bref » — 3 à 4 phrases autonomes, extractibles telles quelles
   * par un moteur de réponse IA (ChatGPT, Perplexity, AI Overviews). Chaque
   * phrase doit être strictement dérivée des données déjà présentes de la
   * fiche (résultats chiffrés, client, techno) : jamais un fait nouveau.
   * Rendu en tête de fiche via `ArticleEnBref`, avant le corps.
   */
  enBref?: string[];
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
  /**
   * « La solution » — section du gabarit automatisation (famille
   * ia-automatisation) : sources surveillées, tri/synthèse par l'agent,
   * lettre de veille envoyée par mail. Affichée uniquement si présente.
   */
  solution?: string;
  testimonial?: {
    content: string;
    author: string;
    position: string;
  };
  galleryAlt: string;
  tags: string[];
  /** Textes de la carte de liste quand ils diffèrent de ceux de la fiche (fallback title/description/galleryAlt). */
  cardTitle?: string;
  cardDescription?: string;
  cardAlt?: string;
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
    id: "27",
    slug: "aloyse-leledy-becue",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "semaines" },
    clientId: null,
    clientType: "independant",
    clientName: "Aloyse Leledy-Bécue",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-cineaste.png",
    date: { month: null, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Thème sur-mesure", "ACF (Advanced Custom Fields)"],
    website: "https://aloyseleledybecue.com",
    youtubeVideoId: "t1MaHEN2g34",
  },
  {
    id: "24",
    slug: "hermitage-ecolise",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: 6,
    offreConstruction: "plateforme",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 1, unit: "semaines" },
    clientId: "hermitage",
    clientType: "ess",
    clientName: "Tiers Lieu L'Hermitage",
    imageUrl: "/img/logo-hermitage.webp",
    galleryUrl: "/img/desktop_screen_ecolise_hermitage.png",
    date: { month: null, year: 2026 }, // TODO(Agathe): mois de mise en ligne
    updated: { month: 8, year: 2026 },
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
    website: "https://ecolise.hermitagelelab.com/",
    youtubeVideoId: "xci9bnEGgzg",
  },
  {
    id: "23",
    youtubeVideoId: "chOmQ0W3QX0",
    slug: "reseauteurs",
    famille: "app-web-mobile",
    statut: "publie",
    featured: 1,
    offreConstruction: "plateforme",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "mois" },
    clientId: null,
    clientType: "pme", // TODO(Agathe): confirmer le type de client (pme / independant)
    clientName: "Réseauteurs",
    imageUrl: "",
    galleryUrl: "/img/desktop_screen_reseauteurs.png",
    date: { month: null, year: 2026 }, // TODO(Agathe): mois de mise en ligne
    updated: { month: 8, year: 2026 },
    technologies: ["Next.js", "Payload CMS", "TypeScript", "Stripe", "Cartographie OpenStreetMap", "Vercel"],
    website: "https://www.reseauteurs.com",
  },
  {
    id: "22",
    slug: "arguin-marine",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "semaines" },
    clientId: null,
    clientType: "pme",
    clientName: "Arguin Marine",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-arguinmarine.jpg",
    date: { month: 6, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Full Site Editing"],
    website: "https://www.arguinmarine.fr",
    youtubeVideoId: "ash0Q83Z9gQ",
  },
  {
    id: "21",
    slug: "la-petite-vitrine",
    famille: "app-web-mobile",
    statut: "publie",
    featured: 2,
    offreConstruction: "plateforme",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "mois" },
    clientId: null,
    clientType: "independant",
    clientName: "La Petite Vitrine",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-lapetitevitrine.jpg",
    date: { month: 6, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel Blob", "Vercel"],
    website: "https://lapetitevitrine.com",
    youtubeVideoId: "lAtVrN9Xh_8",
  },
  {
    id: "20",
    slug: "peer-to-peer",
    famille: "app-web-mobile",
    statut: "publie",
    featured: null,
    offreConstruction: "plateforme",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 1, unit: "mois" },
    clientId: null,
    clientType: "ess",
    clientName: "Peer to Peer",
    imageUrl: "",
    galleryUrl: "/img/desktop_screen_peertopeer.png",
    date: { month: 6, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["Next.js", "React", "TypeScript", "Stockage local (navigateur)", "Tailwind CSS", "Vercel"],
    website: "https://peer-to-peer.fr",
    youtubeVideoId: "Z8vLl6sLPiI",
  },
  {
    id: "19",
    slug: "panorama-pub",
    famille: "app-web-mobile",
    statut: "publie",
    featured: 3,
    offreConstruction: "plateforme",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 2, unit: "mois" },
    clientId: null,
    clientType: "pme",
    clientName: "Panorama Pub",
    imageUrl: "/img/desktop-screen-panoramapub.png",
    galleryUrl: "/img/desktop-screen-panoramapub.png",
    date: { month: 5, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["Next.js", "PostgreSQL", "TypeScript", "Tailwind CSS", "Vercel"],
    website: "https://panorama-pub.com",
    youtubeVideoId: "9fMaBL1amYk",
  },
  {
    id: "17",
    slug: "cafe-citoyen",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: 4,
    offreConstruction: "headless",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "semaines" },
    clientId: null,
    clientType: "association",
    clientName: "Café citoyen d'Auger-Saint-Vincent",
    imageUrl: "/img/desktop-screen-cafe-citoyen.png",
    galleryUrl: "/img/desktop-screen-cafe-citoyen.png",
    date: { month: 3, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://cafecitoyen.art",
    youtubeVideoId: "8aVVoDFakCY",
  },
  {
    id: "18",
    slug: "hermitage-jeu-de-piste",
    famille: "app-web-mobile",
    statut: "publie",
    featured: null,
    offreConstruction: "plateforme",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 4, unit: "semaines" },
    clientId: "hermitage",
    clientType: "ess",
    clientName: "Tiers Lieu L'Hermitage",
    imageUrl: "/img/logo-hermitage.webp",
    galleryUrl: "/img/mobile-screen-jeu-de-piste-hermitage.jpg",
    date: { month: 4, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["Next.js", "PWA", "Géolocalisation", "Persistance locale", "Tailwind CSS", "Vercel"],
    website: "https://jeu-de-piste.hermitagelelab.com/",
    youtubeVideoId: "_kt_wA4zT68",
    youtubeIsShort: true,
  },
  {
    id: "16",
    slug: "comme-des-fous-jeux",
    famille: "app-web-mobile",
    statut: "publie",
    featured: null,
    offreConstruction: "headless",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 15, unit: "jours" },
    clientId: "comme-des-fous",
    clientType: "association",
    clientName: "Comme des fous",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-comme-des-fous-jeux.jpg",
    date: { month: 2, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://jeux.commedesfous.com",
    youtubeVideoId: "SIj61ECS1Mo",
  },
  {
    id: "15",
    slug: "comme-des-fous",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: 5,
    offreConstruction: "headless",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 2, unit: "mois" },
    clientId: "comme-des-fous",
    clientType: "pme",
    clientName: "Comme des fous",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-comme-des-fous.jpg",
    date: { month: 1, year: 2026 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://commedesfous.com",
    youtubeVideoId: "6vUSbG6F50w",
  },
  {
    id: "3",
    slug: "next-event",
    famille: "app-web-mobile",
    statut: "publie",
    featured: null,
    offreConstruction: "headless",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-next-event.webp",
    isDemo: true,
    clientType: "pme",
    clientName: "Next Event",
    imageUrl: "/img/desktop-screen-next-event.jpg",
    galleryUrl: "/img/desktop-screen-next-event.jpg",
    date: { month: 10, year: 2025 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://next-event.fr",
    youtubeVideoId: "I1qi5o31Lnk",
  },
  {
    id: "0",
    slug: "les-etats-generaux-communaux",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "headless",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 4, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-egc.webp",
    clientType: "association",
    clientName: "Les Etats Généraux Communaux",
    imageUrl: "/img/logo-egc.png",
    galleryUrl: "/img/desktop-screen-egc.png",
    date: { month: 10, year: 2025 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    website: "https://lesetatsgenerauxcommunaux.org",
    youtubeVideoId: "dJIndpLBm7o",
  },
  {
    id: "1",
    slug: "proditec",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 1, unit: "mois" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-proditec.webp",
    clientType: "pme",
    clientName: "Proditec",
    imageUrl: "/img/logo-proditec.webp",
    galleryUrl: "/img/desktop-screen-proditec.jpg",
    date: { month: 5, year: 2025 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "LiteSpeed", "Polylang", "elementor", "Hostinger"],
    website: "https://proditec.com",
  },
  {
    id: "2",
    slug: "doleances",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "headless",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 2, unit: "mois" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-lesdoleances.webp",
    clientType: "association",
    clientName: "Association Les Doléances",
    imageUrl: "",
    galleryUrl: "/img/desktop-screen-lesdoleances.jpg",
    date: { month: 5, year: 2025 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Next.js", "Tailwind CSS", "Headless CMS", "Vercel"],
    website: "https://lesdoleances.fr",
    youtubeVideoId: "_OjiGiOWJus",
  },
  {
    id: "4",
    slug: "sowee",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 10, unit: "jours" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-sowee.webp",
    clientType: "grande-entreprise",
    clientName: "Sowee",
    imageUrl: "/img/logo-sowee.svg",
    galleryUrl: "/img/desktop-screen-sowee.png",
    date: { month: 11, year: 2023 },
    updated: { month: 8, year: 2026 },
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
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 15, unit: "jours" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-salondelacarrosserie.webp",
    clientType: "pme",
    clientName: "Salon de la Carrosserie",
    imageUrl: "/img/logo-salondelacarrosserie.webp",
    galleryUrl: "/img/desktop-screen-salondelacarrosserie.jpg",
    date: { month: 2, year: 2024 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Elementor Pro", "Ultimate Member"],
    website: "https://salondelacarrosserie.com",
    youtubeVideoId: "s_tyz8ubqSo",
  },
  {
    id: "6",
    slug: "hermitage",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 1, unit: "mois" },
    clientId: "hermitage",
    cardImageUrl: "/img/desktop-screen-hermitage.webp",
    clientType: "ess",
    clientName: "L'Hermitage",
    imageUrl: "/img/logo-hermitage.webp",
    galleryUrl: "/img/desktop-screen-hermitage.jpg",
    date: { month: 1, year: 2025 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Elementor Pro", "Optimisation des performances"],
    website: "https://hermitagelelab.com",
  },
  {
    id: "7",
    slug: "erp-services",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 2, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-erp-services.webp",
    clientType: "pme",
    clientName: "ERP Services",
    imageUrl: "/img/logo-erp-services.webp",
    galleryUrl: "/img/desktop-screen-erp-services.jpg",
    date: { month: 7, year: 2024 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Elementor Pro", "LiteSpeed Cache"],
  },
  {
    id: "8",
    slug: "senza-nature",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { depuis: 2024 },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-senza-nature.webp",
    clientType: "pme",
    clientName: "Senza Nature",
    imageUrl: "/img/logo-senza-nature.png",
    galleryUrl: "/img/desktop-screen-senza-nature.jpg",
    date: { month: 9, year: 2024 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Woocommerce", "LiteSpeed Cache"],
    website: "https://senza-nature.com",
  },
  {
    id: "9",
    slug: "wagner-hamisky",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-wagner-hamisky.webp",
    clientType: "pme",
    clientName: "Wagner Hamisky",
    imageUrl: "/img/logo-wagner-hamisky.jpeg",
    galleryUrl: "/img/desktop-screen-wagner-hamisky.jpg",
    date: { month: 2, year: 2024 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Thème custom", "ACF Pro"],
    website: "https://wagner-hamisky.com",
    youtubeVideoId: "Zv7SUqZPo08",
  },
  {
    id: "10",
    slug: "mediatico",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 4, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-mediatico.webp",
    clientType: "ess",
    clientName: "Mediatico",
    imageUrl: "/img/logo-mediatico.png",
    galleryUrl: "/img/desktop-screen-mediatico.jpg",
    date: { month: 12, year: 2024 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Gutenberg", "Thème custom"],
    website: "https://mediatico.fr",
    youtubeVideoId: "2RfDio_6oQQ",
  },
  {
    id: "11",
    slug: "infralliance",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 2, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-infralliance.webp",
    clientType: "groupement",
    clientName: "Infralliance",
    imageUrl: "/img/logo-infralliance.png",
    galleryUrl: "/img/desktop-screen-infralliance.jpg",
    date: { month: 4, year: 2023 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Elementor Pro", "Advanced Custom Fields"],
    website: "https://infralliance.net",
    youtubeVideoId: "LtMBegTX06Q",
  },
  {
    id: "12",
    slug: "connexion-plus",
    famille: "sites-institutionnels",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 4, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-gem-connexion.webp",
    clientType: "ess",
    clientName: "GEM Connexion",
    imageUrl: "/img/logo-connexion-plus.jpg",
    galleryUrl: "/img/desktop-screen-gem-connexion.jpg",
    date: { month: 5, year: 2022 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "Thème communautaire", "Co-construction par ateliers"],
    website: "https://gem-connexion.fr",
  },
  {
    id: "13",
    slug: "sdevo",
    famille: "app-web-mobile",
    statut: "publie",
    featured: null,
    offreConstruction: "wordpress",
    offreConseil: null,
    budgetIndicatif: null,
    delai: { value: 3, unit: "semaines" },
    clientId: null,
    cardImageUrl: "/img/desktop-screen-sdevo.webp",
    clientType: "institutionnel",
    clientName: "SDEVO",
    imageUrl: "/img/logo-sdevo.png",
    galleryUrl: "/img/desktop-screen-sdevo.png",
    date: { month: 8, year: 2024 },
    updated: { month: 8, year: 2026 },
    technologies: ["WordPress", "PHP", "Plugin custom"],
  },
  // ─── Catégorie « Automatisations » (chantier D — DIRECTIVES-ETUDES-DE-CAS) ────────────
  // Publiées : elles font apparaître l'onglet « Automatisations » dans la liste.
  // Le mécanisme brouillon reste disponible (statut: "brouillon" + includeDrafts).
  {
    id: "25",
    slug: "hermitage-veille",
    famille: "automatisations",
    statut: "publie",
    featured: null,
    offreConstruction: null,
    offreConseil: "pack-ia",
    budgetIndicatif: null,
    delai: null,
    clientId: "hermitage",
    clientType: "ess",
    clientName: "Tiers Lieu L'Hermitage",
    imageUrl: "/img/logo-hermitage.webp",
    galleryUrl: "/img/logo-hermitage.webp",
    date: { month: null, year: 2026 }, // TODO(Agathe): mois de réalisation
    updated: { month: 8, year: 2026 },
    technologies: ["Claude Code", "Google Workspace"],
  },
  {
    id: "26",
    slug: "urban-pousses-veille",
    famille: "automatisations",
    statut: "publie",
    featured: null,
    offreConstruction: null,
    offreConseil: "pack-ia",
    budgetIndicatif: null,
    delai: null,
    clientId: "urban-pousses",
    clientType: "pme",
    clientName: "Urban Pousses",
    imageUrl: "/img/logo_urbanpousses.webp",
    galleryUrl: "/img/logo_urbanpousses.webp",
    date: { month: null, year: 2026 }, // TODO(Agathe): mois de réalisation
    updated: { month: 8, year: 2026 },
    technologies: ["Claude Cowork", "Notion"],
  },
];

// ─── French content ────────────────────────────────────────────────────────

const CONTENT_FR: Record<string, CaseStudyContent> = {
  "aloyse-leledy-becue": {
    title: "Aloyse Leledy-Bécue — Portfolio de cinéaste",
    description:
      "Création du portfolio WordPress sur-mesure d'Aloyse Leledy-Bécue, cinéaste : une vitrine soignée pour une filmographie de plus de vingt ans, filtrable par thème et par type de projet, et enrichie en toute autonomie.",
    enBref: [
      "J'ai créé le portfolio WordPress sur-mesure du cinéaste Aloyse Leledy-Bécue, avec un thème dédié et des champs structurés (ACF) pour documenter chaque film.",
      "Le site réunit une filmographie de plus de vingt ans, de 2004 à aujourd'hui, filtrable par thème et par type de projet.",
      "Aloyse Leledy-Bécue administre lui-même l'ajout et le classement de ses films depuis l'administration WordPress, sans intervention technique.",
      "Le projet a été livré en 3 semaines.",
    ],
    detailedDescription: `Aloyse Leledy-Bécue est cinéaste, avec une filmographie riche qui s'étend sur plus de vingt ans, de 2004 à aujourd'hui : réalisations personnelles, commandes et collaborations, aux côtés d'une biographie et d'un contact. Un tel catalogue, nombreux et varié, appelait une vitrine à la hauteur d'une identité visuelle forte — capable de donner à voir chaque film sans noyer le visiteur, et d'être enrichie sans dépendre d'un tiers à chaque nouveau projet.\n\nJ'ai conçu et développé un site vitrine WordPress avec un thème sur-mesure, pensé autour de la filmographie. Chaque film est documenté via des champs structurés (ACF — Advanced Custom Fields) : année, rôle, thèmes. Cette structuration alimente un filtrage de la filmographie par thème (architecture, art contemporain, danse et performance, expérimental, féminisme…) et par type de projet (réalisations personnelles, commandes, collaborations), qui laisse le visiteur explorer un corpus dense selon son entrée.\n\nLe thème sur-mesure porte l'identité éditoriale du portfolio, tandis que la saisie via ACF donne à la cinéaste la main sur son catalogue : ajouter un film, le documenter et le classer se fait en autonomie depuis l'administration WordPress, sans intervention technique.\n\nLe résultat est un portfolio soigné qui réunit plus de vingt ans de films en un seul lieu, filtrable et administrable en autonomie, à l'image de la démarche artistique qu'il présente.`,
    objectives: [
      "Donner une vitrine soignée à une filmographie riche et à une identité visuelle forte",
      "Réunir en un seul lieu réalisations personnelles, commandes et collaborations",
      "Permettre au cinéaste d'ajouter et de documenter ses films en autonomie",
      "Structurer chaque film par métadonnées (année, rôle, thèmes) pour un catalogue filtrable",
      "Offrir un filtrage par thème, par type de projet et par chronologie",
    ],
    results: [
      "Portfolio WordPress sur-mesure réunissant une filmographie de 2004 à aujourd'hui",
      "Filmographie filtrable par thème et par type de projet",
      "Chaque film documenté par des champs structurés (année, rôle, thèmes) via ACF",
      "Catalogue administrable en autonomie depuis l'administration WordPress",
    ],
    arbitrage: {
      consideredOptions: [
        "Page builder générique clé en main",
        "Front headless sur-mesure (WordPress + Next.js)",
        "Thème WordPress sur-mesure adossé à ACF",
      ],
      decision: "Thème WordPress sur-mesure couplé à ACF (Advanced Custom Fields).",
      rationale:
        "Un page builder générique aurait bridé l'identité visuelle du portfolio et la saisie de métadonnées structurées ; un front headless était surdimensionné pour un catalogue auto-administré. Le thème sur-mesure porte une identité éditoriale propre, et ACF structure chaque film (année, rôle, thèmes) pour un catalogue filtrable que la cinéaste enrichit en autonomie.",
    },
    galleryAlt: "Portfolio de la cinéaste Aloyse Leledy-Bécue, filmographie filtrable",
    tags: ["Indépendant", "Culture", "Cinéma", "Site vitrine", "WordPress"],
    cardDescription: "Portfolio WordPress sur-mesure d'une cinéaste : une filmographie de plus de vingt ans, filtrable et administrable en autonomie.",
  },
  "hermitage-ecolise": {
    title: "L'Hermitage — Démonstrateur européen ECOLISE",
    description:
      "Création du site one-page qui annonce la sélection de L'Hermitage parmi les 15 Démonstrateurs européens du Regenerative Communities Fund d'ECOLISE : un récit clair, des chiffres concrets et un parcours qui mène du terrain à la prise de contact.",
    enBref: [
      "J'ai conçu le site one-page en Next.js et Tailwind CSS qui annonce la sélection du Tiers Lieu L'Hermitage parmi les 15 Démonstrateurs européens du Regenerative Communities Fund d'ECOLISE, retenu sur près de 70 candidatures.",
      "L'Hermitage est un tiers-lieu rural de 30 hectares à Autrêches, dans l'Oise, cofinancé par l'Union européenne via le programme DEAR.",
      "Le site présente les six chantiers d'expérimentation du lieu (hospitalité, coopération, agroécologie, forêt, innovation sociale, formation), chacun adossé à un chiffre concret comme les 22 hectares de forêt en gestion raisonnée.",
      "La page, entièrement pré-rendue et servie en statique depuis Vercel, a été livrée en 1 semaine.",
    ],
    detailedDescription: `Fin 2025, ECOLISE — le réseau européen des initiatives citoyennes pour le climat — a retenu quinze lieux dans cinq pays, parmi près de 70 candidatures, pour devenir les démonstrateurs de son Regenerative Communities Fund, cofinancé par l'Union européenne (programme DEAR). L'Hermitage, tiers-lieu rural de 30 hectares à Autrêches dans l'Oise, est l'un d'eux. Ce mandat européen méritait mieux qu'un communiqué : il fallait un site dédié, capable d'expliquer l'engagement à des publics très différents — habitants du territoire, collectivités, entreprises, chercheurs et les quatorze autres lieux du réseau.\n\nJ'ai conçu et développé un site one-page avec Next.js et Tailwind CSS, construit comme un récit : l'engagement européen (qui est ECOLISE, ce qu'est un démonstrateur, le chemin « de Bruxelles à Autrêches »), la boussole 3Zéro — zéro exclusion, zéro carbone, zéro pauvreté —, la mission en trois gestes (expérimenter, partager, inspirer), le laboratoire vivant, puis les six chantiers ouverts : hospitalité, coopération, agroécologie, forêt, innovation sociale et formation. Chaque chantier est adossé à un chiffre concret du lieu — 100+ couchages, 100 sociétaires de la coopérative, 22 hectares de forêt en gestion raisonnée — pour rester fidèle à l'esprit du lieu : prouver par le terrain, pas par le discours.\n\nCôté technique, la page est entièrement pré-rendue et servie statiquement depuis Vercel : navigation par ancres, images optimisées et préchargées, métadonnées SEO et Open Graph soignées. Les mentions obligatoires du cofinancement européen (projet Funding Fairer Futures, programme DEAR) sont intégrées conformément aux exigences du fonds.\n\nLe site s'insère dans l'écosystème web de L'Hermitage que je fais grandir projet après projet — site principal, jeu de piste, landing séjours — et referme le parcours sur trois appels à l'action gradués : visiter le lieu, organiser un séminaire, construire un partenariat.`,
    objectives: [
      "Annoncer la sélection de L'Hermitage parmi les 15 Démonstrateurs européens d'ECOLISE avec un site dédié",
      "Rendre lisible un dispositif européen complexe (fonds, réseau, boussole 3Zéro) pour des publics variés",
      "Présenter les six chantiers d'expérimentation du lieu, chacun adossé à un chiffre concret",
      "Orienter les visiteurs vers l'action : visite, séminaire, partenariat, contact",
      "Livrer une page légère et rapide, cohérente avec l'écosystème de sites déjà en place",
    ],
    results: [
      "Site one-page en ligne sur un sous-domaine dédié de l'écosystème L'Hermitage",
      "Un récit complet : engagement européen, boussole 3Zéro, mission, laboratoire vivant et six chantiers",
      "Page entièrement pré-rendue et servie statiquement depuis le CDN Vercel",
      "Mentions du cofinancement européen (programme DEAR) intégrées conformément aux obligations du fonds",
      "Trois appels à l'action gradués : visiter, organiser un séminaire, construire un partenariat",
    ],
    galleryAlt: "Site one-page du démonstrateur européen ECOLISE de L'Hermitage",
    tags: ["ESS", "Tiers-lieu", "One-page", "Next.js", "Europe"],
    cardTitle: "L'Hermitage — Démonstrateur ECOLISE",
    cardDescription: "One-page Next.js annonçant la sélection de L'Hermitage parmi les 15 Démonstrateurs européens du réseau ECOLISE.",
  },
  reseauteurs: {
    title: "Réseauteurs",
    description:
      "Développement de Réseauteurs, la plateforme nationale du networking : un annuaire, un agenda et une carte interactive qui rassemblent les professionnels, les événements et les réseaux d'affaires français en un seul endroit.",
    enBref: [
      "J'ai développé de bout en bout Réseauteurs, la plateforme nationale du networking professionnel français, avec Next.js, Payload CMS et Stripe.",
      "Elle réunit un annuaire filtrable par ville, secteur et réseau, un agenda d'événements et une carte interactive géolocalisant professionnels et rendez-vous sur fonds OpenStreetMap.",
      "Un système de badges d'assiduité (Bronze, Argent, Gold, Platinum) gamifie la participation aux événements, et l'abonnement Réseauteur+ est souscrit et payé en ligne via Stripe.",
      "La plateforme a été livrée en 3 mois, du concept à la mise en ligne.",
    ],
    detailedDescription: `Le networking professionnel français est éclaté entre des dizaines de réseaux d'affaires — BNI, CJD, Dynabuy, Rotary, CPME… — chacun avec ses membres, ses agendas et ses formats. Pour un professionnel qui veut réseauter, impossible d'avoir une vue d'ensemble : qui est actif près de chez moi, quels événements ont lieu cette semaine, quels réseaux méritent le détour ? Réseauteurs est né de ce constat, avec un parti pris assumé : « Réseauteurs ne remplace aucun réseau — il les rassemble. »\n\nJ'ai développé la plateforme sur-mesure de bout en bout avec Next.js et Payload CMS : un annuaire des réseauteurs filtrable par ville, secteur et réseau ; un agenda des événements (afterworks, petits-déjeuners, conférences) ; et une carte interactive qui géolocalise professionnels et rendez-vous partout en France, sur fonds OpenStreetMap avec géocodage via l'API Adresse de data.gouv.fr.\n\nAu-delà de la consultation, Réseauteurs est un vrai produit avec son modèle économique : comptes membres gratuits, système de badges d'assiduité (Bronze, Argent, Gold, Platinum) pour gamifier la participation aux événements, et abonnement payant Réseauteur+ — souscrit et réglé en ligne via Stripe — qui débloque la création d'événements et de réseaux locaux.\n\nLe tout repose sur une fondation pensée pour durer : rendu Next.js optimisé pour le SEO et la performance, back-office Payload pour administrer les contenus en autonomie, en-têtes de sécurité stricts (CSP, HSTS) et hébergement Vercel. La plateforme est en ligne et prête à fédérer la communauté des réseauteurs français.`,
    objectives: [
      "Rassembler professionnels, événements et réseaux d'affaires français sur une plateforme unique",
      "Donner une visibilité géographique au networking : annuaire filtrable et carte interactive",
      "Encourager l'assiduité aux événements par un système de badges",
      "Monétiser la plateforme avec un abonnement en ligne débloquant la création d'événements et de réseaux",
      "Poser une fondation technique évolutive, performante et sécurisée",
    ],
    results: [
      "Plateforme complète en ligne : annuaire, agenda, carte, comptes membres et paiement",
      "Annuaire des réseauteurs filtrable par ville, secteur et réseau",
      "Carte interactive des professionnels et des événements partout en France",
      "Gamification opérationnelle : badges Bronze, Argent, Gold et Platinum selon l'assiduité",
      "Modèle freemium fonctionnel : abonnement Réseauteur+ payé en ligne via Stripe",
    ],
    galleryAlt: "Plateforme Réseauteurs : annuaire, agenda et carte du networking professionnel",
    tags: ["Plateforme", "Networking B2B", "Next.js", "Payload CMS", "Stripe"],
    cardDescription: "La plateforme nationale du networking : annuaire, agenda et carte des réseaux d'affaires français.",
    cardAlt: "Plateforme Réseauteurs, annuaire et carte du networking professionnel",
  },
  "arguin-marine": {
    title: "Arguin Marine",
    description:
      "Création du site vitrine WordPress d'Arguin Marine, service de location de bateaux haut de gamme sur le Bassin d'Arcachon : une présence en ligne simple, soignée et facile à administrer.",
    enBref: [
      "J'ai créé le site vitrine WordPress d'Arguin Marine, un service de location de bateaux haut de gamme sur le Bassin d'Arcachon.",
      "Le site met en avant l'offre de location, les bateaux et les informations pratiques, avec une prise de contact directe.",
      "Il a été pensé pour rester simple à administrer côté client et pour bien se positionner sur les recherches locales autour d'Arcachon.",
      "Le projet a été livré en 3 semaines.",
    ],
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
    cardDescription: "Vitrine WordPress d'un service de location de bateaux haut de gamme sur le Bassin d'Arcachon.",
  },
  "la-petite-vitrine": {
    title: "La Petite Vitrine",
    description:
      "Conception de La Petite Vitrine, un service packagé de mise en ligne pour indépendants, TPE et artisans : des modèles pensés par métier, intégrés avec votre contenu et publiés après validation, avec hébergement et maintenance gérés.",
    enBref: [
      "J'ai conçu et développé La Petite Vitrine, une plateforme qui industrialise la création de mini-sites par métier pour les indépendants, TPE et artisans, avec Next.js, React, TypeScript et Tailwind CSS.",
      "L'offre est packagée et lisible : 650 € HT pour la mise en ligne (intégration comprise), puis dès 14 € HT/mois pour l'hébergement et la maintenance.",
      "Un programme pilote de 10 projets — 5 cabinets en santé mentale et 5 ateliers d'artisans — documente le service avec de vrais exemples exploitables.",
      "La plateforme a été livrée en 3 mois, sans publicité ni traceur, conformément au RGPD.",
    ],
    detailedDescription: `Les indépendants, petites structures et artisans ont besoin d'une présence en ligne nette et professionnelle, mais se retrouvent coincés entre deux extrêmes : le site sur-mesure, trop long et trop cher, et l'éditeur DIY, chronophage et vite bâclé. La Petite Vitrine est née de ce constat — offrir un troisième chemin, simple et encadré.\n\nJ'ai conçu et développé La Petite Vitrine, une plateforme qui industrialise la création de mini-sites par métier. On part d'un modèle adapté à la profession (santé, commerce, services, bien-être, loisirs), j'y intègre le contenu du client, et le site est mis en ligne après validation. Chaque site suit une structure claire et éprouvée : présentation, offre, infos pratiques, contact, mentions légales.\n\nSous le capot, c'est une application Next.js (React, TypeScript, Tailwind) : un catalogue de modèles thématiques, un pipeline d'export et de publication des sites, et un stockage des contenus sur Vercel Blob. L'hébergement et la maintenance sont gérés de bout en bout — le client n'a rien à installer ni à administrer. RGPD par défaut : aucune publicité, aucun traceur.\n\nLe résultat est une offre lisible et sans surprise : 650 € HT pour la mise en ligne (intégration comprise), puis dès 14 € HT/mois pour l'hébergement et la maintenance, avec paiement après cadrage. Un programme pilote de 10 projets (5 cabinets en santé mentale, 5 ateliers d'artisans) documente le service avec de vrais exemples exploitables plutôt qu'avec des visuels promotionnels.`,
    objectives: [
      "Offrir aux indépendants et TPE une présence en ligne professionnelle, sans la complexité d'un site sur-mesure ni le bricolage d'un éditeur DIY",
      "Industrialiser la création de mini-sites par métier à partir de modèles prêts à publier",
      "Prendre en charge tout le cycle : intégration du contenu, mise en ligne, hébergement et maintenance",
      "Garantir un cadre clair : prix fixe, RGPD, sans publicité ni traceur",
    ],
    results: [
      "Offre packagée et lisible : 650 € HT la mise en ligne, dès 14 € HT/mois hébergement et maintenance",
      "Plateforme Next.js avec catalogue de modèles par métier et pipeline de publication",
      "Sites livrés clés en main, sans installation ni administration côté client",
      "Programme pilote de 10 projets (santé mentale et artisans) pour documenter le service",
    ],
    galleryAlt: "La Petite Vitrine — service de mise en ligne de mini-sites par métier",
    tags: ["Indépendants", "TPE", "Produit", "Web App", "Next.js"],
    cardDescription: "Service packagé de mise en ligne de mini-sites par métier pour indépendants et TPE.",
  },
  "peer-to-peer": {
    title: "Peer to Peer",
    description:
      "Création de Peer to Peer, une plateforme libre d'auto-observation et de soutien au rétablissement en santé mentale : 14 outils utilisables directement dans le navigateur, sans compte et sans aucune donnée envoyée.",
    enBref: [
      "J'ai créé Peer to Peer, une plateforme libre d'auto-observation et de soutien au rétablissement en santé mentale, initiative à impact de Next Impact.",
      "Elle regroupe 14 outils — 9 questionnaires et échelles, 5 parcours et carnets guidés — utilisables directement dans le navigateur.",
      "Le traitement est 100 % local : aucune donnée n'est envoyée à un serveur, sans création de compte ni installation.",
      "La plateforme a été livrée en 1 mois.",
    ],
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
    cardDescription: "Plateforme libre d'auto-observation en santé mentale, 100 % locale et sans compte.",
  },
  "cafe-citoyen": {
    title: "Café citoyen",
    description:
      "Création du site vitrine du Café citoyen d'Auger-Saint-Vincent : un site WordPress Headless avec Next.js, pour promouvoir les événements et faciliter les réservations de cette association citoyenne.",
    enBref: [
      "J'ai développé le site vitrine du Café citoyen d'Auger-Saint-Vincent en WordPress Headless avec Next.js, pour promouvoir les événements de cette association citoyenne et faciliter les réservations.",
      "Le site a fait progresser les visites du lieu de 20 % et multiplié par 3 les abonnements à la newsletter.",
      "Il comprend une section d'actualités régulièrement mise à jour, une page dédiée aux événements à venir et un formulaire de contact.",
      "Le projet a été livré en 3 semaines.",
    ],
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
    cardDescription: "Site vitrine du Café citoyen",
    cardAlt: "Site vitrine du Café citoyen",
  },
  "hermitage-jeu-de-piste": {
    title: "L'hermitage - Jeu de piste",
    description:
      "Création d'une application mobile (PWA) pour le domaine forestier du Tiers Lieu L'Hermitage. Une expérience ludique et géolocalisée, installable sur smartphone sans passer par les stores et fonctionnant sans connexion permanente.",
    enBref: [
      "J'ai développé une Progressive Web App (PWA) en Next.js pour le jeu de piste géolocalisé du domaine forestier du Tiers Lieu L'Hermitage, installable en un tap depuis le navigateur, sans passer par les stores.",
      "Les énigmes sont déclenchées par la géolocalisation des joueurs, et la progression est persistée localement sur l'appareil pour fonctionner même hors-ligne en pleine forêt.",
      "Le premier test grandeur nature a réuni 120 personnes, selon le témoignage de Charlotte Bourez, gérante du café associatif de L'Hermitage.",
      "Le projet a été livré en 4 semaines.",
    ],
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
    cardDescription: "Jeu de piste du domaine forestier du Tiers Lieu L'Hermitage",
    cardAlt: "Jeu de piste du domaine forestier du Tiers Lieu L'Hermitage",
  },
  "comme-des-fous-jeux": {
    title: "Comme des fous - Jeux en ligne",
    description: "Jeux en ligne du média participatif Comme des fous",
    enBref: [
      "J'ai développé une section de jeux en ligne pour le média participatif Comme des fous, intégrée à son site WordPress Headless avec Next.js.",
      "Les jeux ont été conçus pour être engageants et interactifs, afin d'encourager les lecteurs à passer plus de temps sur le site.",
      "La section a été livrée avec une expérience utilisateur fluide et réactive.",
    ],
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
  },
  "comme-des-fous": {
    title: "Comme des fous",
    description: "Site du média participatif Comme des fous",
    enBref: [
      "J'ai migré le site du média participatif Comme des fous vers une architecture WordPress Headless avec Next.js, en conservant WordPress pour la rédaction et le contenu existant.",
      "Le score PageSpeed est passé de 56 à 98, soit un gain de 42 points de performance.",
      "Les rédacteurs ont conservé exactement la même interface d'administration WordPress, sans interruption pour l'équipe.",
      "Le projet a été livré en 2 mois.",
    ],
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
    cardTitle: "Comme des fous - Media WordPress Headless",
    cardAlt: "Site du média Comme des fous",
  },
  "next-event": {
    title: "Next Event - Démo WordPress Headless",
    description: "Site de démonstration pour une billetterie événementielle.",
    enBref: [
      "Next Event est un site de démonstration que j'ai conçu pour présenter une solution de billetterie événementielle en WordPress Headless avec Next.js.",
      "Le site comprend un système d'agenda pour les événements, une billetterie intégrée et des pages dédiées à chaque événement.",
      "Il est entièrement responsive et optimisé pour le référencement naturel.",
      "Le projet a été réalisé en 3 semaines, à titre de démonstration.",
    ],
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
    cardAlt: "Site de démonstration Next Event",
  },
  "les-etats-generaux-communaux": {
    title: "Les Etats Généraux Communaux",
    description: "Site vitrine des Etats Généraux Communaux",
    enBref: [
      "J'ai développé le site vitrine des Etats Généraux Communaux en WordPress Headless avec Next.js, pour promouvoir cet événement citoyen et faciliter la constitution de groupes locaux.",
      "Le site propose une section de ressources téléchargeables, un calendrier des événements et une carte interactive des groupes locaux constitués.",
      "Il a été mis en ligne avant la date de l'événement, avec une hausse du nombre de groupes locaux constitués.",
      "Le projet a été livré en 4 semaines.",
    ],
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
    cardAlt: "Site vitrine des Etats Généraux Communaux",
  },
  "panorama-pub": {
    title: "Panorama Pub",
    description:
      "Lancement de Panorama Pub, premier annuaire en ligne dédié aux fournisseurs d'objets publicitaires : un nouveau marché digital pour connecter acheteurs et fournisseurs sur un secteur encore éclaté.",
    enBref: [
      "J'ai accompagné le lancement de Panorama Pub, le premier annuaire en ligne dédié aux fournisseurs d'objets publicitaires en France, développé en Next.js et PostgreSQL.",
      "La plateforme centralise une offre fournisseurs jusque-là dispersée, avec recherche, filtrage et comparaison en quelques clics pour les acheteurs (agences, services communication, marketing).",
      "Un back-office dédié permet d'enrichir le catalogue de fiches fournisseurs en toute autonomie.",
      "Panorama Pub a été livré en 2 mois, du concept à la mise en ligne.",
    ],
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
    cardDescription: "Premier annuaire en ligne des fournisseurs d'objets publicitaires",
    cardAlt: "Annuaire Panorama Pub - fournisseurs d'objets publicitaires",
  },
  proditec: {
    title: "Proditec",
    description:
      "Refonte du site vitrine pour une entreprise de l'industrie robotique internationale.",
    enBref: [
      "J'ai refondu le site vitrine de Proditec, une entreprise de robotique industrielle à rayonnement international, en WordPress multilingue avec Polylang.",
      "Le score PageSpeed est passé de 45 à 98 sur mobile et desktop, et le score d'accessibilité a progressé de 30 %.",
      "Le site prend en charge 5 langues, pour s'adresser à la clientèle internationale de Proditec.",
      "Le projet a été livré en 1 mois.",
    ],
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
    cardDescription: "Site corporate multilingue",
    cardAlt: "Site corporate Proditec",
  },
  doleances: {
    title: "Association des Doléances",
    description:
      "Création d'un site vitrine inspiré de Wikipédia destiné à promouvoir l'action de l'association.",
    enBref: [
      "J'ai créé le site vitrine de l'Association Les Doléances en WordPress Headless avec Next.js, avec un template inspiré de Wikipédia pour incarner l'esprit communautaire et participatif de l'association.",
      "Le site met à disposition les Doléances de 2018-2019 et comprend une cartographie interactive de ses groupes locaux.",
      "L'administration est simplifiée pour l'équipe grâce à l'architecture Headless.",
      "Le projet a été livré en 2 mois.",
    ],
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
    cardTitle: "Les Doléances",
    cardDescription: "Vitrine des Doléances de 2018-2019",
    cardAlt: "Vitrine des Doléances",
  },
  sowee: {
    title: "Sowee",
    description:
      "Création d'une section blog pour le portail de l'entreprise Sowee, spécialisée dans les solutions énergétiques.",
    enBref: [
      "J'ai développé une section blog personnalisée pour le portail de Sowee, entreprise spécialisée dans les solutions énergétiques, sur un thème WordPress GeneratePress sur-mesure.",
      "Le thème a été réalisé en respectant fidèlement les maquettes fournies par l'équipe marketing de Sowee, livré en 10 jours.",
      "La section blog permet à l'équipe de publier des articles, d'ajouter des images et de gérer les catégories en toute autonomie.",
    ],
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
    cardDescription: "Section blog de Sowee",
    cardAlt: "Section blog de Sowee",
  },
  "salon-de-la-carrosserie": {
    title: "Salon de la Carrosserie 2024",
    description:
      "Création d'un site vitrine pour le Salon de la Carrosserie 2024, avec un design moderne et un espace d'inscription pour exposants.",
    enBref: [
      "J'ai créé le site vitrine du Salon de la Carrosserie 2024 en WordPress avec Elementor Pro, pour promouvoir l'événement et faciliter l'inscription des exposants.",
      "Un espace d'inscription dédié permet aux entreprises exposantes de s'inscrire et de gérer leurs disponibilités.",
      "Le site met en avant les exposants, les partenaires et les sponsors de l'événement.",
      "Le projet a été livré en 15 jours.",
    ],
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
    cardDescription: "Site vitrine du Salon de la Carrosserie 2024",
    cardAlt: "Site vitrine du Salon de la Carrosserie 2024",
  },
  hermitage: {
    title: "Tiers Lieu L'Hermitage",
    description:
      "Refonte progressive à la marge du site vitrine du Tiers Lieu L'Hermitage.",
    enBref: [
      "J'ai fait migrer le site vitrine du Tiers Lieu L'Hermitage du builder Divi vers Elementor, pour en améliorer la performance et la stabilité.",
      "Le score PageSpeed a gagné 30 points, et des fonctionnalités de dons récurrents et de dons dédiés à des projets spécifiques ont été ajoutées.",
      "Le site est aujourd'hui stable, rapide et facile à administrer pour l'équipe de L'Hermitage.",
      "Le projet a été livré en 1 mois.",
    ],
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
    // Citation de Jean Karinthi portée au niveau du client (CLIENT_TESTIMONIALS_FR) :
    // elle vaut pour toutes les fiches L'Hermitage, pas seulement celle-ci.
    galleryAlt: "Page d'accueil du site Tiers Lieu L'Hermitage",
    tags: ["Refonte", "Impact", "WordPress"],
    cardDescription: "Site vitrine du Tiers Lieu L'Hermitage",
    cardAlt: "Site vitrine du Tiers Lieu L'Hermitage",
  },
  "erp-services": {
    title: "ERP Services",
    description:
      "Refonte à l'identique du site vitrine d'ERP Services, bureau d'études en ingénierie.",
    enBref: [
      "J'ai réalisé la refonte à l'identique du site vitrine d'ERP Services, un bureau d'études en ingénierie, en conservant son identité visuelle.",
      "Le score PageSpeed mobile est passé de 45 à 99, soit un gain de 54 points de performance.",
      "Le site met en avant les projets phares d'ERP Services, avec des moyens de contact renforcés pour les clients potentiels.",
      "Le projet a été livré en 2 semaines.",
    ],
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
    cardDescription: "Site vitrine d'ERP Services",
    cardAlt: "Site vitrine d'ERP Services",
  },
  "senza-nature": {
    title: "Senza Nature",
    description:
      "Création d'un site e-commerce pour la vente de produits naturels et bio.",
    enBref: [
      "J'assure le suivi global du site e-commerce de Senza Nature, spécialisé dans la vente de produits naturels et bio et construit sur WooCommerce, en continu depuis 2024.",
      "Cet accompagnement a permis une réduction de 90 % des bugs et une amélioration de 50 % de la vitesse de chargement du site.",
      "Le suivi couvre la maintenance, les mises à jour et les évolutions du site, avec un score PageSpeed élevé sur mobile et desktop.",
    ],
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
    cardDescription: "Site ecommerce Senza Nature",
    cardAlt: "Site ecommerce Senza Nature",
  },
  "wagner-hamisky": {
    title: "Wagner Hamisky",
    description:
      "Création d'un site vitrine pour la galerie d'art Wagner Hamisky.",
    enBref: [
      "J'ai créé le site vitrine WordPress sur-mesure de la galerie d'art Wagner Hamisky, à l'occasion de son ouverture, avec un thème custom et ACF Pro.",
      "Le site présente les œuvres de 2 artistes, avec une galerie d'images et des descriptions détaillées de chaque œuvre.",
      "Le catalogue des œuvres a été pensé pour une gestion simple, permettant à la galerie de l'administrer en autonomie.",
      "Le projet a été livré en 3 semaines.",
    ],
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
    cardDescription: "Site vitrine de la galerie Wagner Hamisky",
    cardAlt: "Site vitrine Wagner Hamisky",
  },
  mediatico: {
    title: "Mediatico",
    description:
      "Création d'un Média en ligne pour Mediatico, toute l'actualité de l'ESS.",
    enBref: [
      "J'ai développé le média en ligne de Mediatico, dédié à l'actualité de l'économie sociale et solidaire, en WordPress avec un thème custom en Full Site Editing (Gutenberg).",
      "Le site met en avant les articles récents, les partenaires et sponsors, ainsi qu'un espace dédié aux publications des visiteurs.",
      "Il est entièrement responsive et optimisé pour le référencement naturel.",
      "Le projet a été livré en 4 semaines.",
    ],
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
    cardDescription: "Site vitrine de Mediatico",
    cardAlt: "Site vitrine de Mediatico",
  },
  infralliance: {
    title: "Infralliance",
    description:
      "Création d'un site vitrine pour Infralliance, Think and Do Thank des opérateurs d'infrastructures numériques.",
    enBref: [
      "J'ai créé le site vitrine d'Infralliance, think and do tank des opérateurs d'infrastructures numériques, en WordPress avec Elementor Pro et Advanced Custom Fields.",
      "Le site met en avant les actions de l'association et son réseau d'opérateurs d'infrastructures numériques.",
      "Il a été mis en ligne avant l'événement de lancement de l'association, et reste simple à administrer pour l'équipe interne.",
      "Le projet a été livré en 2 semaines.",
    ],
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
    cardDescription: "Site vitrine d'Infralliance",
    cardAlt: "Site vitrine d'Infralliance",
  },
  "connexion-plus": {
    title: "GEM Connexion",
    description:
      "Création d'un site vitrine pour le GEM Connexion Plus, association socio-culturelle parisienne.",
    enBref: [
      "J'ai créé le site vitrine de GEM Connexion Plus, groupe d'entraide mutuelle parisien, en WordPress avec un thème communautaire co-construit lors d'ateliers participatifs.",
      "Le site met en avant les activités et projets du GEM, avec un espace dédié où les membres peuvent publier leurs actualités.",
      "Il facilite la prise de contact pour les partenaires et le public, avec une navigation entièrement responsive.",
      "Le projet a été livré en 4 semaines.",
    ],
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
    cardTitle: "Connexion Plus",
    cardDescription: "Site vitrine Connexion Plus",
    cardAlt: "Connexion Plus - Développeur WordPress Freelance",
  },
  sdevo: {
    title: "SDEVO",
    description:
      "Création d'un plugin de gestion des demandes de subventions pour le Syndicat départemental des énergies du Val d'Oise.",
    enBref: [
      "J'ai développé un plugin WordPress sur-mesure pour le Syndicat départemental des énergies du Val d'Oise (SDEVO), afin de gérer les demandes de subventions des communes.",
      "Le plugin permet aux communes de soumettre leurs demandes en ligne via une interface intuitive, et centralise leur suivi pour le SDEVO.",
      "Il est entièrement intégré à WordPress, pour une administration simplifiée côté SDEVO.",
      "Le projet a été livré en 3 semaines.",
    ],
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
    cardTitle: "Syndicat départemental d'énergie du Val d'Oise",
    cardDescription: "Plugin de gestion des subventions SDEVO",
    cardAlt: "Plugin de gestion des subventions SDEVO",
  },
  // ─── Gabarits automatisation (chantier D2) — brouillons, rien d'inventé :
  // tout ce qui n'est pas fourni par la cliente reste [À COMPLÉTER].
  "hermitage-veille": {
    title: "L'Hermitage — Veille sectorielle et concurrentielle sur le séjour d'entreprise",
    description:
      "Une veille sur le secteur des tiers-lieux doublée d'une cartographie de cinquante concurrents du séjour sur mesure en lieu patrimonial, classés par type d'offre, avec identification des niches selon le marché et la concurrence.",
    enBref: [
      "J'ai mis en place pour le Tiers Lieu L'Hermitage un dispositif d'agents IA de veille : une veille sectorielle continue sur les tiers-lieux et une cartographie concurrentielle du séjour d'entreprise en lieu patrimonial.",
      "La cartographie identifie 50 concurrents classés par type d'offre, de l'opérateur intégré du séminaire résidentiel au monument patrimonial privatisable sans prestation.",
      "Elle révèle que L'Hermitage est aussi concurrencé par les entreprises elles-mêmes, qui organisaient 80 % de leurs événements dans leurs propres locaux en 2025 contre 57 % un an plus tôt, et documente un écart de lisibilité : la quasi-totalité des concurrents publient capacité et tarifs, contrairement à L'Hermitage.",
      "Le dispositif a aussi capté à temps le retrait de l'État du financement des tiers-lieux en 2026, un secteur qui tire en moyenne 43 % de son chiffre d'affaires de subventions publiques.",
    ],
    detailedDescription: `L'Hermitage est un tiers-lieu rural de 30 hectares à Autrêches, dans l'Oise, porté par une coopérative et retenu parmi les quinze Démonstrateurs européens du réseau ECOLISE. Une part de son équilibre économique repose sur l'accueil de groupes : séminaires d'entreprise, séjours d'équipe, résidences. Or ce revenu dépend de deux marchés qui bougent vite et dans des directions différentes — celui des tiers-lieux, avec ses financements publics et ses modèles économiques fragiles, et celui du séminaire d'entreprise, avec ses budgets sous contrainte et ses exigences RSE croissantes.\n\nAvant, l'information arrivait par bribes : une conversation, un article partagé, un appel d'offres découvert trop tard. Personne dans l'équipe n'avait le temps de tenir une veille structurée, et surtout personne ne savait répondre précisément à la question qui compte quand on perd un dossier : contre qui étions-nous mis en concurrence, et sur quel critère avons-nous perdu ?\n\nJ'ai mis en place un dispositif d'agents IA à deux étages. Le premier assure une veille sectorielle continue sur les tiers-lieux — financements, dispositifs publics, modèles économiques, signaux de fragilité et de fermeture. Le second a produit une cartographie concurrentielle approfondie du séjour d'entreprise en lieu patrimonial : cinquante acteurs identifiés et classés par type d'offre, depuis l'opérateur intégré qui industrialise le séminaire résidentiel jusqu'au monument privatisable sans prestation, en passant par les éco-lieux qui racontent la même histoire d'impact que L'Hermitage.\n\nLa règle de travail était la même que sur toutes mes missions de veille : chaque lieu est vérifié à sa source, chaque capacité et chaque tarif sont relevés là où ils sont publiés, et ce qui relève de la déduction est signalé comme tel. Les acteurs invérifiables sont écartés plutôt que gonflés au comptage, et les zones d'ombre sont listées comme telles en fin de document.`,
    objectives: [
      "Savoir contre qui L'Hermitage est réellement mis en concurrence quand une entreprise cherche un lieu de séminaire",
      "Classer ces concurrents par type d'offre plutôt que par simple proximité géographique",
      "Identifier les niches défendables en croisant l'état du marché et la densité concurrentielle",
      "Suivre en continu un secteur des tiers-lieux dont les financements et les modèles évoluent vite",
      "Remplacer une information reçue par hasard par une information triée qui arrive",
    ],
    results: [
      "50 concurrents identifiés et classés par type d'offre, de l'opérateur intégré au lieu patrimonial nu",
      "Niches identifiées par croisement du niveau de maturité du marché et de la densité concurrentielle",
      "Veille sectorielle continue sur les tiers-lieux : financements publics, modèles économiques, signaux de fragilité",
      "Écart de lisibilité mis en évidence : la quasi-totalité des concurrents publient capacité et tarifs, L'Hermitage ne publie ni l'un ni l'autre",
      "Prix d'ancrage du segment documenté à partir des grilles publiques des concurrents de la zone",
      "Positionnement RSE objectivé : les concurrents ont soit le récit, soit la certification opposable au service achats, rarement les deux",
      "Concurrent n°1 identifié hors du panel des lieux : les entreprises elles-mêmes, qui tenaient 80 % de leurs événements dans leurs propres locaux en 2025 contre 57 % un an plus tôt",
      "Tendance de fond confirmée en faveur du positionnement : les châteaux et demeures de caractère sont passés d'environ 20 % à 58 % des lieux retenus en dix ans",
      "Signal sectoriel capté à temps : le retrait de l'État du financement des tiers-lieux en 2026, alors que ce secteur tire en moyenne 43 % de son chiffre d'affaires de subventions publiques",
    ],
    arbitrage: {
      consideredOptions: [
        "Agent IA de veille sur mesure",
        "Agence de conseil en tourisme d'affaires",
        "Abonnement à une revue sectorielle",
        "Veille manuelle par l'équipe",
      ],
      decision:
        "Un dispositif d'agents IA associant une veille sectorielle récurrente sur les tiers-lieux et une cartographie concurrentielle approfondie du séjour d'entreprise en lieu patrimonial.",
      rationale:
        "Une revue sectorielle informe sur un secteur mais ne dit jamais contre qui on perd un dossier. Une agence livre une étude datée du jour de sa remise, pour un budget sans rapport avec celui d'un tiers-lieu associatif. Et la veille manuelle suppose du temps que l'équipe n'a pas. L'agent produit la cartographie en quelques heures, cite chacune de ses sources, et se relance quand le marché bouge : la valeur n'est pas le rapport, c'est la capacité à le refaire.",
    },
    solution:
      "Des agents de recherche spécialisés, lancés en parallèle sur chaque famille de concurrents — opérateurs intégrés du séminaire résidentiel, monuments et domaines patrimoniaux privatisables, éco-lieux et lieux à impact, hôtellerie de château, plateformes d'intermédiation — puis un agent dédié au contexte sectoriel des tiers-lieux et du tourisme d'affaires. Chaque lieu retenu est vérifié sur ses propres pages : capacité en couchages et en salles, prestations intégrées, tarifs publiés, exploitant, et revendication environnementale ou sociale. Les résultats sont consolidés en un document unique : la carte des concurrents par type d'offre, la lecture des niches, et la liste explicite de ce qui n'a pas pu être vérifié.",
    galleryAlt:
      "Logo du Tiers Lieu L'Hermitage, tiers-lieu rural de l'Oise",
    tags: ["IA", "Automatisation", "Veille", "Tiers-lieu"],
    cardTitle: "L'Hermitage — Veille concurrentielle par agents IA",
    cardDescription:
      "Veille sectorielle sur les tiers-lieux et cartographie de 50 concurrents du séjour d'entreprise en lieu patrimonial, par type d'offre.",
  },
  "urban-pousses-veille": {
    title: "Urban Pousses — Veille concurrentielle et arbitrage de niches par agents IA",
    description:
      "Trente concurrents cartographiés en cinq types d'offres, huit niches comparées sur quatre critères et une recommandation stratégique, pour un producteur de micro-pousses de l'Oise — chaque acteur vérifié au registre des entreprises.",
    enBref: [
      "J'ai mis en place pour Urban Pousses, producteur de micro-pousses dans l'Oise, un dispositif de 5 agents IA de veille et d'analyse concurrentielle, chaque acteur cité étant vérifié au registre des entreprises.",
      "Le dispositif cartographie 30 concurrents en 5 types d'offres et compare 8 niches de diversification sur 4 critères (maturité, accessibilité, tendance à trois ans, concurrents en place).",
      "Il révèle qu'aucun producteur de micro-pousses actif n'est identifié dans l'Oise, la Somme et l'Aisne, et documente 6 liquidations vérifiées en 4 ans sur ce marché, dont 2 à moins de 100 km du site de production.",
      "Une piste de diversification a été écartée sur pièces : 5 acteurs de l'équipement clé en main ont disparu entre 2022 et 2026.",
    ],
    detailedDescription: `Urban Pousses cultive des micro-pousses en intérieur dans l'Oise et les vend à des chefs, des collectivités et des distributeurs régionaux. C'est un métier de niche, et cette niche a une particularité gênante : elle n'existe dans aucune statistique publique. Ni Agreste, ni FranceAgriMer, ni les notes de conjoncture ne recensent la micro-pousse. Les seuls chiffres de marché disponibles proviennent de cabinets d'études privés qui se recopient entre eux et affichent le même taux de croissance d'une édition à l'autre sur des bases différentes.\n\nRésultat : un producteur avance sans savoir qui produit quoi, à quelle distance, à quel prix, et surtout sans savoir lesquelles de ses idées de développement sont réalistes. Faut-il vendre des graines ? Former d'autres producteurs ? Vendre des containers clés en main ? Viser les cantines ? Chacune de ces questions vaut un investissement, et aucune n'avait de réponse documentée.\n\nJ'ai monté un dispositif de cinq agents de recherche lancés en parallèle, chacun sur un segment du marché : les producteurs de micro-pousses en circuit régional, les acteurs de l'agriculture indoor à l'échelle industrielle, les fournisseurs d'équipements et de savoir-faire, le grand public et la distribution, et enfin le contexte de marché et les tendances. Chaque entreprise citée est vérifiée à l'annuaire des entreprises — forme juridique, date de création, effectif, état d'activité — et chaque affirmation est marquée comme lue à la source ou déduite.\n\nCe protocole a produit deux découvertes que personne n'aurait trouvées en surveillant des mots-clés. D'abord, le marché n'est pas concurrentiel mais constitué de quasi-monopoles régionaux, parce que le produit ne voyage pas : presque tous les producteurs vérifiés livrent uniquement leur bassin. Ensuite, l'Oise, la Somme et l'Aisne sont un trou blanc — aucun producteur de micro-pousses actif n'y a été identifié, contrôle croisé fait sur l'annuaire des maraîchers du département. La question stratégique n'était donc pas « comment se différencier », mais « comment occuper un territoire déjà vide avant qu'il ne se referme ».`,
    objectives: [
      "Savoir qui sont les concurrents réels, à quelle distance et sur quel positionnement",
      "Distinguer la menace immédiate de la menace structurelle, et le concurrent du canal de vente",
      "Évaluer honnêtement quelles pistes de diversification sont accessibles et lesquelles sont des pièges",
      "Disposer d'une recommandation d'offre, de positionnement et de conquête commerciale, pas d'un rapport de veille",
      "Remplacer une information cherchée au coup par coup par une information triée qui arrive",
    ],
    results: [
      "30 concurrents cartographiés en 5 types d'offres, chacun situé par sa proximité concurrentielle réelle et non par sa seule distance",
      "8 niches comparées sur 4 critères : maturité, accessibilité pour l'entreprise, tendance à trois ans et concurrents en place",
      "Une recommandation en 3 volets : stratégie d'offre, stratégie concurrentielle et séquence commerciale",
      "Constat structurant : aucun producteur de micro-pousses actif identifié dans l'Oise, la Somme et l'Aisne",
      "Six liquidations vérifiées au registre en quatre ans sur ce marché, dont deux à moins de 100 km du site de production",
      "Une piste de diversification écartée sur pièces : cinq acteurs de l'équipement clé en main ont disparu entre 2022 et 2026",
    ],
    arbitrage: {
      consideredOptions: [
        "Agent IA de veille et d'analyse sur mesure",
        "Cabinet d'études ou mission d'école de commerce",
        "Outil de veille SaaS par mots-clés",
        "Veille manuelle par le dirigeant",
      ],
      decision:
        "Un dispositif d'agents IA spécialisés par segment de marché, lancés en parallèle, avec vérification systématique de chaque acteur au registre des entreprises.",
      rationale:
        "Un outil SaaS surveille des mots-clés : il aurait remonté des articles, pas une carte de marché, et n'aurait jamais vu que trois départements sont vides — une absence ne déclenche aucune alerte. Un cabinet facture plusieurs milliers d'euros une étude figée le jour de sa remise. La veille manuelle coûte au dirigeant le temps qu'il passe déjà en production. L'agent construit la carte en quelques heures, cite chacune de ses sources, écarte ce qu'il ne peut pas vérifier, et se relance quand le marché bouge. La valeur n'est pas le document, c'est la capacité à le refaire.",
    },
    solution:
      "Cinq agents de recherche lancés en parallèle, un par segment de marché, avec une consigne commune et non négociable : ne citer que des entreprises réelles et vérifiables, distinguer systématiquement le fait lu à la source de la déduction, et signaler les données manquantes comme manquantes plutôt que les combler par des estimations. Chaque acteur est recoupé avec l'annuaire des entreprises pour confirmer son existence et son état d'activité — ce qui a permis d'écarter plusieurs concurrents apparents dont l'activité avait cessé, et d'en requalifier d'autres qui ne produisaient pas ce qu'ils semblaient produire. Le livrable consolide la cartographie par type d'offre, le tableau comparatif des niches, la recommandation, et la liste explicite des points restés invérifiés.",
    galleryAlt:
      "Logo Urban Pousses, producteur de micro-pousses dans l'Oise",
    tags: ["IA", "Automatisation", "Veille", "Étude de marché"],
    cardTitle: "Urban Pousses — Veille concurrentielle par agents IA",
    cardDescription:
      "30 concurrents cartographiés en 5 types d'offres, 8 niches comparées et une recommandation stratégique pour un producteur de micro-pousses.",
  },
};

// ─── English content ───────────────────────────────────────────────────────

const CONTENT_EN: Record<string, CaseStudyContent> = {
  "aloyse-leledy-becue": {
    title: "Aloyse Leledy-Bécue — Filmmaker portfolio",
    description:
      "Built the custom WordPress portfolio for filmmaker Aloyse Leledy-Bécue: a polished showcase for a filmography spanning more than twenty years, filterable by theme and project type, and enriched fully independently.",
    enBref: [
      "I built the custom WordPress portfolio for filmmaker Aloyse Leledy-Bécue, with a dedicated theme and structured fields (ACF) to document each film.",
      "The site brings together a filmography spanning more than twenty years, from 2004 to today, filterable by theme and by project type.",
      "Aloyse Leledy-Bécue manages the addition and classification of his films himself from the WordPress admin, with no technical help needed.",
      "The project was delivered in 3 weeks.",
    ],
    detailedDescription: `Aloyse Leledy-Bécue is a filmmaker with a rich body of work spanning more than twenty years, from 2004 to today: personal works, commissions and collaborations, alongside a biography and a contact page. Such a large and varied catalogue called for a showcase worthy of a strong visual identity — one able to give every film its due without overwhelming the visitor, and to be enriched without depending on a third party for each new project.\n\nI designed and built a WordPress brochure site with a custom theme, structured around the filmography. Each film is documented through structured fields (ACF — Advanced Custom Fields): year, role, themes. That structure powers filtering of the filmography by theme (architecture, contemporary art, dance and performance, experimental, feminism…) and by project type (personal works, commissions, collaborations), letting the visitor explore a dense body of work along their own entry point.\n\nThe custom theme carries the portfolio's editorial identity, while ACF-based entry gives the filmmaker control over the catalogue: adding a film, documenting it and classifying it is done independently from the WordPress admin, with no technical intervention.\n\nThe result is a polished portfolio that brings more than twenty years of films together in one place, filterable and independently manageable, in keeping with the artistic approach it presents.`,
    objectives: [
      "Give a rich filmography and a strong visual identity a polished showcase",
      "Bring personal works, commissions and collaborations together in one place",
      "Let the filmmaker add and document films independently",
      "Structure each film with metadata (year, role, themes) for a filterable catalogue",
      "Offer filtering by theme, by project type and by chronology",
    ],
    results: [
      "Custom WordPress portfolio bringing together a filmography from 2004 to today",
      "Filmography filterable by theme and by project type",
      "Each film documented through structured fields (year, role, themes) via ACF",
      "Catalogue manageable independently from the WordPress admin",
    ],
    arbitrage: {
      consideredOptions: [
        "Off-the-shelf generic page builder",
        "Custom headless front end (WordPress + Next.js)",
        "Custom WordPress theme backed by ACF",
      ],
      decision: "Custom WordPress theme paired with ACF (Advanced Custom Fields).",
      rationale:
        "A generic page builder would have constrained the portfolio's visual identity and the entry of structured metadata; a headless front end was overkill for a self-managed catalogue. The custom theme carries a distinct editorial identity, and ACF structures each film (year, role, themes) into a filterable catalogue that the filmmaker enriches independently.",
    },
    galleryAlt: "Portfolio of filmmaker Aloyse Leledy-Bécue, filterable filmography",
    tags: ["Independent", "Culture", "Film", "Brochure site", "WordPress"],
    cardDescription: "Custom WordPress portfolio for a filmmaker: a filmography spanning over twenty years, filterable and independently manageable.",
  },
  "hermitage-ecolise": {
    title: "L'Hermitage — ECOLISE European Demonstrator",
    description:
      "Built the one-page site announcing L'Hermitage's selection as one of the 15 European Demonstrators of ECOLISE's Regenerative Communities Fund: a clear narrative, concrete figures and a journey leading from the field to first contact.",
    enBref: [
      "I designed the Next.js and Tailwind CSS one-page site announcing Tiers Lieu L'Hermitage's selection as one of the 15 European Demonstrators of ECOLISE's Regenerative Communities Fund, chosen out of nearly 70 applications.",
      "L'Hermitage is a 30-hectare rural third place in Autrêches, in the Oise, co-funded by the European Union through the DEAR programme.",
      "The site presents the estate's six experimentation worksites (hospitality, cooperation, agroecology, forest, social innovation, training), each backed by a concrete figure such as its 22 hectares of sustainably managed forest.",
      "The page, fully prerendered and served statically from Vercel, was delivered in 1 week.",
    ],
    detailedDescription: `In late 2025, ECOLISE — the European network of community-led initiatives on climate — selected fifteen places across five countries, out of nearly 70 applications, to become the demonstrators of its Regenerative Communities Fund, co-funded by the European Union (DEAR programme). L'Hermitage, a 30-hectare rural third place in Autrêches in the Oise, is one of them. That European mandate deserved more than a press release: it needed a dedicated site able to explain the commitment to very different audiences — local residents, public authorities, companies, researchers and the fourteen other places in the network.\n\nI designed and built a one-page site with Next.js and Tailwind CSS, structured as a narrative: the European commitment (who ECOLISE is, what a demonstrator is, the journey "from Brussels to Autrêches"), the 3Zero compass — zero exclusion, zero carbon, zero poverty —, the mission in three moves (experiment, share, inspire), the living laboratory, and then the six open worksites: hospitality, cooperation, agroecology, forest, social innovation and training. Each worksite is backed by a concrete figure from the place — 100+ beds, 100 cooperative members, 22 hectares of sustainably managed forest — staying true to the spirit of the place: proof through the field, not through rhetoric.\n\nOn the technical side, the page is fully prerendered and served statically from Vercel: anchor-based navigation, optimized and preloaded images, careful SEO and Open Graph metadata. The mandatory European co-funding notices (Funding Fairer Futures project, DEAR programme) are included in line with the fund's requirements.\n\nThe site slots into L'Hermitage's web ecosystem, which I've been growing project after project — main site, treasure hunt, retreats landing page — and closes the journey with three graded calls to action: visit the place, organise an offsite, build a partnership.`,
    objectives: [
      "Announce L'Hermitage's selection as one of ECOLISE's 15 European Demonstrators with a dedicated site",
      "Make a complex European scheme (fund, network, 3Zero compass) legible for varied audiences",
      "Showcase the six experimentation worksites, each backed by a concrete figure",
      "Steer visitors toward action: a visit, an offsite, a partnership, contact",
      "Deliver a light, fast page consistent with the existing ecosystem of sites",
    ],
    results: [
      "One-page site live on a dedicated subdomain of the L'Hermitage ecosystem",
      "A complete narrative: European commitment, 3Zero compass, mission, living laboratory and six worksites",
      "Page fully prerendered and served statically from the Vercel CDN",
      "European co-funding notices (DEAR programme) included in line with the fund's obligations",
      "Three graded calls to action: visit, organise an offsite, build a partnership",
    ],
    galleryAlt: "One-page site of L'Hermitage's ECOLISE European Demonstrator",
    tags: ["Social economy", "Third place", "One-page", "Next.js", "Europe"],
    cardTitle: "L'Hermitage — ECOLISE Demonstrator",
    cardDescription: "Next.js one-page announcing L'Hermitage's selection as one of the ECOLISE network's 15 European Demonstrators.",
  },
  reseauteurs: {
    title: "Réseauteurs",
    description:
      "Built Réseauteurs, France's national networking platform: a directory, an agenda and an interactive map bringing French professionals, events and business networks together in one place.",
    enBref: [
      "I built Réseauteurs, France's national professional-networking platform, end to end with Next.js, Payload CMS and Stripe.",
      "It brings together a directory filterable by city, sector and network, an events agenda and an interactive map that geolocates professionals and meetups on OpenStreetMap tiles.",
      "An attendance badge system (Bronze, Silver, Gold, Platinum) gamifies event participation, and the Réseauteur+ subscription is purchased and paid online via Stripe.",
      "The platform was delivered in 3 months, from concept to launch.",
    ],
    detailedDescription: `Professional networking in France is scattered across dozens of business networks — BNI, CJD, Dynabuy, Rotary, CPME… — each with its own members, agendas and formats. For a professional who wants to network, there's no way to get the full picture: who's active near me, which events are happening this week, which networks are worth the trip? Réseauteurs was born from that observation, with a clear stance: "Réseauteurs doesn't replace any network — it brings them together."\n\nI built the custom platform end to end with Next.js and Payload CMS: a directory of networkers filterable by city, sector and network; an events agenda (afterworks, breakfasts, conferences); and an interactive map that geolocates professionals and meetups across France, on OpenStreetMap tiles with geocoding via the data.gouv.fr Address API.\n\nBeyond browsing, Réseauteurs is a real product with its own business model: free member accounts, an attendance badge system (Bronze, Silver, Gold, Platinum) to gamify event participation, and a paid Réseauteur+ subscription — purchased and paid online via Stripe — that unlocks creating events and local networks.\n\nIt all rests on a foundation built to last: Next.js rendering optimized for SEO and performance, a Payload back-office for autonomous content management, strict security headers (CSP, HSTS) and Vercel hosting. The platform is live and ready to bring the French networking community together.`,
    objectives: [
      "Bring French professionals, events and business networks together on a single platform",
      "Give networking geographic visibility: a filterable directory and an interactive map",
      "Encourage event attendance through a badge system",
      "Monetise the platform with an online subscription unlocking event and network creation",
      "Lay a scalable, high-performance and secure technical foundation",
    ],
    results: [
      "Complete platform live: directory, agenda, map, member accounts and payment",
      "Networker directory filterable by city, sector and network",
      "Interactive map of professionals and events across France",
      "Gamification in production: Bronze, Silver, Gold and Platinum attendance badges",
      "Working freemium model: Réseauteur+ subscription paid online via Stripe",
    ],
    galleryAlt: "Réseauteurs platform: directory, agenda and map of professional networking",
    tags: ["Platform", "B2B networking", "Next.js", "Payload CMS", "Stripe"],
    cardDescription: "France's national networking platform: directory, agenda and map of business networks.",
    cardAlt: "Réseauteurs platform — directory and map of professional networking",
  },
  "arguin-marine": {
    title: "Arguin Marine",
    description:
      "Built the WordPress brochure site for Arguin Marine, a high-end boat-rental service on the Arcachon Basin: a simple, polished online presence that's easy to manage.",
    enBref: [
      "I built the WordPress brochure site for Arguin Marine, a high-end boat-rental service on the Arcachon Basin.",
      "The site puts the rental offer, the boats and the practical information front and centre, with a direct way to make contact.",
      "It was designed to stay easy for the client to administer and to rank well on local searches around Arcachon.",
      "The project was delivered in 3 weeks.",
    ],
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
    cardDescription: "WordPress brochure site for a high-end boat-rental service on the Arcachon Basin.",
  },
  "la-petite-vitrine": {
    title: "La Petite Vitrine",
    description:
      "Built La Petite Vitrine, a packaged go-live service for freelancers, very small businesses and artisans: profession-specific templates, filled with your content and published after validation, with hosting and maintenance handled.",
    enBref: [
      "I designed and built La Petite Vitrine, a platform that industrializes the creation of small profession-based sites for freelancers, very small businesses and artisans, with Next.js, React, TypeScript and Tailwind CSS.",
      "The offer is clear and packaged: €650 excl. VAT to go live (integration included), then from €14 excl. VAT/month for hosting and maintenance.",
      "A pilot programme of 10 projects — 5 mental-health practices and 5 artisan workshops — documents the service with real, usable examples.",
      "The platform was delivered in 3 months, with no advertising or trackers, GDPR-compliant by default.",
    ],
    detailedDescription: `Freelancers, small outfits and artisans need a clean, professional online presence — but they get stuck between two extremes: the custom-built site, too slow and too expensive, and the DIY builder, time-consuming and quickly botched. La Petite Vitrine was born from that gap — to offer a third path, simple and guided.\n\nI designed and built La Petite Vitrine, a platform that industrializes the creation of small profession-based sites. We start from a template suited to the profession (health, retail, services, wellness, leisure), I integrate the client's content, and the site goes live after validation. Every site follows a clear, proven structure: introduction, offering, practical info, contact, legal notices.\n\nUnder the hood it's a Next.js application (React, TypeScript, Tailwind): a catalogue of themed templates, an export-and-publish pipeline for the sites, and content stored on Vercel Blob. Hosting and maintenance are handled end to end — the client has nothing to install or administer. GDPR by default: no advertising, no trackers.\n\nThe result is a clear, no-surprise offer: €650 excl. VAT to go live (integration included), then from €14 excl. VAT/month for hosting and maintenance, with payment after scoping. A pilot programme of 10 projects (5 mental-health practices, 5 artisan workshops) documents the service with real, usable examples rather than promotional mock-ups.`,
    objectives: [
      "Give freelancers and very small businesses a professional online presence, without the complexity of a custom build or the hassle of a DIY builder",
      "Industrialize the creation of small profession-based sites from ready-to-publish templates",
      "Own the whole cycle: content integration, go-live, hosting and maintenance",
      "Guarantee a clear framework: fixed price, GDPR, no advertising or trackers",
    ],
    results: [
      "Clear, packaged offer: €650 excl. VAT to go live, from €14 excl. VAT/month for hosting and maintenance",
      "Next.js platform with a profession-based template catalogue and a publishing pipeline",
      "Turnkey sites delivered, with no installation or admin on the client's side",
      "Pilot programme of 10 projects (mental health and artisans) to document the service",
    ],
    galleryAlt: "La Petite Vitrine — go-live service for small profession-based sites",
    tags: ["Freelancers", "Small business", "Product", "Web App", "Next.js"],
    cardDescription: "A packaged go-live service for small profession-based sites, for freelancers and very small businesses.",
  },
  "peer-to-peer": {
    title: "Peer to Peer",
    description:
      "Built Peer to Peer, a free self-observation and mental-health recovery support platform: 14 tools that run right in the browser, with no account and no data ever sent.",
    enBref: [
      "I built Peer to Peer, a free self-observation and mental-health recovery support platform, an impact initiative by Next Impact.",
      "It brings together 14 tools — 9 self-observation questionnaires and scales, 5 guided pathways and journals — that run right in the browser.",
      "Processing is 100% local: no data is ever sent to a server, with no account to create and nothing to install.",
      "The platform was delivered in 1 month.",
    ],
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
    cardDescription: "A free, fully local mental-health self-observation platform — no account required.",
  },
  "cafe-citoyen": {
    title: "Café Citoyen",
    description:
      "Brochure site for the Café Citoyen of Auger-Saint-Vincent: a Headless WordPress site with Next.js, to promote events and make booking easier for this community-driven non-profit.",
    enBref: [
      "I built the brochure site for the Café Citoyen of Auger-Saint-Vincent in Headless WordPress with Next.js, to promote this community-driven non-profit's events and make booking easier.",
      "The site grew on-site visits by 20% and tripled newsletter signups.",
      "It includes a regularly updated news section, a dedicated page for upcoming events, and a contact form.",
      "The project was delivered in 3 weeks.",
    ],
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
    cardDescription: "Café Citoyen brochure site",
    cardAlt: "Café Citoyen brochure site",
  },
  "hermitage-jeu-de-piste": {
    title: "L'Hermitage – Treasure Hunt",
    description:
      "A mobile application (PWA) for the woodland estate of Tiers Lieu L'Hermitage. A playful, geolocated experience, installable on smartphones without app stores and working without a permanent connection.",
    enBref: [
      "I built a Progressive Web App (PWA) with Next.js for the geolocated treasure hunt across the Tiers Lieu L'Hermitage woodland estate, installable in one tap from the browser, without going through app stores.",
      "Riddles are triggered by the players' geolocation, and progress is persisted locally on the device so the game keeps working offline deep in the forest.",
      "The first full-scale test gathered 120 people, according to Charlotte Bourez, community café manager at L'Hermitage.",
      "The project was delivered in 4 weeks.",
    ],
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
    cardDescription: "Treasure hunt across the Tiers Lieu L'Hermitage woodland estate",
    cardAlt: "Treasure hunt across the Tiers Lieu L'Hermitage woodland estate",
  },
  "comme-des-fous-jeux": {
    title: "Comme des Fous – Online Games",
    description: "Online games for the participatory media outlet Comme des Fous",
    enBref: [
      "I built an online games section for the participatory media outlet Comme des Fous, integrated into its Headless WordPress site with Next.js.",
      "The games were designed to be engaging and interactive, encouraging readers to spend more time on the site.",
      "The section was delivered with a smooth, responsive user experience.",
    ],
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
  },
  "comme-des-fous": {
    title: "Comme des Fous",
    description: "The website of the participatory media outlet Comme des Fous",
    enBref: [
      "I migrated the participatory media outlet Comme des Fous to a Headless WordPress architecture with Next.js, keeping WordPress for the editorial team and all existing content.",
      "The PageSpeed score went from 56 to 98, a 42-point performance gain.",
      "Editors kept exactly the same WordPress admin interface, with no disruption to the team.",
      "The project was delivered in 2 months.",
    ],
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
    cardTitle: "Comme des Fous – Headless WordPress Media",
    cardAlt: "The website of the Comme des Fous media outlet",
  },
  "next-event": {
    title: "Next Event – Headless WordPress Demo",
    description: "Demo site for an event ticketing platform.",
    enBref: [
      "Next Event is a demo site I built to showcase an event ticketing solution running on Headless WordPress with Next.js.",
      "The site features an event calendar, an integrated ticketing system and dedicated pages for each event.",
      "It's fully responsive and SEO-optimized.",
      "The project was built in 3 weeks, as a demonstration.",
    ],
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
    cardAlt: "Next Event demo site",
  },
  "les-etats-generaux-communaux": {
    title: "Les Etats Généraux Communaux",
    description: "Brochure site for Les Etats Généraux Communaux",
    enBref: [
      "I built the brochure site for Les Etats Généraux Communaux in Headless WordPress with Next.js, to promote this citizen event and make it easy to set up local groups.",
      "The site features a downloadable resources section, an event calendar and an interactive map of registered local groups.",
      "It shipped before the event date, with growth in the number of local groups created.",
      "The project was delivered in 4 weeks.",
    ],
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
    cardAlt: "Brochure site for Les Etats Généraux Communaux",
  },
  "panorama-pub": {
    title: "Panorama Pub",
    description:
      "Launching Panorama Pub, the first online directory dedicated to promotional-products suppliers — a brand-new digital marketplace connecting buyers and suppliers in a still-fragmented sector.",
    enBref: [
      "I took Panorama Pub from concept to launch: the first online directory dedicated to promotional-products suppliers in France, built with Next.js and PostgreSQL.",
      "The platform centralises a previously scattered supplier landscape, with search, filtering and comparison in a few clicks for buyers (agencies, comms and marketing teams).",
      "A dedicated back-office lets the team enrich the supplier catalogue autonomously.",
      "Panorama Pub was delivered in 2 months, from concept to production.",
    ],
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
    cardDescription: "The first online directory of promotional-products suppliers",
    cardAlt: "Panorama Pub directory — promotional-products suppliers",
  },
  proditec: {
    title: "Proditec",
    description:
      "Brochure-site rebuild for an international industrial-robotics company.",
    enBref: [
      "I rebuilt the brochure site for Proditec, an internationally recognized industrial-robotics company, on multilingual WordPress with Polylang.",
      "The PageSpeed score went from 45 to 98 on both mobile and desktop, and the accessibility score improved by 30%.",
      "The site supports 5 languages, to serve Proditec's international customer base.",
      "The project was delivered in 1 month.",
    ],
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
    cardDescription: "Multilingual corporate site",
    cardAlt: "Proditec corporate site",
  },
  doleances: {
    title: "Les Doléances",
    description:
      "A Wikipedia-inspired brochure site to promote the work of Les Doléances.",
    enBref: [
      "I built the brochure site for Les Doléances in Headless WordPress with Next.js, with a Wikipedia-inspired template to convey the non-profit's community-driven, participatory spirit.",
      "The site makes the citizens' grievances of 2018-2019 publicly available and includes an interactive map of its local groups.",
      "Administration is simplified for the team thanks to the Headless architecture.",
      "The project was delivered in 2 months.",
    ],
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
    cardDescription: "Showcase for the citizens' grievances of 2018-2019",
    cardAlt: "Showcase for the Doléances",
  },
  sowee: {
    title: "Sowee",
    description:
      "Built a blog section for the portal of Sowee, a company specializing in energy solutions.",
    enBref: [
      "I built a custom blog section for the portal of Sowee, a company specializing in energy solutions, on a custom GeneratePress WordPress theme.",
      "The theme strictly followed the mockups provided by Sowee's marketing team, delivered in 10 days.",
      "The blog section lets the team publish articles, add images and manage categories fully independently.",
    ],
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
    cardDescription: "Sowee blog section",
    cardAlt: "Sowee blog section",
  },
  "salon-de-la-carrosserie": {
    title: "Salon de la Carrosserie 2024",
    description:
      "Built a brochure site for the Salon de la Carrosserie 2024, with a modern design and an exhibitor sign-up area.",
    enBref: [
      "I built the brochure site for the Salon de la Carrosserie 2024 in WordPress with Elementor Pro, to promote the event and streamline exhibitor sign-ups.",
      "A dedicated sign-up area lets exhibiting companies register and manage their availability.",
      "The site spotlights exhibitors, partners and sponsors of the event.",
      "The project was delivered in 15 days.",
    ],
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
    cardDescription: "Salon de la Carrosserie 2024 brochure site",
    cardAlt: "Salon de la Carrosserie 2024 brochure site",
  },
  hermitage: {
    title: "Tiers Lieu L'Hermitage",
    description:
      "Progressive incremental rebuild of the Tiers Lieu L'Hermitage brochure site.",
    enBref: [
      "I migrated the Tiers Lieu L'Hermitage brochure site from the Divi builder to Elementor, to improve its performance and stability.",
      "The PageSpeed score gained 30 points, and recurring and project-earmarked donation features were added.",
      "The site is now stable, fast and easy for the L'Hermitage team to administer.",
      "The project was delivered in 1 month.",
    ],
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
    // See CLIENT_TESTIMONIALS_EN: Jean Karinthi's quote now covers every
    // L'Hermitage case study, not just this one.
    galleryAlt: "Tiers Lieu L'Hermitage homepage",
    tags: ["Rebuild", "Impact", "WordPress"],
    cardDescription: "Tiers Lieu L'Hermitage brochure site",
    cardAlt: "Tiers Lieu L'Hermitage brochure site",
  },
  "erp-services": {
    title: "ERP Services",
    description:
      "Like-for-like rebuild of the brochure site of ERP Services, an engineering consultancy.",
    enBref: [
      "I delivered a like-for-like rebuild of the brochure site for ERP Services, an engineering consultancy, keeping its existing visual identity.",
      "The mobile PageSpeed score went from 45 to 99, a 54-point performance gain.",
      "The site spotlights ERP Services' flagship projects, with expanded contact channels for prospective clients.",
      "The project was delivered in 2 weeks.",
    ],
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
    cardDescription: "ERP Services brochure site",
    cardAlt: "ERP Services brochure site",
  },
  "senza-nature": {
    title: "Senza Nature",
    description:
      "Built an e-commerce site for selling natural and organic products.",
    enBref: [
      "I've provided end-to-end support for Senza Nature's e-commerce site, which sells natural and organic products on WooCommerce, on an ongoing basis since 2024.",
      "That support delivered a 90% reduction in bugs and a 50% improvement in page load speed.",
      "The support covers maintenance, updates and site improvements, with a high PageSpeed score on both mobile and desktop.",
    ],
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
    cardDescription: "Senza Nature e-commerce site",
    cardAlt: "Senza Nature e-commerce site",
  },
  "wagner-hamisky": {
    title: "Wagner Hamisky",
    description: "Built a brochure site for the Wagner Hamisky art gallery.",
    enBref: [
      "I built the custom WordPress brochure site for the Wagner Hamisky art gallery, for its opening, with a custom theme and ACF Pro.",
      "The site showcases the works of 2 artists, with an image gallery and detailed descriptions of each piece.",
      "The artwork catalogue was designed for simple management, so the gallery can administer it independently.",
      "The project was delivered in 3 weeks.",
    ],
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
    cardDescription: "Brochure site for the Wagner Hamisky gallery",
    cardAlt: "Wagner Hamisky brochure site",
  },
  mediatico: {
    title: "Mediatico",
    description:
      "Built an online media outlet for Mediatico, covering everything happening in France's social-economy sector.",
    enBref: [
      "I built the online media outlet for Mediatico, covering France's social-economy sector, in WordPress with a custom Full Site Editing (Gutenberg) theme.",
      "The site highlights recent articles, partners and sponsors, plus a dedicated area for visitor submissions.",
      "It's fully responsive and SEO-optimized.",
      "The project was delivered in 4 weeks.",
    ],
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
    cardDescription: "Mediatico brochure site",
    cardAlt: "Mediatico brochure site",
  },
  infralliance: {
    title: "Infralliance",
    description:
      "Built a brochure site for Infralliance, a Think and Do Tank of digital-infrastructure operators.",
    enBref: [
      "I built the brochure site for Infralliance, a think and do tank of digital-infrastructure operators, in WordPress with Elementor Pro and Advanced Custom Fields.",
      "The site highlights the alliance's work and its network of digital-infrastructure operators.",
      "It shipped before the alliance's launch event, and stays easy for the in-house team to administer.",
      "The project was delivered in 2 weeks.",
    ],
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
    cardDescription: "Infralliance brochure site",
    cardAlt: "Infralliance brochure site",
  },
  "connexion-plus": {
    title: "GEM Connexion",
    description:
      "Built a brochure site for GEM Connexion Plus, a Paris-based socio-cultural non-profit.",
    enBref: [
      "I built the brochure site for GEM Connexion Plus, a Paris-based mutual-support group, in WordPress with a community-driven theme co-designed through participatory workshops.",
      "The site highlights the GEM's activities and projects, with a dedicated area where members can publish their own news.",
      "It makes it easy for partners and the public to get in touch, with fully responsive navigation.",
      "The project was delivered in 4 weeks.",
    ],
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
    cardTitle: "Connexion Plus",
    cardDescription: "Connexion Plus brochure site",
    cardAlt: "Connexion Plus — freelance WordPress developer",
  },
  sdevo: {
    title: "SDEVO",
    description:
      "Built a grant-application management plugin for the Syndicat départemental des énergies du Val d'Oise.",
    enBref: [
      "I built a custom WordPress plugin for the Syndicat départemental des énergies du Val d'Oise (SDEVO), to manage grant applications from member municipalities.",
      "The plugin lets municipalities submit grant applications online through an intuitive interface, and centralises tracking for SDEVO.",
      "It's fully integrated with WordPress, for streamlined administration on SDEVO's side.",
      "The project was delivered in 3 weeks.",
    ],
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
    cardTitle: "Syndicat départemental d'énergie du Val d'Oise",
    cardDescription: "SDEVO grant-management plugin",
    cardAlt: "SDEVO grant-management plugin",
  },
  // ─── Automation drafts (chantier D2) — nothing invented: everything not
  // provided by the client stays [TO COMPLETE].
  "hermitage-veille": {
    title: "L'Hermitage — Sector and competitive intelligence on corporate stays",
    description:
      "Ongoing intelligence on the third-places sector, paired with a map of fifty competitors in the bespoke corporate stay market in heritage venues, sorted by offer type, with niches identified against market and competition.",
    enBref: [
      "I set up an AI-agent intelligence system for Tiers Lieu L'Hermitage: continuous sector intelligence on third places, paired with a competitive map of the corporate stay market in heritage venues.",
      "The map identifies 50 competitors sorted by offer type, from the integrated residential-offsite operator to the bare heritage monument rented without services.",
      "It reveals that L'Hermitage is also up against companies themselves, which held 80% of their events on their own premises in 2025 versus 57% a year earlier, and surfaces a visibility gap: nearly all competitors publish capacity and rates, unlike L'Hermitage.",
      "The system also caught, in time, the French state's withdrawal from third-place funding in 2026, in a sector that draws on average 43% of its revenue from public subsidies.",
    ],
    detailedDescription: `L'Hermitage is a 30-hectare rural third place in Autrêches, in the Oise, run as a cooperative and selected as one of the fifteen European Demonstrators of the ECOLISE network. Part of its economic balance rests on hosting groups: corporate offsites, team stays, residencies. That revenue depends on two markets moving fast and in different directions — the third-places sector, with its public funding and fragile business models, and the corporate events market, with its squeezed budgets and rising sustainability requirements.\n\nBefore, information arrived in fragments: a conversation, a shared article, a call for tenders discovered too late. Nobody on the team had time to run structured intelligence, and more importantly nobody could precisely answer the question that matters when you lose a deal: who were we actually competing against, and on which criterion did we lose?\n\nI set up a two-tier AI-agent system. The first runs continuous sector intelligence on third places — funding, public schemes, business models, signs of fragility and closure. The second produced a deep competitive map of the corporate stay market in heritage venues: fifty players identified and sorted by offer type, from the integrated operator that has industrialised the residential offsite to the bare heritage monument rented without services, by way of the eco-venues telling the same impact story as L'Hermitage.\n\nThe working rule was the same as on all my intelligence assignments: every venue is verified at source, every capacity and every rate is recorded where it is published, and anything inferred is flagged as such. Unverifiable players are dropped rather than padding the count, and grey areas are listed as such at the end of the document.`,
    objectives: [
      "Establish who L'Hermitage is genuinely benchmarked against when a company looks for an offsite venue",
      "Sort those competitors by offer type rather than by geographic proximity alone",
      "Identify defensible niches by crossing market maturity with competitive density",
      "Keep track of a third-places sector whose funding and business models are shifting fast",
      "Replace information received by chance with curated information that arrives",
    ],
    results: [
      "50 competitors identified and sorted by offer type, from integrated operators to bare heritage venues",
      "Niches identified by crossing market maturity with competitive density",
      "Continuous sector intelligence on third places: public funding, business models, signs of fragility",
      "Visibility gap surfaced: nearly all competitors publish capacity and rates, L'Hermitage publishes neither",
      "Segment anchor price documented from competitors' own published rate cards",
      "Sustainability positioning made concrete: competitors have either the story or the certification procurement can act on, rarely both",
      "Number-one competitor identified outside the venue panel: companies themselves, which held 80 % of their events on their own premises in 2025, against 57 % a year earlier",
      "Underlying trend confirmed in favour of the positioning: châteaux and character properties went from roughly 20 % to 58 % of venues chosen over ten years",
      "Sector signal caught in time: the French state withdrawing from third-place funding in 2026, in a sector that draws on average 43 % of its revenue from public subsidies",
    ],
    arbitrage: {
      consideredOptions: [
        "Custom AI intelligence agent",
        "Business-tourism consultancy",
        "Trade-press subscription",
        "Manual monitoring by the team",
      ],
      decision:
        "An AI-agent system combining recurring sector intelligence on third places with a deep competitive map of the corporate stay market in heritage venues.",
      rationale:
        "Trade press informs you about a sector but never tells you who you lost a deal to. A consultancy delivers a study dated the day it is handed over, for a budget unrelated to that of a non-profit third place. And manual monitoring assumes time the team does not have. The agent produces the map in a few hours, cites every source, and can be re-run when the market moves: the value is not the report, it is the ability to redo it.",
    },
    solution:
      "Specialised research agents launched in parallel on each competitor family — integrated residential-offsite operators, heritage monuments and estates available for private hire, eco-venues and impact-led places, château hotels, booking platforms — then a dedicated agent on the sector context of third places and business tourism. Every venue kept is verified on its own pages: bed and room capacity, bundled services, published rates, operator, and any environmental or social claim. Results are consolidated into a single document: the competitor map by offer type, the reading of the niches, and an explicit list of what could not be verified.",
    galleryAlt: "Tiers Lieu L'Hermitage logo, a rural third place in the Oise",
    tags: ["AI", "Automation", "Monitoring", "Third place"],
    cardTitle: "L'Hermitage — Competitive intelligence by AI agents",
    cardDescription:
      "Sector intelligence on third places and a map of 50 competitors in the corporate stay market in heritage venues, by offer type.",
  },
  "urban-pousses-veille": {
    title: "Urban Pousses — Competitive intelligence and niche arbitration by AI agents",
    description:
      "Thirty competitors mapped across five offer types, eight niches compared on four criteria and a strategic recommendation, for a microgreens grower in the Oise — every player verified against the French company register.",
    enBref: [
      "I set up an AI-agent competitive-intelligence system for Urban Pousses, a microgreens grower in the Oise, with 5 agents whose every cited player is verified against the public company register.",
      "The system maps 30 competitors across 5 offer types and compares 8 diversification niches on 4 criteria (maturity, accessibility, three-year trend, incumbent competitors).",
      "It reveals that no active microgreens grower was identified in the Oise, the Somme or the Aisne, and documents 6 liquidations verified in 4 years in this market, 2 of them within 100 km of the production site.",
      "One diversification path was ruled out on evidence: 5 turnkey-equipment players disappeared between 2022 and 2026.",
    ],
    detailedDescription: `Urban Pousses grows microgreens indoors in the Oise and sells them to chefs, local authorities and regional distributors. It is a niche business, and that niche has an awkward feature: it exists in no public statistics. Neither Agreste, nor FranceAgriMer, nor the market bulletins track microgreens. The only market figures available come from private research firms that copy one another and publish the same growth rate from one edition to the next on different baselines.\n\nThe result is a grower operating blind — with no view of who produces what, how far away, at what price, and above all no way to tell which of their growth ideas are realistic. Should they sell seeds? Train other growers? Sell turnkey containers? Go after school canteens? Each of those questions represents an investment, and none of them had a documented answer.\n\nI built a system of five research agents launched in parallel, each on one market segment: regional microgreens growers, industrial-scale indoor farming players, equipment and know-how suppliers, consumer market and distribution, and finally market context and trends. Every company cited is verified against the public company register — legal form, incorporation date, headcount, trading status — and every statement is flagged as either read at source or inferred.\n\nThat protocol produced two findings no keyword monitor would ever have surfaced. First, the market is not competitive but made up of regional near-monopolies, because the product does not travel: almost every verified grower delivers to its own catchment area only. Second, the Oise, the Somme and the Aisne are a blank spot — no active microgreens grower was identified there, cross-checked against the county's own directory of market gardeners. The strategic question was therefore not "how do we differentiate" but "how do we occupy an already empty territory before it closes".`,
    objectives: [
      "Establish who the real competitors are, how far away and on what positioning",
      "Separate the immediate threat from the structural one, and the competitor from the sales channel",
      "Assess honestly which diversification paths are accessible and which are traps",
      "Produce a recommendation on offer, positioning and commercial sequence — not a monitoring report",
      "Replace information hunted down case by case with curated information that arrives",
    ],
    results: [
      "30 competitors mapped across 5 offer types, each placed by real competitive proximity rather than distance alone",
      "8 niches compared on 4 criteria: maturity, accessibility for the business, three-year trend and incumbent competitors",
      "A recommendation in 3 parts: offer strategy, competitive strategy and commercial sequence",
      "Structural finding: no active microgreens grower identified across the Oise, the Somme and the Aisne",
      "Six liquidations verified on the register in four years in this market, two of them within 100 km of the production site",
      "One diversification path ruled out on evidence: five turnkey-equipment players disappeared between 2022 and 2026",
    ],
    arbitrage: {
      consideredOptions: [
        "Custom AI intelligence and analysis agent",
        "Consultancy or business-school assignment",
        "Keyword-based SaaS monitoring tool",
        "Manual monitoring by the owner",
      ],
      decision:
        "A system of AI agents specialised by market segment, launched in parallel, with systematic verification of every player against the public company register.",
      rationale:
        "A SaaS tool monitors keywords: it would have returned articles, not a market map, and it would never have spotted that three counties are empty — an absence triggers no alert. A consultancy charges several thousand euros for a study frozen on the day it is delivered. Manual monitoring costs the owner the time already spent in production. The agent builds the map in a few hours, cites every source, discards what it cannot verify, and can be re-run when the market moves. The value is not the document, it is the ability to redo it.",
    },
    solution:
      "Five research agents launched in parallel, one per market segment, under a shared and non-negotiable brief: cite only real, verifiable companies, systematically separate what was read at source from what was inferred, and report missing data as missing rather than filling it with estimates. Every player is cross-checked against the public company register to confirm existence and trading status — which allowed several apparent competitors to be dropped because they had ceased trading, and others to be reclassified because they did not produce what they seemed to. The deliverable consolidates the map by offer type, the niche comparison table, the recommendation, and an explicit list of the points left unverified.",
    galleryAlt: "Urban Pousses logo, microgreens grower in the Oise",
    tags: ["AI", "Automation", "Monitoring", "Market research"],
    cardTitle: "Urban Pousses — Competitive intelligence by AI agents",
    cardDescription:
      "30 competitors mapped across 5 offer types, 8 niches compared and a strategic recommendation for a microgreens grower.",
  },
};

// ─── Témoignages au niveau du client ───────────────────────────────────────

/**
 * Une recommandation qui porte sur le travail en général, et non sur un projet
 * précis, vaut pour toutes les fiches du même client. Elle sert de repli quand
 * une fiche n'a pas de citation propre ; une citation spécifique au projet,
 * quand elle existe, reste prioritaire (elle en dit toujours plus).
 */
type Testimonial = NonNullable<CaseStudyContent["testimonial"]>;

const CLIENT_TESTIMONIALS_FR: Record<string, Testimonial> = {
  hermitage: {
    content:
      "Agathe est une remarquable professionnelle, très compétente sur les questions techniques, la veille quant à l'évolution des technologies, et systèmes. Egalement capable de donner des conseils stratégiques, sur le fond et la forme des contenus, Agathe est très attentive aux besoins exprimés, en amont comme dans la réalisation des missions convenues, elle est très réactive pendant l'exécution des missions. Je recommande sans réserves.",
    author: "Jean Karinthi",
    position: "Fondateur, Tiers Lieu L'Hermitage",
  },
};

const CLIENT_TESTIMONIALS_EN: Record<string, Testimonial> = {
  hermitage: {
    content:
      "Agathe is an outstanding professional, highly skilled on technical matters and on tracking the evolution of technologies and systems. Equally able to give strategic advice on both the substance and the form of content, Agathe is very attentive to the needs expressed — both up front and during delivery — and is very responsive throughout. I recommend her without reservation.",
    author: "Jean Karinthi",
    position: "Founder, Tiers Lieu L'Hermitage",
  },
};

function getClientTestimonial(
  locale: Locale,
  clientId: string | null,
): Testimonial | undefined {
  if (!clientId) return undefined;
  const map = locale === "en" ? CLIENT_TESTIMONIALS_EN : CLIENT_TESTIMONIALS_FR;
  return map[clientId] ?? CLIENT_TESTIMONIALS_FR[clientId];
}

// ─── Result highlights (per slug, per locale) ──────────────────────────────

const RESULT_HIGHLIGHTS_FR: Record<string, ResultHighlight[]> = {
  "aloyse-leledy-becue": [
    { value: "2004–2026", label: "Filmographie réunie" },
    { value: "ACF", label: "Catalogue administré en autonomie" },
    { value: "Sur-mesure", label: "Thème WordPress dédié" },
  ],
  // TODO(Agathe): remplacer par des chiffres projet réels si disponibles (PageSpeed, délai…)
  "hermitage-ecolise": [
    { value: "1 des 15", label: "Démonstrateurs européens ECOLISE" },
    { value: "6 chantiers", label: "Expérimentations mises en récit" },
    { value: "100%", label: "Page pré-rendue, servie en statique" },
  ],
  // TODO(Agathe): remplacer par des chiffres réels si disponibles (PageSpeed, membres, délai…)
  reseauteurs: [
    { value: "3 mois", label: "Du concept à la mise en ligne" },
    { value: "1 plateforme", label: "Tous les réseaux d'affaires réunis" },
    { value: "Freemium", label: "Abonnement en ligne via Stripe" },
  ],
  "arguin-marine": [
    { value: "Vitrine", label: "Présence en ligne clé en main" },
    { value: "WordPress", label: "Site simple à administrer" },
    { value: "Arcachon", label: "Location de bateaux haut de gamme" },
  ],
  "la-petite-vitrine": [
    { value: "+10", label: "Templates déployables" },
    { value: "-1 mois", label: "de développement" },
    { value: "GEO", label: "Optimisé" },
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
    { value: "10 jours", label: "Délai de livraison" },
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
  "aloyse-leledy-becue": [
    { value: "2004–2026", label: "Filmography brought together" },
    { value: "ACF", label: "Catalogue managed independently" },
    { value: "Custom", label: "Dedicated WordPress theme" },
  ],
  // TODO(Agathe): replace with real project figures if available (PageSpeed, delivery time…)
  "hermitage-ecolise": [
    { value: "1 of 15", label: "ECOLISE European Demonstrators" },
    { value: "6 worksites", label: "Experiments turned into a narrative" },
    { value: "100%", label: "Prerendered, statically served page" },
  ],
  // TODO(Agathe): replace with real figures if available (PageSpeed, members, delivery time…)
  reseauteurs: [
    { value: "3 months", label: "From concept to launch" },
    { value: "1 platform", label: "All business networks in one place" },
    { value: "Freemium", label: "Online subscription via Stripe" },
  ],
  "arguin-marine": [
    { value: "Brochure", label: "Turnkey online presence" },
    { value: "WordPress", label: "Easy for the client to manage" },
    { value: "Arcachon", label: "High-end boat rental" },
  ],
  "la-petite-vitrine": [
    { value: "€650", label: "Site live, integration included" },
    { value: "€14/mo", label: "Hosting & maintenance handled" },
    { value: "GDPR", label: "No ads, no trackers" },
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
    { value: "10 days", label: "Delivery time" },
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

export interface CaseStudyQueryOptions {
  /** Inclure les brouillons (previews du chantier D). Défaut : false. */
  includeDrafts?: boolean;
}

function visibleMeta(options?: CaseStudyQueryOptions): CaseStudyMeta[] {
  return options?.includeDrafts ? META : META.filter((m) => m.statut === "publie");
}

export function getCaseStudies(
  locale: Locale,
  options?: CaseStudyQueryOptions,
): CaseStudy[] {
  const content = pickContent(locale);
  return visibleMeta(options).map((meta) => {
    const c = content[meta.slug] ?? CONTENT_FR[meta.slug];
    return {
      ...meta,
      ...c,
      // Citation propre au projet si elle existe, sinon celle du client.
      testimonial: c.testimonial ?? getClientTestimonial(locale, meta.clientId),
      gallery: { url: meta.galleryUrl, alt: c.galleryAlt },
    };
  });
}

export function getCaseStudy(
  locale: Locale,
  slug: string,
  options?: CaseStudyQueryOptions,
): CaseStudy | undefined {
  return getCaseStudies(locale, options).find((s) => s.slug === slug);
}

export function getResultHighlights(
  locale: Locale,
  slug: string,
): ResultHighlight[] | undefined {
  const map = locale === "en" ? RESULT_HIGHLIGHTS_EN : RESULT_HIGHLIGHTS_FR;
  return map[slug];
}

export function getAllSlugs(options?: CaseStudyQueryOptions): string[] {
  return visibleMeta(options).map((m) => m.slug);
}

export function formatDelai(delai: Delai, locale: Locale): string {
  if ("depuis" in delai) {
    return locale === "en" ? `since ${delai.depuis}` : `depuis ${delai.depuis}`;
  }
  const { value, unit } = delai;
  if (locale === "en") {
    const units = { jours: "day", semaines: "week", mois: "month" } as const;
    return `${value} ${units[unit]}${value > 1 ? "s" : ""}`;
  }
  const singulier = { jours: "jour", semaines: "semaine", mois: "mois" } as const;
  return value > 1 && unit !== "mois" ? `${value} ${unit}` : `${value} ${singulier[unit]}`;
}

/** Projection légère pour les cartes de la liste — cas publiés uniquement. */
export interface CaseStudyCard {
  slug: string;
  famille: FamilleKey;
  /** Rang dans la vue par défaut « Sélection » de la liste ; null = absent. */
  featured: number | null;
  link: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  isDemo: boolean;
  highlight?: ResultHighlight;
}

export function getCaseStudyCards(locale: Locale): CaseStudyCard[] {
  const content = pickContent(locale);
  return visibleMeta().map((meta) => {
    const c = content[meta.slug] ?? CONTENT_FR[meta.slug];
    return {
      slug: meta.slug,
      famille: meta.famille,
      featured: meta.featured,
      link: `/etudes-de-cas/${meta.slug}`,
      image: meta.cardImageUrl ?? meta.galleryUrl,
      alt: c.cardAlt ?? c.galleryAlt,
      title: c.cardTitle ?? c.title,
      description: c.cardDescription ?? c.description,
      isDemo: meta.isDemo ?? false,
      highlight: getResultHighlights(locale, meta.slug)?.[0],
    };
  });
}
