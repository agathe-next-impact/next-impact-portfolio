// ─────────────────────────────────────────────────────────────────────────────
// Ce qu'est un livrable, indépendamment d'où il vient.
//
// Ce fichier ne connaît ni Notion, ni Postgres. Il décrit la forme que prend un
// livrable une fois publié, et rien d'autre — pour que la couche d'affichage
// n'ait jamais à savoir par quel atelier il est passé. Le jour où l'atelier
// change, c'est `src/cto/notion/` qui change, pas l'espace client.
// ─────────────────────────────────────────────────────────────────────────────

export type DeliverableKind = "decision" | "roadmap" | "cartographie" | "document";

/**
 * Un arbitrage rendu, ou une option proposée puis écartée.
 *
 * `optionEcartee` est du texte libre et non un simple booléen : une décision
 * dont on ne sait plus ce qu'elle a évincé ne prouve rien. C'est la colonne qui
 * distingue un relevé de décisions d'un compte rendu de réunion.
 */
export interface DecisionPayload {
  nature: "arbitrage" | "ecartee" | null;
  motif: string | null;
  optionEcartee: string | null;
  portee: string[];
}

/** Un chantier daté et budgété, ou une opportunité en attente d'arbitrage. */
export interface RoadmapPayload {
  nature: "chantier" | "opportunite" | null;
  statut: string | null;
  budget: number | null;
  /** Les deux axes de la revue d'opportunité, et les seuls. */
  effort: string | null;
  effet: string | null;
  detail: string | null;
}

/** Une pièce du système : outil, fournisseur, contrat, accès, flux. */
export interface CartographiePayload {
  type: string | null;
  detenteur: string | null;
  coutAnnuel: number | null;
  criticite: string | null;
  risque: string | null;
}

/** Une pièce opposable : revue de devis, plan de continuité, restitution. */
export interface DocumentPayload {
  type: string | null;
  prestataire: string | null;
  montant: number | null;
  verdict: string | null;
  alternative: string | null;
}

export interface PayloadByKind {
  decision: DecisionPayload;
  roadmap: RoadmapPayload;
  cartographie: CartographiePayload;
  document: DocumentPayload;
}

export type DeliverablePayload = PayloadByKind[DeliverableKind];

/**
 * Un livrable dans sa version courante, tel que l'espace client l'affiche.
 *
 * `version` et `recordedAt` sont exposés à dessein : le client doit pouvoir
 * constater qu'un livrable a été corrigé, et quand. Une correction silencieuse
 * vaudrait moins qu'une correction datée.
 */
export interface Deliverable<K extends DeliverableKind = DeliverableKind> {
  id: string;
  clientId: string;
  notionPageId: string;
  kind: K;
  version: number;
  title: string;
  payload: PayloadByKind[K];
  occurredAt: Date | null;
  recordedAt: Date;
}

/** Ce qu'une source d'atelier doit fournir pour qu'un livrable soit publiable. */
export interface DeliverableInput<K extends DeliverableKind = DeliverableKind> {
  clientId: string;
  notionPageId: string;
  kind: K;
  title: string;
  payload: PayloadByKind[K];
  occurredAt: Date | null;
}
