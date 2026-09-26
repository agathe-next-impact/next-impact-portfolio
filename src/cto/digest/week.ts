// ─────────────────────────────────────────────────────────────────────────────
// La semaine d'un digest : semaine ISO, en heure de Paris.
//
// Même précaution que les périodes de Sentinelle : on ne lit jamais
// `date.getDay()`, qui donne le jour en UTC. Un balayage lancé à 00:30 heure de
// Paris le lundi est encore dimanche en UTC, et le digest serait rangé une
// semaine trop tôt.
// ─────────────────────────────────────────────────────────────────────────────

const TIMEZONE = "Europe/Paris";

function partsInParis(date: Date): { year: number; month: number; day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) => Number.parseInt(parts.find((p) => p.type === type)?.value ?? "", 10);
  return { year: read("year"), month: read("month"), day: read("day"), hour: read("hour") };
}

/** Numéro de semaine ISO d'une date civile (année, mois 1-12, jour). */
function isoWeekOfCivil(year: number, month: number, day: number): { year: number; week: number } {
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay() || 7; // lundi = 1 … dimanche = 7
  date.setUTCDate(date.getUTCDate() + 4 - weekday); // le jeudi de la semaine
  const isoYear = date.getUTCFullYear();
  const firstDay = Date.UTC(isoYear, 0, 1);
  const week = Math.ceil(((date.getTime() - firstDay) / 86_400_000 + 1) / 7);
  return { year: isoYear, week };
}

function format({ year, week }: { year: number; week: number }): string {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** La semaine ISO (heure de Paris) qui contient cet instant, ex. `2026-W39`. */
export function weekOf(date: Date): string {
  const { year, month, day } = partsInParis(date);
  return format(isoWeekOfCivil(year, month, day));
}

/** La dernière semaine complète : celle que le digest du lundi couvre. */
export function previousWeek(now: Date): string {
  return weekOf(new Date(now.getTime() - 7 * 86_400_000));
}

export function parseWeek(value: string | null | undefined): { year: number; week: number } | null {
  const match = /^(\d{4})-W(0[1-9]|[1-4]\d|5[0-3])$/.exec(value?.trim() ?? "");
  if (!match) return null;
  return { year: Number(match[1]), week: Number(match[2]) };
}

/** Minuit, heure de Paris, de cette date civile, en instant UTC. */
function parisMidnight(year: number, month: number, day: number): Date {
  const guess = Date.UTC(year, month - 1, day, 0, 0);
  // À minuit UTC, Paris affiche 01:00 ou 02:00 le même jour : c'est l'écart.
  const offsetHours = partsInParis(new Date(guess)).hour;
  return new Date(guess - offsetHours * 3_600_000);
}

/** Bornes de la semaine : du lundi 00:00 inclus au lundi suivant exclu, heure de Paris. */
export function weekRange(week: string): { from: Date; to: Date } {
  const parsed = parseWeek(week);
  if (!parsed) throw new Error(`semaine invalide : ${week}`);
  // Le 4 janvier est toujours en semaine 1.
  const jan4 = new Date(Date.UTC(parsed.year, 0, 4));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() || 7) - 1) + (parsed.week - 1) * 7);
  const next = new Date(monday);
  next.setUTCDate(monday.getUTCDate() + 7);
  return {
    from: parisMidnight(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate()),
    to: parisMidnight(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()),
  };
}

/** « Semaine 39 · du 21 au 27 septembre 2026 » */
export function weekLabel(week: string): string {
  const parsed = parseWeek(week);
  if (!parsed) return week;
  const { from, to } = weekRange(week);
  const last = new Date(to.getTime() - 3_600_000);
  const jour = new Intl.DateTimeFormat("fr-FR", { timeZone: TIMEZONE, day: "numeric" });
  const complet = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const memeMois = partsInParis(from).month === partsInParis(last).month;
  const debut = memeMois
    ? jour.format(from)
    : new Intl.DateTimeFormat("fr-FR", { timeZone: TIMEZONE, day: "numeric", month: "long" }).format(from);
  return `Semaine ${parsed.week} · du ${debut} au ${complet.format(last)}`;
}
