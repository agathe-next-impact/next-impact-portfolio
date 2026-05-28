import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--rule-strong)",
        background: "var(--paper)",
        padding: "0 var(--gutter, 32px)",
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: "var(--container-w, 1200px)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          borderBottom: "1px solid var(--rule)",
          gap: 0,
        }}
        className="footer-grid"
      >
        {/* Col 1 — Identity */}
        <div
          style={{
            padding: "40px 0 40px",
            borderRight: "1px solid var(--rule)",
            paddingRight: 32,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 16,
            }}
          >
            Studio
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 20,
              color: "var(--ink)",
              marginBottom: 12,
            }}
          >
            {t("company")}
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
            {t("owner")}
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>
            {t("address")}
          </p>
        </div>

        {/* Col 2 — Navigation */}
        <div style={{ padding: "40px 32px", borderRight: "1px solid var(--rule)" }}>
          <div
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 16,
            }}
          >
            {t("usefulLinks")}
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { href: "/services",       key: "services" },
              { href: "/etudes-de-cas",  key: "caseStudies" },
              { href: "/documentation",  key: "documentation" },
              { href: "/blog",           key: "blog" },
              { href: "/avantage-oeth",  key: "oethAdvantage" },
              { href: "/a-propos",       key: "about" },
              { href: "/mentions-legales", key: "legalNotice" },
            ].map((item) => (
              <Link
                key={item.key}
                href={item.href as Parameters<typeof Link>[0]["href"]}
                style={{
                  fontFamily: "var(--mono, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {t(item.key as Parameters<typeof t>[0])}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Resources */}
        <div style={{ padding: "40px 32px", borderRight: "1px solid var(--rule)" }}>
          <div
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 16,
            }}
          >
            {t("resources")}
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { href: "/audit-site-ia",          key: "freeAiAudit" },
              { href: "/outils/simulateur-roi",  key: "roiSimulator" },
              { href: "/outils/benchmarking",    key: "benchmarking" },
              { href: "/contact",                key: "startWebApp" },
            ].map((item) => (
              <Link
                key={item.key}
                href={item.href as Parameters<typeof Link>[0]["href"]}
                style={{
                  fontFamily: "var(--mono, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {t(item.key as Parameters<typeof t>[0])}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 4 — Contact */}
        <div style={{ padding: "40px 0 40px 32px" }}>
          <div
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              marginBottom: 16,
            }}
          >
            {t("contactQuestion")}
          </div>
          <a
            href="mailto:agathe@next-impact.digital"
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--ink)",
              textDecoration: "none",
              display: "block",
              marginBottom: 8,
            }}
          >
            agathe@next-impact.digital
          </a>
          <a
            href="tel:0673981638"
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--ink)",
              textDecoration: "none",
              display: "block",
              marginBottom: 16,
            }}
          >
            06 73 98 16 38
          </a>
          <Link href="/contact" className="btn primary" style={{ height: 36, fontSize: 10 }}>
            {t("startWebApp")}
          </Link>
        </div>
      </div>

      {/* Colophon */}
      <div
        style={{
          maxWidth: "var(--container-w, 1200px)",
          margin: "0 auto",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
          }}
        >
          © {year} NEXT IMPACT DIGITAL
        </span>
        <span
          style={{
            fontFamily: "var(--mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
          }}
        >
          ED. {year} · VOL. 02
        </span>
        <span
          style={{
            fontFamily: "var(--mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
          }}
        >
          SET EN INSTRUMENT SERIF / GEIST
        </span>
        <a
          href="#__next"
          style={{
            fontFamily: "var(--mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
            textDecoration: "none",
          }}
        >
          ↑ HAUT DE PAGE
        </a>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
