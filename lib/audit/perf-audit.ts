"use server";

// Vrais Core Web Vitals via Google PageSpeed Insights (mobile), appelés en
// progressif APRÈS le résultat instantané (l'étape 1 reste rapide ; cet appel,
// plus lent, remplace ensuite l'axe perf « estimation »). Retourne null si la clé
// PAGESPEED_API_KEY est absente ou si l'appel échoue → on conserve l'estimation.
// Conforme au brief : LCP / INP / CLS (jamais TTFB).

import type { Locale } from "@/i18n/routing";
import type { CwvMetric, CwvRating, Impact, QuickAxis, QuickIssue } from "./quick-audit-types";

function ratingFromCategory(cat?: string): CwvRating {
  if (cat === "FAST") return "good";
  if (cat === "SLOW") return "poor";
  return "average";
}

function ratingFromScore(score?: number): CwvRating {
  if (typeof score !== "number") return "average";
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "average";
  return "poor";
}

function impactFromRating(r: CwvRating): Impact {
  if (r === "poor") return "high";
  if (r === "average") return "medium";
  return "low";
}

export async function runPerfAudit(input: {
  url: string;
  locale: Locale;
}): Promise<QuickAxis | null> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;

  const isEn = input.locale === "en";
  const tr = (fr: string, en: string) => (isEn ? en : fr);

  let url = input.url.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  try {
    const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url,
    )}&strategy=mobile&category=performance&key=${key}`;
    const res = await fetch(api, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) return null;

    const data = await res.json();
    const lh = data.lighthouseResult;
    const score = Math.round((lh?.categories?.performance?.score ?? 0) * 100);
    const field = data.loadingExperience?.metrics ?? {};
    const audits = lh?.audits ?? {};

    const metrics: CwvMetric[] = [];
    const issues: QuickIssue[] = [];
    const positives: string[] = [];

    const pushMetric = (label: string, value: string, rating: CwvRating, slowFr: string, slowEn: string) => {
      metrics.push({ label, value, rating });
      if (rating === "good") {
        positives.push(tr(`${label} dans le vert (${value})`, `${label} in the green (${value})`));
      } else {
        issues.push({ title: tr(slowFr, slowEn), impact: impactFromRating(rating) });
      }
    };

    // LCP — données terrain prioritaires, sinon labo.
    {
      const f = field.LARGEST_CONTENTFUL_PAINT_MS;
      if (f?.percentile != null) {
        const value = (f.percentile / 1000).toFixed(1) + " s";
        pushMetric("LCP", value, ratingFromCategory(f.category), `LCP ${value} — le contenu principal s'affiche trop lentement`, `LCP ${value} — main content renders too slowly`);
      } else if (audits["largest-contentful-paint"]?.displayValue) {
        const a = audits["largest-contentful-paint"];
        pushMetric("LCP", a.displayValue, ratingFromScore(a.score), `LCP ${a.displayValue} — le contenu principal s'affiche trop lentement`, `LCP ${a.displayValue} — main content renders too slowly`);
      }
    }

    // INP — uniquement fiable en données terrain (pas de proxy labo).
    {
      const f = field.INTERACTION_TO_NEXT_PAINT;
      if (f?.percentile != null) {
        const value = `${f.percentile} ms`;
        pushMetric("INP", value, ratingFromCategory(f.category), `INP ${value} — réactivité aux interactions à améliorer`, `INP ${value} — interaction responsiveness needs work`);
      }
    }

    // CLS — données terrain prioritaires (percentile ×100), sinon labo.
    {
      const f = field.CUMULATIVE_LAYOUT_SHIFT_SCORE;
      if (f?.percentile != null) {
        const value = (f.percentile / 100).toFixed(2);
        pushMetric("CLS", value, ratingFromCategory(f.category), `CLS ${value} — des éléments bougent pendant le chargement`, `CLS ${value} — elements shift during load`);
      } else if (audits["cumulative-layout-shift"]?.displayValue) {
        const a = audits["cumulative-layout-shift"];
        pushMetric("CLS", a.displayValue, ratingFromScore(a.score), `CLS ${a.displayValue} — des éléments bougent pendant le chargement`, `CLS ${a.displayValue} — elements shift during load`);
      }
    }

    if (score >= 90) {
      positives.push(tr("Très bon score de performance mobile", "Excellent mobile performance score"));
    } else if (score < 50) {
      issues.push({
        title: tr(`Score de performance mobile faible (${score}/100)`, `Low mobile performance score (${score}/100)`),
        impact: "high",
      });
    }

    const hasField = Object.keys(field).length > 0;
    return {
      key: "performance",
      score,
      available: true,
      estimated: false,
      note: hasField
        ? tr("Core Web Vitals réels — données terrain (PageSpeed, mobile).", "Real Core Web Vitals — field data (PageSpeed, mobile).")
        : tr("Performance réelle (PageSpeed Lighthouse, mobile).", "Real performance (PageSpeed Lighthouse, mobile)."),
      metrics,
      positives,
      issues,
    };
  } catch {
    return null;
  }
}
