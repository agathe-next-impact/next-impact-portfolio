import type {
  CartographiePayload,
  Deliverable,
  PrestationPayload,
  RoadmapPayload,
} from "../deliverables";
import type { SiteSnapshot, SiteState } from "../site";
import { dayKey } from "./calendar";

// ─────────────────────────────────────────────────────────────────────────────
// Les trois réponses de l'accueil : où en sont les missions, comment va le
// site, que peut-on faire.
//
// Pur, testé. Aucune donnée nouvelle : tout se déduit des livrables publiés et
// du relevé du site. Ce module ne fait que ranger — par moment (passé, en
// cours, à venir), par gravité (à corriger, à surveiller), par nature (à
// traiter, à arbitrer) — et résumer chaque question en une phrase.
//
// Le vocabulaire de ton est celui de l'espace (`neutre` / `attention` /
// `alerte` / `fait`) : l'affichage le traduit en couleur, toujours doublée
// d'un mot.
// ─────────────────────────────────────────────────────────────────────────────

export type Tone = "neutre" | "attention" | "alerte" | "fait";

/** Une échéance de contrat devient « à anticiper » à soixante jours. */
export const ANTICIPATION_DAYS = 60;

/** Au-delà de sept jours sans sauvegarde réussie, c'est un point à corriger. */
export const BACKUP_MAX_AGE_DAYS = 7;

const JOUR = 86_400_000;

// ─── Missions ────────────────────────────────────────────────────────────

export type Phase = "passe" | "en-cours" | "a-venir";

export type MissionKind = "chantier" | "prestation" | "decision" | "audit";

export interface Mission {
  item: Deliverable;
  kind: MissionKind;
  phase: Phase;
  title: string;
  /** Libellé d'état, tel qu'il s'affiche. */
  status: string;
  /** Échéance, livraison, date de décision ou de mesures. */
  date: Date | null;
  /** Début connu (prestations seulement). */
  start: Date | null;
  /** Avancement de 0 à 100, seulement s'il est suivi. */
  progress: number | null;
  /** Pas encore faite et sa date est passée. */
  overdue: boolean;
}

const ROADMAP_PHASE: Record<string, Phase> = {
  Ouvert: "en-cours",
  Décidé: "en-cours",
  "À venir": "a-venir",
  Fait: "passe",
  Écarté: "passe",
};

const PRESTATION_PHASE: Record<string, Phase> = {
  "En cours": "en-cours",
  Suspendue: "en-cours",
  "À venir": "a-venir",
  Terminée: "passe",
};

/** Vrai pour une opportunité que personne n'a encore tranchée : elle est à arbitrer, pas à suivre. */
export function isOpenOpportunity(item: Deliverable): boolean {
  if (item.kind !== "roadmap") return false;
  const payload = item.payload as RoadmapPayload;
  return payload.nature === "opportunite" && (payload.statut === null || payload.statut === "Ouvert");
}

/** Sans statut reconnu, la date tranche : dans le futur, c'est à venir ; sinon, en cours. */
function phaseByDate(date: Date | null, today: number): Phase {
  return date && date.getTime() >= today ? "a-venir" : "en-cours";
}

/**
 * Tous les livrables qui racontent l'accompagnement, sur une même ligne de temps.
 *
 * Chantiers et prestations suivent leur statut ; une décision et un audit sont
 * des faits accomplis, donc du passé. Une opportunité ouverte n'est PAS une
 * mission — elle attend un arbitrage (voir `actionsFor`) ; écartée, elle n'a
 * jamais été une mission.
 */
export function missionsOf(items: Deliverable[], now: Date = new Date()): Mission[] {
  const today = startOfDay(now).getTime();
  const missions: Mission[] = [];

  for (const item of items) {
    const base = { item, title: item.title, date: item.occurredAt, start: null, progress: null };

    if (item.kind === "roadmap") {
      const payload = item.payload as RoadmapPayload;
      if (isOpenOpportunity(item)) continue;
      if (payload.nature === "opportunite" && payload.statut === "Écarté") continue;
      const phase = (payload.statut && ROADMAP_PHASE[payload.statut]) || phaseByDate(item.occurredAt, today);
      missions.push({ ...base, kind: "chantier", phase, status: payload.statut ?? "Sans statut", overdue: false });
    } else if (item.kind === "prestation") {
      const payload = item.payload as PrestationPayload;
      const phase = (payload.statut && PRESTATION_PHASE[payload.statut]) || phaseByDate(item.occurredAt, today);
      missions.push({
        ...base,
        kind: "prestation",
        phase,
        status: payload.statut ?? "Sans statut",
        start: payload.debut ? new Date(payload.debut) : null,
        progress:
          typeof payload.avancement === "number"
            ? Math.max(0, Math.min(100, Math.round(payload.avancement * 100)))
            : null,
        overdue: false,
      });
    } else if (item.kind === "decision") {
      const ecartee = (item.payload as { nature?: string | null }).nature === "ecartee";
      missions.push({ ...base, kind: "decision", phase: "passe", status: ecartee ? "Proposition écartée" : "Décision", overdue: false });
    } else if (item.kind === "audit") {
      missions.push({ ...base, kind: "audit", phase: "passe", status: "Audit remis", overdue: false });
    }
  }

  for (const mission of missions) {
    mission.overdue = mission.phase !== "passe" && mission.date !== null && mission.date.getTime() < today;
  }

  return missions.sort(byPhaseThenDate);
}

const PHASE_ORDER: Phase[] = ["en-cours", "a-venir", "passe"];

function byPhaseThenDate(a: Mission, b: Mission): number {
  const phase = PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase);
  if (phase !== 0) return phase;
  // Le passé se lit du plus récent au plus ancien ; le reste, du plus proche au
  // plus lointain. Sans date : en fin de liste, dans les deux cas.
  const direction = a.phase === "passe" ? -1 : 1;
  if (!a.date && !b.date) return a.title.localeCompare(b.title, "fr");
  if (!a.date) return 1;
  if (!b.date) return -1;
  return (a.date.getTime() - b.date.getTime()) * direction;
}

export function byPhase(missions: Mission[], phase: Phase): Mission[] {
  return missions.filter((mission) => mission.phase === phase);
}

export interface Verdict {
  headline: string;
  tone: Tone;
}

/** « Où en sont les missions ? », en une phrase. */
export function missionsVerdict(missions: Mission[]): Verdict {
  const enCours = byPhase(missions, "en-cours").length;
  const aVenir = byPhase(missions, "a-venir").length;
  const retard = missions.filter((mission) => mission.overdue).length;

  if (enCours + aVenir === 0) {
    return {
      headline: missions.length > 0 ? "Aucune mission en cours" : "Aucune mission pour l'instant",
      tone: "neutre",
    };
  }

  const debut = enCours > 0 ? `${enCours} en cours` : `Rien en cours, ${aVenir} à venir`;
  if (retard > 0) return { headline: `${debut}, ${retard} en retard`, tone: "alerte" };
  return { headline: enCours > 0 ? `${debut}, dans les temps` : debut, tone: enCours > 0 ? "fait" : "neutre" };
}

// ─── Site ────────────────────────────────────────────────────────────────

export interface SitePoint {
  id: string;
  title: string;
  detail: string | null;
  tone: Tone;
}

export function lastSuccessfulBackup(snapshot: SiteSnapshot) {
  return snapshot.backups.recent.find((backup) => backup.status === "finished") ?? null;
}

/**
 * Ce qui, dans le relevé, demande une intervention.
 *
 * Les mises à jour en attente n'en font pas partie : elles relèvent de la
 * maintenance courante, et les compter ici ferait vivre le client dans une
 * alerte permanente qu'il apprendrait vite à ignorer.
 */
export function sitePoints(snapshot: SiteSnapshot, now: Date = new Date()): SitePoint[] {
  const points: SitePoint[] = [];

  if (snapshot.status.down) {
    points.push({ id: "down", title: "Site injoignable au dernier relevé", detail: null, tone: "alerte" });
  }
  if (snapshot.site.ssl === false) {
    points.push({ id: "ssl", title: "Site sans HTTPS", detail: "Les navigateurs le signalent comme non sécurisé.", tone: "alerte" });
  }

  const failles = snapshot.vulnerabilities.items;
  if (failles.length === 1) {
    const [faille] = failles;
    points.push({
      id: "failles",
      title: `Faille connue · ${faille.component}`,
      detail: faille.fixedIn ? `${faille.title} (corrigée en ${faille.fixedIn})` : faille.title,
      tone: "alerte",
    });
  } else if (failles.length > 1) {
    const composants = Array.from(new Set(failles.map((faille) => faille.component)));
    points.push({
      id: "failles",
      title: `${failles.length} failles connues`,
      detail: composants.slice(0, 4).join(", ") + (composants.length > 4 ? "…" : ""),
      tone: "alerte",
    });
  }

  const sauvegarde = lastSuccessfulBackup(snapshot);
  if (!sauvegarde) {
    points.push({ id: "sauvegarde", title: "Aucune sauvegarde réussie récente", detail: null, tone: "alerte" });
  } else {
    const age = now.getTime() - new Date(sauvegarde.date).getTime();
    const jours = Math.floor(age / JOUR);
    if (age > BACKUP_MAX_AGE_DAYS * JOUR) {
      points.push({
        id: "sauvegarde",
        title: `Dernière sauvegarde il y a ${jours} jours`,
        detail: `Au-delà de ${BACKUP_MAX_AGE_DAYS} jours, une panne ferait perdre plus d'une semaine de contenu.`,
        tone: "alerte",
      });
    }
  }

  if (snapshot.site.phpSecure === false) {
    points.push({
      id: "php",
      title: snapshot.site.php ? `PHP ${snapshot.site.php} n'est plus maintenu` : "Version de PHP plus maintenue",
      detail: snapshot.site.phpRecommended ? `Version recommandée : ${snapshot.site.phpRecommended}.` : null,
      tone: "attention",
    });
  }
  if (snapshot.status.disconnected) {
    points.push({ id: "supervision", title: "Supervision déconnectée", detail: "Le relevé n'est plus fiable tant qu'elle n'est pas rebranchée.", tone: "attention" });
  }
  const uptime = snapshot.uptime.percentage;
  if (uptime !== null && uptime < 99 && !snapshot.status.down) {
    points.push({
      id: "disponibilite",
      title: `Disponibilité de ${uptime.toLocaleString("fr-FR")} % sur 30 jours`,
      detail: `${snapshot.uptime.incidents.length} incident${snapshot.uptime.incidents.length > 1 ? "s" : ""} sur la période.`,
      tone: "attention",
    });
  }

  return points;
}

/** « Comment va le site ? », en une phrase. */
export function siteVerdict(state: SiteState | null, now: Date = new Date()): Verdict {
  if (!state?.snapshot) return { headline: "Premier relevé en préparation", tone: "neutre" };
  if (state.snapshot.status.down) return { headline: "Site injoignable", tone: "alerte" };

  const points = sitePoints(state.snapshot, now);
  const alertes = points.filter((point) => point.tone === "alerte").length;
  const s = (n: number) => (n > 1 ? "s" : "");

  if (alertes > 0) return { headline: `${alertes} point${s(alertes)} à corriger`, tone: "alerte" };
  if (points.length > 0) {
    return { headline: `Bon état, ${points.length} point${s(points.length)} à surveiller`, tone: "attention" };
  }
  return { headline: "Bon état", tone: "fait" };
}

// ─── Actions ─────────────────────────────────────────────────────────────

export type ActionKind = "site" | "echeance" | "retard" | "opportunite";

export interface Action {
  id: string;
  kind: ActionKind;
  title: string;
  detail: string | null;
  tone: Tone;
  date: Date | null;
  /** Le livrable d'origine, quand il y en a un. */
  item: Deliverable | null;
}

export interface Actions {
  /** Ce qui demande une intervention : site, échéances proches, retards. */
  aTraiter: Action[];
  /** Les opportunités ouvertes, qui attendent une décision du client. */
  aArbitrer: Action[];
}

const TONE_RANK: Record<Tone, number> = { alerte: 0, attention: 1, neutre: 2, fait: 3 };

/**
 * Ce que le client peut faire maintenant.
 *
 * À traiter : les points du site, les contrats qui arrivent à échéance dans
 * les soixante jours (ou déjà échus), les missions en retard. À arbitrer : les
 * opportunités de la roadmap que personne n'a encore tranchées.
 */
export function actionsFor(
  items: Deliverable[],
  snapshot: SiteSnapshot | null,
  now: Date = new Date(),
): Actions {
  const today = startOfDay(now).getTime();
  const horizon = today + ANTICIPATION_DAYS * JOUR;
  const aTraiter: Action[] = [];

  if (snapshot) {
    for (const point of sitePoints(snapshot, now)) {
      aTraiter.push({ id: `site-${point.id}`, kind: "site", title: point.title, detail: point.detail, tone: point.tone, date: null, item: null });
    }
  }

  for (const item of items) {
    if (item.kind !== "cartographie" || !item.occurredAt) continue;
    const t = item.occurredAt.getTime();
    if (t >= horizon) continue;
    const payload = item.payload as CartographiePayload;
    aTraiter.push({
      id: `echeance-${item.notionPageId}`,
      kind: "echeance",
      title: t < today ? `Échéance dépassée : ${item.title}` : `Échéance à anticiper : ${item.title}`,
      detail: payload.type ?? null,
      tone: t < today ? "alerte" : "attention",
      date: item.occurredAt,
      item,
    });
  }

  for (const mission of missionsOf(items, now)) {
    if (!mission.overdue) continue;
    aTraiter.push({
      id: `retard-${mission.item.notionPageId}`,
      kind: "retard",
      title: `En retard : ${mission.title}`,
      detail: mission.kind === "prestation" ? "Livraison dépassée" : "Échéance dépassée",
      tone: "alerte",
      date: mission.date,
      item: mission.item,
    });
  }

  aTraiter.sort((a, b) => TONE_RANK[a.tone] - TONE_RANK[b.tone] || compareDates(a.date, b.date));

  const aArbitrer: Action[] = items
    .filter(isOpenOpportunity)
    .map((item) => ({
      id: `opportunite-${item.notionPageId}`,
      kind: "opportunite" as const,
      title: item.title,
      detail: (item.payload as RoadmapPayload).detail,
      tone: "neutre" as const,
      date: item.occurredAt,
      item,
    }))
    .sort((a, b) => compareDates(a.date, b.date) || a.title.localeCompare(b.title, "fr"));

  return { aTraiter, aArbitrer };
}

/** « Que pouvez-vous faire ? », en une phrase. */
export function actionsVerdict(actions: Actions): Verdict {
  const total = actions.aTraiter.length + actions.aArbitrer.length;
  if (total === 0) return { headline: "Rien d'urgent", tone: "fait" };
  const urgent = actions.aTraiter.some((action) => action.tone === "alerte");
  return {
    headline: `${total} action${total > 1 ? "s" : ""} possible${total > 1 ? "s" : ""}`,
    tone: urgent ? "alerte" : actions.aTraiter.length > 0 ? "attention" : "neutre",
  };
}

function compareDates(a: Date | null, b: Date | null): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.getTime() - b.getTime();
}

// ─── Frise ───────────────────────────────────────────────────────────────

export type FriseTone = Tone | "cours";

/** Un repère de la frise. `to === null` : un point ; sinon une barre. En pourcentage de la fenêtre. */
export interface FriseMark {
  id: string;
  title: string;
  date: Date | null;
  from: number;
  to: number | null;
  tone: FriseTone;
  item: Deliverable;
}

export interface FriseLane {
  key: "jalons" | "missions" | "echeances";
  label: string;
  /** Plusieurs lignes quand des barres se chevauchent. */
  rows: FriseMark[][];
}

export interface Frise {
  start: Date;
  end: Date;
  today: number;
  months: { label: string; at: number }[];
  lanes: FriseLane[];
  /** Nombre de repères effectivement placés. */
  count: number;
}

/**
 * La frise de l'accueil : trois mois en arrière, trois mois devant.
 *
 * Trois couloirs — ce qui a été fait (jalons), ce qui court (missions),
 * ce qui tombe (échéances de contrats). Le passé et l'avenir sur un seul axe,
 * avec aujourd'hui au milieu : la réponse visuelle à « où en est-on ? ».
 */
export function buildFrise(
  missions: Mission[],
  items: Deliverable[],
  now: Date = new Date(),
  monthsBefore = 3,
  monthsAfter = 3,
): Frise {
  const [y, m] = dayKey(now).split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1 - monthsBefore, 1));
  const end = new Date(Date.UTC(y, m + monthsAfter, 1));
  const span = end.getTime() - start.getTime();
  const at = (date: Date) => ((date.getTime() - start.getTime()) / span) * 100;
  const inside = (value: number) => value >= 0 && value <= 100;

  const months: Frise["months"] = [];
  const format = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });
  for (let i = 0; i < monthsBefore + monthsAfter + 1; i += 1) {
    const date = new Date(Date.UTC(y, m - 1 - monthsBefore + i, 1));
    months.push({ label: format.format(date), at: at(date) });
  }

  const jalons: FriseMark[] = [];
  const enCours: FriseMark[] = [];
  const echeances: FriseMark[] = [];

  for (const mission of missions) {
    const id = mission.item.notionPageId;
    if (mission.phase === "passe") {
      if (!mission.date || !inside(at(mission.date))) continue;
      jalons.push({ id, title: mission.title, date: mission.date, from: at(mission.date), to: null, tone: "fait", item: mission.item });
      continue;
    }

    const tone: FriseTone = mission.overdue ? "alerte" : mission.phase === "en-cours" ? "cours" : "neutre";
    if (mission.start && mission.date && mission.date > mission.start) {
      const from = at(mission.start);
      const to = at(mission.date);
      if (to < 0 || from > 100) continue;
      enCours.push({ id, title: mission.title, date: mission.date, from: Math.max(0, from), to: Math.min(100, to), tone, item: mission.item });
    } else if (mission.date && inside(at(mission.date))) {
      enCours.push({ id, title: mission.title, date: mission.date, from: at(mission.date), to: null, tone, item: mission.item });
    }
  }

  const today = startOfDay(now).getTime();
  for (const item of items) {
    if (item.kind !== "cartographie" || !item.occurredAt) continue;
    const position = at(item.occurredAt);
    if (!inside(position)) continue;
    const t = item.occurredAt.getTime();
    const tone: FriseTone = t < today ? "alerte" : t < today + ANTICIPATION_DAYS * JOUR ? "attention" : "neutre";
    echeances.push({ id: item.notionPageId, title: item.title, date: item.occurredAt, from: position, to: null, tone, item });
  }

  const lanes: FriseLane[] = [
    { key: "jalons", label: "Fait", rows: [jalons.sort(byFrom)] },
    { key: "missions", label: "Missions", rows: pack(enCours) },
    { key: "echeances", label: "Échéances", rows: [echeances.sort(byFrom)] },
  ];

  return {
    start,
    end,
    today: at(now),
    months,
    lanes,
    count: jalons.length + enCours.length + echeances.length,
  };
}

function byFrom(a: FriseMark, b: FriseMark): number {
  return a.from - b.from;
}

/** Largeur réservée à un point ou à une étiquette de barre, en pourcentage. */
const MARK_ROOM = 14;

/** Range les repères en lignes sans chevauchement, la première ligne libre d'abord. */
function pack(marks: FriseMark[]): FriseMark[][] {
  const rows: { end: number; marks: FriseMark[] }[] = [];
  for (const mark of [...marks].sort(byFrom)) {
    const end = Math.max(mark.to ?? mark.from, mark.from + MARK_ROOM);
    const row = rows.find((candidate) => candidate.end <= mark.from);
    if (row) {
      row.marks.push(mark);
      row.end = end;
    } else {
      rows.push({ end, marks: [mark] });
    }
  }
  return rows.length > 0 ? rows.map((row) => row.marks) : [[]];
}

function startOfDay(date: Date): Date {
  const [y, m, d] = dayKey(date).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0));
}
