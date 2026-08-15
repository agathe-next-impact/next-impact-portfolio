import Link from "next/link";
import { listQueue } from "@sentinelle/admin";
import { formatDateTime, Label, Notice, Panel } from "../ui";

export const dynamic = "force-dynamic";

/**
 * File de validation — un client par ligne.
 *
 * Ce que cette page doit dire en trois secondes : qui attend, depuis combien de
 * temps, et combien de rouges. Le détail se lit dans le dossier du client ; ici,
 * on décide seulement par quoi commencer.
 */
export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const { ok, erreur } = await searchParams;
  const queue = await listQueue();

  const total = queue.reduce((sum, client) => sum + client.pending, 0);
  const pretes = queue.reduce((sum, client) => sum + client.ready, 0);
  const sansTexte = queue.reduce((sum, client) => sum + client.withoutText, 0);

  return (
    <main className="pt-10">
      {(ok || erreur) && (
        <div className="mb-8">
          <Notice tone={ok ? "ok" : "erreur"} message={ok ?? erreur ?? ""} />
        </div>
      )}

      <Label>№ 01 · File de validation</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        {total === 0 ? "Rien à relire" : `${total} alerte${total > 1 ? "s" : ""} en attente`}
      </h1>
      <p className="mt-3 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray">
        {total === 0
          ? "La collecte tourne tous les jours à 6 h. Ce qu'elle trouvera atterrira ici."
          : `${pretes} déjà validée${pretes > 1 ? "s" : ""} et prête${pretes > 1 ? "s" : ""} à partir · ${sansTexte} sans texte rédigé.`}
      </p>

      {queue.length > 0 && (
        <Panel className="mt-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-dark-gray text-left">
                {["Client", "En attente", "Rouges", "Prêtes", "Sans texte", "Plus ancienne"].map(
                  (entete) => (
                    <th
                      key={entete}
                      className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
                    >
                      {entete}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {queue.map((client) => (
                <tr key={client.clientId} className="border-b border-dark-gray/60 last:border-0">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/sentinelle/clients/${client.clientId}`}
                      className="font-inter-tight text-base text-foreground underline decoration-dark-gray underline-offset-4 transition-colors hover:decoration-accent-secondary"
                    >
                      {client.company ?? client.name}
                    </Link>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                      {client.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      {!client.active && " · résilié"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-foreground">{client.pending}</td>
                  <td className="px-4 py-4 font-mono text-sm">
                    <span className={client.verdicts.red > 0 ? "text-[#ff8a7a]" : "text-mid-gray"}>
                      {client.verdicts.red}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm">
                    <span className={client.ready > 0 ? "text-[#7fd8a4]" : "text-mid-gray"}>
                      {client.ready}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-mid-gray">
                    {client.withoutText}
                  </td>
                  <td className="px-4 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {client.oldestPendingAt ? formatDateTime(client.oldestPendingAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      <p className="mt-8 max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
        Une alerte sans texte n'est pas un bug : la rédaction traite vingt
        alertes par passe, en commençant par les rouges. Le reste attend la passe
        du lendemain.
      </p>
    </main>
  );
}
