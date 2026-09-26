import type { Metadata } from "next";
import Link from "next/link";
import { digestsOfWeek, parseWeek, previousWeek, weekLabel } from "@cto/digest";
import { DigestSemaine } from "../../../espace-direction/digest";
import { adminEspacePath } from "../../../espace-direction/viewer";
import { buttonClass, formatDate, Label, Notice, Panel, Tag, type Tone } from "../../../espace-direction/ui";
import { PILOTAGE_LARGEUR } from "../largeur";
import { reassembler, validerEtEnvoyer } from "./actions";

export const metadata: Metadata = { title: "Digests de la semaine" };
export const dynamic = "force-dynamic";

const STATUT: Record<string, { label: string; tone: Tone }> = {
  draft: { label: "Brouillon", tone: "attention" },
  validated: { label: "Validé, non envoyé", tone: "alerte" },
  sent: { label: "Envoyé", tone: "fait" },
};

/**
 * Relecture des digests d'une semaine, avant envoi.
 *
 * Le balayage quotidien assemble les brouillons de la dernière semaine
 * complète ; cet écran les montre tels que le client les verra, et les envoie
 * d'un geste. Rien ne part sans passer par ici (ou par `npm run cto:digest --
 * --envoyer`).
 */
export default async function DigestsPage({
  searchParams,
}: {
  searchParams: Promise<{ semaine?: string; message?: string }>;
}) {
  const { semaine, message } = await searchParams;
  const week = semaine && parseWeek(semaine) ? semaine : previousWeek(new Date());
  const digests = await digestsOfWeek(week);
  const brouillons = digests.filter((d) => d.status !== "sent").length;

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

      {message ? (
        <div className="mt-6">
          <Notice tone="succes">{message}</Notice>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <form action={validerEtEnvoyer}>
          <input type="hidden" name="week" value={week} />
          <button type="submit" className={buttonClass.primary} disabled={brouillons === 0}>
            Valider et envoyer les {brouillons} digest{brouillons > 1 ? "s" : ""} en attente
          </button>
        </form>
        <form action={reassembler}>
          <input type="hidden" name="week" value={week} />
          <button type="submit" className={buttonClass.ghost}>
            Relire les sources et réassembler
          </button>
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
        <section key={digest.id} className="mt-14 border-t border-dark-gray pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-sans text-xl font-light text-foreground">{digest.company}</h2>
              <Tag tone={STATUT[digest.status].tone}>{STATUT[digest.status].label}</Tag>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                {digest.sentAt ? `Envoyé le ${formatDate(digest.sentAt)}` : `Assemblé le ${formatDate(digest.updatedAt)}`}
              </p>
              {digest.status !== "sent" ? (
                <form action={validerEtEnvoyer}>
                  <input type="hidden" name="week" value={week} />
                  <input type="hidden" name="id" value={digest.id} />
                  <button type="submit" className={buttonClass.ghost}>
                    Envoyer celui-ci
                  </button>
                </form>
              ) : null}
            </div>
          </div>
          <DigestSemaine content={digest.content} semaines={[]} base={adminEspacePath(digest.clientId)} />
        </section>
      ))}
    </main>
  );
}
