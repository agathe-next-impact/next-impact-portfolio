import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  accessDecision,
  consumeMagicLink,
  findPersonById,
  record,
} from "@cto/access";
import { ESPACE_PATH, startSession } from "../session";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Consommation d'un lien de secours.
 *
 * Cette page n'affiche rien : elle consomme, ouvre la session et redirige. Un
 * écran intermédiaire « cliquez pour confirmer » serait tentant pour se prémunir
 * des messageries qui préchargent les URL, mais il ajouterait un clic à chaque
 * connexion. Le compromis retenu est ailleurs : le message d'e-mail dit
 * explicitement que le lien ne fonctionne qu'une fois, et l'écran d'erreur
 * ci-dessous propose d'en redemander un.
 *
 * L'ordre des contrôles n'est pas négociable : consommer, PUIS vérifier que
 * l'accès est encore ouvert. Un jeton valide sur un espace clos doit être
 * brûlé quand même, sinon il resterait rejouable indéfiniment.
 */
export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ jeton?: string }>;
}) {
  const { jeton } = await searchParams;

  const outcome = await consumeMagicLink(jeton);

  if (!outcome.ok) {
    await record({ event: "acces_refuse", detail: `lien ${outcome.reason}` });
    return <Echec reason={outcome.reason} />;
  }

  const person = await findPersonById(outcome.personId);
  if (!person) {
    await record({ event: "acces_refuse", detail: "personne révoquée" });
    return <Echec reason="révoqué" />;
  }

  const decision = accessDecision(person.status);
  if (!decision.allowed) {
    await record({
      event: "acces_refuse",
      personId: person.id,
      clientId: person.clientId,
      detail: `espace ${person.status}`,
    });
    return <Echec reason="clos" />;
  }

  await startSession(person.id);
  await record({
    event: "connexion_lien",
    personId: person.id,
    clientId: person.clientId,
  });

  redirect(ESPACE_PATH);
}

const MESSAGES: Record<string, string> = {
  absent: "Ce lien est incomplet.",
  malformé: "Ce lien est incomplet.",
  signature: "Ce lien n'est pas valide.",
  expiré: "Ce lien a expiré. Les liens de connexion ne durent que quinze minutes.",
  consommé: "Ce lien a déjà servi. Chaque lien ne fonctionne qu'une fois.",
  révoqué: "Cet accès a été révoqué.",
  clos: "Cet espace est clos.",
};

function Echec({ reason }: { reason: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
        Connexion impossible
      </p>
      <h1 className="mt-3 font-sans text-2xl font-light text-foreground">
        {MESSAGES[reason] ?? "Ce lien n'est pas valide."}
      </h1>
      <p className="mt-6 font-inter-tight text-base text-mid-gray">
        Demandez-en un nouveau depuis la page de connexion.
      </p>
      <div className="mt-8">
        <a
          href={ESPACE_PATH}
          className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
        >
          Retour à la connexion
        </a>
      </div>
    </main>
  );
}
