import type { ProfileId } from "@/lib/documentation-profiles";
import type { Locale } from "@/i18n/routing";

/**
 * Variantes de contenu par profil pour les études de cas headless.
 * Seules les études de cas headless ont des variantes par profil.
 * Les champs non surchargés restent inchangés (affichage des valeurs par défaut).
 */

export interface CaseStudyProfileOverride {
  description: string;
  detailedDescription: string;
  objectives: string[];
  results: string[];
}

type ProfileOverrides = Record<ProfileId, CaseStudyProfileOverride>;

/**
 * Map slug → { decideur, utilisateur, developpeur }
 */
export const CASE_STUDY_PROFILE_OVERRIDES: Record<string, ProfileOverrides> = {
  // ──────────────────────────────────────────────────────────────────────────
  // Comme des fous — Jeux en ligne
  // ──────────────────────────────────────────────────────────────────────────
  "comme-des-fous-jeux": {
    decideur: {
      description:
        "Une section de jeux en ligne pour augmenter l'engagement et le temps passé sur le média Comme des fous.",
      detailedDescription:
        "Comme des fous, un média participatif, souhaitait créer une section de jeux en ligne pour fidéliser ses lecteurs et augmenter le temps passé sur le site. L'enjeu stratégique : transformer des lecteurs occasionnels en visiteurs récurrents grâce à une expérience ludique.\n\nLe choix d'une architecture WordPress Headless avec Next.js a permis de garantir des temps de chargement instantanés pour les jeux — un facteur clé de rétention. Les lecteurs accèdent aux jeux sans friction, directement depuis les articles du média.\n\nLe résultat : un engagement accru des lecteurs, un temps moyen de visite en hausse, et une expérience qui différencie Comme des fous de ses concurrents dans le paysage médiatique participatif.",
      objectives: [
        "Augmenter le temps moyen passé sur le site par les lecteurs",
        "Créer un canal d'engagement récurrent pour fidéliser l'audience",
        "Garantir des performances optimales pour une expérience sans friction",
      ],
      results: [
        "Section de jeux intégrée avec succès au média existant",
        "Engagement accru : temps de visite en hausse significative",
        "Expérience utilisateur fluide qui renforce l'image de marque",
      ],
    },
    utilisateur: {
      description:
        "Des jeux en ligne publiés et gérés directement depuis WordPress, sans intervention technique.",
      detailedDescription:
        "L'équipe éditoriale de Comme des fous souhaitait pouvoir proposer des jeux interactifs à ses lecteurs, sans dépendre d'un développeur pour chaque publication. L'objectif : gérer les jeux aussi simplement que les articles du média.\n\nGrâce à l'architecture WordPress Headless, les jeux sont configurés directement dans l'interface WordPress que l'équipe connaît déjà. La publication d'un nouveau jeu suit le même workflow que la publication d'un article : créer, prévisualiser, publier.\n\nL'équipe éditoriale est autonome pour gérer les jeux existants et en proposer de nouveaux, sans aucune compétence technique requise.",
      objectives: [
        "Publier et gérer les jeux depuis WordPress sans compétence technique",
        "Conserver le workflow éditorial habituel (créer, prévisualiser, publier)",
        "Permettre à l'équipe d'être autonome sur la gestion des jeux",
      ],
      results: [
        "Gestion des jeux intégrée à l'interface WordPress existante",
        "Publication autonome par l'équipe éditoriale",
        "Aucune formation supplémentaire nécessaire",
      ],
    },
    developpeur: {
      description:
        "Intégration de jeux interactifs en Next.js sur une architecture WordPress Headless avec API REST.",
      detailedDescription:
        "Ce projet technique consistait à développer une section de jeux interactifs intégrée au site WordPress Headless existant de Comme des fous. L'architecture repose sur Next.js pour le rendu côté client des jeux, avec WordPress comme CMS pour la configuration des contenus ludiques.\n\nLes jeux sont des composants React autonomes, rendus côté client pour l'interactivité, tandis que la configuration (règles, contenus, médias) est gérée via des Custom Post Types WordPress exposés par l'API REST. Le SSG est utilisé pour les pages de listing, avec un hydratation côté client pour la logique de jeu.\n\nStack : Next.js App Router, WordPress REST API, Custom Post Types, Tailwind CSS, déploiement Vercel avec ISR pour les pages de listing.",
      objectives: [
        "Développer des composants React interactifs pour les jeux en ligne",
        "Exploiter l'API REST WordPress pour le contenu dynamique des jeux",
        "Implémenter SSG + hydratation client pour performance et interactivité",
      ],
      results: [
        "Architecture modulaire : composants de jeux réutilisables",
        "API REST WordPress pour la gestion du contenu de jeux",
        "Temps de chargement < 1s grâce au SSG et à l'optimisation Vercel",
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Comme des fous — Media WordPress Headless
  // ──────────────────────────────────────────────────────────────────────────
  "comme-des-fous": {
    decideur: {
      description:
        "Migration headless d'un média participatif : score PageSpeed de 56 à 98, avec zéro disruption éditoriale.",
      detailedDescription:
        "Comme des fous, un média participatif en croissance, avait besoin de moderniser son site pour améliorer ses performances et sa visibilité. Avec un score PageSpeed de 56, le site perdait des lecteurs à cause de temps de chargement trop longs — un facteur direct de perte de trafic SEO.\n\nLa migration vers une architecture WordPress Headless avec Next.js a permis de multiplier les performances par presque 2 (score PageSpeed : 98) sans aucune interruption du flux éditorial. Les rédacteurs n'ont pas eu à changer leurs habitudes.\n\nLe résultat : un média plus rapide, mieux référencé, avec une expérience lecteur nettement améliorée. L'investissement s'est traduit par une augmentation mesurable du trafic organique et du temps passé sur le site.",
      objectives: [
        "Améliorer les performances pour gagner en visibilité SEO",
        "Garantir zéro disruption pour l'équipe éditoriale",
        "Conserver l'intégralité du contenu existant sans perte",
      ],
      results: [
        "Score PageSpeed : de 56 à 98 (+74%)",
        "Interface d'administration inchangée pour les rédacteurs",
        "Migration complète sans perte de contenu ni interruption de service",
        "Gains SEO mesurables dès les premières semaines",
      ],
    },
    utilisateur: {
      description:
        "Un site plus rapide pour les lecteurs, avec exactement la même interface WordPress pour les rédacteurs.",
      detailedDescription:
        "L'équipe de rédaction de Comme des fous publie quotidiennement des articles, gère des médias et organise des catégories. Lors de la modernisation du site, l'enjeu majeur était de ne rien changer à leurs habitudes.\n\nLa migration vers le WordPress Headless a été transparente pour les rédacteurs : ils ont retrouvé exactement la même interface WordPress qu'avant — même éditeur, mêmes menus, même workflow de publication. La seule différence visible : le site est désormais beaucoup plus rapide pour les lecteurs.\n\nTout le contenu existant (articles, images, catégories) a été conservé automatiquement. Aucune ressaisie, aucune formation complémentaire n'a été nécessaire.",
      objectives: [
        "Conserver l'interface WordPress identique pour les rédacteurs",
        "Ne perdre aucun contenu existant (articles, images, médias)",
        "Offrir un site plus rapide et agréable pour les lecteurs",
      ],
      results: [
        "Interface d'administration 100% identique à l'ancienne",
        "Tout le contenu existant migré automatiquement",
        "Site nettement plus rapide et agréable pour les visiteurs",
        "Aucune formation nécessaire pour l'équipe éditoriale",
      ],
    },
    developpeur: {
      description:
        "Migration WordPress → WordPress Headless + Next.js. SSG/ISR, API REST, optimisation images via next/image.",
      detailedDescription:
        "Ce projet de migration consistait à découpler le frontend WordPress existant pour le remplacer par une application Next.js, tout en conservant WordPress comme CMS backend.\n\nL'architecture mise en place utilise l'API REST de WordPress pour le data fetching, avec une stratégie SSG (Static Site Generation) pour les articles et les pages, combinée à ISR (Incremental Static Regeneration) pour la fraîcheur du contenu. Les images sont optimisées automatiquement via le composant next/image avec un loader personnalisé pointant vers WordPress.\n\nLa migration a été réalisée sans modification de la base de données WordPress : tous les contenus, taxonomies et médias ont été récupérés via l'API. Le déploiement est assuré par Vercel avec preview deployments sur chaque branche.",
      objectives: [
        "Découpler le frontend WordPress vers Next.js App Router",
        "Implémenter SSG + ISR pour performance et fraîcheur du contenu",
        "Migrer sans perte de données via l'API REST WordPress",
      ],
      results: [
        "Score PageSpeed de 56 à 98 grâce au SSG et à l'optimisation next/image",
        "ISR configuré pour revalidation automatique du contenu",
        "Zéro modification de la base WordPress — migration non destructive",
        "Pipeline CI/CD Vercel avec preview deployments",
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Next Event — Démo WordPress Headless
  // ──────────────────────────────────────────────────────────────────────────
  "next-event": {
    decideur: {
      description:
        "Démonstration d'une billetterie événementielle headless : présentation professionnelle, gestion des inscriptions et conversion optimisée.",
      detailedDescription:
        "Next Event est un site de démonstration qui illustre comment une architecture WordPress Headless peut transformer une billetterie événementielle. L'objectif : montrer qu'un site événementiel peut être à la fois rapide, professionnel et facile à administrer.\n\nGrâce au découplage frontend/backend, le site offre des temps de chargement quasi-instantanés — un facteur décisif pour la conversion des visiteurs en inscrits. La navigation est fluide, les événements sont mis en valeur et le parcours d'inscription est optimisé.\n\nCe projet démontre le potentiel du Headless pour les organisations événementielles : un site professionnel qui convertit mieux, tout en gardant la simplicité de gestion de WordPress.",
      objectives: [
        "Présenter les événements de manière professionnelle et convaincante",
        "Optimiser le parcours d'inscription pour maximiser les conversions",
        "Démontrer les gains de performance du Headless pour l'événementiel",
      ],
      results: [
        "Système d'agenda et de gestion des événements fonctionnel",
        "Billetterie intégrée avec parcours de conversion optimisé",
        "Navigation rapide et responsive — Lighthouse 90+",
      ],
    },
    utilisateur: {
      description:
        "Un site événementiel où les organisateurs gèrent leurs événements et billets directement depuis WordPress.",
      detailedDescription:
        "Next Event montre comment un organisateur d'événements peut gérer l'intégralité de sa communication en ligne depuis WordPress, sans aucune compétence technique.\n\nL'interface d'administration permet de créer un événement, définir la date, le lieu, ajouter des photos et configurer les billets — le tout depuis le tableau de bord WordPress habituel. Le site public se met à jour automatiquement.\n\nLe calendrier des événements, les fiches détaillées et la billetterie fonctionnent ensemble de façon fluide, offrant aux organisateurs un outil simple et aux visiteurs une expérience de navigation optimale.",
      objectives: [
        "Permettre la création d'événements depuis WordPress sans code",
        "Offrir une gestion intuitive des billets et des inscriptions",
        "Fournir un calendrier visuel des événements facile à mettre à jour",
      ],
      results: [
        "Création et gestion d'événements en quelques clics",
        "Billetterie intégrée et administrable depuis WordPress",
        "Calendrier visuel mis à jour automatiquement",
      ],
    },
    developpeur: {
      description:
        "Architecture événementielle : WordPress Custom Post Types + Next.js SSG, API REST pour agenda et billetterie.",
      detailedDescription:
        "Next Event est un projet de démonstration d'architecture WordPress Headless appliqué à l'événementiel. L'implémentation repose sur des Custom Post Types WordPress (événements, billets) exposés via l'API REST, consommés par un frontend Next.js.\n\nLes pages d'événements sont générées statiquement (SSG) avec `generateStaticParams`, tandis que les données de disponibilité des billets utilisent des routes API Next.js pour des requêtes en temps réel vers WordPress. Le composant calendrier est rendu côté client avec hydratation.\n\nStack technique : Next.js App Router, WordPress REST API (endpoints custom), Custom Post Types + ACF Pro, Tailwind CSS, déploiement Vercel. Le site utilise ISR avec revalidation à 60 secondes pour les pages d'événements.",
      objectives: [
        "Créer des Custom Post Types WordPress pour événements et billets",
        "Implémenter SSG + ISR pour les pages d'événements",
        "Développer une API de disponibilité en temps réel via Route Handlers",
      ],
      results: [
        "Architecture CPT → API REST → Next.js SSG fonctionnelle",
        "Route Handlers pour la disponibilité des billets en temps réel",
        "ISR avec revalidation configurable pour la fraîcheur du contenu",
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Les Etats Généraux Communaux
  // ──────────────────────────────────────────────────────────────────────────
  "les-etats-generaux-communaux": {
    decideur: {
      description:
        "Site vitrine livré en temps record pour un événement citoyen, avec constitution en ligne des groupes locaux.",
      detailedDescription:
        "Les Etats Généraux Communaux avaient une contrainte forte : le site devait être en ligne avant la date de l'événement pour maximiser la mobilisation citoyenne. Chaque jour de retard représentait des groupes locaux non constitués.\n\nLe choix du WordPress Headless avec Next.js a permis un développement rapide (4 semaines) tout en garantissant des performances optimales sur tous les supports. Le site met en avant les ressources téléchargeables, le calendrier des événements et une carte interactive des groupes locaux.\n\nRésultat : livraison dans les délais, augmentation mesurable du nombre de groupes locaux constitués, et un site qui sert de vitrine professionnelle pour l'initiative citoyenne.",
      objectives: [
        "Livrer le site avant la date de l'événement (deadline absolue)",
        "Maximiser la constitution des groupes locaux en ligne",
        "Offrir une vitrine professionnelle pour l'initiative citoyenne",
      ],
      results: [
        "Mise en ligne dans les délais — avant l'événement",
        "Augmentation du nombre de groupes locaux constitués",
        "Carte interactive facilitant l'engagement local",
      ],
    },
    utilisateur: {
      description:
        "Un site vitrine simple à mettre à jour : ressources, événements et carte des groupes gérés depuis WordPress.",
      detailedDescription:
        "Le site des Etats Généraux Communaux permet à l'équipe organisatrice de gérer facilement les contenus depuis WordPress : ajouter des ressources téléchargeables, mettre à jour le calendrier des événements et suivre les groupes locaux.\n\nL'interface d'administration WordPress est organisée pour que chaque type de contenu ait son espace dédié. Les ressources se publient en quelques clics, les événements se créent avec date et lieu, et la carte des groupes se met à jour automatiquement.\n\nL'équipe n'a besoin d'aucune compétence technique pour maintenir le site à jour et communiquer efficacement sur l'initiative.",
      objectives: [
        "Gérer les ressources téléchargeables depuis WordPress",
        "Mettre à jour le calendrier des événements simplement",
        "Suivre et afficher les groupes locaux sur la carte interactive",
      ],
      results: [
        "Administration autonome par l'équipe organisatrice",
        "Ressources et événements publiés en quelques clics",
        "Carte interactive mise à jour sans intervention technique",
      ],
    },
    developpeur: {
      description:
        "Next.js SSG + WordPress Headless : carte interactive Leaflet, calendrier d'événements, déploiement Vercel.",
      detailedDescription:
        "Ce projet combine Next.js en SSG avec WordPress Headless pour créer un site citoyen performant. L'architecture exploite les Custom Post Types WordPress pour les ressources, événements et groupes locaux, exposés via l'API REST.\n\nLa carte interactive des groupes locaux est implémentée avec un composant Leaflet rendu côté client (dynamic import avec `next/dynamic` et `ssr: false`). Les données géographiques sont stockées dans WordPress via ACF Pro et récupérées à la build via l'API REST.\n\nLe site est entièrement généré statiquement (SSG) pour des performances maximales, avec ISR pour la fraîcheur du contenu. Déploiement sur Vercel avec preview deployments pour chaque modification.",
      objectives: [
        "Implémenter une carte interactive Leaflet avec données WordPress",
        "Utiliser SSG + ISR pour un site statique mais toujours à jour",
        "Structurer les CPT WordPress pour ressources, événements et groupes",
      ],
      results: [
        "Carte Leaflet avec dynamic import — pas de SSR pour le composant map",
        "SSG complet + ISR avec revalidation configurable",
        "Architecture CPT WordPress propre et extensible",
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Les Doléances
  // ──────────────────────────────────────────────────────────────────────────
  doleances: {
    decideur: {
      description:
        "Site vitrine inspiré de Wikipédia pour une association citoyenne, avec cartographie interactive et agenda événementiel.",
      detailedDescription:
        "L'association Les Doléances, nouvellement créée, avait besoin d'une vitrine numérique pour donner de la visibilité à son initiative citoyenne. Le positionnement était clair : évoquer l'esprit communautaire et la liberté d'accès à l'information, à l'image de Wikipédia.\n\nLe choix du WordPress Headless avec Next.js a permis de créer un site professionnel et rapide en seulement 2 mois, avec une cartographie interactive des groupes locaux et une section agenda. Le design sobre et reconnaissable renforce l'identité de l'association.\n\nLe site sert de plateforme centrale pour la communication de l'association : sensibiliser le public, recruter de nouveaux membres et coordonner les actions locales.",
      objectives: [
        "Donner une visibilité professionnelle à l'initiative citoyenne",
        "Faciliter la constitution et le suivi des groupes locaux",
        "Créer une plateforme de communication efficace pour l'association",
      ],
      results: [
        "Site livré en 2 mois avec cartographie interactive",
        "Section agenda pour les événements de l'association",
        "Administration simplifiée via WordPress Headless",
      ],
    },
    utilisateur: {
      description:
        "Un site inspiré de Wikipédia où l'équipe publie articles et actualités depuis WordPress, sans compétence technique.",
      detailedDescription:
        "Le site des Doléances a été conçu pour que l'équipe associative puisse publier du contenu de manière autonome. L'interface WordPress permet de créer et organiser les articles par catégories, d'ajouter des images et de gérer les événements — exactement comme Wikipédia permet à ses contributeurs de publier du contenu.\n\nLe workflow est simple : rédiger dans l'éditeur WordPress, prévisualiser le rendu, puis publier. Les articles sont automatiquement classés par catégorie et affichés sur le site. La carte des groupes locaux se met à jour lorsque de nouvelles fiches sont créées.\n\nL'équipe est entièrement autonome pour maintenir le site vivant et à jour, sans aucune intervention technique.",
      objectives: [
        "Publier et catégoriser les articles depuis WordPress",
        "Gérer les événements et l'agenda de l'association",
        "Mettre à jour la carte des groupes locaux simplement",
      ],
      results: [
        "Publication d'articles autonome par l'équipe associative",
        "Organisation par catégories claire et intuitive",
        "Interface familière inspirée de Wikipédia",
      ],
    },
    developpeur: {
      description:
        "Architecture Wikipédia-like : WordPress Headless + Next.js, cartographie Leaflet, taxonomies WordPress avancées.",
      detailedDescription:
        "Ce projet s'inspire de l'architecture de Wikipédia pour créer un site citoyen ouvert et structuré. Le backend WordPress utilise des taxonomies personnalisées (catégories thématiques, zones géographiques) et des Custom Post Types pour les articles, groupes locaux et événements.\n\nLe frontend Next.js implémente un système de navigation par catégories avec SSG pour chaque page d'article et de catégorie. La cartographie des groupes locaux utilise Leaflet avec un composant dynamique (next/dynamic, ssr: false). Les données géo sont stockées via ACF Pro.\n\nL'architecture est conçue pour l'extensibilité : l'ajout de nouvelles catégories ou types de contenu dans WordPress se reflète automatiquement dans le frontend grâce au data fetching dynamique via l'API REST.",
      objectives: [
        "Modéliser les contenus avec CPT et taxonomies WordPress avancées",
        "Implémenter la navigation par catégories en SSG",
        "Intégrer une cartographie Leaflet avec données WordPress/ACF",
      ],
      results: [
        "Architecture CPT + taxonomies extensible et propre",
        "SSG pour toutes les pages d'articles et de catégories",
        "Composant carte Leaflet avec dynamic import Next.js",
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Panorama Pub — Annuaire des fournisseurs d'objets publicitaires
  // ──────────────────────────────────────────────────────────────────────────
  "panorama-pub": {
    decideur: {
      description:
        "Lancement du premier annuaire en ligne des fournisseurs d'objets publicitaires : un positionnement de pionnier sur un marché B2B encore vacant.",
      detailedDescription:
        "Le marché des objets publicitaires reste l'un des derniers secteurs B2B sans plateforme de référence : aucun annuaire centralisé n'existe aujourd'hui en France. Panorama Pub se positionne pour occuper ce vide et devenir l'incontournable du sourcing d'objets publicitaires.\n\nL'enjeu n'est pas seulement de livrer un site, mais de poser les fondations d'un produit destiné à grandir : un avantage de pionnier sur un marché vacant, une cible B2B claire (agences de communication, services marketing, événementiel), et un modèle économique scalable (visibilité fournisseurs, mise en relation, contenus éditoriaux).\n\nLivrée en 2 mois du concept à la mise en ligne, la plateforme est aujourd'hui prête à conquérir son marché : positionnement de référence, fondation technique solide, et roadmap claire pour transformer l'audience en levier business.",
      objectives: [
        "Occuper un marché vacant et s'imposer comme la référence du secteur",
        "Construire un actif digital scalable, capable de monétiser une audience B2B qualifiée",
        "Sécuriser un time-to-market court pour prendre l'avantage sur d'éventuels suiveurs",
        "Poser une fondation technique qui ne sera pas à refaire dans 2 ans",
      ],
      results: [
        "Plateforme inédite sur son segment, sans équivalent en France",
        "Mise en ligne en 2 mois, du concept à la production",
        "Architecture pensée SEO et croissance, prête à monter en charge",
        "Roadmap claire pour les prochaines briques : espaces fournisseurs, mise en relation, contenus",
      ],
    },
    utilisateur: {
      description:
        "Un annuaire pensé pour faire gagner du temps aux acheteurs et donner de la visibilité aux fournisseurs : recherche, comparaison, fiches claires.",
      detailedDescription:
        "Aujourd'hui, identifier le bon fournisseur d'objets publicitaires est un parcours du combattant : recherches éclatées sur Google, bases incomplètes, fournisseurs difficiles à comparer. Panorama Pub a été pensé comme l'outil qui simplifie ce sourcing — pour les agences, services com', services marketing et événementiel.\n\nL'expérience est volontairement directe : recherche par typologie d'objet, par fournisseur, par critères ; fiches fournisseurs riches et lisibles ; navigation rapide entre les profils. L'acheteur trouve, compare, choisit — sans perdre une demi-journée.\n\nCôté fournisseurs, l'outil offre une visibilité qualifiée auprès d'une audience qui cherche déjà à acheter, avec des fiches valorisantes et un back-office permettant de tenir l'information à jour en autonomie.",
      objectives: [
        "Permettre aux acheteurs de trouver rapidement le bon fournisseur sans recherches multiples",
        "Offrir une comparaison claire entre fournisseurs sur des critères pertinents",
        "Donner aux fournisseurs un espace de visibilité valorisant et facile à maintenir",
        "Garantir une navigation simple et rapide, sans courbe d'apprentissage",
      ],
      results: [
        "Sourcing fournisseurs centralisé en un seul endroit",
        "Recherche, filtrage et comparaison disponibles en quelques clics",
        "Fiches fournisseurs riches et lisibles, mises à jour en autonomie",
        "Aucune formation nécessaire pour les acheteurs comme pour les fournisseurs",
      ],
    },
    developpeur: {
      description:
        "Annuaire B2B full-stack Next.js + PostgreSQL : architecture App Router, recherche performante, base relationnelle prête à monter en charge.",
      detailedDescription:
        "Panorama Pub est une application full-stack développée avec Next.js (App Router) et PostgreSQL. Le projet a été pensé dès le départ pour absorber la croissance du catalogue (potentiellement plusieurs milliers de fiches fournisseurs) et pour offrir un référencement naturel solide — deux contraintes qui ont guidé toutes les décisions techniques.\n\nLe rendu repose sur du SSG/ISR pour les pages publiques (fiches fournisseurs, listings, catégories) afin de garantir des temps de chargement instantanés et un crawl SEO optimal. La base PostgreSQL modélise fournisseurs, catégories, typologies d'objets et critères de filtrage avec une schéma normalisé. Les Server Actions Next.js sont utilisées pour les opérations admin (back-office d'enrichissement du catalogue), avec une stricte séparation lecture publique / écriture authentifiée.\n\nStack : Next.js App Router, TypeScript, PostgreSQL, Tailwind CSS, déploiement Vercel. Architecture pensée pour évoluer vers des espaces fournisseurs authentifiés, un système de mise en relation et un module éditorial sans réécriture du socle.",
      objectives: [
        "Concevoir une architecture full-stack Next.js + PostgreSQL prête à scaler",
        "Optimiser SEO et perfs avec SSG/ISR sur toutes les pages publiques",
        "Modéliser proprement les entités métier (fournisseurs, catégories, critères) en relationnel",
        "Préparer le socle aux extensions futures (auth fournisseurs, mise en relation, contenus)",
      ],
      results: [
        "Architecture App Router + PostgreSQL claire et maintenable",
        "SSG/ISR sur les pages publiques pour des temps de chargement instantanés",
        "Schéma relationnel normalisé, extensible sans dette technique",
        "Back-office Server Actions sécurisé pour l'enrichissement du catalogue",
      ],
    },
  },
};

export function getCaseStudyProfileOverrides(
  _locale: Locale,
): Record<string, ProfileOverrides> {
  return {};
}
