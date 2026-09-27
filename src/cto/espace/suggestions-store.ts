import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoPersons } from "../db/schema";

// Les suggestions masquées (« Pas maintenant »), par personne. Une colonne
// jsonb sur la personne plutôt qu'une table : quelques identifiants au plus,
// lus une fois par accueil.

/** Les suggestions masquées par une personne : id → ISO. Vide pour l'admin (pas de personne). */
export async function suggestionsMasquees(personId: string | null): Promise<Record<string, string>> {
  if (!personId) return {};
  const [row] = await db()
    .select({ masquees: ctoPersons.suggestionsMasquees })
    .from(ctoPersons)
    .where(eq(ctoPersons.id, personId))
    .limit(1);
  return row?.masquees ?? {};
}

/** Masque une suggestion pour cette personne, à la date du jour. */
export async function masquerSuggestion(personId: string, suggestionId: string): Promise<void> {
  const masquees = await suggestionsMasquees(personId);
  await db()
    .update(ctoPersons)
    .set({ suggestionsMasquees: { ...masquees, [suggestionId]: new Date().toISOString() } })
    .where(eq(ctoPersons.id, personId));
}
