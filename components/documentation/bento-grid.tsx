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
    id: "wordpress-headless",
    title: "Comprendre le headless",
    description: "Architecture découplée, API WordPress, Next.js et déploiement.",
    icon: BookOpen,
    href: "/documentation/wordpress-headless",
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
    id: "wordpress-headless",
    title: "Understanding headless",
    description: "Decoupled architecture, WordPress API, Next.js and deployment.",
    icon: BookOpen,
    href: "/documentation/wordpress-headless",
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
    <div className="border border-l-0 border-t-0 border-dark-gray bg-jet/40 p-8 md:col-span-2 md:row-span-2">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <Icon className="h-[1.125rem] w-[1.125rem] text-accent-secondary" strokeWidth={1.5} />
        <h2 className="m-0 text-2xl font-light tracking-tight text-foreground">
          {isEn ? `Your ${profile.label} path` : `Votre parcours ${profile.label}`}
        </h2>
      </div>

      {/* Progress bar */}
      <div className="mb-6 mt-4 flex items-center gap-3">
        <div className="relative h-0.5 flex-1 bg-dark-gray">
          <div
            className="absolute left-0 top-0 h-full bg-accent transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-mid-gray">
          {readCount} / {journey.length}
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col border-t border-dark-gray">
        {journey.map((step) => {
          const isRead = readArticles.includes(`${step.category}/${step.slug}`);
          return (
            <Link
              key={step.slug}
              href={`/documentation/${step.category}/${step.slug}`}
              className={`group block border-b border-l-[3px] border-dark-gray py-3.5 no-underline transition-[border-color,background-color] hover:bg-jet/60 ${
                isRead
                  ? "border-l-accent-secondary pl-3"
                  : "border-l-transparent pl-0"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`mb-0.5 text-sm font-medium transition-colors group-hover:text-accent-secondary ${
                      isRead ? "text-mid-gray line-through" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="font-inter-tight text-xs text-mid-gray">
                    {step.description}
                  </p>
                </div>
                {isRead && (
                  <CheckCircle
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-accent-secondary"
                    strokeWidth={1.5}
                  />
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
    <div className="mb-12 grid grid-cols-1 border-l border-t border-dark-gray md:grid-cols-3">
      {profileId && <InlineLearningPath locale={locale} />}
      {cards.map((card) => {
        const Icon = card.icon;
        const isBig = card.id === "wordpress-headless";
        return (
          <div
            key={card.id}
            className={cn(
              "relative overflow-hidden border border-l-0 border-t-0 border-dark-gray bg-transparent",
              card.colSpan,
              card.rowSpan
            )}
          >
            <Link
              href={card.href}
              className={cn(
                "group flex h-full flex-col justify-between px-8 py-7 no-underline transition-colors hover:bg-jet/40",
                isBig ? "min-h-[20rem]" : "min-h-[11rem]"
              )}
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {/* Big card infographic */}
              {!profileId && isBig && (
                <div className="mb-6">
                  <div className="mb-6 flex flex-col gap-3">
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
                      <div key={stat.label} className="flex items-baseline gap-3">
                        <span className="text-3xl font-light leading-none tracking-tight text-accent-secondary">
                          {stat.value}
                        </span>
                        <span className="font-inter-tight text-[0.8125rem] text-mid-gray">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Stack diagram */}
                  <div className="flex items-center gap-3 border-t border-dark-gray pt-4">
                    {[
                      { Icon: Layers, label: "WordPress" },
                      { Icon: Code,   label: "Next.js" },
                      { Icon: Globe,  label: isEn ? "Your visitors" : "Vos visiteurs" },
                    ].map(({ Icon: SIcon, label }, i) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="border border-dark-gray p-2">
                            <SIcon size={14} strokeWidth={1.5} className="block text-mid-gray" />
                          </div>
                          <span className="font-mono text-[0.5rem] uppercase tracking-[0.08em] text-mid-gray">{label}</span>
                        </div>
                        {i < 2 && <div className="h-px w-4 bg-dark-gray" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <Icon size={18} strokeWidth={1.5} className="mb-3 block text-mid-gray transition-colors group-hover:text-accent-secondary" />
                <h3
                  className={cn(
                    "mb-1.5 font-light leading-tight tracking-tight text-foreground transition-colors group-hover:text-accent-secondary",
                    isBig ? "text-2xl" : "text-lg"
                  )}
                >
                  {card.title}
                </h3>
                <p className="font-inter-tight text-[0.8125rem] leading-relaxed text-mid-gray">
                  {card.description}
                </p>
                {card.external && (
                  <div className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-accent-secondary">
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
