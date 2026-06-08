"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { SignalPaths } from "@/components/visuals/signal-paths";
import { cn } from "@/lib/utils";

type Copy = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  characteristicsLabel: string;
  characteristics: string[];
  useCasesLabel: string;
  useCases: string[];
  differentiatorTitle: string;
  differentiator: string;
  advantagesLabel: string;
  advantages: string[];
  limitsLabel: string;
  limits: string[];
  proofsLabel: string;
  proofs: { slug: string; title: string; tagline: string; imageUrl: string }[];
  oethBadge: string;
  oethTitle: string;
  oethDescription: string;
  oethCta: string;
  ctaPrimary: string;
};

const COPY: Record<Locale, Copy> = {
  fr: {
    sectionLabel: "Applications web & mobile",
    title: "Stack sur-mesure",
    subtitle: "Marketplace, outil métier, simulateur ou application mobile : une architecture dédiée à votre logique métier, avec une admin aussi autonome que WordPress.",
    priceLabel: "Sur devis, après cadrage",
    characteristicsLabel: "Caractéristiques",
    characteristics: [
      "Logique métier propre",
      "Comptes utilisateurs",
      "Données temps réel",
      "Géolocalisation, mode hors-ligne, installation sur écran d'accueil",
    ],
    useCasesLabel: "Cas d'usage",
    useCases: [
      "Marketplace ou annuaire B2B",
      "Outil interne ou plateforme métier",
      "Simulateur, calculateur, configurateur",
      "Jeu en ligne, gamification",
      "Application terrain ou mobile",
    ],
    differentiatorTitle: "Vous gardez la main",
    differentiator: "Comme WordPress vous permet de gérer votre site sans dépendre d'un développeur au quotidien, chaque application livrée s'accompagne d'une interface d'administration autonome, conçue sur-mesure pour votre logique métier. Vous gérez vos contenus, vos données et vos utilisateurs en toute autonomie.",
    advantagesLabel: "Avantages",
    advantages: [
      "Sur-mesure intégral, adapté à votre métier",
      "Performances maximales (Next.js + base dédiée)",
      "Autonomie de gestion comparable à WordPress",
      "Pas de limites imposées par un CMS générique",
    ],
    limitsLabel: "À prévoir",
    limits: [
      "Budget plus conséquent qu'un site WordPress",
      "Maintenance continue de l'infrastructure",
      "Équipe technique nécessaire pour les évolutions structurelles",
    ],
    proofsLabel: "Réalisations",
    proofs: [
      { slug: "panorama-pub", title: "Panorama Pub", tagline: "Marketplace B2B livrée en 2 mois — admin autonome sur-mesure", imageUrl: "/img/desktop-screen-panoramapub.png" },
      { slug: "hermitage-jeu-de-piste", title: "Hermitage — Jeu de piste", tagline: "Application mobile PWA — géolocalisée, installable sans store, hors-ligne", imageUrl: "/img/mobile-screen-jeu-de-piste-hermitage.jpg" },
    ],
    oethBadge: "Avantage OETH applicable",
    oethTitle: "Déduction AGEFIPH transverse",
    oethDescription: "Toute prestation Next Impact ouvre droit à la déduction AGEFIPH (30 % du coût de main-d'œuvre) — site WordPress, site Headless, web app ou application mobile.",
    oethCta: "Simuler mon économie",
    ctaPrimary: "Discuter de mon projet",
  },
  en: {
    sectionLabel: "Web & mobile applications",
    title: "Bespoke stack",
    subtitle: "Marketplace, business tool, simulator or mobile application: a dedicated architecture built for your business logic, with an admin as autonomous as WordPress.",
    priceLabel: "On quote, after scoping",
    characteristicsLabel: "Characteristics",
    characteristics: [
      "Dedicated business logic",
      "User accounts",
      "Real-time data",
      "Geolocation, offline mode, install on home screen",
    ],
    useCasesLabel: "Use cases",
    useCases: [
      "Marketplace or B2B directory",
      "Internal tool or business platform",
      "Simulator, calculator, configurator",
      "Online game, gamification",
      "Field or mobile application",
    ],
    differentiatorTitle: "You stay in control",
    differentiator: "Just as WordPress lets you manage your site without depending on a developer every day, every application I deliver comes with an autonomous admin interface tailored to your business logic. You manage your content, your data and your users in full autonomy.",
    advantagesLabel: "Advantages",
    advantages: [
      "Fully bespoke, adapted to your business",
      "Maximum performance (Next.js + dedicated database)",
      "Management autonomy comparable to WordPress",
      "No limits imposed by a generic CMS",
    ],
    limitsLabel: "To consider",
    limits: [
      "Larger budget than a WordPress site",
      "Ongoing infrastructure maintenance",
      "Technical team required for structural changes",
    ],
    proofsLabel: "Selected work",
    proofs: [
      { slug: "panorama-pub", title: "Panorama Pub", tagline: "B2B marketplace shipped in 2 months — custom autonomous admin", imageUrl: "/img/desktop-screen-panoramapub.png" },
      { slug: "hermitage-jeu-de-piste", title: "Hermitage — Treasure Hunt", tagline: "Mobile PWA — geolocated, store-free install, offline", imageUrl: "/img/mobile-screen-jeu-de-piste-hermitage.jpg" },
    ],
    oethBadge: "OETH benefit applicable",
    oethTitle: "Transverse AGEFIPH deduction",
    oethDescription: "Every Next Impact engagement qualifies for the AGEFIPH deduction (30 % of labor cost) — WordPress site, Headless site, web app or mobile application.",
    oethCta: "Simulate my savings",
    ctaPrimary: "Discuss my project",
  },
};

export default function AppsSection() {
  const locale = useLocale() as Locale;
  const copy = COPY[locale] ?? COPY.fr;

  return (
    <BlueprintSection
      id="apps-sur-mesure"
      tone="obsidian"
      backdrop={
        <div className="absolute inset-x-0 top-0 h-48 opacity-30">
          <SignalPaths />
        </div>
      }
    >
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 05"
          kicker={copy.sectionLabel}
          title={copy.title}
          description={copy.subtitle}
        />
        <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
          {copy.priceLabel}
        </span>
      </Reveal>

      {/* Caractéristiques + Cas d'usage — bento bordé, sans gouttière */}
      <div className="grid border-b border-dark-gray md:grid-cols-2">
        {[
          { label: copy.characteristicsLabel, items: copy.characteristics, symbol: "→" },
          { label: copy.useCasesLabel, items: copy.useCases, symbol: "·" },
        ].map((col) => (
          <div
            key={col.label}
            className="border-b border-dark-gray p-6 last:border-b-0 md:border-b-0 md:p-8 md:[&:not(:last-child)]:border-r"
          >
            <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {col.label}
            </div>
            <ul className="flex flex-col gap-2.5">
              {col.items.map((item) => (
                <li key={item} className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  <span className="shrink-0 pt-px font-mono text-[12px] text-accent-secondary">{col.symbol}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Différenciateur — citation filet à gauche */}
      <Reveal className="border-b border-dark-gray px-6 py-10 lg:px-8 lg:py-12">
        <blockquote className="border-l-2 border-accent-secondary/50 pl-6 md:pl-8">
          <h3 className="mb-3 text-xl font-light tracking-tight text-foreground md:text-2xl">
            {copy.differentiatorTitle}
          </h3>
          <p className="max-w-2xl font-inter-tight text-[15px] italic leading-relaxed text-mid-gray">
            {copy.differentiator}
          </p>
        </blockquote>
      </Reveal>

      {/* Avantages / À prévoir — bento bordé, sans gouttière */}
      <div className="grid border-b border-dark-gray md:grid-cols-2">
        {[
          { label: copy.advantagesLabel, items: copy.advantages, symbol: "+", accent: true },
          { label: copy.limitsLabel, items: copy.limits, symbol: "—", accent: false },
        ].map((col) => (
          <div
            key={col.label}
            className="border-b border-dark-gray p-6 last:border-b-0 md:border-b-0 md:p-8 md:[&:not(:last-child)]:border-r"
          >
            <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {col.label}
            </div>
            <ul className="flex flex-col gap-2">
              {col.items.map((item) => (
                <li key={item} className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  <span
                    className={cn(
                      "shrink-0 pt-px font-mono text-[12px]",
                      col.accent ? "text-accent-secondary" : "text-mid-gray",
                    )}
                  >
                    {col.symbol}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Réalisations
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
            marginBottom: 24,
          }}
        >
          {copy.proofsLabel}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {copy.proofs.map((proof) => (
            <Link
              key={proof.slug}
              href={`/etudes-de-cas/${proof.slug}` as Parameters<typeof Link>[0]["href"]}
              style={{ display: "block", textDecoration: "none" }}
            >
              <div style={{ border: "1px solid var(--rule)", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "16/9" }}>
                  <Image
                    src={proof.imageUrl}
                    alt={proof.title}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div style={{ padding: "20px 24px", borderTop: "1px solid var(--rule)" }}>
                  <h4 className="ni-serif" style={{ fontSize: 18, marginBottom: 6, color: "var(--ink)" }}>
                    {proof.title}
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{proof.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      */}

      {/* Bandeau OETH + CTA */}
      <div className="flex flex-col gap-8 px-6 py-12 lg:px-8 lg:py-16">
        <Reveal className="grid items-center gap-6 border border-dark-gray bg-jet p-6 md:grid-cols-[auto_1fr_auto] md:gap-8 md:p-8">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
            {copy.oethBadge}
          </div>
          <div>
            <p className="mb-1 font-light tracking-tight text-foreground">
              {copy.oethTitle}
            </p>
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {copy.oethDescription}
            </p>
          </div>
          <Link
            href="/avantage-oeth"
            className="group inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-obsidian"
          >
            {copy.oethCta}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal>
          <a
            href="https://calendar.app.google/RwZqaabSR5aDMnk46"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-charcoal bg-vermilion px-6 font-mono text-[12px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright"
          >
            {copy.ctaPrimary}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </BlueprintSection>
  );
}
