import { notFound } from "next/navigation";
import { getDigestDetail } from "@sentinelle/admin";
import { previewNewsletterEmail } from "@sentinelle/emails/render";
import { isQuietIssue } from "@sentinelle/newsletter";
import { enregistrerNumero, envoyerNumero, validerNumero } from "../../actions";
import {
  BackLink,
  buttonClass,
  formatDateTime,
  Label,
  Notice,
  Panel,
  StatusBadge,
} from "../../../ui";

export const dynamic = "force-dynamic";

const champ =
  "mt-2 w-full border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base leading-relaxed text-foreground focus:border-accent-secondary focus:outline-none";

/**
 * Relecture d'un numéro.
 *
 * Seuls les deux blocs rédigés sont modifiables. Les trois autres (état, delta,
 * radar) viennent de la base : les rendre éditables inviterait à corriger un
 * chiffre faux dans le texte plutôt que dans la donnée — et le numéro suivant
 * répéterait l'erreur.
 */
export default async function DigestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const { id } = await params;
  const { ok, erreur } = await searchParams;

  const numero = await getDigestDetail(id);
  if (!numero) notFound();

  const apercu = await previewNewsletterEmail({
    blocks: numero.blocks,
    siteUrl: numero.client.siteUrl,
  });

  const modifiable = numero.status === "draft" || numero.status === "validated";
  const calme = isQuietIssue(numero.blocks);

  return (
    <main className="pt-10">
      <BackLink href="/admin/sentinelle/numeros">Numéros</BackLink>

      {(ok || erreur) && (
        <div className="mt-6">
          <Notice tone={ok ? "ok" : "erreur"} message={ok ?? erreur ?? ""} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          numéro {numero.period}
        </span>
        <StatusBadge status={numero.status} />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
          {numero.client.company ?? numero.client.name} · {numero.client.email}
          {numero.sentAt ? ` · envoyé le ${formatDateTime(numero.sentAt)}` : ""}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)]">
        <div>
          <Panel className="p-5">
            <Label>Les faits du numéro · non modifiables</Label>
            <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {numero.blocks.health.components.length} composant(s) suivi(s) ·{" "}
              {numero.blocks.delta.alerts.length} alerte(s) envoyée(s) sur la période ·{" "}
              {numero.blocks.delta.newComponents.length} nouveau(x) composant(s) ·{" "}
              {numero.blocks.radar.length} échéance(s) au radar.
            </p>
            {calme && (
              <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                Quinzaine sans événement. Le numéro part quand même : c'est ce que
                l'abonnement finance, et un silence non expliqué ressemble à un
                oubli.
              </p>
            )}
          </Panel>

          <form className="mt-8">
            <input type="hidden" name="digestId" value={numero.id} />

            <div>
              <label htmlFor="watch">
                <Label>3 · La veille du moment</Label>
              </label>
              <textarea
                id="watch"
                name="watch"
                rows={8}
                defaultValue={numero.blocks.watch}
                className={champ}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="reco">
                <Label>4 · La recommandation du numéro</Label>
              </label>
              <textarea
                id="reco"
                name="reco"
                rows={4}
                defaultValue={numero.blocks.reco}
                className={champ}
              />
            </div>

            {modifiable ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="submit" formAction={enregistrerNumero} className={buttonClass.ghost}>
                  Enregistrer
                </button>
                <button type="submit" formAction={validerNumero} className={buttonClass.primary}>
                  Enregistrer et valider
                </button>
              </div>
            ) : (
              <p className="mt-8 font-inter-tight text-sm text-mid-gray">
                Numéro envoyé : le texte n'est plus modifiable.
              </p>
            )}
          </form>

          {numero.status === "validated" && (
            <form action={envoyerNumero} className="mt-6">
              <input type="hidden" name="digestId" value={numero.id} />
              <button type="submit" className={buttonClass.primary}>
                Envoyer à {numero.client.email}
              </button>
            </form>
          )}

          {numero.status === "draft" && (
            <p className="mt-4 max-w-xl font-inter-tight text-sm leading-relaxed text-mid-gray">
              La validation fige le rendu HTML : c'est exactement ce document qui
              partira, et c'est lui qu'un litige exhumera.
            </p>
          )}
        </div>

        <aside>
          <Label>Aperçu · dernière version enregistrée</Label>
          <iframe
            title="Aperçu du numéro"
            srcDoc={apercu}
            sandbox=""
            className="mt-3 h-[820px] w-full border border-dark-gray bg-obsidian"
          />
        </aside>
      </div>
    </main>
  );
}
