"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Formulaire d'analyse. Poste l'URL, puis redirige vers la page de rapport :
 * c'est le rapport qui interroge l'état, pas ce formulaire.
 */
export function ScanForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (envoi) return;

    setErreur(null);
    setEnvoi(true);

    try {
      const response = await fetch("/api/sentinelle/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErreur(payload.error ?? "L'analyse n'a pas pu démarrer.");
        setEnvoi(false);
        return;
      }

      router.push(`/scan/${payload.scanId}`);
    } catch {
      setErreur("Impossible de joindre le service. Réessayez dans un instant.");
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-xl">
      <label htmlFor="url" className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
        Adresse de votre site
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="url"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          required
          placeholder="exemple.fr"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={envoi}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? "url-erreur" : undefined}
          className="min-w-0 flex-1 border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground placeholder:text-mid-gray/60 focus:border-accent-secondary focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={envoi}
          className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {envoi ? "Analyse…" : "Analyser"}
        </button>
      </div>

      {erreur && (
        <p id="url-erreur" role="alert" className="mt-3 font-inter-tight text-sm text-accent-secondary">
          {erreur}
        </p>
      )}

      <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
        L'analyse ne lit que ce qu'un visiteur voit : le code servi et les
        en-têtes HTTP. Aucun test d'intrusion, aucune tentative d'accès.
      </p>
    </form>
  );
}
