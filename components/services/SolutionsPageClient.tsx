"use client";

import ServicesOffers from "@/components/services/ServicesOffers";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import ServicesGuide from "@/components/services/ServicesGuide";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import PageLayout from "@/components/page-layout";
import { Monitor, TrendingUp, Smartphone } from "lucide-react";
import type { Locale } from "@/i18n/routing";

type Offer = {
  name: string;
  tech: string;
  target: string;
  concept: string;
  icon: string;
  color: string;
  features: string[];
  recommended: boolean;
};

type FAQ = {
  question: string;
  answer: string;
};

interface SolutionsPageClientProps {
  locale: Locale;
  offers: Offer[];
  faqs: FAQ[];
}

export default function SolutionsPageClient({ locale, offers, faqs }: SolutionsPageClientProps) {
  const isEn = locale === "en";

  const needsGuide = isEn
    ? [
        {
          need: "I want to update my menus and design on my own",
          solution: "Classic WordPress",
          icon: Monitor,
        },
        {
          need: "My current site is too slow and dated",
          solution: "Headless + Next.js",
          icon: TrendingUp,
        },
        {
          need: "I want a client portal with online services",
          solution: "Next.js + Headless",
          icon: Smartphone,
        },
      ]
    : [
        {
          need: "Je veux changer mes menus et mon design seul",
          solution: "WordPress Classique",
          icon: Monitor,
        },
        {
          need: "Mon site actuel est trop lent et daté",
          solution: "Headless + Next.js",
          icon: TrendingUp,
        },
        {
          need: "Je veux un portail client avec des services en ligne",
          solution: "Next.js + Headless",
          icon: Smartphone,
        },
      ];

  return (
    <main>
      <PageLayout
        titre={isEn ? "Our Headless WordPress services" : "Nos Services WordPress Headless"}
        sousTitre={
          isEn
            ? "Pick the solution that fits your needs and your budget."
            : "Choisissez la solution adaptée à vos besoins et à votre budget."
        }
      >
        <div className="mt-8 mb-6 space-y-24">
          <ServicesOffers offers={offers} />
          <ServicesComparisonTable />
          <ServicesGuide needsGuide={needsGuide} />
          <Process />
          <ServicesFAQ faqs={faqs} />
        </div>
      </PageLayout>
    </main>
  );
}
