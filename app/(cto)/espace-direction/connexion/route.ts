import { NextResponse, type NextRequest } from "next/server";
import { accessDecision, consumeMagicLink, findPersonById, record } from "@cto/access";
import { ESPACE_PATH, openSessionCookie } from "../session";

// ─────────────────────────────────────────────────────────────────────────────
// Consommation d'un lien de secours.
//
// **Route Handler et non page, par obligation.** Ouvrir la session pose un
// cookie, et Next ne l'autorise que dans une action serveur ou un Route
// Handler : pendant le rendu d'une page, l'écriture lève. La solution évidente
// — un écran « cliquez pour confirmer » dont le bouton appelle une action — a
// été écartée : elle ajoute un clic à CHAQUE connexion, sur le parcours de
// secours de quelqu'un qui a déjà perdu sa passkey. Ici, le lien ouvre l'espace
// et rien d'autre.
//
// Ce que le passage en route coûte, et qui est assumé : l'écran d'échec soigné
// disparaît au profit d'un message porté par l'écran de connexion, qui sait déjà
// afficher une erreur et propose immédiatement d'en redemander un.
//
// L'ordre des contrôles n'est pas négociable : consommer, PUIS vérifier que
// l'accès est encore ouvert. Un jeton valide sur un espace clos doit être brûlé
// quand même, sinon il resterait rejouable indéfiniment.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  absent: "Ce lien est incomplet.",
  malformé: "Ce lien est incomplet.",
  signature: "Ce lien n'est pas valide.",
  expiré: "Ce lien a expiré. Les liens de connexion ne durent que quinze minutes.",
  consommé: "Ce lien a déjà servi. Chaque lien ne fonctionne qu'une fois.",
  révoqué: "Cet accès a été révoqué.",
  clos: "Cet espace est clos.",
};

/**
 * Renvoie à l'écran de connexion avec le motif du refus.
 *
 * `nextUrl.clone()` plutôt qu'une URL reconstruite : c'est la seule forme qui
 * conserve l'hôte et le protocole vus par le client derrière le proxy de Vercel.
 */
function refuser(request: NextRequest, reason: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = ESPACE_PATH;
  url.search = "";
  url.searchParams.set("erreur", "1");
  url.searchParams.set("message", MESSAGES[reason] ?? "Ce lien n'est pas valide.");
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const jeton = request.nextUrl.searchParams.get("jeton") ?? undefined;

  const outcome = await consumeMagicLink(jeton);
  if (!outcome.ok) {
    await record({ event: "acces_refuse", detail: `lien ${outcome.reason}` });
    return refuser(request, outcome.reason);
  }

  const person = await findPersonById(outcome.personId);
  if (!person) {
    await record({ event: "acces_refuse", detail: "personne révoquée" });
    return refuser(request, "révoqué");
  }

  const decision = accessDecision(person.status);
  if (!decision.allowed) {
    await record({
      event: "acces_refuse",
      personId: person.id,
      clientId: person.clientId,
      detail: `espace ${person.status}`,
    });
    return refuser(request, "clos");
  }

  const cookie = await openSessionCookie(person.id);
  await record({
    event: "connexion_lien",
    personId: person.id,
    clientId: person.clientId,
  });

  const url = request.nextUrl.clone();
  url.pathname = ESPACE_PATH;
  url.search = "";

  const response = NextResponse.redirect(url);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
