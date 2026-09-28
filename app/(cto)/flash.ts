import { cookies } from "next/headers";

// ─────────────────────────────────────────────────────────────────────────────
// Le message de confirmation d'une action, admin et espace client.
//
// L'action serveur le dépose dans un cookie court juste avant de rediriger ; le
// layout du groupe le lit au rendu suivant et l'affiche (`flash-toast.tsx`),
// qui l'efface aussitôt. Un cookie plutôt qu'un paramètre d'URL : le message
// survit à une redirection vers la même page, et ne reste ni dans l'historique
// ni dans un lien copié.
//
// Aucun contenu de l'espace dans ces messages : « Appareil renommé », pas le
// nom de l'appareil. Le cookie n'est pas `httpOnly` — le navigateur doit
// pouvoir l'effacer après l'affichage —, il ne porte donc rien de sensible.
// ─────────────────────────────────────────────────────────────────────────────

export const FLASH_COOKIE = "cto_flash";

export type FlashTone = "succes" | "erreur";

export interface Flash {
  id: string;
  message: string;
  tone: FlashTone;
}

export async function poserFlash(message: string, tone: FlashTone = "succes"): Promise<void> {
  const flash: Flash = { id: Date.now().toString(36), message: message.slice(0, 240), tone };
  (await cookies()).set(FLASH_COOKIE, JSON.stringify(flash), {
    path: "/",
    maxAge: 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function lireFlash(): Promise<Flash | null> {
  const brut = (await cookies()).get(FLASH_COOKIE)?.value;
  if (!brut) return null;
  try {
    const flash = JSON.parse(brut) as Partial<Flash>;
    if (typeof flash.message !== "string" || typeof flash.id !== "string") return null;
    return { id: flash.id, message: flash.message, tone: flash.tone === "erreur" ? "erreur" : "succes" };
  } catch {
    return null;
  }
}
