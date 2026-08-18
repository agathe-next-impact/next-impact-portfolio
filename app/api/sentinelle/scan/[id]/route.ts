import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { envoyerLettreEchantillon } from "@sentinelle/apercu";
import type { ScanResult } from "@sentinelle/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Id = z.string().uuid();

/** État et résultat d'une analyse. Interrogé toutes les 1,5 s par le front. */
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!Id.safeParse(id).success) {
    return Response.json({ error: "identifiant invalide" }, { status: 400 });
  }

  const [scan] = await db()
    .select({
      id: scans.id,
      url: scans.url,
      status: scans.status,
      result: scans.result,
      // On ne renvoie jamais l'e-mail capturé ni l'empreinte d'IP : l'URL d'un
      // rapport n'est pas secrète, seulement difficile à deviner.
      hasLead: scans.leadEmail,
      createdAt: scans.createdAt,
    })
    .from(scans)
    .where(eq(scans.id, id));

  if (!scan) {
    return Response.json({ error: "analyse introuvable" }, { status: 404 });
  }

  return Response.json({
    id: scan.id,
    url: scan.url,
    status: scan.status,
    result: (scan.result as ScanResult | { error: string } | null) ?? null,
    hasLead: Boolean(scan.hasLead),
    createdAt: scan.createdAt,
  });
}

const LeadBody = z.object({
  email: z.string().email().max(320),
});

/**
 * Capture de l'e-mail pour recevoir la lettre-échantillon.
 *
 * Écrit `scans.leadEmail`, puis tente l'envoi : si la lettre est déjà rédigée
 * elle part tout de suite, sinon c'est la fin de la rédaction (Inngest) qui
 * l'expédiera. Idempotent : renvoyer le formulaire deux fois met à jour
 * l'adresse plutôt que de créer un doublon — mais la lettre ne part qu'une fois.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
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

  const parsed = LeadBody.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }

  const rows = await db()
    .update(scans)
    .set({ leadEmail: parsed.data.email.trim().toLowerCase() })
    .where(eq(scans.id, id))
    .returning({ id: scans.id });

  if (rows.length === 0) {
    return Response.json({ error: "analyse introuvable" }, { status: 404 });
  }

  // « Lettre pas prête » n'est pas un échec : l'envoi se fera à la fin de la
  // rédaction. On ne fait donc pas dépendre la réponse du résultat.
  const envoi = await envoyerLettreEchantillon(id);

  return Response.json({ ok: true, sent: envoi.sent });
}
