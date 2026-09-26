import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@cto/admin";
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
    // Pleine largeur : la vue de l'espace d'un client (sous `clients/<id>/espace`)
    // doit s'afficher comme chez le client, barre latérale comprise. Les pages
    // de supervision se contraignent elles-mêmes (`PILOTAGE_LARGEUR`).
    <div className="w-full">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-gray px-6 py-5 lg:px-10">
        <div>
          <Link
            href="/admin-cto/pilotage"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary"
          >
            Direction technique · Supervision
          </Link>
          <p className="mt-1 font-inter-tight text-xs text-mid-gray">{ADMIN_EMAIL}</p>
        </div>

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
