import { and, desc, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoSiteReports, ctoSiteSnapshots } from "../db/schema";
import { importFile } from "../files";
import { getWpu, wpUmbrellaToken, WpUmbrellaError } from "./api";
import { buildSnapshot, isoDate } from "./normalize";
import type { SiteReport, SiteSnapshot, SiteState } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Le suivi technique : balayage (Cron, commande) et lecture (espace client).
//
// Le balayage écrase un relevé par accompagnement et EMPILE les rapports
// mensuels. Un échec ne détruit rien : le relevé précédent reste affiché, avec
// sa date, et l'erreur est notée à côté. Un écran qui passe à vide parce que
// WP Umbrella a répondu 503 une nuit ferait croire au client que son site n'est
// plus suivi.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nombre de nouveaux rapports rapatriés par accompagnement et par passage.
 *
 * Au premier passage, un compte ancien peut avoir deux ans d'archives : les
 * rapatrier d'un coup ferait dépasser la durée du Cron. Six par nuit, et
 * l'archive se complète en quelques jours, le plus récent d'abord.
 */
const REPORTS_PER_RUN = 6;

export interface SiteSyncReport {
  /** Accompagnements dont un projet WP Umbrella est renseigné. */
  projects: number;
  refreshed: number;
  failed: number;
  reportsArchived: number;
  warnings: string[];
}

/** Rend `undefined` au lieu de lever : une partie du relevé peut manquer sans perdre le reste. */
async function tryGet(path: string, warnings: string[], label: string): Promise<unknown> {
  try {
    return await getWpu(path);
  } catch (error) {
    warnings.push(`${label} : ${error instanceof Error ? error.message : "erreur"}`);
    return undefined;
  }
}

/** Le relevé d'un projet. Le projet lui-même est obligatoire, le reste facultatif. */
export async function fetchSnapshot(
  projectId: number,
  warnings: string[] = [],
): Promise<SiteSnapshot> {
  // Sans la fiche projet, il n'y a pas de relevé : on laisse l'erreur remonter.
  const project = await getWpu(`/projects/${projectId}`);

  const [plugins, themes, vulns, uptime, backups, tasks] = await Promise.all([
    tryGet(`/projects/${projectId}/plugins?per_page=100`, warnings, "extensions"),
    tryGet(`/projects/${projectId}/themes?per_page=50`, warnings, "thèmes"),
    tryGet(`/projects/${projectId}/vulnerabilities`, warnings, "vulnérabilités"),
    tryGet(`/projects/${projectId}/uptime?limit=100`, warnings, "disponibilité"),
    tryGet(`/projects/${projectId}/backups?per_page=10`, warnings, "sauvegardes"),
    tryGet(
      `/projects/${projectId}/tasks?per_page=30&from=${Math.floor(Date.now() / 1000) - 90 * 86400}`,
      warnings,
      "interventions",
    ),
  ]);

  return buildSnapshot({
    project,
    plugins,
    themes,
    vulnerabilities: vulns,
    uptime,
    backups,
    tasks,
  });
}

/**
 * Rapatrie les rapports mensuels terminés qu'on n'a pas encore.
 *
 * Le lien PDF d'un rapport expire quinze minutes après l'appel : on le demande,
 * on télécharge aussitôt, on range. Un rapport déjà connu n'est jamais
 * redemandé.
 */
async function archiveReports(
  clientId: string,
  projectId: number,
  dryRun: boolean,
  warnings: string[],
): Promise<number> {
  const list = await tryGet(`/projects/${projectId}/reports?per_page=24`, warnings, "rapports");
  if (!Array.isArray(list)) return 0;

  const known = new Set(
    (
      await db()
        .select({ id: ctoSiteReports.id })
        .from(ctoSiteReports)
        .where(eq(ctoSiteReports.clientId, clientId))
    ).map((row) => row.id),
  );

  let archived = 0;
  for (const entry of list) {
    if (archived >= REPORTS_PER_RUN) break;
    const report = entry as Record<string, unknown>;
    const id = typeof report.id === "string" || typeof report.id === "number" ? String(report.id) : null;
    if (!id || known.has(id)) continue;
    if (String(report.generation_status ?? "").toUpperCase() !== "FINISHED") continue;
    if (report.has_pdf === false) continue;

    const name = typeof report.name === "string" && report.name.trim() ? report.name.trim() : "Rapport de maintenance";

    try {
      const detail = (await getWpu(`/projects/${projectId}/reports/${id}`)) as Record<string, unknown>;
      const pdfUrl = typeof detail?.pdf_url === "string" ? detail.pdf_url : null;
      if (!pdfUrl) continue;

      const file = await importFile(pdfUrl, `${name}.pdf`, { dryRun, mime: "application/pdf" });
      if (!dryRun) {
        await db()
          .insert(ctoSiteReports)
          .values({
            id,
            clientId,
            name,
            periodStart: toDate(report.data_start_date),
            periodEnd: toDate(report.data_end_date),
            generatedAt: toDate(report.generated_at),
            fileId: file.id,
          })
          .onConflictDoNothing();
      }
      archived += 1;
    } catch (error) {
      warnings.push(
        `rapport « ${name} » non rapatrié : ${error instanceof Error ? error.message : "erreur"}`,
      );
    }
  }
  return archived;
}

function toDate(value: unknown): Date | null {
  const iso = isoDate(value);
  return iso ? new Date(iso) : null;
}

/**
 * Balaie tous les accompagnements qui ont un projet WP Umbrella.
 *
 * Indépendant de la colonne « Services » : le relevé est tenu à jour même si
 * la section n'est pas encore ouverte au client, pour qu'elle soit pleine le
 * jour où elle l'est. Un accompagnement `clos` est sauté — il n'a plus
 * d'espace à alimenter.
 */
export async function syncSites(options: { dryRun?: boolean } = {}): Promise<SiteSyncReport> {
  const dryRun = options.dryRun === true;
  const report: SiteSyncReport = {
    projects: 0,
    refreshed: 0,
    failed: 0,
    reportsArchived: 0,
    warnings: [],
  };

  if (!wpUmbrellaToken()) {
    report.warnings.push("WP_UMBRELLA_TOKEN n'est pas posée : suivi technique non balayé.");
    return report;
  }

  const clients = await db()
    .select({
      id: ctoClients.id,
      company: ctoClients.company,
      projectId: ctoClients.wpUmbrellaProjectId,
    })
    .from(ctoClients)
    .where(and(isNotNull(ctoClients.wpUmbrellaProjectId), ne(ctoClients.status, "clos")));

  for (const client of clients) {
    if (client.projectId === null) continue;
    report.projects += 1;
    const partial: string[] = [];

    try {
      const snapshot = await fetchSnapshot(client.projectId, partial);
      if (!dryRun) {
        await db()
          .insert(ctoSiteSnapshots)
          .values({
            clientId: client.id,
            projectId: client.projectId,
            data: snapshot,
            fetchedAt: new Date(),
            error: null,
            errorAt: null,
          })
          .onConflictDoUpdate({
            target: ctoSiteSnapshots.clientId,
            set: {
              projectId: client.projectId,
              data: snapshot,
              fetchedAt: new Date(),
              error: null,
              errorAt: null,
            },
          });
      }
      report.refreshed += 1;
      for (const warning of partial) {
        report.warnings.push(`« ${client.company} » — relevé partiel, ${warning}.`);
      }
    } catch (error) {
      report.failed += 1;
      const message = error instanceof Error ? error.message : "erreur";
      report.warnings.push(`« ${client.company} » — relevé impossible : ${message}`);
      // Le relevé précédent reste en place ; seule l'erreur est notée.
      if (!dryRun) {
        await db()
          .update(ctoSiteSnapshots)
          .set({ error: message, errorAt: new Date() })
          .where(eq(ctoSiteSnapshots.clientId, client.id));
      }
      // Un jeton refusé l'est pour tout le monde : inutile d'insister.
      if (error instanceof WpUmbrellaError && (error.status === 401 || error.status === 403)) break;
      continue;
    }

    const reportWarnings: string[] = [];
    report.reportsArchived += await archiveReports(client.id, client.projectId, dryRun, reportWarnings);
    for (const warning of reportWarnings) {
      report.warnings.push(`« ${client.company} » — ${warning}.`);
    }
  }

  return report;
}

// ─── Lecture ─────────────────────────────────────────────────────────────

/**
 * Le relevé d'un accompagnement, ou null s'il n'a pas de projet WP Umbrella.
 *
 * Résolu depuis l'identifiant d'ACCOMPAGNEMENT (celui de la session), jamais
 * depuis un identifiant de projet venu d'ailleurs : c'est la règle posée sur
 * `cto_clients.wp_umbrella_project_id`.
 */
export async function siteStateFor(clientId: string): Promise<SiteState | null> {
  const [client] = await db()
    .select({ projectId: ctoClients.wpUmbrellaProjectId })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);
  if (!client?.projectId) return null;

  const [row] = await db()
    .select()
    .from(ctoSiteSnapshots)
    .where(eq(ctoSiteSnapshots.clientId, clientId))
    .limit(1);

  return {
    projectId: client.projectId,
    snapshot: row ? (row.data as SiteSnapshot) : null,
    fetchedAt: row?.fetchedAt ?? null,
    error: row?.error ?? null,
    errorAt: row?.errorAt ?? null,
  };
}

/** Les rapports archivés d'un accompagnement, le plus récent en tête. */
export async function siteReportsFor(clientId: string): Promise<SiteReport[]> {
  return db()
    .select({
      id: ctoSiteReports.id,
      name: ctoSiteReports.name,
      periodStart: ctoSiteReports.periodStart,
      periodEnd: ctoSiteReports.periodEnd,
      generatedAt: ctoSiteReports.generatedAt,
      fileId: ctoSiteReports.fileId,
    })
    .from(ctoSiteReports)
    .where(eq(ctoSiteReports.clientId, clientId))
    .orderBy(desc(ctoSiteReports.generatedAt));
}
