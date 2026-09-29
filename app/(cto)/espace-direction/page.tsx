import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accessDecision,
  consumeLoginCode,
  findPersonByEmail,
  issueMagicLink,
  record,
  sendLoginLink,
  MAGIC_LINK_TTL_MS,
} from "@cto/access";
import { PasskeyLoginButton } from "./passkey";
import { PurgeHorsLigne } from "./pwa";
import { loadEspace } from "./shell";
import { buttonClass, inputClass, Label, Notice } from "./ui";
import { configurationIssue, currentSession, ESPACE_PATH, startSession } from "./session";
import { viewerFromSession } from "./viewer";
import { BoutonEnvoi } from "../bouton-envoi";
import { VueTableau } from "./vues";

export const metadata: Metadata = {
  title: "Espace direction technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MINUTES = Math.round(MAGIC_LINK_TTL_MS / 60000);

/**
 * L'adresse qui vient de demander un lien, gardée le temps du lien pour
 * préremplir le champ du code. Cookie httpOnly limité à l'espace : l'adresse
 * ne passe pas par l'URL (historique, journaux).
 */
const EMAIL_COOKIE = "cto_espace_code_email";

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
  const emailCode = (await cookies()).get(EMAIL_COOKIE)?.value ?? "";

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

    (await cookies()).set(EMAIL_COOKIE, email.trim().slice(0, 200), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: ESPACE_PATH,
      maxAge: Math.round(MAGIC_LINK_TTL_MS / 1000),
    });
    redirect(`${ESPACE_PATH}?envoye=1`);
  }

  /**
   * Le code du même e-mail, saisi dans l'application installée : le lien, lui,
   * s'ouvrirait dans le navigateur, qui ne partage pas sa session avec elle
   * (iPhone). Même réponse neutre pour une adresse inconnue que pour un code
   * faux : cet écran ne dit pas qui est client.
   */
  async function validerCode(formData: FormData) {
    "use server";

    const refus = `${ESPACE_PATH}?envoye=1&erreur=1&message=${encodeURIComponent("Code incorrect ou expiré. Vérifiez l'adresse et le dernier e-mail reçu.")}`;
    const person = await findPersonByEmail(String(formData.get("email") ?? ""));
    if (!person) redirect(refus);

    const outcome = await consumeLoginCode(person.id, String(formData.get("code") ?? ""));
    if (!outcome.ok) {
      await record({ event: "acces_refuse", personId: person.id, clientId: person.clientId, detail: "code invalide" });
      redirect(refus);
    }

    const decision = accessDecision(person.status);
    if (!decision.allowed) {
      await record({
        event: "acces_refuse",
        personId: person.id,
        clientId: person.clientId,
        detail: `espace ${person.status}`,
      });
      redirect(`${ESPACE_PATH}?erreur=1&message=${encodeURIComponent("Cet espace est clos.")}`);
    }

    await startSession(person.id);
    await record({ event: "connexion_lien", personId: person.id, clientId: person.clientId, detail: "code" });
    (await cookies()).delete({ name: EMAIL_COOKIE, path: ESPACE_PATH });
    redirect(ESPACE_PATH);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      {/* Plus de session : les pages gardées pour la lecture hors ligne partent. */}
      <PurgeHorsLigne />
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
                Si cette adresse est enregistrée, un lien et un code de connexion viennent
                de partir. Valables {MINUTES} minutes, ils ne servent qu'une fois.
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
              <BoutonEnvoi className={buttonClass.ghost} enCours="Envoi du lien…">
                Recevoir un lien
              </BoutonEnvoi>
            </form>

            <details open={envoye} className="mt-8">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray hover:text-foreground">
                Saisir le code reçu
              </summary>
              <p className="mt-3 font-inter-tight text-sm text-mid-gray">
                L&rsquo;e-mail contient aussi un code à six chiffres : dans l&rsquo;application
                installée, saisissez-le ici plutôt que d&rsquo;ouvrir le lien.
              </p>
              <form action={validerCode} className="mt-5 space-y-4">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  defaultValue={emailCode}
                  placeholder="votre adresse professionnelle"
                  aria-label="Votre adresse e-mail"
                  className={inputClass}
                />
                <input
                  type="text"
                  name="code"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  placeholder="123 456"
                  aria-label="Code à six chiffres reçu par e-mail"
                  className={`${inputClass} font-mono tracking-[0.3em]`}
                />
                <BoutonEnvoi className={buttonClass.primary} enCours="Vérification…">
                  Se connecter
                </BoutonEnvoi>
              </form>
            </details>
          </div>
        </>
      )}
    </main>
  );
}
