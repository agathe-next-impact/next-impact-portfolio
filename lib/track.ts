// Helper de tracking analytics — façade typée au-dessus de window.gtag (GA4 déjà
// chargé dans app/[locale]/layout.tsx, id G-3D5PKXEN72). No-op côté serveur et si
// gtag n'est pas disponible (consentement, bloqueur). Aucun PII envoyé.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export type AuditEvent =
  | "audit_page_view"
  | "audit_url_started"
  | "audit_url_submitted"
  | "audit_result_viewed"
  | "audit_email_submitted"
  | "audit_booking_clicked"
  | "audit_stack_recommended_classic"
  | "audit_stack_recommended_headless"
  | "audit_stack_recommended_webapp";

export function track(
  event: AuditEvent | (string & {}),
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params ?? {});
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...(params ?? {}) });
    }
  } catch {
    /* analytics ne doit jamais casser l'UX */
  }
}

// Le verdict d'architecture se mappe sur 3 familles de stack pour le reporting.
const STACK_BY_VERDICT: Record<"A" | "B" | "C" | "D", AuditEvent> = {
  A: "audit_stack_recommended_classic",
  B: "audit_stack_recommended_classic",
  C: "audit_stack_recommended_headless",
  D: "audit_stack_recommended_webapp",
};

export function trackStackRecommended(
  verdict: "A" | "B" | "C" | "D",
  params?: Record<string, unknown>,
): void {
  track(STACK_BY_VERDICT[verdict], { verdict, ...params });
}
