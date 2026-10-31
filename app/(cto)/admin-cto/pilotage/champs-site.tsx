// ─────────────────────────────────────────────────────────────────────────────
// Les champs d'un site, communs à la création d'un client et à l'édition d'un
// site existant. Les noms (`site.<n>.<champ>`) sont lus par `lireSites`
// (`actions-clients.ts`).
// ─────────────────────────────────────────────────────────────────────────────

export interface ValeursSite {
  name?: string;
  url?: string;
  wpUmbrellaProjectId?: number | null;
  watch?: boolean;
  suiviFormule?: string | null;
  sansSuivi?: boolean;
}

const champ =
  "mt-1 w-full border border-dark-gray bg-transparent px-3 py-2 font-inter-tight text-sm text-foreground placeholder:text-mid-gray/50 focus:border-accent-secondary focus:outline-none";
const etiquette = "font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray";

export function ChampsSite({ n, valeurs = {} }: { n: number; valeurs?: ValeursSite }) {
  const nom = (suffixe: string) => `site.${n}.${suffixe}`;
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <label className="sm:col-span-2">
        <span className={etiquette}>Nom</span>
        <input name={nom("name")} defaultValue={valeurs.name ?? ""} placeholder="Boutique" className={champ} />
      </label>
      <label className="sm:col-span-2">
        <span className={etiquette}>Adresse du site</span>
        <input name={nom("url")} defaultValue={valeurs.url ?? ""} placeholder="exemple.fr" className={champ} />
      </label>
      <label className="sm:col-span-2">
        <span className={etiquette}>ID projet WP Umbrella</span>
        <input
          name={nom("projet")}
          defaultValue={valeurs.wpUmbrellaProjectId ?? ""}
          inputMode="numeric"
          placeholder="facultatif"
          className={champ}
        />
      </label>
      <label className="sm:col-span-2">
        <span className={etiquette}>Formule suivi</span>
        <select name={nom("formule")} defaultValue={valeurs.suiviFormule ?? ""} className={champ}>
          <option value="">Celle du client</option>
          <option value="Essentiel">Essentiel</option>
          <option value="Actif">Actif</option>
        </select>
      </label>
      <label className="flex items-center gap-2 self-end pb-2 font-inter-tight text-sm text-foreground sm:col-span-2">
        <input type="checkbox" name={nom("veille")} defaultChecked={valeurs.watch} />
        Veille technique (Sentinelle)
      </label>
      <label className="flex items-center gap-2 self-end pb-2 font-inter-tight text-sm text-foreground sm:col-span-2">
        <input type="checkbox" name={nom("sansSuivi")} defaultChecked={valeurs.sansSuivi} />
        Sans suivi (ni relevé, ni affichage)
      </label>
    </div>
  );
}
