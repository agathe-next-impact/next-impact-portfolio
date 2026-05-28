"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PricingCards } from "@/components/services/PricingCards";
import AppsSection from "@/components/services/AppsSection";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import { HeadlessExplainer } from "@/components/headless-explainer";
import PageLayout from "@/components/page-layout";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getServicesPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";

export default function ServicesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const servicesVariants = getServicesPageVariants(locale);
  const variant = profileId ? servicesVariants[profileId] : servicesVariants.default;
  const t = useTranslations("servicesPage");

  return (
    <PageLayout titre={variant.titre} sousTitre="">
      {/* Comprendre le WordPress Headless */}
      <section className="s">
        <div className="container">
          <HeadlessExplainer />
        </div>
      </section>

      {/* Pricing — Section 1 */}
      <PricingCards />

      {/* Comparison table */}
      <ServicesComparisonTable />

      {/* Apps sur-mesure — Section 2 */}
      <AppsSection />

      {/* CTA tertiaire — Simulateur ROI */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
              border: "1px solid var(--rule)",
              padding: "28px 32px",
              background: "var(--paper-2)",
            }}
          >
            <div>
              <h3 className="ni-serif" style={{ fontSize: "clamp(18px, 2vw, 26px)", marginBottom: 6, color: "var(--ink)" }}>
                {t("calculateGain.title")}
              </h3>
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
                {t("calculateGain.description")}
              </p>
            </div>
            <Link
              href="/outils/simulateur-roi"
              className="btn"
              style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {t("calculateGain.ctaLabel")}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Comment choisir sa stack */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ —</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, margin: 0 }}>
              {t("stackMethod.title")}
            </h2>
            <div className="sec-meta">{t("stackMethod.label")}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {[
              { src: "/icons/content-icon.svg", alt: t("stackMethod.scope.iconAlt"), title: t("stackMethod.scope.title"), desc: t("stackMethod.scope.description") },
              { src: "/icons/globe-network-icon.svg", alt: t("stackMethod.volume.iconAlt"), title: t("stackMethod.volume.title"), desc: t("stackMethod.volume.description") },
              { src: "/icons/eco-design-icon.svg", alt: t("stackMethod.scalability.iconAlt"), title: t("stackMethod.scalability.title"), desc: t("stackMethod.scalability.description") },
            ].map((card, i) => (
              <div
                key={card.title}
                style={{
                  padding: "40px 32px",
                  borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                }}
              >
                <Image src={card.src} alt={card.alt} width={32} height={32} style={{ marginBottom: 20, opacity: 0.7 }} />
                <h3 className="ni-serif" style={{ fontSize: 20, marginBottom: 10, color: "var(--ink)" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget / ROI — profil adaptatif */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ —</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, margin: 0 }}>
              {variant.budgetTitle}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {/* Left card */}
            <div style={{ padding: "40px 32px", borderRight: "1px solid var(--rule)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Image src="/icons/brand-reach-icon.svg" alt={t("budgetCardsAlt.left")} width={24} height={24} style={{ opacity: 0.7 }} />
                <h3 className="ni-serif" style={{ fontSize: 20, color: "var(--ink)" }}>
                  {variant.budgetCards.left.title}
                </h3>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 16 }}>
                {variant.budgetCards.left.description}
              </p>
              {variant.budgetCards.left.price && (
                <div className="ni-serif" style={{ fontSize: 40, color: "var(--accent-color)", lineHeight: 1 }}>
                  {variant.budgetCards.left.price}
                  <span style={{ fontSize: 18, color: "var(--ink-2)" }}> €</span>
                </div>
              )}
            </div>

            {/* Right card */}
            <div style={{ padding: "40px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Image src="/icons/rocket-icon.svg" alt={t("budgetCardsAlt.right")} width={24} height={24} style={{ opacity: 0.7 }} />
                <h3 className="ni-serif" style={{ fontSize: 20, color: "var(--ink)" }}>
                  {variant.budgetCards.right.title}
                </h3>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 16 }}>
                {variant.budgetCards.right.description}
              </p>
              {variant.budgetCards.right.highlight && (
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontSize: 15,
                    color: "var(--accent-color)",
                    borderLeft: "2px solid var(--accent-color)",
                    paddingLeft: 16,
                  }}
                >
                  {variant.budgetCards.right.highlight}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Shortcuts — Audit / Démo / Éligibilité */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {[
              { href: "/outils", src: "/icons/scan-icon.svg", alt: t("shortcuts.tools.iconAlt"), title: t("shortcuts.tools.title"), desc: t("shortcuts.tools.description") },
              { href: "/demo", src: "/icons/desktop-headless-icon.svg", alt: t("shortcuts.demo.iconAlt"), title: t("shortcuts.demo.title"), desc: t("shortcuts.demo.description") },
              { href: "/services/eligibilite", src: "/icons/optimize-icon.svg", alt: t("shortcuts.stack.iconAlt"), title: t("shortcuts.stack.title"), desc: t("shortcuts.stack.description") },
            ].map((card, i) => (
              <Link
                key={card.href}
                href={card.href as Parameters<typeof Link>[0]["href"]}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "40px 32px",
                    borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Image src={card.src} alt={card.alt} width={32} height={32} style={{ marginBottom: 20, opacity: 0.6 }} />
                  <h3 className="ni-serif" style={{ fontSize: 20, marginBottom: 8, color: "var(--ink)" }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 16 }}>
                    {card.desc}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "var(--accent-color)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    → {card.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <Process />
        </div>
      </section>

      {/* FAQ */}
      <ServicesFAQ faqs={variant.faqs} />
    </PageLayout>
  );
}
