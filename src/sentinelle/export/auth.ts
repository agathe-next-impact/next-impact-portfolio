import { timingSafeEqual } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Qui a le droit de lire un export.
//
// Un jeton dédié, `SENTINELLE_EXPORT_SECRET`, et aucun autre : ni le secret du
// cron, ni celui des liens magiques. L'export donne la fiche technique et les
// alertes d'un client ; le jeton qui l'ouvre doit pouvoir tourner seul, sans
// emporter les autres accès avec lui.
//
// Même régime que les routes `/api/veille/*` de Signaux Faibles : sans secret
// configuré, la route est fermée (503) ; jeton faux ou absent, 401.
// ─────────────────────────────────────────────────────────────────────────────

export type ExportAuth = "ok" | "closed" | "denied";

export function checkExportAuth(header: string | null, secret: string | undefined): ExportAuth {
  const expected = secret?.trim();
  if (!expected) return "closed";
  if (!header?.startsWith("Bearer ")) return "denied";

  const given = Buffer.from(header.slice("Bearer ".length).trim());
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length) return "denied";
  return timingSafeEqual(given, wanted) ? "ok" : "denied";
}
