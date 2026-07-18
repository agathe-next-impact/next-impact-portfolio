"use client";

/**
 * Popup d'abonnement newsletter — affiché dans les résultats des outils.
 *
 * Auto-piloté : monté DANS le bloc de résultats d'un outil (donc rendu seulement
 * quand un résultat existe), il s'ouvre une fois après un court délai, laissant
 * d'abord voir le résultat (doctrine « prouver avant de demander »).
 *
 * Dédup :
 * - abonné  → localStorage, ne réapparaît jamais ;
 * - fermé   → sessionStorage, silencieux le reste de la session (revient plus tard).
 *
 * DS Blueprint, i18n inline, accessible (dialog modal, focus trap léger, Échap,
 * clic hors-carte), prefers-reduced-motion respecté via framer-motion.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowRight, Check, Loader2, Mail, X } from "lucide-react";
import { track } from "@/lib/track";

const LS_SUBSCRIBED = "ni:newsletter:subscribed";
const SS_DISMISSED = "ni:newsletter:dismissed";
const OPEN_DELAY_MS = 1400;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterModal({ source }: { source: string }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const reduce = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Portail dispo côté client uniquement.
  useEffect(() => setMounted(true), []);

  // Ouverture différée, une seule fois, sauf si déjà abonné / fermé cette session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(LS_SUBSCRIBED) === "1") return;
      if (sessionStorage.getItem(SS_DISMISSED) === "1") return;
    } catch {
      /* stockage indisponible → on tente quand même l'ouverture */
    }
    const t = window.setTimeout(() => {
      setOpen(true);
      track("newsletter_shown", { source });
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [source]);

  const close = useCallback((persist: "dismiss" | "none") => {
    if (persist === "dismiss") {
      try {
        sessionStorage.setItem(SS_DISMISSED, "1");
      } catch {
        /* noop */
      }
    }
    setOpen(false);
  }, []);

  // Gestion de l'ouverture : focus, verrou de scroll, Échap, focus trap léger.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 60);

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
      lastFocused.current?.focus?.();
    };
  }, [open, close]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem(LS_SUBSCRIBED, "1");
      } catch {
        /* noop */
      }
      track("newsletter_subscribe", { source });
      setStatus("success");
      window.setTimeout(() => close("none"), 2400);
    } catch {
      setStatus("error");
    }
  }

  if (!mounted) return null;

  const t = isEn
    ? {
        kicker: "Newsletter · Next Impact",
        title: "The right tech reflex, once a month",
        subtitle:
          "You just used a tool. Once a month, get one web & AI decision decoded plainly — no jargon, no spam.",
        placeholder: "you@example.com",
        submit: "Subscribe",
        fineprint: "Once a month. Unsubscribe in one click.",
        successTitle: "You're in — thanks!",
        successBody: "Check your inbox: a confirmation email is on its way.",
        error: "Oops, subscription failed. Try again in a moment.",
        close: "Close",
      }
    : {
        kicker: "Newsletter · Next Impact",
        title: "Le bon réflexe techno, une fois par mois",
        subtitle:
          "Vous venez d'utiliser un outil. Recevez, une fois par mois, une décision web & IA décryptée simplement — sans jargon, sans spam.",
        placeholder: "vous@exemple.com",
        submit: "Je m'abonne",
        fineprint: "Une fois par mois. Désinscription en un clic.",
        successTitle: "C'est noté, merci !",
        successBody: "Vérifiez votre boîte : un email de confirmation vient de partir.",
        error: "Oups, l'inscription a échoué. Réessayez dans un instant.",
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
            aria-labelledby="ni-newsletter-title"
            aria-describedby="ni-newsletter-desc"
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

            {status === "success" ? (
              <div className="flex flex-col items-start gap-3 py-2">
                <span className="flex h-10 w-10 items-center justify-center border border-vermilion text-vermilion">
                  <Check className="h-5 w-5" />
                </span>
                <h2 id="ni-newsletter-title" className="text-xl font-light tracking-tight text-foreground">
                  {t.successTitle}
                </h2>
                <p id="ni-newsletter-desc" className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {t.successBody}
                </p>
              </div>
            ) : (
              <>
                <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
                  <Mail className="h-3.5 w-3.5" />
                  {t.kicker}
                </p>
                <h2
                  id="ni-newsletter-title"
                  className="pr-8 text-xl font-light leading-tight tracking-tight text-foreground"
                >
                  {t.title}
                </h2>
                <p
                  id="ni-newsletter-desc"
                  className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray"
                >
                  {t.subtitle}
                </p>

                <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2.5" noValidate>
                  <label htmlFor="ni-newsletter-email" className="sr-only">
                    {t.placeholder}
                  </label>
                  <input
                    ref={inputRef}
                    id="ni-newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder={t.placeholder}
                    aria-invalid={status === "error"}
                    className="h-11 w-full border border-dark-gray bg-obsidian px-3.5 font-inter-tight text-sm text-foreground outline-none transition-colors placeholder:text-mid-gray focus:border-vermilion"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex h-11 w-full items-center justify-center gap-1.5 border border-vermilion bg-vermilion px-5 font-mono text-xs uppercase tracking-[0.06em] text-white transition-colors hover:bg-vermilion-bright disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t.submit}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  {status === "error" && (
                    <p role="alert" className="font-inter-tight text-[13px] text-vermilion">
                      {t.error}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                    {t.fineprint}
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
