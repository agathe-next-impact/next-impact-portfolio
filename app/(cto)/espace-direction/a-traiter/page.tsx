import { redirect } from "next/navigation";
import { ESPACE_PATH } from "../session";

export const dynamic = "force-dynamic";

/**
 * Ancienne adresse, gardée pour les favoris et les anciens e-mails : « À traiter » fait désormais partie de la page Actions.
 * (cf. `LEGACY_SLUGS` dans `@cto/espace`).
 */
export default function Page() {
  redirect(`${ESPACE_PATH}/agir#a-traiter`);
}
