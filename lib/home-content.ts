import type { Locale } from "@/i18n/routing";

// Contenu GEO de la home (Lot 1 du chantier Score GEO) : bloc « En bref » (TL;DR,
// format de citation idéal pour les LLMs) + FAQ (questions conversationnelles →
// FAQPage schema + titres en question). Convention du repo : module TS FR + EN +
// accesseur. Consommé à la fois par le rendu visible (home-tldr / home-faq) et par
// le JSON-LD (FAQJsonLd dans page.tsx) → une seule source de vérité.

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeContent {
  tldr: { label: string; lines: string[] };
  faq: { kicker: string; title: string; items: HomeFaqItem[] };
}

const FR: HomeContent = {
  tldr: {
    label: "En bref",
    lines: [
      "Next Impact, c'est Agathe, développeuse WordPress Headless & Next.js, en solo et 100 % à distance.",
      "Je modernise les sites WordPress vieillissants, design soigné, navigation fluide, chargement sous la seconde, sans tout reconstruire.",
      "Trois voies selon votre projet : WordPress optimisé, Headless + Next.js, ou application métier sur-mesure. Budget et délai fixés dès le départ.",
      "+25 projets livrés depuis 2020 ; sur la refonte Proditec (2024), le PageSpeed mobile est passé de 45 à 98.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Les questions qu'on me pose le plus",
    items: [
      {
        question: "Combien coûte un site avec Next Impact ?",
        answer:
          "Trois forfaits : à partir de 2 250 € pour un WordPress optimisé, autour de 4 000 € pour du Headless WordPress + Next.js, et sur devis pour une application métier. Le budget et le délai sont fixés dès le départ.",
      },
      {
        question: "Faut-il refaire tout mon site WordPress ?",
        answer:
          "Non. Je garde l'interface WordPress que vous connaissez pour gérer vos contenus et je modernise le reste — le front, la performance, le design. Vos contenus existants sont conservés.",
      },
      {
        question: "C'est quoi le Headless, en clair ?",
        answer:
          "Votre WordPress reste le back-office où vous publiez ; un front Next.js l'affiche à part. Résultat : un site beaucoup plus rapide, plus sûr et mieux référencé, sans changer votre façon de travailler.",
      },
      {
        question: "Le Headless est-il toujours nécessaire ?",
        answer:
          "Non, et je préfère le dire franchement : pour un petit site vitrine, un WordPress optimisé suffit souvent. Le Headless devient vraiment utile quand la performance, le SEO éditorial ou la volumétrie le justifient — je vous oriente vers la voie la plus rentable, pas la plus sophistiquée.",
      },
      {
        question: "En combien de temps mon site est-il livré ?",
        answer:
          "Comptez 2 à 4 semaines pour un WordPress optimisé, et 6 à 10 semaines pour une architecture Headless + Next.js ou une web app sur-mesure, selon la complexité.",
      },
      {
        question: "Pourrai-je gérer mon site moi-même ?",
        answer:
          "Oui. Vous continuez à publier dans WordPress comme avant, sans compétence technique. Une formation et une documentation sur-mesure sont incluses.",
      },
      {
        question: "Travaillez-vous à distance ?",
        answer:
          "Oui, 100 % à distance, partout en France et au-delà. Les échanges se font en visio, et vous gardez un interlocuteur unique du devis à la livraison.",
      },
    ],
  },
};

const EN: HomeContent = {
  tldr: {
    label: "In short",
    lines: [
      "Next Impact is me: Agathe, a WordPress Headless & Next.js developer, solo and fully remote.",
      "I modernize ageing WordPress sites — refined design, smooth navigation, sub-second loading — without rebuilding everything.",
      "Three paths depending on your project: optimized WordPress, Headless + Next.js, or a custom business app. Fixed budget and timeline from the start.",
      "+25 projects delivered since 2020; on the Proditec rebuild (2024), mobile PageSpeed went from 45 to 98.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "The questions I'm asked most",
    items: [
      {
        question: "How much does a site with Next Impact cost?",
        answer:
          "Three packages: from €2,250 for an optimized WordPress, around €4,000 for Headless WordPress + Next.js, and on quote for a business application. Budget and timeline are fixed from the start.",
      },
      {
        question: "Do I have to rebuild my whole WordPress site?",
        answer:
          "No. I keep the WordPress interface you already know to manage your content and modernize the rest — the front-end, performance, design. Your existing content is preserved.",
      },
      {
        question: "What is Headless, in plain terms?",
        answer:
          "Your WordPress stays the back-office where you publish; a Next.js front-end displays it separately. The result: a much faster, safer, better-ranked site, without changing how you work.",
      },
      {
        question: "Is Headless always necessary?",
        answer:
          "No, and I'd rather be upfront: for a small showcase site, an optimized WordPress is often enough. Headless becomes genuinely useful when performance, editorial SEO or scale justify it — I point you to the most cost-effective path, not the most sophisticated one.",
      },
      {
        question: "How long until my site is delivered?",
        answer:
          "Around 2 to 4 weeks for an optimized WordPress, and 6 to 10 weeks for a Headless + Next.js architecture or a custom web app, depending on complexity.",
      },
      {
        question: "Will I be able to manage the site myself?",
        answer:
          "Yes. You keep publishing in WordPress as before, with no technical skills. Tailored training and documentation are included.",
      },
      {
        question: "Do you work remotely?",
        answer:
          "Yes, fully remote, across France and beyond. We work over video calls, and you keep a single point of contact from quote to delivery.",
      },
    ],
  },
};

export function getHomeContent(locale: Locale): HomeContent {
  return locale === "en" ? EN : FR;
}
