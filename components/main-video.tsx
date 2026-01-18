import React from "react";

interface MainVideoProps {
  url: string;
  title: string;
  poster?: string;
  infoTitle?: string;
  infoDescription?: string;
  ctaText?: string;
  ctaLink?: string;
  websiteLink?: string;
}

function toYoutubeEmbed(url: string) {
  if (!url) return url;
  if (url.includes('youtube.com/embed/')) return url;
  const matchShort = url.match(/youtu\.be\/([\w-]+)/);
  if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
  const matchLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
  return url;
}


import { Button } from "@/components/ui/button";
import Link from "next/link";

const MainVideo: React.FC<MainVideoProps> = ({ url, title, poster, infoTitle, infoDescription, ctaText, ctaLink, websiteLink }) => {
  const isYoutube = url.includes('youtube') || url.includes('youtu.be');
  return (
    <div>
      <div className="relative aspect-video flex items-center justify-center">
        {isYoutube ? (
          <iframe
            src={toYoutubeEmbed(url) + '?autoplay=0&rel=0&modestbranding=1&enablejsapi=1'}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full border-0 rounded-2xl"
          />
        ) : (
          <video className="w-full h-full object-cover" poster={poster} loop muted playsInline controls>
            <source src={url} type="video/mp4" />
          </video>
        )}
      </div>
      {/* Info bar */}
      {(infoTitle || infoDescription || (ctaText && ctaLink) || websiteLink) && (
        <div className="p-6 bg-white/30 backdrop-blur-sm border border-regularblue/20 rounded-2xl mt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              {infoTitle && <h3 className="font-semibold text-2xl md:text-3xl text-foreground">{infoTitle}</h3>}
              {infoDescription && <p className="md:text-lg text-mediumble">{infoDescription}</p>}
              <div className="h-6" />
              {websiteLink && (
                <Link href={websiteLink} target="_blank" className="text-coral font-medium underline hover:text-coral/80 text-lg transition">
                  Visiter le site
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainVideo;
