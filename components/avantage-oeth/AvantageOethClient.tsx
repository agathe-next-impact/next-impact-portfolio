"use client";

import Image from "next/image";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import SimulateurAgefiph from "@/components/simulateur-agefiph";
import FaqSchema from "@/components/services/FaqSchema";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

const stepsFr = [
  { number: "01", iconSrc: "/icons/analytics-icon.svg", title: "30% déductibles automatiquement", description: "30% du coût de main-d'œuvre de la prestation est déductible de votre contribution annuelle AGEFIPH. Le calcul est intégré à la facture." },
  { number: "02", iconSrc: "/icons/shield-icon.svg", title: "Attestation officielle", description: "Vous recevez une attestation de déductibilité annuelle conforme à l'article D.5212-7 du Code du travail, à joindre à votre déclaration OETH." },
];

const stepsEn = [
  { number: "01", iconSrc: "/icons/analytics-icon.svg", title: "30% deductible automatically", description: "30% of the labor cost of the service is deductible from your annual AGEFIPH contribution. The calculation is built into the invoice." },
  { number: "02", iconSrc: "/icons/shield-icon.svg", title: "Official attestation", description: "You receive an annual deductibility attestation compliant with article D.5212-7 of the French Labor Code, to attach to your OETH return." },
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

  return (
    <PageLayout
      titre={isEn ? "Reduce your AGEFIPH contribution by investing in your web project" : "Réduisez votre contribution AGEFIPH en investissant dans votre projet web"}
      sousTitre={isEn
        ? "TIH provider specialized in building websites and applications: 30% of labor cost deductible from your French disability employment obligation, whatever the project type."
        : "Prestataire TIH spécialisé création de sites et d'applications : 30 % du coût de main-d'œuvre déductible de votre obligation d'emploi, quelle que soit la nature du projet."}
    >

      {/* EN-only context note */}
      {isEn && (
        <section className="s" style={{ borderTop: "1px solid var(--rule)", paddingTop: "24px", paddingBottom: "24px" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "16px 20px",
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
              }}
            >
              <Info size={16} style={{ color: "var(--accent-color)", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>
                <strong style={{ color: "var(--ink)" }}>French legal scheme.</strong>{" "}
                AGEFIPH is the French employment-of-disabled-workers contribution. This page is most relevant for companies operating in France: it explains how they can reduce that contribution by 30% of labor cost when subcontracting to a TIH-certified independent (Travailleur Indépendant Handicapé).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Comment ça marche — 2 étapes */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ 01</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
              {isEn ? "How does it work?" : "Comment ça marche ?"}
            </h2>
            <div className="sec-meta">{isEn ? "A simple process" : "Un processus simple"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {steps.map((step, i) => (
              <div
                key={step.number}
                style={{
                  padding: "40px 32px",
                  borderRight: i < steps.length - 1 ? "1px solid var(--rule)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: "var(--accent-color)",
                    }}
                  >
                    {step.number}
                  </span>
                  <Image src={step.iconSrc} alt={step.title} width={32} height={32} style={{ opacity: 0.7 }} />
                </div>
                <h3 className="ni-serif" style={{ fontSize: 22, marginBottom: 12, color: "var(--ink)" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulateur */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
        <div className="container">
          <SimulateurAgefiph />
        </div>
      </section>

      {/* Contexte OETH 2025-2026 */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ 02</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
              {isEn ? "OETH context 2025–2026" : "Contexte OETH 2025–2026"}
            </h2>
            <div className="sec-meta">{isEn ? "Regulatory update" : "Évolution réglementaire"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {[
              {
                icon: "/icons/scale-icon.svg",
                alt: isEn ? "TIH subcontracting" : "Sous-traitance TIH",
                title: isEn ? "TIH subcontracting remains an active lever" : "La sous-traitance TIH reste un levier actif",
                content: isEn
                  ? "Among the few remaining active deduction levers in 2025, subcontracting to TIH, EA and ESAT remains fully deductible from the AGEFIPH contribution."
                  : "Parmi les rares leviers de déduction encore actifs en 2025, la sous-traitance auprès de TIH, EA et ESAT reste pleinement déductible de la contribution AGEFIPH.",
              },
              {
                icon: "/icons/growth-icon.svg",
                alt: isEn ? "Over-contribution" : "Surcontribution",
                title: isEn ? "Over-contribution" : "Surcontribution",
                content: isEn
                  ? "Companies that take no action for 3 consecutive years face an over-contribution of 1,500 × hourly minimum wage per missing disabled worker (€17,820 in 2025)."
                  : "Les entreprises n'ayant entrepris aucune action pendant 3 années consécutives s'exposent à une surcontribution de 1 500 × SMIC horaire par TH manquant (soit 17 820 € en 2025).",
              },
              {
                icon: "/icons/workflow-icon.svg",
                alt: isEn ? "Rate schedule" : "Barème",
                title: isEn ? "2025 rate schedule" : "Barème 2025",
                content: (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
                    {(isEn
                      ? [
                          { range: "20-249 employees", amount: "400 × min. wage = €4,752 / missing disabled worker" },
                          { range: "250-749 employees", amount: "500 × min. wage = €5,940 / missing disabled worker" },
                          { range: "750+ employees", amount: "600 × min. wage = €7,128 / missing disabled worker" },
                        ]
                      : [
                          { range: "20-249 salariés", amount: "400 × SMIC = 4 752 € / TH manquant" },
                          { range: "250-749 salariés", amount: "500 × SMIC = 5 940 € / TH manquant" },
                          { range: "750+ salariés", amount: "600 × SMIC = 7 128 € / TH manquant" },
                        ]
                    ).map((row) => (
                      <li key={row.range}>
                        <strong style={{ color: "var(--ink)" }}>{row.range}</strong> : {row.amount}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                icon: "/icons/notification-icon.svg",
                alt: isEn ? "End of capping" : "Écrêtement",
                title: isEn ? "End of the transitional capping" : "Fin de l'écrêtement",
                content: isEn
                  ? "Since January 1, 2025, the transitional capping measures have ended. Some expenses that were previously deductible no longer are. The AGEFIPH contribution now reaches its real amount for all companies."
                  : "Depuis le 1er janvier 2025, les mesures transitoires d'écrêtement sont terminées. Certaines dépenses autrefois déductibles ne le sont plus. La contribution AGEFIPH atteint désormais son montant réel pour toutes les entreprises.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                style={{
                  padding: "32px",
                  borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none",
                  borderBottom: i < 2 ? "1px solid var(--rule)" : "none",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <Image src={card.icon} alt={card.alt} width={28} height={28} style={{ opacity: 0.65, marginTop: 2 }} />
                  <h3 className="ni-serif" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.2 }}>
                    {card.title}
                  </h3>
                </div>
                {typeof card.content === "string"
                  ? <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>{card.content}</p>
                  : card.content
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Double Impact */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ 03</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
              {isEn ? "Why choose a TIH specialist?" : "Pourquoi choisir un prestataire TIH spécialisé ?"}
            </h2>
            <div className="sec-meta">{isEn ? "An investment with double payoff" : "Un investissement à double bénéfice"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {[
              {
                icon: "/icons/speed-icon.svg",
                title: isEn ? "Technical performance" : "Performance technique",
                desc: isEn
                  ? "Modern tech standards on every project: load times under 1s, maximum security, SEO and accessibility carefully tuned — whether classic WordPress, Headless or a custom application."
                  : "Des standards techniques élevés sur tous les projets : temps de chargement < 1s, sécurité renforcée, SEO et accessibilité soignés — que ce soit un site WordPress, Headless ou une application sur-mesure.",
              },
              {
                icon: "/icons/analytics-icon.svg",
                title: isEn ? "Tax benefit" : "Avantage fiscal",
                desc: isEn
                  ? "30% of the labor cost deductible from your AGEFIPH contribution. A web investment that directly reduces your social-charge bill."
                  : "30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH. Un investissement web qui réduit directement vos charges sociales.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                style={{
                  padding: "40px 32px",
                  borderRight: i === 0 ? "1px solid var(--rule)" : "none",
                }}
              >
                <Image src={card.icon} alt={card.title} width={32} height={32} style={{ marginBottom: 20, opacity: 0.65 }} />
                <h3 className="ni-serif" style={{ fontSize: 22, marginBottom: 12, color: "var(--ink)" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s" style={{ background: "var(--paper-2)", borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <h2 className="ni-serif" style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 16 }}>
            {isEn ? "Ready to reduce your AGEFIPH contribution?" : "Prêt à réduire votre contribution AGEFIPH ?"}
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 480, marginBottom: 32, lineHeight: 1.65 }}>
            {isEn
              ? "Let's discuss your web project. I'll provide a detailed quote with the exact amount deductible from your AGEFIPH contribution."
              : "Discutons de votre projet web. Je vous fournirai un devis détaillé avec le montant exact déductible de votre contribution AGEFIPH."}
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/contact"
              className="btn primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {isEn ? "Discuss my project" : "Discuter de mon projet"}
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/services"
              className="btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {isEn ? "View offerings" : "Voir les offres"}
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ 04</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, margin: 0 }}>
              {isEn ? "OETH guides and resources" : "Guides et ressources OETH"}
            </h2>
            <div className="sec-meta">{isEn ? "Going further" : "Pour aller plus loin"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
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
              <Link
                key={article.href}
                href={article.href as Parameters<typeof Link>[0]["href"]}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "32px",
                    borderRight: i === 0 ? "1px solid var(--rule)" : "none",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-color)", marginBottom: 12 }}>
                    {article.tag}
                  </div>
                  <h3 className="ni-serif" style={{ fontSize: 20, marginBottom: 10, color: "var(--ink)" }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 16 }}>
                    {article.description}
                  </p>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent-color)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {isEn ? "Read the article" : "Lire l'article"}
                    <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
