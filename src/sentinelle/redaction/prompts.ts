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

export const PROMPT_DIR = path.join("src", "sentinelle", "redaction");

export const VERDICT_PROMPT = "verdict-system-prompt.md";
/** Blocs rédigés de la newsletter bimensuelle (phase 4). */
export const NEWSLETTER_PROMPT = "newsletter-system-prompt.md";

export const SYSTEM_PROMPT_PATH = path.join(PROMPT_DIR, VERDICT_PROMPT);

const cache = new Map<string, string>();

/**
 * Charge un prompt système, sans son préambule.
 *
 * Le fichier commence par une note destinée aux humains qui le maintiennent
 * (où il vit, pourquoi). Elle n'a rien à faire dans le contexte du modèle :
 * tout ce qui précède la première ligne `---` est retiré.
 *
 * Tous les prompts vivent dans ce dossier, et `outputFileTracingIncludes`
 * embarque `redaction/*.md` : un prompt rangé ailleurs serait absent du
 * déploiement Vercel, et l'erreur ne se verrait qu'en production.
 */
export function loadPrompt(filename: string): string {
  const memo = cache.get(filename);
  if (memo) return memo;

  // Normaliser CRLF → LF : sur Windows les fichiers sont enregistrés en `\r\n`,
  // et sans ça le séparateur `\n---\n` ne matche pas — le préambule mainteneur
  // (« ce fichier vit dans src/… ») partirait alors au modèle à chaque appel.
  const raw = readFileSync(path.join(process.cwd(), PROMPT_DIR, filename), "utf8").replace(
    /\r\n/g,
    "\n",
  );
  const separator = raw.indexOf("\n---\n");
  const body = separator === -1 ? raw : raw.slice(separator + 5);

  const prompt = body.trim();
  cache.set(filename, prompt);
  return prompt;
}

/** Prompt de rédaction d'une alerte. */
export function systemPrompt(): string {
  return loadPrompt(VERDICT_PROMPT);
}

/** Pour les tests, qui ont besoin de relire un fichier modifié. */
export function resetPromptCache(): void {
  cache.clear();
}
