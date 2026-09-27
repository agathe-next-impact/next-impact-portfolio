import type { Block, Span } from "../notion/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// La structure d'une lettre de l'atelier, lue dans son corps.
//
// Les lettres de l'atelier suivent un gabarit éditorial fixe (directives v3.2) :
// une lecture du mois avec le tour des axes, des actions sur l'existant, les
// solutions de refonte et de création, le marché, un échéancier et les
// questions au prestataire. Ce gabarit n'est écrit NULLE PART en colonnes : il
// vit dans les titres et les attaques en gras du texte.
//
// Ce module le retrouve, pour que la page puisse le montrer en grille (niveaux
// de pression, urgences, frise des échéances) au lieu d'un long texte continu.
//
// Il ne connaît pas les SOURCES des lettres (atelier, Signaux Faibles,
// Sentinelle, et celles qui viendront) : il connaît des FORMES, et toute lettre
// passe par le même découpage. Les formes reconnues aujourd'hui :
//
//  - sections en h2, ou en h1 quand le corps en compte plusieurs (les éditions
//    Signaux Faibles titrent leurs rubriques en h1, leurs thèmes en h2) ;
//  - un niveau de signal en fin de titre (« Actualité secteur — FORT ») ou en
//    tête d'attaque (« **Impact MOYEN. Titre** »), et « RAS » ;
//  - des axes : paragraphes à attaque en gras, « 1. Nom · Tendance : ↑ » suivis
//    de leurs rubriques, ou h3 numérotés (« 1. Commercial ») avec leur verdict
//    « **À traiter** · … » ;
//  - des actions : un h3 par action (lettres rédigées à la main : « À décider »),
//    ou une attaque en gras par action dans une section « À faire », « Action
//    suggérée », « Le geste »… ;
//  - des cartes (attaques en gras, h3), leurs lignes « Source : » rattachées ;
//  - des chantiers chiffrés en pourcentage, un échéancier, des questions.
//
// Une lettre d'un format nouveau profite donc de tout ce qu'elle partage avec
// les autres, sans code à ajouter. Rien n'est deviné qui ne puisse se vérifier :
// une section dont la forme ne correspond pas redevient de la prose, et une
// lettre sans aucune section reconnue garde son rendu linéaire
// (`structureLettre` renvoie null).
// ─────────────────────────────────────────────────────────────────────────────

/** Le niveau de pression d'un axe, tel que la phrase d'attaque le qualifie. */
export type Pression = "traiter" | "hausse" | "surveiller" | "stable" | "baisse" | "inconnue";

/** L'intensité d'un signal, telle que l'annonce un titre (« — FORT ») ou une attaque (« Impact MOYEN. »). */
export type Intensite = "fort" | "moyen" | "faible" | "ras";

export interface Axe {
  numero: number;
  nom: string;
  pression: Pression;
  /** La première phrase : le verdict. */
  verdict: string;
  /** Le reste du paragraphe. */
  detail: Span[];
  /** Variante « Veilles clients » : « Ce qui s'est passé », « Ce qui impacte votre projet »… */
  rubriques: { titre: string; texte: Span[] }[];
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
  signal?: Intensite;
  /** Les paragraphes qui prolongent la carte jusqu'à sa ligne « Source : ». */
  suite?: Span[][];
  /** Les lignes « Source : … » qui suivent la carte. */
  sources?: Span[][];
}

/** Un chantier et son avancement (« **Formulaire de devis** : 40 %. … »). */
export interface Chantier {
  titre: string;
  texte: Span[];
  /** 0-100, null si l'avancement n'est pas chiffré. */
  pourcentage: number | null;
  /** À défaut de pourcentage : « À venir », « Livré »… */
  statut: string | null;
}

export interface Echeance {
  /** « Au 1er septembre », « Les 14 et 15 septembre »… */
  libelle: string;
  date: Date | null;
  texte: Span[];
}

/**
 * Une section typée. `chapeau` : ce qui précède la première carte ou action,
 * rendu au-dessus de la grille ; `blocs` : ce qui ne s'y range pas, rendu
 * dessous. `signal` : le niveau annoncé en fin de titre, retiré du titre.
 */
export type Section = (
  | { kind: "prose"; titre: Span[] | null; blocs: Block[] }
  | { kind: "axes"; titre: Span[]; axes: Axe[] }
  | { kind: "actions"; titre: Span[]; actions: Action[]; chapeau: Block[]; blocs: Block[] }
  | { kind: "options"; titre: Span[]; options: Carte[]; chapeau: Block[]; blocs: Block[] }
  | { kind: "cartes"; titre: Span[]; cartes: Carte[]; chapeau: Block[]; blocs: Block[] }
  | { kind: "avancement"; titre: Span[]; chantiers: Chantier[]; chapeau: Block[]; blocs: Block[] }
  | { kind: "echeancier"; titre: Span[]; echeances: Echeance[]; blocs: Block[] }
  | { kind: "questions"; titre: Span[]; questions: Span[][]; blocs: Block[] }
) & { signal?: Intensite };

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
  // « **À traiter** · Cette semaine », « **Impact FORT. Titre** — Source » :
  // le séparateur tient au titre, pas au texte.
  if (reste[0]) reste[0].t = reste[0].t.replace(/^[\s.:·—–]+/, "");
  return { titre, reste: reste.filter((span) => span.t !== "") };
}

/** Les spans jusqu'au caractère `fin` exclu. */
function tronque(spans: Span[], fin: number): Span[] {
  const out: Span[] = [];
  let restant = fin;
  for (const span of spans) {
    if (restant <= 0) break;
    out.push({ ...span, t: span.t.slice(0, restant) });
    restant -= span.t.length;
  }
  return out.filter((span) => span.t !== "");
}

// ─── Niveaux de signal ───────────────────────────────────────────────────────

/** « Actualité secteur — FORT » : en capitales seulement, pour ne rien lire dans un titre ordinaire. */
const SIGNAL_FIN_TITRE = /\s+[—–-]\s+(FORT|MOYEN|FAIBLE|RAS)\s*$/;
const SIGNAL_TETE = /^impact\s+(fort|moyen|faible)\b\s*[.:·—–-]?\s*/i;
const SIGNAL_RAS = /\s*[:—–-]\s*RAS$/;

function intensite(mot: string): Intensite {
  return normaliser(mot) as Intensite;
}

/** Le titre d'une section sans son niveau de signal, et ce niveau. */
function signalDuTitre(titre: Span[]): { titre: Span[]; signal?: Intensite } {
  const match = SIGNAL_FIN_TITRE.exec(texteDe(titre));
  if (!match) return { titre };
  return { titre: tronque(titre, match.index), signal: intensite(match[1]) };
}

/** Une carte, son niveau de signal lu dans l'attaque (« Impact FORT. », « … : RAS »). */
function carte(titre: string, texte: Span[]): Carte {
  const tete = SIGNAL_TETE.exec(titre);
  if (tete) {
    const reste = titre.slice(tete[0].length).trim();
    return { titre: reste.charAt(0).toUpperCase() + reste.slice(1), texte, signal: intensite(tete[1]) };
  }
  const ras = SIGNAL_RAS.exec(titre);
  if (ras) return { titre: titre.slice(0, ras.index).trim(), texte, signal: "ras" };
  return { titre, texte };
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
  if (/^(a traiter|a corriger|urgent|critique)\b/.test(v)) return "traiter";
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
      rubriques: [],
    });
  }
  return axes.length >= 3 ? axes : null;
}

/** La flèche de tendance d'une édition « Veilles clients ». */
function pressionDeTendance(tendance: string): Pression {
  if (/[↑↗⬆]/.test(tendance)) return "hausse";
  if (/[↓↘⬇]/.test(tendance)) return "baisse";
  if (/[→⟶➡]/.test(tendance)) return "stable";
  return pressionDe(tendance);
}

/** « Ce qui s'est passé : … » → titre et texte. null sans deux-points en tête. */
function rubrique(spans: Span[]): { titre: string; texte: Span[] } | null {
  const a = attaque(spans);
  if (a) return { titre: a.titre, texte: a.reste };
  const brut = texteDe(spans);
  const match = /^([^:.]{2,40}?)\s*:\s*/.exec(brut);
  if (!match) return null;
  return { titre: match[1].trim(), texte: coupe(spans, match[0].length) };
}

/**
 * Variante « Veilles clients » : « **1. Financements · Tendance : →** » puis
 * ses rubriques en paragraphes. Le verdict affiché est la première phrase de ce
 * qui touche le client (« Ce qui impacte votre projet »).
 */
function lireAxesTendance(blocs: Block[]): Axe[] | null {
  const axes: Axe[] = [];
  for (const bloc of blocs) {
    if (bloc.k !== "p") return null;
    const a = attaque(bloc.s);
    const tete = a ? /^(\d+)\s*[.)]\s*(.+?)\s*·\s*Tendance\s*:?\s*(.*)$/i.exec(a.titre) : null;
    if (tete) {
      axes.push({
        numero: Number(tete[1]),
        nom: tete[2].trim(),
        pression: pressionDeTendance(tete[3]),
        verdict: "",
        detail: [],
        rubriques: [],
      });
      continue;
    }
    const courant = axes[axes.length - 1];
    if (!courant) return null;
    courant.rubriques.push(rubrique(bloc.s) ?? { titre: "", texte: bloc.s });
  }
  if (axes.length < 3) return null;

  for (const axe of axes) {
    const impact =
      axe.rubriques.find((r) => /impact|pour vous|votre projet/.test(normaliser(r.titre))) ??
      axe.rubriques[axe.rubriques.length - 1];
    axe.verdict = impact ? premierePhrase(impact.texte).phrase : "";
  }
  return axes;
}

/**
 * Variante à h3 numérotés (Sentinelle) : « 1. Commercial : offre, conversion »
 * puis ses paragraphes, dont un verdict en attaque (« **À traiter** · Cette
 * semaine : … »). Un h3 non numéroté clôt les axes : ce qui suit est rendu par
 * l'appelant comme une section à part.
 */
function lireAxesNumerotes(blocs: Block[]): { axes: Axe[]; suite: Block[] } | null {
  const axes: Axe[] = [];
  let index = 0;
  for (; index < blocs.length; index++) {
    const bloc = blocs[index];
    if (bloc.k === "h3") {
      const tete = /^(\d+)\s*[.)]\s*(.+)$/.exec(texteDe(bloc.s).trim());
      if (!tete) break;
      const [nom, ...precision] = tete[2].split(/\s+:\s+/);
      axes.push({
        numero: Number(tete[1]),
        nom: nom.trim(),
        pression: "inconnue",
        verdict: "",
        detail: precision.length > 0 ? [{ t: precision.join(" : ") }] : [],
        rubriques: [],
      });
      continue;
    }
    const courant = axes[axes.length - 1];
    if (!courant || !("s" in bloc)) return null;
    const a = attaque(bloc.s);
    const pression = a ? pressionDe(a.titre) : "inconnue";
    if (a && pression !== "inconnue" && !courant.verdict) {
      courant.pression = pression;
      // Le verdict sans son attaque : la pastille de pression la porte déjà.
      courant.verdict = texteDe(a.reste).trim();
    } else {
      courant.rubriques.push({ titre: "", texte: bloc.s });
    }
  }
  if (axes.length < 3) return null;
  for (const axe of axes) {
    if (!axe.verdict && axe.rubriques[0]) axe.verdict = premierePhrase(axe.rubriques[0].texte).phrase;
  }
  return { axes, suite: blocs.slice(index) };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function urgenceDe(echeance: string): Urgence {
  const e = normaliser(echeance);
  if (/semaine|immediat|aujourd'hui|sans attendre|urgent/.test(e)) return "semaine";
  if (/mois|avant/.test(e)) return "mois";
  return "plus-tard";
}

function numerosAxes(texte: string): number[] {
  const match = /\baxes?\s+([\d\s,et]+)/i.exec(texte);
  if (!match) return [];
  return [...match[1].matchAll(/\d+/g)].map((m) => Number(m[0]));
}

/** « Cette semaine » à partir de « À faire cette semaine » ou « À décider ce mois-ci ». */
function echeanceDe(titre: string): string | null {
  const reste = titre.replace(/^(à|a)\s+(faire|décider|decider)\s*/i, "").trim();
  return reste ? reste.charAt(0).toUpperCase() + reste.slice(1) : null;
}

/**
 * Les actions d'une section : un h3 par action. `defaut` porte l'échéance du
 * titre de section (« À décider ce mois-ci »), quand l'action n'en dit pas.
 */
function lireActions(
  blocs: Block[],
  defaut: string | null = null,
): { actions: Action[]; chapeau: Block[]; reste: Block[] } | null {
  const actions: Action[] = [];
  const chapeau: Block[] = [];
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
        urgence: defaut ? urgenceDe(defaut) : "plus-tard",
        echeance: defaut,
        aFaire: null,
        contexte: [],
      };
      actions.push(courante);
      continue;
    }
    if (!courante) {
      chapeau.push(bloc);
      continue;
    }
    if (bloc.k === "li" || bloc.k === "oli") {
      // « Qui : la présidence… » : une rubrique courte, gardée dans la carte.
      courante.contexte.push(rubrique(bloc.s) ?? { titre: "", texte: bloc.s });
      continue;
    }
    if (bloc.k !== "p") {
      reste.push(bloc);
      continue;
    }

    const a = attaque(bloc.s);
    if (!a) {
      // La ligne de repères : « 6 août - 27 août · WordPress… · sources · axes 4 et 7 ».
      const repere = texteDe(bloc.s).includes(" · ");
      if (repere && courante.periode === null && courante.contexte.length === 0 && !courante.aFaire) {
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

    if (/^a (faire|decider)/.test(normaliser(a.titre))) {
      const echeance = echeanceDe(a.titre) ?? defaut;
      courante.echeance = echeance;
      courante.urgence = urgenceDe(echeance ?? "");
      courante.aFaire = a.reste;
    } else {
      courante.contexte.push({ titre: a.titre, texte: a.reste });
    }
  }

  return actions.length > 0 ? { actions, chapeau, reste } : null;
}

/** Les attaques qui ouvrent une rubrique d'action, et non une action nouvelle. */
const RUBRIQUE_ACTION =
  /^(pourquoi|c'est fait quand|qui|quand|comment|cout|budget|delai|duree|ce qui|ce que|pour qui|a faire|a decider|attention|note|methode|sources?)\b/;

/** Ce qui, dans une attaque, dit quand agir (« Immédiat, avant le 1er août »). */
const QUAND = /(immediat|cette semaine|ce mois|avant le|avant fin|d'ici|au plus tard|sans attendre|aujourd'hui)/;

/**
 * « Immédiat, avant le 1er août : s'inscrire… » → échéance et titre. Sans
 * préfixe, une date « avant le … » citée dans le titre sert d'échéance et le
 * titre reste entier.
 */
function echeanceDansTitre(titre: string): { titre: string; echeance: string | null } {
  const prefixe = /^([^:]{3,45}?)\s*:\s*(.+)$/.exec(titre);
  if (prefixe && QUAND.test(normaliser(prefixe[1]))) {
    const reste = prefixe[2].trim();
    return { titre: reste.charAt(0).toUpperCase() + reste.slice(1), echeance: prefixe[1].trim() };
  }
  const avant =
    /\b(avant le (?:[a-zé]+ )?\d{1,2}(?:er)?\s+[a-zéû]+(?:\s+20\d{2})?|d'ici (?:le |au )?(?:[a-zé]+ )?\d{1,2}(?:er)?\s+[a-zéû]+|(?:avant|d'ici) (?:la )?fin (?:de |d')?[a-zéû]+)/i.exec(
      titre,
    );
  if (avant) return { titre, echeance: avant[1].charAt(0).toUpperCase() + avant[1].slice(1) };
  return { titre, echeance: null };
}

const JOUR = 86_400_000;

/** L'urgence d'une échéance, mesurée depuis l'édition quand elle porte une date. */
function urgenceDatee(echeance: string | null, periode: Date | null): Urgence {
  if (!echeance) return "plus-tard";
  const e = normaliser(echeance);
  if (/semaine|immediat|aujourd'hui|sans attendre|urgent/.test(e)) return "semaine";
  const date = dateEcheance(echeance, periode);
  if (date && periode) {
    const jours = (date.getTime() - periode.getTime()) / JOUR;
    return jours <= 10 ? "semaine" : jours <= 40 ? "mois" : "plus-tard";
  }
  return urgenceDe(echeance);
}

/**
 * Les actions d'une section sans h3 : une attaque en gras par action. Les
 * attaques de rubrique (« Pourquoi cette semaine », « C'est fait quand ») et
 * les étapes numérotées se rangent dans l'action en cours.
 */
function lireActionsEnAttaques(
  blocs: Block[],
  defaut: string | null,
  periode: Date | null,
): { actions: Action[]; chapeau: Block[]; reste: Block[] } | null {
  const actions: Action[] = [];
  const chapeau: Block[] = [];
  const reste: Block[] = [];
  let courante: Action | null = null;
  let etape = 0;

  for (const bloc of blocs) {
    const a = bloc.k === "p" || bloc.k === "li" ? attaque(bloc.s) : null;
    const rubriqueAction = a !== null && RUBRIQUE_ACTION.test(normaliser(a.titre));

    if (a && !rubriqueAction) {
      const lu = echeanceDansTitre(a.titre);
      const echeance = lu.echeance ?? defaut;
      courante = {
        numero: actions.length + 1,
        titre: lu.titre,
        periode: null,
        sources: [],
        axes: numerosAxes(texteDe(a.reste)),
        urgence: urgenceDatee(echeance, periode),
        echeance,
        aFaire: null,
        contexte: a.reste.length > 0 ? [{ titre: "", texte: a.reste }] : [],
      };
      actions.push(courante);
      etape = 0;
      continue;
    }
    if (!courante) {
      chapeau.push(bloc);
      continue;
    }
    if (a && /^a (faire|decider)/.test(normaliser(a.titre))) {
      courante.aFaire = a.reste;
      continue;
    }
    if (a) {
      courante.contexte.push({ titre: a.titre, texte: a.reste });
      continue;
    }
    if (bloc.k === "oli") {
      etape += 1;
      courante.contexte.push({ titre: "", texte: [{ t: `${etape}. ` }, ...bloc.s] });
      continue;
    }
    if (bloc.k === "p" || bloc.k === "li") {
      courante.contexte.push({ titre: "", texte: bloc.s });
      continue;
    }
    reste.push(bloc);
  }

  return actions.length > 0 ? { actions, chapeau, reste } : null;
}

// ─── Cartes (paragraphes à attaque en gras) ──────────────────────────────────

/** « Source : … », « Sources (rappel de contexte) : … ». */
const LIGNE_SOURCE = /^sources?\b[^:]{0,80}:/i;

/**
 * Deux formes de carte : un paragraphe ou une puce à attaque en gras, ou un h3
 * suivi de ses paragraphes (une carte par h3). Une ligne « Source : » se
 * rattache à la carte qui la précède.
 */
function lireCartes(blocs: Block[]): { cartes: Carte[]; chapeau: Block[]; reste: Block[] } | null {
  const cartes: Carte[] = [];
  const chapeau: Block[] = [];
  const reste: Block[] = [];
  let sousTitre: Carte | null = null;
  let derniere: Carte | null = null;
  // Les paragraphes sans attaque qui suivent une carte : ils la prolongent si
  // une ligne « Source : » les ferme, sinon ils concluent la section.
  let enAttente: Block[] = [];
  const horsCarte = () => {
    (cartes.length === 0 ? chapeau : reste).push(...enAttente);
    enAttente = [];
  };

  for (const bloc of blocs) {
    if (bloc.k === "h3") {
      horsCarte();
      sousTitre = { titre: texteDe(bloc.s).trim(), texte: [] };
      cartes.push(sousTitre);
      derniere = sousTitre;
      continue;
    }
    const enLigne =
      bloc.k === "p" || bloc.k === "li" || bloc.k === "oli" || bloc.k === "callout" || bloc.k === "quote";
    if (enLigne && derniere && LIGNE_SOURCE.test(texteDe(bloc.s).trim())) {
      const suite = enAttente.map((b) => (b as { s: Span[] }).s);
      if (suite.length > 0) derniere.suite = [...(derniere.suite ?? []), ...suite];
      enAttente = [];
      derniere.sources = [...(derniere.sources ?? []), bloc.s];
      continue;
    }
    if (sousTitre && (bloc.k === "p" || bloc.k === "li" || bloc.k === "oli")) {
      if (sousTitre.texte.length > 0) sousTitre.texte.push({ t: " " });
      sousTitre.texte.push(...bloc.s);
      continue;
    }
    sousTitre = null;
    const a = enLigne ? attaque(bloc.s) : null;
    if (a) {
      horsCarte();
      derniere = carte(a.titre, a.reste);
      cartes.push(derniere);
    } else if (derniere && enLigne) {
      enAttente.push(bloc);
    } else {
      horsCarte();
      (cartes.length === 0 ? chapeau : reste).push(bloc);
    }
  }
  horsCarte();

  // Une carte seule ne fait une grille que si elle porte un niveau ou une source.
  const suffit = cartes.length >= 2 || cartes.some((c) => c.signal || c.sources);
  return cartes.length > 0 && suffit ? { cartes, chapeau, reste } : null;
}

// ─── Avancement des chantiers ────────────────────────────────────────────────

function statutDe(texte: string): string | null {
  const t = normaliser(texte);
  if (/\b(livre|termine|en ligne)\b/.test(t)) return "Livré";
  if (/\ben cours\b/.test(t)) return "En cours";
  if (/\b(demarre|a venir|programme|prevu|decide)/.test(t)) return "À venir";
  return null;
}

/** Retire la ponctuation laissée en tête après une coupe. */
function nettoieTete(spans: Span[]): Span[] {
  const out = spans.map((span) => ({ ...span }));
  while (out[0] && out[0].t.replace(/^[\s.:,;]+/, "") === "") out.shift();
  if (out[0]) out[0].t = out[0].t.replace(/^[\s.:,;]+/, "");
  if (out[0]) out[0].t = out[0].t.charAt(0).toUpperCase() + out[0].t.slice(1);
  return out;
}

/**
 * Des cartes chiffrées en pourcentage deviennent des chantiers : sous un titre
 * qui l'annonce, dès qu'une l'est ; ailleurs, seulement si la plupart le sont
 * et qu'aucune n'est un signal (« 35 % des séminaires… » est une actualité).
 */
function enChantiers(cartes: Carte[], titre: string): Chantier[] | null {
  const chantiers = cartes.map((carte): Chantier => {
    const texte = texteDe(carte.texte);
    const pct = /^\D{0,15}?(\d{1,3})\s*%/.exec(texte);
    const pourcentage = pct ? Math.min(100, Number(pct[1])) : null;
    return {
      titre: carte.titre,
      texte: nettoieTete(pct ? coupe(carte.texte, pct[0].length) : carte.texte),
      pourcentage,
      statut: pourcentage === null ? statutDe(texte) : pourcentage >= 100 ? "Livré" : "En cours",
    };
  });
  const chiffres = chantiers.filter((c) => c.pourcentage !== null).length;
  if (chiffres === 0) return null;
  if (/chantier|avancement|ou en (sont|est)|projets? en cours/.test(normaliser(titre))) return chantiers;
  return chiffres * 2 >= chantiers.length && !cartes.some((c) => c.signal) ? chantiers : null;
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
  // « 2026-08-27 », « 27/08/2026 » : la date est entière, rien à déduire.
  const iso = /\b(20\d{2})-(\d{2})-(\d{2})\b/.exec(libelle);
  if (iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12));
  const fr = /\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/.exec(libelle);
  if (fr) return new Date(Date.UTC(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1]), 12));

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
    // Une date machine (« 2026-08-27 ») se lit en toutes lettres.
    if (/^\d{4}-\d{2}-\d{2}$/.test(libelle.trim())) {
      libelle = new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
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

/** Les titres de section qui annoncent des actions. */
const SECTION_ACTIONS = /^(a faire|a decider|actions?\b|(le |les )?gestes?\b|ce qui suit|prochaines? etapes?)/;

/** L'échéance que porte le titre d'une section d'actions, quand l'action n'en dit pas. */
function echeanceDeSection(titre: string): string | null {
  const t = normaliser(titre);
  if (t.startsWith("a decider")) return echeanceDe(titre.trim());
  if (/\bsemaine\b/.test(t)) return "Cette semaine";
  if (/\bmois\b/.test(t)) return "Ce mois-ci";
  return null;
}

/**
 * Découpe une section. Le titre choisit la forme attendue ; si la forme
 * n'est pas au rendez-vous, la section reste de la prose.
 */
function lireSection(titreBrut: Span[], blocs: Block[], periode: Date | null): Section[] {
  const { titre, signal } = signalDuTitre(titreBrut);
  const sections = formeDe(titre, sansFilets(blocs), periode);
  if (signal && sections[0]) sections[0] = { ...sections[0], signal };
  return sections;
}

function formeDe(titre: Span[], contenu: Block[], periode: Date | null): Section[] {
  const t = normaliser(texteDe(titre));
  const prose: Section = { kind: "prose", titre, blocs: contenu };

  if (/\baxes\b/.test(t)) {
    // Variante « Veilles clients » : les axes ont leur propre section.
    const axes = lireAxesTendance(contenu) ?? lireAxes(contenu);
    if (axes) return [{ kind: "axes", titre, axes }];
    const numerotes = lireAxesNumerotes(contenu);
    if (numerotes) {
      const [suivant, ...suite] = numerotes.suite;
      return [
        { kind: "axes", titre, axes: numerotes.axes },
        ...(suivant?.k === "h3" ? lireSection(suivant.s, suite, periode) : []),
      ];
    }
  }

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

  if (SECTION_ACTIONS.test(t)) {
    const defaut = echeanceDeSection(texteDe(titre));
    const lu = lireActions(contenu, defaut) ?? lireActionsEnAttaques(contenu, defaut, periode);
    return lu
      ? [{ kind: "actions", titre, actions: lu.actions, chapeau: lu.chapeau, blocs: lu.reste }]
      : [prose];
  }

  if (/^(echeancier|calendrier|echeances|(l')?agenda|dates a retenir)/.test(t)) {
    const lu = lireEcheancier(contenu, periode);
    return lu ? [{ kind: "echeancier", titre, echeances: lu.echeances, blocs: lu.reste }] : [prose];
  }

  if (/\bquestions\b/.test(t)) {
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
  const chantiers = enChantiers(lu.cartes, texteDe(titre));
  if (chantiers) return [{ kind: "avancement", titre, chantiers, chapeau: lu.chapeau, blocs: lu.reste }];
  const options = lu.cartes.every((c) => /^(a considerer|a differer|a eviter|ordre de cout)/.test(normaliser(c.titre)));
  return options
    ? [{ kind: "options", titre, options: lu.cartes, chapeau: lu.chapeau, blocs: lu.reste }]
    : [{ kind: "cartes", titre, cartes: lu.cartes, chapeau: lu.chapeau, blocs: lu.reste }];
}

/**
 * La lettre découpée en sections typées, ou null si rien n'y est reconnu (la
 * page garde alors son rendu linéaire).
 *
 * Les sections s'ouvrent sur les h2. Un h1 unique est le grand titre de la
 * lettre : il est retiré de l'accroche, puisqu'il redit le titre de la page.
 * Plusieurs h1 sont des rubriques : ils ouvrent des sections eux aussi, et les
 * h2 qu'ils contiennent en deviennent les sous-sections.
 */
export function structureLettre(body: Block[], periode: Date | null): LettreStructuree | null {
  const rubriquesH1 = body.filter((bloc) => bloc.k === "h1").length >= 2;
  const ouvre = (bloc: Block) => bloc.k === "h2" || (rubriquesH1 && bloc.k === "h1");

  const premier = body.findIndex(ouvre);
  if (premier < 0) return null;

  const intro = sansFilets(body.slice(0, premier)).filter((bloc) => bloc.k !== "h1");
  const sections: Section[] = [];

  let titre: Span[] | null = null;
  let blocs: Block[] = [];
  const fermer = () => {
    if (titre) sections.push(...lireSection(titre, blocs, periode));
  };

  for (const bloc of body.slice(premier)) {
    if (ouvre(bloc)) {
      fermer();
      titre = (bloc as { s: Span[] }).s;
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
