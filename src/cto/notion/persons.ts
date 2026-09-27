import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoPersons } from "../db/schema";
import { record, revokeAllSessions } from "../access";
import { queryDatabase, type NotionPage } from "./api";
import { personsDatabaseId } from "./config";
import { clientPageIds, personEmail, personName, personRevoked, personRole } from "./map";

// ─────────────────────────────────────────────────────────────────────────────
// La synchro des personnes — qui a accès, depuis Notion plutôt que la CLI.
//
// Même mécanique que `resolveClients` dans `sync.ts`, à une différence près et
// elle compte : une personne se reconnaît par ADRESSE, pas par une colonne
// texte collée à la main. L'index unique `cto_person_email` existait déjà pour
// le lien magique ; il sert ici de clé d'adoption gratuite pour toute personne
// créée avant ce mécanisme (`npm run cto:invite`).
//
// Deux prudences, asymétriques et volontaires :
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
): Promise<{ report: PersonsReport; warnings: string[] }> {
  const warnings: string[] = [];
  const report: PersonsReport = {
    seen: 0,
    created: 0,
    updated: 0,
    revoked: 0,
    restored: 0,
    unchanged: 0,
  };

  const pages = await queryDatabase(personsDatabaseId());

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

  const byPage = new Map(
    rows.filter((row): row is ExistingPerson & { notionPageId: string } => row.notionPageId !== null)
      .map((row) => [row.notionPageId, row]),
  );
  const byEmail = new Map(rows.map((row) => [row.email, row]));

  for (const page of pages) {
    report.seen += 1;
    await syncOne(page, byNotionPage, byPage, byEmail, options.dryRun, report, warnings);
  }

  await revokeMissing(pages, rows, options, report, warnings);

  return { report, warnings };
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
  warnings: string[],
): Promise<void> {
  const presentes = new Set(pages.map((page) => page.id));
  const disparues = rows.filter(
    (row) => row.notionPageId !== null && !presentes.has(row.notionPageId) && row.revokedAt === null,
  );
  if (disparues.length === 0) return;

  if (pages.length === 0 && disparues.length > SEUIL_RETRAIT_MASSIF && !options.force) {
    warnings.push(
      `Personnes : la base ne rend aucune ligne alors que ${disparues.length} accès sont ouverts. ` +
        "Aucune révocation — vérifier le partage de la base, puis relancer avec --forcer si c'est voulu.",
    );
    return;
  }

  for (const row of disparues) {
    warnings.push(
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
  byNotionPage: Map<string, string>,
  byPage: Map<string, ExistingPerson>,
  byEmail: Map<string, ExistingPerson>,
  dryRun: boolean,
  report: PersonsReport,
  warnings: string[],
): Promise<void> {
  const name = personName(page);
  const email = personEmail(page);
  const label = name ?? email ?? "(sans nom ni e-mail)";

  if (!name || !email) {
    warnings.push(`Personne « ${label} » sans nom ou sans e-mail : ignorée.`);
    return;
  }

  const links = clientPageIds(page);
  const clientId = links.length === 1 ? byNotionPage.get(links[0]) : undefined;
  if (!clientId) {
    warnings.push(
      links.length === 0
        ? `Personne « ${label} » sans client : elle n'a accès à rien.`
        : links.length > 1
          ? `Personne « ${label} » rattachée à plusieurs clients : à trancher, elle est ignorée.`
          : `Personne « ${label} » : son client n'est pas encore résoluble, elle attend.`,
    );
    return;
  }

  const role = personRole(page);
  const revoked = personRevoked(page);
  const existing = byPage.get(page.id) ?? byEmail.get(email);

  if (!existing) {
    if (!dryRun) {
      await db()
        .insert(ctoPersons)
        .values({ clientId, notionPageId: page.id, email, name, role, revokedAt: revoked ? new Date() : null });
    }
    warnings.push(`« ${label} » : nouvel accès créé${revoked ? " (déjà révoqué)" : ""}.`);
    report.created += 1;
    return;
  }

  if (!existing.notionPageId && dryRun) {
    warnings.push(`« ${label} » serait rattachée à son accès existant, créé via cto:invite.`);
  }
  if (existing.clientId !== clientId) {
    warnings.push(
      `« ${label} » a changé de client dans Notion : ignoré. Un transfert entre accompagnements reste un geste SQL délibéré.`,
    );
  }
  if (email !== existing.email) {
    warnings.push(`« ${label} » : adresse changée dans Notion (${existing.email} → ${email}).`);
  }

  const patch: { notionPageId?: string; name?: string; role?: string | null; email?: string; revokedAt?: Date | null } = {};
  if (!existing.notionPageId) patch.notionPageId = page.id;
  if (name !== existing.name) patch.name = name;
  if (role !== existing.role) patch.role = role;
  if (email !== existing.email) patch.email = email;

  const wasRevoked = existing.revokedAt !== null;
  if (revoked && !wasRevoked) patch.revokedAt = new Date();
  else if (!revoked && wasRevoked) patch.revokedAt = null;

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
