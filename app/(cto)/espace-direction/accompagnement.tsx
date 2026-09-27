import {
  apportsDirection,
  contenuPalier,
  estPalierExpert,
  finEngagement,
  NOMS_SERVICES,
  nomPalier,
  palierSuperieur,
  PREAVIS_MOIS,
  PROJETS,
  SERVICES_A_AJOUTER,
} from "@cto/offre";
import Link from "next/link";
import { CALENDLY_URL, contactHref, Espace, sectionHref, type EspaceContext } from "./shell";
import { buttonClass, formatDay, Label, Panel, Tag } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Contrats → Votre accompagnement : ce que l'on a, ce que l'on pourrait avoir.
//
// Trois blocs et un seul bouton. Aucun montant (décision du 2026-09-27) : le
// tarif se discute en comité, la page dit ce que chaque étape apporte. Les
// libellés des paliers viennent de la page publique (`@cto/offre`).
// ─────────────────────────────────────────────────────────────────────────────

export async function VueAccompagnement({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const profil = context.profile;
  const services = profil.services ?? [];
  const palier = profil.tier;
  const suivant = palierSuperieur(palier);
  const aAjouter = SERVICES_A_AJOUTER.filter((service) => !services.includes(service.code));
  const maintenant = new Date();

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="accompagnement"
      title="Votre accompagnement"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce que comprend votre accompagnement aujourd&rsquo;hui, et ce qui peut s&rsquo;y ajouter quand vos
          besoins évoluent.
        </p>
      }
    >
      {/* ── Ce que vous avez ─────────────────────────────────────────── */}
      <section aria-labelledby="actuel-titre" className="mt-10">
        <h2 id="actuel-titre" className="font-sans text-lg font-light text-foreground">
          Ce que vous avez
        </h2>
        <Panel className="mt-4 divide-y divide-dark-gray">
          {estPalierExpert(palier) ? (
            <Ligne titre="Expert technique externalisé" etiquette={`Palier ${nomPalier(palier)}`}>
              {profil.contractStart ? engagement(profil.contractStart, maintenant) : null}
            </Ligne>
          ) : palier === "audit" ? (
            <Ligne titre="Audit + roadmap" etiquette="Audit" />
          ) : null}

          {services.includes("suivi-technique") ? (
            <Ligne
              titre="Suivi et maintenance"
              etiquette={profil.suiviFormule ? `Formule ${profil.suiviFormule}` : undefined}
            >
              {profil.suiviInclusJusquau && profil.suiviInclusJusquau > maintenant
                ? `Mois de suivi inclus jusqu'au ${formatDay(profil.suiviInclusJusquau)}.`
                : null}
            </Ligne>
          ) : null}

          {services.length > 0 ? (
            <div className="px-5 py-4">
              <Label>Services inclus</Label>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {services.map((code) => (
                  <li key={code}>
                    <Tag>{NOMS_SERVICES[code] ?? code}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Toutes les sections, y compris celles qui ont quitté la barre
              latérale faute de contenu : c'est leur porte d'entrée. */}
          <div className="px-5 py-4">
            <Label>Dans votre espace</Label>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {context.sections
                .filter((section) => section.key !== "tableau" && section.key !== "accompagnement")
                .map((section) => (
                  <li key={section.key} className="font-inter-tight text-sm">
                    <Link
                      href={sectionHref(section, viewer.base)}
                      className="text-foreground underline-offset-4 hover:text-accent-secondary hover:underline"
                    >
                      {section.label}
                    </Link>
                    {context.sommeil.has(section.key) ? (
                      <span className="text-mid-gray"> · en attente d&rsquo;un premier contenu</span>
                    ) : null}
                  </li>
                ))}
            </ul>
          </div>
        </Panel>
      </section>

      {/* ── L'étape d'après ──────────────────────────────────────────── */}
      {suivant === "direction" ? (
        <section aria-labelledby="palier-titre" className="mt-12">
          <h2 id="palier-titre" className="font-sans text-lg font-light text-foreground">
            Ce que le palier Direction technique ajoute
          </h2>
          <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">
            Pour les périodes où les décisions techniques se rapprochent : plusieurs prestataires, une
            refonte, des échéances qui se chevauchent.
          </p>
          <Panel className="mt-4 divide-y divide-dark-gray">
            {apportsDirection().map((apport) => (
              <div key={apport.critere} className="grid gap-1 px-5 py-3 sm:grid-cols-[12rem_1fr_1fr] sm:gap-4">
                <p className="font-inter-tight text-sm text-foreground">{apport.critere}</p>
                <p className="font-inter-tight text-sm text-mid-gray">
                  <span className="sm:hidden">Aujourd&rsquo;hui : </span>
                  {apport.referent}
                </p>
                <p className="font-inter-tight text-sm text-foreground">
                  <span className="text-mid-gray sm:hidden">Direction technique : </span>
                  {apport.direction}
                </p>
              </div>
            ))}
          </Panel>
        </section>
      ) : suivant === "referent" ? (
        <section aria-labelledby="palier-titre" className="mt-12">
          <h2 id="palier-titre" className="font-sans text-lg font-light text-foreground">
            Après l&rsquo;audit : le palier Référent
          </h2>
          <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">
            L&rsquo;audit dit quoi faire. Le palier Référent vous accompagne pour le faire, mois après mois.
          </p>
          <Panel className="mt-4 divide-y divide-dark-gray">
            {contenuPalier("referent").map((ligne) => (
              <div key={ligne.critere} className="grid gap-1 px-5 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <p className="font-inter-tight text-sm text-foreground">{ligne.critere}</p>
                <p className="font-inter-tight text-sm text-mid-gray">{ligne.valeur}</p>
              </div>
            ))}
          </Panel>
        </section>
      ) : null}

      {/* ── À ajouter ────────────────────────────────────────────────── */}
      <section aria-labelledby="ajouter-titre" className="mt-12">
        <h2 id="ajouter-titre" className="font-sans text-lg font-light text-foreground">
          À ajouter
        </h2>
        <Panel className="mt-4 divide-y divide-dark-gray">
          {aAjouter.map((service) => (
            <Ligne key={service.code} titre={service.nom}>
              {service.apport}
            </Ligne>
          ))}
          <div className="px-5 py-4">
            <Label>Projets ponctuels</Label>
            <ul className="mt-2 space-y-2">
              {PROJETS.map((projet) => (
                <li key={projet.nom} className="font-inter-tight text-sm">
                  <span className="text-foreground">{projet.nom}</span>
                  <span className="text-mid-gray"> · {projet.apport}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </section>

      {/* ── Un seul bouton ───────────────────────────────────────────── */}
      <Panel className="mt-12 border-l-2 border-l-accent-secondary px-5 py-6 sm:px-6">
        <Label>Faire évoluer votre accompagnement</Label>
        <p className="mt-2 max-w-prose font-inter-tight text-base text-foreground">
          Un changement de palier ou un service en plus se décide ensemble, au prochain comité ou
          avant si c&rsquo;est urgent.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={contactHref(viewer.company, "Faire évoluer mon accompagnement")} className={buttonClass.primary}>
            En parler
          </a>
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer noopener" className={buttonClass.ghost}>
            Prendre un créneau ↗
          </a>
        </div>
      </Panel>
    </Espace>
  );
}

function Ligne({ titre, etiquette, children }: { titre: string; etiquette?: string; children?: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-inter-tight text-base text-foreground">{titre}</p>
        {etiquette ? <Tag>{etiquette}</Tag> : null}
      </div>
      {children ? <p className="mt-1.5 font-inter-tight text-sm text-mid-gray">{children}</p> : null}
    </div>
  );
}

/** « Depuis le …, engagé jusqu'au …, puis au mois » — ou, l'engagement passé, le préavis seul. */
function engagement(debut: Date, maintenant: Date): string {
  const fin = finEngagement(debut);
  const preavis = `préavis de ${PREAVIS_MOIS} mois`;
  return fin > maintenant
    ? `Depuis le ${formatDay(debut)}. Engagé jusqu'au ${formatDay(fin)}, puis au mois (${preavis}).`
    : `Depuis le ${formatDay(debut)}. Engagement initial terminé : au mois, ${preavis}.`;
}
