import { createHash } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoPersons } from "../db/schema";
import { sentinelleExportConfig } from "./api";

// ─────────────────────────────────────────────────────────────────────────────
// Sentinelle pilotée depuis Notion.
//
// La fiche Clients de l'atelier commande la veille technique comme elle
// commande le reste de l'accompagnement :
//
//   Services ∋ « Veille technique »  → la surveillance est voulue ;
//   Site surveillé                   → le site à analyser ;
//   Contact veille                   → l'adresse qui reçoit alertes et lettres ;
//   État = clos                      → la surveillance s'arrête ;
//   ID Sentinelle (facultatif)       → relier à la main un abonné existant.
//
// À chaque balayage, la synchro traduit la fiche en une demande et l'envoie à
// Sentinelle (`POST /api/sentinelle/provision`), qui crée, aligne ou désactive
// sa fiche. L'identifiant renvoyé est gardé en base : plus rien à recopier.
// Notion n'est jamais réécrit, comme pour tout l'atelier.
//
// Une demande n'est envoyée que si elle a changé depuis la dernière acceptée
// (`sentinelle_sync_digest`) : un balayage quotidien ne rappelle pas Sentinelle
// pour rien, et ne relance jamais une analyse de site sans raison.
// ─────────────────────────────────────────────────────────────────────────────

export interface WatchWish {
  clientId: string;
  company: string;
  /** Le service « Veille technique » est coché et l'accompagnement n'est pas clos. */
  wanted: boolean;
  site: string | null;
  contact: string | null;
}

export interface WatchState {
  sentinelleClientId: string | null;
  digest: string | null;
  /** Nom de la personne dont l'adresse est le contact, s'il est connu de l'espace. */
  contactName: string | null;
}

export type ProvisionBody =
  | { id: string; active: false }
  | {
      id?: string;
      active: true;
      email: string;
      name: string;
      company: string;
      siteUrl: string;
    };

export type ProvisionDecision =
  | { kind: "skip" }
  | { kind: "incomplete"; missing: string[] }
  | { kind: "send"; body: ProvisionBody; digest: string };

export function digestOf(body: ProvisionBody): string {
  return createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

/** Pur : ce que la fiche demande à Sentinelle, ou rien. */
export function decideProvision(wish: WatchWish, state: WatchState): ProvisionDecision {
  let body: ProvisionBody;

  if (!wish.wanted) {
    if (!state.sentinelleClientId) return { kind: "skip" };
    body = { id: state.sentinelleClientId, active: false };
  } else {
    const missing = [!wish.site ? "« Site surveillé »" : null, !wish.contact ? "« Contact veille »" : null].filter(
      (value): value is string => value !== null,
    );
    if (missing.length > 0) return { kind: "incomplete", missing };
    body = {
      ...(state.sentinelleClientId ? { id: state.sentinelleClientId } : {}),
      active: true,
      email: wish.contact as string,
      name: state.contactName ?? wish.company,
      company: wish.company,
      siteUrl: wish.site as string,
    };
  }

  const digest = digestOf(body);
  return digest === state.digest ? { kind: "skip" } : { kind: "send", body, digest };
}

export interface ProvisionReport {
  sent: number;
  created: number;
  deactivated: number;
  unchanged: number;
  failed: number;
}

interface ProvisionResponse {
  id: string;
  outcome: "created" | "updated" | "adopted" | "deactivated" | "unchanged";
  scanning: boolean;
}

async function callSentinelle(body: ProvisionBody): Promise<ProvisionResponse> {
  const config = sentinelleExportConfig();
  if (!config) throw new Error("SENTINELLE_EXPORT_URL ou SENTINELLE_EXPORT_SECRET absente");
  const response = await fetch(`${config.url}/api/sentinelle/provision`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.secret}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const json = (await response.json().catch(() => ({}))) as Partial<ProvisionResponse> & { error?: string };
  if (!response.ok || typeof json.id !== "string") {
    throw new Error(json.error ?? `HTTP ${response.status}`);
  }
  return json as ProvisionResponse;
}

async function stateOf(clientId: string, contact: string | null): Promise<WatchState> {
  const [row] = await db()
    .select({
      sentinelleClientId: ctoClients.sentinelleClientId,
      digest: ctoClients.sentinelleSyncDigest,
    })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);

  let contactName: string | null = null;
  if (contact) {
    const [person] = await db()
      .select({ name: ctoPersons.name })
      .from(ctoPersons)
      .where(and(eq(ctoPersons.clientId, clientId), eq(ctoPersons.email, contact), isNull(ctoPersons.revokedAt)))
      .limit(1);
    contactName = person?.name ?? null;
  }

  return { sentinelleClientId: row?.sentinelleClientId ?? null, digest: row?.digest ?? null, contactName };
}

/**
 * Aligne Sentinelle sur les fiches Notion. Appelée en fin de synchro, une fois
 * les personnes à jour (le nom du contact en vient).
 */
export async function provisionSentinelle(
  wishes: WatchWish[],
  options: { dryRun: boolean },
): Promise<{ report: ProvisionReport; warnings: string[] }> {
  const report: ProvisionReport = { sent: 0, created: 0, deactivated: 0, unchanged: 0, failed: 0 };
  const warnings: string[] = [];

  if (!sentinelleExportConfig()) {
    if (wishes.some((wish) => wish.wanted)) {
      warnings.push(
        "Veille technique cochée sur une fiche, mais SENTINELLE_EXPORT_URL ou SENTINELLE_EXPORT_SECRET n'est pas posée : rien n'a été provisionné.",
      );
    }
    return { report, warnings };
  }

  for (const wish of wishes) {
    const state = await stateOf(wish.clientId, wish.contact);
    const decision = decideProvision(wish, state);

    if (decision.kind === "skip") {
      if (wish.wanted || state.sentinelleClientId) report.unchanged += 1;
      continue;
    }
    if (decision.kind === "incomplete") {
      warnings.push(
        `« ${wish.company} » : service « Veille technique » coché, mais ${decision.missing.join(" et ")} manque — Sentinelle non provisionnée.`,
      );
      continue;
    }

    if (options.dryRun) {
      warnings.push(
        `« ${wish.company} » : Sentinelle serait ${decision.body.active ? (decision.body.id ? "alignée" : "créée") : "désactivée"}.`,
      );
      continue;
    }

    try {
      const result = await callSentinelle(decision.body);
      report.sent += 1;
      if (result.outcome === "created" || result.outcome === "adopted") report.created += 1;
      if (result.outcome === "deactivated") report.deactivated += 1;
      await db()
        .update(ctoClients)
        .set({ sentinelleClientId: result.id, sentinelleSyncDigest: decision.digest })
        .where(eq(ctoClients.id, wish.clientId));
      if (result.outcome === "created" || result.outcome === "adopted") {
        warnings.push(
          `« ${wish.company} » : client Sentinelle ${result.outcome === "created" ? "créé" : "relié"} (${result.id})${result.scanning ? ", analyse du site lancée" : ""}.`,
        );
      }
    } catch (error) {
      report.failed += 1;
      warnings.push(
        `« ${wish.company} » : provisionnement Sentinelle impossible (${error instanceof Error ? error.message : "erreur"}). Nouvel essai au prochain balayage.`,
      );
    }
  }

  return { report, warnings };
}
