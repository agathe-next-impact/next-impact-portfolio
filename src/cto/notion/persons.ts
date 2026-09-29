import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoPersons } from "../db/schema";
import { record, revokeAllSessions } from "../access";
import { queryDatabase, type NotionPage } from "./api";
import { personsDatabaseId } from "./config";
import { alert, emptyFindings, type Findings } from "./findings";
import { clientPageIds, personEmail, personName, personRevoked, personRole } from "./map";
import { checkColumns, COLUMNS, schemaWarning } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// La synchro des personnes — qui a accès, depuis Notion plutôt que la CLI.
//
// Même mécanique que `resolveClients` dans `sync.ts` : une personne se
// reconnaît par sa PAGE Notion. Une adresse n'est pas une identité (décision
// du 2026-09-29) : la même peut porter plusieurs personnes — un consultant
// suivi chez deux clients, une boîte partagée — et chacune a sa ligne.
// L'adresse ne sert plus qu'à ADOPTER un accès sans page (créé via
// `npm run cto:invite`) ou dont la ligne a disparu, et seulement au sein du
// même accompagnement : jamais d'un client à l'autre.
//
// Trois règles :
//
//  1. **Un accès par client de la ligne** (décision du 2026-09-29). Une ligne
//     rattachée à deux clients porte deux accès, un par espace, qui partagent
//     la page. Ajouter un client à la relation ouvre son espace, l'en retirer
//     le ferme. Un accès n'est jamais DÉPLACÉ d'un client à l'autre : c'est un
//     accès fermé et un autre ouvert, chacun signalé et journalisé.
//  2. **Un accès que Notion ne porte plus est révoqué** (décision du
//     2026-09-27) : ligne supprimée ou client retiré de la relation, l'accès
//     tombe comme avec la case, sessions comprises. Même règle pour un
//     accompagnement dont la fiche disparaît (clos, cf. `resolveClients`).
//     Restaurer la ligne ou le client rouvre l'accès au balayage suivant.
//     Garde-fous : un client pas encore résoluble sur la ligne suspend toute
//     révocation pour elle (on ne sait pas lequel manque), et si la base ne
//     rend plus AUCUNE ligne, rien n'est révoqué en masse sans `--forcer` —
//     une base vide ressemble à une panne.
//  3. **Une adresse n'est pas une identité.** Deux lignes pour la même
//     adresse sont deux personnes ; la connexion par e-mail envoie alors un
//     lien par espace (`findPersonsByEmail`).
//
// Aucun e-mail ne part d'ici : le lien de connexion reste un geste séparé
// (`cto:invite --client <uuid> --email …`, ou la personne se présente
// elle-même sur `/espace-direction` — voir `access/store.ts:findPersonsByEmail`).
// ─────────────────────────────────────────────────────────────────────────────

export interface PersonsReport {
  seen: number;
  created: number;
  updated: number;
  revoked: number;
  restored: number;
  unchanged: number;
}

interface ExistingPerson {
  id: string;
  clientId: string;
  notionPageId: string | null;
  email: string;
  name: string;
  role: string | null;
  revokedAt: Date | null;
}

/** Ce que chaque ligne de la base réclame : ses clients résolus, et si tous l'ont été. */
export type Attendus = Map<string, { clients: Set<string>; complet: boolean }>;

/**
 * Pur : les clients qu'une ligne réclame, d'après sa relation « Client ».
 * `complet` est faux dès qu'une fiche liée n'est pas encore résoluble : on ne
 * sait alors pas quels accès elle vise, donc on n'en ferme aucun. Une relation
 * VIDE non plus : c'est une erreur de saisie signalée, pas un ordre de couper.
 */
export function attendusDe(
  links: string[],
  byNotionPage: Map<string, string>,
): { clients: Set<string>; complet: boolean } {
  const clients = new Set<string>();
  let complet = links.length > 0;
  for (const link of links) {
    const clientId = byNotionPage.get(link);
    if (clientId) clients.add(clientId);
    else complet = false;
  }
  return { clients, complet };
}

/**
 * Pur : les accès que Notion porte encore — leur ligne est là et réclame
 * toujours leur client (ou ne peut pas encore dire lesquels elle réclame).
 * Un accès avec page absent de cet ensemble est à révoquer.
 */
export function accesPortes(
  rows: Pick<ExistingPerson, "id" | "clientId" | "notionPageId">[],
  attendus: Attendus,
): Set<string> {
  const portes = new Set<string>();
  for (const row of rows) {
    if (row.notionPageId === null) continue;
    const ligne = attendus.get(row.notionPageId);
    if (ligne && (!ligne.complet || ligne.clients.has(row.clientId))) portes.add(row.id);
  }
  return portes;
}

/**
 * Pur : les accès qu'une ligne sans accès peut adopter, par accompagnement et
 * adresse — ceux sans page (`cto:invite`) ou que leur ligne ne porte plus
 * (`accesPortes`). Les accès encore ouverts d'abord : entre un accès révoqué
 * et un accès vivant pour la même adresse, c'est le vivant qu'on rattache.
 */
export function adoptables(
  rows: Pick<ExistingPerson, "id" | "clientId" | "notionPageId" | "email" | "revokedAt">[],
  portes: Set<string>,
): Map<string, string[]> {
  const candidates = new Map<string, string[]>();
  const ordered = [...rows].sort((a, b) => Number(a.revokedAt !== null) - Number(b.revokedAt !== null));
  for (const row of ordered) {
    if (portes.has(row.id)) continue;
    const key = adoptionKey(row.clientId, row.email);
    candidates.set(key, [...(candidates.get(key) ?? []), row.id]);
  }
  return candidates;
}

/** La clé d'un accès né d'une ligne : la page ET le client, une ligne pouvant en porter plusieurs. */
export function accessKey(pageId: string, clientId: string): string {
  return `${pageId}
${clientId}`;
}

export function adoptionKey(clientId: string, email: string): string {
  return `${clientId}
${email.trim().toLowerCase()}`;
}

/** Ce que le balayage d'une ligne a besoin de savoir des autres. */
interface Context {
  byNotionPage: Map<string, string>;
  /** Par `accessKey` : page et client. */
  byPage: Map<string, ExistingPerson>;
  byId: Map<string, ExistingPerson>;
  /** `adoptables` : consommé au fil du balayage, un accès n'est adopté qu'une fois. */
  adoption: Map<string, string[]>;
}

/**
 * Balaie la base Personnes.
 *
 * `byNotionPage` vient de `resolveClients` (`sync.ts`) : une personne pointant
 * une fiche Clients non résoluble — colonne renommée, page pas encore
 * balayée — est signalée, jamais devinée.
 */
export async function syncPersons(
  byNotionPage: Map<string, string>,
  options: { dryRun: boolean; force?: boolean },
): Promise<{ report: PersonsReport } & Findings> {
  const findings = emptyFindings();
  const report: PersonsReport = {
    seen: 0,
    created: 0,
    updated: 0,
    revoked: 0,
    restored: 0,
    unchanged: 0,
  };

  // Avant toute lecture de ligne : « Révoquée » renommée se lirait décochée
  // partout, et rouvrirait d'un coup tous les accès coupés.
  const databaseId = personsDatabaseId();
  const broken = schemaWarning("Personnes", await checkColumns(databaseId, COLUMNS.persons));
  if (broken) {
    alert(findings, broken);
    return { report, ...findings };
  }

  // Dans l'ordre de création : entre deux lignes qui pourraient adopter le
  // même accès ancien, c'est la plus ancienne qui l'emporte.
  const pages = await queryDatabase(databaseId, undefined, [
    { timestamp: "created_time", direction: "ascending" },
  ]);

  const rows: ExistingPerson[] = await db()
    .select({
      id: ctoPersons.id,
      clientId: ctoPersons.clientId,
      notionPageId: ctoPersons.notionPageId,
      email: ctoPersons.email,
      name: ctoPersons.name,
      role: ctoPersons.role,
      revokedAt: ctoPersons.revokedAt,
    })
    .from(ctoPersons);

  const attendus: Attendus = new Map(
    pages.map((page) => [page.id, attendusDe(clientPageIds(page), byNotionPage)]),
  );
  const context: Context = {
    byNotionPage,
    byPage: new Map(
      rows.filter((row): row is ExistingPerson & { notionPageId: string } => row.notionPageId !== null)
        .map((row) => [accessKey(row.notionPageId, row.clientId), row]),
    ),
    byId: new Map(rows.map((row) => [row.id, row])),
    adoption: adoptables(rows, accesPortes(rows, attendus)),
  };

  for (const page of pages) {
    report.seen += 1;
    await syncOne(page, context, options.dryRun, report, findings);
  }

  // `accesPortes` est recalculé après le balayage : un accès adopté par une
  // ligne en porte désormais la page, il ne doit pas tomber comme orphelin.
  await revokeMissing(pages, rows, attendus, options, report, findings);

  return { report, ...findings };
}

/** Au-delà, une base Personnes vide ressemble à une panne : pas de révocation sans --forcer. */
const SEUIL_RETRAIT_MASSIF = 3;

/**
 * Un accès que Notion ne porte plus (ligne supprimée ou mise à la corbeille,
 * client retiré de sa relation) tombe comme si « Révoquée » était cochée :
 * sessions fermées, événement journalisé. Les accès créés hors Notion
 * (`cto:invite`, sans page) ne sont pas concernés : la base ne les a jamais
 * portés.
 */
async function revokeMissing(
  pages: NotionPage[],
  rows: ExistingPerson[],
  attendus: Attendus,
  options: { dryRun: boolean; force?: boolean },
  report: PersonsReport,
  findings: Findings,
): Promise<void> {
  const portes = accesPortes(rows, attendus);
  const disparues = rows.filter(
    (row) => row.notionPageId !== null && !portes.has(row.id) && row.revokedAt === null,
  );
  if (disparues.length === 0) return;

  if (pages.length === 0 && disparues.length > SEUIL_RETRAIT_MASSIF && !options.force) {
    alert(
      findings,
      `Personnes : la base ne rend aucune ligne alors que ${disparues.length} accès sont ouverts. ` +
        "Aucune révocation — vérifier le partage de la base, puis relancer avec --forcer si c'est voulu.",
    );
    return;
  }

  for (const row of disparues) {
    const cause = attendus.has(row.notionPageId!)
      ? "client retiré de sa ligne dans la base Personnes"
      : "ligne disparue de la base Personnes";
    alert(findings, `« ${row.name} » : ${cause} — accès ${options.dryRun ? "serait révoqué" : "révoqué"}.`);
    report.revoked += 1;
    if (options.dryRun) continue;
    await db().update(ctoPersons).set({ revokedAt: new Date() }).where(eq(ctoPersons.id, row.id));
    await revokeAllSessions(row.id);
    await record({
      event: "session_revoquee",
      personId: row.id,
      clientId: row.clientId,
      detail: cause,
    });
  }
}

async function syncOne(
  page: NotionPage,
  context: Context,
  dryRun: boolean,
  report: PersonsReport,
  findings: Findings,
): Promise<void> {
  const name = personName(page);
  const email = personEmail(page);
  const label = name ?? email ?? "(sans nom ni e-mail)";

  if (!name || !email) {
    findings.warnings.push(`Personne « ${label} » sans nom ou sans e-mail : ignorée.`);
    return;
  }

  const links = clientPageIds(page);
  if (links.length === 0) {
    alert(findings, `Personne « ${label} » sans client : elle n'a accès à rien.`);
    return;
  }

  for (const link of links) {
    const clientId = context.byNotionPage.get(link);
    if (!clientId) {
      // L'ordinaire d'une fiche Clients en préparation : cet accès attend.
      findings.warnings.push(`Personne « ${label} » : un de ses clients n'est pas encore résoluble, cet accès attend.`);
      continue;
    }
    await syncAccess(page, clientId, { name, email, label }, context, dryRun, report, findings);
  }
}

/** L'accès d'une ligne à UN de ses clients : créé, adopté ou mis à jour. */
async function syncAccess(
  page: NotionPage,
  clientId: string,
  { name, email, label }: { name: string; email: string; label: string },
  context: Context,
  dryRun: boolean,
  report: PersonsReport,
  findings: Findings,
): Promise<void> {
  const role = personRole(page);
  const revoked = personRevoked(page);
  const existing = context.byPage.get(accessKey(page.id, clientId)) ?? adopt(context, clientId, email);

  if (!existing) {
    if (!dryRun) {
      await db()
        .insert(ctoPersons)
        .values({ clientId, notionPageId: page.id, email, name, role, revokedAt: revoked ? new Date() : null });
    }
    findings.warnings.push(`« ${label} » : nouvel accès créé${revoked ? " (déjà révoqué)" : ""}.`);
    report.created += 1;
    return;
  }

  const patch: { notionPageId?: string; name?: string; role?: string | null; email?: string; revokedAt?: Date | null } = {};

  if (existing.notionPageId !== page.id) {
    // Adopté par adresse, dans le même accompagnement : un accès créé via
    // cto:invite, ou celui d'une ligne disparue — sans quoi il serait révoqué
    // pour une ligne supprimée alors qu'une autre le porte.
    findings.warnings.push(
      existing.notionPageId
        ? `« ${label} » : accès rattaché à cette ligne, l'ancienne a disparu de la base.`
        : dryRun
          ? `« ${label} » serait rattachée à son accès existant, créé via cto:invite.`
          : `« ${label} » : rattachée à son accès existant, créé via cto:invite.`,
    );
    patch.notionPageId = page.id;
  }

  if (email !== existing.email) {
    alert(findings, `« ${label} » : adresse changée dans Notion (${existing.email} → ${email}).`);
    patch.email = email;
  }

  if (name !== existing.name) patch.name = name;
  if (role !== existing.role) patch.role = role;

  const wasRevoked = existing.revokedAt !== null;
  if (revoked && !wasRevoked) patch.revokedAt = new Date();
  else if (!revoked && wasRevoked) patch.revokedAt = null;

  // La suite du balayage raisonne sur l'état à venir, à blanc comme en vrai :
  // `revokeMissing` ne doit pas révoquer un accès qui vient de changer de ligne.
  if (patch.notionPageId) existing.notionPageId = patch.notionPageId;
  if (patch.email) existing.email = patch.email;

  if (Object.keys(patch).length === 0) {
    report.unchanged += 1;
    return;
  }

  if (dryRun) {
    if (patch.revokedAt !== undefined) {
      if (patch.revokedAt) report.revoked += 1;
      else report.restored += 1;
    } else {
      report.updated += 1;
    }
    return;
  }

  await db().update(ctoPersons).set(patch).where(eq(ctoPersons.id, existing.id));

  if (patch.revokedAt) {
    await revokeAllSessions(existing.id);
    await record({
      event: "session_revoquee",
      personId: existing.id,
      clientId: existing.clientId,
      detail: "révoquée depuis Notion",
    });
    report.revoked += 1;
  } else if (patch.revokedAt === null) {
    report.restored += 1;
  } else {
    report.updated += 1;
  }
}

/** Le premier accès adoptable pour cet accompagnement et cette adresse, retiré de la réserve. */
function adopt(context: Context, clientId: string, email: string): ExistingPerson | undefined {
  const key = adoptionKey(clientId, email);
  const [id, ...rest] = context.adoption.get(key) ?? [];
  if (!id) return undefined;
  context.adoption.set(key, rest);
  return context.byId.get(id);
}
