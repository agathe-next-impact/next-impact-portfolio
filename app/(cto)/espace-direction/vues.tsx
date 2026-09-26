import type { ReactNode } from "react";
import Link from "next/link";
import { history, type AuditPayload, type PropositionPayload } from "@cto/deliverables";
import {
  actionsVerdict,
  buildEvents,
  isPendingProposition,
  buildFrise,
  byPhase,
  lastSuccessfulBackup,
  missionsVerdict,
  sectionByKey,
  sitePoints,
  siteVerdict,
  type Action,
} from "@cto/espace";
import { ARCHIVE_MONTHS, letterForClient, lettersForClient } from "@cto/letters";
import { digestsForClient } from "@cto/digest";
import { siteReportsFor } from "@cto/site";
import { Calendrier } from "./calendrier";
import { DigestSemaine } from "./digest";
import { Historique } from "./historique";
import { CorpsLettre, DerniereLettre, formatPeriode, grandsTitres, lettresPath, ListeLettres } from "./lettre";
import {
  Audits,
  CATEGORIES,
  Cartographie,
  Categorie,
  categoriePath,
  Decisions,
  DepuisLaDerniereFois,
  Documents,
  Nouveaute,
  Prestations,
  Propositions,
  propositionTone,
  sortCartographie,
  sortPrestations,
  sortRecentFirst,
  tailleLisible,
  fichierPath,
  Veille,
  type CategorieKind,
} from "./livrables";
import {
  ActionLigne,
  ActionTag,
  actionMeta,
  CarteReponse,
  Frise,
  LigneCarte,
  LigneVide,
  ListeMissions,
  livrableHref,
  MissionTag,
  missionMeta,
} from "./pilotage";
import {
  CALENDLY_URL,
  contactHref,
  ContactCta,
  EnPreparation,
  Espace,
  sectionHref,
  sectionOuverte,
  type EspaceContext,
} from "./shell";
import { SyntheseAudit } from "./synthese-audit";
import { PartieAccordeons, partieEnAccordeons } from "./partie-accordeons";
import { RapportsMaintenance, SuiviTechnique } from "./suivi";
import { BackLink, buttonClass, Dot, formatDay, Label, Notice, Panel, SectionNav, Tag } from "./ui";
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
//
// L'espace est rangé par question du client — Missions, Votre site, Agir,
// Veille — et l'accueil répond aux trois premières en une phrase chacune.
// ─────────────────────────────────────────────────────────────────────────────

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

function href(viewer: Viewer, context: EspaceContext, key: Parameters<typeof sectionByKey>[0]): string | null {
  return sectionOuverte(context, key) ? sectionHref(sectionByKey(key), viewer.base) : null;
}

// ─── Accueil ─────────────────────────────────────────────────────────────

const KIND_TITRES: Record<string, string> = {
  roadmap: "Chantier",
  decision: "Décision",
  cartographie: "Système",
  veille: "Veille",
  document: "Document",
  prestation: "Prestation",
  audit: "Audit",
};

/**
 * Ce qui a été mis à la une, toutes sections confondues.
 *
 * La mise en avant se décide dans l'atelier (colonne « Affichage ») ; l'accueil
 * la respecte sans la réinterpréter. Une ligne par entrée, qui mène à sa
 * section : le détail vit là-bas, pas ici.
 */
function ALaUne({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = context.items.filter((item) => item.featured);
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
              <Nouveaute item={item} since={context.since} />
              <Link
                href={livrableHref(item, context, viewer.base)}
                className="font-inter-tight text-sm text-foreground underline-offset-4 hover:text-accent-secondary hover:underline"
              >
                {item.title}
              </Link>
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

/** « Où en sont les missions ? » : ce qui court d'abord, puis ce qui vient, puis ce qui est fait. */
function CarteMissions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const lignes = [
    ...byPhase(context.missions, "en-cours"),
    ...byPhase(context.missions, "a-venir"),
    ...byPhase(context.missions, "passe"),
  ].slice(0, 3);
  const lien = href(viewer, context, "missions");

  return (
    <CarteReponse
      question="Où en sont les missions ?"
      verdict={missionsVerdict(context.missions)}
      pied={lien ? { href: lien, label: "Toutes les missions" } : null}
    >
      {lignes.length === 0 ? (
        <LigneVide>Les missions apparaîtront ici dès leur première publication.</LigneVide>
      ) : (
        lignes.map((mission) => (
          <LigneCarte
            key={mission.item.id}
            titre={mission.title}
            href={livrableHref(mission.item, context, viewer.base)}
            tag={<MissionTag mission={mission} />}
            meta={missionMeta(mission)}
            avancement={mission.phase === "en-cours" ? mission.progress : null}
          />
        ))
      )}
    </CarteReponse>
  );
}

/** « Comment va le site ? » : les points à corriger d'abord, puis les trois repères qui rassurent. */
function CarteSite({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const snapshot = context.site?.snapshot ?? null;
  const lien = href(viewer, context, "site");

  let lignes: ReactNode[] = [];
  if (snapshot) {
    const points = sitePoints(snapshot).slice(0, 2).map((point) => (
      <LigneCarte
        key={point.id}
        titre={point.title}
        href={lien}
        tag={<ActionTag action={{ id: point.id, kind: "site", title: point.title, detail: null, tone: point.tone, date: null, item: null }} />}
      />
    ));
    const sauvegarde = lastSuccessfulBackup(snapshot);
    const miseAJour = snapshot.updates.plugins.length + snapshot.updates.themes.length;
    const reperes = [
      <LigneCarte
        key="uptime"
        titre="Disponibilité 30 jours"
        tag={
          <span className="font-mono text-[11px] text-mid-gray">
            {snapshot.uptime.percentage === null ? "—" : `${snapshot.uptime.percentage.toLocaleString("fr-FR")} %`}
          </span>
        }
      />,
      <LigneCarte
        key="sauvegarde"
        titre="Dernière sauvegarde"
        tag={<span className="font-mono text-[11px] text-mid-gray">{sauvegarde ? formatDay(new Date(sauvegarde.date)) : "—"}</span>}
      />,
      <LigneCarte
        key="maj"
        titre="Mises à jour en attente"
        tag={<span className="font-mono text-[11px] text-mid-gray">{miseAJour}</span>}
      />,
    ];
    lignes = [...points, ...reperes].slice(0, 4);
  }

  return (
    <CarteReponse
      question="Comment va le site ?"
      verdict={siteVerdict(context.site)}
      pied={lien ? { href: lien, label: "État détaillé" } : null}
    >
      {lignes.length === 0 ? (
        <LigneVide>
          Le premier relevé de votre site arrive après le prochain passage de la supervision, chaque
          nuit.
        </LigneVide>
      ) : (
        lignes
      )}
    </CarteReponse>
  );
}

/** « Que pouvez-vous faire ? » : l'urgent d'abord, puis ce qui attend votre arbitrage. */
function CarteActions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const { aTraiter, aArbitrer } = context.actions;
  const traiter = href(viewer, context, "a-traiter");
  const arbitrer = href(viewer, context, "a-arbitrer");
  const lignes: { action: Action; href: string | null }[] = [
    ...aTraiter.map((action) => ({ action, href: traiter })),
    // Une proposition mène à sa page : un prospect n'a pas forcément « À arbitrer ».
    ...aArbitrer.map((action) => ({
      action,
      href: action.kind === "proposition" && action.item ? livrableHref(action.item, context, viewer.base) : arbitrer,
    })),
  ].slice(0, 3);

  const propositions = href(viewer, context, "propositions");
  const pied =
    aTraiter.length > 0 && traiter
      ? { href: traiter, label: "Voir et en parler" }
      : aArbitrer.length > 0 && arbitrer
        ? { href: arbitrer, label: "Voir et en parler" }
        : aArbitrer.some((action) => action.kind === "proposition") && propositions
          ? { href: propositions, label: "Voir les propositions" }
          : null;

  return (
    <CarteReponse question="Que pouvez-vous faire ?" verdict={actionsVerdict(context.actions)} pied={pied}>
      {lignes.length === 0 ? (
        <LigneVide>
          Rien ne demande votre intervention. Une question, un devis à relire ? Écrivez à Agathe
          depuis le menu.
        </LigneVide>
      ) : (
        lignes.map(({ action, href: lien }) => (
          <LigneCarte key={action.id} titre={action.title} href={lien} tag={<ActionTag action={action} />} meta={actionMeta(action)} />
        ))
      )}
    </CarteReponse>
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
  const lettres = await lettersForClient(viewer.clientId);
  const now = new Date();
  const missions = sectionOuverte(context, "missions");
  const site = sectionOuverte(context, "site");
  const cartes = 1 + (missions ? 1 : 0) + (site ? 1 : 0);
  const prenom = viewer.personName?.trim().split(/\s+/)[0];

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="tableau"
      title={prenom ? `Bonjour ${prenom}` : "Accueil"}
    >
      {erreur ? (
        <div className="mt-8">
          <Notice tone="erreur">
            {erreur} Vous restez connecté en tant que {viewer.company}.
          </Notice>
        </div>
      ) : null}

      <DepuisLaDerniereFois items={context.items} since={context.since} base={viewer.base} />

      <section
        aria-label="L'essentiel en trois questions"
        className={`mt-10 grid gap-4 ${cartes === 3 ? "md:grid-cols-2 xl:grid-cols-3" : cartes === 2 ? "md:grid-cols-2" : "max-w-xl"}`}
      >
        {missions ? <CarteMissions viewer={viewer} context={context} /> : null}
        {site ? <CarteSite viewer={viewer} context={context} /> : null}
        <CarteActions viewer={viewer} context={context} />
      </section>

      {missions || context.items.some((item) => item.kind === "cartographie") ? (
        <Frise frise={buildFrise(context.missions, context.items, now)} context={context} base={viewer.base} />
      ) : null}

      <ALaUne viewer={viewer} context={context} />

      <DerniereLettre lettres={lettres} base={viewer.base} />

      <ContactCta company={viewer.company} />
    </Espace>
  );
}

// ─── Missions ────────────────────────────────────────────────────────────

/**
 * La vue d'ensemble des missions : la frise, puis les trois moments en listes.
 *
 * Les trois listes sont toutes visibles, dans l'ordre de la question qu'on se
 * pose (qu'est-ce qui court, qu'est-ce qui vient, qu'est-ce qui est fait) ; le
 * sommaire en tête permet de sauter à la troisième sans défiler.
 */
export async function VueMissions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const now = new Date();
  const enCours = byPhase(context.missions, "en-cours");
  const aVenir = byPhase(context.missions, "a-venir");
  const fait = byPhase(context.missions, "passe");
  const lettres = await lettersForClient(viewer.clientId);
  const events = buildEvents(
    context.items,
    lettres.map((lettre) => ({
      title: lettre.title,
      period: lettre.period,
      href: `${lettresPath(viewer.base)}/${lettre.notionPageId}`,
    })),
    (item) => livrableHref(item, context, viewer.base),
    now,
  );
  const roadmap = context.items.some((item) => item.kind === "roadmap");

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="missions"
      title="Missions"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce qui a été fait, ce qui avance et ce qui arrive, sur une seule ligne de temps.
          {roadmap ? (
            <>
              {" "}La roadmap complète, avec ce qui a été écarté, reste{" "}
              <Link
                href={categoriePath("roadmap", viewer.base)}
                className="text-foreground underline underline-offset-4 hover:text-accent-secondary"
              >
                consultable ici
              </Link>
              .
            </>
          ) : null}
        </p>
      }
    >
      {context.missions.length === 0 ? (
        <EnPreparation>
          Les chantiers décidés, les prestations commandées, les décisions et les audits
          apparaîtront ici dès leur première publication, avec leur échéance.
        </EnPreparation>
      ) : (
        <>
          <SectionNav
            items={[
              { href: "#en-cours", label: "En cours", count: enCours.length },
              { href: "#a-venir", label: "À venir", count: aVenir.length },
              { href: "#fait", label: "Fait", count: fait.length },
            ]}
          />

          <Frise frise={buildFrise(context.missions, context.items, now)} context={context} base={viewer.base} />

          <section id="en-cours" aria-labelledby="en-cours-titre" className="mt-12 scroll-mt-20">
            <h2 id="en-cours-titre" className="font-sans text-lg font-light text-foreground">
              En cours <span className="text-mid-gray">· {enCours.length}</span>
            </h2>
            <ListeMissions missions={enCours} context={context} base={viewer.base} vide="Rien en cours pour l'instant." />
          </section>

          <section id="a-venir" aria-labelledby="a-venir-titre" className="mt-12 scroll-mt-20">
            <h2 id="a-venir-titre" className="font-sans text-lg font-light text-foreground">
              À venir <span className="text-mid-gray">· {aVenir.length}</span>
            </h2>
            <ListeMissions missions={aVenir} context={context} base={viewer.base} vide="Rien de programmé pour l'instant." />
          </section>

          <section id="fait" aria-labelledby="fait-titre" className="mt-12 scroll-mt-20">
            <h2 id="fait-titre" className="font-sans text-lg font-light text-foreground">
              Fait <span className="text-mid-gray">· {fait.length}</span>
            </h2>
            <ListeMissions missions={fait} context={context} base={viewer.base} vide="Rien de terminé pour l'instant." />
          </section>
        </>
      )}

      <Calendrier events={events} now={now} />
    </Espace>
  );
}

export async function VuePrestations({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
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
          <Prestations items={items} now={Date.now()} since={context.since} bare base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

export async function VueDecisions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "decision"));

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="decisions"
      title="Décisions"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce qui a été tranché, quand, pourquoi, et ce qui a été écarté.
        </p>
      }
    >
      {items.length === 0 ? (
        <EnPreparation>
          Le relevé de décisions apparaîtra ici dès le premier arbitrage publié : la décision, son
          motif et l&rsquo;option écartée.
        </EnPreparation>
      ) : (
        <div className="mt-6">
          <Decisions items={items} since={context.since} bare base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

/**
 * La section Audit.
 *
 * Un seul audit, le cas courant : il s'ouvre directement, sans liste d'un
 * élément à traverser. Plusieurs : la liste, le plus récent en tête.
 */
export async function VueAudit({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const audits = sortRecentFirst(context.items.filter((item) => item.kind === "audit"));
  if (audits.length === 1) return VueLectureAudit({ viewer, context, id: audits[0].notionPageId });

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="audit"
      title="Audit"
      intro={
        <p className="font-inter-tight text-base text-mid-gray">
          L'état de votre site mesuré à une date donnée, les constats qui le fondent, et la
          feuille de route qui en découle.
        </p>
      }
    >
      {audits.length === 0 ? (
        <EnPreparation>
          Votre audit apparaîtra ici dès sa remise : synthèse, constats partie par partie,
          scénarios et roadmap chiffrée.
        </EnPreparation>
      ) : (
        <div className="mt-10">
          <Audits items={audits} since={context.since} base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

export async function VueLectureAudit({
  viewer,
  context,
  id,
}: {
  viewer: Viewer;
  context: EspaceContext;
  id: string;
}) {
  const audit = context.items.find((item) => item.kind === "audit" && item.notionPageId === id);
  if (!audit) return null;
  const payload = audit.payload as AuditPayload;
  const plusieurs = context.items.filter((item) => item.kind === "audit").length > 1;
  const section = sectionByKey("audit");

  return (
    <Espace
      viewer={viewer}
      context={context}
      active={sectionOuverte(context, "audit") ? "audit" : null}
      title={audit.title}
      intro={
        <Label>
          {audit.occurredAt ? `Mesures du ${formatDay(audit.occurredAt)}` : "Audit"}
          {audit.version > 1 ? ` · corrigé le ${formatDay(audit.recordedAt)}` : ""}
        </Label>
      }
    >
      {plusieurs ? (
        <div className="mt-8">
          <BackLink href={sectionHref(section, viewer.base)}>Tous les audits</BackLink>
        </div>
      ) : null}

      <Panel className="mt-8 px-5 py-5">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt><Label>Site audité</Label></dt>
            <dd className="mt-1.5 break-words font-inter-tight text-sm text-foreground">
              {payload.site ? (
                <a
                  href={payload.site}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4 hover:text-accent-secondary"
                >
                  {payload.site.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt><Label>Annexe de preuves</Label></dt>
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">
              {payload.annexe ? (
                <a
                  href={fichierPath(payload.annexe.id, viewer.base)}
                  className="underline underline-offset-4 hover:text-accent-secondary"
                >
                  Télécharger ({tailleLisible(payload.annexe.size)})
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt><Label>Versions</Label></dt>
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">
              <Link
                href={`${categoriePath("audit", viewer.base)}/${audit.notionPageId}`}
                className="underline underline-offset-4 hover:text-accent-secondary"
              >
                {audit.version > 1 ? `${audit.version} versions, voir ce qui a changé` : "Version d'origine"}
              </Link>
            </dd>
          </div>
        </dl>
        <p className="mt-4 font-inter-tight text-xs leading-relaxed text-mid-gray">
          L'audit est une photographie du site à la date des mesures. Une correction ultérieure
          ajoute une version datée, sans effacer la précédente.
        </p>
      </Panel>

      {payload.sections.length > 0 ? (
        <nav aria-label="Parties de l'audit" className="mt-10">
          <Label>Sommaire</Label>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {payload.synthese.length > 0 ? (
              <li>
                <a href="#synthese" className="font-inter-tight text-sm text-foreground underline-offset-4 hover:text-accent-secondary hover:underline">
                  Synthèse
                </a>
              </li>
            ) : null}
            {payload.sections.map((partie) => (
              <li key={partie.id}>
                <a
                  href={`#partie-${partie.id}`}
                  className="font-inter-tight text-sm text-foreground underline-offset-4 hover:text-accent-secondary hover:underline"
                >
                  {partie.icone ? `${partie.icone} ` : ""}
                  {partie.titre}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {payload.synthese.length > 0 ? (
        <section id="synthese" aria-labelledby="synthese-titre" className="mt-12 scroll-mt-8">
          <h2 id="synthese-titre" className="border-b border-dark-gray pb-3 font-sans text-xl font-light text-foreground">
            Synthèse
          </h2>
          <SyntheseAudit blocks={payload.synthese} base={viewer.base} />
        </section>
      ) : null}

      {payload.sections.map((partie) => (
        <section
          key={partie.id}
          id={`partie-${partie.id}`}
          aria-labelledby={`titre-${partie.id}`}
          className="mt-16 scroll-mt-8"
        >
          <h2
            id={`titre-${partie.id}`}
            className="border-b border-dark-gray pb-3 font-sans text-xl font-light text-foreground"
          >
            {partie.icone ? <span aria-hidden>{partie.icone} </span> : null}
            {partie.titre}
          </h2>
          {partie.corps.length > 0 ? (
            partieEnAccordeons(partie.titre) ? (
              <PartieAccordeons corps={partie.corps} base={viewer.base} />
            ) : (
              <CorpsLettre body={partie.corps} large base={viewer.base} />
            )
          ) : (
            <p className="mt-4 font-inter-tight text-sm text-mid-gray">Partie vide.</p>
          )}
          <p className="mt-6">
            <a href="#top" className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 hover:text-accent-secondary">
              Haut de page ↑
            </a>
          </p>
        </section>
      ))}
    </Espace>
  );
}

// ─── Votre site ──────────────────────────────────────────────────────────

export async function VueSite({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const state = context.site;
  const verdict = siteVerdict(state);
  const points = state?.snapshot ? sitePoints(state.snapshot) : [];
  const traiter = href(viewer, context, "a-traiter");

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="site"
      title="État du site"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Disponibilité, failles connues, sauvegardes et maintenance de votre site. Relevé chaque nuit.
        </p>
      }
    >
      {state ? (
        <>
          {state.snapshot ? (
            <Panel className="mt-10 px-5 py-5">
              <p className="flex items-start gap-2.5 font-sans text-lg text-foreground">
                <Dot tone={verdict.tone} label={verdict.tone === "fait" ? "En ordre" : "À regarder"} />
                <span>{verdict.headline}</span>
              </p>
              {points.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {points.map((point) => (
                    <li key={point.id} className="flex flex-wrap items-baseline gap-2">
                      <ActionTag action={{ id: point.id, kind: "site", title: point.title, detail: null, tone: point.tone, date: null, item: null }} />
                      <span className="font-inter-tight text-sm text-foreground">{point.title}</span>
                      {point.detail ? (
                        <span className="font-inter-tight text-xs text-mid-gray">{point.detail}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {points.length > 0 && traiter ? (
                <Link
                  href={traiter}
                  className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary hover:text-foreground"
                >
                  En parler depuis « À traiter » →
                </Link>
              ) : null}
            </Panel>
          ) : null}
          <SuiviTechnique state={state} />
        </>
      ) : (
        <EnPreparation>
          La supervision de votre site est en cours de mise en place. Le relevé quotidien
          (disponibilité, mises à jour, sauvegardes) apparaîtra ici dès qu&rsquo;elle sera branchée.
        </EnPreparation>
      )}
    </Espace>
  );
}

export async function VueRapports({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const reports = await siteReportsFor(viewer.clientId);

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="rapports"
      title="Rapports de maintenance"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les rapports mensuels de maintenance de votre site, en PDF, à transmettre tels quels.
        </p>
      }
    >
      <div className="mt-6">
        <RapportsMaintenance reports={reports} base={viewer.base} />
      </div>
    </Espace>
  );
}

export async function VueCartographie({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortCartographie(context.items.filter((item) => item.kind === "cartographie"));

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="cartographie"
      title="Cartographie"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les systèmes dont dépend votre activité : qui les détient, ce qu&rsquo;ils coûtent, quand
          ils se renouvellent.
        </p>
      }
    >
      {items.length === 0 ? (
        <EnPreparation>
          La cartographie de votre système (hébergement, contrats, outils, détenteurs des accès)
          apparaîtra ici dès sa première publication.
        </EnPreparation>
      ) : (
        <div className="mt-6">
          <Cartographie items={items} now={Date.now()} since={context.since} bare base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

// ─── Agir ────────────────────────────────────────────────────────────────

function ListeActions({
  actions,
  viewer,
  context,
}: {
  actions: Action[];
  viewer: Viewer;
  context: EspaceContext;
}) {
  return (
    <ul className="mt-10 divide-y divide-dark-gray border border-dark-gray bg-jet/40">
      {actions.map((action) => (
        <ActionLigne key={action.id} action={action} company={viewer.company} context={context} base={viewer.base} />
      ))}
    </ul>
  );
}

export async function VueATraiter({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const actions = context.actions.aTraiter;
  const urgentes = actions.filter((action) => action.tone === "alerte").length;

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="a-traiter"
      title="À traiter"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce qui demande une intervention : points du site à corriger, échéances de contrats dans
          les 60 jours, missions en retard.
          {actions.length > 0
            ? ` ${actions.length} ${pluriel(actions.length, "point", "points")}, dont ${urgentes} ${pluriel(urgentes, "urgent", "urgents")}.`
            : ""}
        </p>
      }
    >
      {actions.length === 0 ? (
        <Panel className="mt-10 px-5 py-6">
          <Label>Rien d&rsquo;urgent</Label>
          <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
            Aucun point du site à corriger, aucune échéance dans les 60 jours, aucune mission en
            retard.
          </p>
        </Panel>
      ) : (
        <ListeActions actions={actions} viewer={viewer} context={context} />
      )}
      <ContactCta company={viewer.company} />
    </Espace>
  );
}

export async function VueAArbitrer({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const actions = context.actions.aArbitrer;

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="a-arbitrer"
      title="À arbitrer"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les propositions qui attendent votre réponse, puis les opportunités repérées pour vous,
          avec l&rsquo;effort, l&rsquo;effet attendu et le budget. Rien ne se lance sans votre accord.
        </p>
      }
    >
      {actions.length === 0 ? (
        <EnPreparation>
          Aucune opportunité en attente de décision. Celles repérées en comité ou en veille
          apparaîtront ici, chiffrées.
        </EnPreparation>
      ) : (
        <ListeActions actions={actions} viewer={viewer} context={context} />
      )}
      <ContactCta company={viewer.company} />
    </Espace>
  );
}

// ─── Propositions ────────────────────────────────────────────────────────

/**
 * Les propositions remises. Une seule, le cas courant : elle s'ouvre
 * directement, comme un audit.
 */
export async function VuePropositions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "proposition"));
  if (items.length === 1) return VueLectureProposition({ viewer, context, id: items[0].notionPageId });

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="propositions"
      title="Propositions"
      intro={
        <p className="font-inter-tight text-base text-mid-gray">
          Les propositions chiffrées qui vous ont été remises : scénarios, volumes, recommandation.
        </p>
      }
    >
      {items.length === 0 ? (
        <EnPreparation>Aucune proposition remise pour l&rsquo;instant.</EnPreparation>
      ) : (
        <div className="mt-10">
          <Propositions items={items} since={context.since} base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

/**
 * La lecture d'une proposition : repères, sommaire, le document en entier, et
 * la réponse attendue.
 *
 * `null` si l'identifiant n'est pas une proposition publiée de CET
 * accompagnement : la liste vient de `context.items`, déjà filtrée par client.
 */
export async function VueLectureProposition({
  viewer,
  context,
  id,
}: {
  viewer: Viewer;
  context: EspaceContext;
  id: string;
}) {
  const proposition = context.items.find((item) => item.kind === "proposition" && item.notionPageId === id);
  if (!proposition) return null;
  const payload = proposition.payload as PropositionPayload;
  const plusieurs = context.items.filter((item) => item.kind === "proposition").length > 1;
  const enAttente = isPendingProposition(proposition);
  const sommaire = [
    ...grandsTitres(payload.corps).map((titre) => ({ href: `#${titre.id}`, texte: titre.texte })),
    ...payload.sections.map((partie) => ({
      href: `#partie-${partie.id}`,
      texte: `${partie.icone ? `${partie.icone} ` : ""}${partie.titre}`,
    })),
  ];

  return (
    <Espace
      viewer={viewer}
      context={context}
      active={sectionOuverte(context, "propositions") ? "propositions" : null}
      title={proposition.title}
      intro={
        <Label>
          {proposition.occurredAt ? `Remise le ${formatDay(proposition.occurredAt)}` : "Proposition"}
          {proposition.version > 1 ? ` · corrigée le ${formatDay(proposition.recordedAt)}` : ""}
        </Label>
      }
    >
      {plusieurs ? (
        <div className="mt-8">
          <BackLink href={`${viewer.base}/propositions`}>Toutes les propositions</BackLink>
        </div>
      ) : null}

      <Panel className="mt-8 px-5 py-5">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt><Label>Statut</Label></dt>
            <dd className="mt-2">
              <Tag tone={propositionTone(payload.statut)}>{payload.statut ?? "En attente de réponse"}</Tag>
            </dd>
          </div>
          <div>
            <dt><Label>Remise le</Label></dt>
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">{formatDay(proposition.occurredAt)}</dd>
          </div>
          <div>
            <dt><Label>Versions</Label></dt>
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">
              <Link
                href={`${categoriePath("proposition", viewer.base)}/${proposition.notionPageId}`}
                className="underline underline-offset-4 hover:text-accent-secondary"
              >
                {proposition.version > 1 ? `${proposition.version} versions, voir ce qui a changé` : "Version d'origine"}
              </Link>
            </dd>
          </div>
        </dl>
      </Panel>

      {sommaire.length > 1 ? (
        <nav aria-label="Parties de la proposition" className="mt-10">
          <Label>Sommaire</Label>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {sommaire.map((entree) => (
              <li key={entree.href}>
                <a
                  href={entree.href}
                  className="font-inter-tight text-sm text-foreground underline-offset-4 hover:text-accent-secondary hover:underline"
                >
                  {entree.texte}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <article className="mt-6">
        <CorpsLettre body={payload.corps} large ancres base={viewer.base} />
      </article>

      {payload.sections.map((partie) => (
        <section
          key={partie.id}
          id={`partie-${partie.id}`}
          aria-labelledby={`titre-partie-${partie.id}`}
          className="mt-16 scroll-mt-8"
        >
          <h2
            id={`titre-partie-${partie.id}`}
            className="border-b border-dark-gray pb-3 font-sans text-xl font-light text-foreground"
          >
            {partie.icone ? <span aria-hidden>{partie.icone} </span> : null}
            {partie.titre}
          </h2>
          <CorpsLettre body={partie.corps} large base={viewer.base} />
        </section>
      ))}

      {/* La réponse attendue, au bout de la lecture : c'est là qu'on la donne. */}
      <section aria-labelledby="reponse-titre" className="mt-16">
        <Panel className="border-l-2 border-l-accent-secondary px-5 py-6 sm:px-6">
          <Label>{enAttente ? "Votre réponse" : "Une question sur cette proposition ?"}</Label>
          <h2 id="reponse-titre" className="mt-2 font-sans text-xl font-light text-foreground">
            {enAttente ? "Un scénario vous convient, ou vous voulez l'ajuster ?" : "Parlons-en."}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={contactHref(viewer.company, `Proposition : ${proposition.title}`)} className={buttonClass.primary}>
              {enAttente ? "Répondre à la proposition" : "Écrire à Agathe"}
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer noopener" className={buttonClass.ghost}>
              En discuter de vive voix ↗
            </a>
          </div>
        </Panel>
      </section>
    </Espace>
  );
}

// ─── Veille ──────────────────────────────────────────────────────────────

export async function VueDocuments({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "document"));

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="documents"
      title="Documents"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les documents relus pour vous : devis, notes de comité, plans de continuité.
        </p>
      }
    >
      {items.length === 0 ? (
        <EnPreparation>
          Les documents relus pour vous (revues de devis, notes de comité, plans de continuité)
          apparaîtront ici dès leur première publication.
        </EnPreparation>
      ) : (
        <div className="mt-6">
          <Documents items={items} since={context.since} bare base={viewer.base} />
        </div>
      )}
    </Espace>
  );
}

export async function VueVeille({
  viewer,
  context,
  semaine,
}: {
  viewer: Viewer;
  context: EspaceContext;
  /** Semaine du digest à afficher (`2026-W39`) ; la plus récente par défaut. */
  semaine?: string;
}) {
  const [lettres, digests] = await Promise.all([
    lettersForClient(viewer.clientId),
    digestsForClient(viewer.clientId),
  ]);
  const since = context.since;
  const nouvelles = sortRecentFirst(context.items.filter((item) => item.kind === "veille"));
  // Une semaine inconnue (lien ancien, faute de frappe) retombe sur la plus
  // récente plutôt que sur une page vide.
  const digest = digests.find((d) => d.week === semaine) ?? digests[0] ?? null;

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="veille"
      title="Lettres et alertes"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce qui change dans votre environnement numérique, et ce que ça implique pour vous.
        </p>
      }
    >
      {digest ? (
        <DigestSemaine
          content={digest.content}
          semaines={digests.map((d) => d.week)}
          base={viewer.base}
        />
      ) : null}

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
  decision: "decisions",
  cartographie: "cartographie",
  document: "documents",
  roadmap: "missions",
  veille: "veille",
  prestation: "prestations",
  audit: "audit",
  proposition: "propositions",
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
  const since = context.since;
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
