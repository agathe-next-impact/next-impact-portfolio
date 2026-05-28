"use client";

import { Link } from "@/i18n/navigation";
import { CheckCircle, BookOpen, SearchCheck, FileText, Layers, Code, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { BENTO_CONFIGS, JOURNEYS, PROFILES, type BentoCardConfig } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const defaultCardsFr: BentoCardConfig[] = [
  {
    id: "headless-cms",
    title: "Comprendre le headless",
    description: "Architecture découplée, API WordPress, Next.js et déploiement.",
    icon: BookOpen,
    href: "/documentation/headless-cms",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    gradient: "",
    textColor: "",
  },
  {
    id: "audit-ia",
    title: "Audit de migration IA",
    description: "Analysez votre site : performance, SEO et conversion.",
    icon: SearchCheck,
    href: "/audit-site-ia",
    colSpan: "md:col-span-1",
    rowSpan: "",
    gradient: "",
    textColor: "",
  },
];

const defaultCardsEn: BentoCardConfig[] = [
  {
    id: "headless-cms",
    title: "Understanding headless",
    description: "Decoupled architecture, WordPress API, Next.js and deployment.",
    icon: BookOpen,
    href: "/documentation/headless-cms",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    gradient: "",
    textColor: "",
  },
  {
    id: "audit-ia",
    title: "AI migration audit",
    description: "Analyze your site: performance, SEO and conversion.",
    icon: SearchCheck,
    href: "/audit-site-ia",
    colSpan: "md:col-span-1",
    rowSpan: "",
    gradient: "",
    textColor: "",
  },
];

function InlineLearningPath({ locale }: { locale: Locale }) {
  const { profileId, readArticles } = useDocumentationMode();
  const isEn = locale === "en";

  if (!profileId) return null;

  const journey = JOURNEYS[profileId];
  const profile = PROFILES[profileId];
  const Icon = profile.icon;

  const readCount = journey.filter((step) =>
    readArticles.includes(`${step.category}/${step.slug}`)
  ).length;

  const progressPercent = Math.round((readCount / journey.length) * 100);

  return (
    <div
      className="md:col-span-2 md:row-span-2"
      style={{ border: "1px solid var(--rule)", borderTop: "none", borderLeft: "none", background: "var(--paper-2)", padding: "2rem" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <Icon style={{ width: "1.125rem", height: "1.125rem", color: "var(--accent-color)" }} strokeWidth={1.5} />
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.125rem, 2vw, 1.5rem)", color: "var(--ink)", margin: 0, fontWeight: 400 }}>
          {isEn ? `Your ${profile.label} path` : `Votre parcours ${profile.label}`}
        </h2>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", marginTop: "1rem" }}>
        <div style={{ flex: 1, height: "2px", background: "var(--rule)", position: "relative" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, height: "100%",
            width: `${progressPercent}%`,
            background: "var(--accent-color)",
            transition: "width 0.4s",
          }} />
        </div>
        <span className="annot">{readCount} / {journey.length}</span>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--rule)" }}>
        {journey.map((step) => {
          const isRead = readArticles.includes(`${step.category}/${step.slug}`);
          return (
            <Link
              key={step.slug}
              href={`/documentation/${step.category}/${step.slug}`}
              style={{
                display: "block",
                padding: "0.875rem 0",
                borderBottom: "1px solid var(--rule)",
                textDecoration: "none",
                borderLeft: isRead ? "3px solid var(--accent-color)" : "3px solid transparent",
                paddingLeft: isRead ? "0.75rem" : "0",
                transition: "border-left-color 0.2s, background 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                <div>
                  <p style={{
                    fontSize: "0.875rem",
                    color: isRead ? "var(--muted-color)" : "var(--ink)",
                    textDecoration: isRead ? "line-through" : "none",
                    marginBottom: "0.125rem",
                    fontWeight: 500,
                  }}>
                    {step.title}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--ink-2)" }}>
                    {step.description}
                  </p>
                </div>
                {isRead && (
                  <CheckCircle size={14} style={{ color: "var(--accent-color)", flexShrink: 0, marginTop: "0.125rem" }} strokeWidth={1.5} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function BentoGrid() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const cards = profileId
    ? BENTO_CONFIGS[profileId].filter((c) => !c.id.startsWith("parcours-"))
    : isEn
      ? defaultCardsEn
      : defaultCardsFr;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3"
      style={{ gap: 0, borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)", marginBottom: "3rem" }}
    >
      {profileId && <InlineLearningPath locale={locale} />}
      {cards.map((card) => {
        const Icon = card.icon;
        const isBig = card.id === "headless-cms";
        return (
          <div
            key={card.id}
            className={cn(card.colSpan, card.rowSpan)}
            style={{
              border: "1px solid var(--rule)",
              borderTop: "none",
              borderLeft: "none",
              background: "var(--paper)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Link
              href={card.href}
              className={isBig ? "bento-card-big" : "bento-card-small"}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                minHeight: isBig ? "20rem" : "11rem",
                padding: "1.75rem 2rem",
                textDecoration: "none",
              }}
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              {/* Big card infographic */}
              {!profileId && isBig && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {(isEn
                      ? [
                          { value: "2×", label: "faster than a standard site" },
                          { value: "100", label: "achievable Lighthouse score" },
                          { value: "0",   label: "frontend plugins to maintain" },
                        ]
                      : [
                          { value: "2×", label: "plus rapide qu'un site classique" },
                          { value: "100", label: "score Lighthouse accessible" },
                          { value: "0",   label: "plugin frontend à maintenir" },
                        ]
                    ).map((stat) => (
                      <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                        <span style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--accent-color)", lineHeight: 1 }}>
                          {stat.value}
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "var(--ink-2)" }}>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Stack diagram */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--rule)" }}>
                    {[
                      { Icon: Layers, label: "WordPress" },
                      { Icon: Code,   label: "Next.js" },
                      { Icon: Globe,  label: isEn ? "Your visitors" : "Vos visiteurs" },
                    ].map(({ Icon: SIcon, label }, i) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                          <div style={{ border: "1px solid var(--rule)", padding: "0.5rem" }}>
                            <SIcon size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)", display: "block" }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-color)" }}>{label}</span>
                        </div>
                        {i < 2 && <div style={{ width: "1rem", height: "1px", background: "var(--rule)" }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: "auto" }}>
                <Icon size={18} strokeWidth={1.5} style={{ color: "var(--muted-color)", marginBottom: "0.75rem", display: "block" }} />
                <h3 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: isBig ? "clamp(1.25rem, 2vw, 1.75rem)" : "1.125rem",
                  color: "var(--ink)",
                  marginBottom: "0.375rem",
                  lineHeight: 1.15,
                  fontWeight: 400,
                }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--ink-2)", lineHeight: 1.6 }}>
                  {card.description}
                </p>
                {card.external && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-color)", marginTop: "0.75rem" }}>
                    ↓ PDF
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
