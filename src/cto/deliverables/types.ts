// ─────────────────────────────────────────────────────────────────────────────
// Ce qu'est un livrable, indépendamment d'où il vient.
//
// Ce fichier ne connaît ni Notion, ni Postgres. Il décrit la forme que prend un
// livrable une fois publié, et rien d'autre — pour que la couche d'affichage
// n'ait jamais à savoir par quel atelier il est passé. Le jour où l'atelier
// change, c'est `src/cto/notion/` qui change, pas l'espace client.
// ─────────────────────────────────────────────────────────────────────────────

export type DeliverableKind =
  | "decision"
  | "roadmap"
  | "cartographie"
  | "veille"
  | "document"
  | "prestation";

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
  /**
   * Lien vers une pièce complète hébergée ailleurs (rapport d'audit, étude…).
   * Le livrable reste un résumé actionnable ; ce lien est la porte vers le
   * document source, pas un moyen d'en rapatrier le contenu ici.
   */
  source: string | null;
}

/** Une pièce du système : outil, fournisseur, contrat, accès, flux. */
export interface CartographiePayload {
  type: string | null;
  detenteur: string | null;
  coutAnnuel: number | null;
  criticite: string | null;
  risque: string | null;
}

/**
 * Un item de veille dédiée.
 *
 * Trois champs obligatoires par doctrine, et c'est ce qui distingue cette veille
 * d'un flux RSS relayé : le FAIT (`fait`), sa SOURCE (`source`), et ce qu'il
 * change pour ce client-là (`implication`). Sans le troisième, on facture une
 * revue de presse ; sans le second, rien n'est défendable devant un dirigeant
 * qui décide dessus.
 */
export interface VeillePayload {
  nature: "note" | "alerte" | null;
  fait: string | null;
  implication: string | null;
  source: string | null;
  themes: string[];
}

/**
 * La pièce jointe d'un livrable, telle qu'elle a été rapatriée.
 *
 * Seulement la référence, jamais le contenu : le fichier vit dans `cto_files`,
 * adressé par l'empreinte de son contenu (`id`). Que l'empreinte fasse partie
 * du payload n'est pas un détail — c'est elle qui fait écrire une version de
 * plus quand la pièce est remplacée dans Notion, titre et colonnes inchangés.
 */
export interface AttachedFile {
  id: string;
  name: string;
  mime: string;
  size: number;
}

/** Une pièce opposable : revue de devis, plan de continuité, restitution. */
export interface DocumentPayload {
  type: string | null;
  prestataire: string | null;
  montant: number | null;
  verdict: string | null;
  alternative: string | null;
  /**
   * La pièce elle-même, quand la ligne en porte une. `null` si la colonne
   * « Fichier » est vide ou si le rapatriement a échoué (la synchro le dit).
   * Absent sur les versions écrites avant le rapatriement des fichiers.
   */
  fichier?: AttachedFile | null;
}

/**
 * Une prestation vendue : mission ponctuelle, devis signé.
 *
 * Distincte d'un chantier de roadmap : un chantier est ce que le système
 * demande, une prestation est ce que le client a acheté. Les confondre ferait
 * de la roadmap un bon de commande.
 */
export interface PrestationPayload {
  statut: string | null;
  debut: string | null;
  montant: number | null;
  /** Part réalisée, de 0 à 1. `null` = non suivie, à ne pas afficher comme 0 %. */
  avancement: number | null;
  devis: string | null;
  detail: string | null;
}

export interface PayloadByKind {
  decision: DecisionPayload;
  roadmap: RoadmapPayload;
  cartographie: CartographiePayload;
  veille: VeillePayload;
  document: DocumentPayload;
  prestation: PrestationPayload;
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
  /**
   * Remonte sur la page d'accueil de l'espace. Faux par défaut : la mise en
   * avant se décide, elle ne s'hérite pas du fait d'avoir été publié.
   *
   * Ce n'est PAS une donnée du livrable — elle ne participe ni à son empreinte
   * ni à son historique (cf. `cto_deliverable_placements`). Elle voyage ici
   * parce que l'affichage en a besoin au même endroit que le reste.
   */
  featured: boolean;
  /**
   * Vrai sur une version de RETRAIT. Toujours faux dans les listes courantes,
   * qui les excluent ; utile seulement quand on relit l'histoire complète, où
   * un retrait est un événement à montrer.
   */
  withdrawn?: boolean;
}

/** Ce qu'une source d'atelier doit fournir pour qu'un livrable soit publiable. */
export interface DeliverableInput<K extends DeliverableKind = DeliverableKind> {
  clientId: string;
  notionPageId: string;
  kind: K;
  title: string;
  payload: PayloadByKind[K];
  occurredAt: Date | null;
  featured: boolean;
}
