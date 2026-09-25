import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  accessDecision,
  findPersonByEmail,
  issueMagicLink,
  previousLoginAt,
  record,
  sendLoginLink,
  MAGIC_LINK_TTL_MS,
} from "@cto/access";
import type { Deliverable } from "@cto/deliverables";
import { buildEvents } from "@cto/espace";
import { lettersForClient } from "@cto/letters";
import { siteStateFor } from "@cto/site";
import { Calendrier } from "./calendrier";
import { DerniereLettre, LETTRES_PATH } from "./lettre";
import {
  CATEGORIES,
  categoriePath,
  DepuisLaDerniereFois,
  Nouveaute,
  Synthese,
  type CategorieKind,
} from "./livrables";
import { PasskeyLoginButton } from "./passkey";
import { Espace, loadEspace, sectionOuverte } from "./shell";
import { SanteSite } from "./suivi";
import { buttonClass, formatDay, inputClass, Label, Notice, Panel } from "./ui";
import { configurationIssue, currentSession, ESPACE_PATH } from "./session";

export const metadata: Metadata = {
  title: "Espace direction technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MINUTES = Math.round(MAGIC_LINK_TTL_MS / 60000);

/**
 * Une seule URL pour deux états, connecté ou non.
 *
 * Plutôt qu'une page de connexion séparée : c'est l'adresse que le client met en
 * favori, elle doit marcher dans les deux cas. Un favori qui tombe sur un écran
 * de connexion inutile le jour où la session est encore valide finit par être
 * supprimé.
 */
export default async function EspaceDirectionPage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string; message?: string; erreur?: string }>;
}) {
  const { envoye, message, erreur } = await searchParams;
  const session = await currentSession();

  if (!session) {
    return <Connexion envoye={envoye === "1"} message={message} erreur={erreur === "1"} />;
  }

  const context = await loadEspace(session);
  const suivi = sectionOuverte(context, "suivi-technique");

  // Lectures indépendantes, en parallèle : la page est celle qu'on ouvre pour
  // trouver une réponse en dix secondes.
  const [lettres, since, site] = await Promise.all([
    lettersForClient(session.person.clientId),
    previousLoginAt(session.person.id),
    suivi ? siteStateFor(session.person.clientId) : Promise.resolve(null),
  ]);

  const { items } = context;
  const now = new Date();
  const roadmap = items.filter((item) => item.kind === "roadmap");
  const decisions = items.filter((item) => item.kind === "decision");
  const carto = items.filter((item) => item.kind === "cartographie");

  const events = buildEvents(
    items,
    lettres.map((lettre) => ({
      title: lettre.title,
      period: lettre.period,
      href: `${LETTRES_PATH}/${lettre.notionPageId}`,
    })),
    (item) =>
      item.kind in CATEGORIES ? categoriePath(item.kind as CategorieKind) : null,
    now,
  );

  return (
    <Espace
      session={session}
      context={context}
      active="tableau"
      title="Tableau de bord"
      intro={
        <p className="font-inter-tight text-base text-mid-gray">
          {session.person.name}
          {session.person.role ? ` — ${session.person.role}` : ""}
        </p>
      }
    >
      {/*
        Le refus d'un lien de connexion s'affiche AUSSI quand une session est
        déjà ouverte. Sans ce bloc, cliquer un lien expiré alors qu'on est
        connecté sous une autre identité ramène en silence sur l'espace courant :
        l'écran a l'air de s'être trompé de client, alors qu'il n'a fait
        qu'ignorer un lien mort. Le cas est fréquent dès qu'on gère plusieurs
        accompagnements.
      */}
      {erreur === "1" && message ? (
        <div className="mt-8">
          <Notice tone="erreur">
            {message} Vous restez connecté en tant que {session.person.company}.
          </Notice>
        </div>
      ) : null}

      <DepuisLaDerniereFois items={items} since={since} />

      {roadmap.length + decisions.length + carto.length > 0 ? (
        <Synthese roadmap={roadmap} decisions={decisions} carto={carto} now={now.getTime()} />
      ) : null}

      {site ? <SanteSite state={site} /> : null}

      <Calendrier events={events} now={now} />

      <ALaUne items={items.filter((item) => item.featured)} since={since} />

      <DerniereLettre lettres={lettres} />
    </Espace>
  );
}

const KIND_TITRES: Record<string, string> = {
  roadmap: "Chantier",
  decision: "Décision",
  cartographie: "Système",
  veille: "Veille",
  document: "Document",
  prestation: "Prestation",
};

/**
 * Ce qui a été mis à la une, toutes sections confondues.
 *
 * La mise en avant se décide dans l'atelier (colonne « Affichage ») ; le
 * tableau de bord la respecte sans la réinterpréter. Une ligne par entrée, qui
 * mène à sa section : le détail vit là-bas, pas ici.
 */
function ALaUne({ items, since }: { items: Deliverable[]; since: Date | null }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="une-titre" className="mt-12">
      <div className="border-b border-dark-gray pb-3">
        <h2 id="une-titre" className="font-sans text-lg font-light text-foreground">
          À la une
        </h2>
      </div>
      <Panel className="mt-5 divide-y divide-dark-gray">
        {items.slice(0, 8).map((item) => (
          <div key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
            <div className="flex min-w-0 flex-wrap items-baseline gap-2">
              <Nouveaute item={item} since={since} />
              {item.kind in CATEGORIES ? (
                <Link
                  href={categoriePath(item.kind as CategorieKind)}
                  className="font-inter-tight text-sm text-foreground underline-offset-4 hover:text-accent-secondary hover:underline"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="font-inter-tight text-sm text-foreground">{item.title}</span>
              )}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
              {KIND_TITRES[item.kind] ?? item.kind}
              {item.occurredAt ? ` · ${formatDay(item.occurredAt)}` : ""}
            </span>
          </div>
        ))}
      </Panel>
    </section>
  );
}

/**
 * L'écran de connexion.
 *
 * Deux voies, dans l'ordre de ce qu'on souhaite que le client utilise : la
 * passkey d'abord, le lien de secours ensuite. Le second n'est pas caché derrière
 * un repli — il reste visible en permanence, parce qu'une passkey se perd avec un
 * téléphone et que personne ne doit se retrouver enfermé dehors.
 */
async function Connexion({
  envoye,
  message,
  erreur,
}: {
  envoye: boolean;
  message?: string;
  erreur: boolean;
}) {
  const probleme = configurationIssue();

  async function demanderLien(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const person = await findPersonByEmail(email);

    // Réponse volontairement identique que l'adresse existe ou non : cet écran
    // ne doit jamais servir à savoir qui est client. Le cas « inconnue » sort
    // donc par le même chemin que le cas nominal.
    if (person) {
      const decision = accessDecision(person.status);

      if (!decision.allowed) {
        await record({
          event: "acces_refuse",
          personId: person.id,
          clientId: person.clientId,
          detail: `espace ${person.status}`,
        });
      } else {
        const issued = await issueMagicLink(person.id);

        if (issued.ok) {
          const base =
            process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
          const url = `${base}${ESPACE_PATH}/connexion?jeton=${encodeURIComponent(issued.token)}`;

          try {
            await sendLoginLink({ email: person.email, name: person.name }, url);
          } catch (error) {
            console.error("[cto] envoi du lien impossible", error);
            redirect(
              `${ESPACE_PATH}?erreur=1&message=${encodeURIComponent("L'envoi a échoué. Réessayez dans un instant.")}`,
            );
          }
        }
        // `issued.ok === false` (trop de demandes) sort aussi par le message
        // neutre : dire « vous en avez déjà demandé trois » à quelqu'un qui n'a
        // rien demandé lui apprendrait qu'un tiers essaie d'entrer sur son
        // compte, sans lui donner le moyen d'agir.
      }
    }

    redirect(`${ESPACE_PATH}?envoye=1`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <Label>Next Impact — Direction technique</Label>
      <h1 className="mt-3 font-sans text-2xl font-light text-foreground sm:text-3xl">
        Votre espace
      </h1>

      {probleme ? (
        <div className="mt-8">
          <Notice tone="erreur">{probleme}</Notice>
        </div>
      ) : (
        <>
          {envoye ? (
            <div className="mt-8">
              <Notice tone="succes">
                Si cette adresse est enregistrée, un lien de connexion vient de partir.
                Il est valable {MINUTES} minutes et ne fonctionne qu'une fois.
              </Notice>
            </div>
          ) : null}

          {erreur && message ? (
            <div className="mt-8">
              <Notice tone="erreur">{message}</Notice>
            </div>
          ) : null}

          <div className="mt-10">
            <PasskeyLoginButton />
          </div>

          <div className="mt-10 border-t border-dark-gray pt-8">
            <Label>Sans passkey</Label>
            <p className="mt-3 font-inter-tight text-sm text-mid-gray">
              Premier accès, nouvel appareil, passkey perdue : recevez un lien de
              connexion par e-mail.
            </p>
            <form action={demanderLien} className="mt-5 space-y-4">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="votre adresse professionnelle"
                aria-label="Votre adresse e-mail"
                className={inputClass}
              />
              <button type="submit" className={buttonClass.ghost}>
                Recevoir un lien
              </button>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
