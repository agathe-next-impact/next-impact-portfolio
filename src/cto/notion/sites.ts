import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoSites } from "../db/schema";
import { queryDatabase } from "./api";
import { sitesDatabaseId } from "./config";
import { alert, emptyFindings, type Findings } from "./findings";
import { clientPageIds, siteRow } from "./map";
import { checkColumns, COLUMNS, schemaWarning } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// La synchro des sites — plusieurs sites web par accompagnement, depuis la base
// Notion « Sites ».
//
// Une ligne = un site, reliée à UNE fiche client. Le site se reconnaît par sa
// page Notion. Base facultative : sans `CTO_NOTION_DB_SITES`, chaque
// accompagnement garde le projet WP Umbrella de sa fiche client, lu comme un
// site unique (`src/cto/site/store.ts`).
//
// Ce que la synchro ne fait jamais : supprimer. Une ligne disparue de Notion
// est marquée `removed_at` — le site sort de l'espace et du balayage, son
// relevé reste. Et une base qui ne rend plus aucune ligne alors que des sites
// sont ouverts ressemble à une panne : rien n'est retiré sans `--forcer`.
// ─────────────────────────────────────────────────────────────────────────────

export interface SitesReport {
  seen: number;
  created: number;
  updated: number;
  removed: number;
}

export interface SiteExistant {
  id: string;
  clientId: string;
  notionPageId: string;
  name: string;
  url: string | null;
  wpUmbrellaProjectId: number | null;
  watch: boolean;
  position: number;
  removedAt: Date | null;
}

export interface SiteVoulu {
  notionPageId: string;
  clientId: string;
  name: string;
  url: string | null;
  wpUmbrellaProjectId: number | null;
  watch: boolean;
  position: number;
}

/** Au-delà, une base vide ressemble à une panne : pas de retrait sans --forcer. */
const SEUIL_RETRAIT_MASSIF = 3;

/** Pur : le nom affiché d'un site, du nom saisi à l'adresse nue, puis un repli. */
export function nomDuSite(name: string | null, url: string | null): string {
  if (name?.trim()) return name.trim();
  if (url) return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return "Site";
}

export interface PlanSites {
  creer: SiteVoulu[];
  mettreAJour: { id: string; patch: Partial<SiteVoulu> & { removedAt?: null } }[];
  retirer: SiteExistant[];
}

/**
 * Pur : ce que la base demande, comparé à ce qui existe. Un site dont la ligne
 * a changé de client est mis à jour (un site n'a qu'un client) ; un site
 * retiré dont la ligne revient est rouvert. `pagesVues` : toutes les lignes que
 * la base a rendues, rattachées ou non — une ligne vue mais pas encore
 * rattachable n'est jamais retirée.
 */
export function planifier(voulus: SiteVoulu[], existants: SiteExistant[], pagesVues: Set<string>): PlanSites {
  const parPage = new Map(existants.map((site) => [site.notionPageId, site]));
  const plan: PlanSites = { creer: [], mettreAJour: [], retirer: [] };

  for (const voulu of voulus) {
    const actuel = parPage.get(voulu.notionPageId);
    if (!actuel) {
      plan.creer.push(voulu);
      continue;
    }
    const patch: PlanSites["mettreAJour"][number]["patch"] = {};
    if (actuel.clientId !== voulu.clientId) patch.clientId = voulu.clientId;
    if (actuel.name !== voulu.name) patch.name = voulu.name;
    if (actuel.url !== voulu.url) patch.url = voulu.url;
    if (actuel.wpUmbrellaProjectId !== voulu.wpUmbrellaProjectId) {
      patch.wpUmbrellaProjectId = voulu.wpUmbrellaProjectId;
    }
    if (actuel.watch !== voulu.watch) patch.watch = voulu.watch;
    if (actuel.position !== voulu.position) patch.position = voulu.position;
    if (actuel.removedAt) patch.removedAt = null;
    if (Object.keys(patch).length > 0) plan.mettreAJour.push({ id: actuel.id, patch });
  }

  plan.retirer = existants.filter((site) => site.removedAt === null && !pagesVues.has(site.notionPageId));
  return plan;
}

/**
 * Balaie la base Sites. `byNotionPage` vient de `resolveClients` : une ligne
 * dont la fiche client n'est pas (encore) résoluble est signalée et laissée
 * telle quelle, jamais devinée — ni créée, ni retirée.
 */
export async function syncSitesFromNotion(
  byNotionPage: Map<string, string>,
  options: { dryRun: boolean; force?: boolean },
): Promise<{ report: SitesReport } & Findings> {
  const findings = emptyFindings();
  const report: SitesReport = { seen: 0, created: 0, updated: 0, removed: 0 };

  const databaseId = sitesDatabaseId();
  if (!databaseId) {
    findings.warnings.push("Base « Sites » ignorée : CTO_NOTION_DB_SITES n'est pas posée.");
    return { report, ...findings };
  }

  const broken = schemaWarning("Sites", await checkColumns(databaseId, COLUMNS.sites));
  if (broken) {
    alert(findings, broken);
    return { report, ...findings };
  }

  const pages = await queryDatabase(databaseId, undefined, [
    { timestamp: "created_time", direction: "ascending" },
  ]);

  const voulus: SiteVoulu[] = [];
  const pagesVues = new Set<string>();
  for (const page of pages) {
    report.seen += 1;
    pagesVues.add(page.id);
    const row = siteRow(page);
    const nom = nomDuSite(row.name, row.url);
    const clients = clientPageIds(page);

    if (clients.length === 0) {
      alert(findings, `Site « ${nom} » : aucun client sur la ligne — non rattaché.`);
      continue;
    }
    if (clients.length > 1) {
      alert(findings, `Site « ${nom} » : plusieurs clients sur la ligne — le premier est retenu.`);
    }
    const clientId = byNotionPage.get(clients[0]);
    if (!clientId) {
      alert(findings, `Site « ${nom} » : fiche client introuvable — non rattaché ce tour-ci.`);
      continue;
    }

    voulus.push({
      notionPageId: page.id,
      clientId,
      name: nom,
      url: row.url,
      wpUmbrellaProjectId: row.wpUmbrellaProjectId,
      watch: row.watch,
      position: row.order,
    });
  }

  const existants: SiteExistant[] = await db()
    .select({
      id: ctoSites.id,
      clientId: ctoSites.clientId,
      notionPageId: ctoSites.notionPageId,
      name: ctoSites.name,
      url: ctoSites.url,
      wpUmbrellaProjectId: ctoSites.wpUmbrellaProjectId,
      watch: ctoSites.watch,
      position: ctoSites.position,
      removedAt: ctoSites.removedAt,
    })
    .from(ctoSites);

  const plan = planifier(voulus, existants, pagesVues);

  if (plan.retirer.length > SEUIL_RETRAIT_MASSIF && pages.length === 0 && !options.force) {
    alert(
      findings,
      `Sites : la base ne rend aucune ligne alors que ${plan.retirer.length} sites sont ouverts. ` +
        "Aucun retrait — vérifier le partage de la base, puis relancer avec --forcer si c'est voulu.",
    );
    plan.retirer = [];
  }

  report.created = plan.creer.length;
  report.updated = plan.mettreAJour.length;
  report.removed = plan.retirer.length;

  for (const site of plan.retirer) {
    findings.warnings.push(
      `Site « ${site.name} » : ligne disparue de la base Sites — ${options.dryRun ? "serait retiré" : "retiré"}.`,
    );
  }
  if (options.dryRun) return { report, ...findings };

  for (const site of plan.creer) {
    await db().insert(ctoSites).values(site).onConflictDoNothing();
  }
  for (const { id, patch } of plan.mettreAJour) {
    await db().update(ctoSites).set(patch).where(eq(ctoSites.id, id));
  }
  for (const site of plan.retirer) {
    await db().update(ctoSites).set({ removedAt: new Date() }).where(eq(ctoSites.id, site.id));
  }

  return { report, ...findings };
}
