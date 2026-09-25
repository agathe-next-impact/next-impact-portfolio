import type { ReactNode } from "react";
import Link from "next/link";
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
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Le gabarit commun des pages connectées : en-tête, navigation par sections,
// contenu, contact, pied.
//
// La navigation n'affiche que les sections de l'accompagnement (services
// cochés dans la fiche Notion, cf. `@cto/espace`). Chaque page recharge le
// profil depuis la session : une section décochée dans Notion disparaît au
// balayage suivant, sans attendre que la personne se reconnecte.
// ─────────────────────────────────────────────────────────────────────────────

export function sectionHref(section: Section, base: string = ESPACE_PATH): string {
  return section.slug ? `${base}/${section.slug}` : base;
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
export async function loadEspace(clientId: string): Promise<EspaceContext> {
  const [profile, items] = await Promise.all([clientProfile(clientId), listForClient(clientId)]);

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

function Navigation({
  sections,
  active,
  base,
}: {
  sections: Section[];
  active: SectionKey | null;
  base: string;
}) {
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
                href={sectionHref(section, base)}
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
  viewer,
  context,
  active,
  title,
  intro,
  children,
}: {
  viewer: Viewer;
  context: EspaceContext;
  active: SectionKey | null;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  // Une section ouverte depuis l'admin alors que le client ne l'a pas : on la
  // montre quand même (c'est tout l'intérêt de la supervision), mais on le dit.
  const horsServices =
    viewer.admin && active !== null && !context.sections.some((section) => section.key === active);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      {viewer.admin ? (
        <div className="mb-8">
          <Notice tone="info">
            Vue administrateur — l&rsquo;espace tel que le voit {viewer.company}, en lecture seule.
            Les liens restent dans la supervision.
          </Notice>
        </div>
      ) : null}

      <PageHeader company={viewer.company} title={title}>
        {intro}
      </PageHeader>

      <Navigation sections={context.sections} active={active} base={viewer.base} />

      {horsServices ? (
        <div className="mt-8">
          <Notice tone="erreur">
            Section non souscrite : ce client ne la voit pas. Cochez le service dans sa fiche
            Notion pour la lui ouvrir.
          </Notice>
        </div>
      ) : null}

      {viewer.notice ? (
        <div className="mt-8">
          <Notice tone="info">{viewer.notice}</Notice>
        </div>
      ) : null}

      {children}

      <ContactCta company={viewer.company} />

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dark-gray pt-6">
        <div className="flex flex-wrap gap-2">
          {viewer.admin ? null : (
            <Link href={`${ESPACE_PATH}/appareils`} className={buttonClass.quiet}>
              Mes appareils
            </Link>
          )}
          <a href={`${viewer.base}/restitution`} className={buttonClass.quiet}>
            {viewer.admin ? "Exporter son dossier (PDF)" : "Exporter mon dossier (PDF)"}
          </a>
        </div>
        {viewer.admin ? null : (
          <form action={deconnexion}>
            <button type="submit" className={buttonClass.quiet}>
              Se déconnecter
            </button>
          </form>
        )}
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
