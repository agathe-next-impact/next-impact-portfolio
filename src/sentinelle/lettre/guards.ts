import { citedOutside } from "@sentinelle/redaction/guards";
import { AXES, type Dossier, type Lettre } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Les garde-fous de la lettre — deux régimes, pas un.
//
// La lettre d'alerte avait une règle simple : aucun composant hors fiche. Elle
// ne tient plus ici, et c'est voulu — « où va chaque famille de solutions »
// nomme forcément des technologies que ce client n'a pas. L'appliquer telle
// quelle refuserait chaque numéro.
//
// La règle 3 du CLAUDE.md est donc réexprimée en deux régimes :
//
//  · **Ce que la lettre affirme du site du client** est borné par le vocabulaire
//    de sa fiche et du dossier collecté. Rien d'autre ne peut y apparaître.
//  · **Ce que la lettre dit du marché** est borné par le sourçage : chaque URL
//    doit venir du dossier, et chaque source citée doit y figurer avec sa date.
//    Une source inventée est la fabrication la plus coûteuse du produit, et
//    c'est la plus facile à attraper mécaniquement.
//
// **Ce que ce code ne vérifie pas, et qu'il faut savoir :** il borne le
// vocabulaire, pas l'attribution. « Votre site utilise Drupal » et « Drupal
// progresse » emploient le même mot ; distinguer les deux demande de lire la
// phrase. C'est le travail de la relecture humaine (règle 4), et c'est
// précisément pour ça qu'elle est obligatoire.
// ─────────────────────────────────────────────────────────────────────────────

/** Longueur visée d'un numéro complet, en mots. */
export const FULL_LENGTH = { min: 3000, max: 4500 } as const;

/** Longueur visée d'un numéro allégé — période creuse ou premier numéro. */
export const SHORT_LENGTH = { min: 1200, max: 1800 } as const;

export interface LettreGuardOutcome {
  ok: boolean;
  /** Manquements non corrigeables : le numéro est refusé, pas relu. */
  violations: string[];
  /** Points à signaler à la relecture — consignés, jamais bloquants. */
  warnings: string[];
  wordCount: number;
}

const URL_PATTERN = /https?:\/\/[^\s"'<>)\]]+/gi;

/** Normalise une URL pour la comparaison : sans protocole, sans barre finale. */
export function normalizeUrl(url: string): string {
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[.,;)\]]+$/, "")
    .replace(/\/$/, "");
}

function urlsIn(text: string): string[] {
  return (text.match(URL_PATTERN) ?? []).map(normalizeUrl);
}

/** Tout le texte destiné au client — le bloc de production en est exclu. */
export function clientText(lettre: Lettre): string {
  const parts: string[] = [
    lettre.titre,
    lettre.ligneContexte,
    lettre.chapeau,
    lettre.siteEnUnePhrase,
    lettre.ligneCloture,
  ];

  for (const axe of lettre.axes) parts.push(axe.nom, axe.question, axe.analyse, axe.horizon);

  for (const t of lettre.tendances.duMois) parts.push(t.tendance, t.faitDate, t.pourCeSite);
  for (const m of lettre.tendances.marche) parts.push(m.famille, m.mouvement, m.lecture);
  parts.push(...lettre.tendances.signauxDeDemande);
  for (const f of lettre.tendances.deFond) parts.push(f.mouvement, f.faitDate, f.qualification);
  parts.push(...lettre.tendances.ceQuiNeChangePas);

  const { synthese } = lettre;
  for (const a of synthese.actions) parts.push(a.action, a.horizon, a.pourquoi);
  parts.push(synthese.reste);
  for (const s of synthese.scenarios) {
    parts.push(
      s.nom,
      s.commandePar,
      s.faitsDeMarche,
      s.axesCouverts,
      s.ordreDeCout,
      s.retourAttendu,
      s.conditionDeDeclenchement,
    );
  }
  for (const d of synthese.aDifferer) parts.push(d.choix, d.raison);
  parts.push(synthese.budget.coutTroisACinqAns, ...synthese.budget.indicateurs);
  parts.push(synthese.budget.pointDEquilibre, synthese.budget.siPasDeChiffres);
  for (const c of synthese.commentDecider) parts.push(c.entree, c.ceQuElleTeste, c.date);

  for (const e of lettre.echeancier) parts.push(e.date, e.echeance);
  for (const q of lettre.questions) parts.push(q.question);
  for (const groupe of lettre.sources) {
    parts.push(groupe.theme);
    for (const f of groupe.faits) parts.push(f.enonce, f.date, f.source);
  }

  return parts.join("\n");
}

/**
 * Ce que la lettre affirme **du site du client**.
 *
 * Volontairement restreint à la phrase de synthèse et aux douze axes : ce sont
 * les endroits où une technologie nommée se lit comme « vous l'avez ». Les
 * tendances et le marché parlent d'autre chose et relèvent du régime de sourçage.
 */
function siteText(lettre: Lettre): string {
  return [lettre.siteEnUnePhrase, ...lettre.axes.map((axe) => axe.analyse)].join("\n");
}

export function wordCount(lettre: Lettre): number {
  return clientText(lettre).split(/\s+/).filter(Boolean).length;
}

/**
 * Vocabulaire que la lettre a le droit d'employer en parlant du site.
 *
 * Trois sources, et la troisième a été ajoutée après un faux positif en réel :
 *
 *  · **la fiche du client** — ce qu'il a ;
 *  · **les faits et observations du dossier** — un nom trouvé dans une source
 *    ouverte pendant la collecte n'a pas été inventé à la rédaction ;
 *  · **les publics et le contexte du client** — et c'est le point qui manquait.
 *    Le 2026-08-15, un numéro a été refusé parce qu'il écrivait « WordPress » à
 *    propos d'un site sous Next.js. Le mot était pourtant juste : le dossier
 *    décrivait ses publics comme « des dirigeants au parc WordPress
 *    vieillissant ». Un garde-fou qui refuse à un studio de parler du parc de
 *    ses clients ne protège plus rien, il empêche d'écrire.
 */
export function allowedVocabulary(
  ficheNames: string[],
  dossier: Dossier,
  clientContext = "",
): string[] {
  const dossierText = [
    ...dossier.faits.flatMap((fait) => [fait.enonce, fait.famille, ...fait.toucheFiche]),
    ...dossier.observations.map((observation) => `${observation.sujet} ${observation.constat}`),
    ...dossier.publics.map(
      (public_) => `${public_.nom} ${public_.cherche} ${public_.attenduDuSite} ${public_.niveauDeReponse}`,
    ),
    clientContext,
  ].join("\n");

  // `citedOutside` rend les technologies du catalogue présentes dans un texte
  // quand rien n'est autorisé : c'est exactement la liste cherchée.
  return [...ficheNames, ...citedOutside(dossierText, [])];
}

export function guardLettre(
  lettre: Lettre,
  input: { dossier: Dossier; ficheNames: string[]; quiet: boolean; clientContext?: string },
): LettreGuardOutcome {
  const violations: string[] = [];
  const warnings: string[] = [];

  // ── Régime 1 : sourçage ────────────────────────────────────────────────
  const known = new Set(input.dossier.faits.map((fait) => normalizeUrl(fait.source)));
  const inventedUrls = [...new Set(urlsIn(clientText(lettre)))].filter(
    (url) => url !== "" && !known.has(url),
  );
  if (inventedUrls.length > 0) {
    violations.push(`sources absentes du dossier : ${inventedUrls.join(", ")}`);
  }

  const undated = lettre.sources
    .flatMap((groupe) => groupe.faits)
    .filter((fait) => fait.date.trim() === "");
  if (undated.length > 0) {
    violations.push(`${undated.length} source(s) citée(s) sans date`);
  }

  if (lettre.sources.length === 0 && input.dossier.faits.length > 0) {
    violations.push("aucune source citée alors que le dossier en contient");
  }

  // ── Régime 2 : vocabulaire, sur ce qui est dit du site ──────────────────
  const invented = citedOutside(
    siteText(lettre),
    allowedVocabulary(input.ficheNames, input.dossier, input.clientContext ?? ""),
  );
  if (invented.length > 0) {
    violations.push(
      `technologies attribuées au site hors fiche et hors dossier : ${invented.join(", ")}`,
    );
  }

  // ── Structure : ce que la sortie structurée ne sait pas exprimer ────────
  const numeros = lettre.axes.map((axe) => axe.numero);
  const attendus = AXES.map((_, index) => index + 1);
  const manquants = attendus.filter((numero) => !numeros.includes(numero));
  if (manquants.length > 0) {
    violations.push(`axes manquants : ${manquants.join(", ")}`);
  }
  if (new Set(numeros).size !== numeros.length) {
    violations.push("un axe est traité deux fois");
  }

  const sansHorizon = lettre.axes.filter(
    (axe) => axe.statut === "agir" && axe.horizon.trim() === "",
  );
  if (sansHorizon.length > 0) {
    violations.push(
      `axe(s) en « agir » sans horizon : ${sansHorizon.map((axe) => axe.numero).join(", ")}`,
    );
  }

  if (lettre.synthese.actions.length > 3) {
    violations.push(`${lettre.synthese.actions.length} actions prioritaires — trois au maximum`);
  }
  if (lettre.synthese.scenarios.length !== 3) {
    violations.push(`${lettre.synthese.scenarios.length} scénarios — il en faut trois`);
  }

  const sansDeclenchement = lettre.synthese.scenarios.filter(
    (scenario) => scenario.conditionDeDeclenchement.trim() === "",
  );
  if (sansDeclenchement.length > 0) {
    violations.push("un scénario est sans condition de déclenchement observable");
  }

  if (lettre.questions.length !== 3) {
    violations.push(`${lettre.questions.length} questions au prestataire — il en faut trois`);
  }

  const horsBornes = [
    ...lettre.questions.flatMap((question) => question.axes),
    ...lettre.echeancier.map((entree) => entree.axe),
  ].filter((numero) => numero < 1 || numero > AXES.length);
  if (horsBornes.length > 0) {
    violations.push(`renvoi(s) vers un axe inexistant : ${[...new Set(horsBornes)].join(", ")}`);
  }

  // ── Signalements — la relecture tranche ────────────────────────────────
  const count = wordCount(lettre);
  const band = input.quiet ? SHORT_LENGTH : FULL_LENGTH;
  if (count < band.min) {
    warnings.push(`numéro court : ${count} mots pour une cible de ${band.min} à ${band.max}`);
  } else if (count > band.max) {
    warnings.push(`numéro long : ${count} mots pour une cible de ${band.min} à ${band.max}`);
  }

  const fond = lettre.tendances.deFond.length;
  if (fond < 4 || fond > 6) {
    warnings.push(`${fond} tendances de fond — la lettre en attend quatre à six`);
  }

  const invariants = lettre.tendances.ceQuiNeChangePas.length;
  if (invariants < 2 || invariants > 3) {
    warnings.push(`${invariants} invariants — la lettre en attend deux à trois`);
  }

  if (!lettre.axes.some((axe) => axe.statut === "nonConcerne")) {
    warnings.push(
      "aucun axe en « non concerné » : vérifier qu'aucun ne l'est vraiment, c'est une information",
    );
  }

  if (input.dossier.siteInjoignable.trim() !== "") {
    warnings.push(`site non analysé ce numéro-ci : ${input.dossier.siteInjoignable}`);
  }

  return { ok: violations.length === 0, violations, warnings, wordCount: count };
}
