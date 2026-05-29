"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import HeroMockup from "@/components/HeroMockup";

export default function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const variant = getHeroVariants(locale).default;
  const isExternal = variant.ctaPrimary.href.startsWith("http");

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
            <h1
              className="ni-serif"
              style={{
                fontSize: "clamp(36px, 5vw, 80px)",
                lineHeight: 1.0,
                margin: 0,
                color: "var(--ink)",
              }}
            >
              {variant.headline}{" "}
              <em style={{ color: "var(--ink)" }}>{variant.subHeadline}</em>
            </h1>
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
                {isExternal ? (
                  <a
                    href={variant.ctaPrimary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn primary"
                  >
                    {variant.ctaPrimary.label}
                  </a>
                ) : (
                  <Link href={variant.ctaPrimary.href as Parameters<typeof Link>[0]["href"]} className="btn primary">
                    {variant.ctaPrimary.label}
                  </Link>
                )}
                <Link href={variant.ctaSecondary.href as Parameters<typeof Link>[0]["href"]} className="btn">
                  {variant.ctaSecondary.label}
                </Link>
              </div>

              {/* Tech logos — preuve discrète (la techno comme garantie, pas comme promesse) */}
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
                  {locale === "en"
                    ? "Technology: WordPress Headless + Next.js"
                    : "Technologie : WordPress Headless + Next.js"}
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
    </>
  );
}
