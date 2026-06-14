"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

// Vidéo hébergée localement (plus de dépendance YouTube / embed tiers).
const VIDEO_SRC = "/video/demo-next-event.mp4";
const POSTER = "/img/desktop-screen-next-event.jpg";

/**
 * HeroVideo — démonstration vidéo du héros : lecture automatique, en boucle, sans son.
 * Honore `prefers-reduced-motion` (doctrine a11y du design system Blueprint) : pas
 * d'autoplay, on affiche le poster + un bouton pour lancer la vidéo manuellement. Ratio
 * fixe (zéro CLS), cadre aux tokens Blueprint, et un bouton pause toujours accessible
 * (WCAG 2.2.2 — tout contenu auto en boucle de plus de 5 s doit pouvoir être mis en pause).
 */
export default function HeroVideo() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const title = isEn ? "Next Impact — project showcase" : "Next Impact — démonstration projet";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // L'autoplay est décidé côté client (matchMedia fiable) pour ne jamais démarrer la
  // vidéo si l'utilisateur préfère la motion réduite — donc pas d'attribut `autoPlay`.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) videoRef.current?.play().catch(() => {});
  }, []);

  const play = () => videoRef.current?.play().catch(() => {});
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-sm border border-dark-gray bg-obsidian">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={title}
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Affordance de lecture quand la vidéo est à l'arrêt (motion réduite, ou après pause). */}
        {!playing && (
          <button
            type="button"
            onClick={play}
            aria-label={isEn ? `Play video: ${title}` : `Lire la vidéo : ${title}`}
            className="absolute inset-0 grid place-items-center bg-obsidian/20 transition-colors hover:bg-obsidian/10"
          >
            <span className="grid h-14 w-14 place-items-center border border-charcoal bg-vermilion text-white transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none">
              <Play size={20} fill="currentColor" className="ml-0.5" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      {/* Bouton pause — accès clavier/lecteur d'écran à l'arrêt du contenu auto (WCAG 2.2.2). */}
      {playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={isEn ? "Pause video" : "Mettre la vidéo en pause"}
          className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 border border-dark-gray bg-obsidian/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground backdrop-blur-sm transition-colors hover:bg-jet"
        >
          <Pause size={11} aria-hidden="true" className="text-accent-secondary" />
          {isEn ? "Pause" : "Pause"}
        </button>
      )}
    </div>
  );
}
