import type { SentinelleExport, SentinelleVerdict } from "../sentinelle/contract";
import {
  DIGEST_VERSION,
  LINE_CHARS,
  SENTINELLE_LINES,
  type DigestContent,
  type DigestLine,
  type DigestSentinelle,
  type DigestTone,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// L'assemblage d'un digest. Pur : ni base, ni réseau, ni modèle de langage.
//
// Chaque ligne vient d'un contenu déjà relu à sa source — une alerte validée
// dans Sentinelle. Le digest choisit et range ; il
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

// ─── Le digest ─────────────────────────────────────────────────────────────

export function assembleDigest(input: {
  week: string;
  range: { from: Date; to: Date };
  sentinelle: SentinelleExport | null;
  sentinelleLetterKey: (letterId: string) => string;
}): DigestContent | null {
  // Pas de veille technique reliée : rien à dire, pas de digest.
  if (!input.sentinelle) return null;

  return {
    version: DIGEST_VERSION,
    week: input.week,
    sentinelle: assembleSentinelle(input.sentinelle, input.range, input.sentinelleLetterKey),
  };
}
