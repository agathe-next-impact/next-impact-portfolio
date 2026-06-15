"use client";

// Bandeau de consentement cookies (CNIL) — chantier GEO, Lot 2.
// RÈGLE : aucun script de mesure d'audience (Google Analytics 4, Microsoft Clarity)
// n'est chargé tant que l'utilisateur n'a pas cliqué « Accepter ». Le choix est
// mémorisé (localStorage `ni-consent`). On peut rouvrir le bandeau via l'évènement
// `ni:manage-consent` (déclenché par le lien « Cookies » du footer) pour modifier
// son choix. Retrait d'un consentement déjà accordé → rechargement pour stopper le suivi.

import { useEffect, useState } from "react";
import Script from "next/script";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const KEY = "ni-consent";
const GA_ID = "G-3D5PKXEN72";
const CLARITY_ID = "vl7osdgfi9";

type Decision = "granted" | "denied" | null;

const BTN_PRIMARY =
  "inline-flex h-10 items-center rounded-sm border border-charcoal bg-vermilion px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "inline-flex h-10 items-center rounded-sm border border-dark-gray px-5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-obsidian";

function AnalyticsScripts() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script id="clarity-init" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
      </Script>
    </>
  );
}

function Banner({
  isEn,
  onAccept,
  onRefuse,
}: {
  isEn: boolean;
  onAccept: () => void;
  onRefuse: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-2.5 pb-2.5 lg:px-4 lg:pb-4">
      <div
        role="dialog"
        aria-label={isEn ? "Cookie consent" : "Consentement aux cookies"}
        className="mx-auto flex max-w-[1200px] flex-col gap-4 border border-dark-gray bg-jet/95 p-5 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"
      >
        <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
          {isEn
            ? "This site uses audience-measurement cookies (Google Analytics, Microsoft Clarity) to improve your experience."
            : "Ce site utilise des cookies de mesure d'audience (Google Analytics, Microsoft Clarity) pour améliorer votre expérience."}{" "}
          <Link
            href="/confidentialite"
            className="text-accent-secondary underline-offset-4 hover:underline"
          >
            {isEn ? "Privacy policy" : "Politique de confidentialité"}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={onRefuse} className={BTN_GHOST}>
            {isEn ? "Refuse" : "Refuser"}
          </button>
          <button type="button" onClick={onAccept} className={BTN_PRIMARY}>
            {isEn ? "Accept" : "Accepter"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConsentManager() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [decision, setDecision] = useState<Decision>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Decision;
    const valid: Decision = stored === "granted" || stored === "denied" ? stored : null;
    setDecision(valid);
    setOpen(valid === null);
    setHydrated(true);

    const onManage = () => setOpen(true);
    window.addEventListener("ni:manage-consent", onManage);
    return () => window.removeEventListener("ni:manage-consent", onManage);
  }, []);

  const choose = (value: "granted" | "denied") => {
    localStorage.setItem(KEY, value);
    setOpen(false);
    // Retrait effectif : si le suivi était déjà actif et qu'on refuse, on recharge
    // pour ne plus charger/alimenter GA & Clarity.
    if (value === "denied" && typeof window.gtag === "function") {
      window.location.reload();
      return;
    }
    setDecision(value);
  };

  return (
    <>
      {hydrated && decision === "granted" && <AnalyticsScripts />}
      {hydrated && open && (
        <Banner
          isEn={isEn}
          onAccept={() => choose("granted")}
          onRefuse={() => choose("denied")}
        />
      )}
    </>
  );
}
