import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getReceivedIssueHtml, periodLabel } from "@sentinelle/espace";
import { BackLink, formatDate, Label } from "../../ui";
import { currentClientId, ESPACE_PATH } from "../../session";

export const metadata: Metadata = {
  title: "Sentinelle — votre numéro",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Relecture d'un numéro déjà reçu.
 *
 * C'est le HTML **figé à la validation** qui s'affiche, celui-là même qui est
 * parti par e-mail — pas un rendu refait à la volée. Un numéro qui changerait
 * entre la boîte de réception et l'espace ne serait plus une archive.
 *
 * Rendu dans une iframe `sandbox` vide : le document vient de la base et porte
 * ses propres styles de mise en page e-mail. L'isoler évite qu'il déborde sur la
 * page, et le `sandbox` lui retire tout droit d'exécution.
 */
export default async function NumeroPage({ params }: { params: Promise<{ id: string }> }) {
  const clientId = await currentClientId();
  if (!clientId) redirect(ESPACE_PATH);

  const { id } = await params;
  // La propriété du numéro fait partie de la requête, pas d'un contrôle après
  // coup : cette lecture ne peut pas rendre la ligne de quelqu'un d'autre.
  const numero = await getReceivedIssueHtml(clientId, id);
  if (!numero) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <BackLink href={ESPACE_PATH}>Mon espace</BackLink>

      <h1 className="mt-6 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        Numéro du {periodLabel(numero.period)}
      </h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
        {numero.sentAt ? `Envoyé le ${formatDate(numero.sentAt)}` : "Envoyé"}
      </p>

      <div className="mt-10">
        <Label>Tel qu&apos;il vous a été envoyé</Label>
        <iframe
          title={`Numéro du ${periodLabel(numero.period)}`}
          srcDoc={numero.html}
          sandbox=""
          className="mt-3 h-[900px] w-full border border-dark-gray bg-obsidian"
        />
      </div>
    </main>
  );
}
