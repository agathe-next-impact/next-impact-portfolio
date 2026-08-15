#!/usr/bin/env node
// Garde-fou de la règle d'isolation n° 2 (docs/sentinelle/CLAUDE.md) :
// « Aucun import depuis le code vitrine vers src/sentinelle/, jamais. »
//
//   node scripts/check-sentinelle-isolation.mjs   # sort 1 si la règle est violée
//
// La dépendance est à sens unique et assumée : Sentinelle peut importer le
// design system du site (c'est demandé par la spec), la vitrine ne doit jamais
// dépendre de Sentinelle — sinon l'extraction en sous-domaine devient
// impossible et le produit contamine les Core Web Vitals du site.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// Seuls ces chemins ont le droit d'importer du code Sentinelle.
const ALLOWED_PREFIXES = [
  path.join("src", "sentinelle"),
  path.join("app", "(sentinelle)"),
  path.join("app", "api", "sentinelle"),
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "storybook-static",
  "docs",
]);

const IMPORT_PATTERN = /(?:from\s+|import\s*\(|require\s*\()\s*["'`]([^"'`]+)["'`]/g;

/** @returns {string[]} */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...walk(path.join(dir, entry.name)));
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function targetsSentinelle(specifier) {
  return (
    specifier.startsWith("@sentinelle/") ||
    specifier === "@sentinelle" ||
    specifier.includes("src/sentinelle")
  );
}

const violations = [];

for (const file of walk(root)) {
  const relative = path.relative(root, file);
  if (ALLOWED_PREFIXES.some((prefix) => relative.startsWith(prefix))) continue;
  if (relative === path.join("scripts", "check-sentinelle-isolation.mjs")) continue;
  if (relative === "drizzle.config.ts" || relative === "vitest.config.mts") continue;

  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(IMPORT_PATTERN)) {
    if (targetsSentinelle(match[1])) {
      violations.push(`${relative} → ${match[1]}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Isolation Sentinelle rompue — le code vitrine importe le produit :\n");
  for (const violation of violations) console.error(`  ${violation}`);
  console.error(
    "\nLa dépendance doit rester à sens unique (Sentinelle → vitrine).\n" +
      "Voir docs/sentinelle/CLAUDE.md, règle 2.",
  );
  process.exit(1);
}

console.log("Isolation Sentinelle : OK — aucun import depuis le code vitrine.");
