// Libellés visibles des catégories de documentation (dossiers de contenu).
// Alignés sur les titres de la grille « Explorer la documentation »
// (components/documentation/cross-category-nav.tsx).

import type { Locale } from "@/i18n/routing";

export const DOC_CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  "wordpress-headless": { fr: "Headless CMS", en: "Headless CMS" },
  "applications-web-mobile": { fr: "Web app & plateforme", en: "Web app & platform" },
  "design-ui-ux": { fr: "Design & UI/UX", en: "Design & UI/UX" },
  "marketing-digital": { fr: "Marketing Digital", en: "Digital marketing" },
  seo: { fr: "SEO", en: "SEO" },
  "projet-site-web": { fr: "Projet de site web", en: "Web project" },
  wordpress: { fr: "WordPress", en: "WordPress" },
};

export function docCategoryLabel(category: string, locale: Locale | string): string {
  const entry = DOC_CATEGORY_LABELS[category];
  if (!entry) {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
  }
  return locale === "en" ? entry.en : entry.fr;
}
