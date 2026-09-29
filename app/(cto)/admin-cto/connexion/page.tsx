import { redirect } from "next/navigation";
import {
  ADMIN_EMAIL,
  consumeAdminLoginCode,
  issueAdminMagicLink,
  sendAdminLoginLink,
  MAX_LINKS_PER_WINDOW,
} from "@cto/admin";
import { MAGIC_LINK_TTL_MS } from "@cto/access";
import { buttonClass, inputClass, Label, Notice, Panel } from "../../espace-direction/ui";
import { AdminPasskeyLoginButton } from "../passkey";
import { configurationIssue, hasSession, HOME_PATH, LOGIN_PATH, startSession } from "../session";
import { PurgeHorsLigneAdmin } from "../pwa";
import { BoutonEnvoi } from "../../bouton-envoi";

export const dynamic = "force-dynamic";

const MINUTES = Math.round(MAGIC_LINK_TTL_MS / 60000);

/**
 * Connexion à l'admin de supervision.
 *
 * Associée à une seule adresse — agathe@next-impact.digital, voir
 * `src/cto/admin/identity.ts` — donc aucun champ à remplir : contrairement à
 * l'espace client, il n'y a personne d'autre à qui ce lien pourrait
 * correspondre. La passkey reste la voie recommandée une fois enregistrée ; le
 * lien de secours reste visible en permanence, pour le premier accès et le
 * jour où l'appareil habituel n'est pas là.
 */
export default async function AdminCtoLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string; erreur?: string; code?: string }>;
}) {
  if (await hasSession()) redirect(HOME_PATH);

  const { envoye, erreur, code } = await searchParams;
  const probleme = configurationIssue();

  async function demanderLien() {
    "use server";

    const issued = await issueAdminMagicLink();

    if (issued.ok) {
      const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
      const url = `${base}${LOGIN_PATH}/verifier?jeton=${encodeURIComponent(issued.token)}`;

      try {
        await sendAdminLoginLink(url, issued.code);
      } catch (error) {
        console.error("[cto] envoi du lien admin impossible", error);
        redirect(`${LOGIN_PATH}?erreur=1`);
      }
    }
    // `issued.ok === false` (trop de demandes) sort par le même message que le
    // succès : la seule personne qui peut voir cet écran est déjà l'unique
    // destinataire, rien à cacher, mais pas la peine de l'inquiéter pour un
    // formulaire cliqué deux fois de suite.

    redirect(`${LOGIN_PATH}?envoye=1`);
  }

  // Le code du même e-mail, saisi ICI : dans l'application installée, le lien
  // s'ouvrirait dans le navigateur, qui ne partage pas sa session avec elle.
  async function validerCode(formData: FormData) {
    "use server";

    const outcome = await consumeAdminLoginCode(String(formData.get("code") ?? ""));
    if (!outcome.ok) redirect(`${LOGIN_PATH}?envoye=1&code=faux`);

    await startSession();
    redirect(HOME_PATH);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      {/* Plus de session : les pages gardées pour la lecture hors ligne partent. */}
      <PurgeHorsLigneAdmin />
      <Label>Next Impact — Supervision</Label>
      <h1 className="mt-4 font-sans text-2xl font-light text-foreground sm:text-3xl">
        Espace direction technique
      </h1>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        Vue d&rsquo;ensemble des accompagnements CTO, associée à{" "}
        <span className="text-foreground">{ADMIN_EMAIL}</span>. Rien ne se crée ni ne se
        modifie ici : les accès et les statuts restent des gestes délibérés, en CLI ou en
        SQL.
      </p>

      {probleme ? (
        <div className="mt-8">
          <Notice tone="erreur">{probleme}</Notice>
        </div>
      ) : (
        <Panel className="mt-8 p-6">
          {envoye ? (
            <div className="mb-6">
              <Notice tone="succes">
                Un lien et un code de connexion viennent de partir vers {ADMIN_EMAIL}.
                Valables {MINUTES} minutes, ils ne servent qu&rsquo;une fois.
              </Notice>
            </div>
          ) : null}

          {erreur ? (
            <div className="mb-6">
              <Notice tone="erreur">L&rsquo;envoi a échoué, ou ce lien n&rsquo;est plus valide.</Notice>
            </div>
          ) : null}

          <AdminPasskeyLoginButton />

          {code ? (
            <div className="mb-6">
              <Notice tone="erreur">Code incorrect ou expiré. Vérifiez le dernier e-mail reçu.</Notice>
            </div>
          ) : null}

          <div className="mt-8 border-t border-dark-gray pt-6">
            <form action={demanderLien}>
              <BoutonEnvoi className={buttonClass.ghost} enCours="Envoi du lien…">
                Recevoir un lien de connexion
              </BoutonEnvoi>
            </form>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              {MAX_LINKS_PER_WINDOW} demandes maximum par quart d&rsquo;heure
            </p>

            <details open={Boolean(envoye || code)} className="mt-6">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray hover:text-foreground">
                Saisir le code reçu
              </summary>
              <form action={validerCode} className="mt-4 space-y-4">
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
        </Panel>
      )}
    </main>
  );
}
