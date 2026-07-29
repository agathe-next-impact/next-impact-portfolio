"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqSchemaProps {
  faqs: FaqItem[];
  title?: string;
  description?: string;
  sectionId?: string;
  /** Index № affiché dans l'en-tête de section. */
  index?: string;
}

const FaqSchema: React.FC<FaqSchemaProps> = ({
  faqs,
  title = "Questions fréquentes",
  description = "Vous avez des questions ? Voici les réponses aux questions les plus fréquentes que je reçois.",
  sectionId = "faq",
  index = "№ —",
}) => {
  const [open, setOpen] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : "",
      },
    })),
  };

  return (
    <BlueprintSection id={sectionId} tone="obsidian">
      {/* En-tête */}
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading index={index} title={title} description={description} />
      </div>

      {/* Accordéon */}
      <Stagger>
        {faqs.map((faq, idx) => {
          const isOpen = open === idx;
          return (
            <StaggerItem
              key={idx}
              className={cn(
                "border-b border-dark-gray transition-colors last:border-b-0",
                isOpen && "bg-jet",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="grid w-full grid-cols-[40px_1fr_24px] items-baseline gap-5 px-6 py-6 text-left lg:px-8"
              >
                <span className="font-mono text-[11px] tracking-[0.08em] text-accent-secondary">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="font-light tracking-tight text-foreground text-base md:text-lg">
                  {faq.question}
                </h3>
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className={cn(
                    "justify-self-center text-mid-gray transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pl-[60px] font-inter-tight text-sm leading-relaxed text-mid-gray lg:px-8 lg:pl-[60px]">
                  {faq.answer}
                </div>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </BlueprintSection>
  );
};

export default FaqSchema;
