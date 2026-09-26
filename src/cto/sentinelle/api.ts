import { SentinelleExportSchema, type SentinelleExport } from "./contract";

// ─────────────────────────────────────────────────────────────────────────────
// Lecture de l'export Sentinelle, par HTTP.
//
// Deux variables, posées ensemble ou pas du tout :
//   SENTINELLE_EXPORT_URL    racine du site qui sert l'export (même déploiement
//                            aujourd'hui, sous-domaine demain — rien ne change ici)
//   SENTINELLE_EXPORT_SECRET jeton partagé avec la route d'export
// ─────────────────────────────────────────────────────────────────────────────

export class SentinelleExportError extends Error {}

/** Délai maximal d'une lecture : le balayage ne doit pas rester pendu sur un client. */
const TIMEOUT_MS = 20_000;

export function sentinelleExportConfig(): { url: string; secret: string } | null {
  const url = process.env.SENTINELLE_EXPORT_URL?.trim();
  const secret = process.env.SENTINELLE_EXPORT_SECRET?.trim();
  if (!url || !secret) return null;
  return { url: url.replace(/\/+$/, ""), secret };
}

export async function fetchSentinelleExport(sentinelleClientId: string): Promise<SentinelleExport> {
  const config = sentinelleExportConfig();
  if (!config) throw new SentinelleExportError("SENTINELLE_EXPORT_URL ou SENTINELLE_EXPORT_SECRET absente.");

  const response = await fetch(
    `${config.url}/api/sentinelle/export/${encodeURIComponent(sentinelleClientId)}`,
    {
      headers: { authorization: `Bearer ${config.secret}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );

  if (!response.ok) {
    throw new SentinelleExportError(`export Sentinelle : HTTP ${response.status}`);
  }

  const parsed = SentinelleExportSchema.safeParse(await response.json());
  if (!parsed.success) {
    const premier = parsed.error.issues[0];
    throw new SentinelleExportError(
      `export Sentinelle hors contrat (${premier?.path.join(".") || "racine"} : ${premier?.message ?? "?"}).`,
    );
  }
  if (parsed.data.client.id.toLowerCase() !== sentinelleClientId.toLowerCase()) {
    // Ceinture et bretelles : l'export d'un autre client ne s'affiche jamais ici.
    throw new SentinelleExportError("export Sentinelle : identifiant client inattendu.");
  }
  return parsed.data;
}
