import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

// Le seul domaine qui doit être indexé. Les logs de production du 2026-08-16
// montrent le même déploiement servi sur trois hôtes — www.next-impact.digital,
// www.agat.dev et l'URL brute *.vercel.app — et crawlé sur les trois
// (GeedoShopProductFinder sur agat.dev, HeadlessChrome sur .vercel.app). Les
// canonicals pointent bien ici, mais un canonical est un conseil : il ne coûte
// rien d'être explicite. Tout hôte non canonique répond en noindex.
//
// Ceci empêche l'indexation, pas la consultation : agat.dev reste navigable
// pour les tests. Pour consolider vraiment les signaux, poser en plus une
// redirection de domaine dans Vercel → Domains.
const CANONICAL_HOST = "www.next-impact.digital";

export default function proxy(request: NextRequest) {
  const response = handleI18n(request);

  const host = request.headers.get("host")?.toLowerCase();
  if (host && host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

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
