// HubRubriques — couche décisionnelle du hub « Quelle techno web ? ».
// Bandeau-méthode Boussole (8 critères) + 6 rubriques par question. Le titre de
// chaque rubrique pointe vers sa page thématique /documentation/<slug> (parcours
// 4 temps) ; les liens reprennent les outils EXISTANTS et la CTA « prochaine
// étape » route vers l'offre. Démonstratif (décision) au premier plan ; les
// catégories encyclopédiques restent en couche « Approfondir » sous ce bloc.
// Tokens DS uniquement, i18n inline (modèle : visio-conseil-banner.tsx).

import { Link } from "@/i18n/navigation";
import {
  Compass,
  GitCompare,
  Bot,
  Wrench,
  ScrollText,
  Boxes,
  Megaphone,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";

type RubriqueLink = { label: string; href: string };

interface Rubrique {
  id: string;
  icon: React.ElementType;
  title: string;
  question: string;
  links: RubriqueLink[];
  next: RubriqueLink;
}

const COPY: Record<
  "fr" | "en",
  {
    boussole: { eyebrow: string; title: string; subtitle: string; criteria: string[]; cta: string };
    rubriqueLabel: string;
    rubriques: Rubrique[];
  }
> = {
  fr: {
    boussole: {
      eyebrow: "La méthode",
      title: "La Boussole Techno Web & IA",
      subtitle:
        "On ne part pas de l'outil, mais du besoin. Huit critères pour trancher entre WordPress, no-code, Headless, SaaS, IA ou sur-mesure.",
      criteria: [
        "Besoin",
        "Usage",
        "Autonomie",
        "Budget",
        "Maintenance",
        "Données",
        "Évolutivité",
        "Time-to-value",
      ],
      cta: "Lancer la Boussole",
    },
    rubriqueLabel: "Rubrique",
    rubriques: [
      {
        id: "choisir",
        icon: GitCompare,
        title: "Choisir sa techno",
        question: "WordPress, Headless, no-code, SaaS… lequel pour mon besoin ?",
        links: [
          { label: "Comprendre le headless", href: "/wordpress-headless" },
          { label: "Quiz WordPress ou Headless", href: "/documentation/wordpress-headless" },
          { label: "Simulateur de tarifs", href: "/tarifs" },
        ],
        next: { label: "Trancher en visio — 240 €", href: "/conseil" },
      },
      {
        id: "ia-et-code",
        icon: Bot,
        title: "IA & code",
        question: "L'IA peut coder vite. Mais faut-il construire ?",
        links: [
          { label: "Prototype IA : jetable ou maintenable ?", href: "/outils/prototype-ia" },
          { label: "Diagnostic Web & IA", href: "/audit-site-web" },
          { label: "Le blog techno", href: "/blog" },
        ],
        next: { label: "En parler en visio", href: "/conseil" },
      },
      {
        id: "reparer",
        icon: Wrench,
        title: "Réparer ou refaire",
        question: "Mon site est-il en bout de course ?",
        links: [
          { label: "Réparer ou refaire ?", href: "/outils/reparer-ou-refaire" },
          { label: "Auditer mon site", href: "/audit-site-web" },
        ],
        next: { label: "Réparer mon site", href: "/contact" },
      },
      {
        id: "avant-signer",
        icon: ScrollText,
        title: "Avant de signer",
        question: "Ce devis est-il bon ? Quelle question poser ?",
        links: [
          { label: "Décrypter mon devis", href: "/outils/decrypteur-devis" },
          { label: "Générer un cahier des charges", href: "/cahier-des-charges" },
          { label: "Simulateur de tarifs", href: "/tarifs" },
        ],
        next: { label: "Demander un second avis", href: "/conseil" },
      },
      {
        id: "outils-metier",
        icon: Boxes,
        title: "Outils métier",
        question: "Annuaire, carte, espace membre : construire ou non ?",
        links: [
          { label: "No-code, SaaS ou sur-mesure ?", href: "/outils/nocode-saas-surmesure" },
          { label: "Diagnostic d'opportunité PWA", href: "/outils/audit-pwa" },
          { label: "Diagnostic projet", href: "/solutions-web/eligibilite" },
        ],
        next: { label: "Cadrer avec une roadmap", href: "/conseil" },
      },
      {
        id: "presence",
        icon: Megaphone,
        title: "Présence et audience",
        question: "Site, newsletter, LinkedIn : où investir ?",
        links: [
          { label: "La Boussole Techno Web & IA", href: "/outils/boussole" },
          { label: "Diagnostic Web & IA", href: "/audit-site-web" },
        ],
        next: { label: "En parler en visio — 240 €", href: "/conseil" },
      },
    ],
  },
  en: {
    boussole: {
      eyebrow: "The method",
      title: "The Web & AI Tech Compass",
      subtitle:
        "Start from the need, not the tool. Eight criteria to choose between WordPress, no-code, Headless, SaaS, AI or custom.",
      criteria: [
        "Need",
        "Usage",
        "Autonomy",
        "Budget",
        "Maintenance",
        "Data",
        "Scalability",
        "Time-to-value",
      ],
      cta: "Launch the Compass",
    },
    rubriqueLabel: "Section",
    rubriques: [
      {
        id: "choisir",
        icon: GitCompare,
        title: "Choose your tech",
        question: "WordPress, Headless, no-code, SaaS… which fits my need?",
        links: [
          { label: "Understanding headless", href: "/wordpress-headless" },
          { label: "WordPress or Headless quiz", href: "/documentation/wordpress-headless" },
          { label: "Pricing simulator", href: "/tarifs" },
        ],
        next: { label: "Decide on a call — €240", href: "/conseil" },
      },
      {
        id: "ia-et-code",
        icon: Bot,
        title: "AI & code",
        question: "AI can code fast. But should you build?",
        links: [
          { label: "AI prototype: throwaway or maintainable?", href: "/outils/prototype-ia" },
          { label: "Web & AI diagnostic", href: "/audit-site-web" },
          { label: "The tech blog", href: "/blog" },
        ],
        next: { label: "Talk it through on a call", href: "/conseil" },
      },
      {
        id: "reparer",
        icon: Wrench,
        title: "Repair or rebuild",
        question: "Is my site reaching the end of the road?",
        links: [
          { label: "Repair or rebuild?", href: "/outils/reparer-ou-refaire" },
          { label: "Audit my site", href: "/audit-site-web" },
        ],
        next: { label: "Fix my site", href: "/contact" },
      },
      {
        id: "avant-signer",
        icon: ScrollText,
        title: "Before you sign",
        question: "Is this quote any good? What should you ask?",
        links: [
          { label: "Decode my quote", href: "/outils/decrypteur-devis" },
          { label: "Generate a project brief", href: "/cahier-des-charges" },
          { label: "Pricing simulator", href: "/tarifs" },
        ],
        next: { label: "Get a second opinion", href: "/conseil" },
      },
      {
        id: "outils-metier",
        icon: Boxes,
        title: "Business tools",
        question: "Directory, map, member area: build or not?",
        links: [
          { label: "No-code, SaaS or custom?", href: "/outils/nocode-saas-surmesure" },
          { label: "PWA opportunity diagnostic", href: "/outils/audit-pwa" },
          { label: "Project diagnostic", href: "/solutions-web/eligibilite" },
        ],
        next: { label: "Frame it with a roadmap", href: "/conseil" },
      },
      {
        id: "presence",
        icon: Megaphone,
        title: "Presence & audience",
        question: "Site, newsletter, LinkedIn: where to invest?",
        links: [
          { label: "The Web & AI Tech Compass", href: "/outils/boussole" },
          { label: "Web & AI diagnostic", href: "/audit-site-web" },
        ],
        next: { label: "Talk it through on a call", href: "/conseil" },
      },
    ],
  },
};

export function HubRubriques({ locale }: { locale: Locale }) {
  const c = COPY[locale === "en" ? "en" : "fr"];

  return (
    <div className="mb-16">
      {/* Bandeau-méthode Boussole */}
      <div className="mb-10 border border-dark-gray bg-jet/40 p-7 lg:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
            <Compass className="h-[1.125rem] w-[1.125rem] text-vermilion" />
          </div>
          <div className="min-w-[14rem] flex-1">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
              {c.boussole.eyebrow}
            </p>
            <h2 className="mb-2 text-xl font-light tracking-tight text-foreground">
              {c.boussole.title}
            </h2>
            <p className="mb-4 max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
              {c.boussole.subtitle}
            </p>
            <ul className="mb-6 flex flex-wrap gap-2">
              {c.boussole.criteria.map((x) => (
                <li
                  key={x}
                  className="border border-dark-gray px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray"
                >
                  {x}
                </li>
              ))}
            </ul>
            <Link
              href="/outils/boussole"
              className="group inline-flex items-center gap-2 border border-charcoal bg-vermilion px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-vermilion-bright"
            >
              {c.boussole.cta}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6 rubriques par question — bento bordé (modèle OutilsBentoGrid) */}
      <div className="grid grid-cols-1 border-r border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3">
        {c.rubriques.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              id={r.id}
              className="scroll-mt-24 border-b border-l border-dark-gray"
            >
              <div className="flex min-h-[240px] flex-col justify-between p-7 lg:p-8">
                <div>
                  <div className="mb-5 flex items-start justify-between">
                    <Icon size={18} className="mt-0.5 shrink-0 text-mid-gray" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                      {c.rubriqueLabel} {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-lg font-light leading-snug tracking-tight text-foreground">
                    <Link
                      href={`/documentation/${r.id}` as Parameters<typeof Link>[0]["href"]}
                      className="group/title inline-flex items-start gap-1 text-foreground no-underline transition-colors hover:text-vermilion"
                    >
                      {r.title}
                      <ArrowUpRight
                        size={14}
                        className="mt-1 shrink-0 text-mid-gray transition-transform group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5"
                      />
                    </Link>
                  </h3>
                  <p className="mb-5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                    {r.question}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {r.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link
                          href={l.href as Parameters<typeof Link>[0]["href"]}
                          className="group inline-flex items-center gap-1.5 font-inter-tight text-[13px] text-mid-gray no-underline transition-colors hover:text-foreground"
                        >
                          <ArrowUpRight
                            size={12}
                            className="shrink-0 text-accent-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={r.next.href as Parameters<typeof Link>[0]["href"]}
                  className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-vermilion no-underline transition-colors hover:text-vermilion-bright"
                >
                  {r.next.label}
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
