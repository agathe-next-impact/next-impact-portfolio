"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/reveal";

export default function HomeTihTeaser() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section className="s" style={{ borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
      <div className="container">
        {/* Sec-head */}
        <div className="sec-head" style={{ marginBottom: 40 }}>
          <div className="sec-no">№ 05</div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            {isEn ? "AGEFIPH benefit · TIH provider" : "Avantage AGEFIPH · Prestataire TIH"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 48,
            borderTop: "1px solid var(--rule)",
            paddingTop: 40,
            alignItems: "start",
          }}
        >
          {/* Left — gain concret */}
          <Reveal>
            <h2
              className="ni-serif"
              style={{ fontSize: "clamp(28px, 3.4vw, 48px)", lineHeight: 1.05, color: "var(--ink)", margin: "0 0 20px", maxWidth: 640 }}
            >
              {isEn ? (
                <>Your website costs you <em style={{ color: "var(--ink)" }}>30% less</em>, funded by a contribution you already pay.</>
              ) : (
                <>Votre site vous coûte <em style={{ color: "var(--ink)" }}>30 % de moins</em>, financé par une contribution que vous versez déjà.</>
              )}
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 560, lineHeight: 1.65, marginBottom: 16 }}>
              {isEn
                ? "Your organisation is subject to the disabled-worker employment obligation (OETH) and pays an AGEFIPH contribution. As a TIH provider, every Next Impact project lets you deduct 30% of the labour cost from that contribution — whatever the project."
                : "Votre structure est assujettie à l'obligation d'emploi de travailleurs handicapés (OETH) et verse une contribution AGEFIPH. En tant que prestataire TIH, chaque projet Next Impact vous permet d'en déduire 30 % du coût de main-d'œuvre — quel que soit le projet."}
            </p>
            <p style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.04em", color: "var(--muted-color)", marginBottom: 32 }}>
              {isEn ? "Legal basis: Art. D.5212-7 of the French Labour Code." : "Base légale : Art. D.5212-7 du Code du travail."}
            </p>
            <Link
              href="/avantage-oeth"
              className="btn primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {isEn ? "See how it works" : "Découvrir l'avantage AGEFIPH"}
              <ArrowRight size={13} />
            </Link>
          </Reveal>

          {/* Right — chiffre repère */}
          <Reveal
            as="div"
            delay={0.12}
            style={{
              borderLeft: "1px solid var(--rule)",
              paddingLeft: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="ni-serif" style={{ fontSize: "clamp(56px, 7vw, 96px)", lineHeight: 1, color: "var(--ink)" }}>
              −30 %
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)", marginTop: 8, maxWidth: 220 }}>
              {isEn ? "of labour cost deductible from your AGEFIPH contribution" : "du coût de main-d'œuvre déductible de votre contribution AGEFIPH"}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
