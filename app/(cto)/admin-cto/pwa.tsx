"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { ADMIN_PAGES_CACHE, ADMIN_PWA_SCOPE, ADMIN_SW_URL } from "./pwa-config";
import { oublierPrechargement } from "../prechargement";
import {
  appareilApple,
  dejaInstallee,
  safariMac,
  type BeforeInstallPromptEvent,
} from "../pwa-commun";

// ─────────────────────────────────────────────────────────────────────────────
// L'admin installable, côté navigateur.
//
//  - `EnregistrementPwaAdmin` : installe le worker (`sw.js`), en production
//    seulement ; en développement, un worker laissé par un `next start` local
//    est désinscrit.
//  - `InstallationAdmin` : l'invitation à installer, sur mobile ET sur
//    ordinateur (contrairement à l'espace client, réservée au mobile). Une
//    carte dans le flux de la page, pas une bannière flottante : la vue
//    « espace d'un client » a déjà sa barre du bas sur mobile. Trois voies :
//    l'invite native de Chrome/Edge (Android, Windows, macOS, Linux), la
//    marche à suivre sur iPhone/iPad (Partager) et sur Safari Mac (Ajouter au
//    Dock). Firefox n'installe pas : rien ne s'affiche.
//  - `PurgeHorsLigneAdmin` : sur l'écran de connexion, vide les pages gardées
//    pour la lecture hors ligne — elles rassemblent les données de tous les
//    clients, elles ne survivent pas à la session.
// ─────────────────────────────────────────────────────────────────────────────

/** Sur l'écran de connexion : la session est close, les copies partent. */
export function PurgeHorsLigneAdmin() {
  useEffect(() => {
    oublierPrechargement();
    if ("caches" in window) caches.delete(ADMIN_PAGES_CACHE).catch(() => undefined);
  }, []);
  return null;
}

export function EnregistrementPwaAdmin() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistration(ADMIN_PWA_SCOPE)
        .then((registration) => registration?.unregister())
        .catch(() => undefined);
      return;
    }

    navigator.serviceWorker.register(ADMIN_SW_URL, { scope: ADMIN_PWA_SCOPE }).catch((error) => {
      console.warn("[admin-cto] service worker non installé", error);
    });
  }, []);

  return null;
}

const CLE_REFUS = "admin-cto-installation-refusee";
const REFUS_JOURS = 30;

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
    // Sans stockage, la carte reviendra à la prochaine visite : tant pis.
  }
}

type Mode = "native" | "apple" | "safari-mac";

export function InstallationAdmin() {
  const [mode, setMode] = useState<Mode | null>(null);
  const invite = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (dejaInstallee() || refuseeRecemment()) return;

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
    } else if (safariMac()) {
      setMode("safari-mac");
    }

    window.addEventListener("beforeinstallprompt", recevoir);
    window.addEventListener("appinstalled", installee);
    return () => {
      window.removeEventListener("beforeinstallprompt", recevoir);
      window.removeEventListener("appinstalled", installee);
    };
  }, []);

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
      role="region"
      aria-label="Installer la supervision"
      className="mt-6 border border-dark-gray bg-jet/60 px-4 py-3 sm:max-w-xl"
    >
      <div className="flex items-start gap-3">
        <img src="/pwa/admin-bleu-192.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 border border-dark-gray" />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-medium text-foreground">Installer la supervision</p>
          {mode === "native" ? (
            <p className="mt-0.5 font-inter-tight text-xs leading-snug text-mid-gray">
              Une application à part, avec son icône sur l&rsquo;écran d&rsquo;accueil ou dans la
              barre des tâches, qui s&rsquo;ouvre directement sur le pilotage.
            </p>
          ) : mode === "apple" ? (
            <p className="mt-0.5 font-inter-tight text-xs leading-snug text-mid-gray">
              Touchez <Share aria-label="Partager" className="inline h-3.5 w-3.5 align-[-2px]" strokeWidth={1.8} />{" "}
              puis « Sur l&rsquo;écran d&rsquo;accueil ».
            </p>
          ) : (
            <p className="mt-0.5 font-inter-tight text-xs leading-snug text-mid-gray">
              Dans Safari : menu Fichier › « Ajouter au Dock ».
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
