"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

/**
 * Formulaire d'analyse, premier écran de /scan (opt-in depuis le 2026-09-28) :
 * organisation, e-mail et adresse du site, avec consentement explicite.
 * L'e-mail reçoit l'audit dès qu'il est prêt. Poste le tout, puis redirige vers
 * la page de rapport : c'est le rapport qui interroge l'état, pas ce formulaire.
 */
export function ScanForm() {
  const router = useRouter();
  const [champs, setChamps] = useState({
    organisation: "",
    email: "",
    url: "",
    site: "",
  });
  const [consentement, setConsentement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const champ =
    (nom: keyof typeof champs) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setChamps((actuels) => ({ ...actuels, [nom]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (envoi) return;

    setErreur(null);
    setEnvoi(true);

    try {
      const recaptchaToken = await getRecaptchaToken("sentinelle_scan");
      const response = await fetch("/api/sentinelle/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...champs, consentement, recaptchaToken }),
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

  const libelle =
    "font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray";
  const saisie =
    "mt-2 w-full min-w-0 border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground placeholder:text-mid-gray/60 focus:border-accent-secondary focus:outline-none disabled:opacity-60";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 max-w-2xl"
      aria-describedby={erreur ? "scan-erreur" : undefined}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={libelle}>Nom de l'organisation</span>
          <input
            required
            autoComplete="organization"
            maxLength={200}
            value={champs.organisation}
            onChange={champ("organisation")}
            disabled={envoi}
            className={saisie}
          />
        </label>
        <label className="block">
          <span className={libelle}>E-mail</span>
          <input
            required
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            maxLength={320}
            value={champs.email}
            onChange={champ("email")}
            disabled={envoi}
            className={saisie}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={libelle}>Adresse de votre site</span>
          <input
            required
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="exemple.fr"
            maxLength={2048}
            value={champs.url}
            onChange={champ("url")}
            disabled={envoi}
            className={saisie}
          />
        </label>
      </div>

      {/* Pot de miel : invisible pour un humain, rempli par les robots. */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={champs.site}
        onChange={champ("site")}
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <label className="mt-5 flex items-start gap-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
        <input
          type="checkbox"
          required
          checked={consentement}
          onChange={(event) => setConsentement(event.target.checked)}
          disabled={envoi}
          className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--accent-2))]"
        />
        <span>
          J'accepte de recevoir l'audit de mon site par e-mail et d'être
          recontacté par Next Impact à son sujet. Vos coordonnées ne servent
          qu'à cela. Conservation et droits :{" "}
          <a href="/confidentialite" className="underline">
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={envoi}
        className="mt-5 inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {envoi ? "Analyse…" : "Analyser mon site"}
      </button>

      {erreur && (
        <p id="scan-erreur" role="alert" className="mt-3 font-inter-tight text-sm text-accent-secondary">
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
