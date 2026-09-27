"use client";

import { useEffect } from "react";

/**
 * Ouvre le bloc replié qu'une ancre vise.
 *
 * Tout l'espace replie le détail dans des `<details>` natifs. Un navigateur
 * ouvre bien un `<details>` quand l'ancre vise un élément À L'INTÉRIEUR, mais
 * pas quand elle vise le `<details>` lui-même — le cas du sommaire d'un audit,
 * des raccourcis « Fait », « Rapports », « Fiche technique ». Ce composant
 * comble l'écart : à l'arrivée sur la page et à chaque changement d'ancre, il
 * ouvre le bloc visé et ceux qui l'englobent, puis y amène la lecture.
 *
 * Rien à afficher, et rien ne casse sans JavaScript : le lien mène alors au
 * titre du bloc, qu'un clic ouvre.
 */
export function OuvrirAncre() {
  useEffect(() => {
    const ouvrir = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const cible = document.getElementById(id);
      if (!cible) return;
      let bloc: HTMLElement | null = cible;
      let ouvert = false;
      while (bloc) {
        if (bloc instanceof HTMLDetailsElement && !bloc.open) {
          bloc.open = true;
          ouvert = true;
        }
        bloc = bloc.parentElement;
      }
      if (ouvert) cible.scrollIntoView({ block: "start" });
    };
    ouvrir();
    window.addEventListener("hashchange", ouvrir);
    return () => window.removeEventListener("hashchange", ouvrir);
  }, []);

  return null;
}
