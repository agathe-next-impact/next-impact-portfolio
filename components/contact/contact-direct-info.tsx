"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function ContactDirectInfo() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  return (
    <div className="h-full bg-jet px-6 py-8 lg:px-8 lg:py-10">
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
        {isEn ? "Prefer a direct conversation?" : "Vous préférez un échange direct ?"}
      </p>

      <p className="text-[15px] font-medium text-foreground">
        Agathe Karinthi-Martin{" "}
        <span className="font-normal text-mid-gray">— Next Impact Digital</span>
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <a
          href="mailto:agathe@next-impact.digital"
          className="group inline-flex items-center gap-2 font-inter-tight text-sm text-mid-gray transition-colors hover:text-foreground"
        >
          <Mail size={14} className="shrink-0 text-accent-secondary" />
          agathe@next-impact.digital
        </a>
        <a
          href="tel:0673981638"
          className="group inline-flex items-center gap-2 font-inter-tight text-sm text-mid-gray transition-colors hover:text-foreground"
        >
          <Phone size={14} className="shrink-0 text-accent-secondary" />
          06 73 98 16 38
        </a>
        <span className="inline-flex items-center gap-2 font-inter-tight text-sm text-mid-gray">
          <MapPin size={14} className="shrink-0" />
          {isEn ? "4 rue du centre, 15400 Trizac, France" : "4 rue du centre, 15400 Trizac"}
        </span>
      </div>
    </div>
  );
}
