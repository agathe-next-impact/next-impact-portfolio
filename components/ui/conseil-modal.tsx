"use client";

/**
 * Popup de prise de rendez-vous « Visio conseil refonte » (150 €) —
 * affichée dans les résultats des outils. Remplace l'ancienne popup
 * d'abonnement newsletter.
 *
 * Auto-pilotée : montée DANS le bloc de résultats d'un outil (donc rendue
 * seulement quand un résultat existe), elle s'ouvre une fois après un court
 * délai, laissant d'abord voir le résultat (doctrine « prouver avant de
 * demander »).
 *
 * Dédup :
 * - a cliqué sur « réserver » → localStorage, ne réapparaît jamais ;
 * - fermée                     → sessionStorage, silencieuse le reste de la session.
 *
 * Le prix et le lien de réservation viennent de `lib/visio-conseil.ts` : jamais
 * dupliqués ici, pour qu'un changement d'offre se propage tout seul.
 *
 * DS Blueprint, i18n inline, accessible (dialog modal, focus trap léger, Échap,
 * clic hors-carte), prefers-reduced-motion respecté via framer-motion.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowRight, CalendarCheck, X } from "lucide-react";
import { track } from "@/lib/track";
import { EASE_OUT as EASE } from "@/lib/motion-tokens";
import { OFFERS } from "@/lib/visio-conseil";

const LS_BOOKED = "ni:conseil:booked";
const LS_DISMISS_COUNT = "ni:conseil:dismissCount";
const SS_AUTO_SHOWN = "ni:conseil:autoShown";
const OPEN_DELAY_MS = 1400;
const OPEN_EVENT = "ni:conseil:open";

/**
 * Plafond global, tous supports confondus : la popup vit maintenant sur
 * plusieurs surfaces (outils, tarifs, diagnostic, contenus de décision). Sans
 * compteur partagé, un même visiteur la reverrait à chaque page — utile
 * devient harcelant. Une seule ouverture automatique par session, et plus
 * aucune après MAX_DISMISSALS refus. Le déclenchement manuel reste exempté :
 * c'est le visiteur qui le provoque.
 */
const MAX_DISMISSALS = 3;

function autoOpenAllowed(): boolean {
  try {
    if (localStorage.getItem(LS_BOOKED) === "1") return false;
    if (sessionStorage.getItem(SS_AUTO_SHOWN) === "1") return false;
    const dismissed = Number(localStorage.getItem(LS_DISMISS_COUNT) ?? "0");
    if (Number.isFinite(dismissed) && dismissed >= MAX_DISMISSALS) return false;
  } catch {
    /* stockage indisponible → on autorise plutôt que de bloquer */
  }
  return true;
}

/** Offre d'entrée de la gamme conseil — le seul palier crédité. */
const OFFER = OFFERS.find((o) => o.id === "choix-techno-ia");
const TIER = OFFER?.tiers[0];

/**
 * Ouverture impérative, depuis n'importe où (ex. bouton « Refaire » d'un outil).
 * Contrairement à l'ouverture automatique, elle ignore la dédup : un clic
 * explicite doit toujours produire un effet visible.
 */
export function openConseilModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export default function ConseilModal({
  source,
  /**
   * Arme l'ouverture automatique différée. Passer l'état « un résultat existe »
   * de l'outil : la popup peut ainsi être montée en permanence (pour survivre au
   * reset du bouton « Refaire ») sans s'ouvrir avant qu'il y ait quelque chose à
   * montrer.
   */
  armed = true,
}: {
  source: string;
  armed?: boolean;
}) {
  const locale = useLocale();
  const isEn = locale === "en";
  const reduce = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Portail dispo côté client uniquement.
  useEffect(() => setMounted(true), []);

  // Ouverture impérative : toujours honorée, dédup ignorée.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOpen = () => {
      setOpen(true);
      track("conseil_modal_shown", { source, trigger: "manual" });
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [source]);

  // Ouverture automatique différée, sous plafond global. `armed` est piloté par
  // la surface : résultat d'outil affiché, grille tarifaire dépassée, article lu.
  useEffect(() => {
    if (typeof window === "undefined" || !armed) return;
    if (!autoOpenAllowed()) return;
    const t = window.setTimeout(() => {
      if (!autoOpenAllowed()) return;
      try {
        sessionStorage.setItem(SS_AUTO_SHOWN, "1");
      } catch {
        /* noop */
      }
      setOpen(true);
      track("conseil_modal_shown", { source, trigger: "auto" });
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [source, armed]);

  const close = useCallback((persist: "dismiss" | "none") => {
    if (persist === "dismiss") {
      try {
        const n = Number(localStorage.getItem(LS_DISMISS_COUNT) ?? "0");
        localStorage.setItem(
          LS_DISMISS_COUNT,
          String((Number.isFinite(n) ? n : 0) + 1),
        );
        sessionStorage.setItem(SS_AUTO_SHOWN, "1");
      } catch {
        /* noop */
      }
    }
    setOpen(false);
  }, []);

  // Gestion de l'ouverture : focus, verrou de scroll, Échap, focus trap léger.
  // Invariant : le cycle ouverture/fermeture ne doit JAMAIS déplacer le scroll
  // de la page (preventScroll sur les focus + restauration explicite de scrollY).
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    const prevScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(
      () => ctaRef.current?.focus({ preventScroll: true }),
      60,
    );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close("dismiss");
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (window.scrollY !== prevScrollY) {
        window.scrollTo({ top: prevScrollY, behavior: "instant" });
      }
      try {
        lastFocused.current?.focus?.({ preventScroll: true });
      } catch {
        lastFocused.current?.focus?.();
      }
    };
  }, [open, close]);

  function onBook() {
    try {
      localStorage.setItem(LS_BOOKED, "1");
    } catch {
      /* noop */
    }
    track("conseil_modal_click", { source });
    close("none");
  }

  // Sans offre ni lien de réservation, on n'affiche rien plutôt qu'un CTA mort.
  if (!mounted || !OFFER || !TIER?.calendlyUrl) return null;

  const price = TIER.price;
  const duration = isEn ? TIER.duration.en : TIER.duration.fr;

  const t = isEn
    ? {
        kicker: `Advisory call · ${price}`,
        title: "Unsure about the trajectory? Settle it in one hour.",
        subtitle:
          "Before committing a budget, book the redesign advisory call: a written opinion within 48h, stay, decouple or rebuild, plus the watch points on maintenance, cost and lock-in.",
        cta: `Book · ${price}`,
        fineprint: `${duration} video call · 100% deducted from a quote signed within 30 days`,
        secondary: "See the advisory offers",
        close: "Close",
      }
    : {
        kicker: `Visio conseil · ${price}`,
        title: "Un doute sur la trajectoire ? Tranchez en une heure.",
        subtitle:
          "Avant d'engager un budget, réservez la visio conseil refonte : un avis écrit sous 48 h, rester, découpler ou refonder, et les points de vigilance sur la maintenance, le coût et la dépendance.",
        cta: `Réserver · ${price}`,
        fineprint: `${duration} en visio · 100 % déduit d'un devis signé sous 30 jours`,
        secondary: "Voir les offres de conseil",
        close: "Fermer",
      };

  const overlayAnim = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const cardAnim = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 16 },
      };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          {...overlayAnim}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <button
            type="button"
            aria-label={t.close}
            onClick={() => close("dismiss")}
            className="absolute inset-0 h-full w-full cursor-default bg-obsidian/80 backdrop-blur-sm"
          />
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ni-conseil-title"
            aria-describedby="ni-conseil-desc"
            className="relative w-full max-w-md border border-dark-gray border-l-[3px] border-l-vermilion bg-jet p-6 shadow-2xl sm:p-8"
            {...cardAnim}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <button
              type="button"
              onClick={() => close("dismiss")}
              aria-label={t.close}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-transparent text-mid-gray transition-colors hover:border-dark-gray hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
              <CalendarCheck className="h-3.5 w-3.5" />
              {t.kicker}
            </p>
            <h2
              id="ni-conseil-title"
              className="pr-8 text-xl font-light leading-tight tracking-tight text-foreground"
            >
              {t.title}
            </h2>
            <p
              id="ni-conseil-desc"
              className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray"
            >
              {t.subtitle}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <a
                ref={ctaRef}
                href={TIER.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onBook}
                className="group flex h-11 w-full items-center justify-center gap-1.5 border border-accent-secondary bg-accent-secondary px-5 font-mono text-xs uppercase tracking-[0.06em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
              >
                {t.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={`/${locale === "en" ? "en/" : ""}conseil`}
                onClick={() => close("none")}
                className="flex h-11 w-full items-center justify-center border border-dark-gray px-5 font-mono text-xs uppercase tracking-[0.06em] text-mid-gray no-underline transition-colors hover:text-foreground"
              >
                {t.secondary}
              </a>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                {t.fineprint}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
