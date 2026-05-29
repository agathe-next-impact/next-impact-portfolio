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
  const [thumbnailQuality, setThumbnailQuality] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault",
  );
  const id = videoId ?? (url ? getYoutubeId(url) : null);

  if (!id) return null;

  const isShort = aspect === "short";
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/${thumbnailQuality}.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;

  return (
    <div
      className={cn("group", className)}
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--rule)",
        background: "var(--ink)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: isShort ? "9 / 16" : "16 / 9",
        }}
      >
        {loaded ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              background: "#000",
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={`Lire la video : ${title}`}
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              width: "100%",
              height: "100%",
              padding: 0,
              border: 0,
              background: "var(--paper)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              onError={() => setThumbnailQuality("hqdefault")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: compact ? 12 : 18,
                right: compact ? 12 : 18,
                bottom: compact ? 12 : 18,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                alignItems: "center",
                gap: compact ? 10 : 14,
                minHeight: compact ? 44 : 56,
                background: "var(--paper)",
                border: "1px solid var(--ink)",
                boxShadow: "6px 6px 0 rgba(14, 14, 12, 0.22)",
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: compact ? 44 : 56,
                  height: compact ? 44 : 56,
                  background: "var(--accent-color)",
                  color: "var(--paper)",
                  borderRight: "1px solid var(--ink)",
                }}
              >
                <Play
                  aria-hidden="true"
                  size={compact ? 17 : 21}
                  fill="currentColor"
                  style={{ marginLeft: 2 }}
                />
              </span>
              <span style={{ minWidth: 0, paddingRight: compact ? 10 : 16 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--mono)",
                    fontSize: compact ? 8 : 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent-color)",
                    marginBottom: compact ? 1 : 3,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--serif)",
                    fontSize: compact ? 14 : 18,
                    lineHeight: 1.15,
                    color: "var(--ink)",
                  }}
                >
                  {title}
                </span>
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
