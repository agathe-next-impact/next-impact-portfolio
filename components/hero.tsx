"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import AiAuditBannerSVG from "./AiAuditBannerSVG";
import EligibilityForm from "@/components/tarifs/EligibilityForm";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getHeroVariants } from "@/lib/homepage-profiles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import HeroMockup from "@/components/HeroMockup";

export default function Hero() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const heroVariants = getHeroVariants(locale);
  const variant = profileId ? heroVariants[profileId] : heroVariants.default;

  return (
    <>
      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0 96px",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div className="container">
          {/* Sec-head */}
          <div className="sec-head" style={{ marginBottom: 48 }}>
            <div className="sec-no">№ 01</div>
            <AnimatePresence mode="wait">
              <motion.h1
                key={profileId || "default"}
                className="ni-serif"
                style={{
                  fontSize: "clamp(36px, 5vw, 80px)",
                  lineHeight: 1.0,
                  margin: 0,
                  color: "var(--ink)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {variant.headline}{" "}
                <em style={{ color: "var(--accent-color)" }}>{variant.subHeadline}</em>
              </motion.h1>
            </AnimatePresence>
            <div className="sec-meta">Studio · Fig. 01</div>
          </div>

          {/* 2-col grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 48,
              borderTop: "1px solid var(--rule)",
              paddingTop: 40,
              alignItems: "start",
            }}
          >
            {/* Left — text */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desc-${profileId || "default"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", marginBottom: 12, maxWidth: 540 }}>
                    {variant.description}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--muted-color)",
                      fontStyle: "italic",
                      fontFamily: "var(--serif)",
                      marginBottom: 36,
                      maxWidth: 540,
                    }}
                  >
                    {variant.valueProposition}
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Link href={variant.ctaPrimary.href as Parameters<typeof Link>[0]["href"]} className="btn primary">
                      {variant.ctaPrimary.label}
                    </Link>
                    <Link href={variant.ctaSecondary.href as Parameters<typeof Link>[0]["href"]} className="btn">
                      {variant.ctaSecondary.label}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Tech logos */}
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  marginTop: 48,
                  paddingTop: 24,
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <Image
                  src="/img/logo-wordpress-small.webp"
                  alt={t("wordpressLogoAlt")}
                  width={36}
                  height={48}
                  style={{ opacity: 0.6 }}
                  priority
                />
                <Image
                  src="/img/logo-nextjs.webp"
                  alt={t("nextjsLogoAlt")}
                  width={64}
                  height={64}
                  style={{ opacity: 0.6 }}
                  priority
                />
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                  }}
                >
                  Stack technique
                </span>
              </div>
            </div>

            {/* Right — mockup */}
            <div style={{ position: "relative" }}>
              <HeroMockup />
              {/* Disponible badge */}
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  right: 0,
                  background: "var(--paper)",
                  border: "1px solid var(--rule)",
                  padding: "4px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span className="status-dot" />
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                  }}
                >
                  {t("available")}
                </span>
              </div>
              {/* TIH mention */}
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                  }}
                >
                  {t("tihMention")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2 — Diagnostic de stack ─────────────────────────── */}
      <section
        id="audit"
        style={{
          background: "var(--paper-2)",
          padding: "80px 0",
          borderBottom: "1px solid var(--rule)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background SVG décor */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            opacity: 0.07,
            pointerEvents: "none",
          }}
        >
          <AiAuditBannerSVG />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="sec-head">
            <div className="sec-no">№ 02</div>
            <h2
              className="ni-serif"
              style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}
            >
              {variant.auditTitle}
            </h2>
            <div className="sec-meta">Diagnostic · Fig. 02</div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontSize: 18,
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                color: "var(--accent-color)",
                marginBottom: 8,
              }}
            >
              {variant.auditSubtitle}
            </p>
            <p style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: 600 }}>
              {variant.auditDescription}
            </p>
          </div>

          <EligibilityForm />
        </div>
      </section>
    </>
  );
}
