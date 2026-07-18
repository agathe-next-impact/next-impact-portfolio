// Checklist GEO actionnable — données pures (aucune dépendance React) pour
// l'outil /outils/checklist-geo.
//
// 24 actions groupées par les 4 chantiers du guide GEO PME (C2,
// content/documentation/etre-trouve/guide-geo-pme.mdx) : accès technique,
// pages-réponses, structure/balisage, autorité externe — mêmes termes, même
// ordre, mêmes robots IA que le diagnostic lib/visibilite-ia.ts
// (OAI-SearchBot, PerplexityBot, ClaudeBot, GPTBot).
//
// Chaque point : action concrète + pourquoi en une ligne + niveau
// (interne / prestataire). Le pendant actionnable du diagnostic : le
// diagnostic situe, la checklist fait faire.
//
// Séparé du composant pour être testable en node pur :
// `npx tsc scripts/test-checklist-geo.ts --outDir <tmp> ...` puis node.

export type SectionId = "acces" | "citabilite" | "structure" | "autorite";

export type Level = "interne" | "prestataire";

export interface ChecklistSection {
  id: SectionId;
  /** Numéro du chantier (aligné sur C2 : « les quatre chantiers d'une PME »). */
  order: number;
  titleFr: string;
  titleEn: string;
  /** Sous-titre pédagogique en une ligne. */
  subtitleFr: string;
  subtitleEn: string;
}

export interface ChecklistItem {
  id: string;
  section: SectionId;
  /** Action concrète, formulée à l'impératif. */
  actionFr: string;
  actionEn: string;
  /** Pourquoi, en une ligne. */
  whyFr: string;
  whyEn: string;
  /** Qui peut le faire : en interne ou via un prestataire. */
  level: Level;
}

export const SECTIONS: ChecklistSection[] = [
  {
    id: "acces",
    order: 1,
    titleFr: "Vérifier que les IA peuvent lire votre site",
    titleEn: "Make sure AI engines can read your site",
    subtitleFr: "Le prérequis avant tout effort éditorial : porte ouverte aux robots IA.",
    subtitleEn: "The prerequisite before any editorial effort: keep the door open to AI crawlers.",
  },
  {
    id: "citabilite",
    order: 2,
    titleFr: "Transformer vos pages clés en réponses",
    titleEn: "Turn your key pages into answers",
    subtitleFr: "Le cœur du GEO — éditorial, pas technique : des réponses, pas des plaquettes.",
    subtitleEn: "The heart of GEO — editorial, not technical: answers, not brochures.",
  },
  {
    id: "structure",
    order: 3,
    titleFr: "Structurer et baliser",
    titleEn: "Structure and mark up",
    subtitleFr: "Structure éditoriale d'abord, données structurées ensuite.",
    subtitleEn: "Editorial structure first, structured data second.",
  },
  {
    id: "autorite",
    order: 4,
    titleFr: "Exister en dehors de votre site",
    titleEn: "Exist beyond your own site",
    subtitleFr: "Chantier continu : les moteurs IA croisent les sources avant de citer.",
    subtitleEn: "An ongoing effort: AI engines cross-check sources before citing.",
  },
];

export const ITEMS: ChecklistItem[] = [
  // ── Chantier 1 : accès technique ────────────────────────────────────────
  {
    id: "robots-txt",
    section: "acces",
    actionFr:
      "Ouvrez votre-site.fr/robots.txt et vérifiez qu'aucune ligne ne bloque OAI-SearchBot, PerplexityBot, ClaudeBot ou GPTBot.",
    actionEn:
      "Open yoursite.com/robots.txt and check no line blocks OAI-SearchBot, PerplexityBot, ClaudeBot or GPTBot.",
    whyFr: "Un moteur IA qui ne peut pas lire vos pages ne vous citera jamais.",
    whyEn: "An AI engine that can't read your pages will never cite you.",
    level: "interne",
  },
  {
    id: "cdn-parefeu",
    section: "acces",
    actionFr:
      "Faites vérifier côté CDN et pare-feu (Cloudflare, WAF…) qu'aucune règle anti-bot ne bloque ces mêmes robots IA.",
    actionEn:
      "Have your CDN and firewall (Cloudflare, WAF…) checked so no anti-bot rule blocks those same AI crawlers.",
    whyFr: "Beaucoup de blocages viennent du CDN, pas du robots.txt — et personne ne les voit.",
    whyEn: "Many blocks come from the CDN, not robots.txt — and nobody sees them.",
    level: "prestataire",
  },
  {
    id: "indexation",
    section: "acces",
    actionFr:
      "Vérifiez que vos pages clés sont indexées dans Google et Bing (recherche site:votre-domaine.fr).",
    actionEn:
      "Check that your key pages are indexed in Google and Bing (search site:yourdomain.com).",
    whyFr: "Les moteurs IA s'appuient largement sur ces index classiques.",
    whyEn: "AI engines rely heavily on those classic indexes.",
    level: "interne",
  },
  {
    id: "html-brut",
    section: "acces",
    actionFr:
      "Affichez le « code source » d'une page clé : votre texte doit y figurer sans exécuter JavaScript.",
    actionEn:
      "Open 'view page source' on a key page: your text must be there without running JavaScript.",
    whyFr: "La plupart des crawlers IA lisent le HTML brut, pas le rendu JavaScript.",
    whyEn: "Most AI crawlers read raw HTML, not the JavaScript-rendered page.",
    level: "interne",
  },
  {
    id: "vitesse",
    section: "acces",
    actionFr:
      "Testez la vitesse de vos pages clés (PageSpeed Insights) et faites corriger ce qui les ralentit.",
    actionEn:
      "Test your key pages' speed (PageSpeed Insights) and get what slows them down fixed.",
    whyFr: "Les robots IA délaissent les pages lentes — constat de terrain récurrent.",
    whyEn: "AI crawlers neglect slow pages — a recurring field observation.",
    level: "prestataire",
  },
  {
    id: "llms-txt",
    section: "acces",
    actionFr:
      "Ajoutez un fichier llms.txt à la racine : quelques lignes qui présentent le site et listent vos pages clés.",
    actionEn:
      "Add an llms.txt file at the root: a few lines introducing the site and listing your key pages.",
    whyFr: "Standard récent : un signal d'avance qui guide les modèles IA vers vos contenus.",
    whyEn: "A recent standard: an early signal that guides AI models to your content.",
    level: "interne",
  },

  // ── Chantier 2 : pages-réponses (citabilité) ────────────────────────────
  {
    id: "pages-cles",
    section: "citabilite",
    actionFr:
      "Listez vos 5 à 10 pages stratégiques : offres, expertises, questions d'avant-achat.",
    actionEn:
      "List your 5 to 10 strategic pages: offers, expertise, pre-purchase questions.",
    whyFr: "La moitié de l'impact GEO vient de la réécriture de ces pages — pas de tout le site.",
    whyEn: "Half of the GEO impact comes from rewriting those pages — not the whole site.",
    level: "interne",
  },
  {
    id: "titre-question",
    section: "citabilite",
    actionFr: "Donnez à chaque page clé une vraie question de client en titre.",
    actionEn: "Give each key page a real customer question as its title.",
    whyFr: "Les moteurs génératifs citent des réponses, pas des plaquettes « nos valeurs, nos services ».",
    whyEn: "Generative engines cite answers, not 'our values, our services' brochures.",
    level: "interne",
  },
  {
    id: "reponse-directe",
    section: "citabilite",
    actionFr:
      "Placez la réponse directe dans le premier paragraphe : 3-4 phrases citables telles quelles.",
    actionEn:
      "Put the direct answer in the first paragraph: 3-4 sentences citable as they are.",
    whyFr: "C'est cet extrait que les moteurs IA reprennent — pas un teaser qui fait défiler.",
    whyEn: "That's the snippet AI engines pick up — not a teaser that makes people scroll.",
    level: "interne",
  },
  {
    id: "chiffres-verdicts",
    section: "citabilite",
    actionFr:
      "Ajoutez chiffres, comparatifs et verdicts explicites (« pour tel profil : oui, parce que… »).",
    actionEn:
      "Add numbers, comparisons and explicit verdicts ('for this profile: yes, because…').",
    whyFr: "Les moteurs IA privilégient les pages qui donnent des chiffres et qui tranchent.",
    whyEn: "AI engines favor pages that give numbers and take a stance.",
    level: "interne",
  },
  {
    id: "definitions",
    section: "citabilite",
    actionFr:
      "Définissez vos termes métier en une phrase nette, au début de la section concernée.",
    actionEn:
      "Define your trade terms in one crisp sentence, at the start of the relevant section.",
    whyFr: "Les définitions courtes sont les extraits les plus faciles à citer.",
    whyEn: "Short definitions are the easiest snippets to cite.",
    level: "interne",
  },
  {
    id: "dates",
    section: "citabilite",
    actionFr:
      "Affichez une date de mise à jour visible et réactualisez vos pages stratégiques (chiffres, année en cours).",
    actionEn:
      "Show a visible updated date and refresh your strategic pages (numbers, current year).",
    whyFr: "Les moteurs IA écartent ce qui semble périmé.",
    whyEn: "AI engines discard what looks stale.",
    level: "interne",
  },
  {
    id: "test-reel",
    section: "citabilite",
    actionFr:
      "Demandez à ChatGPT et Perplexity « quel [votre métier] recommandes-tu pour [votre cible] ? » et notez qui est cité.",
    actionEn:
      "Ask ChatGPT and Perplexity 'which [your trade] would you recommend for [your audience]?' and note who gets cited.",
    whyFr: "Le test en conditions réelles : votre point de départ mesurable.",
    whyEn: "The real-world test: your measurable starting point.",
    level: "interne",
  },

  // ── Chantier 3 : structure et balisage ──────────────────────────────────
  {
    id: "hierarchie",
    section: "structure",
    actionFr:
      "Vérifiez la hiérarchie de titres de vos pages clés : chaque H2 répond à une sous-question réelle et se lit seul.",
    actionEn:
      "Check your key pages' heading hierarchy: each H2 answers a real sub-question and stands on its own.",
    whyFr: "Les moteurs IA extraient des sections autonomes, pas des pages entières.",
    whyEn: "AI engines extract self-contained sections, not whole pages.",
    level: "interne",
  },
  {
    id: "faq",
    section: "structure",
    actionFr:
      "Ajoutez une FAQ de 3 à 7 vraies questions de clients en bas de vos pages clés.",
    actionEn:
      "Add a 3-7 question FAQ with real customer questions at the bottom of your key pages.",
    whyFr: "Le format question/réponse est le plus repris par les moteurs IA.",
    whyEn: "Q&A is the format AI engines pick up most.",
    level: "interne",
  },
  {
    id: "faqpage",
    section: "structure",
    actionFr: "Faites baliser ces FAQ en données structurées FAQPage (JSON-LD).",
    actionEn: "Have those FAQs marked up as FAQPage structured data (JSON-LD).",
    whyFr: "Le balisage décrit vos questions/réponses en langage machine.",
    whyEn: "Markup describes your Q&A in machine language.",
    level: "prestataire",
  },
  {
    id: "schema-article",
    section: "structure",
    actionFr:
      "Faites ajouter les schémas Organization et Article (auteur, dates) sur vos pages clés.",
    actionEn:
      "Have Organization and Article schemas (author, dates) added to your key pages.",
    whyFr: "Sur le terrain, les pages balisées ressortent plus souvent dans les réponses des moteurs IA.",
    whyEn: "In the field, marked-up pages show up more often in AI engine answers.",
    level: "prestataire",
  },
  {
    id: "localbusiness",
    section: "structure",
    actionFr:
      "Activité locale : faites ajouter LocalBusiness (nom, adresse, horaires), cohérent avec vos fiches externes.",
    actionEn:
      "Local business? Have LocalBusiness (name, address, hours) added, consistent with your external listings.",
    whyFr: "La cohérence lisible par les machines renforce la confiance des moteurs.",
    whyEn: "Machine-readable consistency builds engine trust.",
    level: "prestataire",
  },
  {
    id: "validation",
    section: "structure",
    actionFr: "Validez le balisage d'une page clé sur validator.schema.org.",
    actionEn: "Validate one key page's markup on validator.schema.org.",
    whyFr: "Deux minutes pour savoir ce que les machines voient vraiment.",
    whyEn: "Two minutes to know what machines actually see.",
    level: "interne",
  },

  // ── Chantier 4 : autorité externe ───────────────────────────────────────
  {
    id: "annuaires",
    section: "autorite",
    actionFr:
      "Inscrivez l'entreprise dans les annuaires professionnels de votre secteur — mêmes nom, activité et localisation partout.",
    actionEn:
      "List the company in your sector's trade directories — same name, activity and location everywhere.",
    whyFr: "Les moteurs IA croisent les sources avant de recommander.",
    whyEn: "AI engines cross-check sources before recommending.",
    level: "interne",
  },
  {
    id: "avis",
    section: "autorite",
    actionFr: "Collectez des avis clients circonstanciés (Google, plateformes métier).",
    actionEn: "Collect detailed customer reviews (Google, trade platforms).",
    whyFr: "Un avis détaillé est une mention externe qui pèse et qui se cite.",
    whyEn: "A detailed review is an external mention that carries weight and gets cited.",
    level: "interne",
  },
  {
    id: "mentions",
    section: "autorite",
    actionFr:
      "Provoquez des mentions : études de cas publiées chez vos clients, interviews, presse locale ou spécialisée.",
    actionEn:
      "Earn mentions: case studies published by your clients, interviews, local or trade press.",
    whyFr: "Un site que personne ne mentionne est un site que les IA n'ont aucune raison de croire.",
    whyEn: "A site nobody mentions is a site AIs have no reason to trust.",
    level: "interne",
  },
  {
    id: "regularite",
    section: "autorite",
    actionFr: "Bloquez une demi-journée par mois pour entretenir ce chantier continu.",
    actionEn: "Block half a day per month to keep this ongoing effort alive.",
    whyFr: "Quelques mentions régulières valent mieux qu'une campagne ponctuelle.",
    whyEn: "A few regular mentions beat a one-off campaign.",
    level: "interne",
  },
  {
    id: "suivi",
    section: "autorite",
    actionFr:
      "Re-testez chaque trimestre votre présence dans ChatGPT et Perplexity, et notez l'évolution.",
    actionEn:
      "Re-test your presence in ChatGPT and Perplexity every quarter, and track the trend.",
    whyFr: "Le GEO se pilote : sans mesure, impossible de savoir si vos actions paient.",
    whyEn: "GEO needs steering: without measurement you can't tell if your actions pay off.",
    level: "interne",
  },
];

export const TOTAL_ITEMS = ITEMS.length;

export interface Progress {
  done: number;
  total: number;
  /** Pourcentage entier 0-100. */
  pct: number;
}

/** Ne compte que les ids réellement présents dans la checklist. */
export function computeProgress(checkedIds: readonly string[]): Progress {
  const valid = new Set(ITEMS.map((i) => i.id));
  const done = new Set(checkedIds.filter((id) => valid.has(id))).size;
  return { done, total: TOTAL_ITEMS, pct: Math.round((done / TOTAL_ITEMS) * 100) };
}

export function computeSectionProgress(
  checkedIds: readonly string[],
  section: SectionId,
): Progress {
  const items = ITEMS.filter((i) => i.section === section);
  const checked = new Set(checkedIds);
  const done = items.filter((i) => checked.has(i.id)).length;
  return {
    done,
    total: items.length,
    pct: items.length === 0 ? 0 : Math.round((done / items.length) * 100),
  };
}

// Escalier de CTA par température, proportionné à l'avancement :
// froid (on démarre) → comprendre + se situer (gratuit) ;
// tiède (chantier lancé) → prioriser en visio 150 € ;
// chaud (socle en place) → cadrer la suite 490 €.
export type CtaTier = "froid" | "tiede" | "chaud";

export const CTA_THRESHOLDS = { tiede: 30, chaud: 80 } as const;

export function getCtaTier(pct: number): CtaTier {
  if (pct >= CTA_THRESHOLDS.chaud) return "chaud";
  if (pct >= CTA_THRESHOLDS.tiede) return "tiede";
  return "froid";
}
