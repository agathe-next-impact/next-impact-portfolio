import { z } from "zod";
import type { DraftedAlert } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Contenu d'une alerte, entre la base et le formulaire de relecture.
//
// `alerts.generated_text` porte la sortie brute du modèle (JSON snake_case, tel
// que le décrit le prompt système) ; `alerts.final_text` porte **le même objet
// après relecture**, sérialisé en JSON camelCase.
//
// Pourquoi du JSON dans une colonne nommée « text » : le gabarit d'e-mail a
// besoin de champs séparés (verdict, titre, corps, ce que ça change, action,
// faisable seul, effort). Y stocker un paragraphe unique obligerait soit à
// appauvrir l'e-mail, soit à re-découper du texte à l'envoi — c'est-à-dire à
// deviner. Le contrat est ici, à un seul endroit, et il est testé.
//
// La lecture est **tolérante par conception** : elle accepte les deux
// vocabulaires (celui du prompt et celui du modèle TypeScript) parce que le même
// formulaire s'amorce depuis `generated_text` et se relit depuis `final_text`.
// L'écriture, elle, n'a qu'une forme.
// ─────────────────────────────────────────────────────────────────────────────

export const VERDICTS = ["green", "orange", "red", "info"] as const;

/** Forme relue (camelCase) — ce qu'écrit l'admin. */
const FinalSchema = z.object({
  verdict: z.enum(VERDICTS),
  title: z.string(),
  body: z.string(),
  whatItChanges: z.string(),
  recommendedAction: z.string(),
  diyPossible: z.boolean(),
  effortEstimate: z.string(),
});

/** Forme produite (snake_case) — ce qu'écrit le modèle, cf. redaction/schema.ts. */
const GeneratedSchema = z.object({
  verdict: z.enum(VERDICTS),
  title: z.string(),
  body: z.string(),
  what_it_changes: z.string(),
  recommended_action: z.string(),
  diy_possible: z.boolean(),
  effort_estimate: z.string(),
});

export const EMPTY_CONTENT: DraftedAlert = {
  verdict: "info",
  title: "",
  body: "",
  whatItChanges: "",
  recommendedAction: "",
  diyPossible: false,
  effortEstimate: "",
};

/**
 * Relit un contenu d'alerte, quelle que soit sa provenance.
 *
 * Renvoie null si la chaîne n'est pas un objet exploitable — y compris quand
 * c'est du texte libre écrit à la main dans la colonne. L'appelant décide alors
 * quoi en faire ; ici, on ne devine pas.
 */
export function parseAlertContent(raw: string | null | undefined): DraftedAlert | null {
  if (!raw || raw.trim() === "") return null;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return null;
  }

  const final = FinalSchema.safeParse(payload);
  if (final.success) return final.data;

  const generated = GeneratedSchema.safeParse(payload);
  if (!generated.success) return null;

  return {
    verdict: generated.data.verdict,
    title: generated.data.title,
    body: generated.data.body,
    whatItChanges: generated.data.what_it_changes,
    recommendedAction: generated.data.recommended_action,
    diyPossible: generated.data.diy_possible,
    effortEstimate: generated.data.effort_estimate,
  };
}

/** Sérialise le contenu relu, en normalisant les espaces de bord. */
export function serializeAlertContent(content: DraftedAlert): string {
  return JSON.stringify({
    verdict: content.verdict,
    title: content.title.trim(),
    body: content.body.trim(),
    whatItChanges: content.whatItChanges.trim(),
    recommendedAction: content.recommendedAction.trim(),
    diyPossible: content.diyPossible,
    effortEstimate: content.effortEstimate.trim(),
  });
}

/**
 * Contenu de départ du formulaire.
 *
 * Le texte relu prime sur le texte généré ; si aucun des deux n'est
 * exploitable, on repart d'une fiche vide plutôt que d'un objet à moitié rempli.
 * Un texte libre non-JSON n'est pas perdu pour autant : il atterrit dans le
 * corps, où un humain le verra et le remettra en forme.
 */
export function initialContent(alert: {
  finalText: string | null;
  generatedText: string | null;
  verdict: DraftedAlert["verdict"] | null;
}): DraftedAlert {
  const parsed = parseAlertContent(alert.finalText) ?? parseAlertContent(alert.generatedText);
  if (parsed) return { ...parsed, verdict: alert.verdict ?? parsed.verdict };

  const libre = (alert.finalText ?? alert.generatedText ?? "").trim();
  return { ...EMPTY_CONTENT, verdict: alert.verdict ?? "info", body: libre };
}

/**
 * Ce qui manque pour qu'une alerte puisse être validée.
 *
 * Renvoie la liste des manques, vide si tout est là. Trois champs seulement sont
 * obligatoires : sans titre l'e-mail n'a pas d'objet, sans corps il ne dit rien,
 * sans action recommandée il laisse le client devant un problème sans issue —
 * c'est exactement ce que le produit promet de ne jamais faire.
 */
export function missingForValidation(content: DraftedAlert): string[] {
  const missing: string[] = [];
  if (content.title.trim() === "") missing.push("le titre");
  if (content.body.trim() === "") missing.push("le corps du message");
  if (content.recommendedAction.trim() === "") missing.push("l'action recommandée");
  return missing;
}

/** Objet de l'e-mail. Le verdict n'y apparaît pas : il se lit dans le corps. */
export function alertSubject(content: DraftedAlert): string {
  const title = content.title.trim() || "Alerte de veille";
  return `Sentinelle — ${title}`;
}
