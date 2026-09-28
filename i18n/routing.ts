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

/**
 * Version anglaise publiée ou non (décision d'Agathe du 2026-09-28 : fermée).
 *
 * À false : toute URL /en… redirige en 301 vers son équivalent français
 * (next.config.mjs), le sélecteur de langue disparaît, aucune page n'annonce
 * de hreflang en-US et le sitemap ne liste que les URL françaises. Le code et
 * les traductions restent en place : repasser à true suffit à rouvrir l'anglais
 * (penser alors à retirer la redirection de next.config.mjs, qui lit ce
 * drapeau, et à redéployer).
 */
export const ENGLISH_PUBLISHED = false;

/** Les langues réellement publiées. */
export const PUBLISHED_LOCALES: Locale[] = ENGLISH_PUBLISHED ? [...routing.locales] : ["fr"];
