import * as React from "react";

// Titre h1 des pages d'atterrissage du mega menu : il reprend mot pour mot le
// titre du panneau (le besoin, dit à la première personne), lu dans sa source
// (lib/situations.ts ou lib/mega-menu.ts). La portion `accent` passe à
// l'accent, selon la convention de PageHero (`<em>` accent-secondary).
export function BesoinTitle({ phrase, accent }: { phrase: string; accent: string }) {
  const idx = phrase.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return <>{phrase}</>;
  return (
    <>
      {phrase.slice(0, idx)}
      <em className="font-normal not-italic text-accent-secondary">
        {phrase.slice(idx, idx + accent.length)}
      </em>
      {phrase.slice(idx + accent.length)}
    </>
  );
}
