import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";

/**
 * Ce que l'espace doit savoir d'un accompagnement pour se composer : ses
 * services et s'il a un site suivi.
 *
 * Lu à chaque page, depuis l'identifiant d'accompagnement de la SESSION —
 * jamais d'un paramètre d'URL. Une requête de plus par page, sur une ligne
 * indexée : le prix d'un espace qui se recompose dès que la fiche Notion
 * change, sans attendre la reconnexion.
 */
export interface ClientProfile {
  services: string[] | null;
  tier: string;
  hasSite: boolean;
}

export async function clientProfile(clientId: string): Promise<ClientProfile> {
  const [row] = await db()
    .select({
      services: ctoClients.services,
      tier: ctoClients.tier,
      projectId: ctoClients.wpUmbrellaProjectId,
    })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);

  return {
    services: row?.services ?? null,
    tier: row?.tier ?? "direction",
    hasSite: Boolean(row?.projectId),
  };
}
