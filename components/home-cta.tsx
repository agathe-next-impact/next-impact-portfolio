"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export default function HomeCta() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
      <div className="container">
        <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 48, display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end" }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 16 }}>
              № 07 — {isEn ? "Start your project" : "Démarrer votre projet"}
            </div>
            <h2 className="ni-serif" style={{ fontSize: "clamp(32px, 4.5vw, 72px)", lineHeight: 1.0, color: "var(--ink)", margin: "0 0 16px" }}>
              {isEn
                ? <>Your project online <em style={{ color: "var(--ink)" }}>in 6 to 10 weeks.</em></>
                : <>Votre projet en ligne <em style={{ color: "var(--ink)" }}>en 6 à 10 semaines.</em></>}
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 520, lineHeight: 1.65, marginBottom: 32 }}>
              {isEn
                ? "A discovery call to clarify your needs, a scoping document, then design and development. No surprises on budget or timeline."
                : "Un appel de découverte pour clarifier vos besoins, un document de cadrage, puis la conception et le développement. Zéro surprise sur le budget ou le calendrier."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="https://calendar.app.google/RwZqaabSR5aDMnk46"
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <CalendarDays size={14} />
                {isEn ? "Let's talk about your project" : "Discutons de votre projet"}
              </a>
              <Link href="/etudes-de-cas" className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {isEn ? "See our work" : "Voir des réalisations"}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right — stats strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 160, borderLeft: "1px solid var(--rule)", paddingLeft: 40 }}>
            {[
              { value: "6–10", label: isEn ? "weeks avg." : "semaines moy." },
              { value: "TIH",  label: isEn ? "AGEFIPH −30 %" : "AGEFIPH −30 %" },
              { value: "> 90", label: "Core Web Vitals" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{ paddingBottom: i < 2 ? 20 : 0, marginBottom: i < 2 ? 20 : 0, borderBottom: i < 2 ? "1px solid var(--rule)" : "none" }}
              >
                <div className="ni-serif" style={{ fontSize: 28, color: "var(--ink)", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
