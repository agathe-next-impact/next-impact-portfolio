import { notFound } from "next/navigation";
import { getDigestDetail } from "@sentinelle/admin";
import { previewNewsletterEmail } from "@sentinelle/emails/render";
import { isQuietIssue, wordCount } from "@sentinelle/lettre";
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
  "mt-2 w-full border border-dark-gray bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-foreground focus:border-accent-secondary focus:outline-none";

/**
 * Relecture d'un numéro de la lettre de veille.
 *
 * Deux principes, et ils expliquent la forme de l'écran :
 *
 *  · **Ce qui vient de la base ne s'édite pas** — le constaté et le dossier de
 *    collecte sont affichés en lecture seule. Les rendre modifiables inviterait
 *    à corriger un chiffre faux dans le texte plutôt que dans la donnée, et le
 *    numéro suivant répéterait l'erreur.
 *  · **La lettre s'édite en JSON, pas en soixante champs.** Le travail ici est
 *    de relire et de corriger à la marge, pas de réécrire : une zone de texte
 *    unique, relue par le même schéma et les mêmes garde-fous que la sortie du
 *    modèle, dit plus honnêtement ce qui se passe qu'un formulaire qui laisserait
 *    croire à une saisie guidée.
 *
 * L'encart de production est affiché ici et **n'est jamais envoyé** : c'est ce
 * qu'il faut savoir avant de valider — ce que la collecte n'a pas pu voir, ce
 * qui reste à confirmer, ce que le garde-fou a signalé.
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

  const issue = numero.issue;
  const lettre = issue?.lettre ?? null;

  const apercu = lettre
    ? await previewNewsletterEmail({
        lettre,
        siteUrl: numero.client.siteUrl,
        issueDate: new Date(issue!.constate.issueDate),
      })
    : null;

  const modifiable = numero.status === "draft" || numero.status === "validated";
  const calme = issue ? isQuietIssue(issue.constate) : false;
  const mots = lettre ? wordCount(lettre) : 0;

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
          {issue && (
            <Panel className="p-5">
              <Label>Les faits du numéro · non modifiables</Label>
              <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {issue.constate.health.components.length} composant(s) suivi(s) ·{" "}
                {issue.constate.delta.alerts.length} alerte(s) envoyée(s) sur la période ·{" "}
                {issue.constate.delta.newComponents.length} nouveau(x) composant(s) ·{" "}
                {issue.constate.radar.length} échéance(s) au radar.
              </p>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                Collecte : {issue.dossier?.faits.length ?? 0} fait(s) daté(s),{" "}
                {issue.production.consommation.recherches} recherche(s),{" "}
                {issue.production.consommation.lectures} page(s) lue(s)
                {issue.production.consommation.reprises > 0
                  ? `, ${issue.production.consommation.reprises} reprise(s)`
                  : ""}
                . Lettre : {mots} mots.
              </p>
              {calme && (
                <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  Quinzaine sans événement interne. Le numéro part quand même : c'est ce
                  que l'abonnement finance, et un silence non expliqué ressemble à un
                  oubli.
                </p>
              )}
            </Panel>
          )}

          {issue && (
            <Panel className="mt-6 p-5">
              <Label>Encart de production · jamais envoyé</Label>

              {issue.production.erreurs.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {issue.production.erreurs.map((erreurDeProd) => (
                    <li
                      key={erreurDeProd}
                      className="font-inter-tight text-sm leading-relaxed text-[#ff8a7a]"
                    >
                      {erreurDeProd}
                    </li>
                  ))}
                </ul>
              )}

              {issue.production.signalements.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {issue.production.signalements.map((signalement) => (
                    <li
                      key={signalement}
                      className="font-inter-tight text-sm leading-relaxed text-[#f5c451]"
                    >
                      {signalement}
                    </li>
                  ))}
                </ul>
              )}

              {issue.production.aConfirmer.length > 0 && (
                <>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
                    À confirmer avant envoi
                  </p>
                  <ul className="mt-2 space-y-1">
                    {issue.production.aConfirmer.map((entree) => (
                      <li
                        key={entree.point}
                        className="font-inter-tight text-sm leading-relaxed text-mid-gray"
                      >
                        {entree.point} — {entree.sourceAVerifier}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {issue.production.pagesAnalysees.length > 0 && (
                <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  Pages analysées : {issue.production.pagesAnalysees.join(", ")}
                </p>
              )}

              {issue.production.pagesNonAnalysees.length > 0 && (
                <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  Non analysées :{" "}
                  {issue.production.pagesNonAnalysees
                    .map((page) => `${page.url} (${page.raison})`)
                    .join(", ")}
                </p>
              )}

              {issue.production.notesCollecte.trim() !== "" && (
                <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  <span className="text-foreground">Collecte :</span>{" "}
                  {issue.production.notesCollecte}
                </p>
              )}

              {issue.production.notesRedaction.trim() !== "" && (
                <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  <span className="text-foreground">Rédaction :</span>{" "}
                  {issue.production.notesRedaction}
                </p>
              )}
            </Panel>
          )}

          {lettre ? (
            <form className="mt-8">
              <input type="hidden" name="digestId" value={numero.id} />

              <label htmlFor="lettre">
                <Label>La lettre · relue et corrigée ici</Label>
              </label>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                Structure et sourçage sont revérifiés à l'enregistrement : une source
                ajoutée à la main qui ne figure pas au dossier est refusée, comme elle
                le serait venant du modèle.
              </p>
              <textarea
                id="lettre"
                name="lettre"
                rows={30}
                spellCheck={false}
                defaultValue={JSON.stringify(lettre, null, 2)}
                className={champ}
              />

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
          ) : (
            <Panel className="mt-8 p-5">
              <Label>Pas de lettre</Label>
              <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                La fabrication n'a pas abouti pour ce numéro. La raison est dans l'encart
                de production ci-dessus. Supprimer le numéro le fera refabriquer à la
                prochaine passe du cron.
              </p>
            </Panel>
          )}

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
          {apercu ? (
            <iframe
              title="Aperçu du numéro"
              srcDoc={apercu}
              sandbox=""
              className="mt-3 h-[820px] w-full border border-dark-gray bg-obsidian"
            />
          ) : (
            <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
              Aucun aperçu : le numéro n'a pas de lettre.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
