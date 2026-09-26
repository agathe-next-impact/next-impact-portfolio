import { eq, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, stackItems } from "@sentinelle/db/schema";
import { clientSubscribed, inngest } from "@sentinelle/inngest";
import { planProvision, type ExistingClient, type ProvisionRequest } from "./plan";

// ─────────────────────────────────────────────────────────────────────────────
// Exécution d'un plan de provisionnement.
//
// L'analyse du site ne se fait jamais dans la requête : elle prend des
// secondes, et c'est la synchro de l'espace qui attend. On émet l'événement
// d'ouverture d'abonnement (le même qu'après un paiement Stripe), sans
// bienvenue : Inngest analyse, importe, et retente en cas de panne passagère.
// ─────────────────────────────────────────────────────────────────────────────

export type ProvisionResult =
  | { ok: true; id: string; outcome: "created" | "updated" | "adopted" | "deactivated" | "unchanged"; scanning: boolean }
  | { ok: false; status: 400 | 404 | 409; reason: string };

async function loadExisting(where: ReturnType<typeof eq>): Promise<ExistingClient | null> {
  const [row] = await db()
    .select({
      id: clients.id,
      email: clients.email,
      name: clients.name,
      company: clients.company,
      siteUrl: clients.siteUrl,
      sector: clients.sector,
      active: clients.active,
      components: sql<number>`(select count(*) from ${stackItems} where ${stackItems.clientId} = ${clients.id})`,
    })
    .from(clients)
    .where(where)
    .limit(1);
  return row ? { ...row, components: Number(row.components) } : null;
}

async function emailTakenByAnother(email: string, id: string): Promise<boolean> {
  const [row] = await db().select({ id: clients.id }).from(clients).where(eq(clients.email, email)).limit(1);
  return Boolean(row && row.id !== id);
}

async function queueScan(clientId: string): Promise<void> {
  await inngest.send(clientSubscribed.create({ clientId, welcome: false }));
}

export async function provisionClient(request: ProvisionRequest): Promise<ProvisionResult> {
  const existing = request.id
    ? await loadExisting(eq(clients.id, request.id))
    : request.active
      ? await loadExisting(eq(clients.email, request.email.trim().toLowerCase()))
      : null;

  const plan = planProvision(request, existing);

  switch (plan.kind) {
    case "reject":
      return { ok: false, status: plan.status, reason: plan.reason };

    case "noop":
      return { ok: true, id: plan.id, outcome: "unchanged", scanning: false };

    case "deactivate":
      // Même geste qu'une résiliation Stripe : la date fait courir la rétention.
      await db()
        .update(clients)
        .set({ active: false, deactivatedAt: new Date() })
        .where(eq(clients.id, plan.id));
      return { ok: true, id: plan.id, outcome: "deactivated", scanning: false };

    case "create": {
      const [row] = await db()
        .insert(clients)
        .values({ ...plan.values, active: true })
        .returning({ id: clients.id });
      await queueScan(row.id);
      return { ok: true, id: row.id, outcome: "created", scanning: true };
    }

    case "update": {
      if (plan.patch.email && (await emailTakenByAnother(plan.patch.email, plan.id))) {
        return { ok: false, status: 409, reason: "cette adresse est déjà celle d'un autre client Sentinelle" };
      }
      if (Object.keys(plan.patch).length > 0) {
        await db()
          .update(clients)
          .set({ ...plan.patch, ...(plan.patch.active ? { deactivatedAt: null } : {}) })
          .where(eq(clients.id, plan.id));
      }
      if (plan.scan) await queueScan(plan.id);
      return {
        ok: true,
        id: plan.id,
        outcome: plan.adopted ? "adopted" : "updated",
        scanning: plan.scan,
      };
    }
  }
}
