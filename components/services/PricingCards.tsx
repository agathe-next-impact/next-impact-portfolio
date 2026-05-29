"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Tier = {
  name: string;
  tech: string;
  price: string;
  priceTagline: string;
  forProjectLabel: string;
  forProject: string;
  stackLabel: string;
  stackHtml: React.ReactNode;
  includedLabel: string;
  included: { text: string }[];
  ctaLabel: string;
  badge?: string;
  oeth?: { title: string; text: string; cta: string };
  ctaHref: string;
  ctaExternal?: boolean;
  highlight?: boolean;
};

function getTiers(isEn: boolean): Tier[] {
  return [
    {
      name: isEn ? "HIGH-PERFORMANCE BROCHURE SITE" : "SITE VITRINE PERFORMANT",
      tech: isEn ? "on WordPress, bespoke theme" : "sur WordPress, thème sur-mesure",
      price: isEn ? "From €2,250" : "Depuis 2 250 €",
      priceTagline: isEn ? "Quick to ship, controlled cost" : "Mise en ligne rapide, coût maîtrisé",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "Brochure site, institutional site or quick redesign of an aging WordPress."
        : "Site vitrine, site institutionnel ou refonte rapide d'un WordPress vieillissant.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Monolithic WordPress with <em style={{ color: "var(--ink)" }}>a modern custom theme</em>, optimized build, hardened security.</>
        : <>WordPress monolithique avec <em style={{ color: "var(--ink)" }}>thème custom moderne</em>, build optimisé, sécurité durcie.</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "Modern, responsive design" },
            { text: "5 key pages" },
            { text: "WordPress admin training" },
            { text: "Hardened security" },
          ]
        : [
            { text: "Design moderne et responsive" },
            { text: "5 pages clés" },
            { text: "Formation à l'admin WordPress" },
            { text: "Sécurité durcie" },
          ],
      ctaLabel: isEn ? "Pick this stack" : "Choisir cette stack",
      ctaHref: "/contact",
    },
    {
      name: isEn ? "HIGH-SPEED WEBSITE" : "SITE HAUTE PERFORMANCE",
      tech: "WordPress Headless + Next.js",
      price: isEn ? "From €4,000" : "Depuis 4 000 €",
      priceTagline: isEn ? "Front-end performance, optimized conversion" : "Performance front, conversion optimisée",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "A site with strong SEO stakes, editorial blog, brand or product where front-end performance is a conversion lever."
        : "Site à fort enjeu SEO, blog éditorial, marque ou produit dont la performance front est un levier de conversion.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Headless WordPress as backend + <em style={{ color: "var(--ink)" }}>Next.js</em> as frontend (SSG, ISR, partial hydration).</>
        : <>WordPress headless en backend + <em style={{ color: "var(--ink)" }}>Next.js</em> en frontend (SSG, ISR, hydratation partielle).</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "Custom design" },
            { text: "Advanced SEO strategy" },
            { text: "Data migration" },
            { text: "Strategic support" },
          ]
        : [
            { text: "Design personnalisé" },
            { text: "Stratégie SEO avancée" },
            { text: "Migration de données" },
            { text: "Accompagnement stratégique" },
          ],
      ctaLabel: isEn ? "Pick this stack" : "Choisir cette stack",
      badge: isEn ? "Most popular" : "Le plus demandé",
      highlight: true,
      ctaHref: "/contact",
    },
    {
      name: isEn ? "CUSTOM BUSINESS PLATFORM" : "PLATEFORME MÉTIER SUR-MESURE",
      tech: isEn ? "dedicated architecture, multisite / high-volume" : "architecture dédiée, multisites / forte volumétrie",
      price: isEn ? "From €6,500" : "Depuis 6 500 €",
      priceTagline: isEn ? "Scalable architecture, ISR/SSR, multisite" : "Architecture évolutive, ISR/SSR, multisites",
      forProjectLabel: isEn ? "What kind of project?" : "Pour quel projet ?",
      forProject: isEn
        ? "High-volume platform, multisite, third-party API integrations, business applications or client portals."
        : "Plateforme à forte volumétrie, multisites, intégrations API tierces, applications métier ou portails clients.",
      stackLabel: isEn ? "Technical stack" : "Stack technique",
      stackHtml: isEn
        ? <>Headless WordPress + <em style={{ color: "var(--ink)" }}>Next.js App Router</em> (SSG, ISR, SSR), TypeScript, complete CI/CD.</>
        : <>WordPress headless + <em style={{ color: "var(--ink)" }}>Next.js App Router</em> (SSG, ISR, SSR), TypeScript, CI/CD complet.</>,
      includedLabel: isEn ? "What's included" : "Ce qui est inclus",
      included: isEn
        ? [
            { text: "Fully bespoke UI/UX" },
            { text: "Critical performance (ISR/SSR)" },
            { text: "Security strengthened by decoupling" },
            { text: "12-month priority support" },
          ]
        : [
            { text: "UI/UX sur-mesure totale" },
            { text: "Performances critiques (ISR/SSR)" },
            { text: "Sécurité renforcée par découplage" },
            { text: "Support prioritaire 12 mois" },
          ],
      ctaLabel: isEn ? "Discuss my project" : "Discuter de mon projet",
      oeth: {
        title: isEn ? "OETH tax advantage" : "Avantage fiscal OETH",
        text: isEn
          ? "TIH provider: 30% of labor cost deductible from your AGEFIPH contribution."
          : "Prestataire TIH : 30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH.",
        cta: isEn ? "Simulate my savings" : "Simuler mon économie",
      },
      ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
      ctaExternal: true,
    },
  ];
}

export function PricingCards() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const tiers = getTiers(isEn);

  return (
    <section
      style={{
        background: "var(--paper)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        padding: "80px 0",
      }}
    >
      <div className="container">
        <div className="sec-head" style={{ borderBottom: "1px solid var(--rule)", marginBottom: 0, paddingBottom: 32 }}>
          <div className="sec-no">№ —</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
            {isEn ? "Pricing" : "Tarifs"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              style={{
                borderRight: idx < tiers.length - 1 ? "1px solid var(--rule)" : "none",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                background: tier.highlight ? "var(--paper)" : "transparent",
                borderTop: tier.highlight ? `3px solid var(--accent-color)` : "3px solid transparent",
              }}
            >
              {tier.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 32,
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--accent-color)",
                    background: "var(--paper-2)",
                    padding: "4px 12px",
                    border: "1px solid var(--accent-color)",
                    transform: "translateY(-50%)",
                  }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: tier.highlight ? "var(--accent-color)" : "var(--muted-color)",
                  marginBottom: 8,
                }}
              >
                {tier.name}
              </div>
              <p style={{ fontSize: 12, color: "var(--muted-color)", marginBottom: 24, fontStyle: "italic" }}>
                {tier.tech}
              </p>

              {/* Price */}
              <div style={{ marginBottom: 32 }}>
                <div
                  className="ni-serif"
                  style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "var(--ink)", lineHeight: 1 }}
                >
                  {tier.price}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", letterSpacing: "0.08em", marginTop: 6 }}>
                  {tier.priceTagline}
                </div>
              </div>

              {/* Sections */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: tier.forProjectLabel, content: <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{tier.forProject}</p> },
                  { label: tier.stackLabel, content: <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>{tier.stackHtml}</p> },
                  {
                    label: tier.includedLabel,
                    content: (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                        {tier.included.map((item) => (
                          <li
                            key={item.text}
                            style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "var(--ink-2)" }}
                          >
                            <span style={{ color: "var(--accent-color)", fontFamily: "var(--mono)", fontSize: 11, marginTop: 1 }}>→</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ].map(({ label, content }) => (
                  <div
                    key={label}
                    style={{ borderTop: "1px solid var(--rule)", paddingTop: 20, paddingBottom: 20 }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--muted-color)",
                        marginBottom: 10,
                      }}
                    >
                      {label}
                    </div>
                    {content}
                  </div>
                ))}

                {tier.oeth && (
                  <div
                    style={{
                      borderTop: "1px solid var(--rule)",
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--accent-color)",
                        marginBottom: 8,
                      }}
                    >
                      {tier.oeth.title}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 10 }}>
                      {tier.oeth.text}
                    </p>
                    <Link
                      href="/avantage-oeth"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--accent-color)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {tier.oeth.cta}
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ marginTop: 32 }}>
                {tier.ctaExternal ? (
                  <a
                    href={tier.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    {tier.ctaLabel}
                    <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    href={tier.ctaHref as Parameters<typeof Link>[0]["href"]}
                    className={tier.highlight ? "btn primary" : "btn"}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center" }}
                  >
                    {tier.ctaLabel}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
