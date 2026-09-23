import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { activePersons, sendPublicationNotice, type PublicationSummary } from "../access";
import { ctoClients } from "../db/schema";
import {
  appendVersion,
  appendWithdrawal,
  currentStates,
  digestOf,
  setPlacement,
  type DeliverableKind,
  type DeliverableInput,
  type DeliverableState,
} from "../deliverables";
import { fetchPage, queryDatabase, publishedFilter, type NotionPage } from "./api";
import { clientsDatabaseId, databaseIdFor, SYNCED_KINDS } from "./config";
import { syncLetters, type LettersReport } from "./letters";
import { clientPageIds, companyName, mapPage, spaceId, PROPS, UNTITLED } from "./map";
import * as prop from "./properties";

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
  /** Parmi elles, celles marquées « À la une ». */
  featured: number;
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
  /** Accompagnements pour lesquels une notification part (ou partirait). */
  notified: number;
  /** Le balayage des lettres de veille, hors livrables. */
  letters: LettersReport;
  kinds: KindReport[];
  warnings: string[];
}

/** Intitules lisibles pour l'e-mail. Jamais de titres de livrables. */
const KIND_LABELS: Record<DeliverableKind, string> = {
  decision: "relevé de décisions",
  roadmap: "roadmap",
  cartographie: "cartographie",
  veille: "veille",
  document: "documents",
};

interface ClientResolution {
  byNotionPage: Map<string, string>;
  /**
   * Fiche organisation → accompagnement. C'est par là que passent les lettres
   * personnalisées, produites par organisation et non par contrat.
   */
  byOrganisation: Map<string, string>;
  /** État de chaque accompagnement : lui seul autorise une notification. */
  statusById: Map<string, string>;
  /** Accompagnements dont la synchro est suspendue depuis l'admin (§ ci-dessous). */
  disabledClientIds: Set<string>;
  warnings: string[];
}

/** Ce qui a bougé pour un accompagnement pendant ce balayage. */
interface ClientChanges {
  nouveautes: number;
  corrections: number;
  parKind: Map<DeliverableKind, number>;
}

/**
 * Fait correspondre les fiches de la base Clients aux accompagnements en base.
 *
 * Une fiche n'est retenue que si son `ID espace` désigne un accompagnement qui
 * existe vraiment. Un identifiant mal recopié produirait sinon des livrables
 * rattachés à un client fantôme, invisibles de tous et détectables de personne.
 */
async function resolveClients(dryRun: boolean): Promise<ClientResolution> {
  const warnings: string[] = [];
  const byNotionPage = new Map<string, string>();
  const byOrganisation = new Map<string, string>();

  const statusById = new Map<string, string>();
  const disabledClientIds = new Set<string>();
  const rows = await db()
    .select({ id: ctoClients.id, status: ctoClients.status, syncEnabled: ctoClients.syncEnabled })
    .from(ctoClients);
  for (const row of rows) {
    statusById.set(row.id, row.status);
    if (!row.syncEnabled) disabledClientIds.add(row.id);
  }
  const known = new Set(statusById.keys());

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
    if (disabledClientIds.has(id)) {
      warnings.push(`« ${name} » : synchro suspendue depuis l'admin — ses lignes ne bougent pas ce balayage.`);
    }
    await adopterFicheOrganisation(page, id, name, warnings, dryRun, byOrganisation);
  }

  return { byNotionPage, byOrganisation, statusById, disabledClientIds, warnings };
}

/**
 * Aligne l'accompagnement sur sa fiche organisation.
 *
 * La fiche organisation est la source de vérité de l'identité : elle porte la
 * raison sociale exacte et le pack sectoriel qui sert de base aux lettres. Les
 * recopier dans la base Clients les ferait diverger au premier changement, et
 * c'est toujours la copie qu'on oublie de mettre à jour.
 *
 * Écriture conditionnelle : on ne touche `cto_clients` que si quelque chose a
 * bougé. Une écriture par balayage et par client ne coûterait pas cher, mais
 * elle rendrait `updated_at` illisible le jour où on en aura un.
 */
async function adopterFicheOrganisation(
  fiche: NotionPage,
  clientId: string,
  nomAffiche: string,
  warnings: string[],
  dryRun: boolean,
  byOrganisation: Map<string, string>,
): Promise<void> {
  const liens = prop.relation(fiche, PROPS.clients.organisation);

  if (liens.length === 0) {
    // Deux causes possibles, et l'API ne permet pas de les distinguer : Notion
    // rend une relation VIDE, jamais une erreur, quand l'intégration n'a pas
    // accès à la base visée. Nommer les deux évite une heure de recherche.
    warnings.push(
      `« ${nomAffiche} » n'est rattachée à aucune fiche organisation, ou la base des fiches ` +
        `n'est pas partagée avec l'intégration. Sans elle : pas de lettre sectorielle.`,
    );
    return;
  }
  if (liens.length > 1) {
    warnings.push(
      `« ${nomAffiche} » est rattachée à ${liens.length} fiches organisation : à trancher, aucune n'est retenue.`,
    );
    return;
  }

  let organisation: NotionPage;
  try {
    organisation = await fetchPage(liens[0]);
  } catch (error) {
    console.error("[cto] fiche organisation illisible", error);
    warnings.push(`Fiche organisation de « ${nomAffiche} » illisible : rattachement ignoré.`);
    return;
  }

  byOrganisation.set(organisation.id, clientId);

  const raisonSociale = prop.text(organisation, PROPS.organisation.name);
  const pack = prop.select(organisation, PROPS.organisation.pack);

  const [actuel] = await db()
    .select({ company: ctoClients.company, sector: ctoClients.sector })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);
  if (!actuel) return;

  const company = raisonSociale ?? actuel.company;
  if (company === actuel.company && pack === actuel.sector) return;

  if (dryRun) {
    warnings.push(
      `« ${nomAffiche} » serait alignée sur sa fiche organisation : ${company}` +
        `${pack ? `, ${pack}` : ", sans pack"}.`,
    );
    return;
  }

  await db()
    .update(ctoClients)
    .set({ company, sector: pack })
    .where(eq(ctoClients.id, clientId));
}

interface Resolved {
  inputs: DeliverableInput[];
  warnings: string[];
}

function resolvePages(
  kind: DeliverableKind,
  pages: NotionPage[],
  byNotionPage: Map<string, string>,
  disabledClientIds: Set<string>,
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
    // Pause volontaire, pas une anomalie : rien à signaler ligne par ligne, le
    // signalement se fait une fois par accompagnement dans `resolveClients`.
    if (disabledClientIds.has(input.clientId)) continue;

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
  changes: Map<string, ClientChanges>,
  disabledClientIds: Set<string>,
): Promise<{ report: KindReport; warnings: string[] }> {
  const { force, dryRun } = options;
  const pages = await queryDatabase(databaseIdFor(kind), publishedFilter(PROPS.published));
  const { inputs, warnings } = resolvePages(kind, pages, byNotionPage, disabledClientIds);

  const states = new Map((await currentStates(kind)).map((s) => [s.notionPageId, s]));
  const report: KindReport = {
    kind,
    published: inputs.length,
    featured: 0,
    created: 0,
    updated: 0,
    restored: 0,
    unchanged: 0,
    withdrawn: 0,
  };

  for (const input of inputs) {
    const state = states.get(input.notionPageId);

    // Le placement s'écrit à CHAQUE passage, y compris sur un livrable
    // inchangé : c'est la seule façon qu'un simple rangement « À la une » →
    // « Archive » remonte, puisque le contenu, lui, n'a pas bougé et que la
    // comparaison d'empreinte va sauter la ligne trois instructions plus bas.
    if (!dryRun) await setPlacement(input.notionPageId, input.featured);
    if (input.featured) report.featured += 1;

    if (!state) {
      if (!dryRun) await appendVersion(input, 0);
      report.created += 1;
      noter(changes, input.clientId, kind, "nouveaute");
      continue;
    }
    if (state.withdrawn) {
      if (!dryRun) await appendVersion(input, state.version);
      report.restored += 1;
      noter(changes, input.clientId, kind, "nouveaute");
      continue;
    }
    if (state.digest === digestOf(input)) {
      report.unchanged += 1;
      continue;
    }
    if (!dryRun) await appendVersion(input, state.version);
    report.updated += 1;
    noter(changes, input.clientId, kind, "correction");
  }

  const stillPublished = new Set(inputs.map((input) => input.notionPageId));
  const toWithdraw: DeliverableState[] = [];
  for (const state of states.values()) {
    // Gelé, pas retiré : un accompagnement en pause ne doit pas voir ses
    // livrables disparaître au prochain balayage sous prétexte que ses lignes
    // sont, par construction, absentes de `inputs` ce tour-ci.
    if (disabledClientIds.has(state.clientId)) continue;
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

function noter(
  changes: Map<string, ClientChanges>,
  clientId: string,
  kind: DeliverableKind,
  nature: "nouveaute" | "correction",
): void {
  const entry = changes.get(clientId) ?? {
    nouveautes: 0,
    corrections: 0,
    parKind: new Map<DeliverableKind, number>(),
  };
  if (nature === "nouveaute") entry.nouveautes += 1;
  else entry.corrections += 1;
  entry.parKind.set(kind, (entry.parKind.get(kind) ?? 0) + 1);
  changes.set(clientId, entry);
}

/**
 * Previent les personnes d'un accompagnement qu'il y a du nouveau.
 *
 * **Un accompagnement `suspendu` ne recoit rien**, conformement a ce que
 * `cto_clients.status` promet : pendant une suspension, la synchro continue en
 * silence. Un client qui a mis l'accompagnement en pause ne doit pas recevoir de
 * courrier comme si de rien n'etait.
 *
 * Un echec d'envoi ne fait jamais echouer le balayage : les livrables sont
 * publies, c'est l'essentiel. Le manque remonte dans le rapport, ou il se voit.
 */
async function notifier(
  changes: Map<string, ClientChanges>,
  statusById: Map<string, string>,
  warnings: string[],
): Promise<void> {
  const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
  const url = `${base}/espace-direction`;

  for (const [clientId, entry] of changes) {
    if (statusById.get(clientId) !== "actif") continue;

    const summary: PublicationSummary = {
      nouveautes: entry.nouveautes,
      corrections: entry.corrections,
      parCategorie: [...entry.parKind].map(([kind, count]) => ({
        label: KIND_LABELS[kind],
        count,
      })),
    };

    for (const person of await activePersons(clientId)) {
      try {
        await sendPublicationNotice({ email: person.email, name: person.name }, summary, url);
      } catch (error) {
        console.error("[cto] notification de publication impossible", error);
        warnings.push(`Notification non envoyée à ${person.email} : l'envoi a échoué.`);
      }
    }
  }
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
  options: { force?: boolean; dryRun?: boolean; notify?: boolean } = {},
): Promise<SyncReport> {
  const dryRun = options.dryRun === true;
  const clients = await resolveClients(dryRun);
  const changes = new Map<string, ClientChanges>();

  const report: SyncReport = {
    dryRun,
    clientsMapped: clients.byNotionPage.size,
    notified: 0,
    letters: { published: 0, created: 0, updated: 0, unchanged: 0, withdrawn: 0 },
    kinds: [],
    warnings: [...clients.warnings],
  };

  for (const kind of SYNCED_KINDS) {
    const result = await syncKind(
      kind,
      clients.byNotionPage,
      { force: options.force === true, dryRun },
      changes,
      clients.disabledClientIds,
    );
    report.kinds.push(result.report);
    report.warnings.push(...result.warnings);
  }

  // Les lettres passent en dernier : elles coûtent le plus cher en requêtes, et
  // un échec de leur côté ne doit pas priver le client des livrables déjà écrits.
  const lettres = await syncLetters(clients.byOrganisation, { dryRun });
  report.letters = lettres.report;
  report.warnings.push(...lettres.warnings);

  // Un seul message par personne et par balayage, envoye APRES toutes les
  // bases : prevenir base par base ferait trois e-mails pour un meme comite.
  if (!dryRun && options.notify !== false) {
    await notifier(changes, clients.statusById, report.warnings);
  }
  report.notified = [...changes.keys()].filter(
    (id) => clients.statusById.get(id) === "actif",
  ).length;

  return report;
}
