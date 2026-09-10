"use client";

// Ancres « même page » de la navigation.
//
// Le <Link> de next-intl ne fait qu'une navigation de route : quand la
// destination est la page COURANTE avec un hash (/conseil#architecture-projet-ia
// depuis /conseil), l'URL change mais rien ne scrolle. Ce hook rend un handler
// qui scrolle lui-même dans ce cas précis, et laisse passer la navigation
// normale sinon.
//
// À utiliser partout où une destination de nav est une ancre d'offre : mega menu
// desktop (components/mega-menu-panel.tsx), accordéon mobile et CTA du header
// (components/header.tsx). Sans lui, le lien « Audit + roadmap » du mega menu
// mobile était inerte une fois sur /conseil.
//
// prefers-reduced-motion est respecté : saut sec au lieu du défilement animé.

import * as React from "react";

import { usePathname } from "@/i18n/navigation";

export function useSamePageAnchor() {
  const pathname = usePathname();

  return React.useCallback(
    (href: string, e: React.MouseEvent) => {
      const [path, hash] = href.split("#");
      if (!hash || path !== pathname) return;

      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", `#${hash}`);
    },
    [pathname],
  );
}
