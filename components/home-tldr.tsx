"use client";

// Cartouche « L'essentiel » de la home, juste avant la FAQ (ADR-024). Gabarit
// commun : components/en-bref.tsx. La classe `.home-tldr` sert de cible au
// SpeakableSpecification (JSON-LD).

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getHomeContent } from "@/lib/home-content";
import { EnBref } from "@/components/en-bref";

export default function HomeTldr() {
  const locale = useLocale() as Locale;
  const { tldr } = getHomeContent(locale);

  return <EnBref className="home-tldr" label={tldr.label} lines={tldr.lines} />;
}
