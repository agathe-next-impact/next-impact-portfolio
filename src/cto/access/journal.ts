import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { ctoAccessLog } from "../db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Journal d'accès.
//
// Il sert deux usages qui ne se confondent pas, et c'est le second qui justifie
// son existence : montrer au client ce qui se passe sur son espace, et te
// permettre de répondre le jour où quelqu'un demande qui a consulté quoi. Sur un
// espace qui porte des contrats, des budgets et les détenteurs d'accès d'un
// système, cette question finira par être posée.
//
// Deux règles :
//  - **on consigne aussi les refus.** Un journal qui ne garde que les succès ne
//    raconte rien d'un incident.
//  - **une écriture de journal ne fait jamais échouer l'action qu'elle décrit.**
//    Une base momentanément indisponible ne doit pas empêcher une connexion
//    légitime ; on perd une ligne, on ne ferme pas la porte.
// ─────────────────────────────────────────────────────────────────────────────

export type AccessEvent =
  | "connexion_lien"
  | "connexion_passkey"
  | "passkey_ajoutee"
  | "passkey_supprimee"
  | "session_fermee"
  | "session_revoquee"
  | "acces_refuse";

export interface AccessEntry {
  event: AccessEvent;
  personId?: string | null;
  clientId?: string | null;
  detail?: string | null;
}

/** Consigne un événement. N'échoue jamais bruyamment : voir l'en-tête. */
export async function record(entry: AccessEntry): Promise<void> {
  try {
    await db().insert(ctoAccessLog).values({
      event: entry.event,
      personId: entry.personId ?? null,
      clientId: entry.clientId ?? null,
      // Tronqué : un détail est une précision lisible, pas une pièce jointe.
      detail: entry.detail?.slice(0, 300) ?? null,
    });
  } catch (error) {
    console.error("[cto] écriture du journal impossible", error);
  }
}

export interface JournalRow {
  id: string;
  event: AccessEvent;
  detail: string | null;
  at: Date;
}

/**
 * Le journal d'une personne, le plus récent d'abord.
 *
 * Volontairement borné : cet écran sert à repérer une connexion qu'on ne
 * reconnaît pas, pas à auditer une année. L'audit complet se fait côté admin.
 */
export async function listForPerson(
  personId: string,
  limit = 20,
): Promise<JournalRow[]> {
  const rows = await db()
    .select({
      id: ctoAccessLog.id,
      event: ctoAccessLog.event,
      detail: ctoAccessLog.detail,
      at: ctoAccessLog.at,
    })
    .from(ctoAccessLog)
    .where(eq(ctoAccessLog.personId, personId))
    .orderBy(desc(ctoAccessLog.at))
    .limit(limit);

  return rows as JournalRow[];
}

/** Le journal de tout un accompagnement, toutes personnes confondues. */
export async function listForClient(clientId: string, limit = 100): Promise<JournalRow[]> {
  const rows = await db()
    .select({
      id: ctoAccessLog.id,
      event: ctoAccessLog.event,
      detail: ctoAccessLog.detail,
      at: ctoAccessLog.at,
    })
    .from(ctoAccessLog)
    .where(eq(ctoAccessLog.clientId, clientId))
    .orderBy(desc(ctoAccessLog.at))
    .limit(limit);

  return rows as JournalRow[];
}

/** Libellés lisibles, pour l'affichage. */
/**
 * Quand cette personne s'était connectée AVANT la fois en cours.
 *
 * Sert à répondre « qu'est-ce qui a bougé depuis ? » sur un espace qu'on ouvre
 * deux fois par mois. Rend `null` à la toute première connexion, où la question
 * n'a pas de sens.
 *
 * On lit la connexion précédente, et non un horodatage de dernière page vue :
 * suivre les vues supposerait d'écrire à chaque chargement, c'est-à-dire de
 * tracer la navigation d'un client sur son propre espace. Le journal existe
 * déjà, il est annoncé, et il suffit. La contrepartie est assumée : quelqu'un
 * qui ne se déconnecte jamais voit la fenêtre s'élargir — il verra donc PLUS de
 * nouveautés, jamais moins, ce qui est le bon sens de l'erreur.
 */
export async function previousLoginAt(personId: string): Promise<Date | null> {
  const rows = await db()
    .select({ at: ctoAccessLog.at })
    .from(ctoAccessLog)
    .where(
      and(
        eq(ctoAccessLog.personId, personId),
        inArray(ctoAccessLog.event, ["connexion_lien", "connexion_passkey"]),
      ),
    )
    .orderBy(desc(ctoAccessLog.at))
    .limit(2);

  // [0] est la connexion en cours : c'est la PRÉCÉDENTE qui borne la fenêtre.
  return rows[1]?.at ?? null;
}

export const EVENT_LABELS: Record<AccessEvent, string> = {
  connexion_lien: "Connexion par lien de secours",
  connexion_passkey: "Connexion par passkey",
  passkey_ajoutee: "Appareil ajouté",
  passkey_supprimee: "Appareil supprimé",
  session_fermee: "Déconnexion",
  session_revoquee: "Appareil déconnecté à distance",
  acces_refuse: "Tentative refusée",
};
