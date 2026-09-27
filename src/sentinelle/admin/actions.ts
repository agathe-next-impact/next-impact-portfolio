// ─────────────────────────────────────────────────────────────────────────────
// Le type de retour commun aux actions de l'admin.
//
// Jusqu'en 2026-09, ce module portait aussi le cycle draft → validated → sent
// des alertes (`saveAlertContent`, `validateAlert`, `sendAlert`, `dismissAlert`,
// `reopenAlert`, `dismissComponent`). Ce cycle vit désormais dans Notion : une
// alerte se rédige, se relit et se valide dans sa page, et `notion/sync.ts`
// l'envoie dès que son Statut passe à Validée — voir
// docs/sentinelle/notion-alertes.md. Il ne reste rien à valider ici pour une
// alerte ; ce fichier ne porte plus que le type que le cycle de la lettre
// bimensuelle (`digests.ts`) continue d'utiliser.
//
// Aucune de ces fonctions ne lève sur une règle métier : elles renvoient une
// raison en français, que l'admin affiche telle quelle. Une exception est
// réservée à ce qui est vraiment cassé (base injoignable, SMTP en panne).
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? { value?: never } : { value: T }))
  | { ok: false; reason: string };
