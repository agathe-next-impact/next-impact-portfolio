"use client";

import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <Button
        className="md:flex gap-1 rounded-full px-6 bg-regularblue text-darkblue md:text-lg transition-all duration-300 ease-in-out"
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
      <Link
        href="/ressources/livre_blanc_wp_headless.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors font-googletexte"
      >
        <FileText className="w-3.5 h-3.5" />
        Comprendre WordPress Headless
      </Link>
    </div>
  );
}
