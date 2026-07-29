"use client";

// Décrypteur de devis web — outil « Avant de signer » du hub. Checklist sur un
// devis reçu → score de santé /100, verdict (signer / ajuster / avis indépendant),
// questions à poser au prestataire dérivées des points faibles, puis routage
// vers l'offre de conseil (choix de techno). V1 = questionnaire structuré (couche
// IA possible en V2). Anti-cannibalisation : l'outil repère les signaux, l'avis
// indépendant applique la décision à votre cas. Modèle : components/outils/audit-pwa.tsx.

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Info,
  RotateCcw,
  ScrollText,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import NewsletterModal from "@/components/ui/newsletter-modal";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { StepTransition } from "@/components/ui/step-transition";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import { Sonar } from "@/components/visuals/sonar";

type Status = "ok" | "warn" | "ko";

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
  /** Question à poser au prestataire quand ce facteur est signalé. */
  askFr: string;
  askEn: string;
  options: FactorOption[];
}

const FACTORS: Factor[] = [
  {
    id: "perimetre",
    criterionFr: "Périmètre",
    criterionEn: "Scope",
    questionFr: "Le devis détaille-t-il précisément ce qui est inclus (et exclu) ?",
    questionEn: "Does the quote detail precisely what's included (and excluded)?",
    weight: 18,
    askFr: "Pouvez-vous détailler le périmètre poste par poste, et ce qui n'est pas inclus ?",
    askEn: "Can you break down the scope line by line, and state what's excluded?",
    options: [
      { value: "detaille", labelFr: "Oui, poste par poste", labelEn: "Yes, line by line", status: "ok",
        detailFr: "Bon signal : un périmètre détaillé limite les surprises et les avenants.", detailEn: "Good sign: a detailed scope limits surprises and change orders." },
      { value: "partiel", labelFr: "En partie, quelques lignes floues", labelEn: "Partly, some vague lines", status: "warn",
        detailFr: "À clarifier : faites préciser les lignes vagues avant signature.", detailEn: "To clarify: have the vague lines specified before signing." },
      { value: "forfait", labelFr: "Non, un forfait global", labelEn: "No, one global lump sum", status: "ko",
        detailFr: "Risque : un forfait sans détail rend tout litige et toute comparaison difficiles.", detailEn: "Risk: an undetailed lump sum makes any dispute or comparison hard." },
    ],
  },
  {
    id: "propriete",
    criterionFr: "Propriété",
    criterionEn: "Ownership",
    questionFr: "Le code et les contenus vous appartiennent-ils à la livraison ?",
    questionEn: "Do the code and content belong to you upon delivery?",
    weight: 16,
    askFr: "La cession des droits sur le code et les contenus est-elle incluse, par écrit ?",
    askEn: "Is the transfer of rights to the code and content included, in writing?",
    options: [
      { value: "cession", labelFr: "Oui, cession explicite", labelEn: "Yes, explicit transfer", status: "ok",
        detailFr: "Bon signal : vous restez propriétaire de ce que vous payez.", detailEn: "Good sign: you own what you pay for." },
      { value: "flou", labelFr: "Pas mentionné / flou", labelEn: "Not mentioned / unclear", status: "warn",
        detailFr: "À verrouiller : sans clause, la propriété du code peut être contestée.", detailEn: "To lock down: without a clause, code ownership can be contested." },
      { value: "presta", labelFr: "Non, le presta reste propriétaire", labelEn: "No, the provider keeps ownership", status: "ko",
        detailFr: "Vigilance forte : vous louez votre site plus que vous ne le possédez.", detailEn: "Strong caution: you rent your site more than you own it." },
    ],
  },
  {
    id: "hebergement",
    criterionFr: "Hébergement",
    criterionEn: "Hosting",
    questionFr: "Aurez-vous la pleine maîtrise du domaine, de l'hébergement et des accès ?",
    questionEn: "Will you fully control the domain, hosting and access?",
    weight: 14,
    askFr: "Le domaine et l'hébergement seront-ils à mon nom, avec tous mes accès administrateur ?",
    askEn: "Will the domain and hosting be in my name, with all my admin access?",
    options: [
      { value: "moi", labelFr: "Oui, à mon nom / mes accès", labelEn: "Yes, in my name / my access", status: "ok",
        detailFr: "Bon signal : vous gardez les clés de votre présence en ligne.", detailEn: "Good sign: you keep the keys to your online presence." },
      { value: "partage", labelFr: "Partagé / pas clair", labelEn: "Shared / unclear", status: "warn",
        detailFr: "À préciser : exigez vos propres accès et la propriété du domaine.", detailEn: "To clarify: require your own access and domain ownership." },
      { value: "presta", labelFr: "Non, tout chez le prestataire", labelEn: "No, everything at the provider", status: "ko",
        detailFr: "Risque de dépendance : récupérer son site devient compliqué en cas de rupture.", detailEn: "Lock-in risk: recovering your site gets hard if the relationship ends." },
    ],
  },
  {
    id: "reversibilite",
    criterionFr: "Réversibilité",
    criterionEn: "Reversibility",
    questionFr: "Pourriez-vous changer de prestataire sans tout refaire ?",
    questionEn: "Could you switch providers without rebuilding everything?",
    weight: 12,
    askFr: "Sur quelle technologie standard est-ce construit, et comment récupérer le code et les données ?",
    askEn: "What standard technology is it built on, and how do I retrieve the code and data?",
    options: [
      { value: "standard", labelFr: "Oui, techno standard exportable", labelEn: "Yes, exportable standard tech", status: "ok",
        detailFr: "Bon signal : une techno répandue protège votre liberté de changer.", detailEn: "Good sign: a widespread tech protects your freedom to switch." },
      { value: "difficile", labelFr: "Difficile, dépend du presta", labelEn: "Hard, depends on the provider", status: "warn",
        detailFr: "À évaluer : mesurez le coût de sortie avant de vous engager.", detailEn: "To assess: weigh the exit cost before committing." },
      { value: "verrouille", labelFr: "Non, solution propriétaire verrouillée", labelEn: "No, locked proprietary solution", status: "ko",
        detailFr: "Vigilance : un verrouillage technique fragilise votre position à long terme.", detailEn: "Caution: technical lock-in weakens your long-term position." },
    ],
  },
  {
    id: "maintenance",
    criterionFr: "Récurrent",
    criterionEn: "Recurring",
    questionFr: "Les coûts récurrents (maintenance, licences, abonnements) sont-ils clairs ?",
    questionEn: "Are recurring costs (maintenance, licenses, subscriptions) clear?",
    weight: 10,
    askFr: "Quel est le coût annuel total après livraison : maintenance, licences, hébergement, mises à jour ?",
    askEn: "What's the total yearly cost after delivery: maintenance, licenses, hosting, updates?",
    options: [
      { value: "clairs", labelFr: "Oui, transparents", labelEn: "Yes, transparent", status: "ok",
        detailFr: "Bon signal : le coût total de possession est connu d'avance.", detailEn: "Good sign: the total cost of ownership is known upfront." },
      { value: "partiel", labelFr: "Partiellement chiffrés", labelEn: "Partially quantified", status: "warn",
        detailFr: "À compléter : demandez le coût annuel réel sur 3 ans.", detailEn: "To complete: ask for the real yearly cost over 3 years." },
      { value: "opaque", labelFr: "Non / abonnement obligatoire opaque", labelEn: "No / opaque mandatory subscription", status: "ko",
        detailFr: "Risque : des récurrents flous gonflent la facture après la mise en ligne.", detailEn: "Risk: vague recurring fees inflate the bill after launch." },
    ],
  },
  {
    id: "surdimension",
    criterionFr: "Proportion",
    criterionEn: "Right-sizing",
    questionFr: "La technologie proposée est-elle justifiée par votre besoin réel ?",
    questionEn: "Is the proposed technology justified by your real need?",
    weight: 10,
    askFr: "Pourquoi cette technologie plutôt qu'une solution plus simple pour mon besoin ?",
    askEn: "Why this technology rather than a simpler solution for my need?",
    options: [
      { value: "proportionne", labelFr: "Oui, proportionnée", labelEn: "Yes, proportionate", status: "ok",
        detailFr: "Bon signal : la solution colle au besoin, sans complexité inutile.", detailEn: "Good sign: the solution fits the need, without needless complexity." },
      { value: "inconnu", labelFr: "Je ne sais pas / pas expliqué", labelEn: "I don't know / not explained", status: "warn",
        detailFr: "À challenger : faites justifier les choix techniques en clair.", detailEn: "To challenge: have the technical choices justified plainly." },
      { value: "surdimensionne", labelFr: "Semble surdimensionnée", labelEn: "Looks oversized", status: "ko",
        detailFr: "Risque : une stack trop lourde coûte cher à construire et à maintenir.", detailEn: "Risk: an overly heavy stack is costly to build and maintain." },
    ],
  },
  {
    id: "postesflous",
    criterionFr: "Postes",
    criterionEn: "Line items",
    questionFr: "Y a-t-il des postes vagues (« développements divers », TJM ouvert) ?",
    questionEn: "Are there vague items (\"misc. development\", open day rate)?",
    weight: 10,
    askFr: "Pouvez-vous forfaitiser ou plafonner les postes ouverts et le temps non détaillé ?",
    askEn: "Can you fix or cap the open items and the undetailed time?",
    options: [
      { value: "forfaitise", labelFr: "Non, tout est forfaitisé", labelEn: "No, everything is fixed", status: "ok",
        detailFr: "Bon signal : pas de dérive de budget cachée dans des lignes ouvertes.", detailEn: "Good sign: no hidden budget drift in open lines." },
      { value: "quelques", labelFr: "Un ou deux postes ouverts", labelEn: "One or two open items", status: "warn",
        detailFr: "À cadrer : plafonnez les postes ouverts pour éviter les rallonges.", detailEn: "To frame: cap open items to avoid overruns." },
      { value: "plusieurs", labelFr: "Plusieurs postes flous / TJM non plafonné", labelEn: "Several vague items / uncapped rate", status: "ko",
        detailFr: "Risque : la facture finale peut largement dépasser le devis.", detailEn: "Risk: the final bill can far exceed the quote." },
    ],
  },
  {
    id: "delais",
    criterionFr: "Délais",
    criterionEn: "Timeline",
    questionFr: "Le devis fixe-t-il des délais et des jalons de livraison ?",
    questionEn: "Does the quote set deadlines and delivery milestones?",
    weight: 8,
    askFr: "Quel est l'échéancier avec jalons, et que se passe-t-il en cas de retard ?",
    askEn: "What's the schedule with milestones, and what happens if it's late?",
    options: [
      { value: "clair", labelFr: "Oui, échéancier clair", labelEn: "Yes, clear schedule", status: "ok",
        detailFr: "Bon signal : des jalons rythment le projet et sécurisent la livraison.", detailEn: "Good sign: milestones pace the project and secure delivery." },
      { value: "vague", labelFr: "Vague", labelEn: "Vague", status: "warn",
        detailFr: "À préciser : demandez des dates et des jalons de validation.", detailEn: "To specify: ask for dates and validation milestones." },
      { value: "aucun", labelFr: "Aucun délai", labelEn: "No timeline", status: "ko",
        detailFr: "Risque : sans échéance, un projet peut s'étirer indéfiniment.", detailEn: "Risk: without deadlines, a project can drag on indefinitely." },
    ],
  },
  {
    id: "references",
    criterionFr: "Preuves",
    criterionEn: "Proof",
    questionFr: "Le prestataire montre-t-il des références et un interlocuteur identifié ?",
    questionEn: "Does the provider show references and a named contact?",
    weight: 8,
    askFr: "Pouvez-vous me montrer 2-3 réalisations comparables et mon interlocuteur direct ?",
    askEn: "Can you show me 2-3 comparable projects and my direct contact?",
    options: [
      { value: "oui", labelFr: "Oui, références + contact direct", labelEn: "Yes, references + direct contact", status: "ok",
        detailFr: "Bon signal : des preuves concrètes réduisent le risque prestataire.", detailEn: "Good sign: concrete proof reduces provider risk." },
      { value: "partiel", labelFr: "Quelques éléments", labelEn: "A few elements", status: "warn",
        detailFr: "À compléter : demandez des références comparables à votre projet.", detailEn: "To complete: ask for references comparable to your project." },
      { value: "non", labelFr: "Non, opaque", labelEn: "No, opaque", status: "ko",
        detailFr: "Vigilance : l'absence de preuves et de contact clair est un signal faible.", detailEn: "Caution: no proof and no clear contact is a weak signal." },
    ],
  },
];

const TOTAL_WEIGHT = FACTORS.reduce((s, f) => s + f.weight, 0);

// Défauts neutres (option médiane « warn ») — un résultat se calcule toujours.
const INITIAL: Record<string, string> = {
  perimetre: "partiel",
  propriete: "flou",
  hebergement: "partage",
  reversibilite: "difficile",
  maintenance: "partiel",
  surdimension: "inconnu",
  postesflous: "quelques",
  delais: "vague",
  references: "partiel",
};

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

function statusBorderClass(status: Status) {
  if (status === "ok") return "border-l-accent-secondary";
  if (status === "warn") return "border-l-accent";
  return "border-l-vermilion";
}

export default function DecrypteurDevis() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<Record<string, string>>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll vers le résultat à chaque soumission (tous écrans) — le résultat
  // s'affiche au-dessus du formulaire, il faut y amener l'utilisateur.
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

  const score = useMemo(() => {
    let total = 0;
    results.forEach(({ factor, opt }) => {
      if (opt.status === "ok") total += factor.weight;
      else if (opt.status === "warn") total += factor.weight * 0.5;
    });
    return Math.round((total / TOTAL_WEIGHT) * 100);
  }, [results]);

  const verdict = useMemo(() => {
    if (score >= 75)
      return {
        fr: "Devis plutôt sain. Vous pouvez avancer, en clarifiant les quelques points signalés ci-dessous.",
        en: "Fairly healthy quote. You can move forward, after clarifying the few points flagged below.",
        toneClass: "text-accent-secondary",
      };
    if (score >= 50)
      return {
        fr: "Plusieurs zones à clarifier avant de signer. Posez les questions ci-dessous, puis décidez.",
        en: "Several areas to clarify before signing. Ask the questions below, then decide.",
        toneClass: "text-accent",
      };
    return {
      fr: "Plusieurs signaux de vigilance. Un second avis indépendant est recommandé avant de signer.",
      en: "Several warning signals. An independent second opinion is recommended before signing.",
      toneClass: "text-vermilion",
    };
  }, [score]);

  // Questions à poser : facteurs signalés, « ko » d'abord, max 5.
  const questionsToAsk = useMemo(() => {
    const flagged = results.filter((r) => r.opt.status !== "ok");
    flagged.sort((a, b) => {
      const rank = (s: Status) => (s === "ko" ? 0 : 1);
      if (rank(a.opt.status) !== rank(b.opt.status)) return rank(a.opt.status) - rank(b.opt.status);
      return b.factor.weight - a.factor.weight;
    });
    return flagged.slice(0, 5).map((r) => r.factor);
  }, [results]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((c) => c + 1);
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
        "event",
        "decrypteur_devis_result",
        { score }
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
          <ScrollText className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn ? "Web quote decoder" : "Décrypteur de devis web"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "Received a quote for a website or web tool? Answer 9 checks to spot the warning signs — and get the questions to ask before signing."
              : "Vous avez reçu un devis pour un site ou un outil web ? Répondez à 9 vérifications pour repérer les signaux de vigilance — et obtenir les questions à poser avant de signer."}
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
                <p className={LABEL_MONO}>
                  {isEn ? "Quote health" : "Santé du devis"}
                </p>
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

          {/* Questions à poser au prestataire */}
          {questionsToAsk.length > 0 && (
            <StaggerItem>
              <p className={`${LABEL_MONO} mb-4`}>
                {isEn ? "Questions to ask the provider" : "Questions à poser au prestataire"}
              </p>
              <div className="border border-dark-gray">
                {questionsToAsk.map((f, i) => (
                  <div
                    key={f.id}
                    className={
                      "flex items-start gap-3 px-4 py-3.5 " +
                      (i < questionsToAsk.length - 1 ? "border-b border-dark-gray" : "")
                    }
                  >
                    <HelpCircle size={16} className="mt-0.5 shrink-0 text-accent" />
                    <p className="font-inter-tight text-sm leading-relaxed text-foreground">
                      {isEn ? f.askEn : f.askFr}
                    </p>
                  </div>
                ))}
              </div>
            </StaggerItem>
          )}

          {/* Détail par facteur */}
          <StaggerItem>
            <p className={`${LABEL_MONO} mb-4`}>
              {isEn ? "Vigilance factors" : "Facteurs de vigilance"}
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

          {/* Note anti-cannibalisation */}
          <StaggerItem className="flex gap-3 border border-dark-gray bg-jet px-4 py-4">
            <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {isEn
                ? "This is a self-check, not a legal review. An independent tech opinion goes over your actual quote and tells you clearly: sign, adjust or renegotiate."
                : "Ceci est une auto-évaluation, pas une analyse juridique. Un avis techno indépendant reprend votre devis réel et vous dit clairement : signer, ajuster ou renégocier."}
            </p>
          </StaggerItem>

          {/* Prochaine étape */}
          <StaggerItem className="flex flex-wrap items-center gap-3">
            <Link href="/conseil" className={BTN_PRIMARY}>
              {isEn ? "Get an independent opinion — €150" : "Un avis indépendant — 150 €"}
              <ArrowRight size={14} />
            </Link>
            <Link href="/outils/selecteur-techno" className={BTN_GHOST}>
              {isEn ? "No quote yet? The tech selector" : "Pas encore de devis ? Le Sélecteur techno"}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button type="button" onClick={reset} className={BTN_GHOST}>
              <RotateCcw size={13} />
              {isEn ? "Restart" : "Refaire"}
            </button>
          </StaggerItem>
          <NewsletterModal source="decrypteur-devis" />
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
          {isEn ? "Decode my quote" : "Décrypter mon devis"}
          <ArrowRight size={14} />
        </button>
      </form>
    </Reveal>
  );
}
