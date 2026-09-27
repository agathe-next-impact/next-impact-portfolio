import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import {
  notifierDemande,
  parseSubscriptionRequest,
  recordSubscriptionRequest,
} from "@sentinelle/inscriptions";
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

/**
 * Demande d'inscription à Sentinelle depuis le rapport (2026-09-27).
 *
 * Même opt-in que la page d'offre : la demande attend la validation d'Agathe,
 * avec ce rapport comme origine (il amorcera la fiche à l'activation). Les
 * coordonnées restent aussi sur la ligne du scan, pour que le rapport sache
 * qu'une demande est faite. Idempotent : renvoyer le formulaire met la demande
 * à jour ; Agathe n'est prévenue qu'à la première demande d'une adresse.
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

  const parsed = parseSubscriptionRequest(
    payload && typeof payload === "object" ? { ...payload, scanId: id } : payload,
  );
  if (!parsed.ok) return Response.json({ error: parsed.message }, { status: 400 });

  const [scan] = await db().select({ id: scans.id }).from(scans).where(eq(scans.id, id));
  if (!scan) {
    return Response.json({ error: "analyse introuvable" }, { status: 404 });
  }

  const demande = parsed.value;
  await db()
    .update(scans)
    .set({
      leadEmail: demande.email,
      leadName: demande.name,
      leadOrganisation: demande.organisation,
      leadSiteUrl: demande.siteUrl,
    })
    .where(eq(scans.id, id));

  const { isNew } = await recordSubscriptionRequest(demande);
  // La notification suit l'enregistrement et n'en conditionne pas la réponse.
  if (isNew) await notifierDemande(demande);

  return Response.json({ ok: true });
}
