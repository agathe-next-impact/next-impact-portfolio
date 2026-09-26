import type { Block, Span } from "../notion/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// La structure d'une lettre générale ou sectorielle, lue dans son corps.
//
// Les lettres de l'atelier suivent un gabarit éditorial fixe (directives v3.2) :
// une lecture du mois avec le tour des douze axes, des actions sur l'existant,
// les solutions de refonte et de création, le marché, un échéancier et les
// questions au prestataire. Ce gabarit n'est écrit NULLE PART en colonnes : il
// vit dans les titres et les attaques en gras du texte.
//
// Ce module le retrouve, pour que la page puisse le montrer en grille (niveaux
// de pression, urgences, frise des échéances) au lieu d'un long texte continu.
// Il ne devine rien qu'il ne puisse vérifier : une section dont la forme ne
// correspond pas redevient de la prose, et une lettre sans aucune section
// reconnue garde son rendu linéaire (`structureLettre` renvoie null).
// ─────────────────────────────────────────────────────────────────────────────

/** Le niveau de pression d'un axe, tel que la phrase d'attaque le qualifie. */
export type Pression = "hausse" | "surveiller" | "stable" | "baisse" | "inconnue";

export interface Axe {
  numero: number;
  nom: string;
  pression: Pression;
  /** La première phrase : le verdict. */
  verdict: string;
  /** Le reste du paragraphe. */
  detail: Span[];
}

/** Quand agir, d'après l'attaque « À faire … ». */
export type Urgence = "semaine" | "mois" | "plus-tard";

export interface Action {
  numero: number;
  titre: string;
  periode: string | null;
  sources: string[];
  /** Les numéros d'axes cités par la ligne de repères (« axes 4 et 7 »). */
  axes: number[];
  urgence: Urgence;
  /** « Cette semaine », « Ce mois-ci »… */
  echeance: string | null;
  aFaire: Span[] | null;
  /** Les autres rubriques : « Ce qui s'est passé », « Ce que ça change »… */
  contexte: { titre: string; texte: Span[] }[];
}

export interface Carte {
  titre: string;
  texte: Span[];
}

export interface Echeance {
  /** « Au 1er septembre », « Les 14 et 15 septembre »… */
  libelle: string;
  date: Date | null;
  texte: Span[];
}

export type Section =
  | { kind: "prose"; titre: Span[] | null; blocs: Block[] }
  | { kind: "axes"; titre: Span[]; axes: Axe[] }
  | { kind: "actions"; titre: Span[]; actions: Action[]; blocs: Block[] }
  | { kind: "options"; titre: Span[]; options: Carte[]; blocs: Block[] }
  | { kind: "cartes"; titre: Span[]; cartes: Carte[]; blocs: Block[] }
  | { kind: "echeancier"; titre: Span[]; echeances: Echeance[]; blocs: Block[] }
  | { kind: "questions"; titre: Span[]; questions: Span[][]; blocs: Block[] };

export interface LettreStructuree {
  /** Ce qui précède la première section (accroche). */
  intro: Block[];
  sections: Section[];
}

// ─── Outils ──────────────────────────────────────────────────────────────────

export function texteDe(spans: Span[]): string {
  return spans.map((span) => span.t).join("");
}

function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .trim();
}

/**
 * L'attaque en gras d'un paragraphe (« **Ce qui s'est passé.** Le 6 août… »),
 * sans son point final, et le texte qui suit. null si le paragraphe ne commence
 * pas par du gras.
 */
export function attaque(spans: Span[]): { titre: string; reste: Span[] } | null {
  const premier = spans.findIndex((span) => span.t.trim() !== "");
  if (premier < 0 || !spans[premier].b) return null;

  let fin = premier;
  while (fin + 1 < spans.length && spans[fin + 1].b) fin++;

  const titre = texteDe(spans.slice(premier, fin + 1))
    .trim()
    .replace(/[.:]\s*$/, "")
    .trim();
  if (!titre) return null;

  const reste = spans.slice(fin + 1).map((span) => ({ ...span }));
  if (reste[0]) reste[0].t = reste[0].t.replace(/^[\s.:]+/, "");
  return { titre, reste: reste.filter((span) => span.t !== "") };
}

/** Coupe des spans après la première phrase. */
function premierePhrase(spans: Span[]): { phrase: string; reste: Span[] } {
  const texte = texteDe(spans);
  const match = /^(.+?[.!?])(\s+|$)/.exec(texte);
  if (!match) return { phrase: texte.trim(), reste: [] };

  let aCouper = match[0].length;
  const reste: Span[] = [];
  for (const span of spans) {
    if (aCouper >= span.t.length) {
      aCouper -= span.t.length;
      continue;
    }
    reste.push({ ...span, t: span.t.slice(aCouper) });
    aCouper = 0;
  }
  return { phrase: match[1].trim(), reste };
}

// ─── Pression des axes ───────────────────────────────────────────────────────

/** Le niveau de pression d'une phrase-verdict. L'ordre des tests compte. */
export function pressionDe(verdict: string): Pression {
  const v = normaliser(verdict);
  if (/\b(en baisse|recule|se detend|retombe|s'apaise|diminue)\b/.test(v)) return "baisse";
  if (/\b(en hausse|monte|se tend|s'intensifie|augmente|s'accelere|forte pression)\b/.test(v))
    return "hausse";
  if (/\b(surveiller|vigilance|a suivre)\b/.test(v)) return "surveiller";
  if (/\b(stable|calme|inchange)/.test(v)) return "stable";
  return "inconnue";
}

function lireAxes(blocs: Block[]): Axe[] | null {
  const axes: Axe[] = [];
  for (const bloc of blocs) {
    if (bloc.k !== "p") return null;
    const a = attaque(bloc.s);
    if (!a) return null;
    const { phrase, reste } = premierePhrase(a.reste);
    axes.push({
      numero: axes.length + 1,
      nom: a.titre,
      pression: pressionDe(phrase),
      verdict: phrase,
      detail: reste,
    });
  }
  return axes.length >= 3 ? axes : null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function urgenceDe(echeance: string): Urgence {
  const e = normaliser(echeance);
  if (/semaine|immediat|aujourd'hui|sans attendre|urgent/.test(e)) return "semaine";
  if (/mois/.test(e)) return "mois";
  return "plus-tard";
}

function numerosAxes(texte: string): number[] {
  const match = /\baxes?\s+([\d\s,et]+)/i.exec(texte);
  if (!match) return [];
  return [...match[1].matchAll(/\d+/g)].map((m) => Number(m[0]));
}

function lireActions(blocs: Block[]): { actions: Action[]; reste: Block[] } | null {
  const actions: Action[] = [];
  const reste: Block[] = [];
  let courante: Action | null = null;

  for (const bloc of blocs) {
    if (bloc.k === "h3") {
      const titre = texteDe(bloc.s).trim();
      courante = {
        numero: actions.length + 1,
        titre: titre.replace(/^\d+\s*[.)-]\s*/, ""),
        periode: null,
        sources: [],
        axes: [],
        urgence: "plus-tard",
        echeance: null,
        aFaire: null,
        contexte: [],
      };
      actions.push(courante);
      continue;
    }
    if (!courante) {
      reste.push(bloc);
      continue;
    }
    if (bloc.k !== "p") {
      reste.push(bloc);
      continue;
    }

    const a = attaque(bloc.s);
    if (!a) {
      // La ligne de repères : « 6 août - 27 août · WordPress… · sources · axes 4 et 7 ».
      if (courante.periode === null && courante.contexte.length === 0 && !courante.aFaire) {
        const morceaux = texteDe(bloc.s)
          .split(" · ")
          .map((m) => m.trim())
          .filter(Boolean);
        const dernier = morceaux[morceaux.length - 1] ?? "";
        const axes = numerosAxes(dernier);
        if (axes.length > 0) morceaux.pop();
        courante.axes = axes;
        courante.periode = morceaux.shift() ?? null;
        courante.sources = morceaux;
      } else {
        courante.contexte.push({ titre: "", texte: bloc.s });
      }
      continue;
    }

    if (/^a faire/.test(normaliser(a.titre))) {
      const echeance = a.titre.replace(/^À faire\s*/i, "").replace(/^A faire\s*/i, "").trim();
      courante.echeance = echeance ? echeance.charAt(0).toUpperCase() + echeance.slice(1) : null;
      courante.urgence = urgenceDe(echeance);
      courante.aFaire = a.reste;
    } else {
      courante.contexte.push({ titre: a.titre, texte: a.reste });
    }
  }

  return actions.length > 0 ? { actions, reste } : null;
}

// ─── Cartes (paragraphes à attaque en gras) ──────────────────────────────────

function lireCartes(blocs: Block[]): { cartes: Carte[]; reste: Block[] } | null {
  const cartes: Carte[] = [];
  const reste: Block[] = [];
  for (const bloc of blocs) {
    const a = bloc.k === "p" ? attaque(bloc.s) : null;
    if (a) cartes.push({ titre: a.titre, texte: a.reste });
    else reste.push(bloc);
  }
  return cartes.length >= 2 ? { cartes, reste } : null;
}

// ─── Échéancier ──────────────────────────────────────────────────────────────

const MOIS = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
];

/** Le mois (0-11) et l'année d'une date, lus à Paris. */
function moisDe(date: Date): { mois: number; annee: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).formatToParts(date);
  const val = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { mois: val("month") - 1, annee: val("year") };
}

/**
 * La date d'un libellé d'échéance (« Les 14 et 15 septembre » → 14 septembre).
 * L'année est celle de la lettre, ou la suivante si le mois est déjà passé
 * à la date de l'édition ; une année écrite dans le libellé l'emporte.
 */
export function dateEcheance(libelle: string, periode: Date | null): Date | null {
  const l = normaliser(libelle);
  const mois = MOIS.findIndex((m) => new RegExp(`\\b${m}\\b`).test(l));
  if (mois < 0) return null;
  const jour = /(\d{1,2})(?:er)?\b/.exec(l.slice(0, l.indexOf(MOIS[mois])));
  const anneeEcrite = /\b(20\d{2})\b/.exec(l);

  let annee: number;
  if (anneeEcrite) annee = Number(anneeEcrite[1]);
  else if (periode) {
    const ref = moisDe(periode);
    annee = mois < ref.mois ? ref.annee + 1 : ref.annee;
  } else return null;

  // Midi UTC : la date reste la même quel que soit le fuseau d'affichage.
  return new Date(Date.UTC(annee, mois, jour ? Number(jour[1]) : 1, 12));
}

function lireEcheancier(
  blocs: Block[],
  periode: Date | null,
): { echeances: Echeance[]; reste: Block[] } | null {
  const echeances: Echeance[] = [];
  const reste: Block[] = [];

  for (const bloc of blocs) {
    if (bloc.k !== "p" && bloc.k !== "li") {
      reste.push(bloc);
      continue;
    }
    const a = attaque(bloc.s);
    let libelle: string;
    let texte: Span[];
    if (a) {
      libelle = a.titre;
      texte = a.reste;
    } else {
      // « Au 1er octobre, OVHcloud applique… » : le libellé court jusqu'à la
      // première virgule, à condition d'y trouver un mois.
      const brut = texteDe(bloc.s);
      const virgule = brut.indexOf(",");
      if (virgule < 0 || virgule > 60) {
        reste.push(bloc);
        continue;
      }
      libelle = brut.slice(0, virgule).trim();
      texte = coupe(bloc.s, virgule + 1);
    }
    const date = dateEcheance(libelle, periode);
    if (!date) {
      reste.push(bloc);
      continue;
    }
    echeances.push({ libelle, date, texte });
  }

  return echeances.length >= 2 ? { echeances, reste } : null;
}

/** Les spans à partir du caractère `debut`, espaces de tête retirés. */
function coupe(spans: Span[], debut: number): Span[] {
  const out: Span[] = [];
  let aSauter = debut;
  for (const span of spans) {
    if (aSauter >= span.t.length) {
      aSauter -= span.t.length;
      continue;
    }
    out.push({ ...span, t: span.t.slice(aSauter) });
    aSauter = 0;
  }
  if (out[0]) out[0].t = out[0].t.replace(/^\s+/, "");
  const texte = out.filter((span) => span.t !== "");
  if (texte[0]) texte[0].t = texte[0].t.charAt(0).toUpperCase() + texte[0].t.slice(1);
  return texte;
}

// ─── Assemblage ──────────────────────────────────────────────────────────────

function sansFilets(blocs: Block[]): Block[] {
  return blocs.filter((bloc) => bloc.k !== "hr");
}

/**
 * Découpe une section h2. Le titre choisit la forme attendue ; si la forme
 * n'est pas au rendez-vous, la section reste de la prose.
 */
function lireSection(titre: Span[], blocs: Block[], periode: Date | null): Section[] {
  const t = normaliser(texteDe(titre));
  const contenu = sansFilets(blocs);
  const prose: Section = { kind: "prose", titre, blocs: contenu };

  if (t.startsWith("lecture")) {
    // Le tour des axes vit sous un h3 de la lecture du mois.
    const index = contenu.findIndex((b) => b.k === "h3" && /axes/.test(normaliser(texteDe(b.s))));
    if (index < 0) return [prose];
    const axes = lireAxes(contenu.slice(index + 1));
    if (!axes) return [prose];
    const h3 = contenu[index] as { k: "h3"; s: Span[] };
    return [
      { kind: "prose", titre, blocs: contenu.slice(0, index) },
      { kind: "axes", titre: h3.s, axes },
    ];
  }

  if (t.startsWith("a faire")) {
    const lu = lireActions(contenu);
    return lu ? [{ kind: "actions", titre, actions: lu.actions, blocs: lu.reste }] : [prose];
  }

  if (t.startsWith("echeancier") || t.startsWith("calendrier") || t.startsWith("echeances")) {
    const lu = lireEcheancier(contenu, periode);
    return lu ? [{ kind: "echeancier", titre, echeances: lu.echeances, blocs: lu.reste }] : [prose];
  }

  if (t.startsWith("questions")) {
    const questions = contenu.filter((b) => b.k === "oli" || b.k === "li").map((b) => (b as { s: Span[] }).s);
    if (questions.length === 0) return [prose];
    return [
      {
        kind: "questions",
        titre,
        questions,
        blocs: contenu.filter((b) => b.k !== "oli" && b.k !== "li"),
      },
    ];
  }

  const lu = lireCartes(contenu);
  if (!lu) return [prose];
  const options = lu.cartes.every((c) => /^(a considerer|a differer|a eviter|ordre de cout)/.test(normaliser(c.titre)));
  return options
    ? [{ kind: "options", titre, options: lu.cartes, blocs: lu.reste }]
    : [{ kind: "cartes", titre, cartes: lu.cartes, blocs: lu.reste }];
}

/**
 * La lettre découpée en sections typées, ou null si rien du gabarit n'y est
 * reconnu (la page garde alors son rendu linéaire).
 *
 * Le grand titre (h1) de tête est retiré de l'accroche : il redit le titre de
 * la page.
 */
export function structureLettre(body: Block[], periode: Date | null): LettreStructuree | null {
  const premier = body.findIndex((bloc) => bloc.k === "h2");
  if (premier < 0) return null;

  const intro = sansFilets(body.slice(0, premier)).filter((bloc) => bloc.k !== "h1");
  const sections: Section[] = [];

  let titre: Span[] | null = null;
  let blocs: Block[] = [];
  const fermer = () => {
    if (titre) sections.push(...lireSection(titre, blocs, periode));
  };

  for (const bloc of body.slice(premier)) {
    if (bloc.k === "h2") {
      fermer();
      titre = bloc.s;
      blocs = [];
    } else {
      blocs.push(bloc);
    }
  }
  fermer();

  const reconnues = sections.filter((s) => s.kind !== "prose").length;
  if (reconnues === 0) return null;

  return { intro, sections };
}
