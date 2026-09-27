// API publique de l'admin de validation (phase 4).
//
// La règle 4 du CLAUDE.md — « aucune alerte ne part sans validation humaine » —
// est, pour les alertes, tenue par Notion depuis 2026-09 (voir `@sentinelle/notion`
// et docs/sentinelle/notion-alertes.md) ; `queue.ts` ne fait ici que LIRE le
// miroir Postgres pour l'écran de suivi, regroupé par composant. Elle reste
// implémentée en refus dans `actions.ts`/`digests.ts` pour la lettre bimensuelle.
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
  letterEspaceUrl,
  listDigests,
  parseLettreDraft,
  requestDigestRebuild,
  saveDigestLettre,
  sendDigest,
  validateDigest,
  type DigestDetail,
  type DigestSendOutcome,
  type DigestSummary,
} from "./digests";

export { type ActionResult } from "./actions";
