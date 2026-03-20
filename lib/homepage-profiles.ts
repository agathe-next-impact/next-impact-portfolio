import type { ProfileId } from "@/lib/documentation-profiles";

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
    headline: "Développeur",
    subHeadline: "WordPress Headless",
    description:
      "Pour un WordPress ultra-rapide, moderne et flexible grâce au headless CMS.",
    valueProposition: "Un site combinant performance maximale et le back-office le plus utilisé au monde.",
    ctaPrimary: { label: "Audit gratuit personnalisé", href: "#audit" },
    ctaSecondary: { label: "Prêt à passer en headless ?", href: "/contact" },
    auditTitle: "Faut-il migrer en headless ?",
    auditSubtitle: "Audit gratuit",
    auditDescription:
      "Testez votre site WordPress pour un rapport complet avec des recommandations personnalisées pour une migration en WordPress headless.",
  },
  decideur: {
    headline: "Votre site web",
    subHeadline: "moteur de croissance",
    description:
      "Transformez votre WordPress en un avantage concurrentiel : plus rapide, plus sûr, plus performant. ROI mesurable.",
    valueProposition: "Performance, SEO et conversion : des résultats mesurables pour votre croissance.",
    ctaPrimary: { label: "Audit stratégique gratuit", href: "#audit" },
    ctaSecondary: { label: "Déterminer mon offre", href: "/contact" },
    auditTitle: "Quel retour sur investissement ?",
    auditSubtitle: "Diagnostic stratégique",
    auditDescription:
      "Obtenez une analyse complète de votre site avec des recommandations chiffrées sur les gains de performance, SEO et conversion.",
  },
  utilisateur: {
    headline: "Votre WordPress",
    subHeadline: "simple et puissant",
    description:
      "Gardez l'interface WordPress que vous connaissez, avec un site moderne, rapide et agréable à gérer au quotidien.",
    valueProposition: "Gardez WordPress, gagnez en performance et en simplicité.",
    ctaPrimary: { label: "Tester mon site gratuitement", href: "#audit" },
    ctaSecondary: { label: "Trouver mon offre", href: "/contact" },
    auditTitle: "Votre quotidien simplifié",
    auditSubtitle: "Évaluation gratuite",
    auditDescription:
      "Découvrez comment une migration headless peut rendre votre gestion de contenu plus fluide tout en améliorant l'expérience de vos visiteurs.",
  },
  developpeur: {
    headline: "Architecture",
    subHeadline: "WordPress Headless",
    description:
      "Stack moderne : WordPress API + Next.js / Astro. SSG, SSR, ISR. TypeScript, Tailwind, déploiement Vercel.",
    valueProposition: "WordPress API + Next.js/Astro : la stack moderne pour le CMS le plus utilisé.",
    ctaPrimary: { label: "Audit technique gratuit", href: "#audit" },
    ctaSecondary: { label: "Explorer les offres", href: "/contact" },
    auditTitle: "Analyse technique de votre stack",
    auditSubtitle: "Audit technique",
    auditDescription:
      "Évaluez votre architecture actuelle et découvrez les gains de performance, sécurité et DX avec WordPress headless + Next.js.",
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

export const SERVICES_PAGE_VARIANTS: Record<ProfileId | "default", ServicesPageVariant> = {
  default: {
    titre: "WordPress en mode Headless",
    sousTitre:
      "Découvrez comment transformer votre site WordPress en un site ultra-rapide, moderne et sécurisé grâce à l'architecture headless.",
    carouselLabel: "Pourquoi Next Impact ?",
    budgetTitle: "Quel impact sur votre budget ?",
    budgetCards: {
      left: {
        title: "Si vous êtes une petite association",
        description:
          "Vous bénéficiez d'un site performant et sécurisé à un tarif solidaire vous permettant de rivaliser avec les grands acteurs.",
        price: "2 250",
      },
      right: {
        title: "Si vous êtes une entreprise « Soutien »",
        description:
          "En choisissant Next Impact, vous n'achetez pas seulement un site WordPress Headless de haute volée ; vous financez directement la transition numérique d'un acteur de l'intérêt général.",
        highlight:
          "Mention « Mécène de la transition numérique » ajoutée à votre communication.",
      },
    },
    ctaTitle: "Déterminez votre offre",
    ctaDescription:
      "Répondez à quelques questions pour découvrir l'offre adaptée à votre structure et votre budget.",
    ctaLabel: "Déterminer mon offre",
    ctaHref: "/contact",
    faqs: [
      {
        question: "Est-ce que je pourrai toujours modifier mes textes ?",
        answer:
          "Oui, pour les 3 solutions. Vous conservez l'interface WordPress que vous connaissez pour gérer tous vos contenus, images et pages. Aucune compétence technique n'est requise.",
      },
      {
        question: "Le Headless est-il plus cher à maintenir ?",
        answer:
          "Légèrement, car il y a deux systèmes à maintenir (WordPress + front-end). Cependant, la sécurité renforcée et les performances accrues réduisent souvent les coûts d'intervention d'urgence et de perte de trafic.",
      },
      {
        question: "Combien de temps prend la mise en place ?",
        answer:
          "Comptez 2-4 semaines pour un site WordPress classique, 4-6 semaines pour une solution Astro, et 6-10 semaines pour une architecture Next.js complète, selon la complexité du projet.",
      },
      {
        question: "Mes plugins WordPress fonctionneront-ils encore ?",
        answer:
          "Les plugins front-end (sliders, formulaires affichés) sont remplacés par des équivalents plus performants. Les plugins back-end (SEO, analytics, sécurité) continuent de fonctionner normalement.",
      },
    ],
  },
  decideur: {
    titre: "WordPress en mode Headless",
    sousTitre:
      "Transformez votre site WordPress en un moteur de croissance : plus rapide, plus sûr, plus performant. ROI mesurable en quelques mois.",
    carouselLabel: "Pourquoi investir dans le Headless ?",
    budgetTitle: "Quel retour sur investissement ?",
    budgetCards: {
      left: {
        title: "PME en croissance",
        description:
          "Un site ultra-rapide booste votre SEO, réduit le taux de rebond et augmente vos conversions. L'investissement se rentabilise en quelques mois.",
        price: "4 000",
      },
      right: {
        title: "Entreprise à fort CA",
        description:
          "Architecture robuste, sécurité maximale, performances critiques. Votre site devient un avantage concurrentiel durable.",
        highlight:
          "40% de votre investissement finance directement un projet solidaire — valorisable en RSE.",
      },
    },
    ctaTitle: "Déterminez votre offre",
    ctaDescription:
      "En 2 minutes, découvrez l'offre adaptée à votre structure et estimez les gains de performance attendus.",
    ctaLabel: "Déterminer mon offre",
    ctaHref: "/contact",
    faqs: [
      {
        question: "Quel est le retour sur investissement concret ?",
        answer:
          "Un site headless améliore les Core Web Vitals (temps de chargement < 1s), ce qui impacte directement le SEO (+30% de trafic organique en moyenne) et le taux de conversion. Le ROI se mesure en quelques mois.",
      },
      {
        question: "En quoi le Headless est-il plus sécurisé ?",
        answer:
          "Le front-end est découplé de WordPress : votre back-office n'est plus accessible publiquement. Les attaques (brute force, injections) sont rendues impossibles. C'est un argument fort pour la conformité RGPD.",
      },
      {
        question: "Combien de temps pour voir les résultats ?",
        answer:
          "Le site est livré en 4 à 10 semaines selon la complexité. Les gains de performance sont immédiats dès la mise en ligne. L'impact SEO se mesure sous 2-3 mois.",
      },
      {
        question: "Comment fonctionne votre modèle de péréquation ?",
        answer:
          "Les entreprises à fort CA financent indirectement l'accès au numérique des petites associations. C'est un levier RSE concret : vous obtenez un site premium tout en soutenant l'ESS.",
      },
    ],
  },
  utilisateur: {
    titre: "WordPress en mode Headless",
    sousTitre:
      "Gardez l'interface WordPress que vous connaissez, avec un site moderne, rapide et agréable à gérer au quotidien.",
    carouselLabel: "Pourquoi c'est plus simple ?",
    budgetTitle: "Qu'est-ce qui change pour vous ?",
    budgetCards: {
      left: {
        title: "Au quotidien",
        description:
          "Vous continuez à créer vos pages, ajouter vos images et publier vos articles exactement comme avant — mais votre site est 10x plus rapide pour vos visiteurs.",
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
    ctaTitle: "Déterminez votre offre",
    ctaDescription:
      "Répondez à quelques questions simples pour identifier la formule qui correspond le mieux à votre organisation.",
    ctaLabel: "Déterminer mon offre",
    ctaHref: "/contact",
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
          "Une formation personnalisée est incluse dans toutes les offres. Vous recevez aussi une documentation d'utilisation adaptée à votre site. Un support est disponible selon votre formule.",
      },
      {
        question: "Mes contenus actuels seront-ils conservés ?",
        answer:
          "Oui, tous vos contenus (textes, images, médias) sont migrés automatiquement. Rien n'est perdu. La migration est incluse dans les offres Équilibre et Soutien.",
      },
    ],
  },
  developpeur: {
    titre: "WordPress en mode Headless",
    sousTitre:
      "WordPress API + Next.js / Astro. SSG, SSR, ISR. TypeScript, Tailwind, déploiement Vercel. Architecture découplée et maintenable.",
    carouselLabel: "Pourquoi cette stack ?",
    budgetTitle: "Que comprend chaque offre techniquement ?",
    budgetCards: {
      left: {
        title: "Starter Kit (Solidaire)",
        description:
          "Template Next.js pré-configuré, WordPress headless, déploiement Vercel, SSG par défaut. Idéal pour un site vitrine performant.",
        price: "2 250",
      },
      right: {
        title: "Architecture sur-mesure (Soutien)",
        description:
          "ISR / SSR hybride, multisites, API custom, intégrations tierces, CI/CD complet. Architecture pensée pour l'évolutivité.",
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
        question: "Quelle stack technique est utilisée ?",
        answer:
          "WordPress en back-end (API REST ou WPGraphQL), Next.js ou Astro en front-end, TypeScript, Tailwind CSS, déploiement sur Vercel. SSG par défaut, ISR/SSR selon les besoins.",
      },
      {
        question: "Comment fonctionne le data fetching ?",
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
          "Déploiement automatique sur Vercel via Git (push → build → deploy). Preview deployments sur chaque PR. Rollback instantané. Le WordPress reste sur un hébergement classique sécurisé.",
      },
    ],
  },
};

// ─── Variantes page Études de cas ────────────────────────────────────────────

export interface CaseStudiesPageVariant {
  titre: string;
  sousTitre: string;
  defaultTab: string;
  tabsLabel: string;
  ctaLabel: string;
  ctaHref: string;
  ctaDescription: string;
  projectHighlightLabel?: string;
}

export const CASE_STUDIES_PAGE_VARIANTS: Record<ProfileId | "default", CaseStudiesPageVariant> = {
  default: {
    titre: "Études de cas",
    sousTitre:
      "Découvrez nos réalisations de sites web WordPress pour divers secteurs d'activité.",
    defaultTab: "headless",
    tabsLabel: "Filtrer par secteur",
    ctaLabel: "Discuter de votre projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Vous avez un projet similaire ? Échangeons sur vos besoins et vos objectifs.",
  },
  decideur: {
    titre: "Nos réalisations clients",
    sousTitre:
      "Des projets concrets avec des résultats mesurables : performance, SEO et conversion au service de la croissance.",
    defaultTab: "headless",
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
    defaultTab: "headless",
    tabsLabel: "Explorer les projets",
    ctaLabel: "Voir une démo",
    ctaHref: "/demo",
    ctaDescription:
      "Envie de voir à quoi ressemble la gestion de contenu au quotidien ? Découvrez une démonstration en direct.",
  },
  developpeur: {
    titre: "Réalisations techniques",
    sousTitre:
      "Architecture WordPress Headless, Next.js, Astro, API REST, WPGraphQL. Détails techniques de chaque projet.",
    defaultTab: "headless",
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

export const ABOUT_PAGE_VARIANTS: Record<ProfileId | "default", AboutPageVariant> = {
  default: {
    titre: "A propos",
    sousTitre: "L'architecture Headless au service de l'ESS et de l'impact social.",
    manifesteIntro:
      "Nous vivons une époque où l'urgence n'est plus une figure de style, mais une réalité quotidienne pour les acteurs de l'environnement et de l'humain. Pourtant, un fossé technologique absurde persiste : d'un côté, des entreprises privées sur-équipées ; de l'autre, des associations et des structures de l'ESS qui luttent avec des outils web lents, vulnérables ou obsolètes.",
    manifesteAccroche:
      "Next Impact est né pour donner à l'ESS son indispensable impact.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "La crédibilité, arme de survie de l'ESS",
        description:
          "Pour convaincre un mécène, sécuriser un partenariat ou lever des fonds, la robustesse technique n'est pas une option. Un site qui crash est un don perdu.",
        items: [
          "Vitesse de chargement instantanée",
          "Sécurité inviolable pour les données des donateurs",
          "Crédibilité immédiate auprès des interlocuteurs exigeants",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Offrir l'expérience utilisateur du web actuel à l'ESS",
        description:
          "En automatisant le code répétitif et les micro-tâches, nous réduisons drastiquement les temps de production.",
        items: [
          "Technologies \"Premium\" financièrement accessibles au secteur associatif",
          "Un site digne des plus grands groupes, livré dans un calendrier compatible avec l'urgence de vos missions",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Numérique responsable by design",
        description:
          "La performance business doit servir la performance écologique. Chaque ligne de code et chaque choix d'hébergement est pensé pour réduire l'empreinte carbone numérique.",
        items: ["Code optimisé et léger", "Hébergement éco-responsable"],
      },
    ],
    citation:
      "Je ne construis pas seulement des sites web. Je forge les outils de survie et de développement des acteurs qui réparent le monde.",
    ctaLabel: "Discuter de votre projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Envie d'en savoir plus sur notre approche ? Échangeons sur vos besoins.",
  },
  decideur: {
    titre: "Pourquoi Next Impact",
    sousTitre:
      "La performance web comme levier de croissance : ROI mesurable, sécurité et avantage concurrentiel.",
    manifesteIntro:
      "Un site lent coûte cher. Chaque seconde de chargement supplémentaire fait perdre 7% de conversions. Un site vulnérable peut détruire des années de confiance en un incident. Les organisations qui investissent dans la performance web constatent un retour sur investissement mesurable en quelques mois.",
    manifesteAccroche:
      "Next Impact transforme votre présence web en avantage concurrentiel durable.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Performance et conversion",
        description:
          "Un site rapide convertit mieux. Le score PageSpeed impacte directement le SEO, le taux de rebond et le taux de conversion — des métriques business mesurables.",
        items: [
          "Score PageSpeed 95+ garanti",
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
          "Surface d'attaque réduite de 90% par le découplage",
          "Infrastructure moderne et maintenable sur le long terme",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "RSE et engagement durable",
        description:
          "Un site éco-conçu renforce votre démarche RSE. Le numérique responsable est un différenciateur crédible auprès de vos parties prenantes.",
        items: [
          "Empreinte carbone numérique réduite",
          "Valeur RSE valorisable dans vos rapports",
        ],
      },
    ],
    citation:
      "Chaque projet est un investissement stratégique. Mon rôle est de garantir qu'il génère des résultats mesurables.",
    ctaLabel: "Évaluer mon projet",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Discutons de vos objectifs business et du ROI que vous pouvez attendre.",
  },
  utilisateur: {
    titre: "Qui sommes-nous",
    sousTitre:
      "Des sites simples à gérer, rapides pour vos visiteurs — avec le WordPress que vous connaissez déjà.",
    manifesteIntro:
      "Vous gérez un site web au quotidien et vous méritez un outil qui fonctionne. Pas de bugs, pas de lenteurs, pas de prise de tête. Avec Next Impact, vous gardez WordPress pour gérer vos contenus, et nous nous occupons de la technique pour que votre site soit rapide, sécurisé et agréable — pour vous comme pour vos visiteurs.",
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
      "WordPress Headless + Next.js/Astro. Architecture découplée, SSG/SSR/ISR, TypeScript, déploiement Vercel.",
    manifesteIntro:
      "Next Impact est né de la conviction que WordPress mérite une architecture frontend moderne. Le CMS le plus utilisé au monde, couplé à un framework React performant, offre le meilleur des deux mondes : la puissance éditoriale de WordPress et la performance d'un site statique.",
    manifesteAccroche:
      "Architecture découplée, DX moderne, performances maximales.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Architecture WordPress Headless",
        description:
          "WordPress comme CMS backend, API REST ou WPGraphQL pour le data fetching, Next.js ou Astro pour le rendu frontend.",
        items: [
          "API REST WordPress + WPGraphQL",
          "Custom Post Types et ACF Pro pour la modélisation",
          "Preview mode et draft handling",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Stack frontend moderne",
        description:
          "Next.js App Router avec SSG/SSR/ISR selon les besoins. TypeScript strict, Tailwind CSS, composants React réutilisables.",
        items: [
          "SSG par défaut, ISR/SSR configurable par route",
          "next/image pour l'optimisation automatique des images",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "DevOps et déploiement",
        description:
          "CI/CD via Vercel avec preview deployments sur chaque PR. Rollback instantané, monitoring et logs centralisés.",
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
      ctaLink: "/documentation/headless-cms/comprendre-le-headless",
    },
    {
      title: "Pourquoi choisir le Headless ?",
      description:
        "Comprendre les gains concrets : temps de chargement divisé, coût de maintenance réduit et ROI mesurable sur votre investissement web.",
      src: "/icons/scan-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/headless-cms/pourquoi-le-headless",
    },
    {
      title: "Pour quels objectifs ?",
      description:
        "Découvrez si votre projet correspond : pic de trafic à absorber, éco-conception, multi-sites, portail client ou application métier.",
      src: "/icons/analytics-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/headless-cms/quand-utiliser-wordpress-headless",
    },
  ],
  decideur: [
    {
      title: "Le headless, un avantage stratégique",
      description:
        "Comprendre comment le découplage frontend/backend se traduit en avantage concurrentiel pour votre entreprise.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "En savoir plus",
      ctaLink: "/documentation/headless-cms/pourquoi-le-headless",
    },
    {
      title: "ROI et performance business",
      description:
        "Des indicateurs mesurables : temps de chargement, taux de conversion, positionnement SEO. L'impact direct sur votre chiffre d'affaires.",
      src: "/icons/scan-icon.svg",
      ctaText: "Voir les chiffres",
      ctaLink: "/documentation/headless-cms/performance-et-core-web-vitals",
    },
    {
      title: "Cas d'usage : croissance et investissement",
      description:
        "Des exemples concrets de PME et d'organisations ESS ayant transformé leur présence en ligne grâce au headless.",
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
      ctaLink: "/documentation/headless-cms/gerer-le-contenu",
    },
    {
      title: "Un site plus rapide pour vos visiteurs",
      description:
        "Vos pages se chargent instantanément. Vos visiteurs restent plus longtemps, interagissent plus et reviennent.",
      src: "/icons/scan-icon.svg",
      ctaText: "Comprendre les gains",
      ctaLink: "/documentation/headless-cms/performance-et-core-web-vitals",
    },
    {
      title: "Gérer votre contenu au quotidien",
      description:
        "Prévisualisation, gestion des médias, workflow éditorial : tout ce dont vous avez besoin pour publier sereinement.",
      src: "/icons/analytics-icon.svg",
      ctaText: "Voir le workflow",
      ctaLink: "/documentation/headless-cms/preview-et-workflow-editorial",
    },
  ],
  developpeur: [
    {
      title: "Architecture découplée",
      description:
        "API REST / GraphQL en backend, React en frontend. Comprendre la séparation des responsabilités et le data fetching.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "Voir l'architecture",
      ctaLink: "/documentation/headless-cms/comment-fonctionne-le-headless",
    },
    {
      title: "Stack technique et performance",
      description:
        "Next.js, SSG/SSR/ISR, Core Web Vitals, optimisation images. Les choix techniques pour un Lighthouse à 100.",
      src: "/icons/scan-icon.svg",
      ctaText: "Explorer la stack",
      ctaLink: "/documentation/headless-cms/nextjs-pour-wordpress-headless",
    },
    {
      title: "Implémentation de A à Z",
      description:
        "Du setup WordPress headless au déploiement Vercel : endpoints, authentification JWT, CI/CD et mise en production.",
      src: "/icons/analytics-icon.svg",
      ctaText: "Voir le guide",
      ctaLink: "/documentation/headless-cms/deploiement-vercel-nextjs",
    },
  ],
};
