import Link from "next/link";
import { listDigests } from "@sentinelle/admin";
import { formatDateTime, Label, Notice, Panel, StatusBadge } from "../../ui";

export const dynamic = "force-dynamic";

/**
 * Les numéros de la lettre bimensuelle, du plus récent au plus ancien.
 *
 * Une ligne par client et par période : c'est ce que produit le cron du 1er et
 * du 15. Un numéro sans blocs rédigés n'est pas une anomalie — c'est un numéro
 * dont la rédaction a échoué ou n'a rien pu écrire, et qui attend la main.
 */
export default async function DigestsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const { ok, erreur } = await searchParams;
  const numeros = await listDigests();

  const aRelire = numeros.filter((numero) => numero.status === "draft").length;
  const prets = numeros.filter((numero) => numero.status === "validated").length;

  return (
    <main className="pt-10">
      {(ok || erreur) && (
        <div className="mb-8">
          <Notice tone={ok ? "ok" : "erreur"} message={ok ?? erreur ?? ""} />
        </div>
      )}

      <Label>№ 02 · Lettre bimensuelle</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        {numeros.length === 0 ? "Aucun numéro fabriqué" : `${aRelire} numéro(s) à relire`}
      </h1>
      <p className="mt-3 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray">
        {numeros.length === 0
          ? "Les numéros sont fabriqués le 1er et le 15 à 7 h. Un par client actif."
          : `${prets} validé(s) et prêt(s) à partir. Deux envois par mois, par abonné.`}
      </p>

      {numeros.length > 0 && (
        <Panel className="mt-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-dark-gray text-left">
                {["Période", "Client", "État", "Rédigé", "Envoyé le"].map((entete) => (
                  <th
                    key={entete}
                    className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
                  >
                    {entete}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {numeros.map((numero) => (
                <tr key={numero.id} className="border-b border-dark-gray/60 last:border-0">
                  <td className="px-4 py-4 font-mono text-sm text-foreground">{numero.period}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/sentinelle/numeros/${numero.id}`}
                      className="font-inter-tight text-base text-foreground underline decoration-dark-gray underline-offset-4 transition-colors hover:decoration-accent-secondary"
                    >
                      {numero.company ?? numero.clientName}
                    </Link>
                    {!numero.active && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                        résilié
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={numero.status} />
                  </td>
                  <td className="px-4 py-4 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className={numero.written ? "text-[#7fd8a4]" : "text-[#f5c451]"}>
                      {numero.written ? "oui" : "à écrire"}
                    </span>
                    {/* Les signalements du garde-fou ne bloquent pas, mais ils
                        se lisent avant d'ouvrir : un numéro « oui » avec trois
                        signalements demande plus de relecture qu'un autre. */}
                    {numero.signalements > 0 && (
                      <span className="ml-2 text-[#f5c451]">
                        {numero.signalements} signalement{numero.signalements > 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {numero.sentAt ? formatDateTime(numero.sentAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </main>
  );
}
