import React, { useState } from "react";
import Image from "next/image";
import { TypewriterLoading } from "../ui/typewriter-loading";
import dynamic from "next/dynamic";
const AuditSendFormClient = dynamic(() => import("./AuditSendFormClient"), { ssr: false });
import { Button } from "../ui/button";
import { ArrowRight, Target, TargetIcon } from "lucide-react";
import { Arrow } from "@radix-ui/react-select";


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

  // Lance l'audit automatiquement si defaultUrl est fourni
  React.useEffect(() => {
    if (defaultUrl && defaultUrl.trim() && !result && !loading) {
      handleSubmit(undefined, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultUrl]);

  React.useEffect(() => {
    if (result) {
      setShowResultPage(true);
    }
  }, [result]);

  const handleSubmit = async (e?: React.FormEvent, auto = false) => {
    if (e) e.preventDefault();
    
    // Validation et normalisation de l'URL
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Veuillez saisir une URL");
      return;
    }
    
    // Vérifier que l'URL commence par http:// ou https://
    if (!trimmedUrl.match(/^https?:\/\/.+/)) {
      setError("L'URL doit commencer par http:// ou https://");
      return;
    }
    
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
      {!loading && !showResultPage && (
        <form
          onSubmit={handleSubmit}
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
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://test.com"
            required
            disabled={loading}
            type="url"
            pattern="https?://.+"
          />
          <Button
            type="submit"
            variant="default"
            className="bg-coral hover:bg-coral/90 text-darkblue px-6 py-2 text-xl font-googletitre font-semibold flex items-center justify-center"
            disabled={loading || !url.trim()}
          >
            Lancer l'analyse
            <span className="ml-2 flex items-center text-darkblue">
              <ArrowRight className="size-5"/>
            </span>
          </Button>
          {error && <div className="text-red-500">{error}</div>}
        </form>
      )}

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
        />
      )}
    </>
  );
}