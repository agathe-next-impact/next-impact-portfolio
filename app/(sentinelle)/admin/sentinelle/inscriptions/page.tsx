import Link from "next/link";
import { listSubscriptionRequests } from "@sentinelle/inscriptions";
import { activerInscription, ecarterInscription } from "../actions";
import { buttonClass, formatDateTime, Label, Notice, Panel, StatusBadge } from "../../ui";

export const dynamic = "force-dynamic";

/**
 * Les demandes d'inscription à Sentinelle.
 *
 * Depuis le 2026-09-27, on ne s'abonne plus en ligne : chaque demande (page
 * d'offre ou rapport d'analyse) attend ici. « Activer » crée la fiche, analyse
 * le site (ou reprend le rapport d'origine), ouvre l'espace et envoie la
 * bienvenue. La facturation se règle à part, avant ou après l'activation.
 */
export default async function InscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const { ok, erreur } = await searchParams;
  const { pending, decided } = await listSubscriptionRequests();

  return (
    <main className="pt-10">
      {(ok || erreur) && (
        <div className="mb-8">
          <Notice tone={ok ? "ok" : "erreur"} message={ok ?? erreur ?? ""} />
        </div>
      )}

      <Label>№ 03 · Inscriptions</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        {pending.length === 0
          ? "Aucune demande en attente"
          : `${pending.length} demande${pending.length > 1 ? "s" : ""} à valider`}
      </h1>
      <p className="mt-3 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray">
        Activer crée la fiche et envoie l&apos;e-mail de bienvenue avec le lien vers
        l&apos;espace. Le demandeur ne reçoit rien avant. Pour lui écrire, répondez à
        l&apos;e-mail de notification.
      </p>

      <div className="mt-10 space-y-4">
        {pending.map((demande) => (
          <Panel key={demande.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="font-inter-tight text-lg text-foreground">
                  {demande.organisation}
                  <span className="text-mid-gray"> · {demande.name}</span>
                </p>
                <p className="mt-1 font-inter-tight text-sm text-mid-gray">
                  {demande.email} · {demande.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                  {formatDateTime(demande.createdAt)} ·{" "}
                  {demande.originScanId ? (
                    <Link
                      href={`/scan/${demande.originScanId}`}
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      depuis un rapport d&apos;analyse
                    </Link>
                  ) : (
                    "depuis la page Sentinelle"
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={activerInscription}>
                  <input type="hidden" name="requestId" value={demande.id} />
                  <button type="submit" className={buttonClass.primary}>
                    Activer
                  </button>
                </form>
                <form action={ecarterInscription}>
                  <input type="hidden" name="requestId" value={demande.id} />
                  <button type="submit" className={buttonClass.danger}>
                    Écarter
                  </button>
                </form>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {decided.length > 0 && (
        <section className="mt-14">
          <Label>Dernières demandes traitées</Label>
          <ul className="mt-4 divide-y divide-dark-gray border-y border-dark-gray">
            {decided.map((demande) => (
              <li key={demande.id} className="flex flex-wrap items-center justify-between gap-4 py-3">
                <span className="font-inter-tight text-sm text-foreground">
                  {demande.clientId ? (
                    <Link
                      href={`/admin/sentinelle/clients/${demande.clientId}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {demande.organisation}
                    </Link>
                  ) : (
                    demande.organisation
                  )}
                  <span className="text-mid-gray"> · {demande.email}</span>
                </span>
                <span className="flex items-center gap-3">
                  <StatusBadge status={demande.status} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {demande.decidedAt ? formatDateTime(demande.decidedAt) : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
