// Accès à l'espace client (phase 5).
//
// `token.ts` et `session.ts` sont purs et testés — signature, expiration,
// comparaison à temps constant. `store.ts` porte ce qui a besoin de la base :
// émission, consommation à usage unique, purge. La glue Next (cookies,
// redirections, formulaires) vit dans `app/(sentinelle)/espace/`.

export {
  createMagicToken,
  hashToken,
  magicLinkSecret,
  verifyMagicToken,
  MAGIC_LINK_TTL_MS,
  MIN_SECRET_LENGTH,
  TOKEN_REFUSAL,
  type AccessEnv,
  type IssuedToken,
  type TokenCheck,
} from "./token";

export {
  createClientSessionToken,
  sessionMaxAgeSeconds,
  verifyClientSessionToken,
  CLIENT_SESSION_COOKIE,
  CLIENT_SESSION_TTL_MS,
  type ClientSessionCheck,
} from "./session";

export {
  consumeMagicLink,
  findRecipient,
  issueMagicLink,
  purgeExpiredMagicLinks,
  MAX_LINKS_PER_WINDOW,
  type ConsumeOutcome,
  type IssueOutcome,
  type Recipient,
} from "./store";

export { sendLoginLink, type LoginLinkOutcome } from "./notify";
