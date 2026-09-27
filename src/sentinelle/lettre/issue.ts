import { z } from "zod";
import type { NewsletterBlocks } from "@sentinelle/newsletter/blocks";
import { parseNewsletterPeriod } from "@sentinelle/newsletter/period";
import { DossierSchema, LettreSchema, type Dossier, type Lettre } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Ce qu'un numéro pèse en base.
//
// Tout tient dans la colonne `digests.blocks` (jsonb) : le constaté, le dossier
// collecté, la lettre, et l'encart de production. Pas de migration — et surtout,
// **le dossier est conservé à côté de la lettre**. C'est lui qui permet, six
// mois plus tard, de vérifier d'où venait une affirmation ; une lettre sans son
// dossier n'est plus vérifiable, seulement croyable.
//
// Le champ `version` existe pour une raison précise : les numéros fabriqués
// avant la lettre de veille portent l'ancienne forme à cinq blocs. Ils restent
// lisibles — `parseIssue` les enveloppe — plutôt que de faire tomber l'admin sur
// une ligne de 2026.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductionNote {
  /** Pages réellement récupérées pendant la collecte. */
  pagesAnalysees: string[];
  pagesNonAnalysees: Array<{ url: string; raison: string }>;
  /** Points non recoupés : à vérifier avant envoi, jamais affirmés. */
  aConfirmer: Array<{ point: string; sourceAVerifier: string }>;
  /** Ce que la collecte a voulu signaler à un humain. */
  notesCollecte: string;
  /** Ce que la rédaction a voulu signaler à un humain. */
  notesRedaction: string;
  /** Signalements du garde-fou — non bloquants, mais à lire. */
  signalements: string[];
  /** Erreurs rencontrées pendant la fabrication. */
  erreurs: string[];
  /** Consommation réelle — la seule façon de régler le budget de recherche. */
  consommation: {
    recherches: number;
    lectures: number;
    reprises: number;
    jetonsEntree: number;
    jetonsSortie: number;
  };
}

export const ISSUE_VERSION = 2;

export interface IssueContent {
  version: number;
  /** Les faits internes : fiche, alertes envoyées, radar. Toujours présents. */
  constate: NewsletterBlocks;
  /** Le dossier collecté. Null si la collecte a échoué. */
  dossier: Dossier | null;
  /** La lettre. Null tant qu'elle n'a pas été écrite ou qu'elle a été refusée. */
  lettre: Lettre | null;
  production: ProductionNote;
}

export function emptyProduction(): ProductionNote {
  return {
    pagesAnalysees: [],
    pagesNonAnalysees: [],
    aConfirmer: [],
    notesCollecte: "",
    notesRedaction: "",
    signalements: [],
    erreurs: [],
    consommation: {
      recherches: 0,
      lectures: 0,
      reprises: 0,
      jetonsEntree: 0,
      jetonsSortie: 0,
    },
  };
}

const ProductionSchema = z.object({
  pagesAnalysees: z.array(z.string()),
  pagesNonAnalysees: z.array(z.object({ url: z.string(), raison: z.string() })),
  aConfirmer: z.array(z.object({ point: z.string(), sourceAVerifier: z.string() })),
  notesCollecte: z.string(),
  notesRedaction: z.string(),
  signalements: z.array(z.string()),
  erreurs: z.array(z.string()),
  consommation: z.object({
    recherches: z.number(),
    lectures: z.number(),
    reprises: z.number(),
    jetonsEntree: z.number(),
    jetonsSortie: z.number(),
  }),
});

const IssueSchema = z.object({
  version: z.number(),
  constate: z.custom<NewsletterBlocks>((value) => typeof value === "object" && value !== null),
  dossier: DossierSchema.nullable(),
  lettre: LettreSchema.nullable(),
  production: ProductionSchema,
});

/**
 * Relit le contenu d'un numéro, quelle que soit sa génération.
 *
 * Renvoie null quand la colonne ne porte rien d'exploitable — un numéro vidé par
 * la purge de rétention, typiquement. L'appelant affiche alors un numéro sans
 * contenu plutôt que de tomber.
 */
export function parseIssue(raw: unknown): IssueContent | null {
  if (typeof raw !== "object" || raw === null) return null;

  const current = IssueSchema.safeParse(raw);
  if (current.success) return current.data;

  // Ancienne forme : les cinq blocs, à plat. On l'enveloppe telle quelle — elle
  // reste relisible, elle n'est simplement pas une lettre de veille.
  if ("health" in raw && "delta" in raw && "radar" in raw) {
    return {
      version: 1,
      constate: raw as NewsletterBlocks,
      dossier: null,
      lettre: null,
      production: emptyProduction(),
    };
  }

  return null;
}

/**
 * Ce qui manque pour qu'un numéro puisse être validé.
 *
 * Une seule condition, mais elle est absolue : la lettre doit exister. Le
 * constaté peut être vide (un premier numéro l'est presque), le dossier peut
 * l'être (période creuse), mais un numéro sans lettre n'est pas un livrable.
 */
export function missingForIssue(issue: IssueContent): string[] {
  const missing: string[] = [];

  if (!issue.lettre) {
    missing.push("la lettre elle-même");
    return missing;
  }

  if (issue.lettre.chapeau.trim() === "") missing.push("le chapeau");
  if (issue.lettre.axes.length === 0) missing.push("les douze axes");
  if (issue.lettre.synthese.actions.length === 0 && issue.lettre.synthese.reste.trim() === "") {
    missing.push("la synthèse");
  }

  return missing;
}

/**
 * Ce qui interdit de refabriquer un numéro, ou null si rien ne s'y oppose.
 *
 * La refabrication réécrit le numéro en place. Elle ne vaut donc que pour un
 * brouillon resté sans lettre : dès qu'un texte existe, le réécrire effacerait
 * une relecture, et dès qu'il est validé, il a peut-être déjà été lu.
 *
 * Partagée par l'admin, qui demande, et par la fabrication, qui exécute : entre
 * les deux s'écoulent des minutes, et le numéro a pu changer.
 */
export function rebuildRefusal(numero: {
  status: string;
  period: string;
  blocks: unknown;
  clientActive: boolean;
}): string | null {
  if (numero.status !== "draft") {
    return "Seul un brouillon se refabrique : ce numéro est déjà validé ou envoyé.";
  }
  // Lu sur la colonne brute, pas à travers le schéma : une lettre que le schéma
  // ne reconnaît plus reste un texte que quelqu'un a pu relire.
  const brut = numero.blocks as { lettre?: unknown } | null;
  if (typeof brut === "object" && brut !== null && typeof brut.lettre === "object" && brut.lettre !== null) {
    return "Ce numéro a une lettre : le refabriquer effacerait la relecture.";
  }
  if (!parseNewsletterPeriod(numero.period)) {
    return `Période illisible (« ${numero.period} ») : refabrication impossible.`;
  }
  if (!numero.clientActive) return "Abonnement résilié : aucune fabrication.";

  return null;
}

/** Un numéro sans rien de neuf reste un numéro — il est seulement plus court. */
export function isQuietIssue(constate: NewsletterBlocks): boolean {
  return (
    constate.delta.alerts.length === 0 &&
    constate.delta.newComponents.length === 0 &&
    constate.radar.length === 0
  );
}

export type { Dossier, Lettre };
