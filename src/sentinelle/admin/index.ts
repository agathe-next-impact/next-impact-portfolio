// API publique de l'admin de validation (phase 4).
//
// La règle 4 du CLAUDE.md — « aucune alerte ne part sans validation humaine » —
// est implémentée dans `actions.ts`, sous forme de refus. `queue.ts` ne fait que
// lire, et regroupe par composant : c'est ce qui rend trente alertes relisibles.
// `session.ts` et `content.ts` sont purs et testés ; la glue Next (cookies,
// redirections, formulaires) vit dans `app/(sentinelle)/admin/`.

export {
  adminPassword,
  createSessionToken,
  maxAgeSeconds,
  safeEqual,
  verifySessionToken,
  MIN_PASSWORD_LENGTH,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  type AdminEnv,
  type SessionCheck,
} from "./session";

export {
  alertSubject,
  initialContent,
  missingForValidation,
  parseAlertContent,
  serializeAlertContent,
  EMPTY_CONTENT,
  VERDICTS,
} from "./content";

export {
  getAlertDetail,
  getClientDossier,
  listQueue,
  nextOpenAlertId,
  OPEN_STATUSES,
  type AlertDetail,
  type ClientDossier,
  type ClientQueue,
  type ComponentGroup,
  type QueueAlert,
} from "./queue";

export {
  getDigestDetail,
  listDigests,
  saveDigestBlocks,
  sendDigest,
  validateDigest,
  type DigestDetail,
  type DigestSendOutcome,
  type DigestSummary,
} from "./digests";

export {
  dismissAlert,
  dismissComponent,
  reopenAlert,
  saveAlertContent,
  sendAlert,
  validateAlert,
  type ActionResult,
  type SendOutcome,
} from "./actions";
