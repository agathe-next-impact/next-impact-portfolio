import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { scanSite } from "@sentinelle/scanner";
import { buildApercu } from "@sentinelle/apercu";
import { inngest } from "../client";
import { scanRequested } from "../events";

/**
 * Analyse d'un site, en tâche de fond.
 *
 * Le scan ne vit pas dans la requête HTTP : un site lent tiendrait la fonction
 * serverless jusqu'au délai de Vercel et le visiteur n'aurait qu'une erreur.
 * Ici, la route rend la main immédiatement et le front interroge l'état.
 *
 * `retries: 1` et non davantage : si un site ne répond pas, insister ne le fera
 * pas répondre, et le scanner doit rester poli avec les sites qu'il analyse.
 */
export const scanAsync = inngest.createFunction(
  {
    id: "sentinelle-scan-async",
    name: "Sentinelle — analyse d'un site",
    triggers: [scanRequested],
    retries: 1,
  },
  async ({ event, step }) => {
    const { scanId, url } = event.data;

    await step.run("mark-running", async () => {
      await db().update(scans).set({ status: "running" }).where(eq(scans.id, scanId));
    });

    const outcome = await step.run("scan", async () => scanSite(url));

    await step.run("store-result", async () => {
      if (!outcome.ok) {
        await db()
          .update(scans)
          .set({ status: "failed", result: { error: outcome.reason } })
          .where(eq(scans.id, scanId));
        return;
      }

      // `apercu: pending` : le rapport s'affiche tout de suite, le front
      // continue d'interroger le temps que la passe de rédaction se termine.
      await db()
        .update(scans)
        .set({
          status: "done",
          result: { ...outcome.result, apercu: { status: "pending" as const } },
        })
        .where(eq(scans.id, scanId));
    });

    // L'aperçu de veille — l'échantillon de la lettre personnalisée. Étape
    // séparée : son échec (API, quota) laisse le rapport de scan intact.
    if (outcome.ok) {
      const apercu = await step.run("apercu", async () => buildApercu(outcome.result));

      await step.run("store-apercu", async () => {
        await db()
          .update(scans)
          .set({ result: { ...outcome.result, apercu } })
          .where(eq(scans.id, scanId));
      });
    }

    return {
      scanId,
      status: outcome.ok ? "done" : "failed",
      components: outcome.ok ? outcome.result.components.length : 0,
    };
  },
);
