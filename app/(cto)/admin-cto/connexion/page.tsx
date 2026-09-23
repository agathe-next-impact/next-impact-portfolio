import { redirect } from "next/navigation";
import { ADMIN_EMAIL, issueAdminMagicLink, sendAdminLoginLink, MAX_LINKS_PER_WINDOW } from "@cto/admin";
import { MAGIC_LINK_TTL_MS } from "@cto/access";
import { buttonClass, Label, Notice, Panel } from "../../espace-direction/ui";
import { AdminPasskeyLoginButton } from "../passkey";
import { configurationIssue, hasSession, HOME_PATH, LOGIN_PATH } from "../session";

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
  searchParams: Promise<{ envoye?: string; erreur?: string }>;
}) {
  if (await hasSession()) redirect(HOME_PATH);

  const { envoye, erreur } = await searchParams;
  const probleme = configurationIssue();

  async function demanderLien() {
    "use server";

    const issued = await issueAdminMagicLink();

    if (issued.ok) {
      const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
      const url = `${base}${LOGIN_PATH}/verifier?jeton=${encodeURIComponent(issued.token)}`;

      try {
        await sendAdminLoginLink(url);
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

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
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
                Un lien de connexion vient de partir vers {ADMIN_EMAIL}. Il est valable{" "}
                {MINUTES} minutes et ne fonctionne qu&rsquo;une fois.
              </Notice>
            </div>
          ) : null}

          {erreur ? (
            <div className="mb-6">
              <Notice tone="erreur">L&rsquo;envoi a échoué, ou ce lien n&rsquo;est plus valide.</Notice>
            </div>
          ) : null}

          <AdminPasskeyLoginButton />

          <div className="mt-8 border-t border-dark-gray pt-6">
            <form action={demanderLien}>
              <button type="submit" className={buttonClass.ghost}>
                Recevoir un lien de connexion
              </button>
            </form>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              {MAX_LINKS_PER_WINDOW} demandes maximum par quart d&rsquo;heure
            </p>
          </div>
        </Panel>
      )}
    </main>
  );
}
