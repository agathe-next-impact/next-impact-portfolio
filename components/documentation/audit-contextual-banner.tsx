"use client";

import { Link } from "@/i18n/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/reveal";

export function AuditContextualBanner() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <Reveal
      as="section"
      className="mt-10 flex flex-wrap items-center gap-6 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 p-6 px-8"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
        <Zap className="h-[1.125rem] w-[1.125rem] text-accent-secondary" />
      </div>

      <div className="min-w-[12rem] flex-1">
        <h3 className="mb-1 text-lg font-light tracking-tight text-foreground">
          {isEn ? "Which path for your project?" : "Quelle voie pour votre projet ?"}
        </h3>
        <p className="font-inter-tight text-sm text-mid-gray">
          {isEn
            ? "Answer a few questions and get a clear recommendation in 2 minutes."
            : "Répondez à quelques questions et obtenez une recommandation claire en 2 minutes."}
        </p>
      </div>

      <Link
        href="/services/eligibilite"
        className="group inline-flex flex-shrink-0 items-center gap-1.5 border border-accent-deep bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-white no-underline transition-colors hover:bg-accent/90"
      >
        {isEn ? "Run the diagnostic" : "Lancer le diagnostic"}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}
