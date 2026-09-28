"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Le bouton d'envoi des formulaires d'action, admin et espace client.
//
// Pendant le traitement : spinner, libellé d'attente, bouton désactivé — un
// second clic ne relance rien. `useFormStatus` lit l'état du formulaire parent :
// ce bouton se glisse donc dans n'importe quel `<form action={…}>`, y compris
// rendu par une page serveur, sans rien changer à l'action.
//
// Un formulaire à deux boutons (« À blanc » / « Appliquer ») ne fait tourner
// que celui qui a été cliqué : `data.get(name) === value` le désigne.
// ─────────────────────────────────────────────────────────────────────────────

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 animate-spin motion-reduce:animate-none ${className}`}
      fill="none"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BoutonEnvoi({
  children,
  enCours,
  className,
  name,
  value,
  pending: pendingExterne,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  /** Libellé pendant le traitement ; à défaut, celui du bouton. */
  enCours?: ReactNode;
  className: string;
  name?: string;
  value?: string;
  /** Pour un formulaire piloté par `useActionState`, qui connaît déjà son état. */
  pending?: boolean;
  /** Désactivé hors traitement (rien à envoyer). */
  disabled?: boolean;
  onClick?: () => void;
}) {
  const status = useFormStatus();
  const formulaireOccupe = pendingExterne ?? status.pending;
  const clique = name === undefined || status.data === null || status.data.get(name) === value;
  const actif = formulaireOccupe && (pendingExterne !== undefined || clique);

  return (
    <button
      type="submit"
      name={name}
      value={value}
      onClick={onClick}
      disabled={disabled || formulaireOccupe}
      aria-busy={actif || undefined}
      className={`${className} gap-2 ${formulaireOccupe ? "cursor-wait" : ""}`}
    >
      {actif ? <Spinner /> : null}
      <span>{actif && enCours ? enCours : children}</span>
    </button>
  );
}
