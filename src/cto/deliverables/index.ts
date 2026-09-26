// API publique de la couche livrables.
//
// Comme pour `access/`, un seul point d'entrée : l'espace client et la synchro
// importent d'ici, jamais d'un fichier interne.

export {
  ADMIN_ONLY_KINDS,
  appendVersion,
  appendWithdrawal,
  countsByClient,
  currentStates,
  digestOf,
  history,
  listForClient,
  listPrestations,
  livraisonsForClient,
  setPlacement,
  type DeliverableState,
} from "./store";

export type {
  AttachedFile,
  AuditPayload,
  AuditSection,
  CartographiePayload,
  DecisionPayload,
  Deliverable,
  DeliverableInput,
  DeliverableKind,
  DeliverablePayload,
  DocumentPayload,
  Livraison,
  PayloadByKind,
  PrestationPayload,
  PropositionPayload,
  RoadmapPayload,
  VeillePayload,
} from "./types";
