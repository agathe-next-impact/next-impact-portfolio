"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

type Stack = {
  subtitle: string;
  title: string;
  tagline: string;
  price: string;
  strengths: string[];
  target: string;
};

const STACKS_FR: Stack[] = [
  {
    subtitle: "sur WordPress, thème sur-mesure",
    title: "Site vitrine performant",
    tagline: "Un site rapide et fiable, que vous gérez vous-même au quotidien.",
    price: "à partir de 2 250 €",
    strengths: [
      "Administration WordPress, sans compétence technique",
      "Design sur-mesure, zéro page builder",
      "Chargement rapide et bien référencé",
    ],
    target: "Site vitrine, blog, association",
  },
  {
    subtitle: "WordPress Headless + Next.js",
    title: "Site haute performance",
    tagline: "La vitesse maximale et un design sans limite, pour les sites à fort enjeu.",
    price: "à partir de 4 000 €",
    strengths: [
      "Interface sur-mesure, aucune limite de design",
      "Chargé en moins d'une seconde, sécurité renforcée",
      "Contenu géré dans WordPress comme d'habitude",
    ],
    target: "PME, ESS ambitieuse, site de croissance",
  },
  {
    subtitle: "architecture dédiée",
    title: "Plateforme métier sur-mesure",
    tagline: "Marketplace, outil métier, simulateur : une plateforme taillée pour votre activité.",
    price: "sur devis",
    strengths: [
      "Logique métier propre, comptes utilisateurs",
      "Administration aussi simple que WordPress",
      "Géolocalisation, hors-ligne, installable sur mobile",
    ],
    target: "Marketplace, plateforme, application terrain",
  },
];

const STACKS_EN: Stack[] = [
  {
    subtitle: "on WordPress, bespoke theme",
    title: "High-performance brochure site",
    tagline: "A fast, reliable site that you manage yourself, day to day.",
    price: "from €2,250",
    strengths: [
      "WordPress admin, no technical skills needed",
      "Bespoke design, no page builder",
      "Fast loading and well-ranked",
    ],
    target: "Brochure site, blog, association",
  },
  {
    subtitle: "WordPress Headless + Next.js",
    title: "High-speed website",
    tagline: "Maximum speed and unlimited design, for sites where it really counts.",
    price: "from €4,000",
    strengths: [
      "Bespoke interface, no design constraints",
      "Loads in under a second, hardened security",
      "Content managed in WordPress as usual",
    ],
    target: "SME, NGO, growth-oriented site",
  },
  {
    subtitle: "dedicated architecture",
    title: "Custom business platform",
    tagline: "Marketplace, business tool, simulator: a platform built around your activity.",
    price: "on quote",
    strengths: [
      "Custom business logic, user accounts",
      "Admin as simple as WordPress",
      "Geolocation, offline mode, installable on mobile",
    ],
    target: "Marketplace, platform, field application",
  },
];

export default function HomeOffres() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const stacks = isEn ? STACKS_EN : STACKS_FR;

  return (
    <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
      <div className="container">
        <Reveal>
          <div className="sec-head">
            <div className="sec-no">№ 03</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
              {isEn ? <>The right offering <em style={{ color: "var(--ink)" }}>for your project</em></> : <>La bonne formule <em style={{ color: "var(--ink)" }}>pour votre projet</em></>}
            </h2>
          </div>

          {/* Point d'ancrage anti-paralysie */}
          <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 620, marginTop: 16 }}>
            {isEn
              ? "Most brochure projects fall under the first offering. Not sure? The 2-minute diagnostic points you to the right one."
              : "La plupart des projets vitrine relèvent de la première formule. En cas de doute, le diagnostic en 2 minutes vous oriente vers la bonne."}
          </p>
        </Reveal>

        <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)", marginTop: 32 }}>
          {stacks.map((stack, i) => (
            <StaggerItem
              key={stack.title}
              className="ni-card"
              style={{
                padding: "40px 32px",
                borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Title — bénéfice */}
              <h3 className="ni-serif" style={{ fontSize: "clamp(20px, 2vw, 28px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 4 }}>
                {stack.title}
              </h3>

              {/* Sous-titre technique — preuve, en dernier */}
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 16 }}>
                {stack.subtitle}
              </div>

              {/* Tagline */}
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
                {stack.tagline}
              </p>

              {/* Price */}
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--ink)", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
                {stack.price}
              </div>

              {/* Strengths */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {stack.strengths.map((s) => (
                  <li key={s} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--ink-2)", fontFamily: "var(--mono)", fontSize: 11, flexShrink: 0, paddingTop: 1 }}>→</span>
                    {s}
                  </li>
                ))}
              </ul>

              {/* Target */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 4 }}>
                  {isEn ? "Typical use" : "Usage type"}
                </div>
                <p style={{ fontSize: 12, color: "var(--ink-2)" }}>{stack.target}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Footer — lien technique discret + comparatif */}
        <div style={{ borderTop: "1px solid var(--rule)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/documentation" style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em", color: "var(--muted-color)", textDecoration: "none" }}>
            {isEn ? "You're technical? See the architecture details." : "Vous êtes technique ? Voir les détails d'architecture."}
          </Link>
          <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-color)", textDecoration: "none" }}>
            {isEn ? "Compare in detail" : "Comparer en détail"}
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
