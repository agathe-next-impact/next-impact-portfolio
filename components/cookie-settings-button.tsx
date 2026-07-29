"use client";

// Petit bouton client pour rouvrir le bandeau de consentement cookies depuis le
// footer (qui reste un Server Component). Déclenche l'évènement écouté par
// components/consent-manager.tsx.

export function CookieSettingsButton({
  className,
  label = "Cookies",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("ni:manage-consent"))}
      className={className}
    >
      {label}
    </button>
  );
}
