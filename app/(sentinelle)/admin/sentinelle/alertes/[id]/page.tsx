import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlertDetail, nextOpenAlertId } from "@sentinelle/admin";
import { previewAlertEmail } from "@sentinelle/emails/render";
import {
  BackLink,
  formatDateTime,
  Label,
  NotionLink,
  Panel,
  StatusBadge,
  VerdictBadge,
} from "../../../ui";

export const dynamic = "force-dynamic";

/**
 * Vue d'une alerte — lecture seule.
 *
 * Depuis 2026-09, une alerte ne se relit ni ne se valide plus ici : c'est dans
 * sa page Notion, où elle a été rédigée, que ce geste se fait — le lien y mène
 * en un clic. Cette page reste utile pour ce qu'elle seule sait montrer : le
 * fait de veille qui l'a déclenchée, et l'aperçu du gabarit d'e-mail avec le
 * contenu tel que la dernière synchro l'a lu.
 */
export default async function AlertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const alerte = await getAlertDetail(id);
  if (!alerte) notFound();

  const suivante = await nextOpenAlertId(alerte.client.id, alerte.id);
  const apercu = await previewAlertEmail({
    content: alerte.content,
    component: { label: alerte.component.label, version: alerte.component.version },
    siteUrl: alerte.client.siteUrl,
    sentAt: new Date(),
  });

  return (
    <main className="pt-10">
      <BackLink href={`/admin/sentinelle/clients/${alerte.client.id}`}>
        {alerte.client.company ?? alerte.client.name}
      </BackLink>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <VerdictBadge verdict={alerte.verdict} />
        <StatusBadge status={alerte.status} />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
          créée le {formatDateTime(alerte.createdAt)}
          {alerte.sentAt ? ` · envoyée le ${formatDateTime(alerte.sentAt)}` : ""}
        </span>
        {suivante && (
          <Link
            href={`/admin/sentinelle/alertes/${suivante}`}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary"
          >
            Alerte suivante →
          </Link>
        )}
        <span className="ml-auto">
          <NotionLink pageId={alerte.notionPageId} />
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)]">
        <div>
          <Panel className="p-5">
            <Label>Le fait de veille</Label>
            <p className="mt-3 font-inter-tight text-base text-foreground">{alerte.intel.title}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
              <div>
                <dt className="inline">source </dt>
                <dd className="inline text-foreground">{alerte.intel.source}</dd>
              </div>
              <div>
                <dt className="inline">nature </dt>
                <dd className="inline text-foreground">{alerte.intel.kind}</dd>
              </div>
              <div>
                <dt className="inline">sévérité </dt>
                <dd className="inline text-foreground">{alerte.intel.severity ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline">publié </dt>
                <dd className="inline text-foreground">
                  {alerte.intel.publishedAt ? formatDateTime(alerte.intel.publishedAt) : "—"}
                </dd>
              </div>
              <div>
                <dt className="inline">versions </dt>
                <dd className="inline text-foreground">{alerte.intel.affectedRange ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline">corrigé en </dt>
                <dd className="inline text-foreground">{alerte.intel.fixedIn ?? "—"}</dd>
              </div>
            </dl>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
              {alerte.component.label}
              {alerte.component.version ? ` · v${alerte.component.version}` : " · version inconnue"}
            </p>
          </Panel>

          <Panel className="mt-6 p-5">
            <Label>Le texte · dernière version connue</Label>
            <p className="mt-3 font-inter-tight text-lg text-foreground">
              {alerte.content.title || "(pas encore rédigé)"}
            </p>
            {alerte.content.body && (
              <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {alerte.content.body}
              </p>
            )}
            {alerte.content.recommendedAction && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                Action recommandée : <span className="text-foreground">{alerte.content.recommendedAction}</span>
              </p>
            )}
            <p className="mt-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
              Toute correction — texte, verdict, statut — se fait dans la page Notion, pas ici.
              La prochaine synchro (toutes les demi-heures) répercute ce qui y aura changé.
            </p>
          </Panel>

          {alerte.generatedText && (
            <details className="mt-8 border border-dark-gray p-4">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                Sortie brute du modèle {alerte.reviewed && "· avant relecture"}
              </summary>
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-mid-gray">
                {alerte.generatedText}
              </pre>
            </details>
          )}
        </div>

        <aside>
          <Label>Aperçu · dernière version synchronisée</Label>
          <iframe
            title="Aperçu de l'e-mail"
            srcDoc={apercu}
            sandbox=""
            className="mt-3 h-[720px] w-full border border-dark-gray bg-obsidian"
          />
          <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
            C'est bien ce document qui partira si l'alerte est validée dans Notion : le même
            gabarit, le même rendu.
          </p>
        </aside>
      </div>
    </main>
  );
}
