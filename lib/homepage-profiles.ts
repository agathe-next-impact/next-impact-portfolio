import type { ProfileId } from "@/lib/documentation-profiles";
import type { FamilleKey } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";
import {
  HERO_VARIANTS_EN,
  SERVICES_PAGE_VARIANTS_EN,
  CASE_STUDIES_PAGE_VARIANTS_EN,
  ABOUT_PAGE_VARIANTS_EN,
  EXPANDABLE_CARDS_VARIANTS_EN,
} from "@/lib/homepage-profiles-en";

// ─── Variantes Hero ─────────────────────────────────────────────────────────

export interface HeroVariant {
  headline: string;
  subHeadline: string;
  description: string;
  valueProposition: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  auditTitle: string;
  auditSubtitle: string;
  auditDescription: string;
}

export const HERO_VARIANTS: Record<ProfileId | "default", HeroVariant> = {
  default: {
    headline: "Conseil et Prestations,",
    subHeadline: "de refonte WordPress",
    description:
      "Refonte, headless ou web app : prix et délai annoncés, performance mesurée, 6 à 10 semaines.",
    valueProposition:
      "Un avis indépendant avant d'engager un budget, puis une refonte en forfait : prix et délai écrits avant de commencer, performance mesurée avant et après.",
    ctaPrimary: { label: "Voyez ce qui ralentit votre site en 2 minutes", href: "/audit-site-web" },
    ctaSecondary: { label: "Discutons de votre projet", href: "/contact" },
    auditTitle: "Qu'est-ce qui ralentit votre site ?",
    auditSubtitle: "Diagnostic en 2 minutes",
    auditDescription:
      "Une adresse, un rapport : voyez ce qui ralentit votre site et laquelle des trois trajectoires (consolider, découpler, refonder) correspond à votre situation.",
  },
  decideur: {
    headline: "Votre projet digital",
    subHeadline: "moteur de croissance",
    description:
      "Du site vitrine à la plateforme métier sur-mesure : un investissement qui se rentabilise. ROI mesurable, time-to-market maîtrisé.",
    valueProposition:
      "Performance, SEO, conversion et autonomie de gestion : des résultats mesurables, quelle que soit la voie choisie.",
    ctaPrimary: { label: "Diagnostic projet gratuit", href: "#audit" },
    ctaSecondary: { label: "Me contacter", href: "/contact" },
    auditTitle: "Quelle techno pour votre projet ?",
    auditSubtitle: "Diagnostic projet",
    auditDescription:
      "Identifiez en 2 minutes la voie adaptée à votre projet — site WordPress, site Headless, web app ou application mobile — et estimez les gains attendus.",
  },
  utilisateur: {
    headline: "Votre site ou votre app",
    subHeadline: "simple à utiliser au quotidien",
    description:
      "Que vous pilotiez un site WordPress, une web app sur-mesure ou une application mobile, vous gardez la main sur vos contenus, vos données et vos utilisateurs — sans dépendance technique récurrente.",
    valueProposition:
      "Une interface d'administration pensée pour votre logique métier : zéro friction au quotidien.",
    ctaPrimary: { label: "Diagnostic projet gratuit", href: "#audit" },
    ctaSecondary: { label: "Me contacter", href: "/contact" },
    auditTitle: "Quelle voie pour votre projet ?",
    auditSubtitle: "Diagnostic projet",
    auditDescription:
      "En 2 minutes, identifiez la voie adaptée à votre projet — site WordPress, Headless, web app ou app mobile — sans jamais perdre la maîtrise de votre back-office.",
  },
  developpeur: {
    headline: "Architecture",
    subHeadline: "Sites & Apps Next.js",
    description:
      "WordPress API + Next.js pour les sites, base PostgreSQL dédiée pour les web apps, PWA installable pour le mobile. SSG, SSR, ISR, TypeScript, Tailwind, déploiement Vercel.",
    valueProposition:
      "Sites WordPress (classiques ou Headless + Next.js) et applications sur-mesure : le bon outil pour chaque projet, sans surenchère technique.",
    ctaPrimary: { label: "Diagnostic gratuit", href: "#audit" },
    ctaSecondary: { label: "Me contacter", href: "/contact" },
    auditTitle: "Quelle voie pour votre projet ?",
    auditSubtitle: "Diagnostic technique",
    auditDescription:
      "Diagnostic en 2 minutes : site WordPress classique, Headless Next.js (SSG/ISR/SSR), web app sur-mesure (Next.js + PostgreSQL) ou PWA mobile — selon votre volumétrie, vos intégrations et votre logique métier.",
  },
};

// ─── Variantes des cartes expandables ───────────────────────────────────────

export interface ExpandableCardVariant {
  title: string;
  description: string;
  src: string;
  ctaText: string;
  ctaLink: string;
}

// ─── Variantes page Services & Tarifs ────────────────────────────────────────

export interface ServicesPageVariant {
  titre: string;
  sousTitre: string;
  carouselLabel: string;
  budgetTitle: string;
  budgetCards: {
    left: { title: string; description: string; price?: string };
    right: { title: string; description: string; highlight?: string };
  };
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
  faqs: { question: string; answer: string }[];
}

export const SERVICES_PAGE_VARIANTS: Record<
  ProfileId | "default",
  ServicesPageVariant
> = {
  default: {
    titre: "Trois solutions pour un site WordPress qui vieillit",
    sousTitre:
      "La vraie question n'est pas WordPress ou pas WordPress : c'est ce que vous gardez et ce que vous changez. Consolider, découpler ou refonder : prix affichés, délai annoncé, performance mesurée.",
    carouselLabel: "Pourquoi Next Impact ?",
    budgetTitle: "Quel niveau d'investissement pour votre projet ?",
    budgetCards: {
      left: {
        title: "Site vitrine ou institutionnel",
        description:
          "Un WordPress monolithique optimisé suffit largement : design moderne, code propre, performances solides et sécurité maximale, pour un coût maîtrisé.",
        price: "2 250",
      },
      right: {
        title: "Plateforme à fort enjeu",
        description:
          "Pour une plateforme à forte volumétrie, multisites ou intégrations complexes : architecture WordPress headless + Next.js, ISR/SSR et CI/CD complet.",
        highlight:
          "Une architecture évolutive, pensée pour grandir avec votre activité.",
      },
    },
    ctaTitle: "Choisissez votre voie",
    ctaDescription:
      "Répondez à quelques questions pour identifier la voie adaptée à votre projet — site WordPress, site Headless, web app ou application mobile.",
    ctaLabel: "Lancer le diagnostic",
    ctaHref: "/solutions-web/eligibilite",
    faqs: [
      {
        question: "Est-ce que je pourrai toujours modifier mes textes ?",
        answer:
          "Oui, pour les trois trajectoires. Vous conservez l'interface WordPress que vous connaissez pour gérer tous vos contenus, images et pages. Aucune compétence technique n'est requise.",
      },
      {
        question: "Le Headless est-il plus cher à maintenir ?",
        answer:
          "Légèrement, car il y a deux systèmes à maintenir (WordPress + front-end). Cependant, la sécurité renforcée et les performances accrues réduisent souvent les coûts d'intervention d'urgence et de perte de trafic.",
      },
      {
        question: "Combien de temps prend la mise en place ?",
        answer:
          "Comptez 2-4 semaines pour un site WordPress classique optimisé, 4-6 semaines pour une architecture Headless + Next.js standard, et 6-10 semaines pour une plateforme Headless complexe ou une application sur-mesure, selon la complexité du projet.",
      },
      {
        question: "Mes plugins WordPress fonctionneront-ils encore ?",
        answer:
          "Les plugins front-end (sliders, formulaires affichés) sont remplacés par des équivalents plus performants. Les plugins back-end (SEO, analytics, sécurité) continuent de fonctionner normalement.",
      },
    ],
  },
  decideur: {
    titre: "Choisissez la bonne voie technique",
    sousTitre:
      "Trois paliers techniques au service de votre croissance : ROI mesurable, sécurité renforcée, conversion optimisée. Vous gardez l'admin que vos équipes connaissent.",
    carouselLabel: "Pourquoi investir dans la modernisation ?",
    budgetTitle: "Quel retour sur investissement ?",
    budgetCards: {
      left: {
        title: "PME en croissance",
        description:
          "Un site WordPress (classique optimisé ou Headless + Next.js) suffit à booster votre SEO, réduire le taux de rebond et augmenter vos conversions. L'investissement se rentabilise en quelques mois.",
        price: "4 000",
      },
      right: {
        title: "Entreprise à fort CA",
        description:
          "Architecture Next.js complète : sécurité maximale, performances critiques, ISR pour les pics de trafic. Votre site devient un avantage concurrentiel durable.",
        highlight:
          "Une plateforme évolutive, prête à absorber votre croissance et vos intégrations.",
      },
    },
    ctaTitle: "Choisissez votre voie",
    ctaDescription:
      "En 2 minutes, identifiez le bon niveau de modernisation pour votre projet et estimez les gains de performance attendus.",
    ctaLabel: "Choisir ma stack",
    ctaHref: "/solutions-web/eligibilite",
    faqs: [
      {
        question: "Quel est le retour sur investissement concret ?",
        answer:
          "Une modernisation WordPress (même monolithique optimisée) améliore les Core Web Vitals, ce qui impacte directement le SEO (+30% de trafic organique en moyenne sur les passes headless) et le taux de conversion. Le ROI se mesure en quelques mois.",
      },
      {
        question: "En quoi le Headless est-il plus sécurisé ?",
        answer:
          "Le front-end est découplé de WordPress : votre back-office n'est plus accessible publiquement. Les attaques (brute force, injections) sont rendues impossibles. C'est un argument fort pour la conformité RGPD.",
      },
      {
        question: "Combien de temps pour voir les résultats ?",
        answer:
          "Le site est livré en 2 à 10 semaines selon la stack choisie. Les gains de performance sont immédiats dès la mise en ligne. L'impact SEO se mesure sous 2-3 mois.",
      },
      {
        question: "Pourquoi trois paliers techniques ?",
        answer:
          "Tous les projets n'ont pas besoin de Next.js. Un site vitrine convertit aussi bien avec un WordPress monolithique optimisé qu'avec une stack headless complète. Je vous oriente vers le bon palier — celui qui rentabilise réellement votre investissement.",
      },
    ],
  },
  utilisateur: {
    titre: "Votre stack, en clair",
    sousTitre:
      "Vous gardez l'interface WordPress que vous connaissez, avec un site moderne, rapide et agréable à gérer au quotidien. Trois niveaux de modernisation, selon votre projet.",
    carouselLabel: "Pourquoi c'est plus simple ?",
    budgetTitle: "Qu'est-ce qui change pour vous ?",
    budgetCards: {
      left: {
        title: "Au quotidien",
        description:
          "Vous continuez à créer vos pages, ajouter vos images et publier vos articles exactement comme avant — mais votre site est jusqu'à 10x plus rapide pour vos visiteurs.",
        price: "2 250",
      },
      right: {
        title: "Ce qui est inclus",
        description:
          "Formation personnalisée à votre nouveau site, documentation d'utilisation, et un accompagnement pour être autonome rapidement.",
        highlight:
          "Vous n'avez rien de nouveau à apprendre : c'est toujours WordPress.",
      },
    },
    ctaTitle: "Choisissez votre voie",
    ctaDescription:
      "Répondez à quelques questions simples pour identifier la formule qui correspond le mieux à votre projet.",
    ctaLabel: "Choisir ma stack",
    ctaHref: "/solutions-web/eligibilite",
    faqs: [
      {
        question: "Vais-je devoir apprendre un nouvel outil ?",
        answer:
          "Non. Vous continuez à utiliser WordPress exactement comme avant pour créer vos pages, articles et gérer vos médias. La seule différence : votre site est beaucoup plus rapide et moderne côté visiteur.",
      },
      {
        question: "Comment je prévisualise mes modifications ?",
        answer:
          "Un bouton « Prévisualiser » dans WordPress vous montre exactement le rendu final avant publication. Le workflow est identique à ce que vous connaissez.",
      },
      {
        question: "Et si j'ai besoin d'aide après le lancement ?",
        answer:
          "Une formation personnalisée est incluse dans toutes les stacks. Vous recevez aussi une documentation d'utilisation adaptée à votre site. Un support est disponible selon votre formule.",
      },
      {
        question: "Mes contenus actuels seront-ils conservés ?",
        answer:
          "Oui, tous vos contenus (textes, images, médias) sont migrés automatiquement. Rien n'est perdu. La migration est incluse dans les forfaits Headless et Web app.",
      },
    ],
  },
  developpeur: {
    titre: "Sites WordPress et applications sur-mesure",
    sousTitre:
      "WordPress API + Next.js pour les sites, base PostgreSQL dédiée pour les web apps, PWA installable pour le mobile. SSG, SSR, ISR, TypeScript, Tailwind, déploiement Vercel.",
    carouselLabel: "Pourquoi cette stack ?",
    budgetTitle: "Que comprend chaque solution techniquement ?",
    budgetCards: {
      left: {
        title: "Classique (WordPress)",
        description:
          "Thème WordPress custom, build moderne (Vite), optimisations Core Web Vitals, sécurité durcie. Idéal pour un site vitrine performant à coût maîtrisé.",
        price: "2 250",
      },
      right: {
        title: "Web app (Headless complexe ou Next.js + PostgreSQL)",
        description:
          "WordPress headless + Next.js App Router, ISR/SSR hybride, multisites, API custom, intégrations tierces, CI/CD complet. Architecture pensée pour l'évolutivité.",
        highlight:
          "Accès au repo Git, documentation technique complète, et support prioritaire 12 mois.",
      },
    },
    ctaTitle: "Explorez la documentation technique",
    ctaDescription:
      "Architecture détaillée, choix de stack, patterns d'implémentation et guides de déploiement.",
    ctaLabel: "Voir la documentation",
    ctaHref: "/documentation",
    faqs: [
      {
        question: "Comment choisissez-vous le bon niveau technique ?",
        answer:
          "Quatre voies : (1) WordPress classique avec thème custom moderne, (2) WordPress Headless + Next.js App Router (SSG/ISR/SSR, TypeScript strict, Tailwind, déploiement Vercel), (3) web app sur-mesure (Next.js + base PostgreSQL serverless, admin autonome conçu pour la logique métier), (4) PWA mobile (Next.js + service worker, géolocalisation et persistance locale selon le besoin).",
      },
      {
        question: "Comment fonctionne le data fetching en headless ?",
        answer:
          "Les données sont récupérées via l'API REST de WordPress ou WPGraphQL. Next.js gère le rendu (SSG/SSR/ISR) avec revalidation configurable. Les images passent par le composant next/image pour l'optimisation automatique.",
      },
      {
        question: "Le code est-il accessible et maintenable ?",
        answer:
          "Oui. Accès complet au repository Git, architecture modulaire, composants réutilisables, et documentation technique incluse. Le code respecte les standards ESLint/Prettier.",
      },
      {
        question: "Comment se passe le déploiement ?",
        answer:
          "Déploiement automatique sur Vercel via Git (push → build → deploy) pour les stacks headless. Preview deployments sur chaque PR. Rollback instantané. Le WordPress reste sur un hébergement classique sécurisé.",
      },
    ],
  },
};

// ─── Variantes page Études de cas ────────────────────────────────────────────

export interface CaseStudiesPageVariant {
  titre: string;
  sousTitre: string;
  /** « selection » = vue par défaut featured (voir Realisations). */
  defaultTab: FamilleKey | "selection";
  tabsLabel: string;
  ctaLabel: string;
  ctaHref: string;
  ctaDescription: string;
  projectHighlightLabel?: string;
}

export const CASE_STUDIES_PAGE_VARIANTS: Record<
  ProfileId | "default",
  CaseStudiesPageVariant
> = {
  default: {
    titre: "Études de cas",
    sousTitre:
      "Chaque projet raconte une décision : pourquoi cette techno, ce budget, ce délai — et ce que ça a donné.",
    defaultTab: "selection",
    tabsLabel: "Filtrer par famille",
    ctaLabel: "Discuter de votre projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Vous avez un projet similaire ? Échangeons sur vos besoins et vos objectifs.",
  },
  decideur: {
    titre: "Nos études de cas clients",
    sousTitre:
      "Des projets concrets avec des résultats mesurables : performance, SEO et conversion au service de la croissance.",
    defaultTab: "selection",
    tabsLabel: "Filtrer par secteur",
    ctaLabel: "Évaluer mon projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Vous souhaitez des résultats similaires pour votre organisation ? Discutons de votre ROI potentiel.",
    projectHighlightLabel: "Résultats clés",
  },
  utilisateur: {
    titre: "Des sites simples et performants",
    sousTitre:
      "Des sites que leurs propriétaires gèrent au quotidien avec WordPress — simplement, sans compétence technique.",
    defaultTab: "selection",
    tabsLabel: "Explorer les projets",
    ctaLabel: "Voir une démo",
    ctaHref: "/demo",
    ctaDescription:
      "Envie de voir à quoi ressemble la gestion de contenu au quotidien ? Découvrez une démonstration en direct.",
  },
  developpeur: {
    titre: "Études de cas techniques",
    sousTitre:
      "Sites WordPress classiques optimisés, Headless WordPress + Next.js, web apps sur-mesure et PWA mobiles. API REST, WPGraphQL, PostgreSQL. Détails techniques de chaque projet.",
    defaultTab: "selection",
    tabsLabel: "Filtrer par architecture",
    ctaLabel: "Explorer la documentation",
    ctaHref: "/documentation",
    ctaDescription:
      "Plongez dans l'architecture technique : guides d'implémentation, patterns et choix de stack détaillés.",
  },
};

// ─── Variantes page À propos ─────────────────────────────────────────────────

export interface AboutPageVariant {
  titre: string;
  sousTitre: string;
  manifesteIntro: string;
  manifesteAccroche: string;
  piliers: {
    icon: string;
    title: string;
    description: string;
    items: string[];
  }[];
  citation: string;
  ctaLabel: string;
  ctaHref: string;
  ctaDescription: string;
}

export const ABOUT_PAGE_VARIANTS: Record<
  ProfileId | "default",
  AboutPageVariant
> = {
  default: {
    titre: "A propos",
    sousTitre:
      "Deux savoir-faire complémentaires : moderniser les sites WordPress qui en valent la peine, et bâtir des applications web et mobiles sur-mesure quand WordPress n'est plus le bon outil.",
    manifesteIntro:
      "WordPress propulse plus de 40 % du web. Pour beaucoup de projets, il reste le bon socle — quand on le modernise. Mais quand l'enjeu n'est plus éditorial mais applicatif (marketplace, plateforme métier, outil mobile, simulateur), WordPress atteint ses limites. Dans ce cas, il faut construire autre chose, avec la même promesse d'autonomie : une admin sur-mesure pour que vous gardiez la main sur vos contenus, vos données et vos utilisateurs.",
    manifesteAccroche: "Moderniser WordPress avec des technos récentes.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Autonomie de gestion garantie",
        description:
          "Sur un site WordPress, vous conservez l'admin que vous connaissez. Sur une application sur-mesure, une admin dédiée est conçue pour votre logique métier — vous gardez la main sur vos contenus, vos données et vos utilisateurs sans dépendance technique récurrente.",
        items: [
          "Site WordPress : admin WordPress identique",
          "Web app : admin sur-mesure pour votre métier",
          "Workflow éditorial inchangé côté contenu",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Révolution du front",
        description:
          "Plusieurs voies techniques pour moderniser : thème WordPress classique optimisé, Headless WordPress + Next.js pour les plateformes évolutives, ou application sur-mesure quand WordPress n'est plus le bon outil.",
        items: [
          "Core Web Vitals au vert",
          "SEO technique de niveau industriel",
          "Stack moderne, maintenable et documentée",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Numérique responsable by design",
        description:
          "La performance technique sert aussi la performance écologique. Chaque ligne de code et chaque choix d'hébergement est pensé pour réduire l'empreinte carbone numérique.",
        items: ["Code optimisé et léger", "Hébergement éco-responsable"],
      },
    ],
    citation:
      "Le choix d'une techno, c'est la traduction fidèle du monde réel en solution digitale.",
    ctaLabel: "Discuter de votre projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Envie d'en savoir plus sur notre approche ? Échangeons sur vos besoins.",
  },
  decideur: {
    titre: "Pourquoi Next Impact",
    sousTitre:
      "La modernisation WordPress comme levier de croissance : ROI mesurable, sécurité renforcée, avantage concurrentiel.",
    manifesteIntro:
      "Un site lent coûte cher. Chaque seconde de chargement supplémentaire fait perdre 7% de conversions. Un site vulnérable peut détruire des années de confiance en un incident. Moderniser son WordPress — du thème optimisé au headless complet — est l'un des investissements web au meilleur ratio coût/impact aujourd'hui.",
    manifesteAccroche:
      "Next Impact transforme votre WordPress en avantage concurrentiel durable, sans casser ce qui fonctionne déjà côté édition.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Performance et conversion",
        description:
          "Un site rapide convertit mieux. Le score PageSpeed impacte directement le SEO, le taux de rebond et le taux de conversion — des métriques business mesurables.",
        items: [
          "Score PageSpeed 95+ visé",
          "Impact SEO direct sur votre trafic organique",
          "Taux de conversion optimisé par la vitesse",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Sécurité et pérennité",
        description:
          "L'architecture Headless découple votre back-office du site public. Votre WordPress n'est plus exposé aux attaques, vos données sont protégées.",
        items: [
          "Surface d'attaque réduite par le découplage",
          "Infrastructure moderne et maintenable sur le long terme",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Plusieurs solutions, un investissement maîtrisé",
        description:
          "Tous les projets n'ont pas besoin de la même solution. La bonne voie technique, c'est celle qui rentabilise votre investissement — pas la plus sophistiquée.",
        items: [
          "Site WordPress classique pour les vitrines",
          "Headless + Next.js pour les sites à fort enjeu SEO ou plateformes évolutives",
          "Web app ou app mobile sur-mesure quand WordPress n'est plus le bon outil",
        ],
      },
    ],
    citation:
      "Chaque projet est un investissement stratégique. Mon rôle est de garantir qu'il génère des résultats mesurables — au bon palier technique.",
    ctaLabel: "Évaluer mon projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Discutons de vos objectifs business et du ROI que vous pouvez attendre.",
  },
  utilisateur: {
    titre: "Qui je suis",
    sousTitre:
      "Des sites simples à gérer, rapides pour vos visiteurs — avec le WordPress que vous connaissez déjà.",
    manifesteIntro:
      "Vous gérez un site web au quotidien et vous méritez un outil qui fonctionne. Pas de bugs, pas de lenteurs, pas de prise de tête. Avec Next Impact, vous gardez WordPress pour gérer vos contenus, et je m'occupe de la technique pour que votre site soit rapide, sécurisé et agréable — pour vous comme pour vos visiteurs.",
    manifesteAccroche:
      "Next Impact vous libère de la technique pour vous concentrer sur vos contenus.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Votre WordPress, en mieux",
        description:
          "Vous gardez exactement la même interface WordPress pour créer vos pages, publier vos articles et gérer vos médias. Rien de nouveau à apprendre.",
        items: [
          "Interface d'administration WordPress identique",
          "Publication en quelques clics, comme avant",
          "Prévisualisation du rendu avant publication",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Un site rapide pour vos visiteurs",
        description:
          "Vos visiteurs accèdent à vos contenus instantanément. Fini les pages qui mettent des secondes à charger — votre site répond au quart de tour.",
        items: [
          "Pages qui se chargent en moins d'une seconde",
          "Navigation fluide sur mobile comme sur ordinateur",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Formation et accompagnement inclus",
        description:
          "Vous n'êtes jamais seul. Une formation personnalisée et une documentation d'utilisation vous accompagnent pour être autonome dès le premier jour.",
        items: [
          "Formation adaptée à votre niveau",
          "Documentation d'utilisation sur mesure",
        ],
      },
    ],
    citation:
      "Mon objectif : que vous puissiez gérer votre site en toute sérénité, sans jamais avoir besoin de compétences techniques.",
    ctaLabel: "Voir une démo",
    ctaHref: "/demo",
    ctaDescription:
      "Découvrez à quoi ressemble la gestion de contenu au quotidien avec un site Next Impact.",
  },
  developpeur: {
    titre: "La stack Next Impact",
    sousTitre:
      "WordPress classique optimisé, Headless WordPress + Next.js, web apps sur-mesure (Next.js + PostgreSQL), PWA mobile. Architecture découplée, SSG/SSR/ISR, TypeScript, déploiement Vercel.",
    manifesteIntro:
      "Next Impact est né de la conviction que les sites WordPress méritent une architecture moderne — et que tout ne mérite pas d'être un site WordPress. Pour les vitrines et plateformes éditoriales, WordPress reste un socle solide quand on le modernise. Pour les marketplaces, outils métier ou applications mobiles, on construit autre chose : web app sur-mesure ou PWA, avec une admin autonome dédiée à la logique du projet.",
    manifesteAccroche:
      "Deux savoir-faire complémentaires, une même conviction : le bon outil pour le bon projet.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "WordPress comme socle éditorial",
        description:
          "WordPress en backend, API REST ou WPGraphQL pour le data fetching. Custom Post Types et ACF Pro pour la modélisation. Preview mode et draft handling natifs.",
        items: [
          "API REST WordPress + WPGraphQL",
          "Custom Post Types et ACF Pro pour la modélisation",
          "Preview mode et draft handling",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Quatre solutions techniques",
        description:
          "Thème WordPress classique optimisé, Headless + Next.js App Router (SSG/ISR/SSR) pour les plateformes éditoriales évolutives, web app sur-mesure (Next.js + PostgreSQL serverless, admin autonome), ou PWA installable côté mobile.",
        items: [
          "Classique : WordPress avec thème custom moderne",
          "Headless / Web app : WordPress Headless + Next.js (SSG/ISR/SSR)",
          "Web app : Next.js + PostgreSQL + admin autonome sur-mesure",
          "App mobile : PWA Next.js, géolocalisation et persistance locale au besoin",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "DevOps et déploiement",
        description:
          "CI/CD via Vercel avec preview deployments sur chaque PR. Rollback instantané, monitoring et logs centralisés. Pour la stack monolithique, build et déploiement automatisés sur l'hébergement WordPress.",
        items: [
          "Déploiement Vercel avec preview per-branch",
          "Pipeline CI/CD automatisé (lint, type-check, build)",
        ],
      },
    ],
    citation:
      "La meilleure architecture est celle qui est invisible pour l'utilisateur final et limpide pour le développeur qui la maintient.",
    ctaLabel: "Explorer la documentation",
    ctaHref: "/documentation",
    ctaDescription:
      "Guides d'architecture, patterns d'implémentation et choix techniques détaillés.",
  },
};

// ─── Variantes des cartes expandables ───────────────────────────────────────

export const EXPANDABLE_CARDS_VARIANTS: Record<
  ProfileId | "default",
  ExpandableCardVariant[]
> = {
  default: [
    {
      title: "Fonctionnement du Headless",
      description:
        "Comprendre les principes fondamentaux du Headless et comment cette architecture révolutionne la manière dont les sites web sont conçus et gérés.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/wordpress-headless/comprendre-le-headless",
    },
    {
      title: "Pourquoi choisir le Headless ?",
      description:
        "Comprendre les gains concrets : temps de chargement divisé, coût de maintenance réduit et ROI mesurable sur votre investissement web.",
      src: "/icons/scan-icon.svg",
      ctaText: "En savoir plus",
      ctaLink:
        "/documentation/wordpress-headless/performance-et-core-web-vitals",
    },
    {
      title: "Pour quels objectifs ?",
      description:
        "Découvrez si votre projet correspond : pic de trafic à absorber, éco-conception, multi-sites, portail client ou application métier.",
      src: "/icons/analytics-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/wordpress-headless/dois-je-passer-au-headless",
    },
  ],
  decideur: [
    {
      title: "Le headless, un avantage stratégique",
      description:
        "Comprendre comment le découplage frontend/backend se traduit en avantage concurrentiel pour votre entreprise.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/wordpress-headless/comprendre-le-headless",
    },
    {
      title: "ROI et performance business",
      description:
        "Des indicateurs mesurables : temps de chargement, taux de conversion, positionnement SEO. L'impact direct sur votre chiffre d'affaires.",
      src: "/icons/scan-icon.svg",
      ctaText: "Voir les chiffres",
      ctaLink:
        "/documentation/wordpress-headless/performance-et-core-web-vitals",
    },
    {
      title: "Cas d'usage : croissance et investissement",
      description:
        "Des exemples concrets de PME et d'organisations ayant transformé leur présence en ligne grâce à une modernisation WordPress ciblée.",
      src: "/icons/analytics-icon.svg",
      ctaText: "Voir les études de cas",
      ctaLink: "/etudes-de-cas",
    },
  ],
  utilisateur: [
    {
      title: "WordPress reste votre outil",
      description:
        "Pas de nouvel outil à apprendre. Vous continuez à gérer votre contenu dans WordPress, exactement comme avant — en mieux.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/wordpress-headless/comprendre-le-headless",
    },
    {
      title: "Un site plus rapide pour vos visiteurs",
      description:
        "Vos pages se chargent instantanément. Vos visiteurs restent plus longtemps, interagissent plus et reviennent.",
      src: "/icons/scan-icon.svg",
      ctaText: "Comprendre les gains",
      ctaLink:
        "/documentation/wordpress-headless/performance-et-core-web-vitals",
    },
    {
      title: "Gérer votre contenu au quotidien",
      description:
        "Prévisualisation, gestion des médias, workflow éditorial : tout ce dont vous avez besoin pour publier sereinement.",
      src: "/icons/analytics-icon.svg",
      ctaText: "Voir le workflow",
      ctaLink: "/documentation/wordpress-headless/gerer-le-contenu",
    },
  ],
  developpeur: [
    {
      title: "Architecture découplée",
      description:
        "API REST / GraphQL en backend, React en frontend. Comprendre la séparation des responsabilités et le data fetching.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "Voir l'architecture",
      ctaLink: "/documentation/wordpress-headless/comprendre-le-headless",
    },
    {
      title: "Stack technique et performance",
      description:
        "Next.js, SSG/SSR/ISR, Core Web Vitals, optimisation images. Les choix techniques pour un Lighthouse à 100.",
      src: "/icons/scan-icon.svg",
      ctaText: "Explorer la stack",
      ctaLink:
        "/documentation/wordpress-headless/nextjs-pour-wordpress-headless",
    },
    {
      title: "Implémentation de A à Z",
      description:
        "Du setup WordPress headless au déploiement Vercel : endpoints, authentification JWT, CI/CD et mise en production.",
      src: "/icons/analytics-icon.svg",
      ctaText: "Voir le guide",
      ctaLink: "/documentation/wordpress-headless/deploiement-vercel-nextjs",
    },
  ],
};

// ─── Locale-aware accessors ──────────────────────────────────────────────────

const PROFILE_IDS: ProfileId[] = ["decideur", "utilisateur", "developpeur"];

function defaultOnlyVariants<T>(
  variants: Partial<Record<ProfileId | "default", T>>,
): Record<ProfileId | "default", T> {
  const fallback = variants.default ?? variants.decideur;

  if (!fallback) {
    throw new Error("Missing default and decideur homepage content variant.");
  }

  return PROFILE_IDS.reduce(
    (acc, profileId) => ({
      ...acc,
      [profileId]: fallback,
    }),
    { default: fallback } as Record<ProfileId | "default", T>,
  );
}

export function getHeroVariants(
  locale: Locale,
): Record<ProfileId | "default", HeroVariant> {
  return defaultOnlyVariants(
    locale === "en" ? HERO_VARIANTS_EN : HERO_VARIANTS,
  );
}

export function getServicesPageVariants(
  locale: Locale,
): Record<ProfileId | "default", ServicesPageVariant> {
  return defaultOnlyVariants(
    locale === "en" ? SERVICES_PAGE_VARIANTS_EN : SERVICES_PAGE_VARIANTS,
  );
}

export function getCaseStudiesPageVariants(
  locale: Locale,
): Record<ProfileId | "default", CaseStudiesPageVariant> {
  return defaultOnlyVariants(
    locale === "en"
      ? CASE_STUDIES_PAGE_VARIANTS_EN
      : CASE_STUDIES_PAGE_VARIANTS,
  );
}

export function getAboutPageVariants(
  locale: Locale,
): Record<ProfileId | "default", AboutPageVariant> {
  return defaultOnlyVariants(
    locale === "en" ? ABOUT_PAGE_VARIANTS_EN : ABOUT_PAGE_VARIANTS,
  );
}

export function getExpandableCardsVariants(
  locale: Locale,
): Record<ProfileId | "default", ExpandableCardVariant[]> {
  return defaultOnlyVariants(
    locale === "en" ? EXPANDABLE_CARDS_VARIANTS_EN : EXPANDABLE_CARDS_VARIANTS,
  );
}
