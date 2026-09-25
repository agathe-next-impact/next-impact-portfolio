// API publique de la couche livrables.
//
// Comme pour `access/`, un seul point d'entrée : l'espace client et la synchro
// importent d'ici, jamais d'un fichier interne.

export {
  appendVersion,
  appendWithdrawal,
  countsByClient,
  currentStates,
  digestOf,
  history,
  listForClient,
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
  PayloadByKind,
  PrestationPayload,
  RoadmapPayload,
  VeillePayload,
} from "./types";
