// API publique de l'admin de supervision de l'espace CTO (src/cto/admin/).
//
// Lecture seule, à une exception près : voir `overview.ts` pour ce que ça veut
// dire et pourquoi, et `actions.ts` pour la seule écriture. L'identité et
// l'accès (`identity.ts`, `store.ts`, `passkeys.ts`) sont adressés à
// agathe@next-impact.digital, la seule personne à pouvoir entrer ici ; la glue
// Next (cookies, redirections) vit dans `app/(cto)/admin-cto/session.ts`.

export { ADMIN_EMAIL, ADMIN_NAME, ADMIN_USER_ID } from "./identity";

export {
  closeAdminSession,
  consumeAdminMagicLink,
  issueAdminMagicLink,
  openAdminSession,
  purgeExpiredAdminAccess,
  resolveAdminSession,
  MAX_LINKS_PER_WINDOW,
  type AdminPurgeReport,
  type ConsumeOutcome as AdminMagicLinkOutcome,
  type IssueOutcome as AdminMagicLinkIssue,
  type OpenedSession as AdminOpenedSession,
  type ResolvedAdminSession,
} from "./store";

export {
  finishAdminAuthentication,
  finishAdminRegistration,
  listAdminCredentials,
  startAdminAuthentication,
  startAdminRegistration,
  MAX_CREDENTIALS,
  type AdminCredentialRow,
  type AuthenticationOutcome as AdminAuthenticationOutcome,
  type RegistrationOutcome as AdminRegistrationOutcome,
} from "./passkeys";

export { sendAdminEnrollmentNotice, sendAdminLoginLink } from "./notify";

export {
  clientDetail,
  listClients,
  recentAccessLog,
  type AdminPersonRow,
  type ClientDetail,
  type ClientOverviewRow,
  type JournalOverviewRow,
} from "./overview";

// Seule écriture de ce module — voir son en-tête pour la raison de l'exception.
export { setSyncEnabled } from "./actions";
