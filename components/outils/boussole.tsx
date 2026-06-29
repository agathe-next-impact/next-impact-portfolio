"use client";

// La Boussole Techno Web & IA — outil maître (aiguilleur) du hub. 8 critères
// (besoin, usage, autonomie, budget, maintenance, données, évolutivité,
// time-to-value) → une famille recommandée parmi 6, puis routage vers l'outil
// spécialisé et l'offre adaptée. Anti-cannibalisation : l'outil donne le signal,
// la visio l'applique au cas réel. Modèle : components/outils/audit-pwa.tsx.
// Tokens DS uniquement, bilingue inline, client-side (zéro API).

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Compass, Info, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/reveal";

/* ─── Familles de solution (sorties possibles) ───────────────────────────── */

type Family =
  | "reparer"
  | "wordpress"
  | "nocode"
  | "headless"
  | "saas"
  | "surmesure";

// Ordre d'affichage stable + départage des ex æquo (simplicité d'abord).
const FAMILY_ORDER: Family[] = [
  "reparer",
  "wordpress",
  "nocode",
  "saas",
  "headless",
  "surmesure",
];

interface FamilyInfo {
  labelFr: string;
  labelEn: string;
  summaryFr: string;
  summaryEn: string;
  links: { labelFr: string; labelEn: string; href: string }[];
  next: { labelFr: string; labelEn: string; href: string };
}

const FAMILIES: Record<Family, FamilyInfo> = {
  reparer: {
    labelFr: "Réparer / optimiser l'existant",
    labelEn: "Repair / optimize what you have",
    summaryFr:
      "Votre site n'est pas forcément en bout de course. Avant une refonte coûteuse, une intervention ciblée (performance, sécurité, plugins, contenu) suffit souvent à débloquer la situation.",
    summaryEn:
      "Your site may not be at the end of the road. Before a costly rebuild, a targeted fix (performance, security, plugins, content) is often enough to unblock things.",
    links: [
      { labelFr: "Auditer mon site", labelEn: "Audit my site", href: "/audit-site-web" },
      { labelFr: "Dépannage WordPress", labelEn: "WordPress support", href: "/depannage-wordpress" },
    ],
    next: { labelFr: "Réparer dès 149 €", labelEn: "Fix it from €149", href: "/depannage-wordpress" },
  },
  wordpress: {
    labelFr: "WordPress optimisé",
    labelEn: "Optimized WordPress",
    summaryFr:
      "Pour un site vitrine ou de contenu où vous gardez la main au quotidien, un WordPress bien configuré reste imbattable en autonomie éditoriale et en time-to-value.",
    summaryEn:
      "For a showcase or content site where you stay in control day to day, a well-configured WordPress is unbeatable on editorial autonomy and time-to-value.",
    links: [
      { labelFr: "Comprendre le headless (pour comparer)", labelEn: "Understand headless (to compare)", href: "/wordpress-headless" },
      { labelFr: "Simulateur de tarifs", labelEn: "Pricing simulator", href: "/tarifs" },
    ],
    next: { labelFr: "Voir les solutions web", labelEn: "See the web solutions", href: "/solutions-web" },
  },
  nocode: {
    labelFr: "No-code (Webflow, Framer, Airtable…)",
    labelEn: "No-code (Webflow, Framer, Airtable…)",
    summaryFr:
      "Budget serré, besoin standard, lancement rapide : le no-code peut suffire. Restez vigilant sur le SEO, la propriété de la donnée et les limites quand le besoin grandira.",
    summaryEn:
      "Tight budget, standard need, fast launch: no-code can be enough. Stay mindful of SEO, data ownership and the ceilings you'll hit as the need grows.",
    links: [
      { labelFr: "En parler en visio", labelEn: "Talk it through on a call", href: "/conseil" },
      { labelFr: "Le blog techno", labelEn: "The tech blog", href: "/blog" },
    ],
    next: { labelFr: "Valider en visio — 180 €", labelEn: "Validate on a call — €180", href: "/conseil" },
  },
  headless: {
    labelFr: "Headless WordPress + Next.js",
    labelEn: "Headless WordPress + Next.js",
    summaryFr:
      "Quand la performance, le SEO, l'image premium ou le multi-canal sont stratégiques, le Headless garde l'admin WordPress et y greffe un front ultra-rapide.",
    summaryEn:
      "When performance, SEO, a premium feel or multi-channel delivery are strategic, Headless keeps the WordPress admin and grafts an ultra-fast front-end onto it.",
    links: [
      { labelFr: "Comprendre le headless", labelEn: "Understand headless", href: "/wordpress-headless" },
      { labelFr: "Quiz WordPress ou Headless", labelEn: "WordPress or Headless quiz", href: "/documentation/wordpress-headless" },
    ],
    next: { labelFr: "Voir les solutions web", labelEn: "See the web solutions", href: "/solutions-web" },
  },
  saas: {
    labelFr: "Un logiciel du marché (SaaS)",
    labelEn: "An off-the-shelf tool (SaaS)",
    summaryFr:
      "Si un outil existant couvre déjà l'essentiel du besoin, l'acheter coûte souvent bien moins cher que le construire. Le bon réflexe : comparer avant de développer.",
    summaryEn:
      "If an existing tool already covers most of the need, buying it is often far cheaper than building it. The right reflex: compare before you develop.",
    links: [
      { labelFr: "Demander un second avis", labelEn: "Get a second opinion", href: "/conseil" },
      { labelFr: "Le blog techno", labelEn: "The tech blog", href: "/blog" },
    ],
    next: { labelFr: "Sécuriser le choix — second avis", labelEn: "Secure the choice — second opinion", href: "/conseil" },
  },
  surmesure: {
    labelFr: "Plateforme métier / sur-mesure",
    labelEn: "Custom platform / bespoke",
    summaryFr:
      "Annuaire, espace membre, données spécifiques, fonctionnalités qui n'existent nulle part : le sur-mesure se justifie. À cadrer précisément avant de construire.",
    summaryEn:
      "Directory, member area, specific data, features that exist nowhere else: bespoke is justified. To be scoped precisely before building.",
    links: [
      { labelFr: "Générer un cahier des charges", labelEn: "Generate a project brief", href: "/cahier-des-charges" },
      { labelFr: "Diagnostic projet", labelEn: "Project diagnostic", href: "/solutions-web/eligibilite" },
    ],
    next: { labelFr: "Cadrer avec une roadmap", labelEn: "Frame it with a roadmap", href: "/conseil" },
  },
};

/* ─── Questionnaire (8 critères) ─────────────────────────────────────────── */

interface Option {
  value: string;
  labelFr: string;
  labelEn: string;
  scores: Partial<Record<Family, number>>;
}

interface Question {
  id: string;
  criterionFr: string;
  criterionEn: string;
  labelFr: string;
  labelEn: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "besoin",
    criterionFr: "Besoin",
    criterionEn: "Need",
    labelFr: "Quel est votre point de départ ?",
    labelEn: "What's your starting point?",
    options: [
      { value: "existant", labelFr: "Un site qui pose problème", labelEn: "A site that has issues", scores: { reparer: 3, wordpress: 1 } },
      { value: "vitrine", labelFr: "Un site vitrine / de contenu à (re)faire", labelEn: "A showcase / content site to (re)build", scores: { wordpress: 2, headless: 1, nocode: 1 } },
      { value: "outil", labelFr: "Un outil métier (annuaire, espace membre…)", labelEn: "A business tool (directory, member area…)", scores: { surmesure: 3, saas: 1 } },
      { value: "tache", labelFr: "Une tâche déjà couverte par un logiciel", labelEn: "A task already covered by software", scores: { saas: 3 } },
    ],
  },
  {
    id: "usage",
    criterionFr: "Usage",
    criterionEn: "Usage",
    labelFr: "Comment sera-t-il utilisé ?",
    labelEn: "How will it be used?",
    options: [
      { value: "vitrine", labelFr: "Présence web, visiteurs ponctuels", labelEn: "Web presence, one-off visitors", scores: { wordpress: 2, nocode: 1 } },
      { value: "trafic", labelFr: "Trafic élevé, SEO ou image premium", labelEn: "High traffic, SEO or premium feel", scores: { headless: 3 } },
      { value: "comptes", labelFr: "Utilisateurs réguliers avec comptes", labelEn: "Regular users with accounts", scores: { surmesure: 2, saas: 2 } },
      { value: "interne", labelFr: "Usage interne / process d'équipe", labelEn: "Internal use / team process", scores: { saas: 2, surmesure: 2 } },
    ],
  },
  {
    id: "autonomie",
    criterionFr: "Autonomie",
    criterionEn: "Autonomy",
    labelFr: "Qui le fera vivre au quotidien ?",
    labelEn: "Who will run it day to day?",
    options: [
      { value: "moi", labelFr: "Moi / mon équipe, sans technicien", labelEn: "Me / my team, no technician", scores: { wordpress: 2, nocode: 2 } },
      { value: "mixte", labelFr: "Moi le contenu, un presta la technique", labelEn: "Me content, an agency the tech", scores: { wordpress: 1, headless: 1 } },
      { value: "tech", labelFr: "Une équipe avec compétences techniques", labelEn: "A team with technical skills", scores: { headless: 1, surmesure: 1 } },
      { value: "personne", labelFr: "Personne — ça doit juste tourner", labelEn: "Nobody — it must just run", scores: { saas: 2 } },
    ],
  },
  {
    id: "budget",
    criterionFr: "Budget",
    criterionEn: "Budget",
    labelFr: "Quel budget pour ce projet ?",
    labelEn: "What's the budget?",
    options: [
      { value: "serre", labelFr: "Serré (< 2 000 €)", labelEn: "Tight (< €2,000)", scores: { reparer: 2, nocode: 2 } },
      { value: "moyen", labelFr: "2 000 – 5 000 €", labelEn: "€2,000 – €5,000", scores: { wordpress: 2 } },
      { value: "confortable", labelFr: "5 000 – 10 000 €", labelEn: "€5,000 – €10,000", scores: { headless: 2, surmesure: 1 } },
      { value: "eleve", labelFr: "> 10 000 € / pas la contrainte n°1", labelEn: "> €10,000 / not the main constraint", scores: { surmesure: 2, headless: 1 } },
    ],
  },
  {
    id: "maintenance",
    criterionFr: "Maintenance",
    criterionEn: "Maintenance",
    labelFr: "Votre rapport à la maintenance ?",
    labelEn: "Your relationship to maintenance?",
    options: [
      { value: "zero", labelFr: "Le moins possible, zéro mise à jour", labelEn: "As little as possible, zero updates", scores: { saas: 2, headless: 1, nocode: 1 } },
      { value: "ok", labelFr: "OK pour des mises à jour si simples", labelEn: "Fine with updates if simple", scores: { wordpress: 1 } },
      { value: "deborde", labelFr: "Je peine déjà à suivre l'existant", labelEn: "I already struggle to keep up", scores: { reparer: 2, saas: 1 } },
    ],
  },
  {
    id: "donnees",
    criterionFr: "Données",
    criterionEn: "Data",
    labelFr: "Vos données et contenus ?",
    labelEn: "Your data and content?",
    options: [
      { value: "standard", labelFr: "Standard, rien de sensible", labelEn: "Standard, nothing sensitive", scores: { nocode: 1, saas: 1, wordpress: 1 } },
      { value: "maitrise", labelFr: "Je veux en garder la pleine maîtrise", labelEn: "I want full control / ownership", scores: { headless: 1, surmesure: 2, wordpress: 1 } },
      { value: "sensible", labelFr: "Sensibles / réglementées / spécifiques", labelEn: "Sensitive / regulated / specific", scores: { surmesure: 3 } },
    ],
  },
  {
    id: "evolutivite",
    criterionFr: "Évolutivité",
    criterionEn: "Scalability",
    labelFr: "Comment va-t-il évoluer ?",
    labelEn: "How will it evolve?",
    options: [
      { value: "stable", labelFr: "Stable, peu d'évolutions prévues", labelEn: "Stable, few changes expected", scores: { wordpress: 2, nocode: 1, reparer: 1 } },
      { value: "contenu", labelFr: "Croissance du contenu / du trafic", labelEn: "Growing content / traffic", scores: { headless: 2 } },
      { value: "fonctions", labelFr: "De nouvelles fonctions métier à venir", labelEn: "New business features coming", scores: { surmesure: 3, headless: 1 } },
    ],
  },
  {
    id: "timetovalue",
    criterionFr: "Time-to-value",
    criterionEn: "Time-to-value",
    labelFr: "À quelle vitesse devez-vous lancer ?",
    labelEn: "How fast must you launch?",
    options: [
      { value: "vite", labelFr: "Hier / très vite", labelEn: "Yesterday / very fast", scores: { saas: 2, nocode: 2, reparer: 1 } },
      { value: "semaines", labelFr: "Quelques semaines", labelEn: "A few weeks", scores: { wordpress: 1, headless: 1 } },
      { value: "souple", labelFr: "Le délai n'est pas la contrainte", labelEn: "Timing isn't the constraint", scores: { surmesure: 1, headless: 1 } },
    ],
  },
];

// Défauts neutres (option médiane) — un résultat se calcule toujours.
const INITIAL: Record<string, string> = {
  besoin: "vitrine",
  usage: "vitrine",
  autonomie: "mixte",
  budget: "moyen",
  maintenance: "ok",
  donnees: "standard",
  evolutivite: "stable",
  timetovalue: "semaines",
};

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

export default function Boussole() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<Record<string, string>>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll vers le résultat à chaque soumission (tous écrans) — il s'affiche
  // au-dessus du formulaire, il faut y amener l'utilisateur.
  useEffect(() => {
    if (!submitted || submitCount === 0) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitted, submitCount]);

  const scores = useMemo<Record<Family, number>>(() => {
    const totals: Record<Family, number> = {
      reparer: 0,
      wordpress: 0,
      nocode: 0,
      headless: 0,
      saas: 0,
      surmesure: 0,
    };
    QUESTIONS.forEach((q) => {
      const opt = q.options.find((o) => o.value === state[q.id]);
      if (!opt) return;
      (Object.keys(opt.scores) as Family[]).forEach((f) => {
        totals[f] += opt.scores[f] ?? 0;
      });
    });
    return totals;
  }, [state]);

  // Classement décroissant ; départage par FAMILY_ORDER (simplicité d'abord).
  const ranking = useMemo(() => {
    return [...FAMILY_ORDER].sort((a, b) => {
      if (scores[b] !== scores[a]) return scores[b] - scores[a];
      return FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b);
    });
  }, [scores]);

  const winner = ranking[0];
  const maxScore = Math.max(1, scores[winner]);
  const info = FAMILIES[winner];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((c) => c + 1);
    // Mesure lead (non bloquant) si analytics présent.
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
        "event",
        "boussole_result",
        { family: winner }
      );
    } catch {
      /* analytics absent — on ignore */
    }
  };

  const reset = () => {
    setState(INITIAL);
    setSubmitted(false);
  };

  return (
    <Reveal className="w-full border border-dark-gray bg-obsidian">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-dark-gray px-6 py-6 lg:px-8">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-jet">
          <Compass className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn ? "Web & AI Tech Compass" : "Boussole Techno Web & IA"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "Eight criteria, one recommendation. Answer below to see which solution family fits — and the next step for your case."
              : "Huit critères, une recommandation. Répondez ci-dessous pour voir quelle famille de solution vous correspond — et la prochaine étape pour votre cas."}
          </p>
        </div>
      </div>

      {/* Résultat */}
      {submitted && (
        <div
          ref={resultRef}
          className="flex scroll-mt-24 flex-col gap-8 border-b border-dark-gray px-6 py-8 lg:px-8"
        >
          {/* Famille recommandée + classement */}
          <div className="grid gap-px overflow-hidden border border-dark-gray bg-dark-gray md:grid-cols-[3fr_2fr]">
            {/* Reco principale */}
            <div className="flex flex-col justify-center bg-obsidian p-6 lg:p-8">
              <p className={LABEL_MONO}>
                {isEn ? "Recommended family" : "Famille recommandée"}
              </p>
              <h3 className="mt-3 text-2xl font-light tracking-tight text-accent-secondary">
                {isEn ? info.labelEn : info.labelFr}
              </h3>
              <p className="mt-3 font-inter-tight text-[15px] leading-relaxed text-mid-gray">
                {isEn ? info.summaryEn : info.summaryFr}
              </p>
            </div>

            {/* Classement des familles */}
            <div className="flex flex-col justify-center bg-obsidian p-6 lg:p-8">
              <p className={`${LABEL_MONO} mb-4`}>
                {isEn ? "How the options rank" : "Le classement des options"}
              </p>
              <div className="flex flex-col gap-2.5">
                {ranking.map((f, i) => {
                  const pct = Math.round((scores[f] / maxScore) * 100);
                  return (
                    <div key={f} className="flex items-center gap-3">
                      <span className="w-1/2 shrink-0 truncate font-inter-tight text-[12px] text-mid-gray">
                        {isEn ? FAMILIES[f].labelEn : FAMILIES[f].labelFr}
                      </span>
                      <div className="relative h-1.5 flex-1 bg-dark-gray">
                        <div
                          className={i === 0 ? "absolute inset-y-0 left-0 bg-accent-secondary" : "absolute inset-y-0 left-0 bg-mid-gray/40"}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pistes (outils / contenus rattachés à la famille) */}
          <div>
            <p className={`${LABEL_MONO} mb-4`}>
              {isEn ? "Where to start" : "Par où commencer"}
            </p>
            <div className="border border-dark-gray">
              {info.links.map((l, i) => (
                <Link
                  key={l.href + l.labelFr}
                  href={l.href as Parameters<typeof Link>[0]["href"]}
                  className={
                    "group flex items-center justify-between gap-3 px-4 py-3.5 no-underline transition-colors hover:bg-jet " +
                    (i < info.links.length - 1 ? "border-b border-dark-gray" : "")
                  }
                >
                  <span className="font-inter-tight text-sm text-foreground">
                    {isEn ? l.labelEn : l.labelFr}
                  </span>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-accent-secondary transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Note anti-cannibalisation */}
          <div className="flex gap-3 border border-dark-gray bg-jet px-4 py-4">
            <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {isEn
                ? "This signal points you in a direction — it doesn't replace a decision for your exact case. A decision call applies the Compass to your real budget, data and constraints, and is credited back if a project follows."
                : "Ce signal vous oriente — il ne remplace pas une décision pour votre cas précis. Une visio décision applique la Boussole à votre budget réel, vos données et vos contraintes, et se déduit d'un projet si vous le lancez."}
            </p>
          </div>

          {/* Prochaine étape */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={info.next.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_PRIMARY}
            >
              {isEn ? info.next.labelEn : info.next.labelFr}
              <ArrowRight size={14} />
            </Link>
            {info.next.href !== "/conseil" && (
              <Link href="/conseil" className={BTN_GHOST}>
                {isEn ? "Book a decision call — €180" : "Réserver une visio — 180 €"}
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            )}
            <button type="button" onClick={reset} className={BTN_GHOST}>
              <RotateCcw size={13} />
              {isEn ? "Restart" : "Refaire"}
            </button>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="px-6 py-8 lg:px-8">
        <div className="mb-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {QUESTIONS.map((q) => (
            <div key={q.id}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-secondary">
                {isEn ? q.criterionEn : q.criterionFr}
              </p>
              <p className="mb-2.5 font-inter-tight text-[13px] text-mid-gray">
                {isEn ? q.labelEn : q.labelFr}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {q.options.map((opt) => {
                  const selected = state[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, [q.id]: opt.value }))}
                      className={
                        "rounded-sm border px-3.5 py-1.5 font-inter-tight text-[13px] transition-colors " +
                        (selected
                          ? "border-l-[3px] border-l-accent-secondary border-dark-gray bg-jet text-foreground"
                          : "border-dark-gray text-mid-gray hover:bg-jet hover:text-foreground")
                      }
                    >
                      {isEn ? opt.labelEn : opt.labelFr}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={BTN_PRIMARY}>
          {isEn ? "Find my tech" : "Trouver ma techno"}
          <ArrowRight size={14} />
        </button>
      </form>
    </Reveal>
  );
}
