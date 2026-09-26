import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Ce que l'espace attend de l'export Sentinelle.
//
// COPIE VOLONTAIRE du contrat publié par Sentinelle
// (`src/sentinelle/export/contract.ts`). L'espace n'importe jamais
// `src/sentinelle/` — c'est la règle d'isolation des deux produits — et lit
// donc une réponse HTTP qu'il valide lui-même. Si les deux fichiers divergent,
// la validation échoue, la synchro le dit, et l'espace garde le dernier export
// connu : c'est voulu, une page à moitié juste serait pire.
//
// Les deux côtés valident le même exemple, `docs/contrats/sentinelle-export.v1.json`
// (tests `contract.test.ts` ici et dans `src/sentinelle/export/`) : changer
// l'un sans l'autre fait tomber `npm test`.
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_EXPORT_VERSION = 1;

const Span = z.object({
  t: z.string(),
  b: z.literal(true).optional(),
  i: z.literal(true).optional(),
  h: z.string().optional(),
});

const Block = z.union([
  z.object({ k: z.enum(["h2", "h3", "p", "li", "quote", "callout"]), s: z.array(Span) }),
  z.object({ k: z.literal("hr") }),
]);

export const SENTINELLE_VERDICTS = ["red", "orange", "green", "info"] as const;
export type SentinelleVerdict = (typeof SENTINELLE_VERDICTS)[number];

const Alert = z.object({
  id: z.string(),
  ref: z.string(),
  title: z.string(),
  verdict: z.enum(SENTINELLE_VERDICTS).nullable(),
  status: z.enum(["validated", "sent"]),
  component: z.string(),
  recommendedAction: z.string(),
  body: z.string().optional(),
  at: z.string(),
});

const Radar = z.object({
  label: z.string(),
  version: z.string().nullable(),
  title: z.string(),
  endsOn: z.string(),
  daysLeft: z.number(),
});

const Letter = z.object({
  id: z.string(),
  period: z.string(),
  issueDate: z.string(),
  status: z.enum(["validated", "sent"]),
  sentAt: z.string().nullable(),
  title: z.string(),
  chapeau: z.string(),
  axesAAgir: z.number(),
  actions: z.array(z.object({ action: z.string(), horizon: z.string() })),
  blocks: z.array(Block),
});

export const SentinelleExportSchema = z.object({
  version: z.literal(SUPPORTED_EXPORT_VERSION),
  generatedAt: z.string(),
  client: z.object({ id: z.string(), siteUrl: z.string() }),
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
  alerts: z.array(Alert),
  radar: z.array(Radar),
  letters: z.array(Letter),
});

export type SentinelleExport = z.infer<typeof SentinelleExportSchema>;
export type SentinelleAlert = z.infer<typeof Alert>;
export type SentinelleLetter = z.infer<typeof Letter>;
export type SentinelleRadar = z.infer<typeof Radar>;
