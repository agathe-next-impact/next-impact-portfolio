"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

// Fondations du stack — la ligne « socle » au-dessus des outils IA.
// Variantes couleur / noires (pas les blanches). Les wordmarks larges
// (Next.js, Astro) sont réduits pour ne pas dominer la ligne.
const STACK_LOGOS: { src: string; alt: string; small?: boolean }[] = [
  { src: "/img/logo-wordpress-small.webp", alt: "WordPress" },
  { src: "/img/logo-nextjs.webp", alt: "Next.js", small: true },
  { src: "/img/logo-astro.png", alt: "Astro", small: true },
];

// Outils IA — preuve discrète, sous la ligne des fondations.
const AI_LOGOS = [
  { src: "/img/logos_technos/logo_claude.png", alt: "Claude" },
  { src: "/img/logos_technos/logo_openai.png", alt: "OpenAI" },
  { src: "/img/logos_technos/logo_lovable.png", alt: "Lovable" },
  { src: "/img/logos_technos/logo_bolt.webp", alt: "Bolt" },
  { src: "/img/logos_technos/logo_v0.webp", alt: "v0" },
];

/**
 * TechnoLogosStrip — technologies (WordPress / Next.js / Astro) sur une ligne
 * au-dessus des outils IA, placé sous le TL;DR sur la home. Gabarit Blueprint
 * (obsidian, 1200px, bordures dark-gray). Les logos clients, eux, vivent dans
 * le hero — la techno reste en preuve discrète, jamais en accroche.
 */
export function TechnoLogosStrip({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <div className={`bg-obsidian px-2.5 lg:px-0 ${className}`}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 border-x border-b border-dark-gray px-6 py-8 lg:px-8">
        {/* Une seule ligne en desktop : fondations du stack puis outils IA,
            séparés par un filet ; tous les logos à la même hauteur (h-6). */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {STACK_LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={96}
              height={24}
              className={`w-auto opacity-60 transition-opacity hover:opacity-90 ${
                logo.small ? "h-4" : "h-6"
              }`}
            />
          ))}
          <span aria-hidden className="hidden h-4 w-px bg-dark-gray lg:block" />
          {AI_LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={96}
              height={24}
              className="h-6 w-auto opacity-60 transition-opacity hover:opacity-90"
            />
          ))}
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
          {isEn
            ? "I frame the work, AI executes: architecture choices stay human."
            : "Je cadre, l'IA exécute : les choix d'architecture restent humains."}
        </span>
      </div>
    </div>
  );
}
