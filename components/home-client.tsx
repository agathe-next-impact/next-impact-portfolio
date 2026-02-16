"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

// Dynamic imports pour les composants lourds
const Hero = dynamic(() => import("@/components/hero"), {
  loading: () => <div className="min-h-screen" />
});

const ExpandableCardDemo = dynamic(() => import("./expandable-cards").then(mod => ({ default: mod.ExpandableCardDemo })), {
  loading: () => <div className="min-h-[400px]" />
});


function toYoutubeEmbed(url: string) {
  if (!url) return url;
  // Si déjà embed
  if (url.includes('youtube.com/embed/')) return url;
  // youtu.be short link
  const matchShort = url.match(/youtu\.be\/([\w-]+)/);
  if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
  // youtube.com/watch?v=...
  const matchLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
  return url;
}

export default function HomeClient() {
  const [isHovered, setIsHovered] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const mainVideo = {
    title: "Présentation complète de la plateforme",
    url: "https://youtu.be/I1qi5o31Lnk?si=3wismwIKR4UXIy7o",
    websiteLink: "https://next-event.fr",
  };      


  const handlePlayVideo = () => {
    setPlayVideo(true);
  };

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Whats's Headless Section */}
        <ExpandableCardDemo />

        
      </main>
    </>
  );
}
