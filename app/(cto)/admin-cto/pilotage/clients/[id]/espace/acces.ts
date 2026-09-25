import { clientDetail } from "@cto/admin";
import { adminViewer, type Viewer } from "../../../../../espace-direction/viewer";

/** Un identifiant d'accompagnement bien formé. Filtré AVANT toute requête. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * La vue admin d'un accompagnement, ou null s'il n'existe pas.
 *
 * Ne vérifie PAS la session admin : les pages sont gardées par le layout de
 * `/admin-cto/pilotage`, les routes le font elles-mêmes (un Route Handler
 * n'hérite d'aucun layout).
 */
export async function viewerForClient(id: string): Promise<Viewer | null> {
  if (!UUID.test(id)) return null;
  const detail = await clientDetail(id);
  return detail ? adminViewer(detail) : null;
}
