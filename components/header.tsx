"use client";

import * as React from "react";
import { X as CloseIcon, Menu as MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

const NAV_LINKS = [
  { key: "services",     href: "/services" },
  { key: "oethAdvantage",href: "/avantage-oeth" },
  { key: "demo",         href: "/demo" },
  { key: "tools",        href: "/outils" },
  { key: "caseStudies",  href: "/etudes-de-cas" },
  { key: "documentation",href: "/documentation" },
]

export default function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 var(--gutter, 32px)",
        }}
      >
        {/* Logotype */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--mono, monospace)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ color: "var(--accent-color)", fontSize: 10 }}>◼</span>
          NEXT IMPACT
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex"
          style={{ flex: 1, justifyContent: "center", gap: 0 }}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href as Parameters<typeof Link>[0]["href"]}
              style={{
                fontFamily: "var(--mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink)",
                textDecoration: "none",
                padding: "0 14px",
                height: 56,
                display: "flex",
                alignItems: "center",
                borderBottom: "2px solid transparent",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)";
              }}
            >
              {t(item.key as Parameters<typeof t>[0])}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden lg:flex" style={{ alignItems: "center", gap: 16 }}>
          <LocaleSwitcher />
          <Link href="/contact" className="btn primary" style={{ height: 36 }}>
            {t("contact")}
          </Link>
        </div>

        {/* Mobile right */}
        <div className="flex lg:hidden" style={{ marginLeft: "auto", alignItems: "center", gap: 12 }}>
          <LocaleSwitcher />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label={t("openMenu")}
            style={{
              border: "1px solid var(--rule)",
              background: "none",
              cursor: "pointer",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MenuIcon style={{ width: 18, height: 18, color: "var(--ink)" }} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 48,
              background: "rgba(14,14,12,0.3)",
            }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "min(320px, 85vw)",
              zIndex: 49,
              background: "var(--paper)",
              borderRight: "1px solid var(--rule)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                height: 56,
                borderBottom: "1px solid var(--rule)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "var(--accent-color)", fontSize: 9 }}>◼</span>
                NEXT IMPACT
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={t("closeMenu")}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <CloseIcon style={{ width: 18, height: 18, color: "var(--ink)" }} />
              </button>
            </div>

            <nav style={{ flex: 1, overflowY: "auto" }}>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--mono, monospace)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    textDecoration: "none",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--mono, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  background: "var(--accent-color)",
                  textDecoration: "none",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                {t("contact")}
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
