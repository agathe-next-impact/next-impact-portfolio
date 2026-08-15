import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  clientFromCheckoutSession,
  stripe,
  upsertSubscriber,
  type CheckoutSessionLike,
} from "@sentinelle/billing";
import { clientSubscribed, inngest } from "@sentinelle/inngest";
import { buttonClass, Label, Notice, Panel } from "../ui";
import { openClientSession, ESPACE_PATH } from "../session";

export const metadata: Metadata = {
  title: "Sentinelle — bienvenue",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Retour de paiement.
 *
 * Stripe renvoie ici avec `session_id`. Deux choses s'y jouent, et aucune ne
 * dépend du webhook :
 *
 *  1. **La fiche est créée si elle ne l'est pas déjà.** Le webhook fait la même
 *     chose de son côté ; l'écriture est un upsert sur l'adresse e-mail, donc
 *     les deux chemins ne peuvent pas produire deux clients. Ce doublon de
 *     chemin est volontaire : le webhook peut avoir du retard, et quelqu'un qui
 *     vient de payer ne doit pas attendre.
 *  2. **La session s'ouvre sans lien magique**, à condition que le paiement
 *     soit récent. Revenir sur cette URL trois semaines plus tard ne rouvre
 *     rien : l'identifiant de session Stripe traîne dans un historique de
 *     navigation, il ne doit pas valoir clé d'accès permanente.
 */
const FENETRE_MS = 2 * 60 * 60 * 1000;

export default async function BienvenuePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let etat: { email: string; recent: boolean } | null = null;
  let probleme: string | null = null;

  if (!sessionId) {
    probleme =
      "Cette page se rejoint depuis la page de paiement. Si votre abonnement est actif, connectez-vous à votre espace.";
  } else {
    try {
      const session = await stripe().checkout.sessions.retrieve(sessionId);
      const outcome = clientFromCheckoutSession(session as unknown as CheckoutSessionLike);

      if (!outcome.ok) {
        probleme = "Ce paiement n'a pas encore abouti. Réessayez dans un instant.";
      } else {
        const row = await upsertSubscriber(outcome.client);

        if (row) {
          // Même événement que le webhook, et même fonction derrière : elle est
          // idempotente, la déclencher deux fois n'envoie pas deux bienvenues.
          // Ce chemin-ci couvre le cas où le webhook n'est pas configuré.
          await inngest
            .send(
              clientSubscribed.create({
                clientId: row.id,
                ...(outcome.scanId ? { scanId: outcome.scanId } : {}),
              }),
            )
            .catch((error: unknown) => {
              // L'abonné a payé et sa fiche existe : on ne lui montre pas une
              // page d'erreur parce que la file de tâches a hoqueté. Le webhook
              // Stripe repassera derrière.
              console.error("[sentinelle] mise en file de l'ouverture impossible", error);
            });
        }

        const created = (session.created ?? 0) * 1000;
        etat = {
          email: outcome.client.email,
          recent: Date.now() - created < FENETRE_MS,
        };
      }
    } catch (error) {
      console.error("[sentinelle] retour de paiement illisible", error);
      probleme = "Ce paiement n'a pas pu être vérifié. Connectez-vous à votre espace.";
    }
  }

  async function entrer(formData: FormData) {
    "use server";

    const id = String(formData.get("sessionId") ?? "");
    const session = await stripe().checkout.sessions.retrieve(id);

    // Revérification complète côté action : le formulaire ne prouve rien, et
    // l'état affiché n'est pas une autorisation.
    const created = (session.created ?? 0) * 1000;
    if (Date.now() - created >= FENETRE_MS) redirect(ESPACE_PATH);

    const outcome = clientFromCheckoutSession(session as unknown as CheckoutSessionLike);
    if (!outcome.ok) redirect(ESPACE_PATH);

    const row = await upsertSubscriber(outcome.client);
    if (!row) redirect(ESPACE_PATH);

    await openClientSession(row.id);
    redirect("/espace/fiche");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <Label>Sentinelle · Bienvenue</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        {probleme ? "Votre espace vous attend" : "C'est en place."}
      </h1>

      {probleme ? (
        <>
          <div className="mt-8">
            <Notice tone="erreur" message={probleme} />
          </div>
          <Link href={ESPACE_PATH} className={`${buttonClass.primary} mt-6 self-start`}>
            Accéder à mon espace
          </Link>
        </>
      ) : (
        <>
          <p className="mt-4 font-inter-tight text-base leading-relaxed text-mid-gray">
            Votre abonnement est actif et l&apos;analyse de votre site a démarré. Un e-mail
            de bienvenue part vers {etat?.email} avec le détail de ce qui est déjà
            surveillé.
          </p>

          <Panel className="mt-10 p-6">
            <Label>Il reste cinq minutes de votre part</Label>
            <p className="mt-3 font-inter-tight text-base leading-relaxed text-foreground">
              L&apos;analyse voit ce que votre site sert aux visiteurs. Elle ne voit ni les
              extensions chargées uniquement en administration, ni votre version exacte de
              PHP, ni votre hébergeur — et ce sont souvent celles-là qui prennent du
              retard. Déclarez-les maintenant, la surveillance passe de partielle à exacte.
            </p>

            {etat?.recent ? (
              <form action={entrer}>
                <input type="hidden" name="sessionId" value={sessionId} />
                <button type="submit" className={`${buttonClass.primary} mt-5`}>
                  Compléter ma fiche
                </button>
              </form>
            ) : (
              <>
                <p className="mt-5 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  Ce retour de paiement date de plus de deux heures : par sécurité, il
                  n&apos;ouvre plus de session. Demandez un lien de connexion, il arrive
                  tout de suite.
                </p>
                <Link href={ESPACE_PATH} className={`${buttonClass.ghost} mt-5`}>
                  Recevoir un lien de connexion
                </Link>
              </>
            )}
          </Panel>
        </>
      )}
    </main>
  );
}
