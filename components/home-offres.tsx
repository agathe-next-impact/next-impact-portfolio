"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Stack = {
  subtitle: string;
  title: string;
  price: string;
  strengths: string[];
  target: string;
  recommended?: boolean;
};

const STACKS_FR: Stack[] = [
  {
    subtitle: "Attirer",
    title: "Diagnostic Techno Web & IA",
    price: "gratuit",
    strengths: ["Identifier s'il faut construire ou non", "Orienter entre WordPress, SaaS, no-code, IA ou sur-mesure"],
    target: "Premier tri avant production",
  },
  {
    subtitle: "Décider",
    title: "Visio décision techno",
    price: "180 € HT",
    strengths: ["Trancher WordPress, no-code, IA coding, Headless ou sur-mesure", "Compte-rendu court et prochaine étape"],
    target: "Question précise à arbitrer",
    recommended: true,
  },
  {
    subtitle: "Sécuriser",
    title: "Second avis devis / stack / prototype IA",
    price: "390 € HT",
    strengths: ["Challenger un devis, une stack ou un prototype généré vite", "Repérer risques, dépendances et dette technique"],
    target: "Avant de signer",
  },
  {
    subtitle: "Cadrer",
    title: "Roadmap projet web",
    price: "dès 950 € HT",
    strengths: ["Prioriser avant de demander à l'IA ou à un prestataire", "Feuille de route avant production"],
    target: "Projet encore flou",
  },
  {
    subtitle: "Construire",
    title: "Services Next Impact",
    price: "dès 2 250 € HT",
    strengths: ["WordPress optimisé, Headless ou outil métier", "Construire seulement si le besoin le justifie"],
    target: "Mise en œuvre",
  },
  {
    subtitle: "Corriger",
    title: "Dépannage WordPress",
    price: "dès 69 € HT",
    strengths: ["Réparer quand c'est suffisant", "Éviter de refaire trop vite avec ou sans IA"],
    target: "Site existant en difficulté",
  },
];

const STACKS_EN: Stack[] = [
  {
    subtitle: "Attract",
    title: "Web & AI Tech diagnostic",
    price: "free",
    strengths: ["Check whether building is even needed", "Choose between WordPress, SaaS, no-code, AI or custom"],
    target: "First triage before production",
  },
  {
    subtitle: "Decide",
    title: "Tech decision call",
    price: "€180 excl. VAT",
    strengths: ["Choose between WordPress, no-code, AI coding, Headless or custom", "Short recap and next step"],
    target: "One clear question to settle",
    recommended: true,
  },
  {
    subtitle: "Secure",
    title: "Quote / stack / AI prototype second opinion",
    price: "€390 excl. VAT",
    strengths: ["Challenge a quote, stack or fast-generated prototype", "Spot risks, dependencies and technical debt"],
    target: "Before signing",
  },
  {
    subtitle: "Scope",
    title: "Web project roadmap",
    price: "from €950 excl. VAT",
    strengths: ["Prioritize before asking AI or a provider to build", "Roadmap before production"],
    target: "Unclear project",
  },
  {
    subtitle: "Build",
    title: "Next Impact services",
    price: "from €2,250 excl. VAT",
    strengths: ["Optimized WordPress, Headless or business tool", "Build only when the need justifies it"],
    target: "Implementation",
  },
  {
    subtitle: "Fix",
    title: "WordPress support",
    price: "from €69 excl. VAT",
    strengths: ["Fix when enough", "Avoid rebuilding too fast, with or without AI"],
    target: "Existing site in trouble",
  },
];

export default function HomeOffres() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const stacks = isEn ? STACKS_EN : STACKS_FR;

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        {/* En-tête */}
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 04"
            kicker={isEn ? "Web & AI Tech Compass" : "Boussole Techno Web & IA"}
            title={
              isEn ? (
                <>AI can code. <span className="text-accent-secondary">It cannot decide everything.</span></>
              ) : (
                <>L'IA peut coder. <span className="text-accent-secondary">Elle ne peut pas tout décider.</span></>
              )
            }
            description={
              isEn
                ? "The real choice is no longer only WordPress vs Headless. It is WordPress, no-code, AI coding, SaaS, custom development, or not building at all."
                : "Le vrai choix n'est plus seulement WordPress ou Headless. C'est WordPress, no-code, IA coding, SaaS, sur-mesure, ou ne rien construire du tout."
            }
          />
        </Reveal>

        {/* Bento — pleine largeur, sans gouttière */}
        <Stagger className="grid md:grid-cols-3">
          {stacks.map((stack) => (
            <StaggerItem key={stack.title}>
              <div
                className={cn(
                  "group relative flex h-full flex-col p-6 transition-colors hover:bg-jet lg:p-8",
                  "border-b border-dark-gray md:border-b-0",
                  "md:border-r md:border-dark-gray md:[&:nth-child(3n)]:border-r-0",
                  stack.recommended && "bg-jet",
                )}
              >
                {stack.recommended && (
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary" aria-hidden />
                )}

                <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                  {stack.title}
                </h3>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {stack.subtitle}
                </div>

                <div className="mt-6 border-b border-dark-gray pb-5 font-mono text-[11px] tracking-[0.08em] text-foreground">
                  {stack.price}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {stack.strengths.map((s) => (
                    <li key={s} className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                      <span className="shrink-0 pt-px font-mono text-[11px] text-accent-secondary">→</span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {stack.target}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Comment ça marche — fil rouge « garder WordPress » */}
        <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
          <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
            {isEn ? (
              <>
                Key idea:{" "}
                <span className="text-foreground">production is easier</span>{" "}
                — judgment, architecture and maintenance still matter.
              </>
            ) : (
              <>
                Idée clé :{" "}
                <span className="text-foreground">produire devient plus facile</span>{" "}
                — le jugement, l'architecture et la maintenance restent décisifs.
              </>
            )}
          </p>
        </div>

        {/* Pied — liens internes (préférés aux détails) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dark-gray px-6 py-6 lg:px-8">
          <Link
            href="/conseil"
            className="font-mono text-[10px] tracking-[0.06em] text-mid-gray transition-colors hover:text-foreground"
          >
            {isEn ? "Tech advice offers →" : "Offres de conseil techno →"}
          </Link>
          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
          >
            {isEn ? "Compare in detail" : "Comparer en détail"}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
