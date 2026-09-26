import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { previousLoginAt } from "@cto/access";
import { listForClient, type Deliverable } from "@cto/deliverables";
import {
  actionsFor,
  clientProfile,
  GROUP_LABELS,
  missionsOf,
  sitePoints,
  siteVerdict,
  visibleSections,
  type Actions,
  type ClientProfile,
  type Mission,
  type Section,
  type SectionKey,
} from "@cto/espace";
import { siteStateFor, type SiteState } from "@cto/site";
import { nouveaute } from "./livrables";
import { NAV_COOKIE } from "./nav";
import { Sidebar, type NavBadge, type NavGroup } from "./sidebar";
import { buttonClass, Label, Notice, PageHeader, Panel } from "./ui";
import { ESPACE_PATH } from "./session";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Le gabarit commun des pages connectées : barre latérale, en-tête, contenu.
//
// La navigation n'affiche que les entrées de l'accompagnement (services
// cochés dans la fiche Notion, cf. `@cto/espace`), rangées par question :
// Missions, Votre site, Agir, Veille. Chaque page recharge le profil depuis la
// session : une section décochée dans Notion disparaît au balayage suivant,
// sans attendre que la personne se reconnecte.
//
// Le contact, les appareils, l'export et la déconnexion vivent en bas de la
// barre latérale : présents sur chaque page sans occuper le bas de chacune.
// ─────────────────────────────────────────────────────────────────────────────

export const CALENDLY_URL = "https://calendly.com/agathe-next-impact";

export function sectionHref(section: Section, base: string = ESPACE_PATH): string {
  return section.slug ? `${base}/${section.slug}` : base;
}

export interface EspaceContext {
  profile: ClientProfile;
  items: Deliverable[];
  sections: Section[];
  /** Connexion précédente de la personne. Null pour l'admin et à la première visite. */
  since: Date | null;
  /** Le relevé du site, si le suivi technique fait partie de l'accompagnement. */
  site: SiteState | null;
  missions: Mission[];
  actions: Actions;
}

/**
 * Ce que toute page connectée charge : profil, livrables, connexion
 * précédente et relevé du site, en parallèle.
 *
 * Tout sert deux fois — au contenu de la page et aux pastilles de la barre
 * latérale, qui doivent être justes sur chaque page. Les charger ici évite une
 * seconde lecture par page.
 */
export async function loadEspace(viewer: Viewer): Promise<EspaceContext> {
  const [profile, items, since] = await Promise.all([
    clientProfile(viewer.clientId),
    listForClient(viewer.clientId),
    viewer.personId ? previousLoginAt(viewer.personId) : Promise.resolve(null),
  ]);

  const count = (kind: Deliverable["kind"]) => items.filter((item) => item.kind === kind).length;
  const sections = visibleSections(profile.services, {
    decisions: count("decision"),
    cartographie: count("cartographie"),
    documents: count("document"),
    roadmap: count("roadmap"),
    prestations: count("prestation"),
    audits: count("audit"),
    site: profile.hasSite,
  });

  const site = sections.some((section) => section.key === "site") ? await siteStateFor(viewer.clientId) : null;
  const now = new Date();

  return {
    profile,
    items,
    sections,
    since,
    site,
    missions: missionsOf(items, now),
    actions: actionsFor(items, site?.snapshot ?? null, now),
  };
}

/** Vrai si la section fait partie de celles de l'accompagnement. */
export function sectionOuverte(context: EspaceContext, key: SectionKey): boolean {
  return context.sections.some((section) => section.key === key);
}

/** Un e-mail à Agathe, sujet prérempli : l'entreprise, et la chose dont on veut parler. */
export function contactHref(company: string, objet?: string): string {
  const sujet = objet ? `[Espace direction] ${company} · ${objet}` : `[Espace direction] ${company}`;
  return `mailto:agathe@next-impact.digital?subject=${encodeURIComponent(sujet)}`;
}

// ─── Pastilles ───────────────────────────────────────────────────────────

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

function nouveautes(context: EspaceContext, kinds: Deliverable["kind"][]): NavBadge | null {
  const n = context.items.filter((item) => kinds.includes(item.kind) && nouveaute(item, context.since)).length;
  if (n === 0) return null;
  return {
    text: String(n),
    description: `${n} ${pluriel(n, "nouveauté", "nouveautés")} depuis votre dernière connexion`,
    tone: "nouveau",
  };
}

/**
 * La pastille de chaque entrée : ce qui mérite d'y aller maintenant.
 *
 * Toujours un texte, jamais une couleur seule — le rail replié réduit la
 * pastille à un point, et c'est la description qui porte alors l'information.
 */
function badgeFor(key: SectionKey, context: EspaceContext): NavBadge | null {
  switch (key) {
    case "missions": {
      const enCours = context.missions.filter((mission) => mission.phase === "en-cours").length;
      const retard = context.missions.filter((mission) => mission.overdue).length;
      if (retard > 0) return { text: `${retard} en retard`, description: `${retard} en retard`, tone: "alerte" };
      if (enCours === 0) return null;
      return { text: String(enCours), description: `${enCours} en cours`, tone: "neutre" };
    }
    case "prestations":
      return nouveautes(context, ["prestation"]);
    case "decisions":
      return nouveautes(context, ["decision"]);
    case "audit":
      return nouveautes(context, ["audit"]);
    case "cartographie":
      return nouveautes(context, ["cartographie"]);
    case "documents":
      return nouveautes(context, ["document"]);
    case "veille":
      return nouveautes(context, ["veille"]);
    case "site": {
      if (!context.site?.snapshot) return null;
      const points = sitePoints(context.site.snapshot);
      if (points.length === 0) return null;
      const alertes = points.filter((point) => point.tone === "alerte").length;
      return {
        text: String(alertes || points.length),
        description: siteVerdict(context.site).headline,
        tone: alertes > 0 ? "alerte" : "attention",
      };
    }
    case "a-traiter": {
      const n = context.actions.aTraiter.length;
      if (n === 0) return null;
      const urgent = context.actions.aTraiter.some((action) => action.tone === "alerte");
      return { text: String(n), description: `${n} à traiter`, tone: urgent ? "alerte" : "attention" };
    }
    case "a-arbitrer": {
      const n = context.actions.aArbitrer.length;
      return n === 0 ? null : { text: String(n), description: `${n} à arbitrer`, tone: "nouveau" };
    }
    default:
      return null;
  }
}

function navigation(context: EspaceContext, active: SectionKey | null, base: string): NavGroup[] {
  const groups: NavGroup[] = [];
  for (const section of context.sections) {
    const label = section.group ? GROUP_LABELS[section.group] : null;
    let groupe = groups.find((candidate) => candidate.label === label);
    if (!groupe) {
      groupe = { label, items: [] };
      groups.push(groupe);
    }
    groupe.items.push({
      key: section.key,
      href: sectionHref(section, base),
      label: section.label,
      active: section.key === active,
      badge: badgeFor(section.key, context),
    });
  }
  return groups;
}

// ─── Contact ─────────────────────────────────────────────────────────────

/**
 * Le contact en grand, sur l'accueil et les pages « Agir ».
 *
 * Deux voies, parce qu'un client en cours d'accompagnement n'a pas les mêmes
 * besoins qu'un prospect : écrire directement (une question, un devis à relire)
 * ou réserver un créneau. Pas de formulaire de contact générique — il
 * mettrait le client dans la file des inconnus. La barre latérale en garde une
 * version compacte sur toutes les autres pages.
 */
export function ContactCta({ company }: { company: string }) {
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
          <a href={contactHref(company)} className={buttonClass.primary}>
            Écrire à Agathe
          </a>
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer noopener" className={buttonClass.ghost}>
            Réserver un créneau ↗
          </a>
        </div>
      </Panel>
    </section>
  );
}

// ─── Gabarit ─────────────────────────────────────────────────────────────

const LARGEURS = {
  /** Accueil et vues d'ensemble : trois colonnes, une frise. */
  large: "max-w-6xl",
  normale: "max-w-5xl",
  /** Lecture longue : audit, lettre. */
  lecture: "max-w-4xl",
} as const;

/**
 * Le gabarit.
 *
 * `active` vaut null pour une page hors navigation (une lettre, un historique) :
 * aucune entrée n'est alors marquée courante, ce qui est vrai.
 */
export async function Espace({
  viewer,
  context,
  active,
  title,
  intro,
  largeur = "normale",
  children,
}: {
  viewer: Viewer;
  context: EspaceContext;
  active: SectionKey | null;
  title: string;
  intro?: ReactNode;
  largeur?: keyof typeof LARGEURS;
  children: ReactNode;
}) {
  const rail = (await cookies()).get(NAV_COOKIE)?.value === "rail";

  // Une section ouverte depuis l'admin alors que le client ne l'a pas : on la
  // montre quand même (c'est tout l'intérêt de la supervision), mais on le dit.
  const horsServices =
    viewer.admin && active !== null && !context.sections.some((section) => section.key === active);

  const aTraiter = context.actions.aTraiter.length;

  return (
    <div className="lg:flex">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-obsidian focus:px-4 focus:py-2 focus:text-foreground"
      >
        Aller au contenu
      </a>

      <Sidebar
        company={viewer.company}
        person={
          viewer.personName ? `${viewer.personName}${viewer.personRole ? ` · ${viewer.personRole}` : ""}` : viewer.admin ? "Vue administrateur" : null
        }
        groups={navigation(context, active, viewer.base)}
        initialCollapsed={rail}
        signal={
          aTraiter > 0
            ? {
                text: `${aTraiter} à traiter`,
                description: `${aTraiter} à traiter`,
                tone: context.actions.aTraiter.some((action) => action.tone === "alerte") ? "alerte" : "attention",
              }
            : null
        }
        contact={{ mailto: contactHref(viewer.company), calendly: CALENDLY_URL }}
        appareilsHref={viewer.admin ? null : `${ESPACE_PATH}/appareils`}
        restitution={{
          href: `${viewer.base}/restitution`,
          label: viewer.admin ? "Exporter son dossier (PDF)" : "Exporter mon dossier (PDF)",
        }}
        admin={viewer.admin}
      />

      <main id="contenu" className="min-w-0 flex-1">
        <div className={`mx-auto ${LARGEURS[largeur]} px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12`}>
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
        </div>
      </main>
    </div>
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
