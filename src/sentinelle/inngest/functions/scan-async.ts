import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { scanSite } from "@sentinelle/scanner";
import { buildDiagnostic } from "@sentinelle/diagnostic";
import { envoyerAudit } from "@sentinelle/audit";
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

      // `pending` : le rapport s'affiche tout de suite, le front continue
      // d'interroger le temps que le diagnostic se rédige.
      await db()
        .update(scans)
        .set({
          status: "done",
          result: { ...outcome.result, diagnostic: { status: "pending" as const } },
        })
        .where(eq(scans.id, scanId));
    });

    if (outcome.ok) {
      // La grille en quatre cases : collecte web courte puis rédaction sans
      // outils. Son échec laisse le rapport de scan intact.
      //
      // Plus de lettre-échantillon ici (décision du 2026-09-27) : la lettre de
      // veille personnalisée n'est plus générée automatiquement. Le rapport
      // propose une inscription (opt-in) qui sert à Agathe à recontacter.
      const diagnostic = await step.run("diagnostic", async () =>
        buildDiagnostic(outcome.result),
      );

      await step.run("store-diagnostic", async () => {
        await db()
          .update(scans)
          .set({ result: { ...outcome.result, diagnostic } })
          .where(eq(scans.id, scanId));
      });

      // L'audit part à l'adresse laissée pendant l'attente, s'il y en a une.
      // Sans adresse, rien ne se passe : la saisie ultérieure (popup) déclenche
      // l'envoi elle-même. Le verrou `audit_sent_at` évite le doublon.
      await step.run("send-audit", async () => envoyerAudit(scanId));
    }

    return {
      scanId,
      status: outcome.ok ? "done" : "failed",
      components: outcome.ok ? outcome.result.components.length : 0,
    };
  },
);
