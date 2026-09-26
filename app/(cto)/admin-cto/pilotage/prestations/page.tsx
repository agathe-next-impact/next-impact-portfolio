import type { Metadata } from "next";
import Link from "next/link";
import { listClients } from "@cto/admin";
import { listPrestations, type Deliverable } from "@cto/deliverables";
import { deadlineTone } from "../../../espace-direction/livrables";
import { BackLink, formatAmount, formatDay, Label, Panel, Stat, Tag, type Tone } from "../../../espace-direction/ui";
import { PILOTAGE_LARGEUR } from "../largeur";

export const metadata: Metadata = { title: "Prestations" };
export const dynamic = "force-dynamic";

/** Ordre de lecture : ce qui est en cours d'abord. */
const STATUTS = ["En cours", "À venir", "Suspendue", "Terminée"] as const;
const SANS_STATUT = "Sans statut";

const TONE: Record<string, Tone> = {
  "En cours": "attention",
  "À venir": "neutre",
  Suspendue: "alerte",
  Terminée: "fait",
};

/** L'adresse de la page dans l'atelier : c'est là qu'une prestation se corrige. */
function notionHref(pageId: string): string {
  return `https://www.notion.so/${pageId.replace(/-/g, "")}`;
}

function somme(items: Deliverable<"prestation">[]): number {
  return items.reduce((total, item) => total + (item.payload.montant ?? 0), 0);
}

/**
 * Le suivi des prestations vendues et de leur tarif, tous accompagnements
 * confondus.
 *
 * Réservé à l'administration : une prestation n'apparaît plus dans l'espace
 * client (cf. `ADMIN_ONLY_KINDS` dans `@cto/deliverables`). Lecture seule —
 * la source reste la base « Prestations » de Notion, synchronisée comme les
 * autres livrables.
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
  const now = Date.now();

  // Un statut inconnu (renommé dans Notion) tombe dans « Sans statut » : la
  // ligne reste visible, son étiquette garde le libellé d'origine.
  const groupeDe = (item: Deliverable<"prestation">): string =>
    (STATUTS as readonly string[]).includes(item.payload.statut ?? "") ? item.payload.statut! : SANS_STATUT;
  const groupes = [...STATUTS, SANS_STATUT]
    .map((statut) => ({
      statut,
      items: items
        .filter((item) => groupeDe(item) === statut)
        // Livraison la plus proche d'abord ; sans date, en fin de groupe.
        .sort((a, b) => (a.occurredAt?.getTime() ?? Infinity) - (b.occurredAt?.getTime() ?? Infinity)),
    }))
    .filter((groupe) => groupe.items.length > 0);

  const parStatut = (statut: string) => items.filter((item) => item.payload.statut === statut);
  const enCours = parStatut("En cours");
  const aVenir = parStatut("À venir");
  const terminees = parStatut("Terminée");
  const montant = (valeur: number) => formatAmount(valeur) ?? "0 €";

  return (
    <main className={PILOTAGE_LARGEUR}>
      <BackLink href="/admin-cto/pilotage">Tous les accompagnements</BackLink>

      <div className="mt-6">
        <Label>Suivi commercial</Label>
        <h1 className="mt-2 font-sans text-2xl font-light text-foreground sm:text-3xl">
          Prestations{client ? ` · ${entreprise.get(client) ?? "accompagnement inconnu"}` : ""}
        </h1>
        <p className="mt-3 max-w-prose font-inter-tight text-sm text-mid-gray">
          Les missions vendues, leur tarif et leur avancement. Visible ici seulement : l&rsquo;espace
          client ne montre ni ces prestations ni leurs montants. Pour corriger une ligne, passer par
          sa page Notion.
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

      <Panel className="mt-8 grid grid-cols-2 sm:grid-cols-4">
        <Stat
          label="En cours"
          value={montant(somme(enCours))}
          hint={`${enCours.length} prestation${enCours.length > 1 ? "s" : ""} · HT`}
          tone={enCours.length > 0 ? "attention" : "neutre"}
        />
        <Stat
          label="À venir"
          value={montant(somme(aVenir))}
          hint={`${aVenir.length} prestation${aVenir.length > 1 ? "s" : ""} · HT`}
        />
        <Stat
          label="Terminées"
          value={montant(somme(terminees))}
          hint={`${terminees.length} prestation${terminees.length > 1 ? "s" : ""} · HT`}
          tone={terminees.length > 0 ? "fait" : "neutre"}
        />
        <Stat
          label="Total"
          value={montant(somme(items))}
          hint={`${items.length} prestation${items.length > 1 ? "s" : ""} · HT, suspendues comprises`}
        />
      </Panel>

      {groupes.length === 0 ? (
        <Panel className="mt-10 px-5 py-6">
          <p className="font-inter-tight text-base text-mid-gray">
            Aucune prestation publiée. Elles viennent de la base « Prestations » de l&rsquo;atelier
            Notion, au balayage suivant leur publication.
          </p>
        </Panel>
      ) : null}

      {groupes.map((groupe) => (
        <section key={groupe.statut} className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <Label>
              {groupe.statut} ({groupe.items.length})
            </Label>
            <span className="font-mono text-[11px] text-mid-gray">{montant(somme(groupe.items))} HT</span>
          </div>

          <div className="mt-4 divide-y divide-dark-gray border border-dark-gray">
            {groupe.items.map((item) => {
              const payload = item.payload;
              const prix = formatAmount(payload.montant);
              const debut = payload.debut ? new Date(payload.debut) : null;
              const avancement =
                typeof payload.avancement === "number"
                  ? Math.max(0, Math.min(100, Math.round(payload.avancement * 100)))
                  : null;
              const echeance = payload.statut === "Terminée" ? "neutre" : deadlineTone(item.occurredAt, now);

              return (
                <article key={item.id} className="px-4 py-4">
                  <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      <h2 className="font-inter-tight text-base leading-snug text-foreground">{item.title}</h2>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                        {client ? null : (
                          <Link
                            href={`/admin-cto/pilotage/clients/${item.clientId}`}
                            className="underline underline-offset-4 hover:text-foreground"
                          >
                            {entreprise.get(item.clientId) ?? "Accompagnement inconnu"}
                          </Link>
                        )}
                        {item.version > 1 ? `${client ? "" : " · "}version ${item.version}` : null}
                      </p>
                    </div>
                    <p className="font-sans text-lg font-light text-foreground">
                      {prix ? `${prix} HT` : <span className="text-mid-gray">Tarif non renseigné</span>}
                    </p>
                  </header>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <Tag tone={TONE[payload.statut ?? ""] ?? "neutre"}>{payload.statut ?? SANS_STATUT}</Tag>
                    {debut ? <Tag>{`Depuis le ${formatDay(debut)}`}</Tag> : null}
                    {item.occurredAt ? (
                      <Tag tone={echeance}>{`Livraison ${formatDay(item.occurredAt)}`}</Tag>
                    ) : null}
                  </div>

                  {avancement !== null ? (
                    <div className="mt-4 max-w-md">
                      <div className="flex items-baseline justify-between">
                        <Label>Avancement</Label>
                        <span className="font-mono text-[11px] text-foreground">{avancement} %</span>
                      </div>
                      <div
                        className="mt-1.5 h-1.5 w-full bg-dark-gray"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={avancement}
                        aria-label={`Avancement de ${item.title}`}
                      >
                        <div className="h-full bg-accent-secondary" style={{ width: `${avancement}%` }} />
                      </div>
                    </div>
                  ) : null}

                  {payload.detail ? (
                    <p className="mt-3 max-w-prose font-inter-tight text-sm leading-relaxed text-mid-gray">
                      {payload.detail}
                    </p>
                  ) : null}

                  <p className="mt-3 flex flex-wrap gap-4">
                    {payload.devis ? <LienExterne href={payload.devis}>Voir le devis ↗</LienExterne> : null}
                    <LienExterne href={notionHref(item.notionPageId)}>Ouvrir dans Notion ↗</LienExterne>
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ))}
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

function LienExterne({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
    >
      {children}
    </a>
  );
}
