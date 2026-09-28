"use client";

import { useEffect, useState } from "react";
import { Check, CircleAlert, X } from "lucide-react";

// Voir `flash.ts`. Le cookie est effacé dès l'affichage : recharger la page ne
// redit pas une confirmation déjà lue. Le message reste six secondes (dix pour
// une erreur), ou jusqu'à la croix.

const COOKIE = "cto_flash";

export function FlashToast({ id, message, tone }: { id: string; message: string; tone: "succes" | "erreur" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.cookie = `${COOKIE}=; path=/; max-age=0; samesite=lax`;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), tone === "erreur" ? 10_000 : 6_000);
    return () => window.clearTimeout(t);
  }, [id, tone]);

  if (!visible) return null;
  const Icon = tone === "erreur" ? CircleAlert : Check;

  return (
    <div
      role={tone === "erreur" ? "alert" : "status"}
      className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 flex items-start gap-3 border border-dark-gray bg-jet px-4 py-3 font-inter-tight text-sm text-foreground shadow-2xl sm:inset-x-auto sm:right-6 sm:max-w-sm lg:bottom-6"
    >
      <Icon
        aria-hidden
        className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "erreur" ? "text-[#ff8a7a]" : "text-[#7fd8a4]"}`}
        strokeWidth={2}
      />
      <p className="min-w-0 flex-1 leading-snug">{message}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Fermer le message"
        className="-m-1 grid h-6 w-6 shrink-0 place-items-center text-mid-gray hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-secondary"
      >
        <X aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
