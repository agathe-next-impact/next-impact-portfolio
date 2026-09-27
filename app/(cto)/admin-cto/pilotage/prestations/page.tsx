import type { Metadata } from "next";
import Link from "next/link";
import { listClients } from "@cto/admin";
import { listPrestations } from "@cto/deliverables";
import { TableauPrestations } from "../../../espace-direction/prestations";
import { BackLink, Label, Panel } from "../../../espace-direction/ui";
import { PILOTAGE_LARGEUR } from "../largeur";

export const metadata: Metadata = { title: "Prestations" };
export const dynamic = "force-dynamic";

/**
 * Le suivi des prestations vendues, de leur tarif et de leurs règlements,
 * tous accompagnements confondus.
 *
 * Le corps de l'écran est celui que chaque client voit dans Contrats →
 * Prestations (`espace-direction/prestations.tsx`), pour ses seules lignes.
 * Lecture seule — la source reste la base « Prestations » de Notion,
 * synchronisée comme les autres livrables.
 */
export default async function PrestationsPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;
  const [toutes, clients] = await Promise.all([listPrestations(), listClients()]);

  const entreprise = new Map(clients.map((row) => [row.id, row.company]));
  const avecPrestations = clients
    .filter((row) => toutes.some((item) => item.clientId === row.id))
    .sort((a, b) => a.company.localeCompare(b.company, "fr"));

  const items = client ? toutes.filter((item) => item.clientId === client) : toutes;

  return (
    <main className={PILOTAGE_LARGEUR}>
      <BackLink href="/admin-cto/pilotage">Tous les accompagnements</BackLink>

      <div className="mt-6">
        <Label>Suivi commercial</Label>
        <h1 className="mt-2 font-sans text-2xl font-light text-foreground sm:text-3xl">
          Prestations{client ? ` · ${entreprise.get(client) ?? "accompagnement inconnu"}` : ""}
        </h1>
        <p className="mt-3 max-w-prose font-inter-tight text-sm text-mid-gray">
          Les missions vendues, leur tarif, leur avancement et leurs règlements. Chaque client voit
          les siennes, à l&rsquo;identique, dans Contrats → Prestations de son espace (si le service
          « Prestations en cours » est coché). Pour corriger une ligne, passer par sa page Notion.
        </p>
      </div>

      {avecPrestations.length > 1 ? (
        <nav aria-label="Filtrer par accompagnement" className="mt-6 flex flex-wrap gap-2">
          <Filtre href="/admin-cto/pilotage/prestations" actif={!client}>
            Tous
          </Filtre>
          {avecPrestations.map((row) => (
            <Filtre
              key={row.id}
              href={`/admin-cto/pilotage/prestations?client=${row.id}`}
              actif={client === row.id}
            >
              {row.company}
            </Filtre>
          ))}
        </nav>
      ) : null}

      {items.length === 0 ? (
        <Panel className="mt-10 px-5 py-6">
          <p className="font-inter-tight text-base text-mid-gray">
            Aucune prestation publiée. Elles viennent de la base « Prestations » de l&rsquo;atelier
            Notion, au balayage suivant leur publication.
          </p>
        </Panel>
      ) : (
        <TableauPrestations
          items={items}
          admin={{
            // Le nom de l'accompagnement n'a de sens que si la liste en mélange plusieurs.
            accompagnement: client
              ? undefined
              : (item) => (
                  <Link
                    href={`/admin-cto/pilotage/clients/${item.clientId}`}
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    {entreprise.get(item.clientId) ?? "Accompagnement inconnu"}
                  </Link>
                ),
          }}
        />
      )}
    </main>
  );
}

function Filtre({ href, actif, children }: { href: string; actif: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
        actif
          ? "border-accent-secondary text-foreground"
          : "border-dark-gray text-mid-gray hover:border-accent-secondary hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
