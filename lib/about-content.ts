import type { Locale } from "@/i18n/routing";

// Contenu GEO de la page /a-propos : bloc « En bref » (TL;DR citable par les LLMs)
// + FAQ centrée sur la PERSONNE et son parcours pluridisciplinaire (intention
// distincte de la FAQ service de la home → pas de cannibalisation). Source de
// vérité unique, consommée par le rendu visible (AboutClient) ET par le JSON-LD
// (FAQJsonLd dans page.tsx). Même convention que lib/home-content.ts.

export interface AboutFaqItem {
  question: string;
  answer: string;
}

export interface AboutContent {
  tldr: { label: string; lines: string[] };
  faq: { kicker: string; title: string; items: AboutFaqItem[] };
}

const FR: AboutContent = {
  tldr: {
    label: "En bref",
    lines: [
      "Agathe Karinthi-Martin est la fondatrice de Next Impact, studio solo de conseil et de développement web à l'heure de l'IA.",
      "Elle aborde chaque projet web sous quatre angles complémentaires : la technique, le business, le marketing et le design.",
      "20 ans d'expérience digitale — des fondations PHP/MySQL aux stacks Next.js, PostgreSQL et headless — dont 15 ans à piloter des projets côté édition.",
      "Cette vision globale sert à décider quoi construire, avec quelle techno et jusqu'où aller, avant de construire. Next Impact est prestataire TIH (30 % déductible de la contribution AGEFIPH).",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Questions fréquentes sur mon parcours",
    items: [
      {
        question: "Qui est Agathe Karinthi-Martin ?",
        answer:
          "Développeuse et fondatrice de Next Impact, elle conseille et construit des projets web à l'heure de l'IA. Son parcours réunit quatre compétences — technique, business, marketing et design — après 20 ans d'expérience digitale, dont 15 ans côté édition.",
      },
      {
        question: "En quoi un parcours pluridisciplinaire change-t-il le conseil ?",
        answer:
          "Un projet web n'est jamais qu'une question de code : il engage l'architecture technique, le modèle économique, l'audience et l'expérience. Avoir pratiqué ces quatre angles permet de comprendre un projet dans sa globalité et d'éviter les angles morts coûteux.",
      },
      {
        question: "Quelles technologies Agathe Karinthi-Martin maîtrise-t-elle ?",
        answer:
          "Des fondations PHP/MySQL aux stacks modernes : JavaScript (React, Next.js, Astro), PostgreSQL, WordPress et CMS headless (WordPress headless, Payload, Strapi). Le bon choix dépend du besoin, pas de la mode.",
      },
      {
        question: "Comment une consultante seule mène-t-elle des projets d'agence ?",
        answer:
          "En tenant la maîtrise d'ouvrage — cadrage, architecture, contrôle qualité — pendant que l'IA, guidée par 20 ans d'expérience, tient le chantier. Ce duo rend accessibles des projets d'une complexité auparavant réservée aux grandes structures. Le conseil oriente, la construction suit.",
      },
      {
        question: "Quelle reconnaissance extérieure ?",
        answer:
          "L'approche de modernisation Headless des sites WordPress de PME a été évoquée dans Le Figaro (mai 2026). Agathe Karinthi-Martin a par ailleurs publié des travaux universitaires sur la relation humain-machine (2012-2015).",
      },
    ],
  },
};

const EN: AboutContent = {
  tldr: {
    label: "In short",
    lines: [
      "Agathe Karinthi-Martin is the founder of Next Impact, a solo studio for web advice and development in the age of AI.",
      "She approaches every web project from four complementary angles: technical, business, marketing and design.",
      "20 years of digital experience — from PHP/MySQL foundations to Next.js, PostgreSQL and headless stacks — including 15 years steering projects on the editorial side.",
      "This holistic view helps decide what to build, with which technology and how far to go, before building. Next Impact is a French TIH provider (30% deductible from the AGEFIPH contribution).",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Common questions about my background",
    items: [
      {
        question: "Who is Agathe Karinthi-Martin?",
        answer:
          "A developer and the founder of Next Impact, she advises on and builds web projects in the age of AI. Her background brings together four skills — technical, business, marketing and design — after 20 years of digital experience, including 15 years on the editorial side.",
      },
      {
        question: "Why does a multidisciplinary background change the advice?",
        answer:
          "A web project is never just about code: it involves technical architecture, the business model, the audience and the experience. Having practised these four angles makes it possible to understand a project as a whole and avoid costly blind spots.",
      },
      {
        question: "Which technologies does Agathe Karinthi-Martin master?",
        answer:
          "From PHP/MySQL foundations to modern stacks: JavaScript (React, Next.js, Astro), PostgreSQL, WordPress and headless CMSs (headless WordPress, Payload, Strapi). The right choice depends on the need, not the trend.",
      },
      {
        question: "How can a solo consultant deliver agency-level projects?",
        answer:
          "By holding the project ownership — scoping, architecture, quality control — while AI, guided by 20 years of experience, runs the build. This pairing makes projects of a complexity once reserved for large firms accessible. Advice guides, implementation follows.",
      },
      {
        question: "Any external recognition?",
        answer:
          "The Headless modernization approach for SME WordPress sites was featured in Le Figaro (May 2026). Agathe Karinthi-Martin has also published academic work on the human-machine relationship (2012-2015).",
      },
    ],
  },
};

export function getAboutContent(locale: Locale): AboutContent {
  return locale === "en" ? EN : FR;
}
