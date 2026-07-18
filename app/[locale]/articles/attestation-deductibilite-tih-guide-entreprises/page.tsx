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
    modifiedTime: "2025-06-01",
    locale,
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
    <main className="light article-page">
      <ArticleJsonLd
        title="Attestation de déductibilité TIH : guide pratique pour les entreprises"
        description="Tout savoir sur l'attestation de déductibilité TIH : qui la délivre, quelles informations elle contient, comment l'intégrer à votre déclaration OETH auprès de l'URSSAF."
        image="/img/desktop-screen-next-impact.png"
        datePublished="2025-03-01"
        dateModified="2025-06-01"
        author="Agathe Karinthi-Martin"
        url="/articles/attestation-deductibilite-tih-guide-entreprises"
      />
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
        titre="Attestation de déductibilité TIH"
        sousTitre="Comment obtenir, vérifier et intégrer l'attestation à votre déclaration OETH"
      >
        <article>
          {/* Introduction */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)" }}>
                  Lorsqu&apos;une entreprise sous-traite une prestation à un
                  TIH (Travailleur Indépendant Handicapé), elle peut déduire
                  30% du montant HT de la facture de sa contribution AGEFIPH.
                  Mais pour que cette déduction soit valide, elle doit être
                  justifiée par une{" "}
                  <strong style={{ color: "var(--ink)" }}>
                    attestation de déductibilité
                  </strong>{" "}
                  conforme à l&apos;article D.5212-7 du Code du travail.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", marginTop: 16 }}>
                  Ce guide pratique détaille tout ce que votre service
                  comptabilité doit savoir sur cette attestation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 1 : Qu'est-ce que l'attestation */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2 className="ni-serif" style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)", marginBottom: 24 }}>
                  Qu&apos;est-ce que l&apos;attestation de déductibilité ?
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)", marginBottom: 20 }}>
                  L&apos;attestation de déductibilité est un document officiel
                  délivré par le prestataire TIH (ou EA/ESAT) qui certifie :
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "L'identité du prestataire et son statut TIH (RQTH + Entreprise Individuelle)",
                    "Le montant total HT des prestations réalisées sur la période",
                    "Le montant déductible (30% du montant HT de la facture)",
                    "La période concernée (année civile)",
                    "La conformité avec l'article D.5212-7 du Code du travail",
                  ].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <CheckCircle2
                        style={{ width: 18, height: 18, color: "var(--muted-color)", flexShrink: 0, marginTop: 2 }}
                        strokeWidth={1.5}
                      />
                      <span style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)", marginTop: 20 }}>
                  Ce document est indispensable pour justifier la déduction
                  auprès de l&apos;URSSAF lors de votre déclaration annuelle
                  OETH.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 : Processus étape par étape */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2 className="ni-serif" style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)", marginBottom: 32 }}>
                  Processus pas à pas
                </h2>
                <div>
                  {[
                    {
                      step: "01",
                      title: "Signature du devis / contrat",
                      description:
                        "Vous validez le devis de votre projet web avec Next Impact. Le statut TIH et la possibilité de déduction AGEFIPH sont mentionnés dès le devis.",
                    },
                    {
                      step: "02",
                      title: "Réalisation de la prestation",
                      description:
                        "Le projet est réalisé selon le planning convenu. Les factures émises précisent la part main-d'œuvre et la part fournitures/licences.",
                    },
                    {
                      step: "03",
                      title: "Émission de l'attestation",
                      description:
                        "En fin d'année civile (ou à la fin de la prestation), Next Impact vous transmet l'attestation de déductibilité récapitulant les montants déductibles.",
                    },
                    {
                      step: "04",
                      title: "Intégration à la DSN",
                      description:
                        "Votre service comptabilité ou RH intègre le montant de la déduction à la déclaration annuelle OETH, transmise via la DSN (Déclaration Sociale Nominative).",
                    },
                    {
                      step: "05",
                      title: "Conservation des justificatifs",
                      description:
                        "Conservez l'attestation, les factures et le contrat pendant 5 ans minimum. L'URSSAF peut demander ces documents en cas de contrôle.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "40px 1fr",
                        gap: 24,
                        padding: "24px 0",
                        borderBottom: "1px solid var(--rule)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 13,
                          color: "var(--accent-color)",
                          paddingTop: 3,
                        }}
                      >
                        {item.step}
                      </span>
                      <div>
                        <h3
                          className="ni-serif"
                          style={{ fontSize: 18, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}
                        >
                          {item.title}
                        </h3>
                        <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--ink-2)" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 : Ce que contient l'attestation */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2 className="ni-serif" style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)", marginBottom: 24 }}>
                  Contenu de l&apos;attestation Next Impact
                </h2>
                <div
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper-2)",
                  }}
                >
                  {[
                    {
                      label: "Identité du prestataire",
                      value: "EI Agathe Karinthi-Martin — SIRET, adresse, statut TIH",
                    },
                    {
                      label: "Justificatif RQTH",
                      value: "Référence de la décision CDAPH (sans détail médical)",
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
                      label: "Montant déductible",
                      value: "30% du montant HT de la facture, conformément à l'article L.5212-10-1",
                    },
                    {
                      label: "Base légale",
                      value: "Articles L.5212-10-1 et D.5212-7 du Code du travail",
                    },
                  ].map((item, i, arr) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "12px 20px",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--rule)" : "none",
                        gap: 24,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--muted-color)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          flexShrink: 0,
                          width: 180,
                          paddingTop: 2,
                        }}
                      >
                        {item.label}
                      </span>
                      <span style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", flex: 1 }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 : Points de vigilance */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2 className="ni-serif" style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)", marginBottom: 24 }}>
                  Points de vigilance pour la comptabilité
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Vérifiez que le prestataire dispose bien d'une RQTH en cours de validité",
                    "L'attestation doit être émise sur une base annuelle (année civile)",
                    "Le montant déductible est plafonné : 50% de la contribution brute si taux d'emploi TH < 3%, 75% si ≥ 3%",
                    "Conservez l'ensemble des pièces justificatives pendant 5 ans minimum",
                    "La déduction s'applique sur la contribution de l'année N pour les prestations réalisées en année N",
                    "En cas de prestation à cheval sur deux années, l'attestation porte sur les montants facturés par année civile",
                  ].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <CheckCircle2
                        style={{ width: 18, height: 18, color: "var(--muted-color)", flexShrink: 0, marginTop: 2 }}
                        strokeWidth={1.5}
                      />
                      <span style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 : Calendrier */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2 className="ni-serif" style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)", marginBottom: 32 }}>
                  Calendrier type
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid var(--rule)",
                  }}
                >
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
                      style={{
                        padding: "20px 24px",
                        borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none",
                        borderBottom: i < 2 ? "1px solid var(--rule)" : "none",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--accent-color)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 8,
                        }}
                      >
                        {item.period}
                      </p>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
                        {item.action}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
                  <Link href="/avantage-oeth" className="btn primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Simuler mon économie
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                  <Link href="/contact" className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Demander un devis
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Sources */}
          <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="container">
              <div style={{ maxWidth: 720 }}>
                <h2
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--muted-color)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 16,
                  }}
                >
                  Sources et références
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <li style={{ fontSize: 13, color: "var(--ink-2)" }}>
                    Code du travail : articles L.5212-10-1 et D.5212-7
                  </li>
                  <li>
                    <a
                      href="https://www.urssaf.fr/accueil/employeur/cotisations/liste-cotisations/contribution-annuelle-oeth.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "var(--ink-2)", textDecoration: "underline" }}
                    >
                      URSSAF — Contribution annuelle OETH
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://entreprendre.service-public.fr/vosdroits/F22523"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "var(--ink-2)", textDecoration: "underline" }}
                    >
                      Service-Public.fr — Obligation d&apos;emploi des travailleurs handicapés
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.agefiph.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "var(--ink-2)", textDecoration: "underline" }}
                    >
                      AGEFIPH — Simulateur officiel
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
