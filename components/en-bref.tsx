// Cartouche « L'essentiel » (TL;DR) : résumé autoportant, citable tel quel par
// les moteurs de réponse (GEO). Placé juste avant la FAQ (ADR-024) : il sert
// de synthèse au lecteur qui a parcouru la page, sans occuper le haut de page.
// Sa valeur GEO ne tient pas à sa position : le texte est dans le HTML servi,
// et la classe passée en `className` (`.home-tldr`, `.services-tldr`…) reste
// la cible du SpeakableSpecification (JSON-LD).
//
// Pas de <Reveal> : il rend le bloc à opacity 0 jusqu'au défilement, et un
// moteur qui rend la page sans défiler verrait un texte invisible.

import { BlueprintSection } from "@/components/aspect/section";

export function EnBref({
  className,
  label,
  lines,
  tone = "obsidian",
}: {
  /** Classe cible du SpeakableSpecification, ex. `home-tldr`. */
  className: string;
  label: string;
  lines: readonly string[];
  tone?: "obsidian" | "jet";
}) {
  return (
    <BlueprintSection tone={tone} innerClassName="px-6 py-8 lg:px-10 lg:py-10">
      <aside
        aria-label={label}
        className={`${className} border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 lg:px-8`}
      >
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.18em] text-accent-secondary">
          {label}
        </p>
        <ul className="flex flex-col gap-2">
          {lines.map((line) => (
            <li
              key={line}
              className="font-inter-tight text-base leading-relaxed text-mid-gray"
            >
              {line}
            </li>
          ))}
        </ul>
      </aside>
    </BlueprintSection>
  );
}
