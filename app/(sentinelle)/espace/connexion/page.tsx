import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { consumeMagicLink, magicLinkSecret, verifyMagicToken, TOKEN_REFUSAL } from "@sentinelle/access";
import { buttonClass, Label, Notice, Panel } from "../ui";
import { openClientSession, ESPACE_PATH } from "../session";

export const metadata: Metadata = {
  title: "Sentinelle — connexion",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Atterrissage d'un lien de connexion.
 *
 * **Le lien n'est pas consommé à l'affichage, mais au clic.** Un anti-virus de
 * messagerie ou une passerelle de sécurité d'entreprise ouvre les liens d'un
 * e-mail avant son destinataire, pour les vérifier ; un jeton à usage unique
 * consommé par un `GET` serait donc brûlé avant d'avoir servi, et l'abonné
 * lirait « ce lien a déjà servi » sans avoir rien cliqué. Un bouton coûte un
 * geste et supprime toute cette classe de pannes.
 *
 * La page vérifie quand même le jeton à l'affichage — signature et expiration,
 * sans toucher la base — pour ne pas proposer un bouton qui ne peut pas marcher.
 */
export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ jeton?: string }>;
}) {
  const { jeton } = await searchParams;

  let refus: string | null = null;
  try {
    const check = verifyMagicToken(jeton, magicLinkSecret());
    if (!check.valid) refus = TOKEN_REFUSAL[check.reason];
  } catch (error) {
    refus = error instanceof Error ? error.message : "configuration incomplète";
  }

  async function connecter(formData: FormData) {
    "use server";

    const outcome = await consumeMagicLink(String(formData.get("jeton") ?? ""));

    if (!outcome.ok) {
      redirect(
        `${ESPACE_PATH}?message=${encodeURIComponent(TOKEN_REFUSAL[outcome.reason])}&erreur=1`,
      );
    }

    await openClientSession(outcome.clientId);
    redirect(ESPACE_PATH);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Label>Sentinelle · Connexion</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground">
        Ouvrir mon espace
      </h1>

      {refus ? (
        <>
          <div className="mt-8">
            <Notice tone="erreur" message={refus} />
          </div>
          <Link href={ESPACE_PATH} className={`${buttonClass.primary} mt-6`}>
            Demander un nouveau lien
          </Link>
        </>
      ) : (
        <Panel className="mt-8 p-6">
          <p className="font-inter-tight text-base leading-relaxed text-foreground">
            Votre lien est valide. Un clic et vous y êtes.
          </p>
          <form action={connecter}>
            <input type="hidden" name="jeton" value={jeton} />
            <button type="submit" className={`${buttonClass.primary} mt-5 w-full`}>
              Ouvrir mon espace
            </button>
          </form>
        </Panel>
      )}
    </main>
  );
}
