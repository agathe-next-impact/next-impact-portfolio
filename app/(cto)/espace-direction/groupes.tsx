import type { ReactNode } from "react";
import {
  prestationsForClient,
  type ApercuPayload,
  type CartographiePayload,
  type DecisionPayload,
  type Deliverable,
  type DocumentPayload,
  type RoadmapPayload,
} from "@cto/deliverables";
import {
  sectionByKey,
  visibleGroups,
  type SectionGroup,
  type SectionKey,
  type Verdict,
  type VisibleGroup,
} from "@cto/espace";
import { lettersForClient } from "@cto/letters";
import { sentinelleStateFor, type SentinelleVerdict } from "@cto/sentinelle";
import { auditPath, sortCartographie, sortRecentFirst, sortRoadmap } from "./livrables";
import { ActionTag, actionMeta, CarteReponse, LigneCarte, LigneVide, livrableHref } from "./pilotage";
import { Espace, sectionHref, sectionsAvecInformation, type EspaceContext } from "./shell";
import { formatDay, Tag, type Tone } from "./ui";
import { CarteActions, CarteMissions, CarteSite, CarteVeille } from "./vues";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// La synthèse d'un groupe (Pilotage, Votre site, Veille, Contrats).
//
// Une carte par entrée du groupe, dans l'ordre de la barre latérale : la
// question, la réponse en une phrase, trois lignes au plus pour l'étayer, et
// la porte vers le détail. Même grammaire que l'accueil (`CarteReponse`) :
// l'accueil répond pour tout l'espace, la synthèse pour un groupe.
//
// Seules les entrées ouvertes à l'accompagnement ET qui ont une information ont
// leur carte (`sectionsAvecInformation`, comme la barre latérale) ; un groupe
// d'une seule entrée n'a pas de synthèse (cf. `visibleGroups`).
// ─────────────────────────────────────────────────────────────────────────────

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

/** Le groupe tel que l'accompagnement le voit, s'il a une synthèse. */
export function groupeAvecSynthese(context: EspaceContext, group: SectionGroup): VisibleGroup | null {
  const groupe = visibleGroups(sectionsAvecInformation(context)).find((candidate) => candidate.group === group);
  return groupe?.synthese ? groupe : null;
}

/** L'adresse d'une section, pour les pieds de carte. */
function lienSection(viewer: Viewer, key: SectionKey): string {
  return sectionHref(sectionByKey(key), viewer.base);
}

const LIGNES = 3;

// ─── Pilotage ────────────────────────────────────────────────────────────

const STATUTS_CLOS = new Set(["Fait", "Écarté"]);

function CarteRoadmap({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRoadmap(context.items.filter((item) => item.kind === "roadmap"));
  const aMener = items.filter((item) => !STATUTS_CLOS.has((item.payload as RoadmapPayload).statut ?? ""));
  const verdict: Verdict =
    items.length === 0
      ? { headline: "Roadmap en préparation", tone: "neutre" }
      : aMener.length === 0
        ? { headline: `${items.length} ${pluriel(items.length, "chantier mené", "chantiers menés")}`, tone: "fait" }
        : {
            headline: `${aMener.length} ${pluriel(aMener.length, "chantier", "chantiers")} à mener sur ${items.length}`,
            tone: "neutre",
          };

  return (
    <CarteReponse
      question="Que reste-t-il à faire ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "roadmap"), label: "Toute la roadmap" }}
    >
      {aMener.length === 0 ? (
        <LigneVide>Les chantiers à mener apparaîtront ici dès leur publication.</LigneVide>
      ) : (
        aMener.slice(0, LIGNES).map((item) => {
          const payload = item.payload as RoadmapPayload;
          return (
            <LigneCarte
              key={item.id}
              titre={item.title}
              href={lienSection(viewer, "roadmap")}
              tag={payload.statut ? <Tag>{payload.statut}</Tag> : null}
              meta={item.occurredAt ? `Échéance ${formatDay(item.occurredAt)}` : null}
            />
          );
        })
      )}
    </CarteReponse>
  );
}

function CarteDecisions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "decision"));
  const [derniere] = items;
  const verdict: Verdict = derniere
    ? {
        headline: `${items.length} ${pluriel(items.length, "décision", "décisions")}${
          derniere.occurredAt ? `, la dernière le ${formatDay(derniere.occurredAt)}` : ""
        }`,
        tone: "neutre",
      }
    : { headline: "Aucune décision relevée pour l'instant", tone: "neutre" };

  return (
    <CarteReponse
      question="Qu'a-t-on tranché ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "decisions"), label: "Toutes les décisions" }}
    >
      {items.length === 0 ? (
        <LigneVide>Chaque arbitrage apparaîtra ici avec son motif et l&rsquo;option écartée.</LigneVide>
      ) : (
        items.slice(0, LIGNES).map((item) => {
          const payload = item.payload as DecisionPayload;
          return (
            <LigneCarte
              key={item.id}
              titre={item.title}
              href={livrableHref(item, context, viewer.base)}
              tag={payload.nature === "ecartee" ? <Tag>Écartée</Tag> : <Tag tone="fait">Retenue</Tag>}
              meta={item.occurredAt ? formatDay(item.occurredAt) : null}
            />
          );
        })
      )}
    </CarteReponse>
  );
}

function CarteAudit({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const audits = sortRecentFirst(context.items.filter((item) => item.kind === "audit"));
  const [dernier] = audits;
  const verdict: Verdict = dernier
    ? {
        headline: dernier.occurredAt ? `Dernier audit : mesures du ${formatDay(dernier.occurredAt)}` : "Audit remis",
        tone: "fait",
      }
    : { headline: "Audit en préparation", tone: "neutre" };

  return (
    <CarteReponse
      question="Qu'a montré l'audit ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "audit"), label: audits.length > 1 ? "Tous les audits" : "Lire l'audit" }}
    >
      {audits.length === 0 ? (
        <LigneVide>
          Votre audit apparaîtra ici dès sa remise : synthèse, constats, scénarios et roadmap chiffrée.
        </LigneVide>
      ) : (
        audits.slice(0, LIGNES).map((item) => (
          <LigneCarte
            key={item.id}
            titre={item.title}
            href={auditPath(item.notionPageId, viewer.base)}
            meta={item.occurredAt ? `Mesures du ${formatDay(item.occurredAt)}` : null}
          />
        ))
      )}
    </CarteReponse>
  );
}

function CarteDocuments({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "document"));
  const verdict: Verdict =
    items.length === 0
      ? { headline: "Aucune pièce remise pour l'instant", tone: "neutre" }
      : { headline: `${items.length} ${pluriel(items.length, "pièce remise", "pièces remises")}`, tone: "neutre" };

  return (
    <CarteReponse
      question="Quelles pièces vous ont été remises ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "documents"), label: "Tous les documents" }}
    >
      {items.length === 0 ? (
        <LigneVide>Revues de devis, notes de comité et restitutions arriveront ici.</LigneVide>
      ) : (
        items.slice(0, LIGNES).map((item) => {
          const payload = item.payload as DocumentPayload;
          return (
            <LigneCarte
              key={item.id}
              titre={item.title}
              href={livrableHref(item, context, viewer.base)}
              tag={payload.type ? <Tag>{payload.type}</Tag> : null}
              meta={item.occurredAt ? formatDay(item.occurredAt) : null}
            />
          );
        })
      )}
    </CarteReponse>
  );
}

// ─── Votre site ──────────────────────────────────────────────────────────

function CarteApercus({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "apercu"));
  const verdict: Verdict = {
    headline: `${items.length} ${pluriel(items.length, "version à consulter", "versions à consulter")}`,
    tone: "neutre",
  };

  return (
    <CarteReponse
      question="Que pouvez-vous déjà regarder ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "apercus"), label: "Liens et accès" }}
    >
      {items.slice(0, LIGNES).map((item) => {
        const nature = (item.payload as ApercuPayload).nature;
        return (
          <LigneCarte
            key={item.id}
            titre={item.title}
            href={livrableHref(item, context, viewer.base)}
            tag={nature ? <Tag>{nature === "maquette" ? "Maquette" : "Site en développement"}</Tag> : null}
            meta={item.occurredAt ? formatDay(item.occurredAt) : null}
          />
        );
      })}
    </CarteReponse>
  );
}

function CarteCartographie({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortCartographie(context.items.filter((item) => item.kind === "cartographie"));
  const critiques = items.filter((item) => (item.payload as CartographiePayload).criticite === "Critique").length;
  const verdict: Verdict =
    items.length === 0
      ? { headline: "Cartographie en préparation", tone: "neutre" }
      : {
          headline: `${items.length} ${pluriel(items.length, "élément", "éléments")} recensés${
            critiques > 0 ? `, dont ${critiques} ${pluriel(critiques, "critique", "critiques")}` : ""
          }`,
          tone: "neutre",
        };

  return (
    <CarteReponse
      question="De quoi votre système est-il fait ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "cartographie"), label: "Toute la cartographie" }}
    >
      {items.length === 0 ? (
        <LigneVide>Outils, fournisseurs, contrats et accès apparaîtront ici, par criticité.</LigneVide>
      ) : (
        items.slice(0, LIGNES).map((item) => {
          const payload = item.payload as CartographiePayload;
          return (
            <LigneCarte
              key={item.id}
              titre={item.title}
              href={lienSection(viewer, "cartographie")}
              tag={
                payload.criticite ? (
                  <Tag tone={payload.criticite === "Critique" ? "attention" : "neutre"}>{payload.criticite}</Tag>
                ) : null
              }
              meta={[payload.type, payload.detenteur].filter(Boolean).join(" · ") || null}
            />
          );
        })
      )}
    </CarteReponse>
  );
}

// ─── Veille ──────────────────────────────────────────────────────────────

const ALERTE: Record<SentinelleVerdict, { tone: Tone; mot: string }> = {
  red: { tone: "alerte", mot: "Critique" },
  orange: { tone: "attention", mot: "À surveiller" },
  green: { tone: "fait", mot: "Sans risque" },
  info: { tone: "neutre", mot: "Information" },
};

async function CarteVeilleTechnique({ viewer }: { viewer: Viewer }) {
  const state = await sentinelleStateFor(viewer.clientId);
  const alertes = state ? [...state.data.alerts].sort((a, b) => b.at.localeCompare(a.at)) : [];
  const critiques = alertes.filter((alerte) => alerte.verdict === "red").length;
  const aSurveiller = alertes.filter((alerte) => alerte.verdict === "orange").length;
  const verdict: Verdict = !state
    ? { headline: "Surveillance en cours de mise en place", tone: "neutre" }
    : critiques > 0
      ? { headline: `${critiques} ${pluriel(critiques, "alerte critique", "alertes critiques")} sur 6 mois`, tone: "alerte" }
      : aSurveiller > 0
        ? { headline: `${aSurveiller} ${pluriel(aSurveiller, "point", "points")} à surveiller sur 6 mois`, tone: "attention" }
        : { headline: `${state.data.stack.components.length} composants suivis, rien de critique`, tone: "fait" };

  return (
    <CarteReponse
      question="Vos composants sont-ils exposés ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "veille-technique"), label: "Toute la veille technique" }}
    >
      {alertes.length === 0 ? (
        <LigneVide>
          {state
            ? "Aucune alerte sur les six derniers mois."
            : "Les alertes apparaîtront ici après le premier relevé de votre site."}
        </LigneVide>
      ) : (
        alertes.slice(0, LIGNES).map((alerte) => {
          const { tone, mot } = ALERTE[alerte.verdict ?? "info"];
          return (
            <LigneCarte
              key={alerte.ref}
              titre={alerte.title}
              href={lienSection(viewer, "veille-technique")}
              tag={<Tag tone={tone}>{mot}</Tag>}
              meta={`${alerte.component} · ${formatDay(new Date(alerte.at))}`}
            />
          );
        })
      )}
    </CarteReponse>
  );
}

// ─── Contrats ────────────────────────────────────────────────────────────

function CartePropositions({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const aValider = context.actions.aValider;
  const verdict: Verdict =
    aValider.length === 0
      ? { headline: "Aucune proposition en attente", tone: "fait" }
      : {
          headline: `${aValider.length} ${pluriel(aValider.length, "proposition attend", "propositions attendent")} votre réponse`,
          tone: "attention",
        };

  return (
    <CarteReponse
      question="Qu'attend votre accord ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "propositions"), label: "Toutes les propositions" }}
    >
      {aValider.length === 0 ? (
        <LigneVide>Les propositions acceptées deviennent des missions, à côté.</LigneVide>
      ) : (
        aValider.slice(0, LIGNES).map((action) => (
          <LigneCarte
            key={action.id}
            titre={action.title}
            href={action.item ? livrableHref(action.item, context, viewer.base) : null}
            tag={<ActionTag action={action} />}
            meta={actionMeta(action)}
          />
        ))
      )}
    </CarteReponse>
  );
}

const EN_COURS = new Set(["En cours", "À venir"]);

async function CartePrestations({ viewer }: { viewer: Viewer }) {
  const missions = (await prestationsForClient(viewer.clientId))
    .filter((item) => EN_COURS.has(item.payload.statut ?? ""))
    .sort((a, b) => (a.occurredAt?.getTime() ?? Infinity) - (b.occurredAt?.getTime() ?? Infinity));
  const enCours = missions.filter((item) => item.payload.statut === "En cours").length;
  const verdict: Verdict =
    missions.length === 0
      ? { headline: "Aucune mission en cours", tone: "neutre" }
      : {
          headline: `${enCours} en cours, ${missions.length - enCours} à venir`,
          tone: "neutre",
        };

  return (
    <CarteReponse
      question="Qu'avez-vous signé ?"
      verdict={verdict}
      pied={{ href: lienSection(viewer, "prestations"), label: "Détail et règlements" }}
    >
      {missions.length === 0 ? (
        <LigneVide>Les missions signées apparaîtront ici, avec leur échéancier.</LigneVide>
      ) : (
        missions.slice(0, LIGNES).map((item: Deliverable<"prestation">) => (
          <LigneCarte
            key={item.id}
            titre={item.title}
            href={lienSection(viewer, "prestations")}
            tag={<Tag tone={item.payload.statut === "En cours" ? "attention" : "neutre"}>{item.payload.statut}</Tag>}
            meta={item.occurredAt ? `Livraison ${formatDay(item.occurredAt)}` : null}
            avancement={typeof item.payload.avancement === "number" ? Math.round(item.payload.avancement * 100) : null}
          />
        ))
      )}
    </CarteReponse>
  );
}

// ─── La page ─────────────────────────────────────────────────────────────

async function carte(key: SectionKey, viewer: Viewer, context: EspaceContext): Promise<ReactNode> {
  switch (key) {
    case "missions":
      return <CarteMissions viewer={viewer} context={context} libelle="Vue d'ensemble" />;
    case "roadmap":
      return <CarteRoadmap viewer={viewer} context={context} />;
    case "decisions":
      return <CarteDecisions viewer={viewer} context={context} />;
    case "audit":
      return <CarteAudit viewer={viewer} context={context} />;
    case "documents":
      return <CarteDocuments viewer={viewer} context={context} />;
    case "site":
      return <CarteSite viewer={viewer} context={context} />;
    case "apercus":
      return <CarteApercus viewer={viewer} context={context} />;
    case "cartographie":
      return <CarteCartographie viewer={viewer} context={context} />;
    case "agir":
      return <CarteActions viewer={viewer} context={context} />;
    case "veille":
      return <CarteVeille viewer={viewer} lettres={await lettersForClient(viewer.clientId)} libelle="Lettres et alertes" />;
    case "veille-technique":
      return <CarteVeilleTechnique viewer={viewer} />;
    case "propositions":
      return <CartePropositions viewer={viewer} context={context} />;
    case "prestations":
      return <CartePrestations viewer={viewer} />;
    default:
      return null;
  }
}

export async function VueGroupe({
  viewer,
  context,
  groupe,
}: {
  viewer: Viewer;
  context: EspaceContext;
  groupe: VisibleGroup;
}) {
  const cartes = await Promise.all(
    groupe.sections.map(async (section) => ({ key: section.key, contenu: await carte(section.key, viewer, context) })),
  );

  return (
    <Espace
      viewer={viewer}
      context={context}
      active={null}
      activeGroup={groupe.group}
      title={groupe.label}
    >
      <section
        aria-label={`Synthèse : ${groupe.label}`}
        className={`mt-10 grid gap-4 md:grid-cols-2 ${cartes.length > 4 ? "2xl:grid-cols-3" : ""}`}
      >
        {cartes.map((entree) => (
          <div key={entree.key} className="flex flex-col [&>article]:flex-1">
            {entree.contenu}
          </div>
        ))}
      </section>
    </Espace>
  );
}
