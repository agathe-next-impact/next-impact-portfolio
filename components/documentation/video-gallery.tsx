"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoEmbed } from "@/components/documentation/video-embed";
import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";

interface DemoVideo {
  id: string;
  url: string;
  title: string;
  description: string;
  projectLink?: string;
}

const videos: DemoVideo[] = [
  {
    id: "plateforme",
    url: "https://youtu.be/I1qi5o31Lnk",
    title: "Billeterie événementielle",
    description:
      "Présentation complète d'une plateforme de billeterie propulsée par WordPress Headless et Next.js.",
    projectLink: "/etudes-de-cas/next-event",
  },
  {
    id: "cdf",
    url: "https://youtu.be/6vUSbG6F50w",
    title: "Comme des Fous",
    description:
      "Le média participatif Comme des Fous, propulsé par WordPress Headless et Next.js.",
    projectLink: "/etudes-de-cas/comme-des-fous",
  },
  {
    id: "doleances",
    url: "https://youtu.be/_OjiGiOWJus",
    title: "Les Doléances",
    description:
      "Un site de promotion des doléances citoyennes avec WordPress Headless et Next.js.",
    projectLink: "/etudes-de-cas/doleances",
  },
  {
    id: "egc",
    url: "https://youtu.be/dJIndpLBm7o",
    title: "États Généraux Communaux",
    description:
      "Plateforme pour les États Généraux Communaux utilisant WordPress Headless et Next.js.",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
  },
  {
    id: "cdf-jeux",
    url: "https://youtu.be/SIj61ECS1Mo",
    title: "Comme des Fous — Jeux",
    description:
      "Section de jeux en ligne intégrée au site Comme des Fous, développée en headless.",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
  },
];

export function VideoGallery() {
  const [activeId, setActiveId] = useState(videos[0].id);
  const active = videos.find((v) => v.id === activeId)!;

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-2.5">
        <PlayCircle className="h-5 w-5 text-orange" />
        <h3 className="font-googletitre text-xl text-white font-medium">
          Démos vidéo
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main player */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VideoEmbed url={active.url} title={active.title} />
            </motion.div>
          </AnimatePresence>
          <div>
            <h4 className="font-googletitre text-lg font-medium text-white">
              {active.title}
            </h4>
            <p className="text-sm text-white/80 font-googletexte mt-1">
              {active.description}
            </p>
            {active.projectLink && (
              <a
                href={active.projectLink}
                className="inline-block mt-2 text-sm text-orange/70 hover:text-orange font-googletexte transition-colors"
              >
                Voir l&apos;étude de cas →
              </a>
            )}
          </div>
        </div>

        {/* Playlist */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-3">
            {videos.length} projets
          </p>
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setActiveId(video.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 border",
                activeId === video.id
                  ? "bg-regularblue/15 border-regularblue/30 text-white"
                  : "border-transparent text-white/80 hover:bg-darkblue/40 hover:text-white/80"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-mono",
                  activeId === video.id
                    ? "bg-orange/20 text-orange"
                    : "bg-darkblue/40 text-white/80"
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium font-googletexte truncate">
                  {video.title}
                </p>
                <p className="text-xs text-white/80 font-googletexte truncate">
                  {video.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
