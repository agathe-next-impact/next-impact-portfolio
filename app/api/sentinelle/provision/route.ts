import { checkExportAuth } from "@sentinelle/export";
import { provisionClient, ProvisionRequestSchema } from "@sentinelle/provision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Crée, aligne ou désactive un client Sentinelle à la demande de l'espace de
 * direction technique, lui-même piloté par la fiche Notion Clients.
 *
 * Même jeton que l'export (`SENTINELLE_EXPORT_SECRET`) : c'est le jeton
 * d'intégration entre les deux produits, et un seul appelant le détient. Le
 * contrôle précède toute lecture du corps.
 *
 * 200 : `{ id, outcome, scanning }`. 400 : demande illisible. 404 : `id`
 * inconnu. 409 : adresse déjà prise par un autre client.
 */
export async function POST(req: Request) {
  const auth = checkExportAuth(req.headers.get("authorization"), process.env.SENTINELLE_EXPORT_SECRET);
  if (auth === "closed") return Response.json({ error: "provisionnement fermé" }, { status: 503 });
  if (auth === "denied") return Response.json({ error: "non autorisé" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "corps illisible" }, { status: 400 });
  }

  const parsed = ProvisionRequestSchema.safeParse(body);
  if (!parsed.success) {
    const premier = parsed.error.issues[0];
    return Response.json(
      { error: `demande invalide (${premier?.path.join(".") || "racine"} : ${premier?.message ?? "?"})` },
      { status: 400 },
    );
  }

  const result = await provisionClient(parsed.data);
  if (!result.ok) return Response.json({ error: result.reason }, { status: result.status });
  return Response.json({ id: result.id, outcome: result.outcome, scanning: result.scanning });
}
