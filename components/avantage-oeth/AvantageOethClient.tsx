"use client";

import { motion } from "framer-motion";
import {
  FileCheck,
  Zap,
  Heart,
  BadgePercent,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Scale,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageLayout from "@/components/page-layout";
import SimulateurAgefiph from "@/components/simulateur-agefiph";
import FaqSchema from "@/components/services/FaqSchema";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

const steps = [
  {
    number: "01",
    icon: FileCheck,
    title: "Confiez votre projet web",
    description:
      "Vous travaillez avec Next Impact, prestataire TIH spécialisé WordPress Headless. Aucune démarche administrative supplémentaire de votre côté.",
    color: "text-coral",
    borderColor: "border-coral/20",
    bgColor: "bg-coral/5",
  },
  {
    number: "02",
    icon: BadgePercent,
    title: "30% déductibles automatiquement",
    description:
      "30% du coût de main-d'œuvre de la prestation est déductible de votre contribution annuelle AGEFIPH. Le calcul est intégré à la facture.",
    color: "text-lightyellow",
    borderColor: "border-lightyellow/20",
    bgColor: "bg-lightyellow/5",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Attestation officielle",
    description:
      "Vous recevez une attestation de déductibilité annuelle conforme à l'article D.5212-7 du Code du travail, à joindre à votre déclaration OETH.",
    color: "text-lightblue",
    borderColor: "border-lightblue/20",
    bgColor: "bg-lightblue/5",
  },
];

const faqs = [
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

export default function AvantageOethClient() {
  return (
    <PageLayout
      titre="Réduisez votre contribution AGEFIPH en investissant dans votre site web"
      sousTitre="Prestataire TIH spécialisé WordPress Headless : 30% du coût de main-d'œuvre déductible de votre obligation d'emploi."
    >
      <div className="mt-8 mb-6 space-y-24">
        {/* Section Comment ça marche — 3 étapes */}
        <section className="container mx-auto px-4">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            Un processus simple
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <span
                  className={`text-5xl font-googletitre font-medium ${step.color} mb-4`}
                >
                  {step.number}
                </span>
                <step.icon className={`h-10 w-10 ${step.color} mb-4`} />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
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
            Évolution réglementaire
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            Contexte OETH 2025-2026
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="border border-coral/20 rounded-2xl p-8 bg-mediumblue/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-coral shrink-0" />
                <h3 className="text-xl font-googletitre font-medium text-white">
                  Fin de l&apos;écrêtement
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed">
                Depuis le 1er janvier 2025, les mesures transitoires
                d&apos;écrêtement sont terminées. Certaines dépenses
                autrefois déductibles ne le sont plus. La contribution
                AGEFIPH atteint désormais son montant réel pour toutes les
                entreprises.
              </p>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="border border-lightyellow/20 rounded-2xl p-8 bg-mediumblue/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-8 w-8 text-lightyellow shrink-0" />
                <h3 className="text-xl font-googletitre font-medium text-white">
                  La sous-traitance TIH reste un levier actif
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed">
                Parmi les rares leviers de déduction encore actifs en 2025,
                la sous-traitance auprès de TIH, EA et ESAT reste pleinement
                déductible de la contribution AGEFIPH. Un avantage
                stratégique à exploiter.
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
                <TrendingUp className="h-8 w-8 text-coral shrink-0" />
                <h3 className="text-xl font-googletitre font-medium text-white">
                  Surcontribution
                </h3>
              </div>
              <p className="text-white/70 font-googletexte leading-relaxed">
                Les entreprises n&apos;ayant entrepris aucune action en faveur
                de l&apos;emploi des travailleurs handicapés pendant 3 années
                consécutives s&apos;exposent à une surcontribution de{" "}
                <strong className="text-coral">
                  1 500 × SMIC horaire par TH manquant
                </strong>{" "}
                (soit 17 820 € en 2025).
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
                <Calendar className="h-8 w-8 text-lightblue shrink-0" />
                <h3 className="text-xl font-googletitre font-medium text-white">
                  Barème 2025
                </h3>
              </div>
              <ul className="space-y-2 text-white/70 font-googletexte leading-relaxed">
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
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Section Double Impact */}
        <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
              Un investissement à triple bénéfice
            </p>
            <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
              Double impact, triple avantage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm"
              >
                <Zap className="h-12 w-12 text-lightyellow mb-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  Performance technique
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  Un site WordPress Headless aux standards de la Tech :
                  temps de chargement &lt; 1s, sécurité maximale, SEO
                  optimisé nativement avec Next.js ou Astro.
                </p>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm"
              >
                <Heart className="h-12 w-12 text-coral mb-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  Impact social
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  En travaillant avec une prestataire TIH, vous contribuez
                  à l&apos;emploi inclusif et à la transition numérique de
                  l&apos;ESS. Votre projet web a un impact concret.
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
                <BadgePercent className="h-12 w-12 text-lightblue mb-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  Avantage fiscal
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  30% du coût de main-d&apos;œuvre déductible de votre
                  contribution AGEFIPH. Un investissement web qui réduit
                  directement vos charges sociales.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center border border-lightyellow/20 rounded-2xl p-8 md:p-12 bg-lightyellow/5 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-4">
              Prêt à réduire votre contribution AGEFIPH ?
            </h2>
            <p className="text-white/70 font-googletexte leading-relaxed mb-8 max-w-xl mx-auto">
              Discutons de votre projet web. Je vous fournirai un devis
              détaillé avec le montant exact déductible de votre contribution
              AGEFIPH.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="h-12 px-8 font-bold font-googletitre text-base rounded-full shadow bg-lightyellow text-darkblue hover:shadow-[0_0_20px_rgba(242,229,126,0.45)] transition-all duration-300">
                  Discuter de mon projet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="h-12 px-8 font-googletitre text-base rounded-full border-white/20 text-mediumblue hover:bg-white/10"
                >
                  Voir les offres
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Articles — Pour aller plus loin */}
        <section className="container mx-auto px-4 pb-20">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            Pour aller plus loin
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-12 text-center">
            Guides et ressources OETH
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                href: "/articles/reduire-contribution-agefiph-sous-traitance-tih",
                title: "Réduire sa contribution AGEFIPH grâce à la sous-traitance TIH",
                description:
                  "Guide complet pour les RH et DAF : barème 2025, calcul de la déduction et stratégie d'optimisation.",
                tag: "RH / DAF",
                color: "text-coral",
                borderColor: "border-coral/20",
              },
              {
                href: "/articles/attestation-deductibilite-tih-guide-entreprises",
                title: "Attestation de déductibilité TIH : guide pratique",
                description:
                  "Processus pas à pas, contenu de l'attestation, points de vigilance comptables et calendrier type.",
                tag: "Comptabilité",
                color: "text-lightyellow",
                borderColor: "border-lightyellow/20",
              },
              {
                href: "/articles/wordpress-headless-impact-social-pme-engagees",
                title: "WordPress Headless + impact social : pourquoi les PME engagées choisissent Next Impact",
                description:
                  "Performance technique, emploi inclusif et avantage fiscal : un investissement web à triple bénéfice.",
                tag: "RSE / Dirigeants",
                color: "text-lightblue",
                borderColor: "border-lightblue/20",
              },
            ].map((article) => (
              <Link key={article.href} href={article.href} className="group">
                <div
                  className={`flex flex-col h-full border ${article.borderColor} rounded-2xl p-6 bg-darkblue/40 backdrop-blur-sm hover:bg-darkblue/60 transition-all duration-300`}
                >
                  <span
                    className={`text-xs font-googletexte uppercase tracking-widest ${article.color} mb-3`}
                  >
                    {article.tag}
                  </span>
                  <h3 className="text-lg font-googletitre font-medium text-white mb-2 group-hover:text-lightyellow transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-white/60 font-googletexte text-sm leading-relaxed flex-1">
                    {article.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-white/50 font-googletexte mt-4 group-hover:text-lightyellow transition-colors">
                    Lire l&apos;article
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <FaqSchema
          faqs={faqs}
          title="Questions fréquentes sur l'OETH et le statut TIH"
          description="Tout ce que vous devez savoir sur la déduction AGEFIPH via la sous-traitance à un prestataire TIH."
          sectionId="faq-oeth"
        />
      </div>
    </PageLayout>
  );
}
