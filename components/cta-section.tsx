"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import type { ProfileId } from "@/lib/documentation-profiles";
import {
  ArrowRight,
  Search,
  ClipboardCheck,
  Download,
  Mail,
  Phone,
  MapPin,
  CircleDot,
  Award,
  Clock,
  BadgePercent,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Shared card shell
   ───────────────────────────────────────────── */
function CTACard({
  badgeIcon: Icon,
  badge,
  title,
  description,
  ctaHref,
  ctaLabel,
  ctaIsDownload,
  footer,
}: {
  badgeIcon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  badge: string;
  title: string;
  description: React.ReactNode;
  ctaHref: string;
  ctaLabel: string;
  ctaIsDownload?: boolean;
  footer: string;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent-color)",
          marginBottom: 20,
        }}
      >
        <Icon size={12} />
        {badge}
      </div>

      <h3
        className="ni-serif"
        style={{
          fontSize: "clamp(20px, 2.5vw, 28px)",
          lineHeight: 1.1,
          color: "var(--ink)",
          marginBottom: 12,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--ink-2)",
          marginBottom: 28,
          flex: 1,
        }}
      >
        {description}
      </div>

      <div>
        {ctaIsDownload ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Download size={14} />
            {ctaLabel}
          </a>
        ) : (
          <Link
            href={ctaHref as Parameters<typeof Link>[0]["href"]}
            className="btn primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            {ctaLabel}
            <ArrowRight size={14} />
          </Link>
        )}
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.08em",
            color: "var(--muted-color)",
            marginTop: 10,
          }}
        >
          {footer}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   1. CTA Lead Magnet — AI Audit
   ───────────────────────────────────────────── */
function CTALeadMagnet() {
  const t = useTranslations("ctaSection.audit");
  return (
    <CTACard
      badgeIcon={Search}
      badge={t("badge")}
      title={t("title")}
      description={
        <>
          {t("subtitleStart")}{" "}
          <em style={{ color: "var(--accent-color)" }}>{t("subtitleHighlight")}</em>{" "}
          {t("subtitleEnd")}
        </>
      }
      ctaHref="/audit-site-ia"
      ctaLabel={t("ctaLabel")}
      footer={t("footer")}
    />
  );
}

/* ─────────────────────────────────────────────
   2. CTA Conversion
   ───────────────────────────────────────────── */
function CTAConversion() {
  const t = useTranslations("ctaSection.conversion");
  return (
    <CTACard
      badgeIcon={ClipboardCheck}
      badge={t("badge")}
      title={t("title")}
      description={
        <>
          {t("promiseStart")}{" "}
          <strong style={{ color: "var(--ink)" }}>{t("promiseHighlight")}</strong>
          {t("promiseEnd")}
          {t("secondary") && (
            <span style={{ display: "block", marginTop: 8, color: "var(--muted-color)" }}>
              {t("secondary")}
            </span>
          )}
        </>
      }
      ctaHref="/services/eligibilite"
      ctaLabel={t("ctaLabel")}
      footer={t("footer")}
    />
  );
}

/* ─────────────────────────────────────────────
   2b. CTA ROI Simulator + 2c. CTA Benchmarking
   ─────────────────────────────────────────────
   Disabled — see next.config.mjs `disabledTools` redirects.
   Cards removed from CARD_COMPONENTS/PROFILE_CARDS below. */

/* ─────────────────────────────────────────────
   3. Reassurance block — direct contact
   ───────────────────────────────────────────── */
export function BlocReassurance() {
  const t = useTranslations("ctaSection.reassurance");
  return (
    <div style={{ border: "1px solid var(--rule)", padding: "40px 48px" }}>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
            marginBottom: 12,
          }}
        >
          {t("directContact")}
        </div>
        <h3
          className="ni-serif"
          style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, marginBottom: 8 }}
        >
          {t("title")}
        </h3>
        <p style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: 480 }}>
          {t("subtitle")}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 32,
          paddingBottom: 32,
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {[
          { icon: CircleDot, label: t("available"), accent: true },
          { icon: Clock, label: t("experience") },
          { icon: Award, label: t("wpHeadlessDev") },
          { icon: BadgePercent, label: t("tih") },
        ].map(({ icon: Icon, label, accent }) => (
          <span
            key={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent ? "var(--accent-color)" : "var(--ink-2)",
              border: "1px solid var(--rule)",
              padding: "6px 12px",
            }}
          >
            <Icon size={12} />
            {label}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 32,
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 600,
              fontSize: 15,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            {t("company")}
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 8 }}>
            {t("owner")}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              fontSize: 13,
              color: "var(--ink-2)",
            }}
          >
            <MapPin size={13} style={{ marginTop: 1, flexShrink: 0 }} />
            {t("address")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a
            href="mailto:agathe@next-impact.digital"
            className="btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13 }}
          >
            <Mail size={13} />
            agathe@next-impact.digital
          </a>
          <a
            href="tel:0673981638"
            className="btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13 }}
          >
            <Phone size={13} />
            06 73 98 16 38
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card selection per profile / context
   ───────────────────────────────────────────── */
type CardId = "audit" | "conversion";

const CARD_COMPONENTS: Record<CardId, React.FC> = {
  audit: CTALeadMagnet,
  conversion: CTAConversion,
};

const CARD_PAGES: Record<CardId, string[]> = {
  audit: ["/audit-site-ia", "/documentation/headless-cms"],
  conversion: ["/contact"],
};

const PROFILE_CARDS: Record<ProfileId | "default", CardId[]> = {
  decideur:    ["conversion", "audit"],
  utilisateur: ["conversion", "audit"],
  developpeur: ["audit", "conversion"],
  default:     ["conversion", "audit"],
};

const TOOL_CARDS: CardId[] = ["audit", "conversion"];

const TOOL_PAGE_PREFIXES = [
  "/outils",
  "/audit-site-ia",
  "/tarifs",
  "/documentation/headless-cms",
];

function isToolPage(pathname: string) {
  return TOOL_PAGE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function useSelectedCards(): [React.FC, React.FC] {
  const pathname = usePathname();
  const { profileId } = useDocumentationMode();

  const pool = isToolPage(pathname) ? TOOL_CARDS : PROFILE_CARDS[profileId ?? "default"];

  const available = pool.filter((id) =>
    !CARD_PAGES[id].some((p) => pathname === p || pathname.startsWith(p + "/"))
  );

  const first = available[0] ?? "conversion";
  const second = available[1] ?? "audit";

  return [CARD_COMPONENTS[first], CARD_COMPONENTS[second]];
}

/* ─────────────────────────────────────────────
   Export — full 2-card layout
   ───────────────────────────────────────────── */
export function CTASection() {
  const pathname = usePathname();
  const [CardA, CardB] = useSelectedCards();
  const t = useTranslations("ctaSection");

  if (pathname === "/outils") return null;

  return (
    <section
      style={{
        background: "var(--paper-2)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        padding: "80px 0",
      }}
    >
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ —</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, margin: 0 }}>
            {t("secondaryCTAHelper")}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 0,
            borderTop: "1px solid var(--rule)",
          }}
        >
          <div style={{ borderRight: "1px solid var(--rule)" }}>
            <CardA />
          </div>
          <div>
            <CardB />
          </div>
        </div>
      </div>
    </section>
  );
}
