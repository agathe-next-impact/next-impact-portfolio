import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Pas de négociation d'Accept-Language. Avec la détection active, toute
  // machine qui n'annonce pas le français — la majorité des crawlers, dont
  // PetalBot observé en production le 2026-08-16 sur /mentions-legales — est
  // renvoyée en 307 vers /en. Les pages FR, qui portent le business, étaient
  // donc crawlées en anglais. Le français est la langue par défaut : elle se
  // sert telle quelle, la bascule EN reste explicite (sélecteur de langue).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
