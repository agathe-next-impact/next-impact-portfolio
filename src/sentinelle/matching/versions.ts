// ─────────────────────────────────────────────────────────────────────────────
// Comparaison de versions et évaluation de plages affectées.
//
// C'est le code le plus critique du produit : une erreur ici envoie une alerte
// rouge à un client qui n'est pas concerné, et la crédibilité du service ne s'en
// remet pas (voir prompts/verdict-system-prompt.md, « échelle de verdict »).
//
// Deux partis pris qui gouvernent tout le fichier :
//
//  1. Les versions de plugins WordPress ne respectent pas semver. On rencontre
//     « 6.6.20 » (où 20 > 3, pas « 20 » < « 3 » en lexical), « 2.8.4.1 » (quatre
//     segments), « 1.0-beta », « 2.0RC1 ». La comparaison est donc tolérante :
//     segments numériques de longueur libre, complétés par des zéros, plus un
//     suffixe de pré-version traité comme en semver (une pré-version est
//     TOUJOURS inférieure à la version finale du même numéro).
//
//  2. En cas de doute, on n'alerte pas. Version inconnue, plage illisible,
//     opérateur non géré : toutes ces fonctions renvoient « non affecté » plutôt
//     que de deviner. Un faux négatif se rattrape au digest mensuel ; un faux
//     positif rouge coûte un client.
// ─────────────────────────────────────────────────────────────────────────────

export type Comparator = "<" | "<=" | ">" | ">=" | "=";

export interface VersionConstraint {
  operator: Comparator;
  /** Version telle qu'écrite dans la source (conservée pour l'audit). */
  version: string;
}

interface ParsedVersion {
  /** Segments numériques : « 2.8.4.1 » → [2, 8, 4, 1]. */
  release: number[];
  /** Identifiants de pré-version : « 1.0-beta.2 » → ["beta", 2]. */
  prerelease: Array<string | number>;
}

/**
 * Découpe une version en segments numériques + pré-version.
 * Renvoie null si l'entrée ne commence pas par un chiffre (après un « v »
 * optionnel) — c'est-à-dire si ce n'est pas une version exploitable.
 */
export function parseVersion(input: string | null | undefined): ParsedVersion | null {
  if (typeof input !== "string") return null;

  // Métadonnées de build ignorées (semver §10) : « 1.2.3+20260815 » === « 1.2.3 ».
  const cleaned = input.trim().toLowerCase().split("+")[0].replace(/^v/, "");
  if (!cleaned) return null;

  const match = /^(\d+(?:\.\d+)*)(.*)$/.exec(cleaned);
  if (!match) return null;

  const release = match[1].split(".").map((segment) => Number.parseInt(segment, 10));
  if (release.some((segment) => Number.isNaN(segment))) return null;

  // Le reste est une pré-version, avec ou sans séparateur : « -beta.2 », « rc1 », « b ».
  const rest = match[2].replace(/^[-._]/, "");
  // Chaque suite de chiffres ou de lettres devient un identifiant : « beta10 » →
  // ["beta", 10], ce qui fait correctement beta2 < beta10 (une comparaison
  // purement lexicale donnerait l'inverse).
  const prerelease: Array<string | number> = rest
    ? (rest.match(/\d+|[a-z]+/g) ?? []).map((token) =>
        /^\d+$/.test(token) ? Number.parseInt(token, 10) : token,
      )
    : [];

  return { release, prerelease };
}

function comparePrerelease(
  a: Array<string | number>,
  b: Array<string | number>,
): -1 | 0 | 1 {
  // Absence de pré-version = version finale, donc supérieure (semver §11.3).
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1;
  if (b.length === 0) return -1;

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const left = a[i];
    const right = b[i];
    // Le plus court est inférieur à condition égale : « beta » < « beta.2 ».
    if (left === undefined) return -1;
    if (right === undefined) return 1;

    const leftIsNumber = typeof left === "number";
    const rightIsNumber = typeof right === "number";

    if (leftIsNumber && rightIsNumber) {
      if (left !== right) return left < right ? -1 : 1;
      continue;
    }
    // Un identifiant numérique est toujours inférieur à un identifiant
    // alphanumérique (semver §11.4.3) : « 1.0-1 » < « 1.0-alpha ».
    if (leftIsNumber !== rightIsNumber) return leftIsNumber ? -1 : 1;

    if (left !== right) return left < right ? -1 : 1;
  }

  return 0;
}

/**
 * Compare deux versions.
 * Renvoie -1 si a < b, 0 si égales, 1 si a > b, et **null si l'une des deux
 * n'est pas exploitable** — à traiter comme « je ne sais pas », jamais comme 0.
 */
export function compareVersions(
  a: string | null | undefined,
  b: string | null | undefined,
): -1 | 0 | 1 | null {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) return null;

  const length = Math.max(left.release.length, right.release.length);
  for (let i = 0; i < length; i++) {
    // Segment absent = 0 : « 1.0 » === « 1.0.0 ».
    const l = left.release[i] ?? 0;
    const r = right.release[i] ?? 0;
    if (l !== r) return l < r ? -1 : 1;
  }

  return comparePrerelease(left.prerelease, right.prerelease);
}

/**
 * Analyse une plage affectée.
 *
 * Formes gérées : « < 6.7 », « <=6.6.20 », « >= 2.0 < 2.4 », « >=2.0, <2.4 »,
 * « >=2.0 && <2.4 », « 1.2.3 » (égalité stricte), « * » (toutes versions).
 *
 * Renvoie :
 *   - un tableau de contraintes (conjonction : toutes doivent être vraies) ;
 *   - un tableau **vide** pour « * » — toutes les versions sont affectées ;
 *   - **null** si la plage est illisible (y compris « || », les plages à tiret
 *     « 6.0 - 6.4 » et tout opérateur non géré). Le matching doit journaliser
 *     ces cas : une plage illisible est un fait de veille qu'on laisse passer.
 */
export function parseRange(input: string | null | undefined): VersionConstraint[] | null {
  if (typeof input !== "string") return null;

  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === "*" || normalized === "all") return [];
  // Disjonction non gérée : on refuse plutôt que d'interpréter de travers.
  if (normalized.includes("||")) return null;

  const source = normalized.replace(/&&|,/g, " ");
  const constraintPattern = /(<=|>=|==|=|<|>)?\s*(v?\d[0-9a-z.\-_+]*)/y;
  const constraints: VersionConstraint[] = [];

  let position = 0;
  while (position < source.length) {
    if (/\s/.test(source[position])) {
      position++;
      continue;
    }

    constraintPattern.lastIndex = position;
    const match = constraintPattern.exec(source);
    if (!match) return null;
    if (!parseVersion(match[2])) return null;

    const operator = (match[1] ?? "=").replace("==", "=") as Comparator;
    constraints.push({ operator, version: match[2] });
    position = constraintPattern.lastIndex;
  }

  return constraints.length > 0 ? constraints : null;
}

function satisfies(version: string, constraint: VersionConstraint): boolean {
  const result = compareVersions(version, constraint.version);
  if (result === null) return false;

  switch (constraint.operator) {
    case "<":
      return result < 0;
    case "<=":
      return result <= 0;
    case ">":
      return result > 0;
    case ">=":
      return result >= 0;
    case "=":
      return result === 0;
  }
}

/**
 * La version est-elle dans la plage ? Faux dès qu'un élément manque ou n'est
 * pas exploitable — c'est le comportement voulu, pas un défaut.
 */
export function isVersionInRange(
  version: string | null | undefined,
  range: string | null | undefined,
): boolean {
  const constraints = parseRange(range);
  if (!constraints) return false;
  if (!parseVersion(version)) return false;

  return constraints.every((constraint) => satisfies(version as string, constraint));
}

export interface AffectionInput {
  /** Version connue du composant chez le client — souvent null. */
  version: string | null | undefined;
  /** Plage affectée telle que fournie par la source de veille. */
  affectedRange: string | null | undefined;
  /** Version corrigée, quand la source la donne. */
  fixedIn?: string | null;
}

/**
 * Décide si un composant est affecté par un fait de veille.
 *
 * Ordre : la plage explicite prime ; à défaut on déduit « < fixedIn ». Sans
 * l'une ni l'autre, ou sans version connue chez le client, on répond non.
 */
export function isAffected({ version, affectedRange, fixedIn }: AffectionInput): boolean {
  if (!parseVersion(version)) return false;

  if (parseRange(affectedRange)) {
    return isVersionInRange(version, affectedRange);
  }

  if (parseVersion(fixedIn)) {
    return isVersionInRange(version, `< ${fixedIn}`);
  }

  return false;
}
