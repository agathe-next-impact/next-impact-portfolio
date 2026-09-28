"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Demande d'inscription à Sentinelle — l'opt-in de la page d'offre.
//
// Depuis le 2026-09-27, on ne s'abonne plus en ligne : ce formulaire envoie une
// demande (nom, organisation, e-mail, site) qu'Agathe valide ; l'activation
// ouvre l'espace et envoie la bienvenue, la facturation se fait à part.
//
// Composant vitrine : il parle au produit par HTTP (`/api/sentinelle/
// inscription`) et n'importe rien de `@sentinelle/*` (règle d'isolation).
// Consentement explicite, case non cochée. Le champ `site`, caché, est un pot
// de miel : un humain le laisse vide, le serveur refuse s'il est rempli.
// ─────────────────────────────────────────────────────────────────────────────

const LIBELLE = "font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray";
const SAISIE =
  "mt-2 w-full min-w-0 border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground placeholder:text-mid-gray/60 focus:border-accent-secondary focus:outline-none";

export function InscriptionSentinelle() {
  const [champs, setChamps] = useState({ nom: "", organisation: "", email: "", url: "" });
  const [piege, setPiege] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const champ =
    (nom: keyof typeof champs) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setChamps((actuels) => ({ ...actuels, [nom]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErreur(null);
    setEnCours(true);

    try {
      const response = await fetch("/api/sentinelle/inscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...champs, consentement, ...(piege ? { site: piege } : {}) }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setErreur(payload.error ?? "Envoi impossible.");
        return;
      }
      setEnvoye(true);
    } catch {
      setErreur("Connexion interrompue.");
    } finally {
      setEnCours(false);
    }
  }

  if (envoye) {
    return (
      <p role="status" className="max-w-2xl font-inter-tight text-base leading-relaxed text-foreground">
        C&apos;est noté. Je valide votre inscription et je reviens vers vous à
        l&apos;adresse indiquée, pour la facturation. À l&apos;activation, un e-mail vous
        ouvre votre espace.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={LIBELLE}>Nom</span>
          <input
            required
            autoComplete="name"
            maxLength={200}
            value={champs.nom}
            onChange={champ("nom")}
            className={SAISIE}
          />
        </label>
        <label className="block">
          <span className={LIBELLE}>Organisation</span>
          <input
            required
            autoComplete="organization"
            maxLength={200}
            value={champs.organisation}
            onChange={champ("organisation")}
            className={SAISIE}
          />
        </label>
        <label className="block">
          <span className={LIBELLE}>E-mail</span>
          <input
            required
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            maxLength={320}
            value={champs.email}
            onChange={champ("email")}
            className={SAISIE}
          />
        </label>
        <label className="block">
          <span className={LIBELLE}>Adresse du site</span>
          <input
            required
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="votre-site.fr"
            maxLength={2048}
            value={champs.url}
            onChange={champ("url")}
            className={SAISIE}
          />
        </label>
      </div>

      {/* Pot de miel : hors écran, hors tabulation, ignoré des lecteurs d'écran. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site
          <input
            tabIndex={-1}
            autoComplete="off"
            value={piege}
            onChange={(event) => setPiege(event.target.value)}
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
        <input
          type="checkbox"
          required
          checked={consentement}
          onChange={(event) => setConsentement(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--accent-2))]"
        />
        <span>
          J&apos;accepte d&apos;être recontacté par Next Impact au sujet de mon
          inscription à Sentinelle. Vos coordonnées ne servent qu&apos;à cela.
          Conservation et droits :{" "}
          <a href="/confidentialite" className="underline">
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={enCours}
        className="mt-5 inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {enCours ? "Envoi…" : "Demander mon inscription"}
      </button>

      {erreur && (
        <p role="alert" className="mt-3 font-inter-tight text-sm text-accent-secondary">
          {erreur}
        </p>
      )}
    </form>
  );
}
