// API publique de la couche d'accès de l'espace CTO.
//
// Un seul point d'entrée par module, comme partout dans ce dépôt : les écrans et
// les routes importent d'ici, jamais d'un fichier interne. Le jour où le
// stockage des sessions change, c'est cette façade qui absorbe le choc.

export {
  accessSecret,
  createMagicToken,
  createSessionToken,
  hashToken,
  sessionMaxAgeSeconds,
  shouldSlide,
  verifyMagicToken,
  CHALLENGE_TTL_MS,
  MAGIC_LINK_TTL_MS,
  MIN_SECRET_LENGTH,
  SESSION_SLIDE_THRESHOLD_MS,
  SESSION_TTL_MS,
} from "./token";

export {
  accessDecision,
  closeSession,
  consumeMagicLink,
  findPersonByEmail,
  findPersonById,
  issueMagicLink,
  listSessions,
  openSession,
  purgeExpiredAccess,
  resolveSession,
  revokeAllSessions,
  revokeSession,
  MAX_LINKS_PER_WINDOW,
  type AccessDecision,
  type ClientStatus,
  type Person,
  type PurgeReport,
  type ResolvedSession,
  type SessionRow,
} from "./store";

export {
  deleteCredential,
  finishAuthentication,
  finishRegistration,
  listCredentials,
  renameCredential,
  startAuthentication,
  startRegistration,
  MAX_CREDENTIALS_PER_PERSON,
  type CredentialRow,
} from "./passkeys";

export {
  listForClient,
  listForPerson,
  record,
  EVENT_LABELS,
  type AccessEvent,
  type JournalRow,
} from "./journal";

export { sendEnrollmentNotice, sendLoginLink } from "./notify";

export { describeDevice, expectedOrigins, rpId, suggestLabel, RP_NAME } from "./webauthn";
