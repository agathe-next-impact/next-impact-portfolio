// ─────────────────────────────────────────────────────────────────────────────
// Ce que les deux applications installables du groupe partagent : l'espace
// client (`espace-direction/pwa.tsx`) et l'admin (`admin-cto/pwa.tsx`).
//
// Module neutre (ni client ni serveur) : `CAPTURE_INVITE` est lu par les
// layouts serveur, le reste par les bannières côté client.
// ─────────────────────────────────────────────────────────────────────────────

/** L'événement d'installation de Chromium, absent des types du DOM. */
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    /** Posé par `CAPTURE_INVITE` si l'invite arrive avant l'hydratation. */
    __espaceInvite?: BeforeInstallPromptEvent | null;
  }
}

/**
 * Capte l'invite d'installation dès l'analyse du HTML : Chrome peut l'émettre
 * avant que React ait monté la bannière, et elle ne revient pas.
 */
export const CAPTURE_INVITE = `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__espaceInvite=e;});`;

/** Ouverte depuis l'icône installée (et non dans un onglet). */
export function dejaInstallee(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iPhone, iPod, et iPad — qui se déclare « Macintosh » mais a un écran tactile. */
export function appareilApple(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** Safari sur Mac (17 et plus) : Fichier › Ajouter au Dock, sans invite native. */
export function safariMac(): boolean {
  const ua = navigator.userAgent;
  return (
    /Macintosh/.test(ua) &&
    navigator.maxTouchPoints <= 1 &&
    /Version\/\d+.*Safari/.test(ua) &&
    !/Chrome|Chromium|Edg|Firefox/.test(ua)
  );
}
