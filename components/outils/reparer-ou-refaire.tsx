"use client";

// Réparer ou refaire ? — outil « Réparer ou refaire » du hub. Checklist sur
// l'état d'un site (WordPress) → score de santé /100 et verdict à 3 voies :
// réparer / optimiser / refondre, avec une CTA adaptée (contact si réparable,
// Services/Visio si fin de vie). Doctrine : réparer quand c'est
// suffisant, refaire seulement quand c'est justifié. Modèle : decrypteur-devis.

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  RotateCcw,
  Wrench,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { StepTransition } from "@/components/ui/step-transition";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import { Sonar } from "@/components/visuals/sonar";

type Status = "ok" | "warn" | "ko"; // ok = sain (réparer), ko = fin de vie (refondre)

interface FactorOption {
  value: string;
  labelFr: string;
  labelEn: string;
  status: Status;
  detailFr: string;
  detailEn: string;
}

interface Factor {
  id: string;
  criterionFr: string;
  criterionEn: string;
  questionFr: string;
  questionEn: string;
  weight: number;
  options: FactorOption[];
}

const FACTORS: Factor[] = [
  {
    id: "age",
    criterionFr: "Âge du site",
    criterionEn: "Site age",
    questionFr: "Quel âge a votre site dans sa version actuelle ?",
    questionEn: "How old is your site in its current version?",
    weight: 8,
    options: [
      { value: "recent", labelFr: "Moins de 2 ans", labelEn: "Under 2 years", status: "ok",
        detailFr: "Un site récent mérite rarement une refonte : on corrige, on optimise.", detailEn: "A recent site rarely deserves a rebuild: fix and optimize." },
      { value: "moyen", labelFr: "2 à 5 ans", labelEn: "2 to 5 years", status: "warn",
        detailFr: "Âge charnière : viable, mais à surveiller selon le reste du diagnostic.", detailEn: "Pivot age: still viable, watch it depending on the rest." },
      { value: "vieux", labelFr: "Plus de 5 ans / je ne sais plus", labelEn: "Over 5 years / not sure", status: "ko",
        detailFr: "Un socle ancien accumule de la dette : la refonte devient souvent rentable.", detailEn: "An old base accrues debt: a rebuild often pays off." },
    ],
  },
  {
    id: "socle",
    criterionFr: "Socle technique",
    criterionEn: "Technical base",
    questionFr: "WordPress et PHP sont-ils à jour ?",
    questionEn: "Are WordPress and PHP up to date?",
    weight: 16,
    options: [
      { value: "ajour", labelFr: "Oui, à jour", labelEn: "Yes, up to date", status: "ok",
        detailFr: "Bon socle : les mises à jour passent, la maintenance reste simple.", detailEn: "Solid base: updates apply, maintenance stays simple." },
      { value: "retard", labelFr: "En retard de quelques versions", labelEn: "A few versions behind", status: "warn",
        detailFr: "À remettre à niveau : un rattrapage évite souvent une refonte.", detailEn: "To catch up: an update often avoids a rebuild." },
      { value: "bloque", labelFr: "Bloqués / impossible à mettre à jour", labelEn: "Stuck / impossible to update", status: "ko",
        detailFr: "Signal fort de fin de vie : un socle figé empêche toute évolution sûre.", detailEn: "Strong end-of-life signal: a frozen base blocks safe evolution." },
    ],
  },
  {
    id: "plugins",
    criterionFr: "Extensions",
    criterionEn: "Plugins",
    questionFr: "Combien de plugins / extensions, et sont-ils maîtrisés ?",
    questionEn: "How many plugins, and are they under control?",
    weight: 10,
    options: [
      { value: "peu", labelFr: "Peu (< 10), maîtrisés", labelEn: "Few (< 10), controlled", status: "ok",
        detailFr: "Pile saine : peu de surface de panne, mises à jour gérables.", detailEn: "Healthy stack: little failure surface, manageable updates." },
      { value: "beaucoup", labelFr: "Beaucoup (10 à 25)", labelEn: "Many (10 to 25)", status: "warn",
        detailFr: "À élaguer : du ménage dans les extensions allège et fiabilise.", detailEn: "To prune: cleaning up plugins lightens and stabilizes." },
      { value: "enorme", labelFr: "Énormément (> 25) ou abandonnés", labelEn: "Tons (> 25) or abandoned", status: "ko",
        detailFr: "Dette lourde : trop d'extensions (ou non maintenues) fragilisent tout le site.", detailEn: "Heavy debt: too many (or unmaintained) plugins weaken the whole site." },
    ],
  },
  {
    id: "bugs",
    criterionFr: "Bugs / pannes",
    criterionEn: "Bugs / outages",
    questionFr: "À quelle fréquence rencontrez-vous des bugs ou des pannes ?",
    questionEn: "How often do you hit bugs or outages?",
    weight: 14,
    options: [
      { value: "rare", labelFr: "Rarement", labelEn: "Rarely", status: "ok",
        detailFr: "Site stable : les incidents ne justifient pas une refonte.", detailEn: "Stable site: incidents don't justify a rebuild." },
      { value: "parfois", labelFr: "De temps en temps", labelEn: "Now and then", status: "warn",
        detailFr: "À diagnostiquer : identifier la cause évite souvent de tout refaire.", detailEn: "To diagnose: finding the cause often avoids a full rebuild." },
      { value: "souvent", labelFr: "Souvent / ça casse à chaque mise à jour", labelEn: "Often / breaks on every update", status: "ko",
        detailFr: "Fragilité chronique : un site qui casse sans cesse coûte plus cher à rafistoler.", detailEn: "Chronic fragility: a constantly breaking site costs more to patch." },
    ],
  },
  {
    id: "perf",
    criterionFr: "Performance",
    criterionEn: "Performance",
    questionFr: "Le site est-il rapide, y compris sur mobile ?",
    questionEn: "Is the site fast, including on mobile?",
    weight: 12,
    options: [
      { value: "rapide", labelFr: "Oui, rapide", labelEn: "Yes, fast", status: "ok",
        detailFr: "Bonne base : la performance n'est pas un motif de refonte.", detailEn: "Good base: performance isn't a reason to rebuild." },
      { value: "moyen", labelFr: "Moyen", labelEn: "Average", status: "warn",
        detailFr: "Optimisable : cache, images et hébergement donnent des gains rapides.", detailEn: "Optimizable: cache, images and hosting bring quick wins." },
      { value: "lent", labelFr: "Lent, surtout sur mobile", labelEn: "Slow, especially on mobile", status: "ko",
        detailFr: "Si l'optimisation ne suffit plus, une base moderne change la donne.", detailEn: "If optimization no longer helps, a modern base changes everything." },
    ],
  },
  {
    id: "design",
    criterionFr: "Design / UX",
    criterionEn: "Design / UX",
    questionFr: "Le design et l'expérience sont-ils à la hauteur de votre image ?",
    questionEn: "Do design and UX match your brand today?",
    weight: 10,
    options: [
      { value: "moderne", labelFr: "Oui, modernes", labelEn: "Yes, modern", status: "ok",
        detailFr: "Pas de motif esthétique de refonte : concentrez-vous sur la technique.", detailEn: "No cosmetic reason to rebuild: focus on the tech." },
      { value: "vieillissant", labelFr: "Vieillissants mais corrects", labelEn: "Aging but acceptable", status: "warn",
        detailFr: "Un rafraîchissement ciblé peut suffire avant d'envisager plus.", detailEn: "A targeted refresh may be enough before going further." },
      { value: "date", labelFr: "Datés, ne reflètent plus mon image", labelEn: "Dated, no longer on-brand", status: "ko",
        detailFr: "Quand l'image est en jeu, la refonte sert aussi la conversion.", detailEn: "When brand is at stake, a rebuild also serves conversion." },
    ],
  },
  {
    id: "evolution",
    criterionFr: "Besoin d'évolution",
    criterionEn: "Evolution need",
    questionFr: "Avez-vous de nouveaux besoins que le site peine à porter ?",
    questionEn: "Do you have new needs the site struggles to carry?",
    weight: 16,
    options: [
      { value: "suffit", labelFr: "Non, le site suffit", labelEn: "No, the site is enough", status: "ok",
        detailFr: "Si le site fait le travail, le réparer suffit largement.", detailEn: "If the site does the job, repairing is plenty." },
      { value: "quelques", labelFr: "Quelques ajouts à prévoir", labelEn: "A few additions to plan", status: "warn",
        detailFr: "À cadrer : certains ajouts passent sur l'existant, d'autres non.", detailEn: "To scope: some additions fit the current site, others don't." },
      { value: "bloque", labelFr: "Oui, le site bloque mes projets", labelEn: "Yes, the site blocks my plans", status: "ko",
        detailFr: "Premier vrai motif de refonte : construire une base qui porte vos projets.", detailEn: "The real reason to rebuild: a base that carries your plans." },
    ],
  },
  {
    id: "maintenance",
    criterionFr: "Maintenance",
    criterionEn: "Maintenance",
    questionFr: "La maintenance est-elle suivie et sauvegardée ?",
    questionEn: "Is maintenance tracked and backed up?",
    weight: 8,
    options: [
      { value: "suivie", labelFr: "Oui, à jour et sauvegardée", labelEn: "Yes, updated and backed up", status: "ok",
        detailFr: "Bonne hygiène : un site entretenu se répare facilement.", detailEn: "Good hygiene: a maintained site is easy to repair." },
      { value: "irreguliere", labelFr: "Irrégulière", labelEn: "Irregular", status: "warn",
        detailFr: "À reprendre en main : une maintenance régulière prolonge la vie du site.", detailEn: "To take back in hand: regular maintenance extends the site's life." },
      { value: "aucune", labelFr: "Aucune / personne ne sait", labelEn: "None / nobody knows", status: "ko",
        detailFr: "Risque : sans maintenance ni sauvegarde, repartir au propre est plus sûr.", detailEn: "Risk: with no maintenance or backup, a clean restart is safer." },
    ],
  },
  {
    id: "securite",
    criterionFr: "Sécurité",
    criterionEn: "Security",
    questionFr: "Avez-vous subi des incidents (hack, spam, indisponibilité) ?",
    questionEn: "Have you had incidents (hack, spam, downtime)?",
    weight: 6,
    options: [
      { value: "non", labelFr: "Non", labelEn: "No", status: "ok",
        detailFr: "Pas d'alerte sécurité : un motif de moins de refondre.", detailEn: "No security alert: one less reason to rebuild." },
      { value: "alertes", labelFr: "Quelques alertes / petits soucis", labelEn: "Some alerts / minor issues", status: "warn",
        detailFr: "À traiter : durcir la sécurité fait partie d'une remise en état.", detailEn: "To address: hardening security is part of a clean-up." },
      { value: "incident", labelFr: "Oui, piraté ou indisponible", labelEn: "Yes, hacked or down", status: "ko",
        detailFr: "Un site compromis sur base fragile justifie souvent de repartir au propre.", detailEn: "A compromised site on a fragile base often justifies a clean restart." },
    ],
  },
];

const TOTAL_WEIGHT = FACTORS.reduce((s, f) => s + f.weight, 0);

// Défauts neutres (option médiane « warn ») — un résultat se calcule toujours.
const INITIAL: Record<string, string> = {
  age: "moyen",
  socle: "retard",
  plugins: "beaucoup",
  bugs: "parfois",
  perf: "moyen",
  design: "vieillissant",
  evolution: "quelques",
  maintenance: "irreguliere",
  securite: "alertes",
};

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

function statusBorderClass(status: Status) {
  if (status === "ok") return "border-l-accent-secondary";
  if (status === "warn") return "border-l-accent";
  return "border-l-vermilion";
}

type Tier = "reparer" | "optimiser" | "refondre";

function getCtas(tier: Tier) {
  if (tier === "reparer")
    return {
      primary: { fr: "Réparer mon site", en: "Fix my site", href: "/contact" },
      secondary: { fr: "Auditer mon site", en: "Audit my site", href: "/audit-site-web" },
    };
  if (tier === "optimiser")
    return {
      primary: { fr: "Optimiser mon site", en: "Optimize my site", href: "/contact" },
      secondary: { fr: "Décider en visio · 150 €", en: "Decide on a call · €150", href: "/conseil" },
    };
  return {
    primary: { fr: "Voir les solutions web", en: "See the web solutions", href: "/solutions-web" },
    secondary: { fr: "Décider en visio · 150 €", en: "Decide on a call · €150", href: "/conseil" },
  };
}

export default function ReparerOuRefaire() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<Record<string, string>>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted || submitCount === 0) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitted, submitCount]);

  const results = useMemo(() => {
    return FACTORS.map((f) => {
      const opt = f.options.find((o) => o.value === state[f.id]) ?? f.options[0];
      return { factor: f, opt };
    });
  }, [state]);

  // Score de santé : ok = pleine valeur, warn = moitié, ko = 0. Haut = sain (réparer).
  const score = useMemo(() => {
    let total = 0;
    results.forEach(({ factor, opt }) => {
      if (opt.status === "ok") total += factor.weight;
      else if (opt.status === "warn") total += factor.weight * 0.5;
    });
    return Math.round((total / TOTAL_WEIGHT) * 100);
  }, [results]);

  const verdict = useMemo<{ tier: Tier; fr: string; en: string; toneClass: string }>(() => {
    if (score >= 65)
      return {
        tier: "reparer",
        fr: "Réparer suffit. Votre site n'est pas en bout de course : une intervention ciblée règle le problème, sans refonte.",
        en: "Repair is enough. Your site isn't at the end of the road: a targeted fix solves it, no rebuild.",
        toneClass: "text-accent-secondary",
      };
    if (score >= 35)
      return {
        tier: "optimiser",
        fr: "Optimiser avant de trancher. Le site a de la dette mais reste sauvable : optimisez (perf, sécurité, extensions), puis réévaluez.",
        en: "Optimize before deciding. The site has debt but is salvageable: optimize (performance, security, plugins), then reassess.",
        toneClass: "text-accent",
      };
    return {
      tier: "refondre",
      fr: "Refondre se justifie. Plusieurs signaux de fin de vie : repartir sur une base saine sera plus rentable que rafistoler.",
      en: "Rebuilding is justified. Several end-of-life signals: a clean base will pay off more than patching.",
      toneClass: "text-vermilion",
    };
  }, [score]);

  const ctas = getCtas(verdict.tier);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((c) => c + 1);
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
        "event",
        "reparer_refaire_result",
        { tier: verdict.tier, score }
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
          <Wrench className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn ? "Repair or rebuild?" : "Réparer ou refaire ?"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "Is your site reaching the end of the road? Answer 9 checks to know whether to repair, optimize or rebuild — repair when it's enough, rebuild only when it's justified."
              : "Votre site est-il en bout de course ? Répondez à 9 vérifications pour savoir s'il faut réparer, optimiser ou refondre — réparer quand c'est suffisant, refaire seulement quand c'est justifié."}
          </p>
        </div>
      </div>

      {/* Résultat — transition d'étape standard (fade + slide 8 px) */}
      <StepTransition stepKey={submitted ? "resultat" : "formulaire"}>
      {submitted && (
        <div ref={resultRef} className="scroll-mt-24 border-b border-dark-gray">
        {/* Verdict en cascade — les blocs du résultat apparaissent en Stagger */}
        <Stagger className="flex flex-col gap-8 px-6 py-8 lg:px-8">
          {/* Score + signal */}
          <StaggerItem className="grid gap-px overflow-hidden border border-dark-gray bg-dark-gray md:grid-cols-[1fr_2fr]">
            <div className="relative flex items-center justify-center overflow-hidden bg-obsidian p-6">
              <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
                <Sonar />
              </div>
              <div className="relative flex flex-col items-center gap-3">
                <p className={LABEL_MONO}>{isEn ? "Site health" : "Santé du site"}</p>
                <RadialGauge value={score} size={132} label={isEn ? "out of 100" : "sur 100"} />
              </div>
            </div>
            <div className="flex flex-col justify-center bg-obsidian p-6 lg:p-8">
              <p className={LABEL_MONO}>{isEn ? "Decision signal" : "Signal de décision"}</p>
              <p className={`mt-3 font-inter-tight text-[15px] leading-relaxed ${verdict.toneClass}`}>
                {isEn ? verdict.en : verdict.fr}
              </p>
            </div>
          </StaggerItem>

          {/* Détail par facteur */}
          <StaggerItem>
            <p className={`${LABEL_MONO} mb-4`}>
              {isEn ? "What weighs in" : "Ce qui pèse dans la balance"}
            </p>
            <div className="border border-dark-gray">
              {results.map(({ factor, opt }, i) => (
                <div
                  key={factor.id}
                  className={`flex items-start gap-3 border-l-[3px] px-4 py-3.5 ${statusBorderClass(
                    opt.status
                  )} ${i < results.length - 1 ? "border-b border-b-dark-gray" : ""}`}
                >
                  {opt.status === "ok" ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-secondary" />
                  ) : opt.status === "warn" ? (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent" />
                  ) : (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-vermilion" />
                  )}
                  <div>
                    <p className="font-inter-tight text-sm font-medium text-foreground">
                      {isEn ? factor.criterionEn : factor.criterionFr}
                    </p>
                    <p className="mt-1 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                      {isEn ? opt.detailEn : opt.detailFr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </StaggerItem>

          {/* Note anti-cannibalisation / doctrine */}
          <StaggerItem className="flex gap-3 border border-dark-gray bg-jet px-4 py-4">
            <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {isEn
                ? "Repair when it's enough, rebuild only when it's justified. This is a self-check — an audit or a decision call confirms the diagnosis on your real site before you spend."
                : "Réparer quand c'est suffisant, refaire seulement quand c'est justifié. Ceci est une auto-évaluation — un audit ou une visio confirme le diagnostic sur votre site réel avant d'investir."}
            </p>
          </StaggerItem>

          {/* Prochaine étape (adaptée au verdict) */}
          <StaggerItem className="flex flex-wrap items-center gap-3">
            <Link
              href={ctas.primary.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_PRIMARY}
            >
              {isEn ? ctas.primary.en : ctas.primary.fr}
              <ArrowRight size={14} />
            </Link>
            <Link
              href={ctas.secondary.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_GHOST}
            >
              {isEn ? ctas.secondary.en : ctas.secondary.fr}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => reset()}
              className={BTN_GHOST}
            >
              <RotateCcw size={13} />
              {isEn ? "Restart" : "Refaire"}
            </button>
          </StaggerItem>
        </Stagger>
        </div>
      )}
      </StepTransition>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="px-6 py-8 lg:px-8">
        <div className="mb-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {FACTORS.map((f) => (
            <div key={f.id}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-secondary">
                {isEn ? f.criterionEn : f.criterionFr}
              </p>
              <p className="mb-2.5 font-inter-tight text-[13px] text-mid-gray">
                {isEn ? f.questionEn : f.questionFr}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {f.options.map((opt) => {
                  const selected = state[f.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, [f.id]: opt.value }))}
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
          {isEn ? "Repair or rebuild?" : "Réparer ou refaire ?"}
          <ArrowRight size={14} />
        </button>
      </form>
    </Reveal>
  );
}
