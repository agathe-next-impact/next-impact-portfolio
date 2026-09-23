import { redirect } from "next/navigation";
import { hasSession, HOME_PATH, LOGIN_PATH } from "./session";

export const dynamic = "force-dynamic";

/**
 * `/admin-cto` seul n'affiche rien en propre — la connexion vit sous
 * `/connexion`, le tableau de bord sous `/pilotage` (comme `/admin/sentinelle`
 * pour l'autre produit). Sans cette page, l'URL « évidente » à taper ou à
 * garder en favori 404ait faute de route exacte à ce segment.
 */
export default async function AdminCtoRootPage() {
  redirect((await hasSession()) ? HOME_PATH : LOGIN_PATH);
}
