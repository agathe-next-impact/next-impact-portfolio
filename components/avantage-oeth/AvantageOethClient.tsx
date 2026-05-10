"use client";

import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import SimulateurAgefiph from "@/components/simulateur-agefiph";
import FaqSchema from "@/components/services/FaqSchema";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

const stepsFr = [
  {
    number: "01",
    iconSrc: "/icons/analytics-icon.svg",
    title: "30% déductibles automatiquement",
    description:
      "30% du coût de main-d'œuvre de la prestation est déductible de votre contribution annuelle AGEFIPH. Le calcul est intégré à la facture.",
    color: "text-lightyellow",
    borderColor: "border-lightyellow/20",
    bgColor: "bg-lightyellow/5",
  },
  {
    number: "02",
    iconSrc: "/icons/shield-icon.svg",
    title: "Attestation officielle",
    description:
      "Vous recevez une attestation de déductibilité annuelle conforme à l'article D.5212-7 du Code du travail, à joindre à votre déclaration OETH.",
    color: "text-lightblue",
    borderColor: "border-lightblue/20",
    bgColor: "bg-lightblue/5",
  },
];

const stepsEn = [
  {
    number: "01",
    iconSrc: "/icons/analytics-icon.svg",
    title: "30% deductible automatically",
    description:
      "30% of the labor cost of the service is deductible from your annual AGEFIPH contribution. The calculation is built into the invoice.",
    color: "text-lightyellow",
    borderColor: "border-lightyellow/20",
    bgColor: "bg-lightyellow/5",
  },
  {
    number: "02",
    iconSrc: "/icons/shield-icon.svg",
    title: "Official attestation",
    description:
      "You receive an annual deductibility attestation compliant with article D.5212-7 of the French Labor Code, to attach to your OETH return.",
    color: "text-lightblue",
    borderColor: "border-lightblue/20",
    bgColor: "bg-lightblue/5",
  },
];

const faqsFr = [
  {
    question: "Qu'est-ce qu'un prestataire TIH ?",
    answer:
      "Un TIH (Travailleur Indépendant Handicapé) est un indépendant disposant d'une RQTH (Reconnaissance de la Qualité de Travailleur Handicapé) et exerçant en Entreprise Individuelle. Depuis la loi Macron de 2016, aucun agrément n'est nécessaire. La France compte entre 75 000 et 80 000 TIH.",
  },
  {
    question: "Combien puis-je déduire de ma contribution AGEFIPH ?",
    answer:
      "Vous pouvez déduire 30% du coût de main-d'œuvre des prestations facturées par un TIH. Pour une prestation intellectuelle comme le développement web, cela correspond à 30% du montant HT. Cette déduction est plafonnée à 50% de votre contribution brute si votre taux d'emploi TH est inférieur à 3%, ou 75% si votre taux est supérieur ou égal à 3%.",
  },
  {
    question: "Comment fonctionne l'attestation de déductibilité ?",
    answer:
      "Next Impact vous fournit une attestation de déductibilité annuelle, conforme à l'article D.5212-7 du Code du travail. Ce document certifie le montant des prestations réalisées et le montant déductible. Vous le joignez à votre déclaration annuelle OETH (Obligation d'Emploi des Travailleurs Handicapés) auprès de l'URSSAF.",
  },
  {
    question: "Mon entreprise a moins de 20 salariés, suis-je concerné ?",
    answer:
      "L'obligation d'emploi de 6% de travailleurs handicapés ne concerne que les entreprises de 20 salariés et plus. Si votre entreprise est en dessous de ce seuil, vous n'avez pas de contribution AGEFIPH à payer et la déduction TIH ne s'applique pas. Vous bénéficiez néanmoins de la même qualité de prestation.",
  },
  {
    question:
      "La déduction TIH est-elle cumulable avec d'autres actions OETH ?",
    answer:
      "Oui. La sous-traitance TIH est un levier parmi d'autres pour réduire votre contribution : emploi direct de TH, accueil de stagiaires handicapés, achats auprès d'EA/ESAT. Depuis 2025, la sous-traitance TIH/EA/ESAT reste l'un des rares leviers de déduction encore actifs après la fin des mesures transitoires d'écrêtement.",
  },
];

const faqsEn = [
  {
    question: "What is a TIH provider?",
    answer:
      "A TIH (Travailleur Indépendant Handicapé — independent worker with disability) is a French self-employed worker who holds a RQTH (recognition of disabled-worker status) and operates as a sole proprietorship. Since the 2016 Macron Law no specific accreditation is required. France has between 75,000 and 80,000 TIH workers.",
  },
  {
    question: "How much can I deduct from my AGEFIPH contribution?",
    answer:
      "You can deduct 30% of the labor cost of services invoiced by a TIH. For an intellectual service such as web development, that's 30% of the pre-tax amount. The deduction is capped at 50% of your gross contribution if your disabled-worker employment rate is below 3%, or 75% if it is 3% or above.",
  },
  {
    question: "How does the deductibility attestation work?",
    answer:
      "Next Impact provides you with an annual deductibility attestation compliant with article D.5212-7 of the French Labor Code. This document certifies the amount of services delivered and the deductible amount. You attach it to your annual OETH return (the French Obligation d'Emploi des Travailleurs Handicapés — disabled-workers employment obligation) submitted to URSSAF.",
  },
  {
    question: "My company has fewer than 20 employees — am I concerned?",
    answer:
      "The 6% disabled-workers employment obligation only applies to companies with 20 employees or more. Below this threshold, you have no AGEFIPH contribution to pay and the TIH deduction doesn't apply. You still benefit from the same quality of service.",
  },
  {
    question: "Can the TIH deduction be combined with other OETH actions?",
    answer:
      "Yes. TIH subcontracting is one lever among others to reduce your contribution: direct employment of disabled workers, hosting disabled interns, purchases from EA/ESAT (French sheltered workshops and adapted enterprises). Since 2025, TIH/EA/ESAT subcontracting is one of the few remaining active deduction levers after the end of the transitional capping measures.",
  },
];

export default function AvantageOethClient() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const steps = isEn ? stepsEn : stepsFr;
  const faqs = isEn ? faqsEn : faqsFr;

  return (
    <PageLayout
      titre={
        isEn
          ? "Reduce your AGEFIPH contribution by investing in your website"
          : "Réduisez votre contribution AGEFIPH en investissant dans votre site web"
      }
      sousTitre={
        isEn
          ? "TIH provider specialized in Headless WordPress: 30% of labor cost deductible from your French disability employment obligation."
          : "Prestataire TIH spécialisé WordPress Headless : 30% du coût de main-d'œuvre déductible de votre obligation d'emploi."
      }
    >
      <div className="mt-8 mb-6 space-y-24">
        {isEn && (
          <section className="container mx-auto px-4 -mt-12">
            <div className="max-w-3xl mx-auto rounded-2xl border border-lightyellow/30 bg-lightyellow/5 p-5 flex items-start gap-3">
              <Info className="size-5 text-lightyellow shrink-0 mt-0.5" />
              <p className="text-white/80 font-googletexte text-sm leading-relaxed">
                <strong className="text-lightyellow">French legal scheme.</strong>{" "}
                AGEFIPH is the French employment-of-disabled-workers contribution.
                This page is most relevant for companies operating in France: it
                explains how they can reduce that contribution by 30% of labor
                cost when subcontracting to a TIH-certified independent
                (Travailleur Indépendant Handicapé).
              </p>
            </div>
          </section>
        )}
        {/* Section Comment ça marche — 3 étapes */}
        <section className="container mx-auto px-4">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            {isEn ? "A simple process" : "Un processus simple"}
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            {isEn ? "How does it work?" : "Comment ça marche ?"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className={`flex flex-col items-center text-center border ${step.borderColor} rounded-2xl p-8 ${step.bgColor} backdrop-blur-sm`}
              >
                <Image src={step.iconSrc} alt={step.title} width={60} height={60} className="mb-4" />
                <h3 className="text-2xl font-googletitre font-medium text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section Simulateur */}
        <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
          <div className="container mx-auto px-4">
            <SimulateurAgefiph />
          </div>
        </section>

        {/* Section Contexte 2025-2026 */}
        <section className="container mx-auto px-4">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            {isEn ? "Regulatory update" : "Évolution réglementaire"}
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            {isEn ? "OETH context 2025-2026" : "Contexte OETH 2025-2026"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="border border-lightyellow/20 rounded-2xl p-8 bg-mediumblue/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image src="/icons/scale-icon.svg" alt={isEn ? "TIH subcontracting" : "Sous-traitance TIH"} width={50} height={50} className="shrink-0 mt-2" />
                <h3 className="text-2xl font-googletitre font-medium text-white">
                  {isEn
                    ? "TIH subcontracting remains an active lever"
                    : "La sous-traitance TIH reste un levier actif"}
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed">
                {isEn
                  ? "Among the few remaining active deduction levers in 2025, subcontracting to TIH, EA and ESAT (sheltered workshops and adapted enterprises) remains fully deductible from the AGEFIPH contribution. A strategic advantage to exploit."
                  : "Parmi les rares leviers de déduction encore actifs en 2025, la sous-traitance auprès de TIH, EA et ESAT reste pleinement déductible de la contribution AGEFIPH. Un avantage stratégique à exploiter."}
              </p>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="border border-coral/20 rounded-2xl p-8 bg-mediumblue/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image src="/icons/growth-icon.svg" alt={isEn ? "Over-contribution" : "Surcontribution"} width={50} height={50} className="shrink-0 mt-2" />
                <h3 className="text-2xl font-googletitre font-medium text-white">
                  {isEn ? "Over-contribution" : "Surcontribution"}
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed">
                {isEn ? (
                  <>
                    Companies that take no action in favor of disabled-worker
                    employment for 3 consecutive years are exposed to an
                    over-contribution of{" "}
                    <strong className="text-coral">
                      1,500 × hourly minimum wage per missing disabled worker
                    </strong>{" "}
                    (€17,820 in 2025).
                  </>
                ) : (
                  <>
                    Les entreprises n&apos;ayant entrepris aucune action en faveur
                    de l&apos;emploi des travailleurs handicapés pendant 3 années
                    consécutives s&apos;exposent à une surcontribution de{" "}
                    <strong className="text-coral">
                      1 500 × SMIC horaire par TH manquant
                    </strong>{" "}
                    (soit 17 820 € en 2025).
                  </>
                )}
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="border border-lightblue/20 rounded-2xl p-8 bg-mediumblue/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image src="/icons/workflow-icon.svg" alt={isEn ? "Rate schedule" : "Barème"} width={50} height={50} className="shrink-0 mt-2" />
                <h3 className="text-2xl font-googletitre font-medium text-white">
                  {isEn ? "2025 rate schedule" : "Barème 2025"}
                </h3>
              </div>
              <ul className="space-y-2 text-white/70 font-googletexte leading-relaxed">
                {isEn ? (
                  <>
                    <li>
                      <strong className="text-white/90">20-249 employees</strong>
                      : 400 × min. wage = €4,752 / missing disabled worker
                    </li>
                    <li>
                      <strong className="text-white/90">250-749 employees</strong>
                      : 500 × min. wage = €5,940 / missing disabled worker
                    </li>
                    <li>
                      <strong className="text-white/90">750+ employees</strong>
                      : 600 × min. wage = €7,128 / missing disabled worker
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <strong className="text-white/90">20-249 salariés</strong>{" "}
                      : 400 × SMIC = 4 752 € / TH manquant
                    </li>
                    <li>
                      <strong className="text-white/90">250-749 salariés</strong>{" "}
                      : 500 × SMIC = 5 940 € / TH manquant
                    </li>
                    <li>
                      <strong className="text-white/90">750+ salariés</strong>{" "}
                      : 600 × SMIC = 7 128 € / TH manquant
                    </li>
                  </>
                )}
              </ul>
            </motion.div>

            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="border border-coral/20 rounded-2xl p-8 bg-mediumblue/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image src="/icons/notification-icon.svg" alt={isEn ? "End of capping" : "Écrêtement"} width={60} height={60} className="shrink-0 mt-2" />
                <h3 className="text-2xl font-googletitre font-medium text-white">
                  {isEn ? "End of the transitional capping" : "Fin de l'écrêtement"}
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed">
                {isEn
                  ? "Since January 1, 2025, the transitional capping measures have ended. Some expenses that were previously deductible no longer are. The AGEFIPH contribution now reaches its real amount for all companies."
                  : "Depuis le 1er janvier 2025, les mesures transitoires d'écrêtement sont terminées. Certaines dépenses autrefois déductibles ne le sont plus. La contribution AGEFIPH atteint désormais son montant réel pour toutes les entreprises."}
              </p>
            </motion.div>

          </div>
        </section>

        {/* Section Double Impact */}
        <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
              {isEn ? "An investment with double payoff" : "Un investissement à double bénéfice"}
            </p>
            <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
              {isEn
                ? "Why choose a TIH provider specialized in Headless WordPress?"
                : "Pourquoi choisir un prestataire TIH spécialisé WordPress Headless ?"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm"
              >
                <Image src="/icons/speed-icon.svg" alt="Performance" width={60} height={60} />
                <h3 className="text-2xl font-googletitre font-medium text-white mb-3">
                  {isEn ? "Technical performance" : "Performance technique"}
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  {isEn
                    ? "A Headless WordPress site at modern tech standards: load times under 1s, maximum security, natively optimized SEO with Next.js or Astro."
                    : "Un site WordPress Headless aux standards de la Tech : temps de chargement < 1s, sécurité maximale, SEO optimisé nativement avec Next.js ou Astro."}
                </p>
              </motion.div>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm"
              >
                <Image src="/icons/analytics-icon.svg" alt={isEn ? "Tax benefit" : "Avantage fiscal"} width={60} height={60} />
                <h3 className="text-2xl font-googletitre font-medium text-white mb-3">
                  {isEn ? "Tax benefit" : "Avantage fiscal"}
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  {isEn
                    ? "30% of the labor cost deductible from your AGEFIPH contribution. A web investment that directly reduces your social-charge bill."
                    : "30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH. Un investissement web qui réduit directement vos charges sociales."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center border border-lightyellow/20 rounded-2xl p-8 md:p-12 bg-lightyellow/5 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-4">
              {isEn
                ? "Ready to reduce your AGEFIPH contribution?"
                : "Prêt à réduire votre contribution AGEFIPH ?"}
            </h2>
            <p className="text-white/70 font-googletexte leading-relaxed mb-8 max-w-xl mx-auto">
              {isEn
                ? "Let's discuss your web project. I'll provide a detailed quote with the exact amount deductible from your AGEFIPH contribution."
                : "Discutons de votre projet web. Je vous fournirai un devis détaillé avec le montant exact déductible de votre contribution AGEFIPH."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="h-12 px-8 font-bold font-googletitre text-lg rounded-full bg-lightyellow text-darkblue transition-all duration-300">
                  {isEn ? "Discuss my project" : "Discuter de mon projet"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="h-12 px-8 font-googletitre text-lg text-white hover:text-white/80 rounded-full border-white/20 bg-mediumblue hover:bg-mediumblue/80 transition-all duration-300"
                >
                  {isEn ? "View offerings" : "Voir les offres"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Articles — Pour aller plus loin */}
        <section className="container mx-auto px-4 pb-20">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            {isEn ? "Going further" : "Pour aller plus loin"}
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            {isEn ? "OETH guides and resources" : "Guides et ressources OETH"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {(isEn
              ? [
                  {
                    href: "/articles/reduire-contribution-agefiph-sous-traitance-tih",
                    title: "Reducing your AGEFIPH contribution",
                    description:
                      "Complete guide for HR and CFOs: 2025 rate schedule, deduction calculation and optimization strategy.",
                    tag: "HR / CFO",
                    color: "text-coral",
                    borderColor: "border-coral/20",
                  },
                  {
                    href: "/articles/attestation-deductibilite-tih-guide-entreprises",
                    title: "TIH deductibility attestation",
                    description:
                      "Step-by-step process, content of the attestation, accounting watch-points and typical timeline.",
                    tag: "Accounting",
                    color: "text-lightyellow",
                    borderColor: "border-lightyellow/20",
                  },
                ]
              : [
                  {
                    href: "/articles/reduire-contribution-agefiph-sous-traitance-tih",
                    title: "Réduire sa contribution AGEFIPH",
                    description:
                      "Guide complet pour les RH et DAF : barème 2025, calcul de la déduction et stratégie d'optimisation.",
                    tag: "RH / DAF",
                    color: "text-coral",
                    borderColor: "border-coral/20",
                  },
                  {
                    href: "/articles/attestation-deductibilite-tih-guide-entreprises",
                    title: "Attestation de déductibilité TIH",
                    description:
                      "Processus pas à pas, contenu de l'attestation, points de vigilance comptables et calendrier type.",
                    tag: "Comptabilité",
                    color: "text-lightyellow",
                    borderColor: "border-lightyellow/20",
                  },
                ]
            ).map((article) => (
              <Link key={article.href} href={article.href} className="group">
                <div
                  className={`flex flex-col h-full border ${article.borderColor} rounded-2xl p-6 bg-darkblue/40 backdrop-blur-sm hover:bg-darkblue/60 transition-all duration-300`}
                >
                  <span
                    className={`text-xs font-googletexte uppercase tracking-widest ${article.color} mb-3`}
                  >
                    {article.tag}
                  </span>
                  <h3 className="text-xl font-googletitre font-medium text-white mb-2 group-hover:text-lightyellow transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-white/60 font-googletexte text-sm leading-relaxed flex-1">
                    {article.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-white/50 font-googletexte mt-4 group-hover:text-lightyellow transition-colors">
                    {isEn ? "Read the article" : "Lire l'article"}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

        {/* FAQ */}
        <div className="bg-mediumblue/80 backdrop-blur-md mt-20 pt-20">
        <FaqSchema
          faqs={faqs}
          title={
            isEn
              ? "FAQ on OETH and the TIH status"
              : "Questions fréquentes sur l'OETH et le statut TIH"
          }
          description={
            isEn
              ? "Everything you need to know about the AGEFIPH deduction via subcontracting to a TIH provider."
              : "Tout ce que vous devez savoir sur la déduction AGEFIPH via la sous-traitance à un prestataire TIH."
          }
          sectionId="faq-oeth"
        />
        </div>
    </PageLayout>
  );
}
