"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setSyncEnabled } from "@cto/admin";
import { requireSession } from "../session";

// ─────────────────────────────────────────────────────────────────────────────
// Actions serveur de l'admin de supervision.
//
// **Revérifie la session.** Une action serveur est une URL publique : la garde
// du layout (`pilotage/layout.tsx`) protège l'affichage, pas l'exécution.
// Oublier ce contrôle ici laisserait quiconque connaît le nom de l'action
// couper la synchro d'un client sans être connecté.
// ─────────────────────────────────────────────────────────────────────────────

export async function basculerSynchro(formData: FormData): Promise<void> {
  await requireSession();

  const clientId = String(formData.get("clientId"));
  const enabled = formData.get("next") === "actif";

  await setSyncEnabled(clientId, enabled);

  revalidatePath(`/admin-cto/pilotage/clients/${clientId}`);
  revalidatePath("/admin-cto/pilotage");
  redirect(`/admin-cto/pilotage/clients/${clientId}`);
}
