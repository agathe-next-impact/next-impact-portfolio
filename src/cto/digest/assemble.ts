import type { Block, Span } from "../notion/blocks";
import type { SentinelleExport, SentinelleVerdict } from "../sentinelle/contract";
import {
  DIGEST_VERSION,
  LINE_CHARS,
  SENTINELLE_LINES,
  SIGNAL_EDITIONS,
  SIGNAL_LINES,
  type DigestContent,
  type DigestLine,
  type DigestSentinelle,
  type DigestSignal,
  type DigestTone,
  type SignalLevel,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// L'assemblage d'un digest. Pur : ni base, ni réseau, ni modèle de langage.
//
// Chaque ligne vient d'un contenu déjà relu à sa source — une alerte validée
// dans Sentinelle, la rubrique « L'essentiel » d'une édition Signaux Faibles
// que le lint a contrôlée avant l'envoi. Le digest choisit et range ; il
// n'écrit rien. C'est ce qui permet de le valider d'un clic.
// ─────────────────────────────────────────────────────────────────────────────

const TONE_RANK: Record<DigestTone, number> = { critique: 0, attention: 1, info: 2, ok: 3 };

const VERDICT_TONE: Record<SentinelleVerdict, DigestTone> = {
  red: "critique",
  orange: "attention",
  green: "ok",
  info: "info",
};

/** Coupe une ligne à 140 caractères, sur un espace si possible. */
export function clip(text: string, max = LINE_CHARS): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

function line(text: string, tone: DigestTone | null, tag: string | null, ref: string | null = null): DigestLine {
  return { text: clip(text), tone, tag, ref };
}

function within(iso: string, range: { from: Date; to: Date }): boolean {
  const time = new Date(iso).getTime();
  return time >= range.from.getTime() && time < range.to.getTime();
}

function dateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

// ─── Veille technique : 15 lignes ──────────────────────────────────────────

/**
 * Ordre de priorité, du plus urgent au plus stable :
 *   1. les alertes validées de la semaine, rouges d'abord ;
 *   2. les fins de support à moins de six mois ;
 *   3. la lettre de la semaine, si elle est parue : ses axes à traiter et ses actions ;
 *   4. l'état de la fiche, en une ligne.
 * Au-delà de 15, la dernière ligne renvoie à la lettre complète.
 */
export function assembleSentinelle(
  data: SentinelleExport,
  range: { from: Date; to: Date },
  letterKeyOf: (letterId: string) => string,
): DigestSentinelle {
  const candidates: DigestLine[] = [];

  const alerts = data.alerts
    .filter((alert) => within(alert.at, range))
    .map((alert) => ({ alert, tone: alert.verdict ? VERDICT_TONE[alert.verdict] : ("info" as const) }))
    .sort((a, b) => TONE_RANK[a.tone] - TONE_RANK[b.tone] || b.alert.at.localeCompare(a.alert.at));

  if (alerts.length === 0) {
    candidates.push(line("Aucune nouvelle alerte validée cette semaine.", "ok", "Alertes"));
  }
  for (const { alert, tone } of alerts) {
    candidates.push(line(`${alert.title} (${alert.component})`, tone, "Alerte", alert.ref));
  }

  const radar = data.radar
    .filter((entry) => entry.daysLeft <= 180)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  for (const entry of radar) {
    const tone: DigestTone = entry.daysLeft <= 30 ? "critique" : entry.daysLeft <= 90 ? "attention" : "info";
    const quand = entry.daysLeft < 0 ? "dépassée" : `le ${dateFr(entry.endsOn)}`;
    candidates.push(line(`${entry.title} : ${quand}`, tone, "Fin de support"));
  }

  const letter = data.letters.find((l) => within(l.issueDate, range)) ?? null;
  if (letter) {
    candidates.push(
      line(
        letter.axesAAgir > 0
          ? `Lettre de veille : ${letter.axesAAgir} axe${letter.axesAAgir > 1 ? "s" : ""} à traiter sur 12`
          : "Lettre de veille : aucun axe à traiter en priorité",
        letter.axesAAgir > 0 ? "attention" : "ok",
        "Lettre",
      ),
    );
    for (const action of letter.actions.slice(0, 3)) {
      candidates.push(line(`${action.action} (${action.horizon})`, "info", "Action"));
    }
  }

  const { components, withoutVersion } = data.stack;
  candidates.push(
    line(
      withoutVersion > 0
        ? `${components.length} composants suivis, dont ${withoutVersion} sans version connue`
        : `${components.length} composants suivis, tous avec une version connue`,
      withoutVersion > 0 ? "info" : "ok",
      "Fiche",
    ),
  );

  let lines = candidates;
  let overflow = 0;
  if (candidates.length > SENTINELLE_LINES) {
    overflow = candidates.length - (SENTINELLE_LINES - 1);
    lines = [
      ...candidates.slice(0, SENTINELLE_LINES - 1),
      line(`${overflow} autres points dans la lettre et la fiche complètes`, null, null),
    ];
  }

  return {
    lines,
    overflow,
    letterKey: letter ? letterKeyOf(letter.id) : null,
    stats: {
      components: components.length,
      withoutVersion,
      alerts: alerts.length,
      critiques: alerts.filter((a) => a.tone === "critique").length,
      attention: alerts.filter((a) => a.tone === "attention").length,
    },
  };
}

// ─── Signaux Faibles : 8 lignes par édition ────────────────────────────────

function plain(spans: Span[]): string {
  return spans.map((span) => span.t).join("").trim();
}

function normalized(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’`]/g, "'")
    .toLowerCase()
    .trim();
}

/** Même reconnaissance du titre que le lint du portail Signaux Faibles. */
export function isEssentielHeading(text: string): boolean {
  return /^(l')?essentiel\b/.test(normalized(text));
}

/** Les références `[S:…]` qu'une ligne cite. */
export function citedRefs(text: string): string[] {
  return [...text.matchAll(/\[S:([^\]\s]+)\]/g)].map((match) => match[1]);
}

const LEVELS: readonly SignalLevel[] = ["FORT", "MOYEN", "RAS"];

/** Lit « ② Marché du travail — FORT » : le nom de l'axe et son niveau. */
export function readAxisTitle(title: string): { name: string; level: SignalLevel | null } {
  const clean = title.trim();
  for (const separator of ["—", "–", "-"]) {
    const position = clean.lastIndexOf(separator);
    if (position <= 0) continue;
    const suffix = clean.slice(position + separator.length).trim().toUpperCase();
    const level = LEVELS.find((candidate) => candidate === suffix);
    if (!level) continue;
    return { name: stripNumber(clean.slice(0, position)), level };
  }
  return { name: stripNumber(clean), level: null };
}

function stripNumber(text: string): string {
  const rest = text
    .trim()
    .replace(/^[⓪①-⑳❶-❿➀-➉]\s*[.)—–-]?\s*/u, "")
    .replace(/^\d{1,2}[.)]\s+/, "")
    .trim();
  return rest || text.trim();
}

/**
 * La rubrique « L'essentiel » d'une édition : ses puces ou paragraphes, du
 * titre jusqu'au prochain titre de niveau 1 ou 2 (au-delà commence un axe).
 */
export function extractEssentiel(body: Block[]): string[] {
  const start = body.findIndex(
    (block) => (block.k === "h1" || block.k === "h2") && isEssentielHeading(plain(block.s)),
  );
  if (start === -1) return [];
  const lines: string[] = [];
  for (const block of body.slice(start + 1)) {
    if (block.k === "h1" || block.k === "h2") break;
    if (block.k === "li" || block.k === "oli" || block.k === "p") {
      const text = plain(block.s);
      if (text) lines.push(text);
    }
  }
  return lines;
}

/** Les axes d'une édition et leur niveau, du plus fort au plus faible. */
export function extractAxes(body: Block[]): { name: string; level: SignalLevel | null }[] {
  const rank = (level: SignalLevel | null) => (level ? LEVELS.indexOf(level) : LEVELS.length);
  return body
    .flatMap((block) => (block.k === "h2" ? [readAxisTitle(plain(block.s))] : []))
    .filter((axe) => axe.level !== null && !isEssentielHeading(axe.name))
    .map((axe, position) => ({ axe, position }))
    .sort((a, b) => rank(a.axe.level) - rank(b.axe.level) || a.position - b.position)
    .map(({ axe }) => axe);
}

export interface EditionInput {
  letterKey: string;
  title: string;
  label: string | null;
  action: string | null;
  period: Date;
  body: Block[];
}

export function assembleSignal(edition: EditionInput): DigestSignal {
  return {
    letterKey: edition.letterKey,
    title: edition.title,
    label: edition.label,
    date: edition.period.toISOString(),
    lines: extractEssentiel(edition.body)
      .slice(0, SIGNAL_LINES)
      .map((text) => line(text, null, null, citedRefs(text)[0] ?? null)),
    action: edition.action ? clip(edition.action) : null,
    axes: extractAxes(edition.body),
  };
}

/**
 * Les éditions retenues : deux au plus, une par veille d'abord (l'Écosystème
 * et le Positionnement plutôt que deux Écosystème), la plus récente en tête.
 */
export function pickEditions(editions: EditionInput[]): EditionInput[] {
  const sorted = [...editions].sort((a, b) => b.period.getTime() - a.period.getTime());
  const picked: EditionInput[] = [];
  const labels = new Set<string>();
  for (const edition of sorted) {
    const key = edition.label ?? edition.letterKey;
    if (labels.has(key)) continue;
    labels.add(key);
    picked.push(edition);
    if (picked.length === SIGNAL_EDITIONS) return picked;
  }
  for (const edition of sorted) {
    if (picked.length === SIGNAL_EDITIONS) break;
    if (!picked.includes(edition)) picked.push(edition);
  }
  return picked;
}

// ─── Le digest ─────────────────────────────────────────────────────────────

export function assembleDigest(input: {
  week: string;
  range: { from: Date; to: Date };
  sentinelle: SentinelleExport | null;
  sentinelleLetterKey: (letterId: string) => string;
  /** Éditions Signaux Faibles datées de la semaine. */
  editions: EditionInput[];
  /** L'accompagnement a-t-il reçu au moins une édition ces six derniers mois ? */
  signauxAttendus: boolean;
}): DigestContent | null {
  const signaux = pickEditions(input.editions).map(assembleSignal);
  const sentinelle = input.sentinelle
    ? assembleSentinelle(input.sentinelle, input.range, input.sentinelleLetterKey)
    : null;

  // Ni veille technique reliée, ni Signaux Faibles : rien à dire, pas de digest.
  if (!sentinelle && signaux.length === 0 && !input.signauxAttendus) return null;

  return {
    version: DIGEST_VERSION,
    week: input.week,
    sentinelle,
    signaux,
    signauxAttendus: input.signauxAttendus,
  };
}
