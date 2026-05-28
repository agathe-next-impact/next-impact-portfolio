"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Stack = {
  fig: string;
  label: string;
  title: string;
  tagline: string;
  price: string;
  strengths: string[];
  target: string;
};

const STACKS_FR: Stack[] = [
  {
    fig: "Stack 01 · Fig. 03",
    label: "Site WordPress",
    title: "WordPress Classique",
    tagline: "La puissance de WordPress, livrée sans compromis sur la performance.",
    price: "à partir de 2 250 €",
    strengths: [
      "Administration WordPress native",
      "Thème sur-mesure, zéro page builder",
      "Core Web Vitals > 90, SEO technique soigné",
    ],
    target: "Site vitrine, blog, association",
  },
  {
    fig: "Stack 02 · Fig. 04",
    label: "Site Headless",
    title: "WordPress Headless",
    tagline: "WordPress en backend, Next.js en frontend — vitesse maximale, design total.",
    price: "à partir de 4 000 €",
    strengths: [
      "Interface sur-mesure, aucune limite de design",
      "Chargement < 1 s, sécurité maximale",
      "Contenu géré dans WordPress comme d'habitude",
    ],
    target: "PME, ESS ambitieuse, site de croissance",
  },
  {
    fig: "Stack 03 · Fig. 05",
    label: "Web App",
    title: "Stack sur-mesure",
    tagline: "Marketplace, outil métier, simulateur : une architecture dédiée à votre logique.",
    price: "sur devis",
    strengths: [
      "Logique métier propre, comptes utilisateurs",
      "Admin aussi autonome que WordPress",
      "Géolocalisation, hors-ligne, PWA installable",
    ],
    target: "Marketplace, plateforme, application terrain",
  },
];

const STACKS_EN: Stack[] = [
  {
    fig: "Stack 01 · Fig. 03",
    label: "WordPress site",
    title: "Classic WordPress",
    tagline: "The full power of WordPress, delivered without performance compromises.",
    price: "from €2,250",
    strengths: [
      "Native WordPress admin",
      "Bespoke theme, no page builder",
      "Core Web Vitals > 90, technical SEO",
    ],
    target: "Brochure site, blog, association",
  },
  {
    fig: "Stack 02 · Fig. 04",
    label: "Headless site",
    title: "Headless WordPress",
    tagline: "WordPress as backend, Next.js as frontend — maximum speed, total design freedom.",
    price: "from €4,000",
    strengths: [
      "Bespoke interface, no design constraints",
      "Load time < 1s, maximum security",
      "Content managed in WordPress as usual",
    ],
    target: "SME, NGO, growth-oriented site",
  },
  {
    fig: "Stack 03 · Fig. 05",
    label: "Web app",
    title: "Bespoke stack",
    tagline: "Marketplace, business tool, simulator: an architecture built for your logic.",
    price: "on quote",
    strengths: [
      "Custom business logic, user accounts",
      "Admin as autonomous as WordPress",
      "Geolocation, offline mode, installable PWA",
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
        <div className="sec-head">
          <div className="sec-no">№ 03</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
            {isEn ? <>Three stacks, <em style={{ color: "var(--accent-color)" }}>one method</em></> : <>Trois stacks, <em style={{ color: "var(--accent-color)" }}>une méthode</em></>}
          </h2>
          <div className="sec-meta">{isEn ? "Offerings · Fig. 03–05" : "Offres · Fig. 03–05"}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
          {stacks.map((stack, i) => (
            <div
              key={stack.title}
              style={{
                padding: "40px 32px",
                borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Fig label */}
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 20 }}>
                {stack.fig}
              </div>

              {/* Title */}
              <h3 className="ni-serif" style={{ fontSize: "clamp(20px, 2vw, 28px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 8 }}>
                {stack.title}
              </h3>

              {/* Tagline */}
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
                {stack.tagline}
              </p>

              {/* Price */}
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--accent-color)", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
                {stack.price}
              </div>

              {/* Strengths */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {stack.strengths.map((s) => (
                  <li key={s} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--accent-color)", fontFamily: "var(--mono)", fontSize: 11, flexShrink: 0, paddingTop: 1 }}>→</span>
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
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div style={{ borderTop: "1px solid var(--rule)", padding: "20px 0", display: "flex", justifyContent: "flex-end" }}>
          <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-color)", textDecoration: "none" }}>
            {isEn ? "Compare in detail" : "Comparer en détail"}
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
