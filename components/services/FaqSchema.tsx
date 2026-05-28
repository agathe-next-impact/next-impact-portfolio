"use client";
import React, { useState } from "react";

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

const FaqSchema: React.FC<FaqSchemaProps> = ({
  faqs,
  title = "Questions fréquentes",
  description = "Vous avez des questions ? Voici les réponses aux questions les plus fréquentes que je reçois.",
  sectionId = "faq",
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
    <section id={sectionId} className="s">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ —</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
            {title}
          </h2>
        </div>

        {description && (
          <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 560, marginBottom: 40 }}>
            {description}
          </p>
        )}

        <div style={{ borderTop: "1px solid var(--rule)" }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{ borderBottom: "1px solid var(--rule)", cursor: "pointer" }}
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr 24px",
                  gap: 24,
                  padding: "24px 0",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--accent-color)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3
                  className="ni-serif"
                  style={{
                    fontSize: 16,
                    margin: 0,
                    fontStyle: open === idx ? "italic" : "normal",
                    color: "var(--ink)",
                  }}
                >
                  {faq.question}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 16,
                    color: "var(--muted-color)",
                    transform: open === idx ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  +
                </span>
              </div>
              {open === idx && (
                <div
                  style={{
                    paddingLeft: 72,
                    paddingBottom: 24,
                    fontSize: 14,
                    color: "var(--ink-2)",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </div>
    </section>
  );
};

export default FaqSchema;
