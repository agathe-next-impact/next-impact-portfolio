"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { buttonClass } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux boutons qui parlent à l'authentificateur.
//
// Ce sont les SEULS composants client de l'espace, et pour une raison précise :
// `navigator.credentials` n'existe que dans le navigateur. Tout le reste est
// rendu côté serveur, où la session est vérifiée.
//
// Ce fichier ne décide rien. Il transporte : il demande des options au serveur,
// les passe à l'appareil, renvoie la réponse signée. Toutes les vérifications
// sont faites côté serveur, sur des valeurs que ce code ne peut pas influencer.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Traduit les erreurs de l'API WebAuthn en phrases utiles.
 *
 * Le cas de loin le plus fréquent est l'abandon : le client ferme la fenêtre du
 * système, ou laisse passer le délai. Ce n'est pas une panne, et l'écrire comme
 * telle affolerait pour rien.
 */
function humanError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "NotAllowedError") {
      return "Demande annulée. Vous pouvez réessayer.";
    }
    if (error.name === "InvalidStateError") {
      return "Cet appareil est déjà enregistré sur votre accès.";
    }
    if (error.name === "SecurityError") {
      return "Connexion impossible depuis cette adresse. Ouvrez votre espace depuis le lien reçu par e-mail.";
    }
  }
  return "Cet appareil n'a pas pu être vérifié. Réessayez, ou utilisez le lien de secours.";
}

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok || !payload) {
    throw new Error(payload?.error ?? "Le serveur n'a pas répondu.");
  }

  return payload;
}

/** Connexion en un clic. Aucune adresse à saisir : le navigateur propose la passkey. */
export function PasskeyLoginButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    setBusy(true);
    setError(null);

    try {
      const start = await postJson<{ challengeId: string; options: never }>(
        "/api/cto/passkey/authentication/options",
      );
      const response = await startAuthentication({ optionsJSON: start.options });
      await postJson("/api/cto/passkey/authentication/verify", {
        challengeId: start.challengeId,
        response,
      });

      // `refresh()` seul suffirait, mais un rechargement franc évite qu'un état
      // client résiduel survive à un changement d'identité.
      router.replace("/espace-direction");
      router.refresh();
    } catch (err) {
      setError(humanError(err));
      setBusy(false);
    }
  }

  // Un navigateur trop ancien ne doit pas afficher un bouton qui échouera : le
  // lien de secours, lui, marche partout.
  if (typeof window !== "undefined" && !browserSupportsWebAuthn()) {
    return null;
  }

  return (
    <div>
      <button type="button" onClick={connect} disabled={busy} className={buttonClass.primary}>
        {busy ? "Connexion…" : "Se connecter avec une passkey"}
      </button>
      {error ? (
        <p className="mt-3 font-inter-tight text-sm text-[#ff8a7a]">{error}</p>
      ) : null}
    </div>
  );
}

/** Enrôlement d'un appareil, depuis une session déjà ouverte. */
export function PasskeyEnrollButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enroll() {
    setBusy(true);
    setError(null);

    try {
      const start = await postJson<{ challengeId: string; options: never }>(
        "/api/cto/passkey/registration/options",
      );
      const response = await startRegistration({ optionsJSON: start.options });
      await postJson("/api/cto/passkey/registration/verify", {
        challengeId: start.challengeId,
        response,
      });

      router.refresh();
    } catch (err) {
      setError(humanError(err));
    } finally {
      setBusy(false);
    }
  }

  if (typeof window !== "undefined" && !browserSupportsWebAuthn()) {
    return (
      <p className="font-inter-tight text-sm text-mid-gray">
        Ce navigateur ne gère pas les passkeys. Continuez avec le lien de connexion reçu
        par e-mail.
      </p>
    );
  }

  return (
    <div>
      <button type="button" onClick={enroll} disabled={busy} className={buttonClass.primary}>
        {busy ? "En cours…" : "Enregistrer cet appareil"}
      </button>
      {error ? (
        <p className="mt-3 font-inter-tight text-sm text-[#ff8a7a]">{error}</p>
      ) : null}
    </div>
  );
}
