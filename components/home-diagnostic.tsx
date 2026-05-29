"use client";

import EligibilityForm from "@/components/tarifs/EligibilityForm";
import { useLocale } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";

export default function HomeDiagnostic() {
  const locale = useLocale() as Locale;
  const variant = getHeroVariants(locale).default;

  return (
    <section
      id="audit"
      style={{
        background: "var(--paper-2)",
        padding: "80px 0",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 06</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
            {variant.auditTitle}
          </h2>
        </div>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 18, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink)", marginBottom: 8 }}>
            {variant.auditSubtitle}
          </p>
          <p style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: 600 }}>
            {variant.auditDescription}
          </p>
        </div>

        <EligibilityForm />
      </div>
    </section>
  );
}
