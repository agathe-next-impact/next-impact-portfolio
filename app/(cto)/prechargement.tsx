"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { dejaInstallee } from "./pwa-commun";

// ─────────────────────────────────────────────────────────────────────────────
// Préchargement hors ligne, commun aux deux applications installées.
//
// Une fois la page affichée (et la session donc ouverte : ce composant ne se
// monte que derrière la garde), on confie au service worker les liens de la
// page qui restent dans l'application — le menu, les cartes, les listes. Il les
// charge en arrière-plan (`sw-commun.ts`, message `precharger`) : l'application
// s'ouvre ensuite hors ligne sur des écrans jamais visités sur cet appareil.
//
// Au plus une fois par demi-heure et par écran, et seulement en ligne sur une
// connexion qui ne demande pas l'économie de données. Dans l'application
// installée, le lecteur de pièces est préchargé avec.
// ─────────────────────────────────────────────────────────────────────────────

const INTERVALLE_MS = 30 * 60 * 1000;
const CLE = "cto-prechargement";

function dejaFait(cle: string): boolean {
  try {
    const journal = JSON.parse(sessionStorage.getItem(CLE) ?? "{}") as Record<string, number>;
    if (Date.now() - (journal[cle] ?? 0) < INTERVALLE_MS) return true;
    journal[cle] = Date.now();
    sessionStorage.setItem(CLE, JSON.stringify(journal));
    return false;
  } catch {
    return false;
  }
}

/** Oublie les préchargements faits : à la fermeture de session, avec le cache. */
export function oublierPrechargement() {
  try {
    sessionStorage.removeItem(CLE);
  } catch {
    // Stockage indisponible : rien n'a été noté.
  }
}

export function PrechargementHorsLigne({ portee }: { portee: string }) {
  const chemin = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const connexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!navigator.onLine || connexion?.saveData) return;

    let annule = false;
    // Après le rendu, et sans concurrencer ce que l'écran charge lui-même.
    const minuteur = window.setTimeout(async () => {
      const inscription = await navigator.serviceWorker.ready;
      if (annule || !inscription.active || dejaFait(chemin)) return;

      const adresses = new Set<string>();
      for (const lien of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
        const url = new URL(lien.href, window.location.href);
        if (url.origin !== window.location.origin) continue;
        if (url.pathname !== portee && !url.pathname.startsWith(`${portee}/`)) continue;
        url.hash = "";
        adresses.add(url.pathname + url.search);
      }
      inscription.active.postMessage({ type: "precharger", adresses: [...adresses] });

      // Le lecteur de pièces (`lecteur-pdf.tsx`) et son worker, pour qu'un PDF
      // déjà gardé s'affiche aussi hors ligne : le worker les met en cache au
      // passage. Dans l'application installée seulement, là où le lecteur sert.
      if (dejaInstallee() && !dejaFait("lecteur-pdf")) {
        void import("pdfjs-dist/legacy/build/pdf.mjs").catch(() => undefined);
        void fetch(new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url)).catch(() => undefined);
      }
    }, 2500);

    return () => {
      annule = true;
      window.clearTimeout(minuteur);
    };
  }, [chemin, portee]);

  return null;
}
