"use client";

import { useEffect, useState } from "react";
import type { DetectedComponent, ScanResult } from "@sentinelle/types";

// Libellés lisibles des familles de composants. Le modèle est agnostique, le
// rapport doit l'être aussi : on ne parle pas « d'extensions » à quelqu'un dont
// le site tourne sous Next.js.
const FAMILLES: Record<string, string> = {
  cms: "Gestionnaire de contenu",
  cms_plugin: "Extensions",
  cms_theme: "Thème",
  ecommerce: "Boutique",
  framework: "Socle technique",
  js_library: "Bibliothèques",
  runtime: "Exécution",
  server: "Serveur web",
  hosting: "Hébergement",
  cdn: "Réseau de diffusion",
  analytics: "Mesure d'audience",
  saas: "Services tiers",
};

const CONFIANCE: Record<string, string> = {
  high: "certain",
  medium: "probable",
  low: "indice faible",
};

interface Etat {
  status: "pending" | "running" | "done" | "failed";
  result: ScanResult | { error: string } | null;
  url: string;
  hasLead: boolean;
}

function estResultat(value: unknown): value is ScanResult {
  return typeof value === "object" && value !== null && "components" in value;
}

export function ScanReport({ scanId, lienAbonnement }: { scanId: string; lienAbonnement: string | null }) {
  const [etat, setEtat] = useState<Etat | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let vivant = true;
    let timer: ReturnType<typeof setTimeout>;

    async function interroger() {
      try {
        const response = await fetch(`/api/sentinelle/scan/${scanId}`);
        if (!response.ok) {
          if (vivant) setErreur("Analyse introuvable.");
          return;
        }

        const payload: Etat = await response.json();
        if (!vivant) return;
        setEtat(payload);

        // On ne relance l'interrogation que tant qu'il y a quelque chose à
        // attendre : une fois terminé, on arrête net.
        if (payload.status === "pending" || payload.status === "running") {
          timer = setTimeout(interroger, 1500);
        }
      } catch {
        if (vivant) setErreur("Connexion interrompue.");
      }
    }

    interroger();
    return () => {
      vivant = false;
      clearTimeout(timer);
    };
  }, [scanId]);

  if (erreur) {
    return <p className="font-inter-tight text-base text-mid-gray">{erreur}</p>;
  }

  if (!etat || etat.status === "pending" || etat.status === "running") {
    return (
      <div className="mt-10" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          Analyse en cours
        </p>
        <p className="mt-3 font-inter-tight text-base text-mid-gray">
          Lecture de la page d'accueil et des en-têtes. Quelques secondes.
        </p>
      </div>
    );
  }

  if (etat.status === "failed" || !estResultat(etat.result)) {
    const raison =
      etat.result && "error" in etat.result ? etat.result.error : "raison inconnue";
    return (
      <div className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          Analyse impossible
        </p>
        <p className="mt-3 font-inter-tight text-base text-mid-gray">
          Je n'ai pas pu analyser ce site : {raison}. Cela arrive quand un site
          bloque les robots ou répond trop lentement — ce n'est pas
          nécessairement un problème de votre côté.
        </p>
      </div>
    );
  }

  const resultat = etat.result;
  const parFamille = new Map<string, DetectedComponent[]>();
  for (const composant of resultat.components) {
    const liste = parFamille.get(composant.type) ?? [];
    liste.push(composant);
    parFamille.set(composant.type, liste);
  }

  return (
    <div className="mt-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        {resultat.components.length} composant{resultat.components.length > 1 ? "s" : ""} détecté
        {resultat.components.length > 1 ? "s" : ""}
      </p>

      {resultat.components.length === 0 && (
        <p className="mt-4 font-inter-tight text-base text-mid-gray">
          Aucun composant identifiable publiquement. C'est le cas des sites très
          épurés ou fortement protégés — la fiche se remplit alors avec vous.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {[...parFamille.entries()].map(([famille, composants]) => (
          <section key={famille}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
              {FAMILLES[famille] ?? famille}
            </h2>
            <ul className="mt-3 divide-y divide-dark-gray border-y border-dark-gray">
              {composants.map((composant) => (
                <li
                  key={`${composant.type}:${composant.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
                >
                  <span className="font-inter-tight text-base text-foreground">
                    {composant.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {composant.version ? `v${composant.version}` : "version inconnue"}
                    {composant.version && composant.versionConfidence !== "high" && " · déduite"}
                    {" · "}
                    {CONFIANCE[composant.confidence]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 border-l-2 border-accent-secondary/60 pl-4">
        {resultat.notes.map((note) => (
          <p key={note} className="mb-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
            {note}
          </p>
        ))}
      </div>

      <LeadCapture scanId={scanId} dejaFourni={etat.hasLead} lienAbonnement={lienAbonnement} />
    </div>
  );
}

function LeadCapture({
  scanId,
  dejaFourni,
  lienAbonnement,
}: {
  scanId: string;
  dejaFourni: boolean;
  lienAbonnement: string | null;
}) {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(dejaFourni);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErreur(null);

    const response = await fetch(`/api/sentinelle/scan/${scanId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setErreur(payload.error ?? "Envoi impossible.");
      return;
    }

    setEnvoye(true);
  }

  return (
    <div className="mt-12 border border-dark-gray p-6">
      {envoye ? (
        <>
          <p className="font-inter-tight text-base text-foreground">
            C'est noté. Ce que ce scan ne peut pas voir — les extensions
            chargées uniquement en back-office, votre hébergeur exact — se
            complète à l'activation de la surveillance.
          </p>
          {lienAbonnement && (
            <a
              href={lienAbonnement}
              className="mt-6 inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
            >
              Activer la surveillance
            </a>
          )}
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
            Recevoir ce rapport par e-mail
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-w-0 flex-1 border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground placeholder:text-mid-gray/60 focus:border-accent-secondary focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent-secondary"
            >
              Envoyer
            </button>
          </div>
          {erreur && (
            <p role="alert" className="mt-3 font-inter-tight text-sm text-accent-secondary">
              {erreur}
            </p>
          )}
          <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
            Votre adresse sert à vous envoyer ce rapport et à vous recontacter.
            Rien d'autre. Conservation et droits :{" "}
            <a href="/confidentialite" className="underline">
              politique de confidentialité
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}
