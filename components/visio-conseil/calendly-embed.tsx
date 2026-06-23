"use client";

// Embed Calendly inline, thémé aux couleurs Blueprint et synchronisé au mode
// clair/sombre (next-themes). Les events Calendly encaissent le paiement à la
// réservation → flux 100 % self-service, anti no-show : pas de formulaire mail.
// Init explicite via Calendly.initInlineWidget pour pouvoir ré-initialiser le
// widget quand le thème change (l'iframe ne réagit pas seul au toggle).

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

// Accent Blueprint = vermilion-bright (HSL 231 90% 33% → bleu profond).
const PRIMARY = "081fa0";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

function ensureCalendlyAssets() {
  if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CALENDLY_CSS;
    document.head.appendChild(link);
  }
  if (!document.querySelector(`script[src="${CALENDLY_JS}"]`)) {
    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    document.body.appendChild(script);
  }
}

export function CalendlyInline({ url, height = 720 }: { url: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    ensureCalendlyAssets();

    const isLight = resolvedTheme === "light";
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      background_color: isLight ? "ffffff" : "050505",
      text_color: isLight ? "1a1a1a" : "ffffff",
      primary_color: PRIMARY,
    });
    const themedUrl = `${url}?${params.toString()}`;

    let cancelled = false;
    const init = () => {
      if (cancelled || !ref.current) return;
      if (window.Calendly?.initInlineWidget) {
        ref.current.innerHTML = "";
        window.Calendly.initInlineWidget({ url: themedUrl, parentElement: ref.current });
      } else {
        window.setTimeout(init, 200);
      }
    };
    init();

    return () => {
      cancelled = true;
    };
  }, [mounted, resolvedTheme, url]);

  return (
    <div
      ref={ref}
      className="border border-dark-gray bg-jet"
      style={{ minWidth: 320, height }}
      aria-label="Calendrier de réservation Calendly"
    />
  );
}
