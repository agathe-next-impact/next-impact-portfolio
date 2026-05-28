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
  const fullUrl = url.startsWith("/") ? `${BASE_URL}${url}` : url.replace(/https?:\/\/[^/]+/g, BASE_URL).replace(/([^:]\/)\/+/g, "$1");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.75rem",
    height: "1.75rem",
    border: "1px solid var(--rule)",
    background: "var(--paper)",
    color: "var(--muted-color)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.15s, background 0.15s",
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url(fullUrl, text || title, image)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${platform.name}`}
          style={btnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--ink)";
            e.currentTarget.style.background = "var(--paper-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted-color)";
            e.currentTarget.style.background = "var(--paper)";
          }}
        >
          <platform.icon size={13} />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copier le lien"
        onClick={handleCopy}
        title={copied ? "Lien copié !" : "Copier le lien"}
        style={{
          ...btnStyle,
          color: copied ? "var(--accent-color)" : "var(--muted-color)",
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            e.currentTarget.style.color = "var(--ink)";
            e.currentTarget.style.background = "var(--paper-2)";
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            e.currentTarget.style.color = "var(--muted-color)";
            e.currentTarget.style.background = "var(--paper)";
          }
        }}
      >
        <FaShareAlt size={13} />
      </button>
    </div>
  )
}

export default ShareSocial
