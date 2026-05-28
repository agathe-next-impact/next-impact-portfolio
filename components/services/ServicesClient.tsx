"use client";

import { Link } from "@/i18n/navigation";
import { FileText, Globe, Leaf, ScanLine, Monitor, SlidersHorizontal, type LucideIcon } from "lucide-react";
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

      {/* § 01 — Comparatif des stacks */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <HeadlessExplainer />
        </div>
      </section>

      {/* § 02 — Tarifs */}
      <PricingCards />

      {/* § 03 — Tableau comparatif */}
      <ServicesComparisonTable />

      {/* § 04 — Comment choisir */}
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
            {([
              { Icon: FileText,  title: t("stackMethod.scope.title"),       desc: t("stackMethod.scope.description") },
              { Icon: Globe,     title: t("stackMethod.volume.title"),      desc: t("stackMethod.volume.description") },
              { Icon: Leaf,      title: t("stackMethod.scalability.title"), desc: t("stackMethod.scalability.description") },
            ] as { Icon: LucideIcon; title: string; desc: string }[]).map((card, i) => (
              <div key={card.title} style={{ padding: "40px 32px", borderRight: i < 2 ? "1px solid var(--rule)" : "none" }}>
                <card.Icon size={24} style={{ marginBottom: 20, color: "var(--muted-color)", display: "block" }} strokeWidth={1.5} />
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

      {/* § 05 — Stack sur-mesure (web app) */}
      <AppsSection />

      {/* § 06 — Méthode */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <Process />
        </div>
      </section>

      {/* § 07 — FAQ */}
      <ServicesFAQ faqs={variant.faqs} />

      {/* § 08 — Raccourcis */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {([
              { href: "/outils",               Icon: ScanLine,  title: t("shortcuts.tools.title"), desc: t("shortcuts.tools.description") },
              { href: "/demo",                 Icon: Monitor,   title: t("shortcuts.demo.title"),  desc: t("shortcuts.demo.description") },
              { href: "/services/eligibilite", Icon: SlidersHorizontal, title: t("shortcuts.stack.title"), desc: t("shortcuts.stack.description") },
            ] as { href: string; Icon: LucideIcon; title: string; desc: string }[]).map((card, i) => (
              <Link key={card.href} href={card.href as Parameters<typeof Link>[0]["href"]} style={{ display: "block", textDecoration: "none" }}>
                <div
                  style={{ padding: "40px 32px", borderRight: i < 2 ? "1px solid var(--rule)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <card.Icon size={24} style={{ marginBottom: 20, color: "var(--muted-color)", display: "block" }} strokeWidth={1.5} />
                  <h3 className="ni-serif" style={{ fontSize: 20, marginBottom: 8, color: "var(--ink)" }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 16 }}>
                    {card.desc}
                  </p>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em", color: "var(--accent-color)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    → {card.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
