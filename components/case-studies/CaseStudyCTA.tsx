"use client";

import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const CTA_TARGETS = {
  default: {
    href: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    external: true,
    labelKey: "default" as const,
  },
  decideur: {
    href: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    external: true,
    labelKey: "decideur" as const,
  },
  utilisateur: {
    href: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    external: true,
    labelKey: "utilisateur" as const,
  },
  developpeur: {
    href: "/documentation",
    external: false,
    labelKey: "developpeur" as const,
  },
} as const;

export default function CaseStudyCTA() {
  const { profileId } = useDocumentationMode();
  const t = useTranslations("caseStudyDetail.cta");
  const cta = profileId ? CTA_TARGETS[profileId] : CTA_TARGETS.default;

  return (
    cta.external ? (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {t(cta.labelKey)} <ArrowRight size={13} />
      </a>
    ) : (
      <Link href={cta.href as any} className="btn primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {t(cta.labelKey)} <ArrowRight size={13} />
      </Link>
    )
  );
}
