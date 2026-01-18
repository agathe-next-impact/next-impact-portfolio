import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MagicCard } from "@/components/magicui/magic-card";
import { Metadata } from "next";

// meta données dynamiques pour la page d'étude de cas
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {

  const caseStudy = CASE_STUDIES.find((study) => study.slug === params.slug);
  if (!caseStudy) {
    return {
      title: "Étude de cas introuvable",
      description: "L'étude de cas demandée n'existe pas.",
      openGraph: {
        title: "Étude de cas introuvable",
        description: "L'étude de cas demandée n'existe pas.",
        url: `https://next-impact.digital/etudes-de-cas/${params.slug}`,
        type: "article",
      },
    };
  }

  return {
    title: `${caseStudy.title} | Next Impact`,
    description: caseStudy.description,
    openGraph: {
      title: `${caseStudy.title} | Next Impact`,
      description: caseStudy.description,
      url: `https://next-impact.digital/etudes-de-cas/${caseStudy.slug}`,
      type: "article",
      images: [
        {
          url: caseStudy.imageUrl,
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
      ],
    },
    metadataBase: new URL("https://next-impact.digital"),
  };
}

// Types pour les études de cas
type ClientType =
  | "Grande entreprise"
  | "PME"
  | "Association"
  | "Indépendant"
  | "ESS"
  | "Tous"
  | "Groupement"
  | "Institutionnel";
type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | null;
type Year = number | null;  

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  clientType: ClientType;
  clientName: string;
  date: {
    month: Month;
    year: Year;
  };
  tags: string[];
  objectives: string[];
  results: string[];
  testimonial?: {
    content: string;
    author: string;
    position: string;
  };
  gallery: {
    url: string;
    alt: string;
  }[];
  detailedDescription: string;
  technologies: string[];
  duration: string;
  website?: string;
  demoLink?: string;
}

// Données d'exemple (à remplacer par vos vraies données)
const CASE_STUDIES: CaseStudy[] = [
  {
    id: "0",
    slug: "les-etats-generaux-communaux",
    title: "Les Etats Généraux Communaux",
    description: "Site vitrine des Etats Généraux Communaux",
    imageUrl: "/img/logo-egc.png",
    clientType: "Association",
    clientName: "Les Etats Généraux Communaux",
    date: {
      month: 10,
      year: 2025,
    },
    tags: ["Association", "WordPress", "Headless", "Next.js"],
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
    gallery: [
      {
        url: "/img/desktop-screen-egc.png",
        alt: "Page d'accueil du site Les Etats Généraux Communaux",
      },
    ],
    detailedDescription:
      "Les Etats Généraux Communaux est un site vitrine conçu pour promouvoir un événement citoyen visant à encourager la participation locale. Le site met en avant les ressources, les actualités et facilite la constitution des groupes locaux.\n\nNous avons développé un site WordPress en Headless avec Next.js, permettant une expérience utilisateur fluide et rapide. Le design est épuré, mettant en avant l'événement et ses objectifs.\n\nLe site comprend une section de ressources téléchargeables, un calendrier des événements et une carte interactive des groupes locaux constitués.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, afin d'attirer un maximum de visiteurs et de sensibiliser le public à l'initiative.",
    technologies: ["WordPress", "Headless CMS", "Next.js", "Tailwind CSS", "Vercel"],
    duration: "4 semaines",
    website: "https://lesetatsgenerauxcommunaux.org",
    demoLink: "https://youtu.be/dJIndpLBm7o",
  },
  {
    id: "1",
    slug: "proditec",
    title: "Proditec",
    description:
      "Refonte du site vitrine pour une entreprise de l'industrie robotique internationale.",
    imageUrl: "/img/logo-proditec.webp",
    clientType: "PME",
    clientName: "Proditec",
    date: {
      month: 5,
      year: 2025,
    },
    tags: ["Corporate", "WordPress", "Polylang"],
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
    gallery: [
      {
        url: "/img/desktop-screen-proditec.jpg",
        alt: "Page d'accueil du site Proditec",
      },
    ],
    detailedDescription: `Proditec, une entreprise spécialisée dans la robotique industrielle, avait besoin d'une refonte complète de son site web pour 
      refléter son travail et sa reconnaissance internationale. Leur ancien site était obsolète, difficile à naviguer et à administrer et ne prenait 
      pas en charge le multilingue.\n\nNous avons créé un site WordPress avec un design responsive et une interface 
      utilisateur et administrateur technique et efficace pour être utilisées par tous.
      Le site est entièrement multilingue grâce à l'intégration de Polylang, 
      permettant aux visiteurs de choisir leur langue préférée.
      \n\nLe nouveau site met en avant les produits phares de Proditec avec des détails précis sur leurs machines.
      Des optimisations techniques ont été mises en place pour améliorer la vitesse de chargement du site, 
      ce qui a permis d'atteindre un score PageSpeed de 98 sur mobile et desktop.`,
    technologies: [
      "WordPress",
      "LiteSpeed",
      "Polylang",
      "elementor",
      "Hostinger",
    ],
    duration: "1 mois",
    website: "https://proditec.com",
  },
  {
    id: "2",
    slug: "doleances",
    title: "Association des Doléances",
    description:
      "Création d'un site vitrine inspiré de Wikipédia destiné à promouvoir l'action de l'association.",
    imageUrl: "/img/logo-doleances.png",
    clientType: "Association",
    clientName: "Association Les Doléances",
    date: {
      month: 5,
      year: 2025,
    },
    tags: ["WordPress", "Next.js", "Association"],
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
    gallery: [
      {
        url: "/img/desktop-screen-lesdoleances.jpg",
        alt: "Page d'accueil du site Les Doléances",
      },
    ],
    detailedDescription:
      "L'association Les Doléances, nouvellement créée a pour vocation de mettre à disposition des citoyens les Doléances de 2018-2019. Pour évoquer l'esprit communautaire et participatif, ainsi que la liberté d'accès à l'information, un template très largement inspiré de Wikipédia a été choisi.\n\nLe site est construit sur WordPress en Headless avec Next.js, permettant une expérience utilisateur fluide et rapide. Le design est épuré, mettant en avant l'action et la démarche.\n\nLe site comprend une cartographie de ses groupes locaux et une section d'articles catégorisés.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, afin d'attirer un maximum de visiteurs et de sensibiliser le public aux actions de l'association.",
    technologies: [
      "WordPress",
      "Next.js",
      "Tailwind CSS",
      "Headless CMS",
      "Vercel",
    ],
    duration: "2 mois",
    website: "https://lesdoleances.fr",
    demoLink: "https://youtu.be/_OjiGiOWJus?si=7pcNT3Zx_dxLJqUa",
  },
  {
    id: "4",
    slug: "sowee",
    title: "Sowee",
    description:
      "Création d'une section blog pour le portail de l'entreprise Sowee, spécialisée dans les solutions énergétiques.",
    imageUrl: "/img/logo-sowee.svg",
    clientType: "Grande entreprise",
    clientName: "Sowee",
    date: {
      month: 11,
      year: 2023,
    },
    tags: ["WordPress", "Blog", "Thème custom"],
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
    gallery: [
      {
        url: "/img/desktop-screen-sowee.png",
        alt: "Interface de la section blog Sowee",
      },
    ],
    detailedDescription:
      "Sowee, une entreprise spécialisée dans les solutions énergétiques, souhaitait créer une section blog pour son portail Drupal tout en utilisant WordPress. L'objectif était de fournir un espace où l'équipe marketing pourrait publier des articles sur les tendances du secteur, les innovations et les conseils pour les consommateurs.\n\nNous avons développé un thème WordPress personnalisé en respectant les maquettes fournies par l'équipe marketing. Le design est moderne et épuré, avec une navigation intuitive pour les lecteurs.\n\nLa section blog permet à l'équipe de publier facilement des articles, d'ajouter des images et de gérer les catégories.",
    technologies: [
      "GeneratePress",
      "WordPress",
      "Figma (maquettes)",
      "PHP",
      "GitHub Actions (CI/CD)",
    ],
    duration: "5 jours",
    website: "https://sowee.fr/conseils",
    demoLink: "https://youtu.be/PHImvgHrScE",
  },
  {
    id: "5",
    slug: "salon-de-la-carrosserie",
    title: "Salon de la Carrosserie 2024",
    description:
      "Création d'un site vitrine pour le Salon de la Carrosserie 2024, avec un design moderne et un espace d'inscription pour exposants.",
    imageUrl: "/img/logo-salondelacarrosserie.webp",
    clientType: "PME",
    clientName: "Salon de la Carrosserie",
    date: {
      month: 2,
      year: 2024,
    },
    tags: ["WordPress", "Evénementiel", "Espace membres"],
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
        "Du professionnalisme, un réel esprit d’initiative, le sens du conseil et une réactivité totale ! Ajouter un bon état d’esprit d’une personne qui n’hésite pas à « dépasser » la charge de travail et sa fonction pour améliorer la qualité de la prestation.",
      author: "Luc Poigniez",
      position: "Fondateur, Agence Créaclic",
    },
    gallery: [
      {
        url: "/img/desktop-screen-salondelacarrosserie.jpg",
        alt: "Page d'accueil du site Salon de la Carrosserie",
      },
    ],
    detailedDescription:
      "Le Salon de la Carrosserie, un événement majeur pour les professionnels du secteur, avait besoin d'un site vitrine pour promouvoir l'événement et faciliter l'inscription des exposants. L'objectif était de créer un site moderne et fonctionnel qui reflète l'importance de l'événement.\n\nNous avons développé un site WordPress avec un design épuré et une navigation intuitive. La page d'accueil présente les informations clés sur l'événement, les exposants et les partenaires.\n\nUn espace d'inscription pour les exposants a été mis en place, permettant aux entreprises de s'inscrire facilement et de gérer leurs disponibilités. Le site est entièrement responsive et optimisé pour le référencement naturel.",
    technologies: ["WordPress", "Elementor Pro", "Ultimate Member"],
    duration: "15 jours",
    website: "https://salondelacarrosserie.com",
    demoLink: "https://youtu.be/s_tyz8ubqSo",
  },
  {
    id: "6",
    slug: "hermitage",
    title: "Tiers Lieu L'Hermitage",
    description:
      "Refonte progressive à la marge du site vitrine du Tiers Lieu L'Hermitage.",
    imageUrl: "/img/logo-hermitage.webp",
    clientType: "ESS",
    clientName: "L'Hermitage",
    date: {
      month: 1,
      year: 2025,
    },
    tags: ["Refonte", "Impact", "WordPress"],
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
    gallery: [
      {
        url: "/img/desktop-screen-hermitage.jpg",
        alt: "Page d'accueil du site Tiers Lieu L'Hermitage",
      },
    ],
    detailedDescription:
      "Le Tiers Lieu L'Hermitage, un espace collaboratif d'innovation rurale, souhaitait moderniser son site vitrine tout en conservant son identité. Le site existant était construit avec Divi, ce qui posait des problèmes de performance et de stabilité.\n\nNous avons entrepris une refonte progressive du site en passant à Elementor, un constructeur de pages plus performant et flexible. Le design a été modernisé pour refléter l'identité du Tiers Lieu tout en restant fidèle à ses valeurs.\n\nDes fonctionnalités ont été ajoutées pour faciliter les dons récurrents et les dons dédiés à des projets spécifiques. Le site est désormais stable, rapide et facile à administrer.",
    technologies: [
      "WordPress",
      "Elementor Pro",
      "Optimisation des performances",
    ],
    duration: "1 mois",
    website: "https://hermitagelelab.com",
  },
  {
    id: "7",
    slug: "erp-services",
    title: "ERP Services",
    description:
      "Refonte à l'identique du site vitrine d'ERP Services, bureau d'études en ingénierie.",
    imageUrl: "/img/logo-erp-services.webp",
    clientType: "PME",
    clientName: "ERP Services",
    date: {
      month: 7,
      year: 2024,
    },
    tags: ["WordPress", "Site vitrine", "Refonte"],
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
    gallery: [
      {
        url: "/img/desktop-screen-erp-services.jpg",
        alt: "Page de service du site ERP Services",
      },
    ],
    detailedDescription:
      "ERP Services, un bureau d'études en ingénierie, avait besoin d'une refonte de son site vitrine pour améliorer la performance et la sécurité tout en conservant l'identité visuelle existante. Le site devait également être plus facile à administrer pour l'équipe interne.\n\nNous avons réalisé une refonte à l'identique du site existant, en améliorant les performances et la sécurité. Le design a été légèrement revu pour une meilleure lisibilité et une navigation intuitive.\n\nLe site met en avant les projets phares d'ERP Services avec des descriptions détaillées et des photos de haute qualité. Des moyens de contact ont été développés pour faciliter la prise de contact avec les clients potentiels.",
    technologies: ["WordPress", "Elementor Pro", "LiteSpeed Cache"],
    duration: "2 semaines",
  },
  {
    id: "8",
    slug: "senza-nature",
    title: "Senza Nature",
    description:
      "Création d'un site e-commerce pour la vente de produits naturels et bio.",
    imageUrl: "/img/logo-senza-nature.png",
    clientType: "PME",
    clientName: "Senza Nature",
    date: {
      month: 9,
      year: 2024,
    },
    tags: ["Ecommerce", "Woocommerce", "WordPress"],
    objectives: [
      "Maintenir une boutique en ligne pour vendre des produits naturels",
      "Réaliser les évolutions du site en continu",
      "Optimiser les performances du site",
    ],
    results: [
      "Stabilisation du site avec une réduction significative des bugs",
      "Amélioration de la vitesse de chargement du site",
    ],
    gallery: [
      {
        url: "/img/desktop-screen-senza-nature.jpg",
        alt: "Page d'accueil du site Senza Nature",
      },
    ],
    detailedDescription:
      "Senza Nature, une entreprise spécialisée dans la vente de produits naturels et bio, avait besoin d'un support et suivi global du site e-commerce pour vendre ses produits en ligne. L'objectif était de maintenir une boutique en ligne stable et performante tout en réalisant des évolutions continues.\n\nNous avons mis en place un suivi global du site, en assurant la maintenance, les mises à jour et les évolutions nécessaires. Le site est construit sur WooCommerce, permettant une gestion facile des produits et des commandes.\n\nDes optimisations techniques ont été mises en place pour améliorer la vitesse de chargement du site, ce qui a permis d'atteindre un score PageSpeed élevé sur mobile et desktop.",
    technologies: ["WordPress", "Woocommerce", "LiteSpeed Cache"],
    duration: "depuis 2024",
    website: "https://senza-nature.com",
  },
  {
    id: "9",
    slug: "wagner-hamisky",
    title: "Wagner Hamisky",
    description:
      "Création d'un site vitrine pour la galerie d'art Wagner Hamisky.",
    imageUrl: "/img/logo-wagner-hamisky.jpeg",
    clientType: "PME",
    clientName: "Wagner Hamisky",
    date: {
      month: 2,
      year: 2024,
    },
    tags: ["WordPress", "Galerie d'art", "Site vitrine"],
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
    gallery: [
      {
        url: "/img/desktop-screen-wagner-hamisky.jpg",
        alt: "Page d'accueil du site Wagner Hamisky",
      },
    ],
    detailedDescription:
      "Wagner Hamisky, une galerie d'art spécialisée dans la restauration d'œuvres d'art, souhaitait créer un site vitrine pour présenter ses artistes et leurs œuvres, à l'occasion de son ouverture. L'objectif était de fournir un espace d'exposition tout en facilitant la prise de contact avec les clients potentiels.\n\nNous avons développé un site WordPress avec un design moderne et épuré, mettant en avant les œuvres des deux artistes. Le site comprend une galerie d'images et des descriptions détaillées des œuvres..\n\nLe site est entièrement optimisé pour une gestion simple du catalogue des œuvres afin de permettre l'autonomie ultérieure.",
    technologies: ["WordPress", "Thème custom", "ACF Pro"],
    duration: "3 semaines",
    website: "https://wagner-hamisky.com",
    demoLink: "https://youtu.be/Zv7SUqZPo08",
  },
  {
    id: "10",
    slug: "mediatico",
    title: "Mediatico",
    description:
      "Création d'un Média en ligne pour Mediatico, toute l'actualité de l'ESS.",
    imageUrl: "/img/logo-mediatico.png",
    clientType: "ESS",
    clientName: "Mediatico",
    date: {
      month: 12,
      year: 2024,
    },
    tags: ["WordPress", "Media en ligne", "Full Site Editing"],
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
    gallery: [
      {
        url: "/img/desktop-screen-mediatico.jpg",
        alt: "Page d'accueil du site Mediatico",
      },
    ],
    detailedDescription:
      "Mediatico, un média en ligne dédié à l'actualité de l'économie sociale et solidaire, souhaitait refondre son média pour présenter ses articles et ses partenaires. L'objectif était de fournir un espace d'information accessible et attrayant pour les lecteurs.\n\nNous avons développé un site WordPress avec un design moderne et une navigation intuitive. Le site met en avant les articles récents, les partenaires et sponsors, ainsi qu'un espace dédié aux publications des visiteurs.\n\nLe site est entièrement responsive et optimisé pour le référencement naturel, permettant à Mediatico d'attirer un large public intéressé par l'ESS.",
    technologies: ["WordPress", "Gutenberg", "Thème custom"],
    duration: "4 semaines",
    website: "https://mediatico.fr",
    demoLink: "https://youtu.be/2RfDio_6oQQ",
  },
  {
    id: "11",
    slug: "infralliance",
    title: "Infralliance",
    description:
      "Création d'un site vitrine pour Infralliance, Think and Do Thank des opérateurs d'infrastructures numériques.",
    imageUrl: "/img/logo-infralliance.png",
    clientType: "Groupement",
    clientName: "Infralliance",
    date: {
      month: 4,
      year: 2023,
    },
    tags: ["WordPress", "Advanced Custom Fields", "Elementor Pro"],
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
    gallery: [
      {
        url: "/img/desktop-screen-infralliance.jpg",
        alt: "Page d'accueil du site Connexion Plus",
      },
    ],
    detailedDescription:
      "Infralliance, un think and do tank des opérateurs d'infrastructures numériques, souhaitait créer un site vitrine pour présenter ses actions et ses membres.\n\nNous avons développé un site WordPress avec un design épuré et une navigation intuitive. Le site met en avant les actions de l'association, ainsi que son réseau d'opérateurs d'infrastructures numériques.\n\nLe site a été mis en ligne avant l'événement de lancement de l'association, permettant à Infralliance de communiquer efficacement sur ses enjeux et ses projets.",
    technologies: ["WordPress", "Elementor Pro", "Advanced Custom Fields"],
    duration: "2 semaines",
    website: "https://infralliance.net",
    demoLink: "https://youtu.be/LtMBegTX06Q",
  },
  {
    id: "12",
    slug: "connexion-plus",
    title: "GEM Connexion",
    description:
      "Création d'un site vitrine pour le GEM Connexion Plus, association socio-culturelle parisienne.",
    imageUrl: "/img/logo-connexion-plus.jpg",
    clientType: "ESS",
    clientName: "GEM Connexion",
    date: {
      month: 5,
      year: 2022,
    },
    tags: ["WordPress", "Site vitrine", "Association"],
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
    gallery: [
      {
        url: "/img/desktop-screen-gem-connexion.jpg",
        alt: "Page d'accueil du site GEM Connexion",
      },
    ],
    detailedDescription:
      "GEM Connexion Plus, un groupe d'entraide mutuelle (GEM) parisien, souhaitait créer un site vitrine pour donner de la visibilité à ses activités et à ses projets. L'objectif était de fournir un espace professionnel et moderne pour attirer de nouveaux membres et partenaires.\n\nNous avons développé un site WordPress avec un design épuré et une navigation intuitive. Le site met en avant les activités du GEM, ainsi que les projets en cours.\n\nUn espace dédié aux membres a été intégré, permettant à chacun de publier ses actualités et de partager ses expériences. Le site est entièrement responsive et optimisé pour le référencement naturel.",
    technologies: [
      "WordPress",
      "Thème communautaire",
      "Co-construction par ateliers",
    ],
    duration: "4 semaines",
    website: "https://gem-connexion.fr",
  },
  {
    id: "13",
    slug: "sdevo",
    title: "SDEVO",
    description:
      "Création d'un plugin de gestion des demandes de subventions pour le Syndicat départemental des énergies du Val d'Oise.",
    imageUrl: "/img/logo-sdevo.png",
    clientType: "Institutionnel",
    clientName: "SDEVO",
    date: {
      month: 8,
      year: 2024,
    },
    tags: ["WordPress", "Plugin custom", "Gestion des subventions"],
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
    gallery: [
      {
        url: "/img/desktop-screen-sdevo.png",
        alt: "Page de gestion des subventions du SDEVO",
      },
    ],
    detailedDescription:
      "Le Syndicat départemental des énergies du Val d'Oise (SDEVO) souhaitait créer un plugin WordPress pour gérer les demandes de subventions des communes. L'objectif était de permettre aux communes de soumettre leurs demandes en ligne et de faciliter le suivi pour le SDEVO.\n\nNous avons développé un plugin personnalisé qui permet aux communes de soumettre leurs demandes de subventions via une interface utilisateur intuitive. Le plugin gère également le suivi des demandes, permettant au SDEVO de centraliser et de suivre les demandes de manière efficace.\n\nLe plugin est entièrement intégré à WordPress, ce qui permet une gestion facile et une administration simplifiée pour les utilisateurs du SDEVO.",
    technologies: ["WordPress", "PHP", "Plugin custom"],
    duration: "3 semaines",
  },
];

// Noms des mois en français
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Fonction pour obtenir les études de cas similaires
function getSimilarCaseStudies(
  currentStudy: CaseStudy,
  limit = 3
): CaseStudy[] {
  // Filtrer pour exclure l'étude de cas actuelle et trouver des études similaires
  // basées sur le type de client ou les tags communs
  return CASE_STUDIES.filter((study) => {
    if (study.id === currentStudy.id) return false;

    // Vérifier si le type de client est le même
    const sameClientType = study.clientType === currentStudy.clientType;

    // Vérifier s'il y a des tags communs
    const commonTags = study.tags.filter((tag) =>
      currentStudy.tags.includes(tag)
    );

    return sameClientType || commonTags.length > 0;
  }).slice(0, limit);
}

// Fonction pour générer les chemins statiques
export async function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {

      // Utilitaire pour transformer un lien YouTube en embed
      function toYoutubeEmbed(url) {
        if (!url) return url;
        if (url.includes('youtube.com/embed/')) return url;
        const matchShort = url.match(/youtu\.be\/([\w-]+)/);
        if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
        const matchLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
        if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
        return url;
      }

  const caseStudy = CASE_STUDIES.find(  
    (study) => study.slug === params.slug
  );

  if (!caseStudy) {
    // Gestion d'erreur explicite : affiche une page d'erreur personnalisée ou Next.js 404
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Étude de cas introuvable</h1>
        <p className="mb-6">L'étude de cas demandée n'existe pas ou a été supprimée.</p>
        <Link href="/etudes-de-cas" className="text-blue-600 hover:underline">Retour aux réalisations</Link>
      </main>
    );
    // Ou, pour afficher la page 404 native :
    // notFound();
  }

  // Obtenir des études de cas similaires
  const similarCaseStudies = getSimilarCaseStudies(caseStudy); 

  return (
    <main className="min-h-screen">
      {/* Hero section avec image et titre */}
      <div className="container relative h-full flex flex-col justify-end py-16 px-4 md:px-6">
        <Link
          href="/etudes-de-cas"
          className="text-regularblue/70 mb-4 flex items-center hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux réalisations
        </Link>
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-regularblue font-semibold mb-4">
          {caseStudy.title}
        </h1>
        <p className="text-xl max-w-3xl text-regularblue/70">
          {caseStudy.description}
        </p>
        <Image
          src={caseStudy.imageUrl}
          alt={caseStudy.title}
          width={150}
          height={150}
          className="object-contain mt-12"
        />
      </div>

      {/* Contenu principal */}
      <div className="container py-6 bg-white/30 backdrop-blur-xl border-y border-lightblue/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start px-4 md:px-6">
          <div className="lg:col-span-2 space-y-10">
            {/* Galerie */}
            <section>
              <h2 className="text-3xl mb-6 text-regularblue font-medium">
                Aperçu du projet
              </h2>
              <div className="rounded-lg border overflow-hidden">
                {caseStudy.demoLink ? (
                  <iframe
                    src={toYoutubeEmbed(caseStudy.demoLink) + '?autoplay=0&rel=0&modestbranding=1'}
                    title="Vidéo du projet"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video border-0"
                  />
                ) : (
                  <Image
                    src={caseStudy.gallery[0]?.url || "/placeholder.svg"}
                    alt={caseStudy.gallery[0]?.alt || "Aperçu du projet"}
                    width={800}
                    height={500}
                    className="w-full object-cover"
                  />
                )}
              </div>

            </section>

            {/* Présentation du projet */}
            <section>
              <h2 className="text-3xl mb-6 text-regularblue font-medium">
                Présentation du projet
              </h2>
              <div className="prose max-w-none">
                {caseStudy.detailedDescription
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-regularblue/80 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </section>

            {/* Objectifs et résultats */}
            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl mb-6 text-regularblue font-medium">Objectifs</h2>
                <ul className="space-y-3">
                  {caseStudy.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lightblue/10 text-lightblue/70 flex items-center justify-center mr-3 mt-0.5">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <span className=" text-regularblue/80">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-3xl mb-6 text-regularblue font-medium">Résultats</h2>
                <ul className="space-y-3">
                  {caseStudy.results.map((result, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lightblue/10 text-lightblue/70 flex items-center justify-center mr-3 mt-0.5">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <span className=" text-regularblue/80">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Témoignage client */}
            {caseStudy.testimonial && (
              <section className="bg-extralightblue/10 p-6 rounded-2xl">
                <h2 className="text-3xl mb-6 text-regularblue font-medium">
                  Témoignage client
                </h2>
                <blockquote className="relative">
                  <div className="text-lg italic text-mediumblue mb-4">
                    "{caseStudy.testimonial.content}"
                  </div>
                  <footer className="flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center mr-4">
                      <Image
                        src={caseStudy.imageUrl}
                        alt={caseStudy.testimonial.author}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-googletitre">
                        {caseStudy.testimonial.author}
                      </div>
                      <div className="text-sm text-regularblue">
                        {caseStudy.testimonial.position}
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </section>
            )}
          </div>
          {/* Sidebar avec informations du projet */}
          <div className="lg:col-span-1 sticky top-16 self-start">
            <MagicCard className="rounded-2xl bg-white border-none">
              <div className="p-6 top-8">
                <h2 className="text-3xl mb-6 text-regularblue font-medium">
                  Informations du projet
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-regularblue mb-1">
                      Client
                    </h3>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-lightblue/10 text-regularblue font-medium"
                      >
                        {caseStudy.clientType}
                      </Badge>
                      <span className="ml-2 font-medium font-googletitre text-lg">
                        {caseStudy.clientName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-regularblue mb-1">
                      Date de réalisation
                    </h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-lightblue" />
                      <span className="font-medium font-googletitre text-lg">
                        {caseStudy.date.month &&
                          monthNames[caseStudy.date.month - 1]}{" "}
                        {caseStudy.date.year}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-regularblue mb-1">
                      Durée du projet
                    </h3>
                    <span className="font-medium font-googletitre text-lg">
                      {caseStudy.duration}
                    </span>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-regularblue mb-2">
                      Technologies utilisées
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-lightblue/10 text-regularblue font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-regularblue mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-lightblue/10 text-regularblue font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {caseStudy.website && (
                    <div>
                      <h3 className="text-sm font-medium text-regularblue mb-2">
                        Site web
                      </h3>
                      <a
                        href={caseStudy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-regularblue font-googletitre hover:underline"
                      >
                        {caseStudy.website}
                      </a>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Button
                      className="md:flex gap-1 rounded-full px-6 bg-regularblue hover:bg-regularblue/80 hover:text-white transition-all duration-900 ease-in-out"
                      asChild
                    >
                      <Link
                        target="_blank"
                        href="https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress"
                      >
                        Discuter de votre projet
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>

        {/* Autres projets similaires */}
        <section className="my-16">
          <h2 className="text-4xl font-medium text-regularblue mb-8">
            Projets similaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarCaseStudies.map((study) => (
              <Link
                key={study.id}
                href={`/etudes-de-cas/${study.slug}`}
                className="block transition-transform hover:scale-[1.02] rounded-lg"
              >
                <Card className="h-full overflow-hidden">
                  <div className="flex items-center justify-center aspect-video overflow-hidden">
                    <img
                      src={study.gallery[0]?.url || "/placeholder.svg"}
                      alt={study.title}
                      className="w-full h-full object-cover object-top transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        variant="outline"
                        className="bg-lightblue/10 text-regularblue font-medium"
                      >
                        {study.clientType}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {study.date.month && monthNames[study.date.month - 1]}{" "}
                        {study.date.year}
                      </div>
                    </div>
                    <h3 className="text-xl  text-regularblue mb-2">
                      {study.title}
                    </h3>
                    <p className="text-regularblue/80 mb-4 line-clamp-3">
                      {study.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
