"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type YoutubePlayerProps = {
  url?: string;
  videoId?: string;
  title: string;
  aspect?: "video" | "short";
  className?: string;
  compact?: boolean;
  label?: string;
};

export function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([^&?/]+)/,
    /youtube\.com\/embed\/([^&?/]+)/,
    /youtube\.com\/watch\?v=([^&?/]+)/,
    /youtu\.be\/([^&?/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// YouTube ne génère pas toujours toutes les tailles de miniature (maxresdefault manque
// souvent, et renvoie alors un placeholder gris 120×90). On descend la qualité jusqu'à
// hqdefault, qui est toujours disponible.
const THUMBNAIL_QUALITIES = ["maxresdefault", "sddefault", "hqdefault"] as const;

export function YoutubePlayer({
  url,
  videoId,
  title,
  aspect = "video",
  className,
  compact = false,
  label = "Demo video",
}: YoutubePlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const [qualityIndex, setQualityIndex] = useState(0);
  const id = videoId ?? (url ? getYoutubeId(url) : null);

  if (!id) return null;

  const isShort = aspect === "short";
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/${THUMBNAIL_QUALITIES[qualityIndex]}.jpg`;
  const downgradeThumbnail = () =>
    setQualityIndex((index) => Math.min(index + 1, THUMBNAIL_QUALITIES.length - 1));
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;

  return (
    <div
      className={cn(
        "group relative overflow-hidden border border-dark-gray bg-obsidian",
        className,
      )}
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: isShort ? "9 / 16" : "16 / 9" }}
      >
        {loaded ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0 bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={`Lire la video : ${title}`}
            className="absolute inset-0 block h-full w-full cursor-pointer border-0 bg-jet p-0 text-left"
          >
            <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              onError={downgradeThumbnail}
              onLoad={(event) => {
                // YouTube renvoie un placeholder gris 120×90 quand la taille demandée n'existe pas
                if (event.currentTarget.naturalWidth <= 120) downgradeThumbnail();
              }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Voile discret au survol pour faire ressortir la vignette */}
            <span
              aria-hidden
              className="absolute inset-0 bg-obsidian/0 transition-colors duration-300 group-hover:bg-obsidian/20"
            />
            <span
              className={cn(
                "absolute grid items-center border border-charcoal bg-jet/90 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none",
                compact ? "inset-x-3 bottom-3 gap-2.5" : "inset-x-4 bottom-4 gap-3.5",
              )}
              style={{
                gridTemplateColumns: "auto 1fr",
                minHeight: compact ? 44 : 56,
              }}
            >
              <span
                className="grid place-items-center border-r border-charcoal bg-vermilion text-white"
                style={{
                  width: compact ? 44 : 56,
                  height: compact ? 44 : 56,
                }}
              >
                <Play
                  aria-hidden="true"
                  size={compact ? 17 : 21}
                  fill="currentColor"
                  className="ml-0.5"
                />
              </span>
              <span className="min-w-0" style={{ paddingRight: compact ? 10 : 16 }}>
                <span
                  className="block font-mono uppercase text-accent-secondary"
                  style={{
                    fontSize: compact ? 8 : 9,
                    letterSpacing: "0.1em",
                    marginBottom: compact ? 1 : 3,
                  }}
                >
                  {label}
                </span>
                <span
                  className="block overflow-hidden text-ellipsis whitespace-nowrap font-sans text-foreground"
                  style={{
                    fontSize: compact ? 14 : 18,
                    lineHeight: 1.15,
                  }}
                >
                  {title}
                </span>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
