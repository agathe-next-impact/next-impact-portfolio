// API publique de l'admin de supervision de l'espace CTO (src/cto/admin/).
//
// Lecture seule, à une exception près : voir `overview.ts` pour ce que ça veut
// dire et pourquoi, et `actions.ts` pour la seule écriture. `session.ts` est
// pur et testé ; la glue Next (cookies, redirections) vit dans
// `app/(cto)/admin-cto/session.ts`.

export {
  adminPassword,
  createSessionToken,
  maxAgeSeconds,
  safeEqual,
  verifySessionToken,
  MIN_PASSWORD_LENGTH,
  SESSION_TTL_MS,
  type AdminEnv,
  type SessionCheck,
} from "./session";

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
