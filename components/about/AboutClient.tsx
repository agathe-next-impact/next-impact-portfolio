"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import PageLayout from "@/components/page-layout";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getAboutPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";

export default function AboutClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const aboutVariants = getAboutPageVariants(locale);
  const variant = profileId ? aboutVariants[profileId] : aboutVariants.default;
  const t = useTranslations("aboutPage");
  const key = profileId || "default";

  return (
    <PageLayout titre={variant.titre} sousTitre={variant.sousTitre}>

      {/* Manifeste — adaptatif */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`manifeste-${key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="s"
          style={{ background: "var(--paper-2)", borderTop: "1px solid var(--rule)" }}
        >
          <div className="container">
            <div className="sec-head">
              <div className="sec-no">№ 01</div>
              <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
                {variant.manifesteAccroche}
              </h2>
            </div>

            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.7, maxWidth: 640, marginBottom: 48 }}>
              {variant.manifesteIntro}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
              {variant.piliers.map((pilier, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: 40,
                    padding: "32px 0",
                    borderBottom: "1px solid var(--rule)",
                    alignItems: "start",
                  }}
                >
                  <Image
                    src={pilier.icon}
                    alt={pilier.title}
                    width={48}
                    height={48}
                    style={{ opacity: 0.65 }}
                  />
                  <div>
                    <h3 className="ni-serif" style={{ fontSize: 22, marginBottom: 10, color: "var(--ink)" }}>
                      {pilier.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
                      {pilier.description}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {pilier.items.map((item, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
                          <span style={{ color: "var(--ink-2)", fontFamily: "var(--mono)", fontSize: 11 }}>→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Parcours — statique */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ 02</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
              {t("journey.title")}
            </h2>
            <div className="sec-meta">{t("journey.label")}</div>
          </div>

          <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 540, marginBottom: 48 }}>
            {t("journey.subtitle")}
          </p>

          {/* Timeline — 3 steps */}
          <div style={{ borderTop: "1px solid var(--rule)" }}>
            {[
              {
                year: t("journey.step1.year"),
                title: t("journey.step1.title"),
                content: <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>{t("journey.step1.description")}</p>,
                imageSrc: "/img/about-nb-asso.jpg",
                imageAlt: t("journey.step1.imageAlt"),
              },
              {
                year: t("journey.step2.year"),
                title: t("journey.step2.title"),
                content: <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>{t("journey.step2.description")}</p>,
                imageSrc: "/img/about-code.jpg",
                imageAlt: t("journey.step2.imageAlt"),
              },
              {
                year: t("journey.step3.year"),
                title: t("journey.step3.title"),
                content: (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {(["user", "tech", "ai"] as const).map((key) => (
                      <li key={key} style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65 }}>
                        <strong style={{ color: "var(--ink)" }}>{t(`journey.step3.items.${key}.label`)}</strong>{" "}
                        {t(`journey.step3.items.${key}.text`)}
                      </li>
                    ))}
                    <li style={{ fontSize: 13, fontStyle: "italic", color: "var(--muted-color)", marginTop: 8 }}>
                      {t.rich("journey.step3.figaroMention", {
                        lien: (chunks) => (
                          <a
                            href="https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--accent-color)", textDecoration: "underline" }}
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </li>
                  </ul>
                ),
                imageSrc: "/img/contact-agathe-km.png",
                imageAlt: t("journey.step3.imageAlt"),
              },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 280px",
                  gap: 40,
                  padding: "40px 0",
                  borderBottom: "1px solid var(--rule)",
                  alignItems: "start",
                }}
              >
                <div
                  className="ni-serif"
                  style={{ fontSize: 28, color: "var(--ink)", lineHeight: 1, paddingTop: 4 }}
                >
                  {step.year}
                </div>
                <div>
                  <h3 className="ni-serif" style={{ fontSize: 22, marginBottom: 12, color: "var(--ink)" }}>
                    {step.title}
                  </h3>
                  {step.content}
                </div>
                <div style={{ position: "relative", height: 180, overflow: "hidden", border: "1px solid var(--rule)" }}>
                  <Image
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    sizes="280px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation — adaptatif */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`citation-${key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="s"
          style={{ background: "var(--paper-2)", borderTop: "1px solid var(--rule)" }}
        >
          <div className="container">
            <div className="sec-no">№ 03</div>
            <blockquote
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "clamp(22px, 3vw, 36px)",
                lineHeight: 1.35,
                color: "var(--ink)",
                maxWidth: 720,
                borderLeft: "3px solid var(--rule-strong)",
                paddingLeft: 32,
                marginBottom: 16,
              }}
            >
              &ldquo;{variant.citation}&rdquo;
            </blockquote>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                paddingLeft: 35,
              }}
            >
              {t("citationByline")}
            </p>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Chiffres clés */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <div className="sec-head">
            <div className="sec-no">№ 04</div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}>
              {t("metrics.title")}
            </h2>
            <div className="sec-meta">{t("metrics.label")}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--rule)" }}>
            {[
              { end: 15, prefix: "+", label: t("metrics.yearsCommitment") },
              { end: 8, prefix: "+", label: t("metrics.yearsDevelopment") },
              { end: 25, prefix: "+", label: t("metrics.projectsDelivered") },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "48px 32px",
                  borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                  textAlign: "center",
                }}
              >
                <div className="ni-serif" style={{ fontSize: 56, color: "var(--ink)", lineHeight: 1, marginBottom: 8 }}>
                  <CountUp end={stat.end} prefix={stat.prefix} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — adaptatif */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`cta-${key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="s"
          style={{ background: "var(--paper-2)", borderTop: "1px solid var(--rule)" }}
        >
          <div className="container">
            <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 520, marginBottom: 32, lineHeight: 1.65 }}>
              {variant.ctaDescription}
            </p>
            {variant.ctaHref.startsWith("http") ? (
              <a
                href={variant.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {variant.ctaLabel}
                <ArrowRight size={14} />
              </a>
            ) : (
              <Link
                href={variant.ctaHref as Parameters<typeof Link>[0]["href"]}
                className="btn primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {variant.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

    </PageLayout>
  );
}
