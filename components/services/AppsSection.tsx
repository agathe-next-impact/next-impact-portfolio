"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

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
    <section className="s" id="apps-sur-mesure">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ —</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
            {copy.title}
          </h2>
          <div className="sec-meta">{copy.sectionLabel}</div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 600, lineHeight: 1.65, marginBottom: 8 }}>
            {copy.subtitle}
          </p>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            {copy.priceLabel}
          </span>
        </div>

        {/* Characteristics + Use cases */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            borderTop: "1px solid var(--rule)",
            marginBottom: 40,
          }}
        >
          {[
            {
              label: copy.characteristicsLabel,
              items: copy.characteristics,
              symbol: "→",
            },
            {
              label: copy.useCasesLabel,
              items: copy.useCases,
              symbol: "·",
            },
          ].map((col, i) => (
            <div
              key={col.label}
              style={{
                padding: "32px",
                borderRight: i === 0 ? "1px solid var(--rule)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  marginBottom: 16,
                }}
              >
                {col.label}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--ink-2)" }}>
                    <span style={{ color: "var(--ink-2)", fontFamily: "var(--mono)", fontSize: 12 }}>{col.symbol}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Differentiator quote */}
        <blockquote
          style={{
            borderLeft: "3px solid var(--rule-strong)",
            paddingLeft: 32,
            marginBottom: 40,
          }}
        >
          <h3 className="ni-serif" style={{ fontSize: "clamp(18px, 2vw, 26px)", marginBottom: 12, color: "var(--ink)" }}>
            {copy.differentiatorTitle}
          </h3>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--ink-2)",
              lineHeight: 1.7,
              maxWidth: 640,
            }}
          >
            {copy.differentiator}
          </p>
        </blockquote>

        {/* Advantages / Limits */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            borderTop: "1px solid var(--rule)",
            marginBottom: 40,
          }}
        >
          {[
            { label: copy.advantagesLabel, items: copy.advantages, symbol: "+" },
            { label: copy.limitsLabel, items: copy.limits, symbol: "—" },
          ].map((col, i) => (
            <div
              key={col.label}
              style={{
                padding: "32px",
                borderRight: i === 0 ? "1px solid var(--rule)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: i === 0 ? "var(--ink-2)" : "var(--muted-color)",
                  marginBottom: 16,
                }}
              >
                {col.label}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {col.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--ink-2)" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: i === 0 ? "var(--ink-2)" : "var(--muted-color)" }}>
                      {col.symbol}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Case studies 
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
        /*}

        {/* OETH banner */}
        <div
          style={{
            border: "1px solid var(--rule)",
            padding: "28px 32px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 24,
            alignItems: "center",
            marginBottom: 40,
            background: "var(--paper-2)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            {copy.oethBadge}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>
              {copy.oethTitle}
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{copy.oethDescription}</p>
          </div>
          <Link href="/avantage-oeth" className="btn" style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {copy.oethCta}
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* CTA */}
        <a
          href="https://calendar.app.google/RwZqaabSR5aDMnk46"
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          {copy.ctaPrimary}
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
