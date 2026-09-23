import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENT_LABELS, listForClient } from "@cto/access";
import { listForClient as listDeliverables } from "@cto/deliverables";
import { lettersForClient } from "@cto/letters";
import { clientDetail } from "@cto/admin";
import { BackLink, Dot, buttonClass, formatDate, Label, Panel, Tag, type Tone } from "../../../../espace-direction/ui";
import { Livrables } from "../../../../espace-direction/livrables";
import { DerniereLettre } from "../../../../espace-direction/lettre";
import { basculerSynchro } from "../../actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
  restitution: "Restitution",
  clos: "Clos",
};

const STATUS_TONE: Record<string, Tone> = {
  actif: "fait",
  suspendu: "attention",
  restitution: "attention",
  clos: "neutre",
};

const TIER_LABEL: Record<string, string> = {
  referent: "Référent",
  direction: "Direction",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await clientDetail(id);
  return { title: detail ? detail.company : "Accompagnement" };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, journal, deliverables, lettres] = await Promise.all([
    clientDetail(id),
    listForClient(id, 100),
    listDeliverables(id),
    lettersForClient(id),
  ]);

  if (!detail) notFound();

  return (
    <main>
      <BackLink href="/admin-cto/pilotage">Tous les accompagnements</BackLink>

      <header className="mt-6 border-b border-dark-gray pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Dot tone={STATUS_TONE[detail.status]} label={STATUS_LABEL[detail.status]} />
          <h1 className="font-sans text-2xl font-light text-foreground sm:text-3xl">
            {detail.company}
          </h1>
          {!detail.syncEnabled ? <Tag tone="attention">Synchro Notion en pause</Tag> : null}
        </div>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {TIER_LABEL[detail.tier] ?? detail.tier} · {STATUS_LABEL[detail.status]} depuis le{" "}
          {formatDate(detail.statusChangedAt)}
          {detail.sector ? ` · ${detail.sector}` : ""} · accompagnement créé le{" "}
          {formatDate(detail.createdAt)}
        </p>
      </header>

      <section className="mt-10">
        <Label>Ce que ce client voit dans son espace</Label>
        <p className="mt-2 font-inter-tight text-sm text-mid-gray">
          Même vue « à la une » que sur son accueil, en lecture seule. Les liens « Tout
          voir » et « Lire la lettre » mènent à l&rsquo;espace client lui-même et exigent
          sa propre connexion — normal, ils ne sont pas faits pour être suivis d&rsquo;ici.
        </p>
        <DerniereLettre lettres={lettres} />
        <Livrables items={deliverables} since={null} />
      </section>

      <section className="mt-10">
        <Panel className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <Label>Synchro Notion</Label>
            <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">
              {detail.syncEnabled
                ? "Les livrables publiés dans l'atelier remontent normalement dans l'espace de ce client."
                : "En pause : les livrables déjà publiés restent affichés tels quels ; rien de nouveau ne remonte et aucune notification ne part pour cet accompagnement."}
            </p>
          </div>
          <form action={basculerSynchro}>
            <input type="hidden" name="clientId" value={detail.id} />
            <input type="hidden" name="next" value={detail.syncEnabled ? "suspendu" : "actif"} />
            <button
              type="submit"
              className={detail.syncEnabled ? buttonClass.ghost : buttonClass.primary}
            >
              {detail.syncEnabled ? "Mettre en pause" : "Réactiver la synchro"}
            </button>
          </form>
        </Panel>
      </section>

      <section className="mt-10">
        <Label>Personnes ({detail.persons.length})</Label>
        <div className="mt-4 divide-y divide-dark-gray border border-dark-gray">
          {detail.persons.map((person) => (
            <div
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-4"
            >
              <div>
                <p className="font-inter-tight text-base text-foreground">
                  {person.name}
                  {person.role ? <span className="text-mid-gray"> — {person.role}</span> : null}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  {person.email} · arrivée le {formatDate(person.createdAt)}
                </p>
              </div>

              {person.revokedAt ? (
                <Tag>Révoquée le {formatDate(person.revokedAt)}</Tag>
              ) : (
                <Tag tone={person.openSessions > 0 ? "fait" : "neutre"}>
                  {person.openSessions} session{person.openSessions !== 1 ? "s" : ""}
                </Tag>
              )}
            </div>
          ))}

          {detail.persons.length === 0 ? (
            <p className="px-4 py-6 font-inter-tight text-sm text-mid-gray">
              Aucune personne rattachée.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <Label>Journal de cet accompagnement</Label>
        <div className="mt-4 divide-y divide-dark-gray border border-dark-gray">
          {journal.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div className="flex items-center gap-3">
                <Dot
                  tone={row.event === "acces_refuse" ? "alerte" : "neutre"}
                  label={EVENT_LABELS[row.event]}
                />
                <div>
                  <p className="font-inter-tight text-sm text-foreground">{EVENT_LABELS[row.event]}</p>
                  {row.detail ? (
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                      {row.detail}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="shrink-0 font-mono text-[11px] text-mid-gray">{formatDate(row.at)}</p>
            </div>
          ))}

          {journal.length === 0 ? (
            <p className="px-4 py-6 font-inter-tight text-sm text-mid-gray">
              Aucun événement encore.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <Panel className="p-4">
          <Label>Modifier le statut, ajouter ou révoquer une personne</Label>
          <p className="mt-2 font-inter-tight text-sm text-mid-gray">
            Volontairement absent de cet écran — voir « Exploitation courante » dans{" "}
            <code className="font-mono text-[12px]">
              docs/cto-externalise/espace-client-mise-en-place.md
            </code>
            .
          </p>
        </Panel>
      </section>
    </main>
  );
}
