import { NextResponse, type NextRequest } from "next/server";
import { collectRestitution, renderRestitutionPdf } from "@cto/restitution";
import { currentSession, ESPACE_PATH } from "../session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Le dossier de restitution, en PDF, généré à la demande.
 *
 * Ouvert à toute personne connectée de l'accompagnement, quel que soit son
 * état (actif, suspendu, restitution) : un client n'a pas à attendre la fin
 * du contrat pour emporter ce qu'il a payé. Un espace `clos` n'a plus de
 * session, donc plus d'export — c'est la fin de la fenêtre de restitution.
 *
 * Généré à chaque appel et jamais mis en cache : le dossier doit refléter
 * l'état publié à l'instant où on le télécharge, pas celui d'hier.
 */
export async function GET(request: NextRequest) {
  const session = await currentSession();
  if (!session) return NextResponse.redirect(new URL(ESPACE_PATH, request.url));

  const data = await collectRestitution(session.person.clientId);
  const pdf = renderRestitutionPdf(data);

  const slug = data.company
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const date = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(data.generatedAt);

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="restitution-${slug || "espace"}-${date}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
