import { redirect } from "next/navigation";
import { buttonClass, inputClass, Label, Notice, Panel } from "../../espace-direction/ui";
import { configurationIssue, hasSession, HOME_PATH, LOGIN_PATH, openSession } from "../session";

export const dynamic = "force-dynamic";

/**
 * Connexion à l'admin de supervision.
 *
 * Un champ, pas de nom d'utilisateur : il n'y a qu'une personne. Le résultat
 * passe par l'URL plutôt que par un état client — la page reste un composant
 * serveur, et une tentative ratée ne laisse rien dans le navigateur.
 */
export default async function AdminCtoLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  if (await hasSession()) redirect(HOME_PATH);

  const { erreur } = await searchParams;
  const probleme = configurationIssue();

  async function connecter(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");
    const ouverte = await openSession(password);

    redirect(ouverte ? HOME_PATH : `${LOGIN_PATH}?erreur=1`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Label>Next Impact — Supervision</Label>
      <h1 className="mt-4 font-sans text-2xl font-light text-foreground sm:text-3xl">
        Espace direction technique
      </h1>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        Vue d&rsquo;ensemble des accompagnements CTO. Rien ne se crée ni ne se
        modifie ici : les accès et les statuts restent des gestes délibérés, en
        CLI ou en SQL.
      </p>

      {probleme ? (
        <div className="mt-8">
          <Notice tone="erreur">{probleme}</Notice>
        </div>
      ) : (
        <Panel className="mt-8 p-6">
          <form action={connecter}>
            <label
              htmlFor="password"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              autoFocus
              className={`mt-3 ${inputClass}`}
            />
            <button type="submit" className={`${buttonClass.primary} mt-4 w-full`}>
              Entrer
            </button>
          </form>

          {erreur ? (
            <p role="alert" className="mt-4 font-inter-tight text-sm text-[#ff8a7a]">
              Mot de passe refusé.
            </p>
          ) : null}
        </Panel>
      )}
    </main>
  );
}
