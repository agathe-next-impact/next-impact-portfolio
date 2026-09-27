// ─────────────────────────────────────────────────────────────────────────────
// Ce qu'un balayage remonte, à deux niveaux.
//
// `warnings` : tout ce qui mérite d'être relu, l'ordinaire compris (« nouvel
// accompagnement créé », « base ignorée »). `alerts` : parmi eux, ce qui touche
// un ACCÈS ou un RATTACHEMENT — une personne révoquée, une ligne sans client,
// un doublon, une base écartée pour son schéma. Une alerte figure donc toujours
// aussi dans `warnings`, mot pour mot.
//
// La distinction sert au balayage de nuit, que personne ne regarde : seules les
// alertes nouvelles valent un e-mail (`src/cto/admin/runs.ts`).
// ─────────────────────────────────────────────────────────────────────────────

export interface Findings {
  warnings: string[];
  alerts: string[];
}

export function emptyFindings(): Findings {
  return { warnings: [], alerts: [] };
}

/** Inscrit un point qui touche un accès ou un rattachement. */
export function alert(findings: Findings, message: string): void {
  findings.warnings.push(message);
  findings.alerts.push(message);
}

/** Verse les remontées d'un balayage partiel dans celles du balayage complet. */
export function merge(into: Findings, from: Findings): void {
  into.warnings.push(...from.warnings);
  into.alerts.push(...from.alerts);
}
