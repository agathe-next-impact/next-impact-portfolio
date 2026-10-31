import type { EspaceContext } from "./shell";
import { Label, Panel } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Le cartouche « Notes » : ce que l'atelier tient à dire au client, saisi à la
// main dans la colonne Notion « Notes client » de sa fiche. Affiché sur
// l'accueil et sur l'écran Actions ; rien à afficher, rien de rendu.
//
// Texte brut : chaque ligne est un paragraphe, une ligne vide les sépare.
// ─────────────────────────────────────────────────────────────────────────────

export function CarteNotes({ context }: { context: EspaceContext }) {
  const notes = context.profile.notesClient?.trim();
  if (!notes) return null;

  const paragraphes = notes.split(/\n+/).map((ligne) => ligne.trim()).filter(Boolean);

  return (
    <section aria-labelledby="notes-client-titre" className="mt-10">
      <Panel className="border-l-2 border-l-accent-secondary px-5 py-5">
        <h2 id="notes-client-titre">
          <Label>Notes de votre interlocutrice</Label>
        </h2>
        <div className="mt-3 max-w-prose space-y-2 font-inter-tight text-base leading-relaxed text-foreground">
          {paragraphes.map((paragraphe, index) => (
            <p key={index}>{paragraphe}</p>
          ))}
        </div>
      </Panel>
    </section>
  );
}
