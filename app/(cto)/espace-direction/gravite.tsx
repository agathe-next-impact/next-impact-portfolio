import type { Gravite } from "@cto/espace";

// Les couleurs de gravité d'un audit, partagées par la synthèse (cases par
// gravité) et les tableaux (badge par ligne) : un « critique » a la même
// couleur partout où il apparaît.

export const GRAVITE_FOND: Record<Gravite, string> = {
  critique: "bg-[#ff8a7a]",
  eleve: "bg-[#f2c94c]",
  modere: "bg-accent-secondary/70",
  faible: "bg-mid-gray/50",
};

export const GRAVITE_TEXTE: Record<Gravite, string> = {
  critique: "text-[#ff8a7a]",
  eleve: "text-[#f2c94c]",
  modere: "text-foreground",
  faible: "text-foreground",
};

const GRAVITE_BORD: Record<Gravite, string> = {
  critique: "border-[#ff8a7a]/60",
  eleve: "border-[#f2c94c]/60",
  modere: "border-accent-secondary/60",
  faible: "border-dark-gray",
};

export const GRAVITE_LABEL: Record<Gravite, string> = {
  critique: "Critique",
  eleve: "Élevée",
  modere: "Modérée",
  faible: "Faible",
};

/** Badge de gravité : pastille carrée + libellé, la couleur n'est jamais seule. */
export function BadgeGravite({ gravite }: { gravite: Gravite }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${GRAVITE_BORD[gravite]} ${GRAVITE_TEXTE[gravite]}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 ${GRAVITE_FOND[gravite]}`} />
      {GRAVITE_LABEL[gravite]}
    </span>
  );
}
