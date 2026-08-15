// ─────────────────────────────────────────────────────────────────────────────
// Politique de conservation — source unique des durées (plan §9).
//
// Trois partis pris qui expliquent la forme du fichier :
//
//  1. **La rétention est du code testé, pas un paragraphe dans une page
//     légale.** Ce qui est écrit sur /confidentialite doit être exactement ce
//     que ce fichier applique ; l'inverse est une promesse en l'air.
//
//  2. **Fonctions pures, horloge injectée.** Aucune de ces fonctions ne lit
//     `Date.now()` : la date est un argument. C'est ce qui permet de tester
//     « à J+23 h on ne purge pas, à J+25 h on purge » sans attendre.
//
//  3. **La décision est ici, l'exécution est dans purge.ts.** Le SQL ne fait
//     que présélectionner des candidats ; c'est ce module qui tranche, ligne
//     par ligne, avant toute suppression. Une purge de production se relit
//     mieux quand la règle est isolée du pilote.
//
// À savoir sur les dates : les colonnes sont des `timestamp` sans fuseau et
// Postgres y écrit l'heure du serveur (UTC sur Neon). Les écarts de fuseau se
// comptent donc en heures sur des seuils qui se comptent en jours ou en mois —
// sans conséquence, mais autant l'avoir écrit.
// ─────────────────────────────────────────────────────────────────────────────

export interface Duration {
  hours?: number;
  days?: number;
  months?: number;
  years?: number;
}

/**
 * Durées de conservation. **C'est la source unique** : toute autre mention
 * (page de confidentialité, documentation, e-mail) doit refléter ce tableau.
 */
export const RETENTION = {
  /** Empreinte d'IP et user-agent d'un scan : anti-abus, rien d'autre. */
  scanIdentifiers: { hours: 24 },
  /** Scan pour lequel personne n'a laissé d'adresse : la ligne entière part. */
  anonymousScan: { days: 30 },
  /** Résultat technique d'un scan identifié : périmé au bout d'un an. */
  scanResult: { months: 12 },
  /** Adresse laissée sur un rapport : même régime que le formulaire de contact. */
  lead: { years: 3 },
  /** Après résiliation : cartographie du stack et identité du client. */
  cancellation: { months: 3 },
  /** Après résiliation : textes d'alertes et de numéros (preuve de prestation). */
  cancellationTexts: { months: 12 },
  /** Payload source d'un fait de veille — aucune donnée personnelle. */
  intelRaw: { months: 24 },
} as const satisfies Record<string, Duration>;

// Un poste du §9 ne figure volontairement pas dans ce tableau : **les jetons de
// connexion**. Leur durée de vie (quinze minutes) est portée par le jeton
// lui-même, écrite en base ligne par ligne dans `magic_links.expires_at`, et
// leur suppression est d'abord un effet de leur usage. Leur donner une durée
// ici ferait exister deux échéances pour la même chose, et un jour elles
// divergeraient. Le balayage des jetons échus est dans `purge.ts`.

/**
 * Recule une date d'une durée.
 *
 * Les mois se comptent en mois calendaires, avec écrêtage du quantième : un mois
 * avant le 31 mars, c'est le 28 (ou le 29) février, jamais le 3 mars — un
 * report silencieux allongerait la conservation au-delà de ce qui est annoncé.
 */
export function minus(reference: Date, duration: Duration): Date {
  const date = new Date(reference.getTime());

  if (duration.hours) date.setUTCHours(date.getUTCHours() - duration.hours);
  if (duration.days) date.setUTCDate(date.getUTCDate() - duration.days);

  const months = (duration.months ?? 0) + (duration.years ?? 0) * 12;
  if (months) {
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - months);
    const lastDay = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
    ).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
  }

  return date;
}

export type Cutoffs = Record<keyof typeof RETENTION, Date>;

/**
 * Les dates limites du jour : tout ce qui est antérieur est expiré.
 * Une seule horloge pour toute la passe, pour qu'un cron qui dure trois minutes
 * n'applique pas trois seuils différents.
 */
export function cutoffs(now: Date): Cutoffs {
  const computed = {} as Cutoffs;
  for (const [key, duration] of Object.entries(RETENTION)) {
    computed[key as keyof typeof RETENTION] = minus(now, duration);
  }
  return computed;
}

function isBefore(date: Date | null | undefined, limit: Date): boolean {
  return date instanceof Date && date.getTime() < limit.getTime();
}

// ─── Scans ────────────────────────────────────────────────────────────────

/** Sous-ensemble d'une ligne `scans` dont la décision dépend. */
export interface ScanRow {
  id: string;
  createdAt: Date;
  leadEmail: string | null;
  ipHash: string | null;
  userAgent: string | null;
  result: unknown;
}

export interface ScanVerdict {
  /** Lignes à supprimer entièrement. */
  rowsToDelete: string[];
  /** Lignes dont l'empreinte d'IP et le user-agent sont à effacer. */
  identifiersToClear: string[];
  /** Lignes dont le résultat technique est à purger, la ligne restant. */
  resultsToPurge: string[];
}

/**
 * Trie les scans expirés en trois gestes.
 *
 * Une ligne supprimée n'apparaît dans aucune autre liste : effacer l'IP d'une
 * ligne qu'on va supprimer dans le même cron ferait deux écritures pour rien et
 * un journal deux fois plus long à lire.
 */
export function expiredScans(rows: ScanRow[], now: Date): ScanVerdict {
  const limits = cutoffs(now);
  const verdict: ScanVerdict = {
    rowsToDelete: [],
    identifiersToClear: [],
    resultsToPurge: [],
  };

  for (const row of rows) {
    const anonymous = !row.leadEmail;

    // Scan anonyme périmé, ou prospect au-delà de trois ans : la ligne part.
    if (
      (anonymous && isBefore(row.createdAt, limits.anonymousScan)) ||
      (!anonymous && isBefore(row.createdAt, limits.lead))
    ) {
      verdict.rowsToDelete.push(row.id);
      continue;
    }

    if ((row.ipHash || row.userAgent) && isBefore(row.createdAt, limits.scanIdentifiers)) {
      verdict.identifiersToClear.push(row.id);
    }

    if (row.result !== null && isBefore(row.createdAt, limits.scanResult)) {
      verdict.resultsToPurge.push(row.id);
    }
  }

  return verdict;
}

// ─── Clients résiliés ─────────────────────────────────────────────────────

/** Sous-ensemble d'une ligne `clients` dont la décision dépend. */
export interface ClientRow {
  id: string;
  active: boolean;
  deactivatedAt: Date | null;
}

export interface ClientVerdict {
  /**
   * Clients dont le stack doit être effacé et l'identité anonymisée.
   *
   * Les deux gestes vont ensemble et au même terme : la liste des composants et
   * des versions d'un site est exactement ce qu'un attaquant voudrait, elle ne
   * s'archive pas « au cas où ».
   */
  toAnonymize: string[];
}

/**
 * Clients résiliés depuis assez longtemps pour être effacés.
 *
 * Un client réactivé (`active: true`) n'est jamais candidat, même si une vieille
 * date de résiliation traîne : c'est le rejeu d'un webhook qui produirait ce cas,
 * et il ne doit pas coûter ses données à un abonné payant.
 */
export function expiredClients(rows: ClientRow[], now: Date): ClientVerdict {
  const limit = cutoffs(now).cancellation;

  return {
    toAnonymize: rows
      .filter((row) => !row.active && isBefore(row.deactivatedAt, limit))
      .map((row) => row.id),
  };
}

// ─── Textes d'alertes et de numéros ───────────────────────────────────────

/** Une alerte ou un numéro, vu depuis la rétention. */
export interface WrittenRow {
  id: string;
  /** Date de résiliation du client auquel la ligne appartient. */
  clientDeactivatedAt: Date | null;
  /** La ligne porte-t-elle encore un texte à purger ? */
  hasText: boolean;
}

/**
 * Textes conservés douze mois après la résiliation, comme preuve de la
 * prestation rendue, puis effacés.
 *
 * Ce qui reste ensuite — verdict, dates, comptage — ne désigne plus personne :
 * c'est la métrique anonyme que le plan conserve sans limite, et c'est elle qui
 * fait progresser le prompt de rédaction.
 */
export function anonymizableAlerts(rows: WrittenRow[], now: Date): string[] {
  const limit = cutoffs(now).cancellationTexts;

  return rows
    .filter((row) => row.hasText && isBefore(row.clientDeactivatedAt, limit))
    .map((row) => row.id);
}
