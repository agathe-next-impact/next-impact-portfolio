import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except API, Next internals, static files,
  // and SEO route handlers (sitemap, robots, llms, manifest).
  //
  // `scan|admin|espace` : routes du produit Sentinelle (app/(sentinelle)/),
  // volontairement non localisées. Sans cette exclusion, next-intl réécrit
  // /scan en /fr/scan (localePrefix "as-needed") — route inexistante → 404.
  // Voir docs/sentinelle/plan-mise-en-oeuvre.md §2 (E1).
  matcher: [
    "/((?!api|_next|_vercel|scan|admin|espace|sitemap.xml|robots.txt|llms.txt|manifest.webmanifest|favicon.ico|.*\\..*).*)",
  ],
};
