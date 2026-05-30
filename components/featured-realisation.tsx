"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { YoutubePlayer } from "@/components/youtube-player";
import type { Locale } from "@/i18n/routing";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

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
    badge: "Réalisation phare — Mai 2026",
    tagline: "Le 1er annuaire B2B du secteur, livré en 2 mois",
    description:
      "Objectif : créer le premier annuaire en ligne des fournisseurs d'objets publicitaires en France, sur un marché encore vacant. Résultat : une plateforme opérationnelle en 2 mois, pensée pour le référencement et la croissance dès la mise en ligne. Rendu possible par Next.js et une base PostgreSQL serverless.",
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
    badge: "Featured project — May 2026",
    tagline: "The industry's 1st B2B directory, shipped in 2 months",
    description:
      "Objective: build the first online directory of promotional product suppliers in France, on a still-vacant market. Result: a platform operational in 2 months, designed for SEO and growth from day one. Made possible by Next.js and a serverless PostgreSQL database.",
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

export default function FeaturedRealisation() {
  const locale = useLocale() as Locale;
  const copy = COPY[locale] ?? COPY.fr;

  return (
    <section
      className="s"
      style={{
        background: "var(--paper-2)",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left — text */}
          <Reveal>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                marginBottom: 16,
              }}
            >
              {copy.badge}
            </div>
            <h2
              className="ni-serif"
              style={{
                fontSize: "clamp(28px, 3.5vw, 52px)",
                lineHeight: 1.1,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              Panorama Pub
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 18,
                color: "var(--ink)",
                marginBottom: 20,
              }}
            >
              {copy.tagline}
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--ink-2)",
                marginBottom: 32,
              }}
            >
              {copy.description}
            </p>

            <Stagger
              stagger={0.08}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderTop: "1px solid var(--rule)",
                marginBottom: 32,
              }}
            >
              {copy.stats.map((stat, i) => (
                <StaggerItem
                  key={stat.label}
                  style={{
                    padding: "20px 0",
                    borderRight: i < copy.stats.length - 1 ? "1px solid var(--rule)" : "none",
                    paddingRight: i < copy.stats.length - 1 ? 20 : 0,
                    paddingLeft: i > 0 ? 20 : 0,
                  }}
                >
                  <div
                    className="ni-serif"
                    style={{ fontSize: 28, color: "var(--ink)", marginBottom: 4 }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted-color)",
                    }}
                  >
                    {stat.label}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <div style={{ display: "flex", gap: 12 }}>
              <Link
                href="/etudes-de-cas/panorama-pub"
                className="btn primary"
              >
                {copy.ctaPrimary}
              </Link>
              <Link
                href="/contact"
                className="btn"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </Reveal>

          {/* Right — video */}
          <Reveal as="div" delay={0.12} style={{ borderTop: "1px solid var(--rule)" }}>
            <YoutubePlayer videoId="9fMaBL1amYk" title={copy.imageAlt} label="Panorama Pub" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
