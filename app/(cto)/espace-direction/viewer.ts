import { accessDecision, type ClientStatus, type ResolvedSession } from "@cto/access";
import { ESPACE_PATH } from "./session";

// ─────────────────────────────────────────────────────────────────────────────
// Qui regarde quel espace.
//
// Les écrans de l'espace ne lisent jamais la session directement : ils
// reçoivent un `Viewer`. C'est ce qui permet de rendre EXACTEMENT les mêmes
// écrans dans deux contextes :
//
//  - le client, depuis sa session (`viewerFromSession`) — base
//    `/espace-direction` ;
//  - l'admin de supervision, pour un accompagnement choisi (`adminViewer`) —
//    base `/admin-cto/pilotage/clients/<id>/espace`.
//
// La base n'est pas un détail de présentation : le cookie admin ne circule
// que sous `/admin-cto`, celui du client que sous `/espace-direction`. Un lien
// qui sortirait de sa base ramènerait l'admin à un écran de connexion client.
//
// Garde-fou : `clientId` vient TOUJOURS d'une source vérifiée — la session du
// client, ou un identifiant d'URL lu derrière la garde de l'admin. Aucun écran
// ne le prend ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

export interface Viewer {
  clientId: string;
  company: string;
  /** Null pour l'admin : il ne se connecte pas « en tant que » quelqu'un. */
  personId: string | null;
  personName: string | null;
  personRole: string | null;
  /** Bandeau d'état (suspendu, restitution…), tel que le client le voit. */
  notice: string | null;
  /** Préfixe de tous les liens internes. */
  base: string;
  admin: boolean;
}

export function viewerFromSession(session: ResolvedSession): Viewer {
  return {
    clientId: session.person.clientId,
    company: session.person.company,
    personId: session.person.id,
    personName: session.person.name,
    personRole: session.person.role,
    notice: session.decision.notice,
    base: ESPACE_PATH,
    admin: false,
  };
}

/** Le chemin de la vue admin d'un accompagnement. */
export function adminEspacePath(clientId: string): string {
  return `/admin-cto/pilotage/clients/${clientId}/espace`;
}

/**
 * La vue admin d'un accompagnement.
 *
 * À n'appeler que derrière la garde de l'admin (layout `/admin-cto/pilotage`
 * pour les pages, `requireAdmin` pour les routes).
 */
export function adminViewer(client: { id: string; company: string; status: ClientStatus }): Viewer {
  return {
    clientId: client.id,
    company: client.company,
    personId: null,
    personName: null,
    personRole: null,
    notice: accessDecision(client.status).notice,
    base: adminEspacePath(client.id),
    admin: true,
  };
}
