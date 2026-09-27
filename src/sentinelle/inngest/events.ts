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
 * L'admin demande de refabriquer un numéro resté sans lettre.
 *
 * Émis par une action de l'admin, jamais exécuté dans sa requête : une
 * fabrication se compte en minutes.
 */
export const issueRebuildRequested = eventType("sentinelle/issue.rebuild.requested", {
  schema: z.object({
    digestId: z.string().uuid(),
  }),
});

/**
 * Un abonnement vient d'être ouvert (phase 5).
 *
 * Émis par l'activation d'une demande d'inscription (admin) et par le
 * provisionnement, jamais par une page publique (jusqu'au 2026-09-27, par le
 * webhook Stripe). `scanId` est présent quand la demande est partie du rapport
 * public — c'est lui qui amorce la fiche sans refaire d'analyse.
 */
export const clientSubscribed = eventType("sentinelle/client.subscribed", {
  schema: z.object({
    clientId: z.string().uuid(),
    scanId: z.string().uuid().optional(),
    /**
     * `false` : amorcer la fiche sans e-mail de bienvenue. Posé par le
     * provisionnement depuis l'espace de direction technique, dont les clients
     * lisent leur veille là-bas et n'ont pas à découvrir un second espace.
     * Absent : comportement d'origine (bienvenue envoyée).
     */
    welcome: z.boolean().optional(),
  }),
});
