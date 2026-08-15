import { isAffected } from "@sentinelle/matching";
import type { Verdict } from "@sentinelle/types";
import {
  formatNewsletterPeriod,
  previousNewsletterPeriod,
  SECOND_ISSUE_DAY,
  type NewsletterPeriod,
} from "./period";

// ─────────────────────────────────────────────────────────────────────────────
// Contenu d'un numéro, en cinq blocs.
//
// Trois d'entre eux (état, delta, radar) s'assemblent **sans modèle de langage**
// : ce sont des faits déjà en base, et les faire écrire par un LLM ne ferait
// qu'ajouter un risque d'invention à des données exactes. Les deux autres
// (veille contextualisée, recommandation) sont rédigés, donc relus.
//
// Tout ce qui sort d'ici est sérialisable en JSON : les blocs vivent dans une
// colonne `jsonb`, et une `Date` n'y survit pas. Les dates sont donc des chaînes
// ISO, converties une seule fois, ici.
//
// Le module est pur : aucune requête, aucune horloge implicite. C'est ce qui
// permet de vérifier la règle du radar (« six mois, et seulement si la version
// du client est concernée ») sans base de données.
// ─────────────────────────────────────────────────────────────────────────────

/** Fenêtre du radar, alignée sur celle du matching. */
export const RADAR_MONTHS = 6;

export interface HealthLine {
  label: string;
  version: string | null;
  type: string;
  /** Alertes ouvertes ou envoyées sur ce composant pendant la période. */
  openAlerts: number;
}

export interface DeltaEntry {
  title: string;
  verdict: Verdict | null;
  /** Date ISO de l'envoi. */
  at: string;
}

export interface RadarEntry {
  label: string;
  version: string | null;
  title: string;
  /** Date ISO (jour) de fin de support. */
  endsOn: string;
  daysLeft: number;
}

export interface NewsletterBlocks {
  period: string;
  /** Date du numéro — celle de la période, jamais celle de l'envoi. */
  issueDate: string;
  health: {
    components: HealthLine[];
    /** Composants suivis dont la version reste inconnue — à compléter. */
    withoutVersion: number;
  };
  delta: {
    /** Date ISO du numéro précédent, null pour un premier numéro. */
    since: string | null;
    alerts: DeltaEntry[];
    newComponents: Array<{ label: string; version: string | null }>;
  };
  /** Bloc rédigé : la veille du moment, contextualisée. */
  watch: string;
  /** Bloc rédigé : la recommandation du numéro. */
  reco: string;
  radar: RadarEntry[];
}

/**
 * Instant de parution d'un numéro, en UTC.
 *
 * La période est calculée en heure de Paris (`period.ts`) ; les colonnes de date
 * de la base sont en UTC. L'écart d'une à deux heures n'a aucune conséquence sur
 * une fenêtre qui se compte en semaines, et le noter ici évite de le
 * redécouvrir : c'est le même constat que celui laissé ouvert au lot 1
 * (colonnes `timestamp` sans fuseau).
 */
export function periodStart(period: NewsletterPeriod): Date {
  const day = period.issue === 1 ? 1 : SECOND_ISSUE_DAY;
  return new Date(Date.UTC(period.year, period.month - 1, day, 0, 0, 0));
}

/** Fenêtre couverte par un numéro : du numéro précédent à celui-ci. */
export function periodWindow(period: NewsletterPeriod): { from: Date; to: Date } {
  return { from: periodStart(previousNewsletterPeriod(period)), to: periodStart(period) };
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

/** Entrée brute du radar, telle que la jointure la rend. */
export interface RadarCandidate {
  label: string;
  version: string | null;
  intelKind: string;
  intelTitle: string;
  affectedRange: string | null;
  fixedIn: string | null;
  /** Date de fin de support portée par le fait (`intel_items.published_at`). */
  endsOn: Date | null;
}

/**
 * Fins de support à venir qui concernent réellement ce client.
 *
 * Deux filtres, et le second est le seul qui compte vraiment : la date doit être
 * **à venir** (une échéance passée n'est plus un radar, c'est une alerte, et
 * elle a déjà été envoyée), et la version du client doit être dans la plage. Sans
 * ce dernier contrôle, un client en PHP 8.3 lirait chaque quinzaine que PHP 8.1
 * arrive en fin de vie — vrai, mais pas pour lui.
 */
export function buildRadar(candidates: RadarCandidate[], now: Date): RadarEntry[] {
  const horizon = new Date(now);
  horizon.setUTCMonth(horizon.getUTCMonth() + RADAR_MONTHS);

  const entries: RadarEntry[] = [];

  for (const candidate of candidates) {
    if (candidate.intelKind !== "eol" || !candidate.endsOn) continue;
    if (candidate.endsOn <= now || candidate.endsOn > horizon) continue;

    if (
      !isAffected({
        version: candidate.version,
        affectedRange: candidate.affectedRange,
        fixedIn: candidate.fixedIn,
      })
    ) {
      continue;
    }

    entries.push({
      label: candidate.label,
      version: candidate.version,
      title: candidate.intelTitle,
      endsOn: candidate.endsOn.toISOString().slice(0, 10),
      daysLeft: daysBetween(now, candidate.endsOn),
    });
  }

  // Le plus proche d'abord : c'est l'ordre dans lequel on agit.
  return entries.sort((a, b) => a.daysLeft - b.daysLeft);
}

/** Assemble les blocs factuels. Les deux blocs rédigés arrivent vides. */
export function assembleBlocks(input: {
  period: NewsletterPeriod;
  components: HealthLine[];
  sentAlerts: DeltaEntry[];
  newComponents: Array<{ label: string; version: string | null }>;
  radar: RadarEntry[];
  isFirstIssue: boolean;
}): NewsletterBlocks {
  const window = periodWindow(input.period);

  return {
    period: formatNewsletterPeriod(input.period),
    issueDate: periodStart(input.period).toISOString(),
    health: {
      components: input.components,
      withoutVersion: input.components.filter((line) => !line.version).length,
    },
    delta: {
      since: input.isFirstIssue ? null : window.from.toISOString(),
      alerts: input.sentAlerts,
      newComponents: input.newComponents,
    },
    watch: "",
    reco: "",
    radar: input.radar,
  };
}
