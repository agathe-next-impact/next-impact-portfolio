import { z } from "zod";
import type { NewIntelItem } from "@sentinelle/types";
import { fetchJson, type CallBudget } from "./http";
import type { OsvTarget } from "./targets";

// ─────────────────────────────────────────────────────────────────────────────
// OSV.dev — vulnérabilités des écosystèmes de paquets (npm, Packagist, PyPI).
//
// Gratuite, sans clé, et surtout : elle raisonne en PLAGES DE VERSIONS, ce qui
// est exactement le vocabulaire du matching. On interroge avec la version du
// client — OSV filtre alors lui-même — puis **on revérifie la plage de notre
// côté**. Deux calculs valent mieux qu'un quand une erreur envoie un rouge à un
// client qui n'est pas concerné.
//
// Deux limites de la source, écrites ici pour qu'elles ne se redécouvrent pas :
//
//  1. `querybatch` ne rend que des identifiants ; le détail (plage, sévérité,
//     titre) demande une requête par faille. D'où le cache par `externalId` :
//     une faille connue n'est jamais redemandée.
//  2. Une même faille peut porter plusieurs plages disjointes (« < 1.2.3 » et
//     « >= 2.0 < 2.1 »). Notre grammaire de plages ne gère pas la disjonction :
//     chaque segment devient donc un fait distinct, suffixé `#1`, `#2`. Les
//     segments étant disjoints par construction, un client n'en croise qu'un.
// ─────────────────────────────────────────────────────────────────────────────

export const SOURCE = "osv.dev";

const API = "https://api.osv.dev/v1";

/**
 * Détails de failles récupérés par paquet et par passe.
 *
 * Un paquet peut traîner trente vulnérabilités historiques. Les prendre toutes
 * le premier jour noierait la file de validation ; la file se vide sur
 * plusieurs jours, les plus récemment modifiées d'abord. Ce qui est laissé de
 * côté est journalisé — un plafond silencieux se lirait comme une couverture
 * complète.
 */
export const MAX_VULNS_PER_PACKAGE = 12;

const BatchResponse = z.object({
  results: z.array(
    z
      .object({
        vulns: z
          .array(z.object({ id: z.string(), modified: z.string().nullish() }).passthrough())
          .nullish(),
      })
      .passthrough(),
  ),
});

const Event = z.record(z.string(), z.string());

const Vulnerability = z
  .object({
    id: z.string(),
    summary: z.string().nullish(),
    aliases: z.array(z.string()).nullish(),
    published: z.string().nullish(),
    database_specific: z.object({ severity: z.string().nullish() }).passthrough().nullish(),
    affected: z
      .array(
        z
          .object({
            package: z
              .object({ name: z.string(), ecosystem: z.string() })
              .passthrough()
              .nullish(),
            ranges: z
              .array(z.object({ type: z.string().nullish(), events: z.array(Event) }).passthrough())
              .nullish(),
          })
          .passthrough(),
      )
      .nullish(),
  })
  .passthrough();

export type Vulnerability = z.infer<typeof Vulnerability>;

/** Sévérités GitHub → vocabulaire du modèle. Tout le reste reste inconnu. */
const SEVERITY: Record<string, string> = {
  low: "low",
  moderate: "medium",
  medium: "medium",
  high: "high",
  critical: "critical",
};

export interface AffectedSegment {
  range: string | null;
  fixedIn: string | null;
}

/**
 * Segments affectés pour un paquet donné, dans la grammaire du matching.
 *
 * Un `introduced: "0"` devient `>= 0` plutôt que `*` : c'est la même chose, mais
 * ça passe par le même analyseur que tout le reste au lieu d'un cas particulier.
 */
export function segmentsFor(
  payload: unknown,
  pkg: { name: string; ecosystem: string },
): AffectedSegment[] {
  const parsed = Vulnerability.safeParse(payload);
  if (!parsed.success) return [];

  const segments: AffectedSegment[] = [];

  for (const affected of parsed.data.affected ?? []) {
    const target = affected.package;
    if (!target) continue;
    if (target.name.toLowerCase() !== pkg.name.toLowerCase()) continue;
    if (target.ecosystem.toLowerCase() !== pkg.ecosystem.toLowerCase()) continue;

    for (const range of affected.ranges ?? []) {
      let introduced: string | null = null;

      for (const event of range.events) {
        if (event.introduced !== undefined) {
          introduced = event.introduced;
          continue;
        }

        const upper = event.fixed ?? event.last_affected ?? null;
        if (!upper) continue;

        const bounds = [
          introduced ? `>= ${introduced}` : null,
          event.fixed ? `< ${event.fixed}` : `<= ${event.last_affected}`,
        ].filter(Boolean);

        segments.push({ range: bounds.join(" "), fixedIn: event.fixed ?? null });
        introduced = null;
      }

      // Une borne basse sans borne haute : la faille n'est corrigée nulle part.
      if (introduced !== null) {
        segments.push({ range: `>= ${introduced}`, fixedIn: null });
      }
    }
  }

  return segments;
}

/** Convertit une faille OSV en faits de veille. Fonction pure. */
export function intelFromVulnerability(payload: unknown, target: OsvTarget): NewIntelItem[] {
  const parsed = Vulnerability.safeParse(payload);
  if (!parsed.success) return [];

  const vuln = parsed.data;
  const segments = segmentsFor(vuln, target.pkg);
  // Aucune plage exploitable : mieux vaut ne rien écrire qu'un fait que le
  // matching écarterait de toute façon, en laissant croire qu'il est couvert.
  if (segments.length === 0) return [];

  const severity = SEVERITY[(vuln.database_specific?.severity ?? "").toLowerCase()] ?? null;
  const cve = (vuln.aliases ?? []).find((alias) => alias.startsWith("CVE-"));
  const title = vuln.summary?.trim() || `Vulnérabilité ${cve ?? vuln.id}`;
  const published = vuln.published ? new Date(vuln.published) : null;

  return segments.map((segment, index) => ({
    kind: "vulnerability" as const,
    source: SOURCE,
    externalId: segments.length > 1 ? `${vuln.id}#${index + 1}` : vuln.id,
    targetSlug: target.slug,
    targetType: target.type,
    targetEcosystem: target.ecosystem,
    affectedRange: segment.range,
    fixedIn: segment.fixedIn,
    severity,
    title,
    raw: vuln,
    publishedAt: published && !Number.isNaN(published.getTime()) ? published : null,
  }));
}

export interface OsvReport {
  items: NewIntelItem[];
  failures: Array<{ product: string; reason: string }>;
  /** Failles laissées pour une prochaine passe, par paquet. */
  deferred: Array<{ product: string; count: number }>;
}

/**
 * Interroge OSV pour toutes les cibles du plan.
 *
 * Une seule requête groupée pour l'ensemble, puis une requête par faille
 * inconnue. `known` évite de redemander ce qu'on possède déjà — c'est ce qui
 * fait tenir le budget quand un client traîne un paquet à trente failles.
 */
export async function collectOsv(
  targets: OsvTarget[],
  budget: CallBudget,
  known: (ids: string[]) => Promise<Set<string>>,
): Promise<OsvReport> {
  const report: OsvReport = { items: [], failures: [], deferred: [] };

  // Une entrée de requête par couple (paquet, version connue chez un client).
  const queries: Array<{ target: OsvTarget; version: string }> = targets.flatMap((target) =>
    target.versions.map((version) => ({ target, version })),
  );
  if (queries.length === 0) return report;

  const batch = await fetchJson<unknown>(
    {
      url: `${API}/querybatch`,
      method: "POST",
      body: {
        queries: queries.map(({ target, version }) => ({
          package: { name: target.pkg.name, ecosystem: target.pkg.ecosystem },
          version,
        })),
      },
    },
    budget,
  );

  if (!batch.ok) {
    report.failures.push({ product: "querybatch", reason: batch.reason });
    return report;
  }

  const parsed = BatchResponse.safeParse(batch.data);
  if (!parsed.success) {
    report.failures.push({ product: "querybatch", reason: "réponse illisible" });
    return report;
  }

  for (const [index, result] of parsed.data.results.entries()) {
    const query = queries[index];
    if (!query) continue;

    const found = (result.vulns ?? [])
      // Les plus récemment modifiées d'abord : la file se vide par le haut.
      .slice()
      .sort((a, b) => (b.modified ?? "").localeCompare(a.modified ?? ""));

    const alreadyKnown = await known(found.map((vuln) => vuln.id));
    const toFetch = found.filter((vuln) => !alreadyKnown.has(vuln.id));

    const label = `${query.target.pkg.ecosystem}:${query.target.pkg.name}@${query.version}`;
    if (toFetch.length > MAX_VULNS_PER_PACKAGE) {
      report.deferred.push({
        product: label,
        count: toFetch.length - MAX_VULNS_PER_PACKAGE,
      });
    }

    for (const vuln of toFetch.slice(0, MAX_VULNS_PER_PACKAGE)) {
      const detail = await fetchJson<unknown>({ url: `${API}/vulns/${vuln.id}` }, budget);
      if (!detail.ok) {
        report.failures.push({ product: `${label} → ${vuln.id}`, reason: detail.reason });
        continue;
      }

      report.items.push(...intelFromVulnerability(detail.data, query.target));
    }
  }

  return report;
}
