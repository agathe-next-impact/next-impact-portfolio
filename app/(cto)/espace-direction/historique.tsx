import type { AuditPayload, Deliverable, DeliverableKind } from "@cto/deliverables";
import { formatDay, Label, Panel, Tag } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// L'histoire d'un livrable, version par version.
//
// C'est l'écran qui rend l'append-only utile au client plutôt qu'à
// l'architecture. Afficher « corrigé le 8 septembre » sans montrer CE QUI a
// changé, c'est demander de croire sur parole — exactement ce que
// l'accompagnement prétend remplacer par des documents opposables.
//
// La comparaison se fait champ à champ entre deux versions consécutives. Un
// diff textuel mot à mot serait plus fin et beaucoup moins lisible : sur un
// motif de trois phrases, ce que le lecteur veut savoir est « le motif a
// changé, voici l'ancien, voici le nouveau », pas quels mots ont bougé.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Le nom lisible de chaque champ, par type de livrable.
 *
 * Sans cette table, l'écran afficherait `optionEcartee` à un dirigeant. Les
 * clés absentes ne s'affichent pas : c'est le garde-fou qui empêche un champ
 * technique ajouté plus tard de fuiter tel quel dans l'espace client.
 */
const FIELD_LABELS: Record<DeliverableKind, Record<string, string>> = {
  decision: {
    nature: "Nature",
    motif: "Motif",
    optionEcartee: "Option écartée",
    portee: "Portée",
  },
  roadmap: {
    nature: "Nature",
    statut: "Statut",
    budget: "Budget",
    effort: "Effort",
    effet: "Effet",
    detail: "Détail",
  },
  cartographie: {
    type: "Type",
    detenteur: "Détenteur",
    coutAnnuel: "Coût annuel",
    criticite: "Criticité",
    risque: "Risque",
  },
  veille: {
    nature: "Nature",
    fait: "Ce qui change",
    implication: "Ce que ça implique",
    source: "Source",
    themes: "Thèmes",
  },
  document: {
    type: "Type",
    prestataire: "Prestataire",
    montant: "Montant",
    verdict: "Verdict",
    alternative: "Alternative chiffrée",
    fichier: "Pièce jointe",
  },
  prestation: {
    statut: "Statut",
    debut: "Début",
    montant: "Montant",
    avancement: "Avancement",
    devis: "Devis",
    detail: "Détail",
  },
  // Les blocs ne se comparent pas ici champ à champ : voir `partiesModifiees`.
  audit: {
    site: "Site audité",
    dateMesures: "Date des mesures",
    annexe: "Annexe",
  },
  proposition: {
    statut: "Statut",
  },
};

const VIDE = "—";

function lisible(value: unknown): string {
  if (value === null || value === undefined || value === "") return VIDE;
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : VIDE;
  // Une pièce jointe se lit par son nom ; son empreinte, qui change quand le
  // fichier change, n'a rien à dire à un dirigeant.
  if (typeof value === "object" && "name" in (value as object)) {
    return String((value as { name: unknown }).name);
  }
  if (typeof value === "number") return String(value);
  return String(value);
}

interface Changement {
  champ: string;
  /** Null quand l'ancien état n'a pas de forme lisible : seul le nouveau s'affiche. */
  avant: string | null;
  apres: string;
}

/**
 * Ce qui a bougé entre deux versions d'un audit, partie par partie.
 *
 * Un audit pèse des centaines de blocs : les afficher barrés puis réécrits
 * noierait la correction. Le client a besoin de savoir OÙ regarder — « la
 * partie Sécurité a été corrigée » —, puis de lire la partie elle-même.
 */
function partiesModifiees(a: Record<string, unknown>, b: Record<string, unknown>): Changement[] {
  const avant = a as Partial<AuditPayload>;
  const apres = b as Partial<AuditPayload>;
  const modifiees: string[] = [];
  const empreinte = (valeur: unknown) => JSON.stringify(valeur ?? null);

  // `synthese` pour un audit, `corps` pour une proposition : la page elle-même.
  const corps = (payload: Record<string, unknown>) => payload.synthese ?? payload.corps;
  if (empreinte(corps(a)) !== empreinte(corps(b))) modifiees.push(avant.synthese !== undefined ? "Synthèse" : "Corps");

  const anciennes = new Map((avant.sections ?? []).map((section) => [section.id, section]));
  const nouvelles = new Set((apres.sections ?? []).map((section) => section.id));
  const ajoutees: string[] = [];
  for (const section of apres.sections ?? []) {
    const ancienne = anciennes.get(section.id);
    if (!ancienne) ajoutees.push(section.titre);
    else if (empreinte(ancienne) !== empreinte(section)) modifiees.push(section.titre);
  }
  const retirees = (avant.sections ?? [])
    .filter((section) => !nouvelles.has(section.id))
    .map((section) => section.titre);

  const changements: Changement[] = [];
  if (modifiees.length > 0) changements.push({ champ: "Parties corrigées", avant: null, apres: modifiees.join(", ") });
  if (ajoutees.length > 0) changements.push({ champ: "Parties ajoutées", avant: null, apres: ajoutees.join(", ") });
  if (retirees.length > 0) changements.push({ champ: "Parties retirées", avant: null, apres: retirees.join(", ") });
  return changements;
}

/**
 * Ce qui sépare deux versions consécutives.
 *
 * L'union des clés des deux côtés, et non celles de la plus récente : un champ
 * vidé disparaît du payload, et ne le regarder que dans le sens du présent
 * ferait passer une suppression pour un non-événement.
 */
function comparer(precedent: Deliverable, suivant: Deliverable): Changement[] {
  const changements: Changement[] = [];
  const labels = FIELD_LABELS[suivant.kind] ?? {};

  if (precedent.title !== suivant.title) {
    changements.push({ champ: "Titre", avant: precedent.title, apres: suivant.title });
  }

  const avantDate = precedent.occurredAt?.getTime() ?? null;
  const apresDate = suivant.occurredAt?.getTime() ?? null;
  if (avantDate !== apresDate) {
    changements.push({
      champ: "Date",
      avant: formatDay(precedent.occurredAt),
      apres: formatDay(suivant.occurredAt),
    });
  }

  const a = precedent.payload as unknown as Record<string, unknown>;
  const b = suivant.payload as unknown as Record<string, unknown>;
  for (const cle of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const label = labels[cle];
    if (!label) continue;
    const avant = lisible(a[cle]);
    const apres = lisible(b[cle]);
    if (avant !== apres) changements.push({ champ: label, avant, apres });
  }

  if (suivant.kind === "audit" || suivant.kind === "proposition") changements.push(...partiesModifiees(a, b));

  return changements;
}

/**
 * La frise des versions, de la plus récente à la première.
 *
 * `versions` arrive déjà triée en décroissant. La toute première version n'a
 * rien à comparer : elle s'affiche comme publication, ce qu'elle est.
 */
export function Historique({ versions }: { versions: Deliverable[] }) {
  if (versions.length <= 1) {
    const seule = versions[0];
    return (
      <Panel className="mt-6 px-5 py-5">
        <p className="font-inter-tight text-sm text-mid-gray">
          Publié le {seule ? formatDay(seule.recordedAt) : VIDE}, et inchangé depuis.
        </p>
      </Panel>
    );
  }

  return (
    <ol className="mt-6">
      {versions.map((version, index) => {
        const precedent = versions[index + 1];
        const changements = precedent ? comparer(precedent, version) : [];
        const premiere = !precedent;

        return (
          <li key={version.id} className="flex gap-4 sm:gap-6">
            <div className="w-24 shrink-0 pt-5 text-right sm:w-32">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                {formatDay(version.recordedAt)}
              </p>
            </div>

            <div className="relative flex-1 border-l border-dark-gray pb-8 pl-5 pt-5 sm:pl-6">
              <span
                aria-hidden
                className={`absolute -left-[4.5px] top-[26px] h-2 w-2 ${
                  version.withdrawn ? "bg-[#ff8a7a]" : premiere ? "bg-mid-gray/50" : "bg-accent-secondary"
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-2">
                <Label>Version {version.version}</Label>
                {version.withdrawn ? (
                  <Tag tone="alerte">Retiré de l'espace</Tag>
                ) : premiere ? (
                  <Tag>Publication</Tag>
                ) : (
                  <Tag tone="attention">Correction</Tag>
                )}
              </div>

              {version.withdrawn ? (
                <p className="mt-3 font-inter-tight text-sm text-mid-gray">
                  Ce livrable a cessé d'être publié à cette date. Son contenu reste
                  consultable dans les versions précédentes.
                </p>
              ) : premiere ? (
                <p className="mt-3 font-inter-tight text-sm text-mid-gray">
                  Première publication.
                </p>
              ) : changements.length === 0 ? (
                <p className="mt-3 font-inter-tight text-sm text-mid-gray">
                  Republication à l'identique.
                </p>
              ) : (
                <dl className="mt-3 space-y-3">
                  {changements.map((changement) => (
                    <div key={changement.champ}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
                        {changement.champ}
                      </dt>
                      <dd className="mt-1.5 space-y-1.5">
                        {changement.avant !== null ? (
                          <p className="border-l-2 border-l-dark-gray pl-3 font-inter-tight text-sm leading-relaxed text-mid-gray line-through decoration-mid-gray/40">
                            {changement.avant}
                          </p>
                        ) : null}
                        <p className="border-l-2 border-l-accent-secondary pl-3 font-inter-tight text-sm leading-relaxed text-foreground">
                          {changement.apres}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
