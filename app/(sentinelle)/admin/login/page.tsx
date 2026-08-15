import { redirect } from "next/navigation";
import { buttonClass, Label, Notice, Panel } from "../ui";
import { configurationIssue, hasSession, HOME_PATH, LOGIN_PATH, openSession } from "../session";

export const dynamic = "force-dynamic";

/**
 * Connexion à l'admin.
 *
 * Un champ, pas de nom d'utilisateur : il n'y a qu'une personne. Le résultat
 * passe par l'URL plutôt que par un état client — la page reste un composant
 * serveur, et une tentative ratée ne laisse rien dans le navigateur.
 */
export default async function LoginPage({
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
      <Label>Sentinelle · Admin</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground">
        File de validation
      </h1>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        Rien ne part d'ici sans relecture. C'est la règle du produit, pas une
        précaution d'usage.
      </p>

      {probleme ? (
        <div className="mt-8">
          <Notice tone="erreur" message={probleme} />
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
              className="mt-3 w-full border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground focus:border-accent-secondary focus:outline-none"
            />
            <button type="submit" className={`${buttonClass.primary} mt-4 w-full`}>
              Entrer
            </button>
          </form>

          {erreur && (
            <p role="alert" className="mt-4 font-inter-tight text-sm text-[#ff8a7a]">
              Mot de passe refusé.
            </p>
          )}
        </Panel>
      )}
    </main>
  );
}
