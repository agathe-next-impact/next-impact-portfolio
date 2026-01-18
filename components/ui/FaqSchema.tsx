"use client";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
import { motion, AnimatePresence } from "framer-motion";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqSchemaProps {
  faqs: FaqItem[];
  title?: string;
  description?: string;
  sectionId?: string;
}

/**
 * Composant FAQ réutilisable avec balises schema.org
 */
const FaqSchema: React.FC<FaqSchemaProps> = ({
  faqs,
  title = "Questions fréquentes",
  description =
    "Vous avez des questions ? Voici les réponses aux questions les plus fréquentes que je reçois.",
  sectionId = "faq",
}) => {
  // Générer le JSON-LD pour schema.org FAQPage
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          typeof faq.answer === 'string'
            ? faq.answer
            : (typeof window === 'undefined' ? '' : (document.createElement('div').appendChild(document.createElement('span')).innerHTML = '')),
      },
    })),
  };

  return (
    <section id={sectionId}>
      <div className="container">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl text-regularblue font-medium mb-6">{title}</h2>
          <p className="text-base md:text-xl max-w-3xl mx-auto text-regularblue/70">{description}</p>
        </div>
        <div className="mx-auto max-w-3xl md:py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem value={`item-${idx + 1}`} key={idx}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                {/* Animation Framer Motion sur le contenu */}
                <AccordionContent>
                  <AnimatePresence initial={false}>
                    {/* Utilisation de motion.div pour l'animation du contenu */}
                    <motion.div
                      key={`faq-content-${idx}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 1.4, ease: "circOut", type: "tween" }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AnimatePresence>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {/* Balise JSON-LD schema.org FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </div>
    </section>
  );
};

export default FaqSchema;