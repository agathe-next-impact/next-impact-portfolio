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
      "WordPress Headless + impact social : pourquoi les PME engagées choisissent Next Impact",
    description:
      "Performance web de pointe, impact social concret et déduction AGEFIPH : découvrez pourquoi les PME et organisations RSE choisissent un prestataire TIH spécialisé WordPress Headless.",
    path: "/articles/wordpress-headless-impact-social-pme-engagees",
    keywords: [
      "WordPress Headless impact social",
      "PME engagée site web",
      "RSE numérique",
      "prestataire TIH WordPress",
      "développement web responsable",
      "ESS numérique",
      "site web PME RSE",
    ],
    type: "article",
    publishedTime: "2025-03-01",
    modifiedTime: "2025-06-01",
  });
}

export default function ArticleImpactSocial() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Avantage OETH", url: "/avantage-oeth" },
    {
      name: "WordPress Headless + impact social",
      url: "/articles/wordpress-headless-impact-social-pme-engagees",
    },
  ];

  return (
    <main>
      <ArticleJsonLd
        title="WordPress Headless + impact social : pourquoi les PME engagées choisissent Next Impact"
        description="Performance web de pointe, impact social concret et déduction AGEFIPH : découvrez pourquoi les PME et organisations RSE choisissent un prestataire TIH spécialisé WordPress Headless."
        image="/img/desktop-screen-next-impact.png"
        datePublished="2025-03-01"
        dateModified="2025-06-01"
        author="Agathe Karinthi-Martin"
        url="/articles/wordpress-headless-impact-social-pme-engagees"
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd
        questions={[
          {
            question:
              "Qu'est-ce que le WordPress Headless et pourquoi est-ce plus performant ?",
            answer:
              "Le WordPress Headless sépare le back-office WordPress du front-end, reconstruit avec Next.js ou Astro. Résultat : un site qui charge en moins d'une seconde, un SEO natif, une sécurité maximale et une autonomie totale sur les contenus.",
          },
          {
            question:
              "Comment un prestataire TIH contribue-t-il à la RSE de mon entreprise ?",
            answer:
              "En sous-traitant à un TIH (Travailleur Indépendant Handicapé), vous soutenez l'emploi inclusif, diversifiez vos fournisseurs (critère RSE valorisé) et pouvez déduire 30% du coût de main-d'œuvre de votre contribution AGEFIPH.",
          },
        ]}
      />

      <PageLayout
        titre="WordPress Headless + impact social : Choisir Next Impact"
        sousTitre="Performance technique, emploi inclusif et avantage fiscal : un investissement web à triple bénéfice"
      >
        <article className="mt-8 mb-6 space-y-16 pt-20">
          {/* Introduction */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 font-googletexte leading-relaxed">
                Les PME et organisations engagées dans une démarche RSE
                cherchent des prestataires qui partagent leurs valeurs. Mais
                l&apos;engagement social ne doit pas se faire au détriment
                de la qualité technique. Et si vous pouviez avoir les
                deux ?
              </p>
              <p className="text-lg text-white/80 font-googletexte leading-relaxed mt-4">
                Next Impact propose une approche unique : l&apos;expertise
                technique du{" "}
                <strong className="text-lightyellow">WordPress Headless</strong>{" "}
                combinée à l&apos;impact social du statut{" "}
                <strong className="text-lightyellow">TIH</strong> (Travailleur
                Indépendant Handicapé), avec en prime une{" "}
                <strong className="text-lightyellow">
                  déduction AGEFIPH de 30%
                </strong>{" "}
                sur le coût de main-d&apos;œuvre.
              </p>
            </div>
          </section>

          {/* Section 1 : Le défi des PME engagées */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icons/globe-network-icon.svg" alt="Défi numérique" width={32} height={32} className="shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Le défi numérique des PME engagées
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p className="text-white/80">
                Pour une PME investie dans la RSE ou une organisation de
                l&apos;ESS, le site web est souvent le premier point de
                contact avec ses parties prenantes. Il doit être à la
                hauteur de ses ambitions : rapide, accessible, sécurisé
                et refléter l&apos;engagement de la structure.
              </p>
              <p className="text-white/80">
                Pourtant, beaucoup se retrouvent face à un dilemme :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="border border-coral/20 rounded-xl p-6 bg-coral/5">
                  <h3 className="font-googletitre font-medium text-coral mb-2">
                    Le site &quot;pas cher&quot;
                  </h3>
                  <p className="text-white/70 text-sm">
                    Templates génériques, lenteur, SEO inexistant,
                    sécurité douteuse. Le site ne reflète pas le
                    professionnalisme de la structure.
                  </p>
                </div>
                <div className="border border-coral/20 rounded-xl p-6 bg-coral/5">
                  <h3 className="font-googletitre font-medium text-coral mb-2">
                    L&apos;agence &quot;premium&quot;
                  </h3>
                  <p className="text-white/70 text-sm">
                    Budgets hors de portée, technologie propriétaire,
                    dépendance au prestataire, aucun impact social.
                  </p>
                </div>
              </div>
              <p className="text-white/80">
                Next Impact offre une troisième voie : la{" "}
                <strong className="text-lightyellow">
                  performance technique d&apos;un développeur expert
                </strong>{" "}
                avec l&apos;
                <strong className="text-lightyellow">
                  impact social d&apos;un prestataire TIH
                </strong>
                .
              </p>
            </div>
          </section>

          {/* Section 2 : Pourquoi WordPress Headless */}
          <section className="bg-mediumblue/60 w-full backdrop-blur-xl border-y border-white/10 py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/icons/speed-icon.svg" alt="Performance" width={32} height={32} className="shrink-0" />
                <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                  WordPress Headless : la performance sans compromis
                </h2>
              </div>

              <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
                <p className="text-white/80">
                  Le WordPress Headless sépare le back-office WordPress
                  (gestion de contenu) du front-end (ce que voit
                  l&apos;utilisateur). Le front-end est reconstruit avec
                  des technologies modernes comme Next.js ou Astro.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  {[
                    {
                      iconSrc: "/icons/speed-icon.svg",
                      title: "Vitesse < 1 seconde",
                      description:
                        "Pages générées statiquement, CDN mondial, score PageSpeed maximum. Votre site se charge instantanément.",
                      color: "text-lightyellow",
                    },
                    {
                      iconSrc: "/icons/shield-icon.svg",
                      title: "Sécurité maximale",
                      description:
                        "WordPress n'est pas exposé publiquement. Pas de plugins front-end vulnérables. Surface d'attaque réduite à zéro.",
                      color: "text-lightblue",
                    },
                    {
                      iconSrc: "/icons/growth-icon.svg",
                      title: "SEO natif",
                      description:
                        "Métadonnées contrôlées, Server-Side Rendering, Core Web Vitals optimisés. Google vous récompense.",
                      color: "text-coral",
                    },
                    {
                      iconSrc: "/icons/team-icon.svg",
                      title: "Autonomie totale",
                      description:
                        "Vous gardez l'interface WordPress que vous connaissez. Aucune compétence technique requise pour modifier vos contenus.",
                      color: "text-lightyellow",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="border border-white/10 rounded-xl p-6 bg-darkblue/40"
                    >
                      <Image src={item.iconSrc} alt={item.title} width={32} height={32} className="mb-3" />
                      <h3 className="font-googletitre font-medium text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/70 font-googletexte text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 : L'impact social */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icons/brand-reach-icon.svg" alt="Impact social" width={32} height={32} className="shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Un prestataire TIH : l&apos;impact social concret
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p className="text-white/80">
                En travaillant avec Next Impact, prestataire TIH, votre
                PME contribue directement à :
              </p>

              <ul className="space-y-3 my-6">
                {[
                  "L'emploi inclusif : vous soutenez l'activité d'un travailleur indépendant handicapé qualifié",
                  "La transition numérique de l'ESS : 40% du TJM de l'offre Soutien finance un projet solidaire",
                  "La diversification de vos fournisseurs : un critère valorisé dans les rapports RSE",
                  "Le respect de l'OETH : la sous-traitance TIH est déductible de votre contribution AGEFIPH",
                  "L'accessibilité numérique : une sensibilité particulière aux normes RGAA",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-coral mt-0.5 shrink-0" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-white/80">
                Ce n&apos;est pas de la philanthropie — c&apos;est un
                choix stratégique qui aligne performance technique,
                impact social et avantage fiscal.
              </p>
            </div>
          </section>

          {/* Section 4 : Triple avantage */}
          <section className="bg-mediumblue/60 w-full backdrop-blur-xl border-y border-white/10 py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-12 text-center">
                Le triple avantage en résumé
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                  <Image src="/icons/speed-icon.svg" alt="Performance" width={48} height={48} className="mb-4" />
                  <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                    Performance
                  </h3>
                  <p className="text-white/70 font-googletexte leading-relaxed text-sm">
                    WordPress Headless + Next.js/Astro. Vitesse &lt; 1s,
                    SEO natif, sécurité maximale. Un site aux standards
                    des meilleures startups tech.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                  <Image src="/icons/brand-reach-icon.svg" alt="Impact social" width={48} height={48} className="mb-4" />
                  <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                    Impact social
                  </h3>
                  <p className="text-white/70 font-googletexte leading-relaxed text-sm">
                    Emploi inclusif, financement de projets solidaires,
                    diversification fournisseurs. Un engagement concret
                    pour votre rapport RSE.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
                  <Image src="/icons/analytics-icon.svg" alt="Avantage fiscal" width={48} height={48} className="mb-4" />
                  <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                    Avantage fiscal
                  </h3>
                  <p className="text-white/70 font-googletexte leading-relaxed text-sm">
                    30% du coût de main-d&apos;œuvre déductible de votre
                    contribution AGEFIPH. Un investissement qui réduit
                    directement vos charges.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 : Profils cibles */}
          <section className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icons/eco-design-icon.svg" alt="Structures" width={32} height={32} className="shrink-0" />
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white">
                Pour quelles structures ?
              </h2>
            </div>

            <div className="space-y-4 text-white/80 font-googletexte leading-relaxed">
              <p>Next Impact accompagne en priorité :</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {[
                  {
                    title: "PME à mission",
                    description:
                      "Entreprises avec un statut de société à mission ou un engagement RSE fort, qui veulent un site à la hauteur de leurs valeurs.",
                  },
                  {
                    title: "Organisations de l'ESS",
                    description:
                      "Associations, SCOP, SCIC, fondations qui cherchent un prestataire tech aligné avec leurs principes d'économie solidaire.",
                  },
                  {
                    title: "PME de 20+ salariés",
                    description:
                      "Entreprises soumises à l'OETH qui veulent optimiser leur contribution AGEFIPH tout en obtenant un site web performant.",
                  },
                  {
                    title: "Startups à impact",
                    description:
                      "Structures en croissance qui ont besoin d'un site scalable et qui valorisent les achats responsables.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-white/10 rounded-xl p-6 bg-mediumblue/40"
                  >
                    <h3 className="font-googletitre font-medium text-lightyellow mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/70 font-googletexte text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center border border-lightyellow/20 rounded-2xl p-8 md:p-12 bg-lightyellow/5 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-4">
                Prêt à allier performance et impact ?
              </h2>
              <p className="text-white/70 font-googletexte leading-relaxed mb-8 max-w-xl mx-auto">
                Discutons de votre projet web. Obtenez un devis avec le
                montant exact déductible de votre contribution AGEFIPH.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/avantage-oeth">
                  <button className="inline-flex items-center gap-2 h-12 px-8 font-bold font-googletitre text-base rounded-full bg-lightyellow text-darkblue transition-all duration-300">
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
          <section className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl font-googletitre font-medium text-white mb-4">
              Sources et références
            </h2>
            <ul className="space-y-2 text-white/60 font-googletexte text-sm">
              <li>
                <Link
                  href="https://www.agefiph.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightblue hover:underline"
                >
                  AGEFIPH — Association de gestion du fonds pour
                  l&apos;insertion professionnelle des personnes handicapées
                </Link>
              </li>
              <li>
                <Link
                  href="https://entreprendre.service-public.fr/vosdroits/F22523"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightblue hover:underline"
                >
                  Service-Public.fr — Obligation d&apos;emploi des travailleurs
                  handicapés
                </Link>
              </li>
              <li>
                Code du travail : articles L.5212-10-1 et D.5212-7
              </li>
            </ul>
          </section>
        </article>
      </PageLayout>
    </main>
  );
}
