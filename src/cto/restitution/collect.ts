import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";
import { history, listForClient, type Deliverable } from "../deliverables";
import { lettersForClient, type LetterSummary } from "../letters";
import { siteReportsFor, type SiteReport } from "../site";

// ─────────────────────────────────────────────────────────────────────────────
// Ce que contient un dossier de restitution.
//
// Tout ce que l'accompagnement a produit et qui est encore publié, avec
// l'historique complet de chaque livrable corrigé. C'est la clause de
// restitution de CTO_TERMS rendue exécutable : le client repart avec un
// document qui « se lit sans moi », sans compte à ouvrir nulle part.
//
// Les versions de retrait n'y figurent pas comme contenu, mais l'historique
// d'un livrable corrigé puis retiré n'est pas réécrit : ce qui a été
// communiqué reste lisible dans la section des corrections.
// ─────────────────────────────────────────────────────────────────────────────

export interface RestitutionData {
  company: string;
  tier: string;
  generatedAt: Date;
  items: Deliverable[];
  /** Historique complet des livrables corrigés (version > 1), le plus récent en tête. */
  corrections: { current: Deliverable; versions: Deliverable[] }[];
  letters: LetterSummary[];
  reports: SiteReport[];
}

/** Toutes les lettres encore en base pour ce client, sans la fenêtre de six mois. */
const TOUTES_LES_ARCHIVES = 120;

export async function collectRestitution(clientId: string): Promise<RestitutionData> {
  const [[client], items, letters, reports] = await Promise.all([
    db()
      .select({ company: ctoClients.company, tier: ctoClients.tier })
      .from(ctoClients)
      .where(eq(ctoClients.id, clientId))
      .limit(1),
    listForClient(clientId),
    lettersForClient(clientId, TOUTES_LES_ARCHIVES),
    siteReportsFor(clientId),
  ]);

  const corrigés = items.filter((item) => item.version > 1);
  const corrections = await Promise.all(
    corrigés.map(async (current) => ({
      current,
      versions: await history(current.notionPageId, clientId),
    })),
  );

  return {
    company: client?.company ?? "Accompagnement",
    tier: client?.tier ?? "direction",
    generatedAt: new Date(),
    items,
    corrections,
    letters,
    reports,
  };
}
