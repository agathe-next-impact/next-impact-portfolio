import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonClass } from "../ui";
import { closeSession, LOGIN_PATH, requireSession } from "../session";

export const dynamic = "force-dynamic";

/**
 * Garde de l'admin.
 *
 * La vérification est **ici**, dans un layout serveur, et pas dans un composant
 * client : le rendu ne commence pas tant que la session n'est pas valide. Les
 * actions serveur, elles, revérifient de leur côté — un layout ne protège que
 * l'affichage (voir `sentinelle/actions.ts`).
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await requireSession();

  async function deconnecter() {
    "use server";
    await closeSession();
    redirect(LOGIN_PATH);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-gray pb-6">
        <div className="flex flex-wrap items-baseline gap-6">
          <Link
            href="/admin/sentinelle"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary"
          >
            Sentinelle · Admin
          </Link>
          <Link
            href="/admin/sentinelle"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground"
          >
            File de validation
          </Link>
          <Link
            href="/admin/sentinelle/numeros"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground"
          >
            Numéros
          </Link>
        </div>

        <form action={deconnecter}>
          <button type="submit" className={buttonClass.ghost}>
            Fermer la session
          </button>
        </form>
      </header>

      {children}
    </div>
  );
}
