import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";
import {
  appendVersion,
  appendWithdrawal,
  currentStates,
  digestOf,
  setPlacement,
  type AttachedFile,
  type AuditPayload,
  type PropositionPayload,
  type DeliverableKind,
  type DeliverableInput,
  type DeliverableState,
  type Paiement,
  type PrestationPayload,
} from "../deliverables";
import { FileTooLargeError, importFile, mimeFromName } from "../files";
import { fetchPage, NotionError, queryDatabase, publishedFilter, type NotionPage } from "./api";
import {
  clientsDatabaseId,
  databaseIdFor,
  envNameFor,
  isConfigured,
  OPTIONAL_KINDS,
  paymentsDatabaseId,
  SYNCED_KINDS,
} from "./config";
import { importAnnex, readAuditTree } from "./audit";
import { isScenarioProposition, scenarioPropositions } from "./scenarios";
import { alert, emptyFindings, merge, type Findings } from "./findings";
import { checkColumns, COLUMNS, schemaWarning } from "./schema";
import { syncLetters, type LettersReport } from "./letters";
import { provisionSentinelle, type ProvisionReport, type WatchWish } from "../sentinelle/provision";
import { veilleOfferte } from "../espace/veille-offerte";
import { syncPersons, type PersonsReport } from "./persons";
import {
  auditActionInput,
  auditAnnexFiles,
  auditPageId,
  auditValide,
  clientInPreparation,
  clientPageIds,
  clientServices,
  clientStatus,
  clientTier,
  clientVeilleOrganisations,
  clientSentinelleId,
  clientWatch,
  clientWpUmbrellaProjectId,
  clientCommercial,
  servicesOuverts,
  companyName,
  documentFiles,
  mapPage,
  paymentOf,
  prestationInvoiceFiles,
  propositionQuoteFiles,
  prestationQuoteFiles,
  propositionPageId,
  sortPayments,
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
// Quatre précautions gouvernent ce fichier, toutes contre le même risque — faire
// disparaître ou abîmer un livrable par accident :
//
//  1. **Une base se traite d'un bloc.** La liste des pages publiées doit être
//     COMPLÈTE avant de conclure qu'un livrable a disparu. Une pagination
//     interrompue ferait retirer des livrables encore publiés.
//  2. **Un retrait de masse demande confirmation.** Si l'atelier ne rend plus
//     rien alors que l'espace contient des livrables, c'est plus probablement
//     une colonne renommée qu'une dépublication générale.
//  3. **Un livrable orphelin est signalé, jamais deviné.** Une page sans client
//     résoluble n'est publiée nulle part, et son cas remonte dans le rapport.
//  4. **Une base dont le schéma a bougé n'est pas lue.** Colonne renommée ou
//     changée de type : la base n'est ni écrite ni retirée ce tour-ci
//     (`schema.ts`). Pour la base Clients, dont tout dépend, le balayage
//     s'arrête avant d'avoir rien écrit.
//
// Ce qui touche un accès ou un rattachement remonte en ALERTE, en plus de
// figurer au rapport (`findings.ts`).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Au-delà de ce nombre de retraits simultanés sur une base vidée, la synchro
 * s'arrête et demande `--forcer`. Trois : de quoi laisser passer un ménage
 * ordinaire, pas assez pour vider un espace sans s'en apercevoir.
 */
export const MASS_WITHDRAWAL_THRESHOLD = 3;

interface SweepOptions {
  force: boolean;
  dryRun: boolean;
  /**
   * Autorise un livrable à changer d'accompagnement. Faux par défaut, donc
   * pour le Cron : une relation « Client » modifiée par erreur sur une ligne
   * publiée ouvrirait à B le contenu de A au balayage de la nuit, sans que
   * personne ne l'ait vu. Le déplacement est signalé, et ne s'applique que
   * depuis un balayage lancé à la main (`/admin-cto`, `npm run cto:sync`).
   */
  reassign?: boolean;
}

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
  /** Le provisionnement Sentinelle piloté par la fiche (service « Veille technique »). */
  veilleTechnique?: ProvisionReport;
  kinds: KindReport[];
  warnings: string[];
  /** Parmi `warnings`, ce qui touche un accès ou un rattachement (`findings.ts`). */
  alerts: string[];
}

interface ClientResolution extends Findings {
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
  /** Ce que chaque fiche demande à la veille technique (Sentinelle). */
  watchWishes: WatchWish[];
  /**
   * Fin de la veille offerte, par accompagnement : null pour un client
   * récurrent (pas de fin). Les éditions datées après ne deviennent pas des
   * lettres (`letters.ts`).
   */
  finVeille: Map<string, Date | null>;
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
async function resolveClients(dryRun: boolean, force = false): Promise<ClientResolution> {
  const findings = emptyFindings();
  const { warnings } = findings;
  const byNotionPage = new Map<string, string>();
  const byOrganisation = new Map<string, string>();
  const byVeilleOrganisation = new Map<string, string>();
  const watchWishes: WatchWish[] = [];
  /** Veille personnalisée cochée, mais aucune ligne de veille lisible (un seul avertissement pour tous). */
  const sansVeille: string[] = [];
  /** Raison sociale par accompagnement, pour nommer les deux fiches d'un doublon. */
  const nomParClient = new Map<string, string>();

  // La base Clients est la charnière : « Services » renommée viderait la
  // navigation de tous les espaces, « Veille — organisation » ferait retirer
  // leurs lettres. Schéma douteux, on s'arrête AVANT d'avoir rien écrit.
  const issues = await checkColumns(clientsDatabaseId(), COLUMNS.clients);
  if (issues.length > 0) {
    throw new NotionError(
      `Clients : ${issues.join(" ; ")}. Balayage arrêté, rien n'a été écrit — ` +
        "rétablir la colonne dans Notion, ou aligner `map.ts` si le changement est voulu.",
    );
  }

  const rows = await db()
    .select({
      id: ctoClients.id,
      notionPageId: ctoClients.notionPageId,
      syncEnabled: ctoClients.syncEnabled,
      company: ctoClients.company,
      status: ctoClients.status,
      createdAt: ctoClients.createdAt,
    })
    .from(ctoClients);
  const ouvertureParClient = new Map(rows.map((row) => [row.id, row.createdAt]));
  const finVeille = new Map<string, Date | null>();
  const maintenant = new Date();

  const disabledClientIds = new Set<string>();
  const idByNotionPage = new Map<string, string>();
  const legacyById = new Map<string, { notionPageId: string | null }>();
  for (const row of rows) {
    if (!row.syncEnabled) disabledClientIds.add(row.id);
    if (row.notionPageId) idByNotionPage.set(row.notionPageId, row.id);
    legacyById.set(row.id, { notionPageId: row.notionPageId });
  }

  // Dans l'ordre de création : quand deux fiches se disputent une organisation
  // ou une ligne de veille, c'est la plus ancienne qui la garde — une fiche
  // dupliquée par mégarde ne prend rien à son original. Les fiches closes
  // passent après toutes les autres (tri stable) : un client revenu sous une
  // nouvelle fiche reprend son organisation à l'ancienne.
  const pagesClients = (
    await queryDatabase(clientsDatabaseId(), undefined, [{ timestamp: "created_time", direction: "ascending" }])
  ).sort((a, b) => Number(clientStatus(a) === "clos") - Number(clientStatus(b) === "clos"));
  const fichesLues = pagesClients.length;
  for (const page of pagesClients) {
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

    // « préparation » : la fiche se remplit, l'accompagnement n'existe pas
    // encore. Ni création, ni rattachement : ses lignes (personnes, livrables)
    // attendent le passage à « actif ». Sur une fiche déjà rattachée, la valeur
    // n'a pas d'équivalent en base et reste sans effet — dit au rapport.
    if (clientInPreparation(page)) {
      if (!id) {
        warnings.push(`« ${name} » : en préparation — aucun accompagnement créé tant que l'état n'est pas « actif ».`);
        continue;
      }
      warnings.push(
        `« ${name} » : « préparation » ignorée, l'accompagnement existe déjà. Pour le geler, utiliser « suspendu ».`,
      );
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
    nomParClient.set(id, name);
    if (disabledClientIds.has(id)) {
      warnings.push(`« ${name} » : synchro suspendue depuis l'admin — ses lignes ne bougent pas ce balayage.`);
    }

    await alignerFiche(page, id, name, warnings, dryRun);
    await adopterFicheOrganisation(page, id, name, findings, dryRun, byOrganisation, nomParClient);

    const watch = clientWatch(page);
    // La veille est offerte à l'ouverture de l'espace (décision du
    // 2026-09-27) : un mois pour un client ponctuel, sans fin pour un client
    // récurrent. L'ouverture est la création de l'accompagnement ; une fiche
    // créée à ce balayage ouvre aujourd'hui.
    const services = clientServices(page).codes;
    const veille = veilleOfferte(services, ouvertureParClient.get(id) ?? maintenant, maintenant);
    finVeille.set(id, veille.jusquau);
    if (!veille.recurrente && !veille.active && clientVeilleOrganisations(page).length > 0 && veille.jusquau) {
      warnings.push(
        `« ${name} » : veille offerte terminée le ${veille.jusquau.toLocaleDateString("fr-FR")}. ` +
          "Arrêter la production Signaux Faibles dans le pipeline (fiche organisation), SANS délier la « Veille — organisation » : " +
          "les lettres déjà reçues resteraient sinon retirées de l'espace.",
      );
    }

    watchWishes.push({
      clientId: id,
      company: name,
      wanted: (services.includes("veille-technique") || veille.active) && clientStatus(page) !== "clos",
      offerte: !services.includes("veille-technique"),
      site: watch.site,
      contact: watch.contact,
    });

    const veilles = clientVeilleOrganisations(page);
    // Veille personnalisée cochée mais aucune ligne de veille lisible : ses
    // éditions Signaux Faibles ne peuvent pas arriver. Le cas typique est la
    // page « Veilles clients » non partagée avec l'intégration — l'API rend
    // alors la relation VIDE, sans erreur, et le silence passait pour « rien
    // à publier ».
    if (veilles.length === 0 && clientServices(page).codes.includes("veille-personnalisee")) sansVeille.push(name);
    for (const veille of veilles) {
      const deja = byVeilleOrganisation.get(veille);
      if (deja && deja !== id) {
        alert(
          findings,
          `« ${name} » désigne une ligne de veille déjà reliée à un autre accompagnement : ignorée pour lui.`,
        );
        continue;
      }
      byVeilleOrganisation.set(veille, id);
    }
  }

  if (sansVeille.length > 0) {
    warnings.push(
      `Veille personnalisée cochée mais aucune « Veille — organisation » lisible pour : ${sansVeille.join(", ")}. ` +
        "Relation vide, ou page « Veilles clients » non partagée avec l'intégration : leurs lettres Signaux Faibles n'arrivent pas.",
    );
  }

  // Un accompagnement dont la fiche a disparu de la base Clients (supprimée,
  // mise à la corbeille) est clos : l'accès se ferme, ses livrables quittent
  // l'espace au balayage (plus aucune ligne ne s'y rattache). Restaurer la fiche
  // depuis la corbeille et repasser « État » à « actif » le rouvre.
  //
  // Garde-fou : une base Clients qui ne rend plus RIEN ressemble à une panne
  // (partage retiré, identifiant faux) ; on ne ferme rien en masse sans --forcer.
  const fiches = new Set(pagesClients.map((fiche) => fiche.id));
  const orphelins = rows.filter((row) => row.notionPageId && !fiches.has(row.notionPageId) && row.status !== "clos");
  if (orphelins.length > 0 && fichesLues === 0 && orphelins.length > MASS_WITHDRAWAL_THRESHOLD && !force) {
    alert(
      findings,
      `Clients : la base ne rend aucune fiche alors que ${orphelins.length} accompagnements sont ouverts. ` +
        "Aucune fermeture — vérifier le partage de la base, puis relancer avec --forcer si c'est voulu.",
    );
  } else {
    for (const row of orphelins) {
      alert(
        findings,
        dryRun
          ? `« ${row.company} » : fiche disparue de la base Clients — serait clos, accès fermé.`
          : `« ${row.company} » : fiche disparue de la base Clients — accompagnement clos, accès fermé.`,
      );
      if (dryRun) continue;
      await db()
        .update(ctoClients)
        .set({ status: "clos", statusChangedAt: new Date() })
        .where(eq(ctoClients.id, row.id));
    }
  }

  return { byNotionPage, byOrganisation, byVeilleOrganisation, disabledClientIds, watchWishes, finVeille, ...findings };
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
      contractStart: ctoClients.contractStart,
      suiviFormule: ctoClients.suiviFormule,
      suiviInclusJusquau: ctoClients.suiviInclusJusquau,
      suggestionsCoupees: ctoClients.suggestionsCoupees,
      servicesOuverts: ctoClients.servicesOuverts,
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
    contractStart?: Date | null;
    suiviFormule?: string | null;
    suiviInclusJusquau?: Date | null;
    suggestionsCoupees?: boolean;
    servicesOuverts?: Record<string, string>;
  } = {};

  // Ce que « Votre accompagnement » et « Prochaine étape » lisent. Une colonne
  // vidée dans Notion vide la valeur : ces champs n'ont pas d'autre pilote.
  const commercial = clientCommercial(page);
  const memeJour = (a: Date | null, b: Date | null) => (a?.getTime() ?? null) === (b?.getTime() ?? null);
  if (!memeJour(commercial.contractStart, actuel.contractStart)) patch.contractStart = commercial.contractStart;
  if (commercial.suiviFormule !== actuel.suiviFormule) patch.suiviFormule = commercial.suiviFormule;
  if (!memeJour(commercial.suiviInclusJusquau, actuel.suiviInclusJusquau)) {
    patch.suiviInclusJusquau = commercial.suiviInclusJusquau;
  }
  if (commercial.suggestionsCoupees !== actuel.suggestionsCoupees) {
    patch.suggestionsCoupees = commercial.suggestionsCoupees;
  }
  const ouverts = servicesOuverts(services.codes, actuel.servicesOuverts, new Date());
  if (JSON.stringify(ouverts) !== JSON.stringify(actuel.servicesOuverts)) patch.servicesOuverts = ouverts;
  if (status && status !== actuel.status) patch.status = status;
  if (tier && tier !== actuel.tier) patch.tier = tier;
  if (wpUmbrellaProjectId && wpUmbrellaProjectId !== actuel.wpUmbrellaProjectId) {
    patch.wpUmbrellaProjectId = wpUmbrellaProjectId;
  }
  if (!sameServices(servicesVoulus, actuel.services)) patch.services = servicesVoulus;
  // Un identifiant mal formé ne délie pas un accompagnement déjà relié : on
  // garde l'ancien plutôt que de couper la veille sur une faute de frappe.
  // Colonne vide : on garde l'identifiant en base, que le provisionnement a pu
  // poser lui-même. Seule une valeur saisie (relier un abonné existant) le remplace.
  if (sentinelle.id && sentinelle.id !== actuel.sentinelleClientId) {
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
      "contractStart" in patch ? "début du contrat" : null,
      "suiviFormule" in patch ? `formule suivi → ${patch.suiviFormule ?? "aucune"}` : null,
      "suiviInclusJusquau" in patch ? "fin du suivi inclus" : null,
      "suggestionsCoupees" in patch ? `suggestions → ${patch.suggestionsCoupees ? "coupées" : "actives"}` : null,
    ].filter(Boolean);
    // Les dates d'ouverture des services suivent la colonne Services, déjà
    // annoncée : les taire évite une ligne de bruit par balayage.
    if (changements.length > 0) warnings.push(`« ${name} » serait mise à jour : ${changements.join(", ")}.`);
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
 *
 * Une organisation ne se relie qu'à UN accompagnement : ses lettres
 * personnalisées n'ont qu'un espace où paraître. Deux fiches qui la désignent
 * — le plus souvent une fiche dupliquée — et la seconde est ignorée pour elle,
 * au lieu de détourner sans bruit les lettres de la première.
 */
async function adopterFicheOrganisation(
  fiche: NotionPage,
  clientId: string,
  nomAffiche: string,
  findings: Findings,
  dryRun: boolean,
  byOrganisation: Map<string, string>,
  nomParClient: Map<string, string>,
): Promise<void> {
  const { warnings } = findings;
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
    alert(
      findings,
      `« ${nomAffiche} » est rattachée à ${liens.length} fiches organisation : à trancher, aucune n'est retenue.`,
    );
    return;
  }

  const deja = byOrganisation.get(liens[0]);
  if (deja && deja !== clientId) {
    alert(
      findings,
      `« ${nomAffiche} » désigne la fiche organisation de « ${nomParClient.get(deja) ?? deja} » : ignorée pour elle. ` +
        "Fiche dupliquée ? Une organisation ne se relie qu'à un accompagnement.",
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

interface Resolved extends Findings {
  inputs: DeliverableInput[];
}

function resolvePages(
  kind: DeliverableKind,
  pages: NotionPage[],
  byNotionPage: Map<string, string>,
  disabledClientIds: Set<string>,
): Resolved {
  const findings = emptyFindings();
  const { warnings } = findings;
  const inputs: DeliverableInput[] = [];

  for (const page of pages) {
    const links = clientPageIds(page);
    const input = links.length === 1 ? tryMap(kind, page, byNotionPage.get(links[0])) : null;

    if (!input) {
      const title = mapPage(kind, page, "").title;
      // Une fiche non résoluble est l'ordinaire d'un client en préparation ;
      // une relation vide ou double est une erreur de saisie.
      if (links.length === 1) {
        warnings.push(`${kind} « ${title} » pointe une fiche client non résoluble : elle est ignorée.`);
      } else {
        alert(
          findings,
          links.length === 0
            ? `${kind} « ${title} » est publiée sans client : elle n'apparaît nulle part.`
            : `${kind} « ${title} » est rattachée à ${links.length} clients : à trancher, elle est ignorée.`,
        );
      }
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

  return { inputs, ...findings };
}

/**
 * Compare le schéma d'une base aux colonnes lues, et inscrit l'écart au
 * rapport. Rend vrai si la base doit être laissée de côté ce tour-ci.
 */
async function schemaBroken(
  label: string,
  databaseId: string,
  base: keyof typeof COLUMNS,
  findings: Findings,
): Promise<boolean> {
  const broken = schemaWarning(label, await checkColumns(databaseId, COLUMNS[base]));
  if (broken) alert(findings, broken);
  return broken !== null;
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
  options: SweepOptions,
  disabledClientIds: Set<string>,
  /**
   * Lignes venues d'ailleurs que de la base du type : les actions d'audit
   * validées, pour la roadmap. Elles passent DANS le même balayage, sinon le
   * retrait des lignes absentes de la base les effacerait à chaque passage.
   */
  extra: { inputs: DeliverableInput[]; complete: boolean } = { inputs: [], complete: true },
): Promise<{ report: KindReport } & Findings> {
  const findings = emptyFindings();
  const { warnings } = findings;

  const databaseId = databaseIdFor(kind);
  if (await schemaBroken(kind, databaseId, kind, findings)) {
    return { report: emptyReport(kind, 0), ...findings };
  }

  const pages = await queryDatabase(databaseId, publishedFilter(PROPS.published));
  const resolved = resolvePages(kind, pages, byNotionPage, disabledClientIds);
  merge(findings, resolved);
  const { inputs } = resolved;
  if (kind === "document") await attachFiles(inputs, pages, warnings, options.dryRun);
  if (kind === "prestation") {
    await attachPrestationFiles(inputs, pages, warnings, options.dryRun);
    if (!(await attachPayments(inputs, findings))) {
      // Échéancier illisible : écrire les prestations sans lui changerait leur
      // empreinte et daterait une version « sans paiement » qui n'a jamais existé.
      return { report: emptyReport(kind, inputs.length), ...findings };
    }
    indexPrestationFiles(inputs);
  }
  inputs.push(...extra.inputs);

  if (!extra.complete) {
    warnings.push(
      `${kind} : la lecture des audits est incomplète ce tour-ci — aucun retrait effectué, ` +
        "une action absente n'est peut-être qu'une action pas vue.",
    );
  }
  const report = await applyInputs(kind, inputs, findings, disabledClientIds, {
    ...options,
    withdraw: extra.complete,
  });
  return { report, ...findings };
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
  findings: Findings,
  disabledClientIds: Set<string>,
  options: SweepOptions & {
    keep?: Set<string>;
    withdraw?: boolean;
    /** Restreint le retrait aux livrables que ce filtre accepte ; les autres restent tels quels. */
    withdrawable?: (notionPageId: string) => boolean;
  },
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
    if (state.clientId !== input.clientId) {
      if (!options.reassign) {
        alert(
          findings,
          `${kind} « ${input.title} » a changé de client dans Notion : laissé chez son accompagnement actuel. ` +
            "Pour le déplacer, relancer la synchro depuis /admin-cto (ou npm run cto:sync).",
        );
        report.unchanged += 1;
        continue;
      }
      alert(
        findings,
        `${kind} « ${input.title} » ${dryRun ? "passerait" : "passe"} à un autre accompagnement ` +
          "(relation « Client » modifiée dans Notion).",
      );
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
    if (options.withdrawable && !options.withdrawable(state.notionPageId)) continue;
    if (!state.withdrawn && !stillPublished.has(state.notionPageId)) toWithdraw.push(state);
  }

  // La précaution 2, en une condition : une base qui ne rend plus RIEN alors que
  // l'espace en contient plusieurs ressemble davantage à une colonne renommée
  // qu'à une dépublication générale. Retirer une ou deux lignes reste normal.
  if (inputs.length === 0 && toWithdraw.length > MASS_WITHDRAWAL_THRESHOLD && !force) {
    alert(
      findings,
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

interface AuditsResult extends Findings {
  report: KindReport | null;
  /** Les actions d'audit engagées, à verser dans la roadmap. */
  roadmap: DeliverableInput[];
  /** Les scénarios des audits validés, à verser dans les propositions. */
  propositions: DeliverableInput[];
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
  options: SweepOptions,
  disabledClientIds: Set<string>,
): Promise<AuditsResult> {
  const { dryRun } = options;
  if (!isConfigured("audit")) {
    return {
      report: null,
      warnings: [`Base « audit » ignorée : ${envNameFor("audit")} n'est pas posée.`],
      alerts: [],
      roadmap: [],
      propositions: [],
      complete: true,
    };
  }

  const findings = emptyFindings();
  const { warnings } = findings;

  const databaseId = databaseIdFor("audit");
  if (await schemaBroken("audit", databaseId, "audit", findings)) {
    // `complete: false` : les actions d'audit déjà versées dans la roadmap
    // n'ont pas été relues, la roadmap ne doit donc pas les retirer.
    return { report: null, ...findings, roadmap: [], propositions: [], complete: false };
  }

  const pages = await queryDatabase(databaseId, publishedFilter(PROPS.published));
  const resolved = resolvePages("audit", pages, byNotionPage, disabledClientIds);
  merge(findings, resolved);
  const pageById = new Map(pages.map((page) => [page.id, page]));
  const keep = new Set<string>();
  const inputs: DeliverableInput[] = [];
  const roadmap: DeliverableInput[] = [];
  const propositions: DeliverableInput[] = [];
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

    if (auditValide(page)) {
      const scenarios = scenarioPropositions({
        notionPageId: input.notionPageId,
        clientId: input.clientId,
        title: input.title,
        occurredAt: input.occurredAt,
        synthese: tree.synthese,
        sections: tree.sections,
      });
      if (scenarios.length === 0) {
        warnings.push(
          `audit « ${input.title} » validé, mais aucun tableau de scénarios reconnu ` +
            "(première colonne « Scénario ») : aucune proposition publiée.",
        );
      }
      propositions.push(...scenarios);
    }
  }

  const report = await applyInputs("audit", inputs, findings, disabledClientIds, { ...options, keep });
  return { report, ...findings, roadmap, propositions, complete };
}

/**
 * Balaie la base Propositions : pour chaque ligne publiée, lit toute la page de
 * proposition qu'elle désigne (bases inline comprises) et en fait un livrable
 * `proposition`.
 *
 * Même doctrine que les audits : une proposition illisible ce tour-ci n'est ni
 * publiée ni retirée, sa version en ligne reste telle quelle.
 *
 * `extra` porte les scénarios des audits validés (`scenarios.ts`). Ils passent
 * DANS le même balayage, sinon le retrait des lignes absentes de la base les
 * effacerait à chaque passage. Base Propositions non posée : ils sont publiés
 * seuls. Lecture des audits incomplète : aucun d'eux n'est retiré.
 */
async function syncPropositions(
  byNotionPage: Map<string, string>,
  options: SweepOptions,
  disabledClientIds: Set<string>,
  extra: { inputs: DeliverableInput[]; complete: boolean } = { inputs: [], complete: true },
): Promise<{ report: KindReport | null } & Findings> {
  const { dryRun } = options;
  // Seuls les scénarios d'un audit relu en entier peuvent être retirés.
  const scenariosRetirables = (id: string) => extra.complete && isScenarioProposition(id);

  if (!isConfigured("proposition")) {
    const findings = emptyFindings();
    findings.warnings.push(`Base « proposition » ignorée : ${envNameFor("proposition")} n'est pas posée.`);
    const report = await applyInputs("proposition", extra.inputs, findings, disabledClientIds, {
      ...options,
      withdrawable: scenariosRetirables,
    });
    return { report, ...findings };
  }

  const findings = emptyFindings();
  const { warnings } = findings;

  const databaseId = databaseIdFor("proposition");
  if (await schemaBroken("proposition", databaseId, "proposition", findings)) {
    return { report: null, ...findings };
  }

  const pages = await queryDatabase(databaseId, publishedFilter(PROPS.published));
  const resolved = resolvePages("proposition", pages, byNotionPage, disabledClientIds);
  merge(findings, resolved);
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

    const devis: AttachedFile[] = [];
    for (const fichier of page ? propositionQuoteFiles(page) : []) {
      const ref = await importPdf(fichier, `proposition « ${input.title} » (devis)`, warnings, dryRun);
      if (ref) devis.push(ref);
    }
    // Pas de clé sans devis : l'empreinte des propositions d'avant ne bouge pas.
    if (devis.length > 0) payload.devisFichiers = devis;
    payload.fichiers = [...new Set([...tree.fichiers, ...devis.map((ref) => ref.id)])];
    inputs.push(input);
  }
  inputs.push(...extra.inputs);

  const report = await applyInputs("proposition", inputs, findings, disabledClientIds, {
    ...options,
    keep,
    withdrawable: (id) => !isScenarioProposition(id) || scenariosRetirables(id),
  });
  return { report, ...findings };
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
function emptyReport(kind: DeliverableKind, published: number): KindReport {
  return { kind, published, featured: 0, created: 0, updated: 0, restored: 0, unchanged: 0, withdrawn: 0 };
}

/**
 * Greffe l'échéancier (base « Paiements ») sur les prestations publiées.
 *
 * La base se lit en entier, sans filtre de publication : un règlement n'est
 * visible que dans l'administration, sa prestation décide seule de ce qui
 * paraît. Rend `false` si la base est posée mais illisible, ou si son schéma a
 * bougé — la synchro des prestations saute alors ce tour-ci plutôt que
 * d'effacer les échéanciers.
 */
async function attachPayments(inputs: DeliverableInput[], findings: Findings): Promise<boolean> {
  const databaseId = paymentsDatabaseId();
  if (!databaseId) return true;

  let pages: NotionPage[];
  try {
    if (await schemaBroken("Paiements", databaseId, "paiement", findings)) return false;
    pages = await queryDatabase(databaseId);
  } catch (error) {
    findings.warnings.push(
      `Paiements illisibles (${error instanceof Error ? error.message : "erreur"}) : ` +
        "prestations ni écrites ni retirées ce tour-ci.",
    );
    return false;
  }

  const byPrestation = new Map<string, Paiement[]>();
  for (const page of pages) {
    const payment = paymentOf(page);
    if (!payment) {
      alert(
        findings,
        `Paiement « ${prop.text(page, PROPS.paiement.title) ?? UNTITLED} » : rattaché à aucune ` +
          "ou à plusieurs prestations, ignoré.",
      );
      continue;
    }
    const list = byPrestation.get(payment.prestationId) ?? [];
    list.push(payment.paiement);
    byPrestation.set(payment.prestationId, list);
  }

  for (const input of inputs) {
    const paiements = byPrestation.get(input.notionPageId);
    // Pas de clé du tout sans règlement : l'empreinte des prestations sans
    // échéancier reste celle d'avant son arrivée, aucune version pour rien.
    if (paiements?.length) (input.payload as PrestationPayload).paiements = sortPayments(paiements);
  }
  return true;
}

/**
 * Rapatrie une pièce PDF.
 *
 * Seul le PDF passe — un devis ou une facture se lit tel qu'il a été remis,
 * pas dans un tableur modifiable. `null` si la pièce est écartée ; la ligne
 * est alors publiée sans elle, et la synchro le dit.
 */
async function importPdf(
  fichier: prop.NotionFile,
  label: string,
  warnings: string[],
  dryRun: boolean,
): Promise<AttachedFile | null> {
  if (!estPdf(fichier)) {
    warnings.push(`${label} : « ${fichier.name} » n'est pas un PDF, pièce ignorée.`);
    return null;
  }
  try {
    return await importFile(fichier.url, fichier.name, { dryRun, mime: "application/pdf" });
  } catch (error) {
    warnings.push(
      error instanceof FileTooLargeError
        ? `${label} : ${error.message}, publié sans la pièce.`
        : `${label} : pièce impossible à rapatrier (${error instanceof Error ? error.message : "erreur"}), publié sans elle.`,
    );
    return null;
  }
}

/** Un PDF d'après son nom, ou le chemin de son lien (un lien externe garde souvent son adresse pour nom). */
function estPdf(fichier: prop.NotionFile): boolean {
  if (mimeFromName(fichier.name) === "application/pdf") return true;
  try {
    return mimeFromName(new URL(fichier.url).pathname) === "application/pdf";
  } catch {
    return false;
  }
}

/**
 * Les pièces de chaque prestation : ses devis (colonne « Devis (PDF) ») et ses
 * factures (colonne « Factures »), toutes, dans l'ordre de l'atelier.
 */
async function attachPrestationFiles(
  inputs: DeliverableInput[],
  pages: NotionPage[],
  warnings: string[],
  dryRun: boolean,
): Promise<void> {
  const pageById = new Map(pages.map((page) => [page.id, page]));
  for (const input of inputs) {
    const page = pageById.get(input.notionPageId);
    if (!page) continue;
    const payload = input.payload as PrestationPayload;

    const importer = async (fichiers: prop.NotionFile[], nature: string): Promise<AttachedFile[]> => {
      const refs: AttachedFile[] = [];
      for (const fichier of fichiers) {
        const ref = await importPdf(fichier, `prestation « ${input.title} » (${nature})`, warnings, dryRun);
        if (ref) refs.push(ref);
      }
      return refs;
    };

    // Pas de clé sans pièce : l'empreinte des prestations d'avant ne bouge pas.
    const devis = await importer(prestationQuoteFiles(page), "devis");
    if (devis.length > 0) payload.devisFichiers = devis;
    const factures = await importer(prestationInvoiceFiles(page), "facture");
    if (factures.length > 0) payload.factures = factures;
  }
}

/**
 * Range les identifiants du devis et des factures dans `payload.fichiers` :
 * c'est là que `fileBelongsTo` cherche à qui appartient une pièce.
 */
function indexPrestationFiles(inputs: DeliverableInput[]): void {
  for (const input of inputs) {
    const payload = input.payload as PrestationPayload;
    const ids = [
      ...(payload.devisFichiers ?? []).map((devis) => devis.id),
      ...(payload.factures ?? []).map((facture) => facture.id),
    ].filter((id): id is string => Boolean(id));
    if (ids.length > 0) payload.fichiers = [...new Set(ids)];
  }
}

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
  options: { force?: boolean; dryRun?: boolean; reassign?: boolean } = {},
): Promise<SyncReport> {
  const dryRun = options.dryRun === true;
  const clients = await resolveClients(dryRun, options.force === true);

  const report: SyncReport = {
    dryRun,
    clientsMapped: clients.byNotionPage.size,
    persons: { seen: 0, created: 0, updated: 0, revoked: 0, restored: 0, unchanged: 0 },
    letters: { published: 0, created: 0, updated: 0, unchanged: 0, withdrawn: 0, editions: null },
    kinds: [],
    warnings: [...clients.warnings],
    alerts: [...clients.alerts],
  };

  // Avant les livrables : qui a accès ne dépend d'aucun d'eux, et une personne
  // nouvellement révoquée ne doit pas rester une ligne de plus dans le rapport
  // des livrables pendant qu'on cherche pourquoi son accès est encore ouvert.
  const persons = await syncPersons(clients.byNotionPage, { dryRun, force: options.force === true });
  report.persons = persons.report;
  merge(report, persons);

  // Les audits avant les livrables : leurs actions validées alimentent la
  // roadmap, qui doit les recevoir dans son propre balayage. Un échec ici ne
  // prive le client de rien d'autre — la roadmap suspend seulement ses retraits.
  let audits: AuditsResult;
  try {
    audits = await syncAudits(
      clients.byNotionPage,
      { force: options.force === true, dryRun, reassign: options.reassign === true },
      clients.disabledClientIds,
    );
  } catch (error) {
    console.error("[cto] balayage des audits impossible", error);
    audits = {
      report: null,
      warnings: [
        `Audits illisibles (${error instanceof Error ? error.message : "erreur"}) : rien publié ni retiré ce tour-ci.`,
      ],
      alerts: [],
      roadmap: [],
      propositions: [],
      complete: false,
    };
  }
  merge(report, audits);

  for (const kind of SYNCED_KINDS) {
    const result = await syncKind(
      kind,
      clients.byNotionPage,
      { force: options.force === true, dryRun, reassign: options.reassign === true },
      clients.disabledClientIds,
      kind === "roadmap" ? { inputs: audits.roadmap, complete: audits.complete } : undefined,
    );
    report.kinds.push(result.report);
    merge(report, result);
  }

  for (const kind of OPTIONAL_KINDS) {
    if (!isConfigured(kind)) {
      report.warnings.push(`Base « ${kind} » ignorée : ${envNameFor(kind)} n'est pas posée.`);
      continue;
    }
    const result = await syncKind(
      kind,
      clients.byNotionPage,
      { force: options.force === true, dryRun, reassign: options.reassign === true },
      clients.disabledClientIds,
    );
    report.kinds.push(result.report);
    merge(report, result);
  }

  if (audits.report) report.kinds.push(audits.report);

  try {
    const propositions = await syncPropositions(
      clients.byNotionPage,
      { force: options.force === true, dryRun, reassign: options.reassign === true },
      clients.disabledClientIds,
      { inputs: audits.propositions, complete: audits.complete },
    );
    if (propositions.report) report.kinds.push(propositions.report);
    merge(report, propositions);
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
    clients.finVeille,
  );
  report.letters = lettres.report;
  merge(report, lettres);

  // La veille technique en tout dernier : elle dépend des personnes (le nom du
  // contact) et appelle un autre produit, dont une panne ne doit rien coûter au
  // reste du balayage.
  try {
    const veille = await provisionSentinelle(clients.watchWishes, { dryRun });
    report.veilleTechnique = veille.report;
    merge(report, veille);
  } catch (error) {
    console.error("[cto] provisionnement Sentinelle impossible", error);
    report.warnings.push(
      `Veille technique non provisionnée (${error instanceof Error ? error.message : "erreur"}) : nouvel essai au prochain balayage.`,
    );
  }

  return report;
}
