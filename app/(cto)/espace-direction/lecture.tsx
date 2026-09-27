import type { ReactNode } from "react";
import { Label } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// La lecture d'un document long : audit, proposition.
//
// Même règle que le reste de l'espace, à l'échelle d'un document : ce qui
// résume est ouvert (synthèse), le reste est replié en chapitres, et un
// sommaire reste à portée pendant toute la lecture — dans la marge sur grand
// écran, en tête et dépliable sur téléphone. Un chapitre visé par le sommaire
// s'ouvre de lui-même (`OuvrirAncre`, monté dans le gabarit).
// ─────────────────────────────────────────────────────────────────────────────

export interface EntreeSommaire {
  href: string;
  texte: string;
}

/** Le document et son sommaire. Le sommaire suit la lecture sur grand écran. */
export function LectureLongue({
  sommaire,
  label,
  children,
}: {
  sommaire: EntreeSommaire[];
  /** Nom accessible du sommaire : « Parties de l'audit ». */
  label: string;
  children: ReactNode;
}) {
  if (sommaire.length < 2) return <>{children}</>;

  const liens = (
    <ol className="space-y-1.5">
      {sommaire.map((entree) => (
        <li key={entree.href}>
          <a
            href={entree.href}
            className="block font-inter-tight text-sm leading-snug text-mid-gray underline-offset-4 transition-colors hover:text-accent-secondary hover:underline"
          >
            {entree.texte}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-10">
      {/* Téléphone et tablette : le sommaire en tête, replié. */}
      <details className="group mb-6 border border-dark-gray lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
          <Label>Sommaire · {sommaire.length} parties</Label>
          <span aria-hidden className="font-mono text-sm text-mid-gray group-open:text-accent-secondary">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <nav aria-label={label} className="border-t border-dark-gray px-4 py-3">
          {liens}
        </nav>
      </details>

      <div className="min-w-0">{children}</div>

      {/* Grand écran : dans la marge, et il reste en vue. */}
      <aside className="hidden lg:block">
        <nav aria-label={label} className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-dark-gray pl-4">
          <Label>Sommaire</Label>
          <div className="mt-3">{liens}</div>
        </nav>
      </aside>
    </div>
  );
}

/**
 * Un chapitre replié derrière son titre. `ouvert` pour ce qui résume (la
 * synthèse) ; le reste se déplie à la demande ou depuis le sommaire.
 */
export function Chapitre({
  id,
  titre,
  icone,
  ouvert = false,
  children,
}: {
  id: string;
  titre: string;
  icone?: string | null;
  ouvert?: boolean;
  children: ReactNode;
}) {
  return (
    <details id={id} open={ouvert} className="group mt-6 scroll-mt-8 border-b border-dark-gray first:mt-0">
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <h2 className="font-sans text-xl font-light text-foreground">
          {icone ? <span aria-hidden>{icone} </span> : null}
          {titre}
        </h2>
        <span aria-hidden className="shrink-0 font-mono text-sm text-mid-gray group-open:text-accent-secondary">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="pb-8">{children}</div>
    </details>
  );
}
