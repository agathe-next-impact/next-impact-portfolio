import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title:
      "Comment réduire sa contribution AGEFIPH grâce à la sous-traitance TIH dans le numérique",
    description:
      "Guide complet pour les RH et DAF : réduisez votre contribution AGEFIPH en sous-traitant vos projets numériques à un prestataire TIH. Barème 2025, calcul et attestation.",
    path: "/articles/reduire-contribution-agefiph-sous-traitance-tih",
    keywords: [
      "réduire contribution AGEFIPH",
      "sous-traitance TIH",
      "OETH numérique",
      "déduction AGEFIPH prestation informatique",
      "prestataire TIH développement web",
      "obligation emploi travailleurs handicapés",
    ],
    type: "article",
    publishedTime: "2025-03-01",
    modifiedTime: "2025-06-01",
  });
}

export default function ArticleReduireAgefiph() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Avantage OETH", url: "/avantage-oeth" },
    {
      name: "Réduire sa contribution AGEFIPH",
      url: "/articles/reduire-contribution-agefiph-sous-traitance-tih",
    },
  ];

  return (
    <main>
      <ArticleJsonLd
        title="Comment réduire sa contribution AGEFIPH grâce à la sous-traitance TIH dans le numérique"
        description="Guide complet pour les RH et DAF : réduisez votre contribution AGEFIPH en sous-traitant vos projets numériques à un prestataire TIH. Barème 2025, calcul et attestation."
        image="/img/desktop-screen-next-impact.png"
        datePublished="2025-03-01"
        dateModified="2025-06-01"
        author="Agathe Karinthi-Martin"
        url="/articles/reduire-contribution-agefiph-sous-traitance-tih"
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd
        questions={[
          {
            question:
              "Comment la sous-traitance TIH réduit-elle ma contribution AGEFIPH ?",
            answer:
              "30% du coût de main-d'œuvre des prestations facturées par un TIH est déductible de votre contribution annuelle AGEFIPH, dans la limite de 50% ou 75% de la contribution brute selon votre taux d'emploi TH.",
          },
          {
            question: "Quel est le barème AGEFIPH 2025 ?",
            answer:
              "20-249 salariés : 4 752€/TH manquant. 250-749 salariés : 5 940€/TH manquant. 750+ salariés : 7 128€/TH manquant.",
          },
        ]}
      />

      <PageLayout
        titre="Comment réduire sa contribution AGEFIPH ?"
        sousTitre=""
      >
        <article className="mt-8 mb-6 space-y-16">

          {/* Section 1 : Comprendre l'OETH */}
          <section className="container mx-auto px-4 max-w-5xl pt-10">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icons/scale-icon.svg" alt="OETH" width={32} height={32} className="shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                L&apos;obligation d&apos;emploi des travailleurs handicapés (OETH) en 2025
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p className="text-white/80">
                L&apos;article L.5212-2 du Code du travail impose aux
                entreprises de 20 salariés et plus d&apos;employer au moins
                6% de travailleurs handicapés dans leur effectif total.
                Lorsque ce taux n&apos;est pas atteint, l&apos;entreprise verse
                une contribution annuelle à l&apos;AGEFIPH.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="border border-white/10 rounded-xl p-6 bg-mediumblue/60 backdrop-blur-sm text-center">
                  <p className="text-sm text-white font-googletexte uppercase tracking-widest mb-2">
                    20 – 249 salariés
                  </p>
                  <p className="text-2xl font-googletitre font-medium text-coral">
                    4 752 €
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    par TH manquant / an
                  </p>
                </div>
                <div className="border border-white/10 rounded-xl p-6 bg-mediumblue/60 backdrop-blur-sm text-center">
                  <p className="text-sm text-white font-googletexte uppercase tracking-widest mb-2">
                    250 – 749 salariés
                  </p>
                  <p className="text-2xl font-googletitre font-medium text-lightyellow">
                    5 940 €
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    par TH manquant / an
                  </p>
                </div>
                <div className="border border-white/10 rounded-xl p-6 bg-mediumblue/60 backdrop-blur-sm text-center">
                  <p className="text-sm text-white font-googletexte uppercase tracking-widest mb-2">
                    750+ salariés
                  </p>
                  <p className="text-2xl font-googletitre font-medium text-lightblue">
                    7 128 €
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    par TH manquant / an
                  </p>
                </div>
              </div>

              <div className="border border-coral/20 rounded-xl p-6 bg-coral/5">
                <div className="flex items-start gap-3">
                  <Image src="/icons/notification-icon.svg" alt="Attention" width={20} height={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-1">
                      Surcontribution en cas d&apos;inaction
                    </p>
                    <p className="text-white/70 text-sm">
                      Les entreprises n&apos;ayant entrepris aucune action en
                      faveur de l&apos;emploi des TH pendant 3 années
                      consécutives s&apos;exposent à une surcontribution de
                      1 500 × SMIC horaire par TH manquant, soit{" "}
                      <strong className="text-coral">17 820 € en 2025</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 : Le levier TIH */}
          <section className="bg-mediumblue/60 w-full backdrop-blur-xl border-y border-white/10 py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                  La sous-traitance TIH : un levier méconnu mais puissant
                </h2>
              </div>

              <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
                <p className="text-white/80">
                  L&apos;article L.5212-10-1 du Code du travail prévoit que les
                  entreprises peuvent déduire de leur contribution AGEFIPH
                  une partie du coût des prestations sous-traitées à des{" "}
                  <strong className="text-lightblue">TIH (Travailleurs
                  Indépendants Handicapés)</strong>, des EA (Entreprises
                  Adaptées) ou des ESAT.
                </p>

                <p className="text-white/80">
                  Pour les prestations intellectuelles comme le
                  développement web, le montant déductible est de{" "}
                  <strong className="text-lightyellow">30% du coût de
                  main-d&apos;œuvre</strong>, qui correspond à 30% du montant
                  HT facturé.
                </p>

                <h3 className="text-xl font-googletitre font-medium text-white mt-8 mb-4">
                  Qu&apos;est-ce qu&apos;un TIH ?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Indépendant disposant d'une RQTH (Reconnaissance de la Qualité de Travailleur Handicapé)",
                    "Exerce en Entreprise Individuelle",
                    "Aucun agrément nécessaire depuis la loi Macron de 2016",
                    "75 000 à 80 000 TIH en France",
                    "Fournit une attestation de déductibilité annuelle (art. D.5212-7)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-lightblue mt-0.5 shrink-0" />
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 : Comment ça marche concrètement */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icons/analytics-icon.svg" alt="Calcul" width={32} height={32} className="shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Calcul de la déduction : exemple concret
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p className="text-white/80">
                Prenons l&apos;exemple d&apos;une PME de 80 salariés qui
                n&apos;emploie aucun travailleur handicapé et qui confie la
                refonte de son site web à Next Impact pour 5 000 € HT.
              </p>

              <div className="border border-white/10 rounded-2xl p-6 md:p-8 bg-darkblue/40 space-y-4 my-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">Obligation OETH (6% de 80)</span>
                  <span className="font-medium text-white">4 TH</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">TH manquants</span>
                  <span className="font-medium text-coral">4</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">Contribution brute (4 × 4 752 €)</span>
                  <span className="font-medium text-coral">19 008 €</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">Déduction TIH (30% de 5 000 €)</span>
                  <span className="font-medium text-lightyellow">- 1 500 €</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">Contribution après déduction</span>
                  <span className="font-medium text-lightblue">17 508 €</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white font-medium">Coût réel du site web</span>
                  <span className="text-xl font-googletitre font-medium text-lightyellow">3 500 €</span>
                </div>
              </div>

              <p className="text-white/80">
                L&apos;entreprise économise 1 500 € sur sa contribution
                AGEFIPH et obtient un site web performant pour un coût
                réel de 3 500 €, soit une réduction de 30%.
              </p>
            </div>
          </section>

          {/* Section 4 : Contexte 2025 */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icons/growth-icon.svg" alt="Stratégie 2025" width={32} height={32} className="shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Pourquoi c&apos;est stratégique en 2025
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p className="text-white">
                Le contexte réglementaire de 2025 rend la sous-traitance
                TIH particulièrement pertinente :
              </p>

              <ul className="space-y-3 my-6">
                {[
                  "Fin des mesures transitoires d'écrêtement au 01/01/2025 : la contribution AGEFIPH atteint son montant réel",
                  "Certaines dépenses autrefois déductibles ne le sont plus depuis 2025",
                  "La sous-traitance TIH/EA/ESAT reste l'un des rares leviers de déduction encore actifs",
                  "La surcontribution de 17 820 € par TH manquant menace les entreprises n'ayant rien fait pendant 3 ans",
                  "Agir maintenant, même modestement, démontre une volonté d'engagement et protège contre la surcontribution",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-coral mt-0.5 shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 : Next Impact */}
          <section className="bg-mediumblue/60 w-full backdrop-blur-xl border-y border-white/10 py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/icons/team-icon.svg" alt="Next Impact" width={32} height={32} className="shrink-0" />
                <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                  Next Impact : expertise tech + avantage OETH
                </h2>
              </div>

              <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
                <p>
                  Next Impact est un prestataire TIH spécialisé en{" "}
                  <strong className="text-lightyellow">WordPress Headless</strong>{" "}
                  (Next.js et Astro). En confiant votre projet web à Next
                  Impact, vous bénéficiez d&apos;un double avantage :
                </p>
                <ul className="space-y-3 my-6">
                  {[
                    "Un site web ultra-performant aux standards de la Tech (< 1s de chargement, SEO natif, sécurité maximale)",
                    "30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH",
                    "Une attestation de déductibilité conforme à l'article D.5212-7 du Code du travail",
                    "Trois offres adaptées à tous les budgets : Solidaire (2 250 €), Équilibre (4 000 €), Soutien (5 000 €+)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/avantage-oeth">
                  <button className="inline-flex items-center gap-2 h-12 px-8 font-bold font-googletitre text-base rounded-full shadow bg-lightyellow text-darkblue hover:shadow-[0_0_20px_rgba(242,229,126,0.45)] transition-all duration-300">
                    Simuler mon économie
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 h-12 px-8 font-googletitre text-base rounded-full border border-white/20 text-white hover:bg-white/10 transition-all">
                    Discuter de mon projet
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Sources */}
          <section className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-googletitre font-medium text-white mb-4">
              Sources et références
            </h2>
            <ul className="space-y-2 text-white/60 font-googletexte text-sm">
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
              <li className="text-white/80">
                Code du travail : articles L.5212-10-1 et D.5212-7
              </li>
              <li>
                <Link
                  href="https://www.agefiph.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightblue hover:underline"
                >
                  AGEFIPH
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </PageLayout>
    </main>
  );
}
