import React, { useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
const AuditSendFormClient = dynamic(() => import("./AuditSendFormClient"), { ssr: false });
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface GeminiSearchProps {
  onResult: (result: any) => void;
  prompt: string;
  systemInstruction: string;
  defaultUrl?: string;
}

// Champ URL / texte — surface jet, liseré dark-gray, focus accent secondaire.
const inputClass =
  "w-full border border-dark-gray bg-jet px-4 py-3 font-sans text-[15px] text-foreground outline-none transition-colors placeholder:text-mid-gray focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary";

// Bouton primaire — remplissage indigo bordé charcoal, label mono.
const btnPrimaryClass =
  "inline-flex items-center gap-2 border border-charcoal bg-vermilion px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright disabled:cursor-not-allowed disabled:opacity-50";

export default function GeminiSearch({ onResult, prompt, systemInstruction, defaultUrl }: GeminiSearchProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [url, setUrl] = useState(defaultUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResultPage, setShowResultPage] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [showOptin, setShowOptin] = useState(false);
  const [optinName, setOptinName] = useState("");
  const [optinCompany, setOptinCompany] = useState("");
  const [optinEmail, setOptinEmail] = useState("");
  const [optinRefused, setOptinRefused] = useState(false);

  const [cmsDetecting, setCmsDetecting] = useState(false);
  const [detectedCms, setDetectedCms] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; company: string; email: string } | null>(null);

  React.useEffect(() => {
    if (defaultUrl && defaultUrl.trim() && !showResultPage && !loading && !cmsDetecting) {
      detectCms(defaultUrl.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultUrl]);

  const validateUrl = (): boolean => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError(isEn ? "Please enter a URL" : "Veuillez saisir une URL");
      return false;
    }
    if (!trimmedUrl.match(/^https?:\/\/.+/)) {
      setError(isEn ? "The URL must start with http:// or https://" : "L'URL doit commencer par http:// ou https://");
      return false;
    }
    setError(null);
    return true;
  };

  const detectCms = async (targetUrl: string) => {
    setCmsDetecting(true);
    setError(null);
    setDetectedCms(null);
    try {
      const res = await fetch("/api/detect-cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (res.status === 429) {
        const data = await res.json();
        setError(data.error || (isEn ? "Service temporarily unavailable, please try again." : "Service temporairement indisponible, veuillez réessayer."));
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || (isEn ? "CMS detection error" : "Erreur lors de la détection du CMS"));
        return;
      }
      const data = await res.json();
      setDetectedCms(data.detectedCms || (data.isWordPress ? "WordPress" : null));
      setShowOptin(true);
    } catch (err: any) {
      setError(err.message || (isEn ? "CMS detection error" : "Erreur lors de la détection du CMS"));
    } finally {
      setCmsDetecting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl()) return;
    setOptinRefused(false);
    detectCms(url.trim());
  };

  const handleOptinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const info = { name: optinName.trim(), company: optinCompany.trim(), email: optinEmail.trim() };
    setUserInfo(info);
    setShowOptin(false);
    launchAnalysis(info);
  };

  const handleOptinClose = () => {
    setShowOptin(false);
    setOptinRefused(true);
  };

  const launchAnalysis = async (info: { name: string; company: string; email: string }) => {
    const trimmedUrl = url.trim();
    setLoading(true);
    setError(null);
    setSendError(null);
    try {
      const res = await fetch("/api/send-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: info.name,
          company: info.company,
          email: info.email,
          url: trimmedUrl,
          locale,
          prompt,
          systemInstruction,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || (isEn ? "Error sending the audit" : "Erreur lors de l'envoi de l'audit"));
      }
      onResult({ queued: true });
      setShowResultPage(true);
    } catch (err: any) {
      setSendError(err.message || (isEn ? "Unknown error" : "Erreur inconnue"));
      setShowResultPage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!loading && !cmsDetecting && !showResultPage && (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <label htmlFor="gemini_url" className="font-sans text-sm font-semibold text-foreground">
            {isEn ? "Site URL to analyze" : "URL du site à analyser"}
          </label>
          <input
            id="gemini_url"
            className={inputClass}
            value={url}
            onChange={(e) => { setUrl(e.target.value); setOptinRefused(false); }}
            placeholder="https://test.com"
            required
            disabled={loading || cmsDetecting}
            type="url"
            pattern="https?://.+"
          />
          <div>
            <button type="submit" className={btnPrimaryClass} disabled={loading || cmsDetecting || !url.trim()}>
              {isEn ? "Run analysis" : "Lancer l'analyse"}
              <ArrowRight size={14} />
            </button>
          </div>
          {error && (
            <div className="border-l-[3px] border-vermilion bg-jet px-3 py-2.5 font-sans text-[13px] text-vermilion">
              {error}
            </div>
          )}
          {optinRefused && (
            <div className="flex flex-wrap items-center gap-3 border border-dark-gray border-l-[3px] border-l-accent-secondary bg-jet px-4 py-3">
              <span className="flex-1 font-sans text-[13px] text-mid-gray">
                {isEn
                  ? "Your contact details are required to receive your personalized audit."
                  : "Vos coordonnées sont obligatoires pour recevoir votre audit personnalisé."}
              </span>
              <button
                type="button"
                onClick={() => { setOptinRefused(false); setShowOptin(true); }}
                className={`${btnPrimaryClass} whitespace-nowrap px-4 py-2`}
              >
                {isEn ? "Enter my details" : "Remplir mes coordonnées"}
              </button>
            </div>
          )}
        </form>
      )}

      {cmsDetecting && (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-dark-gray border-t-accent-secondary" />
          <p className="font-sans text-sm text-mid-gray">
            {isEn ? "Detecting CMS…" : "Vérification du CMS en cours..."}
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-dark-gray border-t-accent-secondary" />
          <p className="font-sans text-sm text-mid-gray">
            {isEn ? "Preparing your audit…" : "Préparation de votre audit…"}
          </p>
        </div>
      )}

      {showOptin && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm"
          onClick={handleOptinClose}
        >
          <div
            className="relative w-full max-w-md border border-dark-gray border-t-[3px] border-t-accent-secondary bg-jet p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 flex items-center gap-2 font-sans text-xl font-light text-foreground">
              <ShieldCheck size={18} className="text-accent-secondary" />
              {isEn ? "Before running the audit" : "Avant de lancer l'audit"}
            </h2>
            <p className="mb-6 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {detectedCms
                ? isEn
                  ? `${detectedCms} detected. Enter your contact details to receive your full audit report.`
                  : `${detectedCms} détecté. Renseignez vos coordonnées pour recevoir votre rapport d'audit complet.`
                : isEn
                  ? "Enter your contact details to receive your full audit report."
                  : "Renseignez vos coordonnées pour recevoir votre rapport d'audit complet."}
            </p>
            <form onSubmit={handleOptinSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block font-sans text-[13px] font-semibold text-foreground">
                  {isEn ? "Name" : "Nom"} <span className="text-accent-secondary">*</span>
                </label>
                <input type="text" value={optinName} onChange={(e) => setOptinName(e.target.value)} required placeholder={isEn ? "Your name" : "Votre nom"} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[13px] font-semibold text-foreground">
                  {isEn ? "Company" : "Entreprise"}{" "}
                  <span className="font-normal text-mid-gray text-xs">{isEn ? "(optional)" : "(optionnel)"}</span>
                </label>
                <input type="text" value={optinCompany} onChange={(e) => setOptinCompany(e.target.value)} placeholder={isEn ? "Your company" : "Votre entreprise"} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[13px] font-semibold text-foreground">
                  Email <span className="text-accent-secondary">*</span>
                </label>
                <input type="email" value={optinEmail} onChange={(e) => setOptinEmail(e.target.value)} required placeholder={isEn ? "you@email.com" : "votre@email.com"} className={inputClass} />
              </div>
              <button type="submit" className={btnPrimaryClass}>
                {isEn ? "Run analysis" : "Lancer l'analyse"}
                <ArrowRight size={14} />
              </button>
              <p className="text-center font-mono text-[9px] uppercase tracking-[0.08em] text-mid-gray">
                {isEn ? "Your data is used only to send you your report." : "Vos données sont utilisées uniquement pour vous envoyer votre rapport."}
              </p>
            </form>
          </div>
        </div>,
        document.body
      )}

      {showResultPage && (
        <AuditSendFormClient
          url={url}
          userInfo={userInfo || undefined}
          status={sendError ? "error" : "sent"}
          errorMessage={sendError || undefined}
        />
      )}
    </>
  );
}
