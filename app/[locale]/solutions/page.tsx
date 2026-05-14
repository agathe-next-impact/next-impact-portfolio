import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ServiceJsonLd, FAQJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";
import SolutionsPageClient from "@/components/services/SolutionsPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solutionsPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/solutions",
    keywords:
      locale === "en"
        ? [
            "website solutions",
            "Headless WordPress",
            "Next.js",
            "custom web app",
            "mobile PWA",
            "web development",
          ]
        : [
            "solutions site web",
            "WordPress Headless",
            "Next.js",
            "web app sur-mesure",
            "PWA mobile",
            "développement web",
          ],
    locale,
  });
}

const SOLUTIONS_OFFERS_FR = [
  {
    name: "ESSENTIEL",
    tech: "WordPress Standard",
    target: "Pour les TPE/PME et créateurs",
    concept: "Un site robuste avec une autonomie totale.",
    icon: "/icons/wordpress-icon.svg",
    color: "oklch(87.9% 0.169 91.605)",
    features: ["Budget maîtrisé", "Mise en ligne rapide", "Évolutif via plugins", "Formation incluse"],
    recommended: false,
  },
  {
    name: "PREMIUM",
    tech: "WordPress Headless + Next.js",
    target: "Enjeux d'image, de SEO et de performance",
    concept: "La puissance des technologies modernes.",
    icon: "/icons/speed-icon.svg",
    color: "#F2E57E",
    features: [
      "Flexibilité totale du design",
      "Score PageSpeed maximum",
      "Sécurité renforcée par découplage",
      "SEO optimisé nativement",
    ],
    recommended: true,
  },
  {
    name: "ULTIMATE",
    tech: "Application sur-mesure (Next.js + PostgreSQL)",
    target: "Pour une logique métier ou une application mobile",
    concept: "L'expérience utilisateur fluide d'une application.",
    icon: "/icons/saas-features-icon.svg",
    color: "oklch(87.9% 0.169 91.605)",
    features: [
      "Interactions dynamiques",
      "Comptes utilisateurs et données métier",
      "Admin autonome conçu sur-mesure",
      "Web app ou app mobile (PWA)",
    ],
    recommended: false,
  },
];

const SOLUTIONS_OFFERS_EN = [
  {
    name: "ESSENTIAL",
    tech: "Standard WordPress",
    target: "For SMEs and creators",
    concept: "A solid site with full autonomy.",
    icon: "/icons/wordpress-icon.svg",
    color: "oklch(87.9% 0.169 91.605)",
    features: ["Controlled budget", "Quick to ship", "Plugin-extensible", "Training included"],
    recommended: false,
  },
  {
    name: "PREMIUM",
    tech: "Headless WordPress + Next.js",
    target: "Brand image, SEO and performance focus",
    concept: "The power of modern technologies.",
    icon: "/icons/speed-icon.svg",
    color: "#F2E57E",
    features: [
      "Full design flexibility",
      "Maximum PageSpeed score",
      "Security strengthened by decoupling",
      "Native SEO optimization",
    ],
    recommended: true,
  },
  {
    name: "ULTIMATE",
    tech: "Custom application (Next.js + PostgreSQL)",
    target: "For business logic or a mobile application",
    concept: "The smooth user experience of an application.",
    icon: "/icons/saas-features-icon.svg",
    color: "oklch(87.9% 0.169 91.605)",
    features: [
      "Dynamic interactions",
      "User accounts and business data",
      "Custom autonomous admin",
      "Web app or mobile app (PWA)",
    ],
    recommended: false,
  },
];

const SOLUTIONS_FAQS_FR = [
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
      "Comptez 2-4 semaines pour un site WordPress classique, 4-6 semaines pour une architecture Headless WordPress + Next.js standard, et 6-10 semaines pour une plateforme Headless complexe ou une application sur-mesure, selon la complexité du projet.",
  },
  {
    question: "Mes plugins WordPress fonctionneront-ils encore ?",
    answer:
      "Les plugins front-end (sliders, formulaires affichés) sont remplacés par des équivalents plus performants. Les plugins back-end (SEO, analytics, sécurité) continuent de fonctionner normalement.",
  },
];

const SOLUTIONS_FAQS_EN = [
  {
    question: "Will I still be able to edit my texts?",
    answer:
      "Yes, for all 3 solutions. You keep the WordPress interface you know to manage all your content, images and pages. No technical skills required.",
  },
  {
    question: "Is Headless more expensive to maintain?",
    answer:
      "Slightly, because there are two systems to maintain (WordPress + front-end). However, stronger security and higher performance often reduce emergency intervention and traffic-loss costs.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Plan for 2-4 weeks for a standard WordPress site, 4-6 weeks for a standard Headless WordPress + Next.js architecture, and 6-10 weeks for a complex Headless platform or a custom application, depending on project complexity.",
  },
  {
    question: "Will my WordPress plugins still work?",
    answer:
      "Front-end plugins (sliders, displayed forms) are replaced by faster equivalents. Back-end plugins (SEO, analytics, security) keep working normally.",
  },
];

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solutionsPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbSolutions"), url: "/solutions" },
  ];

  const offers = locale === "en" ? SOLUTIONS_OFFERS_EN : SOLUTIONS_OFFERS_FR;
  const faqs = locale === "en" ? SOLUTIONS_FAQS_EN : SOLUTIONS_FAQS_FR;

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name={
          locale === "en"
            ? "Custom website and application solutions"
            : "Solutions sites web et applications sur-mesure"
        }
        description={
          locale === "en"
            ? "Solutions tailored to every project: standard WordPress, Headless WordPress + Next.js for performance, or custom Next.js + PostgreSQL applications for advanced web or mobile apps."
            : "Solutions adaptées à tous vos projets : WordPress classique, Headless WordPress + Next.js pour la performance, ou application sur-mesure Next.js + PostgreSQL pour les web apps et applications mobiles avancées."
        }
        serviceType={locale === "en" ? "Web development" : "Développement Web"}
        url="/solutions"
      />
      <FAQJsonLd questions={faqs} />
      <SolutionsPageClient locale={locale} offers={offers} faqs={faqs} />
    </>
  );
}
                                     