import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { previewApercuEmail, previewNewsletterEmail } from "@sentinelle/emails/render";
import { isApercuLettre, type ScanResult } from "@sentinelle/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Id = z.string().uuid();

/**
 * La lettre-échantillon d'une analyse, rendue dans le gabarit e-mail de
 * l'abonnement — la démo « telle que reçue » affichée en iframe sur le rapport
 * `/scan/[id]`, comme l'admin prévisualise les vrais numéros.
 *
 * 404 tant que l'aperçu n'est pas prêt : le front n'affiche l'iframe qu'une
 * fois `apercu.status === "done"`, la route n'a donc pas d'état d'attente.
 */
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!Id.safeParse(id).success) {
    return new Response("identifiant invalide", { status: 400 });
  }

  const [scan] = await db()
    .select({ status: scans.status, result: scans.result })
    .from(scans)
    .where(eq(scans.id, id));

  if (!scan || scan.status !== "done") {
    return new Response("analyse introuvable", { status: 404 });
  }

  const result = scan.result as ScanResult | null;
  const apercu = result?.apercu;
  if (!result || !apercu || apercu.status !== "done") {
    return new Response("lettre indisponible", { status: 404 });
  }

  // Forme actuelle (vrai numéro, gabarit abonné) ou héritée (cinq thèmes) —
  // pas de lien de rapport dans l'iframe : la page est déjà le rapport.
  const html = isApercuLettre(apercu)
    ? await previewNewsletterEmail({
        lettre: apercu.lettre,
        siteUrl: result.url,
        issueDate: new Date(apercu.genereLe),
        echantillon: {},
      })
    : await previewApercuEmail({
        apercu,
        siteUrl: result.url,
        genereLe: new Date(apercu.genereLe),
      });

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Même règle que la page rapport : un rapport concerne le site de
      // quelqu'un, jamais indexé.
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
