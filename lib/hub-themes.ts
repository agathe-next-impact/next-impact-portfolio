// Données des pages thématiques du hub « Quelle techno web ? ».
// Chaque thème = une question de prospect déclinée en parcours 4 temps :
//   intro (la question posée) → conseil minimal → outil(s) → prestas possibles.
// Le composant <ThemePage> consomme ces données ; ajouter un thème = ajouter une
// entrée ici (pas de logique à toucher). Contenu bilingue inline (modèle :
// hub-rubriques.tsx / reparer-ou-refaire.tsx). Voix éditoriale : 1re personne,
// sobre, anti-hype. Doctrine : le contenu donne les critères, la presta les
// applique au cas du client (anti-cannibalisation).

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Blocks,
  Bot,
  Boxes,
  Calculator,
  ClipboardList,
  Compass,
  FileSearch,
  FileText,
  FlaskConical,
  GitCompare,
  Megaphone,
  Radar,
  ScanSearch,
  ScrollText,
  Smartphone,
  Wrench,
} from "lucide-react";

export type LocaleText = { fr: string; en: string };

/** Une voie possible du choix (les branches de la décision). */
export interface ThemeOption {
  label: LocaleText;
  detail: LocaleText;
}

/** Un point de conseil minimal (un critère + sa lecture courte). */
export interface ThemeAdvice {
  point: LocaleText;
  detail: LocaleText;
}

/** Un outil en ligne rattaché au thème. */
export interface ThemeTool {
  icon: LucideIcon;
  name: LocaleText;
  blurb: LocaleText;
  href: string;
}

/** Température du prospect : froid (regarde) → tiède (décide) → chaud (agit). */
export type Temp = "froid" | "tiede" | "chaud";

/** Une prestation possible en sortie de thème (la « prochaine étape »). */
export interface ThemePresta {
  name: LocaleText;
  price: LocaleText; // « Gratuit », « 150 € », « dès 6 500 € »…
  temp: Temp;
  blurb: LocaleText;
  cta: LocaleText;
  href: string;
}

export interface HubTheme {
  slug: string;
  index: string; // « № 02 »
  icon: LucideIcon;
  kicker: LocaleText; // libellé court (nav / kicker)
  question: LocaleText; // titre héros = la question posée
  intro: LocaleText; // sous-titre héros
  context: LocaleText; // paragraphe d'intro (parcours)
  options: ThemeOption[]; // les voies possibles
  advice: ThemeAdvice[]; // conseil minimal
  reading?: ThemeTool[]; // articles longs rattachés au thème (pilier, guides)
  tools: ThemeTool[];
  prestas: ThemePresta[];
  meta: { title: LocaleText; description: LocaleText };
  keywords: { fr: string[]; en: string[] };
}

export function tx(text: LocaleText, locale: string): string {
  return locale === "en" ? text.en : text.fr;
}

// Prestas réutilisées d'un thème à l'autre (mêmes offres, blurb adapté au thème).
const AUDIT_GRATUIT = (fr: string, en: string): ThemePresta => ({
  name: { fr: "Audit gratuit", en: "Free audit" },
  price: { fr: "Gratuit", en: "Free" },
  temp: "froid",
  blurb: { fr, en },
  cta: { fr: "Demander l'audit", en: "Request the audit" },
  href: "/audit-site-web",
});

const VISIO = (fr: string, en: string): ThemePresta => ({
  name: { fr: "Choix de techno web", en: "Web tech choice" },
  price: { fr: "150 €", en: "€150" },
  temp: "tiede",
  blurb: { fr, en },
  cta: { fr: "Réserver une visio", en: "Book a call" },
  href: "/conseil",
});

const ROADMAP = (temp: Temp, fr: string, en: string): ThemePresta => ({
  name: { fr: "Conseil architecture de projet IA", en: "AI project architecture advice" },
  price: { fr: "490 €", en: "€490" },
  temp,
  blurb: { fr, en },
  cta: { fr: "Cadrer l'architecture", en: "Scope the architecture" },
  href: "/conseil",
});

// ─────────────────────────────────────────────────────────────────────────────
// 01 — Choisir sa techno
// ─────────────────────────────────────────────────────────────────────────────
const choisir: HubTheme = {
  slug: "choisir",
  index: "№ 01",
  icon: GitCompare,
  kicker: { fr: "Choisir sa techno", en: "Choose your tech" },
  question: { fr: "Quelle techno pour mon site ?", en: "Which tech for my site?" },
  intro: {
    fr: "WordPress, Headless, no-code, SaaS, sur-mesure… Plutôt que de partir d'une techno à la mode, on part de votre besoin réel.",
    en: "WordPress, Headless, no-code, SaaS, custom… Rather than starting from a trendy stack, we start from your real need.",
  },
  context: {
    fr: "Le bon choix ne se devine pas au nom de l'outil. Un même site peut tourner sous WordPress, un SaaS ou un front sur-mesure — ce qui change, c'est l'autonomie, le budget, la maintenance et la capacité à évoluer. Partir de la techno avant le besoin, c'est le meilleur moyen de surpayer ou de se bloquer.",
    en: "The right choice isn't guessed from a tool's name. The same site can run on WordPress, a SaaS or a custom front — what differs is autonomy, budget, maintenance and room to evolve. Starting from the tech before the need is the surest way to overpay or get stuck.",
  },
  options: [
    {
      label: { fr: "WordPress optimisé", en: "Optimized WordPress" },
      detail: {
        fr: "Le terrain le plus polyvalent : autonomie éditoriale, écosystème mûr, coût maîtrisé.",
        en: "The most versatile ground: editorial autonomy, a mature ecosystem, controlled cost.",
      },
    },
    {
      label: { fr: "No-code / SaaS", en: "No-code / SaaS" },
      detail: {
        fr: "Quand l'outil standard existe déjà : rapide à lancer, peu de maintenance, moins de spécifique.",
        en: "When the standard tool already exists: fast to launch, low maintenance, less custom work.",
      },
    },
    {
      label: { fr: "Headless / sur-mesure", en: "Headless / custom" },
      detail: {
        fr: "Quand perf, image ou évolutivité priment : un front moderne ou une plateforme dédiée se justifient.",
        en: "When performance, brand or scalability come first: a modern front or a dedicated platform is justified.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "Partez du besoin, pas de l'outil", en: "Start from the need, not the tool" },
      detail: {
        fr: "Listez ce que le site doit faire et qui le gère au quotidien avant de comparer les technos. La techno découle du besoin, jamais l'inverse.",
        en: "List what the site must do and who runs it day to day before comparing stacks. The tech follows the need, never the reverse.",
      },
    },
    {
      point: { fr: "WordPress reste excellent dans beaucoup de cas", en: "WordPress is still excellent in many cases" },
      detail: {
        fr: "Pour un site éditorial autonome, il offre souvent le meilleur rapport autonomie/coût. Le quitter ne se justifie que par un vrai gain.",
        en: "For a self-managed editorial site, it often offers the best autonomy-to-cost ratio. Leaving it is only justified by a real gain.",
      },
    },
    {
      point: { fr: "Le Headless n'est pas une mode", en: "Headless isn't a fad" },
      detail: {
        fr: "Il devient pertinent quand la performance, l'expérience ou l'évolutivité le justifient — pas par principe.",
        en: "It becomes relevant when performance, experience or scalability justify it — not on principle.",
      },
    },
    {
      point: { fr: "Le sur-mesure se mérite", en: "Custom has to earn its place" },
      detail: {
        fr: "On ne développe spécifique que si aucun outil existant ne couvre le besoin sans contorsion. Sinon, c'est cher et lent pour rien.",
        en: "You only build custom if no existing tool covers the need without contortions. Otherwise it's expensive and slow for nothing.",
      },
    },
  ],
  reading: [
    {
      icon: FileText,
      name: {
        fr: "Quelle techno pour votre site à l'heure de l'IA ?",
        en: "Which tech for your site in the AI era?",
      },
      blurb: {
        fr: "L'analyse complète : les trois voies (sur-mesure, builders IA, plateformes), cinq critères d'arbitrage et un principe de durabilité.",
        en: "The full analysis: the three paths (custom, AI builders, platforms), five decision criteria and a durability principle.",
      },
      href: "/documentation/choisir/quelle-techno-ia",
    },
  ],
  tools: [
    {
      icon: Compass,
      name: { fr: "La Boussole Techno Web & IA", en: "The Web & AI Tech Compass" },
      blurb: {
        fr: "8 critères → la famille de techno la plus adaptée à votre besoin.",
        en: "8 criteria → the tech family that best fits your need.",
      },
      href: "/outils/boussole",
    },
    {
      icon: GitCompare,
      name: { fr: "Quiz WordPress ou Headless", en: "WordPress or Headless quiz" },
      blurb: {
        fr: "Quelques questions pour situer votre projet entre WordPress classique et Headless.",
        en: "A few questions to place your project between classic WordPress and Headless.",
      },
      href: "/documentation/wordpress-headless",
    },
    {
      icon: Blocks,
      name: { fr: "No-code, SaaS ou sur-mesure ?", en: "No-code, SaaS or custom?" },
      blurb: {
        fr: "Webflow, un SaaS du marché ou du développement : la famille recommandée pour votre cas.",
        en: "Webflow, an off-the-shelf SaaS or custom dev: the family recommended for your case.",
      },
      href: "/outils/nocode-saas-surmesure",
    },
    {
      icon: Calculator,
      name: { fr: "Simulateur de tarifs", en: "Pricing simulator" },
      blurb: {
        fr: "Une fourchette de budget indicative selon le type de site et les fonctionnalités.",
        en: "An indicative budget range by site type and features.",
      },
      href: "/tarifs",
    },
  ],
  prestas: [
    VISIO(
      "Une question techno précise ? On la tranche en visio, créditée si vous lancez un projet.",
      "A precise tech question? We settle it on a call, credited if you start a project.",
    ),
    ROADMAP(
      "chaud",
      "Projet structurant ? Un conseil architecture pour choisir la structure et prioriser.",
      "A structuring project? Architecture advice to choose the structure and set priorities.",
    ),
    AUDIT_GRATUIT(
      "Pas encore sûr ? Je regarde votre site et vous oriente.",
      "Not sure yet? I look at your site and point you the right way.",
    ),
  ],
  meta: {
    title: {
      fr: "Quelle techno pour mon site web ? WordPress, Headless, no-code ou sur-mesure",
      en: "Which tech for my website? WordPress, Headless, no-code or custom",
    },
    description: {
      fr: "WordPress, Headless, no-code, SaaS ou sur-mesure : partez du besoin, pas de l'outil. Les critères pour choisir, des outils de diagnostic et le conseil pour trancher.",
      en: "WordPress, Headless, no-code, SaaS or custom: start from the need, not the tool. The criteria to choose, diagnostic tools and the advice to decide.",
    },
  },
  keywords: {
    fr: ["quelle techno site web", "WordPress ou Headless", "no-code ou sur-mesure", "choisir techno web"],
    en: ["which web tech", "WordPress or Headless", "no-code or custom", "choose web technology"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 02 — IA & code
// ─────────────────────────────────────────────────────────────────────────────
const iaEtCode: HubTheme = {
  slug: "ia-et-code",
  index: "№ 02",
  icon: Bot,
  kicker: { fr: "IA & code", en: "AI & code" },
  question: {
    fr: "IA : prototype jetable ou vrai produit ?",
    en: "AI: throwaway prototype or real product?",
  },
  intro: {
    fr: "L'IA permet de générer un site ou un outil en quelques heures. La vraie question n'est plus « est-ce possible », mais « faut-il le construire, et comment le rendre durable ».",
    en: "AI can generate a site or a tool in a few hours. The real question is no longer “is it possible”, but “should you build it, and how to make it last”.",
  },
  context: {
    fr: "Un prototype généré par IA impressionne en démo et s'effondre en production : pas de tests, dépendances opaques, personne pour le maintenir. Tout dépend de l'usage. Un jetable pour valider une idée n'a pas les mêmes exigences qu'un produit que des utilisateurs réels vont utiliser tous les jours.",
    en: "An AI-generated prototype dazzles in a demo and collapses in production: no tests, opaque dependencies, nobody to maintain it. It all depends on the use. A throwaway to validate an idea has nothing like the requirements of a product real users rely on daily.",
  },
  options: [
    {
      label: { fr: "Prototype jetable", en: "Throwaway prototype" },
      detail: {
        fr: "Pour valider une idée ou convaincre : l'IA suffit, on assume que ça finira à la corbeille.",
        en: "To validate an idea or convince: AI is enough, and you accept it'll end up in the bin.",
      },
    },
    {
      label: { fr: "À cadrer", en: "To frame" },
      detail: {
        fr: "L'idée tient, mais des utilisateurs réels arrivent : reprendre l'architecture avant d'aller plus loin.",
        en: "The idea holds, but real users are coming: rework the architecture before going further.",
      },
    },
    {
      label: { fr: "Produit maintenable", en: "Maintainable product" },
      detail: {
        fr: "Données sensibles, montée en charge, évolution : ça se construit proprement, IA ou pas.",
        en: "Sensitive data, scaling, evolution: it gets built properly, AI or not.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "L'IA code vite ; elle ne décide pas", en: "AI codes fast; it doesn't decide" },
      detail: {
        fr: "Générer n'est pas concevoir. Le choix de ce qu'on construit, et de ce qu'on ne construit pas, reste humain.",
        en: "Generating isn't designing. Choosing what to build — and what not to — stays human.",
      },
    },
    {
      point: { fr: "Le vrai coût d'un proto IA, c'est sa maintenance", en: "An AI prototype's real cost is maintenance" },
      detail: {
        fr: "Un code que personne ne comprend coûte plus cher à reprendre qu'à réécrire. Demandez-vous qui le maintiendra dans six mois.",
        en: "Code nobody understands costs more to take over than to rewrite. Ask who will maintain it in six months.",
      },
    },
    {
      point: { fr: "Cadrez avant de générer", en: "Frame before you generate" },
      detail: {
        fr: "Quelques décisions en amont — données, périmètre, propriété du code — évitent de reconstruire trois fois.",
        en: "A few upfront decisions — data, scope, code ownership — save you from rebuilding three times.",
      },
    },
    {
      point: { fr: "IA utile ≠ IA partout", en: "Useful AI ≠ AI everywhere" },
      detail: {
        fr: "Une fonctionnalité IA ne se justifie que si elle résout un vrai problème pour CE besoin. Sinon, c'est un gadget coûteux.",
        en: "An AI feature is only justified if it solves a real problem for THIS need. Otherwise it's an expensive gimmick.",
      },
    },
  ],
  reading: [
    {
      icon: GitCompare,
      name: {
        fr: "Site généré par IA vs site professionnel",
        en: "AI-generated site vs professional site",
      },
      blurb: {
        fr: "Le comparatif : ce que vaut un site généré par IA face à un site fait par un professionnel, avec des verdicts par cas d'usage.",
        en: "The comparison: how an AI-generated site stacks up against one built by a professional, with verdicts by use case.",
      },
      href: "/documentation/ia-et-code/site-genere-par-ia-vs-site-professionnel",
    },
    {
      icon: Wrench,
      name: {
        fr: "Reprendre un site généré par IA",
        en: "Taking over an AI-generated site",
      },
      blurb: {
        fr: "Votre site v0, Lovable ou Bolt pose problème : réparer, reprendre ou reconstruire — et qui peut le faire.",
        en: "Your v0, Lovable or Bolt site is in trouble: repair, take over or rebuild — and who can do it.",
      },
      href: "/documentation/ia-et-code/reprendre-un-site-genere-par-ia",
    },
  ],
  tools: [
    {
      icon: FlaskConical,
      name: { fr: "Prototype jetable ou maintenable ?", en: "Throwaway or maintainable prototype?" },
      blurb: {
        fr: "9 questions → l'enjeu de production de votre proto IA : OK, à cadrer ou à reconstruire.",
        en: "9 questions → your AI prototype's production stakes: fine, to frame, or to rebuild.",
      },
      href: "/outils/prototype-ia",
    },
    {
      icon: ScanSearch,
      name: { fr: "Diagnostic Web & IA", en: "Web & AI diagnostic" },
      blurb: {
        fr: "Un état des lieux de votre site et des opportunités — ou pièges — côté IA.",
        en: "A snapshot of your site and where AI helps — or doesn't.",
      },
      href: "/audit-site-web",
    },
    {
      icon: Compass,
      name: { fr: "La Boussole Techno Web & IA", en: "The Web & AI Tech Compass" },
      blurb: {
        fr: "Repartir du besoin avant de générer : la famille de solution adaptée.",
        en: "Start from the need before generating: the solution family that fits.",
      },
      href: "/outils/boussole",
    },
  ],
  prestas: [
    VISIO(
      "Un projet IA ou un proto à arbitrer ? On décide quoi construire en visio.",
      "An AI project or a prototype to weigh? We decide what to build on a call.",
    ),
    ROADMAP(
      "chaud",
      "Passer du proto au produit ? Un conseil architecture pour cadrer données, périmètre et structure.",
      "From prototype to product? Architecture advice to frame data, scope and structure.",
    ),
    AUDIT_GRATUIT(
      "Une idée à challenger ? Je regarde et vous oriente.",
      "An idea to challenge? I take a look and point you the right way.",
    ),
  ],
  meta: {
    title: {
      fr: "IA et site web : prototype jetable ou produit maintenable ?",
      en: "AI and websites: throwaway prototype or maintainable product?",
    },
    description: {
      fr: "L'IA code vite, mais faut-il construire ? Prototype jetable vs produit durable : les critères, un outil de diagnostic et le conseil pour cadrer avant de générer.",
      en: "AI codes fast, but should you build? Throwaway prototype vs durable product: the criteria, a diagnostic tool and the advice to frame before you generate.",
    },
  },
  keywords: {
    fr: ["IA site web", "prototype IA", "vibe coding", "IA produit maintenable"],
    en: ["AI website", "AI prototype", "vibe coding", "maintainable AI product"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 03 — Réparer ou refaire (thème pilote)
// ─────────────────────────────────────────────────────────────────────────────
const reparer: HubTheme = {
  slug: "reparer",
  index: "№ 03",
  icon: Wrench,
  kicker: { fr: "Réparer ou refaire", en: "Repair or rebuild" },
  question: {
    fr: "Réparer ou refaire mon site ?",
    en: "Repair or rebuild my site?",
  },
  intro: {
    fr: "Votre WordPress est-il en bout de course, ou suffit-il de le remettre d'aplomb ? La règle tient en une phrase : réparer quand c'est suffisant, refaire seulement quand c'est justifié.",
    en: "Is your WordPress at the end of the road, or does it just need a tune-up? One rule: repair when it's enough, rebuild only when it's justified.",
  },
  context: {
    fr: "Un site qui rame, qui casse à chaque mise à jour ou qui n'évolue plus pousse vite à tout refaire. Pourtant la refonte n'est pas toujours la bonne réponse : elle coûte cher et fait perdre l'acquis SEO. Avant de trancher, il faut séparer un problème ponctuel d'une vraie fin de vie technique.",
    en: "A site that lags, breaks on every update or no longer evolves quickly tempts a full rebuild. Yet rebuilding isn't always the right answer: it's expensive and sacrifices your SEO equity. Before deciding, separate a one-off problem from a real technical end of life.",
  },
  options: [
    {
      label: { fr: "Réparer", en: "Repair" },
      detail: {
        fr: "Un problème ciblé (bug, plugin, panne) sur un socle encore sain : une intervention courte suffit.",
        en: "A targeted problem (bug, plugin, outage) on a still-healthy base: a short fix is enough.",
      },
    },
    {
      label: { fr: "Optimiser", en: "Optimize" },
      detail: {
        fr: "Le site tient mais accumule de la dette : perf, sécurité, extensions à reprendre avant de décider.",
        en: "The site holds but is piling up debt: performance, security and plugins to clean up before deciding.",
      },
    },
    {
      label: { fr: "Refondre", en: "Rebuild" },
      detail: {
        fr: "Plusieurs signaux de fin de vie : repartir sur une base saine devient plus rentable que rafistoler.",
        en: "Several end-of-life signals: a clean base pays off more than endless patching.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "Regardez le socle, pas les symptômes", en: "Look at the base, not the symptoms" },
      detail: {
        fr: "Un site lent ou qui bugge n'est pas condamné. Ce qui condamne, c'est un socle figé : WordPress et PHP impossibles à mettre à jour, extensions abandonnées.",
        en: "A slow or buggy site isn't doomed. What dooms it is a frozen base: WordPress and PHP impossible to update, abandoned plugins.",
      },
    },
    {
      point: { fr: "La casse à répétition coûte plus cher que la refonte", en: "Repeated breakage costs more than a rebuild" },
      detail: {
        fr: "Si le site casse à chaque mise à jour, le rafistolage devient un puits sans fond. C'est le vrai signal de bascule.",
        en: "If the site breaks on every update, patching becomes a money pit. That's the real tipping point.",
      },
    },
    {
      point: { fr: "Le besoin d'évolution tranche souvent", en: "The need to evolve often decides it" },
      detail: {
        fr: "Tant que le site fait le travail, le réparer suffit. Le jour où il bloque vos projets, la refonte sert l'avenir — pas seulement l'esthétique.",
        en: "As long as the site does the job, repairing is enough. The day it blocks your plans, a rebuild serves the future — not just looks.",
      },
    },
    {
      point: { fr: "Un design daté n'est pas (à lui seul) un motif de refonte", en: "A dated design alone isn't a reason to rebuild" },
      detail: {
        fr: "Un rafraîchissement ciblé suffit souvent. La refonte complète ne se justifie que si la technique doit suivre aussi.",
        en: "A targeted refresh is often enough. A full rebuild is only justified if the tech must follow too.",
      },
    },
  ],
  reading: [
    {
      icon: Bot,
      name: {
        fr: "Votre site n'est pas un WordPress mais un site généré par IA ?",
        en: "Your site isn't a WordPress but an AI-generated site?",
      },
      blurb: {
        fr: "Le cas v0, Lovable, Bolt & co suit une autre logique que le WordPress : réparer, reprendre ou reconstruire — le guide dédié.",
        en: "The v0, Lovable, Bolt & co case follows a different logic than WordPress: repair, take over or rebuild — the dedicated guide.",
      },
      href: "/documentation/ia-et-code/reprendre-un-site-genere-par-ia",
    },
  ],
  tools: [
    {
      icon: Activity,
      name: { fr: "Réparer ou refaire ?", en: "Repair or rebuild?" },
      blurb: {
        fr: "9 vérifications → un score de santé /100 et un verdict clair : réparer, optimiser ou refondre.",
        en: "9 checks → a health score out of 100 and a clear verdict: repair, optimize or rebuild.",
      },
      href: "/outils/reparer-ou-refaire",
    },
    {
      icon: ScanSearch,
      name: { fr: "Auditer mon site", en: "Audit my site" },
      blurb: {
        fr: "Diagnostic réel de votre site — performance, Core Web Vitals, signaux techniques — en quelques minutes.",
        en: "A real diagnostic of your site — performance, Core Web Vitals, technical signals — in minutes.",
      },
      href: "/audit-site-web",
    },
  ],
  prestas: [
    VISIO(
      "Un doute réparer / refondre ? On tranche votre cas en une visio, créditée si vous lancez un projet.",
      "Torn between repair and rebuild? We settle your case on a call, credited if you start a project.",
    ),
    AUDIT_GRATUIT(
      "Pas encore sûr ? Je regarde votre site et vous oriente vers la bonne suite.",
      "Not sure yet? I look at your site and point you to the right next step.",
    ),
  ],
  meta: {
    title: {
      fr: "Réparer ou refaire mon site WordPress ?",
      en: "Repair or rebuild my WordPress site?",
    },
    description: {
      fr: "Réparer quand c'est suffisant, refaire seulement quand c'est justifié. Les signaux de fin de vie d'un site, un outil de diagnostic et les prestations pour décider.",
      en: "Repair when it's enough, rebuild only when it's justified. A site's end-of-life signals, a diagnostic tool and the services to help you decide.",
    },
  },
  keywords: {
    fr: ["réparer ou refaire WordPress", "refonte WordPress", "site en bout de course"],
    en: ["repair or rebuild WordPress", "WordPress rebuild", "site end of life"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 04 — Avant de signer
// ─────────────────────────────────────────────────────────────────────────────
const avantSigner: HubTheme = {
  slug: "avant-signer",
  index: "№ 04",
  icon: ScrollText,
  kicker: { fr: "Avant de signer", en: "Before you sign" },
  question: {
    fr: "Avant de signer un devis web",
    en: "Before signing a web quote",
  },
  intro: {
    fr: "Un devis de refonte ou une proposition d'agence sur la table ? Avant de vous engager, vérifiez la cohérence technique, le budget et les risques de dépendance.",
    en: "A redesign quote or an agency proposal on the table? Before you commit, check the technical coherence, the budget and the dependency risks.",
  },
  context: {
    fr: "Un mauvais choix techno coûte bien plus cher qu'un second avis : refonte à refaire, dépendance à un prestataire, postes surdimensionnés. La plupart des devis se lisent pourtant à l'œil nu une fois qu'on sait où regarder — propriété du code, hébergement, réversibilité, ce qui est récurrent.",
    en: "A bad tech choice costs far more than a second opinion: a redesign to redo, lock-in to one vendor, oversized line items. Yet most quotes read plainly once you know where to look — code ownership, hosting, reversibility, what's recurring.",
  },
  options: [
    {
      label: { fr: "Signer", en: "Sign" },
      detail: {
        fr: "Le devis est clair, cohérent et réversible : vous pouvez y aller.",
        en: "The quote is clear, coherent and reversible: you can go ahead.",
      },
    },
    {
      label: { fr: "Ajuster", en: "Adjust" },
      detail: {
        fr: "Bonne base, mais des points à clarifier ou renégocier avant de signer.",
        en: "Good base, but points to clarify or renegotiate before signing.",
      },
    },
    {
      label: { fr: "Second avis", en: "Second opinion" },
      detail: {
        fr: "Montant élevé, dépendance ou flou technique : un regard indépendant avant de vous engager.",
        en: "High amount, lock-in or technical haze: an independent look before you commit.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "Vérifiez à qui appartient le code", en: "Check who owns the code" },
      detail: {
        fr: "Sans accès au code et aux contenus, vous êtes captif. La propriété et la réversibilité passent avant le prix.",
        en: "Without access to the code and content, you're captive. Ownership and reversibility come before price.",
      },
    },
    {
      point: { fr: "Méfiez-vous des postes flous", en: "Beware vague line items" },
      detail: {
        fr: "« Développement sur mesure » sans détail, « SEO inclus » sans périmètre : ce qui n'est pas précisé sera facturé ou bâclé.",
        en: "“Custom development” with no detail, “SEO included” with no scope: what isn't specified gets billed later or done poorly.",
      },
    },
    {
      point: { fr: "Le récurrent compte autant que le one-shot", en: "Recurring costs matter as much as the one-off" },
      detail: {
        fr: "Abonnements, licences, maintenance obligatoire : additionnez le coût sur trois ans, pas seulement la facture initiale.",
        en: "Subscriptions, licenses, mandatory maintenance: add up the three-year cost, not just the initial invoice.",
      },
    },
    {
      point: { fr: "Surdimensionné = payé pour rien", en: "Oversized = paying for nothing" },
      detail: {
        fr: "Headless, app mobile ou CRM pour un site vitrine : la techno doit coller au besoin, pas à l'ambition du devis.",
        en: "Headless, a mobile app or a CRM for a brochure site: the tech must fit the need, not the quote's ambition.",
      },
    },
  ],
  tools: [
    {
      icon: FileSearch,
      name: { fr: "Décrypter mon devis", en: "Decode my quote" },
      blurb: {
        fr: "9 points de contrôle → un verdict : signer, ajuster ou demander un second avis.",
        en: "9 checkpoints → a verdict: sign, adjust or get a second opinion.",
      },
      href: "/outils/decrypteur-devis",
    },
    {
      icon: FileText,
      name: { fr: "Générer un cahier des charges", en: "Generate a project brief" },
      blurb: {
        fr: "Un brief clair à transmettre aux prestataires pour comparer ce qui est comparable.",
        en: "A clear brief to hand vendors so you compare like with like.",
      },
      href: "/cahier-des-charges",
    },
    {
      icon: Calculator,
      name: { fr: "Simulateur de tarifs", en: "Pricing simulator" },
      blurb: {
        fr: "Le prix attendu pour votre type de projet, pour situer un devis.",
        en: "The expected price for your type of project, to gauge a quote.",
      },
      href: "/tarifs",
    },
  ],
  prestas: [
    {
      name: { fr: "Choix de techno web", en: "Web tech choice" },
      price: { fr: "150 €", en: "€150" },
      temp: "chaud",
      blurb: {
        fr: "Un devis ou une proposition en main ? Un avis techno indépendant en visio avant de vous engager.",
        en: "A quote or proposal in hand? An independent tech opinion on a call before you commit.",
      },
      cta: { fr: "Un avis indépendant", en: "Get an independent opinion" },
      href: "/conseil",
    },
    VISIO(
      "Juste un doute à lever ? On en parle en visio, créditée sur un projet.",
      "Just one doubt to clear? We talk it through on a call, credited on a project.",
    ),
    AUDIT_GRATUIT(
      "Pas de devis encore ? Je diagnostique votre site et vous oriente.",
      "No quote yet? I diagnose your site and point you the right way.",
    ),
  ],
  meta: {
    title: {
      fr: "Comment lire un devis de site web avant de signer ?",
      en: "How to read a website quote before signing?",
    },
    description: {
      fr: "Propriété du code, postes flous, dépendance, surcoûts : les points à vérifier avant de signer un devis web, un outil pour le décrypter et un avis indépendant pour décider.",
      en: "Code ownership, vague items, lock-in, hidden costs: what to check before signing a web quote, a tool to decode it and an independent opinion to decide.",
    },
  },
  keywords: {
    fr: ["lire un devis site web", "second avis devis web", "devis refonte site", "pièges devis agence web"],
    en: ["read a web quote", "website quote second opinion", "redesign quote", "web agency quote pitfalls"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 05 — Outils métier
// ─────────────────────────────────────────────────────────────────────────────
const outilsMetier: HubTheme = {
  slug: "outils-metier",
  index: "№ 05",
  icon: Boxes,
  kicker: { fr: "Outils métier", en: "Business tools" },
  question: {
    fr: "Annuaire, carte, espace membre : faut-il le construire ?",
    en: "Directory, map, member area: should you build it?",
  },
  intro: {
    fr: "Un besoin métier — annuaire, cartographie, espace adhérent, réservation — ne justifie pas toujours du sur-mesure. Parfois un plugin ou un SaaS suffit ; parfois non.",
    en: "A business need — directory, mapping, member area, booking — doesn't always justify custom work. Sometimes a plugin or a SaaS is enough; sometimes not.",
  },
  context: {
    fr: "Entre le plugin WordPress bricolé et la plateforme développée sur mesure, il y a tout un spectre. Le bon niveau dépend du volume de données, du besoin de recherche ou de carte, de la gestion de comptes, des paiements et de la fréquence de mises à jour. Construire trop tôt coûte cher ; construire trop tard bloque la croissance.",
    en: "Between a patched-together WordPress plugin and a fully custom platform lies a whole spectrum. The right level depends on data volume, search or map needs, account management, payments and update frequency. Building too early is expensive; building too late blocks growth.",
  },
  options: [
    {
      label: { fr: "Plugin / extension", en: "Plugin / extension" },
      detail: {
        fr: "Besoin simple et standard sur un site existant : une extension bien choisie suffit.",
        en: "A simple, standard need on an existing site: a well-chosen extension does the job.",
      },
    },
    {
      label: { fr: "SaaS existant", en: "Existing SaaS" },
      detail: {
        fr: "Le besoin est courant et un outil du marché le couvre : moins de spécifique à maintenir.",
        en: "The need is common and a market tool covers it: less custom code to maintain.",
      },
    },
    {
      label: { fr: "Plateforme sur mesure", en: "Custom platform" },
      detail: {
        fr: "Volume, spécificité ou intégrations réelles : une plateforme dédiée devient rentable.",
        en: "Real volume, specificity or integrations: a dedicated platform becomes worth it.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "Comptez les entrées et les usages, pas les écrans", en: "Count entries and uses, not screens" },
      detail: {
        fr: "10 fiches ou 10 000, recherche simple ou carte filtrée : c'est le volume et l'usage qui dictent l'architecture.",
        en: "10 entries or 10,000, plain search or a filtered map: volume and usage dictate the architecture.",
      },
    },
    {
      point: { fr: "Un espace membre change la donne", en: "A member area changes everything" },
      detail: {
        fr: "Comptes, droits, paiements, données personnelles : dès qu'il y a de l'authentification, le standard atteint vite ses limites.",
        en: "Accounts, permissions, payments, personal data: once there's authentication, off-the-shelf hits its limits fast.",
      },
    },
    {
      point: { fr: "Le sur-mesure se justifie par la spécificité", en: "Custom is justified by specificity" },
      detail: {
        fr: "Si aucun outil du marché ne couvre votre métier sans contorsion, construire devient le choix rationnel.",
        en: "If no market tool covers your domain without contortions, building becomes the rational choice.",
      },
    },
    {
      point: { fr: "Prévoyez l'évolution dès le départ", en: "Plan for evolution from the start" },
      detail: {
        fr: "Une plateforme métier vit plusieurs années : mieux vaut une base qui porte vos projets qu'un bricolage à refaire.",
        en: "A business platform lives for years: better a base that carries your plans than a patch to redo.",
      },
    },
  ],
  tools: [
    {
      icon: Smartphone,
      name: { fr: "Diagnostic d'opportunité PWA", en: "PWA opportunity diagnostic" },
      blurb: {
        fr: "Votre besoin justifie-t-il une app installable plutôt qu'un simple site ?",
        en: "Does your need justify an installable app rather than a plain site?",
      },
      href: "/outils/audit-pwa",
    },
    {
      icon: Blocks,
      name: { fr: "No-code, SaaS ou sur-mesure ?", en: "No-code, SaaS or custom?" },
      blurb: {
        fr: "Plugin, outil du marché ou développement dédié : la famille recommandée.",
        en: "Plugin, market tool or custom dev: the recommended family.",
      },
      href: "/outils/nocode-saas-surmesure",
    },
    {
      icon: ClipboardList,
      name: { fr: "Diagnostic projet", en: "Project diagnostic" },
      blurb: {
        fr: "Quelques questions pour cadrer votre projet métier et sa faisabilité.",
        en: "A few questions to frame your business project and its feasibility.",
      },
      href: "/solutions-web/eligibilite",
    },
  ],
  prestas: [
    {
      name: { fr: "Plateforme métier", en: "Custom platform" },
      price: { fr: "dès 6 500 €", en: "from €6,500" },
      temp: "chaud",
      blurb: {
        fr: "Le besoin justifie le sur-mesure ? Conception d'annuaire, carte ou espace métier.",
        en: "Does the need justify custom? Directory, map or member-area design and build.",
      },
      cta: { fr: "Voir les services", en: "See the services" },
      href: "/solutions-web",
    },
    ROADMAP(
      "tiede",
      "Projet encore flou ? Un conseil architecture pour cadrer scénarios, fonctions et budget.",
      "Project still fuzzy? Architecture advice to frame scenarios, features and budget.",
    ),
    AUDIT_GRATUIT(
      "Juste explorer ? Je regarde votre cas et vous oriente.",
      "Just exploring? I look at your case and point you the right way.",
    ),
  ],
  meta: {
    title: {
      fr: "Annuaire, carte, espace membre : plugin, SaaS ou plateforme sur mesure ?",
      en: "Directory, map, member area: plugin, SaaS or custom platform?",
    },
    description: {
      fr: "Plugin, SaaS du marché ou plateforme dédiée : comment décider pour un annuaire, une carte interactive ou un espace membre. Les critères, des outils et le cadrage projet.",
      en: "Plugin, market SaaS or dedicated platform: how to decide for a directory, an interactive map or a member area. The criteria, tools and project framing.",
    },
  },
  keywords: {
    fr: ["annuaire WordPress ou sur mesure", "plateforme métier", "carte interactive site", "espace membre site web"],
    en: ["directory plugin vs custom", "custom business platform", "interactive map website", "member area website"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 06 — Présence et audience (remplace « Signal techno »)
// Réutilise des outils EXISTANTS : l'outil « Newsletter vs LinkedIn » a été annulé.
// ─────────────────────────────────────────────────────────────────────────────
const presence: HubTheme = {
  slug: "presence",
  index: "№ 06",
  icon: Megaphone,
  kicker: { fr: "Présence et audience", en: "Presence & audience" },
  question: {
    fr: "Site, newsletter, LinkedIn : où investir ?",
    en: "Site, newsletter, LinkedIn: where to invest?",
  },
  intro: {
    fr: "Construire son audience sur LinkedIn, c'est bâtir sur un terrain qu'on ne possède pas. Votre site et votre liste email, eux, vous appartiennent. La question : où mettre l'effort ?",
    en: "Building your audience on LinkedIn means building on land you don't own. Your site and your email list, on the other hand, are yours. The question: where to put the effort?",
  },
  context: {
    fr: "Une présence qui repose entièrement sur une plateforme louée — LinkedIn, Instagram, un réseau — peut disparaître du jour au lendemain : algorithme, suspension, changement de règles. Un site et une newsletter propriétaire sont des actifs : vous possédez les contacts, le référencement et la relation. Les deux ne s'opposent pas, mais l'un nourrit l'autre dans un sens précis.",
    en: "A presence resting entirely on rented land — LinkedIn, Instagram, a network — can vanish overnight: an algorithm change, a suspension, new rules. A site and an owned newsletter are assets: you hold the contacts, the SEO and the relationship. The two aren't opposed, but one feeds the other in a specific direction.",
  },
  options: [
    {
      label: { fr: "Réseaux sociaux", en: "Social networks" },
      detail: {
        fr: "Pour la portée et la découverte : on touche du monde, mais on loue l'audience.",
        en: "For reach and discovery: you reach people, but you rent the audience.",
      },
    },
    {
      label: { fr: "Newsletter propriétaire", en: "Owned newsletter" },
      detail: {
        fr: "Pour la relation directe : vous possédez les contacts, hors de portée d'un algorithme.",
        en: "For a direct relationship: you own the contacts, beyond any algorithm's reach.",
      },
    },
    {
      label: { fr: "Site comme socle", en: "Site as the foundation" },
      detail: {
        fr: "Pour la crédibilité et le SEO : l'actif central qui capte et convertit sur la durée.",
        en: "For credibility and SEO: the core asset that captures and converts over time.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "Possédez vos contacts", en: "Own your contacts" },
      detail: {
        fr: "Une liste email vous appartient ; vos abonnés LinkedIn appartiennent à LinkedIn. Faites converger l'audience louée vers de l'audience possédée.",
        en: "An email list is yours; your LinkedIn followers belong to LinkedIn. Funnel rented audience toward owned audience.",
      },
    },
    {
      point: { fr: "Le réseau social attire, le site convertit", en: "Social attracts, the site converts" },
      detail: {
        fr: "Servez-vous des plateformes pour être découvert, mais ramenez vers un site qui prouve et une newsletter qui entretient.",
        en: "Use platforms to get discovered, but bring people back to a site that proves and a newsletter that nurtures.",
      },
    },
    {
      point: { fr: "La délivrabilité et le SEO se construisent", en: "Deliverability and SEO are built" },
      detail: {
        fr: "Une newsletter propriétaire et un site bien structurés captent durablement — là où un post a la durée de vie d'un scroll.",
        en: "An owned newsletter and a well-structured site capture lastingly — where a post lives as long as a scroll.",
      },
    },
    {
      point: { fr: "Choisissez selon votre temps, pas la mode", en: "Choose by your time, not the trend" },
      detail: {
        fr: "Mieux vaut un canal tenu régulièrement que trois à l'abandon. La régularité bat la dispersion.",
        en: "Better one channel kept up regularly than three abandoned. Consistency beats scattering.",
      },
    },
  ],
  tools: [
    {
      icon: Compass,
      name: { fr: "La Boussole Techno Web & IA", en: "The Web & AI Tech Compass" },
      blurb: {
        fr: "Du besoin à la solution : où votre présence en ligne doit-elle s'ancrer ?",
        en: "From need to solution: where should your online presence anchor?",
      },
      href: "/outils/boussole",
    },
    {
      icon: ScanSearch,
      name: { fr: "Diagnostic Web & IA", en: "Web & AI diagnostic" },
      blurb: {
        fr: "Votre site joue-t-il son rôle d'actif central ? Un état des lieux rapide.",
        en: "Is your site pulling its weight as a core asset? A quick snapshot.",
      },
      href: "/audit-site-web",
    },
  ],
  prestas: [
    VISIO(
      "Où mettre l'effort ? On arbitre site, newsletter et réseaux en visio.",
      "Where to put the effort? We weigh site, newsletter and social on a call.",
    ),
    {
      name: { fr: "Sparring partner techno", en: "Tech sparring partner" },
      price: { fr: "dès 600 €/mois", en: "from €600/mo" },
      temp: "chaud",
      blurb: {
        fr: "Plusieurs sujets dans l'année ? Un accompagnement mensuel pour décider et avancer.",
        en: "Several topics across the year? A monthly retainer to decide and move forward.",
      },
      cta: { fr: "Voir l'accompagnement", en: "See the retainer" },
      href: "/conseil",
    },
    AUDIT_GRATUIT(
      "Un point de départ ? Je regarde votre présence et vous oriente.",
      "A starting point? I look at your presence and point you the right way.",
    ),
  ],
  meta: {
    title: {
      fr: "Site, newsletter ou LinkedIn : où construire son audience ?",
      en: "Site, newsletter or LinkedIn: where to build your audience?",
    },
    description: {
      fr: "Audience louée vs possédée : pourquoi votre site et votre newsletter sont des actifs, et comment articuler réseaux sociaux, email et site. Les critères et le conseil pour décider.",
      en: "Rented vs owned audience: why your site and newsletter are assets, and how to articulate social, email and site. The criteria and the advice to decide.",
    },
  },
  keywords: {
    fr: ["newsletter ou LinkedIn", "audience propriétaire", "site vs réseaux sociaux", "construire son audience web"],
    en: ["newsletter vs LinkedIn", "owned audience", "website vs social media", "build your audience online"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 07 — Être trouvé à l'heure de l'IA (SEO + GEO — absorbe la catégorie SEO)
// Textes provisoires sobres : le fond est correct, le rédacteur SEO/GEO affinera.
// ─────────────────────────────────────────────────────────────────────────────
const etreTrouve: HubTheme = {
  slug: "etre-trouve",
  index: "№ 07",
  icon: Radar,
  kicker: { fr: "Être trouvé à l'heure de l'IA", en: "Be found in the AI era" },
  question: {
    fr: "Comment être visible dans ChatGPT et les moteurs IA ?",
    en: "How do I get visible in ChatGPT and AI engines?",
  },
  intro: {
    fr: "Vos futurs clients ne cherchent plus seulement sur Google : ils posent leur question à ChatGPT, Perplexity ou aux AI Overviews. Être classé ne suffit plus — il faut être cité.",
    en: "Your future clients no longer search only on Google: they ask ChatGPT, Perplexity or AI Overviews. Ranking is no longer enough — you need to be cited.",
  },
  context: {
    fr: "Trois sigles, une définition chacun. Le SEO (Search Engine Optimization) vise le classement dans les résultats de Google. Le GEO (Generative Engine Optimization) vise la citation dans les réponses générées par ChatGPT, Perplexity ou les AI Overviews — l'AEO (Answer Engine Optimization) en est le quasi-synonyme. Faut-il choisir entre les deux ? Non : en 2026, les moteurs IA s'appuient d'abord sur des pages bien indexées, rapides et bien structurées. Le SEO reste le socle, le GEO est l'étage au-dessus — on les travaille dans cet ordre.",
    en: "Three acronyms, one definition each. SEO (Search Engine Optimization) targets ranking in Google's results. GEO (Generative Engine Optimization) targets being cited in answers generated by ChatGPT, Perplexity or AI Overviews — AEO (Answer Engine Optimization) is its near-synonym. Do you have to pick one? No: in 2026, AI engines still rely on well-indexed, fast, well-structured pages. SEO remains the foundation, GEO is the floor above — you work on them in that order.",
  },
  options: [
    {
      label: { fr: "D'abord consolider le SEO", en: "Consolidate SEO first" },
      detail: {
        fr: "Pages mal indexées, structure floue, contenus minces : tant que le socle a des trous, aucune optimisation IA ne les compensera.",
        en: "Poorly indexed pages, fuzzy structure, thin content: as long as the foundation has holes, no AI optimization will compensate.",
      },
    },
    {
      label: { fr: "Ajouter la couche GEO", en: "Add the GEO layer" },
      detail: {
        fr: "Le socle tient mais ChatGPT et Perplexity ne vous citent jamais : réponses directes, chiffres, sections extractibles — rendre vos pages citables.",
        en: "The foundation holds but ChatGPT and Perplexity never cite you: direct answers, figures, extractable sections — make your pages citable.",
      },
    },
    {
      label: { fr: "Revoir la base technique", en: "Fix the technical base" },
      detail: {
        fr: "Site lent, mal crawlable ou fermé aux robots IA : la visibilité se joue avant le contenu. Et si la question devient un choix de techno, c'est un autre arbitrage.",
        en: "A slow, poorly crawlable site, or one closed to AI crawlers: visibility is decided before the content. And if the question becomes a tech choice, that's a different decision.",
      },
    },
  ],
  advice: [
    {
      point: { fr: "SEO ou GEO n'est pas un choix, c'est un ordre", en: "SEO vs GEO isn't a choice, it's an order" },
      detail: {
        fr: "Les moteurs IA puisent dans les mêmes index et signaux que le SEO classique. Sans socle, pas de citation ; avec un socle propre, le GEO est un effort raisonnable.",
        en: "AI engines draw on the same indexes and signals as classic SEO. No foundation, no citation; with a clean foundation, GEO is a reasonable effort.",
      },
    },
    {
      point: { fr: "Les moteurs IA citent les pages qui tranchent", en: "AI engines cite pages that take a stance" },
      detail: {
        fr: "Réponse directe sous le titre, chiffres explicites, verdicts par profil, sections autonomes : c'est ce que ChatGPT et Perplexity reprennent — pas les pages qui tournent autour.",
        en: "A direct answer under the title, explicit figures, verdicts by profile, self-contained sections: that's what ChatGPT and Perplexity pick up — not pages that circle the question.",
      },
    },
    {
      point: { fr: "Vérifiez que les robots IA peuvent entrer", en: "Check that AI crawlers can get in" },
      detail: {
        fr: "OAI-SearchBot (ChatGPT Search), PerplexityBot, ClaudeBot, GPTBot : si votre robots.txt bloque ces robots de recherche IA, vous n'existez pas pour eux.",
        en: "OAI-SearchBot (ChatGPT Search), PerplexityBot, ClaudeBot, GPTBot: if your robots.txt blocks these AI search crawlers, you don't exist to them.",
      },
    },
    {
      point: { fr: "Mesurez avant d'optimiser", en: "Measure before you optimize" },
      detail: {
        fr: "Posez vos questions métier à ChatGPT et Perplexity : qui est cité aujourd'hui ? C'est votre point de départ, pas une opinion.",
        en: "Ask your business questions to ChatGPT and Perplexity: who gets cited today? That's your starting point, not an opinion.",
      },
    },
  ],
  reading: [
    {
      icon: FileSearch,
      name: {
        fr: "Comment ChatGPT et Perplexity choisissent leurs sources",
        en: "How ChatGPT and Perplexity choose their sources",
      },
      blurb: {
        fr: "La mécanique de la citation : ce que les robots IA font de vos pages, et les critères observables qui font qu'une page est reprise dans une réponse.",
        en: "The mechanics of citation: what AI crawlers do with your pages, and the observable criteria that get a page quoted in an answer.",
      },
      href: "/documentation/etre-trouve/comment-chatgpt-perplexity-choisissent-leurs-sources",
    },
    {
      icon: ScrollText,
      name: { fr: "Le guide GEO pour les PME", en: "The GEO guide for SMBs" },
      blurb: {
        fr: "Le plan d'action : quoi optimiser, dans quel ordre, avec quels moyens — et des verdicts par profil (vitrine, lead-gen, e-commerce).",
        en: "The action plan: what to optimize, in what order, with what resources — with verdicts by profile (brochure site, lead-gen, e-commerce).",
      },
      href: "/documentation/etre-trouve/guide-geo-pme",
    },
    {
      icon: FileText,
      name: { fr: "Les fondamentaux SEO", en: "SEO fundamentals" },
      blurb: {
        fr: "Arborescence, mots-clés, cocon sémantique et outils : le socle de référencement classique, avant la couche IA.",
        en: "Site structure, keywords, topic clusters and tools: the classic SEO foundation, before the AI layer.",
      },
      href: "/documentation/seo",
    },
    {
      icon: GitCompare,
      name: {
        fr: "Quelle techno pour votre site à l'heure de l'IA ?",
        en: "Which tech for your site in the AI era?",
      },
      blurb: {
        fr: "Si votre question est en réalité un choix d'outil ou de refonte : l'arbitrage techno se fait là, pas ici.",
        en: "If your question is really a tool or rebuild choice: the tech decision happens there, not here.",
      },
      href: "/documentation/choisir/quelle-techno-ia",
    },
  ],
  tools: [
    {
      icon: Radar,
      name: { fr: "Votre site est-il visible dans les moteurs IA ?", en: "Is your site visible in AI engines?" },
      blurb: {
        fr: "Un diagnostic gratuit : votre site est-il cité, citable et accessible aux robots IA ?",
        en: "A free diagnostic: is your site cited, citable and open to AI crawlers?",
      },
      href: "/outils/visibilite-ia",
    },
    {
      icon: ScanSearch,
      name: { fr: "Diagnostic Web & IA", en: "Web & AI diagnostic" },
      blurb: {
        fr: "Un état des lieux de votre site — performance, signaux techniques, visibilité.",
        en: "A snapshot of your site — performance, technical signals, visibility.",
      },
      href: "/audit-site-web",
    },
  ],
  prestas: [
    VISIO(
      "Une question précise — SEO, GEO, par quoi commencer ? On la tranche en visio, créditée si vous lancez un projet.",
      "A precise question — SEO, GEO, where to start? We settle it on a call, credited if you start a project.",
    ),
    ROADMAP(
      "chaud",
      "Visibilité à rebâtir ? Un conseil architecture pour cadrer contenu, structure, technique et priorités GEO.",
      "Visibility to rebuild? Architecture advice to frame content, structure, tech and GEO priorities.",
    ),
    AUDIT_GRATUIT(
      "Pas encore sûr ? Je regarde votre site et vous dis où vous en êtes.",
      "Not sure yet? I look at your site and tell you where you stand.",
    ),
  ],
  meta: {
    title: {
      fr: "Être visible dans ChatGPT : SEO, GEO ou les deux ?",
      en: "Visible in ChatGPT: SEO, GEO or both?",
    },
    description: {
      fr: "Référencement IA : ce qui fait qu'un site est cité par ChatGPT, Perplexity et les AI Overviews, et par où commencer. Diagnostic gratuit inclus.",
      en: "AI search visibility: what gets a site cited by ChatGPT, Perplexity and AI Overviews, and where to start. Free diagnostic included.",
    },
  },
  keywords: {
    fr: ["être visible dans ChatGPT", "référencement IA", "SEO ou GEO", "comment apparaître dans les réponses des IA"],
    en: ["be visible in ChatGPT", "AI search optimization", "SEO vs GEO", "appear in AI answers"],
  },
};

// Ordre = parcours du hub (Comprendre → Décider → Construire → Réparer → Présence → Visibilité).
export const HUB_THEMES: Record<string, HubTheme> = {
  choisir,
  "ia-et-code": iaEtCode,
  reparer,
  "avant-signer": avantSigner,
  "outils-metier": outilsMetier,
  presence,
  "etre-trouve": etreTrouve,
};

export function getHubTheme(slug: string): HubTheme | undefined {
  return HUB_THEMES[slug];
}

export function getHubThemeSlugs(): string[] {
  return Object.keys(HUB_THEMES);
}
