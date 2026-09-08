import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  accessDecision,
  findPersonByEmail,
  issueMagicLink,
  listCredentials,
  record,
  sendLoginLink,
  MAGIC_LINK_TTL_MS,
} from "@cto/access";
import { listForClient } from "@cto/deliverables";
import { Livrables } from "./livrables";
import { PasskeyLoginButton } from "./passkey";
import { buttonClass, inputClass, Label, Notice, PageHeader, Panel } from "./ui";
import { configurationIssue, currentSession, endSession, ESPACE_PATH } from "./session";

export const metadata: Metadata = {
  title: "Espace direction technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MINUTES = Math.round(MAGIC_LINK_TTL_MS / 60000);

/**
 * Une seule URL pour deux états, connecté ou non.
 *
 * Plutôt qu'une page de connexion séparée : c'est l'adresse que le client met en
 * favori, elle doit marcher dans les deux cas. Un favori qui tombe sur un écran
 * de connexion inutile le jour où la session est encore valide finit par être
 * supprimé.
 */
export default async function EspaceDirectionPage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string; message?: string; erreur?: string }>;
}) {
  const { envoye, message, erreur } = await searchParams;
  const session = await currentSession();

  if (!session) {
    return <Connexion envoye={envoye === "1"} message={message} erreur={erreur === "1"} />;
  }

  // Deux lectures, pas une : les livrables et les appareils ne dépendent pas
  // l'un de l'autre, et les enchaîner ajouterait un aller-retour à une page que
  // le client ouvre pour trouver une réponse en dix secondes.
  const [credentials, livrables] = await Promise.all([
    listCredentials(session.person.id),
    listForClient(session.person.clientId),
  ]);

  async function deconnexion() {
    "use server";

    const courante = await currentSession();
    if (courante) {
      await record({
        event: "session_fermee",
        personId: courante.person.id,
        clientId: courante.person.clientId,
      });
    }
    await endSession();
    redirect(ESPACE_PATH);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <PageHeader company={session.person.company} title="Votre espace">
        <p className="font-inter-tight text-base text-mid-gray">
          {session.person.name}
          {session.person.role ? ` — ${session.person.role}` : ""}
        </p>
      </PageHeader>

      {session.decision.notice ? (
        <div className="mt-8">
          <Notice tone="info">{session.decision.notice}</Notice>
        </div>
      ) : null}

      <Livrables items={livrables} />

      <section className="mt-10">
        <Label>Votre accès</Label>
        <Panel className="mt-3 px-5 py-6">
          <p className="font-inter-tight text-base text-foreground">
            {credentials.length === 0
              ? "Aucun appareil enregistré. Enregistrez-en un pour vous connecter d'un geste, sans repasser par votre boîte mail."
              : `${credentials.length} appareil${credentials.length > 1 ? "s" : ""} enregistré${credentials.length > 1 ? "s" : ""}.`}
          </p>
          <div className="mt-5">
            <Link href={`${ESPACE_PATH}/appareils`} className={buttonClass.ghost}>
              Gérer mes appareils
            </Link>
          </div>
        </Panel>
      </section>

      <form action={deconnexion} className="mt-12 border-t border-dark-gray pt-6">
        <button type="submit" className={buttonClass.quiet}>
          Se déconnecter
        </button>
      </form>
    </main>
  );
}

/**
 * L'écran de connexion.
 *
 * Deux voies, dans l'ordre de ce qu'on souhaite que le client utilise : la
 * passkey d'abord, le lien de secours ensuite. Le second n'est pas caché derrière
 * un repli — il reste visible en permanence, parce qu'une passkey se perd avec un
 * téléphone et que personne ne doit se retrouver enfermé dehors.
 */
async function Connexion({
  envoye,
  message,
  erreur,
}: {
  envoye: boolean;
  message?: string;
  erreur: boolean;
}) {
  const probleme = configurationIssue();

  async function demanderLien(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const person = await findPersonByEmail(email);

    // Réponse volontairement identique que l'adresse existe ou non : cet écran
    // ne doit jamais servir à savoir qui est client. Le cas « inconnue » sort
    // donc par le même chemin que le cas nominal.
    if (person) {
      const decision = accessDecision(person.status);

      if (!decision.allowed) {
        await record({
          event: "acces_refuse",
          personId: person.id,
          clientId: person.clientId,
          detail: `espace ${person.status}`,
        });
      } else {
        const issued = await issueMagicLink(person.id);

        if (issued.ok) {
          const base =
            process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
          const url = `${base}${ESPACE_PATH}/connexion?jeton=${encodeURIComponent(issued.token)}`;

          try {
            await sendLoginLink({ email: person.email, name: person.name }, url);
          } catch (error) {
            console.error("[cto] envoi du lien impossible", error);
            redirect(
              `${ESPACE_PATH}?erreur=1&message=${encodeURIComponent("L'envoi a échoué. Réessayez dans un instant.")}`,
            );
          }
        }
        // `issued.ok === false` (trop de demandes) sort aussi par le message
        // neutre : dire « vous en avez déjà demandé trois » à quelqu'un qui n'a
        // rien demandé lui apprendrait qu'un tiers essaie d'entrer sur son
        // compte, sans lui donner le moyen d'agir.
      }
    }

    redirect(`${ESPACE_PATH}?envoye=1`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <Label>Next Impact — Direction technique</Label>
      <h1 className="mt-3 font-sans text-2xl font-light text-foreground sm:text-3xl">
        Votre espace
      </h1>

      {probleme ? (
        <div className="mt-8">
          <Notice tone="erreur">{probleme}</Notice>
        </div>
      ) : (
        <>
          {envoye ? (
            <div className="mt-8">
              <Notice tone="succes">
                Si cette adresse est enregistrée, un lien de connexion vient de partir.
                Il est valable {MINUTES} minutes et ne fonctionne qu'une fois.
              </Notice>
            </div>
          ) : null}

          {erreur && message ? (
            <div className="mt-8">
              <Notice tone="erreur">{message}</Notice>
            </div>
          ) : null}

          <div className="mt-10">
            <PasskeyLoginButton />
          </div>

          <div className="mt-10 border-t border-dark-gray pt-8">
            <Label>Sans passkey</Label>
            <p className="mt-3 font-inter-tight text-sm text-mid-gray">
              Premier accès, nouvel appareil, passkey perdue : recevez un lien de
              connexion par e-mail.
            </p>
            <form action={demanderLien} className="mt-5 space-y-4">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="votre adresse professionnelle"
                aria-label="Votre adresse e-mail"
                className={inputClass}
              />
              <button type="submit" className={buttonClass.ghost}>
                Recevoir un lien
              </button>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
