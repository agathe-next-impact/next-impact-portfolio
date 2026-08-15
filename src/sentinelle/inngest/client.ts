import { Inngest } from "inngest";

/**
 * Client Inngest du produit Sentinelle.
 *
 * `id` isole l'application côté tableau de bord Inngest : si la vitrine devait
 * un jour avoir ses propres tâches de fond, elles auraient leur propre client.
 *
 * Les clés (INNGEST_EVENT_KEY / INNGEST_SIGNING_KEY) sont lues automatiquement
 * dans l'environnement. En développement, `npx inngest-cli@latest dev` les rend
 * inutiles.
 */
export const inngest = new Inngest({
  id: "sentinelle",
});
