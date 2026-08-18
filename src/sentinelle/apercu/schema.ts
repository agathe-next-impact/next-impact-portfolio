import { z } from "zod";
import { APERCU_STATUTS, APERCU_THEMES } from "./dossier";

// ─────────────────────────────────────────────────────────────────────────────
// Schéma de sortie de la passe de rédaction de l'aperçu — même approche que
// redaction/schema.ts : le JSON Schema est transmis dans la requête (sortie
// structurée), zod ne sert qu'à vérifier que schéma et code ne divergent pas.
// ─────────────────────────────────────────────────────────────────────────────

const themeSlugs = APERCU_THEMES.map((t) => t.slug) as [string, ...string[]];
const statuts = APERCU_STATUTS as [string, ...string[]];

export const ApercuSchema = z.object({
  // L'habillage de la lettre : l'aperçu est rendu dans le gabarit e-mail de
  // l'abonnement (démo « telle que reçue »), il lui faut donc un titre, un
  // chapeau et une clôture — courts, et bornés au dossier comme le reste.
  titre: z.string().min(1).max(140),
  chapeau: z.string().min(1).max(900),
  siteEnUnePhrase: z.string().min(1).max(300),
  themes: z
    .array(
      z.object({
        theme: z.enum(themeSlugs),
        statut: z.enum(statuts),
        texte: z.string().min(1).max(600),
      }),
    )
    .length(APERCU_THEMES.length),
  cap: z.object({
    scenario: z.enum(["consolider", "evoluer", "refondre"]),
    texte: z.string().min(1).max(900),
  }),
  ligneCloture: z.string().min(1).max(300),
});

export type ApercuPayload = z.infer<typeof ApercuSchema>;

export const APERCU_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["titre", "chapeau", "siteEnUnePhrase", "themes", "cap", "ligneCloture"],
  properties: {
    titre: { type: "string", maxLength: 140 },
    chapeau: { type: "string", maxLength: 900 },
    siteEnUnePhrase: { type: "string", maxLength: 300 },
    themes: {
      type: "array",
      minItems: APERCU_THEMES.length,
      maxItems: APERCU_THEMES.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["theme", "statut", "texte"],
        properties: {
          theme: { type: "string", enum: APERCU_THEMES.map((t) => t.slug) },
          statut: { type: "string", enum: APERCU_STATUTS },
          texte: { type: "string", maxLength: 600 },
        },
      },
    },
    cap: {
      type: "object",
      additionalProperties: false,
      required: ["scenario", "texte"],
      properties: {
        scenario: { type: "string", enum: ["consolider", "evoluer", "refondre"] },
        texte: { type: "string", maxLength: 900 },
      },
    },
    ligneCloture: { type: "string", maxLength: 300 },
  },
} as const;
