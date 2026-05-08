"use client";

import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <Button
        className="md:flex gap-1 rounded-full px-6 bg-regularblue text-darkblue md:text-lg transition-all duration-300 ease-in-out"
        asChild
      >
        <Link
          href={cta.href}
          className="text-white"
          {...(cta.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {t(cta.labelKey)}
        </Link>
      </Button>
    </div>
  );
}
