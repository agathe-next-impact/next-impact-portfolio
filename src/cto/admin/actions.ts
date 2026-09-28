import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoPersons } from "../db/schema";
import { issueMagicLink, markInvited, sendLoginLink } from "../access";

// ─────────────────────────────────────────────────────────────────────────────
// Les écritures de l'admin de supervision.
//
// `overview.ts` est lecture seule par choix (voir son en-tête) : changer un
// statut ou révoquer une personne se fait dans l'atelier Notion, pas ici.
// Deux gestes font exception, parce qu'ils reviennent à chaque accompagnement
// et n'ont pas de colonne Notion où vivre :
//
//  - mettre la synchro en pause, le temps de relire ce qui est publié ;
//  - envoyer le premier lien de connexion d'une personne. La synchro crée
//    l'accès mais n'envoie jamais d'e-mail ; ce bouton remplace
//    `npm run cto:invite --client …` pour tout accès déjà créé depuis Notion.
//
// Le lancement de la synchro et de la notification, lui, n'écrit rien de plus
// que les commandes du même nom : les actions serveur appellent les mêmes
// fonctions (`syncFromNotion`, `notifyPendingPublications`).
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

export type AccessLinkOutcome =
  | { ok: true; email: string }
  | { ok: false; reason: string };

/**
 * Envoie un lien de connexion à une personne existante — l'invitation.
 *
 * Mêmes garde-fous que l'écran de connexion : personne révoquée ou
 * accompagnement clos, rien ne part ; plafond de liens par fenêtre respecté
 * (`issueMagicLink`). Le message est le lien de connexion ordinaire : il ne
 * porte aucun contenu de l'espace. Le jeton ne quitte jamais cette fonction
 * autrement que par l'e-mail.
 */
export async function sendAccessLink(personId: string, origin: string): Promise<AccessLinkOutcome> {
  const [person] = await db()
    .select({
      id: ctoPersons.id,
      email: ctoPersons.email,
      name: ctoPersons.name,
      revokedAt: ctoPersons.revokedAt,
      status: ctoClients.status,
    })
    .from(ctoPersons)
    .innerJoin(ctoClients, eq(ctoPersons.clientId, ctoClients.id))
    .where(eq(ctoPersons.id, personId))
    .limit(1);

  if (!person) return { ok: false, reason: "Personne introuvable." };
  if (person.revokedAt) {
    return { ok: false, reason: "Accès révoqué : décocher « Révoquée » dans Notion, puis synchroniser." };
  }
  if (person.status === "clos") {
    return { ok: false, reason: "Accompagnement clos : plus aucun accès possible." };
  }

  const issued = await issueMagicLink(person.id);
  if (!issued.ok) {
    return { ok: false, reason: "Trop de liens demandés pour cette personne ces dernières minutes. Réessayer plus tard." };
  }

  const url = `${origin}/espace-direction/connexion?jeton=${encodeURIComponent(issued.token)}`;
  await sendLoginLink({ email: person.email, name: person.name }, url);
  // Invitée à la main : « Prévenir » ne lui enverra pas de bienvenue en plus.
  await markInvited(person.id);
  return { ok: true, email: person.email };
}
