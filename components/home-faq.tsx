"use client";

// Section FAQ de la home — accordéon natif <details> (100 % SSR, accessible, sans
// JS), indispensable pour que le FAQPage schema (page.tsx) reflète un contenu
// VISIBLE (politique Google). Questions conversationnelles → citabilité LLM +
// titres en question. Même source que le JSON-LD : lib/home-content.

import { useLocale } from "next-intl";
import { Plus } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getHomeContent } from "@/lib/home-content";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";

export default function HomeFaq() {
  const locale = useLocale() as Locale;
  const { faq } = getHomeContent(locale);

  return (
    <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-24">
      <SectionHeading kicker={faq.kicker} title={faq.title} />
      <div className="mt-10 border-t border-dark-gray">
        {faq.items.map((f) => (
          <details key={f.question} className="group border-b border-dark-gray">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
              <span className="font-inter-tight text-[15px] font-regular text-foreground md:text-base">
                {f.question}
              </span>
              <Plus
                size={16}
                className="shrink-0 text-mid-gray transition-transform group-open:rotate-45"
              />
            </summary>
            <p className="max-w-3xl pb-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </BlueprintSection>
  );
}
