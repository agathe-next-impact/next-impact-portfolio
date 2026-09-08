import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  deleteCredential,
  describeDevice,
  listCredentials,
  listForPerson,
  listSessions,
  record,
  renameCredential,
  revokeSession,
  EVENT_LABELS,
} from "@cto/access";
import { PasskeyEnrollButton } from "../passkey";
import { BackLink, buttonClass, formatDate, inputClass, Label, PageHeader, Panel } from "../ui";
import { currentSession, ESPACE_PATH, requireSession, sessionToken } from "../session";

export const metadata: Metadata = {
  title: "Vos appareils",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const APPAREILS_PATH = `${ESPACE_PATH}/appareils`;

/**
 * Gestion des appareils.
 *
 * Trois blocs et un seul propos : que la personne puisse répondre à « qui a
 * accès à mon espace, depuis où, et comment le couper ». D'où l'ordre — ce
 * qu'elle a enrôlé, ce qui est ouvert en ce moment, ce qui s'est passé.
 */
export default async function AppareilsPage() {
  const session = await requireSession();
  const token = await sessionToken();

  const [credentials, sessions, journal] = await Promise.all([
    listCredentials(session.person.id),
    listSessions(session.person.id, token),
    listForPerson(session.person.id, 15),
  ]);

  // Chaque action serveur revérifie la session pour son propre compte : une
  // action est une URL publique, elle ne fait jamais confiance à l'écran qui l'a
  // affichée. Le filtre par personne au niveau du store est la seconde barrière.
  async function renommer(formData: FormData) {
    "use server";

    const courante = await currentSession();
    if (!courante) redirect(ESPACE_PATH);

    const id = String(formData.get("id") ?? "");
    const label = String(formData.get("label") ?? "");
    await renameCredential(id, courante.person.id, label);

    redirect(APPAREILS_PATH);
  }

  async function supprimer(formData: FormData) {
    "use server";

    const courante = await currentSession();
    if (!courante) redirect(ESPACE_PATH);

    const id = String(formData.get("id") ?? "");
    const outcome = await deleteCredential(id, courante.person.id);

    if (outcome.deleted) {
      await record({
        event: "passkey_supprimee",
        personId: courante.person.id,
        clientId: courante.person.clientId,
        detail: outcome.label,
      });
    }

    redirect(APPAREILS_PATH);
  }

  async function deconnecter(formData: FormData) {
    "use server";

    const courante = await currentSession();
    if (!courante) redirect(ESPACE_PATH);

    const id = String(formData.get("id") ?? "");
    const done = await revokeSession(id, courante.person.id);

    if (done) {
      await record({
        event: "session_revoquee",
        personId: courante.person.id,
        clientId: courante.person.clientId,
      });
    }

    redirect(APPAREILS_PATH);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <BackLink href={ESPACE_PATH}>Votre espace</BackLink>

      <div className="mt-6">
        <PageHeader company={session.person.company} title="Vos appareils" />
      </div>

      {/* ─── Passkeys ─────────────────────────────────────────────────── */}
      <section className="mt-10">
        <Label>Passkeys enregistrées</Label>
        <p className="mt-3 font-inter-tight text-sm text-mid-gray">
          Une passkey vous connecte d'un geste, avec votre visage, votre empreinte ou
          le code de votre appareil. Vous pouvez en enregistrer plusieurs : votre
          ordinateur, votre téléphone.
        </p>

        {credentials.length === 0 ? (
          <Panel className="mt-4 px-5 py-6">
            <p className="font-inter-tight text-base text-mid-gray">
              Aucun appareil enregistré pour l'instant.
            </p>
          </Panel>
        ) : (
          <ul className="mt-4 space-y-3">
            {credentials.map((credential) => (
              <li key={credential.id}>
                <Panel className="px-5 py-4">
                  <form action={renommer} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="id" value={credential.id} />
                    <div className="min-w-[12rem] flex-1">
                      <label
                        htmlFor={`label-${credential.id}`}
                        className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
                      >
                        Nom de l'appareil
                      </label>
                      <input
                        id={`label-${credential.id}`}
                        name="label"
                        defaultValue={credential.label}
                        maxLength={60}
                        className={`${inputClass} mt-1 py-2`}
                      />
                    </div>
                    <button type="submit" className={buttonClass.ghost}>
                      Renommer
                    </button>
                  </form>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dark-gray pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
                      Ajouté le {formatDate(credential.createdAt)}
                      {credential.lastUsedAt
                        ? ` · dernière utilisation ${formatDate(credential.lastUsedAt)}`
                        : " · jamais utilisé"}
                    </p>
                    <form action={supprimer}>
                      <input type="hidden" name="id" value={credential.id} />
                      <button type="submit" className={buttonClass.quiet}>
                        Supprimer
                      </button>
                    </form>
                  </div>
                </Panel>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <PasskeyEnrollButton />
        </div>
      </section>

      {/* ─── Sessions ─────────────────────────────────────────────────── */}
      <section className="mt-12">
        <Label>Appareils connectés</Label>
        <p className="mt-3 font-inter-tight text-sm text-mid-gray">
          Si vous ne reconnaissez pas une de ces lignes, déconnectez-la : l'accès
          cesse immédiatement.
        </p>

        <ul className="mt-4 space-y-3">
          {sessions.map((row) => (
            <li key={row.id}>
              <Panel className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-inter-tight text-base text-foreground">
                    {describeDevice(row.userAgent)}
                    {row.current ? (
                      <span className="ml-2 border border-accent-secondary/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
                        Cet appareil
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
                    Vu le {formatDate(row.lastSeenAt)}
                  </p>
                </div>
                {row.current ? null : (
                  <form action={deconnecter}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className={buttonClass.quiet}>
                      Déconnecter
                    </button>
                  </form>
                )}
              </Panel>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Journal ──────────────────────────────────────────────────── */}
      <section className="mt-12">
        <Label>Activité récente</Label>
        <Panel className="mt-4 divide-y divide-dark-gray">
          {journal.length === 0 ? (
            <p className="px-5 py-4 font-inter-tight text-sm text-mid-gray">
              Rien à afficher pour l'instant.
            </p>
          ) : (
            journal.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3"
              >
                <p className="font-inter-tight text-sm text-foreground">
                  {EVENT_LABELS[entry.event]}
                  {entry.detail ? (
                    <span className="text-mid-gray"> — {entry.detail}</span>
                  ) : null}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
                  {formatDate(entry.at)}
                </p>
              </div>
            ))
          )}
        </Panel>
      </section>
    </main>
  );
}
