import type {
  CartographiePayload,
  Deliverable,
  PrestationPayload,
  RoadmapPayload,
} from "../deliverables";

// ─────────────────────────────────────────────────────────────────────────────
// Le calendrier du tableau de bord.
//
// Une seule question : « qu'est-ce qui tombe, et quand ? ». Il n'ajoute aucune
// donnée — il remet sur un même axe des dates déjà publiées ailleurs :
// échéances de chantiers, renouvellements de contrats, livraisons de
// prestations, parutions de lettres. Un dirigeant ne fait pas la différence
// entre un renouvellement et un chantier quand il regarde le mois qui vient.
//
// Pur, testé : le rendu (grille, liste) vit dans l'espace.
// ─────────────────────────────────────────────────────────────────────────────

export type EventKind = "chantier" | "echeance" | "prestation" | "lettre";

export interface CalendarEvent {
  date: Date;
  kind: EventKind;
  title: string;
  /** Où aller pour en savoir plus. */
  href: string | null;
  /** Vrai si la date est passée et la chose pas faite. */
  overdue: boolean;
}

const DONE_ROADMAP = new Set(["Fait", "Écarté"]);
const DONE_PRESTATION = new Set(["Terminée"]);

export function buildEvents(
  items: Deliverable[],
  letters: { title: string; period: Date | null; href: string }[],
  hrefFor: (item: Deliverable) => string | null,
  now: Date = new Date(),
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = startOfDay(now).getTime();

  for (const item of items) {
    if (!item.occurredAt) continue;
    const past = item.occurredAt.getTime() < today;

    if (item.kind === "roadmap") {
      const statut = (item.payload as RoadmapPayload).statut;
      // Un chantier fait ou écarté n'a plus d'échéance à tenir : l'afficher
      // dans le calendrier ferait croire à une date encore ouverte.
      if (statut && DONE_ROADMAP.has(statut)) continue;
      events.push({ date: item.occurredAt, kind: "chantier", title: item.title, href: hrefFor(item), overdue: past });
    } else if (item.kind === "cartographie") {
      const payload = item.payload as CartographiePayload;
      events.push({
        date: item.occurredAt,
        kind: "echeance",
        title: payload.type ? `${item.title} (${payload.type.toLowerCase()})` : item.title,
        href: hrefFor(item),
        overdue: past,
      });
    } else if (item.kind === "prestation") {
      const statut = (item.payload as PrestationPayload).statut;
      if (statut && DONE_PRESTATION.has(statut)) continue;
      events.push({ date: item.occurredAt, kind: "prestation", title: item.title, href: hrefFor(item), overdue: past });
    }
  }

  for (const letter of letters) {
    if (!letter.period) continue;
    events.push({ date: letter.period, kind: "lettre", title: letter.title, href: letter.href, overdue: false });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Les événements à venir (et en retard) dans les `days` prochains jours. */
export function upcoming(events: CalendarEvent[], now: Date = new Date(), days = 90): CalendarEvent[] {
  const start = startOfDay(now).getTime();
  const end = start + days * 86_400_000;
  return events.filter((event) => {
    const t = event.date.getTime();
    if (event.overdue) return event.kind !== "lettre";
    return t >= start && t < end;
  });
}

export interface MonthDay {
  date: Date;
  /** Faux pour les jours de remplissage du mois précédent / suivant. */
  inMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

/**
 * La grille d'un mois, semaines commençant le lundi, en heure de Paris.
 *
 * Six lignes au plus, jamais moins de quatre : la grille ne change de hauteur
 * que d'un mois à l'autre, pas d'un rendu à l'autre.
 */
export function monthGrid(year: number, month: number, events: CalendarEvent[], now: Date = new Date()): MonthDay[][] {
  const first = new Date(Date.UTC(year, month, 1, 12));
  // Lundi = 0.
  const offset = (first.getUTCDay() + 6) % 7;
  const start = new Date(first.getTime() - offset * 86_400_000);
  const todayKey = dayKey(now);

  const byDay = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = dayKey(event.date);
    const list = byDay.get(key) ?? [];
    list.push(event);
    byDay.set(key, list);
  }

  const weeks: MonthDay[][] = [];
  for (let w = 0; w < 6; w += 1) {
    const week: MonthDay[] = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(start.getTime() + (w * 7 + d) * 86_400_000);
      const key = dayKey(date);
      week.push({
        date,
        inMonth: date.getUTCMonth() === month,
        isToday: key === todayKey,
        events: byDay.get(key) ?? [],
      });
    }
    // Une semaine entièrement hors du mois, après la dernière, ne s'affiche pas.
    if (w >= 4 && week.every((day) => !day.inMonth)) break;
    weeks.push(week);
  }
  return weeks;
}

/** Clé jour en heure de Paris : une date Notion « sans heure » arrive à minuit UTC. */
export function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function startOfDay(date: Date): Date {
  const [y, m, d] = dayKey(date).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0));
}
