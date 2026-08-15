import { z } from "zod";
import type { NewIntelItem } from "@sentinelle/types";
import { fetchJson, type CallBudget } from "./http";
import type { WordPressTarget } from "./targets";

// ─────────────────────────────────────────────────────────────────────────────
// api.wordpress.org — dernières versions des extensions et des thèmes.
//
// Ce collecteur ne traite **pas** le cœur de WordPress, et c'est délibéré :
// endoflife.date donne déjà, par branche, la dernière version publiée et la date
// de fin de correctifs. Un client sur 6.4.3 doit lire « 6.4.10 est disponible
// sur votre branche » et « la branche 6.4 n'est plus corrigée » — deux conseils
// justes — plutôt qu'un « passez en 7.0 » qui ignore son contexte. Ajouter ici
// une troisième source sur le même objet ne produirait que des doublons dans la
// boîte du client.
//
// Ce qu'endoflife.date ne couvre pas, en revanche, ce sont les soixante mille
// extensions : c'est exactement le trou que remplit ce fichier.
//
// Un identifiant par composant et non par version (`plugin:contact-form-7`) :
// le fait « votre extension est en retard » se met à jour en place à chaque
// sortie amont. Sans quoi chaque version publiée créerait un fait de plus, donc
// une alerte de plus, pour la même chose.
// ─────────────────────────────────────────────────────────────────────────────

export const SOURCE = "api.wordpress.org";

const PLUGIN_API = "https://api.wordpress.org/plugins/info/1.2/";
const THEME_API = "https://api.wordpress.org/themes/info/1.2/";

const Info = z
  .object({
    name: z.string().nullish(),
    version: z.string(),
    last_updated: z.string().nullish(),
  })
  .passthrough();

function endpointFor(target: WordPressTarget): string | null {
  const base = target.role === "plugin" ? PLUGIN_API : target.role === "theme" ? THEME_API : null;
  if (!base) return null;

  const action = target.role === "plugin" ? "plugin_information" : "theme_information";
  const params = new URLSearchParams({ action, "request[slug]": target.slug });
  return `${base}?${params.toString()}`;
}

/** Convertit une fiche d'extension ou de thème en fait de veille. Fonction pure. */
export function intelFromInfo(payload: unknown, target: WordPressTarget): NewIntelItem[] {
  const parsed = Info.safeParse(payload);
  if (!parsed.success) return [];

  const latest = parsed.data.version;
  const label = parsed.data.name?.trim() || target.slug;
  const updated = parsed.data.last_updated ? new Date(parsed.data.last_updated) : null;

  return [
    {
      kind: "release",
      source: SOURCE,
      externalId: `${target.role}:${target.slug}`,
      targetSlug: target.slug,
      targetType: target.type,
      targetEcosystem: "wordpress",
      affectedRange: `< ${latest}`,
      fixedIn: latest,
      severity: null,
      title: `${label} ${latest} est disponible`,
      raw: parsed.data,
      publishedAt: updated && !Number.isNaN(updated.getTime()) ? updated : null,
    },
  ];
}

export interface ReleasesReport {
  items: NewIntelItem[];
  failures: Array<{ product: string; reason: string }>;
}

export async function collectReleases(
  targets: WordPressTarget[],
  budget: CallBudget,
): Promise<ReleasesReport> {
  const report: ReleasesReport = { items: [], failures: [] };

  for (const target of targets) {
    const url = endpointFor(target);
    // Le cœur est traité par endoflife.date : ce n'est pas un échec.
    if (!url) continue;

    const outcome = await fetchJson<unknown>({ url }, budget);
    if (!outcome.ok) {
      report.failures.push({ product: `${target.role}:${target.slug}`, reason: outcome.reason });
      continue;
    }

    const produced = intelFromInfo(outcome.data, target);
    if (produced.length === 0) {
      // Extension retirée du répertoire, ou slug inexact : c'est une
      // information utile pour la fiche du client, pas une panne.
      report.failures.push({
        product: `${target.role}:${target.slug}`,
        reason: "introuvable dans le répertoire wordpress.org",
      });
      continue;
    }

    report.items.push(...produced);
  }

  return report;
}
