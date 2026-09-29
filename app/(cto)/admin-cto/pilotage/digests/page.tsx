import type { Metadata } from "next";
import Link from "next/link";
import { activePersons } from "@cto/access";
import { digestsOfWeek, LINE_CHARS, parseWeek, previousWeek, weekLabel, type AdminDigest, type DigestLine } from "@cto/digest";
import { DigestSemaine } from "../../../espace-direction/digest";
import { adminEspacePath } from "../../../espace-direction/viewer";
import { buttonClass, formatDate, inputClass, Label, Panel, Tag, type Tone } from "../../../espace-direction/ui";
import { PILOTAGE_LARGEUR } from "../largeur";
import { envoyer, reassembler, refuser, repasserEnBrouillon, retablir, retoucher } from "./actions";
import { BoutonEnvoi } from "../../../bouton-envoi";

export const metadata: Metadata = { title: "Digests de la semaine" };
export const dynamic = "force-dynamic";

const STATUT: Record<string, { label: string; tone: Tone }> = {
  draft: { label: "Brouillon", tone: "attention" },
  validated: { label: "Validé, non envoyé", tone: "alerte" },
  sent: { label: "Envoyé", tone: "fait" },
  dismissed: { label: "Refusé", tone: "attention" },
};

/**
 * Relecture des digests d'une semaine, avant envoi.
 *
 * Le balayage quotidien assemble les brouillons de la dernière semaine
 * complète. Ici, un digest à la fois : on le retouche (texte des lignes, action
 * de la semaine), on le valide, puis on l'envoie. Rien ne part en lot, rien ne
 * part sans validation, et un digest validé peut repasser en brouillon tant
 * qu'il n'est pas envoyé. Un brouillon retouché n'est plus réassemblé. Un
 * digest non envoyé peut être refusé : il quitte la page et n'est plus réassemblé.
 */
export default async function DigestsPage({
  searchParams,
}: {
  searchParams: Promise<{ semaine?: string }>;
}) {
  const { semaine } = await searchParams;
  const week = semaine && parseWeek(semaine) ? semaine : previousWeek(new Date());
  const digests = await digestsOfWeek(week);
  const destinataires = new Map(
    await Promise.all(digests.map(async (d) => [d.id, (await activePersons(d.clientId)).length] as const)),
  );

  return (
    <main className={PILOTAGE_LARGEUR}>
      <Link
        href="/admin-cto/pilotage"
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray hover:text-foreground"
      >
        ← Tous les accompagnements
      </Link>
      <Label>Digest hebdomadaire</Label>
      <h1 className="mt-2 font-sans text-2xl font-light text-foreground sm:text-3xl">{weekLabel(week)}</h1>
      <p className="mt-3 max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
        Chaque digest se relit, se retouche, se valide puis s&rsquo;envoie à part. Rien ne part
        sans ces deux gestes. Un digest refusé disparaît et n&rsquo;est plus réassemblé.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <form action={reassembler}>
          <input type="hidden" name="week" value={week} />
          <BoutonEnvoi className={buttonClass.ghost} enCours="Réassemblage…">
            Relire les sources et réassembler
          </BoutonEnvoi>
        </form>
      </div>

      {digests.length === 0 ? (
        <Panel className="mt-10 px-5 py-6">
          <p className="font-inter-tight text-base text-mid-gray">
            Aucun digest pour cette semaine. Aucun accompagnement actif n&rsquo;a de veille reliée
            (colonne « ID Sentinelle » ou « Veille — organisation » de la fiche Clients), ou le
            balayage n&rsquo;est pas encore passé.
          </p>
        </Panel>
      ) : null}

      {digests.map((digest) => (
        <section key={digest.id} id={`digest-${digest.id}`} className="mt-14 scroll-mt-8 border-t border-dark-gray pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-sans text-xl font-light text-foreground">{digest.company}</h2>
              <Tag tone={STATUT[digest.status].tone}>{STATUT[digest.status].label}</Tag>
              {digest.content.modifieLe && digest.status !== "sent" ? <Tag>Retouché</Tag> : null}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              {digest.sentAt
                ? `Envoyé le ${formatDate(digest.sentAt)}`
                : digest.content.modifieLe
                  ? `Retouché le ${formatDate(new Date(digest.content.modifieLe))}`
                  : `Assemblé le ${formatDate(digest.updatedAt)}`}
            </p>
          </div>

          {digest.status === "draft" ? <Retouche digest={digest} week={week} /> : null}

          {digest.status === "validated" ? (
            <Panel className="mt-6 flex flex-wrap items-center gap-3 px-5 py-4">
              <form action={envoyer}>
                <input type="hidden" name="week" value={week} />
                <input type="hidden" name="id" value={digest.id} />
                <BoutonEnvoi className={buttonClass.primary} disabled={destinataires.get(digest.id) === 0} enCours="Envoi…">
                  {destinataires.get(digest.id) === 0
                    ? "Aucune personne active à qui l'envoyer"
                    : `Envoyer à ${destinataires.get(digest.id)} personne${(destinataires.get(digest.id) ?? 0) > 1 ? "s" : ""}`}
                </BoutonEnvoi>
              </form>
              <form action={repasserEnBrouillon}>
                <input type="hidden" name="week" value={week} />
                <input type="hidden" name="id" value={digest.id} />
                <BoutonEnvoi className={buttonClass.ghost} enCours="…">
                  Repasser en brouillon pour retoucher
                </BoutonEnvoi>
              </form>
              <FormRefus digest={digest} week={week} />
            </Panel>
          ) : null}

          <div className="mt-8">
            <Label>{digest.status === "sent" ? "Tel qu'envoyé" : "Aperçu, tel que le client le lira"}</Label>
            <DigestSemaine content={digest.content} semaines={[]} base={adminEspacePath(digest.clientId)} />
          </div>
        </section>
      ))}
    </main>
  );
}

/** Le formulaire de retouche d'un brouillon : une ligne = un champ ; vider un champ retire la ligne. */
function Retouche({ digest, week }: { digest: AdminDigest; week: string }) {
  const { content } = digest;
  return (
    <Panel className="mt-6 px-5 py-5">
      <form action={retoucher}>
        <input type="hidden" name="week" value={week} />
        <input type="hidden" name="id" value={digest.id} />

        {content.sentinelle && content.sentinelle.lines.length > 0 ? (
          <fieldset>
            <legend>
              <Label>Veille technique</Label>
            </legend>
            <div className="mt-3 space-y-2">
              {content.sentinelle.lines.map((line, i) => (
                <ChampLigne key={i} nom={`sentinelle.${i}`} line={line} />
              ))}
            </div>
          </fieldset>
        ) : null}

        {content.signaux.map((signal, n) => (
          <fieldset key={signal.letterKey} className="mt-6">
            <legend>
              <Label>{signal.label ? `Signaux faibles · ${signal.label}` : "Signaux faibles"}</Label>
            </legend>
            <div className="mt-3 space-y-2">
              {signal.lines.map((line, i) => (
                <ChampLigne key={i} nom={`signal.${n}.${i}`} line={line} />
              ))}
            </div>
            <label className="mt-3 block">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">Action de la semaine</span>
              <textarea
                name={`signal.${n}.action`}
                defaultValue={signal.action ?? ""}
                rows={2}
                className={`${inputClass} mt-1 text-sm`}
              />
            </label>
          </fieldset>
        ))}

        <p className="mt-4 font-inter-tight text-xs text-mid-gray">
          {`Une ligne fait ${LINE_CHARS} caractères au plus ; vider un champ retire la ligne. Le ton et l'étiquette restent ceux de la source.`}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <BoutonEnvoi className={buttonClass.primary} name="intention" value="valider" enCours="Validation…">
            Enregistrer et valider
          </BoutonEnvoi>
          <BoutonEnvoi className={buttonClass.ghost} name="intention" value="enregistrer" enCours="Enregistrement…">
            Enregistrer les retouches
          </BoutonEnvoi>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-3">
        {content.modifieLe ? (
          <form action={retablir}>
            <input type="hidden" name="week" value={week} />
            <input type="hidden" name="id" value={digest.id} />
            <BoutonEnvoi className={buttonClass.quiet} enCours="Réassemblage…">
              Abandonner les retouches et réassembler
            </BoutonEnvoi>
          </form>
        ) : null}
        <FormRefus digest={digest} week={week} />
      </div>
    </Panel>
  );
}

/** Refuse le digest : il quitte la page et le balayage ne le recrée pas. */
function FormRefus({ digest, week }: { digest: AdminDigest; week: string }) {
  return (
    <form action={refuser}>
      <input type="hidden" name="week" value={week} />
      <input type="hidden" name="id" value={digest.id} />
      <BoutonEnvoi className={buttonClass.quiet} enCours="Refus…">
        Refuser ce digest
      </BoutonEnvoi>
    </form>
  );
}

function ChampLigne({ nom, line }: { nom: string; line: DigestLine }) {
  return (
    <label className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
      {line.tag ? (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray sm:w-28">{line.tag}</span>
      ) : null}
      <input
        type="text"
        name={nom}
        defaultValue={line.text}
        maxLength={LINE_CHARS}
        className={`${inputClass} py-2 text-sm`}
      />
    </label>
  );
}
