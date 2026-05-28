"use client";

import AiAuditBannerSVG from "./AiAuditBannerSVG";
import EligibilityForm from "@/components/tarifs/EligibilityForm";
import { useLocale } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getHeroVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";

export default function HomeDiagnostic() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const heroVariants = getHeroVariants(locale);
  const variant = profileId ? heroVariants[profileId] : heroVariants.default;

  return (
    <section
      id="audit"
      style={{
        background: "var(--paper-2)",
        padding: "80px 0",
        borderTop: "1px solid var(--rule)",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          <div className="sec-no">№ 06</div>
          <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
            {variant.auditTitle}
          </h2>
          <div className="sec-meta">Diagnostic · Fig. 06</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 18, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--accent-color)", marginBottom: 8 }}>
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
