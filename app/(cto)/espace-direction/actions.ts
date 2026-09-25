"use server";

import { redirect } from "next/navigation";
import { record } from "@cto/access";
import { currentSession, endSession, ESPACE_PATH } from "./session";

/**
 * Déconnexion, partagée par toutes les pages de l'espace.
 *
 * Une action serveur est une URL publique : elle relit la session pour son
 * propre compte au lieu de faire confiance à la page qui a affiché le bouton.
 */
export async function deconnexion(): Promise<void> {
  const courante = await currentSession();
  if (courante) {
    await record({
      event: "session_fermee",
      personId: courante.person.id,
      clientId: courante.person.clientId,
    });
  }
  await endSession();
  redirect(ESPACE_PATH);
}
