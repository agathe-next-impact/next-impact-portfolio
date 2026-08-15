// ─────────────────────────────────────────────────────────────────────────────
// Période d'un numéro de la newsletter.
//
// L'offre est bimensuelle : deux envois par mois, le 1er et le 15. La colonne
// `digests.period` porte un index unique (clientId, period) — c'est lui qui
// garantit qu'un client ne reçoit pas deux fois le même numéro. Le format de
// cette chaîne est donc un invariant de base de données, pas un détail
// d'affichage : s'il ne distingue pas les deux numéros d'un même mois, le
// second envoi est rejeté silencieusement.
//
// Format : "AAAA-MM-N", N ∈ {1, 2}.
// ─────────────────────────────────────────────────────────────────────────────

/** Fuseau de référence de l'offre — les crons sont calés sur Paris. */
export const NEWSLETTER_TIMEZONE = "Europe/Paris";

/** Jour du mois à partir duquel on bascule sur le second numéro. */
export const SECOND_ISSUE_DAY = 15;

export interface NewsletterPeriod {
  year: number;
  /** 1–12. */
  month: number;
  /** 1 = envoi du 1er, 2 = envoi du 15. */
  issue: 1 | 2;
}

/**
 * Décompose un instant en date locale de Paris.
 *
 * On ne lit pas `date.getMonth()` : un cron déclenché à 07:00 heure de Paris le
 * 1er du mois est encore le dernier jour du mois précédent en UTC pendant une
 * partie de l'année. La période serait alors fausse un mois sur deux, et le
 * numéro rangé sous la mauvaise clé unique.
 */
function partsInParis(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: NEWSLETTER_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const read = (type: "year" | "month" | "day") =>
    Number.parseInt(parts.find((part) => part.type === type)?.value ?? "", 10);

  return { year: read("year"), month: read("month"), day: read("day") };
}

/** Période du numéro correspondant à un instant donné. */
export function newsletterPeriodAt(date: Date): NewsletterPeriod {
  const { year, month, day } = partsInParis(date);
  return { year, month, issue: day < SECOND_ISSUE_DAY ? 1 : 2 };
}

/** Sérialise une période au format stocké en base : "2026-08-1". */
export function formatNewsletterPeriod({ year, month, issue }: NewsletterPeriod): string {
  return `${year}-${String(month).padStart(2, "0")}-${issue}`;
}

/** Raccourci : instant → clé de période stockable. */
export function newsletterPeriodKey(date: Date): string {
  return formatNewsletterPeriod(newsletterPeriodAt(date));
}

/**
 * Relit une clé de période. Renvoie null si la chaîne n'est pas au format
 * attendu — utile pour ne pas propager une clé douteuse dans une requête.
 */
export function parseNewsletterPeriod(key: string | null | undefined): NewsletterPeriod | null {
  if (typeof key !== "string") return null;

  const match = /^(\d{4})-(0[1-9]|1[0-2])-([12])$/.exec(key.trim());
  if (!match) return null;

  return {
    year: Number.parseInt(match[1], 10),
    month: Number.parseInt(match[2], 10),
    issue: Number.parseInt(match[3], 10) as 1 | 2,
  };
}

/** Numéro précédent — sert au bloc « delta » de la newsletter (phase 4). */
export function previousNewsletterPeriod(period: NewsletterPeriod): NewsletterPeriod {
  if (period.issue === 2) return { ...period, issue: 1 };
  if (period.month === 1) return { year: period.year - 1, month: 12, issue: 2 };
  return { year: period.year, month: period.month - 1, issue: 2 };
}
