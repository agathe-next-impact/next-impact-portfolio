"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { m as motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/routing";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { Hairline } from "@/components/visuals/hairline";

type Phase = {
  title: string;
  duration: string;
  description: string;
  deliverable: string;
};

const PHASES_FR: Phase[] = [
  {
    title: "Analyse & cadrage",
    duration: "1 semaine",
    description: "Audit de l'existant, besoins, choix de la stack (Classique / Headless / Web App).",
    deliverable: "Document de cadrage + recommandation stack",
  },
  {
    title: "Conception & validation",
    duration: "1–2 semaines",
    description: "Wireframes, maquettes haute-fidélité, charte si besoin — validées avant développement.",
    deliverable: "Maquettes validées + charte typographique",
  },
  {
    title: "Développement",
    duration: "3–5 semaines",
    description: "Intégration Next.js ou thème WordPress, backend, fonctionnalités métier. Staging continu.",
    deliverable: "Site fonctionnel en environnement staging",
  },
  {
    title: "Optimisation & tests",
    duration: "1 semaine",
    description: "Core Web Vitals (> 90), SEO technique, accessibilité WCAG, tests multi-navigateurs.",
    deliverable: "Rapport Core Web Vitals + checklist SEO",
  },
  {
    title: "Mise en ligne & suivi",
    duration: "1 semaine",
    description: "Mise en production, DNS, redirections 301. Support inclus 30 jours.",
    deliverable: "Site en ligne + accès livrés + 30 j de support",
  },
];

const PHASES_EN: Phase[] = [
  {
    title: "Analysis & scoping",
    duration: "1 week",
    description: "Audit, requirements, stack choice (Classic / Headless / Web App).",
    deliverable: "Scoping document + stack recommendation",
  },
  {
    title: "Design & validation",
    duration: "1–2 weeks",
    description: "Wireframes, high-fidelity mockups, brand guidelines if needed — signed off before any build.",
    deliverable: "Validated mockups + type guidelines",
  },
  {
    title: "Development",
    duration: "3–5 weeks",
    description: "Next.js or custom WordPress, backend, business features. Continuous staging for review.",
    deliverable: "Functional site in staging environment",
  },
  {
    title: "Optimization & testing",
    duration: "1 week",
    description: "Core Web Vitals (> 90), technical SEO, WCAG accessibility, cross-browser testing.",
    deliverable: "Core Web Vitals report + SEO checklist",
  },
  {
    title: "Go-live & follow-up",
    duration: "1 week",
    description: "Go-live, DNS, 301 redirects. 30-day support included.",
    deliverable: "Live site + credentials delivered + 30-day support",
  },
];

export default function Process({ index = "№ 05" }: { index?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const phases = isEn ? PHASES_EN : PHASES_FR;

  const reduce = useReducedMotion();
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 80%", "end 65%"],
  });
  // Le filet vertical se trace au fil du défilement de la liste des phases.
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* En-tête de section */}
      <Reveal className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>{index}</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
          <span className="text-mid-gray">{isEn ? "Method · 5 phases" : "Méthode · 5 phases"}</span>
        </div>
        <h2 className="max-w-3xl text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-4xl">
          {isEn ? (
            <>From brief to <span className="text-accent-secondary">go-live</span></>
          ) : (
            <>Du brief à la <span className="text-accent-secondary">mise en ligne</span></>
          )}
        </h2>
      </Reveal>

      {/* Étapes — filet vertical tracé au scroll */}
      <div ref={stepsRef} className="relative mt-10 border-t border-dark-gray">
        {/* Filet vertical entre numéro et contenu */}
        <div
          aria-hidden
          className="absolute bottom-0 left-14 top-0 w-px bg-dark-gray"
        >
          <motion.div
            className="absolute left-0 top-0 w-px bg-vermilion"
            style={{ height: reduce ? "100%" : railHeight }}
          />
        </div>

        <Stagger>
          {phases.map((phase, i) => (
            <StaggerItem
              key={phase.title}
              className="grid grid-cols-[56px_1fr_auto] items-start gap-x-6 border-b border-dark-gray py-7"
            >
              {/* Numéro mono accent */}
              <div className="pt-[3px] font-mono text-[11px] tracking-[0.08em] text-accent-secondary">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Contenu principal */}
              <div>
                <h3 className="mb-2 font-light tracking-tight text-foreground text-lg">
                  {phase.title}
                </h3>
                <p className="mb-3 max-w-[520px] font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {phase.description}
                </p>
                <p className="font-mono text-[10px] tracking-[0.06em] text-mid-gray">
                  ↳ {phase.deliverable}
                </p>
              </div>

              {/* Durée */}
              <div className="whitespace-nowrap pt-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                {phase.duration}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Synthèse */}
      <Reveal className="mt-6 flex flex-col gap-4">
        <Hairline />
        <div className="flex flex-wrap items-center justify-between gap-6 pt-1">
          <p className="font-inter-tight text-sm italic text-mid-gray">
            {isEn
              ? "6 to 10 weeks total, depending on stack and complexity."
              : "6 à 10 semaines au total, selon la stack et la complexité."}
          </p>
          <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
            {isEn
              ? "Classic: 6 w · Headless: 8 w · Web app: 10 w"
              : "Classique : 6 s · Headless : 8 s · Web app : 10 s"}
          </span>
        </div>
      </Reveal>
    </>
  );
}
