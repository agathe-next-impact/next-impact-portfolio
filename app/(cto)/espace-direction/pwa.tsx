"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Download, Share, X } from "lucide-react";
import { PAGES_CACHE, PWA_SCOPE, SW_URL } from "./pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// L'application installable, côté navigateur.
//
//  - `EnregistrementPwa` : installe le worker (`sw.js`), en production
//    seulement — en développement, un cache de pages masquerait les
//    modifications. Un worker laissé par un `next start` local est désinscrit.
//  - `BanniereInstallation` : l'invitation à installer, sur mobile et tablette
//    seulement (un bureau a déjà la barre latérale et l'icône d'installation du
//    navigateur). Deux voies : l'invite native de Chrome/Edge/Samsung
//    (`beforeinstallprompt`), et, sur iPhone/iPad qui n'en ont pas, la marche à
//    suivre via le bouton Partager.
//  - `EtatReseau` : dit qu'on lit une copie quand on est hors ligne.
//  - `PurgeHorsLigne` / `viderPagesHorsLigne` : vident les pages en cache à
//    la déconnexion et sur l'écran de connexion — des données de client
//    n'ont rien à faire sur un appareil dont la session est close.
// ─────────────────────────────────────────────────────────────────────────────

/** L'événement d'installation de Chromium, absent des types du DOM. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    /** Posé par le script de `layout.tsx` si l'invite arrive avant l'hydratation. */
    __espaceInvite?: BeforeInstallPromptEvent | null;
  }
}

/**
 * Capte l'invite d'installation dès l'analyse du HTML : Chrome peut l'émettre
 * avant que React ait monté la bannière, et elle ne revient pas.
 */
export const CAPTURE_INVITE = `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__espaceInvite=e;});`;

export async function viderPagesHorsLigne(): Promise<void> {
  try {
    if ("caches" in window) await caches.delete(PAGES_CACHE);
  } catch {
    // Stockage indisponible (navigation privée) : rien n'a été mis en cache.
  }
}

export function EnregistrementPwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistration(PWA_SCOPE)
        .then((registration) => registration?.unregister())
        .catch(() => undefined);
      return;
    }

    navigator.serviceWorker.register(SW_URL, { scope: PWA_SCOPE }).catch((error) => {
      console.warn("[espace] service worker non installé", error);
    });
  }, []);

  return null;
}

/** Sur l'écran de connexion : la session est close, les copies partent. */
export function PurgeHorsLigne() {
  useEffect(() => {
    void viderPagesHorsLigne();
  }, []);
  return null;
}

// ─── Réseau ──────────────────────────────────────────────────────────────

function abonnerReseau(rappel: () => void) {
  window.addEventListener("online", rappel);
  window.addEventListener("offline", rappel);
  return () => {
    window.removeEventListener("online", rappel);
    window.removeEventListener("offline", rappel);
  };
}

export function EtatReseau() {
  const enLigne = useSyncExternalStore(
    abonnerReseau,
    () => navigator.onLine,
    () => true,
  );

  return (
    <div role="status" aria-live="polite">
      {enLigne ? null : (
        <div className="mb-8 border border-[#f2c94c]/45 bg-jet/40 px-4 py-3">
          <p className="font-inter-tight text-sm text-foreground">
            <span className="text-[#f2c94c]">Hors ligne.</span> Vous lisez la dernière version
            enregistrée de cette page. Répondre, arbitrer ou télécharger redeviendra possible au
            retour du réseau.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Installation ────────────────────────────────────────────────────────

const CLE_REFUS = "espace-installation-refusee";
const REFUS_JOURS = 30;

/** Mobile ou tablette : écran étroit, ou pointeur tactile (iPad en paysage). */
const APPAREIL_CIBLE = "(max-width: 1023px), (pointer: coarse)";

function dejaInstallee(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function refuseeRecemment(): boolean {
  try {
    const valeur = Number(localStorage.getItem(CLE_REFUS));
    return Number.isFinite(valeur) && Date.now() - valeur < REFUS_JOURS * 86_400_000;
  } catch {
    return false;
  }
}

function memoriserRefus() {
  try {
    localStorage.setItem(CLE_REFUS, String(Date.now()));
  } catch {
    // Sans stockage, la bannière reviendra à la prochaine visite : tant pis.
  }
}

/** iPhone, iPod, et iPad — qui se déclare « Macintosh » mais a un écran tactile. */
function appareilApple(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

type Mode = "native" | "apple";

export function BanniereInstallation() {
  const [mode, setMode] = useState<Mode | null>(null);
  const invite = useRef<BeforeInstallPromptEvent | null>(null);
  const bloc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dejaInstallee() || refuseeRecemment()) return;
    if (!window.matchMedia(APPAREIL_CIBLE).matches) return;

    function recevoir(event: Event) {
      event.preventDefault();
      invite.current = event as BeforeInstallPromptEvent;
      setMode("native");
    }
    function installee() {
      invite.current = null;
      setMode(null);
    }

    if (window.__espaceInvite) {
      invite.current = window.__espaceInvite;
      window.__espaceInvite = null;
      setMode("native");
    } else if (appareilApple()) {
      setMode("apple");
    }

    window.addEventListener("beforeinstallprompt", recevoir);
    window.addEventListener("appinstalled", installee);
    return () => {
      window.removeEventListener("beforeinstallprompt", recevoir);
      window.removeEventListener("appinstalled", installee);
    };
  }, []);

  // La hauteur de la bannière remonte le bouton « haut de page » d'autant.
  useEffect(() => {
    const racine = document.documentElement;
    const element = bloc.current;
    if (!mode || !element) {
      racine.style.removeProperty("--pwa-banniere");
      return;
    }
    const mesurer = () => racine.style.setProperty("--pwa-banniere", `${element.offsetHeight + 8}px`);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);
    return () => {
      observateur.disconnect();
      racine.style.removeProperty("--pwa-banniere");
    };
  }, [mode]);

  if (!mode) return null;

  function fermer() {
    memoriserRefus();
    setMode(null);
  }

  async function installer() {
    const evenement = invite.current;
    if (!evenement) return;
    await evenement.prompt();
    const { outcome } = await evenement.userChoice;
    invite.current = null;
    if (outcome === "dismissed") memoriserRefus();
    setMode(null);
  }

  return (
    <div
      ref={bloc}
      role="region"
      aria-label="Installer l'application"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 border border-dark-gray bg-jet/95 px-4 py-3 shadow-2xl backdrop-blur sm:left-auto sm:w-[380px] lg:hidden"
    >
      <div className="flex items-start gap-3">
        <img src="/pwa/espace-192.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 border border-dark-gray" />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-medium text-foreground">Installer l&rsquo;espace</p>
          {mode === "native" ? (
            <p className="mt-0.5 font-inter-tight text-xs leading-snug text-mid-gray">
              Une icône sur votre écran d&rsquo;accueil, en plein écran, et les pages déjà
              consultées lisibles hors ligne.
            </p>
          ) : (
            <p className="mt-0.5 font-inter-tight text-xs leading-snug text-mid-gray">
              Touchez <Share aria-label="Partager" className="inline h-3.5 w-3.5 align-[-2px]" strokeWidth={1.8} />{" "}
              puis « Sur l&rsquo;écran d&rsquo;accueil ». Les pages déjà consultées restent
              lisibles hors ligne.
            </p>
          )}
          {mode === "native" ? (
            <button
              type="button"
              onClick={installer}
              className="mt-2.5 inline-flex items-center gap-1.5 border border-accent-secondary bg-accent-secondary px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-obsidian hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary"
            >
              <Download aria-hidden className="h-3.5 w-3.5" strokeWidth={1.8} />
              Installer
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={fermer}
          aria-label="Ne plus proposer pendant 30 jours"
          title="Plus tard"
          className="grid h-8 w-8 shrink-0 place-items-center text-mid-gray hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-secondary"
        >
          <X aria-hidden className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
