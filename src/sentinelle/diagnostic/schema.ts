import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux formes du diagnostic : les faits collectés, puis la grille.
//
// Même approche que lettre/schema.ts : le JSON Schema contraint la sortie du
// modèle (JSON valide par construction), zod vérifie que contrat et code n'ont
// pas divergé. Ce que le schéma ne garantit pas — cinq lignes au plus, pas de
// tiret cadratin, des sources réellement obtenues — est vérifié dans guards.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const RUBRIQUES = ["organisation", "ecosysteme"] as const;
export const TONALITES = ["solide", "a_renforcer", "fragile", "indetermine"] as const;
/** Les trois prestations du catalogue, dans son ordre, sous leur seul nom. */
export const ISSUES = ["optimisation", "refonte", "evolution"] as const;
/** La réponse à la question du dirigeant : faut-il le faire ? */
export const BESOINS = ["necessaire", "utile", "pas_prioritaire"] as const;
/** L'objectif se lit d'un coup d'œil : une phrase courte. */
export const MAX_OBJECTIF = 140;

/**
 * Deux phrases de vingt mots au plus par carte (demande d'Agathe du
 * 2026-09-27) : la grille se lit en trente secondes. La garde les tient.
 */
export const MAX_LIGNES = 2;
export const MAX_MOTS = 20;
/**
 * Filet de sécurité, pas cible : le prompt demande 160 caractères, le modèle
 * les dépasse parfois quand il cite des chiffres de concurrents. Couper à 180
 * tronquait une ligne sur deux (test mastora.fr du 2026-09-27).
 */
export const MAX_CARACTERES = 240;
/** Un secteur se nomme en quelques mots, pas en une phrase. */
export const MAX_SECTEUR = 90;
/** Plafond de faits : la collecte est courte, la grille aussi. */
export const MAX_FAITS = 10;
/** Concurrents analysés : assez pour comparer, peu pour rester poli. */
export const MAX_CONCURRENTS = 4;

// ─── Faits (passe 1) ──────────────────────────────────────────────────────

export const FaitsSchema = z.object({
  secteur: z.object({
    libelle: z.string().max(200),
    source: z.string().max(2048),
  }),
  concurrents: z.array(
    z.object({
      nom: z.string().min(1).max(200),
      site: z.string().min(1).max(2048),
      motif: z.string().max(400),
      source: z.string().min(1).max(2048),
    }),
  ),
  faits: z.array(
    z.object({
      rubrique: z.enum(RUBRIQUES),
      enonce: z.string().min(1).max(400),
      source: z.string().min(1).max(2048),
    }),
  ),
});

export type Faits = z.infer<typeof FaitsSchema>;
export type Fait = Faits["faits"][number];
export type ConcurrentCollecte = Faits["concurrents"][number];

export const FAITS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["secteur", "concurrents", "faits"],
  properties: {
    secteur: {
      type: "object",
      additionalProperties: false,
      required: ["libelle", "source"],
      properties: {
        libelle: {
          type: "string",
          description:
            "Le secteur d'activité en 8 mots au plus, précis : « écoles de vente en alternance », pas « formation ».",
        },
        source: { type: "string", description: "URL qui l'établit : résultat obtenu ou page du site." },
      },
    },
    concurrents: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["nom", "site", "motif", "source"],
        properties: {
          nom: { type: "string" },
          site: { type: "string", description: "Adresse du site web du concurrent (page d'accueil)." },
          motif: { type: "string", description: "Pourquoi c'est un concurrent direct, en une phrase." },
          source: { type: "string", description: "URL du résultat de recherche où il est apparu." },
        },
      },
    },
    faits: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["rubrique", "enonce", "source"],
        properties: {
          rubrique: { type: "string", enum: [...RUBRIQUES] },
          enonce: { type: "string", description: "Le fait, en une phrase." },
          source: {
            type: "string",
            description: "URL d'un résultat de recherche réellement obtenu.",
          },
        },
      },
    },
  },
} as const;

// ─── Grille (passe 2) ─────────────────────────────────────────────────────

const Lignes = z.array(z.string().min(1)).min(1);

const Case = z.object({ tonalite: z.enum(TONALITES), lignes: Lignes });

export const GrilleSchema = z.object({
  organisation: Case,
  ecosysteme: Case,
  dispositif: Case,
  conclusion: z.object({
    issue: z.enum(ISSUES),
    besoin: z.enum(BESOINS),
    objectif: z.string().min(1),
    lignes: Lignes,
  }),
  examens: z.array(
    z.object({
      prestation: z.enum(ISSUES),
      besoin: z.enum(BESOINS),
      strategique: z.string().min(1),
      commercial: z.string().min(1),
    }),
  ),
});

export type Grille = z.infer<typeof GrilleSchema>;

// Pas de `maxItems` : la sortie structurée le refuse (400, constaté le
// 2026-09-27). Les cinq lignes sont tenues par `bornerGrille()` et le prompt.
const lignesJson = {
  type: "array",
  minItems: 1,
  items: { type: "string" },
} as const;

const caseJson = {
  type: "object",
  additionalProperties: false,
  required: ["tonalite", "lignes"],
  properties: {
    tonalite: { type: "string", enum: [...TONALITES] },
    lignes: lignesJson,
  },
} as const;

export const GRILLE_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["organisation", "ecosysteme", "dispositif", "conclusion", "examens"],
  properties: {
    organisation: caseJson,
    ecosysteme: caseJson,
    dispositif: caseJson,
    conclusion: {
      type: "object",
      additionalProperties: false,
      required: ["issue", "besoin", "objectif", "lignes"],
      properties: {
        issue: { type: "string", enum: [...ISSUES] },
        besoin: { type: "string", enum: [...BESOINS] },
        objectif: {
          type: "string",
          description: "L'objectif business que la prestation sert, en une phrase courte.",
        },
        lignes: lignesJson,
      },
    },
    examens: {
      type: "array",
      description: "Les trois prestations, une entrée chacune : optimisation, refonte, evolution.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["prestation", "besoin", "strategique", "commercial"],
        properties: {
          prestation: { type: "string", enum: [...ISSUES] },
          besoin: { type: "string", enum: [...BESOINS] },
          strategique: { type: "string", description: "Objectif stratégique servi, 20 mots au plus." },
          commercial: { type: "string", description: "Objectif commercial servi, 20 mots au plus." },
        },
      },
    },
  },
} as const;
