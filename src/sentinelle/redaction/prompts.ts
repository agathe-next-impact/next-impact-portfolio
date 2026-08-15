import { readFileSync } from "node:fs";
import path from "node:path";

// ─────────────────────────────────────────────────────────────────────────────
// Chargement du prompt système.
//
// Lu depuis le disque au lieu d'être une constante TypeScript : c'est un
// livrable produit, et Agathe doit pouvoir le réécrire sans ouvrir un fichier
// de code. Il vit dans `src/sentinelle/redaction/` et non dans `docs/` parce
// que le file tracing de Vercel n'embarque pas `docs/` — l'inclusion est
// déclarée dans `outputFileTracingIncludes` (next.config.mjs).
//
// Mémorisé au premier appel : le fichier ne change pas en cours d'exécution, et
// une fonction de fond qui rédige vingt alertes ne doit pas faire vingt
// lectures disque.
// ─────────────────────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT_PATH = path.join(
  "src",
  "sentinelle",
  "redaction",
  "verdict-system-prompt.md",
);

let cached: string | undefined;

/**
 * Prompt système, sans son préambule.
 *
 * Le fichier commence par une note destinée aux humains qui le maintiennent
 * (où il vit, pourquoi). Elle n'a rien à faire dans le contexte du modèle :
 * tout ce qui précède la première ligne `---` est retiré.
 */
export function systemPrompt(): string {
  if (cached) return cached;

  const raw = readFileSync(path.join(process.cwd(), SYSTEM_PROMPT_PATH), "utf8");
  const separator = raw.indexOf("\n---\n");
  const body = separator === -1 ? raw : raw.slice(separator + 5);

  cached = body.trim();
  return cached;
}

/** Pour les tests, qui ont besoin de relire un fichier modifié. */
export function resetPromptCache(): void {
  cached = undefined;
}
