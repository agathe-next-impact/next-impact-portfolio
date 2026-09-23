import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// La seule écriture de l'admin de supervision.
//
// `overview.ts` est lecture seule par choix (voir son en-tête) : à l'échelle
// actuelle, changer un statut ou révoquer une personne reste un geste SQL
// délibéré, pas un bouton pressé par réflexe. La synchro Notion est
// différente : la mettre en pause sert un besoin qui revient à chaque nouvel
// accompagnement — le temps de relire ce qui est publié avant de laisser la
// synchro et ses e-mails partir tout seuls — pas une opération exceptionnelle.
// D'où ce seul interrupteur, ici et nulle part ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Active ou suspend la synchronisation Notion d'un accompagnement.
 *
 * Ne touche ni l'accès du client (`status`), ni ce qui est déjà dans son
 * espace : seulement ce qu'un balayage y ajoute ou en retire ensuite. Détail
 * du gel côté synchro : `src/cto/notion/sync.ts`.
 */
export async function setSyncEnabled(clientId: string, enabled: boolean): Promise<void> {
  await db().update(ctoClients).set({ syncEnabled: enabled }).where(eq(ctoClients.id, clientId));
}
