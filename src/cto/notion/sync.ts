import { db } from "../db/client";
import { ctoClients } from "../db/schema";
import {
  appendVersion,
  appendWithdrawal,
  currentStates,
  digestOf,
  type DeliverableKind,
  type DeliverableInput,
  type DeliverableState,
} from "../deliverables";
import { queryDatabase, publishedFilter, type NotionPage } from "./api";
import { clientsDatabaseId, databaseIdFor, SYNCED_KINDS } from "./config";
import { clientPageIds, companyName, mapPage, spaceId, PROPS, UNTITLED } from "./map";

// ─────────────────────────────────────────────────────────────────────────────
// De l'atelier à l'espace client.
//
// Sens unique, sans exception : on lit Notion, on écrit dans Postgres. Rien
// n'est jamais réécrit dans Notion, et l'espace client n'appelle jamais Notion
// pendant une requête. Ce cloisonnement est ce qui fait qu'une indisponibilité
// de Notion, ou une limite d'API atteinte, ne se voit pas chez le client.
//
// Trois précautions gouvernent ce fichier, toutes contre le même risque — faire
// disparaître un livrable par accident :
//
//  1. **Une base se traite d'un bloc.** La liste des pages publiées doit être
//     COMPLÈTE avant de conclure qu'un livrable a disparu. Une pagination
//     interrompue ferait retirer des livrables encore publiés.
//  2. **Un retrait de masse demande confirmation.** Si l'atelier ne rend plus
//     rien alors que l'espace contient des livrables, c'est plus probablement
//     une colonne renommée qu'une dépublication générale.
//  3. **Un livrable orphelin est signalé, jamais deviné.** Une page sans client
//     résoluble n'est publiée nulle part, et son cas remonte dans le rapport.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Au-delà de ce nombre de retraits simultanés sur une base vidée, la synchro
 * s'arrête et demande `--forcer`. Trois : de quoi laisser passer un ménage
 * ordinaire, pas assez pour vider un espace sans s'en apercevoir.
 */
export const MASS_WITHDRAWAL_THRESHOLD = 3;

export interface KindReport {
  kind: DeliverableKind;
  /** Pages publiées dans l'atelier et rattachables à un accompagnement. */
  published: number;
  created: number;
  updated: number;
  restored: number;
  unchanged: number;
  withdrawn: number;
}

export interface SyncReport {
  /** Vrai si le balayage a tout lu sans rien écrire. */
  dryRun: boolean;
  clientsMapped: number;
  kinds: KindReport[];
  warnings: string[];
}

interface ClientResolution {
  byNotionPage: Map<string, string>;
  warnings: string[];
}

/**
 * Fait correspondre les fiches de la base Clients aux accompagnements en base.
 *
 * Une fiche n'est retenue que si son `ID espace` désigne un accompagnement qui
 * existe vraiment. Un identifiant mal recopié produirait sinon des livrables
 * rattachés à un client fantôme, invisibles de tous et détectables de personne.
 */
async function resolveClients(): Promise<ClientResolution> {
  const warnings: string[] = [];
  const byNotionPage = new Map<string, string>();

  const known = new Set(
    (await db().select({ id: ctoClients.id }).from(ctoClients)).map((row) => row.id),
  );

  for (const page of await queryDatabase(clientsDatabaseId())) {
    const name = companyName(page) ?? "(fiche sans raison sociale)";
    const id = spaceId(page)?.trim();

    if (!id) {
      warnings.push(`« ${name} » n'a pas d'${PROPS.clients.spaceId} : ses livrables ne remonteront pas.`);
      continue;
    }
    if (!known.has(id)) {
      warnings.push(
        `« ${name} » porte un ${PROPS.clients.spaceId} qui ne correspond à aucun accompagnement (${id}).`,
      );
      continue;
    }
    byNotionPage.set(page.id, id);
  }

  return { byNotionPage, warnings };
}

interface Resolved {
  inputs: DeliverableInput[];
  warnings: string[];
}

function resolvePages(
  kind: DeliverableKind,
  pages: NotionPage[],
  byNotionPage: Map<string, string>,
): Resolved {
  const warnings: string[] = [];
  const inputs: DeliverableInput[] = [];

  for (const page of pages) {
    const links = clientPageIds(page);
    const input = links.length === 1 ? tryMap(kind, page, byNotionPage.get(links[0])) : null;

    if (!input) {
      const title = mapPage(kind, page, "").title;
      warnings.push(
        links.length === 0
          ? `${kind} « ${title} » est publiée sans client : elle n'apparaît nulle part.`
          : links.length > 1
            ? `${kind} « ${title} » est rattachée à ${links.length} clients : à trancher, elle est ignorée.`
            : `${kind} « ${title} » pointe une fiche client non résoluble : elle est ignorée.`,
      );
      continue;
    }
    if (input.title === UNTITLED) {
      warnings.push(`Une ligne publiée de ${kind} n'a pas de titre ; elle part avec « ${UNTITLED} ».`);
    }
    inputs.push(input);
  }

  return { inputs, warnings };
}

function tryMap(
  kind: DeliverableKind,
  page: NotionPage,
  clientId: string | undefined,
): DeliverableInput | null {
  return clientId ? mapPage(kind, page, clientId) : null;
}

/**
 * Balaie une base et met l'espace à jour.
 *
 * Une insertion par livrable modifié. À quatre accompagnements et quelques
 * dizaines de lignes, le balayage complet tient en quelques secondes ; grouper
 * les écritures viendra si ça devient sensible, pas avant.
 */
async function syncKind(
  kind: DeliverableKind,
  byNotionPage: Map<string, string>,
  options: { force: boolean; dryRun: boolean },
): Promise<{ report: KindReport; warnings: string[] }> {
  const { force, dryRun } = options;
  const pages = await queryDatabase(databaseIdFor(kind), publishedFilter(PROPS.published));
  const { inputs, warnings } = resolvePages(kind, pages, byNotionPage);

  const states = new Map((await currentStates(kind)).map((s) => [s.notionPageId, s]));
  const report: KindReport = {
    kind,
    published: inputs.length,
    created: 0,
    updated: 0,
    restored: 0,
    unchanged: 0,
    withdrawn: 0,
  };

  for (const input of inputs) {
    const state = states.get(input.notionPageId);

    if (!state) {
      if (!dryRun) await appendVersion(input, 0);
      report.created += 1;
      continue;
    }
    if (state.withdrawn) {
      if (!dryRun) await appendVersion(input, state.version);
      report.restored += 1;
      continue;
    }
    if (state.digest === digestOf(input)) {
      report.unchanged += 1;
      continue;
    }
    if (!dryRun) await appendVersion(input, state.version);
    report.updated += 1;
  }

  const stillPublished = new Set(inputs.map((input) => input.notionPageId));
  const toWithdraw: DeliverableState[] = [];
  for (const state of states.values()) {
    if (!state.withdrawn && !stillPublished.has(state.notionPageId)) toWithdraw.push(state);
  }

  // La précaution 2, en une condition : une base qui ne rend plus RIEN alors que
  // l'espace en contient plusieurs ressemble davantage à une colonne renommée
  // qu'à une dépublication générale. Retirer une ou deux lignes reste normal.
  if (inputs.length === 0 && toWithdraw.length > MASS_WITHDRAWAL_THRESHOLD && !force) {
    warnings.push(
      `${kind} : l'atelier ne rend aucune ligne publiée alors que l'espace en affiche ` +
        `${toWithdraw.length}. Aucun retrait effectué — vérifier la case « ${PROPS.published} » ` +
        "et le nom des colonnes, puis relancer avec --forcer si le retrait est bien voulu.",
    );
    return { report, warnings };
  }

  for (const state of toWithdraw) {
    if (!dryRun) await appendWithdrawal(state, kind, UNTITLED);
    report.withdrawn += 1;
  }

  return { report, warnings };
}

/**
 * Synchronise l'atelier vers l'espace client.
 *
 * Les bases sont traitées l'une après l'autre : l'échec de l'une n'annule pas
 * les précédentes, qui sont déjà écrites et cohérentes. Une synchro
 * partiellement appliquée vaut mieux qu'un espace laissé en arrière parce
 * qu'une base a bronché.
 *
 * `dryRun` lit tout et n'écrit rien. À utiliser avant le premier balayage réel :
 * `.env.local` pointe sur la base de production, et un rapport se relit ; une
 * écriture, non.
 */
export async function syncFromNotion(
  options: { force?: boolean; dryRun?: boolean } = {},
): Promise<SyncReport> {
  const clients = await resolveClients();
  const report: SyncReport = {
    dryRun: options.dryRun === true,
    clientsMapped: clients.byNotionPage.size,
    kinds: [],
    warnings: [...clients.warnings],
  };

  for (const kind of SYNCED_KINDS) {
    const result = await syncKind(kind, clients.byNotionPage, {
      force: options.force === true,
      dryRun: options.dryRun === true,
    });
    report.kinds.push(result.report);
    report.warnings.push(...result.warnings);
  }

  return report;
}
