import { z } from "zod";
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
//    abonné existant qui porte la même adresse, plutôt que d'en créer une
//    seconde (l'e-mail est unique chez Sentinelle).
// ─────────────────────────────────────────────────────────────────────────────

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
  active: boolean;
  /** Composants suivis : zéro veut dire une fiche jamais amorcée. */
  components: number;
}

export type ProvisionPlan =
  | { kind: "reject"; status: 400 | 404; reason: string }
  | { kind: "noop"; id: string }
  | { kind: "deactivate"; id: string }
  | {
      kind: "create";
      values: { email: string; name: string; company: string | null; siteUrl: string; sector: string | null };
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
        sector: string | null;
        active: boolean;
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

  if (!existing) {
    if (request.id) return { kind: "reject", status: 404, reason: "client Sentinelle introuvable" };
    return { kind: "create", values: wanted, scan: true };
  }

  const patch: Extract<ProvisionPlan, { kind: "update" }>["patch"] = {};
  if (wanted.email !== existing.email) patch.email = wanted.email;
  if (wanted.name !== existing.name) patch.name = wanted.name;
  if (wanted.company !== existing.company) patch.company = wanted.company;
  if (wanted.siteUrl !== existing.siteUrl) patch.siteUrl = wanted.siteUrl;
  // Le secteur n'est écrasé que par une valeur : une colonne vidée dans Notion
  // ne doit pas effacer ce que l'onboarding a appris.
  if (wanted.sector && wanted.sector !== existing.sector) patch.sector = wanted.sector;
  if (!existing.active) patch.active = true;

  const scan = patch.siteUrl !== undefined || existing.components === 0 || patch.active === true;
  const adopted = !request.id;

  if (Object.keys(patch).length === 0 && !scan) return { kind: "noop", id: existing.id };
  return { kind: "update", id: existing.id, patch, scan, adopted };
}
