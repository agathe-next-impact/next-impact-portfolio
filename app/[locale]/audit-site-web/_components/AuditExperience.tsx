"use client";

// Orchestrateur du parcours /audit-site-web :
//   1. formulaire minimal (URL + objectif + CMS), sans email ;
//   2. diagnostic instantané réel du site (runQuickAudit) + vrais Core Web Vitals
//      en progressif (runPerfAudit, si clé PageSpeed) + orientation A–D ;
//   3. opt-in : audit gratuit RÉALISÉ PAR AGATHE (capture de lead → /api/contact,
//      avec le contexte du diagnostic ; aucun rapport IA automatique).
// Tracking GA4 via lib/track. Tout le copy vient de lib/audit-page-content.

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowRight, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getAuditPageContent } from "@/lib/audit-page-content";
import { runQuickAudit } from "@/lib/audit/quick-audit";
import { runPerfAudit } from "@/lib/audit/perf-audit";
import type { AuditObjective, QuickAuditResult } from "@/lib/audit/quick-audit-types";
import { track, trackStackRecommended } from "@/lib/track";
import { AuditResultCard } from "./AuditResultCard";

const INPUT =
  "w-full border border-dark-gray bg-jet px-4 py-3 font-sans text-[15px] text-foreground outline-none transition-colors placeholder:text-mid-gray focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary";
const LABEL =
  "mb-1.5 block font-sans text-[13px] font-semibold text-foreground";
const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-accent-secondary bg-accent-secondary px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85 disabled:cursor-not-allowed disabled:opacity-50";
const BTN_GHOST =
  "group inline-flex items-center gap-1.5 rounded-sm border border-dark-gray px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO = "font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

type EmailState = "idle" | "sending" | "sent" | "error";

export default function AuditExperience() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const c = getAuditPageContent(locale);
  const searchParams = useSearchParams();

  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [objective, setObjective] = useState<AuditObjective>(
    c.form.objectiveOptions[0].value,
  );
  const [cms, setCms] = useState("");

  const [stage, setStage] = useState<"form" | "loading" | "result">("form");
  const [quick, setQuick] = useState<QuickAuditResult | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<EmailState>("idle");

  const urlStarted = useRef(false);
  const pageViewed = useRef(false);

  useEffect(() => {
    if (pageViewed.current) return;
    pageViewed.current = true;
    track("audit_page_view");
  }, []);

  const onUrlChange = (value: string) => {
    setUrl(value);
    if (!urlStarted.current && value.trim()) {
      urlStarted.current = true;
      track("audit_url_started");
    }
  };

  // Vrais Core Web Vitals (PageSpeed) en progressif : remplace l'axe perf
  // « estimation » et recalcule le score global quand la mesure arrive.
  async function runRealPerf(targetUrl: string) {
    setPerfLoading(true);
    try {
      const perf = await runPerfAudit({ url: targetUrl, locale });
      if (perf) {
        setQuick((prev) => {
          if (!prev) return prev;
          const axes = prev.axes.map((a) => (a.key === "performance" ? perf : a));
          const measured = axes.filter((a) => a.available);
          const overallScore = Math.round(
            measured.reduce((s, a) => s + a.score, 0) / Math.max(1, measured.length),
          );
          return { ...prev, axes, overallScore };
        });
      }
    } catch {
      /* on conserve l'estimation */
    } finally {
      setPerfLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;
    track("audit_url_submitted", { objective });
    setStage("loading");
    setEmailState("idle");
    setPerfLoading(false);
    try {
      const result = await runQuickAudit({ url: url.trim(), objective, locale });
      setQuick(result);
      setStage("result");
      track("audit_result_viewed", {
        reachable: result.reachable,
        score: result.overallScore,
        verdict: result.verdict,
      });
      trackStackRecommended(result.verdict, { objective });
      if (result.reachable) runRealPerf(result.url);
    } catch {
      // runQuickAudit gère ses erreurs et renvoie reachable:false ; ce catch est
      // une sécurité ultime (ex. action injoignable).
      setStage("result");
      setQuick(null);
    }
  }

  // Opt-in : envoie la demande d'audit gratuit (lead) à Agathe, avec le contexte
  // du diagnostic pour qu'elle le réalise. Pas d'IA, pas de rapport automatique.
  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setEmailState("sending");

    const objLabel =
      c.form.objectiveOptions.find((o) => o.value === objective)?.label ?? objective;
    const lines = [
      `${isEn ? "Site" : "Site"} : ${quick?.url || url.trim()}`,
      `${isEn ? "Goal" : "Objectif"} : ${objLabel}`,
    ];
    if (company.trim()) lines.push(`${isEn ? "Company" : "Entreprise"} : ${company.trim()}`);
    if (cms.trim()) lines.push(`CMS : ${cms.trim()}`);
    if (quick?.reachable) {
      lines.push(`${isEn ? "Quick score" : "Score rapide"} : ${quick.overallScore}/100 (verdict ${quick.verdict})`);
      if (quick.tech.wordpress) lines.push(isEn ? "WordPress detected" : "WordPress détecté");
      if (quick.problems.length) {
        lines.push(
          `${isEn ? "Priorities" : "Priorités"} : ${quick.problems.map((p) => p.title).join(" · ")}`,
        );
      }
    }
    const message = `${
      isEn
        ? "Free audit request from the audit page."
        : "Demande d'audit gratuit depuis la page audit."
    }\n\n${lines.join("\n")}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          locale,
          subject: isEn ? "Free audit request" : "Demande d'audit gratuit",
          message,
        }),
      });
      if (!res.ok) {
        setEmailState("error");
        return;
      }
      setEmailState("sent");
      track("audit_email_submitted", { objective });
    } catch {
      setEmailState("error");
    }
  }

  function reset() {
    setStage("form");
    setQuick(null);
    setPerfLoading(false);
    setEmailState("idle");
  }

  const verdictObj =
    (quick && c.commentLire.verdicts.find((v) => v.code === quick.verdict)) ||
    c.commentLire.verdicts[0];

  return (
    <div className="w-full border border-dark-gray bg-obsidian">
      {/* ── Étape 1 : formulaire ────────────────────────────────────────────── */}
      {stage === "form" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-8 lg:px-8">
          <div>
            <label htmlFor="audit_url" className={LABEL}>
              {c.form.urlLabel}
            </label>
            <input
              id="audit_url"
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={c.form.urlPlaceholder}
              required
              className={INPUT}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="audit_objective" className={LABEL}>
                {c.form.objectiveLabel}
              </label>
              <select
                id="audit_objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value as AuditObjective)}
                className={INPUT}
              >
                {c.form.objectiveOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="audit_cms" className={LABEL}>
                {c.form.cmsLabel}{" "}
                <span className="font-normal text-mid-gray">{c.form.cmsHint}</span>
              </label>
              <input
                id="audit_cms"
                type="text"
                value={cms}
                onChange={(e) => setCms(e.target.value)}
                placeholder={c.form.cmsPlaceholder}
                className={INPUT}
              />
            </div>
          </div>

          <div>
            <button type="submit" className={BTN_PRIMARY} disabled={!url.trim()}>
              {c.form.submit}
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* ── Chargement ──────────────────────────────────────────────────────── */}
      {stage === "loading" && (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent-secondary" />
          <p className="font-inter-tight text-sm text-mid-gray">{c.form.analyzing}</p>
        </div>
      )}

      {/* ── Étape 2 : diagnostic du site + opt-in audit gratuit ─────────────── */}
      {stage === "result" && quick && (
        <div className="flex flex-col">
          <div className="border-b border-dark-gray px-6 py-8 lg:px-8">
            <p className={`${LABEL_MONO} mb-5`}>{c.result.kicker}</p>
            <AuditResultCard
              result={quick}
              copy={c.result}
              verdict={verdictObj}
              perfLoading={perfLoading}
            />
          </div>

          {/* Étape 3 : opt-in audit gratuit réalisé par Agathe */}
          <div className="px-6 py-8 lg:px-8">
            {emailState === "sent" ? (
              <div className="flex flex-col gap-4">
                <p className="flex items-center gap-2 text-lg font-light tracking-tight text-foreground">
                  <CheckCircle2 size={18} className="text-accent-secondary" />
                  {c.email.successTitle}
                </p>
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {c.email.successBody}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={c.email.bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("audit_booking_clicked")}
                    className={BTN_PRIMARY}
                  >
                    {c.email.bookingLabel}
                    <ArrowRight size={14} />
                  </a>
                  <button type="button" onClick={reset} className={BTN_GHOST}>
                    <RefreshCw size={13} />
                    {isEn ? "Analyze another site" : "Analyser un autre site"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className={`${LABEL_MONO} mb-1`}>{c.email.kicker}</p>
                <h3 className="mb-2 text-xl font-light tracking-tight text-foreground">
                  {c.email.title}
                </h3>
                <p className="mb-6 font-inter-tight text-sm text-mid-gray">
                  {c.email.description}
                </p>
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="audit_name" className={LABEL}>
                        {c.email.nameLabel}
                      </label>
                      <input
                        id="audit_name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={c.email.namePlaceholder}
                        required
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="audit_company" className={LABEL}>
                        {c.email.companyLabel}{" "}
                        <span className="font-normal text-mid-gray">
                          {c.email.companyOptional}
                        </span>
                      </label>
                      <input
                        id="audit_company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder={c.email.companyPlaceholder}
                        className={INPUT}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="audit_email" className={LABEL}>
                      {c.email.emailLabel}
                    </label>
                    <input
                      id="audit_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={c.email.emailPlaceholder}
                      required
                      className={INPUT}
                    />
                  </div>
                  {emailState === "error" && (
                    <p className="border-l-[3px] border-vermilion bg-jet px-3 py-2.5 font-sans text-[13px] text-vermilion">
                      {c.email.error}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      className={BTN_PRIMARY}
                      disabled={emailState === "sending"}
                    >
                      {emailState === "sending" ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          {c.email.sending}
                        </>
                      ) : (
                        <>
                          {c.email.submit}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                    <button type="button" onClick={reset} className={BTN_GHOST}>
                      <RefreshCw size={13} />
                      {isEn ? "Analyze another site" : "Analyser un autre site"}
                    </button>
                  </div>
                  <p className={LABEL_MONO}>{c.email.privacy}</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
