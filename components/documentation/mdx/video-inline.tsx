"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoInlineProps {
  url: string;
  title?: string;
  caption?: string;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/shorts\/([^&?/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoInline({ url, title, caption }: VideoInlineProps) {
  const [loaded, setLoaded] = useState(false);
  const videoId = extractYoutubeId(url);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <figure className="my-8">
      <div className="relative rounded-2xl overflow-hidden bg-darkblue aspect-video">
        {!loaded ? (
          <button
            onClick={() => setLoaded(true)}
            className="relative w-full h-full group"
            aria-label={title ? `Lire la vidéo : ${title}` : "Lire la vidéo"}
          >
            <img
              src={thumbnailUrl}
              alt={title || "Miniature vidéo"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-darkblue/40 group-hover:bg-darkblue/20 transition-colors flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-darkblue ml-1" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title || "Vidéo"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
      {(title || caption) && (
        <figcaption className="mt-3 text-center">
          {title && <p className="text-sm font-googletexte font-medium text-darkblue">{title}</p>}
          {caption && <p className="text-xs font-googletexte text-mediumblue/80 mt-0.5">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
