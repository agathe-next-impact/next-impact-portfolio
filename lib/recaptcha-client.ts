"use client";

// Jeton reCAPTCHA v3 côté navigateur.
//
// Le script Google n'est chargé qu'au premier envoi de formulaire, jamais au
// rendu : les pages publiques gardent leurs Core Web Vitals et aucune donnée
// ne part chez Google tant que le visiteur n'a rien soumis.
//
// Renvoie null si la clé publique manque ou si le script est bloqué ; la route
// serveur décide alors (lib/recaptcha.ts).

import type { RecaptchaAction } from "./recaptcha";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

let loader: Promise<Grecaptcha> | null = null;

function loadRecaptcha(siteKey: string): Promise<Grecaptcha> {
  if (window.grecaptcha?.execute) return Promise.resolve(window.grecaptcha);
  if (loader) return loader;

  loader = new Promise<Grecaptcha>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    const timer = window.setTimeout(() => reject(new Error("recaptcha timeout")), 10_000);
    script.onload = () => {
      window.clearTimeout(timer);
      const g = window.grecaptcha;
      if (g) g.ready(() => resolve(g));
      else reject(new Error("grecaptcha absent"));
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("recaptcha bloqué"));
    };
    document.head.appendChild(script);
  }).catch((err) => {
    loader = null; // autorise une nouvelle tentative au prochain envoi
    throw err;
  });

  return loader;
}

export async function getRecaptchaToken(action: RecaptchaAction): Promise<string | null> {
  if (!SITE_KEY || typeof window === "undefined") return null;
  try {
    const g = await loadRecaptcha(SITE_KEY);
    return await g.execute(SITE_KEY, { action });
  } catch (err) {
    console.warn("[recaptcha]", err);
    return null;
  }
}
