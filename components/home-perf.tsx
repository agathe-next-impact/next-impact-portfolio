"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

type VitalKey = "lcp" | "cls" | "ttfb";

type Measured = Record<VitalKey, number | null>;

type MetricDef = {
  key: VitalKey;
  label: string;
  caption: string;
  threshold: string;
  // Met en forme la valeur mesurée + indique si le seuil « bon » de Google est tenu.
  format: (v: number) => string;
  isGood: (v: number) => boolean;
};

const METRICS_FR: MetricDef[] = [
  {
    key: "lcp",
    label: "LCP",
    caption: "Plus grand contenu affiché",
    threshold: "Bon < 2,5 s",
    format: (v) => `${(v / 1000).toFixed(2)} s`,
    isGood: (v) => v <= 2500,
  },
  {
    key: "cls",
    label: "CLS",
    caption: "Stabilité visuelle",
    threshold: "Bon < 0,1",
    format: (v) => v.toFixed(3),
    isGood: (v) => v <= 0.1,
  },
  {
    key: "ttfb",
    label: "TTFB",
    caption: "Temps de réponse serveur",
    threshold: "Bon < 800 ms",
    format: (v) => `${Math.round(v)} ms`,
    isGood: (v) => v <= 800,
  },
];

const METRICS_EN: MetricDef[] = [
  {
    key: "lcp",
    label: "LCP",
    caption: "Largest contentful paint",
    threshold: "Good < 2.5 s",
    format: (v) => `${(v / 1000).toFixed(2)} s`,
    isGood: (v) => v <= 2500,
  },
  {
    key: "cls",
    label: "CLS",
    caption: "Visual stability",
    threshold: "Good < 0.1",
    format: (v) => v.toFixed(3),
    isGood: (v) => v <= 0.1,
  },
  {
    key: "ttfb",
    label: "TTFB",
    caption: "Server response time",
    threshold: "Good < 800 ms",
    format: (v) => `${Math.round(v)} ms`,
    isGood: (v) => v <= 800,
  },
];

/**
 * HomePerf — preuve de performance vérifiable : les Core Web Vitals de CETTE
 * page, mesurés en direct dans le navigateur du visiteur via l'API Performance
 * native (aucune dépendance). Le site est sa propre démo.
 */
export default function HomePerf({ index = "№ 08" }: { index?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const metrics = isEn ? METRICS_EN : METRICS_FR;

  const [measured, setMeasured] = useState<Measured>({
    lcp: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
      return;
    }

    const observers: PerformanceObserver[] = [];

    // TTFB — disponible immédiatement via le Navigation Timing.
    try {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav) {
        setMeasured((m) => ({ ...m, ttfb: Math.max(0, nav.responseStart) }));
      }
    } catch {
      /* ignore */
    }

    // LCP — on retient la dernière entrée (buffered pour capter le hero déjà peint).
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        const value = last.renderTime || last.loadTime || last.startTime;
        setMeasured((m) => ({ ...m, lcp: value }));
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObserver);
    } catch {
      /* ignore */
    }

    // CLS — somme des décalages hors interaction récente.
    try {
      let cls = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
        setMeasured((m) => ({ ...m, cls }));
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObserver);
    } catch {
      /* ignore */
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const allGood = metrics.every((m) => {
    const v = measured[m.key];
    return v !== null && m.isGood(v);
  });


  return (
    <BlueprintSection tone="obsidian">
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker={isEn ? "Proof · under the hood" : "Preuve · technique"}
          title={
            isEn ? (
              <>
                A beautiful site that&apos;s{" "}
                <span className="text-accent-secondary">as fast as it looks</span>
              </>
            ) : (
              <>
                Un beau site,{" "}
                <span className="text-accent-secondary">aussi rapide qu&apos;il en a l&apos;air</span>
              </>
            )
          }
          description={
            isEn
              ? "Design isn't everything — here are the Core Web Vitals of this page, measured live in your browser. The technical foundation under every project."
              : "Le design ne fait pas tout : voici les Core Web Vitals de cette page, mesurés en direct dans votre navigateur. Le socle technique de chaque projet."
          }
        />
      </Reveal>

      {/* Cartes métriques */}
      <Stagger className="grid grid-cols-1 border-b border-dark-gray md:grid-cols-3">
        {metrics.map((m) => {
          const v = measured[m.key];
          const good = v !== null ? m.isGood(v) : null;
          return (
            <StaggerItem
              key={m.key}
              className="border-b border-dark-gray px-6 py-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:px-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  {m.label}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                  {m.threshold}
                </span>
              </div>
              <div
                className="mt-4 text-4xl font-extralight tracking-tight text-foreground tabular-nums"
                aria-live="polite"
              >
                {v !== null ? m.format(v) : <span className="text-mid-gray">…</span>}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                {m.caption}
              </div>
              <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]">
                {good === null ? (
                  <span className="text-mid-gray">
                    {isEn ? "Measuring…" : "Mesure en cours…"}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex items-center gap-1.5",
                      good ? "text-accent-secondary" : "text-mid-gray",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-1.5 w-1.5 rounded-full",
                        good ? "bg-accent-secondary" : "bg-mid-gray",
                      )}
                    />
                    {good
                      ? isEn
                        ? "Google threshold met"
                        : "Seuil Google respecté"
                      : isEn
                        ? "Above threshold"
                        : "Au-dessus du seuil"}
                  </span>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Pied — note de mesure + CTA froid + vérification PSI */}
      <Reveal className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="max-w-xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {allGood
            ? isEn
              ? "All green — this page already meets Google's recommended thresholds for a fast, well-ranked site."
              : "Tout au vert — cette page tient déjà les seuils recommandés par Google pour un site rapide et bien référencé."
            : isEn
              ? "Measured live from your device — values depend on your network and hardware."
              : "Mesuré en direct depuis votre appareil — les valeurs dépendent de votre réseau et de votre matériel."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/audit-site-web" className={BTN_PRIMARY}>
            {isEn ? "And yours? Audit — 2 min" : "Et le vôtre ? Audit — 2 min"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>
    </BlueprintSection>
  );
}
