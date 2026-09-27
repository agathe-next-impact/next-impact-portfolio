import { redirect } from "next/navigation";
import { ESPACE_PATH } from "../session";

export const dynamic = "force-dynamic";

/**
 * Ancienne adresse, gardée pour les favoris et les anciens e-mails : les rapports mensuels sont désormais en bas de l'état du site.
 * (cf. `LEGACY_SLUGS` dans `@cto/espace`).
 */
export default function Page() {
  redirect(`${ESPACE_PATH}/site#rapports`);
}
