"use client";

import { Link } from "@/i18n/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function AuditContextualBanner() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  return (
    <section className="mt-12 rounded-2xl border border-coral/20 bg-gradient-to-r from-darkblue/60 to-mediumblue/40 backdrop-blur-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10 border border-coral/20 shrink-0">
          <Zap className="h-7 w-7 text-coral" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-googletitre text-xl md:text-2xl font-medium text-white mb-1">
            {isEn ? "Is your current site performing?" : "Votre site actuel est-il performant ?"}
          </h3>
          <p className="text-sm text-white/60 font-googletexte">
            {isEn
              ? "Compare your site's performance with a Headless site."
              : "Comparez les performances de votre site avec celles d'un site Headless."}
          </p>
        </div>
        <Link
          href="/audit-site-ia"
          className="inline-flex items-center gap-2 rounded-full bg-transparent border-2 border-coral/50 text-coral px-5 py-2.5 text-sm font-googletitre font-semibold hover:bg-coral/10 hover:border-coral transition-all duration-300 shrink-0"
        >
          {isEn ? "Start my free audit" : "Lancer mon audit gratuit"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
