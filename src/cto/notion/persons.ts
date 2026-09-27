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
// Même mécanique que `resolveClients` dans `sync.ts`, à une différence près et
// elle compte : une personne se reconnaît par ADRESSE, pas par une colonne
// texte collée à la main. L'index unique `cto_person_email` existait déjà pour
// le lien magique ; il sert ici de clé d'adoption gratuite pour toute personne
// créée avant ce mécanisme (`npm run cto:invite`).
//
// Trois prudences, dont deux asymétriques et volontaires :
//
//  1. **La révocation est pilotée par Notion, la réassignation ne l'est pas.**
//     Cocher « Révoquée » NARROWS l'accès : c'est sûr par défaut, donc
//     appliqué directement, comme un aller-retour normal (décocher restaure —
//     voir schema.ts). Changer la relation « Client » d'une personne déjà
//     créée pourrait au contraire lui OUVRIR les données d'une autre
//     entreprise par un simple glisser-déposer de relation ; ce cas-là est
//     seulement signalé, jamais appliqué.
//  2. **Une personne disparue de Notion est révoquée** (décision du
//     2026-09-27) : supprimer sa ligne coupe l'accès comme la case, sessions
//     comprises. Même règle pour un accompagnement dont la fiche disparaît
//     (clos, cf. `resolveClients`). Restaurer la ligne depuis la corbeille
//     Notion rouvre l'accès au balayage suivant (même page, case décochée).
//     Garde-fou : si la base ne rend plus AUCUNE ligne, rien n'est révoqué
//     en masse sans `--forcer` — une base vide ressemble à une panne.
//  3. **Une adresse, une ligne.** Notion n'a pas de contrainte d'unicité, la
//     base si. Deux lignes pour la même adresse : une seule est retenue,
//     l'autre est ignorée et signalée (`onePerEmail`). Une adresse déjà
//     portée par un autre accès n'est pas reprise. Sans cela, l'index unique
//     ferait échouer l'écriture, et tout le balayage avec elle.
//
// Aucun e-mail ne part d'ici : le lien de connexion reste un geste séparé
// (`cto:invite --client <uuid> --email …`, ou la personne se présente
// elle-même sur `/espace-direction` — voir `access/store.ts:findPersonByEmail`).
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

/** Une ligne de la base Personnes, réduite à ce qui sert à départager les doublons. */
export interface PersonLine {
  id: string;
  email: string | null;
  name: string | null;
}

export interface DuplicateEmail {
  email: string;
  kept: PersonLine;
  ignored: PersonLine[];
}

/**
 * Pur : les adresses portées par plusieurs lignes, et la ligne retenue pour
 * chacune.
 *
 * Retenue : la ligne que l'accès existant désigne déjà (`holders` : adresse →
 * page Notion de l'accès qui la porte en base), à défaut la première de
 * `lines`, qui arrive dans l'ordre de création. Une ligne sans adresse n'est
 * le doublon de personne ; elle est signalée plus loin, pour ce qu'elle est.
 */
export function onePerEmail(lines: PersonLine[], holders: Map<string, string>): DuplicateEmail[] {
  const byEmail = new Map<string, PersonLine[]>();
  for (const line of lines) {
    if (!line.email) continue;
    byEmail.set(line.email, [...(byEmail.get(line.email) ?? []), line]);
  }

  const duplicates: DuplicateEmail[] = [];
  for (const [email, group] of byEmail) {
    if (group.length < 2) continue;
    const kept = group.find((line) => line.id === holders.get(email)) ?? group[0];
    duplicates.push({ email, kept, ignored: group.filter((line) => line !== kept) });
  }
  return duplicates;
}

/** Ce que le balayage d'une ligne a besoin de savoir des autres. */
interface Context {
  byNotionPage: Map<string, string>;
  byPage: Map<string, ExistingPerson>;
  byEmail: Map<string, ExistingPerson>;
  /** Les pages présentes dans la base, doublons compris. */
  presentes: Set<string>;
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

  // Dans l'ordre de création : entre deux lignes pour la même adresse, c'est
  // la plus ancienne qui reste.
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

  const context: Context = {
    byNotionPage,
    byPage: new Map(
      rows.filter((row): row is ExistingPerson & { notionPageId: string } => row.notionPageId !== null)
        .map((row) => [row.notionPageId, row]),
    ),
    byEmail: new Map(rows.map((row) => [row.email, row])),
    presentes: new Set(pages.map((page) => page.id)),
  };

  const holders = new Map(
    rows.flatMap((row) => (row.notionPageId ? [[row.email, row.notionPageId] as const] : [])),
  );
  const lines = pages.map((page) => ({ id: page.id, email: personEmail(page), name: personName(page) }));
  const ignorees = new Set<string>();
  for (const doublon of onePerEmail(lines, holders)) {
    for (const line of doublon.ignored) ignorees.add(line.id);
    alert(
      findings,
      `Personnes : l'adresse ${doublon.email} figure sur ${doublon.ignored.length + 1} lignes. ` +
        `Seule « ${doublon.kept.name ?? doublon.email} » est retenue — supprimer ` +
        `${doublon.ignored.length > 1 ? "les doublons" : "le doublon"} dans Notion.`,
    );
  }

  for (const page of pages) {
    report.seen += 1;
    if (ignorees.has(page.id)) continue;
    await syncOne(page, context, options.dryRun, report, findings);
  }

  await revokeMissing(pages, rows, options, report, findings);

  return { report, ...findings };
}

/** Au-delà, une base Personnes vide ressemble à une panne : pas de révocation sans --forcer. */
const SEUIL_RETRAIT_MASSIF = 3;

/**
 * Une personne dont la ligne a disparu de la base (supprimée, mise à la
 * corbeille) perd son accès, comme si « Révoquée » était cochée : sessions
 * fermées, événement journalisé. Les accès créés hors Notion (`cto:invite`,
 * sans page) ne sont pas concernés : la base ne les a jamais portés.
 */
async function revokeMissing(
  pages: NotionPage[],
  rows: ExistingPerson[],
  options: { dryRun: boolean; force?: boolean },
  report: PersonsReport,
  findings: Findings,
): Promise<void> {
  const presentes = new Set(pages.map((page) => page.id));
  const disparues = rows.filter(
    (row) => row.notionPageId !== null && !presentes.has(row.notionPageId) && row.revokedAt === null,
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
    alert(
      findings,
      options.dryRun
        ? `« ${row.name} » : ligne disparue de la base Personnes — accès serait révoqué.`
        : `« ${row.name} » : ligne disparue de la base Personnes — accès révoqué.`,
    );
    report.revoked += 1;
    if (options.dryRun) continue;
    await db().update(ctoPersons).set({ revokedAt: new Date() }).where(eq(ctoPersons.id, row.id));
    await revokeAllSessions(row.id);
    await record({
      event: "session_revoquee",
      personId: row.id,
      clientId: row.clientId,
      detail: "ligne supprimée de la base Personnes",
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
  const clientId = links.length === 1 ? context.byNotionPage.get(links[0]) : undefined;
  if (!clientId) {
    // Un client pas encore résoluble est l'ordinaire d'une fiche en
    // préparation ; une relation vide ou double est une erreur de saisie.
    if (links.length === 1) {
      findings.warnings.push(`Personne « ${label} » : son client n'est pas encore résoluble, elle attend.`);
    } else {
      alert(
        findings,
        links.length === 0
          ? `Personne « ${label} » sans client : elle n'a accès à rien.`
          : `Personne « ${label} » rattachée à plusieurs clients : à trancher, elle est ignorée.`,
      );
    }
    return;
  }

  const role = personRole(page);
  const revoked = personRevoked(page);
  const existing = context.byPage.get(page.id) ?? context.byEmail.get(email);

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

  if (!existing.notionPageId) {
    if (dryRun) findings.warnings.push(`« ${label} » serait rattachée à son accès existant, créé via cto:invite.`);
    patch.notionPageId = page.id;
  } else if (existing.notionPageId !== page.id) {
    // Accès reconnu à son adresse, mais né d'une autre ligne. Si elle est
    // toujours là, l'adresse lui appartient encore en base : on attend qu'elle
    // l'ait lâchée. Si elle a disparu, l'accès suit l'adresse — sans quoi il
    // serait révoqué pour une ligne supprimée alors qu'une autre le porte.
    if (context.presentes.has(existing.notionPageId)) {
      alert(
        findings,
        `« ${label} » : l'adresse ${email} est encore celle de l'accès de « ${existing.name} ». Ligne ignorée ce tour-ci.`,
      );
      return;
    }
    findings.warnings.push(`« ${label} » : accès rattaché à cette ligne, l'ancienne a disparu de la base.`);
    patch.notionPageId = page.id;
  }

  if (existing.clientId !== clientId) {
    alert(
      findings,
      `« ${label} » a changé de client dans Notion : ignoré. Un transfert entre accompagnements reste un geste SQL délibéré.`,
    );
  }

  if (email !== existing.email) {
    const holder = context.byEmail.get(email);
    if (holder && holder.id !== existing.id) {
      alert(
        findings,
        `« ${label} » : l'adresse ${email} est déjà celle de l'accès de « ${holder.name} ». Changement d'adresse ignoré.`,
      );
    } else {
      alert(findings, `« ${label} » : adresse changée dans Notion (${existing.email} → ${email}).`);
      patch.email = email;
    }
  }

  if (name !== existing.name) patch.name = name;
  if (role !== existing.role) patch.role = role;

  const wasRevoked = existing.revokedAt !== null;
  if (revoked && !wasRevoked) patch.revokedAt = new Date();
  else if (!revoked && wasRevoked) patch.revokedAt = null;

  // La suite du balayage raisonne sur l'état à venir, à blanc comme en vrai :
  // `revokeMissing` ne doit pas révoquer un accès qui vient de changer de ligne.
  if (patch.notionPageId) existing.notionPageId = patch.notionPageId;
  if (patch.email) {
    context.byEmail.delete(existing.email);
    existing.email = patch.email;
    context.byEmail.set(patch.email, existing);
  }

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
