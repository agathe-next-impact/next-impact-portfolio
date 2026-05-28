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

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--rule)",
  background: "var(--paper)",
  color: "var(--ink)",
  fontFamily: "var(--sans)",
  fontSize: 15,
  padding: "12px 16px",
  width: "100%",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  border: "1px solid var(--ink)",
  background: "var(--ink)",
  color: "var(--paper)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "14px 28px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

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
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label htmlFor="gemini_url" style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            {isEn ? "Site URL to analyze" : "URL du site à analyser"}
          </label>
          <input
            id="gemini_url"
            style={inputStyle}
            value={url}
            onChange={(e) => { setUrl(e.target.value); setOptinRefused(false); }}
            placeholder="https://test.com"
            required
            disabled={loading || cmsDetecting}
            type="url"
            pattern="https?://.+"
          />
          <div>
            <button type="submit" style={btnPrimary} disabled={loading || cmsDetecting || !url.trim()}>
              {isEn ? "Run analysis" : "Lancer l'analyse"}
              <ArrowRight size={14} />
            </button>
          </div>
          {error && (
            <div style={{ borderLeft: "3px solid var(--accent-color)", background: "var(--paper-2)", padding: "10px 12px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--accent-color)" }}>
              {error}
            </div>
          )}
          {optinRefused && (
            <div style={{ border: "1px solid var(--rule)", borderLeft: "3px solid #b85c09", background: "var(--paper-2)", padding: "12px 16px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", flex: 1 }}>
                {isEn
                  ? "Your contact details are required to receive your personalized audit."
                  : "Vos coordonnées sont obligatoires pour recevoir votre audit personnalisé."}
              </span>
              <button
                type="button"
                onClick={() => { setOptinRefused(false); setShowOptin(true); }}
                style={{ ...btnPrimary, padding: "8px 16px", whiteSpace: "nowrap" }}
              >
                {isEn ? "Enter my details" : "Remplir mes coordonnées"}
              </button>
            </div>
          )}
        </form>
      )}

      {cmsDetecting && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", gap: 16 }}>
          <div style={{ width: 28, height: 28, border: "2px solid var(--rule)", borderTopColor: "var(--ink)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)" }}>
            {isEn ? "Detecting CMS…" : "Vérification du CMS en cours..."}
          </p>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", gap: 16 }}>
          <div style={{ width: 28, height: 28, border: "2px solid var(--rule)", borderTopColor: "var(--ink)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)" }}>
            {isEn ? "Preparing your audit…" : "Préparation de votre audit…"}
          </p>
        </div>
      )}

      {showOptin && typeof document !== "undefined" && createPortal(
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(14,14,12,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={handleOptinClose}
        >
          <div
            style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderTop: "3px solid var(--ink)", maxWidth: 440, width: "100%", padding: "32px", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink)", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={18} style={{ color: "var(--accent-color)" }} />
              {isEn ? "Before running the audit" : "Avant de lancer l'audit"}
            </h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.5 }}>
              {detectedCms
                ? isEn
                  ? `${detectedCms} detected. Enter your contact details to receive your full audit report.`
                  : `${detectedCms} détecté. Renseignez vos coordonnées pour recevoir votre rapport d'audit complet.`
                : isEn
                  ? "Enter your contact details to receive your full audit report."
                  : "Renseignez vos coordonnées pour recevoir votre rapport d'audit complet."}
            </p>
            <form onSubmit={handleOptinSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  {isEn ? "Name" : "Nom"} <span style={{ color: "var(--accent-color)" }}>*</span>
                </label>
                <input type="text" value={optinName} onChange={(e) => setOptinName(e.target.value)} required placeholder={isEn ? "Your name" : "Votre nom"} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  {isEn ? "Company" : "Entreprise"}{" "}
                  <span style={{ fontWeight: 400, color: "var(--muted-color)", fontSize: 12 }}>{isEn ? "(optional)" : "(optionnel)"}</span>
                </label>
                <input type="text" value={optinCompany} onChange={(e) => setOptinCompany(e.target.value)} placeholder={isEn ? "Your company" : "Votre entreprise"} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  Email <span style={{ color: "var(--accent-color)" }}>*</span>
                </label>
                <input type="email" value={optinEmail} onChange={(e) => setOptinEmail(e.target.value)} required placeholder={isEn ? "you@email.com" : "votre@email.com"} style={inputStyle} />
              </div>
              <button type="submit" style={btnPrimary}>
                {isEn ? "Run analysis" : "Lancer l'analyse"}
                <ArrowRight size={14} />
              </button>
              <p style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-color)", textAlign: "center" }}>
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
