// Tests de la checklist GEO (lib/checklist-geo.ts + vue print).
// Le repo n'a pas de runner de test : script node autonome.
//
// Exécution :
//   npx tsc scripts/test-checklist-geo.ts --outDir .test-build --module commonjs \
//     --target es2019 --moduleResolution node --esModuleInterop --strict --skipLibCheck
//   node .test-build/scripts/test-checklist-geo.js
// (puis supprimer .test-build)

import {
  computeProgress,
  computeSectionProgress,
  CTA_THRESHOLDS,
  getCtaTier,
  ITEMS,
  SECTIONS,
  TOTAL_ITEMS,
} from "../lib/checklist-geo";
import { buildChecklistPrintHtml } from "../lib/checklist-geo-print";

let failures = 0;

function check(name: string, cond: boolean, info?: unknown) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.error(`  FAIL ${name}${info !== undefined ? ` — ${JSON.stringify(info)}` : ""}`);
  }
}

console.log("— Intégrité des données");
check("24 actions", TOTAL_ITEMS === 24, TOTAL_ITEMS);
check("4 chantiers", SECTIONS.length === 4);
check(
  "chantiers numérotés 1-4 dans l'ordre",
  SECTIONS.map((s) => s.order).join(",") === "1,2,3,4",
);
check("ids d'actions uniques", new Set(ITEMS.map((i) => i.id)).size === TOTAL_ITEMS);
check(
  "chaque chantier a au moins 5 actions",
  SECTIONS.every((s) => ITEMS.filter((i) => i.section === s.id).length >= 5),
);
check(
  "chaque action rattachée à un chantier connu",
  ITEMS.every((i) => SECTIONS.some((s) => s.id === i.section)),
);
for (const item of ITEMS) {
  check(
    `action ${item.id} : textes FR+EN + pourquoi + niveau valide`,
    Boolean(item.actionFr && item.actionEn && item.whyFr && item.whyEn) &&
      (item.level === "interne" || item.level === "prestataire"),
  );
}
check(
  "la majorité des actions est faisable en interne",
  ITEMS.filter((i) => i.level === "interne").length > TOTAL_ITEMS / 2,
);
// Cohérence avec le diagnostic visibilité IA : mêmes robots IA nommés.
const robotsAction = ITEMS.find((i) => i.id === "robots-txt");
check(
  "action robots.txt : cite OAI-SearchBot, PerplexityBot, ClaudeBot et GPTBot",
  ["OAI-SearchBot", "PerplexityBot", "ClaudeBot", "GPTBot"].every((b) =>
    robotsAction?.actionFr.includes(b),
  ),
);

console.log("— Progression");
const allIds = ITEMS.map((i) => i.id);
const empty = computeProgress([]);
const full = computeProgress(allIds);
check("vide → 0/24, 0 %", empty.done === 0 && empty.total === 24 && empty.pct === 0, empty);
check("complet → 24/24, 100 %", full.done === 24 && full.pct === 100, full);
check(
  "ids inconnus et doublons ignorés",
  computeProgress(["inconnu", "robots-txt", "robots-txt"]).done === 1,
);
const half = computeProgress(allIds.slice(0, 12));
check("12 cochées → 50 %", half.done === 12 && half.pct === 50, half);
check(
  "somme des progressions par chantier = progression globale",
  SECTIONS.reduce((s, sec) => s + computeSectionProgress(allIds.slice(0, 12), sec.id).done, 0) ===
    12,
);
const sectionFull = computeSectionProgress(allIds, "acces");
check(
  "chantier accès complet → 100 %",
  sectionFull.done === sectionFull.total && sectionFull.pct === 100,
  sectionFull,
);

console.log("— Escalier de CTA (froid → visio 150 € → cadrage 490 €)");
check("0 % → froid", getCtaTier(0) === "froid");
check(`${CTA_THRESHOLDS.tiede - 1} % → froid`, getCtaTier(CTA_THRESHOLDS.tiede - 1) === "froid");
check(`${CTA_THRESHOLDS.tiede} % → tiède`, getCtaTier(CTA_THRESHOLDS.tiede) === "tiede");
check(`${CTA_THRESHOLDS.chaud - 1} % → tiède`, getCtaTier(CTA_THRESHOLDS.chaud - 1) === "tiede");
check(`${CTA_THRESHOLDS.chaud} % → chaud`, getCtaTier(CTA_THRESHOLDS.chaud) === "chaud");
check("100 % → chaud", getCtaTier(100) === "chaud");

console.log("— Vue imprimable");
const htmlFr = buildChecklistPrintHtml("fr", ["robots-txt"]);
const htmlEn = buildChecklistPrintHtml("en", []);
check("FR : toutes les actions présentes", ITEMS.every((i) => htmlFr.includes(i.actionFr)));
check("EN : toutes les actions présentes", ITEMS.every((i) => htmlEn.includes(i.actionEn)));
check("FR : les 4 chantiers présents", SECTIONS.every((s) => htmlFr.includes(s.titleFr)));
check("case cochée reprise dans le document", htmlFr.includes("&#10003;"));
check("document EN sans coche quand rien n'est coché", !htmlEn.includes("&#10003;"));
check(
  "escalier présent dans le pied de page (diagnostic + rubrique + conseil)",
  ["/outils/visibilite-ia", "/documentation/etre-trouve", "/conseil"].every((p) =>
    htmlFr.includes(p),
  ),
);
check("aucun montant hors 150 € dans le print", !/\b(180|390|490)\s*(€|&euro;)/.test(htmlFr));
check("lang FR posé", htmlFr.includes('<html lang="fr">'));
check("lang EN posé", htmlEn.includes('<html lang="en">'));

console.log("");
if (failures > 0) {
  console.error(`${failures} échec(s).`);
  process.exit(1);
}
console.log("Tous les tests passent.");
