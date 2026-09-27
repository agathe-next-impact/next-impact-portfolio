"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// L'accès d'une version de travail : identifiant et mot de passe de l'adresse
// de test, à recopier dans la fenêtre que le navigateur ouvre.
//
// Le mot de passe est masqué à l'affichage, pas au code : la page est déjà
// réservée à la personne connectée, et le masque ne protège que de l'écran
// partagé en visio. « Copier » évite de le lire tout court.
//
// « Afficher » est un `<details>` natif, comme tout le repli de l'espace : il
// marche sans JavaScript. Seul « Copier » en a besoin.
// ─────────────────────────────────────────────────────────────────────────────

const BOUTON =
  "font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:text-accent-secondary";

function Copier({ valeur, libelle }: { valeur: string; libelle: string }) {
  const [copie, setCopie] = useState(false);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(valeur);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission) : la valeur
      // reste sélectionnable à la main.
    }
  };

  return (
    <button type="button" onClick={copier} className={BOUTON} aria-label={`Copier ${libelle}`}>
      <span aria-live="polite">{copie ? "Copié" : "Copier"}</span>
    </button>
  );
}

export function Acces({ identifiant, motDePasse }: { identifiant: string | null; motDePasse: string | null }) {
  if (!identifiant && !motDePasse) return null;

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {identifiant ? (
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">Identifiant</dt>
          <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <code className="break-all font-mono text-sm text-foreground">{identifiant}</code>
            <Copier valeur={identifiant} libelle="l'identifiant" />
          </dd>
        </div>
      ) : null}
      {motDePasse ? (
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">Mot de passe</dt>
          <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-baseline gap-4 [&::-webkit-details-marker]:hidden">
                <code aria-hidden className="font-mono text-sm text-foreground group-open:hidden">
                  ••••••••
                </code>
                <span className={BOUTON}>
                  <span className="group-open:hidden">Afficher</span>
                  <span className="hidden group-open:inline">Masquer</span>
                </span>
              </summary>
              <code className="mt-1 block break-all font-mono text-sm text-foreground">{motDePasse}</code>
            </details>
            <Copier valeur={motDePasse} libelle="le mot de passe" />
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
