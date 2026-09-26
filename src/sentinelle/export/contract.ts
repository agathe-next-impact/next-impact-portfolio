import { z } from "zod";
import { AXES } from "@sentinelle/lettre/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Le contrat de l'export Sentinelle.
//
// Sentinelle constate ; d'autres interprètent (Signaux Faibles) ou décident
// (l'espace de direction technique). Aucun de ces consommateurs n'importe ce
// module — la règle 2 l'interdit dans un sens, leur propre isolation dans
// l'autre. Ils lisent une réponse HTTP, et c'est CE fichier qui dit ce qu'elle
// contient. Chaque consommateur en tient sa propre copie validée par zod : si
// les deux divergent, la lecture échoue bruyamment au lieu d'afficher une page
// à moitié juste.
//
// **Ce qui sort, et seulement ça** : ce qu'un humain a déjà validé. Une alerte
// en brouillon ou écartée ne quitte pas Sentinelle, un numéro non validé non
// plus (règle 4). Le consommateur n'a donc rien à revalider — il cite.
//
// `version` augmente à chaque changement incompatible. Un ajout de champ
// facultatif n'en est pas un.
// ─────────────────────────────────────────────────────────────────────────────

export const EXPORT_VERSION = 1;

/** Un fragment de texte. Mêmes clés courtes que les blocs de l'espace client. */
export const ExportSpanSchema = z.object({
  t: z.string(),
  b: z.literal(true).optional(),
  i: z.literal(true).optional(),
  h: z.string().optional(),
});

/**
 * Un bloc de lettre, neutre : ni HTML ni Markdown, pour qu'aucun consommateur
 * n'ait à faire confiance à une chaîne ni à embarquer un analyseur.
 */
export const ExportBlockSchema = z.union([
  z.object({
    k: z.enum(["h2", "h3", "p", "li", "quote", "callout"]),
    s: z.array(ExportSpanSchema),
  }),
  z.object({ k: z.literal("hr") }),
]);

export const VERDICTS = ["red", "orange", "green", "info"] as const;

export const ExportAlertSchema = z.object({
  /** Identifiant de l'alerte chez Sentinelle. */
  id: z.string(),
  /**
   * Référence citable du fait : `<source>:<identifiant externe>`, ex.
   * `wpscan:CVE-2026-1234` ou `endoflife:php/8.1`. C'est elle qu'une lettre
   * Signaux Faibles reprend entre crochets (`[S:…]`).
   */
  ref: z.string(),
  /** Le titre relu — celui que le client a lu, pas celui de la source. */
  title: z.string(),
  verdict: z.enum(VERDICTS).nullable(),
  status: z.enum(["validated", "sent"]),
  /** Composant concerné, tel qu'il s'affiche dans la fiche. */
  component: z.string(),
  recommendedAction: z.string(),
  /** Le corps relu de l'alerte, tel que le client l'a reçu. Ajout compatible (v1). */
  body: z.string().optional(),
  /** Date ISO : l'envoi s'il a eu lieu, la création sinon. */
  at: z.string(),
});

export const ExportRadarSchema = z.object({
  label: z.string(),
  version: z.string().nullable(),
  title: z.string(),
  /** Jour ISO de fin de support. */
  endsOn: z.string(),
  daysLeft: z.number(),
});

export const ExportLetterSchema = z.object({
  /** Identifiant du numéro chez Sentinelle. Stable : clé de rapprochement. */
  id: z.string(),
  /** Clé de période, ex. `2026-09-2`. */
  period: z.string(),
  /** Date ISO du numéro — celle de la période, jamais celle de l'envoi. */
  issueDate: z.string(),
  status: z.enum(["validated", "sent"]),
  sentAt: z.string().nullable(),
  title: z.string(),
  chapeau: z.string(),
  /** Axes conclus « agir » : le compte suffit au résumé. */
  axesAAgir: z.number(),
  actions: z.array(z.object({ action: z.string(), horizon: z.string() })),
  blocks: z.array(ExportBlockSchema),
});

export const SentinelleExportSchema = z.object({
  version: z.literal(EXPORT_VERSION),
  generatedAt: z.string(),
  client: z.object({ id: z.string(), siteUrl: z.string() }),
  /** Les douze axes de la lettre, dans l'ordre. Source unique de la taxonomie. */
  axes: z.array(z.string()),
  stack: z.object({
    components: z.array(
      z.object({
        label: z.string(),
        slug: z.string(),
        type: z.string(),
        version: z.string().nullable(),
        openAlerts: z.number(),
      }),
    ),
    withoutVersion: z.number(),
  }),
  alerts: z.array(ExportAlertSchema),
  radar: z.array(ExportRadarSchema),
  letters: z.array(ExportLetterSchema),
});

export type ExportSpan = z.infer<typeof ExportSpanSchema>;
export type ExportBlock = z.infer<typeof ExportBlockSchema>;
export type ExportAlert = z.infer<typeof ExportAlertSchema>;
export type ExportLetter = z.infer<typeof ExportLetterSchema>;
export type SentinelleExport = z.infer<typeof SentinelleExportSchema>;

export const EXPORT_AXES: readonly string[] = AXES;
