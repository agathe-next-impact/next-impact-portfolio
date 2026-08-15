import { sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { inngest } from "../client";
import { healthcheckRequested } from "../events";

/**
 * Vérification de bout en bout du branchement : Inngest atteint l'application,
 * l'application atteint Neon. C'est la définition de fini de la phase 1.
 *
 * L'accès base vit dans un step séparé pour que son échec soit lisible dans le
 * tableau de bord Inngest sans faire échouer la preuve que l'événement a bien
 * été reçu. On rattrape l'erreur au lieu de la laisser remonter : un
 * healthcheck doit rapporter l'état, pas se retenter en boucle.
 */
export const healthcheck = inngest.createFunction(
  {
    id: "sentinelle-healthcheck",
    name: "Sentinelle — healthcheck",
    triggers: [healthcheckRequested],
    retries: 0,
  },
  async ({ event, step }) => {
    const database = await step.run("check-database", async () => {
      try {
        const result = await db().execute(sql`select 1 as ok`);
        return { reachable: true as const, rows: result.rows.length };
      } catch (error) {
        return {
          reachable: false as const,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });

    return {
      received: event.data.note ?? null,
      database,
      checkedAt: new Date().toISOString(),
    };
  },
);
