import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  Shield,
  Calendar,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title:
      "Attestation de déductibilité TIH : guide pratique pour les entreprises",
    description:
      "Tout savoir sur l'attestation de déductibilité TIH : qui la délivre, quelles informations elle contient, comment l'intégrer à votre déclaration OETH auprès de l'URSSAF.",
    path: "/articles/attestation-deductibilite-tih-guide-entreprises",
    keywords: [
      "attestation déductibilité TIH",
      "attestation OETH",
      "déclaration AGEFIPH",
      "article D5212-7 code du travail",
      "déduction sous-traitance handicap",
      "prestataire TIH attestation",
    ],
    type: "article",
    publishedTime: "2025-03-01",
  });
}

export default function ArticleAttestationTIH() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Avantage OETH", url: "/avantage-oeth" },
    {
      name: "Attestation de déductibilité TIH",
      url: "/articles/attestation-deductibilite-tih-guide-entreprises",
    },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd
        questions={[
          {
            question: "Qu'est-ce qu'une attestation de déductibilité TIH ?",
            answer:
              "C'est un document officiel délivré par le prestataire TIH, conforme à l'article D.5212-7 du Code du travail, qui certifie le montant des prestations réalisées et le montant déductible de la contribution AGEFIPH.",
          },
          {
            question: "Comment intégrer l'attestation à ma déclaration OETH ?",
            answer:
              "L'attestation est jointe à votre déclaration annuelle OETH transmise à l'URSSAF via la DSN (Déclaration Sociale Nominative). Elle justifie le montant de la déduction demandée.",
          },
        ]}
      />

      <PageLayout
        titre="Attestation de déductibilité TIH : guide pratique pour les entreprises"
        sousTitre="Comment obtenir, vérifier et intégrer l'attestation à votre déclaration OETH"
      >
        <article className="mt-8 mb-6 space-y-16 pt-20">
          {/* Introduction */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 font-googletexte leading-relaxed">
                Lorsqu&apos;une entreprise sous-traite une prestation à un
                TIH (Travailleur Indépendant Handicapé), elle peut déduire
                30% du coût de main-d&apos;œuvre de sa contribution AGEFIPH.
                Mais pour que cette déduction soit valide, elle doit être
                justifiée par une{" "}
                <strong className="text-lightyellow">
                  attestation de déductibilité
                </strong>{" "}
                conforme à l&apos;article D.5212-7 du Code du travail.
              </p>
              <p className="text-lg text-white/80 font-googletexte leading-relaxed mt-4">
                Ce guide pratique détaille tout ce que votre service
                comptabilité doit savoir sur cette attestation.
              </p>
            </div>
          </section>

          {/* Section 1 : Qu'est-ce que l'attestation */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="h-8 w-8 text-lightyellow shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Qu&apos;est-ce que l&apos;attestation de déductibilité ?
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p className="text-white/80">
                L&apos;attestation de déductibilité est un document officiel
                délivré par le prestataire TIH (ou EA/ESAT) qui certifie :
              </p>
              <ul className="space-y-3 my-6">
                {[
                  "L'identité du prestataire et son statut TIH (RQTH + Entreprise Individuelle)",
                  "Le montant total HT des prestations réalisées sur la période",
                  "Le montant de la part main-d'œuvre déductible (30% du HT pour les prestations intellectuelles)",
                  "La période concernée (année civile)",
                  "La conformité avec l'article D.5212-7 du Code du travail",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-white/80">
                Ce document est indispensable pour justifier la déduction
                auprès de l&apos;URSSAF lors de votre déclaration annuelle
                OETH.
              </p>
            </div>
          </section>

          {/* Section 2 : Processus étape par étape */}
          <section className="bg-mediumblue/60 w-full backdrop-blur-xl border-y border-white/10 py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="h-8 w-8 text-lightblue shrink-0" />
                <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                  Processus pas à pas
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Signature du devis / contrat",
                    description:
                      "Vous validez le devis de votre projet web avec Next Impact. Le statut TIH et la possibilité de déduction AGEFIPH sont mentionnés dès le devis.",
                  },
                  {
                    step: "2",
                    title: "Réalisation de la prestation",
                    description:
                      "Le projet est réalisé selon le planning convenu. Les factures émises précisent la part main-d'œuvre et la part fournitures/licences.",
                  },
                  {
                    step: "3",
                    title: "Émission de l'attestation",
                    description:
                      "En fin d'année civile (ou à la fin de la prestation), Next Impact vous transmet l'attestation de déductibilité récapitulant les montants déductibles.",
                  },
                  {
                    step: "4",
                    title: "Intégration à la DSN",
                    description:
                      "Votre service comptabilité ou RH intègre le montant de la déduction à la déclaration annuelle OETH, transmise via la DSN (Déclaration Sociale Nominative).",
                  },
                  {
                    step: "5",
                    title: "Conservation des justificatifs",
                    description:
                      "Conservez l'attestation, les factures et le contrat pendant 5 ans minimum. L'URSSAF peut demander ces documents en cas de contrôle.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 border border-white/10 rounded-xl p-6 bg-darkblue/40"
                  >
                    <span className="text-3xl font-googletitre font-medium text-lightblue shrink-0">
                      {item.step}.
                    </span>
                    <div>
                      <h3 className="text-lg font-googletitre font-medium text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/70 font-googletexte text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3 : Ce que contient l'attestation */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-coral shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Contenu de l&apos;attestation Next Impact
              </h2>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 md:p-8 bg-mediumblue/60 backdrop-blur-lg">
              <div className="space-y-4">
                {[
                  {
                    label: "Identité du prestataire",
                    value:
                      "EI Agathe Karinthi-Martin — SIRET, adresse, statut TIH",
                  },
                  {
                    label: "Justificatif RQTH",
                    value:
                      "Référence de la décision CDAPH (sans détail médical)",
                  },
                  {
                    label: "Période concernée",
                    value: "Année civile de la prestation",
                  },
                  {
                    label: "Montant total HT facturé",
                    value: "Cumul des factures sur la période",
                  },
                  {
                    label: "Part main-d'œuvre",
                    value: "30% du montant HT (prestations intellectuelles)",
                  },
                  {
                    label: "Montant déductible",
                    value:
                      "30% de la part main-d'œuvre, conformément à l'article L.5212-10-1",
                  },
                  {
                    label: "Base légale",
                    value: "Articles L.5212-10-1 et D.5212-7 du Code du travail",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-white/50 font-googletexte uppercase tracking-widest md:w-48 shrink-0">
                      {item.label}
                    </span>
                    <span className="text-white/80 font-googletexte">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4 : Points de vigilance */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-lightyellow shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Points de vigilance pour la comptabilité
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <ul className="space-y-3">
                {[
                  "Vérifiez que le prestataire dispose bien d'une RQTH en cours de validité",
                  "L'attestation doit être émise sur une base annuelle (année civile)",
                  "Le montant déductible est plafonné : 50% de la contribution brute si taux d'emploi TH < 3%, 75% si ≥ 3%",
                  "Conservez l'ensemble des pièces justificatives pendant 5 ans minimum",
                  "La déduction s'applique sur la contribution de l'année N pour les prestations réalisées en année N",
                  "En cas de prestation à cheval sur deux années, l'attestation porte sur les montants facturés par année civile",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 : Calendrier */}
          <section className="bg-mediumblue/60 w-full backdrop-blur-xl border-y border-white/10 py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-8 w-8 text-lightblue shrink-0" />
                <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                  Calendrier type
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    period: "Janvier – Décembre N",
                    action: "Réalisation des prestations et facturation",
                  },
                  {
                    period: "Janvier N+1",
                    action: "Émission de l'attestation de déductibilité par Next Impact",
                  },
                  {
                    period: "Février – Mars N+1",
                    action: "Intégration à la déclaration OETH via la DSN",
                  },
                  {
                    period: "Avril N+1",
                    action: "Paiement de la contribution AGEFIPH (réduite de la déduction)",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-white/10 rounded-xl p-5 bg-darkblue/40"
                  >
                    <p className="text-sm text-lightblue font-googletexte font-medium mb-1">
                      {item.period}
                    </p>
                    <p className="text-white/70 font-googletexte text-sm">
                      {item.action}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/avantage-oeth">
                  <button className="inline-flex items-center gap-2 h-12 px-8 font-bold font-googletitre text-base rounded-full shadow bg-lightyellow text-darkblue hover:shadow-[0_0_20px_rgba(242,229,126,0.45)] transition-all duration-300">
                    Simuler mon économie
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 h-12 px-8 font-googletitre text-base rounded-full border border-white/20 text-white hover:bg-white/10 transition-all">
                    Demander un devis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Sources */}
          <section className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl font-googletitre font-medium text-white mb-4">
              Sources et références
            </h2>
            <ul className="space-y-2 text-white/60 font-googletexte text-sm">
              <li>
                Code du travail : articles L.5212-10-1 et D.5212-7
              </li>
              <li>
                <Link
                  href="https://www.urssaf.fr/accueil/employeur/cotisations/liste-cotisations/contribution-annuelle-oeth.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightblue hover:underline"
                >
                  URSSAF — Contribution annuelle OETH
                </Link>
              </li>
              <li>
                <Link
                  href="https://entreprendre.service-public.fr/vosdroits/F22523"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightblue hover:underline"
                >
                  Service-Public.fr — Obligation d&apos;emploi des travailleurs handicapés
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.agefiph.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightblue hover:underline"
                >
                  AGEFIPH — Simulateur officiel
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </PageLayout>
    </main>
  );
}
