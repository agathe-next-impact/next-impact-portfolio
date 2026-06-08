"use client";

import FaqSchema from "./FaqSchema";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export default function ServicesFAQ({ faqs }: { faqs: { question: string; answer: React.ReactNode }[] }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  return (
    <FaqSchema
      faqs={faqs}
      title={isEn ? "Frequently asked questions" : "Questions fréquentes"}
      description={
        isEn
          ? "Some answers to the most common questions about our solutions."
          : "Quelques réponses aux questions les plus courantes sur les solutions."
      }
      sectionId="solutions-faq"
      index="№ 06"
    />
  );
}
