import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
    modifiedTime: "2026-07-18",
    locale,
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

  // Source unique de la FAQ : alimente le schéma FAQPage ET la section visible
  // (politique Google : le schéma FAQ doit correspondre à un contenu affiché).
  const faqItems = [
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
  ];

  return (
    <main className="light article-page">
      <ArticleJsonLd
        title="Comment réduire sa contribution AGEFIPH grâce à la sous-traitance TIH dans le numérique"
        description="Guide complet pour les RH et DAF : réduisez votre contribution AGEFIPH en sous-traitant vos projets numériques à un prestataire TIH. Barème 2025, calcul et attestation."
        image="/img/desktop-screen-next-impact.png"
        datePublished="2025-03-01"
        dateModified="2026-07-18"
        author="Agathe Karinthi-Martin"
        url="/articles/reduire-contribution-agefiph-sous-traitance-tih"
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd questions={faqItems} />

      <PageLayout
        titre="Comment réduire sa contribution AGEFIPH ?"
        sousTitre=""
      >
        <article style={{ marginBottom: 48 }}>

          {/* Section 1 : Comprendre l'OETH */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 36px)",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    color: "var(--ink)",
                  }}
                >
                  L&apos;obligation d&apos;emploi des travailleurs handicapés (OETH) en 2025
                </h2>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 32 }}>
                  L&apos;article L.5212-2 du Code du travail impose aux
                  entreprises de 20 salariés et plus d&apos;employer au moins
                  6% de travailleurs handicapés dans leur effectif total.
                  Lorsque ce taux n&apos;est pas atteint, l&apos;entreprise verse
                  une contribution annuelle à l&apos;AGEFIPH.
                </p>

                {/* Stat grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    borderTop: "1px solid var(--rule)",
                    borderLeft: "1px solid var(--rule)",
                    marginBottom: 32,
                  }}
                >
                  {[
                    { label: "20 – 249 salariés", value: "4 752 €" },
                    { label: "250 – 749 salariés", value: "5 940 €" },
                    { label: "750+ salariés", value: "7 128 €" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        borderRight: "1px solid var(--rule)",
                        borderBottom: "1px solid var(--rule)",
                        padding: "24px 20px",
                        textAlign: "center",
                        background: "var(--paper)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--muted-color)",
                          marginBottom: 10,
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="ni-serif"
                        style={{
                          fontSize: "clamp(22px, 2.5vw, 32px)",
                          color: "var(--accent-color)",
                          lineHeight: 1,
                          marginBottom: 6,
                        }}
                      >
                        {item.value}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "var(--muted-color)",
                        }}
                      >
                        par TH manquant / an
                      </p>
                    </div>
                  ))}
                </div>

                {/* Surcontribution callout */}
                <div
                  style={{
                    borderLeft: "3px solid var(--accent-color)",
                    padding: "20px 24px",
                    background: "var(--paper-2)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--accent-color)",
                      marginBottom: 8,
                    }}
                  >
                    Surcontribution en cas d&apos;inaction
                  </p>
                  <p style={{ color: "var(--ink-2)", lineHeight: 1.65, fontSize: 14 }}>
                    Les entreprises n&apos;ayant entrepris aucune action en
                    faveur de l&apos;emploi des TH pendant 3 années
                    consécutives s&apos;exposent à une surcontribution de
                    1 500 × SMIC horaire par TH manquant, soit{" "}
                    <strong style={{ color: "var(--accent-color)" }}>17 820 € en 2025</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 : Le levier TIH */}
          <section
            className="s"
            style={{
              borderTop: "1px solid var(--rule)",
              background: "var(--paper-2)",
            }}
          >
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 36px)",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    color: "var(--ink)",
                  }}
                >
                  La sous-traitance TIH : un levier méconnu mais puissant
                </h2>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
                  L&apos;article L.5212-10-1 du Code du travail prévoit que les
                  entreprises peuvent déduire de leur contribution AGEFIPH
                  une partie du coût des prestations sous-traitées à des{" "}
                  <strong style={{ color: "var(--ink)" }}>TIH (Travailleurs
                  Indépendants Handicapés)</strong>, des EA (Entreprises
                  Adaptées) ou des ESAT.
                </p>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 32 }}>
                  Pour les prestations intellectuelles comme le
                  développement web, le montant déductible est de{" "}
                  <strong style={{ color: "var(--ink)" }}>30% du coût de
                  main-d&apos;œuvre</strong>, qui correspond à 30% du montant
                  HT facturé.
                </p>

                <h3
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(17px, 2vw, 24px)",
                    color: "var(--ink)",
                    marginBottom: 20,
                  }}
                >
                  Qu&apos;est-ce qu&apos;un TIH ?
                </h3>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Indépendant disposant d'une RQTH (Reconnaissance de la Qualité de Travailleur Handicapé)",
                    "Exerce en Entreprise Individuelle",
                    "Aucun agrément nécessaire depuis la loi Macron de 2016",
                    "75 000 à 80 000 TIH en France",
                    "Fournit une attestation de déductibilité annuelle (art. D.5212-7)",
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        paddingTop: 12,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--rule)",
                        color: "var(--ink-2)",
                        lineHeight: 1.6,
                      }}
                    >
                      <CheckCircle2
                        style={{ color: "var(--muted-color)", marginTop: 2, flexShrink: 0 }}
                        size={16}
                        strokeWidth={1.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 : Calcul concret */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 36px)",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    color: "var(--ink)",
                  }}
                >
                  Calcul de la déduction : exemple concret
                </h2>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 32 }}>
                  Prenons l&apos;exemple d&apos;une PME de 80 salariés qui
                  n&apos;emploie aucun travailleur handicapé et qui confie la
                  refonte de son site web à Next Impact pour 6 500 € HT.
                </p>

                {/* Calculation table */}
                <div
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                    marginBottom: 32,
                  }}
                >
                  {[
                    { label: "Obligation OETH (6% de 80)", value: "4 TH", accent: false },
                    { label: "TH manquants", value: "4", accent: true },
                    { label: "Contribution brute (4 × 4 752 €)", value: "19 008 €", accent: true },
                    { label: "Déduction TIH (30% de 6 500 €)", value: "− 1 950 €", accent: true },
                    { label: "Contribution après déduction", value: "17 058 €", accent: false },
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 20px",
                        borderBottom: "1px solid var(--rule)",
                      }}
                    >
                      <span style={{ color: "var(--muted-color)", fontSize: 14 }}>
                        {row.label}
                      </span>
                      <span
                        style={{
                          color: row.accent ? "var(--accent-color)" : "var(--ink)",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                  {/* Total row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "var(--paper-2)",
                    }}
                  >
                    <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                      Coût réel du site web
                    </span>
                    <span
                      className="ni-serif"
                      style={{
                        color: "var(--accent-color)",
                        fontSize: "clamp(20px, 2vw, 26px)",
                        fontWeight: 600,
                      }}
                    >
                      3 500 €
                    </span>
                  </div>
                </div>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7 }}>
                  L&apos;entreprise économise 1 500 € sur sa contribution
                  AGEFIPH et obtient un site web performant pour un coût
                  réel de 3 500 €, soit une réduction de 30%.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 : Contexte 2025 */}
          <section
            className="s"
            style={{
              borderTop: "1px solid var(--rule)",
              background: "var(--paper-2)",
            }}
          >
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 36px)",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    color: "var(--ink)",
                  }}
                >
                  Pourquoi c&apos;est stratégique en 2025
                </h2>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 24 }}>
                  Le contexte réglementaire de 2025 rend la sous-traitance
                  TIH particulièrement pertinente :
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Fin des mesures transitoires d'écrêtement au 01/01/2025 : la contribution AGEFIPH atteint son montant réel",
                    "Certaines dépenses autrefois déductibles ne le sont plus depuis 2025",
                    "La sous-traitance TIH/EA/ESAT reste l'un des rares leviers de déduction encore actifs",
                    "La surcontribution de 17 820 € par TH manquant menace les entreprises n'ayant rien fait pendant 3 ans",
                    "Agir maintenant, même modestement, démontre une volonté d'engagement et protège contre la surcontribution",
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        paddingTop: 12,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--rule)",
                        color: "var(--ink-2)",
                        lineHeight: 1.6,
                      }}
                    >
                      <CheckCircle2
                        style={{ color: "var(--muted-color)", marginTop: 2, flexShrink: 0 }}
                        size={16}
                        strokeWidth={1.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 : Next Impact */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 36px)",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    color: "var(--ink)",
                  }}
                >
                  Next Impact : expertise tech + avantage OETH
                </h2>

                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 24 }}>
                  Next Impact est un prestataire TIH spécialisé en{" "}
                  <strong style={{ color: "var(--ink)" }}>création de sites et d&apos;applications</strong>{" "}
                  (WordPress, Headless WordPress + Next.js, web app et PWA). En confiant votre projet web à Next
                  Impact, vous bénéficiez d&apos;un double avantage :
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px" }}>
                  {[
                    "Un site web ultra-performant aux standards de la Tech (< 1s de chargement, SEO natif, sécurité maximale)",
                    "30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH",
                    "Une attestation de déductibilité conforme à l'article D.5212-7 du Code du travail",
                    "Trois forfaits Sites web — Classique (2 250 €), Headless (4 000 €), Web app (6 500 €+) — et une offre Applications web & mobile sur-mesure, toutes éligibles à la déduction OETH",
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        paddingTop: 12,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--rule)",
                        color: "var(--ink-2)",
                        lineHeight: 1.6,
                      }}
                    >
                      <CheckCircle2
                        style={{ color: "var(--muted-color)", marginTop: 2, flexShrink: 0 }}
                        size={16}
                        strokeWidth={1.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Link href="/avantage-oeth">
                    <button className="btn primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      Simuler mon économie
                      <ArrowRight size={15} strokeWidth={1.5} />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      Discuter de mon projet
                      <ArrowRight size={15} strokeWidth={1.5} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ visible — reflète le schéma FAQPage (schéma = contenu affiché) */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, marginBottom: 24, color: "var(--ink)" }}>
                  Questions fréquentes
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {faqItems.map((f, i) => (
                    <div key={i} style={{ borderTop: i > 0 ? "1px solid var(--rule)" : "none", paddingTop: i > 0 ? 20 : 0 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>
                        {f.question}
                      </h3>
                      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)" }}>
                        {f.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sources */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted-color)",
                    marginBottom: 20,
                  }}
                >
                  Sources · Références
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ paddingBottom: 10 }}>
                    <a
                      href="https://www.urssaf.fr/accueil/employeur/cotisations/liste-cotisations/contribution-annuelle-oeth.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-color)", textDecoration: "none", fontSize: 14 }}
                    >
                      URSSAF — Contribution annuelle OETH
                    </a>
                  </li>
                  <li style={{ paddingBottom: 10 }}>
                    <a
                      href="https://entreprendre.service-public.fr/vosdroits/F22523"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-color)", textDecoration: "none", fontSize: 14 }}
                    >
                      Service-Public.fr — Obligation d&apos;emploi des travailleurs handicapés
                    </a>
                  </li>
                  <li style={{ paddingBottom: 10, color: "var(--muted-color)", fontSize: 14 }}>
                    Code du travail : articles L.5212-10-1 et D.5212-7
                  </li>
                  <li style={{ paddingBottom: 10 }}>
                    <a
                      href="https://www.agefiph.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-color)", textDecoration: "none", fontSize: 14 }}
                    >
                      AGEFIPH
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

        </article>
      </PageLayout>
    </main>
  );
}
