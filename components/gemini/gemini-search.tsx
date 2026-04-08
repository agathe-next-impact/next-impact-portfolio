import React, { useState } from "react";
import Image from "next/image";
import { TypewriterLoading } from "../ui/typewriter-loading";
import dynamic from "next/dynamic";
const AuditSendFormClient = dynamic(() => import("./AuditSendFormClient"), { ssr: false });
import { Button } from "../ui/button";
import { ArrowRight, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";


interface GeminiSearchProps {
  onResult: (result: any) => void;
  prompt: string;
  systemInstruction: string;
  defaultUrl?: string;
}

export default function GeminiSearch({ onResult, prompt, systemInstruction, defaultUrl }: GeminiSearchProps) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showResultPage, setShowResultPage] = useState(false);

  // Optin popup state
  const [showOptin, setShowOptin] = useState(false);
  const [optinName, setOptinName] = useState("");
  const [optinCompany, setOptinCompany] = useState("");
  const [optinEmail, setOptinEmail] = useState("");
  const [optinRefused, setOptinRefused] = useState(false);

  // CMS detection state
  const [cmsDetecting, setCmsDetecting] = useState(false);
  const [showNotWordPress, setShowNotWordPress] = useState(false);
  const [detectedCms, setDetectedCms] = useState<string | null>(null);

  // User info collected from optin
  const [userInfo, setUserInfo] = useState<{ name: string; company: string; email: string } | null>(null);

  // Lance la détection CMS automatiquement si defaultUrl est fourni
  React.useEffect(() => {
    if (defaultUrl && defaultUrl.trim() && !result && !loading && !cmsDetecting) {
      detectCms(defaultUrl.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultUrl]);

  React.useEffect(() => {
    if (result) {
      setShowResultPage(true);
    }
  }, [result]);

  const validateUrl = (): boolean => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Veuillez saisir une URL");
      return false;
    }
    if (!trimmedUrl.match(/^https?:\/\/.+/)) {
      setError("L'URL doit commencer par http:// ou https://");
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
        setError(data.error || "Service temporairement indisponible, veuillez réessayer.");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la détection du CMS");
        return;
      }

      const data = await res.json();

      if (data.isWordPress && data.isMonolithic) {
        // WordPress monolithique détecté → afficher l'optin
        setDetectedCms("WordPress");
        setShowOptin(true);
      } else {
        // Pas WordPress monolithique → afficher le popup informatif
        setDetectedCms(data.detectedCms);
        setShowNotWordPress(true);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la détection du CMS");
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
    setResult(null);

    try {
      const res = await fetch("/api/gemini-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl, prompt, systemInstruction }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de l'appel à Gemini");
      }
      const data = await res.json();
      setResult(data);
      onResult(data);
      setShowResultPage(true);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!loading && !cmsDetecting && !showResultPage && (
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-6 mx-auto px-0 md:px-4 pt-4"
        >
          <div className="flex items-end">
            <label
              htmlFor="gemini_url"
              className="font-googletexte text-white/80 "
            >
              URL WordPress à analyser
            </label>
          </div>
          <input
            id="gemini_url"
            className="w-xl bg-white/90 border rounded-full p-2 -mt-4 mb-2 focus-visible:bg-white"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setOptinRefused(false); }}
            placeholder="https://test.com"
            required
            disabled={loading || cmsDetecting}
            type="url"
            pattern="https?://.+"
          />
          <Button
            type="submit"
            variant="default"
            className="bg-coral text-darkblue px-6 py-2 text-xl font-googletitre font-semibold flex items-center justify-center transition-all duration-300"
            disabled={loading || cmsDetecting || !url.trim()}
          >
            Lancer l&apos;analyse
            <span className="ml-2 flex items-center text-darkblue">
              <ArrowRight className="size-5"/>
            </span>
          </Button>
          {error && <div className="text-red-500">{error}</div>}
          {optinRefused && (
            <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl px-4 py-3 text-sm font-googletexte flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span>Vos coordonnées sont obligatoires pour recevoir votre audit personnalisé.</span>
              <button
                type="button"
                onClick={() => { setOptinRefused(false); setShowOptin(true); }}
                className="shrink-0 bg-coral text-darkblue font-semibold px-4 py-1.5 rounded-full text-sm transition-all duration-300"
              >
                Remplir mes coordonnées
              </button>
            </div>
          )}
        </form>
      )}

      {/* Loading détection CMS */}
      {cmsDetecting && (
        <div className="w-full max-w-xl mt-4 mx-auto flex flex-col items-center justify-center p-6">
          <Loader2 className="size-8 animate-spin text-coral mb-4" />
          <p className="text-white/80 font-googletexte text-lg">Vérification du CMS en cours...</p>
        </div>
      )}

      {/* Popup optin (WordPress monolithique détecté) */}
      <Dialog open={showOptin} onOpenChange={(open) => { if (!open) handleOptinClose(); }}>
        <DialogContent className="bg-darkblue border-mediumblue/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-googletitre text-xl flex items-center gap-2">
              <ShieldCheck className="size-5 text-coral" />
              Avant de lancer l&apos;audit
            </DialogTitle>
            <DialogDescription className="text-white/70 font-googletexte">
              WordPress monolithique détecté. Renseignez vos coordonnées pour recevoir votre rapport d&apos;audit complet.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOptinSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="optin_name" className="text-white/80 text-sm font-googletexte">
                Nom <span className="text-coral">*</span>
              </label>
              <input
                id="optin_name"
                type="text"
                value={optinName}
                onChange={(e) => setOptinName(e.target.value)}
                required
                placeholder="Votre nom"
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-coral"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="optin_company" className="text-white/80 text-sm font-googletexte">
                Entreprise <span className="text-white/40 text-xs">(optionnel)</span>
              </label>
              <input
                id="optin_company"
                type="text"
                value={optinCompany}
                onChange={(e) => setOptinCompany(e.target.value)}
                placeholder="Votre entreprise"
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-coral"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="optin_email" className="text-white/80 text-sm font-googletexte">
                Email <span className="text-coral">*</span>
              </label>
              <input
                id="optin_email"
                type="email"
                value={optinEmail}
                onChange={(e) => setOptinEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-coral"
              />
            </div>
            <Button
              type="submit"
              className="bg-coral text-darkblue font-googletitre font-semibold mt-2 transition-all duration-300"
            >
              Lancer l&apos;analyse
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <p className="text-white/40 text-xs text-center font-googletexte">
              Vos données sont utilisées uniquement pour vous envoyer votre rapport.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Popup site non WordPress monolithique */}
      <Dialog open={showNotWordPress} onOpenChange={(open) => { if (!open) setShowNotWordPress(false); }}>
        <DialogContent className="bg-darkblue border-mediumblue/30 sm:max-w-md pb-4">
          <DialogHeader>
            <DialogTitle className="text-white font-googletitre text-xl flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange" />
              Site non WordPress monolithique
            </DialogTitle>
            <DialogDescription className="text-white/70 font-googletexte">
              {detectedCms
                ? `Le site analysé utilise ${detectedCms} et non WordPress monolithique.`
                : "Aucun CMS WordPress monolithique n'a été détecté sur ce site."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-white/60 text-sm font-googletexte">
              Notre audit de migration headless est spécifiquement conçu pour les sites WordPress monolithiques.
              {detectedCms && detectedCms !== "WordPress" && (
                <> Votre site semble utiliser <strong className="text-white/80">{detectedCms}</strong>.</>
              )}
              {!detectedCms && (
                <> Le CMS utilisé par ce site n&apos;a pas pu être identifié, ou il ne s&apos;agit pas d&apos;un CMS standard.</>
              )}
            </p>
            <Button
              onClick={() => setShowNotWordPress(false)}
              className="bg-coral text-darkblue font-googletitre font-semibold transition-all duration-300"
            >
              Compris
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="w-full max-w-xl mt-4 mx-auto flex flex-col items-center justify-center p-6">
          <TypewriterLoading
            messages={[
              "Analyse en cours...",
              "C'est un peu long...",
              "C'est détaillé...",
              "C'est personnalisé...",
              "Presque fini...",
            ]}
            speed={40}
            className="h-6 mt-12 text-2xl"
          />
        </div>
      )}

      {showResultPage && result && (
        <AuditSendFormClient
          markdownFull={
            result.text || JSON.stringify(result, null, 2)
          }
          url={url}
          userInfo={userInfo || undefined}
        />
      )}
    </>
  );
}
