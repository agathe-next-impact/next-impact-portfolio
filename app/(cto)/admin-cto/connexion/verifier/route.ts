import { NextResponse, type NextRequest } from "next/server";
import { consumeAdminMagicLink } from "@cto/admin";
import { HOME_PATH, LOGIN_PATH, openSessionCookie } from "../../session";

// ─────────────────────────────────────────────────────────────────────────────
// Consommation du lien de secours admin.
//
// Route Handler et non page, pour la même raison que côté client (voir
// `espace-direction/connexion/route.ts`) : ouvrir la session pose un cookie, ce
// que Next interdit pendant le rendu d'une page.
//
// Chemin séparé de `/admin-cto/connexion` (la page de connexion) : App Router
// n'autorise pas qu'une page et une route se disputent le même segment.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

function refuser(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  url.searchParams.set("erreur", "1");
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const jeton = request.nextUrl.searchParams.get("jeton") ?? undefined;

  const outcome = await consumeAdminMagicLink(jeton);
  if (!outcome.ok) return refuser(request);

  const cookie = await openSessionCookie();

  const url = request.nextUrl.clone();
  url.pathname = HOME_PATH;
  url.search = "";

  const response = NextResponse.redirect(url);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
