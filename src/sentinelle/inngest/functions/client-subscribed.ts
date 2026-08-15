import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, scans } from "@sentinelle/db/schema";
import { importScannedStack, linkOriginScan, sendWelcome } from "@sentinelle/onboarding";
import { scanSite } from "@sentinelle/scanner";
import type { ScanResult } from "@sentinelle/types";
import { inngest } from "../client";
import { clientSubscribed as clientSubscribedEvent } from "../events";

// ─────────────────────────────────────────────────────────────────────────────
// Ce qui suit un paiement.
//
// Le webhook Stripe fait une seule chose — écrire la fiche — puis rend la main.
// Tout le reste vit ici : amorcer le stack, souhaiter la bienvenue. Deux
// raisons de ne pas le faire dans la requête webhook : un scan de site prend
// des secondes que Stripe ne donne pas, et un envoi d'e-mail qui échoue ne doit
// pas faire retenter un paiement.
//
// Chaque étape est idempotente séparément. Un rejeu (Stripe retente, Inngest
// retente) reprend là où ça a cassé sans rien dupliquer : l'import est un
// upsert, la bienvenue est protégée par une écriture conditionnelle.
// ─────────────────────────────────────────────────────────────────────────────

export const onClientSubscribed = inngest.createFunction(
  {
    id: "sentinelle-client-subscribed",
    name: "Sentinelle — ouverture d'un abonnement",
    triggers: [clientSubscribedEvent],
    // Trois tentatives : le scan d'un site lent et un SMTP qui bronche sont
    // tous deux des pannes passagères, et personne ne repasse derrière.
    retries: 3,
  },
  async ({ event, step }) => {
    const { clientId, scanId } = event.data;

    const client = await step.run("load-client", async () => {
      const [row] = await db()
        .select({ id: clients.id, siteUrl: clients.siteUrl, email: clients.email })
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

      return row ?? null;
    });

    if (!client) {
      // La fiche a été effacée entre le paiement et ici : rien à faire, et
      // surtout pas une erreur qui ferait retenter indéfiniment.
      console.warn(`[sentinelle] abonnement ${clientId} : fiche introuvable, abandon`);
      return { clientId, imported: 0, welcome: "fiche introuvable" };
    }

    // Le scan d'origine, quand le parcours est passé par le rapport public.
    // On ne rescanne pas dans ce cas : le résultat a quelques minutes, et le
    // client vient de le lire à l'écran — sa fiche doit lui ressembler.
    const result = await step.run("resolve-scan", async (): Promise<ScanResult | null> => {
      if (scanId) {
        const [row] = await db()
          .select({ status: scans.status, result: scans.result })
          .from(scans)
          .where(eq(scans.id, scanId))
          .limit(1);

        if (row?.status === "done" && row.result && "components" in (row.result as object)) {
          return row.result as ScanResult;
        }
      }

      if (!client.siteUrl) return null;

      const outcome = await scanSite(client.siteUrl);
      if (!outcome.ok) {
        // Un site qui refuse l'analyse n'est pas une panne du produit : la fiche
        // reste déclarative, et l'e-mail de bienvenue le dit à sa façon (il ne
        // liste alors aucun composant).
        console.warn(
          `[sentinelle] abonnement ${clientId} : analyse impossible (${outcome.reason})`,
        );
        return null;
      }

      return outcome.result;
    });

    const imported = await step.run("import-stack", async () => {
      if (scanId) await linkOriginScan(clientId, scanId);
      if (!result) return 0;

      const { written } = await importScannedStack(clientId, result);
      return written;
    });

    const welcome = await step.run("send-welcome", async () => {
      const outcome = await sendWelcome(clientId);
      return outcome.sent ? "envoyée" : outcome.reason;
    });

    return { clientId, imported, welcome };
  },
);
