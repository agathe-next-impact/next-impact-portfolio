import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { envoyerAudit } from "@sentinelle/audit";
import { undeliverableReason } from "@sentinelle/emails/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Id = z.string().uuid();
const Body = z.object({ email: z.string().trim().toLowerCase().email().max(320) });

/**
 * Demande d'envoi de l'audit par e-mail (2026-09-27), depuis la page d'attente
 * ou le popup de fin.
 *
 * L'adresse ne s'enregistre qu'une fois par analyse : l'identifiant d'un
 * rapport n'est pas secret, il ne doit pas servir à envoyer le même audit à
 * une liste d'adresses. Si le diagnostic est déjà prêt, l'envoi part tout de
 * suite ; sinon, la fin de rédaction (Inngest) s'en charge.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!Id.safeParse(id).success) {
    return Response.json({ error: "identifiant invalide" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "corps de requête illisible" }, { status: 400 });
  }

  const parsed = Body.safeParse(payload);
  if (!parsed.success || undeliverableReason(parsed.data.email)) {
    return Response.json({ error: "Cette adresse e-mail ne semble pas valide." }, { status: 400 });
  }
  const email = parsed.data.email;

  const [scan] = await db()
    .select({ auditEmail: scans.auditEmail })
    .from(scans)
    .where(eq(scans.id, id));
  if (!scan) {
    return Response.json({ error: "analyse introuvable" }, { status: 404 });
  }

  if (scan.auditEmail && scan.auditEmail !== email) {
    return Response.json(
      { error: "Une adresse est déjà enregistrée pour cet audit." },
      { status: 409 },
    );
  }

  if (!scan.auditEmail) {
    const updated = await db()
      .update(scans)
      .set({ auditEmail: email })
      .where(and(eq(scans.id, id), isNull(scans.auditEmail)))
      .returning({ id: scans.id });
    // Une autre demande est passée entre la lecture et l'écriture.
    if (updated.length === 0) {
      return Response.json(
        { error: "Une adresse est déjà enregistrée pour cet audit." },
        { status: 409 },
      );
    }
  }

  const outcome = await envoyerAudit(id);
  if (!outcome.sent && outcome.reason === "envoi impossible") {
    return Response.json(
      { error: "L'envoi a échoué. Réessayez dans un instant." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, envoye: outcome.sent || outcome.reason === "déjà envoyé" });
}
