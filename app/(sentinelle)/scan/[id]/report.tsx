"use client";

import { useEffect, useState } from "react";
import type {
  DetectedComponent,
  DiagnosticBesoin,
  DiagnosticIssue,
  DiagnosticTonalite,
  ScanApercu,
  ScanDiagnostic,
  ScanResult,
} from "@sentinelle/types";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";

// Libellés lisibles des familles de composants. Le modèle est agnostique, le
// rapport doit l'être aussi : on ne parle pas « d'extensions » à quelqu'un dont
// le site tourne sous Next.js.
const FAMILLES: Record<string, string> = {
  cms: "Gestionnaire de contenu",
  cms_plugin: "Extensions",
  cms_theme: "Thème",
  ecommerce: "Boutique",
  framework: "Socle technique",
  js_library: "Bibliothèques",
  runtime: "Exécution",
  server: "Serveur web",
  hosting: "Hébergement",
  cdn: "Réseau de diffusion",
  analytics: "Mesure d'audience",
  saas: "Services tiers",
};

const CONFIANCE: Record<string, string> = {
  high: "certain",
  medium: "probable",
  low: "indice faible",
};

// ── Cadence d'interrogation ────────────────────────────────────────────────
// Un intervalle fixe de 1,5 s coûtait une invocation serverless toutes les
// 1,5 s pendant toute l'attente : les logs de production du 2026-08-16 montrent
// une quarantaine d'appels sur `/api/sentinelle/scan/[id]` pour un seul scan,
// toujours en cours au bout de 70 secondes. On garde une cadence rapide au
// début — un scan qui répond vite doit s'afficher vite — puis on l'espace.
const DELAIS_MS = [1_500, 1_500, 2_000, 3_000, 5_000, 8_000] as const;
const DELAI_MAX_MS = 10_000;
// Au-delà, on cesse d'interroger : ce n'est plus une attente, c'est une panne.
// Sans cette borne, un onglet oublié sur un scan bloqué appelle l'API
// indéfiniment.
const ABANDON_MS = 120_000;

function delaiApres(tentative: number): number {
  return DELAIS_MS[tentative] ?? DELAI_MAX_MS;
}

interface Etat {
  status: "pending" | "running" | "done" | "failed";
  result: ScanResult | { error: string } | null;
  url: string;
  hasLead: boolean;
}

/**
 * Le nom de l'organisation pour le titre : celui que le site déclare
 * (données structurées, à défaut Open Graph), sinon son domaine.
 */
function nomOrganisation(etat: Etat | null): string | null {
  if (!etat) return null;
  if (estResultat(etat.result) && etat.result.site?.siteName)
    return etat.result.site.siteName;
  try {
    return new URL(etat.url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Le titre de la page : « Audit de Mastora ». */
function TitreAudit({ nom }: { nom: string | null }) {
  return (
    <h1 className="py-3 text-2xl font-light tracking-tight text-foreground md:text-3xl">
      {nom ? `Audit de ${nom}` : "Audit de votre site"}
    </h1>
  );
}

function estResultat(value: unknown): value is ScanResult {
  return typeof value === "object" && value !== null && "components" in value;
}

export function ScanReport({ scanId }: { scanId: string }) {
  const [etat, setEtat] = useState<Etat | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let vivant = true;
    let timer: ReturnType<typeof setTimeout>;
    let tentative = 0;
    const debut = Date.now();

    async function interroger() {
      try {
        const response = await fetch(`/api/sentinelle/scan/${scanId}`);
        if (!response.ok) {
          if (vivant) setErreur("Analyse introuvable.");
          return;
        }

        const payload: Etat = await response.json();
        if (!vivant) return;
        setEtat(payload);

        // On ne relance l'interrogation que tant qu'il y a quelque chose à
        // attendre : le scan lui-même, puis le diagnostic et l'aperçu de
        // veille, dont la rédaction se termine après l'affichage des composants.
        const attendreApercu =
          payload.status === "done" &&
          estResultat(payload.result) &&
          (payload.result.apercu?.status === "pending" ||
            payload.result.diagnostic?.status === "pending");
        if (
          payload.status !== "pending" &&
          payload.status !== "running" &&
          !attendreApercu
        )
          return;

        if (Date.now() - debut >= ABANDON_MS) {
          // Rapport affiché mais aperçu encore en rédaction : on cesse
          // d'interroger sans message d'erreur — il apparaîtra au rechargement.
          if (!attendreApercu) {
            setErreur(
              "L'analyse prend plus de temps que prévu. Rechargez la page dans " +
                "quelques minutes : le résultat s'affichera dès qu'il sera prêt.",
            );
          }
          return;
        }

        timer = setTimeout(interroger, delaiApres(tentative));
        tentative += 1;
      } catch {
        if (vivant) setErreur("Connexion interrompue.");
      }
    }

    interroger();
    return () => {
      vivant = false;
      clearTimeout(timer);
    };
  }, [scanId]);

  const titre = <TitreAudit nom={nomOrganisation(etat)} />;

  if (erreur) {
    return (
      <>
        {titre}
        <p className="font-inter-tight text-base text-mid-gray">{erreur}</p>
      </>
    );
  }

  if (!etat || etat.status === "pending" || etat.status === "running") {
    return (
      <>
        {titre}
        <div className="mt-6" aria-live="polite">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            Analyse en cours
          </p>
          <p className="mt-3 font-inter-tight text-base text-mid-gray">
            Lecture de la page d'accueil et des en-têtes. Quelques secondes.
          </p>
        </div>
      </>
    );
  }

  if (etat.status === "failed" || !estResultat(etat.result)) {
    const raison =
      etat.result && "error" in etat.result
        ? etat.result.error
        : "raison inconnue";
    return (
      <>
        {titre}
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            Analyse impossible
          </p>
          <p className="mt-3 font-inter-tight text-base text-mid-gray">
            Je n'ai pas pu analyser ce site : {raison}. Cela arrive quand un
            site bloque les robots ou répond trop lentement : ce n'est pas
            nécessairement un problème de votre côté.
          </p>
        </div>
      </>
    );
  }

  const resultat = etat.result;
  const parFamille = new Map<string, DetectedComponent[]>();
  for (const composant of resultat.components) {
    const liste = parFamille.get(composant.type) ?? [];
    liste.push(composant);
    parFamille.set(composant.type, liste);
  }

  return (
    <>
      {titre}
      <div className="mt-4">
        <GrilleDiagnostic
          diagnostic={resultat.diagnostic}
          resultat={resultat}
        />

        {/* Le détail technique, replié : le dirigeant lit la grille, le détail
          reste là pour qui veut vérifier (demande du 2026-09-27). */}
        <details className="group border-y border-dark-gray">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span>
              {resultat.components.length} composant
              {resultat.components.length > 1 ? "s" : ""} détecté
              {resultat.components.length > 1 ? "s" : ""} sur votre site
            </span>
            <span
              aria-hidden="true"
              className="transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <div className="pb-6">
            {resultat.components.length === 0 && (
              <p className="font-inter-tight text-base text-mid-gray">
                Aucun composant identifiable publiquement. C'est le cas des
                sites très épurés ou fortement protégés : la fiche se remplit
                alors avec vous.
              </p>
            )}

            <div className="space-y-8">
              {[...parFamille.entries()].map(([famille, composants]) => (
                <section key={famille}>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {FAMILLES[famille] ?? famille}
                  </h2>
                  <ul className="mt-3 divide-y divide-dark-gray border-y border-dark-gray">
                    {composants.map((composant) => (
                      <li
                        key={`${composant.type}:${composant.slug}`}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
                      >
                        <span className="font-inter-tight text-base text-foreground">
                          {composant.label}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                          {composant.version
                            ? `v${composant.version}`
                            : "version inconnue"}
                          {composant.version &&
                            composant.versionConfidence !== "high" &&
                            " · déduite"}
                          {" · "}
                          {CONFIANCE[composant.confidence]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-accent-secondary/60 pl-4">
              {resultat.notes.map((note) => (
                <p
                  key={note}
                  className="mb-3 font-inter-tight text-sm leading-relaxed text-mid-gray"
                >
                  {note}
                </p>
              ))}
            </div>
          </div>
        </details>

        <ApercuVeille scanId={scanId} apercu={resultat.apercu} />

        <InscriptionVeille
          scanId={scanId}
          siteUrl={resultat.url}
          dejaInscrit={etat.hasLead}
        />
      </div>
    </>
  );
}

// ── Grille de diagnostic ───────────────────────────────────────────────────
// Quatre cases de cinq lignes au plus, colorées par leur tonalité ; la
// conclusion prend la couleur de la suite retenue. La couleur n'est jamais le
// seul porteur du sens : chaque case écrit aussi sa tonalité en toutes lettres.

const TONALITES: Record<
  DiagnosticTonalite,
  { label: string; barre: string; fond: string; point: string }
> = {
  solide: {
    label: "Solide",
    barre: "border-t-emerald-400",
    fond: "bg-emerald-400/[0.06]",
    point: "bg-emerald-400",
  },
  a_renforcer: {
    label: "À renforcer",
    barre: "border-t-amber-400",
    fond: "bg-amber-400/[0.06]",
    point: "bg-amber-400",
  },
  fragile: {
    label: "Fragile",
    barre: "border-t-rose-400",
    fond: "bg-rose-400/[0.06]",
    point: "bg-rose-400",
  },
  indetermine: {
    label: "Peu observable",
    barre: "border-t-mid-gray",
    fond: "",
    point: "bg-mid-gray",
  },
};

// Les trois prestations du catalogue (lib/trajectoires.ts) : seul nom, nom
// technique en sous-titre, et page du pack pour qui veut vérifier. Liens en
// dur : Sentinelle n'importe pas le catalogue de la vitrine.
const PRESTATIONS: Record<
  DiagnosticIssue,
  { nom: string; technique: string; href: string }
> = {
  optimisation: {
    nom: "Optimisation",
    technique: "WordPress optimisé",
    href: "/packs/site-wordpress-ingerable",
  },
  refonte: {
    nom: "Refonte",
    technique: "WordPress headless",
    href: "/packs/site-wordpress-lent",
  },
  evolution: {
    nom: "Évolution",
    technique: "Web app ou plateforme",
    href: "/packs/site-outil-de-travail",
  },
};

/**
 * Le bouton chaud « Discutons de votre projet » réserve l'échange de 15 minutes
 * (ADR-022). Copie en dur de CTA_CHAUD / ECHANGE_URL de lib/visio-conseil.ts :
 * Sentinelle n'importe pas la vitrine (docs/sentinelle/CLAUDE.md, règle 2) :
 * si le lien change là-bas, il change ici aussi.
 */
const ECHANGE_URL =
  "https://calendly.com/agathe-next-impact/prise-de-contact-conseil";

/** Les autres offres, hors des trois prestations : une ligne discrète. */
const AUTRES_OFFRES = [
  {
    libelle: "Auditer",
    titre: "Audit + roadmap",
    href: "/conseil#architecture-projet-ia",
  },
  {
    libelle: "Maintenir",
    titre: "Suivi et maintenance",
    href: "/maintenance-wordpress",
  },
  {
    libelle: "Piloter",
    titre: "Expert technique externalisé",
    href: "/cto-externalise",
  },
];

// La recommandation prend la couleur de la réponse à « faut-il le faire ? ».
const BESOINS: Record<
  DiagnosticBesoin,
  { label: string; barre: string; fond: string; point: string; bord: string }
> = {
  necessaire: {
    label: "Nécessaire",
    barre: "border-t-accent-secondary",
    fond: "bg-accent-secondary/[0.07]",
    point: "bg-accent-secondary",
    bord: "border-accent-secondary",
  },
  utile: {
    label: "Utile",
    barre: "border-t-amber-400",
    fond: "bg-amber-400/[0.06]",
    point: "bg-amber-400",
    bord: "border-amber-400",
  },
  pas_prioritaire: {
    label: "Pas prioritaire",
    barre: "border-t-emerald-400",
    fond: "bg-emerald-400/[0.06]",
    point: "bg-emerald-400",
    bord: "border-emerald-400",
  },
};

function CaseDiagnostic({
  numero,
  titre,
  etiquette,
  barre,
  fond,
  point,
  lignes,
  children,
}: {
  numero: string;
  titre: string;
  etiquette: string;
  barre: string;
  fond: string;
  point: string;
  lignes: string[];
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`flex flex-col border border-dark-gray border-t-4 p-5 ${barre} ${fond}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {numero} · {titre}
        </h3>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${point}`}
          />
          {etiquette}
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {lignes.map((ligne) => (
          <li
            key={ligne}
            className="font-inter-tight text-sm leading-relaxed text-foreground"
          >
            {ligne}
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

interface LigneComparee {
  nom: string;
  url: string;
  plateforme: string;
  responseMs: number | null;
  htmlKo: number | null;
  scripts: number | null;
  tiers: number | null;
}

function hoteLisible(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Le site analysé et ses concurrents, mesurés de la même façon : c'est la
 * matière qui rend la grille lisible, on la montre avant les cases.
 */
function Comparatif({ lignes }: { lignes: LigneComparee[] }) {
  const cellule = "px-3 py-2 text-right tabular-nums";
  return (
    <div className="mt-4 overflow-x-auto border border-dark-gray">
      <table className="w-full min-w-[560px] border-collapse font-inter-tight text-sm">
        <caption className="sr-only">
          Votre site et les sites de vos concurrents, mesurés de la même façon
        </caption>
        <thead>
          <tr className="border-b border-dark-gray font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
            <th scope="col" className="px-3 py-2 text-left font-normal">
              Site
            </th>
            <th scope="col" className="px-3 py-2 text-left font-normal">
              Socle
            </th>
            <th scope="col" className="px-3 py-2 text-right font-normal">
              Réponse
            </th>
            <th scope="col" className="px-3 py-2 text-right font-normal">
              HTML
            </th>
            <th scope="col" className="px-3 py-2 text-right font-normal">
              Scripts
            </th>
            <th scope="col" className="px-3 py-2 text-right font-normal">
              Tiers
            </th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, index) => (
            <tr
              key={ligne.url}
              className={`border-b border-dark-gray last:border-b-0 ${index === 0 ? "bg-accent-secondary/[0.07]" : ""}`}
            >
              <th
                scope="row"
                className="px-3 py-2 text-left font-normal text-foreground"
              >
                {index === 0 ? (
                  <span>{ligne.nom}</span>
                ) : (
                  <a
                    href={ligne.url}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    {ligne.nom}
                  </a>
                )}
                <span className="block font-mono text-[11px] text-mid-gray">
                  {hoteLisible(ligne.url)}
                </span>
              </th>
              <td className="px-3 py-2 text-left text-mid-gray">
                {ligne.plateforme}
              </td>
              <td className={cellule}>
                {ligne.responseMs === null ? "–" : `${ligne.responseMs} ms`}
              </td>
              <td className={cellule}>
                {ligne.htmlKo === null ? "–" : `${ligne.htmlKo} Ko`}
              </td>
              <td className={cellule}>{ligne.scripts ?? "–"}</td>
              <td className={cellule}>{ligne.tiers ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TYPES_SOCLE = new Set(["cms", "ecommerce", "framework"]);

function GrilleDiagnostic({
  diagnostic,
  resultat,
}: {
  diagnostic?: ScanDiagnostic;
  resultat: ScanResult;
}) {
  if (!diagnostic || diagnostic.status === "none") return null;

  if (diagnostic.status === "pending") {
    return (
      <div className="mb-12" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          Diagnostic en cours de rédaction
        </p>
        <p className="mt-3 font-inter-tight text-base text-mid-gray">
          Une réponse à la seule question qui compte : faut-il investir dans
          votre site maintenant, dans quoi, et pour quel objectif ? Votre site
          est comparé à ceux de vos concurrents, analysés de la même façon.
          Comptez une à deux minutes.
        </p>
      </div>
    );
  }

  const { conclusion } = diagnostic;
  const pack = PRESTATIONS[conclusion.issue];
  const examens = diagnostic.examens ?? [];
  const besoin = BESOINS[conclusion.besoin];
  const cases = [
    {
      numero: "1",
      titre: "Votre marché et votre promesse",
      contenu: diagnostic.organisation,
    },
    {
      numero: "2",
      titre: "Face à vos concurrents",
      contenu: diagnostic.ecosysteme,
    },
    {
      numero: "3",
      titre: "Ce que votre site fait pour votre activité",
      contenu: diagnostic.dispositif,
    },
  ];

  const concurrents = diagnostic.concurrents ?? [];
  const site = resultat.site;
  const lignes: LigneComparee[] = [
    {
      nom: "Votre site",
      url: resultat.url,
      plateforme:
        resultat.components.find((c) => TYPES_SOCLE.has(c.type))?.label ??
        "Non reconnu",
      responseMs: site?.responseMs ?? null,
      htmlKo: site ? Math.round(site.htmlBytes / 1024) : null,
      scripts: site?.scriptCount ?? null,
      tiers: site?.thirdPartyHosts.length ?? null,
    },
    ...concurrents.map((c) => ({
      nom: c.nom,
      url: c.url,
      plateforme: c.composants[0] ?? "Non reconnu",
      responseMs: c.responseMs,
      htmlKo: c.htmlKo,
      scripts: c.scripts,
      tiers: c.domainesTiers,
    })),
  ];

  return (
    <section className="mb-14" aria-labelledby="diagnostic-titre">
      {/* Une ligne : de quoi et avec qui on compare. La cartouche suit aussitôt,
          pour tenir entière à l'écran dès l'ouverture de la page. */}
      <h2 id="diagnostic-titre" className="sr-only">
        Votre site vu par un client qui compare
      </h2>
      <p className="py-2 font-inter-tight text-sm leading-loose text-mid-gray">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
          Secteur{" "}
        </span>
        <span className="text-foreground">
          {diagnostic.secteur ?? "non établi par une source publique"}
        </span>
        <span aria-hidden="true"> · </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
          Comparé à{" "}
        </span>
        {concurrents.length === 0 ? (
          <span className="text-foreground">
            aucun concurrent identifiable depuis l'extérieur
          </span>
        ) : (
          concurrents.map((c, index) => (
            <span key={c.url}>
              {index > 0 && ", "}
              <a
                href={c.url}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="text-foreground underline underline-offset-4"
              >
                {c.nom}
              </a>
            </span>
          ))
        )}
      </p>

      {/* La cartouche : la réponse d'abord, puis l'examen des trois prestations
          qui la justifie. C'est la question que se pose le dirigeant. */}
      <div className="mt-6 border border-dark-gray">
        <div className={`border-l-4 px-5 py-4 ${besoin.bord} ${besoin.fond}`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
            Ma réponse
          </p>
          <p className="mt-2 font-inter-tight text-2xl font-light tracking-tight text-foreground">
            {pack.nom} : {besoin.label.toLowerCase()}
          </p>
          <p className="mt-2 font-inter-tight text-base text-foreground">
            <span className="text-mid-gray">Objectif : </span>
            {conclusion.objectif}
          </p>
          {/* Deux boutons, deux températures (charte §7) : le rendez-vous, avec
              le libellé chaud fixe, puis l'offre pour qui veut vérifier. */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={ECHANGE_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
            >
              Discutons de votre projet
            </a>
            <a
              href={pack.href}
              className="inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent-secondary"
            >
              Voir l'offre {pack.nom}
            </a>
          </div>
        </div>

        {examens.length > 0 && (
          <div className="grid border-t border-dark-gray md:grid-cols-3">
            {examens.map((examen) => {
              const prestation = PRESTATIONS[examen.prestation];
              const degre = BESOINS[examen.besoin];
              const retenue = examen.prestation === conclusion.issue;
              return (
                <section
                  key={examen.prestation}
                  aria-label={`${prestation.nom} : ${degre.label}`}
                  className={`flex flex-col border-dark-gray px-5 py-4 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0 ${
                    retenue ? degre.fond : ""
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="font-inter-tight text-lg font-light tracking-tight text-foreground">
                      <a
                        href={prestation.href}
                        className="hover:text-accent-secondary"
                      >
                        {prestation.nom}
                      </a>
                    </h3>
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${degre.point}`}
                      />
                      {degre.label}
                    </span>
                  </div>
                  <p className="font-inter-tight text-sm text-mid-gray">
                    {prestation.technique}
                  </p>
                  <dl className="mt-3 space-y-2 font-inter-tight text-sm leading-relaxed text-foreground">
                    <div>
                      <dt className="inline text-mid-gray">Stratégique : </dt>
                      <dd className="inline">{examen.strategique}</dd>
                    </div>
                    <div>
                      <dt className="inline text-mid-gray">Commercial : </dt>
                      <dd className="inline">{examen.commercial}</dd>
                    </div>
                  </dl>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Ligne discrète : les offres qui ne sont pas des prestations. */}
      <p className="mt-3 font-inter-tight text-sm text-mid-gray">
        Autres besoins :{" "}
        {AUTRES_OFFRES.map((offre, index) => (
          <span key={offre.href}>
            {index > 0 && " · "}
            <a
              href={offre.href}
              title={offre.titre}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {offre.libelle}
            </a>
          </span>
        ))}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cases.map(({ numero, titre, contenu }) => {
          const ton = TONALITES[contenu.tonalite];
          return (
            <CaseDiagnostic
              key={numero}
              numero={numero}
              titre={titre}
              etiquette={ton.label}
              barre={ton.barre}
              fond={ton.fond}
              point={ton.point}
              lignes={contenu.lignes}
            />
          );
        })}
        <CaseDiagnostic
          numero="4"
          titre={`Ma recommandation : ${pack.nom}`}
          etiquette={besoin.label}
          barre={besoin.barre}
          fond={besoin.fond}
          point={besoin.point}
          lignes={conclusion.lignes}
        />
      </div>

      <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
        Diagnostic généré automatiquement à partir de cette analyse externe
        {diagnostic.sources.length > 0 ? " et de recherches publiques" : ""},
        non relu. Il ne voit ni vos chiffres, ni vos objectifs, ni votre
        organisation interne : c'est un premier regard, pas un audit.
      </p>

      <details className="mt-3">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          Le détail : mesures comparées et sources
        </summary>
        {concurrents.length > 0 && <Comparatif lignes={lignes} />}
        {diagnostic.sources.length > 0 && (
          <ul className="mt-4 space-y-1">
            {diagnostic.sources.map((source) => (
              <li
                key={source}
                className="break-all font-inter-tight text-sm text-mid-gray"
              >
                <a
                  href={source}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="underline"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        )}
      </details>
    </section>
  );
}

/**
 * La lettre-échantillon — l'échantillon de la lettre personnalisée de
 * l'abonnement, rédigé à partir de ce scan et des faits déjà collectés, et
 * affiché **telle qu'un abonné la recevrait** : l'iframe charge le rendu réel
 * du gabarit e-mail (même mécanique que la relecture des numéros en admin).
 * Absent ou en échec : la section disparaît, le rapport reste complet.
 */
function ApercuVeille({
  scanId,
  apercu,
}: {
  scanId: string;
  apercu?: ScanApercu;
}) {
  if (!apercu || apercu.status === "none") return null;

  if (apercu.status === "pending") {
    return (
      <div className="mt-12" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          Votre lettre de veille en cours de rédaction
        </p>
        <p className="mt-3 font-inter-tight text-base text-mid-gray">
          La lettre croise les composants de votre site avec l'actualité de la
          semaine écoulée, recherche comprise, comme pour un numéro d'abonné.
          Comptez quelques minutes. Laissez votre adresse ci-dessous : elle vous
          sera envoyée dès qu'elle est prête, sans garder cette page ouverte.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        Votre lettre de veille · échantillon
      </p>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        Un numéro rédigé comme pour un abonné : les composants détectés sur
        votre site, croisés avec l'actualité de la semaine écoulée, présentés
        tels que vous les recevriez par e-mail.
      </p>

      <iframe
        title="Votre lettre de veille · échantillon"
        src={`/api/sentinelle/scan/${scanId}/lettre`}
        sandbox=""
        className="mt-6 h-[820px] w-full border border-dark-gray bg-obsidian"
      />

      <p className="mt-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
        Échantillon généré automatiquement à partir de cette analyse externe et
        des faits déjà collectés,{" "}
        <strong className="font-regular text-foreground">non relu</strong>. La
        lettre de l'abonnement va plus loin (douze axes, actualité de la
        période, échéancier) et chaque numéro est relu par un humain avant
        envoi.
      </p>
    </section>
  );
}

/**
 * L'inscription à Sentinelle : un opt-in, pas un paiement (2026-09-27). La
 * demande attend la validation d'Agathe, qui ouvre alors l'espace ; la
 * facturation se fait à part. Consentement explicite, case non cochée.
 */
function InscriptionVeille({
  scanId,
  siteUrl,
  dejaInscrit,
}: {
  scanId: string;
  siteUrl: string;
  dejaInscrit: boolean;
}) {
  const [champs, setChamps] = useState({
    email: "",
    nom: "",
    organisation: "",
    url: siteUrl,
  });
  const [consentement, setConsentement] = useState(false);
  const [envoye, setEnvoye] = useState(dejaInscrit);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const champ =
    (nom: keyof typeof champs) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setChamps((actuels) => ({ ...actuels, [nom]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErreur(null);
    setEnCours(true);

    try {
      const response = await fetch(`/api/sentinelle/scan/${scanId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...champs, consentement }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setErreur(payload.error ?? "Envoi impossible.");
        return;
      }
      setEnvoye(true);
    } catch {
      setErreur("Connexion interrompue.");
    } finally {
      setEnCours(false);
    }
  }

  const libelle =
    "font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray";
  const saisie =
    "mt-2 w-full min-w-0 border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground placeholder:text-mid-gray/60 focus:border-accent-secondary focus:outline-none";

  return (
    <section
      className="mt-12 border border-dark-gray p-6"
      aria-labelledby="veille-titre"
    >
      <h2
        id="veille-titre"
        className="text-xl font-light tracking-tight text-foreground"
      >
        S'inscrire à la veille de votre site
      </h2>

      {envoye ? (
        <p className="mt-3 font-inter-tight text-base text-foreground">
          C'est noté. Je valide votre inscription et je reviens vers vous à
          l'adresse indiquée. À l'activation, un e-mail vous ouvre votre espace,
          amorcé avec cette analyse.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-3">
          <p className="font-inter-tight text-base text-mid-gray">
            Sentinelle : deux lettres par mois sur votre site, relues par moi, et
            une alerte quand une faille le concerne. {OFFER_PRICE_LABEL}, facturés
            à part, sans engagement. Laissez vos coordonnées : je valide votre
            inscription et je vous ouvre votre espace.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={libelle}>Nom</span>
              <input
                required
                autoComplete="name"
                maxLength={200}
                value={champs.nom}
                onChange={champ("nom")}
                className={saisie}
              />
            </label>
            <label className="block">
              <span className={libelle}>Organisation</span>
              <input
                required
                autoComplete="organization"
                maxLength={200}
                value={champs.organisation}
                onChange={champ("organisation")}
                className={saisie}
              />
            </label>
            <label className="block">
              <span className={libelle}>E-mail</span>
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.fr"
                maxLength={320}
                value={champs.email}
                onChange={champ("email")}
                className={saisie}
              />
            </label>
            <label className="block">
              <span className={libelle}>Adresse du site</span>
              <input
                required
                type="url"
                autoComplete="url"
                maxLength={2048}
                value={champs.url}
                onChange={champ("url")}
                className={saisie}
              />
            </label>
          </div>

          <label className="mt-5 flex items-start gap-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
            <input
              type="checkbox"
              required
              checked={consentement}
              onChange={(event) => setConsentement(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--accent-2))]"
            />
            <span>
              J'accepte d'être recontacté par Next Impact au sujet de mon
              inscription à Sentinelle. Vos coordonnées ne servent qu'à cela.
              Conservation et droits :{" "}
              <a href="/confidentialite" className="underline">
                politique de confidentialité
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={enCours}
            className="mt-5 inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {enCours ? "Envoi…" : "Demander mon inscription"}
          </button>

          {erreur && (
            <p
              role="alert"
              className="mt-3 font-inter-tight text-sm text-accent-secondary"
            >
              {erreur}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
