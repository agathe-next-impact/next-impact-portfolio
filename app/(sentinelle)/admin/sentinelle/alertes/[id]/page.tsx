import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlertDetail, nextOpenAlertId, VERDICTS } from "@sentinelle/admin";
import { previewAlertEmail } from "@sentinelle/emails/render";
import {
  ecarterAlerte,
  enregistrerAlerte,
  envoyerAlerte,
  rouvrirAlerte,
  validerAlerte,
} from "../../actions";
import {
  BackLink,
  buttonClass,
  formatDateTime,
  Label,
  Notice,
  Panel,
  StatusBadge,
  VerdictBadge,
  VERDICT_LABEL,
} from "../../../ui";

export const dynamic = "force-dynamic";

const champ =
  "mt-2 w-full border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground focus:border-accent-secondary focus:outline-none";

/**
 * Relecture d'une alerte.
 *
 * Trois colonnes de lecture, dans l'ordre du geste : ce que dit la source (on ne
 * relit pas un texte sans savoir d'où il vient), le texte à corriger, et
 * l'aperçu de ce que recevra le client.
 *
 * L'aperçu montre **ce qui est enregistré**, pas ce qui est en train d'être
 * tapé : c'est une page serveur, sans JavaScript. Dit autrement, on voit ce qui
 * partirait si on envoyait maintenant — ce qui est exactement la question posée.
 */
export default async function AlertPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const { id } = await params;
  const { ok, erreur } = await searchParams;

  const alerte = await getAlertDetail(id);
  if (!alerte) notFound();

  const suivante = await nextOpenAlertId(alerte.client.id, alerte.id);
  const apercu = await previewAlertEmail({
    content: alerte.content,
    component: { label: alerte.component.label, version: alerte.component.version },
    siteUrl: alerte.client.siteUrl,
    sentAt: new Date(),
  });

  const retourClient = `/admin/sentinelle/clients/${alerte.client.id}`;
  const modifiable = alerte.status === "draft" || alerte.status === "validated";

  return (
    <main className="pt-10">
      <BackLink href={retourClient}>{alerte.client.company ?? alerte.client.name}</BackLink>

      {(ok || erreur) && (
        <div className="mt-6">
          <Notice tone={ok ? "ok" : "erreur"} message={ok ?? erreur ?? ""} />
        </div>
      )}

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
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary"
          >
            Alerte suivante →
          </Link>
        )}
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

          <form className="mt-8">
            <input type="hidden" name="alertId" value={alerte.id} />

            <Label>Verdict</Label>
            <div className="mt-2 flex flex-wrap gap-4">
              {VERDICTS.map((verdict) => (
                <label
                  key={verdict}
                  className="flex items-center gap-2 font-inter-tight text-sm text-foreground"
                >
                  <input
                    type="radio"
                    name="verdict"
                    value={verdict}
                    defaultChecked={alerte.content.verdict === verdict}
                    className="accent-accent-secondary"
                  />
                  {VERDICT_LABEL[verdict]}
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label htmlFor="title">
                <Label>Titre</Label>
              </label>
              <input
                id="title"
                name="title"
                defaultValue={alerte.content.title}
                className={champ}
                maxLength={120}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="body">
                <Label>Corps · deux à cinq phrases</Label>
              </label>
              <textarea
                id="body"
                name="body"
                rows={7}
                defaultValue={alerte.content.body}
                className={`${champ} leading-relaxed`}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="whatItChanges">
                <Label>Ce que ça change pour ce client</Label>
              </label>
              <textarea
                id="whatItChanges"
                name="whatItChanges"
                rows={3}
                defaultValue={alerte.content.whatItChanges}
                className={`${champ} leading-relaxed`}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="recommendedAction">
                <Label>Action recommandée · commence par un verbe</Label>
              </label>
              <input
                id="recommendedAction"
                name="recommendedAction"
                defaultValue={alerte.content.recommendedAction}
                className={champ}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-6">
              <label className="flex items-center gap-3 font-inter-tight text-sm text-foreground">
                <input
                  type="checkbox"
                  name="diyPossible"
                  defaultChecked={alerte.content.diyPossible}
                  className="accent-accent-secondary"
                />
                Faisable par le client seul
              </label>

              <div className="flex-1">
                <label htmlFor="effortEstimate">
                  <Label>Effort</Label>
                </label>
                <input
                  id="effortEstimate"
                  name="effortEstimate"
                  defaultValue={alerte.content.effortEstimate}
                  placeholder="15 min · 0,5 j de prestation"
                  className={champ}
                />
              </div>
            </div>

            {modifiable ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="submit" formAction={enregistrerAlerte} className={buttonClass.ghost}>
                  Enregistrer
                </button>
                <button type="submit" formAction={validerAlerte} className={buttonClass.primary}>
                  Enregistrer et valider
                </button>
              </div>
            ) : (
              <p className="mt-8 font-inter-tight text-sm text-mid-gray">
                Alerte {alerte.status === "sent" ? "envoyée" : "close"} : le texte n'est plus
                modifiable.
              </p>
            )}
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            {alerte.status === "validated" && (
              <form action={envoyerAlerte}>
                <input type="hidden" name="alertId" value={alerte.id} />
                <input type="hidden" name="retour" value={`/admin/sentinelle/alertes/${id}`} />
                <button type="submit" className={buttonClass.primary}>
                  Envoyer à {alerte.client.email}
                </button>
              </form>
            )}

            {modifiable && (
              <form action={ecarterAlerte}>
                <input type="hidden" name="alertId" value={alerte.id} />
                <input type="hidden" name="retour" value={retourClient} />
                <button type="submit" className={buttonClass.danger}>
                  Écarter
                </button>
              </form>
            )}

            {(alerte.status === "dismissed" || alerte.status === "resolved") && (
              <form action={rouvrirAlerte}>
                <input type="hidden" name="alertId" value={alerte.id} />
                <input type="hidden" name="retour" value={`/admin/sentinelle/alertes/${id}`} />
                <button type="submit" className={buttonClass.ghost}>
                  Remettre dans la file
                </button>
              </form>
            )}
          </div>

          {alerte.status === "draft" && (
            <p className="mt-4 max-w-xl font-inter-tight text-sm leading-relaxed text-mid-gray">
              L'envoi n'apparaît qu'une fois l'alerte validée. Ce n'est pas une
              étape de confort : c'est la règle 4 du produit, et elle est aussi
              vérifiée côté serveur.
            </p>
          )}

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
          <Label>Aperçu · dernière version enregistrée</Label>
          <iframe
            title="Aperçu de l'e-mail"
            srcDoc={apercu}
            sandbox=""
            className="mt-3 h-[720px] w-full border border-dark-gray bg-obsidian"
          />
          <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
            Enregistrez pour rafraîchir l'aperçu. C'est bien ce document qui
            partira : le même gabarit, le même rendu.
          </p>
        </aside>
      </div>
    </main>
  );
}
