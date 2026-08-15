import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sendLoginLink } from "@sentinelle/access";
import { listReceivedAlerts, listReceivedIssues, openBillingPortal, periodLabel } from "@sentinelle/espace";
import { getFiche, watchedCount } from "@sentinelle/onboarding";
import {
  buttonClass,
  formatDate,
  inputClass,
  Label,
  Notice,
  Panel,
  VerdictBadge,
} from "./ui";
import {
  closeClientSession,
  configurationIssue,
  currentClientId,
  ESPACE_PATH,
} from "./session";

export const metadata: Metadata = {
  title: "Sentinelle — votre espace",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Espace client.
 *
 * Une seule URL pour deux états — connecté ou non — plutôt qu'une page de
 * connexion séparée : c'est l'adresse qu'un abonné met en favori, elle doit
 * marcher dans les deux cas.
 */
export default async function EspacePage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string; message?: string; erreur?: string }>;
}) {
  const { envoye, message, erreur } = await searchParams;
  const clientId = await currentClientId();

  if (!clientId) {
    return <Connexion envoye={envoye === "1"} erreur={erreur} />;
  }

  const fiche = await getFiche(clientId);
  if (!fiche) {
    // Fiche effacée pendant que la session courait (purge, demande
    // d'effacement). On ne peut pas supprimer le cookie en cours de rendu ;
    // le formulaire de connexion est la bonne sortie.
    return <Connexion envoye={false} erreur="fiche-absente" />;
  }

  const [alertes, numeros] = await Promise.all([
    listReceivedAlerts(clientId),
    listReceivedIssues(clientId),
  ]);

  const suivis = watchedCount(fiche.components);
  const host = fiche.client.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  async function ouvrirFacturation() {
    "use server";

    // Une action serveur est une URL publique : elle revérifie la session pour
    // son propre compte, sans faire confiance à l'écran qui l'a affichée.
    const id = await currentClientId();
    if (!id) redirect(ESPACE_PATH);

    const courant = await getFiche(id);
    const outcome = await openBillingPortal(courant?.client.stripeCustomerId ?? null);

    redirect(
      outcome.ok
        ? outcome.url
        : `${ESPACE_PATH}?message=${encodeURIComponent(outcome.reason)}&erreur=1`,
    );
  }

  async function seDeconnecter() {
    "use server";

    await closeClientSession();
    redirect(ESPACE_PATH);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <Label>Sentinelle · Votre espace</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        {host}
      </h1>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        {fiche.client.active
          ? `${fiche.components.length} composant${fiche.components.length > 1 ? "s" : ""} en fiche, dont ${suivis} suivi${suivis > 1 ? "s" : ""} par une source de veille automatique.`
          : "Votre abonnement est résilié. Vos données restent accessibles trois mois, puis sont effacées."}
      </p>

      {message && (
        <div className="mt-8">
          <Notice message={message} tone={erreur ? "erreur" : "ok"} />
        </div>
      )}

      {!fiche.client.onboardedAt && (
        <Panel className="mt-10 p-6">
          <Label>À faire une fois</Label>
          <p className="mt-3 font-inter-tight text-base leading-relaxed text-foreground">
            L&apos;analyse voit ce que votre site sert aux visiteurs. Elle ne voit ni les
            extensions chargées uniquement en administration, ni votre version exacte de
            PHP, ni votre hébergeur. Cinq minutes pour les déclarer, et la surveillance
            passe de partielle à exacte.
          </p>
          <Link href="/espace/fiche" className={`${buttonClass.primary} mt-5`}>
            Compléter ma fiche
          </Link>
        </Panel>
      )}

      <section className="mt-14">
        <Label>Alertes reçues</Label>

        {alertes.length === 0 ? (
          <p className="mt-4 font-inter-tight text-base leading-relaxed text-mid-gray">
            Aucune alerte à ce jour. C&apos;est la bonne nouvelle : rien de ce qui a été
            publié ne concerne les composants de votre site. Vous ne recevez de message que
            quand il y a quelque chose à faire.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-dark-gray border-y border-dark-gray">
            {alertes.map((alerte) => (
              <li key={alerte.id} className="py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <VerdictBadge verdict={alerte.verdict} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {alerte.sentAt ? formatDate(alerte.sentAt) : ""} · {alerte.component.label}
                    {alerte.component.version ? ` ${alerte.component.version}` : ""}
                  </span>
                </div>
                <p className="mt-3 font-inter-tight text-lg leading-snug text-foreground">
                  {alerte.content.title}
                </p>
                {alerte.content.recommendedAction && (
                  <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {alerte.content.recommendedAction}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <Label>Vos numéros</Label>

        {numeros.length === 0 ? (
          <p className="mt-4 font-inter-tight text-base leading-relaxed text-mid-gray">
            Le premier numéro part au prochain 1er ou 15 du mois.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-dark-gray border-y border-dark-gray">
            {numeros.map((numero) => (
              <li key={numero.id} className="flex items-baseline justify-between gap-4 py-4">
                <Link
                  href={`/espace/numeros/${numero.id}`}
                  className="font-inter-tight text-base text-foreground underline-offset-4 hover:underline"
                >
                  Numéro du {periodLabel(numero.period)}
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                  {numero.sentAt ? formatDate(numero.sentAt) : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <Label>Votre fiche</Label>
        <p className="mt-4 font-inter-tight text-base leading-relaxed text-mid-gray">
          {fiche.components.length} composant{fiche.components.length > 1 ? "s" : ""} en
          surveillance. C&apos;est cette liste qui est confrontée chaque jour aux
          publications de failles et aux fins de support.
        </p>
        <Link href="/espace/fiche" className={`${buttonClass.ghost} mt-5`}>
          Voir et compléter ma fiche
        </Link>
      </section>

      <section className="mt-14 border-t border-dark-gray pt-8">
        <Label>Abonnement</Label>
        <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
          Factures, moyen de paiement, résiliation : tout se fait depuis la page de
          facturation Stripe. Résilier prend deux clics et ne demande d&apos;écrire à
          personne.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <form action={ouvrirFacturation}>
            <button type="submit" className={buttonClass.ghost}>
              Gérer mon abonnement
            </button>
          </form>
          <form action={seDeconnecter}>
            <button type="submit" className={buttonClass.quiet}>
              Se déconnecter
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

/**
 * Formulaire de demande de lien.
 *
 * Le message de retour est **le même que l'adresse soit cliente ou non**. Dire
 * « adresse inconnue » transformerait ce formulaire en outil de vérification :
 * on saurait, en quelques essais, qui est client de Sentinelle.
 */
function Connexion({ envoye, erreur }: { envoye: boolean; erreur?: string }) {
  const probleme = configurationIssue();

  async function demanderLien(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const outcome = await sendLoginLink(email);

    if (!outcome.sent) {
      // Journalisé, jamais affiché : l'écran ne doit rien laisser deviner.
      console.info(`[sentinelle] lien de connexion non envoyé — ${outcome.reason}`);
    }

    redirect(`${ESPACE_PATH}?envoye=1`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Label>Sentinelle · Votre espace</Label>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground">
        Accéder à mon espace
      </h1>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        Pas de mot de passe : vous recevez un lien de connexion à l&apos;adresse de votre
        abonnement.
      </p>

      {erreur === "fiche-absente" && (
        <div className="mt-8">
          <Notice
            tone="erreur"
            message="Cet espace n'existe plus. Si votre abonnement est actif, demandez un nouveau lien ci-dessous."
          />
        </div>
      )}

      {probleme ? (
        <div className="mt-8">
          <Notice tone="erreur" message={probleme} />
        </div>
      ) : (
        <Panel className="mt-8 p-6">
          {envoye ? (
            <>
              <p className="font-inter-tight text-base leading-relaxed text-foreground">
                Si cette adresse correspond à un abonnement, un lien de connexion vient de
                partir. Il vaut quinze minutes et ne fonctionne qu&apos;une fois.
              </p>
              <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
                Rien reçu&nbsp;? Regardez dans les indésirables, puis réessayez avec
                l&apos;adresse utilisée au moment du paiement.
              </p>
              <Link href={ESPACE_PATH} className={`${buttonClass.ghost} mt-6`}>
                Réessayer
              </Link>
            </>
          ) : (
            <form action={demanderLien}>
              <label
                htmlFor="email"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="vous@exemple.fr"
                className={`${inputClass} mt-3`}
              />
              <button type="submit" className={`${buttonClass.primary} mt-4 w-full`}>
                Recevoir mon lien
              </button>
            </form>
          )}
        </Panel>
      )}

      <p className="mt-8 font-inter-tight text-sm leading-relaxed text-mid-gray">
        Pas encore abonné&nbsp;?{" "}
        <a href="/sentinelle" className="underline underline-offset-4">
          Découvrir Sentinelle
        </a>
        .
      </p>
    </main>
  );
}
