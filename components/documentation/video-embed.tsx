"use client";

import { useState } from "react";
import { Play } from "lucide-react";

function toYoutubeId(url: string): string | null {
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return short[1];
  const long = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (long) return long[1];
  const embed = url.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embed) return embed[1];
  return null;
}

interface VideoEmbedProps {
  url: string;
  title: string;
  className?: string;
  compact?: boolean;
}

export function VideoEmbed({ url, title, className, compact = false }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const videoId = toYoutubeId(url);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
        {loaded ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, height: "100%", width: "100%", border: 0 }}
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            aria-label={`Lire : ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover" }}
              loading="lazy"
            />
            {/* Play button — carré Swiss */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "3rem",
                height: "3rem",
                background: "var(--paper)",
                border: "2px solid var(--ink)",
                transition: "background 0.15s",
              }}>
                <Play style={{ width: "1rem", height: "1rem", color: "var(--ink)", marginLeft: "0.125rem" }} />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Video card with info ──────────────────────────────────────────────────

interface VideoCardProps {
  url: string;
  title: string;
  description?: string;
  projectLink?: string;
  className?: string;
}

export function VideoCard({ url, title, description, projectLink, className }: VideoCardProps) {
  return (
    <div
      className={className}
      style={{ border: "1px solid var(--rule)", background: "var(--paper)", overflow: "hidden" }}
    >
      <VideoEmbed url={url} title={title} />
      <div style={{ padding: "1rem 1.25rem" }}>
        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "0.9375rem", fontWeight: 400, color: "var(--ink)", marginBottom: "0.25rem" }}>
          {title}
        </h4>
        {description && (
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", lineHeight: 1.5 }}>
            {description}
          </p>
        )}
        {projectLink && (
          <a
            href={projectLink}
            style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--accent-color)", textDecoration: "none", fontFamily: "var(--font-mono)" }}
          >
            Voir le projet →
          </a>
        )}
      </div>
    </div>
  );
}
