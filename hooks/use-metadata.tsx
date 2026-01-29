/**
 * Hook et utilitaires pour manipuler les métadonnées côté client
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Hook pour récupérer les métadonnées actuelles de la page
 */
export function useMetadata() {
  const pathname = usePathname();
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    image: string;
    url: string;
  }>({
    title: "",
    description: "",
    image: "",
    url: "",
  });

  useEffect(() => {
    // Récupérer le titre
    const titleTag = document.querySelector("title");
    const title = titleTag?.textContent || "";

    // Récupérer la description
    const descriptionTag = document.querySelector('meta[name="description"]');
    const description = descriptionTag?.getAttribute("content") || "";

    // Récupérer l'image OpenGraph
    const imageTag = document.querySelector('meta[property="og:image"]');
    const image = imageTag?.getAttribute("content") || "";

    // Récupérer l'URL canonique
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    const url = canonicalTag?.getAttribute("href") || window.location.href;

    setMetadata({ title, description, image, url });
  }, [pathname]);

  return metadata;
}

/**
 * Fonction pour partager sur les réseaux sociaux
 */
export function shareOnSocial(
  platform: "facebook" | "twitter" | "linkedin" | "whatsapp",
  options?: {
    url?: string;
    title?: string;
    description?: string;
  }
) {
  const url = options?.url || window.location.href;
  const title = options?.title || document.title;
  const description =
    options?.description ||
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") ||
    "";

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  };

  window.open(shareUrls[platform], "_blank", "width=600,height=400");
}

/**
 * Composant pour boutons de partage social
 */
interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  className?: string;
}

export function ShareButtons({
  title,
  description,
  url,
  className = "",
}: ShareButtonsProps) {
  const handleShare = (platform: "facebook" | "twitter" | "linkedin") => {
    shareOnSocial(platform, { url, title, description });
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
        title="Partager sur Facebook"
        aria-label="Partager sur Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition"
        title="Partager sur Twitter"
        aria-label="Partager sur Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </button>

      <button
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition"
        title="Partager sur LinkedIn"
        aria-label="Partager sur LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Composant pour copier l'URL de la page
 */
interface CopyLinkButtonProps {
  url?: string;
  className?: string;
}

export function CopyLinkButton({ url, className = "" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const urlToCopy = url || window.location.href;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition ${className}`}
      title={copied ? "Copié !" : "Copier le lien"}
      aria-label={copied ? "Lien copié" : "Copier le lien"}
    >
      {copied ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * Composant complet de partage avec tous les boutons
 */
interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  className?: string;
  showLabel?: boolean;
}

export function SocialShare({
  title,
  description,
  url,
  className = "",
  showLabel = true,
}: SocialShareProps) {
  return (
    <div className={className}>
      {showLabel && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Partager cet article :
        </p>
      )}
      <div className="flex items-center gap-2">
        <ShareButtons title={title} description={description} url={url} />
        <CopyLinkButton url={url} />
      </div>
    </div>
  );
}
