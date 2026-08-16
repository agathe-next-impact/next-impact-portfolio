"use client";

import { useEffect, useState } from "react";
import type { DetectedComponent, ScanApercu, ScanResult } from "@sentinelle/types";

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

// ── Cadence d'interrogation ────────────────────────────────────────────────
// Un intervalle fixe de 1,5 s coûtait une invocation serverless toutes les
// 1,5 s pendant toute l'attente : les logs de production du 2026-08-16 montrent
// une quarantaine d'appels sur `/api/sentinelle/scan/[id]` pour un seul scan,
// toujours en cours au bout de 70 secondes. On garde une cadence rapide au
// début — un scan qui répond vite doit s'afficher vite — puis on l'espace.
const DELAIS_MS = [1_500, 1_500, 2_000, 3_000, 5_000, 8_000] as const;
const DELAI_MAX_MS = 10_000;
// Au-delà, on cesse d'interroger : ce n'est plus une attente, c'est une panne.
// Sans cette borne, un onglet oublié sur un scan bloqué appelle l'API
// indéfiniment.
const ABANDON_MS = 120_000;

function delaiApres(tentative: number): number {
  return DELAIS_MS[tentative] ?? DELAI_MAX_MS;
}

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
    let tentative = 0;
    const debut = Date.now();

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
        // attendre : le scan lui-même, puis l'aperçu de veille dont la
        // rédaction se termine après l'affichage des composants.
        const attendreApercu =
          payload.status === "done" &&
          estResultat(payload.result) &&
          payload.result.apercu?.status === "pending";
        if (payload.status !== "pending" && payload.status !== "running" && !attendreApercu)
          return;

        if (Date.now() - debut >= ABANDON_MS) {
          // Rapport affiché mais aperçu encore en rédaction : on cesse
          // d'interroger sans message d'erreur — il apparaîtra au rechargement.
          if (!attendreApercu) {
            setErreur(
              "L'analyse prend plus de temps que prévu. Rechargez la page dans " +
                "quelques minutes : le résultat s'affichera dès qu'il sera prêt.",
            );
          }
          return;
        }

        timer = setTimeout(interroger, delaiApres(tentative));
        tentative += 1;
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

      <ApercuVeille apercu={resultat.apercu} />

      <LeadCapture scanId={scanId} dejaFourni={etat.hasLead} lienAbonnement={lienAbonnement} />
    </div>
  );
}

// Libellés des cinq grands thèmes de la lettre — mêmes valeurs que
// src/sentinelle/apercu/dossier.ts, dupliquées ici comme FAMILLES : le module
// serveur (Anthropic, base) n'a rien à faire dans un bundle client.
const THEMES_LABELS: Record<string, string> = {
  socle: "Socle technique & sécurité",
  visibilite: "Visibilité & contenu",
  performance: "Performance & expérience",
  "ia-donnees": "IA, données & conformité",
  couts: "Coûts, prestataires & réversibilité",
};

const STATUTS: Record<string, { label: string; classes: string }> = {
  agir: { label: "Agir", classes: "border-vermilion text-vermilion" },
  surveiller: { label: "Surveiller", classes: "border-accent-secondary text-accent-secondary" },
  rien_a_signaler: { label: "Rien à signaler", classes: "border-dark-gray text-mid-gray" },
  non_observable: { label: "Non observable", classes: "border-dark-gray text-mid-gray" },
};

const CAPS: Record<string, string> = {
  consolider: "Consolider",
  evoluer: "Faire évoluer",
  refondre: "Refondre",
};

/**
 * L'aperçu de veille — l'échantillon de la lettre personnalisée de
 * l'abonnement, rédigé à partir de ce scan et des faits déjà collectés.
 * Absent ou en échec : la section disparaît, le rapport reste complet.
 */
function ApercuVeille({ apercu }: { apercu?: ScanApercu }) {
  if (!apercu || apercu.status === "none") return null;

  if (apercu.status === "pending") {
    return (
      <div className="mt-12" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          Aperçu de veille en cours de rédaction
        </p>
        <p className="mt-3 font-inter-tight text-base text-mid-gray">
          Croisement de vos composants avec l'actualité collectée. Moins d'une
          minute — la page se met à jour toute seule.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        Votre veille personnalisée — aperçu
      </p>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        Ce que la lettre de l'abonnement surveillerait pour ce site, thème par
        thème, à partir de ce que ce scan a pu observer.
      </p>

      <ul className="mt-6 divide-y divide-dark-gray border-y border-dark-gray">
        {apercu.themes.map((theme) => {
          const statut = STATUTS[theme.statut] ?? STATUTS.non_observable;
          return (
            <li key={theme.theme} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-inter-tight text-base text-foreground">
                  {THEMES_LABELS[theme.theme] ?? theme.theme}
                </span>
                <span
                  className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${statut.classes}`}
                >
                  {statut.label}
                </span>
              </div>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {theme.texte}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border-l-2 border-accent-secondary/60 pl-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
          Le cap : {CAPS[apercu.cap.scenario] ?? apercu.cap.scenario}
        </p>
        <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
          {apercu.cap.texte}
        </p>
      </div>

      <p className="mt-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
        Aperçu généré automatiquement à partir de cette analyse externe et des
        faits déjà collectés — <strong className="font-medium text-foreground">non relu</strong>.
        La lettre de l'abonnement va plus loin — douze axes, actualité de la
        période, échéancier — et chaque numéro est relu par un humain avant
        envoi.
      </p>
    </section>
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
