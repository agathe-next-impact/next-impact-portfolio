"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { CheckCircle, BookOpen, SearchCheck, FileText, Layers, Code, Globe, Smartphone } from "lucide-react";
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
  {
    id: "livre-blanc",
    title: "Livre Blanc",
    description: "Téléchargez le guide complet : qu'est-ce que WordPress Headless ?",
    icon: FileText,
    href: "/ressources/livre_blanc_wp_headless.pdf",
    colSpan: "md:col-span-3",
    rowSpan: "",
    gradient: "",
    textColor: "",
    external: true,
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
  {
    id: "livre-blanc",
    title: "White paper",
    description: "Download the complete guide: what is Headless WordPress?",
    icon: FileText,
    href: "/ressources/livre_blanc_wp_headless.pdf",
    colSpan: "md:col-span-3",
    rowSpan: "",
    gradient: "",
    textColor: "",
    external: true,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="md:col-span-2 md:row-span-2"
      style={{ border: "1px solid var(--rule)", background: "var(--paper-2)", padding: "32px" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <Icon style={{ width: 20, height: 20, color: "var(--accent-color)" }} strokeWidth={1.5} />
        <h2 className="ni-serif" style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--ink)", margin: 0 }}>
          {isEn ? `Your ${profile.label} path` : `Votre parcours ${profile.label}`}
        </h2>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, marginTop: 16 }}>
        <div style={{ flex: 1, height: 2, background: "var(--rule)", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${progressPercent}%`, background: "var(--accent-color)", transition: "width 0.4s" }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-color)", whiteSpace: "nowrap" }}>
          {readCount} / {journey.length}
        </span>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid var(--rule)" }}>
        {journey.map((step, index) => {
          const isRead = readArticles.includes(`${step.category}/${step.slug}`);
          return (
            <motion.div
              key={step.slug}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.25 }}
            >
              <Link
                href={`/documentation/${step.category}/${step.slug}`}
                style={{
                  display: "block",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--rule)",
                  textDecoration: "none",
                  borderLeft: isRead ? "3px solid var(--accent-color)" : "3px solid transparent",
                  paddingLeft: isRead ? 12 : 0,
                  transition: "border-left-color 0.2s, background 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{
                      fontSize: 14,
                      color: isRead ? "var(--muted-color)" : "var(--ink)",
                      textDecoration: isRead ? "line-through" : "none",
                      marginBottom: 2,
                      fontWeight: 500,
                    }}>
                      {step.title}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-2)" }}>
                      {step.description}
                    </p>
                  </div>
                  {isRead && (
                    <CheckCircle size={14} style={{ color: "var(--accent-color)", flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
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
    <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 0, borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)", marginBottom: 48 }}>
      {profileId && <InlineLearningPath locale={locale} />}
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isBig = card.id === "headless-cms";
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (profileId ? index + 1 : index) * 0.08, duration: 0.3 }}
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
              style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", minHeight: isBig ? 320 : 180, padding: "28px 32px", textDecoration: "none" }}
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              {/* Big card infographic */}
              {!profileId && isBig && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
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
                      <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                        <span className="ni-serif" style={{ fontSize: 32, color: "var(--accent-color)", lineHeight: 1 }}>
                          {stat.value}
                        </span>
                        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Stack diagram */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
                    {[
                      { Icon: Layers, label: "WordPress" },
                      { Icon: Code,   label: "Next.js" },
                      { Icon: Globe,  label: isEn ? "Your visitors" : "Vos visiteurs" },
                    ].map(({ Icon: SIcon, label }, i) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ border: "1px solid var(--rule)", padding: 8 }}>
                            <SIcon size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)", display: "block" }} />
                          </div>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-color)" }}>{label}</span>
                        </div>
                        {i < 2 && <div style={{ width: 16, height: 1, background: "var(--rule)" }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: "auto" }}>
                <Icon size={20} strokeWidth={1.5} style={{ color: "var(--muted-color)", marginBottom: 12, display: "block" }} />
                <h3 className="ni-serif" style={{ fontSize: isBig ? "clamp(20px, 2vw, 28px)" : 18, color: "var(--ink)", marginBottom: 6, lineHeight: 1.15 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
                  {card.description}
                </p>
                {card.external && (
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-color)", marginTop: 12 }}>
                    ↓ PDF
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
