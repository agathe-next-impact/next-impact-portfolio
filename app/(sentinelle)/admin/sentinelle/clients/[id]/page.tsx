import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientDossier } from "@sentinelle/admin";
import { ecarterComposant, validerAlerte } from "../../actions";
import {
  BackLink,
  buttonClass,
  formatDateTime,
  Label,
  Notice,
  Panel,
  StatusBadge,
  VerdictBadge,
} from "../../../ui";

export const dynamic = "force-dynamic";

/**
 * Dossier d'un client : ses alertes ouvertes, **groupées par composant**.
 *
 * C'est la leçon du lot 2 : vingt-neuf alertes sur le même paquet npm ne se
 * relisent pas une par une. Le groupe porte donc sa propre décision — « écarter
 * tout ce composant » — et ce qui reste se relit à l'unité.
 */
export default async function ClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const { id } = await params;
  const { ok, erreur } = await searchParams;

  const dossier = await getClientDossier(id);
  if (!dossier) notFound();

  const { client, groups, closed } = dossier;
  const ouvertes = groups.reduce((sum, group) => sum + group.alerts.length, 0);
  const retour = `/admin/sentinelle/clients/${id}`;

  return (
    <main className="pt-10">
      <BackLink href="/admin/sentinelle">File de validation</BackLink>

      {(ok || erreur) && (
        <div className="mt-6">
          <Notice tone={ok ? "ok" : "erreur"} message={ok ?? erreur ?? ""} />
        </div>
      )}

      <div className="mt-6">
        <Label>
          {client.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          {!client.active && " · abonnement résilié"}
        </Label>
        <h1 className="mt-3 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
          {client.company ?? client.name}
        </h1>
        <p className="mt-3 font-inter-tight text-base text-mid-gray">
          {client.email}
          {client.sector ? ` · ${client.sector}` : ""}
        </p>
        {client.notes && (
          <p className="mt-3 max-w-2xl border-l-2 border-dark-gray pl-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
            {client.notes}
          </p>
        )}
      </div>

      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        {ouvertes} alerte{ouvertes > 1 ? "s" : ""} ouverte{ouvertes > 1 ? "s" : ""} ·{" "}
        {groups.length} composant{groups.length > 1 ? "s" : ""}
      </p>

      <div className="mt-6 space-y-6">
        {groups.map((group) => (
          <Panel key={group.stackItemId}>
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-dark-gray px-5 py-4">
              <div>
                <span className="font-inter-tight text-lg text-foreground">{group.label}</span>
                <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                  {group.version ? `v${group.version}` : "version inconnue"} · {group.type}
                  {group.ecosystem ? ` · ${group.ecosystem}` : ""}
                </span>
              </div>

              <form action={ecarterComposant}>
                <input type="hidden" name="clientId" value={client.id} />
                <input type="hidden" name="stackItemId" value={group.stackItemId} />
                <button type="submit" className={buttonClass.danger}>
                  Écarter les {group.alerts.length}
                </button>
              </form>
            </div>

            <ul className="divide-y divide-dark-gray/60">
              {group.alerts.map((alerte) => (
                <li
                  key={alerte.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <VerdictBadge verdict={alerte.verdict} />
                      <StatusBadge status={alerte.status} />
                      {!alerte.hasText && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                          sans texte
                        </span>
                      )}
                      {alerte.reviewed && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                          relu
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/admin/sentinelle/alertes/${alerte.id}`}
                      className="mt-2 block font-inter-tight text-base text-foreground underline decoration-dark-gray underline-offset-4 transition-colors hover:decoration-accent-secondary"
                    >
                      {alerte.title}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                      {alerte.intelSource} · {alerte.intelKind}
                      {alerte.severity ? ` · ${alerte.severity}` : ""} ·{" "}
                      {formatDateTime(alerte.createdAt)}
                    </p>
                  </div>

                  {alerte.status === "draft" && alerte.hasText && (
                    <form action={validerAlerte}>
                      <input type="hidden" name="alertId" value={alerte.id} />
                      <input type="hidden" name="retour" value={retour} />
                      <button type="submit" className={buttonClass.ghost}>
                        Valider
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="mt-6 font-inter-tight text-base text-mid-gray">
          Rien en attente pour ce client.
        </p>
      )}

      {closed.length > 0 && (
        <section className="mt-12">
          <Label>Historique · {closed.length}</Label>
          <ul className="mt-4 divide-y divide-dark-gray/60 border-y border-dark-gray/60">
            {closed.slice(0, 30).map((alerte) => (
              <li key={alerte.id} className="flex flex-wrap items-baseline gap-4 py-3">
                <StatusBadge status={alerte.status} />
                <Link
                  href={`/admin/sentinelle/alertes/${alerte.id}`}
                  className="flex-1 font-inter-tight text-sm text-mid-gray transition-colors hover:text-foreground"
                >
                  {alerte.title}
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                  {formatDateTime(alerte.sentAt ?? alerte.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
