#!/usr/bin/env node
// Contrôle du contrat de contenu des articles de documentation.
// Voir content/documentation/README.md.
//
//   node scripts/check-documentation-contract.mjs            # rapport, sort 0
//   node scripts/check-documentation-contract.mjs --strict   # sort 1 si non conforme
//   node scripts/check-documentation-contract.mjs --backlog  # liste les articles à migrer
//
// Branché sur `npm run build` en mode strict : un article qui déclare
// `rubrique` sans `enBref` ni `dateModified` casse le build. Les articles non
// encore migrés (pas de `rubrique`) ne sont pas des erreurs — la migration se
// fait par lots.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const RUBRIQUES = [
  "choisir",
  "ia-et-code",
  "reparer",
  "avant-signer",
  "outils-metier",
  "presence",
  "etre-trouve",
];

const strict = process.argv.includes("--strict");
const showBacklog = process.argv.includes("--backlog");
const roots = [
  path.join(process.cwd(), "content", "documentation"),
  path.join(process.cwd(), "content", "en", "documentation"),
];

/** @returns {{ref: string, errors: string[], migrated: boolean}[]} */
function collect(root) {
  if (!fs.existsSync(root)) return [];
  const rel = path.relative(process.cwd(), root);

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((category) => {
      const dir = path.join(root, category.name);
      return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
        .map((file) => {
          const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
          const errors = [];
          const migrated = Boolean(data.rubrique);

          if (migrated && !RUBRIQUES.includes(data.rubrique)) {
            errors.push(`\`rubrique: ${data.rubrique}\` hors des 7 valeurs autorisées`);
          }
          if (migrated && !data.enBref) errors.push("`enBref` manquant");
          if (migrated && !(data.dateModified || data.updated)) {
            errors.push("`dateModified` manquant");
          }
          // Une FAQ balisée sans FAQ visible est un risque de pénalité.
          if (Array.isArray(data.faq) && data.faq.length === 0) {
            errors.push("`faq` vide — retirer le champ plutôt que le laisser vide");
          }

          return { ref: `${rel}/${category.name}/${file}`, errors, migrated };
        });
    });
}

const articles = roots.flatMap(collect);
const migrated = articles.filter((a) => a.migrated);
const broken = articles.filter((a) => a.errors.length);
const backlog = articles.filter((a) => !a.migrated);

const label = broken.length ? "[doc-contract] ✗" : "[doc-contract] ✓";
console.log(
  `${label} ${articles.length} articles · ${migrated.length} sur le gabarit GEO · ` +
    `${backlog.length} à migrer · ${broken.length} non conforme(s)`,
);

if (broken.length) {
  console.log(`\n${broken.length} article(s) non conforme(s) :`);
  for (const article of broken) {
    console.log(`  ✗ ${article.ref}`);
    for (const error of article.errors) console.log(`      ${error}`);
  }
  console.log("\nVoir content/documentation/README.md\n");
}

// Le backlog est volumineux tant que la migration n'est pas faite : à la demande.
if (showBacklog && backlog.length) {
  console.log(`Backlog de migration (pas d'erreur — champ \`rubrique\` absent) :`);
  for (const article of backlog) console.log(`  · ${article.ref}`);
}

process.exit(strict && broken.length ? 1 : 0);
