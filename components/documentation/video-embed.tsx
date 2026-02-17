"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function VideoEmbed({
  url,
  title,
  className,
  compact = false,
}: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const videoId = toYoutubeId(url);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-lightblue/10 bg-darkblue/60",
        className
      )}
    >
      <div
        className="relative w-full"
        style={{ paddingTop: compact ? "56.25%" : "56.25%" }}
      >
        {loaded ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 h-full w-full group cursor-pointer"
            aria-label={`Lire : ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-darkblue/40 group-hover:bg-darkblue/20 transition-colors duration-300" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <Play className="h-6 w-6 text-white ml-0.5" />
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

export function VideoCard({
  url,
  title,
  description,
  projectLink,
  className,
}: VideoCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      <VideoEmbed url={url} title={title} />
      <div className="p-4 md:p-5">
        <h4 className="font-googletitre text-sm font-medium text-white mb-1">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-white/80 font-googletexte line-clamp-2">
            {description}
          </p>
        )}
        {projectLink && (
          <a
            href={projectLink}
            className="inline-block mt-2 text-xs text-orange/70 hover:text-orange font-googletexte transition-colors"
          >
            Voir le projet →
          </a>
        )}
      </div>
    </div>
  );
}
