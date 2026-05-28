"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export default function HomeTihTeaser() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 40,
            alignItems: "center",
            borderTop: "1px solid var(--rule)",
            paddingTop: 32,
          }}
        >
          {/* Badge */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-color)" }}>
              {isEn ? "OETH benefit · TIH" : "Avantage OETH · TIH"}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--muted-color)" }}>
              {isEn ? "Art. D.5212-7 Labour Code" : "Art. D.5212-7 Code du travail"}
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(18px, 2vw, 28px)", lineHeight: 1.15, color: "var(--ink)", marginBottom: 8 }}>
              {isEn
                ? <>30% of labor cost <em style={{ color: "var(--accent-color)" }}>deductible from your AGEFIPH contribution</em></>
                : <>30 % du coût de main-d'œuvre <em style={{ color: "var(--accent-color)" }}>déductible de votre contribution AGEFIPH</em></>}
            </h2>
            <p style={{ fontSize: 13, color: "var(--ink-2)", maxWidth: 560, lineHeight: 1.6 }}>
              {isEn
                ? "Every Next Impact engagement qualifies for the AGEFIPH deduction as a TIH provider (disabled independent worker) — whatever the stack: WordPress, Headless or custom application."
                : "Toute prestation Next Impact ouvre droit à la déduction AGEFIPH en tant que prestataire TIH — quelle que soit la stack : WordPress, Headless ou application sur-mesure."}
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/avantage-oeth"
            className="btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            {isEn ? "Learn more" : "En savoir plus"}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
