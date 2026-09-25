import type { Metadata } from "next";
import Link from "next/link";
import { adminEspacePath } from "../../espace-direction/viewer";
import { EVENT_LABELS } from "@cto/access";
import { listAdminCredentials, listClients, recentAccessLog } from "@cto/admin";
import { Dot, formatDate, Label, Panel, Stat, Tag, type Tone } from "../../espace-direction/ui";
import { AdminPasskeyEnrollButton } from "../passkey";

export const metadata: Metadata = { title: "Tous les accompagnements" };
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

const JOUR_MS = 24 * 60 * 60 * 1000;

/**
 * Vue d'ensemble de tous les accompagnements — le point aveugle comblé.
 *
 * Avant cet écran, répondre à « qui est actif, qui est suspendu ? » demandait
 * d'ouvrir Neon. Lecture seule, volontairement : voir `@cto/admin/overview`
 * pour la raison.
 */
export default async function PilotagePage() {
  const [clients, journal, credentials] = await Promise.all([
    listClients(),
    recentAccessLog(30),
    listAdminCredentials(),
  ]);

  const actifs = clients.filter((client) => client.status === "actif").length;
  const enPause = clients.filter(
    (client) => client.status === "suspendu" || client.status === "restitution",
  ).length;
  const clos = clients.filter((client) => client.status === "clos").length;
  const refusRecents = journal.filter(
    (row) => row.event === "acces_refuse" && Date.now() - row.at.getTime() < JOUR_MS,
  ).length;

  return (
    <main>
      <Label>Vue d&rsquo;ensemble</Label>
      <h1 className="mt-2 font-sans text-2xl font-light text-foreground sm:text-3xl">
        Tous les accompagnements
      </h1>

      <Panel className="mt-8 grid grid-cols-2 sm:grid-cols-4">
        <Stat label="Actifs" value={String(actifs)} tone="fait" />
        <Stat
          label="Suspendus / restitution"
          value={String(enPause)}
          tone={enPause > 0 ? "attention" : "neutre"}
        />
        <Stat label="Clos" value={String(clos)} />
        <Stat
          label="Refus (24 h)"
          value={String(refusRecents)}
          tone={refusRecents > 0 ? "alerte" : "neutre"}
          hint={refusRecents > 0 ? "Voir le journal ci-dessous" : undefined}
        />
      </Panel>

      <section className="mt-12">
        <Label>Accompagnements ({clients.length})</Label>
        <div className="mt-4 divide-y divide-dark-gray border border-dark-gray">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-jet/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                href={`/admin-cto/pilotage/clients/${client.id}`}
                className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
              <div className="flex items-start gap-3">
                <Dot tone={STATUS_TONE[client.status]} label={STATUS_LABEL[client.status]} />
                <div>
                  <p className="font-inter-tight text-base text-foreground">{client.company}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                    {TIER_LABEL[client.tier] ?? client.tier} · depuis le{" "}
                    {formatDate(client.statusChangedAt)}
                    {client.sector ? ` · ${client.sector}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Tag tone={STATUS_TONE[client.status]}>{STATUS_LABEL[client.status]}</Tag>
                {!client.syncEnabled ? <Tag tone="attention">Synchro en pause</Tag> : null}
                <Tag>
                  {client.activePersons} pers.
                  {client.revokedPersons > 0
                    ? ` (+${client.revokedPersons} révoquée${client.revokedPersons > 1 ? "s" : ""})`
                    : ""}
                </Tag>
                <Tag tone={client.openSessions > 0 ? "fait" : "neutre"}>
                  {client.openSessions} session{client.openSessions !== 1 ? "s" : ""}
                </Tag>
                <Tag>{client.lastAccessAt ? formatDate(client.lastAccessAt) : "jamais connecté"}</Tag>
              </div>
              </Link>
              {/* Un second lien, à côté et non dedans : deux liens imbriqués ne
                  sont pas du HTML valide, et le clic irait au hasard. */}
              <Link
                href={adminEspacePath(client.id)}
                className="shrink-0 border border-dark-gray px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:border-accent-secondary hover:text-foreground"
              >
                Voir son espace →
              </Link>
            </div>
          ))}

          {clients.length === 0 ? (
            <p className="px-4 py-6 font-inter-tight text-sm text-mid-gray">
              Aucun accompagnement pour l&rsquo;instant.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-12">
        <Label>Derniers événements</Label>
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
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                    {row.company ?? "—"}
                    {row.personName ? ` · ${row.personName}` : ""}
                    {row.detail ? ` · ${row.detail}` : ""}
                  </p>
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

      <section className="mt-12">
        <Label>Votre accès</Label>
        <Panel className="mt-4 px-5 py-6">
          <p className="font-inter-tight text-base text-foreground">
            {credentials.length === 0
              ? "Aucun appareil enregistré. Enregistrez-en un pour vous connecter d'un geste, sans repasser par votre boîte mail."
              : `${credentials.length} appareil${credentials.length > 1 ? "s" : ""} enregistré${credentials.length > 1 ? "s" : ""}.`}
          </p>
          <div className="mt-5">
            <AdminPasskeyEnrollButton />
          </div>
        </Panel>
      </section>
    </main>
  );
}
