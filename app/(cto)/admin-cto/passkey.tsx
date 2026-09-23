"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupportsWebAuthn, startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { buttonClass } from "../espace-direction/ui";

// ─────────────────────────────────────────────────────────────────────────────
// Copie de `espace-direction/passkey.tsx`, pointée vers les routes admin.
//
// Même raison de duplication que partout dans `admin-cto/` : deux consommateurs
// aux URL et aux redirections différentes ne valent pas une prop de plus sur un
// composant partagé — voir `src/cto/admin/identity.ts`.
// ─────────────────────────────────────────────────────────────────────────────

function humanError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "NotAllowedError") return "Demande annulée. Vous pouvez réessayer.";
    if (error.name === "InvalidStateError") return "Cet appareil est déjà enregistré sur votre accès.";
    if (error.name === "SecurityError") {
      return "Connexion impossible depuis cette adresse. Ouvrez la supervision depuis le lien reçu par e-mail.";
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

  const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;

  if (!response.ok || !payload) {
    throw new Error(payload?.error ?? "Le serveur n'a pas répondu.");
  }

  return payload;
}

export function AdminPasskeyLoginButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    setBusy(true);
    setError(null);

    try {
      const start = await postJson<{ challengeId: string; options: never }>(
        "/api/cto/admin/passkey/authentication/options",
      );
      const response = await startAuthentication({ optionsJSON: start.options });
      await postJson("/api/cto/admin/passkey/authentication/verify", {
        challengeId: start.challengeId,
        response,
      });

      router.replace("/admin-cto/pilotage");
      router.refresh();
    } catch (err) {
      setError(humanError(err));
      setBusy(false);
    }
  }

  if (typeof window !== "undefined" && !browserSupportsWebAuthn()) return null;

  return (
    <div>
      <button type="button" onClick={connect} disabled={busy} className={buttonClass.primary}>
        {busy ? "Connexion…" : "Se connecter avec une passkey"}
      </button>
      {error ? <p className="mt-3 font-inter-tight text-sm text-[#ff8a7a]">{error}</p> : null}
    </div>
  );
}

export function AdminPasskeyEnrollButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enroll() {
    setBusy(true);
    setError(null);

    try {
      const start = await postJson<{ challengeId: string; options: never }>(
        "/api/cto/admin/passkey/registration/options",
      );
      const response = await startRegistration({ optionsJSON: start.options });
      await postJson("/api/cto/admin/passkey/registration/verify", {
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
        Ce navigateur ne gère pas les passkeys. Continuez avec le lien de connexion reçu par e-mail.
      </p>
    );
  }

  return (
    <div>
      <button type="button" onClick={enroll} disabled={busy} className={buttonClass.primary}>
        {busy ? "En cours…" : "Enregistrer cet appareil"}
      </button>
      {error ? <p className="mt-3 font-inter-tight text-sm text-[#ff8a7a]">{error}</p> : null}
    </div>
  );
}
