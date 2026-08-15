import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux formes que traverse un numéro : le dossier, puis la lettre.
//
// Le découpage est la garantie du produit. La passe de collecte a des outils
// (recherche et lecture web) mais n'écrit pas ; la passe de rédaction écrit mais
// n'a aucun outil. Entre les deux, du code vérifie que chaque fait porte sa date
// et sa source — ce qui n'a pas franchi cette frontière ne peut pas être affirmé
// dans la lettre.
//
// Deux schémas par forme : un JSON Schema pour contraindre la sortie du modèle
// (le JSON est alors valide par construction) et un schéma zod pour vérifier que
// le contrat et le code n'ont pas divergé. Les contraintes que la sortie
// structurée ne sait pas exprimer — « exactement douze axes », « trois actions au
// plus » — sont vérifiées côté code, dans `guards.ts`.
// ─────────────────────────────────────────────────────────────────────────────

/** Statut d'une observation. C'est lui qui décide de la façon dont elle s'écrit. */
export const OBSERVATION_STATUSES = ["constate", "hypothese", "nonObservable"] as const;

/** Statut conclusif d'un axe. */
export const AXIS_STATUSES = ["agir", "surveiller", "nonConcerne"] as const;

export const TREND_DIRECTIONS = ["opportunite", "menace", "les-deux"] as const;

export const MARKET_TRAJECTORIES = ["hausse", "stable", "baisse", "incertain"] as const;

/** Les douze axes, dans l'ordre. La liste fait foi : le prompt la reprend. */
export const AXES = [
  "Socle technique et architecture",
  "Sécurité et maintenance",
  "Hébergement, infrastructure et souveraineté",
  "Visibilité, recherche et acquisition",
  "IA intégrée au projet",
  "Réglementaire et conformité",
  "Données, mesure et consentement",
  "Expérience, performance et accessibilité",
  "Contenu, éditorial et confiance",
  "Coûts, prestataires et marché",
  "Dépendance fournisseur et réversibilité",
  "Gouvernance du projet et contractuel",
] as const;

// ─── Dossier (passe 1) ────────────────────────────────────────────────────

const str = { type: "string" } as const;
const strArray = { type: "array", items: str } as const;

function object<T extends Record<string, unknown>>(properties: T, required: Array<keyof T>) {
  return {
    type: "object",
    properties,
    required: required as string[],
    additionalProperties: false,
  } as const;
}

function arrayOf(items: unknown) {
  return { type: "array", items } as const;
}

export const DOSSIER_JSON_SCHEMA = object(
  {
    faits: arrayOf(
      object(
        {
          enonce: { type: "string", description: "Le fait, en une phrase." },
          date: { type: "string", description: "Date du fait, au format AAAA-MM-JJ si connue." },
          source: { type: "string", description: "URL de la source primaire, ouverte et lue." },
          chiffre: { type: "string", description: "Le chiffre s'il y en a un, sinon vide." },
          perimetre: { type: "string", description: "Ce que le chiffre couvre exactement." },
          echeance: { type: "string", description: "Date d'application, sinon vide." },
          famille: { type: "string", description: "Famille de solutions concernée." },
          toucheFiche: {
            ...strArray,
            description: "Composants de la fiche du client que ce fait touche.",
          },
        },
        ["enonce", "date", "source", "chiffre", "perimetre", "echeance", "famille", "toucheFiche"],
      ),
    ),
    observations: arrayOf(
      object(
        {
          sujet: str,
          constat: str,
          statut: { type: "string", enum: [...OBSERVATION_STATUSES] },
          page: { type: "string", description: "URL de la page qui fonde le constat." },
        },
        ["sujet", "constat", "statut", "page"],
      ),
    ),
    publics: arrayOf(
      object(
        {
          nom: str,
          cherche: str,
          attenduDuSite: str,
          niveauDeReponse: str,
        },
        ["nom", "cherche", "attenduDuSite", "niveauDeReponse"],
      ),
    ),
    aConfirmer: arrayOf(
      object({ point: str, sourceAVerifier: str }, ["point", "sourceAVerifier"]),
    ),
    pagesAnalysees: strArray,
    pagesNonAnalysees: arrayOf(object({ url: str, raison: str }, ["url", "raison"])),
    siteInjoignable: {
      type: "string",
      description: "Raison, ou chaîne vide si le site a répondu.",
    },
    notesDeProduction: str,
  },
  [
    "faits",
    "observations",
    "publics",
    "aConfirmer",
    "pagesAnalysees",
    "pagesNonAnalysees",
    "siteInjoignable",
    "notesDeProduction",
  ],
);

export const FaitSchema = z.object({
  enonce: z.string(),
  date: z.string(),
  source: z.string(),
  chiffre: z.string(),
  perimetre: z.string(),
  echeance: z.string(),
  famille: z.string(),
  toucheFiche: z.array(z.string()),
});

export const DossierSchema = z.object({
  faits: z.array(FaitSchema),
  observations: z.array(
    z.object({
      sujet: z.string(),
      constat: z.string(),
      statut: z.enum(OBSERVATION_STATUSES),
      page: z.string(),
    }),
  ),
  publics: z.array(
    z.object({
      nom: z.string(),
      cherche: z.string(),
      attenduDuSite: z.string(),
      niveauDeReponse: z.string(),
    }),
  ),
  aConfirmer: z.array(z.object({ point: z.string(), sourceAVerifier: z.string() })),
  pagesAnalysees: z.array(z.string()),
  pagesNonAnalysees: z.array(z.object({ url: z.string(), raison: z.string() })),
  siteInjoignable: z.string(),
  notesDeProduction: z.string(),
});

export type Fait = z.infer<typeof FaitSchema>;
export type Dossier = z.infer<typeof DossierSchema>;

// ─── Lettre (passe 2) ─────────────────────────────────────────────────────

// La lettre se demande en **trois appels**, pas en un.
//
// Constaté en réel le 2026-08-15 : le schéma complet fait répondre 400 à l'API —
// « The compiled grammar is too large ». La sortie structurée compile le schéma
// en grammaire, et celle d'une lettre à douze axes, quatre blocs de tendances et
// une synthèse en six parties dépasse ce que le compilateur accepte.
//
// Le découpage suit les étapes du prompt (3, 4, 5) plutôt qu'une coupe
// arbitraire, et il a un effet de bord utile : chaque appel a sa propre marge de
// `max_tokens`, là où une lettre entière en un jet frôlait le plafond.

/** Étape 3 — l'ouverture et les douze axes. */
export const LETTRE_AXES_SCHEMA = object(
  {
    titre: str,
    ligneContexte: str,
    chapeau: str,
    siteEnUnePhrase: str,
    axes: arrayOf(
      object(
        {
          numero: { type: "integer", description: "Numéro de l'axe, de 1 à 12." },
          nom: str,
          question: { type: "string", description: "La question du client, en exergue." },
          analyse: { type: "string", description: "Le croisement constat × faits datés." },
          statut: { type: "string", enum: [...AXIS_STATUSES] },
          horizon: {
            type: "string",
            description:
              "Horizon d'action, échéance de réexamen, ou raison du « non concerné ».",
          },
        },
        ["numero", "nom", "question", "analyse", "statut", "horizon"],
      ),
    ),
  },
  ["titre", "ligneContexte", "chapeau", "siteEnUnePhrase", "axes"],
);

/** Étape 4 — les tendances, qualifiées pour ce site. */
export const LETTRE_TENDANCES_SCHEMA = object(
  {
    tendances: object(
      {
        duMois: arrayOf(
          object(
            {
              tendance: str,
              faitDate: str,
              sens: { type: "string", enum: [...TREND_DIRECTIONS] },
              pourCeSite: str,
            },
            ["tendance", "faitDate", "sens", "pourCeSite"],
          ),
        ),
        marche: arrayOf(
          object(
            {
              famille: str,
              mouvement: str,
              trajectoire: { type: "string", enum: [...MARKET_TRAJECTORIES] },
              lecture: str,
            },
            ["famille", "mouvement", "trajectoire", "lecture"],
          ),
        ),
        signauxDeDemande: strArray,
        deFond: arrayOf(
          object({ mouvement: str, faitDate: str, qualification: str }, [
            "mouvement",
            "faitDate",
            "qualification",
          ]),
        ),
        ceQuiNeChangePas: strArray,
      },
      ["duMois", "marche", "signauxDeDemande", "deFond", "ceQuiNeChangePas"],
    ),
  },
  ["tendances"],
);

/** Étape 5 — la synthèse, l'échéancier, les questions et les sources. */
export const LETTRE_SYNTHESE_SCHEMA = object(
  {
    synthese: object(
      {
        actions: arrayOf(
          object({ action: str, horizon: str, pourquoi: str }, ["action", "horizon", "pourquoi"]),
        ),
        reste: { type: "string", description: "Le reste, en une phrase." },
        scenarios: arrayOf(
          object(
            {
              nom: str,
              commandePar: str,
              faitsDeMarche: str,
              axesCouverts: str,
              ordreDeCout: str,
              retourAttendu: str,
              conditionDeDeclenchement: str,
            },
            [
              "nom",
              "commandePar",
              "faitsDeMarche",
              "axesCouverts",
              "ordreDeCout",
              "retourAttendu",
              "conditionDeDeclenchement",
            ],
          ),
        ),
        aDifferer: arrayOf(object({ choix: str, raison: str }, ["choix", "raison"])),
        budget: object(
          {
            coutTroisACinqAns: str,
            indicateurs: strArray,
            pointDEquilibre: str,
            siPasDeChiffres: str,
          },
          ["coutTroisACinqAns", "indicateurs", "pointDEquilibre", "siPasDeChiffres"],
        ),
        commentDecider: arrayOf(
          object({ entree: str, ceQuElleTeste: str, date: str }, [
            "entree",
            "ceQuElleTeste",
            "date",
          ]),
        ),
      },
      ["actions", "reste", "scenarios", "aDifferer", "budget", "commentDecider"],
    ),
    echeancier: arrayOf(
      object({ date: str, echeance: str, axe: { type: "integer" } }, ["date", "echeance", "axe"]),
    ),
    questions: arrayOf(
      object({ question: str, axes: { type: "array", items: { type: "integer" } } }, [
        "question",
        "axes",
      ]),
    ),
    sources: arrayOf(
      object(
        {
          theme: str,
          faits: arrayOf(
            object({ enonce: str, date: str, source: str }, ["enonce", "date", "source"]),
          ),
        },
        ["theme", "faits"],
      ),
    ),
    ligneCloture: str,
    notesDeProduction: {
      type: "string",
      description: "Jamais envoyé au client. Lu par la personne qui relit.",
    },
  },
  ["synthese", "echeancier", "questions", "sources", "ligneCloture", "notesDeProduction"],
);

// Les trois morceaux, dans l'ordre des appels. Le type de chaque partie se
// dérive du schéma zod complet : une divergence entre les deux serait une erreur
// de compilation, pas une surprise à l'exécution.
export const LETTRE_PARTS = [
  { key: "axes", schema: LETTRE_AXES_SCHEMA },
  { key: "tendances", schema: LETTRE_TENDANCES_SCHEMA },
  { key: "synthese", schema: LETTRE_SYNTHESE_SCHEMA },
] as const;

export const LettreSchema = z.object({
  titre: z.string(),
  ligneContexte: z.string(),
  chapeau: z.string(),
  siteEnUnePhrase: z.string(),
  axes: z.array(
    z.object({
      numero: z.number().int(),
      nom: z.string(),
      question: z.string(),
      analyse: z.string(),
      statut: z.enum(AXIS_STATUSES),
      horizon: z.string(),
    }),
  ),
  tendances: z.object({
    duMois: z.array(
      z.object({
        tendance: z.string(),
        faitDate: z.string(),
        sens: z.enum(TREND_DIRECTIONS),
        pourCeSite: z.string(),
      }),
    ),
    marche: z.array(
      z.object({
        famille: z.string(),
        mouvement: z.string(),
        trajectoire: z.enum(MARKET_TRAJECTORIES),
        lecture: z.string(),
      }),
    ),
    signauxDeDemande: z.array(z.string()),
    deFond: z.array(
      z.object({ mouvement: z.string(), faitDate: z.string(), qualification: z.string() }),
    ),
    ceQuiNeChangePas: z.array(z.string()),
  }),
  synthese: z.object({
    actions: z.array(
      z.object({ action: z.string(), horizon: z.string(), pourquoi: z.string() }),
    ),
    reste: z.string(),
    scenarios: z.array(
      z.object({
        nom: z.string(),
        commandePar: z.string(),
        faitsDeMarche: z.string(),
        axesCouverts: z.string(),
        ordreDeCout: z.string(),
        retourAttendu: z.string(),
        conditionDeDeclenchement: z.string(),
      }),
    ),
    aDifferer: z.array(z.object({ choix: z.string(), raison: z.string() })),
    budget: z.object({
      coutTroisACinqAns: z.string(),
      indicateurs: z.array(z.string()),
      pointDEquilibre: z.string(),
      siPasDeChiffres: z.string(),
    }),
    commentDecider: z.array(
      z.object({ entree: z.string(), ceQuElleTeste: z.string(), date: z.string() }),
    ),
  }),
  echeancier: z.array(
    z.object({ date: z.string(), echeance: z.string(), axe: z.number().int() }),
  ),
  questions: z.array(z.object({ question: z.string(), axes: z.array(z.number().int()) })),
  sources: z.array(
    z.object({
      theme: z.string(),
      faits: z.array(z.object({ enonce: z.string(), date: z.string(), source: z.string() })),
    }),
  ),
  ligneCloture: z.string(),
  notesDeProduction: z.string(),
});

export type Lettre = z.infer<typeof LettreSchema>;
export type Axe = Lettre["axes"][number];
export type Scenario = Lettre["synthese"]["scenarios"][number];
