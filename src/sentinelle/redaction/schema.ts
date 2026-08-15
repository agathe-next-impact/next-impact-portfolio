import { z } from "zod";
import type { DraftedAlert } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Forme de la sortie, en deux exemplaires volontairement redondants.
//
//  1. `DRAFT_JSON_SCHEMA` part dans la requête (sortie structurée) : le JSON est
//     alors valide **par construction**, et l'ancienne consigne « réponds
//     uniquement en JSON, sans backticks » n'a plus lieu d'être.
//  2. `DraftSchema` (zod) valide ce qui revient, conformément à la règle du
//     CLAUDE.md : zod sur toutes les entrées externes, réponses de modèle
//     comprises. Ce n'est pas de la défiance envers l'API, c'est la même
//     discipline que pour un webhook — le jour où le schéma et le code
//     divergent, on veut une erreur nette et pas une propriété `undefined`.
//
// Les noms de champs sont en snake_case parce que c'est ainsi qu'ils sont
// décrits dans le prompt système, que quelqu'un d'autre que le développeur doit
// pouvoir lire et éditer. La conversion vers le camelCase du modèle TypeScript
// se fait ici, une fois.
// ─────────────────────────────────────────────────────────────────────────────

export const VERDICTS = ["green", "orange", "red", "info"] as const;

export const DRAFT_JSON_SCHEMA = {
  type: "object",
  properties: {
    verdict: {
      type: "string",
      enum: [...VERDICTS],
      description: "Niveau de l'alerte. Voir l'échelle du prompt système.",
    },
    title: {
      type: "string",
      description: "Titre factuel, 80 caractères au plus, jamais anxiogène.",
    },
    body: {
      type: "string",
      description: "Deux à cinq phrases expliquant le fait au dirigeant.",
    },
    what_it_changes: {
      type: "string",
      description: "Une à deux phrases : l'impact concret pour ce client.",
    },
    recommended_action: {
      type: "string",
      description: "Une phrase commençant par un verbe.",
    },
    diy_possible: {
      type: "boolean",
      description: "Le client peut-il réaliser l'action seul ?",
    },
    effort_estimate: {
      type: "string",
      description: "« 2 clics », « 15 min », « 0,5 jour de prestation »…",
    },
  },
  required: [
    "verdict",
    "title",
    "body",
    "what_it_changes",
    "recommended_action",
    "diy_possible",
    "effort_estimate",
  ],
  additionalProperties: false,
} as const;

export const DraftSchema = z.object({
  verdict: z.enum(VERDICTS),
  title: z.string().min(1),
  body: z.string().min(1),
  what_it_changes: z.string().min(1),
  recommended_action: z.string().min(1),
  diy_possible: z.boolean(),
  effort_estimate: z.string().min(1),
});

export type DraftPayload = z.infer<typeof DraftSchema>;

/** Passage du vocabulaire du prompt à celui du modèle TypeScript. */
export function toDraftedAlert(payload: DraftPayload): DraftedAlert {
  return {
    verdict: payload.verdict,
    title: payload.title,
    body: payload.body,
    whatItChanges: payload.what_it_changes,
    recommendedAction: payload.recommended_action,
    diyPossible: payload.diy_possible,
    effortEstimate: payload.effort_estimate,
  };
}
