"use client";

import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA_BY_PROFILE = {
  default: {
    label: "Discuter de votre projet",
    href: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    external: true,
  },
  decideur: {
    label: "Évaluer mon projet",
    href: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    external: true,
  },
  utilisateur: {
    label: "Voir une démo",
    href: "/demo",
    external: false,
  },
  developpeur: {
    label: "Voir la documentation",
    href: "/documentation",
    external: false,
  },
} as const;

export default function CaseStudyCTA() {
  const { profileId } = useDocumentationMode();
  const cta = profileId ? CTA_BY_PROFILE[profileId] : CTA_BY_PROFILE.default;

  return (
    <Button
      className="md:flex gap-1 rounded-full px-6 bg-regularblue hover:bg-regularblue/80 text-white hover:text-white transition-all duration-900 ease-in-out"
      asChild
    >
      <Link
        href={cta.href}
        {...(cta.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {cta.label}
      </Link>
    </Button>
  );
}
