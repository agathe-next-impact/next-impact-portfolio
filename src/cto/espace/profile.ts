import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";

/**
 * Ce que l'espace doit savoir d'un accompagnement pour se composer : ses
 * services et s'il a un site suivi.
 *
 * Lu à chaque page, depuis l'identifiant d'accompagnement de la SESSION —
 * jamais d'un paramètre d'URL. Une requête de plus par page, sur une ligne
 * indexée : le prix d'un espace qui se recompose dès que la fiche Notion
 * change, sans attendre la reconnexion.
 */
export interface ClientProfile {
  services: string[] | null;
  tier: string;
  hasSite: boolean;
  /** Vrai si un client Sentinelle est relié (colonne Notion « ID Sentinelle »). */
  hasSentinelle: boolean;
  /** État de l'accompagnement : les suggestions ne s'adressent qu'à un accompagnement actif. */
  status: string;
  /** Début du contrat, pour la fin d'engagement de « Votre accompagnement ». */
  contractStart: Date | null;
  /** Formule du suivi et maintenance : Essentiel, Actif, ou rien. */
  suiviFormule: string | null;
  /** Fin des mois de suivi inclus dans un forfait. */
  suiviInclusJusquau: Date | null;
  /** Case « Sans suggestions » de la fiche. */
  suggestionsCoupees: boolean;
  /** Date d'ouverture de chaque service coché (code → ISO). */
  servicesOuverts: Record<string, string>;
  /** Ouverture de l'espace (création de l'accompagnement) : départ du mois de veille offerte. */
  ouverture: Date;
}

export async function clientProfile(clientId: string): Promise<ClientProfile> {
  const [row] = await db()
    .select({
      services: ctoClients.services,
      tier: ctoClients.tier,
      projectId: ctoClients.wpUmbrellaProjectId,
      sentinelleClientId: ctoClients.sentinelleClientId,
      status: ctoClients.status,
      contractStart: ctoClients.contractStart,
      suiviFormule: ctoClients.suiviFormule,
      suiviInclusJusquau: ctoClients.suiviInclusJusquau,
      suggestionsCoupees: ctoClients.suggestionsCoupees,
      servicesOuverts: ctoClients.servicesOuverts,
      createdAt: ctoClients.createdAt,
    })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);

  return {
    services: row?.services ?? null,
    tier: row?.tier ?? "direction",
    hasSite: Boolean(row?.projectId),
    hasSentinelle: Boolean(row?.sentinelleClientId),
    status: row?.status ?? "actif",
    contractStart: row?.contractStart ?? null,
    suiviFormule: row?.suiviFormule ?? null,
    suiviInclusJusquau: row?.suiviInclusJusquau ?? null,
    suggestionsCoupees: row?.suggestionsCoupees ?? false,
    servicesOuverts: row?.servicesOuverts ?? {},
    ouverture: row?.createdAt ?? new Date(),
  };
}
