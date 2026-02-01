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

const socialPlatforms = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    url: (u: string) => {
      const replacedUrl: string = u.replace(/https?:\/\/[^/]+/g, "https://next-impact.digital");
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(replacedUrl)}&redirect_uri=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "https://next-impact.digital")}`;
    },
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    url: (u: string, _t?: string) => {
      const replacedUrl = u.replace(/https?:\/\/[^/]+/g, "https://next-impact.digital").replace(/([^:]\/)\/+/g, "$1");
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(replacedUrl)}${
        _t ? `&title=${encodeURIComponent(_t.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&rsquo;/g, "'"))}` : ""
      }`
    },
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    url: (u: string, t?: string) => {
      const replacedUrl = u.replace(/https?:\/\/[^/]+/g, "https://next-impact.digital").replace(/([^:]\/)\/+/g, "$1");
      const message =
        (t
          ? t
              .replace(/<[^>]*>/g, "")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, '"')
              .replace(/&rsquo;/g, "'")
              .replace(/&#8211;/g, "") + " "
          : "") + replacedUrl
      return `https://wa.me/?text=${encodeURIComponent(message)}`
    },
  },
  {
    name: "Email",
    icon: FaEnvelope,
    url: (u: string, t?: string) => {
      const replacedUrl = u.replace(/https?:\/\/[^/]+/g, "https://next-impact.digital").replace(/([^:]\/)\/+/g, "$1");
      const subject = t
        ? t.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&rsquo;/g, "'")
        : "À découvrir"
      return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(replacedUrl)}`
    },
  },
]

export const ShareSocial: React.FC<ShareSocialProps> = ({
  url,
  title,
  text,
  image,
  className = "",
}) => {
  const replacedUrl = url.replace(/https?:\/\/[^/]+/g, "https://next-impact.digital").replace(/([^:]\/)\/+/g, "$1");
  return (
    <div className={`flex gap-2 ${className}`}>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url(replacedUrl, text || title, image)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${platform.name}`}
          className="text-extralightblue rounded-full p-2 transition-colors"
        >
          <platform.icon size={16} />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copier le lien"
        onClick={() => {
          if (typeof window !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(replacedUrl)
          }
        }}
        className="text-extralightblue rounded-full p-2 transition-colors"
        title="Copier le lien"
      >
        <FaShareAlt size={16} />
      </button>
    </div>
  )
}

export default ShareSocial