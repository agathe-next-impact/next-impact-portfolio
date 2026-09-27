import { z } from "zod";
import { normalizeSiteUrl } from "@sentinelle/url";

// ─────────────────────────────────────────────────────────────────────────────
// Lecture d'une demande d'inscription — pur, testé sans base.
//
// Depuis le 2026-09-27, on ne s'abonne plus en ligne : l'abonnement commence
// par cet opt-in (nom, organisation, e-mail, site), depuis la page /sentinelle
// ou depuis le rapport d'analyse. Le formulaire des deux endroits envoie la
// même forme ; seul le rapport ajoute `scanId`.
// ─────────────────────────────────────────────────────────────────────────────

const Payload = z.object({
  email: z.string().trim().email().max(320),
  nom: z.string().trim().min(1).max(200),
  organisation: z.string().trim().min(1).max(200),
  url: z.string().trim().min(3).max(2048),
  // L'opt-in : sans case cochée, rien n'est enregistré.
  consentement: z.literal(true),
  scanId: z.string().uuid().optional(),
  // Pot de miel : un champ caché qu'un humain laisse vide.
  site: z.string().max(0).optional(),
});

export interface SubscriptionRequestInput {
  email: string;
  name: string;
  organisation: string;
  siteUrl: string;
  originScanId: string | null;
}

export type ParsedRequest =
  | { ok: true; value: SubscriptionRequestInput }
  | { ok: false; message: string };

/** Valide le corps du formulaire et le met sous la forme stockée. */
export function parseSubscriptionRequest(payload: unknown): ParsedRequest {
  const parsed = Payload.safeParse(payload);
  if (!parsed.success) {
    const champ = parsed.error.issues[0]?.path[0];
    const message =
      champ === "email"
        ? "Adresse e-mail invalide."
        : champ === "consentement"
          ? "Cochez la case pour confirmer votre demande."
          : champ === "url"
            ? "Adresse de site invalide."
            : champ === "site" || champ === "scanId"
              ? "Demande illisible."
              : "Renseignez votre nom et votre organisation.";
    return { ok: false, message };
  }

  const siteUrl = normalizeSiteUrl(parsed.data.url);
  if (!siteUrl) return { ok: false, message: "Adresse de site invalide." };

  return {
    ok: true,
    value: {
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.nom,
      organisation: parsed.data.organisation,
      siteUrl,
      originScanId: parsed.data.scanId ?? null,
    },
  };
}
