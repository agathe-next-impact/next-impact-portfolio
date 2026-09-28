import type { SyncReport } from "../notion";
import type { NotifyReport } from "../notify";

// ─────────────────────────────────────────────────────────────────────────────
// Les rapports de synchro et de notification, mis en phrases pour l'écran.
//
// Même contenu que ce qu'impriment `scripts/cto-sync.ts` et
// `scripts/cto-notify.ts`, sans le tableau à colonnes : l'écran de pilotage
// montre un résumé, puis les points à regarder un par un. Pur et testé.
// ─────────────────────────────────────────────────────────────────────────────

export interface ReportSummary {
  /** Ce qui s'est passé, en quelques lignes. */
  lines: string[];
  /** Les points à regarder, tels que la synchro les a formulés. */
  warnings: string[];
  /** Parmi eux, ceux qui touchent un accès ou un rattachement : à traiter. */
  alerts: string[];
}

/**
 * Les alertes de ce balayage que le précédent ne portait pas.
 *
 * C'est ce qui décide d'un e-mail. Une ligne publiée sans client reste une
 * alerte tant qu'elle n'est pas corrigée ; la redire chaque nuit apprendrait
 * seulement à ne plus ouvrir le message.
 */
export function newAlerts(current: string[], previous: string[]): string[] {
  const connues = new Set(previous);
  return [...new Set(current)].filter((message) => !connues.has(message));
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count > 1 ? many : one}`;
}

export function summarizeSync(report: SyncReport): ReportSummary {
  const lines: string[] = [];
  if (report.dryRun) lines.push("À blanc : tout a été lu, rien n'a été écrit.");
  lines.push(`${plural(report.clientsMapped, "accompagnement rattaché", "accompagnements rattachés")}.`);

  const per = report.persons;
  lines.push(
    `Personnes : ${per.created} créée(s), ${per.updated} mise(s) à jour, ` +
      `${per.revoked} révoquée(s), ${per.restored} restaurée(s).`,
  );

  const bouge = report.kinds.filter(
    (kind) => kind.created + kind.updated + kind.restored + kind.withdrawn > 0,
  );
  if (bouge.length === 0) {
    lines.push("Livrables : rien de nouveau.");
  } else {
    for (const kind of bouge) {
      lines.push(
        `${kind.kind} : ${kind.created} créé(s), ${kind.updated} mis à jour, ` +
          `${kind.restored} restauré(s), ${kind.withdrawn} retiré(s).`,
      );
    }
  }

  const l = report.letters;
  if (l.created + l.updated + l.withdrawn > 0) {
    lines.push(`Lettres : ${l.created} créée(s), ${l.updated} mise(s) à jour, ${l.withdrawn} retirée(s).`);
  }

  const v = report.veilleTechnique;
  if (v && v.sent > 0) {
    lines.push(
      `Veille technique : ${v.created} client(s) Sentinelle créé(s) ou relié(s), ` +
        `${v.deactivated} désactivé(s), ${v.failed} échec(s).`,
    );
  }

  return { lines, warnings: report.warnings, alerts: report.alerts };
}

export function summarizeNotify(report: NotifyReport, dryRun: boolean): ReportSummary {
  const many = report.notified > 1;
  const verbe = dryRun ? (many ? "seraient prévenus" : "serait prévenu") : many ? "prévenus" : "prévenu";
  const lines = [
    `${plural(report.notified, "accompagnement", "accompagnements")} ${verbe}, ` +
      `${report.upToDate} déjà à jour.`,
  ];
  if (report.welcomed > 0) {
    lines.push(
      `${plural(report.welcomed, "bienvenue", "bienvenues")} ${
        dryRun ? (report.welcomed > 1 ? "partiraient" : "partirait") : report.welcomed > 1 ? "envoyées" : "envoyée"
      } à ${report.welcomed > 1 ? "des personnes jamais invitées" : "une personne jamais invitée"}.`,
    );
  }
  if (dryRun) lines.unshift("À blanc : aucun e-mail n'est parti.");
  return { lines, warnings: report.warnings, alerts: [] };
}
