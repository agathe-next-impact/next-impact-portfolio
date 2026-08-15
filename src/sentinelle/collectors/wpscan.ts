import { z } from "zod";
import type { NewIntelItem, StackItemType } from "@sentinelle/types";
import { fetchJson, type CallBudget } from "./http";
import type { WordPressTarget } from "./targets";

// ─────────────────────────────────────────────────────────────────────────────
// WPScan — vulnérabilités du cœur, des extensions et des thèmes WordPress.
//
// **Le repli Wordfence prévu par le pack n'existe plus.** Vérifié le
// 2026-08-15 : l'API v2 (`/api/intelligence/v2/vulnerabilities/*`) répond 410
// « removed », et la v3 exige une authentification. Il n'y a donc plus, à ce
// jour, de source gratuite et anonyme de vulnérabilités WordPress.
//
// Conséquence assumée, et c'est la règle du routeur : **sans clé, ce collecteur
// ne produit rien et le journalise**. Il ne lève pas, ne dégrade pas la
// collecte des autres sources, et surtout ne laisse pas croire à une couverture
// qui n'existe pas. Ce qui reste couvert sans clé pour un site WordPress :
// les fins de support de branche (endoflife.date) et le retard de version des
// extensions (api.wordpress.org, voir releases.ts).
//
// Avec clé, WPScan facture à l'appel : le collecteur n'interroge donc que les
// composants réellement surveillés, une requête chacun, budget partagé.
// ─────────────────────────────────────────────────────────────────────────────

export const SOURCE = "wpscan";

const API = "https://wpscan.com/api/v3";

const Vulnerability = z
  .object({
    id: z.string(),
    title: z.string(),
    fixed_in: z.string().nullish(),
    published_date: z.string().nullish(),
    references: z.object({ cve: z.array(z.string()).nullish() }).passthrough().nullish(),
    cvss: z.object({ severity: z.string().nullish() }).passthrough().nullish(),
  })
  .passthrough();

/** La réponse est indexée par slug (ou par version pour le cœur). */
const Response = z.record(
  z.string(),
  z
    .object({
      latest_version: z.string().nullish(),
      vulnerabilities: z.array(Vulnerability).nullish(),
    })
    .passthrough(),
);

const TYPE_BY_ROLE: Record<WordPressTarget["role"], StackItemType> = {
  core: "cms",
  plugin: "cms_plugin",
  theme: "cms_theme",
};

function severityOf(vuln: z.infer<typeof Vulnerability>): string | null {
  const raw = vuln.cvss?.severity?.toLowerCase();
  return raw && ["low", "medium", "high", "critical"].includes(raw) ? raw : null;
}

/** Convertit la réponse WPScan d'un composant en faits de veille. Fonction pure. */
export function intelFromWpscan(payload: unknown, target: WordPressTarget): NewIntelItem[] {
  const parsed = Response.safeParse(payload);
  if (!parsed.success) return [];

  const items: NewIntelItem[] = [];
  const type = target.type ?? TYPE_BY_ROLE[target.role];

  for (const entry of Object.values(parsed.data)) {
    for (const vuln of entry.vulnerabilities ?? []) {
      const cve = vuln.references?.cve?.[0];
      const published = vuln.published_date ? new Date(vuln.published_date) : null;

      items.push({
        kind: "vulnerability",
        source: SOURCE,
        externalId: vuln.id,
        targetSlug: target.slug,
        targetType: type,
        targetEcosystem: "wordpress",
        // WPScan ne donne pas de borne basse : toutes les versions antérieures
        // au correctif sont concernées. `isAffected` sait déduire « < fixed_in ».
        affectedRange: vuln.fixed_in ? `< ${vuln.fixed_in}` : null,
        fixedIn: vuln.fixed_in ?? null,
        severity: severityOf(vuln),
        title: cve ? `${vuln.title} (${cve})` : vuln.title,
        raw: vuln,
        publishedAt: published && !Number.isNaN(published.getTime()) ? published : null,
      });
    }
  }

  return items;
}

export interface WpscanReport {
  items: NewIntelItem[];
  failures: Array<{ product: string; reason: string }>;
  /** Renseigné quand le collecteur n'a pas pu travailler du tout. */
  unavailable: string | null;
}

function endpointFor(target: WordPressTarget): string | null {
  switch (target.role) {
    case "plugin":
      return `${API}/plugins/${target.slug}`;
    case "theme":
      return `${API}/themes/${target.slug}`;
    case "core": {
      // Le cœur s'interroge par version, sans les points : 6.4.3 → 643.
      const version = target.versions[0];
      return version ? `${API}/wordpresses/${version.replace(/\./g, "")}` : null;
    }
  }
}

export async function collectWpscan(
  targets: WordPressTarget[],
  budget: CallBudget,
  apiKey: string | undefined = process.env.WPSCAN_API_KEY,
): Promise<WpscanReport> {
  const report: WpscanReport = { items: [], failures: [], unavailable: null };

  if (targets.length === 0) return report;

  if (!apiKey) {
    report.unavailable =
      "WPSCAN_API_KEY absente — aucune source gratuite de vulnérabilités WordPress " +
      "depuis le retrait de l'API Wordfence v2. Fins de support et retards de version restent couverts.";
    return report;
  }

  for (const target of targets) {
    const url = endpointFor(target);
    if (!url) {
      report.failures.push({ product: target.slug, reason: "version inconnue" });
      continue;
    }

    const outcome = await fetchJson<unknown>(
      { url, headers: { authorization: `Token token=${apiKey}` } },
      budget,
    );

    if (!outcome.ok) {
      report.failures.push({ product: `${target.role}:${target.slug}`, reason: outcome.reason });
      continue;
    }

    report.items.push(...intelFromWpscan(outcome.data, target));
  }

  return report;
}
