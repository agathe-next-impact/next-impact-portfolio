"use client";

import type React from "react";
import { ArrowRight, Info, BarChart2, Shield, Scale, TrendingUp, GitBranch, Bell, Gauge, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import SimulateurAgefiph from "@/components/simulateur-agefiph";
import FaqSchema from "@/components/services/FaqSchema";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import { BarBreakdown, MeterBar } from "@/components/visuals/charts";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

type Step = { number: string; Icon: LucideIcon; title: string; description: string };

const stepsFr: Step[] = [
  { number: "01", Icon: BarChart2, title: "30% déductibles automatiquement", description: "30% du coût de main-d'œuvre de la prestation est déductible de votre contribution annuelle AGEFIPH. Le calcul est intégré à la facture." },
  { number: "02", Icon: Shield, title: "Attestation officielle", description: "Vous recevez une attestation de déductibilité annuelle conforme à l'article D.5212-7 du Code du travail, à joindre à votre déclaration OETH." },
];

const stepsEn: Step[] = [
  { number: "01", Icon: BarChart2, title: "30% deductible automatically", description: "30% of the labor cost of the service is deductible from your annual AGEFIPH contribution. The calculation is built into the invoice." },
  { number: "02", Icon: Shield, title: "Official attestation", description: "You receive an annual deductibility attestation compliant with article D.5212-7 of the French Labor Code, to attach to your OETH return." },
];

const faqsFr = [
  { question: "Qu'est-ce qu'un prestataire TIH ?", answer: "Un TIH (Travailleur Indépendant Handicapé) est un indépendant disposant d'une RQTH (Reconnaissance de la Qualité de Travailleur Handicapé) et exerçant en Entreprise Individuelle. Depuis la loi Macron de 2016, aucun agrément n'est nécessaire. La France compte entre 75 000 et 80 000 TIH." },
  { question: "Combien puis-je déduire de ma contribution AGEFIPH ?", answer: "Vous pouvez déduire 30% du coût de main-d'œuvre des prestations facturées par un TIH. Pour une prestation intellectuelle comme le développement web, cela correspond à 30% du montant HT. Cette déduction est plafonnée à 50% de votre contribution brute si votre taux d'emploi TH est inférieur à 3%, ou 75% si votre taux est supérieur ou égal à 3%." },
  { question: "Comment fonctionne l'attestation de déductibilité ?", answer: "Next Impact vous fournit une attestation de déductibilité annuelle, conforme à l'article D.5212-7 du Code du travail. Ce document certifie le montant des prestations réalisées et le montant déductible. Vous le joignez à votre déclaration annuelle OETH (Obligation d'Emploi des Travailleurs Handicapés) auprès de l'URSSAF." },
  { question: "Mon entreprise a moins de 20 salariés, suis-je concerné ?", answer: "L'obligation d'emploi de 6% de travailleurs handicapés ne concerne que les entreprises de 20 salariés et plus. Si votre entreprise est en dessous de ce seuil, vous n'avez pas de contribution AGEFIPH à payer et la déduction TIH ne s'applique pas. Vous bénéficiez néanmoins de la même qualité de prestation." },
  { question: "La déduction TIH est-elle cumulable avec d'autres actions OETH ?", answer: "Oui. La sous-traitance TIH est un levier parmi d'autres pour réduire votre contribution : emploi direct de TH, accueil de stagiaires handicapés, achats auprès d'EA/ESAT. Depuis 2025, la sous-traitance TIH/EA/ESAT reste l'un des rares leviers de déduction encore actifs après la fin des mesures transitoires d'écrêtement." },
];

const faqsEn = [
  { question: "What is a TIH provider?", answer: "A TIH (Travailleur Indépendant Handicapé — independent worker with disability) is a French self-employed worker who holds a RQTH (recognition of disabled-worker status) and operates as a sole proprietorship. Since the 2016 Macron Law no specific accreditation is required. France has between 75,000 and 80,000 TIH workers." },
  { question: "How much can I deduct from my AGEFIPH contribution?", answer: "You can deduct 30% of the labor cost of services invoiced by a TIH. For an intellectual service such as web development, that's 30% of the pre-tax amount. The deduction is capped at 50% of your gross contribution if your disabled-worker employment rate is below 3%, or 75% if it is 3% or above." },
  { question: "How does the deductibility attestation work?", answer: "Next Impact provides you with an annual deductibility attestation compliant with article D.5212-7 of the French Labor Code. This document certifies the amount of services delivered and the deductible amount. You attach it to your annual OETH return submitted to URSSAF." },
  { question: "My company has fewer than 20 employees — am I concerned?", answer: "The 6% disabled-workers employment obligation only applies to companies with 20 employees or more. Below this threshold, you have no AGEFIPH contribution to pay and the TIH deduction doesn't apply. You still benefit from the same quality of service." },
  { question: "Can the TIH deduction be combined with other OETH actions?", answer: "Yes. TIH subcontracting is one lever among others to reduce your contribution: direct employment of disabled workers, hosting disabled interns, purchases from EA/ESAT. Since 2025, TIH/EA/ESAT subcontracting is one of the few remaining active deduction levers after the end of the transitional capping measures." },
];

export default function AvantageOethClient() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const steps = isEn ? stepsEn : stepsFr;
  const faqs = isEn ? faqsEn : faqsFr;

  // Barème 2025 — données pour le chart (en milliers d'€, par TH manquant).
  const baremeData = [
    { label: isEn ? "20–249" : "20–249", value: 4.752 },
    { label: isEn ? "250–749" : "250–749", value: 5.94 },
    { label: isEn ? "750+" : "750+", value: 7.128 },
  ];

  const baremeRows = isEn
    ? [
        { range: "20-249 employees", amount: "400 × min. wage = €4,752 / missing disabled worker" },
        { range: "250-749 employees", amount: "500 × min. wage = €5,940 / missing disabled worker" },
        { range: "750+ employees", amount: "600 × min. wage = €7,128 / missing disabled worker" },
      ]
    : [
        { range: "20-249 salariés", amount: "400 × SMIC = 4 752 € / TH manquant" },
        { range: "250-749 salariés", amount: "500 × SMIC = 5 940 € / TH manquant" },
        { range: "750+ salariés", amount: "600 × SMIC = 7 128 € / TH manquant" },
      ];

  return (
    <PageLayout
      titre={isEn ? "Reduce your AGEFIPH contribution by investing in your web project" : "Réduisez votre contribution AGEFIPH en investissant dans votre projet web"}
      sousTitre={isEn
        ? "TIH provider specialized in building websites and applications: 30% of labor cost deductible from your French disability employment obligation, whatever the project type."
        : "Prestataire TIH spécialisé création de sites et d'applications : 30 % du coût de main-d'œuvre déductible de votre obligation d'emploi, quelle que soit la nature du projet."}
    >

      {/* EN-only context note */}
      {isEn && (
        <BlueprintSection innerClassName="px-6 py-10 lg:px-8 lg:py-12">
          <Reveal className="flex gap-3 rounded-md border border-dark-gray bg-jet p-5">
            <Info size={16} className="mt-0.5 shrink-0 text-accent-secondary" />
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              <strong className="font-medium text-foreground">French legal scheme.</strong>{" "}
              AGEFIPH is the French employment-of-disabled-workers contribution. This page is most relevant for companies operating in France: it explains how they can reduce that contribution by 30% of labor cost when subcontracting to a TIH-certified independent (Travailleur Indépendant Handicapé).
            </p>
          </Reveal>
        </BlueprintSection>
      )}

      <Separator />

      {/* № 01 — Comment ça marche (2 étapes) */}
      <BlueprintSection>
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 01"
            kicker={isEn ? "A simple process" : "Un processus simple"}
            title={isEn ? "How does it work?" : "Comment ça marche ?"}
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-2">
          {steps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div
                className={
                  "flex h-full flex-col p-6 lg:p-8" +
                  (i < steps.length - 1 ? " border-b border-dark-gray md:border-b-0 md:border-r md:border-dark-gray" : "")
                }
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-accent-secondary">
                    {step.number}
                  </span>
                  <step.Icon size={26} strokeWidth={1.5} className="block text-mid-gray" />
                </div>
                <h3 className="mb-3 text-xl font-light tracking-tight text-foreground md:text-2xl">
                  {step.title}
                </h3>
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {step.description}
                </p>
                {step.number === "01" && (
                  <div className="mt-6 border-t border-dark-gray pt-6">
                    <MeterBar
                      value={30}
                      label={isEn ? "Labor cost deductible" : "Coût de main-d'œuvre déductible"}
                      sublabel="30 %"
                    />
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* Simulateur (composant inchangé, posé dans la grille blueprint) */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <SimulateurAgefiph />
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* № 02 — Contexte OETH 2025-2026 */}
      <BlueprintSection>
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "Regulatory update" : "Évolution réglementaire"}
            title={isEn ? "OETH context 2025–2026" : "Contexte OETH 2025–2026"}
          />
        </Reveal>

        <div className="grid md:grid-cols-2">
          {([
            {
              Icon: Scale,
              title: isEn ? "TIH subcontracting remains an active lever" : "La sous-traitance TIH reste un levier actif",
              content: isEn
                ? "Among the few remaining active deduction levers in 2025, subcontracting to TIH, EA and ESAT remains fully deductible from the AGEFIPH contribution."
                : "Parmi les rares leviers de déduction encore actifs en 2025, la sous-traitance auprès de TIH, EA et ESAT reste pleinement déductible de la contribution AGEFIPH.",
            },
            {
              Icon: TrendingUp,
              title: isEn ? "Over-contribution" : "Surcontribution",
              content: isEn
                ? "Companies that take no action for 3 consecutive years face an over-contribution of 1,500 × hourly minimum wage per missing disabled worker (€17,820 in 2025)."
                : "Les entreprises n'ayant entrepris aucune action pendant 3 années consécutives s'exposent à une surcontribution de 1 500 × SMIC horaire par TH manquant (soit 17 820 € en 2025).",
            },
            {
              Icon: GitBranch,
              title: isEn ? "2025 rate schedule" : "Barème 2025",
              content: (
                <div className="flex flex-col gap-5">
                  <ul className="flex flex-col gap-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                    {baremeRows.map((row) => (
                      <li key={row.range}>
                        <strong className="font-medium text-foreground">{row.range}</strong> : {row.amount}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-md border border-dark-gray bg-jet p-3">
                    <BarBreakdown data={baremeData} highlightIndex={2} height={140} />
                    <p className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                      {isEn ? "k€ per missing disabled worker" : "k€ par TH manquant"}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              Icon: Bell,
              title: isEn ? "End of the transitional capping" : "Fin de l'écrêtement",
              content: isEn
                ? "Since January 1, 2025, the transitional capping measures have ended. Some expenses that were previously deductible no longer are. The AGEFIPH contribution now reaches its real amount for all companies."
                : "Depuis le 1er janvier 2025, les mesures transitoires d'écrêtement sont terminées. Certaines dépenses autrefois déductibles ne le sont plus. La contribution AGEFIPH atteint désormais son montant réel pour toutes les entreprises.",
            },
          ] as { Icon: LucideIcon; title: string; content: React.ReactNode }[]).map((card, i) => (
            <div
              key={card.title}
              className={
                "flex flex-col p-6 lg:p-8" +
                (i % 2 === 0 ? " md:border-r md:border-dark-gray" : "") +
                (i < 2 ? " border-b border-dark-gray" : "")
              }
            >
              <div className="mb-4 flex items-start gap-3">
                <card.Icon size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-mid-gray" />
                <h3 className="text-lg font-light leading-snug tracking-tight text-foreground">
                  {card.title}
                </h3>
              </div>
              {typeof card.content === "string" ? (
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{card.content}</p>
              ) : (
                card.content
              )}
            </div>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* № 03 — Double Impact */}
      <BlueprintSection tone="jet">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 03"
            kicker={isEn ? "An investment with double payoff" : "Un investissement à double bénéfice"}
            title={isEn ? "Why choose a TIH specialist?" : "Pourquoi choisir un prestataire TIH spécialisé ?"}
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-2">
          {/* Performance technique */}
          <StaggerItem>
            <div className="flex h-full flex-col border-b border-dark-gray p-6 md:border-b-0 md:border-r md:border-dark-gray lg:p-8">
              <Gauge size={26} strokeWidth={1.5} className="mb-5 block text-mid-gray" />
              <h3 className="mb-3 text-xl font-light tracking-tight text-foreground md:text-2xl">
                {isEn ? "Technical performance" : "Performance technique"}
              </h3>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {isEn
                  ? "Modern tech standards on every project: load times under 1s, maximum security, SEO and accessibility carefully tuned — whether classic WordPress, Headless or a custom application."
                  : "Des standards techniques élevés sur tous les projets : temps de chargement < 1s, sécurité renforcée, SEO et accessibilité soignés — que ce soit un site WordPress, Headless ou une application sur-mesure."}
              </p>
              <div className="mt-6 flex flex-col gap-3 border-t border-dark-gray pt-6">
                <MeterBar value={95} label={isEn ? "Performance" : "Performance"} sublabel="> 90" />
                <MeterBar value={92} label={isEn ? "Accessibility" : "Accessibilité"} sublabel="A11y" />
              </div>
            </div>
          </StaggerItem>

          {/* Avantage fiscal */}
          <StaggerItem>
            <div className="flex h-full flex-col p-6 lg:p-8">
              <BarChart2 size={26} strokeWidth={1.5} className="mb-5 block text-mid-gray" />
              <h3 className="mb-3 text-xl font-light tracking-tight text-foreground md:text-2xl">
                {isEn ? "Tax benefit" : "Avantage fiscal"}
              </h3>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {isEn
                  ? "30% of the labor cost deductible from your AGEFIPH contribution. A web investment that directly reduces your social-charge bill."
                  : "30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH. Un investissement web qui réduit directement vos charges sociales."}
              </p>
              <div className="mt-6 flex justify-center border-t border-dark-gray pt-6">
                <RadialGauge
                  value={30}
                  size={140}
                  label={isEn ? "labor cost" : "coût de main-d'œuvre"}
                  sublabel={isEn ? "deductible" : "déductible"}
                />
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* CTA */}
      <BlueprintSection innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <Reveal className="flex flex-col">
          <h2 className="max-w-2xl text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-4xl">
            {isEn ? "Ready to reduce your AGEFIPH contribution?" : "Prêt à réduire votre contribution AGEFIPH ?"}
          </h2>
          <p className="mt-5 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray">
            {isEn
              ? "Let's discuss your web project. I'll provide a detailed quote with the exact amount deductible from your AGEFIPH contribution."
              : "Discutons de votre projet web. Je vous fournirai un devis détaillé avec le montant exact déductible de votre contribution AGEFIPH."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className={BTN_PRIMARY}>
              {isEn ? "Discuss my project" : "Discuter de mon projet"}
              <ArrowRight size={14} />
            </Link>
            <Link href="/solutions-web" className={BTN_GHOST}>
              {isEn ? "View offerings" : "Voir les offres"}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* № 04 — Articles */}
      <BlueprintSection>
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 04"
            kicker={isEn ? "Going further" : "Pour aller plus loin"}
            title={isEn ? "OETH guides and resources" : "Guides et ressources OETH"}
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-2">
          {(isEn
            ? [
                { href: "/articles/reduire-contribution-agefiph-sous-traitance-tih", title: "Reducing your AGEFIPH contribution", description: "Complete guide for HR and CFOs: 2025 rate schedule, deduction calculation and optimization strategy.", tag: "HR / CFO" },
                { href: "/articles/attestation-deductibilite-tih-guide-entreprises", title: "TIH deductibility attestation", description: "Step-by-step process, content of the attestation, accounting watch-points and typical timeline.", tag: "Accounting" },
              ]
            : [
                { href: "/articles/reduire-contribution-agefiph-sous-traitance-tih", title: "Réduire sa contribution AGEFIPH", description: "Guide complet pour les RH et DAF : barème 2025, calcul de la déduction et stratégie d'optimisation.", tag: "RH / DAF" },
                { href: "/articles/attestation-deductibilite-tih-guide-entreprises", title: "Attestation de déductibilité TIH", description: "Processus pas à pas, contenu de l'attestation, points de vigilance comptables et calendrier type.", tag: "Comptabilité" },
              ]
          ).map((article, i) => (
            <StaggerItem key={article.href}>
              <Link
                href={article.href as Parameters<typeof Link>[0]["href"]}
                className={
                  "group flex h-full flex-col p-6 transition-colors hover:bg-jet lg:p-8" +
                  (i === 0 ? " border-b border-dark-gray md:border-b-0 md:border-r md:border-dark-gray" : "")
                }
              >
                <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {article.tag}
                </div>
                <h3 className="mb-2.5 text-xl font-light tracking-tight text-foreground">
                  {article.title}
                </h3>
                <p className="mb-4 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                  {article.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors group-hover:text-foreground">
                  {isEn ? "Read the article" : "Lire l'article"}
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* FAQ — bande blueprint autoportée (FaqSchema rend sa propre section) */}
      <FaqSchema
        faqs={faqs}
        title={isEn ? "FAQ on OETH and the TIH status" : "Questions fréquentes sur l'OETH et le statut TIH"}
        description={isEn
          ? "Everything you need to know about the AGEFIPH deduction via subcontracting to a TIH provider."
          : "Tout ce que vous devez savoir sur la déduction AGEFIPH via la sous-traitance à un prestataire TIH."}
        sectionId="faq-oeth"
      />

    </PageLayout>
  );
}
