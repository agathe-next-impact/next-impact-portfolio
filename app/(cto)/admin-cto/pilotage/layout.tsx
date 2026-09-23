import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonClass } from "../../espace-direction/ui";
import { closeSession, LOGIN_PATH, requireSession } from "../session";

export const dynamic = "force-dynamic";

/**
 * Garde de l'admin de supervision.
 *
 * La vérification est **ici**, dans un layout serveur, et pas dans un
 * composant client : le rendu ne commence pas tant que la session n'est pas
 * valide.
 */
export default async function PilotageLayout({ children }: { children: ReactNode }) {
  await requireSession();

  async function deconnexion() {
    "use server";
    await closeSession();
    redirect(LOGIN_PATH);
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-10 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-gray pb-6">
        <Link
          href="/admin-cto/pilotage"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary"
        >
          Direction technique · Supervision
        </Link>

        <form action={deconnexion}>
          <button type="submit" className={buttonClass.ghost}>
            Fermer la session
          </button>
        </form>
      </header>

      {children}
    </div>
  );
}
