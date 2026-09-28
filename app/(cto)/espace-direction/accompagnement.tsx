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
import { veilleOfferte } from "@cto/espace";
import { CALENDLY_URL, contactHref, Espace, type EspaceContext } from "./shell";
import { buttonClass, formatDay, Label, Legende, Panel, Tag } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Contrats → Votre accompagnement : ce que l'on a, ce que l'on pourrait avoir.
//
// Trois blocs (d'abord ce qui peut s'ajouter) et un seul bouton. Aucun montant (décision du 2026-09-27) : le
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
  const veille = veilleOfferte(profil.services ?? [], profil.ouverture, maintenant);

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="accompagnement"
      title="Votre accompagnement"
    >
      {/* ── À ajouter ────────────────────────────────────────────────── */}
      <section aria-labelledby="ajouter-titre" className="mt-10">
        <Legende id="ajouter-titre">À ajouter</Legende>
        <Panel className="mt-1 divide-y divide-dark-gray">
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

      {/* ── Ce que vous avez ─────────────────────────────────────────── */}
      <section aria-labelledby="actuel-titre" className="mt-10">
        <Legende id="actuel-titre">Ce que vous avez</Legende>
        <Panel className="mt-1 divide-y divide-dark-gray">
          {/* La veille est offerte à l'ouverture de l'espace ; sa ligne dit
              jusqu'à quand, et que l'espace reste ouvert après. */}
          <Ligne
            titre="Veille de votre écosystème et de votre site"
            etiquette={veille.recurrente ? "Comprise" : veille.active ? "Offerte" : "Terminée"}
          >
            {veille.recurrente
              ? "Comprise dans votre accompagnement : les lettres Signaux Faibles et les alertes sur votre site."
              : veille.jusquau && veille.active
                ? `Offerte à l'ouverture de votre espace, jusqu'au ${formatDay(veille.jusquau)}.`
                : veille.jusquau
                  ? `Offerte jusqu'au ${formatDay(veille.jusquau)}. Les lettres reçues restent dans votre espace, qui reste ouvert.`
                  : null}
          </Ligne>

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

        </Panel>
      </section>

      {/* ── L'étape d'après ──────────────────────────────────────────── */}
      {suivant === "direction" ? (
        <section aria-labelledby="palier-titre" className="mt-10">
          <Legende id="palier-titre">Ce que le palier Direction technique ajoute</Legende>
          <Panel className="mt-1 divide-y divide-dark-gray">
            <p className="px-5 py-4 font-inter-tight text-sm text-mid-gray">
              Pour les périodes où les décisions techniques se rapprochent : plusieurs prestataires, une
              refonte, des échéances qui se chevauchent.
            </p>
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
        <section aria-labelledby="palier-titre" className="mt-10">
          <Legende id="palier-titre">Après l&rsquo;audit : le palier Référent</Legende>
          <Panel className="mt-1 divide-y divide-dark-gray">
            <p className="px-5 py-4 font-inter-tight text-sm text-mid-gray">
              L&rsquo;audit dit quoi faire. Le palier Référent vous accompagne pour le faire, mois après mois.
            </p>
            {contenuPalier("referent").map((ligne) => (
              <div key={ligne.critere} className="grid gap-1 px-5 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <p className="font-inter-tight text-sm text-foreground">{ligne.critere}</p>
                <p className="font-inter-tight text-sm text-mid-gray">{ligne.valeur}</p>
              </div>
            ))}
          </Panel>
        </section>
      ) : null}

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
