import Link from "next/link";
import { previousLoginAt } from "@cto/access";
import { history, type Deliverable, type RoadmapPayload } from "@cto/deliverables";
import { buildEvents } from "@cto/espace";
import { ARCHIVE_MONTHS, letterForClient, lettersForClient } from "@cto/letters";
import { siteReportsFor, siteStateFor } from "@cto/site";
import { Calendrier } from "./calendrier";
import { Historique } from "./historique";
import { CorpsLettre, DerniereLettre, formatPeriode, lettresPath, ListeLettres } from "./lettre";
import {
  CATEGORIES,
  Cartographie,
  Categorie,
  categoriePath,
  Decisions,
  DepuisLaDerniereFois,
  Documents,
  Nouveaute,
  Prestations,
  Roadmap,
  sortCartographie,
  sortPrestations,
  sortRecentFirst,
  sortRoadmap,
  Synthese,
  Veille,
  type CategorieKind,
} from "./livrables";
import { EnPreparation, Espace, sectionOuverte, type EspaceContext } from "./shell";
import { SanteSite, SuiviTechnique } from "./suivi";
import { BackLink, formatDay, Label, Notice, Panel } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Les écrans de l'espace, indépendants de qui les regarde.
//
// Chaque vue reçoit un `Viewer` (client ou admin) et le contexte déjà chargé,
// et rend la page entière. Les pages de `/espace-direction` et la vue admin
// `/admin-cto/pilotage/clients/<id>/espace` sont deux portes vers les MÊMES
// vues : ce que l'admin voit est, par construction, ce que le client voit.
//
// Seule différence assumée : l'admin n'a pas de « dernière connexion », donc
// pas de pastilles « Nouveau » ni de bandeau « depuis votre dernière visite ».
// ─────────────────────────────────────────────────────────────────────────────

/** Connexion précédente de la personne. Aucune pour l'admin. */
function sinceFor(viewer: Viewer): Promise<Date | null> {
  return viewer.personId ? previousLoginAt(viewer.personId) : Promise.resolve(null);
}

function hrefFor(viewer: Viewer, item: Deliverable): string | null {
  return item.kind in CATEGORIES ? categoriePath(item.kind as CategorieKind, viewer.base) : null;
}

// ─── Tableau de bord ─────────────────────────────────────────────────────

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
function ALaUne({ items, since, viewer }: { items: Deliverable[]; since: Date | null; viewer: Viewer }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="une-titre" className="mt-12">
      <div className="border-b border-dark-gray pb-3">
        <h2 id="une-titre" className="font-sans text-lg font-light text-foreground">
          À la une
        </h2>
      </div>
      <Panel className="mt-5 divide-y divide-dark-gray">
        {items.slice(0, 8).map((item) => {
          const href = hrefFor(viewer, item);
          return (
            <div key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
              <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                <Nouveaute item={item} since={since} />
                {href ? (
                  <Link
                    href={href}
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
          );
        })}
      </Panel>
    </section>
  );
}

export async function VueTableau({
  viewer,
  context,
  erreur,
}: {
  viewer: Viewer;
  context: EspaceContext;
  /** Message d'un lien de connexion refusé, affiché même session ouverte. */
  erreur?: string | null;
}) {
  const suivi = sectionOuverte(context, "suivi-technique");
  const [lettres, since, site] = await Promise.all([
    lettersForClient(viewer.clientId),
    sinceFor(viewer),
    suivi ? siteStateFor(viewer.clientId) : Promise.resolve(null),
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
      href: `${lettresPath(viewer.base)}/${lettre.notionPageId}`,
    })),
    (item) => hrefFor(viewer, item),
    now,
  );

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="tableau"
      title="Tableau de bord"
      intro={
        viewer.personName ? (
          <p className="font-inter-tight text-base text-mid-gray">
            {viewer.personName}
            {viewer.personRole ? ` — ${viewer.personRole}` : ""}
          </p>
        ) : undefined
      }
    >
      {erreur ? (
        <div className="mt-8">
          <Notice tone="erreur">
            {erreur} Vous restez connecté en tant que {viewer.company}.
          </Notice>
        </div>
      ) : null}

      <DepuisLaDerniereFois items={items} since={since} base={viewer.base} />

      {roadmap.length + decisions.length + carto.length > 0 ? (
        <Synthese roadmap={roadmap} decisions={decisions} carto={carto} now={now.getTime()} />
      ) : null}

      {site ? <SanteSite state={site} base={viewer.base} /> : null}

      <Calendrier events={events} now={now} />

      <ALaUne items={items.filter((item) => item.featured)} since={since} viewer={viewer} />

      <DerniereLettre lettres={lettres} base={viewer.base} />
    </Espace>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────

export async function VueDirectionTechnique({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const since = await sinceFor(viewer);
  const now = Date.now();
  const decisions = sortRecentFirst(context.items.filter((item) => item.kind === "decision"));
  const carto = sortCartographie(context.items.filter((item) => item.kind === "cartographie"));
  const documents = sortRecentFirst(context.items.filter((item) => item.kind === "document"));
  const vide = decisions.length + carto.length + documents.length === 0;

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="direction-technique"
      title="Direction technique"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Audit, préconisations et arbitrages : ce qui a été décidé, sur quoi repose votre système,
          et les documents relus pour vous.
        </p>
      }
    >
      {vide ? (
        <EnPreparation>
          Le relevé de décisions, la cartographie de votre système et les documents relus
          (devis, plans de continuité) apparaîtront ici dès leur première publication.
        </EnPreparation>
      ) : null}
      {decisions.length > 0 ? (
        <Decisions items={decisions.slice(0, 8)} total={decisions.length} since={since} base={viewer.base} />
      ) : null}
      {carto.length > 0 ? (
        <Cartographie items={carto} total={carto.length} now={now} since={since} base={viewer.base} />
      ) : null}
      {documents.length > 0 ? (
        <Documents items={documents} total={documents.length} since={since} base={viewer.base} />
      ) : null}
    </Espace>
  );
}

/** Les statuts qui font d'un chantier une action EN COURS. */
const EN_COURS = new Set(["Ouvert", "Décidé"]);

export async function VueActions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const since = await sinceFor(viewer);
  const roadmap = context.items.filter((item) => item.kind === "roadmap");
  const enCours = sortRoadmap(
    roadmap.filter((item) => EN_COURS.has((item.payload as RoadmapPayload).statut ?? "")),
  );
  const aVenir = sortRoadmap(
    roadmap.filter((item) => (item.payload as RoadmapPayload).statut === "À venir"),
  );

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="actions"
      title="Actions en cours"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les chantiers ouverts et décidés, et ceux qui suivent. La roadmap complète, avec ce qui
          est fait ou écarté, reste{" "}
          <Link
            href={categoriePath("roadmap", viewer.base)}
            className="text-foreground underline underline-offset-4 hover:text-accent-secondary"
          >
            consultable ici
          </Link>
          .
        </p>
      }
    >
      {enCours.length + aVenir.length === 0 ? (
        <EnPreparation>
          Aucun chantier en cours pour l&rsquo;instant. Les actions décidées en comité apparaîtront
          ici, avec leur échéance et leur budget.
        </EnPreparation>
      ) : null}
      {enCours.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-sans text-lg font-light text-foreground">En cours</h2>
          <Roadmap items={enCours} now={Date.now()} since={since} bare base={viewer.base} />
        </section>
      ) : null}
      {aVenir.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-sans text-lg font-light text-foreground">Ensuite</h2>
          <Roadmap items={aVenir} now={Date.now()} since={since} bare base={viewer.base} />
        </section>
      ) : null}
    </Espace>
  );
}

export async function VuePrestations({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const since = await sinceFor(viewer);
  const items = sortPrestations(context.items.filter((item) => item.kind === "prestation"));

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="prestations"
      title="Prestations"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les missions commandées, leur avancement et leur date de livraison.
        </p>
      }
    >
      {items.length === 0 ? (
        <EnPreparation>
          Vos prestations en cours (missions ponctuelles, devis signés) apparaîtront ici avec
          leur avancement et leur date de livraison.
        </EnPreparation>
      ) : (
        <div className="mt-10">
          <Prestations items={items} now={Date.now()} since={since} bare base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

export async function VueSuivi({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const [state, reports] = await Promise.all([
    siteStateFor(viewer.clientId),
    siteReportsFor(viewer.clientId),
  ]);

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="suivi-technique"
      title="Suivi technique"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Maintenance et état de votre site : disponibilité, mises à jour, failles connues,
          sauvegardes et rapports mensuels. Relevé chaque nuit.
        </p>
      }
    >
      {state ? (
        <SuiviTechnique state={state} reports={reports} base={viewer.base} />
      ) : (
        <EnPreparation>
          La supervision de votre site est en cours de mise en place. Le relevé quotidien
          (disponibilité, mises à jour, sauvegardes) apparaîtra ici dès qu&rsquo;elle sera branchée.
        </EnPreparation>
      )}
    </Espace>
  );
}

export async function VueVeille({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const [lettres, since] = await Promise.all([lettersForClient(viewer.clientId), sinceFor(viewer)]);
  const nouvelles = sortRecentFirst(context.items.filter((item) => item.kind === "veille"));

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="veille"
      title="Veille"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce qui change dans votre environnement numérique, et ce que ça implique pour vous.
        </p>
      }
    >
      {nouvelles.length > 0 ? (
        <Veille items={nouvelles.slice(0, 6)} total={nouvelles.length} since={since} base={viewer.base} />
      ) : null}

      <section className="mt-12">
        <h2 className="mb-5 font-sans text-lg font-light text-foreground">Lettres de veille</h2>
        <ListeLettres lettres={lettres} base={viewer.base} />
        <p className="mt-6 font-inter-tight text-sm text-mid-gray">
          Les archives couvrent les {ARCHIVE_MONTHS} derniers mois. Les éditions antérieures vous
          sont restituées avec le reste en fin d&rsquo;accompagnement.
        </p>
      </section>
    </Espace>
  );
}

// ─── Pages de détail ─────────────────────────────────────────────────────

/** L'onglet de navigation auquel une catégorie appartient. */
const SECTION_OF = {
  decision: "direction-technique",
  cartographie: "direction-technique",
  document: "direction-technique",
  roadmap: "actions",
  veille: "veille",
  prestation: "prestations",
} as const;

export async function VueCategorie({
  viewer,
  context,
  kind,
}: {
  viewer: Viewer;
  context: EspaceContext;
  kind: CategorieKind;
}) {
  const since = await sinceFor(viewer);
  const items = context.items.filter((item) => item.kind === kind);
  const section = SECTION_OF[kind];

  return (
    <Espace
      viewer={viewer}
      context={context}
      // L'onglet n'est marqué que si la section fait partie de l'accompagnement :
      // une catégorie consultée hors services reste lisible, sans prétendre être
      // un onglet qui n'existe pas.
      active={sectionOuverte(context, section) ? section : null}
      title={CATEGORIES[kind].titre}
      intro={
        <Label>
          {items.length} {items.length > 1 ? "entrées publiées" : "entrée publiée"}
        </Label>
      }
    >
      <div className="mt-10">
        <Categorie kind={kind} items={items} since={since} base={viewer.base} />
      </div>
    </Espace>
  );
}

/**
 * L'historique d'un livrable. `null` si l'identifiant n'appartient pas à cet
 * accompagnement : `history()` filtre elle-même sur le client, la garde est
 * dans la requête.
 */
export async function VueHistorique({
  viewer,
  context,
  kind,
  id,
}: {
  viewer: Viewer;
  context: EspaceContext;
  kind: CategorieKind;
  id: string;
}) {
  const versions = await history(id, viewer.clientId);
  if (versions.length === 0) return null;
  const courante = versions[0];

  return (
    <Espace
      viewer={viewer}
      context={context}
      active={null}
      title={courante.title}
      intro={
        <Label>
          {versions.length > 1
            ? `${versions.length} versions — la plus récente date du ${formatDay(courante.recordedAt)}`
            : "Une seule version"}
        </Label>
      }
    >
      <div className="mt-8">
        <BackLink href={categoriePath(kind, viewer.base)}>{CATEGORIES[kind].titre}</BackLink>
      </div>
      <Historique versions={versions} />
    </Espace>
  );
}

export async function VueLettres({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const lettres = await lettersForClient(viewer.clientId);

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="veille"
      title="Votre veille"
      intro={
        <Label>
          {lettres.length} {lettres.length > 1 ? "éditions accessibles" : "édition accessible"}
        </Label>
      }
    >
      <div className="mt-10">
        <ListeLettres lettres={lettres} base={viewer.base} />
      </div>
      <p className="mt-10 font-inter-tight text-sm text-mid-gray">
        Les archives couvrent les {ARCHIVE_MONTHS} derniers mois. Les éditions antérieures sortent
        de l&rsquo;espace sans être détruites : elles vous sont restituées avec le reste en fin
        d&rsquo;accompagnement.
      </p>
    </Espace>
  );
}

/**
 * La lecture d'une lettre. `null` si elle n'est pas visible par cet
 * accompagnement — `letterForClient` porte les trois contrôles (publiée, dans
 * la fenêtre, visible par CE client) dans sa requête.
 */
export async function VueLettre({
  viewer,
  context,
  id,
}: {
  viewer: Viewer;
  context: EspaceContext;
  id: string;
}) {
  const lettre = await letterForClient(id, viewer.clientId);
  if (!lettre) return null;

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="veille"
      title={lettre.title}
      intro={<Label>{formatPeriode(lettre.period)}</Label>}
    >
      <div className="mt-8">
        <BackLink href={lettresPath(viewer.base)}>Votre veille</BackLink>
      </div>
      {lettre.chapo ? (
        <p className="mt-8 max-w-[68ch] border-l-2 border-l-accent-secondary pl-4 font-inter-tight text-base leading-relaxed text-foreground">
          {lettre.chapo}
        </p>
      ) : null}
      <article className="mt-4">
        <CorpsLettre body={lettre.body} />
      </article>
    </Espace>
  );
}
