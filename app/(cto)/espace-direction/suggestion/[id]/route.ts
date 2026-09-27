import { NextResponse, type NextRequest } from "next/server";
import { record } from "@cto/access";
import { currentSession, ESPACE_PATH } from "../../session";

export const dynamic = "force-dynamic";

/** Seules destinations admises : une page de l'espace, ou un message à Agathe. */
const CONTACT = "mailto:agathe@next-impact.digital?";

/**
 * Le bouton de la carte « Prochaine étape » : consigne le clic, puis mène là
 * où la suggestion l'annonçait.
 *
 * `vers` vient de l'URL : il est contrôlé ici, jamais suivi aveuglément — une
 * redirection ouverte depuis un espace client servirait d'appât parfait. Hors
 * de l'espace ou de l'adresse d'Agathe, on retombe sur l'accueil.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vers = request.nextUrl.searchParams.get("vers") ?? "";
  const admise = vers.startsWith(`${ESPACE_PATH}/`) || vers.startsWith(CONTACT);
  const cible = admise ? vers : ESPACE_PATH;

  const session = await currentSession();
  if (session && admise) {
    await record({
      event: "suggestion_cliquee",
      personId: session.person.id,
      clientId: session.person.clientId,
      detail: id.slice(0, 80),
    });
  }

  // Une adresse mailto ne se résout pas contre l'origine : on la pose telle
  // quelle dans Location, le navigateur ouvre la messagerie.
  if (cible.startsWith("mailto:")) {
    return new NextResponse(null, { status: 303, headers: { Location: cible } });
  }
  return NextResponse.redirect(new URL(cible, request.nextUrl.origin), 303);
}
