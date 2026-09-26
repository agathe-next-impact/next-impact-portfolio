import { z } from "zod";
import { buildExport, checkExportAuth } from "@sentinelle/export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Id = z.string().uuid();

/**
 * Les constats validés d'un client : fiche, alertes, radar, lettres complètes.
 *
 * Lecture seule, pour des machines (espace de direction technique, tâches
 * Cowork). Contrat : `src/sentinelle/export/contract.ts`. Le contrôle du jeton
 * précède toute lecture de la base.
 */
export async function GET(req: Request, context: { params: Promise<{ clientId: string }> }) {
  const auth = checkExportAuth(req.headers.get("authorization"), process.env.SENTINELLE_EXPORT_SECRET);
  if (auth === "closed") return Response.json({ error: "export fermé" }, { status: 503 });
  if (auth === "denied") return Response.json({ error: "non autorisé" }, { status: 401 });

  const { clientId } = await context.params;
  if (!Id.safeParse(clientId).success) {
    return Response.json({ error: "identifiant invalide" }, { status: 400 });
  }

  const data = await buildExport(clientId);
  if (!data) return Response.json({ error: "client introuvable" }, { status: 404 });

  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
