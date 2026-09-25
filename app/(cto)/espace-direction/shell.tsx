import type { ReactNode } from "react";
import Link from "next/link";
import type { ResolvedSession } from "@cto/access";
import { listForClient, type Deliverable } from "@cto/deliverables";
import {
  clientProfile,
  visibleSections,
  type ClientProfile,
  type Section,
  type SectionKey,
} from "@cto/espace";
import { deconnexion } from "./actions";
import { buttonClass, Label, Notice, PageHeader, Panel } from "./ui";
import { ESPACE_PATH } from "./session";

// ─────────────────────────────────────────────────────────────────────────────
// Le gabarit commun des pages connectées : en-tête, navigation par sections,
// contenu, contact, pied.
//
// La navigation n'affiche que les sections de l'accompagnement (services
// cochés dans la fiche Notion, cf. `@cto/espace`). Chaque page recharge le
// profil depuis la session : une section décochée dans Notion disparaît au
// balayage suivant, sans attendre que la personne se reconnecte.
// ─────────────────────────────────────────────────────────────────────────────

export function sectionHref(section: Section): string {
  return section.slug ? `${ESPACE_PATH}/${section.slug}` : ESPACE_PATH;
}

export interface EspaceContext {
  profile: ClientProfile;
  items: Deliverable[];
  sections: Section[];
}

/**
 * Ce que toute page connectée charge : profil et livrables, en parallèle.
 *
 * Les livrables servent deux fois — au contenu de la page et au régime
 * historique des sections (`services === null` : une section s'affiche si elle
 * a du contenu). Les charger ici évite une seconde lecture par page.
 */
export async function loadEspace(session: ResolvedSession): Promise<EspaceContext> {
  const [profile, items] = await Promise.all([
    clientProfile(session.person.clientId),
    listForClient(session.person.clientId),
  ]);

  const count = (kind: Deliverable["kind"]) => items.filter((item) => item.kind === kind).length;
  const sections = visibleSections(profile.services, {
    decisions: count("decision"),
    cartographie: count("cartographie"),
    documents: count("document"),
    roadmap: count("roadmap"),
    prestations: count("prestation"),
    site: profile.hasSite,
  });

  return { profile, items, sections };
}

/** Vrai si la section fait partie de celles de l'accompagnement. */
export function sectionOuverte(context: EspaceContext, key: SectionKey): boolean {
  return context.sections.some((section) => section.key === key);
}

function Navigation({ sections, active }: { sections: Section[]; active: SectionKey | null }) {
  return (
    <nav aria-label="Sections de votre espace" className="mt-6 border-b border-dark-gray">
      {/* Défilement horizontal sur mobile : six onglets ne tiennent pas sur 360 px,
          et les empiler ferait de la navigation un menu à part entière. */}
      <ul className="-mx-6 flex gap-1 overflow-x-auto px-6">
        {sections.map((section) => {
          const courant = section.key === active;
          return (
            <li key={section.key} className="shrink-0">
              <Link
                href={sectionHref(section)}
                aria-current={courant ? "page" : undefined}
                className={`block border-b-2 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  courant
                    ? "border-accent-secondary text-foreground"
                    : "border-transparent text-mid-gray hover:text-foreground"
                }`}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Le contact, sur toutes les pages.
 *
 * Deux voies, parce qu'un client en cours d'accompagnement n'a pas les mêmes
 * besoins qu'un prospect : écrire directement (une question, un devis à relire)
 * ou réserver un créneau. Pas de formulaire de contact générique — il
 * mettrait le client dans la file des inconnus.
 */
export function ContactCta({ company }: { company: string }) {
  const sujet = encodeURIComponent(`[Espace direction] ${company}`);

  return (
    <section aria-labelledby="contact-titre" className="mt-16">
      <Panel className="border-l-2 border-l-accent-secondary px-5 py-6 sm:px-6">
        <Label>Une question, un devis à faire relire, une décision à prendre ?</Label>
        <h2 id="contact-titre" className="mt-2 font-sans text-xl font-light text-foreground">
          Parlons-en avant que ça ne devienne urgent.
        </h2>
        <p className="mt-2 max-w-prose font-inter-tight text-sm leading-relaxed text-mid-gray">
          Réponse sous un jour ouvré. Pour un arbitrage qui ne peut pas attendre le prochain
          comité, réservez directement un créneau.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={`mailto:agathe@next-impact.digital?subject=${sujet}`} className={buttonClass.primary}>
            Écrire à Agathe
          </a>
          <a
            href="https://calendly.com/agathe-next-impact"
            target="_blank"
            rel="noreferrer noopener"
            className={buttonClass.ghost}
          >
            Réserver un créneau ↗
          </a>
        </div>
      </Panel>
    </section>
  );
}

/**
 * Le gabarit.
 *
 * `active` vaut null pour une page hors navigation (une lettre, un historique) :
 * aucun onglet n'est alors marqué courant, ce qui est vrai.
 */
export function Espace({
  session,
  context,
  active,
  title,
  intro,
  children,
}: {
  session: ResolvedSession;
  context: EspaceContext;
  active: SectionKey | null;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <PageHeader company={session.person.company} title={title}>
        {intro}
      </PageHeader>

      <Navigation sections={context.sections} active={active} />

      {session.decision.notice ? (
        <div className="mt-8">
          <Notice tone="info">{session.decision.notice}</Notice>
        </div>
      ) : null}

      {children}

      <ContactCta company={session.person.company} />

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dark-gray pt-6">
        <div className="flex flex-wrap gap-2">
          <Link href={`${ESPACE_PATH}/appareils`} className={buttonClass.quiet}>
            Mes appareils
          </Link>
          <a href={`${ESPACE_PATH}/restitution`} className={buttonClass.quiet}>
            Exporter mon dossier (PDF)
          </a>
        </div>
        <form action={deconnexion}>
          <button type="submit" className={buttonClass.quiet}>
            Se déconnecter
          </button>
        </form>
      </footer>
    </main>
  );
}

/**
 * Ce qu'affiche une section souscrite mais encore vide.
 *
 * Le client voit ce qu'il a acheté dès le premier jour ; lui cacher la section
 * jusqu'au premier livrable lui ferait croire qu'elle manque.
 */
export function EnPreparation({ children }: { children: ReactNode }) {
  return (
    <Panel className="mt-10 px-5 py-6">
      <Label>En préparation</Label>
      <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{children}</p>
    </Panel>
  );
}
