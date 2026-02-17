"use client"

import React from "react"
import {
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaWhatsapp,
  FaShareAlt,
} from "react-icons/fa"

type ShareSocialProps = {
  url: string
  title?: string
  text?: string
  image?: string
  className?: string
}

function cleanText(t: string) {
  return t.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&rsquo;/g, "'").replace(/&#8211;/g, "");
}

const socialPlatforms = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    url: (u: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    url: (u: string, t?: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}${t ? `&title=${encodeURIComponent(cleanText(t))}` : ""}`,
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    url: (u: string, t?: string) => {
      const message = (t ? cleanText(t) + " " : "") + u;
      return `https://wa.me/?text=${encodeURIComponent(message)}`;
    },
  },
  {
    name: "Email",
    icon: FaEnvelope,
    url: (u: string, t?: string) =>
      `mailto:?subject=${encodeURIComponent(t ? cleanText(t) : "À découvrir")}&body=${encodeURIComponent(u)}`,
  },
]

export const ShareSocial: React.FC<ShareSocialProps> = ({
  url,
  title,
  text,
  image,
  className = "",
}) => {
  const BASE_URL = "https://next-impact.digital";
  // Handle relative URLs by prepending the base domain
  const fullUrl = url.startsWith("/") ? `${BASE_URL}${url}` : url.replace(/https?:\/\/[^/]+/g, BASE_URL).replace(/([^:]\/)\/+/g, "$1");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url(fullUrl, text || title, image)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${platform.name}`}
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
        >
          <platform.icon size={16} />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copier le lien"
        onClick={handleCopy}
        className={`rounded-full p-2 transition-colors ${copied ? "text-green-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}
        title={copied ? "Lien copié !" : "Copier le lien"}
      >
        <FaShareAlt size={16} />
      </button>
    </div>
  )
}

export default ShareSocial