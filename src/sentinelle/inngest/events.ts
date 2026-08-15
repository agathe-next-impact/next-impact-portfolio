import { eventType } from "inngest";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Catalogue des événements Sentinelle.
//
// Inngest v4 type les événements par schéma Standard Schema : le schéma zod
// sert à la fois de contrat TypeScript et de validation runtime du payload.
// C'est exactement la règle « zod sur toutes les entrées externes » du
// CLAUDE.md, appliquée à la file de messages.
//
// Un événement se déclenche via `inngest.send(nomEvenement.create({ … }))` et
// se consomme en le passant dans `triggers`. Producteur et consommateur
// partagent donc la même définition : un désaccord est une erreur de
// compilation, pas un message qui n'arrive jamais.
// ─────────────────────────────────────────────────────────────────────────────

/** Ping de vérification du branchement Inngest ↔ application ↔ base. */
export const healthcheckRequested = eventType("sentinelle/healthcheck.requested", {
  schema: z.object({
    note: z.string().max(200).optional(),
  }),
});

/** Un visiteur a demandé l'analyse d'une URL (phase 2). */
export const scanRequested = eventType("sentinelle/scan.requested", {
  schema: z.object({
    scanId: z.string().uuid(),
    url: z.string().url(),
  }),
});

/**
 * Un abonnement vient d'être encaissé (phase 5).
 *
 * Émis par le webhook Stripe, jamais par une page : le retour du navigateur
 * après paiement n'est pas garanti (onglet fermé, redirection perdue), le
 * webhook si. `scanId` est présent quand le parcours est passé par le rapport
 * public — c'est lui qui amorce la fiche sans refaire d'analyse.
 */
export const clientSubscribed = eventType("sentinelle/client.subscribed", {
  schema: z.object({
    clientId: z.string().uuid(),
    scanId: z.string().uuid().optional(),
  }),
});
