import { redirect } from "next/navigation";
import { ESPACE_PATH } from "../session";

export const dynamic = "force-dynamic";

/**
 * Ancienne adresse, gardée pour les favoris et les anciens e-mails : le suivi
 * des prestations et de leur tarif vit désormais dans l'administration
 * (`/admin-cto/pilotage/prestations`), cf. `LEGACY_SLUGS` dans `@cto/espace`.
 */
export default function Page() {
  redirect(`${ESPACE_PATH}/missions`);
}
