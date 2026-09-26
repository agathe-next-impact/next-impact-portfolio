import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  accessDecision,
  findPersonByEmail,
  issueMagicLink,
  record,
  sendLoginLink,
  MAGIC_LINK_TTL_MS,
} from "@cto/access";
import { PasskeyLoginButton } from "./passkey";
import { loadEspace } from "./shell";
import { buttonClass, inputClass, Label, Notice } from "./ui";
import { configurationIssue, currentSession, ESPACE_PATH } from "./session";
import { viewerFromSession } from "./viewer";
import { VueTableau } from "./vues";

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

  // Le tableau de bord vit dans `./vues.tsx`, partagé avec la vue admin. Le
  // refus d'un lien de connexion s'affiche AUSSI quand une session est déjà
  // ouverte : sans lui, cliquer un lien expiré ramènerait en silence sur
  // l'espace courant, qui aurait l'air de s'être trompé de client.
  const viewer = viewerFromSession(session);
  return (
    <VueTableau
      viewer={viewer}
      context={await loadEspace(viewer)}
      erreur={erreur === "1" && message ? message : null}
    />
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
