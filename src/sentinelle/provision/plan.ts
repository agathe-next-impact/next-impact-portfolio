import { z } from "zod";
import type { Plan } from "@sentinelle/db/schema";
import { normalizeSiteUrl } from "@sentinelle/url";

// ─────────────────────────────────────────────────────────────────────────────
// Provisionnement d'un client depuis l'espace de direction technique.
//
// La fiche Notion Clients de l'atelier commande : service « Veille technique »,
// site surveillé, contact. La synchro de l'espace traduit ces colonnes en une
// demande, et c'est ce module qui décide ce qu'elle change ici. Pur : la
// décision se teste sans base.
//
// Deux formes de demande :
//  - avec `id` : la fiche est déjà reliée, on l'aligne (ou on la désactive) ;
//  - sans `id` : première activation, on crée — ou on adopte la fiche d'un
//    abonné existant qui porte la même adresse ET suit le même site, plutôt
//    que d'en créer une seconde (l'e-mail est unique chez Sentinelle). La même
//    adresse pour un autre site est refusée : ce serait réécrire la fiche
//    d'un autre client.
//
// Toute fiche passée par ici est en formule `accompagnement` : sa veille se lit
// dans l'espace d'accompagnement, rien ne lui part par e-mail. Un abonné
// Sentinelle seul adopté change donc de formule avec l'adoption.
// ─────────────────────────────────────────────────────────────────────────────

/** Un site supplémentaire suivi pour le client. */
export const ExtraSiteSchema = z.object({
  url: z.string().min(1),
  name: z.string().max(200).nullable().optional(),
});

export type ExtraSite = { url: string; name: string | null };

/** Dix sites supplémentaires au plus : au-delà, c'est un autre produit. */
export const MAX_EXTRA_SITES = 10;

/**
 * Pur : la liste de sites d'une demande ou d'une ligne, normalisée — adresses
 * valides et publiques, sans doublon, sans le site principal, bornée.
 */
export function siteList(raw: unknown, principal: string | null = null): ExtraSite[] {
  if (!Array.isArray(raw)) return [];
  const vus = new Set<string>(principal ? [normalizeSiteUrl(principal) ?? principal] : []);
  const out: ExtraSite[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const url = normalizeSiteUrl((entry as { url?: unknown }).url as string | null | undefined);
    if (!url || vus.has(url)) continue;
    vus.add(url);
    const name = (entry as { name?: unknown }).name;
    out.push({ url, name: typeof name === "string" && name.trim() ? name.trim() : null });
    if (out.length === MAX_EXTRA_SITES) break;
  }
  return out;
}

export const ProvisionRequestSchema = z.union([
  z.object({
    id: z.string().uuid(),
    active: z.literal(false),
  }),
  z.object({
    id: z.string().uuid().optional(),
    active: z.literal(true),
    email: z.string().email(),
    name: z.string().min(1).max(200),
    company: z.string().max(200).nullable().optional(),
    siteUrl: z.string().min(1),
    /** Sites supplémentaires du même client. Absent : inchangés ; `[]` : tous retirés. */
    extraSites: z.array(ExtraSiteSchema).max(MAX_EXTRA_SITES).optional(),
    sector: z.string().max(200).nullable().optional(),
  }),
]);

export type ProvisionRequest = z.infer<typeof ProvisionRequestSchema>;

/** Ce que la base contient déjà pour ce client (par `id`, ou à défaut par adresse). */
export interface ExistingClient {
  id: string;
  email: string;
  name: string;
  company: string | null;
  siteUrl: string;
  sector: string | null;
  extraSites: ExtraSite[];
  active: boolean;
  plan: Plan;
  /** Composants suivis : zéro veut dire une fiche jamais amorcée. */
  components: number;
}

export type ProvisionPlan =
  | { kind: "reject"; status: 400 | 404 | 409; reason: string }
  | { kind: "noop"; id: string }
  | { kind: "deactivate"; id: string }
  | {
      kind: "create";
      values: {
        email: string;
        name: string;
        company: string | null;
        siteUrl: string;
        extraSites: ExtraSite[];
        sector: string | null;
        plan: "accompagnement";
      };
      scan: true;
    }
  | {
      kind: "update";
      id: string;
      patch: Partial<{
        email: string;
        name: string;
        company: string | null;
        siteUrl: string;
        extraSites: ExtraSite[];
        sector: string | null;
        active: boolean;
        plan: "accompagnement";
      }>;
      /** Relancer l'analyse : site changé, fiche jamais amorcée, ou réactivation. */
      scan: boolean;
      adopted: boolean;
    };

export function planProvision(request: ProvisionRequest, existing: ExistingClient | null): ProvisionPlan {
  if (!request.active) {
    if (!existing) return { kind: "reject", status: 404, reason: "client Sentinelle introuvable" };
    return existing.active ? { kind: "deactivate", id: existing.id } : { kind: "noop", id: existing.id };
  }

  const siteUrl = normalizeSiteUrl(request.siteUrl);
  if (!siteUrl) return { kind: "reject", status: 400, reason: "adresse du site invalide" };

  const wanted = {
    email: request.email.trim().toLowerCase(),
    name: request.name.trim(),
    company: request.company?.trim() || null,
    siteUrl,
    sector: request.sector?.trim() || null,
  };
  // `undefined` : la demande ne parle pas des sites supplémentaires, ils restent.
  const extraSites = request.extraSites === undefined ? undefined : siteList(request.extraSites, siteUrl);

  if (!existing) {
    if (request.id) return { kind: "reject", status: 404, reason: "client Sentinelle introuvable" };
    return { kind: "create", values: { ...wanted, extraSites: extraSites ?? [], plan: "accompagnement" }, scan: true };
  }

  // Adopter, c'est reconnaître le même abonné : même adresse ET même site. La
  // même adresse pour un autre site désigne un autre client — l'aligner
  // réécrirait sa fiche et mêlerait deux stacks sous un seul identifiant.
  if (!request.id && (normalizeSiteUrl(existing.siteUrl) ?? existing.siteUrl) !== wanted.siteUrl) {
    return {
      kind: "reject",
      status: 409,
      reason: "cette adresse est déjà celle d'un client Sentinelle qui suit un autre site",
    };
  }

  const patch: Extract<ProvisionPlan, { kind: "update" }>["patch"] = {};
  if (wanted.email !== existing.email) patch.email = wanted.email;
  if (wanted.name !== existing.name) patch.name = wanted.name;
  if (wanted.company !== existing.company) patch.company = wanted.company;
  if (wanted.siteUrl !== existing.siteUrl) patch.siteUrl = wanted.siteUrl;
  if (extraSites !== undefined && JSON.stringify(extraSites) !== JSON.stringify(existing.extraSites)) {
    patch.extraSites = extraSites;
  }
  // Le secteur n'est écrasé que par une valeur : une colonne vidée dans Notion
  // ne doit pas effacer ce que l'onboarding a appris.
  if (wanted.sector && wanted.sector !== existing.sector) patch.sector = wanted.sector;
  if (!existing.active) patch.active = true;
  if (existing.plan !== "accompagnement") patch.plan = "accompagnement";

  const scan = patch.siteUrl !== undefined || patch.extraSites !== undefined || existing.components === 0 || patch.active === true;
  const adopted = !request.id;

  if (Object.keys(patch).length === 0 && !scan) return { kind: "noop", id: existing.id };
  return { kind: "update", id: existing.id, patch, scan, adopted };
}
