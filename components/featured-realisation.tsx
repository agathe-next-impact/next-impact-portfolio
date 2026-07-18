"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { YoutubePlayer } from "@/components/youtube-player";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "inline-flex h-11 items-center gap-2 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-ebony";

type Copy = {
  badge: string;
  tagline: string;
  description: string;
  stats: { value: string; label: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
  imageAlt: string;
};

const COPY: Record<Locale, Copy> = {
  fr: {
    badge: "Étude de cas phare — Mai 2026",
    tagline: "Le 1er annuaire B2B du secteur, livré en 2 mois",
    description:
      "Premier annuaire en ligne des fournisseurs d'objets publicitaires en France. Plateforme opérationnelle en 2 mois, pensée SEO et croissance. Next.js + PostgreSQL serverless.",
    stats: [
      { value: "1ᵉʳ",    label: "Annuaire du secteur en France" },
      { value: "2 mois", label: "Du concept à la production" },
      { value: "B2B",    label: "Sourcing fournisseurs simplifié" },
    ],
    ctaPrimary: "Voir l'étude de cas",
    ctaSecondary: "Discuter d'un projet similaire",
    imageAlt: "Panorama Pub — marketplace B2B des fournisseurs d'objets publicitaires",
  },
  en: {
    badge: "Featured case study — May 2026",
    tagline: "The industry's 1st B2B directory, shipped in 2 months",
    description:
      "First online directory of promotional product suppliers in France. Operational in 2 months, built for SEO and growth. Next.js + serverless PostgreSQL.",
    stats: [
      { value: "1st",      label: "Industry directory in France" },
      { value: "2 months", label: "From concept to production" },
      { value: "B2B",      label: "Streamlined supplier sourcing" },
    ],
    ctaPrimary: "View the case study",
    ctaSecondary: "Discuss a similar project",
    imageAlt: "Panorama Pub — B2B marketplace for promotional product suppliers",
  },
};

// Clients réels (cf. études de cas) — roster typographique, lisible sur fond sombre
// quel que soit le format des logos d'origine.
const CLIENTS = [
  "Panorama Pub",
  "Proditec",
  "Sowee",
  "Mediatico",
  "L'Hermitage",
  "Infralliance",
  "Salon de la Carrosserie",
  "Senza Nature",
  "ERP Services",
  "Wagner Hamisky",
];

export default function FeaturedRealisation() {
  const locale = useLocale() as Locale;
  const copy = COPY[locale] ?? COPY.fr;
  const isEn = locale === "en";

  return (
    <BlueprintSection tone="obsidian">
      <Reveal>
        {/* En-tête : kicker (badge) + titre + accroche & contexte */}
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 05"
            kicker={copy.badge}
            title="Panorama Pub"
            description={
              <>
                <span className="block font-medium text-foreground">{copy.tagline}</span>
                <span className="mt-3 block">{copy.description}</span>
              </>
            }
          />
        </div>

        {/* Grand visuel encadré */}
        <div className="border-b border-dark-gray p-5 lg:p-12">
          <div className="rounded-md bg-overlay-gray p-2 md:p-4">
            <div className="overflow-hidden rounded-sm">
              <YoutubePlayer
                videoId="9fMaBL1amYk"
                title={copy.imageAlt}
                label="Panorama Pub"
              />
            </div>
          </div>
        </div>

        {/* Problème → Résultat → Stack : colonnes séparées par des filets */}
        <div className="grid grid-cols-1 border-b border-dark-gray md:grid-cols-3">
          {copy.stats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-dark-gray px-6 py-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:px-8"
            >
              <div className="text-3xl font-light tracking-tight text-foreground">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 border-b border-dark-gray px-6 py-8 lg:px-8">
          <Link href="/etudes-de-cas/panorama-pub" className={BTN_PRIMARY}>
            {copy.ctaPrimary}
          </Link>
          <Link href="/contact" className={BTN_GHOST}>
            {copy.ctaSecondary}
          </Link>
        </div>

        {/* Preuve sociale — compteur + métrique perf réelle + roster clients */}
        <div className="px-6 py-10 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-light tracking-tight text-foreground">+25</span>
                <span className="max-w-[140px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-mid-gray">
                  {isEn ? "projects shipped since 2020" : "projets livrés depuis 2020"}
                </span>
              </div>
              <div className="flex items-baseline gap-3 border-dark-gray sm:border-l sm:pl-10">
                <span className="text-3xl font-light tracking-tight text-foreground">98/100</span>
                <span className="max-w-[150px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-mid-gray">
                  {isEn ? "PageSpeed reached (Proditec, 45 → 98)" : "PageSpeed atteint (Proditec, 45 → 98)"}
                </span>
              </div>
            </div>
            <Link
              href="/etudes-de-cas"
              className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
            >
              {isEn ? "All case studies" : "Toutes les études de cas"}
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p className="mt-8 border-t border-dark-gray pt-6 font-mono text-[11px] leading-[2.2] tracking-[0.04em] text-mid-gray">
            {CLIENTS.map((name, i) => (
              <span key={name}>
                {i > 0 && <span className="px-2.5 text-accent-secondary/50">·</span>}
                {name}
              </span>
            ))}
          </p>
        </div>
      </Reveal>
    </BlueprintSection>
  );
}
