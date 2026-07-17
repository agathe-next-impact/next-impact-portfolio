// Tests du scoring du diagnostic « visibilité IA » (lib/visibilite-ia.ts).
// Le repo n'a pas de runner de test : script node autonome.
//
// Exécution :
//   npx tsc scripts/test-visibilite-ia.ts --outDir .test-build --module commonjs \
//     --target es2019 --moduleResolution node --esModuleInterop --strict --skipLibCheck
//   node .test-build/scripts/test-visibilite-ia.js
// (puis supprimer .test-build)

import {
  AXES,
  computeAxisScores,
  computeScore,
  getRecommendations,
  getTier,
  INITIAL_ANSWERS,
  QUESTIONS,
  TIER_THRESHOLDS,
  TOTAL_WEIGHT,
  type Status,
} from "../lib/visibilite-ia";

let failures = 0;

function check(name: string, cond: boolean, info?: unknown) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.error(`  FAIL ${name}${info !== undefined ? ` — ${JSON.stringify(info)}` : ""}`);
  }
}

function answersWith(status: Status): Record<string, string> {
  return Object.fromEntries(
    QUESTIONS.map((q) => {
      const opt = q.options.find((o) => o.status === status);
      if (!opt) throw new Error(`question ${q.id} sans option ${status}`);
      return [q.id, opt.value];
    }),
  );
}

console.log("— Intégrité des données");
check("poids total = 100", TOTAL_WEIGHT === 100, TOTAL_WEIGHT);
check("10 questions", QUESTIONS.length === 10, QUESTIONS.length);
check("4 axes", AXES.length === 4);
for (const q of QUESTIONS) {
  check(`q ${q.id} : 3 options`, q.options.length === 3);
  check(
    `q ${q.id} : un statut de chaque (ok/warn/ko)`,
    (["ok", "warn", "ko"] as Status[]).every((s) => q.options.some((o) => o.status === s)),
  );
  check(
    `q ${q.id} : valeurs d'options uniques`,
    new Set(q.options.map((o) => o.value)).size === 3,
  );
  check(
    `q ${q.id} : axe connu`,
    AXES.some((a) => a.id === q.axis),
  );
  for (const o of q.options.filter((o) => o.status !== "ok")) {
    check(`q ${q.id}/${o.value} : reco FR+EN présente`, Boolean(o.recoFr && o.recoEn));
  }
}
check(
  "chaque axe a au moins 2 questions",
  AXES.every((a) => QUESTIONS.filter((q) => q.axis === a.id).length >= 2),
);

console.log("— Profils extrêmes");
const allOk = answersWith("ok");
const allWarn = answersWith("warn");
const allKo = answersWith("ko");

check("tout ok → score 100", computeScore(allOk) === 100, computeScore(allOk));
check("tout ok → palier visible", getTier(computeScore(allOk)) === "visible");
check("tout warn → score 50", computeScore(allWarn) === 50, computeScore(allWarn));
check("tout warn → palier partiel", getTier(computeScore(allWarn)) === "partiel");
check("tout ko → score 0", computeScore(allKo) === 0, computeScore(allKo));
check("tout ko → palier invisible", getTier(computeScore(allKo)) === "invisible");
check(
  "défauts (médiane warn) → palier partiel",
  getTier(computeScore(INITIAL_ANSWERS)) === "partiel",
  computeScore(INITIAL_ANSWERS),
);

console.log("— Seuils de palier");
check("70 → visible", getTier(TIER_THRESHOLDS.visible) === "visible");
check("69 → partiel", getTier(TIER_THRESHOLDS.visible - 1) === "partiel");
check("40 → partiel", getTier(TIER_THRESHOLDS.partiel) === "partiel");
check("39 → invisible", getTier(TIER_THRESHOLDS.partiel - 1) === "invisible");

console.log("— Scores par axe");
const axisOk = computeAxisScores(allOk);
const axisKo = computeAxisScores(allKo);
check("tout ok → chaque axe à 100", AXES.every((a) => axisOk[a.id] === 100), axisOk);
check("tout ko → chaque axe à 0", AXES.every((a) => axisKo[a.id] === 0), axisKo);
// Profil mixte : axe accès tout ko, le reste tout ok.
const mixte = { ...allOk };
for (const q of QUESTIONS.filter((q) => q.axis === "acces")) {
  mixte[q.id] = q.options.find((o) => o.status === "ko")!.value;
}
const axisMixte = computeAxisScores(mixte);
check("mixte : axe accès à 0, autres à 100",
  axisMixte.acces === 0 &&
  axisMixte.citabilite === 100 &&
  axisMixte.structure === 100 &&
  axisMixte.autorite === 100,
  axisMixte,
);
// Accès = 24/100 du poids : le score global du profil mixte doit être 76.
check("mixte : score global 76", computeScore(mixte) === 76, computeScore(mixte));

console.log("— Recommandations");
check("tout ok → aucune reco", getRecommendations(allOk).length === 0);
check("tout ko → 3 recos max", getRecommendations(allKo).length === 3);
const recosKo = getRecommendations(allKo);
check(
  "tout ko → recos triées par poids décroissant",
  recosKo.every((r, i) => i === 0 || recosKo[i - 1].weight >= r.weight),
  recosKo.map((r) => `${r.questionId}:${r.weight}`),
);
// Un seul ko (llms, poids 5) parmi des warn : le ko passe devant malgré son petit poids.
const unKo = { ...allWarn, llms: QUESTIONS.find((q) => q.id === "llms")!.options.find((o) => o.status === "ko")!.value };
const recosUnKo = getRecommendations(unKo);
check("ko prioritaire sur warn malgré un poids plus faible",
  recosUnKo[0]?.questionId === "llms" && recosUnKo[0]?.status === "ko",
  recosUnKo.map((r) => `${r.questionId}:${r.status}`),
);

console.log("— Cohérence verdict / escalier de CTA");
// Chaque palier est atteignable : on vérifie qu'il existe un profil par palier.
check("les 3 paliers sont atteignables", (
  getTier(computeScore(allOk)) === "visible" &&
  getTier(computeScore(allWarn)) === "partiel" &&
  getTier(computeScore(allKo)) === "invisible"
));

if (failures > 0) {
  console.error(`\n${failures} échec(s).`);
  process.exit(1);
}
console.log("\nTous les tests passent.");
