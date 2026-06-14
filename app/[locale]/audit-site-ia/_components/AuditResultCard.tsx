"use client";

// Carte du résultat instantané (étape 1) : score réel, détail par axe, 3 priorités
// et orientation préliminaire. Présentationnel — données issues de runQuickAudit,
// copy + verdict passés par l'orchestrateur. Tokens DS uniquement.

import { Link } from "@/i18n/navigation";
import { AlertTriangle, ArrowRight, Check, Cpu, Loader2 } from "lucide-react";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import type { AuditPageContent, AuditVerdict } from "@/lib/audit-page-content";
import type { CwvRating, Impact, QuickAuditResult } from "@/lib/audit/quick-audit-types";

const LABEL_MONO =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

function impactText(impact: Impact): string {
  if (impact === "high") return "text-vermilion";
  if (impact === "medium") return "text-accent";
  return "text-mid-gray";
}

function impactBorder(impact: Impact): string {
  if (impact === "high") return "border-l-vermilion";
  if (impact === "medium") return "border-l-accent";
  return "border-l-mid-gray";
}

function cwvChip(rating: CwvRating): string {
  if (rating === "good") return "border-accent-secondary/40 text-accent-secondary";
  if (rating === "poor") return "border-vermilion/40 text-vermilion";
  return "border-accent/40 text-accent";
}

export function AuditResultCard({
  result,
  copy,
  verdict,
  perfLoading = false,
}: {
  result: QuickAuditResult;
  copy: AuditPageContent["result"];
  verdict: AuditVerdict;
  perfLoading?: boolean;
}) {
  const strengths = result.reachable
    ? result.axes.flatMap((a) => a.positives).slice(0, 4)
    : [];

  return (
    <div className="flex flex-col gap-8">
      {!result.reachable && (
        <div className="flex gap-3 border border-l-[3px] border-dark-gray border-l-vermilion bg-jet px-4 py-3.5">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-vermilion" />
          <div>
            <p className="font-inter-tight text-sm font-medium text-foreground">
              {copy.unreachableTitle}
            </p>
            <p className="mt-1 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {result.error}
            </p>
          </div>
        </div>
      )}

      {result.reachable && (
        <>
          {/* Score + axes */}
          <div className="grid gap-px overflow-hidden border border-dark-gray bg-dark-gray md:grid-cols-[1fr_2fr]">
            <div className="flex flex-col items-center justify-center gap-3 bg-obsidian p-8">
              <p className={LABEL_MONO}>{copy.scoreCaption}</p>
              <RadialGauge value={result.overallScore} size={132} label={copy.scoreLabel} />
              {result.tech.wordpress && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
                  <Cpu size={11} />
                  {copy.wordpressDetected}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 bg-obsidian p-6 lg:p-8">
              <p className={LABEL_MONO}>{copy.axesTitle}</p>
              <div className="flex flex-col gap-3.5">
                {result.axes.map((axis) => (
                  <div key={axis.key}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="font-inter-tight text-sm text-foreground">
                        {copy.axisLabels[axis.key]}
                        {axis.estimated && (
                          <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                            {copy.estimate}
                          </span>
                        )}
                        {perfLoading && axis.key === "performance" && (
                          <span className="ml-2 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-accent-secondary">
                            <Loader2 size={9} className="animate-spin" />
                            {copy.cwvLoading}
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[12px] tabular-nums text-mid-gray">
                        {axis.score}
                        <span className="text-[10px]">/100</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-gray">
                      <div
                        className="h-full rounded-full bg-accent-secondary"
                        style={{ width: `${axis.score}%` }}
                      />
                    </div>
                    {axis.metrics && axis.metrics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {axis.metrics.map((m) => (
                          <span
                            key={m.label}
                            className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[10px] ${cwvChip(
                              m.rating,
                            )}`}
                          >
                            <span className="opacity-70">{m.label}</span>
                            <span className="tabular-nums">{m.value}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 priorités détectées */}
          {result.problems.length > 0 && (
            <div>
              <p className={`${LABEL_MONO} mb-4`}>{copy.problemsTitle}</p>
              <div className="border border-dark-gray">
                {result.problems.map((p, i) => (
                  <div
                    key={`${p.axis}-${i}`}
                    className={`flex items-start gap-3 border-l-[3px] px-4 py-3.5 ${impactBorder(
                      p.impact,
                    )} ${i < result.problems.length - 1 ? "border-b border-b-dark-gray" : ""}`}
                  >
                    <AlertTriangle size={15} className={`mt-0.5 shrink-0 ${impactText(p.impact)}`} />
                    <div>
                      <p className="font-inter-tight text-sm text-foreground">{p.title}</p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-mid-gray">
                        {copy.axisLabels[p.axis]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points forts */}
          {strengths.length > 0 && (
            <div>
              <p className={`${LABEL_MONO} mb-4`}>{copy.positivesLabel}</p>
              <ul className="grid gap-2.5 border border-dark-gray p-4 sm:grid-cols-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent-secondary" />
                    <span className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Orientation préliminaire (verdict) */}
      <div className="border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 p-6">
        <p className={`${LABEL_MONO} mb-2 text-accent-secondary`}>{copy.orientationTitle}</p>
        <h4 className="mb-2 text-lg font-light tracking-tight text-foreground">{verdict.title}</h4>
        <p className="mb-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
          {verdict.description}
        </p>
        <Link
          href={verdict.href}
          className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
        >
          {verdict.offerLabel}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <p className="mt-4 flex items-start gap-2 border-t border-dark-gray pt-3 font-inter-tight text-[12px] leading-relaxed text-mid-gray">
          <Check size={13} className="mt-0.5 shrink-0 text-mid-gray" />
          {copy.orientationHint}
        </p>
      </div>
    </div>
  );
}
