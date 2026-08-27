import type { Locale } from "@/i18n/routing";
import type { AuditObjective, AxisKey } from "./audit/quick-audit-types";

// ─── Contenu de la page /audit-site-web ───────────────────────────────────────
// Convention du repo (cf. lib/homepage-profiles.ts, lib/case-studies-data.ts) :
// le contenu marketing structuré et bilingue vit dans un module TS FR + EN avec
// un accesseur par locale, et non dans messages/*.json (réservé aux libellés
// courts + métadonnées). Tout le copy de la page passe par ici.
//
// Garde-fous éditoriaux :
// - perf nommée par LCP / INP / CLS (jamais TTFB) ;
// - le mot « Headless » n'apparaît ni dans le H1 ni dans les CTA principaux
//   (réservé au verdict C et à l'explication des verdicts).

export interface AuditExamplePriority {
  label: string;
  detail: string;
}

export interface AuditVerdict {
  code: "A" | "B" | "C" | "D";
  title: string;
  description: string;
  offerLabel: string;
  href: string;
}

export interface AuditProof {
  value: string;
  label: string;
}

export interface AuditFaqItem {
  question: string;
  answer: string;
}

export interface AuditPageContent {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    reassurance: string;
  };
  tool: {
    kicker: string;
    title: string;
    description: string;
    backToTools: string;
  };
  form: {
    urlLabel: string;
    urlPlaceholder: string;
    objectiveLabel: string;
    objectiveOptions: { value: AuditObjective; label: string }[];
    cmsLabel: string;
    cmsPlaceholder: string;
    cmsHint: string;
    submit: string;
    analyzing: string;
  };
  result: {
    kicker: string;
    title: string;
    scoreLabel: string;
    scoreCaption: string;
    axesTitle: string;
    axisLabels: Record<AxisKey, string>;
    estimate: string;
    cwvLoading: string;
    positivesLabel: string;
    problemsTitle: string;
    orientationTitle: string;
    orientationHint: string;
    techLabel: string;
    wordpressDetected: string;
    unreachableTitle: string;
  };
  email: {
    kicker: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyOptional: string;
    companyPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    bookingLabel: string;
    bookingHref: string;
    privacy: string;
    error: string;
  };
  example: {
    kicker: string;
    title: string;
    description: string;
    score: number;
    scoreLabel: string;
    scoreCaption: string;
    priorities: AuditExamplePriority[];
  };
  pourQui: {
    kicker: string;
    title: string;
    items: string[];
    triPhrase: string;
    triCta: string;
    triHref: string;
  };
  preuves: {
    kicker: string;
    title: string;
    items: AuditProof[];
  };
  commentLire: {
    kicker: string;
    title: string;
    description: string;
    verdicts: AuditVerdict[];
  };
  limites: {
    kicker: string;
    title: string;
    detectsTitle: string;
    detects: string[];
    notReplaceTitle: string;
    notReplace: string[];
  };
  faq: {
    kicker: string;
    title: string;
    items: AuditFaqItem[];
  };
  ctaFinal: {
    kicker: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}

// ─── Français ────────────────────────────────────────────────────────────────

const AUDIT_PAGE_FR: AuditPageContent = {
  hero: {
    title: "Voyez ce qui ralentit votre site en 2 minutes",
    subtitle:
      "Une adresse, un rapport : votre site analysé selon 4 axes (performance, référencement, accessibilité, conversion), puis une orientation concrète vers l'une des trois trajectoires : consolider, découpler ou refonder.",
    ctaPrimary: "Analyser mon site",
    reassurance:
      "Résultat immédiat, sans inscription. Vos coordonnées ne servent qu'à votre audit gratuit, si vous le demandez.",
  },
  tool: {
    kicker: "Analyse",
    title: "Lancez votre diagnostic",
    description:
      "Indiquez l'URL et votre objectif : vous obtenez un diagnostic immédiat de votre site. Pour aller plus loin, demandez un audit gratuit que je réalise personnellement.",
    backToTools: "Retour aux outils",
  },
  form: {
    urlLabel: "URL de votre site",
    urlPlaceholder: "https://votre-site.fr",
    objectiveLabel: "Votre objectif principal",
    objectiveOptions: [
      { value: "vitesse", label: "Améliorer la vitesse" },
      { value: "demandes", label: "Générer plus de demandes" },
      { value: "design", label: "Refondre le design" },
      { value: "seo", label: "Améliorer le SEO" },
      { value: "headless", label: "Savoir si le Headless est pertinent" },
      { value: "refonte", label: "Préparer une refonte complète" },
    ],
    cmsLabel: "CMS utilisé",
    cmsPlaceholder: "WordPress, Wix, autre…",
    cmsHint: "Optionnel",
    submit: "Analyser mon site",
    analyzing: "Analyse en cours…",
  },
  result: {
    kicker: "Résultat",
    title: "Votre diagnostic instantané",
    scoreLabel: "sur 100",
    scoreCaption: "Score global",
    axesTitle: "Détail par axe",
    axisLabels: {
      performance: "Performance",
      seo: "SEO",
      accessibility: "Accessibilité",
      conversion: "Conversion",
    },
    estimate: "Estimation",
    cwvLoading: "Mesure des Core Web Vitals…",
    positivesLabel: "Points forts",
    problemsTitle: "3 priorités détectées",
    orientationTitle: "Orientation préliminaire",
    orientationHint:
      "Première orientation basée sur votre objectif et les signaux mesurés du site. Un audit approfondi affine ce diagnostic.",
    techLabel: "Stack détectée",
    wordpressDetected: "WordPress détecté",
    unreachableTitle: "Page non récupérée",
  },
  email: {
    kicker: "Audit gratuit",
    title: "Je réalise votre audit gratuitement",
    description:
      "Laissez vos coordonnées : j'analyse votre site personnellement et je vous envoie un audit détaillé — priorités, budget indicatif et délai — sans engagement.",
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    companyLabel: "Entreprise",
    companyOptional: "(optionnel)",
    companyPlaceholder: "Votre entreprise",
    emailLabel: "Email",
    emailPlaceholder: "vous@email.com",
    submit: "Demander mon audit gratuit",
    sending: "Envoi en cours…",
    successTitle: "Demande envoyée",
    successBody:
      "Merci ! Je vais analyser votre site et vous envoyer votre audit gratuit sous quelques jours, à l'adresse indiquée.",
    bookingLabel: "Réserver un échange",
    bookingHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    privacy:
      "Vos coordonnées servent uniquement à réaliser et vous envoyer votre audit. Aucune revente.",
    error: "L'envoi a échoué. Vérifiez votre email et réessayez.",
  },
  example: {
    kicker: "Exemple",
    title: "À quoi ressemble un diagnostic",
    description:
      "Un exemple anonymisé : un score global, trois priorités classées par impact et une orientation d'architecture.",
    score: 62,
    scoreLabel: "sur 100",
    scoreCaption: "Exemple anonymisé",
    priorities: [
      {
        label: "Priorité 1 — Vitesse mobile",
        detail: "Optimiser le thème, les images et le rendu initial.",
      },
      {
        label: "Priorité 2 — Conversion",
        detail: "Clarifier le CTA principal au-dessus de la ligne de flottaison.",
      },
      {
        label: "Priorité 3 — Architecture",
        detail: "Headless non prioritaire, sauf SEO éditorial fort.",
      },
    ],
  },
  pourQui: {
    kicker: "Pour qui",
    title: "Pour qui ?",
    items: [
      "Sites WordPress déjà en ligne",
      "PME, structures de l'ESS et projets éditoriaux",
      "Sites lents, datés ou difficiles à faire évoluer",
    ],
    triPhrase:
      "Si vous n'avez pas encore de site, commencez par le diagnostic projet.",
    triCta: "Diagnostic projet",
    triHref: "/solutions-web/eligibilite",
  },
  preuves: {
    kicker: "Preuves",
    title: "Des résultats déjà livrés",
    items: [
      { value: "+25", label: "projets livrés depuis 2020" },
      { value: "45 → 98", label: "PageSpeed mobile (Proditec)" },
      { value: "2 mois", label: "Panorama Pub livré" },
    ],
  },
  commentLire: {
    kicker: "Verdicts",
    title: "Comment lire le verdict ?",
    description:
      "Le diagnostic conclut sur l'une de ces quatre orientations. Chacune renvoie vers l'offre correspondante.",
    verdicts: [
      {
        code: "A",
        title: "A — Optimiser votre WordPress actuel",
        description:
          "Votre site est sain mais bridé par le thème, les images ou des plugins lourds. Quelques optimisations ciblées suffisent à regagner vitesse et stabilité.",
        offerLabel: "Voir l'offre WordPress optimisé",
        href: "/solutions-web",
      },
      {
        code: "B",
        title: "B — Refondre sous WordPress",
        description:
          "La base est trop datée ou rigide pour être rattrapée. Une refonte WordPress propre, rapide et facile à gérer remet le site au niveau.",
        offerLabel: "Voir l'offre refonte WordPress",
        href: "/solutions-web",
      },
      {
        code: "C",
        title: "C — Passer en Headless WordPress + Next.js",
        description:
          "Contenu éditorial fréquent et exigence forte de performance ou de SEO : un front Next.js adossé à votre WordPress débloque vitesse et agilité.",
        offerLabel: "Voir l'offre Headless + Next.js",
        href: "/solutions-web",
      },
      {
        code: "D",
        title: "D — Cadrer une application métier",
        description:
          "Espace membre, logique métier, données structurées ou tableaux de bord : le besoin dépasse le site. On cadre une web app sur-mesure.",
        offerLabel: "En parler",
        href: "/contact",
      },
    ],
  },
  limites: {
    kicker: "Limites",
    title: "Ce que l'audit peut — et ne peut pas — faire",
    detectsTitle: "Ce que l'audit détecte",
    detects: [
      "Lenteurs visibles et Core Web Vitals dégradés",
      "Problèmes SEO fréquents",
      "Manque de clarté des CTA",
      "Signaux d'un WordPress difficile à faire évoluer",
      "Pertinence probable du Headless",
    ],
    notReplaceTitle: "Ce qu'il ne remplace pas",
    notReplace: [
      "Un audit technique complet",
      "L'accès à la Search Console",
      "Une analyse Analytics",
      "L'exploration du back-office WordPress",
      "Un cadrage fonctionnel approfondi",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        question: "Est-ce vraiment gratuit ?",
        answer:
          "Oui. Le diagnostic et le rapport sont gratuits et sans engagement : vous obtenez un verdict et une orientation d'architecture sans avoir à payer.",
      },
      {
        question: "Faut-il obligatoirement un site WordPress ?",
        answer:
          "Non, l'audit fonctionne sur n'importe quel site en ligne. Il est simplement le plus précis sur WordPress, où il évalue aussi la pertinence d'une migration. Si vous n'avez pas encore de site, commencez par le diagnostic projet.",
      },
      {
        question: "Est-ce que l'audit remplace un audit complet ?",
        answer:
          "Non. Il repère les problèmes visibles et oriente la décision. Un audit technique complet (Search Console, Analytics, back-office) reste nécessaire avant une refonte.",
      },
      {
        question: "Que faites-vous de mon URL ?",
        answer:
          "Elle sert uniquement à générer le diagnostic. Aucune revente, aucun usage commercial.",
      },
      {
        question: "Vais-je recevoir un devis automatiquement ?",
        answer:
          "Non. Vous recevez une recommandation, pas une facture. Le devis n'arrive que si vous le demandez, après échange.",
      },
    ],
  },
  ctaFinal: {
    kicker: "Et ensuite",
    title: "Prêt à savoir où vous en êtes ?",
    description: "Lancez le diagnostic, ou parlons directement de votre site.",
    primaryLabel: "Lancer l'audit",
    secondaryLabel: "Parler de mon site",
    secondaryHref: "/contact",
  },
};

// ─── English ─────────────────────────────────────────────────────────────────

const AUDIT_PAGE_EN: AuditPageContent = {
  hero: {
    title: "See what slows your site down in 2 minutes",
    subtitle:
      "One address, one report: your site analyzed across 4 axes (performance, search visibility, accessibility, conversion), then a concrete direction toward one of the three trajectories: consolidate, decouple or rebuild.",
    ctaPrimary: "Analyze my site",
    reassurance:
      "Instant result, no sign-up. Your details are only used for your free audit, if you ask for it.",
  },
  tool: {
    kicker: "Analysis",
    title: "Run your diagnosis",
    description:
      "Enter your URL and goal: you get an instant diagnosis of your site. To go further, request a free audit that I run personally.",
    backToTools: "Back to tools",
  },
  form: {
    urlLabel: "Your site URL",
    urlPlaceholder: "https://your-site.com",
    objectiveLabel: "Your main goal",
    objectiveOptions: [
      { value: "vitesse", label: "Improve speed" },
      { value: "demandes", label: "Generate more enquiries" },
      { value: "design", label: "Redesign" },
      { value: "seo", label: "Improve SEO" },
      { value: "headless", label: "See if Headless is relevant" },
      { value: "refonte", label: "Plan a full rebuild" },
    ],
    cmsLabel: "CMS used",
    cmsPlaceholder: "WordPress, Wix, other…",
    cmsHint: "Optional",
    submit: "Analyze my site",
    analyzing: "Analyzing…",
  },
  result: {
    kicker: "Result",
    title: "Your instant diagnosis",
    scoreLabel: "out of 100",
    scoreCaption: "Overall score",
    axesTitle: "Breakdown by axis",
    axisLabels: {
      performance: "Performance",
      seo: "SEO",
      accessibility: "Accessibility",
      conversion: "Conversion",
    },
    estimate: "Estimate",
    cwvLoading: "Measuring Core Web Vitals…",
    positivesLabel: "Strengths",
    problemsTitle: "3 priorities detected",
    orientationTitle: "Preliminary orientation",
    orientationHint:
      "A first orientation based on your goal and the measured site signals. An in-depth audit refines this diagnosis.",
    techLabel: "Detected stack",
    wordpressDetected: "WordPress detected",
    unreachableTitle: "Page not retrieved",
  },
  email: {
    kicker: "Free audit",
    title: "Get a free audit, done by me",
    description:
      "Leave your details: I'll review your site personally and send you a detailed audit — priorities, indicative budget and timeline — no commitment.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    companyLabel: "Company",
    companyOptional: "(optional)",
    companyPlaceholder: "Your company",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Request my free audit",
    sending: "Sending…",
    successTitle: "Request sent",
    successBody:
      "Thanks! I'll review your site and send your free audit within a few days, to the address you provided.",
    bookingLabel: "Book a call",
    bookingHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    privacy: "Your details are only used to produce and send your audit. No resale.",
    error: "Sending failed. Check your email and try again.",
  },
  example: {
    kicker: "Example",
    title: "What a diagnosis looks like",
    description:
      "An anonymized example: an overall score, three priorities ranked by impact, and an architecture direction.",
    score: 62,
    scoreLabel: "out of 100",
    scoreCaption: "Anonymized example",
    priorities: [
      {
        label: "Priority 1 — Mobile speed",
        detail: "Optimize the theme, images and initial render.",
      },
      {
        label: "Priority 2 — Conversion",
        detail: "Clarify the main CTA above the fold.",
      },
      {
        label: "Priority 3 — Architecture",
        detail: "Headless not a priority, unless strong editorial SEO.",
      },
    ],
  },
  pourQui: {
    kicker: "Who it's for",
    title: "Who is it for?",
    items: [
      "WordPress sites already online",
      "SMEs, social-economy organizations and editorial projects",
      "Sites that are slow, dated or hard to evolve",
    ],
    triPhrase:
      "If you don't have a site yet, start with the project diagnosis.",
    triCta: "Project diagnosis",
    triHref: "/solutions-web/eligibilite",
  },
  preuves: {
    kicker: "Proof",
    title: "Results already delivered",
    items: [
      { value: "+25", label: "projects delivered since 2020" },
      { value: "45 → 98", label: "mobile PageSpeed (Proditec)" },
      { value: "2 months", label: "Panorama Pub delivered" },
    ],
  },
  commentLire: {
    kicker: "Verdicts",
    title: "How to read the verdict",
    description:
      "The diagnosis concludes with one of these four directions. Each points to the matching offer.",
    verdicts: [
      {
        code: "A",
        title: "A — Optimize your current WordPress",
        description:
          "Your site is healthy but held back by the theme, images or heavy plugins. A few targeted optimizations are enough to regain speed and stability.",
        offerLabel: "See the optimized WordPress offer",
        href: "/solutions-web",
      },
      {
        code: "B",
        title: "B — Rebuild on WordPress",
        description:
          "The foundation is too dated or rigid to catch up. A clean, fast, easy-to-manage WordPress rebuild brings the site back up to standard.",
        offerLabel: "See the WordPress rebuild offer",
        href: "/solutions-web",
      },
      {
        code: "C",
        title: "C — Move to Headless WordPress + Next.js",
        description:
          "Frequent editorial content and high performance or SEO demands: a Next.js front-end on top of your WordPress unlocks speed and agility.",
        offerLabel: "See the Headless + Next.js offer",
        href: "/solutions-web",
      },
      {
        code: "D",
        title: "D — Scope a business application",
        description:
          "Member area, business logic, structured data or dashboards: the need goes beyond a website. We scope a custom web app.",
        offerLabel: "Let's talk",
        href: "/contact",
      },
    ],
  },
  limites: {
    kicker: "Limits",
    title: "What the audit can — and can't — do",
    detectsTitle: "What the audit detects",
    detects: [
      "Visible slowness and degraded Core Web Vitals",
      "Common SEO issues",
      "Unclear CTAs",
      "Signals of a WordPress that's hard to evolve",
      "Likely relevance of Headless",
    ],
    notReplaceTitle: "What it does not replace",
    notReplace: [
      "A full technical audit",
      "Search Console access",
      "An Analytics review",
      "Exploring the WordPress back-office",
      "In-depth functional scoping",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        question: "Is it really free?",
        answer:
          "Yes. The diagnosis and report are free and with no commitment: you get a verdict and an architecture direction without paying.",
      },
      {
        question: "Do I need a WordPress site?",
        answer:
          "No, the audit works on any live site. It's simply most precise on WordPress, where it also assesses whether a migration is worth it. If you don't have a site yet, start with the project diagnosis.",
      },
      {
        question: "Does the audit replace a full audit?",
        answer:
          "No. It spots visible issues and guides the decision. A full technical audit (Search Console, Analytics, back-office) is still needed before a rebuild.",
      },
      {
        question: "What do you do with my URL?",
        answer:
          "It's only used to generate the diagnosis. No resale, no commercial use.",
      },
      {
        question: "Will I automatically receive a quote?",
        answer:
          "No. You get a recommendation, not an invoice. A quote only comes if you ask for one, after a conversation.",
      },
    ],
  },
  ctaFinal: {
    kicker: "Next",
    title: "Ready to know where you stand?",
    description: "Run the diagnosis, or let's talk about your site directly.",
    primaryLabel: "Run the audit",
    secondaryLabel: "Talk about my site",
    secondaryHref: "/contact",
  },
};

// ─── Accesseur par locale ────────────────────────────────────────────────────

export function getAuditPageContent(locale: Locale): AuditPageContent {
  return locale === "en" ? AUDIT_PAGE_EN : AUDIT_PAGE_FR;
}
