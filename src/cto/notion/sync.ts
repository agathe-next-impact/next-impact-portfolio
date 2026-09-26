import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";
import {
  appendVersion,
  appendWithdrawal,
  currentStates,
  digestOf,
  setPlacement,
  type AuditPayload,
  type PropositionPayload,
  type DeliverableKind,
  type DeliverableInput,
  type DeliverableState,
} from "../deliverables";
import { FileTooLargeError, importFile } from "../files";
import { fetchPage, queryDatabase, publishedFilter, type NotionPage } from "./api";
import {
  clientsDatabaseId,
  databaseIdFor,
  envNameFor,
  isConfigured,
  OPTIONAL_KINDS,
  SYNCED_KINDS,
} from "./config";
import { importAnnex, readAuditTree } from "./audit";
import { syncLetters, type LettersReport } from "./letters";
import { syncPersons, type PersonsReport } from "./persons";
import {
  auditActionInput,
  auditAnnexFiles,
  auditPageId,
  clientPageIds,
  clientServices,
  clientStatus,
  clientTier,
  clientVeilleOrganisations,
  clientSentinelleId,
  clientWpUmbrellaProjectId,
  companyName,
  documentFiles,
  mapPage,
  propositionPageId,
  spaceId,
  PROPS,
  UNTITLED,
} from "./map";
import * as prop from "./properties";

// ─────────────────────────────────────────────────────────────────────────────
// De l'atelier à l'espace client.
//
// Sens unique, sans exception : on lit Notion, on écrit dans Postgres. Rien
// n'est jamais réécrit dans Notion, et l'espace client n'appelle jamais Notion
// pendant une requête. Ce cloisonnement est ce qui fait qu'une indisponibilité
// de Notion, ou une limite d'API atteinte, ne se voit pas chez le client.
//
// **Ce fichier n'envoie plus d'e-mail.** La notification est un processus
// séparé (`src/cto/notify/`, commande `npm run cto:notify`), déclenché à la
// main plutôt qu'à chaque balayage : synchroniser plusieurs fois pendant qu'on
// relit un contenu ne doit prévenir personne. Voir `src/cto/notify/store.ts`
// pour comment elle retrouve, après coup, ce qui a été publié.
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
  /** Le balayage des personnes — qui a accès —, hors livrables. */
  persons: PersonsReport;
  /** Le balayage des lettres de veille, hors livrables. */
  letters: LettersReport;
  kinds: KindReport[];
  warnings: string[];
}

interface ClientResolution {
  byNotionPage: Map<string, string>;
  /**
   * Fiche organisation → accompagnement. C'est par là que passent les lettres
   * personnalisées, produites par organisation et non par contrat.
   */
  byOrganisation: Map<string, string>;
  /**
   * Ligne du pipeline « Veilles clients » → accompagnement. C'est par là que
   * les éditions de veille personnalisée deviennent des lettres.
   */
  byVeilleOrganisation: Map<string, string>;
  /** Accompagnements dont la synchro est suspendue depuis l'admin (§ ci-dessous). */
  disabledClientIds: Set<string>;
  warnings: string[];
}

/**
 * Fait correspondre les fiches de la base Clients aux accompagnements en base
 * — et en crée un nouveau pour toute fiche qu'aucun accompagnement ne
 * revendique encore.
 *
 * Le rattachement se fait par `notion_page_id`, jamais réécrit dans Notion
 * (voir schema.ts). Une fiche déjà reliée à la main avant ce mécanisme — via
 * la colonne texte legacy `ID espace` — est ADOPTÉE (son `notion_page_id` est
 * rempli) plutôt que dupliquée. Sans l'un ou l'autre, la fiche est un nouvel
 * accompagnement : c'est la gestion des comptes clients par Notion, la
 * création n'a plus besoin de `cto:invite`.
 */
async function resolveClients(dryRun: boolean): Promise<ClientResolution> {
  const warnings: string[] = [];
  const byNotionPage = new Map<string, string>();
  const byOrganisation = new Map<string, string>();
  const byVeilleOrganisation = new Map<string, string>();

  const rows = await db()
    .select({
      id: ctoClients.id,
      notionPageId: ctoClients.notionPageId,
      syncEnabled: ctoClients.syncEnabled,
    })
    .from(ctoClients);

  const disabledClientIds = new Set<string>();
  const idByNotionPage = new Map<string, string>();
  const legacyById = new Map<string, { notionPageId: string | null }>();
  for (const row of rows) {
    if (!row.syncEnabled) disabledClientIds.add(row.id);
    if (row.notionPageId) idByNotionPage.set(row.notionPageId, row.id);
    legacyById.set(row.id, { notionPageId: row.notionPageId });
  }

  for (const page of await queryDatabase(clientsDatabaseId())) {
    const name = companyName(page) ?? "(fiche sans raison sociale)";
    let id = idByNotionPage.get(page.id);

    if (!id) {
      // Repli : une fiche reliée à la main avant que `notion_page_id` existe.
      // On l'adopte au lieu d'en recréer une seconde.
      const legacy = spaceId(page)?.trim();
      const known = legacy ? legacyById.get(legacy) : undefined;
      if (legacy && known && !known.notionPageId) {
        id = legacy;
        if (dryRun) {
          warnings.push(`« ${name} » serait rattachée à son accompagnement existant (${id}).`);
        } else {
          await db().update(ctoClients).set({ notionPageId: page.id }).where(eq(ctoClients.id, id));
        }
      }
    }

    if (!id) {
      if (dryRun) {
        warnings.push(`« ${name} » : nouvel accompagnement — rien créé, lecture seule.`);
        continue;
      }
      const [created] = await db()
        .insert(ctoClients)
        .values({
          company: name,
          notionPageId: page.id,
          tier: clientTier(page) ?? undefined,
          status: clientStatus(page) ?? undefined,
          wpUmbrellaProjectId: clientWpUmbrellaProjectId(page) ?? undefined,
        })
        .returning({ id: ctoClients.id });
      id = created.id;
      warnings.push(`« ${name} » : nouvel accompagnement créé (${id}).`);
    }

    byNotionPage.set(page.id, id);
    if (disabledClientIds.has(id)) {
      warnings.push(`« ${name} » : synchro suspendue depuis l'admin — ses lignes ne bougent pas ce balayage.`);
    }

    await alignerFiche(page, id, name, warnings, dryRun);
    await adopterFicheOrganisation(page, id, name, warnings, dryRun, byOrganisation);

    for (const veille of clientVeilleOrganisations(page)) {
      const deja = byVeilleOrganisation.get(veille);
      if (deja && deja !== id) {
        warnings.push(
          `« ${name} » désigne une ligne de veille déjà reliée à un autre accompagnement : ignorée pour lui.`,
        );
        continue;
      }
      byVeilleOrganisation.set(veille, id);
    }
  }

  return { byNotionPage, byOrganisation, byVeilleOrganisation, disabledClientIds, warnings };
}

/** Deux listes de services identiques, à l'ordre près (elles arrivent triées). */
function sameServices(a: string[] | null, b: string[] | null): boolean {
  if (a === null || b === null) return a === b;
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/**
 * Aligne l'état, le palier et l'identifiant WP Umbrella sur les colonnes
 * correspondantes de l'atelier — tout ce que la fiche Notion pilote désormais,
 * en plus de la création. Le reste (personnes, révocation) reste un geste
 * CLI/SQL délibéré ; voir `docs/cto-externalise/espace-client-mise-en-place.md`.
 *
 * Écriture conditionnelle, même logique que `adopterFicheOrganisation` :
 * on ne touche `cto_clients` que si quelque chose a réellement changé.
 */
async function alignerFiche(
  page: NotionPage,
  clientId: string,
  name: string,
  warnings: string[],
  dryRun: boolean,
): Promise<void> {
  const status = clientStatus(page);
  const tier = clientTier(page);
  const wpUmbrellaProjectId = clientWpUmbrellaProjectId(page);
  const services = clientServices(page);
  const sentinelle = clientSentinelleId(page);
  if (sentinelle.invalid) {
    warnings.push(
      `« ${name} » : « ID Sentinelle » n'est pas un identifiant valide — veille technique non reliée.`,
    );
  }
  if (services.unknown.length > 0) {
    warnings.push(
      `« ${name} » : service(s) inconnu(s) ignoré(s) — ${services.unknown.join(", ")}. ` +
        "Vérifier le libellé dans la colonne « Services ».",
    );
  }
  // Colonne vide = jamais renseignée : on garde `null`, qui dit à l'espace de
  // conserver l'affichage d'avant les services (cf. schema.ts). Notion ne
  // distingue pas « vide » de « jamais rempli » ; c'est ce choix qui évite
  // qu'un accompagnement existant perde ses sections du jour au lendemain.
  const servicesVoulus = services.codes.length > 0 ? services.codes : null;

  const [actuel] = await db()
    .select({
      status: ctoClients.status,
      tier: ctoClients.tier,
      wpUmbrellaProjectId: ctoClients.wpUmbrellaProjectId,
      services: ctoClients.services,
      sentinelleClientId: ctoClients.sentinelleClientId,
    })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);
  if (!actuel) return;

  const patch: {
    status?: typeof actuel.status;
    tier?: string;
    wpUmbrellaProjectId?: number;
    services?: string[] | null;
    sentinelleClientId?: string | null;
    statusChangedAt?: Date;
  } = {};
  if (status && status !== actuel.status) patch.status = status;
  if (tier && tier !== actuel.tier) patch.tier = tier;
  if (wpUmbrellaProjectId && wpUmbrellaProjectId !== actuel.wpUmbrellaProjectId) {
    patch.wpUmbrellaProjectId = wpUmbrellaProjectId;
  }
  if (!sameServices(servicesVoulus, actuel.services)) patch.services = servicesVoulus;
  // Un identifiant mal formé ne délie pas un accompagnement déjà relié : on
  // garde l'ancien plutôt que de couper la veille sur une faute de frappe.
  if (!sentinelle.invalid && sentinelle.id !== actuel.sentinelleClientId) {
    patch.sentinelleClientId = sentinelle.id;
  }
  if (Object.keys(patch).length === 0) return;

  if (dryRun) {
    const changements = [
      patch.status ? `état → ${patch.status}` : null,
      patch.tier ? `palier → ${patch.tier}` : null,
      patch.wpUmbrellaProjectId ? `projet WP Umbrella → ${patch.wpUmbrellaProjectId}` : null,
      "services" in patch
        ? `services → ${patch.services ? patch.services.join(", ") : "affichage historique"}`
        : null,
      "sentinelleClientId" in patch
        ? `veille technique → ${patch.sentinelleClientId ?? "déliée"}`
        : null,
    ].filter(Boolean);
    warnings.push(`« ${name} » serait mise à jour : ${changements.join(", ")}.`);
    return;
  }

  if (patch.status) patch.statusChangedAt = new Date();
  await db().update(ctoClients).set(patch).where(eq(ctoClients.id, clientId));
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
  disabledClientIds: Set<string>,
  /**
   * Lignes venues d'ailleurs que de la base du type : les actions d'audit
   * validées, pour la roadmap. Elles passent DANS le même balayage, sinon le
   * retrait des lignes absentes de la base les effacerait à chaque passage.
   */
  extra: { inputs: DeliverableInput[]; complete: boolean } = { inputs: [], complete: true },
): Promise<{ report: KindReport; warnings: string[] }> {
  const pages = await queryDatabase(databaseIdFor(kind), publishedFilter(PROPS.published));
  const { inputs, warnings } = resolvePages(kind, pages, byNotionPage, disabledClientIds);
  if (kind === "document") await attachFiles(inputs, pages, warnings, options.dryRun);
  inputs.push(...extra.inputs);

  if (!extra.complete) {
    warnings.push(
      `${kind} : la lecture des audits est incomplète ce tour-ci — aucun retrait effectué, ` +
        "une action absente n'est peut-être qu'une action pas vue.",
    );
  }
  const report = await applyInputs(kind, inputs, warnings, disabledClientIds, {
    ...options,
    withdraw: extra.complete,
  });
  return { report, warnings };
}

/**
 * Écrit ce qui a changé et retire ce qui a disparu, pour un type de livrable.
 *
 * `keep` protège du retrait des livrables absents de `inputs` pour une raison
 * qui n'est pas une dépublication — un audit dont la page n'a pas pu être lue
 * ce tour-ci garde sa version publiée. `withdraw: false` suspend tout retrait.
 */
async function applyInputs(
  kind: DeliverableKind,
  inputs: DeliverableInput[],
  warnings: string[],
  disabledClientIds: Set<string>,
  options: { force: boolean; dryRun: boolean; keep?: Set<string>; withdraw?: boolean },
): Promise<KindReport> {
  const { force, dryRun } = options;
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
    // Gelé, pas retiré : un accompagnement en pause ne doit pas voir ses
    // livrables disparaître au prochain balayage sous prétexte que ses lignes
    // sont, par construction, absentes de `inputs` ce tour-ci.
    if (disabledClientIds.has(state.clientId)) continue;
    if (options.keep?.has(state.notionPageId)) continue;
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
    return report;
  }
  if (options.withdraw === false) return report;

  for (const state of toWithdraw) {
    if (!dryRun) await appendWithdrawal(state, kind, UNTITLED);
    report.withdrawn += 1;
  }

  return report;
}

interface AuditsResult {
  report: KindReport | null;
  warnings: string[];
  /** Les actions d'audit engagées, à verser dans la roadmap. */
  roadmap: DeliverableInput[];
  /** Faux si un audit n'a pas pu être lu en entier : la roadmap ne retire rien. */
  complete: boolean;
}

/**
 * Balaie la base Audits : pour chaque ligne publiée, lit toute la page d'audit
 * qu'elle désigne et en fait un livrable `audit`.
 *
 * Un audit illisible ce tour-ci — lien absent, page non partagée — n'est ni
 * publié ni retiré : sa version déjà en ligne reste telle quelle, et le rapport
 * le dit. C'est la doctrine des éditions de veille : un retrait à tort se voit
 * chez le client, un retrait différé d'un jour ne se voit pas.
 */
async function syncAudits(
  byNotionPage: Map<string, string>,
  options: { force: boolean; dryRun: boolean },
  disabledClientIds: Set<string>,
): Promise<AuditsResult> {
  const { dryRun } = options;
  if (!isConfigured("audit")) {
    return {
      report: null,
      warnings: [`Base « audit » ignorée : ${envNameFor("audit")} n'est pas posée.`],
      roadmap: [],
      complete: true,
    };
  }

  const pages = await queryDatabase(databaseIdFor("audit"), publishedFilter(PROPS.published));
  const resolved = resolvePages("audit", pages, byNotionPage, disabledClientIds);
  const warnings = resolved.warnings;
  const pageById = new Map(pages.map((page) => [page.id, page]));
  const keep = new Set<string>();
  const inputs: DeliverableInput[] = [];
  const roadmap: DeliverableInput[] = [];
  let complete = true;

  for (const input of resolved.inputs) {
    const page = pageById.get(input.notionPageId);
    const pageId = page ? auditPageId(page) : null;
    if (!page || !pageId) {
      warnings.push(
        `audit « ${input.title} » : pas de lien vers sa page dans « ${PROPS.audit.page} », ignoré.`,
      );
      keep.add(input.notionPageId);
      complete = false;
      continue;
    }

    let tree: Awaited<ReturnType<typeof readAuditTree>>;
    try {
      tree = await readAuditTree(pageId, input.title, { dryRun });
    } catch (error) {
      warnings.push(
        `audit « ${input.title} » : page illisible (${
          error instanceof Error ? error.message : "erreur"
        }). La version en ligne, s'il y en a une, reste telle quelle.`,
      );
      keep.add(input.notionPageId);
      complete = false;
      continue;
    }
    warnings.push(...tree.warnings);
    if (!tree.complete) complete = false;

    const annexes = auditAnnexFiles(page);
    if (annexes.length > 1) {
      warnings.push(
        `audit « ${input.title} » porte ${annexes.length} annexes : seule la première (${annexes[0].name}) est publiée.`,
      );
    }
    const annexe = annexes[0] ? await importAnnex(annexes[0], input.title, { dryRun }, warnings) : null;

    const payload = input.payload as AuditPayload;
    payload.synthese = tree.synthese;
    payload.sections = tree.sections;
    payload.annexe = annexe;
    payload.fichiers = [...new Set([...tree.fichiers, ...(annexe ? [annexe.id] : [])])].sort();
    inputs.push(input);

    for (const row of tree.roadmapRows) {
      const action = auditActionInput(row, input.clientId, input.title);
      if (action) roadmap.push(action);
    }
  }

  const report = await applyInputs("audit", inputs, warnings, disabledClientIds, { ...options, keep });
  return { report, warnings, roadmap, complete };
}

/**
 * Balaie la base Propositions : pour chaque ligne publiée, lit toute la page de
 * proposition qu'elle désigne (bases inline comprises) et en fait un livrable
 * `proposition`.
 *
 * Même doctrine que les audits : une proposition illisible ce tour-ci n'est ni
 * publiée ni retirée, sa version en ligne reste telle quelle.
 */
async function syncPropositions(
  byNotionPage: Map<string, string>,
  options: { force: boolean; dryRun: boolean },
  disabledClientIds: Set<string>,
): Promise<{ report: KindReport | null; warnings: string[] }> {
  const { dryRun } = options;
  if (!isConfigured("proposition")) {
    return { report: null, warnings: [`Base « proposition » ignorée : ${envNameFor("proposition")} n'est pas posée.`] };
  }

  const pages = await queryDatabase(databaseIdFor("proposition"), publishedFilter(PROPS.published));
  const resolved = resolvePages("proposition", pages, byNotionPage, disabledClientIds);
  const warnings = resolved.warnings;
  const pageById = new Map(pages.map((page) => [page.id, page]));
  const keep = new Set<string>();
  const inputs: DeliverableInput[] = [];

  for (const input of resolved.inputs) {
    const page = pageById.get(input.notionPageId);
    const pageId = page ? propositionPageId(page) : null;
    if (!pageId) {
      warnings.push(
        `proposition « ${input.title} » : pas de lien vers sa page dans « ${PROPS.proposition.page} », ignorée.`,
      );
      keep.add(input.notionPageId);
      continue;
    }

    let tree: Awaited<ReturnType<typeof readAuditTree>>;
    try {
      tree = await readAuditTree(pageId, input.title, { dryRun, label: "proposition" });
    } catch (error) {
      warnings.push(
        `proposition « ${input.title} » : page illisible (${
          error instanceof Error ? error.message : "erreur"
        }). Est-elle partagée avec l'intégration ? La version en ligne, s'il y en a une, reste telle quelle.`,
      );
      keep.add(input.notionPageId);
      continue;
    }
    warnings.push(...tree.warnings);

    const payload = input.payload as PropositionPayload;
    payload.corps = tree.synthese;
    payload.sections = tree.sections;
    payload.fichiers = tree.fichiers;
    inputs.push(input);
  }

  const report = await applyInputs("proposition", inputs, warnings, disabledClientIds, { ...options, keep });
  return { report, warnings };
}

/**
 * Rapatrie la pièce de chaque document publié et l'inscrit dans son payload.
 *
 * Avant la comparaison d'empreintes, et c'est ce qui compte : l'empreinte du
 * fichier fait partie du payload, donc remplacer le PDF dans Notion — titre et
 * colonnes inchangés — écrit une version de plus, datée, visible du client.
 *
 * Une seule pièce par document. Plusieurs pièces sur une ligne, c'est
 * presque toujours une ancienne version oubliée à côté de la nouvelle : on
 * prend la première et on le signale, plutôt que de publier les deux.
 *
 * Un échec de téléchargement dégrade la ligne (publiée sans pièce, signalée),
 * il n'arrête pas le balayage : les autres documents n'y sont pour rien.
 */
async function attachFiles(
  inputs: DeliverableInput[],
  pages: NotionPage[],
  warnings: string[],
  dryRun: boolean,
): Promise<void> {
  const pageById = new Map(pages.map((page) => [page.id, page]));

  for (const input of inputs) {
    const page = pageById.get(input.notionPageId);
    if (!page) continue;
    const fichiers = documentFiles(page);
    if (fichiers.length === 0) continue;
    if (fichiers.length > 1) {
      warnings.push(
        `document « ${input.title} » porte ${fichiers.length} pièces : seule la première (${fichiers[0].name}) est publiée.`,
      );
    }

    try {
      const ref = await importFile(fichiers[0].url, fichiers[0].name, { dryRun });
      (input.payload as { fichier?: unknown }).fichier = ref;
    } catch (error) {
      warnings.push(
        error instanceof FileTooLargeError
          ? `document « ${input.title} » : ${error.message}, publié sans sa pièce.`
          : `document « ${input.title} » : pièce impossible à rapatrier (${
              error instanceof Error ? error.message : "erreur"
            }), publié sans elle.`,
      );
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
  options: { force?: boolean; dryRun?: boolean } = {},
): Promise<SyncReport> {
  const dryRun = options.dryRun === true;
  const clients = await resolveClients(dryRun);

  const report: SyncReport = {
    dryRun,
    clientsMapped: clients.byNotionPage.size,
    persons: { seen: 0, created: 0, updated: 0, revoked: 0, restored: 0, unchanged: 0 },
    letters: { published: 0, created: 0, updated: 0, unchanged: 0, withdrawn: 0, editions: null },
    kinds: [],
    warnings: [...clients.warnings],
  };

  // Avant les livrables : qui a accès ne dépend d'aucun d'eux, et une personne
  // nouvellement révoquée ne doit pas rester une ligne de plus dans le rapport
  // des livrables pendant qu'on cherche pourquoi son accès est encore ouvert.
  const persons = await syncPersons(clients.byNotionPage, { dryRun });
  report.persons = persons.report;
  report.warnings.push(...persons.warnings);

  // Les audits avant les livrables : leurs actions validées alimentent la
  // roadmap, qui doit les recevoir dans son propre balayage. Un échec ici ne
  // prive le client de rien d'autre — la roadmap suspend seulement ses retraits.
  let audits: AuditsResult;
  try {
    audits = await syncAudits(
      clients.byNotionPage,
      { force: options.force === true, dryRun },
      clients.disabledClientIds,
    );
  } catch (error) {
    console.error("[cto] balayage des audits impossible", error);
    audits = {
      report: null,
      warnings: [
        `Audits illisibles (${error instanceof Error ? error.message : "erreur"}) : rien publié ni retiré ce tour-ci.`,
      ],
      roadmap: [],
      complete: false,
    };
  }
  report.warnings.push(...audits.warnings);

  for (const kind of SYNCED_KINDS) {
    const result = await syncKind(
      kind,
      clients.byNotionPage,
      { force: options.force === true, dryRun },
      clients.disabledClientIds,
      kind === "roadmap" ? { inputs: audits.roadmap, complete: audits.complete } : undefined,
    );
    report.kinds.push(result.report);
    report.warnings.push(...result.warnings);
  }

  for (const kind of OPTIONAL_KINDS) {
    if (!isConfigured(kind)) {
      report.warnings.push(`Base « ${kind} » ignorée : ${envNameFor(kind)} n'est pas posée.`);
      continue;
    }
    const result = await syncKind(
      kind,
      clients.byNotionPage,
      { force: options.force === true, dryRun },
      clients.disabledClientIds,
    );
    report.kinds.push(result.report);
    report.warnings.push(...result.warnings);
  }

  if (audits.report) report.kinds.push(audits.report);

  try {
    const propositions = await syncPropositions(
      clients.byNotionPage,
      { force: options.force === true, dryRun },
      clients.disabledClientIds,
    );
    if (propositions.report) report.kinds.push(propositions.report);
    report.warnings.push(...propositions.warnings);
  } catch (error) {
    console.error("[cto] balayage des propositions impossible", error);
    report.warnings.push(
      `Propositions illisibles (${error instanceof Error ? error.message : "erreur"}) : rien publié ni retiré ce tour-ci.`,
    );
  }

  // Les lettres passent en dernier : elles coûtent le plus cher en requêtes, et
  // un échec de leur côté ne doit pas priver le client des livrables déjà écrits.
  const lettres = await syncLetters(
    clients.byOrganisation,
    { dryRun },
    clients.byVeilleOrganisation,
  );
  report.letters = lettres.report;
  report.warnings.push(...lettres.warnings);

  return report;
}
