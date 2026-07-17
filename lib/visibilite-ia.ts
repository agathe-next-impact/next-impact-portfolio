// Diagnostic « Votre site est-il visible dans les moteurs IA ? » — données et
// scoring purs (aucune dépendance React) pour l'outil /outils/visibilite-ia.
//
// Questionnaire déclaratif (pas de crawl serveur) : 10 questions réparties sur
// 4 axes — accès des robots IA, citabilité du contenu, structure/données,
// autorité externe. Chaque option vaut ok (plein poids), warn (moitié) ou
// ko (zéro) ; le score global et les scores par axe sont sur 100.
// Paliers : >= 70 visible · 40-69 partiel · < 40 invisible.
//
// Séparé du composant pour être testable en node pur :
// `npx tsc scripts/test-visibilite-ia.ts --outDir <tmp> ...` puis node.

export type Status = "ok" | "warn" | "ko";

export type AxisId = "acces" | "citabilite" | "structure" | "autorite";

export interface Axis {
  id: AxisId;
  labelFr: string;
  labelEn: string;
}

export interface QuestionOption {
  value: string;
  labelFr: string;
  labelEn: string;
  status: Status;
  /** Explication pédagogique affichée dans le détail du résultat. */
  detailFr: string;
  detailEn: string;
  /** Action concrète proposée quand la réponse n'est pas « ok ». */
  recoFr?: string;
  recoEn?: string;
}

export interface Question {
  id: string;
  axis: AxisId;
  criterionFr: string;
  criterionEn: string;
  questionFr: string;
  questionEn: string;
  weight: number;
  options: QuestionOption[];
}

export const AXES: Axis[] = [
  { id: "acces", labelFr: "Accès des robots IA", labelEn: "AI crawler access" },
  { id: "citabilite", labelFr: "Citabilité du contenu", labelEn: "Content citability" },
  { id: "structure", labelFr: "Structure & données", labelEn: "Structure & schema" },
  { id: "autorite", labelFr: "Autorité externe", labelEn: "External authority" },
];

export const QUESTIONS: Question[] = [
  {
    id: "robots",
    axis: "acces",
    criterionFr: "Robots IA",
    criterionEn: "AI crawlers",
    questionFr: "GPTBot, ClaudeBot, PerplexityBot… peuvent-ils lire votre site ?",
    questionEn: "Can GPTBot, ClaudeBot, PerplexityBot read your site?",
    weight: 12,
    options: [
      {
        value: "ouverts",
        labelFr: "Oui, vérifié dans mon robots.txt",
        labelEn: "Yes, checked in my robots.txt",
        status: "ok",
        detailFr: "Porte ouverte : les moteurs IA peuvent lire vos pages — condition n° 1 pour être cité.",
        detailEn: "Door open: AI engines can read your pages — condition #1 to get cited.",
      },
      {
        value: "inconnu",
        labelFr: "Je n'ai jamais vérifié",
        labelEn: "I've never checked",
        status: "warn",
        detailFr: "Point aveugle : certains hébergeurs, CDN ou plugins bloquent les robots IA sans vous le dire.",
        detailEn: "Blind spot: some hosts, CDNs or plugins block AI crawlers without telling you.",
        recoFr: "Ouvrez votre-site.fr/robots.txt et vérifiez qu'aucune ligne ne bloque GPTBot, ClaudeBot ou PerplexityBot.",
        recoEn: "Open yoursite.com/robots.txt and check no line blocks GPTBot, ClaudeBot or PerplexityBot.",
      },
      {
        value: "bloques",
        labelFr: "Ils sont bloqués (robots.txt, pare-feu ou CDN)",
        labelEn: "They are blocked (robots.txt, firewall or CDN)",
        status: "ko",
        detailFr: "Blocage total : un moteur IA qui ne peut pas lire vos pages ne vous citera jamais.",
        detailEn: "Total block: an AI engine that can't read your pages will never cite you.",
        recoFr: "Débloquez les robots IA dans votre robots.txt (et côté CDN/pare-feu) : action n° 1, gratuite et immédiate.",
        recoEn: "Unblock AI crawlers in your robots.txt (and CDN/firewall): action #1, free and immediate.",
      },
    ],
  },
  {
    id: "rendu",
    axis: "acces",
    criterionFr: "Lisibilité du contenu",
    criterionEn: "Content readability",
    questionFr: "Votre contenu est-il lisible sans exécuter JavaScript ?",
    questionEn: "Is your content readable without running JavaScript?",
    weight: 7,
    options: [
      {
        value: "html",
        labelFr: "Oui : HTML classique (WordPress, site statique…)",
        labelEn: "Yes: classic HTML (WordPress, static site…)",
        status: "ok",
        detailFr: "Bon point : votre contenu arrive en HTML, lisible par tous les robots.",
        detailEn: "Good: your content ships as HTML, readable by every crawler.",
      },
      {
        value: "inconnu",
        labelFr: "Je ne sais pas",
        labelEn: "I don't know",
        status: "warn",
        detailFr: "À vérifier : certains sites n'affichent leur contenu qu'après exécution du JavaScript, que la plupart des crawlers IA ne lisent pas.",
        detailEn: "Worth checking: some sites only show content after JavaScript runs, which most AI crawlers don't execute.",
        recoFr: "Affichez le « code source de la page » : si votre texte n'y figure pas, les robots IA ne le voient pas non plus.",
        recoEn: "Open 'view page source': if your text isn't there, AI crawlers can't see it either.",
      },
      {
        value: "js",
        labelFr: "Non : le contenu se charge en JavaScript après coup",
        labelEn: "No: content loads via JavaScript afterwards",
        status: "ko",
        detailFr: "Handicap sérieux : la plupart des crawlers IA lisent le HTML brut, pas le rendu JavaScript.",
        detailEn: "Serious handicap: most AI crawlers read raw HTML, not the JavaScript-rendered page.",
        recoFr: "Passez vos pages de contenu en rendu serveur (SSR/SSG) — sujet technique à cadrer avec votre prestataire.",
        recoEn: "Move your content pages to server rendering (SSR/SSG) — a technical topic to scope with your provider.",
      },
    ],
  },
  {
    id: "llms",
    axis: "acces",
    criterionFr: "llms.txt",
    criterionEn: "llms.txt",
    questionFr: "Avez-vous un fichier llms.txt à la racine de votre site ?",
    questionEn: "Do you have an llms.txt file at the root of your site?",
    weight: 5,
    options: [
      {
        value: "oui",
        labelFr: "Oui",
        labelEn: "Yes",
        status: "ok",
        detailFr: "Signal d'avance : vous guidez les modèles IA vers vos contenus importants.",
        detailEn: "Ahead of the curve: you guide AI models to your key content.",
      },
      {
        value: "non",
        labelFr: "Non, pas encore",
        labelEn: "No, not yet",
        status: "warn",
        detailFr: "Facile à combler : un simple fichier texte qui liste vos pages clés pour les modèles IA.",
        detailEn: "Easy win: a simple text file listing your key pages for AI models.",
        recoFr: "Ajoutez un llms.txt à la racine : quelques lignes qui présentent le site et listent vos pages clés.",
        recoEn: "Add an llms.txt at the root: a few lines introducing the site and listing your key pages.",
      },
      {
        value: "inconnu",
        labelFr: "Je ne sais pas ce que c'est",
        labelEn: "I don't know what that is",
        status: "ko",
        detailFr: "Normal, le standard est récent : c'est un fichier texte qui présente vos pages clés aux modèles IA.",
        detailEn: "That's normal, the standard is recent: a text file that introduces your key pages to AI models.",
        recoFr: "Découvrez le standard llms.txt et ajoutez le fichier à la racine — dix minutes de travail, un signal de plus.",
        recoEn: "Look up the llms.txt standard and add the file at your root — ten minutes of work, one more signal.",
      },
    ],
  },
  {
    id: "format",
    axis: "citabilite",
    criterionFr: "Format du contenu",
    criterionEn: "Content format",
    questionFr: "Vos pages répondent-elles à des questions précises, ou présentent-elles surtout l'entreprise ?",
    questionEn: "Do your pages answer specific questions, or mostly present the company?",
    weight: 14,
    options: [
      {
        value: "questions",
        labelFr: "Elles répondent à de vraies questions de clients",
        labelEn: "They answer real customer questions",
        status: "ok",
        detailFr: "Exactement ce que les moteurs IA citent : des réponses, pas des plaquettes.",
        detailEn: "Exactly what AI engines cite: answers, not brochures.",
      },
      {
        value: "mixte",
        labelFr: "Un peu des deux",
        labelEn: "A bit of both",
        status: "warn",
        detailFr: "Potentiel inexploité : les pages « réponse » attirent les citations, les pages « vitrine » non.",
        detailEn: "Untapped potential: 'answer' pages attract citations, 'showcase' pages don't.",
        recoFr: "Transformez vos pages clés : une vraie question de client en titre, la réponse directe dès le premier paragraphe.",
        recoEn: "Rework your key pages: a real customer question as the title, the direct answer in the first paragraph.",
      },
      {
        value: "vitrine",
        labelFr: "Elles présentent surtout l'entreprise et ses services",
        labelEn: "They mostly present the company and its services",
        status: "ko",
        detailFr: "Une IA cite des réponses. Une plaquette « nos valeurs, nos services » ne répond à aucune question posée.",
        detailEn: "An AI cites answers. A 'our values, our services' brochure answers no actual question.",
        recoFr: "Créez des pages qui répondent aux questions que vos clients posent vraiment — une question, une page, une réponse directe.",
        recoEn: "Create pages answering the questions your customers actually ask — one question, one page, one direct answer.",
      },
    ],
  },
  {
    id: "chiffres",
    axis: "citabilite",
    criterionFr: "Chiffres et verdicts",
    criterionEn: "Numbers and verdicts",
    questionFr: "Donnez-vous des chiffres, des prix, des comparatifs, des verdicts explicites ?",
    questionEn: "Do you give numbers, prices, comparisons, explicit verdicts?",
    weight: 10,
    options: [
      {
        value: "oui",
        labelFr: "Oui, régulièrement",
        labelEn: "Yes, regularly",
        status: "ok",
        detailFr: "Les moteurs IA privilégient les pages qui donnent des chiffres et qui tranchent.",
        detailEn: "AI engines favor pages that give numbers and take a stance.",
      },
      {
        value: "parfois",
        labelFr: "Parfois",
        labelEn: "Sometimes",
        status: "warn",
        detailFr: "À systématiser : chaque chiffre ou verdict explicite est un extrait citable de plus.",
        detailEn: "Worth systematizing: every number or explicit verdict is one more citable snippet.",
        recoFr: "Ajoutez chiffres et verdicts (« pour tel profil : oui, parce que… ») à vos pages les plus consultées.",
        recoEn: "Add numbers and verdicts ('for this profile: yes, because…') to your most-visited pages.",
      },
      {
        value: "jamais",
        labelFr: "Jamais — on reste volontairement vague",
        labelEn: "Never — we stay deliberately vague",
        status: "ko",
        detailFr: "Rester vague protège peut-être commercialement, mais rend le contenu impossible à citer.",
        detailEn: "Staying vague may feel commercially safe, but it makes your content impossible to cite.",
        recoFr: "Publiez au moins une page avec des fourchettes de prix ou un comparatif tranché : c'est ce que les IA reprennent.",
        recoEn: "Publish at least one page with price ranges or a decisive comparison: that's what AIs pick up.",
      },
    ],
  },
  {
    id: "fraicheur",
    axis: "citabilite",
    criterionFr: "Fraîcheur",
    criterionEn: "Freshness",
    questionFr: "Vos contenus sont-ils mis à jour, avec une date visible ?",
    questionEn: "Is your content kept up to date, with a visible date?",
    weight: 8,
    options: [
      {
        value: "ajour",
        labelFr: "Oui : mis à jour et datés",
        labelEn: "Yes: updated and dated",
        status: "ok",
        detailFr: "Signal de confiance : les moteurs IA préfèrent citer des contenus datés et récents.",
        detailEn: "Trust signal: AI engines prefer citing dated, recent content.",
      },
      {
        value: "partiel",
        labelFr: "Certains, sans date visible",
        labelEn: "Some, without a visible date",
        status: "warn",
        detailFr: "Dommage : un contenu à jour sans date affichée ne prouve pas sa fraîcheur.",
        detailEn: "A pity: up-to-date content with no visible date can't prove its freshness.",
        recoFr: "Affichez une date de mise à jour sur vos pages clés — les moteurs IA écartent ce qui semble périmé.",
        recoEn: "Show an updated date on your key pages — AI engines discard what looks stale.",
      },
      {
        value: "fige",
        labelFr: "Le site n'a pas bougé depuis des années",
        labelEn: "The site hasn't moved in years",
        status: "ko",
        detailFr: "Contenu figé = contenu écarté : les moteurs IA recoupent la fraîcheur avant de citer.",
        detailEn: "Frozen content gets discarded: AI engines check freshness before citing.",
        recoFr: "Réactualisez 2-3 pages stratégiques (chiffres, offres, année en cours) et datez-les — plutôt que tout refaire.",
        recoEn: "Refresh 2-3 strategic pages (numbers, offers, current year) and date them — rather than redoing everything.",
      },
    ],
  },
  {
    id: "faq",
    axis: "structure",
    criterionFr: "FAQ",
    criterionEn: "FAQ",
    questionFr: "Vos pages clés ont-elles une FAQ — de vraies questions, de vraies réponses ?",
    questionEn: "Do your key pages have an FAQ — real questions, real answers?",
    weight: 8,
    options: [
      {
        value: "oui",
        labelFr: "Oui, sur les pages importantes",
        labelEn: "Yes, on the important pages",
        status: "ok",
        detailFr: "Chaque question de FAQ est une réponse prête à être extraite par une IA.",
        detailEn: "Each FAQ question is an answer ready to be extracted by an AI.",
      },
      {
        value: "quelques",
        labelFr: "Quelques-unes",
        labelEn: "A few",
        status: "warn",
        detailFr: "Bon début : à généraliser sur les pages qui comptent (offres, prix, sujets clés).",
        detailEn: "Good start: extend it to the pages that matter (offers, pricing, key topics).",
        recoFr: "Ajoutez une FAQ de 3 à 7 questions réelles en bas de vos pages clés — celles que vos clients posent vraiment.",
        recoEn: "Add a 3-7 question FAQ at the bottom of your key pages — the ones customers actually ask.",
      },
      {
        value: "non",
        labelFr: "Non",
        labelEn: "No",
        status: "ko",
        detailFr: "Manque à gagner direct : le format question/réponse est le plus repris par les moteurs IA.",
        detailEn: "Direct missed opportunity: Q&A is the format AI engines pick up most.",
        recoFr: "Ajoutez une FAQ de 3 à 7 questions réelles en bas de vos pages clés — celles que vos clients posent vraiment.",
        recoEn: "Add a 3-7 question FAQ at the bottom of your key pages — the ones customers actually ask.",
      },
    ],
  },
  {
    id: "schema",
    axis: "structure",
    criterionFr: "Données structurées",
    criterionEn: "Structured data",
    questionFr: "Vos pages embarquent-elles des données structurées (JSON-LD : Article, FAQPage, Organization) ?",
    questionEn: "Do your pages carry structured data (JSON-LD: Article, FAQPage, Organization)?",
    weight: 10,
    options: [
      {
        value: "oui",
        labelFr: "Oui, vérifiées",
        labelEn: "Yes, verified",
        status: "ok",
        detailFr: "Vos pages se décrivent elles-mêmes aux machines : auteur, dates, questions/réponses.",
        detailEn: "Your pages describe themselves to machines: author, dates, Q&A.",
      },
      {
        value: "plugin",
        labelFr: "Peut-être, via un plugin SEO — jamais vérifié",
        labelEn: "Maybe, via an SEO plugin — never checked",
        status: "warn",
        detailFr: "À vérifier : les plugins SEO posent un balisage générique, rarement complet (FAQPage, auteur…).",
        detailEn: "Worth checking: SEO plugins add generic markup, rarely complete (FAQPage, author…).",
        recoFr: "Testez une page clé sur validator.schema.org : vous saurez en deux minutes ce que les machines voient.",
        recoEn: "Test a key page on validator.schema.org: in two minutes you'll know what machines see.",
      },
      {
        value: "non",
        labelFr: "Non / je ne sais pas ce que c'est",
        labelEn: "No / I don't know what that is",
        status: "ko",
        detailFr: "Vos pages sont muettes pour les machines : ni auteur, ni dates, ni questions/réponses déclarés.",
        detailEn: "Your pages are mute to machines: no declared author, dates or Q&A.",
        recoFr: "Ajoutez les schémas Organization, Article et FAQPage — la plupart des CMS le permettent via un plugin SEO.",
        recoEn: "Add Organization, Article and FAQPage schemas — most CMSs allow it via an SEO plugin.",
      },
    ],
  },
  {
    id: "citations",
    axis: "autorite",
    criterionFr: "Citations externes",
    criterionEn: "External mentions",
    questionFr: "Parle-t-on de vous ailleurs que sur votre site (presse, annuaires, avis, comparatifs) ?",
    questionEn: "Are you mentioned beyond your own site (press, directories, reviews, comparisons)?",
    weight: 13,
    options: [
      {
        value: "regulier",
        labelFr: "Oui, régulièrement",
        labelEn: "Yes, regularly",
        status: "ok",
        detailFr: "L'autorité externe pèse lourd : les moteurs IA recoupent plusieurs sources avant de citer.",
        detailEn: "External authority weighs a lot: AI engines cross-check several sources before citing.",
      },
      {
        value: "quelques",
        labelFr: "Quelques mentions",
        labelEn: "A few mentions",
        status: "warn",
        detailFr: "Base à consolider : plus vos pairs et médias vous citent, plus les IA vous font confiance.",
        detailEn: "A base to build on: the more peers and media cite you, the more AIs trust you.",
        recoFr: "Provoquez des citations : annuaires métier, interviews, études de cas publiées chez vos clients et partenaires.",
        recoEn: "Earn mentions: trade directories, interviews, case studies published by clients and partners.",
      },
      {
        value: "jamais",
        labelFr: "Quasiment jamais",
        labelEn: "Almost never",
        status: "ko",
        detailFr: "Un site que personne ne mentionne est un site que les IA n'ont aucune raison de croire.",
        detailEn: "A site nobody mentions is a site AIs have no reason to trust.",
        recoFr: "Provoquez des citations : annuaires métier, interviews, études de cas publiées chez vos clients et partenaires.",
        recoEn: "Earn mentions: trade directories, interviews, case studies published by clients and partners.",
      },
    ],
  },
  {
    id: "test",
    axis: "autorite",
    criterionFr: "Test en conditions réelles",
    criterionEn: "Real-world test",
    questionFr: "Avez-vous demandé à ChatGPT ou Perplexity qui recommander dans votre domaine ?",
    questionEn: "Have you asked ChatGPT or Perplexity who to recommend in your field?",
    weight: 13,
    options: [
      {
        value: "present",
        labelFr: "Oui — et j'apparais",
        labelEn: "Yes — and I show up",
        status: "ok",
        detailFr: "Meilleure preuve possible : vous êtes déjà dans les réponses.",
        detailEn: "Best possible proof: you're already in the answers.",
      },
      {
        value: "jamais",
        labelFr: "Jamais testé",
        labelEn: "Never tried",
        status: "warn",
        detailFr: "Premier réflexe à prendre : posez la question comme vos clients la poseraient.",
        detailEn: "First reflex to build: ask the question the way your customers would.",
        recoFr: "Testez ce soir : demandez à ChatGPT et Perplexity « quel [votre métier] recommandes-tu pour [votre cible] ? » et notez qui est cité.",
        recoEn: "Try tonight: ask ChatGPT and Perplexity 'which [your trade] would you recommend for [your audience]?' and note who gets cited.",
      },
      {
        value: "absent",
        labelFr: "Oui — et je n'apparais jamais",
        labelEn: "Yes — and I never show up",
        status: "ko",
        detailFr: "Le symptôme est confirmé : vos concurrents captent les recommandations à votre place.",
        detailEn: "The symptom is confirmed: your competitors capture the recommendations instead of you.",
        recoFr: "Analysez qui est cité à votre place et pourquoi (format, chiffres, mentions externes) : c'est votre feuille de route.",
        recoEn: "Analyze who gets cited instead of you and why (format, numbers, external mentions): that's your roadmap.",
      },
    ],
  },
];

export const TOTAL_WEIGHT = QUESTIONS.reduce((s, q) => s + q.weight, 0);

/** Réponses par défaut : option médiane (« warn ») — un résultat se calcule toujours. */
export const INITIAL_ANSWERS: Record<string, string> = Object.fromEntries(
  QUESTIONS.map((q) => {
    const median = q.options.find((o) => o.status === "warn") ?? q.options[0];
    return [q.id, median.value];
  }),
);

export type Tier = "visible" | "partiel" | "invisible";

export const TIER_THRESHOLDS = { visible: 70, partiel: 40 } as const;

export interface AnsweredQuestion {
  question: Question;
  option: QuestionOption;
}

const POINTS: Record<Status, number> = { ok: 1, warn: 0.5, ko: 0 };

/** Résout chaque question vers l'option choisie (fallback : 1re option). */
export function resolveAnswers(state: Record<string, string>): AnsweredQuestion[] {
  return QUESTIONS.map((question) => ({
    question,
    option: question.options.find((o) => o.value === state[question.id]) ?? question.options[0],
  }));
}

/** Score global sur 100 (ok = plein poids, warn = moitié, ko = 0). */
export function computeScore(state: Record<string, string>): number {
  const total = resolveAnswers(state).reduce(
    (sum, { question, option }) => sum + question.weight * POINTS[option.status],
    0,
  );
  return Math.round((total / TOTAL_WEIGHT) * 100);
}

/** Score par axe sur 100, même barème. */
export function computeAxisScores(state: Record<string, string>): Record<AxisId, number> {
  const answered = resolveAnswers(state);
  const scores = {} as Record<AxisId, number>;
  for (const axis of AXES) {
    const rows = answered.filter(({ question }) => question.axis === axis.id);
    const max = rows.reduce((s, { question }) => s + question.weight, 0);
    const got = rows.reduce(
      (s, { question, option }) => s + question.weight * POINTS[option.status],
      0,
    );
    scores[axis.id] = max === 0 ? 0 : Math.round((got / max) * 100);
  }
  return scores;
}

export function getTier(score: number): Tier {
  if (score >= TIER_THRESHOLDS.visible) return "visible";
  if (score >= TIER_THRESHOLDS.partiel) return "partiel";
  return "invisible";
}

export interface Recommendation {
  questionId: string;
  axis: AxisId;
  status: Status;
  weight: number;
  recoFr: string;
  recoEn: string;
}

/**
 * Recommandations concrètes : réponses non « ok », les « ko » d'abord puis par
 * poids décroissant, limitées à `max` (2-3 actions valent mieux qu'une liste).
 */
export function getRecommendations(state: Record<string, string>, max = 3): Recommendation[] {
  return resolveAnswers(state)
    .filter(({ option }) => option.status !== "ok" && option.recoFr && option.recoEn)
    .sort((a, b) => {
      if (a.option.status !== b.option.status) return a.option.status === "ko" ? -1 : 1;
      return b.question.weight - a.question.weight;
    })
    .slice(0, max)
    .map(({ question, option }) => ({
      questionId: question.id,
      axis: question.axis,
      status: option.status,
      weight: question.weight,
      recoFr: option.recoFr as string,
      recoEn: option.recoEn as string,
    }));
}
