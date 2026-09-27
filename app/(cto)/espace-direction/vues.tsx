import type { ReactNode } from "react";
import Link from "next/link";
import { history, type AuditPayload, type Deliverable, type PropositionPayload } from "@cto/deliverables";
import {
  actionsVerdict,
  arbitrageOuvert,
  ordreDeLecture,
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
import { ARCHIVE_MONTHS, letterForClient, lettersForClient, structureLettre, type LetterSummary } from "@cto/letters";
import { digestsForClient } from "@cto/digest";
import { siteReportsFor } from "@cto/site";
import { Calendrier } from "./calendrier";
import { CarteContrats } from "./contrats";
import { CarteProchaineEtape } from "./prochaine-etape";
import { DigestSemaine } from "./digest";
import { Historique } from "./historique";
import { Chapitre, LectureLongue } from "./lecture";
import { LettreEnGrille } from "./lettre-grille";
import { CorpsLettre, dateLettre, lettresPath, libelleLettre, ListeLettres } from "./lettre";
import {
  Audits,
  CATEGORIES,
  Cartographie,
  historiquePath,
  categoriePath,
  Decisions,
  Documents,
  Nouveaute,
  nouveaute,
  Propositions,
  Roadmap,
  propositionTone,
  sortCartographie,
  sortRoadmap,
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
import { BackLink, buttonClass, Dot, formatDay, Groupe, Label, Legende, Notice, Panel, SectionNav, Suite, Tag } from "./ui";
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
  apercu: "Version de travail",
};

/** Combien de lignes « Nouveau pour vous » montre avant « Voir les N autres ». */
const NOUVEAU_VISIBLES = 5;

/**
 * « Nouveau pour vous » : ce qui a bougé depuis la dernière connexion, puis ce
 * que l'atelier a mis à la une (colonne « Affichage »), sans doublon.
 *
 * Réunit les deux anciens blocs « Depuis votre dernière connexion » et « À la
 * une », qui répondaient à la même question — « que dois-je regarder ? » — à
 * deux endroits de la page. Cinq lignes, le reste replié. Chaque ligne mène à
 * sa section, là où le détail se lit.
 */
function NouveauPourVous({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const since = context.since;
  const recents = since ? context.items.filter((item) => nouveaute(item, since) !== null) : [];
  const vus = new Set(recents.map((item) => item.id));
  const items = [...sortRecentFirst(recents), ...context.items.filter((item) => item.featured && !vus.has(item.id))];
  if (items.length === 0) return null;

  const ligne = (item: Deliverable) => (
    <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
      <div className="flex min-w-0 flex-wrap items-baseline gap-2">
        <Nouveaute item={item} since={since} />
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
    </li>
  );

  return (
    <section aria-labelledby="nouveau-titre" className="mt-10">
      <Panel className="border-l-2 border-l-accent-secondary">
        <div className="px-4 pb-1 pt-4">
          <h2 id="nouveau-titre">
            <Label>
              {recents.length > 0 && since
                ? `Nouveau pour vous · depuis le ${formatDay(since)}`
                : "Nouveau pour vous · à la une"}
            </Label>
          </h2>
        </div>
        <ul className="divide-y divide-dark-gray">{items.slice(0, NOUVEAU_VISIBLES).map(ligne)}</ul>
        <Suite count={items.length - NOUVEAU_VISIBLES} className="border-t border-dark-gray">
          <ul className="divide-y divide-dark-gray border-t border-dark-gray">
            {items.slice(NOUVEAU_VISIBLES).map(ligne)}
          </ul>
        </Suite>
      </Panel>
    </section>
  );
}

/**
 * « Qu'est-ce qui change autour de vous ? » : les trois dernières lettres, en
 * une ligne chacune. Remplace le grand bloc de la dernière lettre : sur
 * l'accueil, le titre suffit à décider de la lire.
 */
export function CarteVeille({ viewer, lettres, libelle = "Toute la veille" }: { viewer: Viewer; lettres: LetterSummary[]; libelle?: string }) {
  const [derniere] = lettres;
  const verdict = derniere
    ? { headline: `Dernière lettre ${dateLettre(derniere)}`, tone: "neutre" as const }
    : { headline: "Première lettre en préparation", tone: "neutre" as const };

  return (
    <CarteReponse
      question="Qu'est-ce qui change autour de vous ?"
      verdict={verdict}
      pied={{ href: sectionHref(sectionByKey("veille"), viewer.base), label: libelle }}
    >
      {lettres.length === 0 ? (
        <LigneVide>Vos lettres de veille arriveront ici dès la première parution.</LigneVide>
      ) : (
        lettres.slice(0, 3).map((lettre) => (
          <LigneCarte
            key={lettre.notionPageId}
            titre={lettre.title}
            href={`${lettresPath(viewer.base)}/${lettre.notionPageId}`}
            tag={<Tag>{libelleLettre(lettre)}</Tag>}
            meta={dateLettre(lettre)}
          />
        ))
      )}
    </CarteReponse>
  );
}

/** « Où en sont les missions ? » : ce qui court d'abord, puis ce qui vient, puis ce qui est fait. */
export function CarteMissions({ viewer, context, libelle = "Tout le pilotage" }: { viewer: Viewer; context: EspaceContext; libelle?: string }) {
  const lignes = [
    ...byPhase(context.missions, "en-cours"),
    ...byPhase(context.missions, "a-venir"),
    ...byPhase(context.missions, "passe"),
  ].slice(0, 3);
  const lien = href(viewer, context, "missions");

  return (
    <CarteReponse
      question="Où en sont les chantiers ?"
      verdict={missionsVerdict(context.missions)}
      pied={lien ? { href: lien, label: libelle } : null}
    >
      {lignes.length === 0 ? (
        <LigneVide>Les chantiers et décisions apparaîtront ici dès leur première publication.</LigneVide>
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
export function CarteSite({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
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
export function CarteActions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  // Sans les propositions : elles ont leur bloc à part, Contrats (`CarteContrats`).
  const { aTraiter, aArbitrer } = context.actions;
  const agir = href(viewer, context, "agir");
  const traiter = agir ? `${agir}#a-traiter` : null;
  const arbitrer = agir ? `${agir}#a-arbitrer` : null;
  const lignes: { action: Action; href: string | null }[] = [
    ...aTraiter.map((action) => ({ action, href: traiter })),
    ...aArbitrer.map((action) => ({ action, href: arbitrer })),
  ].slice(0, 3);

  const pied =
    aTraiter.length > 0 && traiter
      ? { href: traiter, label: "Voir et en parler" }
      : aArbitrer.length > 0 && arbitrer
        ? { href: arbitrer, label: "Voir et en parler" }
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
  // Ouverte à tous, la vue d'ensemble n'a sa carte que si elle a du contenu :
  // vide, elle promettrait des chantiers et décisions que le client n'a pas
  // forcément achetés, et que la barre latérale ne lui montre pas.
  const missions = sectionOuverte(context, "missions") && !context.sansInformation.has("missions");
  const site = sectionOuverte(context, "site");
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

      {/* Trois blocs, pas plus : ce qui est nouveau, l'essentiel en questions,
          les contrats. La frise vit dans Pilotage, le contact dans la barre
          latérale : les répéter ici n'apprenait rien de plus. */}
      <NouveauPourVous viewer={viewer} context={context} />

      <section aria-label="L'essentiel en quelques questions" className="mt-10 grid gap-4 md:grid-cols-2">
        {missions ? <CarteMissions viewer={viewer} context={context} /> : null}
        {site ? <CarteSite viewer={viewer} context={context} /> : null}
        <CarteActions viewer={viewer} context={context} />
        <CarteVeille viewer={viewer} lettres={lettres} />
      </section>

      <CarteContrats viewer={viewer} context={context} />

      <CarteProchaineEtape viewer={viewer} context={context} />
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
    context.livraisons,
  );

  return (
    <Espace viewer={viewer} context={context} active="missions" title="Pilotage">
      {context.missions.length === 0 ? (
        <EnPreparation>
          Les chantiers décidés, les décisions et les audits
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

          <section id="en-cours" aria-labelledby="en-cours-titre" className="mt-10 scroll-mt-20">
            <Legende id="en-cours-titre">{`En cours (${enCours.length})`}</Legende>
            <ListeMissions missions={enCours} context={context} base={viewer.base} vide="Rien en cours pour l'instant." />
          </section>

          <section id="a-venir" aria-labelledby="a-venir-titre" className="mt-10 scroll-mt-20">
            <Legende id="a-venir-titre">{`À venir (${aVenir.length})`}</Legende>
            <ListeMissions missions={aVenir} context={context} base={viewer.base} vide="Rien de programmé pour l'instant." />
          </section>

          {/* Le fait se consulte, il ne se suit plus : replié derrière son compteur. */}
          <Groupe id="fait" titre="Fait" count={fait.length}>
            <ListeMissions missions={fait} context={context} base={viewer.base} vide="Rien de terminé pour l'instant." />
          </Groupe>
        </>
      )}

      <Calendrier events={events} now={now} />
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
    >
      {plusieurs ? (
        <div className="mt-8">
          <BackLink href={sectionHref(section, viewer.base)}>Tous les audits</BackLink>
        </div>
      ) : null}

      <Panel className="mt-8 px-5 py-5">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt><Label>Mesures du</Label></dt>
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">
              {formatDay(audit.occurredAt)}
              {audit.version > 1 ? (
                <span className="text-mid-gray">{` · corrigé le ${formatDay(audit.recordedAt)}`}</span>
              ) : null}
            </dd>
          </div>
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
                href={historiquePath("audit", audit.notionPageId, viewer.base)}
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

      {/* La synthèse ouverte, chaque partie repliée derrière son titre ; le
          sommaire reste en vue et ouvre la partie qu'il vise. */}
      <LectureLongue
        label="Parties de l'audit"
        sommaire={[
          ...(payload.synthese.length > 0 ? [{ href: "#synthese", texte: "Synthèse" }] : []),
          ...payload.sections.map((partie) => ({
            href: `#partie-${partie.id}`,
            texte: `${partie.icone ? `${partie.icone} ` : ""}${partie.titre}`,
          })),
        ]}
      >
        {payload.synthese.length > 0 ? (
          <Chapitre id="synthese" titre="Synthèse" ouvert>
            <SyntheseAudit blocks={payload.synthese} base={viewer.base} />
          </Chapitre>
        ) : null}

        {payload.sections.map((partie) => (
          <Chapitre key={partie.id} id={`partie-${partie.id}`} titre={partie.titre} icone={partie.icone}>
            {partie.corps.length > 0 ? (
              partieEnAccordeons(partie.titre) ? (
                <PartieAccordeons corps={partie.corps} base={viewer.base} />
              ) : (
                <CorpsLettre body={partie.corps} large base={viewer.base} />
              )
            ) : (
              <p className="mt-4 font-inter-tight text-sm text-mid-gray">Partie vide.</p>
            )}
          </Chapitre>
        ))}
      </LectureLongue>
    </Espace>
  );
}

// ─── Votre site ──────────────────────────────────────────────────────────

export async function VueSite({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const state = context.site;
  const verdict = siteVerdict(state);
  const points = state?.snapshot ? sitePoints(state.snapshot) : [];
  const traiter = href(viewer, context, "agir");
  const reports = await siteReportsFor(viewer.clientId);

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="site"
      title="État du site"
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
                  En parler depuis « Actions » →
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

      {/* Les rapports mensuels, autrefois une entrée à part : on vient les
          chercher pour les transmettre, ils se déplient en bas de l'état. */}
      <Groupe id="rapports" titre="Rapports mensuels (PDF)" count={reports.length}>
        <RapportsMaintenance reports={reports} base={viewer.base} />
      </Groupe>
    </Espace>
  );
}

/**
 * La roadmap complète, en colonnes par statut, écartés compris. Elle n'était
 * accessible que par un lien au fil d'une phrase ; c'est désormais une entrée
 * de Pilotage.
 */
export async function VueRoadmap({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRoadmap(context.items.filter((item) => item.kind === "roadmap"));

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="roadmap"
      title="Roadmap"
    >
      {items.length === 0 ? (
        <EnPreparation>
          La roadmap de votre système apparaîtra ici dès le premier chantier publié.
        </EnPreparation>
      ) : (
        <div className="mt-10">
          <Roadmap items={items} now={Date.now()} since={context.since} bare base={viewer.base} />
        </div>
      )}
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
    <ul className="mt-1 divide-y divide-dark-gray border border-dark-gray bg-jet/40">
      {actions.map((action) => (
        <ActionLigne key={action.id} action={action} company={viewer.company} context={context} base={viewer.base} />
      ))}
    </ul>
  );
}

/**
 * Actions : une seule page pour « que puis-je faire ? ». D'abord ce qui est à
 * traiter (l'urgent), puis ce qui est à arbitrer (les opportunités de la
 * roadmap), si l'accompagnement le prévoit. Les deux anciennes pages
 * répondaient à la même question depuis deux entrées de menu.
 */
export async function VueAgir({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const { aTraiter, aArbitrer } = context.actions;
  const urgentes = aTraiter.filter((action) => action.tone === "alerte").length;
  const arbitrage = arbitrageOuvert(context.sections) || aArbitrer.length > 0;

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="agir"
      title="Actions"
    >
      {arbitrage ? (
        <SectionNav
          items={[
            { href: "#a-traiter", label: "À traiter", count: aTraiter.length },
            { href: "#a-arbitrer", label: "À arbitrer", count: aArbitrer.length },
          ]}
        />
      ) : null}

      <section id="a-traiter" aria-labelledby="a-traiter-titre" className="mt-10 scroll-mt-20">
        <Legende
          id="a-traiter-titre"
          aside={urgentes > 0 ? `dont ${urgentes} ${pluriel(urgentes, "urgent", "urgents")}` : undefined}
        >
          {`À traiter (${aTraiter.length})`}
        </Legende>
        {aTraiter.length === 0 ? (
          <Panel className="mt-1 px-5 py-6">
            <Label>Rien d&rsquo;urgent</Label>
            <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
              Aucun point du site à corriger, aucune échéance dans les 60 jours, aucune mission en
              retard.
            </p>
          </Panel>
        ) : (
          <ListeActions actions={aTraiter} viewer={viewer} context={context} />
        )}
      </section>

      {arbitrage ? (
        <section id="a-arbitrer" aria-labelledby="a-arbitrer-titre" className="mt-10 scroll-mt-20">
          <Legende id="a-arbitrer-titre">{`À arbitrer (${aArbitrer.length})`}</Legende>
          {aArbitrer.length === 0 ? (
            <EnPreparation>
              Aucune opportunité en attente de décision. Celles repérées en comité ou en veille
              apparaîtront ici, chiffrées.
            </EnPreparation>
          ) : (
            <ListeActions actions={aArbitrer} viewer={viewer} context={context} />
          )}
        </section>
      ) : null}
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
  // Le corps découpé à chaque grand titre. Ce qui résume (synthèse,
  // recommandation) passe en tête, ouvert ; le détail chiffré suit, replié.
  const { preambule, ouverts: enTete, replies: detail } = ordreDeLecture(payload.corps);
  const sommaire = [
    ...[...enTete, ...detail].map((chapitre) => ({ href: `#${chapitre.id}`, texte: chapitre.titre })),
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
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">
              {formatDay(proposition.occurredAt)}
              {proposition.version > 1 ? (
                <span className="text-mid-gray">{` · corrigée le ${formatDay(proposition.recordedAt)}`}</span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt><Label>Versions</Label></dt>
            <dd className="mt-1.5 font-inter-tight text-sm text-foreground">
              <Link
                href={historiquePath("proposition", proposition.notionPageId, viewer.base)}
                className="underline underline-offset-4 hover:text-accent-secondary"
              >
                {proposition.version > 1 ? `${proposition.version} versions, voir ce qui a changé` : "Version d'origine"}
              </Link>
            </dd>
          </div>
        </dl>
        {/* Répondre se fait dès l'ouverture, sans devoir lire jusqu'au bout. */}
        {enAttente ? (
          <div className="mt-5 flex flex-wrap gap-3 border-t border-dark-gray pt-5">
            <a href={contactHref(viewer.company, `Proposition : ${proposition.title}`)} className={buttonClass.primary}>
              Répondre à la proposition
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer noopener" className={buttonClass.ghost}>
              En discuter de vive voix ↗
            </a>
          </div>
        ) : null}
      </Panel>

      <LectureLongue label="Parties de la proposition" sommaire={sommaire}>
        {preambule.length > 0 ? (
          <div className="mb-6">
            <CorpsLettre body={preambule} large base={viewer.base} />
          </div>
        ) : null}

        {enTete.map((chapitre) => (
          <Chapitre key={chapitre.id} id={chapitre.id} titre={chapitre.titre} ouvert>
            <CorpsLettre body={chapitre.blocs} large base={viewer.base} />
          </Chapitre>
        ))}

        {detail.map((chapitre) => (
          <Chapitre key={chapitre.id} id={chapitre.id} titre={chapitre.titre}>
            <CorpsLettre body={chapitre.blocs} large base={viewer.base} />
          </Chapitre>
        ))}

        {payload.sections.map((partie) => (
          <Chapitre key={partie.id} id={`partie-${partie.id}`} titre={partie.titre} icone={partie.icone}>
            <CorpsLettre body={partie.corps} large base={viewer.base} />
          </Chapitre>
        ))}
      </LectureLongue>

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
    >
      {digest ? (
        <DigestSemaine
          content={digest.content}
          semaines={digests.map((d) => d.week)}
          base={viewer.base}
        />
      ) : null}

      {/* La veille dédiée en entier ici (six d'emblée, la suite se déplie) :
          c'est désormais sa seule page. */}
      {nouvelles.length > 0 ? (
        <section aria-labelledby="veille-dediee-titre" className="mt-10">
          <Legende id="veille-dediee-titre">{`Veille dédiée (${nouvelles.length})`}</Legende>
          <Veille items={nouvelles} visibles={6} since={since} base={viewer.base} bare />
        </section>
      ) : null}

      {/* Les trois dernières lettres ; les archives ont leur page. */}
      <section aria-labelledby="lettres-titre" className="mt-10">
        <Legende
          id="lettres-titre"
          aside={
            lettres.length > 3 ? (
              <Link href={lettresPath(viewer.base)} className="transition-colors hover:text-accent-secondary">
                {`Toutes les lettres · ${lettres.length} →`}
              </Link>
            ) : undefined
          }
        >
          Lettres de veille
        </Legende>
        <ListeLettres
          lettres={lettres.slice(0, 3)}
          base={viewer.base}
          libelle={lettres.length > 3 ? "Les plus récentes" : `${ARCHIVE_MONTHS} derniers mois`}
        />
      </section>
    </Espace>
  );
}

// ─── Pages de détail ─────────────────────────────────────────────────────

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
    >
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <BackLink href={categoriePath(kind, viewer.base)}>{CATEGORIES[kind].titre}</BackLink>
        <Label>
          {versions.length > 1
            ? `${versions.length} versions · la plus récente date du ${formatDay(courante.recordedAt)}`
            : "Une seule version"}
        </Label>
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

  // Toute lettre passe en grille quand sa forme est reconnue, quelle que soit
  // sa source (atelier, Signaux Faibles, Sentinelle, et les suivantes) : c'est
  // `structureLettre` qui juge sur le corps. Sinon, le texte suivi.
  const structure = structureLettre(lettre.body, lettre.period);
  // La date et la source de la lettre, en face du retour : ce qui la situe,
  // sans sous-titre sous le titre.
  const repere = (
    <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <BackLink href={lettresPath(viewer.base)}>Votre veille</BackLink>
      <Label>
        {dateLettre(lettre)} · {libelleLettre(lettre)}
      </Label>
    </div>
  );

  if (structure) {
    return (
      <Espace viewer={viewer} context={context} active="veille" title={lettre.title}>
        {repere}
        <LettreEnGrille structure={structure} chapo={lettre.chapo} base={viewer.base} />
      </Espace>
    );
  }

  return (
    <Espace viewer={viewer} context={context} active="veille" title={lettre.title}>
      {repere}
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
